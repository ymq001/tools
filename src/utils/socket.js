let socketDefaults = {
  /**
   * 标识是否断开重连的开关, 默认开启
   */
  isReconnect: true,
  /**
   * 标识是否正在尝试开始重新连接
   */
  isRestart: false,
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
  _host: '',
  /**
   * 标识该连接已注册的回调事件列表
   */
  _handles: {},
  /**
   * 标识连接打开时的执行函数
   */
  openHandles: function () {

  }
};

/**
 * socket基类
 * @private
 * @param {Object} opts 
 * @property {Boolean} isReconnect 标识是否断开重连的开关, 默认开启
 * @property {Boolean} isRestart 标识是否正在尝试开始重新连接 默认false
 * @property {Function} openHandles 标识连接打开时的执行函数
 */
function webSocketLib(opts) {
  utils.extend(this, socketDefaults, opts);
  this._socket = this._socket.toLowerCase();
  this._socket = this._socket.indexOf('ws://') == -1 ? `ws://${this._socket}` : this._socket;
  this._socket = this._socket.split(':').length < 3 ? `${this._socket}:6700` : this._socket;
}

webSocketLib.prototype = {
  /**
   * 构造函数,指向webSocketLib
   */
  constructor: webSocketLib,
  /**
   * 注册事件回调
   * @param {String} eventName 事件名称 可选值：onopen / onmessage / onerror / onclose
   * @param {Function} callback 回调函数
   */
  on: function (eventName, callback) {
    if (!this.handles) {
      this.handles = {};
    }
    (this.handles[eventName] || (this.handles[eventName] = [])).push(callback);
  },
  /**
   * 触发事件回调函数
   * @param {String} eventName 事件名称
   * @param {Object} args 触发回调函数传参
   */
  fire: function (eventName, args) {
    if (this.handles && this.handles[eventName]) {
      for (let i = 0, _event; _event = this.handles[eventName][i]; i++) {
        try {
          _event(args);
        } catch (e) {
          console.log(`触发socket回调事件异常,事件名称: ${eventName}, 异常原因：`, e);
        }
      }
    }
  },
  /**
   * 初始化连接,并建立通信
   */
  init: function () {
    var _this = this;
    this._socket = new window.WebSocket(this._host);
    try {
      this.onopen = this.openHandles;
      this.onerror = function (evt) {
        console.log("[error]socket异常中止,重连", evt);
        _this._lockReconnect = false;
        _this.restart();
      }
      this.onclose = function (evt) {
        console.log("[close]socket关闭,重连", evt);
        _this._lockReconnect = false;
        _this.isRestart = false;
        _this.restart();
      }
    } catch (error) {
      console.log("socket捕获异常,重连", error);
      _this._lockReconnect = false;
      _this.isRestart = false;
      _this.restart();
    }
  },
  /**
   * 发送消息给服务器
   * @param {Object|String} data 向服务器发送的消息
   */
  send: function (data) {
    if (utils.isObject(data)) {
      data = JSON.stringify(data);
    }
    let i = 0;
    let timer = setInterval(function () {
      if (i > 3) {
        clearInterval(timer);
      }
      if (this._socket.readyState == window.WebSocket.OPEN) {
        this._socket.send(data);
        this.isRestart = fasle;
        clearInterval(timer);
      } else if (this._socket.readyState == window.WebSocket.CLOSED || this._socket.readyState == window.WebSocket.CLOSING) {
        clearInterval(timer);
      }
      i++;
    }, 500);
  },
  reconnect: function () {
    if (this._lockReconnect) return; //判断是否正在断线重连, 如正在进行断线重连,则退出,防止触发重连太频繁

    this._lockReconnect = true;
    this.init();
  },
  restart: function () {
    if (this.isRestart) {
      return;
    }
    this.isRestart = true;
    setTimeout(function () {
       console.log("正在尝试socket重连,请稍后...");
       reconnect();
    }, 2000);
  }
}


export let socket = {
  /**
   * 封装webSocket相关API
   * 支持断线重连、批量注册回调、二次通信等
   * @class
   * @alias utils.socket
   * @property {Boolean} isReconnect 标识是否断开重连的开关, 默认开启
   * @property {Object} socket 标识socket实例
   * @property {String} host 标识需要连接的ws地址
   * @property {Array} handles 标识该连接已注册的回调事件列表
   */
  socket: {
  }
}