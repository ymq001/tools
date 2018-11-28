(function () {
  if (!!$ || !!jQuery) {
    $.ajaxSetup({
      type: 'post',
      dataType: 'json',
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
    var ajax = $.ajax;
    $.ajax = function () {
      var data = {
        username: utils.getUriParamValue('username'),
        password: utils.getUriParamValue('password'),
        lan: utils.getUriParamValue('lan'),
        style: utils.getUriParamValue('style'),
        F: utils.getUriParamValue('F')
      }
      var args = Array.prototype.slice.call(arguments);
      if (args.length == 1) {
        args[0].data = $.extend(args[0].data, data);
        return ajax(args[0]);
      } else {
        args[1].data = $.extend(args[1].data, data);
        return ajax(args[0], args[1]);
      }
    }
  }
})()