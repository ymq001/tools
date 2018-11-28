var zMap = window.zMap = zMap || {};

(function (factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (zMap.MarkerDiffuse = factory());
}((function () {
    'use strict';

    //定义一个自定义的覆盖物对象的构造函数
    function CanvasLayer(options) {
        this.options = options || {};
        this.paneName = this.options.paneName || 'labelPane';
        this.zIndex = this.options.zIndex || 0;
        this._map = options.map;
        this._lastDrawTime = null;
        this.show();
    }

    //继承 BMap.Overlay
    CanvasLayer.prototype = new BMap.Overlay();

    //自定义覆盖物初始化函数 【自定义Overlay必须实现函数】
    CanvasLayer.prototype.initialize = function (map) {
        this._map = map;
        var canvas = this.canvas = document.createElement('canvas');
        var ctx = this.ctx = this.canvas.getContext('2d');
        canvas.style.cssText = 'position:absolute;' + 'left:0;' + 'top:0;' + 'z-index:' + this.zIndex + ';';
        this.adjustSize();
        this.adjustRatio(ctx);
        map.getPanes()[this.paneName].appendChild(canvas);
        var that = this;
        map.addEventListener('resize', function () {
            that.adjustSize();
            that._draw();
        });
        return this.canvas;
    };

    //设置canvas宽高
    CanvasLayer.prototype.adjustSize = function () {
        var size = this._map.getSize();
        var canvas = this.canvas;
        canvas.width = size.width;
        canvas.height = size.height;
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
    };

    //设置canvas绘图缩放比例，根据设备像素比例及canvas自身的像素比例设定canvas缩放，使其显示更加清晰
    CanvasLayer.prototype.adjustRatio = function (ctx) {
        var backingStore = ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
        var pixelRatio = (window.devicePixelRatio || 1) / backingStore;
        var canvasWidth = ctx.canvas.width;
        var canvasHeight = ctx.canvas.height;
        ctx.canvas.width = canvasWidth * pixelRatio;
        ctx.canvas.height = canvasHeight * pixelRatio;
        ctx.canvas.style.width = canvasWidth + 'px';
        ctx.canvas.style.height = canvasHeight + 'px';
        ctx.scale(pixelRatio, pixelRatio);
    };

    //绘制自定义覆盖物函数 【自定义Overlay必须实现函数】
    CanvasLayer.prototype.draw = function () {
        var self = this;
        var args = arguments;

        clearTimeout(self.timeoutID);
        self.timeoutID = setTimeout(function () {
            self._draw();
        }, 15);
    };

    //真正绘制自定义覆盖物的函数 由 (new CanvasLayer()).draw 调用
    CanvasLayer.prototype._draw = function () {
        var map = this._map;
        var size = map.getSize();
        var center = map.getCenter();
        if (center) {
            var pixel = map.pointToOverlayPixel(center);
            this.canvas.style.left = pixel.x - size.width / 2 + 'px';
            this.canvas.style.top = pixel.y - size.height / 2 + 'px';
            this.dispatchEvent('draw');
            this.options.update && this.options.update.call(this);
        }
    };

    //自定义实例函数，返回当前canvas对象
    CanvasLayer.prototype.getContainer = function () {
        return this.canvas;
    };

    //显示自定义覆盖物 【自定义Overlay必须实现函数】
    CanvasLayer.prototype.show = function () {
        if (!this.canvas) {
            this._map.addOverlay(this);
        }
        this.canvas.style.display = 'block';
    };

    //隐藏自定义覆盖物 【自定义Overlay必须实现函数】
    CanvasLayer.prototype.hide = function () {
        this.canvas.style.display = 'none';
        //this._map.removeOverlay(this);
    };

    //自定义实例函数，设置当前canvas的zIndex
    CanvasLayer.prototype.setZIndex = function (zIndex) {
        this.canvas.style.zIndex = zIndex;
    };

    //自定义实例函数，获取当前canvas的zIndex
    CanvasLayer.prototype.getZIndex = function () {
        return this.zIndex;
    };

    //global对象，用于高效实现定时绘图
    var global = typeof window === 'undefined' ? {} : window;

    global.requestAnimationFrame = global.requestAnimationFrame || global.mozRequestAnimationFrame || global.webkitRequestAnimationFrame || global.msRequestAnimationFrame || function (callback) {
        return global.setTimeout(callback, 1000 / 60);
    };
    global.cancelAnimationFrame = global.cancelAnimationFrame || global.mozCancelAnimationFrame || global.webkitCancelAnimationFrame || global.msCancelAnimationFrame || function (handle) {
        return clearTimeout(handle);
    };

    //定义标注点位初始化函数
    function Marker(opts) {
        this.city = opts.name;
        this.location = new BMap.Point(opts.lnglat[0], opts.lnglat[1]);
        this.color = opts.color || "#f00";
        this.type = opts.type || 'circle';
        this.speed = opts.speed || 0.15;
        this.size = 0;
        this.max = opts.max || 20;
    }

    //定义标注点位绘制函数 实例化函数
    Marker.prototype.draw = function (context) {
        context.save();
        context.beginPath();
        switch (this.type) {
            case 'circle':
                this._drawCircle(context);
                break;
            case 'ellipse':
                this._drawEllipse(context);
                break;
            default:
                break;
        }
        context.closePath();
        context.restore();

        this.size += this.speed;
        if (this.size > this.max) {
            this.size = 0;
        }
    };

    //绘制圆形标注函数 
    Marker.prototype._drawCircle = function (context) {
        var pixel = this.pixel || map.pointToPixel(this.location);
        context.strokeStyle = this.color;
        //context.moveTo(pixel.x + this.size, pixel.y);
        context.arc(pixel.x, pixel.y, this.size, 0, Math.PI * 2);
        context.stroke();
    };

    //绘制椭圆标注函数
    Marker.prototype._drawEllipse = function (context) {
        var pixel = this.pixel || map.pointToPixel(this.location);
        var x = pixel.x,
            y = pixel.y,
            w = this.size,
            h = this.size / 2,
            kappa = 0.5522848,

            // control point offset horizontal
            ox = w / 2 * kappa,

            // control point offset vertical
            oy = h / 2 * kappa,

            // x-start
            xs = x - w / 2,

            // y-start
            ys = y - h / 2,

            // x-end
            xe = x + w / 2,

            // y-end
            ye = y + h / 2;

        context.strokeStyle = this.color;
        //context.moveTo(xs, y);
        context.bezierCurveTo(xs, y - oy, x - ox, ys, x, ys);
        context.bezierCurveTo(x + ox, ys, xe, y - oy, xe, y);
        context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
        context.bezierCurveTo(x - ox, ye, xs, y + oy, xs, y);
        context.stroke();
    };

    //真正暴露在外的对象 
    var MarkerDiffuse = function(map, data) {
        //函数内部全局变量
        this._map = map;
        this._data = data;
        this.animationLayer = null;
        this.requestMaxId = 0;
        this.width = this._map.getSize().width;
        this.height = this._map.getSize().height;
        this.animationFlag = true;
        this.markers = [];
    }

    MarkerDiffuse.prototype.addMarker = function () {
        if (this.markers.length > 0) return;
        this.markers = [];
        for (var i = 0; i < this._data.length; i++) {
            this.markers.push(new Marker(this._data[i]));
        }
    }

    MarkerDiffuse.prototype.render = function () {
        var _markerDiffuse = MarkerDiffuse._markerDiffuse;
        var animationCtx = _markerDiffuse.animationLayer.canvas.getContext('2d');
        if (!animationCtx) {
            return;
        }

        if (!_markerDiffuse.animationFlag) {
            animationCtx.clearRect(0, 0, _markerDiffuse.width, _markerDiffuse.height);
            return;
        }

        _markerDiffuse.addMarker();

        animationCtx.fillStyle = 'rgba(0,0,0,.95)';
        var prev = animationCtx.globalCompositeOperation;
        animationCtx.globalCompositeOperation = 'destination-in';
        animationCtx.fillRect(0, 0, _markerDiffuse.width, _markerDiffuse.height);
        animationCtx.globalCompositeOperation = prev;

        for (var i = 0; i < _markerDiffuse.markers.length; i++) {
            var marker = _markerDiffuse.markers[i];
            marker.draw(animationCtx);
        }
    }

    //鼠标事件
    MarkerDiffuse.prototype.eventInteract = function () {
        this._map.addEventListener('movestart', function () {
            this.animationFlag = false;
        });

        this._map.addEventListener('moveend', function () {
            this.animationFlag = true;
            this.markers = []; //解决拖动后多余的小圆点bug，没想明白，暂时这样
        });

        this._map.addEventListener('zoomstart', function () {
            this.animationFlag = false;
        });

        this._map.addEventListener('zoomend', function () {
            this.animationFlag = true;
            this.markers = [];
        });

        this._map.addEventListener('resize', function () {
            this.animationFlag = false;
            this.markers = [];
            this.startAnimation();
        });
    }

    MarkerDiffuse.prototype.initialize = function () {

        this.animationLayer = new CanvasLayer({
            map: this._map,
            update: this.render
        });

        this.eventInteract();

        MarkerDiffuse._markerDiffuse = this; //缓存markerDiffuse 对象

        (function drawFrame() {
            if (MarkerDiffuse._markerDiffuse.animationFlag) {
                MarkerDiffuse._markerDiffuse.requestMaxId = requestAnimationFrame(drawFrame);
                MarkerDiffuse._markerDiffuse.render();
            }
            else {
                MarkerDiffuse._markerDiffuse.markers = [];
                MarkerDiffuse._markerDiffuse.animationLayer.hide();
            }
        })();
    }

    MarkerDiffuse.prototype.cancelAnimation = function () {
        this.animationFlag = false;
    }

    MarkerDiffuse.prototype.startAnimation = function () {
        //这里做个预判,如果已经开启动画,则继续执行已有的动画
        if (this.animationFlag)
            return;
        this.animationFlag = true;
        this.initialize();
    }

    MarkerDiffuse.prototype.setOptions = function (data) {
        this.markers = [];
        this._data = data;
        this.startAnimation();
    }

    
    return MarkerDiffuse;

})));
