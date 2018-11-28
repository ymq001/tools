(function (window, mapurl) {
  window.mapconfig = {
    'img_format': '.jpg',
    'tiles_dir': 'http://172.26.1.40:8097/DSA3100Upload/maps/gismap/tiles',
    'home': './map/'
  }
  window.BMap_loadScriptTime = (new Date).getTime();
  document.write('<script type="text/javascript" src="' + mapconfig.home + 'offlinemap.js"></script>');
})(window, window.mapurl);
