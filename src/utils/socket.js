let socketDefaults = {
  /**
   * 标识是否断开重连的开关, 默认开启
   */
  isReconnect: true,
  /**
   * 标识是否正在尝试开始重新连接
   */
  _isRestart: false,
  /**
   * 标识是否正在尝试重新连接
   */
  _lockReconnect: false,
  /**
   * 标识socket实例
   */
  _socket: null,
  /**
   * 标识需要连接的ws地址
   */
  host: '',
  /**
   * 标识该连接已注册的回调事件列表
   */
  _handles: {},
  /**
   * 标识重连计时器id
   */
  timer: 0,
  /**
   * 标识是否打印控制台日志， 默认false
   */
  debug: false
};

/**
 * socket基类
 * @private
 * @param {Object} opts 
 * @property {Boolean} isReconnect 标识是否断开重连的开关, 默认开启
 * @property {Boolean} _isRestart 标识是否正在尝试开始重新连接 默认false
 * @property {Function} openHandler 标识连接打开时的执行函数
 */
function webSocketLib(opts, _this) {
  this._socket && this._socket.close && this._socket.close(); //先关闭之前连接的实例

  utils.extend(true, this, socketDefaults, opts);

  this._this = _this || this;

  this.host = this.host.toLowerCase();
  this.host = this.host.indexOf('ws://') == -1 ? `ws://${this.host}` : this.host;
  this.host = this.host.split(':').length < 3 ? `${this.host}:${this.port}` : this.host;

  // 注册打开连接事件时，先注销同类型所有事件
  for (var i = 0, item; item = opts.openHandlers[i]; i++) {
    this._on('onopen', item.fire, item.hashCode);
  }
  for (var i = 0, item; item = opts.messageHandlers[i]; i++) {
    this._on('onmessage', item.fire, item.hashCode);
  }

  this._init();
}

webSocketLib.prototype = {
  /**
   * 构造函数,指向webSocketLib
   */
  constructor: webSocketLib,
  /**
   * 注册对象的事件监听器
   * @private
   * @param {String} type 事件类型 可选值：onopen / onmessage / onerror / onclose
   * @param {Function} handler 回调函数
   * @param {String} key 可选 为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
   */
  _on: function (type, handler, key) {
    if (!utils.isFunction(handler)) {
      console.log('请正确设置注册事件的回调函数 参数[handler]需要Function类型的值');
      return;
    }
    if (utils.isString(key) && !!key.length) {
      if (/[^\w\-]/.test(key)) {
        //判断不是由字母、数字、下划线、中划线组成则抛出异常
        throw ("nonstandard key:" + key);
      } else {
        handler.hashCode = key;
      }
    }
    !this._handles && (this._handles = {});
    type.indexOf('on') != 0 && (type = 'on' + type);
    !utils.isObject(this._handles[type]) && (this._handles[type] = {});
    key = key || utils.uuid();
    this._handles[type][key] = handler;
  },
  /**
   * 注销对象的事件监听器
   * @private
   * @param {String} type 事件类型 可选值：onopen / onmessage / onerror / onclose
   * @param {Function|String} handler 需要移除的事件监听函数或监听函数的key
   * @remark 如果第二个参数handler没有绑定到对应的事件中，则什么也不做
   */
  _off: function (type, handler) {
    if (!utils.isString(type) || !type.length) {
      console.log('请检查要移除的事件监听器类型是否正确');
      return;
    }
    if (utils.isFunction(handler)) {
      handler = handler.hashCode;
    } else if (!utils.isString(handler)) {
      return;
    }
    !this._handles && (this._handles = {});
    type.indexOf('on') != 0 && (type = 'on' + type);
    if (!this._handles[type]) {
      return;
    }
    this._handles[type][handler] && delete this._handles[type][handler];
  },
  /**
   * 触发对象的事件监听器
   * @private
   * @param {String} type 事件类型
   * @param {Object} args 触发回调函数传参
   */
  _fire: function (type, args) {
    if (!utils.isString(type) || !type.length) {
      console.log('请检查要触发的事件监听器类型是否正确');
      return;
    }
    !this._handles && (this._handles = {});
    type.indexOf('on') != 0 && (type = 'on' + type);
    args = Array.prototype.slice.call(arguments).splice(1);
    if (utils.isObject(this._handles[type])) {
      for (var key in this._handles[type]) {
        this._handles[type][key].apply(this._this, args);
      }
    }
  },
  /**
   * 初始化连接,并建立通信
   * @private
   */
  _init: function () {
    var _this = this;
    try {
      clearTimeout(this.timer); //执行前先清除定时器，防止error和close在某些浏览器下会触发无用断开连接事件的异常
      this._socket = new window.WebSocket(this.host);

      this._socket.onopen = function (evt) {
        _this._fire('onopen', evt);
      };
      this._socket.onmessage = function (evt) {
        var data = evt.data;
        try {
          data = JSON.parse(evt.data);
        } finally{
          _this._fire('onmessage', data, evt);
        }
      };
      this._socket.onerror = function (evt) {
        _this.debug && (console.log("[error]socket异常中止,重连", evt));
        _this._fire('onerror', evt);
        _this._lockReconnect = false;
        _this._restart();
      }
      this._socket.onclose = function (evt) {
        _this.debug && (console.log("[close]socket关闭,重连", evt));
        _this._fire('onclose', evt);
        _this._lockReconnect = false;
        _this._isRestart = false;
        _this._restart();
      }
    } catch (error) {
      _this.debug && (console.log("socket捕获异常,重连", error));
      _this._lockReconnect = false;
      _this._isRestart = false;
      _this._restart();
    }
  },
  /**
   * 发送消息给服务器
   * @private
   * @param {Object|String} data 向服务器发送的消息
   */
  _send: function (data) {
    if (utils.isObject(data)) {
      data = JSON.stringify(data);
    }
    let _this = this;
    let i = 0;
    let timer = setInterval(function () {
      if (i++ > 3) {
        clearInterval(timer);
      }
      if (_this._socket.readyState == window.WebSocket.OPEN) {
        _this._socket.send(data);
        _this._isRestart = false;
        clearInterval(timer);
      } else if (_this._socket.readyState == window.WebSocket.CLOSED || _this._socket.readyState == window.WebSocket.CLOSING) {
        clearInterval(timer);
      }
    }, 500);
  },
  /**
   * 关闭该实例连接
   */
  _close: function () {
    this.isReconnect = false;
    this._socket.close();
  },
  /**
   * 断线重连
   * @private
   */
  _reconnect: function () {
    if (this._lockReconnect) return; //判断是否正在断线重连, 如正在进行断线重连,则退出,防止触发重连太频繁

    this._lockReconnect = true;
    this._init();
  },
  /**
   * 开始尝试断线重连
   * @private
   */
  _restart: function () {
    var _this = this;
    if (this.isReconnect == false) return;  //判断是否启用断线重连功能，若不启用，则退出
    if (this._isRestart) return; //判断是否正在尝试开始断线重连，如正在尝试开始断线重连，则退出，防止触发重连台频繁
    this._isRestart = true;

    clearTimeout(this.timer); //执行前先清除定时器，防止error和close在某些浏览器下会触发两次重连事件的异常
    this.timer = setTimeout(function () {
      _this.debug && (console.log("正在尝试socket重连,请稍后..."));
      _this._reconnect();
    }, 2000);
  }
}


