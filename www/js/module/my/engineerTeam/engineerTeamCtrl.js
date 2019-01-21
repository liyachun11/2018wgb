/**
 * Created by liyachun on 2017/9/4.
 */
define(["weixin"], function (wx) {
  "use strict";
  var engineerTeam = ["$scope","locals","bdbAPI","$state","loading","$rootScope", "exception", "$timeout","statisticsFactory",
    function ($scope,locals,bdbAPI,$state,loading,$rootScope, exception,$timeout,statisticsFactory) {
    var userInfo = locals.getObject("userInfo");
    $scope.isHint = false;
    var isFirst = true;
    $scope.engineerTeamDetail = function(){
      $state.go('tab.engineerTeamDetail',{
        id : $scope.projectInfo.projectteamid,
        captainId : $scope.project.projectUserId
      });
    };
    $scope.addEngineerTeam = function(){
      statisticsFactory._engineerTeam_addEngineerTeam();
      $state.go('tab.addEngineerTeam', {
        id : $scope.projectInfo.projectteamid
      });
    };
    $scope.teamDetailList = function(groupId,name){
      $state.go('tab.teamList',{
        id : groupId,
        projectId : $scope.projectInfo.projectteamid,
        name:name,
        status:$scope.project.workstate
      });
    };
    $scope.applyEngineerTeam = function(){
      statisticsFactory._engineerTeam_applyEngineerTeam();
      $state.go('tab.applyEngineerTeam',{});
    };

    getProjectTeamByUserId();
    $scope.projectInfo = {
      projectteamid : ""
    };

    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.userInfo = userInfo;
      if (!isFirst) {
        $scope.domore = false;
        $scope.pageInfo = {
          currentPage : 1,
          pageSize : 10
        };
        $scope.groupList = [];
        getGroup();
        getProjectTeamByUserId();
      }
      isFirst = false;
    });

    function getProjectTeamByUserId() {
      try {
        var reqData = {
          currentPage : 1,
          orderSort : "desc",
          pageSize : 999,
          whereMap : {
            userId : userInfo.id
          }
        };
        bdbAPI.getProjectTeamList(reqData).then(function (data) {
          if (data.code === 200) {
            $scope.projectTeamList = data.result.rows;
            if ($scope.projectTeamList.length > 0) {
              if ($scope.projectInfo.projectteamid === "") {
                $scope.projectInfo.projectteamid = $scope.projectTeamList[0].projectteamId;
              }
              angular.forEach($scope.projectTeamList, function (projectTeam) {
                if (projectTeam.projectteamId == $scope.projectInfo.projectteamid) {
                  $scope.project = projectTeam;
                  $timeout(function () {
                    $scope.isHint = true;
                  },1000);
                }
              });
            }
          } else {
            loading.alertHint("温馨提示", data.msg);
          }
        }, function (err) {
          loading.alertError();
        })
      } catch (e) {
        exception.collectException(e, "engineerTeamCtrl");
      }
    }

    $scope.$watch("projectInfo.projectteamid", function (n, o) {
      if (n !== null && n !== '') {
        angular.forEach($scope.projectTeamList, function (projectTeam) {
          if (projectTeam.projectteamId == $scope.projectInfo.projectteamid) {
            $scope.project = projectTeam;
            $timeout(function () {
              $scope.isHint = true;
            }, 1000);
          }
        });
        $scope.pageInfo = {
          currentPage : 1,
          pageSize : 10
        };
        $scope.groupList = [];
        getGroup();
      }
    });

    $scope.pageInfo = {
      currentPage : 0,
      pageSize : 10
    };

    $scope.domore = false;
    $scope.articleList = [];
    var timer = null;
    $scope.loadMore = function () {
      if (!$scope.domore) {
        $scope.pageInfo.currentPage++;
        getGroup();
      }
    };

    $scope.groupList = [];
    function getGroup() {
      if ($scope.projectInfo.projectteamid !== "") {
        try {
          var reqData = {
            currentPage : $scope.pageInfo.currentPage,
            orderSort : "desc",
            pageSize : $scope.pageInfo.pageSize,
            whereMap : {
              user_id : userInfo.id,
              eng_team_code: $scope.projectInfo.projectteamid,
              orderColumns : ['group_createDate']
            }
          };
          bdbAPI.getGroup(reqData).then(function (result) {
            if (result.code === 200) {
              if (result.data.totalPages === 0) {
                $scope.domore = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
              } else {
                if ($scope.groupList.length === 0) {
                  $scope.groupList = result.data.resultObject;
                } else {
                  angular.forEach(result.data.resultObject, function (item) {
                    $scope.groupList.push(item);
                  })
                }
                if (result.data.resultObject.length === 0) {
                  $scope.domore = true;
                } else if (result.data.resultObject.length < $scope.pageInfo.pageSize) {
                  $scope.domore = true;
                }
                timer = $timeout(function () {
                  $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 1500);
              }
            } else {
              $scope.domore = true;
              $scope.$broadcast('scroll.infiniteScrollComplete');
              loading.alertHint("温馨提示", result.data);
            }
          }, function (err) {
            $timeout.cancel(timer);
            loading.alertError();
          })
        } catch (e) {
          exception.collectException(e, "engineerTeamCtrl");
        }
      } else {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    }


  }];
  return engineerTeam;
});
