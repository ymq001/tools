(function (utils) {
  utils.map = utils.map = utils.map || {};
  /**
   * utils.map.RData类的构造函数
   * @class
   * @alias utils.map.RData
   * @classdesc utils.map.RData
   * @description 数据预处理工具类 <br />
   * 实现转换树形数据为平面数据 <br />
   * 实现自动为点位数据添加其对应缩放层级 <br />
   * 实现自动计算点位数据父级坐标
   * 
   * @constructor
   * 
   * @property {Array} _source 原始数据列表
   * @property {Array} _target 预处理后的(添加了数据缩放范围的)数据
   * @property {String} _childrenKey 数据项子项的属性名称，默认 children
   * @property {String} _levelKey 数据项所在层级的属性名称，默认 level
   * @property {String} _levelPrefix dataLevelZoom中层级对应的属性前缀，默认 lv
   * @property {Json} _dataLevelZoom 数据所在层级(level)与地图缩放层级映射对象 <br /> <span style="color: red;">固定格式，注意属性名称大小写敏感</span> <br /> { 'lv0': { minZoom: 6, maxZoom: 16} } 
   * @property {String} _attentionKey 我的关注标识的key，默认 80001
   * @property {Boolean} _isCalcPointToParent 标识是否计算父级节点的基本信息，默认 true
   * @property {Number} _dataMaxLevel 数据结构的最大层级，计算属性，不可外部操作
   * 
   * @param {Json} opts 用户设置项
   * @param {Array} opts.source 需要预处理的数据源
   * @param {String} opts.childrenKey 数据项子项的属性名称，默认 children
   * @param {String} opts.levelKey 数据项所在层级的属性名称，默认 level
   * @param {String} opts.levelPrefix dataLevelZoom中层级对应的属性前缀，默认 lv
   * @param {Json} opts.dataLevelZoom 数据所在层级(level)与地图缩放层级映射对象 <br /> <span style="color: red;">固定格式，注意属性名称大小写敏感</span> <br /> { 'lv0': { minZoom: 6, maxZoom: 16} }
   * @param {String} opts.attentionKey 标识我的关注标识的key，默认 80001
   * @param {Boolean} opts.isCalcPointToParent 标识是否计算父级节点的基本信息，默认 true <br /> <span style="color: red;"><b>注意</b> 此选项只适用于树结构数据</span>
   * @param {Boolean} opts.isCachedSource 是否需要缓存原始数据，默认为 false 不缓存 <br /> <span style="color: red;">建议：生产环境不缓存以减少内存占用率</span>
   * @param {Boolean} opts.isFromTree 数据源类型是否是树形数据，默认为 true
   * @param {Function} opts.convertAttrs 数据预处理时，用作转换数据属性名称使用 <br />
   * target convertAttrs函数参数，转换后的数据对象 <br />
   * source convertAttrs函数参数，转换前的元数据对象 <br />
   * <span style="color:red;">target对象属性</span> <br />
   * { <br />
   *    id: '',   //必要 <br />
   *    name: '', //必要 <br />
   *    pid: '',  //必要 <br />
   *    x: x,     //必要 <br />
   *    y: y,     //必要 <br />
   *    isMyAttention: false, //非必要 <br />
   *    level: 0, //非必要 <br />
   *    minZoom: 6, //必要 <br />
   *    maxZoom: 16,//必要 <br />
   *    attrs: {  //自定义属性，非必要 <br />
   *    } <br />
   * } <br />
   * 
   * @example 参考示例一 (树结构数据)
   * var data = [{"id":"1164840296","text":"国网南京供电公司","pid":"0","children":[{"id":"-1652725488","text":"测试","pid":"1164840296","tag":{"d_MapX":0,"d_MapY":0},"children":[{"id":"1906114314","text":"110kV青浦变电站","pid":"-1652725488","tag":{"d_MapX":0,"d_MapY":0},"children":[],"level":2},{"id":"-737077743","text":"110kV沙沟变电站","pid":"-1652725488","tag":{"d_MapX":0,"d_MapY":0},"children":[],"level":2},{"id":"1108277860","text":"169","pid":"-1652725488","tag":{"d_MapX":118.881317,"d_MapY":31.941127},"children":[],"level":2},{"id":"-621562843","text":"28","pid":"-1652725488","tag":{"d_MapX":0,"d_MapY":0},"children":[],"level":2},{"id":"293957994","text":"35kV唐洋变电站","pid":"-1652725488","tag":{"d_MapX":0,"d_MapY":0},"children":[],"level":2}],"level":0}]}];
   * 
   * mm = new utils.map.RData({
   *  source: data,
   *  dataLevelZoom: {"lv0":{"minZoom":6,"maxZoom":9},"lv1":{"minZoom":10,"maxZoom":13},"lv2":{"minZoom":14,"maxZoom":16}},
   * 
   *  //当数据源中坐标属性名称不是 x、y 时使用此选项适配
   *  //此选项还可以用作扩展结果对象属性使用
   *  convertAttrs: function(target, source){
   *    target.x = source.x = source.tag ? (source.tag.d_MapX || source.tag.MapX) : 0;
   *    target.y = source.y = source.tag ? (source.tag.d_MapY || source.tag.MapY) : 0;
   *  },
   *  isCachedSource: true,
   *  isCalcPointToParent: true
   * })
   * mm._target //返回转换后的数据
   * 
   * @example 参考示例二 (平面结构数据)
   * var data = [{"id":"1164840296","text":"国网南京供电公司","pid":"0","level":0},{"id":"-1652725488","text":"测试","pid":"1164840296","tag":{"d_MapX":0,"d_MapY":0},"level":2},{"id":"1906114314","text":"110kV青浦变电站","pid":"-1652725488","tag":{"d_MapX":0,"d_MapY":0},"level":2},{"id":"-737077743","text":"110kV沙沟变电站","pid":"-1652725488","tag":{"d_MapX":0,"d_MapY":0},"level":2},{"id":"1108277860","text":"169","pid":"-1652725488","tag":{"d_MapX":118.881317,"d_MapY":31.941127},"level":2},{"id":"-621562843","text":"28","pid":"-1652725488","tag":{"d_MapX":0,"d_MapY":0},"level":2},{"id":"293957994","text":"35kV唐洋变电站","pid":"-1652725488","tag":{"d_MapX":0,"d_MapY":0},"level":2}];
   * 
   * mm = new utils.map.RData({
   *  source: data,
   *  dataLevelZoom: {"lv0":{"minZoom":6,"maxZoom":9},"lv1":{"minZoom":10,"maxZoom":13},"lv2":{"minZoom":14,"maxZoom":16}},
   *  convertAttrs: function(target, source){
   *    target.x = source.x = source.tag ? (source.tag.d_MapX || source.tag.MapX) : 0;
   *    target.y = source.y = source.tag ? (source.tag.d_MapY || source.tag.MapY) : 0;
   *  },
   * 
   *  // 使用平面结构数据 此选项需要设置为 false 
   *  isFromTree: false,
   *  isCachedSource: true,
   *  isCalcPointToParent: true
   * })
   * mm._target //返回转换后的数据
   */
  utils.map.RData = function (opts) {
    opts = opts || {};

    this._source = [];  //缓存的原始数据
    this._target = [];  //缓存的预处理后的(添加了数据缩放范围的)数据
    this._childrenKey = 'children'; //子项的属性名称
    this._levelKey = 'level'; //所在层级的属性名称
    this._levelPrefix = 'lv'; //dataLevelZoom中层级对应的属性前缀
    this._dataLevelZoom = {}; //数据所在level对应的地图缩放层级
    this._attentionKey = '80001'; //我的关注标识key
    this._isCalcPointToParent = true; //是否计算父级节点基本信息(point/count)
    this._dataMaxLevel = 0;

    /**
     * _opts是默认参数赋值。
     * 下面通过用户输入的opts，对默认参数赋值
     * @private
     * @type {Json}
     */
    this._opts = utils.map.tools.extend(utils.map.tools.extend(this._opts || {
      /**
       * 预处理的原数据
       * @private
       * @type {Array}
       */
      source: this._source,
      /**
       * 子项的属性名称
       * @private
       * @type {String}
       */
      childrenKey: this._childrenKey,
      /**
       * 所在层级的属性名称
       * @private
       * @type {String}
       */
      levelKey: this._levelKey,
      /**
       * dataLevelZoom中层级对应的属性前缀
       * @private
       * @type {String}
       */
      levelPrefix: this._levelPrefix,
      /**
       * 数据所在level对应的地图缩放层级
       * @private
       * @type {Array}
       */
      dataLevelZoom: this._dataLevelZoom,
      /**
       * 标识我的关注标识key
       * @private
       * @type {String}
       */
      attentionKey: this._attentionKey,
      /**
       * 标识是否需要计算父级节点的坐标
       * @private
       * @type {Boolean}
       */
      isCalcPointToParent: this._isCalcPointToParent,
      /**
       * 是否缓存原始数据，默认为 false
       * @private
       * @type {Boolean}
       */
      isCachedSource: false,
      /**
       * 数据源类型是否是树形数据，默认为 true
       * @private
       * @type {Boolean}
       */
      isFromTree: true,
      /**
       * 数据预处理时额外执行函数
       * @private
       * @type {Function}
       */
      convertAttrs: function (target, source) {
        return target;
      }
    }), opts);

    this.setProperty();
    if (utils.map.tools.isArray(this._opts.source) && this._opts.source.length > 0) {
      this.initialize();
    }
  }
  /**
   * 初始化预处理数据对象
   * @param {Json} opts 用户设置项
   * @param {Array} opts.source 需要预处理的数据源
   * @param {Array} opts.dataLevelZoom 需要预处理的数据项的层级(level)对应的缩放范围
   * @param {String} opts.childrenKey 数据项子项的属性名称，默认 children
   * @param {String} opts.levelKey 数据项所在层级的属性名称，默认 level
   * @param {String} opts.levelPrefix dataLevelZoom中层级对应的属性前缀，默认 lv
   * @param {Json} opts.dataLevelZoom 数据所在层级(level)与地图缩放层级映射对象 <br /> <span style="color: red;">固定格式，注意属性名称大小写敏感</span> <br /> { 'lv0': { minZoom: 6, maxZoom: 16} }
   * @param {String} opts.attentionKey 标识我的关注标识的key，默认 80001
   * @param {Boolean} opts.isCalcPointToParent 标识是否计算父级节点的基本信息，默认 true <br /> <span style="color: red;"><b>注意</b> 此选项只适用于树结构数据</span>
   * @param {Boolean} opts.isCachedSource 是否需要缓存原始数据，默认为 false 不缓存 <br /> <span style="color: red;">建议：生产环境不缓存以减少内存占用率</span>
   * @param {Boolean} opts.isFromTree 数据源类型是否是树形数据，默认为 true
   * @param {Function} opts.convertAttrs 数据预处理时，用作转换数据属性名称使用 <br />
   * target convertAttrs函数 形参，转换后的数据对象 <br />
   * source convertAttrs函数 形参，转换前的元数据对象 <br />
   * <span style="color:red;">target对象属性</span> <br />
   * { <br />
   *    id: '',   //必要 <br />
   *    name: '', //必要 <br />
   *    pid: '',  //必要 <br />
   *    x: x,     //必要 <br />
   *    y: y,     //必要 <br />
   *    isMyAttention: false, //非必要 <br />
   *    level: 0, //非必要 <br />
   *    minZoom: 6, //必要 <br />
   *    maxZoom: 16,//必要 <br />
   *    attrs: {  //自定义属性，非必要 <br />
   *    } <br />
   * } <br />
   */
  utils.map.RData.prototype.initialize = function (opts) {
    opts = opts || {};
    this._opts = utils.map.tools.extend(this._opts, opts);

    if (utils.map.tools.isArray(this._opts.source) && !!this._opts.source.length) {
      this.refreshDefaults();
      this.setProperty();
      this[this._opts.isFromTree ? 'dataTreeToTable' : 'dataListToTable'](this._source, this._opts.convertAttrs);

      if (this._opts.isCachedSource == false) {
        this._source = [];
      }
    } else {
      throw '预处理数据源为空数组,请传入有效数据源';
    }
  }
  /**
   * 设置默认属性
   * @private
   */
  utils.map.RData.prototype.setProperty = function () {
    this._source = this._opts.source;
    this._childrenKey = this._opts.childrenKey;
    this._levelKey = this._opts.levelKey;
    this._levelPrefix = this._opts.levelPrefix;
    this._dataLevelZoom = this._opts.dataLevelZoom;
    this._attentionKey = this._opts.attentionKey;
    this._isCalcPointToParent = this._opts.isCalcPointToParent
  }
  /**
   * 恢复默认属性默认值
   */
  utils.map.RData.prototype.refreshDefaults = function () {
    this._source = [];
    this._target = [];
  }
  /**
   * 转换固定属性(maxZoom、minZoom)
   * 计算数据最大层级
   * @private
   * @param {Json} data 需要转换属性的元数据 <br />
   * @return {Json} 添加了maxZoom、minZoom、level的数据对象
   */
  utils.map.RData.prototype._convertAttrs = function (data) {
    var _level = this._dataLevelZoom[this._levelPrefix + data[this._levelKey]] || {};
    var _data = {
      id: isNaN(data.id / 1) ? data.id : data.id / 1,
      name: data.name || data.text,
      pid: isNaN(data.pid / 1) ? data.pid : data.pid / 1,
      x: data.x,
      y: data.y,
      isMyAttention: (data.id || '').toString().indexOf(this._attentionKey) > -1,
      level: data[this._levelKey],
      minZoom: _level.minZoom,
      maxZoom: _level.maxZoom,
    };
    if (_data.isMyAttention) {
      _data.attentionId = _data.id.toString().replace(this._attentionKey, '');
      _data.attentionId = isNaN(_data.attentionId / 1) ? _data.attentionId : _data.attentionId / 1;
    }
    this._dataMaxLevel = this._dataMaxLevel > _data.level ? this._dataMaxLevel : _data.level; //计算数据最大层级
    return _data;
  }
  /**
   * 预处理数据为平面数据，数据源为树形结构的数据
   * @param {Json} data 需要预处理的元数据
   * @param {Function} _convertAttrs 转换属性函数，默认根据设置添加minZoom、maxZoom、x、y属性后原样返回 <br />
   * target convertAttrs函数 形参，转换后的数据对象 <br />
   * source convertAttrs函数 形参，转换前的元数据对象 <br />
   * <span style="color:red;">target对象属性</span> <br />
   * { <br />
   *    id: '',   //必要 <br />
   *    name: '', //必要 <br />
   *    pid: '',  //必要 <br />
   *    x: x,     //必要 <br />
   *    y: y,     //必要 <br />
   *    isMyAttention: false, //非必要 <br />
   *    level: 0, //非必要 <br />
   *    minZoom: 6, //必要 <br />
   *    maxZoom: 16,//必要 <br />
   *    attrs: {  //自定义属性，非必要 <br />
   *    } <br />
   * } <br />
   */
  utils.map.RData.prototype.dataTreeToTable = function (data, _convertAttrs) {
    if (utils.map.tools.isArray(data)) {
      _convertAttrs = utils.map.tools.isFunction(_convertAttrs) ? _convertAttrs : function (target, source) {
        return target;
      };
      var _target = this._dataTreeToTable(data, _convertAttrs);
      this._target = this._target.concat(_target)
    }
  }
  /**
   * 预处理数据为平面数据，数据源为树形结构的数据
   * @private
   * @param {Json} data 需要预处理的元数据
   * @param {Function} _convertAttrs 转换属性函数，默认根据设置添加minZoom、maxZoom属性后原样返回
   * @param {Number} _level 树形层级，默认 0
   */
  utils.map.RData.prototype._dataTreeToTable = function (data, _convertAttrs, _level) {
    var _this = this;
    var _target = [];
    _this._myAttentionLeaf = _this._myAttentionLeaf || [];
    data.forEach(function (item) {
      var _targetChildrens = [];
      var _childrens = item[_this._childrenKey];
      var _targetItem = {};
      item[_this._levelKey] = _level || 0;
      _targetItem = _this._convertAttrs.call(_this, item);
      _targetItem = _convertAttrs.call(_this, _targetItem, item) || _targetItem;

      if (utils.map.tools.isArray(_childrens) && !!_childrens.length) {
        //先遍历子项
        _targetChildrens = _this._dataTreeToTable.call(_this, _childrens, _convertAttrs, item[_this._levelKey] + 1);
        //if (!!_targetChildrens.length && (_this._isCalcPointToParent == true || (_this._isCalcPointToParent == false && item[_this._levelKey] < _this._dataMaxLevel))) {
        if (!!_targetChildrens.length) {
          var _targetItemAttrs = _this._getNecessityAttrsToParent(_targetChildrens, item[_this._levelKey] + 1);
          _targetItem = utils.map.tools.extend(_targetItem, _targetItemAttrs);
        }
      }

      if (_targetItem.isMyAttention) {
        //处理我的关注
        _this._myAttentionLeaf.push(_targetItem.attentionId);
      } else {
        if (_this._myAttentionLeaf.indexOf(_targetItem.id) > -1) {
          _targetItem.attentionId = _targetItem.id;
          _targetItem.isMyAttention = true;
        }

        if (!!_targetItem.x && !!_targetItem.y) {
          _target.push(_targetItem);
        }
        _target = _target.concat(_targetChildrens);
      }
    });
    return _target;
  }
  /**
   * 计算数据层级父级基本属性信息 x,y,count
   * @private
   * @param {Array} data 需要计算点位数组
   * @return {Json} {count: 0, x: 0, y: 0}
   */
  utils.map.RData.prototype._getNecessityAttrsToParent = function (data, level) {
    var returns = {
      count: 0,
      x: 0,
      y: 0
    };
    for (var i = 0, item; item = data[i]; i++) {
      item.x = parseFloat(!!item.x ? item.x : 0);
      item.y = parseFloat(!!item.y ? item.y : 0);
      if (!!item.x && !!item.y && item.level == level) {
        returns.count += item.count || 1;
        returns.x = (item.x + (returns.x || item.x)) / 2;
        returns.y = (item.y + (returns.y || item.y)) / 2;
      }
    }
    return this._isCalcPointToParent ? returns : {
      count: returns.count
    };
  }
  /**
   * 预处理数据为平面数据，数据源平面数据
   * 注意： 元数据中需包含数据项的层级信息(与设置的层级(levelKey)属性名称相同的属性项)
   * @param {Json} data 需要预处理的元数据
   * @param {Function} _convertAttrs 转换属性函数，默认根据设置添加minZoom、maxZoom、x、y属性后原样返回 <br />
   * target convertAttrs函数 形参，转换后的数据对象 <br />
   * source convertAttrs函数 形参，转换前的元数据对象 <br />
   * <span style="color:red;">target对象属性</span> <br />
   * { <br />
   *    id: '',   //必要 <br />
   *    name: '', //必要 <br />
   *    pid: '',  //必要 <br />
   *    x: x,     //必要 <br />
   *    y: y,     //必要 <br />
   *    isMyAttention: false, //非必要 <br />
   *    level: 0, //非必要 <br />
   *    minZoom: 6, //必要 <br />
   *    maxZoom: 16,//必要 <br />
   *    attrs: {  //自定义属性，非必要 <br />
   *    } <br />
   * } <br />
   */
  utils.map.RData.prototype.dataListToTable = function (data, _convertAttrs) {
    if (utils.map.tools.isArray(data)) {
      _convertAttrs = utils.map.tools.isFunction(_convertAttrs) ? _convertAttrs : function (target, source) {
        return target;
      };
      var _this = this;
      data.forEach(function (item) {
        var _targetItem = _this._convertAttrs.call(_this, item);
        _targetItem = _convertAttrs.call(_this, _targetItem, item) || _targetItem;
        _this._target.push(_targetItem);
      });
    }
  }
  /**
   * 获取指定属性与之匹配的数据集合
   * @param {String|Number} value 需要查找的指定属性值
   * @param {String} key 可选，需要查找的指定属性，默认为 id
   * @return {Array}
   */
  utils.map.RData.prototype.getDataBykey = function (value, key) {
    var _data = [];
    if (!utils.map.tools.isString(key)) key = 'id';
    for (var i = 0, item; item = this._target[i]; i++) {
      if(item[key] == value){
        _data.push(item);
      }
    }
    return _data;
  }
  /**
   * 获取指定属性与之匹配的单个数据，默认返回第一个匹配的数据
   * @param {String|Number} value 需要查找的指定属性值
   * @param {String} key 可选，需要查找的指定属性，默认为 id
   * @return {Any|undefined}
   */
  utils.map.RData.prototype.getOnlyDataBykey = function (value, key) {
    var _data = undefined;
    if (!utils.map.tools.isString(key)) key = 'id';
    for (var i = 0, item; item = this._target[i]; i++) {
      if(item[key] == value){
        _data = item;
        break;
      }
    }
    return _data;
  }
  /**
   * 获取与自定义过滤函数匹配的数据集合
   * @param {Function} filter 可选 自定义过滤函数，默认全部返回
   * @return {Array}
   */
  utils.map.RData.prototype.getDatas = function (filter) {
    var _data = [];
    if (!utils.map.tools.isFunction(filter)) {
      filter = function () { return true; }
    }
    for (var i = 0, item; item = this._target[i]; i++) {
      if (filter(item)) {
        _data.push(item);
      }
    }
    return _data;
  }
  /*** utils.map.RData 代码结束 ***/
})(window.utils || (window.utils = {}))