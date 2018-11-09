export let protorypes = {
  /**
   * 扩展Date 常用函数
   * @class
   * @classdesc utils.date
   */
  date: {
    /**
     * 格式化日期
     * @param {Date|String} date 日期 或 日期字符串
     * @param {String} _format 返回结果格式化
     * @returns {String|null}
     * @example 参考示例1
     *  utils.date.format('2018-05-01', 'yyyy/MM/dd')  // 2018/05/01
     * 
     * @example 参考示例1
     *  utils.date.format(new Date('2018-05-01'), 'yyyy/MM/dd')  // 2018/05/01
     */
    format: function (date, _format) {
      let _this;
      if (utils.isString(date)) {
        _this = new Date(date.replace(/-/g, '/'));
      } else if (utils.isDate(date)) {
        _this = date;
      } else {
        return null;
      }
      let _match = {
        "M+": _this.getMonth() + 1,  //月份
        "(d|D)+": _this.getDate(),       //日
        "(h|H)+": _this.getHours(),      //小时
        "m+": _this.getMinutes(),    //分
        "s+": _this.getSeconds(),    //秒
        "q+": Math.floor((_this.getMonth() + 3) / 3),    //季度
        "S": _this.getMilliseconds() //毫秒
      };
      if (/((y|Y)+)/.test(_format)) {
        _format = _format.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (let k in _match) {
        if (new RegExp("(" + k + ")").test(_format)) {
          _format = _format.replace(RegExp.$1, (RegExp.$1.length === 1)
            ? (_match[k])
            : (("00" + _match[k]).substr(("" + _match[k]).length)));
        }
      }
      return _format;
    },
    /**
     * 修改日期(天数)
     * @param {Date|String} date 日期 或 日期字符串
     * @param {Number} days 需要被计算的 天数
     * @param {String} format 可选 返回结果格式化,用法同 format 函数
     * @returns {Date|String|Null} 返回日期对象或格式化后日期字符串或 Null
     */
    modDays: function (date, days, format) {
      let _this;
      if (utils.isNumber(date)) {
        format = days;
        days = date;
        date = new Date();
      }
      if (utils.isString(date)) {
        _this = new Date(date.replace(/-/g, '/'));
      } else if (utils.isDate(date)) {
        _this = new Date(date);
      } else {
        return null;
      }
      _this.setDate(_this.getDate() + days);
      if (utils.isString(format)) {
        return this.format(_this, format);
      }
      return _this;
    },
    /**
     * 修改日期(分)
     * @param {Date|String} date 日期 或 日期字符串
     * @param {Number} minutes 需要被计算的 分
     * @param {String} format 可选 返回结果格式化,用法同 format 函数
     * @returns {Date|String|Null} 返回日期对象或格式化后日期字符串或 Null
     */
    modMinutes: function (date, minutes, format) {
      let _this;
      if (utils.isNumber(date)) {
        format = minutes;
        minutes = date;
        date = new Date();
      }
      if (utils.isString(date)) {
        _this = new Date(date.replace(/-/g, '/'));
      } else if (utils.isDate(date)) {
        _this = new Date(date);
      } else {
        return null;
      }
      _this.setDate(_this.getTime() + minutes * 1000 * 60);
      if (utils.isString(format)) {
        return this.format(_this, format);
      }
      return _this;
    },
    /**
     * 获取日期时间戳
     * @param {Date|String} date 日期 或 日期字符串
     * @returns {Number|Null}
     */
    convertDateToTimeStamp: function (date) {
      let _this;
      if (utils.isString(date)) {
        _this = new Date(date.replace(/-/g, '/'));
      } else if (utils.isDate(date)) {
        _this = new Date(date);
      } else {
        return null;
      }
      return Math.round(_this.getTime() / 1000);
    },
    /**
     * 获取日期对象(字符串)
     * @param {Number} timeStamp 时间戳
     * @param {String} _format 返回结果格式化
     * @returns {Date|String|Null}
     */
    convertTimeStampToDate: function (timeStamp, _format) {
      if (!utils.isNumber(timeStamp)) {
        return null;
      }
      let res = new Date(timeStamp * 1000);
      if (_format && utils.isString(_format)) {
        return utils.date.format(res, _format);
      }
      return res;
    }
  },
  /**
   * 与QT常用交互
   * @class
   * @classdesc utils.QT
   */
  QT: {
    /**
     * 弹出提示框
     * @param {String} title 弹出QT提示框·标题
     */
    showLoading: function(title){
      title = title || '正在处理中...';
      let webManageView = window.WebManageView;
      let _window = window;
      let _parent = parent;
      while(_window != _parent){
        if(_parent.parent == _parent){
          webManageView = _parent.WebManageView;
          _window = _parent;
        } else{
          _window = _parent;
          _parent = _window.parent;
        }
      }
      if(webManageView || utils.isFunction(webManageView.slot_ShowLoading)){
        webManageView.slot_ShowLoading(title);
      }
    }
  },
  /**
   * 在字符串中用一些字符全局替换一个与正则表达式匹配的子串
   * @param {String} str 需要被全局替换的源
   * @param {String} replaced 需要被替换的字符串
   * @param {String} replaceMent 需要被替换的新字符串
   * @returns {String} 一个新的字符串，是用 replacement 替换了 replaced 的所有匹配之后得到的
   * @example
   *  utils.replaceAll('abcdemfmemd', 'em', '&&')  // abcd&&fm&&d
   */
  replaceAll: function (str, replaced, replaceMent) {
    if (utils.isString(str)) {
      let _reg = new RegExp(replaced, 'g');
      return str.replace(_reg, replaceMent);
    }
    return '';
  },
  /**
   * 求和
   * @param {Array} arr 用于求和的数组
   * @returns {Number} 如果传参不是数字数组会返回 0 
   * @example
   *  utils.sum([1,2,3,4,5])  // 15
   */
  sum: function (arr) {
    let res = 0;
    if (!utils.isArray(arr)) {
      return res;
    }
    if (arr.length === 1) {
      res = arr[0];
    } else if (arr.length !== 0) {
      for (var i = 0; i < arr.length; i++) {
        res += arr[i];
      }
    }
    return res;
  },
  /**
   * 获取文件内存地址(兼容写法)
   *  主要用于图片上传预览使用
   * @param {Object} blob 类文件对象
   * @returns {String} 文件内存地址
   */
  getObjectURL: function (blob) {
    var url = null;
    if (window.createObjectURL != undefined) {
      url = window.createObjectURL(blob)
    } else if (window.URL != undefined) { //老版火狐
      url = window.URL.createObjectURL(blob);
    } else if (window.webkitURL != undefined) { //老版谷歌
      url = window.webkitURL.createObjectURL(blob);
    }
    return url;
  }
}