/**
 * @fileoverview 百度地图的自定义复杂覆盖物。
 * 允许用户在自定义丰富的Marker展现，并添加点击、双击、拖拽等事件。
 */
var utils = window.utils = utils || {};
utils.map = window.utils.map = utils.map || {};

(function () {

  /*** baidu 代码开始 ***/
  /**
   * 声明baidu包
   * 内置工具类
   * @private
   */
  var baidu = baidu || {
    guid: "$BAIDU$"
  };

  (function () {
    // 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
    window[baidu.guid] = {};

    /**
     * 将源对象的所有属性拷贝到目标对象中
     * @name baidu.extend
     * @function
     * @grammar baidu.extend(target, source)
     * @param {Object} target 目标对象
     * @param {Object} source 源对象
     * @returns {Object} 目标对象
     */
    baidu.extend = function (target, source) {
      for (var p in source) {
        if (source.hasOwnProperty(p)) {
          target[p] = source[p];
        }
      }
      return target;
    };

    /**
     * @ignore
     * @namespace
     * @baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
     * @property guid 对象的唯一标识
     */
    baidu.lang = baidu.lang || {};

    /**
     * 返回一个当前页面的唯一标识字符串。
     * @function
     * @grammar baidu.lang.guid()
     * @returns {String} 当前页面的唯一标识字符串
     */
    baidu.lang.guid = function () {
      return "TANGRAM__" + (window[baidu.guid]._counter++).toString(36);
    };

    window[baidu.guid]._counter = window[baidu.guid]._counter || 1;

    /**
     * 所有类的实例的容器
     * key为每个实例的guid
     */
    window[baidu.guid]._instances = window[baidu.guid]._instances || {};

    /**
     * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
     * @function
     * @name baidu.lang.Class
     * @grammar baidu.lang.Class(guid)
     * @param {string} guid	对象的唯一标识
     * @meta standard
     * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。
     * guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>
     * baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
     */
    baidu.lang.Class = function (guid) {
      this.guid = guid || baidu.lang.guid();
      window[baidu.guid]._instances[this.guid] = this;
    };

    window[baidu.guid]._instances = window[baidu.guid]._instances || {};

    /**
     * 判断目标参数是否string类型或String对象
     * @name baidu.lang.isString
     * @function
     * @grammar baidu.lang.isString(source)
     * @param {Any} source 目标参数
     * @shortcut isString
     * @meta standard
     *             
     * @returns {boolean} 类型判断结果
     */
    baidu.lang.isString = function (source) {
      return '[object String]' == Object.prototype.toString.call(source);
    };
    baidu.isString = baidu.lang.isString;

    /**
     * 判断目标参数是否为function或Function实例
     * @name baidu.lang.isFunction
     * @function
     * @grammar baidu.lang.isFunction(source)
     * @param {Any} source 目标参数
     * @returns {boolean} 类型判断结果
     */
    baidu.lang.isFunction = function (source) {
      return '[object Function]' == Object.prototype.toString.call(source);
    };
    baidu.isFunction = baidu.lang.isFunction;

    /**
     * 判断目标参数是否Object类型或Object对象
     * @name baidu.lang.isObject
     * @function
     * @grammar baidu.lang.isObject(source)
     * @param {Any} source 目标参数
     * @shortcut isObject
     * @meta standard
     *             
     * @returns {boolean} 类型判断结果
     */
    baidu.lang.isObject = function (source) {
      return '[object Object]' == Object.prototype.toString.call(source);
    };
    baidu.isObject = baidu.lang.isObject;

    /**
     * 判断目标参数是否数字类型
     * @name baidu.lang.isNumber
     * @function
     * @grammar baidu.lang.isNumber(source)
     * @param {Any} source 目标参数
     * @shortcut isNumber
     * @meta standard
     *             
     * @returns {boolean} 类型判断结果
     */
    baidu.lang.isNumber = function (source) {
      return !isNaN(source / 1);
    };
    baidu.isNumber = baidu.lang.isNumber;

    /**
     * 判断目标参数是否bool类型
     * @name baidu.lang.isBoolean
     * @function
     * @grammar baidu.lang.isBoolean(source)
     * @param {Any} source 目标参数
     * @shortcut isBoolean
     * @meta standard
     *             
     * @returns {boolean} 类型判断结果
     */
    baidu.lang.isBoolean = function (source) {
      return typeof source == 'boolean';
    };
    baidu.isBoolean = baidu.lang.isBoolean;

    /**
     * 判断目标参数是否Array类型
     * @name baidu.lang.isArray
     * @function
     * @grammar baidu.lang.isArray(source)
     * @param {Any} source 目标参数
     * @shortcut isArray
     * @meta standard
     *             
     * @returns {boolean} 类型判断结果
     */
    baidu.lang.isArray = function (source) {
      return source instanceof Array;
    };
    baidu.isArray = baidu.lang.isArray;

    /**
     * 简易模板解析函数
     * @name baidu.lang.tmp
     * @function
     * @grammar baidu.lang.tmp('', {title: 'title1'})
     * @param {String} tpl 模板字符串
     * @param {Object|Array} parse 需要解析的模板占位符及需要替换的值
     * @shortcut isString
     * @meta standard
     * 
     * @returns {String} 解析后的字符串
     */
    baidu.lang.tmp = function (tpl, parse) {
      if (!baidu.isString(tpl)) return '';
      if (!(parse instanceof Array)) {
        parse = [parse];
      }
      var parseString = '';
      parse.forEach(function (obj) {
        parseString += tpl.replace(/{{\s*\w+\s*}}/g, function (matchs) {
          var returns = obj[matchs.replace(/{/g, "").replace(/}/g, "").trim()];
          return (returns + "") == "undefined" ? "" : returns;
        })
      });
      return parseString;
    };
    baidu.tmp = baidu.lang.tmp;

    /**
     * 自定义的事件对象。
     * @function
     * @name baidu.lang.Event
     * @grammar baidu.lang.Event(type[, target])
     * @param {string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
     * @param {Object} [target]触发事件的对象
     * @meta standard
     * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
     * @see baidu.lang.Class
     */
    baidu.lang.Event = function (type, target) {
      this.type = type;
      this.returnValue = true;
      this.target = target || null;
      this.currentTarget = null;
    };

    /**
     * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
     * @grammar obj.addEventListener(type, handler[, key])
     * @param 	{string}   type         自定义事件的名称
     * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
     * @param 	{string}   [key]		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
     * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
     */
    baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
      if (!baidu.lang.isFunction(handler)) {
        return;
      } !this.__listeners && (this.__listeners = {});
      var t = this.__listeners,
        id;
      if (typeof key == "string" && key) {
        if (/[^\w\-]/.test(key)) {
          throw ("nonstandard key:" + key);
        } else {
          handler.hashCode = key;
          id = key;
        }
      }
      type.indexOf("on") != 0 && (type = "on" + type);
      typeof t[type] != "object" && (t[type] = {});
      id = id || baidu.lang.guid();
      handler.hashCode = id;
      t[type][id] = handler;
    };

    /**
     * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
     * @grammar obj.removeEventListener(type, handler)
     * @param {string}   type     事件类型
     * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
     * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
     */
    baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
      if (baidu.lang.isFunction(handler)) {
        handler = handler.hashCode;
      } else if (!baidu.lang.isString(handler)) {
        return;
      } !this.__listeners && (this.__listeners = {});
      type.indexOf("on") != 0 && (type = "on" + type);
      var t = this.__listeners;
      if (!t[type]) {
        return;
      }
      t[type][handler] && delete t[type][handler];
    };

    /**
     * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
     * @grammar obj.dispatchEvent(event, options)
     * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
     * @param {Object} options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
     * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。
     * 例如：<br>
     * myobj.onMyEvent = function(){}<br>
     * myobj.addEventListener("onMyEvent", function(){});
     */
    baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
      if (baidu.lang.isString(event)) {
        event = new baidu.lang.Event(event);
      } !this.__listeners && (this.__listeners = {});
      options = options || {};
      for (var i in options) {
        event[i] = options[i];
      }
      var i, t = this.__listeners,
        p = event.type;
      event.target = event.target || this;
      event.currentTarget = this;
      p.indexOf("on") != 0 && (p = "on" + p);
      baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);
      if (typeof t[p] == "object") {
        for (i in t[p]) {
          t[p][i].apply(this, arguments);
        }
      }
      return event.returnValue;
    };

    /**
     * @ignore
     * @namespace baidu.dom 
     * 操作dom的方法
     */
    baidu.dom = baidu.dom || {};

    /**
     * 从文档中获取指定的DOM元素
     * **内部方法**
     * 
     * @param {string|HTMLElement} id 元素的id或DOM元素
     * @meta standard
     * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
     */
    baidu.dom._g = function (id) {
      if (baidu.lang.isString(id)) {
        return document.getElementById(id);
      }
      return id;
    };
    baidu._g = baidu.dom._g;

    /**
     * @ignore
     * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
     * @property target 	事件的触发元素
     * @property pageX 		鼠标事件的鼠标x坐标
     * @property pageY 		鼠标事件的鼠标y坐标
     * @property keyCode 	键盘事件的键值
     */
    baidu.event = baidu.event || {};

    /**
     * 事件监听器的存储表
     * @private
     * @meta standard
     */
    baidu.event._listeners = baidu.event._listeners || [];

    /**
     * 为目标元素添加事件监听器
     * @name baidu.event.on
     * @function
     * @grammar baidu.event.on(element, type, listener)
     * @param {HTMLElement|string|window} element 目标元素或目标元素id
     * @param {string} type 事件类型
     * @param {Function} listener 需要添加的监听器
     * @remark
     * 
    1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
    2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败
        
     * @shortcut on
     * @meta standard
     * @see baidu.event.un
     * @returns {HTMLElement|window} 目标元素
     */
    baidu.event.on = function (element, type, listener) {
      type = type.replace(/^on/i, '');
      element = baidu.dom._g(element);

      var realListener = function (ev) {
        listener.call(element, ev);
      },
        lis = baidu.event._listeners,
        filter = baidu.event._eventFilter,
        afterFilter, realType = type;
      type = type.toLowerCase();
      if (filter && filter[type]) {
        afterFilter = filter[type](element, type, realListener);
        realType = afterFilter.type;
        realListener = afterFilter.listener;
      }
      if (element.addEventListener) {
        element.addEventListener(realType, realListener, false);
      } else if (element.attachEvent) {
        element.attachEvent('on' + realType, realListener);
      }
      lis[lis.length] = [element, type, listener, realListener, realType];
      return element;
    };
    baidu.on = baidu.event.on;

    /**
     * 为目标元素移除事件监听器
     * @name baidu.event.un
     * @function
     * @grammar baidu.event.un(element, type, listener)
     * @param {HTMLElement|string|window} element 目标元素或目标元素id
     * @param {string} type 事件类型
     * @param {Function} listener 需要移除的监听器
     * @shortcut un
     * @meta standard
     * @see baidu.event.on
     *             
     * @returns {HTMLElement|window} 目标元素
     */
    baidu.event.un = function (element, type, listener) {
      element = baidu.dom._g(element);
      type = type.replace(/^on/i, '').toLowerCase();

      var lis = baidu.event._listeners,
        len = lis.length,
        isRemoveAll = !listener,
        item, realType, realListener;
      while (len--) {
        item = lis[len];
        if (item[1] === type && item[0] === element && (isRemoveAll || item[2] === listener)) {
          realType = item[4];
          realListener = item[3];
          if (element.removeEventListener) {
            element.removeEventListener(realType, realListener, false);
          } else if (element.detachEvent) {
            element.detachEvent('on' + realType, realListener);
          }
          lis.splice(len, 1);
        }
      }

      return element;
    };
    baidu.un = baidu.event.un;

    /**
     * 阻止事件的默认行为
     * @name baidu.event.preventDefault
     * @function
     * @grammar baidu.event.preventDefault(event)
     * @param {Event} event 事件对象
     * @meta standard
     */
    baidu.preventDefault = baidu.event.preventDefault = function (event) {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    };
  })();
  /*** baidu 代码开始 ***/

  /*** utils.map.default 代码开始 ***/
  /**
   * @class
   * @alias utils.map.default
   * @description 记录各种marker背景图标定义,每新增一种类型,需手工维护此文档
   * @type typeJson
   * @example 类型状态配置Json说明
   * {
   *  url: 'url(../image.png)',     //必要属性 图标链接 
   *  size: new BMap.Size(64, 64),  //必要属性 图标大小
   *  status: '状态'                //非必要属性 图标所标识的状态
   * }
   * 
   */
  utils.map.default = function () {
  };

  (function () {

    /**
     * 存放实例化后的BMap对象
     * @const utils.map.default._map
     */
    utils.map.default._map = null;
    /**
     * 组织图标信息，无状态属性
     * @property {Json}  utils.map.default.Org.Qif_Org 组织图标信息
     */
    utils.map.default.Org = {
      Qif_Org: {
        url: 'url(/Images/yunweiban.png)',
        size: new BMap.Size(50, 40),
        status: ''
      }
    };

    /**
     * 变电站各种状态图标信息
     * @property {Json}  utils.map.default.Rcu.Qif_Online 变电站在线状态图标信息
     * @property {Json}  utils.map.default.Rcu.Qif_Offline 变电站离线线状态图标信息
     * @property {Json}  utils.map.default.Rcu.Qif_On_Alarm 变电站在线报警状态图标信息
     * @property {Json}  utils.map.default.Rcu.Qif_Off_Alarm 变电站离线报警状态图标信息
     */
    utils.map.default.Rcu = {
      Qif_Online: {
        url: 'url(/Nodes/images/Ronline.png)',
        size: new BMap.Size(27, 35),
        status: '在线'
      },
      Qif_Offline: {
        url: 'url(/Nodes/images/Roffline.png)',
        size: new BMap.Size(27, 35),
        status: '离线'
      },
      Qif_On_Alarm: {
        url: 'url(/Nodes/images/Ronline_a.gif)',
        size: new BMap.Size(27, 35),
        status: '在线|报警'
      },
      Qif_Off_Alarm: {
        url: 'url(/Nodes/images/Roffline_a.gif)',
        size: new BMap.Size(27, 35),
        status: '离线|报警'
      }
    };

    /**
     * 配网所各种状态图标信息
     * @property {Json}  utils.map.default.Network.Qif_Online 配网所在线状态图标信息
     * @property {Json}  utils.map.default.Network.Qif_Offline 配网所离线线状态图标信息
     * @property {Json}  utils.map.default.Network.Qif_On_Alarm 配网所在线报警状态图标信息
     * @property {Json}  utils.map.default.Network.Qif_Off_Alarm 配网所离线报警状态图标信息
     */
    utils.map.default.Network = {
      Qif_Online: {
        url: 'url(/Nodes/images/Nonline.png)',
        size: new BMap.Size(27, 35),
        status: '在线'
      },
      Qif_Offline: {
        url: 'url(/Nodes/images/Noffline.png)',
        size: new BMap.Size(27, 35),
        status: '离线'
      },
      Qif_On_Alarm: {
        url: 'url(/Nodes/images/Nonline_a.gif)',
        size: new BMap.Size(27, 35),
        status: '在线|报警'
      },
      Qif_Off_Alarm: {
        url: 'url(/Nodes/images/Noffline_a.gif)',
        size: new BMap.Size(27, 35),
        status: '离线|报警'
      }
    };

    /**
     * 环网柜各种状态图标信息
     * @property {Json}  utils.map.default.RingNet.Qif_Online 环网柜在线状态图标信息
     * @property {Json}  utils.map.default.RingNet.Qif_Offline 环网柜离线线状态图标信息
     * @property {Json}  utils.map.default.RingNet.Qif_On_Alarm 环网柜在线报警状态图标信息
     * @property {Json}  utils.map.default.RingNet.Qif_Off_Alarm 环网柜离线报警状态图标信息
     */
    utils.map.default.RingNet = {
      Qif_Online: {
        url: 'url(/Nodes/images/Honline.png)',
        size: new BMap.Size(27, 35),
        status: '在线'
      },
      Qif_Offline: {
        url: 'url(/Nodes/images/Hoffline.png)',
        size: new BMap.Size(27, 35),
        status: '离线'
      },
      Qif_On_Alarm: {
        url: 'url(/Nodes/images/Honline_a.gif)',
        size: new BMap.Size(27, 35),
        status: '在线|报警'
      },
      Qif_Off_Alarm: {
        url: 'url(/Nodes/images/Hoffline_a.gif)',
        size: new BMap.Size(27, 35),
        status: '离线|报警'
      }
    };

    /**
     * 机器人各种状态图标信息
     * @property {Json}  utils.map.default.Robot.Qif_Online 机器人在线状态图标信息
     * @property {Json}  utils.map.default.Robot.Qif_Offline 机器人离线线状态图标信息
     */
    utils.map.default.Robot = {
      Qif_Online: {
        url: 'url(/Nodes/images/Robot_Online.png)',
        size: new BMap.Size(30, 40),
        status: '在线'
      },
      Qif_Offline: {
        url: 'url(/Nodes/images/Robot_Offline.png)',
        size: new BMap.Size(30, 40),
        status: '离线'
      }
    };

    /**
     * 防外破各种状态图标信息
     * @property {Json}  utils.map.default.Smd.Qif_Online 防外破在线状态图标信息
     * @property {Json}  utils.map.default.Smd.Qif_On_Alarm 防外破在线报警状态图标信息
     */
    utils.map.default.Smd = {
      Qif_Online: {
        url: 'url(/Nodes/images/smd_Online.png)',
        size: new BMap.Size(27, 35),
        status: '在线'
      },
      Qif_On_Alarm: {
        url: 'url(/Nodes/images/smd_Alarm.gif)',
        size: new BMap.Size(27, 35),
        status: '报警'
      }
    };

    /**
     * 室内地面机器人各种状态图标信息
     * @property {Json}  utils.map.default[70220002].Qif_Inspection 室内地面机器人巡检状态图标信息
     * @property {Json}  utils.map.default[70220002].Qif_Fault 室内地面机器人故障报警状态图标信息
     * @property {Json}  utils.map.default[70220002].Qif_Stop 室内地面机器人停止报警状态图标信息
     */
    utils.map.default[70220002] = {
      Qif_Inspection: {
        url: 'url(/Nodes/images/Fold_Inspection.png)',
        size: new BMap.Size(64, 64),
        status: '巡检'
      },
      Qif_Fault: {
        url: 'url(/Nodes/images/Fold_Inspection.png)',
        size: new BMap.Size(64, 64),
        status: '故障'
      },
      Qif_Stop: {
        url: 'url(/Nodes/images/Fold_Inspection.png)',
        size: new BMap.Size(64, 64),
        status: ''
      }
    };

    /**
     * 室外机器人各种状态图标信息
     * @property {Json}  utils.map.default[70220003].Qif_Inspection 室外机器人巡检状态图标信息
     * @property {Json}  utils.map.default[70220003].Qif_Fault 室外机器人故障报警状态图标信息
     * @property {Json}  utils.map.default[70220003].Qif_Stop 室外机器人停止报警状态图标信息
     */
    utils.map.default[70220003] = {
      Qif_Inspection: {
        url: 'url(/Nodes/images/Outdoor_Inspection.png)',
        size: new BMap.Size(64, 64),
        status: '巡检'
      },
      Qif_Fault: {
        url: 'url(/Nodes/images/Outdoor_Inspection.png)',
        size: new BMap.Size(64, 64),
        status: '故障'
      },
      Qif_Stop: {
        url: 'url(/Nodes/images/Outdoor_Inspection.png)',
        size: new BMap.Size(64, 64),
        status: '停止'
      }
    };

    /**
     * 虚拟机器人各种状态图标信息
     * @property {Json}  utils.map.default[70220004].Qif_Inspection 虚拟机器人巡检状态图标信息
     * @property {Json}  utils.map.default[70220004].Qif_Fault 虚拟机器人故障报警状态图标信息
     * @property {Json}  utils.map.default[70220004].Qif_Stop 虚拟机器人停止报警状态图标信息
     */
    utils.map.default[70220004] = {
      Qif_Inspection: {
        url: 'url(/Nodes/images/Virtual_Inspection.png)',
        size: new BMap.Size(64, 64),
        status: '巡检'
      },
      Qif_Fault: {
        url: 'url(/Nodes/images/Virtual_Inspection.png)',
        size: new BMap.Size(64, 64),
        status: '故障'
      },
      Qif_Stop: {
        url: 'url(/Nodes/images/Virtual_Inspection.png)',
        size: new BMap.Size(64, 64),
        status: '停止'
      }
    };

    /**
     * 获取预设的Marker背景图标相关信息
     * @param {String} type 需要获取的图标的类型
     * @param {String} subtype 需要获取的图标的子类型
     * @returns {undefined|Json} 匹配的预设图标信息
     */
    utils.map.default.prototype.getIcon = function (type, subtype) {
      var returns = undefined;
      if (baidu.isString(type) && type.trim() != '') {
        returns = this[type];
      }
      if (returns !== undefined && baidu.isString(subtype) && subtype.trim() != '') {
        returns = returns[subtype];
      }
      return returns;
    }

    /**
     * 设置公共的Marker背景图标相关信息
     * 使用频率较低的图标可以通过此方法在页面头部预先定义
     * 使用频率较高的图标可以通过在文件中预设图标对象形式定义
     * @param {String} type 需要定义的图标的类型
     * @param {Json} opts 需要定义的图标的信息
     * @param {String} opts.type 需要定义的图标的子类型
     * @param {String} opts.type.url 需要定义的图标的链接
     * @param {BMap.Size} opts.type.size 需要定义的图标的大小
     * @param {String} opts.type.stauts 需要定义的图标所标识的状态
     * @returns {Boolean} 添加成功返回true，检测到有重复类型则返回false
     */
    utils.map.default.prototype.setIcon = function (type, opts) {
      if (this[type] == undefined) {
        this[type] = opts;
        return true;
      }
      return false;
    }
  })()
  /*** utils.map.default 代码结束 ***/


  /*** utils.map.RMarker 代码开始 ***/
  /**
   * utils.map.RMarker类的构造函数
   * @class utils.map.RMarker
   * @description 自定义复杂覆盖物类，实现丰富的Marker展现效果。 {@link http://172.26.1.40/docs/examples/rmarker.html|RMarker示例}
   * 
   * @constructor
   * @param {BMap.Point} position marker的位置
   * @param {Json|String|HTMLElement} content 自定义marker内容，可以是Json对象( eg: {url: {String}, size: {BMap.Size}} )，可以是字符串，也可以是dom节点
   * @param {String} content.url marker背景图标链接
   * @param {BMap.Size} content.size marker背景图标大小
   * @param {Json} RMarkerOptions 可选的输入参数，非必填项。可输入选项包括：
   * @param {BMap.Size} RMarkerOptions.anchor Marker的的位置偏移值
   * @param {Boolean} RMarkerOptions.enableDragging 是否启用拖拽，默认为false
   * @param {Boolean} RMarkerOptions.isShowText 是否显示marker名称，默认为true
   * @param {Boolean} RMarkerOptions.isShowCount 是否显示marker角标，默认为false
   * @param {Boolean} RMarkerOptions.count marker角标，可以是数字，也可以是文本
   * @param {String} RMarkerOptions.text marker名称
   * @param {Json} RMarkerOptions.countTheme 角标主题色
   * @param {String} RMarkerOptions.countTheme.bgColor 浏览器可以识别的颜色值，默认半透明黑色
   * @param {String} RMarkerOptions.countTheme.color 浏览器可以识别的颜色值，默认白色
   * @param {Json} RMarkerOptions.textTheme marker名称主题色
   * @param {String} RMarkerOptions.textTheme.bgColor 浏览器可以识别的颜色值，默认半透明黑色
   * @param {String} RMarkerOptions.textTheme.color 浏览器可以识别的颜色值，默认白色
   *
   * @example 参考示例1：
   * var map = new BMap.Map("container");
   * map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);
   * var htm = "<div style='background:#E7F0F5;color:#0082CB;border:1px solid #333'>"
   *              +     "欢迎使用百度地图！"
   *              +     "<img src='http://map.baidu.com/img/logo-map.gif' border='0' />"
   *              + "</div>";
   * var point = new BMap.Point(116.30816, 40.056863);
   * var myRMarkerObject = new utils.map.RMarker(point, htm, { "anchor": new BMap.Size(-72, -84), "enableDragging": true, });
   * map.addOverlay(myRMarkerObject);
   * 
   * @example 参考示例2：
   * var map = new BMap.Map("container");
   * map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);
   * var point = new BMap.Point(116.30816, 40.056863);
   * var myRMarkerObject =  new utils.map.RMarker(point, {
          url: 'images/yunweiban.png',
          size: new BMap.Size(50, 40)
        }, {
          anchor: new BMap.Size(-47, -116),
          enableDragging: true,
          text: '耶路撒冷的冷',
          count: 10,
          isShowCount: true,
          attrs: { //自定义属性可以在这里添加
            rcuId: 123
          }
        });
   * map.addOverlay(myRMarkerObject);
   */
  utils.map.RMarker = function (position, content, opts) {
    if (!content || !position || !(position instanceof BMap.Point)) {
      return;
    }

    /**
     * map对象
     * @private
     * @type {Map}
     */
    this._map = null;

    /**
     * Marker内容
     * @private
     * @type {String | HTMLElement}
     */
    this._content = content;

    /**
     * marker显示位置
     * @private
     * @type {BMap.Point}
     */
    this._position = position;

    /**
     * marker主容器
     * @private
     * @type {HTMLElement}
     */
    this._container = null;

    /**
     * marker主容器的尺寸
     * @private
     * @type {BMap.Size}
     */
    this._size = null;

    opts = opts || {};
    /**
     * _opts是默认参数赋值。
     * 下面通过用户输入的opts，对默认参数赋值
     * @private
     * @type {Json}
     */
    this._opts = baidu.extend(
      baidu.extend(
        baidu.extend(this._opts || {}, {
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
        }), content), opts);

    if (baidu.isObject(content) && baidu.isString(content.url) && content.size instanceof BMap.Size) {
      this._content = this._preRenderContent({
        url: content.url,
        height: content.size.height,
        width: content.size.width,
        text: this._opts.text,
        count: this._opts.count,
        isShowText: this._opts.isShowText,
        isShowCount: this._opts.isShowCount,
        lng: position.lng,
        lat: position.lat,
        textStyle: this._convertThemeToString(this._opts.textTheme),
        countStyle: this._convertThemeToString(this._opts.countTheme)
      });
    }
  }

  // 继承覆盖物类
  utils.map.RMarker.prototype = new BMap.Overlay();

  /**
   * 预渲染content内容
   *  1. 若content是一个String or HTMLElement 则直接返回
   *  2. 若content是一个Json对象 则渲染成固定dom结构
   * @param {Json|String|HTMLElement} content 预渲染content内容
   * @param {String} content.url 背景图标链接
   * @param {BMap.Size} content.size 背景图标大小
   * @param {Boolean} content.isShowText 是否显示marker名称
   * @param {Boolean} content.isShowCount 是否显示marker角标
   * @param {Number} content.count marker角标内容
   * @param {String} content.text marker名称
   * @param {Number} content.lng marker坐标纬度
   * @param {Number} content.lat marker坐标经度
   */
  utils.map.RMarker.prototype._preRenderContent = function (content) {
    if (baidu.isObject(content)) {
      var html = '';
      html += '<div class="BMap_RMarker" lng="{{ lng }}" lat="{{ lat }}">';
      html += '  <em class="BMap_RMarker_Icon" style="background-image: url({{ url }}); height: {{ height }}px; width: {{ width }}px;"></em>';
      if (content.isShowText) html += '  <label class="BMap_RMarker_Label" style="{{ textStyle }}">{{ text }}</label>';
      if (content.isShowCount) html += '  <label class="BMap_RMarker_Badge" style="{{ countStyle }}">{{ count }}</label>';
      html += '</div > ';

      return baidu.tmp(html, content);
    }
    return content;
  }

  /**
   * 处理样式对象
   *  此后个性化marker设置 需改此处
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
   */
  utils.map.RMarker.prototype._renderPresetStyles = function () {
    var style = document.createElement('style');
    var innerHtml = '.BMap_RMarker{ position: absolute; font-size: 12px; }';
    innerHtml += '.BMap_RMarker .BMap_RMarker_Icon{ background-repeat: no-repeat; background-size: cover; display: block; margin: 0 auto; }';
    innerHtml += '.BMap_RMarker .BMap_RMarker_Label{ white-space: nowrap; padding: 3px; margin-top: 5px; position: relative; display: inline-block; box-sizing: border-box; text-align: center; min-width: 100%; border-radius: 50px; background: rgba(41, 41, 41, 0.65); color: #fff; }';
    innerHtml += '.BMap_RMarker .BMap_RMarker_Badge{ position: absolute; top: -15px; left: 50%; box-sizing: border-box; margin-left: 10px; padding: 0 6px; height: 20px; line-height: 20px; min-width: 20px; text-align: center; z-index: 100; border-radius: 50px; background: rgba(41, 41, 41, 0.65); color: #fff; }';
    style.innerHTML = innerHtml;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  /**
   * 初始化，实现自定义覆盖物的initialize方法
   * 主要生成Marker的主容器，填充自定义的内容，并附加事件
   * 
   * @private
   * @param {BMap} map map实例对象
   * @return {Dom} 返回自定义生成的dom节点
   */
  utils.map.RMarker.prototype.initialize = function (map) {
    var me = this,
      div = me._container = document.createElement("div");
    me._map = map;
    baidu.extend(div.style, {
      position: "absolute",
      zIndex: BMap.Overlay.getZIndex(me._position.lat),
      background: "#FFF",
      cursor: "pointer"
    });
    map.getPanes().labelPane.appendChild(div);

    // 给marker添加自定义样式
    me._renderPresetStyles();
    // 给主容器添加上用户自定义的内容
    me._appendContent();
    // 给主容器添加事件处理
    me._setEventDispath();
    // 获取主容器的高宽
    me._getContainerSize();

    return div;
  }

  /**
   * 为自定义的Marker设定显示位置，实现自定义覆盖物的draw方法
   * 
   * @private
   */
  utils.map.RMarker.prototype.draw = function () {
    var map = this._map,
      anchor = this._opts.anchor,
      pixel = map.pointToOverlayPixel(this._position);
    this._container.style.left = pixel.x + anchor.width + "px";
    this._container.style.top = pixel.y + anchor.height + "px";
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
    this.draw();
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
    this.draw();
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
    if (baidu.isObject(content)) {
      this._opts = baidu.extend(this._opts, {
        url: baidu.isString(content.url) ? content.url : this._opts.url,
        size: content.size instanceof BMap.Size ? content.size : this._opts.size,
        text: baidu.isString(content.text) ? content.text : this._opts.text,
        count: baidu.isNumber(content.count) ? content.count : this._opts.count,
        isShowText: baidu.isBoolean(content.isShowText) ? content.isShowText : this._opts.isShowText,
        isShowCount: baidu.isBoolean(content.isShowCount) ? content.isShowCount : this._opts.isShowCount,
        textTheme: baidu.isObject(content.textTheme) ? content.textTheme : this._opts.textTheme,
        countTheme: baidu.isObject(content.countTheme) ? content.countTheme : this._opts.countTheme
      });
      console.warn(this._opts);
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
      isMouseDown = false,
      // 鼠标是否按下，用以判断鼠标移动过程中的拖拽计算
      startPosition = null; // 拖拽时，鼠标按下的初始位置，拖拽的辅助计算参数   

    // 通过e参数获取当前鼠标所在位置
    function _getPositionByEvent(e) {
      var e = window.event || e,
        x = e.pageX || e.clientX || 0,
        y = e.pageY || e.clientY || 0,
        pixel = new BMap.Pixel(x, y),
        point = me._map.pixelToPoint(pixel);
      return {
        "pixel": pixel,
        "point": point
      };
    }

    // 单击事件
    baidu.on(div, "onclick", function (e) {
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
      _dispatchEvent(me, "onclick");
      _stopAndPrevent(e);
    });

    // 双击事件
    baidu.on(div, "ondblclick", function (e) {
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
        "pixel": position.pixel
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
        "pixel": position.pixel
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
        "pixel": position.pixel
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
        "pixel": position.pixel
      });

      if (me._container.releaseCapture) {
        baidu.un(div, "onmousemove", mouseMoveEvent);
        baidu.un(div, "onmouseup", mouseUpEvent);
      } else {
        baidu.un(window, "onmousemove", mouseMoveEvent);
        baidu.un(window, "onmouseup", mouseUpEvent);
      }

      // 判断是否需要进行拖拽事件的处理
      if (!me._opts.enableDragging) {
        _stopAndPrevent(e);
        return;
      }
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
        "pixel": position.pixel
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
      me.draw();
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
        "pixel": position.pixel
      });
      _stopAndPrevent(e);
    }

    // 鼠标按下事件
    baidu.on(div, "onmousedown", function (e) {
      var position = _getPositionByEvent(e);
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
        "pixel": position.pixel
      });

      if (me._container.setCapture) {
        baidu.on(div, "onmousemove", mouseMoveEvent);
        baidu.on(div, "onmouseup", mouseUpEvent);
      } else {
        baidu.on(window, "onmousemove", mouseMoveEvent);
        baidu.on(window, "onmouseup", mouseUpEvent);
      }

      // 判断是否需要进行拖拽事件的处理
      if (!me._opts.enableDragging) {
        _stopAndPrevent(e);
        return;
      }
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
        "pixel": position.pixel
      });
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
    _dispatchEvent(this, "onremove");
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
   * 注册对象的事件监听器
   * @grammar obj.addEventListener(type, handler[, key])
   * @param 	{string}   type         自定义事件的名称 事件名称包括(on)click (on)dbclick (on)mouseover (on)mouseout (on)mousedown (on)mouseup (on)dragend (on)dragging (on)dragstart
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
    baidu.lang.addEventListener(type, handler, key);
  }

  /**
   * 移除对象的事件监听器
   * @grammar obj.removeEventListener(type, handler)
   * @param {string}   type     事件类型 事件名称包括(on)click (on)dbclick (on)mouseover (on)mouseout (on)mousedown (on)mouseup (on)dragend (on)dragging (on)dragstart
   * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
   * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
   * 
   * @example 参考示例：
   * myRMarkerObject.off("ondragend");
   */
  utils.map.RMarker.prototype.off = function (type, handler) {
    baidu.lang.removeEventListener(type, handler);
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
    var event = new baidu.lang.Event(type);
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
    return baidu.preventDefault(e);
  }
  /*** utils.map.RMarker 代码结束 ***/

  /*** utils.map.RManager 代码开始 ***/
  /**
   * utils.map.RManager类的构造函数
   * @class utils.map.RManager
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
   * @param {Number} opts.padding 可视区域的外填充，默认 6
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
    this.padding = baidu.isNumber(opts.padding) ? opts.padding : 0;
    this.minZoom = baidu.isNumber(opts.minZoom) ? opts.minZoom : 6;
    this.maxZoom = baidu.isNumber(opts.maxZoom) ? opts.maxZoom : 16;
    this._filter = baidu.isFunction(opts.filter) ? opts.filter : function () { return true; };
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
    overlay.attrs.minZoom = overlay._opts.attrs.minZoom = baidu.isNumber(opts.minZoom) ? opts.minZoom : overlay._opts.attrs.minZoom;
    overlay.attrs.maxZoom = overlay._opts.attrs.maxZoom = baidu.isNumber(opts.maxZoom) ? opts.maxZoom : overlay._opts.attrs.maxZoom;
    overlay.attrs._isAdded = false;     //当前覆盖物是否已经添加到地图上
    overlay.attrs._isVisible = false;   //当前覆盖物是否被显示
    overlay.attrs._isInViewing = false; //当前覆盖物位置是否在可视区域内

    this._overlays.push(overlay);
    return true;
  }
  /**
   * 批量添加相同缩放级别范围中的overlay(覆盖物)
   * @param [BMap.Overlay] overlays 需要添加到地图上的覆盖物列表
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
    filter = baidu.isFunction(filter) ? filter : this._filter;
    this._visible = true;
    this._toggleOverlays(filter);
  }
  /**
   * 隐藏可视区内覆盖物
   * 此方法通过操作元素display属性实现显隐的目的
   * @param {Function} filter 可选，过滤覆盖物的函数钩子，必须返回boolean类型的值，默认为RManager的属性_filter
   */
  utils.map.RManager.prototype.hide = function (filter) {
    filter = baidu.isFunction(filter) ? filter : this._filter;
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
    var _zoom = this._map.getZoom();
    var _bounds = this._getRealBounds();
    filter = baidu.isFunction(filter) ? filter : this._filter;
    for (var i = 0, _overlay; _overlay = this._overlays[i]; i++) {
      //判断是否在可视区域内  &&  判断当前缩放级别是否符合覆盖物的缩放级别显示范围
      if (_bounds.containsPoint(_overlay.getPosition()) && _zoom >= _overlay.attrs.minZoom && _zoom <= _overlay.attrs.maxZoom) {
        _overlay.attrs._isInViewing = true;
        if (!_overlay.attrs._isAdded) {
          this._map.addOverlay(_overlay);
          _overlay.attrs._isAdded = true;
          !this._visible && _overlay.hide();
        } else {
          if (filter(_overlay)) {
            this._visible ? _overlay.show() : _overlay.hide();
          } else {
            _overlay.hide();
          }
        }
      } else if (_overlay.attrs._isAdded) {
        _overlay.attrs._isInViewing = false;
        _overlay.hide();
      }
    }
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
    if (!baidu.isString(key)) key = 'id';
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
    if (!baidu.isFunction(filter)) {
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

  /*** utils.map.RData 代码开始 ***/
  
  /*** utils.map.RData 代码结束 ***/
})();