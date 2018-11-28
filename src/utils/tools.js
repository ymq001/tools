export let tools = {
  /**
   * 判断输入是否是Object类型
   * @param {any} input 任意类型的对象
   * @returns {Boolean}
   * @example 
   *  utils.isObject({})  // true
   */
  isObject: function (input) {
    return Object.prototype.toString.call(input) == '[object Object]';
  },
  /**
   * 判断输入是否是Array类型
   * @param {any} input 任意类型的对象
   * @returns {Boolean}
   * @example 
   *  utils.isArray([])  //true
   */
  isArray: function (input) {
    return input instanceof Array || Object.prototype.toString.call(input) == '[object Array]';
  },
  /**
   * 判断输入是否是Date类型
   * @param {any} input 任意类型的对象
   * @returns {Boolean}
   * @example 
   *  utils.isDate(new Date())  //true
   */
  isDate: function (input) {
    return input instanceof Date || Object.prototype.toString.call(input) == '[object Date]';
  },
  /**
   * 判断是否是Number类型
   * @param {any} input 任意类型的对象
   * @returns {Boolean}
   * @example 
   *  utils.isNumber(2)  //true
   */
  isNumber: function (input) {
    return input instanceof Number || Object.prototype.toString.call(input) == '[object Number]';
  },
  /**
   * 判断输入是否整型
   * @param {any} input 任意类型的对象
   * @returns {Boolean}
   * @example
   *  utils.isInteger(1.2)  //false
   */
  isInteger: function (input) {
    return Number.isInteger(input);
  },
  /**
   * 判断输入是否是String类型
   * @param {any} input 任意类型的对象
   * @returns {Boolean}
   * @example
   *  utils.isString('2') //true
   */
  isString: function (input) {
    return input instanceof String || Object.prototype.toString.call(input) == '[object String]';
  },
  /**
   * 判断输入是否是Bool类型
   * @param {any} input 任意类型的对象
   * @returns {Boolean}
   * @example
   *  utils.isBoolean(false) //true
   */
  isBoolean: function (input) {
    return typeof input == 'boolean';
  },
  /**
   * 判断输入是否是Function(函数)
   * @param {any} input 任意类型的对象
   * @returns {Boolean}
   * @example
   *  utils.isFunction(function(){}) //true
   */
  isFunction: function (input) {
    return typeof input == 'function';
  },
  /**
   * 判断输入是否为 null
   * @param {any} input 任意类型的对象
   * @returns {Boolean}
   * @example
   *  utils.isNull(null) //true
   */
  isNull: function (input) {
    return input === null;
  },
  /**
   * 判断输入是否为undefined 或 null
   * @param {any} input 任意类型的对象
   * @returns {Boolean}
   * @example
   *  utils.isNil(null) //true
   */
  isNil: function (input) {
    return input === undefined || input === null;
  },
  /**
   * 判断对象是否是字面量形式创建的对象
   * @param {Object} obj 需要被检测的对象
   * @returns {Boolean}
   * @example
   *  utils.isPlainObject(new Object()) //true
   */
  isPlainObject: function (obj) {
    if (obj && Object.prototype.toString.call(obj) === '[object Object]' && obj.constructor === Object && !this.hasOwn(obj, 'constructor')) {
      let key;
      for (key in obj) { }
      return key === undefined || this.hasOwn(obj, key);
    }
    return false;
  },
  /**
   * 判断指定对象是否存在指定的属性 <br />
   * <span style="color: red;">注意： 此函数 基于原生javascript API Object.prototype.hasOwnProperty</span>
   * @param {Object} obj 需要被检测的对象
   * @param {String} key 需要被检测的属性
   * @returns {Boolean}
   * @example
   *  var _own = { key: 2 };
   *  utils.hasOwn(_own, 'key') //true
   */
  hasOwn: function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  },
  /**
   * 数组去重
   * @param {Array} array 需要被去重的数组
   * @returns {Array}
   * @example
   *  var arr = [1,2,4,3,5,4,3,2];
   *  utils.unique(arr) //[1, 5, 4, 3, 2]
   */
  unique: function (array) {
    let hash = [];
    for (let i = 0, len = array.length; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        if (array[i] === array[j]) j = ++i;
      }
      hash.push(array[i]);
    }
    return hash;
  },

  /**
   * 合并对象属性
   * @param {Boolean} deep 可选 指示是否深度合并对象，默认为false
   * @param {Object} target 目标对象，其他对象的成员属性将被附加到该对象上
   * @param  {...Object} obj 可选 需要被合并的对象
   * @returns {Object}
   * @example 示例一
   *  var mm = {key:1,K:2};
   *  var nn = {key:2,j:3};
   *  utils.extend(false, mm, nn); // {key: 2, K: 2, j: 3}
   *  console.log(mm) // {key: 1, K: 2}
   * 
   * @example 示例二
   *  var mm = {key:1,K:2};
   *  var nn = {key:2,j:3};
   *  utils.extend(mm, nn); // {key: 2, K: 2, j: 3}
   *  console.log(mm) // {key: 2, K: 2, j: 3}
   */
  extend: function () {
    let options;
    let name;
    let src;
    let copy;
    let copyIsArray;
    let clone;
    let target = arguments[0] || {};
    let i = 1;
    let length = arguments.length;
    let deep = false;

    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }
    if (typeof target !== "object" && !this.isFunction(target)) {
      target = {};
    }
    if (length === i) {
      target = this;
      --i;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (src === copy) {
            continue;
          }
          if (!deep && !!copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && this.isArray(src) ? src : [];
            } else {
              clone = src && this.isPlainObject(src) ? src : {};
            }
            target[name] = this.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  },
  /**
   * 冻结对象 <br />
   * 冻结指的是不能向这个对象添加新的属性，不能修改其已有属性的值，不能删除已有属性，以及不能修改该对象已有属性的可枚举性、可配置性、可写性 <br />
   * <span>注意： 此函数基于Object.freeze</span>
   * @param {Object} obj 需要被冻结的对象
   * @example
   * const object1 = {
   *    property1: 42
   * };
   * const object2 = utils.freeze(object1);
   * object2.property1 = 33; // 此时并不会真正给属性 property1 赋值成功
   * console.log(object2.property1); // 42
   */
  freeze: function (obj) {
    const _this = this;
    const _obj = this.copy(obj);
    Object.freeze(_obj);
    Object.keys(_obj).forEach((key) => {
      if (_this.isObject(_obj[key])) {
        this.freeze(_obj[key]);
      }
    })
    return _obj;
  },
  /**
   * 复制对象(数组或属性)
   * @param {Object|Array} data 需要被复制的对象
   * @returns {Object}
   * @example
   *  var mm = {key:1,K:2};
   *  var kk = utils.copy(mm);
   *  kk.key = 3;
   *  console.log(kk.key) // 3
   *  console.log(mm.key) // 1
   */
  copy: function (data) {
    let _copy = null;
    if (this.isObject(data)) {
      _copy = {};
      for (let key in data) {
        _copy[key] = data[key];
      }
    } else if (this.isArray(data)) {
      _copy = [];
      for (let i of data) {
        _copy.push(this.copy(i));
      }
    } else {
      _copy = data;
    }
    return _copy;
  },
  /**
   * 获取uuid
   */
  uuid: function () {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  },
  /**
   * @private
   * @param {Object} opts 
   * @param {} opts.value
   * @param {} opts.dict
   * @param {} opts.connector
   * @param {} opts.keyField
   * @param {} opts.titleField
   * @returns {String}
   */
  dictMapping: function (opts) {
    if (!dict || this.isNull(value)) return '';
    if (connector) {
      value = value.split(connector);
    }
    if (!this.isNull(value) && value !== '' && dict) {
      if (!this.isArray(value)) {
        value = [value];
      }
    }
    if (value.length <= 0) {
      return '';
    }

    if (this.isArray(dict)) {
      dict = this.toObject(dict, keyField);
    }
    return value.map((ele) => {
      if (this.isObject(ele)) {
        return ele[titleField];
      }
      const d = dict[ele];
      if (this.isObject(d)) {
        return d[titleField];
      }
      return d;
    }).filter(ele => (ele && ele !== '')).join(', ');
  },
  /**
   * 获取浏览器标识
   * @returns {Object}
   */
  getBrowser: function () {
    let ua = window.navigator.userAgent;
    let _brower = {
      ua: ua,
      isIE: window.ActiveXObject != undefined && ua.indexOf("MSIE") > -1,
      isFirefox: ua.indexOf("Firefox") > -1,
      isOpera: ua.indexOf("Opera") > -1,
      isChrome: ua.indexOf("Chrome") > -1 && !!window.chrome,
      isSafari: ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") == -1,
      isAndroid: ua.indexOf("android") > -1,
      isIOS: ua.indexOf("iPhoneiPadiPodiOS") > -1,
      isLinux: ua.indexOf("Linux") > -1,
      isLinuxOS: window.platform ? window.platform.indexOf("Linux") > -1 : false,
      isWeChart: window.platform ? window.platform.indexOf("MicroMessenger") > -1 : false
    };
    let _browerUA = '';
    Object.keys(_brower).forEach(key => {
      if (_brower[key] == true && _browerUA == '') {
        _browerUA = key.substring(2);
      }
    });
    _brower.currentUA = _browerUA;
    return _brower;
  },
  /**
   * 获取Uri参数键值对数组
   * @returns {Object}
   * @example 
   *  utils.getUriParams()  //{username:admin, password:123456}
   */
  getUriParams: function () {
    let res = {};
    let search = decodeURI(window.location.search).indexOf('?') == 0 ? decodeURI(window.location.search).substring(1) : decodeURI(window.location.search);
    search = decodeURIComponent(search).replace(/&&/g, `${encodeURIComponent('&')}&`);
    search.split('&').map(function (item) {
      let d = item.split('=');
      if (d[0].trim().length > 0) {
        res[d[0].trim().toLowerCase()] = decodeURIComponent(d[1] || '')
      }
    });
    return res;
  },
  /**
   * 获取Uri参数值
   * @param {String} param 需要获取的uri参数的键,不区分字母大小写
   * @param {Boolean} isEmpty 可选 是否返回空字符串,如果没有找到该参数的话 默认false
   * @returns {Undefined|String}
   * @example
   *  utils.getUriParamValue('username') //admin
   */
  getUriParamValue: function (param, isEmpty) {
    let _params = this.getUriParams();
    if (!this.isBoolean(isEmpty)) {
      isEmpty = false;
    }
    if (isEmpty) {
      return _params[param.trim().toLowerCase()] || '';
    }
    return _params[param.trim().toLowerCase()];
  },
  /**
   * 简易模板解析器
   * @param {String} tpl 模板字符串
   * @param {Object} parse Json对象
   * @returns {String}
   * 
   * @example 示例文档
   * var html = '我的{{ dream }},我的{{world}}';
   * utils.tmp(html, {
   *    dream: '梦想',
   *    world: '世界'
   * });
   * 
   * // 输出： 我的梦想,我的世界
   */
  tmp: function (tpl, parse) {
    if (!utils.isString(tpl)) return '';
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
  }
}