/**
 * socket实例  {@link http://172.26.1.40/docs/examples/socket.html|socket示例}
 * @class
 * 
 * @property {WebSocket|null} _socket 标识websocket实例，默认 null
 * @property {socketLib} _api 标识socketlib实例
 * 
 * @param {Json} opts socket初始化相关参数
 * @param {Boolean} opts.isReconnect 是否开启断线重连功能，默认开启 true
 * @param {String} opts.port 可选 websocket通讯地址端口号，默认 6700
 * @param {String} opts.host websocket 通讯地址 <br /> <span style="color: red;">如参数[host]中不包含协议名称和端口号，程序会自动添加协议名称和端口号</span>
 * @param {Array|Function} opts.openHandlers websocket通讯打开连接时触发执行的函数(数组) <br /> 
 * <span style="color: red;">如果此参数为数组 则需传递固定格式的对象数组 eg: [{ hashCode: 'open1', fire: function(evt){ console.log(evt); } }]</span>
 * @param {Array|Function} opts.messageHandlers 可选 websocket通讯消息回调时触发执行的函数(数组) <br /> 
 * <span style="color: red;">如果此参数为数组 则需传递固定格式的对象数组 eg: [{ hashCode: 'open1', fire: function(evt){ console.log(evt); } }]</span>
 * @param {Boolean} opts.debug 可选 标识是否打印控制台日志 默认 false
 * 
 * @example 参考示例一
 * mm = new utils.socket({
 *  host: '172.26.1.233',
 *  openHandlers: function(evt){
 *    this.send({ CmdInfo: "RcuInfo", RcuID: -1730721076 })
 *    console.log('open', evt)
 *  },
 *  messageHandlers: [{ hashCode: 'message1', fire: function(evt){
 *    console.info(evt);
 *  }}]
 * })
 * mm.on('close', function(evt){
 *  console.log('close', evt)
 * })
 * mm.on('error', function(evt){
 *  console.log('error', evt)
 * })
 */
