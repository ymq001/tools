(function (utils) {
  utils.map = utils.map = utils.map || {};


  /*** utils.map.RManager 代码开始 ***/
  /**
   * utils.map.RManager类的构造函数
   * @class
   * @alias utils.map.RManager
   * @classdesc utils.map.RManager
   * @description 自定义点聚合，实现按组织聚合的效果。 {@link http://172.26.1.40/docs/examples/rmanager.html|RManager示例} <br />
   * 实现缓存机制，首屏只加载可视区域内的覆盖物 <br />
   * 实现根据自定义属性过滤覆盖物效果 <br />
   * 实现根据预设的覆盖物缩放级别范围显隐覆盖物
   * 
   * @constructor
   * 
   * @property {BMap.Map} _map 百度地图BMap的实例
   * @property {Array} _overlays 需要被管理起来的overlay列表
   * @property {Boolean} _visible 控制显隐所有覆盖物，默认false 不显示所有的覆盖物
   * @property {Function} _filter 数据过滤函数，默认不做处理，直接返回 true
   * @property {Number} padding 可视区域的外填充，默认 0
   * @property {Number} minZoom 地图最大缩放级别，默认 6
   * @property {Number} maxZoom 地图最小缩放级别，默认 16
   * 
   * @param {BMap.Map} map 百度地图BMap的实例
   * @param {Json} opts 可选参数,非必要选项
   * @param {Number} opts.padding 可视区域的外填充，默认 0
   * @param {Number} opts.minZoom 地图最大缩放级别，默认 6
   * @param {Number} opts.maxZoom 地图最小缩放级别，默认 16
   * @param {Function} opts.filter 数据过滤函数，必须返回boolean类型的值
   * 
   * @return {Boolean}
   * 
   * @example 参考示例：
   * var map = new BMap.Map("container");
   * map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);
   * var rmanager = new utils.map.RManager(map, {
   *  padding: 50,
   *  minZoom: 8,
   *  maxZoom: 16
   * });
   */
  utils.map.RManager = function (map, opts) {
    if (!(map instanceof BMap.Map)) {
      console.warn('请传递正确的BMap的实例');
      return false;
    }
    opts = opts || {};

    this._map = utils.map.default._map = map;
    this.padding = utils.map.tools.isNumber(opts.padding) ? opts.padding : 0;
    this.minZoom = utils.map.tools.isNumber(opts.minZoom) ? opts.minZoom : 6;
    this.maxZoom = utils.map.tools.isNumber(opts.maxZoom) ? opts.maxZoom : 16;
    this._filter = utils.map.tools.isFunction(opts.filter) ? opts.filter : function () { return true; };
    this._overlays = [];  //用于存放overlay列表
    this._visible = false;//控制显隐所有覆盖物

    //注册拖拽和缩放事件
    var _this = this;
    this._map.addEventListener('zoomend', function () {
      _this.show();
    });
    this._map.addEventListener('dragend', function () {
      _this.show();
    });
    return true;
  }
  /**
   * 添加单个overlay(覆盖物)
   * @param {BMap.Overlay} overlay 需要添加到地图上的覆盖物
   * @param {Json} opts 必要参数
   * @param {Number} opts.minZoom 必要参数 覆盖物可以被显示的地图最小缩放级别，默认取地图最小缩放级别
   * @param {Number} opts.maxZoom 必要参数 覆盖物可以被现实的地图最大缩放级别，默认取地图最大缩放级别
   * @return {Boolean}
   */
  utils.map.RManager.prototype.addOverlay = function (overlay, opts) {
    if (!(overlay instanceof BMap.Overlay)) {
      console.warn('请传递正确的覆盖物实例对象');
      return false;
    }

    opts = opts || {};
    overlay.attrs = overlay.attrs || {};
    overlay.attrs.minZoom = overlay._opts.attrs.minZoom = utils.map.tools.isNumber(opts.minZoom) ? opts.minZoom : (overlay._opts.attrs.minZoom || this.minZoom);
    overlay.attrs.maxZoom = overlay._opts.attrs.maxZoom = utils.map.tools.isNumber(opts.maxZoom) ? opts.maxZoom : (overlay._opts.attrs.maxZoom || this.maxZoom);
    overlay.attrs._isAdded = false;     //当前覆盖物是否已经添加到地图上
    overlay.attrs._isVisible = false;   //当前覆盖物是否被显示
    overlay.attrs._isInViewing = false; //当前覆盖物位置是否在可视区域内

    this._overlays.push(overlay);
    return true;
  }
  /**
   * 批量添加相同缩放级别范围中的overlay(覆盖物)
   * @param {Array<BMap.Overlay>} overlays 需要添加到地图上的覆盖物列表
   * @param {Json} opts 必要参数
   * @param {Number} opts.minZoom 必要参数 覆盖物可以被显示的地图最小缩放级别，默认取地图最小缩放级别
   * @param {Number} opts.maxZoom 必要参数 覆盖物可以被现实的地图最大缩放级别，默认取地图最大缩放级别
   */
  utils.map.RManager.prototype.addOverlays = function (overlays, opts) {
    if (overlays instanceof Array) {
      for (var i = 0, _overlay; _overlay = overlays[i]; i++) {
        this.addOverlay(_overlay, opts);
      }
      this.show();
    }
  }
  /**
   * 批量添加相同缩放级别范围中的overlay(覆盖物)  --- 测试阶段
   * @param {Array} list 需要添加到地图上的覆盖物数据列表
   * @param {Number} list.x RMarker坐标 经度
   * @param {Number} list.y RMarker坐标 纬度
   * @param {Json|String|HTMLElement} list.content 自定义marker内容，可以是Json对象( eg: {url: {String}, size: {BMap.Size}} )，可以是字符串，也可以是dom节点
   * @param {String} list.content.url marker背景图标链接
   * @param {BMap.Size} list.content.size marker背景图标大小
   * @param {BMap.Size} list.anchor Marker的的位置偏移值
   * @param {Boolean} list.enableDragging 是否启用拖拽，默认为false
   * @param {Boolean} list.isShowText 是否显示marker名称，默认为true
   * @param {Boolean} list.isShowCount 是否显示marker角标，默认为false
   * @param {Boolean} list.count marker角标，可以是数字，也可以是文本
   * @param {String} list.text marker名称
   * @param {Json} list.countTheme 角标主题色
   * @param {String} list.countTheme.bgColor 浏览器可以识别的颜色值，默认半透明黑色
   * @param {String} list.countTheme.color 浏览器可以识别的颜色值，默认白色
   * @param {Json} list.textTheme marker名称主题色
   * @param {String} list.textTheme.bgColor 浏览器可以识别的颜色值，默认半透明黑色
   * @param {String} list.textTheme.color 浏览器可以识别的颜色值，默认白色
   * @param {Json} list.attrs 存放自定义属性
   * 
   * @param {Json} opts 必要参数
   * @param {Number} opts.minZoom 必要参数 覆盖物可以被显示的地图最小缩放级别，默认取地图最小缩放级别
   * @param {Number} opts.maxZoom 必要参数 覆盖物可以被现实的地图最大缩放级别，默认取地图最大缩放级别
   */
  utils.map.RManager.prototype.addOverlaysFromList = function (list, opts) {
    if (list instanceof Array) {
      for (var i = 0, _item, _overlay; _item = list[i]; i++) {
        var _opts = utils.extend(true, {});
        _overlay = new utils.map.RMarker(new BMap.Point(_item.x, _item.y), _item.content, {
          anchor: _item.anchor,
          enableDragging: _item.enableDragging,
          isShowText: _item.isShowText,
          isShowCount: _item.isShowCount,
          count: _item.count,
          text: _item.text,
          countTheme: _item.countTheme,
          textTheme: _item.textTheme,
          attrs: _item.attrs
        });
        this.addOverlay(_overlay, opts);
      }
      this.show();
    }
  }
  /**
   * 移除单个覆盖物，不管覆盖物是否在可视区域内
   * <span style="color:red">此方法执行后覆盖物将从dom文档中删除 </span>
   * @param {BMap.Overlay} overlay 需要被移除的覆盖物
   * @return {Boolean} 
   */
  utils.map.RManager.prototype.removerOverlay = function (overlay) {
    if (!(overlay instanceof BMap.Overlay)) {
      console.warn('请传递正确的覆盖物实例对象');
      return false;
    }
    this._map.removerOverlay(overlay);    //移除地图上的覆盖物
    this._removeOverlayFromList(overlay); //移除缓存的覆盖物列表中的覆盖物
    return true;
  }
  /**
   * 批量移除overlay(覆盖物)，不管覆盖物是否在可视区域内
   * <span style="color:red">此方法执行后覆盖物将从dom文档中删除 </span>
   * @param {Array<BMap.Overlay>} overlays 需要被移除的覆盖物列表
   */
  utils.map.RManager.prototype.removeOverlays = function (overlays) {
    if (overlays instanceof Array) {
      for (var i = 0, _overlay; _overlay = overlays[i]; i++) {
        this.removerOverlay(_overlay);
      }
    }
  }
  /**
   * 移除可视区域内单个覆盖物
   * 若覆盖物不再可视区域内,则不执行移除方法
   * <span style="color:red">此方法执行后覆盖物将从dom文档中删除 </span>
   * @param {BMap.Overlay} overlay 需要被移除的覆盖物
   * @return {Boolean} 
   */
  utils.map.RManager.prototype.removeViewingOverlay = function (overlay) {
    if (!(overlay instanceof BMap.Overlay)) {
      console.warn('请传递正确的覆盖物实例对象');
      return false;
    }
    if (!overlay.attrs._isInViewing) return false; //当前覆盖物不再可视区域内,直接返回false
    this._map.removerOverlay(overlay);    //移除地图上的覆盖物
    this._removeOverlayFromList(overlay); //移除缓存的覆盖物列表中的覆盖物
    return true;
  }
  /**
   * 批量可视区域内覆盖物
   * 若覆盖物列表中的覆盖物不在可视区域内，则不执行移除方法
   * <span style="color:red">此方法执行后覆盖物将从dom文档中删除 </span>
   * @param {Array<BMap.Overlay>} overlays 需要被移除的覆盖物列表
   */
  utils.map.RManager.prototype.removeViewingOverlays = function (overlays) {
    if (overlays instanceof Array) {
      for (var i = 0, _overlay; _overlay = overlays[i]; i++) {
        this.removeViewingOverlay(_overlay);
      }
    }
  }
  /**
   * 清除所有覆盖物
   */
  utils.map.RManager.prototype.clearOverlays = function () {
    for (var i = 0, _overlay; _overlay = this._overlays[i]; i++) {
      this._map.removeOverlays(_overlay);
    }
    this._overlays = [];
  }
  /**
   * 清除可视区域内所有覆盖物
   */
  utils.map.RManager.prototype.clearViewingOverlays = function () {
    var _overlaylist = [];
    for (var i = 0, _overlay; _overlay = this._overlays[i]; i++) {
      if (_overlay.attrs._isInViewing) {
        this._map.removeOverlays(_overlay);
      } else {
        _overlaylist.push(_overlay);
      }
    }
    this._overlays = _overlaylist;
  }
  /**
   * 从覆盖物缓存列表中移除指定的覆盖物
   * @private
   * @param {BMap.Overlay} overlay 需要被移除的覆盖物
   */
  utils.map.RManager.prototype._removeOverlayFromList = function (overlay) {
    for (var i = this._overlays.length - 1; i > 0; i--) {
      if (this._overlays[i] === overlay) {
        this._overlays.splice(i, 1);
        break;
      }
    }
  }
  /**
   * 获取可视范围内的覆盖物列表
   * @param {Number} zoom 需要检测的地图缩放级别
   * @return {Array} 返回当前缩放级别下可视区域内的覆盖物列表
   */
  utils.map.RManager.prototype.getViewingOverlaysByZoom = function (zoom) {
    var _overlaylist = [];
    if (this._visible) {
      for (var i = 0, _overlay; _overlay = this._overlays[i]; i++) {
        if (_overlay.attrs._isInViewing && _overlay.attrs.minZoom <= zoom && _overlay.attrs.maxZoom >= zoom) {
          _overlaylist.push(_overlay);
        }
      }
    }
    return _overlaylist;
  }
  /**
   * 显示可视区内覆盖物
   * 此方法通过操作元素display属性实现显隐的目的
   * @param {Function} filter 可选，过滤覆盖物的函数钩子，必须返回boolean类型的值，默认为RManager的属性_filter
   */
  utils.map.RManager.prototype.show = function (filter) {
    filter = utils.map.tools.isFunction(filter) ? filter : this._filter;
    this._visible = true;
    this._toggleOverlays(filter);
  }
  /**
   * 隐藏可视区内覆盖物
   * 此方法通过操作元素display属性实现显隐的目的
   * @param {Function} filter 可选，过滤覆盖物的函数钩子，必须返回boolean类型的值，默认为RManager的属性_filter
   */
  utils.map.RManager.prototype.hide = function (filter) {
    filter = utils.map.tools.isFunction(filter) ? filter : this._filter;
    this._visible = false;
    this._toggleOverlays(filter);
  }
  /**
   * 切换可视区内覆盖物的显隐
   * 此方法通过操作元素display属性实现显隐的目的
   * @param {Function} filter 可选，过滤覆盖物的函数钩子，必须返回boolean类型的值，默认为RManager的属性_filter
   */
  utils.map.RManager.prototype.toggle = function (filter) {
    this._visible ? this.hide(filter) : this.show(filter);
  }
  /**
   * 切换显隐覆盖物
   * @private
   * @param {Function} filter 可选，过滤覆盖物的函数钩子，必须返回boolean类型的值，默认为RManager的属性_filter
   */
  utils.map.RManager.prototype._toggleOverlays = function (filter) {
    var _this = this;
    var _zoom = this._map.getZoom();
    var _bounds = this._getRealBounds();
    filter = utils.map.tools.isFunction(filter) ? filter : this._filter;
    setTimeout(function () {
      for (var i = 0, _overlay; _overlay = _this._overlays[i]; i++) {
        _overlay.attrs._isAdded = !!_overlay.attrs._isAdded;
        //判断是否在可视区域内  &&  判断当前缩放级别是否符合覆盖物的缩放级别显示范围
        if (_bounds.containsPoint(_overlay.getPosition()) && _zoom >= _overlay.attrs.minZoom && _zoom <= _overlay.attrs.maxZoom) {
          _overlay.attrs._isInViewing = true;
          if (!_overlay.attrs._isAdded) {
            _this._map.addOverlay(_overlay);
            _overlay.attrs._isAdded = true;
            !_this._visible && _overlay.hide();
          } else {
            if (filter(_overlay)) {
              if (_overlay.attrs._isVisible == false && _this._visible == true) {
                _overlay.show();
                _overlay.attrs._isVisible == true;
              } else if (_overlay.attrs._isVisible == true && _this._visible == false) {
                _overlay.hide();
                _overlay.attrs._isVisible == false;
              }
              //_this._visible ? _overlay.show() : _overlay.hide();
            } else {
              _overlay.attrs._isVisible == false;
              _overlay.hide();
            }
          }
        } else if (_overlay.attrs._isAdded) {
          _overlay.attrs._isInViewing = false;
          _overlay.attrs._isVisible == false;
          _overlay.hide();
        }
      }
    }, 0);
  }
  /**
   * 获取真实的可视区域范围
   * @private
   * @return {BMap.Bounds}
   */
  utils.map.RManager.prototype._getRealBounds = function () {
    var _bounds = this._map.getBounds();
    var _sw = this._map.pointToPixel(_bounds.getSouthWest());
    var _ne = this._map.pointToPixel(_bounds.getNorthEast());
    return new BMap.Bounds(
      this._map.pixelToPoint({
        x: _sw.x - this.padding,
        y: _sw.y + this.padding
      }),
      this._map.pixelToPoint({
        x: _ne.x + this.padding,
        y: _ne.y - this.padding
      })
    );
  }
  /**
   * 获取指定属性与之匹配的覆盖物
   * @param {String|Number} value 需要查找的指定属性值
   * @param {String} key 可选，需要查找的指定属性，默认为 id
   * @return {BMap.Overlay|undefined}
   */
  utils.map.RManager.prototype.getOverlayBykey = function (value, key) {
    var returns = undefined;
    if (!utils.map.tools.isString(key)) key = 'id';
    for (var i = 0, _overlay; _overlay = this._overlays[i]; i++) {
      if (_overlay.attrs[key] == value) {
        returns = _overlay;
        break;
      }
    }
    return returns;
  }
  /**
   * 获取自定义过滤函数匹配的覆盖物列表
   * @param {Function} filter 可选 自定义过滤函数
   * @return {Array} 返回匹配的覆盖物列表
   */
  utils.map.RManager.prototype.getOverlays = function (filter) {
    var _overlaylist = [];
    if (!utils.map.tools.isFunction(filter)) {
      filter = function () { return true; }
    }
    for (var i = 0, _overlay; _overlay = this._overlays[i]; i++) {
      if (filter(_overlay)) {
        _overlaylist.push(_overlay);
      }
    }
    return _overlaylist;
  }
  /*** utils.map.RManager 代码结束 ***/
})(window.utils || (window.utils = {}))