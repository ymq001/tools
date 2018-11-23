(function (utils) {
  utils.map = utils.map = utils.map || {};
  /*** utils.map.RMarker 代码开始 ***/
  /**
   * utils.map.RMarker类的构造函数
   * @class
   * @alias utils.map.RMarker
   * @classdesc utils.map.RMarker
   * @description 自定义复杂覆盖物类，实现丰富的Marker展现效果。 {@link http://172.26.1.40/docs/examples/rmarker.html|RMarker示例}
   * 
   * @constructor
   * 
   * @property {BMap.Map} _map 百度地图实例
   * @property {HTMLElement} _container marker主容器
   * @property {String|HTMLElement} _content marker解析成HTMLElement后的DOM字符串
   * @property {BMap.Point} _position marker显示位置
   * @property {BMap.Size} _size marker主容器的尺寸
   * @property {Json} _opts 默认参数赋值
   * 
   * @param {Json} opts Rmarker中的参数
   * @param {BMap.Point} opts.position marker的位置
   * @param {Json|String|HTMLElement} opts.content 自定义marker内容，可以是Json对象( eg: {url: {String}, size: {BMap.Size}} )，可以是字符串，也可以是dom节点
   * @param {String} opts.content.url marker背景图标链接
   * @param {BMap.Size} opts.content.size marker背景图标大小
   * @param {Number} opts.zIndex 可选 设置Marker的dom层级 默认以添加顺序设置层级
   * @param {BMap.Size} opts.anchor Marker的的位置偏移值
   * @param {Boolean} opts.enableDragging 是否启用拖拽，默认为false
   * @param {Boolean} opts.isShowText 是否显示marker名称，默认为true
   * @param {Boolean} opts.isShowCount 是否显示marker角标，默认为false
   * @param {Number|String} opts.count marker角标，可以是数字，也可以是文本
   * @param {String} opts.text marker名称
   * @param {Json} opts.countTheme 角标主题色
   * @param {String} opts.countTheme.bgColor 浏览器可以识别的颜色值，默认半透明黑色
   * @param {String} opts.countTheme.color 浏览器可以识别的颜色值，默认白色
   * @param {Json} opts.textTheme marker名称主题色
   * @param {String} opts.textTheme.bgColor 浏览器可以识别的颜色值，默认半透明黑色
   * @param {String} opts.textTheme.color 浏览器可以识别的颜色值，默认白色
   * @param {Json} opts.attrs 存放自定义属性
   *
   * @example 参考示例1：
   * var map = new BMap.Map("container");
   * map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);
   * var htm = "<div style='background:#E7F0F5;color:#0082CB;border:1px solid #333'>"
   *              +     "欢迎使用百度地图！"
   *              +     "<img src='http://map.baidu.com/img/logo-map.gif' border='0' />"
   *              + "</div>";
   * var point = new BMap.Point(116.30816, 40.056863);
   * var myRMarkerObject = new utils.map.RMarker({
   *  position: point,
   *  content: htm, 
   *  anchor: new BMap.Size(-72, -84),
   *  enableDragging: true
   * });
   * map.addOverlay(myRMarkerObject);
   * 
   * @example 参考示例2：
   * var map = new BMap.Map("container");
   * map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);
   * var point = new BMap.Point(116.30816, 40.056863);
   * var myRMarkerObject =  new utils.map.RMarker({
   *  position: point, 
   *  content:{
   *    url: 'images/yunweiban.png',
   *    size: new BMap.Size(50, 40)
   *  },
   *  anchor: new BMap.Size(-47, -116),
   *  enableDragging: true,
   *  text: '耶路撒冷的冷',
   *  count: 10,
   *  isShowCount: true,
   *  attrs: { //自定义属性可以在这里添加
   *    rcuId: 123
   *  }
   * });
   * map.addOverlay(myRMarkerObject);
   */
  utils.map.RMarker = function (opts, index) {
    if (!opts.content || !opts.position || !(opts.position instanceof BMap.Point)) {
      return;
    }

    /**
     * 是否启用文档碎片能力提升渲染性能
     * @private
     * @type {Boolean}
     */
    this._isEnableFragment = false;

    /**
     * map对象
     * @private
     * @type {Map}
     */
    this._map = null;

    /**
     * marker主容器
     * @private
     * @type {HTMLElement}
     */
    this._container = null;

    /**
     * Marker内容
     * @private
     * @type {String}
     */
    this._content = opts.content;

    /**
     * marker显示位置
     * @private
     * @type {BMap.Point}
     */
    this._position = opts.position;

    /**
     * marker主容器的尺寸
     * @private
     * @type {BMap.Size}
     */
    this._size = null;

    opts = opts || {};
    opts.text = opts.text || opts.name;
    this._isEnableFragment = opts.isEnableFragment || false;
    /**
     * _opts是默认参数赋值。
     * 下面通过用户输入的opts，对默认参数赋值
     * @private
     * @type {Json}
     */
    this._opts = utils.map.tools.extend(
      utils.map.tools.extend(
        utils.map.tools.extend(this._opts || {}, {
          /**
           * Marker是否可以拖拽
           * @private
           * @type {Boolean}
           */
          enableDragging: false,
          /**
           * Marker的偏移量
           * @private
           * @type {BMap.Size}
           */
          anchor: new BMap.Size(0, 0),
          /**
           * Marker的图标背景
           * @private
           * @type {String}
           */
          url: '',
          /**
           * Marker的图标大小
           * @private
           * @type {BMap.Size}
           */
          size: new BMap.Size(0, 0),
          /**
           * Marker的名称
           * @private
           * @type {String}
           */
          text: '',
          /**
           * Marker的角标
           * @private
           * @type {String|Number}
           */
          count: '',
          /**
           * 是否显示marker名称
           * @private
           * @type {Boolean}
           */
          isShowText: true,
          /**
           * 是否显示marker角标
           * @private
           * @type {Boolean}
           */
          isShowCount: false,
          /**
           * marker名称颜色样式
           * @private
           * @type {Json}
           */
          textTheme: {
            bgColor: '',
            color: ''
          },
          /**
           * marker角标颜色样式
           * @private
           * @type {Json}
           */
          countTheme: {
            bgColor: '',
            color: ''
          },
          /**
           * marker自定义属性
           * @private
           * @type {Json}
           */
          attrs: {}
        }), opts.content), opts);
    if (utils.map.tools.isNumber(index)) this._index = index; //批量添加覆盖物时,用于事件触发查找的索引
    if (utils.map.tools.isObject(opts.content) && utils.map.tools.isString(opts.content.url) && opts.content.size instanceof BMap.Size) {
      this._content = this._preRenderContent({
        url: this._opts.content.url,
        height: this._opts.content.size.height,
        width: this._opts.content.size.width,
        text: this._opts.text,
        count: this._opts.count,
        isShowText: this._opts.isShowText,
        isShowCount: this._opts.isShowCount,
        lng: this._opts.position.lng,
        lat: this._opts.position.lat,
        textStyle: this._convertThemeToString(this._opts.textTheme),
        countStyle: this._convertThemeToString(this._opts.countTheme)
      });
    }
  }

  // 继承覆盖物类
  utils.map.RMarker.prototype = new BMap.Overlay();

  /**
   * 初始化，实现自定义覆盖物的initialize方法
   * 主要生成Marker的主容器，填充自定义的内容，并附加事件
   * 
   * @private
   * @param {BMap} map map实例对象
   * @return {Dom} 返回自定义生成的dom节点
   */
  utils.map.RMarker.prototype.initialize = function (map) {
    var div = this._initialize(map, map.getPanes().labelPane);
    return div;
  }

  /**
   * 初始化，实现自定义覆盖物的initialize方法
   * 主要生成Marker的主容器，填充自定义的内容，并附加事件
   * 
   * @private
   * @param {BMap} map map实例对象
   * @param {HTMLElement} container 需要添加到容器
   * @return {Dom} 返回自定义生成的dom节点
   */
  utils.map.RMarker.prototype._initialize = function (map, container) {
    var _this = this,
      div = _this._container = document.createElement("div"),
      anchor = this._opts.anchor,
      pixel = map.pointToOverlayPixel(this._position);
    _this._map = map;
    _this._map._index = _this._opts.zIndex || _this._map._index || 0;
    utils.map.tools.extend(div.style, {
      position: "absolute",
      zIndex: BMap.Overlay.getZIndex(this._position.lng),//BMap.Overlay.getZIndex(++_this._map._index),
      cursor: "pointer",
      left: pixel.x + anchor.width + "px",
      top: pixel.y + anchor.height + "px"
    });
    if (utils.map.tools.isNumber(_this._index)) {
      div.setAttribute('BMarkerIndex', _this._index);
    }
    container.appendChild(div);

    // 给marker添加自定义样式
    _this._renderPresetStyles();
    // 给主容器添加上用户自定义的内容
    _this._appendContent();
    // 给主容器添加事件处理
    _this._setEventDispath();
    // 获取主容器的高宽
    _this._getContainerSize();

    //兼容右键菜单设置项
    _this.Ua = div;
    _this.K = {
      Ed: "url(../../Scripts/map/images/closedhand.cur) 8 8,move",
      Wb: "url(../../Scripts/map/images/openhand.cur) 8 8,default"
    }

    return div;
  }

  /**
   * 为自定义的Marker设定显示位置，实现自定义覆盖物的draw方法
   * 
   * @private
   */
  utils.map.RMarker.prototype.draw = function () {
    this._draw();
    _dispatchEvent(this, 'onload');
  }
  /**
   * 为自定义的Marker设定显示位置，实现自定义覆盖物的draw方法
   * 
   * @private
   */
  utils.map.RMarker.prototype._draw = function () {
    var map = this._map,
      anchor = this._opts.anchor,
      pixel = map.pointToOverlayPixel(this._position);
    this._container.style.left = pixel.x + anchor.width + "px";
    this._container.style.top = pixel.y + anchor.height + "px";
  }
  /**
   * 预渲染content内容
   *  1. 若content是一个String or HTMLElement 则直接返回
   *  2. 若content是一个Json对象 则渲染成固定dom结构
   * @private
   * @param {Json|String|HTMLElement} content 预渲染content内容
   * @param {String} content.url 背景图标链接
   * @param {BMap.Size} content.size 背景图标大小
   * @param {Boolean} content.isShowText 是否显示marker名称
   * @param {Boolean} content.isShowCount 是否显示marker角标
   * @param {Number|String} content.count marker角标，可以是数字，也可以是文本
   * @param {String} content.text marker名称
   * @param {Number} content.lng marker坐标纬度
   * @param {Number} content.lat marker坐标经度
   */
  utils.map.RMarker.prototype._preRenderContent = function (content) {
    if (utils.map.tools.isObject(content)) {
      var html = '';
      html += '<div class="BMap_RMarker" lng="{{ lng }}" lat="{{ lat }}">';
      html += '  <em class="BMap_RMarker_Icon" style="background-image: url({{ url }}); height: {{ height }}px; width: {{ width }}px;"></em>';
      if (content.isShowText) html += '  <label class="BMap_RMarker_Label" style="{{ textStyle }}">{{ text }}</label>';
      if (content.isShowCount) html += '  <label class="BMap_RMarker_Badge" style="{{ countStyle }}">{{ count }}</label>';
      html += '</div > ';

      return utils.map.tools.tmp(html, content);
    }
    return content;
  }

  /**
   * 处理样式对象
   *  此后个性化marker设置 需改此处
   * @private
   * @param {Json} theme 样式对象
   * @param {String} theme.bgColor 背景颜色
   * @param {String} theme.color 文本颜色
   * @returns {String} 内联样式字符串
   */
  utils.map.RMarker.prototype._convertThemeToString = function (theme) {
    var returns = '';
    if (theme.bgColor) {
      returns += "background-color: " + theme.bgColor + ';';
    }
    if (theme.color) {
      returns += "color: " + theme.color + ';';
    }
    return returns;
  }

  /**
   * 添加marker样式到浏览器上
   * @private
   */
  utils.map.RMarker.prototype._renderPresetStyles = function () {
    if (!document.getElementById('BMarker_Style')) {
      var style = document.createElement('style');
      var innerHtml = '.BMap_RMarker{ position: relative; font-size: 12px; }';
      innerHtml += '.BMap_RMarker .BMap_RMarker_Icon{ background-repeat: no-repeat; background-size: cover; display: block; margin: 0 auto; }';
      innerHtml += '.BMap_RMarker .BMap_RMarker_Label{ white-space: nowrap; padding: 3px; margin-top: 5px; position: relative; display: inline-block; box-sizing: border-box; text-align: center; min-width: 100%; border-radius: 50px; background: rgba(41, 41, 41, 0.65); color: #fff; }';
      innerHtml += '.BMap_RMarker .BMap_RMarker_Badge{ position: absolute; top: -15px; left: 50%; box-sizing: border-box; margin-left: 10px; padding: 0 6px; height: 20px; line-height: 20px; min-width: 20px; text-align: center; z-index: 100; border-radius: 50px; background: rgba(41, 41, 41, 0.65); color: #fff; }';
      style.innerHTML = innerHtml;
      style.id = 'BMarker_Style';
      document.getElementsByTagName('head')[0].appendChild(style);
    }
  }

  /**
   * 设置Marker可以拖拽
   * @return 无返回值
   * 
   * @example 参考示例：
   * myRMarkerObject.enableDragging();
   */
  utils.map.RMarker.prototype.enableDragging = function () {
    this._opts.enableDragging = true;
  }

  /**
   * 设置Marker不能拖拽
   * @return 无返回值
   * 
   * @example 参考示例：
   * myRMarkerObject.disableDragging();
   */
  utils.map.RMarker.prototype.disableDragging = function () {
    this._opts.enableDragging = false;
  }

  /**
   * 获取Marker是否能被拖拽的状态
   * @return {Boolean} true为可以拖拽，false为不能被拖拽
   * 
   * @example 参考示例：
   * myRMarkerObject.isDraggable();
   */
  utils.map.RMarker.prototype.isDraggable = function () {
    return this._opts.enableDragging;
  }

  /**
   * 获取Marker的显示位置
   * @return {BMap.Point} 显示的位置
   * 
   * @example 参考示例：
   * myRMarkerObject.getPosition();
   */
  utils.map.RMarker.prototype.getPosition = function () {
    return this._position;
  }

  /**
   * 设置Marker的显示位置
   * @param {BMap.Point} position 需要设置的位置
   * @return 无返回值
   * 
   * @example 参考示例：
   * myRMarkerObject.setPosition(new BMap.Point(116.30816, 40.056863));
   */
  utils.map.RMarker.prototype.setPosition = function (position) {
    if (!position instanceof BMap.Point) {
      return;
    }
    this._position = position;
    this._draw();
  }

  /**
   * 获取Marker的偏移量
   * @return {BMap.Size} Marker的偏移量
   * 
   * @example 参考示例：
   * myRMarkerObject.getAnchor();
   */
  utils.map.RMarker.prototype.getAnchor = function () {
    return this._opts.anchor;
  }

  /**
   * 设置Marker的偏移量
   * @param {BMap.Size} anchor 需要设置的偏移量
   * @return 无返回值
   * 
   * @example 参考示例：
   * myRMarkerObject.setAnchor(new BMap.Size(-72, -84));
   */
  utils.map.RMarker.prototype.setAnchor = function (anchor) {
    if (!anchor instanceof BMap.Size) {
      return;
    }
    this._opts.anchor = anchor;
    this._draw();
  }

  /**
   * 添加用户的自定义的内容
   * 
   * @private
   * @return 无返回值
   */
  utils.map.RMarker.prototype._appendContent = function () {
    var content = this._content;
    // 用户输入的内容是字符串，需要转化成dom节点
    if (typeof content == "string") {
      var div = document.createElement('DIV');
      div.innerHTML = content;
      if (div.childNodes.length == 1) {
        content = (div.removeChild(div.firstChild));
      } else {
        var fragment = document.createDocumentFragment();
        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }
        content = fragment;
      }
    }
    this._container.innerHTML = "";
    this._container.appendChild(content);
  }

  /**
   * 获取Marker的内容
   * @return {String | HTMLElement} 当前内容
   * 
   * @example 参考示例：
   * myRMarkerObject.getContent();
   */
  utils.map.RMarker.prototype.getContent = function () {
    return this._content;
  }

  /**
   * 设置Marker的内容
   * @param {String | HTMLElement} content 需要设置的内容
   * @param {String} content.url 需要设置的背景图标链接
   * @param {BMap.Size} content.size 需要设置的背景图标的大小
   * @param {String} content.text 需要设置的marker的名称
   * @param {Number} content.count 需要设置的marker的角标
   * @param {Boolean} content.isShowText 设置marker是否需要显示名称
   * @param {Boolean} content.isShowCount 设置marker是否需要显示角标
   * @param {Json} content.countTheme 角标主题色
   * @param {String} content.countTheme.bgColor 浏览器可以识别的颜色值，默认半透明黑色
   * @param {String} content.countTheme.color 浏览器可以识别的颜色值，默认白色
   * @param {Json} content.textTheme marker名称主题色
   * @param {String} content.textTheme.bgColor 浏览器可以识别的颜色值，默认半透明黑色
   * @param {String} content.textTheme.color 浏览器可以识别的颜色值，默认白色
   * @return 无返回值
   * 
   * @example 参考示例1：
   * var htm = "<div style='background:#E7F0F5;color:#0082CB;border:1px solid #333'>"
   *              +     "欢迎使用百度地图API！"
   *              +     "<img src='http://map.baidu.com/img/logo-map.gif' border='0' />"
   *              + "</div>";
   * myRMarkerObject.setContent(htm);
   * 
   * @example 参考示例2：
   * myRMarkerObject.setContent({
      url: 'images/yunweiban.png',
      size: new BMap.Size(50, 40)
    });
   * 
   * 
   */
  utils.map.RMarker.prototype.setContent = function (content) {
    if (!content) {
      return;
    }
    // 存储用户输入的Marker显示内容

    this._content = content;
    if (utils.map.tools.isObject(content)) {
      this._opts = utils.map.tools.extend(this._opts, {
        url: utils.map.tools.isString(content.url) ? content.url : this._opts.url,
        size: content.size instanceof BMap.Size ? content.size : this._opts.size,
        text: utils.map.tools.isString(content.text) ? content.text : this._opts.text,
        count: utils.map.tools.isNumber(content.count) ? content.count : this._opts.count,
        isShowText: utils.map.tools.isBoolean(content.isShowText) ? content.isShowText : this._opts.isShowText,
        isShowCount: utils.map.tools.isBoolean(content.isShowCount) ? content.isShowCount : this._opts.isShowCount,
        textTheme: utils.map.tools.isObject(content.textTheme) ? content.textTheme : this._opts.textTheme,
        countTheme: utils.map.tools.isObject(content.countTheme) ? content.countTheme : this._opts.countTheme
      });
      this._content = this._preRenderContent({
        url: this._opts.url,
        height: this._opts.size.height,
        width: this._opts.size.width,
        text: this._opts.text,
        count: this._opts.count,
        isShowText: this._opts.isShowText,
        isShowCount: this._opts.isShowCount,
        lng: this._position.lng,
        lat: this._position.lat,
        textStyle: this._convertThemeToString(this._opts.textTheme),
        countStyle: this._convertThemeToString(this._opts.countTheme)
      })
    }
    // 添加进主容器
    this._appendContent();
  }

  /**
   * 获取Marker的高宽
   * 
   * @private
   * @return {BMap.Size} 当前高宽
   */
  utils.map.RMarker.prototype._getContainerSize = function () {
    if (!this._container) {
      return;
    }
    var h = this._container.offsetHeight;
    var w = this._container.offsetWidth;
    this._size = new BMap.Size(w, h);
  }

  /**
   * 获取Marker的宽度
   * @return {Number} 当前宽度
   * 
   * @example 参考示例：
   * myRMarkerObject.getWidth();
   */
  utils.map.RMarker.prototype.getWidth = function () {
    if (!this._size) {
      return;
    }
    return this._size.width;
  }

  /**
   * 设置Marker的宽度
   * @param {Number} width 需要设置的宽度
   * @return 无返回值
   * 
   * @example 参考示例：
   * myRMarkerObject.setWidth(300);
   */
  utils.map.RMarker.prototype.setWidth = function (width) {
    if (!this._container) {
      return;
    }
    this._container.style.width = width + "px";
    this._getContainerSize();
  }

  /**
   * 获取Marker的高度
   * @return {Number} 当前高度
   * 
   * @example 参考示例：
   * myRMarkerObject.getHeight();
   */
  utils.map.RMarker.prototype.getHeight = function () {
    if (!this._size) {
      return;
    }
    return this._size.height;
  }

  /**
   * 设置Marker的高度
   * @param {Number} height 需要设置的高度
   * @return 无返回值
   * 
   * @example 参考示例：
   * myRMarkerObject.setHeight(200);
   */
  utils.map.RMarker.prototype.setHeight = function (height) {
    if (!this._container) {
      return;
    }
    this._container.style.height = height + "px";
    this._getContainerSize();
  }

  /**
   * 设置Marker的各种事件
   * 
   * @private
   * @return 无返回值
   */
  utils.map.RMarker.prototype._setEventDispath = function () {
    var me = this,
      div = me._container,
      _offset = { //鼠标位置距离覆盖物左上角的x、y轴偏差值
        left: 0,
        top: 0
      },
      isMouseDown = false,  // 鼠标是否按下，用以判断鼠标移动过程中的拖拽计算
      startPosition = null; // 拖拽时，鼠标按下的初始位置，拖拽的辅助计算参数

    //获取边距
    function offset(target) {
      var top = 0,
        left = 0

      while (target.offsetParent) {
        top += target.offsetTop
        left += target.offsetLeft
        target = target.offsetParent
      }

      return {
        top: top,
        left: left,
      }
    }

    // 通过e参数获取当前鼠标所在位置
    function _getPositionByEvent(e) {
      var e = window.event || e;
      var x = e.pageX || e.clientX || 0;
      var y = e.pageY || e.clientY || 0;

      var pixel = new BMap.Pixel(x, y);
      var point = me._map.pixelToPoint(pixel);
      return {
        "pixel": pixel,
        "point": point
      };
    }

    // 单击事件
    utils.map.tools.on(div, "onclick", function (e) {
      var position = _getPositionByEvent(e);
      /**
       * 点击Marker时，派发事件的接口
       * @name RMarker#onclick
       * @ignore
       * @event
       * @param {Event} e 回调函数会返回event参数，包括以下返回值：
       * "target : {BMap.Overlay} 触发事件的元素,
       * "type：{String} 事件类型
       *
       * @example 参考示例：
       * myRMarkerObject.addEventListener("onclick", function(e) { 
       *     alert(e.type);  
       * });
       */
      _dispatchEvent(me, "onclick", {
        "point": position.point,
        "pixel": position.pixel,
        "attrs": me._opts.attrs
      });
      _stopAndPrevent(e);
    });

    // 双击事件
    utils.map.tools.on(div, "ondblclick", function (e) {
      var position = _getPositionByEvent(e);
      /**
       * 双击Marker时，派发事件的接口
       * @name RMarker#ondblclick
       * @ignore
       * @event
       * @param {Event} e 回调函数会返回event参数，包括以下返回值：
       * "target : {BMap.Overlay} 触发事件的元素,
       * "type：{String} 事件类型,
       * "point：{BMap.Point} 鼠标的物理坐标,
       * "pixel：{BMap.Pixel} 鼠标的像素坐标
       *
       * @example 参考示例：
       * myRMarkerObject.addEventListener("ondblclick", function(e) { 
       *     alert(e.type);  
       * });
       */
      _dispatchEvent(me, "ondblclick", {
        "point": position.point,
        "pixel": position.pixel,
        "attrs": me._opts.attrs
      });
      _stopAndPrevent(e);
    });

    // 鼠标移上事件
    div.onmouseover = function (e) {
      var position = _getPositionByEvent(e);
      /**
       * 鼠标移到Marker上时，派发事件的接口
       * @name RMarker#onmouseover
       * @ignore
       * @event
       * @param {Event} e 回调函数会返回event参数，包括以下返回值：
       * "target : {BMap.Overlay} 触发事件的元素,
       * "type：{String} 事件类型,
       * "point：{BMap.Point} 鼠标的物理坐标,
       * "pixel：{BMap.Pixel} 鼠标的像素坐标
       *
       * @example 参考示例：
       * myRMarkerObject.addEventListener("onmouseover", function(e) { 
       *     alert(e.type);  
       * });
       */
      _dispatchEvent(me, "onmouseover", {
        "point": position.point,
        "pixel": position.pixel,
        "attrs": me._opts.attrs
      });
      _stopAndPrevent(e);
    }

    // 鼠标移出事件
    div.onmouseout = function (e) {
      var position = _getPositionByEvent(e);
      /**
       * 鼠标移出Marker时，派发事件的接口
       * @name RMarker#onmouseout
       * @ignore
       * @event
       * @param {Event} e 回调函数会返回event参数，包括以下返回值：
       * "target : {BMap.Overlay} 触发事件的元素,
       * "type：{String} 事件类型,
       * "point：{BMap.Point} 鼠标的物理坐标,
       * "pixel：{BMap.Pixel} 鼠标的像素坐标
       *
       * @example 参考示例：
       * myRMarkerObject.addEventListener("onmouseout", function(e) { 
       *     alert(e.type);  
       * });
       */
      _dispatchEvent(me, "onmouseout", {
        "point": position.point,
        "pixel": position.pixel,
        "attrs": me._opts.attrs
      });
      _stopAndPrevent(e);
    }

    // 鼠标弹起事件
    var mouseUpEvent = function (e) {
      var position = _getPositionByEvent(e);
      /**
       * 在Marker上弹起鼠标时，派发事件的接口
       * @name RMarker#onmouseup
       * @ignore
       * @event
       * @param {Event} e 回调函数会返回event参数，包括以下返回值：
       * "target : {BMap.Overlay} 触发事件的元素,
       * "type：{String} 事件类型,
       * "point：{BMap.Point} 鼠标的物理坐标,
       * "pixel：{BMap.Pixel} 鼠标的像素坐标
       *
       * @example 参考示例：
       * myRMarkerObject.addEventListener("onmouseup", function(e) { 
       *     alert(e.type);  
       * });
       */
      _dispatchEvent(me, "onmouseup", {
        "point": position.point,
        "pixel": position.pixel,
        "attrs": me._opts.attrs
      });

      if (me._container.releaseCapture) {
        utils.map.tools.un(div, "onmousemove", mouseMoveEvent);
        utils.map.tools.un(div, "onmouseup", mouseUpEvent);
      } else {
        utils.map.tools.un(window, "onmousemove", mouseMoveEvent);
        utils.map.tools.un(window, "onmouseup", mouseUpEvent);
      }

      // 判断是否需要进行拖拽事件的处理
      if (!me._opts.enableDragging) {
        _stopAndPrevent(e);
        return;
      }
      position.pixel.x -= _offset.left;
      position.pixel.y -= _offset.top;

      position.point = me._map.pixelToPoint(position.pixel);
      // 拖拽结束时，释放鼠标捕获
      me._container.releaseCapture && me._container.releaseCapture();
      /**
       * 拖拽Marker结束时，派发事件的接口
       * @name RMarker#ondragend
       * @ignore
       * @event
       * @param {Event} e 回调函数会返回event参数，包括以下返回值：
       * "target : {BMap.Overlay} 触发事件的元素,
       * "type：{String} 事件类型,
       * "point：{BMap.Point} 鼠标的物理坐标,
       * "pixel：{BMap.Pixel} 鼠标的像素坐标
       *
       * @example 参考示例：
       * myRMarkerObject.addEventListener("ondragend", function(e) { 
       *     alert(e.type);  
       * });
       */
      _dispatchEvent(me, "ondragend", {
        "point": position.point,
        "pixel": position.pixel,
        "attrs": me._opts.attrs
      });
      isMouseDown = false;
      startPosition = null;
      // 设置拖拽结束后的鼠标手型
      me._setCursor("dragend");
      // 拖拽过程中防止文字被选中
      me._container.style['MozUserSelect'] = '';
      me._container.style['KhtmlUserSelect'] = '';
      me._container.style['WebkitUserSelect'] = '';
      me._container['unselectable'] = 'off';
      me._container['onselectstart'] = function () { };

      _stopAndPrevent(e);
    }

    // 鼠标移动事件
    var mouseMoveEvent = function (e) {
      // 判断是否需要进行拖拽事件的处理
      if (!me._opts.enableDragging || !isMouseDown) {
        return;
      }
      var position = _getPositionByEvent(e);

      // 计算当前marker应该所在的位置
      var startPixel = me._map.pointToPixel(me._position);
      var x = position.pixel.x - startPosition.x + startPixel.x;
      var y = position.pixel.y - startPosition.y + startPixel.y;

      startPosition = position.pixel;
      me._position = me._map.pixelToPoint(new BMap.Pixel(x, y));
      me._draw();
      // 设置拖拽过程中的鼠标手型
      me._setCursor("dragging");
      /**
       * 拖拽Marker的过程中，派发事件的接口
       * @name RMarker#ondragging
       * @ignore
       * @event
       * @param {Event} e 回调函数会返回event参数，包括以下返回值：
       * "target : {BMap.Overlay} 触发事件的元素,
       * "type：{String} 事件类型,
       * "point：{BMap.Point} 鼠标的物理坐标,
       * "pixel：{BMap.Pixel} 鼠标的像素坐标
       *
       * @example 参考示例：
       * myRMarkerObject.addEventListener("ondragging", function(e) { 
       *     alert(e.type);  
       * });
       */
      _dispatchEvent(me, "ondragging", {
        "point": position.point,
        "pixel": position.pixel,
        "attrs": me._opts.attrs
      });
      _stopAndPrevent(e);
    }

    // 鼠标按下事件
    utils.map.tools.on(div, "onmousedown", function (e) {
      var position = _getPositionByEvent(e);
      if (e.button == 2) {
        _dispatchEvent(me, "onrightclick", {
          "point": position.point,
          "pixel": position.pixel,
          "attrs": me._opts.attrs
        });
        _stopAndPrevent(e);
        return;
      }
      /**
       * 在Marker上按下鼠标时，派发事件的接口
       * @name RMarker#onmousedown
       * @ignore
       * @event
       * @param {Event} e 回调函数会返回event参数，包括以下返回值：
       * "target : {BMap.Overlay} 触发事件的元素,
       * "type：{String} 事件类型,
       * "point：{BMap.Point} 鼠标的物理坐标,
       * "pixel：{BMap.Pixel} 鼠标的像素坐标
       *
       * @example 参考示例：
       * myRMarkerObject.addEventListener("onmousedown", function(e) { 
       *     alert(e.type);  
       * });
       */
      _dispatchEvent(me, "onmousedown", {
        "point": position.point,
        "pixel": position.pixel,
        "attrs": me._opts.attrs
      });

      if (me._container.setCapture) {
        utils.map.tools.on(div, "onmousemove", mouseMoveEvent);
        utils.map.tools.on(div, "onmouseup", mouseUpEvent);
      } else {
        utils.map.tools.on(window, "onmousemove", mouseMoveEvent);
        utils.map.tools.on(window, "onmouseup", mouseUpEvent);
      }

      // 判断是否需要进行拖拽事件的处理
      if (!me._opts.enableDragging) {
        _stopAndPrevent(e);
        return;
      }
      _offset = me._map.pointToPixel(me.getPosition());
      _offset = {
        left: position.pixel.x - _offset.x,
        top: position.pixel.y - _offset.y
      };

      startPosition = position.pixel;
      /**
       * 开始拖拽Marker时，派发事件的接口
       * @name RMarker#ondragstart
       * @ignore
       * @event
       * @param {Event} e 回调函数会返回event参数，包括以下返回值：
       * "target : {BMap.Overlay} 触发事件的元素,
       * "type：{String} 事件类型,
       * "point：{BMap.Point} 鼠标的物理坐标,
       * "pixel：{BMap.Pixel} 鼠标的像素坐标
       *
       * @example 参考示例：
       * myRMarkerObject.addEventListener("ondragstart", function(e) { 
       *     alert(e.type);  
       * });
       */
      _dispatchEvent(me, "ondragstart", {
        "point": position.point,
        "pixel": position.pixel,
        "attrs": me._opts.attrs
      });
      me._map.lastOverlayZIndex = (me._map.lastOverlayZIndex || 100);
      this.style.zIndex = me._map.lastOverlayZIndex++;
      isMouseDown = true;
      // 设置拖拽开始的鼠标手型
      me._setCursor("dragstart");
      // 拖拽开始时，设置鼠标捕获
      me._container.setCapture && me._container.setCapture();
      // 拖拽过程中防止文字被选中
      me._container.style['MozUserSelect'] = 'none';
      me._container.style['KhtmlUserSelect'] = 'none';
      me._container.style['WebkitUserSelect'] = 'none';
      me._container['unselectable'] = 'on';
      me._container['onselectstart'] = function () {
        return false;
      };
      _stopAndPrevent(e);
    });
  }

  /**
   * 设置拖拽过程中的手型
   *
   * @private 
   * @param {string} cursorType 需要设置的手型类型
   */
  utils.map.RMarker.prototype._setCursor = function (cursorType) {
    var cursor = '';
    var cursorStylies = {
      "moz": {
        "dragstart": "-moz-grab",
        "dragging": "-moz-grabbing",
        "dragend": "pointer"
      },
      "other": {
        "dragstart": "move",
        "dragging": "move",
        "dragend": "pointer"
      }
    };

    if (navigator.userAgent.indexOf('Gecko/') !== -1) {
      cursor = cursorStylies.moz[cursorType];
    } else {
      cursor = cursorStylies.other[cursorType];
    }

    if (this._container.style.cursor != cursor) {
      this._container.style.cursor = cursor;
    }
  }

  /**
   * 删除Marker
   * 
   * @private
   * @return 无返回值
   */
  utils.map.RMarker.prototype.remove = function () {
    _dispatchEvent(this, "onremove", {
      "attrs": this._opts.attrs
    });
    // 清除主容器上的事件绑定
    if (this._container) {
      _purge(this._container);
    }
    // 删除主容器
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }
  /**
   * 添加右键菜单 参考百度地图 Marker 的api addContextMenu
   * @param {BMap.ContextMenu} control 右键菜单实例
   * @example 参考示例
   * var map = new BMap.Map("container");
   * map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);
   * var point = new BMap.Point(116.30816, 40.056863);
   * var myRMarkerObject =  new utils.map.RMarker({
   *  position: point, 
   *  content:{
   *    url: 'images/yunweiban.png',
   *    size: new BMap.Size(50, 40)
   *  },
   *  anchor: new BMap.Size(-47, -116),
   *  enableDragging: true,
   *  text: '耶路撒冷的冷',
   *  count: 10,
   *  isShowCount: true,
   *  attrs: { //自定义属性可以在这里添加
   *    rcuId: 123
   *  }
   * });
   * map.addOverlay(myRMarkerObject);
   * 
   * var removeMarker = function(){
   *  //do something...
   * }
   * var markerMenu = new BMap.ContextMenu();
   * markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));
   * myRMarkerObject.addContextMenu(markerMenu);
   */
  utils.map.RMarker.prototype.addContextMenu = function (control) {
    control && utils.map.tools.isFunction(control.qa) && (control.qa(this), _dispatchEvent(control, 'onaddcontextmenu'));
    utils.map.tools.on(this, "onrightclick", function (e) {
      if (!!this._map.lastOverlayMenu && this._map.lastOverlayMenu != control) {
        this._map.lastOverlayMenu.B.style.visibility = 'hidden';
      }
      control.show();
      var _pixel = this._map.pointToPixel(e.target._position);
      var _size = e.target._size;
      var l = e.pixel.x - _pixel.x;
      var t = e.pixel.y - _pixel.y - _size.height;
      control.B.style.top = t + 'px';
      control.B.style.left = l + 'px';
      this._map.lastOverlayMenu = control;
    });
  }
  /**
   * 移除右键菜单
   * @param {BMap.ContextMenu} control 右键菜单实例
   * @example 参考示例
   * 
   * var removeMarker = function(){
   *  //do something...
   *  myRMarkerObject.removeContextMenu(markerMenu); //移除右键菜单
   *  alert('移除成功');
   * }
   * var markerMenu = new BMap.ContextMenu();
   * markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));
   * myRMarkerObject.addContextMenu(markerMenu);
   */
  utils.map.RMarker.prototype.removeContextMenu = function (control) {
    control && utils.map.tools.isFunction(control.remove) && (_dispatchEvent(control, 'onremovecontextmenu'), control.remove())
  }

  /**
   * 注册对象的事件监听器
   * @grammar obj.addEventListener(type, handler[, key])
   * @param 	{string}   type         自定义事件的名称 事件名称包括(on)click (on)dbclick (on)mouseover (on)mouseout (on)mousedown (on)mouseup (on)dragend (on)dragging (on)dragstart (on)rightclick (on)load
   * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
   * @param 	{string}   key		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。   *  
   * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
   * 
   * @example 参考示例：
   * myRMarkerObject.on("ondragend", function(e) { 
   *     alert(e.type);  
   * });
   */
  utils.map.RMarker.prototype.on = function (type, handler, key) {
    this.addEventListener(type, handler, key);
  }

  /**
   * 移除对象的事件监听器
   * @grammar obj.removeEventListener(type, handler)
   * @param {string}   type     事件类型 事件名称包括(on)click (on)dbclick (on)mouseover (on)mouseout (on)mousedown (on)mouseup (on)dragend (on)dragging (on)dragstart (on)rightclick (on)load
   * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
   * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
   * 
   * @example 参考示例：
   * myRMarkerObject.off("ondragend");
   */
  utils.map.RMarker.prototype.off = function (type, handler) {
    this.removeEventListener(type, handler);
  }

  /**
   * 集中派发事件函数
   *
   * @private
   * @param {Object} instance 派发事件的实例
   * @param {String} type 派发的事件名
   * @param {Json} opts 派发事件里添加的参数，可选
   */
  function _dispatchEvent(instance, type, opts) {
    type.indexOf("on") != 0 && (type = "on" + type);
    var event = new utils.map.tools.lang.Event(type);
    if (!!opts) {
      for (var p in opts) {
        event[p] = opts[p];
      }
    }
    instance.dispatchEvent(event);
  }

  /**
   * 清理DOM事件，防止循环引用
   * @private
   * @param {HTMLElement} dom 需要清理的dom对象
   */
  function _purge(dom) {
    if (!dom) {
      return;
    }
    var attrs = dom.attributes,
      name = "";
    if (attrs) {
      for (var i = 0, n = attrs.length; i < n; i++) {
        name = attrs[i].name;
        if (typeof dom[name] === "function") {
          dom[name] = null;
        }
      }
    }
    var child = dom.childnodes;
    if (child) {
      for (var i = 0, n = child.length; i < n; i++) {
        _purge(dom.childnodes[i]);
      }
    }
  }

  /**
   * 停止事件冒泡传播
   * @private
   * @param {BMap.Event} e e对象
   */
  function _stopAndPrevent(e) {
    var e = window.event || e;
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    return utils.map.tools.preventDefault(e);
  }
  /*** utils.map.RMarker 代码结束 ***/

  /*** utils.map.RMarkerCollection 代码开始 ***/
  /**
   * utils.map.RMarkerCollection类的构造函数
   * @class
   * @alias utils.map.RMarkerCollection
   * @classdesc utils.map.RMarkerCollection
   * @description 批量创建自定义复杂覆盖物类，实现丰富的Marker展现效果。 {@link http://172.26.1.40/docs/examples/batchMarker.html|RMarkerCollection示例} <br />
   * <span style="color:red;"><b>注意：</b> 暂时只支持RMarker类型的覆盖物</span>
   * 
   * @extends RMarker
   * @constructor
   * 
   * @property {BMap.Map} _map 百度地图实例
   * @property {HTMLElement} _container marker主容器
   * @property {RMarker} _overlays 将参数数组解析成RMarker后的覆盖物列表
   * 
   * @param {BMap.Map} map 百度地图实例
   * @param {Array<RMarker>} opts Rmarker中的参数数组
   * @param {BMap.Point} opts.position marker的位置
   * @param {Json|String|HTMLElement} opts.content 自定义marker内容，可以是Json对象( eg: {url: {String}, size: {BMap.Size}} )，可以是字符串，也可以是dom节点
   * @param {String} opts.content.url marker背景图标链接
   * @param {BMap.Size} opts.content.size marker背景图标大小
   * @param {Number} opts.zIndex 可选 设置Marker的dom层级 默认以添加顺序设置层级
   * @param {BMap.Size} opts.anchor Marker的的位置偏移值
   * @param {Boolean} opts.enableDragging 是否启用拖拽，默认为false
   * @param {Boolean} opts.isShowText 是否显示marker名称，默认为true
   * @param {Boolean} opts.isShowCount 是否显示marker角标，默认为false
   * @param {Number|String} content.count marker角标，可以是数字，也可以是文本
   * @param {String} opts.text marker名称
   * @param {Json} opts.countTheme 角标主题色
   * @param {String} opts.countTheme.bgColor 浏览器可以识别的颜色值，默认半透明黑色
   * @param {String} opts.countTheme.color 浏览器可以识别的颜色值，默认白色
   * @param {Json} opts.textTheme marker名称主题色
   * @param {String} opts.textTheme.bgColor 浏览器可以识别的颜色值，默认半透明黑色
   * @param {String} opts.textTheme.color 浏览器可以识别的颜色值，默认白色
   * @param {Json} opts.attrs 存放自定义属性
   * @param {Boolean} isEnableFragment 是否开启Fragment优化措施
   */
  utils.map.RMarkerCollection = function (map, opts, isEnableFragment) {
    /**
    * map对象
    * @private
    * @type {Map}
    */
    this._map = map;
    /**
     * marker主容器
     * @private
     * @type {HTMLElement}
     */
    this._container = null;
    /**
     * marker列表
     * @private
     * @type {utils.map.RMarker}
     */
    this._overlays = [];

    if (utils.map.tools.isArray(opts) == false) {
      throw ('请传递Array类型的参数');
    }

    if (!!isEnableFragment) {
      var docFragment = document.createDocumentFragment();
      for (var i = 0, _opt; _opt = opts[i]; i++) {
        _opt.isEnableFragment = true;
        var _overlay = new utils.map.RMarker(_opt, i);
        //console.log(_overlay);

        _overlay._initialize(this._map, docFragment);
        //_overlay.draw();
        this._overlays.push(_overlay);
        (this._map._customOverlays || this._map.ze).push(_overlay);
      }

      this._map.getPanes().labelPane.appendChild(docFragment);
      this._map.isEnableFragment = true;
    } else{
      for (var i = 0, _opt; _opt = opts[i]; i++) {
        this._overlays.push(new utils.map.RMarker(_opt, i));
      }
      this._map.isEnableFragment = false;
    }
  }
  /**
   * 获取覆盖物列表
   */
  utils.map.RMarkerCollection.prototype.getOverlays = function () {
    return this._overlays;
  }
  /**
   * 注册对象的事件监听器
   * @grammar obj.addEventListener(type, handler[, key])
   * @param 	{string}   type         自定义事件的名称 事件名称包括(on)click (on)dbclick (on)mouseover (on)mouseout (on)mousedown (on)mouseup (on)dragend (on)dragging (on)dragstart (on)rightclick (on)load
   * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
   * @param 	{string}   key		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。   *  
   * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
   * 
   * @example 参考示例：
   * myRMarkerObject.on("ondragend", function(e) { 
   *     alert(e.type);  
   * });
   */
  utils.map.RMarkerCollection.prototype.on = function (type, handler, key) {
    this._overlays.forEach(function (_overlay) {
      _overlay.on(type, handler, key);
    });
  }
  /**
   * 移除对象的事件监听器
   * @grammar obj.removeEventListener(type, handler)
   * @param {string}   type     事件类型 事件名称包括(on)click (on)dbclick (on)mouseover (on)mouseout (on)mousedown (on)mouseup (on)dragend (on)dragging (on)dragstart (on)rightclick (on)load
   * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
   * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
   * 
   * @example 参考示例：
   * myRMarkerObject.off("ondragend");
   */
  utils.map.RMarkerCollection.prototype.off = function (type, handler) {
    this._overlays.forEach(function (_overlay) {
      _overlay.off(type, handler, key);
    });
  }

  /**
   * 批量添加右键菜单 参考百度地图 Marker 的api addContextMenu
   * @param {BMap.ContextMenu} control 右键菜单实例
   * @example 参考示例
   * 
   * var removeMarker = function(){
   *  //do something...
   * }
   * var markerMenu = new BMap.ContextMenu();
   * markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));
   * myRMarkerObject.addContextMenu(markerMenu);
   */
  utils.map.RMarkerCollection.prototype.addContextMenu = function (control) {
    this._overlays.forEach(function (_overlay) {
      _overlay.addContextMenu(control);
    });
  }
  /**
   * 批量移除右键菜单
   * @param {BMap.ContextMenu} control 右键菜单实例
   * @example 参考示例
   * 
   * var removeMarker = function(){
   *  //do something...
   *  myRMarkerObject.removeContextMenu(markerMenu); //移除右键菜单
   *  alert('移除成功');
   * }
   * var markerMenu = new BMap.ContextMenu();
   * markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));
   * myRMarkerObject.addContextMenu(markerMenu);
   */
  utils.map.RMarkerCollection.prototype.removeContextMenu = function (control) {
    this._overlays.forEach(function (_overlay) {
      _overlay.removeContextMenu(control);
    });
  }
  /*** utils.map.RMarkerCollection 代码结束 ***/
})(window.utils || (window.utils = {}))