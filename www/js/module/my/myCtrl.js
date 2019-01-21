/**
 * Created by liyachun on 2017/9/4.
 */
define(["weixin"], function (wx) {
  "use strict";
  var my = ["$scope","$location","locals","bdbAPI","$state","$ionicPopup","loading","statisticsFactory",
    function ($scope,$location,locals,bdbAPI,$state,$ionicPopup,loading,statisticsFactory) {

    $scope.certification = function(){//实名认证
      $state.go('tab.certification')
    };
    $scope.roleDate = function(){
      $state.go('tab.personalData',{})
    };
    $scope.mySkills = function(){
      statisticsFactory._mySkills();
      $state.go('tab.mySkills',{})
    };
    $scope.myTeam = function(){
      statisticsFactory._myTeam();
      $state.go('tab.myTeam',{})
    };
    $scope.engineerTeam = function(){
      statisticsFactory._engineerTeam();
      $state.go('tab.engineerTeam',{});
    };
    $scope.invitation = function(){
      $state.go('tab.invitation',{})
    };
    $scope.useHelp = function(){
      statisticsFactory._userHelp();
      $state.go("tab.useHelp",{});
    };
    $scope.feedBack =function(){
      statisticsFactory._feedBack();
      $state.go("tab.feedBack",{});
    };

    $scope.$on("$ionicView.enter", function () {
      $scope.userInfo = locals.getObject("userInfo");
      inviteCount();
    });

    function inviteCount() {
      var reqData = {
        id : $scope.userInfo.id
      };
      bdbAPI.inviteCount(reqData).then(function (result) {
        if (result.code === 200) {
          $scope.inviteCount = result.data;
        } else {
          loading.alertHint("温馨提示", result.data);
        }
      }, function (err) {
        loading.alertError();
      })
    }

  }];
  return my;
});
