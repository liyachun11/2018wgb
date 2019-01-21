/**
 * Created by liyachun on 2017/9/13.
 */
define([], function () {
  "use strict";
  var inphoneVerification = ["$scope","$location","locals","bdbAPI","$state","$interval", "loading", "$rootScope", "regularExpression", "exception", "$ionicHistory",
    function ($scope,$location,locals,bdbAPI,$state,$interval, loading, $rootScope, regularExpression, exception, $ionicHistory) {
      $scope.isTabs = true;
      //获取验证码
      var timer;
      $scope.paracont = '获取验证码';
      $scope.paraevent = true;
      $scope.flag = false;
      $scope.verificationInfo = {
        telephone : "",
        code : ""
      };

      $scope.verification = function () {
        try {
          if($scope.verificationInfo.telephone === ''){
            loading.toast($scope,"手机号不能为空");
          } else if (!regularExpression.cellPhoneRegEx.test($scope.verificationInfo.telephone)){
            loading.toast($scope,"手机号格式错误");
          } else {
            if($scope.paraevent){
              $scope.paraevent = false;
              $scope.flag = true;
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
              var reqData = {
                phoneNumber : $scope.verificationInfo.telephone
              };
              bdbAPI.sms(reqData).then(function (result) {
                if (result.code === 200) {

				  locals.set("USER_TOKEN",result.message);
                  console.log(result.message);
                  loading.toast($scope, "短信发送成功");

                } else {
                  loading.alertHint("温馨提示", result.data);
                }
              }, function (err) {
                loading.alertHint("温馨提示", err);
              })
            }
          }
        } catch (e) {
          exception.collectException(e, "iphoneVerificationCtrl");
        }
      };

      $scope.register = function () {
        try {
          if($scope.verificationInfo.telephone === ''){
            loading.toast($scope,"手机号不能为空");
          } else if (!regularExpression.cellPhoneRegEx.test($scope.verificationInfo.telephone)){
            loading.toast($scope,"手机号格式错误");
          } else if ($scope.verificationInfo.code === '') {
            loading.toast($scope,"请输入验证码");
          } else {
            var reqData = {
              vcode : $scope.verificationInfo.code
            };
            bdbAPI.register(reqData).then(function (result) {
              if (result.code === 200) {
                locals.setObject("userInfo", result.data);
                if (result.data.authentication === 1) {
                  loading.toast($rootScope, "登录成功");
                  $ionicHistory.goBack();
                } else {
                  loading.toast($rootScope, "注册成功");
                  var url = $location.absUrl().substring(0, $location.absUrl().indexOf("#")+1) + "/tab/my/certification";
                  location.replace(url);
                }
              } else {
                loading.alertHint("温馨提示", result.data);
              }
            }, function (err) {
              loading.alertHint("温馨提示", err);
            })
          }
        } catch (e) {
          exception.collectException(e, "iphoneVerificationCtrl");
        }
      }
  }];
  return inphoneVerification;
});
