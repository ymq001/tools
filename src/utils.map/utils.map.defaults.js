(function (utils) {
  utils.map = utils.map = utils.map || {};

  
  /*** utils.map.default 代码开始 ***/
  /**
   * @class
   * @alias utils.map.default
   * @classdesc utils.map.default
   * @description 记录各种marker背景图标定义,每新增一种类型,需手工维护此文档 <br /> <span style="color: red;">此对象不用实例化</span>
   * @static
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
      if (utils.map.tools.isString(type) && type.trim() != '') {
        returns = this[type];
      }
      if (returns !== undefined && utils.map.tools.isString(subtype) && subtype.trim() != '') {
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
})(window.utils || (window.utils = {}))