let socket = function (opts) {
  /**
   * 标识websocket实例，默认 null
   * @private
   * @type {WebSocket|null}
   */
  this._socket = null;
  /**
   * 标识socketlib实例
   * @private
   * @type {socketLib}
   */
  this._api = {};
  /**
   * 标识用户自定义设置
   * @private
   * @type {Json}
   */
  this._opts = utils.extend({
    isReconnect: true,
    port: 6700,
    host: '',
    openHandlers: [],
    messageHandlers: []
  }, opts);

  if (!(this instanceof socket)) {
    throw ('使用该对象时，请使用关键字 "new"');
  }

  this._setPropertys();
}
/**
 * 检查参数类型是否正确并赋值给默认属性
 * @private
 * @returns {Boolean}
 */
socket.prototype._setPropertys = function () {
  if (this._opts.isReconnect != undefined && !utils.isBoolean(this._opts.isReconnect)) {
    throw ('请检查参数[opts.isReconnect]的数据类型是否是boolean类型');
  }
  if (!utils.isNumber(this._opts.port / 1)) {
    throw ('请检查参数[opts.port]的数据类型是否是Number类型');
  }
  if (!utils.isString(this._opts.host)) {
    throw ('请检查参数[opts.host]的数据类型是否是String类型');
  }
  if (utils.isFunction(this._opts.openHandlers)) {
    this._opts.openHandlers = [{ hashCode: utils.uuid(), fire: this._opts.openHandlers }];
  } else if (!utils.isArray(this._opts.openHandlers)) {
    throw ('请检查参数[opts.openHandlers]的数据类型是否是Function类型或Array类型');
  }
  if (utils.isFunction(this._opts.messageHandlers)) {
    this._opts.messageHandlers = [{ hashCode: utils.uuid(), fire: this._opts.messageHandlers }];
  } else if (!utils.isArray(this._opts.messageHandlers)) {
    this._opts.messageHandlers = [];
    //throw ('请检查参数[opts.messageHandlers]的数据类型是否是Function类型或Array类型');
  }

  this._api = new webSocketLib(this._opts, this);
  this._socket = this._api._socket;
}
/**
 * 发送消息给服务器
 * @public
 * @param {Array|Json} data 向服务器发送的消息
 */
socket.prototype.send = function (data) {
  if (utils.isArray(data) == false) {
    data = [data];
  }
  for (var i = 0; i < data.length; i++) {
    this._api._send(data[i]);

  }
}
/**
 * 关闭连接
 * @public
 */
socket.prototype.close = function () {
  this._api._close();
}
/**
 * 注册对象的事件监听器 <br />
 * <span style="color: red;">注意： onopen 事件注册后会立即调用</span>
 * @public
 * @param {String} type 事件类型 可选值：onopen / onmessage / onerror / onclose
 * @param {Function} handler 回调函数
 * @param {String} key 可选 为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
 * 
 * @example 参考示例一
 * socket = new utils.socket({
 *  host: '172.26.1.233',
 *  openHandlers: function(evt){
 *    this.send({ CmdInfo: "RcuInfo", RcuID: -1730721076 })
 *    console.log('open', evt)
 *  },
 *  messageHandlers: function(evt){
 *    console.info(evt);
 *  } 
 * })
 * socket.on('close', function(evt){
 *  console.log('close', evt)
 * })
 * socket.on('error', function(evt){
 *  console.log('error', evt)
 * })
 */
socket.prototype.on = function (type, handler, key) {
  if(type.indexOf('open') > -1){
    this._api._off(type);
    this._api._on(type, handler, key);
    this._api._fire('onopen');
  }else{
    this._api._on(type, handler, key);
  }
}
/**
 * 注销对象的事件监听器
 * @public
 * @param {String} type 事件类型 可选值：onopen / onmessage / onerror / onclose
 * @param {Function|String} handler 需要移除的事件监听函数或监听函数的key
 * @remark 如果第二个参数handler没有绑定到对应的事件中，则什么也不做
 * 
 * @example 参考示例一
 * socket = new utils.socket({
 *  host: '172.26.1.233',
 *  openHandlers: function(evt){
 *    this.send({ CmdInfo: "RcuInfo", RcuID: -1730721076 })
 *    console.log('open', evt)
 *  },
 *  messageHandlers: [ hashCode: '', fire: function(evt){
 *    console.info(evt);
 *  }]
 * })
 * socket.off('message') //只传递一个参数，会注销此类型下所有事件
 * socket.on('close', function(evt){
 *  console.log('error', evt)
 * })
 */
socket.prototype.off = function (type, handler) {
  this._api._off(type, handler);
}

export let socketLib = {
  socket: socket
}

