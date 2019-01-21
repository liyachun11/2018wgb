/**
 * Created by liyachun on 2017/9/4.
 */
define([], function () {
  "use strict";
  var myTeam = ["$scope","bdbAPI","$state", "locals", "$ionicPopup", "loading","statisticsFactory",
    function ($scope,bdbAPI,$state, locals, $ionicPopup, loading,statisticsFactory) {
    var userInfo = locals.getObject("userInfo");

    $scope.addTeam = function(){
      statisticsFactory._myTeam_addTeam();
      $state.go('tab.addTeam',{});
    };
    $scope.myTeamDetail = function (teamId) {
      $state.go('tab.myTeamDetail',{
        id : teamId
      })
    };

    $scope.teamList = [];
    $scope.$on("$ionicView.beforeEnter", function () {
      getTeamListByUserId();
    });

    function getTeamListByUserId() {
      try {
        var reqData = {
          userId : userInfo.id
        };
        bdbAPI.getTeamListByUserId(reqData).then(function (result) {
          if (result.code === 200) {
            $scope.teamList = result.data;
          } else {
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          console.log(err);
        })
      } catch (e) {
        exception.collectException(e, "myTeamCtrl");
      }
    }

  }];
  return myTeam;
});
