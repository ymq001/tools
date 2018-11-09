export let cookies = {
  /**
   * 保存指定键值为localStorage
   * @param {String} name 需要存储的键
   * @param {any} value 需要存储的对应键的值
   * @returns {Boolean}
   */
  saveLocal(name, value) {
    if (window.localStorage && JSON && name) {
      if (typeof value == 'object') {
        value = JSON.stringify(value);
      }
      window.localStorage[name] = value;
      return true;
    }
    return false;
  },
  /**
   * 获取localStorage中存储的指定键的值
   * @param {String} name 需要取数据的对象的localStorage的键
   * @param {String} type 可选 返回类型 可设置值 'json'
   * @returns {Null|String|Object}
   */
  getLocal: function (name, type) {
    if (window.localStorage && JSON && name) {
      const data = window.localStorage[name];
      if (type && type == 'json' && !this.isNull(data)) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error(`取数据转换json错误：${e}`);
          return '';
        }
      } else {
        return data;
      }
    }
    return null;
  },
  /**
   * 获取localStorage中存储的指定键的值并转换为json对象
   * @param {String} name 需要取数据的对象的localStorage的键
   * @returns {Null|String|Object}
   */
  getLocal2Json: function (name) {
    return this.getLocal(name, 'json');
  },
  /**
   * 删除localStorage中指定键值
   * @param {String} name 需要删除localStorage中指定键值的键
   * @returns {Null}
   */
  removeLocal(name) {
    if (window.localStorage && JSON && name) {
      window.localStorage[name] = null;
    }
    return null;
  },
  /**
   * 保存指定键值为cookie[并设置domain、path、expires]
   * @param {String} name 需要设定的cookie的键
   * @param {any} value 需要设定的cookie的值
   * @param {String} domain 可选 需要设定的domain
   * @param {String} path 可选 需要设定的url路径
   * @param {Number} minSec 可选 需要设定的过期事件 单位：s
   * @returns {Boolean}
   */
  saveCookie(name, value, domain, path, minSec) {
    const cookieEnabled = (navigator.cookieEnabled) ? true : false;
    if (name && cookieEnabled) {
      path = path || '/';
      if (typeof value == 'object') {
        value = JSON.stringify(value);
      }
      let exp;
      if (minSec) {
        exp = new Date();
        exp.setTime(exp.getTime() + minSec * 1000);
      } else {
        exp = new Date('9998-01-01'); //永不过期
      }
      let expires = minSec ? (`;expires=${exp.toGMTString()}`) : '';
      let cookieString = `${name}=${escape(value)}${expires};path=${path};`;
      if (domain) {
        cookieString += `domain=${domain}`;
      }
      document.cookie = cookieString;
      return true;
    }
    return false;
  },
  /**
   * 获取指定键的cookie值
   * @param {String} name 键名
   * @returns {Null|String}
   */
  getCookie(name) {
    const cookieEnabled = (navigator.cookieEnabled) ? true : false;
    if (name && cookieEnabled) {
      const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*(;|$)`));
      if (arr !== null) {
        return unescape(arr[2]);
      }
    }
    return null;
  },
  /**
   * 删除指定键的cookie
   * @param {String} name 需要删除的cookie对应的键
   * @param {String} domain 可选 需要删除的cookie对应的domain
   * @param {String} path 可选 需要删除的cookie对应的url地址
   * @returns {Boolean}
   */
  removeCookie: function (name, domain, path) {
    const cookieEnabled = (navigator.cookieEnabled) ? true : false;
    if (name && cookieEnabled) {
      path = path || '/';
      let cookieString = `${name}=0;expires=${new Date(0).toUTCString()};path=${path};`;
      if (domain) {
        cookieString += `domain=${domain};`;
      }
      document.cookie = cookieString;
      return true;
    }
    return false;
  },
  /**
   * 清除cookie
   * @param {String} domain 可选 需要清除的cookie对应的domain
   * @param {String} path 可选 需要清除的cookie对应的url地址
   */
  clearCookie(domain, path) {
    const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    path = path || '/';
    if (keys) {
      for (let i = keys.length; i--;) {
        let cookieString = `${keys[i]}=0;expires=${new Date(0).toUTCString()};path=${path};`;
        if (domain) {
          cookieString += `domain=${domain};`;
        }
        document.cookie = cookieString;
      }
    }
  }
}