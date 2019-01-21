/**
 * Created by xuehaipeng on 2017/3/28.
 */
require.config({
  // urlArgs: "bust=" + (new Date()).getTime(),  //防止读取缓存，调试用
  paths: {
    //一些库文件
    'jquery': 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min',
    'angular': 'https://cdn.bootcss.com/ionic/1.3.2/js/ionic.bundle.min',
    'angularCookies': '../lib/angular-cookies/angular-cookies.min',
    'exif': '../lib/exif',
    'moment' : '../lib/moment/moment.min',
    'adaptive':'../lib/adaptive',
    'md5':'../lib/md5',
    'ionic-datepicker' : '../lib/ionic-datepicker',
    //js文件
    'app': "app",
    'route': "routeConfig",
    'routeSetting': "routeSetting",
    'weixin' : '../lib/weixin'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'angular': {
      exports: 'angular'
    },
    'angularCookies':{
      deps: ['angular'],
      exports: 'angularCookies'
    },
    'moment': {
      exports: 'moment'
    },
    "adaptive":{
      exports:"adaptive"
    },
    'ionic-datepicker' : {
      deps: ['angular']
    },
    'weixin' : {
      exports: 'wx'
    }
  }
});
require(["jquery", "angular", "app", "adaptive", "md5", "ionic-datepicker", "weixin"], function ($, angular, app, adaptive) {
  //angularjs 启动
  angular.bootstrap(document, [app.name]);
  //rem计算
  adaptive.desinWidth = 720;
  adaptive.baseFont = 24;
  adaptive.init();
});
