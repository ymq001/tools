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
   * 判断指定对象是否存在指定的属性
   * @param {Object} obj 需要被检测的对象
   * @param {String} key 需要被检测的属性
   * @returns {Boolean}
   */
  hasOwn: function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  },
  /**
   * 数组去重
   * @param {Array} array 需要被去重的数组
   * @returns {Array}
   */
  unique: function (array) {
    let hash = [];
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (array[i] === array[j])++i;
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
          if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
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
   * 冻结对象
   * @param {Object} obj 需要被冻结的对象
   */
  freeze: function (obj) {
    const _this = this;
    Object.freeze(obj);
    Object.keys(obj).forEach((key, value) => {
      if (_this.isObject(obj[key])) {
        this.freeze(obj[key]);
      }
    })
  },
  /**
   * 复制对象(数组或属性)
   * @param {Object|Array} data 需要被复制的对象
   * @returns {Object}
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
   * 获取对象对应键的值
   * @param {Object} obj 元对象
   * @param {Array|String} keypath 元对象的键(的数组)
   * @returns {Null|any}
   */
  getKeyValue: function (obj, keypath) {
    if (!this.isObject(obj)) {
      return null;
    }
    let array = null;
    if (this.isArray(keypath)) {
      array = keypath;
    } else if (this.isString(keypath)) {
      array = keypath.split('.');
    }
    if (array == null || array.length == 0) {
      return null;
    }
    let value = null;
    let key = array.shift();
    const keyTest = key.match(new RegExp("^(\\w+)\\[(\\d+)\\]$"));
    if (keyTest) {
      key = keyTest[1];
      let index = keyTest[2];
      value = obj[key];
      if (this.isArray(value) && value.length > index) {
        value = value[index];
      }
    } else {
      value = obj[key];
    }

    if (array.length > 0) {
      return this.getKeyValue(value, array);
    }
    return value;
  },
  /**
   * 设定键值
   * @param {Object} obj 需设定键值的对象
   * @param {Array|String} keypath 需要设定的键(的数组)
   * @param {any} value 需要设置的值
   * @param {Object} orignal 元对象
   * @returns {Boolean|Object}
   */
  setKeyValue: function (obj, keypath, value, orignal) {
    if (!this.isObject(obj)) {
      return false;
    }
    let array = null;
    if (this.isArray(keypath)) {
      array = keypath;
    } else if (this.isString(keypath)) {
      array = keypath.split('.');
      origin = obj;
    }
    if (array == null || array.length == 0) {
      return false;
    }
    let children = null;
    let index = 0;
    let key = array.shift();
    const keyTest = key.match(new RegExp("^(\\w+)\\[(\\d+)\\]$"));
    if (keyTest) {
      key = keyTest[1];
      index = keyTest[2];
      children = obj[key];
      if (this.isArray(children) && children.length > index) {
        if (array.length > 0) {
          return this.setKeyValue(children[key], array, value, orignal);
        }
        children[index] = value;
      }
    } else {
      if (array.length > 0) {
        return this.setKeyValue(obj[key], array, value, orignal);
      }
      obj[key] = value;
    }
    return orignal;
  },
  /**
   * 对象转换为数组
   * @param {Object} obj 需要被转换为数组的对象
   * @param {String} keyName 可选
   * @param {String} arg3 可选 
   * @returns {Array}
   */
  toArray: function (obj, keyName, arg3) {
    let titleName = '';
    if (!this.isObject(obj)) {
      return [];
    }
    if (this.isString(arg3)) {
      titleName = arg3;
    }
    let listObj = [];
    for (let o in obj) {
      let value = obj[o];
      let n = {};
      if (this.isObject(value)) {
        n = value;
      } else {
        n[titleName] = value;
      }
      if (keyName) {
        n[keyName] = o;
      }
      listObj.push(n);
    }
    return listObj;
  },
  /**
   * 数组转换为对象
   * @param {Array} list 需要转换为对象的数组
   * @param {String} idName 可选 键 默认 'id'
   * @param {Boolean} hasNum 可选 是否计算count属性 默认 'false'
   * @returns {Object}
   */
  toObject: function (list, idName = 'id', hasNum = false) {
    let listObj = {};
    for (let i = 0, n; n = list[i]; i++) {
      if (this.isObject(n)) {
        if (idName == 'count') {
          listObj[i] = n;
        } else {
          listObj[n[idName]] = n;
          if (hasNum) {
            listObj[n[idName]].count = i;
          }
        }
      } else {
        listObj[n] = n;
      }
    }
    return listObj;
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
  // /**
  //  * 
  //  * @param {Object} opts 
  //  * @param {} opts.value
  //  * @param {} opts.dict
  //  * @param {} opts.connector
  //  * @param {} opts.keyField
  //  * @param {} opts.titleField
  //  * @returns {String}
  //  */
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
      res[d[0].trim().toLowerCase()] = decodeURIComponent(d[1] || '')
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

}