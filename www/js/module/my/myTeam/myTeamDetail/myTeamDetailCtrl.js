define([], function () {
  "use strict";
  var myTeamDetail = ["$scope", "bdbAPI", "$state", "$stateParams", "exception", "constValue", "loading", "$ionicPopup", "$ionicHistory", "$rootScope", "locals",
    function ($scope, bdbAPI, $state, $stateParams, exception, constValue, loading, $ionicPopup, $ionicHistory, $rootScope, locals) {

    $scope.teamChange = function(){
      if ($scope.userInfo.id == $scope.teamDetail.captain.id) {
        $state.go('tab.captainChange', {
          id : 0,
          teamId : $stateParams.id,
          captainId : $scope.teamDetail.captain.id
        })
      } else {
        loading.toast($scope, "您不是该团队的队长，不能进行此操作！");
      }
    };
    $scope.memberList = function(){
      $state.go('tab.memberList',{
        id : $scope.teamDetail.id,
        captainId : $scope.teamDetail.captain.id
      })
    };
    $scope.teamDetail = {};

    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.userInfo = locals.getObject("userInfo");
      getTeamDetail();
    });

    function getTeamDetail() {
      try {
        var reqData = {
          id : $stateParams.id
        };
        bdbAPI.teamHandler(reqData, constValue.httpType.GET).then(function (result) {
          if (result.code === 200) {
            $scope.teamDetail = result.data;
          }
        }, function (err) {
          console.log(err);
        })
      } catch (e) {
        exception.collectException(e, "myTeamDetailCtrl");
      }
    }

    $scope.deleteTeam = function () {
      try {
        $ionicPopup.confirm({
          title: '温馨提示',
          template: '团队解散后不可恢复，是否解散？',
          cssClass: 'myBtn',
          buttons:[
            {
              text:"取消",
              type:"button "
            },
            {
              text:"解散",
              type:"button button-outline button-assertive",
              onTap : function () {
                var reqData = {
                  id : $stateParams.id
                };
                bdbAPI.teamHandler(reqData, constValue.httpType.DELETE).then(function (result) {
                  if (result.code === 200) {
                    loading.toast($rootScope, result.data);
                    $ionicHistory.goBack();
                  } else {
                    loading.alertHint("温馨提示", result.data);
                  }
                }, function (err) {
                  loading.alertError();
                });
              }
            }
          ]
        });
      } catch (e) {
        exception.collectException(e, "myTeamDetailCtrl");
      }
    };

    $scope.updateTeam = function () {
      try {
        $ionicPopup.confirm({
          title: '温馨提示',
          template: '是否更新团队信息',
          cssClass: 'myBtn',
          buttons:[
            {
              text:"取消",
              type:"button "
            },
            {
              text:"确认",
              type:"button button-outline button-assertive",
              onTap : function () {
                var reqData = {
                  id : $stateParams.id,
                  data : {
                    name : $scope.teamDetail.name,
                    introduction : $scope.teamDetail.introduction
                  }
                };
                bdbAPI.teamHandler(reqData, constValue.httpType.PUT).then(function (result) {
                  if (result.code === 200) {
                    loading.toast($rootScope, result.data);
                    $ionicHistory.goBack();
                    $scope.modifyBut = true;
                  } else {
                    loading.alertHint("温馨提示", result.data);
                  }
                }, function (err) {
                  loading.alertError();
                });
              }
            }
          ]
        });
      } catch (e) {
        exception.collectException(e, "myTeamDetailCtrl");
      }
    };
    $scope.ngSelecte = true;
    $scope.modifyBut = true;
    $scope.modify = function(){
      $scope.modifyBut = false;
      $scope.ngSelecte = false;
    };

    $scope.removeTeam = function () {
      try {
        $ionicPopup.confirm({
          title: '温馨提示',
          template: '是否退出团队？',
          cssClass: 'myBtn',
          buttons:[
            {
              text:"取消",
              type:"button"
            },
            {
              text:"退出",
              type:"button button-outline button-assertive",
              onTap : function () {
                var reqData = {
                  usersId : [],
                  teamId : $stateParams.id
                };
                reqData.usersId.push($scope.userInfo.id);
                console.log(reqData);
                bdbAPI.delteUsers(reqData).then(function (result) {
                  if (result.code === 200) {
                    loading.toast($rootScope, "退出成功");
                    $ionicHistory.goBack();
                  } else {
                    loading.alertHint("温馨提示", result.data);
                  }
                }, function (err) {
                  loading.alertError();
                })
              }
            }
          ]
        });
      } catch (e) {
        exception.collectException(e, "myTeamDetailCtrl");
      }
    }

  }];
  return myTeamDetail;
});
