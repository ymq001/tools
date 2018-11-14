(function (utils) {
  /*** utils.map 代码开始 ***/

  /**
   * @class 
   * <span style="color: red;">此对象不用实例化</span>
   */
  utils.map = utils.map || {};

  /**
   * 初始化地图配置
   * 地图常规设置(中心点坐标、最大最小缩放层级)
   * 常规设置(拖拽平移、滚轮缩放、双击放大)
   * 常规控件(缩略图、比例尺、拖拽选取)
   * 
   * @property {BMap.Map} _map 百度地图实例
   * @property {utils.map.RData} _rdata 数据处理类实例，如不需要，可以忽略
   * @property {utils.map.RManager} _rmanager 覆盖物管理类实例，配合自定义覆盖物使用
   * @property {Json} _opts 用户自定义设置的属性
   * @property {Json} _isProd 当前环境是否是开发环境，用于异常的提示方式 <span style="color: red;">默认 true 生产环境</sapn><br /> 
   * <span style="color: red;"> 开发环境下console打印异常信息</sapn> <br /> 
   * <span style="color: red;"> 生产环境下alert 弹出异常信息</sapn>
   * 
   * @param {Json} opts
   * @param {String} opts.mapId 必要参数 地图容器Id
   * @param {Json} opts.mapCenter 必要参数 地图中心点
   * @param {Number} opts.mapCenter.x 必要参数 地图中心点经度(lat/x)
   * @param {Number} opts.mapCenter.y 必要参数 地图中心点纬度(lng/y)
   * @param {Number} opts.mapZoom  必要参数 地图初始缩放级别
   * @param {Number} opts.mapMaxZoom  必要参数 地图最大缩放级别，默认 6
   * @param {Number} opts.mapMinZoom  必要参数 地图最小缩放级别，默认 16
   * @param {Number} opts.isEnableDragging 可选 是否启用滚轮缩放，默认启用 默认值：true
   * @param {Number} opts.isEnableScrollWheelZoom 可选 是否启用拖拽平移，默认启用 默认值：true
   * @param {Number} opts.isDisableDbClickZoom 可选 是否禁用双击放大，默认禁用 false
   * @param {Number} opts.isEnableNavigation 可选 是否启用比例尺控件，默认启用 默认值：true
   * @param {Number} opts.isEnableOverview 可选 是否启用缩略图控件，默认启用 默认值：true
   * @param {Number} opts.isProd 可选 设置当前环境是否是生产环境，默认生产环境 默认值：true
   * @param {Number} opts.padding  可选 RManager实例化设置项 可视区域的外填充，默认 6
   * @param {Function} opts.filter 可选 RManager实例化设置项 数据过滤函数，必须返回boolean类型的值
   * 
   * @returns {Json} 
   */
  utils.map.initialize = function (opts) {
    opts = opts || {};

    _initialize.call(utils.map);
    
    function _initialize(){
      this.attrs = {
        _map: undefined,
        _rdata: undefined,
        _rmanager: undefined,
        _isProd: true,
        _opts: {}
      }
      if (!utils.map.tools.isString(opts.mapId)) {
        _alert('请检查参数[mapId] 是否正确', '请正确配置地图容器标识');
        return;
      }
      if (!opts.mapCenter || !utils.map.tools.isNumber(opts.mapCenter.x) || !utils.map.tools.isNumber(opts.mapCenter.x)) {
        _alert('请检查参数[mapCenter] 是否正确', '请正确配置地图中心点');
        return;
      }
      if (!utils.map.tools.isNumber(opts.mapMaxZoom)) {
        _alert('请检查参数[mapMaxZoom] 是否正确', '请正确配置最大缩放级别');
        return;
      }
      if (!utils.map.tools.isNumber(opts.mapMinZoom)) {
        _alert('请检查参数[mapMinZoom] 是否正确', '请正确配置最小缩放级别');
        return;
      }
  
      var _filter = function () { return true; };
      this.attrs._opts = utils.map.tools.extend({
        mapId: undefined,
        mapCenter: {
          x: 118.807535,
          y: 32.113292
        },
        mapZoom: 12,
        mapMaxZoom: 6,
        mapMinZoom: 16,
        isEnableDragging: true,
        isEnableScrollWheelZoom: true,
        isDisableDbClickZoom: false,
        isEnableNavigation: true,
        isEnableOverview: true,
        isProd: this.attrs._isProd,
        padding: 0,
        filter: _filter
      }, opts);
      this.attrs._isProd = this.attrs._opts.isProd;
      this.attrs._opts.filter = utils.map.tools.isFunction(this.attrs._opts.filter) ? this.attrs._opts.filter : _filter;
  
      this._initializeMap();
    }
  }
  /**
   * 根据配置初始化地图
   * @private
   */
  utils.map._initializeMap = function () {
    if (!window['BMap']) {
      _alert('请正确引入BMap类库后,再引入该文件,执行此函数', '请正确引入BMap类库');
    }
    var _opts = this.attrs._opts;
    var _map = this.attrs._map = new BMap.Map(_opts.mapId, { minZoom: _opts.mapMinZoom, maxZoom: _opts.mapMaxZoom, enableMapClick: false });
    _map.centerAndZoom(new BMap.Point(_opts.mapCenter.x, _opts.mapCenter.y), _opts.mapZoom); //设置地图中心点及默认缩放级别
    if (_opts.isEnableDragging) _map.enableDragging(); //启用拖拽平移
    if (_opts.isEnableScrollWheelZoom) _map.enableScrollWheelZoom();  //启用滚轮缩放
    if (_opts.isDisableDbClickZoom) _map.disableDoubleClickZoom(); //禁用双击放大
    if (_opts.isEnableNavigation) {
      // 添加比例尺控件
      _map.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));
    }
    if (_opts.isEnableOverview) {
      // 添加缩略图控件
      _map.addControl(new BMap.OverviewMapControl({ isOpen: true, size: new BMap.Size(250, 250), anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));
    }

    this.attrs._rdata = new utils.map.RData({});
    this.attrs._rmanager = new utils.map.RManager(_map, {
      padding: _opts.padding,
      minZoom: _opts.mapMinZoom,
      maxZoom: _opts.mapMaxZoom,
      filter: _opts.filter
    })
  }

  /**
   * 弹出错误提示
   * @private
   * @param {String} msg 提示内容
   * @param {String} _msgToAlert 提示内容
   */
  function _alert(msg, _msgToAlert) {
    console.warn(msg);
    if (!!utils.map.attrs._isProd && !!_msgToAlert) {
      alert(_msgToAlert);
    }
  };

  /*** utils.map 代码结束 ***/
})(window.utils || (window.utils = {}))