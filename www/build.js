/**
 * Created by xuehaipeng on 2017/7/6.
 */
({
  appDir: './',
  baseUrl: './js',
  dir: '../www/dist',
  modules: [
    {
      name: 'main'
    }
  ],
  fileExclusionRegExp: /^(r|build)\.js$/,
  optimizeCss: 'standard',
  //重点设置，防止压缩后变量名报错
  removeCombined: true,
  optimize: "uglify",
  uglify: {
    mangle: false  //false 不混淆变量名
  },
  findNestedDependencies: true,
  //
  paths: {
    //一些库文件
    'jquery': '../lib/jquery-3.2.0.min',
    'angular': '../lib/ionic/js/ionic.bundle.min',
    'exif': '../lib/exif',
    'weui':'../lib/jquery-weui.min',
    'moment' : '../lib/moment/moment.min',
    'adaptive':'../lib/adaptive',
    'md5':'../lib/md5',
    'ionic-datepicker' : '../lib/ionic-datepicker',
    //js文件
    'app': "app",
    'route': "routeConfig",
    'routeSetting': "routeSetting",
    'weixin' : '//res.wx.qq.com/open/js/jweixin-1.2.0'
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
    'route' : {
      deps: ['angular'],
      exports : 'route'
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
})
