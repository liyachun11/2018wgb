/**
 * Created by liyachun on 2017/9/8.
 */
define(["weixin"], function (wx) {
  "use strict";
  var engineerTeamDetail = ["$scope","locals","bdbAPI","loading", "$stateParams", "$state", function ($scope,locals,bdbAPI,loading,$stateParams,$state) {
    $scope.captainId = $stateParams.captainId;
    $scope.projectTeamInfo = {
      state : 3
    };

    $scope.teamChange = function(){
      $state.go('tab.captainChange',{
        id : 2,
        teamId : $stateParams.id,
        captainId : $stateParams.captainId
      })
    };

    $scope.$on("$ionicView.enter", function () {
      $scope.userInfo = locals.getObject("userInfo");
      getProjectTeamInfo();
    });

    function getProjectTeamInfo() {
      var reqData = {
        projectteamid : $stateParams.id
      };
      bdbAPI.getProjectTeamInfo(reqData).then(function (data) {
        if (data.code === 200) {
          $scope.projectTeamInfo = data.result;
          console.log($scope.projectTeamInfo);
        }
      }, function (err) {
        loading.alertError();
      })
    }

  }];
  return engineerTeamDetail;
});
