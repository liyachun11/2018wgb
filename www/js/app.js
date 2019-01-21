define(["angular","weixin", "route", "framework","angularCookies"], function (angular,wx) {
  "use strict";
  var app = angular.module('starter', ['ionic','ionic-datepicker','ngCookies']);


  app.factory("statisticsFactory",function () {

    var tdapp = {
        _mySkills:function () {
          TDAPP.onEvent("我的技能");
        },
        _myTeam:function () {
          TDAPP.onEvent("我的团队");
        },
        _myTeam_addTeam:function () {
          TDAPP.onEvent("我的团队-创建团队");
        },
        _engineerTeam:function () {
          TDAPP.onEvent("工程队");
        },
        _engineerTeam_applyEngineerTeam:function () {
          TDAPP.onEvent("工程队-申请");
        },
        _engineerTeam_addEngineerTeam:function () {
          TDAPP.onEvent("工程队-创建班组");
        },
        _userHelp:function () {
          TDAPP.onEvent("使用帮助");
        },
        _feedBack:function () {
          TDAPP.onEvent("意见反馈");
        },
        _myRanking:function () {
          TDAPP.onEvent("我的排名");
        },
        _jiFenDongTai:function () {
          TDAPP.onEvent("积分动态轮播");
        },
        _yinHuanTiBao:function () {
          TDAPP.onEvent("隐患提报");
        },
        _anQuanJiFen:function () {
          TDAPP.onEvent("安全积分");
        },
        _yinHuanZhuiZong:function () {
          TDAPP.onEvent("隐患追踪");
        },
        _newsDetails:function () {
          TDAPP.onEvent("消息资讯信息");
        },
        _newsLookAll:function () {
          TDAPP.onEvent("消息资讯-查看全部");
        }
    };

    return tdapp;
  });
  app.factory("httpInterceptor",["$q", "$rootScope", function ($q,$rootScope) {
    return {
      request: function(config) {
        return config || $q.when(config);
      },
      requestError: function(rejection) {
        return $q.reject(rejection);
      },
      response: function(response) {
        return response || $q.when(reponse);
      },
      responseError : function(rejection) {
        return $q.reject(rejection);
      }
    };
  }]);
  app.run(["$rootScope","$ionicPlatform","loginService","locals","bdbAPI","$ionicPopup", "$location","$state","$timeout",function ($rootScope,$ionicPlatform,loginService,locals,bdbAPI,$ionicPopup,$location,$state,$timeout) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
    var needLoginView = ['tab.home', 'tab.my', 'tab.train'];  //监听路由事件
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
      if (needLoginView.indexOf(toState.name) !== -1) {
        $rootScope.hideTabs = false;
      } else {
        $rootScope.hideTabs = true;
      }
    });

	function getRequest() {
	   var url = location.href; //获取url中"?"符后的字串
	   var theRequest = new Object();
	   if (url.indexOf("?") != -1) {
		  var str = url.substr(1);
		  var strs = str.split("&");
		  for(var i = 0; i < strs.length; i ++) {
			 theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
		  }
	   }
	   return theRequest;
	}
	var requestParams=getRequest();
	if(requestParams.USER_TOKEN){
		locals.set("USER_TOKEN",requestParams.USER_TOKEN);
	}



  }])
    .service('loginService',['$rootScope', '$ionicModal', "locals",function ($rootScope, $ionicModal,locals) {
      $ionicModal.fromTemplateUrl('login.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.modal = modal;
      });
      this.openModal = function () {
        $rootScope.modal.show();
        $rootScope.isIdCard = locals.getObject("companyConfigs").ID_CARD_REQUIRED == 0 ? false : true;
        $rootScope.isName = true /*locals.getObject("companyConfigs").USER_LOGIN_TYPE == 1 ? true : false*/;
        $rootScope.isOnlyInnerReward = locals.getObject("companyInfo").agencyCompanyName.indexOf("延长") !== -1 ? true : false;
      };
      this.closeModal = function () {
        $rootScope.modal.hide();
      };
    }])
    .controller("tabChange",["$state", "$scope", "$rootScope", "tabSwitch", "locals", function ($state, $scope, $rootScope, tabSwitch, locals) {
      tabSwitch.setTab(3);
      $scope.selectTabWithIndex = function (index) {
        var userInfo = locals.getObject("userInfo");
        var curIndex = tabSwitch.getTab();
        if (curIndex !== index) {
          curIndex = index;
          switch (index) {
            case 0:
              $state.go('tab.home');
              break;
            case 1:
              if (!angular.isUndefined(userInfo.authentication) && userInfo.authentication === 0) {
                $state.go('tab.certification');
              } else {
                curIndex = 1;
                $state.go('tab.train', {
                  type:0,
                  orderLotId:0
                });
              }
              break;
            case 2:
              if (!angular.isUndefined(userInfo.authentication) && userInfo.authentication === 0) {
                $state.go('tab.certification');
              } else {
                $state.go('tab.my');
              }
              break;
          }
          tabSwitch.setTab(curIndex);
        }
      };
    }])
    .controller('login',['$scope','loginService','$interval','bdbAPI','locals','loading','$timeout',"regularExpression","$rootScope","$ionicPopup","$location",function ($scope, loginService,$interval,bdbAPI,locals,loading,$timeout,regularExpression,$rootScope,$ionicPopup,$location) {
      var timer;
      $scope.getcodeParam = {identityId:'',userPhone:'',userPhoneCode:''};
      $scope.closeLogin = function () {
        loginService.closeModal();
        $interval.cancel(timer);
        $scope.paracont = '获取验证码';
        $scope.paraevent = true;
        $scope.flag = false;
        $scope.getcodeParam = {identityId:'',userPhone:'',userPhoneCode:''};
        $location.path('/home');
      };

      //生成6位随机数
      function randomSix(){
        // 0-9的随机数
        $scope.arr = '';//容器
        for(var i =0;i<6;i++){//循环六次
          $scope.arr += Math.floor(Math.random()*10);//Math.random();每次生成(0-1)之间的数;
        }
      };
      //获取验证码
      $scope.paracont = '获取验证码';
      $scope.paraevent = true;
      $scope.flag = false;
      $scope.loginCode = function(){
        if($scope.getcodeParam.userPhone == undefined || $scope.getcodeParam.userPhone == ''){
          loading.toast($scope,"手机号不能为空");
          return false;
        }
        if (!regularExpression.cellPhoneRegEx.test($scope.getcodeParam.userPhone)){
          loading.toast($scope,"手机号错误");
          return false;
        }
        if($scope.paraevent){
          $scope.paraevent = false;
          $scope.flag = true;
          randomSix();
          var reqData = {phoneNumber:$scope.getcodeParam.userPhone,content:"您的验证码是:"+$scope.arr+"。请不要把验证码泄露给其他人。"};
          getCode(reqData);
          var second = 59;
          $scope.paracont = second + '秒后重发';
          timer = $interval(function(){
            if(second <=0){
              $interval.cancel(timer);
              $scope.paracont = '重发验证码';
              second = 59;
              $scope.paraevent = true;
              $scope.flag = false;
              $scope.arr = '';
            }else{
              second--;
              $scope.paracont = second + '秒后重发';
              $scope.paraevent = false;
              $scope.flag = true;
            }
          },1000);
        }
      };
      //发送短信
      function getCode(reqData) {
        //console.log(reqData);
        bdbAPI.getCode(reqData).then(function (data) {
          //console.log(data);
        },function (err) {
          console.log(err);
        })
      };

      function isValides(){
        if($scope.getcodeParam.userPhone == undefined || $scope.getcodeParam.userPhone == ''){
          loading.toast($scope,"手机号不能为空");
          return false;
        }
        if (!regularExpression.cellPhoneRegEx.test($scope.getcodeParam.userPhone)){
          loading.toast($scope,"手机号错误");
          return false;
        }
        if($scope.getcodeParam.userPhoneCode == undefined || $scope.getcodeParam.userPhoneCode == ''){
          loading.toast($scope,"验证码不能为空");
          return false;
        }
        if($scope.getcodeParam.userPhoneCode != $scope.arr){
          if($scope.arr != ''){
            loading.toast($scope,"验证码错误");
            return false;
          }else {
            loading.toast($scope,"验证码已过期，请重新获取");
            return false;
          }
        }
        if ($rootScope.isIdCard){
          if($scope.getcodeParam.identityId == undefined || $scope.getcodeParam.identityId == ''){
            loading.toast($scope,"身份证号不能为空");
            return false;
          }
          if(!regularExpression.idCardRegEx.test($scope.getcodeParam.identityId)){
            loading.toast($scope,"身份证号格式错误");
            return false;
          }
        }
        if ($rootScope.isName){
          if($scope.getcodeParam.name == undefined || $scope.getcodeParam.name == ''){
            loading.toast($scope,"姓名不能为空");
            return false;
          }
          if($scope.getcodeParam.name.length > regularExpression.nameLength){
            loading.toast($scope,"姓名不能超过"+regularExpression.nameLength+"个字符");
            return false;
          }
        }
        return true;
      }

      //提交
      $scope.submitForm = function(){
            if (isValides()){
              $scope.wxinfoParam = angular.fromJson(locals.getObject("companyInfo").wxInfo);
              //个人认证登陆
              var logonParam = {
                phone:$scope.getcodeParam.userPhone,md5Encode:1,name:$scope.getcodeParam.name == undefined ? '': $scope.getcodeParam.name,type:0,comeFrom:1,identityId:$scope.getcodeParam.identityId == undefined ? '' : $scope.getcodeParam.identityId,branchId:locals.getObject("companyInfo").branchId == undefined ? 0 : locals.getObject("companyInfo").branchId,agencyId:locals.getObject("companyInfo").agencyId,titleLevelId:1,upperUserId:locals.getObject("companyInfo").upperId,agencyUuid:locals.getObject("companyInfo").uuid,
                unionid:$scope.wxinfoParam.unionid,openid:$scope.wxinfoParam.openid,nickname:$scope.wxinfoParam.nickname,sex:$scope.wxinfoParam.sex,country:$scope.wxinfoParam.country,province:$scope.wxinfoParam.province,city:$scope.wxinfoParam.city,headimgurl:$scope.wxinfoParam.headimgurl
              };
              bdbAPI.checkLogin(logonParam).then(function (data) {
                //console.log(data);
                if(data.code == 200){
                  bdbAPI.loginGetUserInfo({userId:data.data.id}).then(function (source) {
                    if(source.code == 200){
                      if (source.data != null){
                        loginService.closeModal();
                        var companyInfo = locals.getObject("companyInfo");
                        if (companyInfo.agencyCompanyName.indexOf("延长") === -1) {
                          $location.path('/home');
                          loading.toast($rootScope,"登陆成功");
                        }else{
                          loading.toast($rootScope,"延长职工专属保险福利认证成功");
                        }

                        $interval.cancel(timer);
                        $scope.paracont = '获取验证码';
                        $scope.paraevent = true;
                        $scope.getcodeParam = {identityId:'',userPhone:'',userPhoneCode:''};
                        $scope.flag = false;
                        locals.setObject("userInfo",source.data);//已登录
                      }else {
                        loading.toast($rootScope,"登陆失败");
                      }
                    }else {
                      loading.toast($rootScope,"登陆失败");
                    }
                  },function (err) {
                    console.log(err);
                  })
                }else if(data.code == 405){
                  loading.toast($rootScope,data.data);
                }else if(data.code == 403){
                  loginService.closeModal();
                  $interval.cancel(timer);
                  $scope.paracont = '获取验证码';
                  $scope.paraevent = true;
                  $scope.getcodeParam = {identityId:'',userPhone:'',userPhoneCode:''};
                  $scope.flag = false;
                  loading.toast($rootScope,data.data);
                }else{
                  loading.toast($rootScope,"登陆失败");
                }
              },function (err) {
                loading.toast($rootScope,"网络异常，登陆失败");
                console.log(err);
              });
            }
      }

    }])

  return app;
});

