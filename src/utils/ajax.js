(function () {
  if (!!$ || !!jQuery) {
    $.ajaxSetup({
      type: 'post',
      dataType: 'json',
      beforeSend: function (xhr, jqXHR) {
        //可以设置自定义标头
        //xhr.setRequestHeader('Content-Type', 'application/xml;charset=utf-8');
        //show.append('beforeSend invoke!' + '<br/>');
        //console.log(xhr)
        var data = {
          username: utils.getUriParamValue('username'),
          password: utils.getUriParamValue('password'),
          lan: utils.getUriParamValue('lan'),
          style: utils.getUriParamValue('style'),
          F: utils.getUriParamValue('F')
        }
        if (jqXHR.url.toLowerCase().indexOf('username=') > -1 || (jqXHR.data || '').toLowerCase().indexOf('username=') > -1) delete data.username;
        if (jqXHR.url.toLowerCase().indexOf('password=') > -1 || (jqXHR.data || '').toLowerCase().indexOf('password=') > -1) delete data.password;
        if (jqXHR.url.toLowerCase().indexOf('lan=') > -1 || (jqXHR.data || '').toLowerCase().indexOf('lan=') > -1) delete data.lan;
        if (jqXHR.url.toLowerCase().indexOf('style=') > -1 || (jqXHR.data || '').toLowerCase().indexOf('style=') > -1) delete data.style;
        if (jqXHR.url.toLowerCase().indexOf('f=') > -1 || (jqXHR.data || '').toLowerCase().indexOf('f=') > -1) delete data.F;
        if ($.isEmptyObject(data) == false) {
          if (jqXHR.url.indexOf('?') > -1) {
            jqXHR.url = `${jqXHR.url}&${$.param(data)}`;
          } else {
            jqXHR.url = `${jqXHR.url}?${$.param(data)}`;
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  }
})()