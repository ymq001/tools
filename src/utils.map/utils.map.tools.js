(function (utils) {
  utils.map = utils.map = utils.map || {};

  /*** baidu 代码开始 ***/
  /**
   * 声明baidu包
   * 内置工具类
   * @private
   */
  var baidu = baidu || {
    guid: "$BAIDU$"
  };

  utils.map.tools = baidu;

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
  /*** baidu 代码开始 ***/
})(window.utils || (window.utils = {}))