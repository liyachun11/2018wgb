/**
 * Created by liyachun on 2017/9/4.
 */
define(["weixin"], function (wx) {
  "use strict";
  var train = ["$scope","$location","locals","bdbAPI","$state","$timeout","loading",function ($scope,$location,locals,bdbAPI,$state,$timeout,loading) {
      var userInfo = locals.getObject("userInfo");
      var isFirst = true;

      $scope.teamDetailList = function(groupId, captainId){
        $state.go('tab.groupMemberList',{
          id : groupId,
          captainId : captainId,
          projectId : $scope.projectInfo.projectteamid
        });
      };

      getProjectTeamByUserId();

      $scope.projectInfo = {
        projectteamid : ""
      };

      $scope.$watch("projectInfo.projectteamid", function (n) {
        if (n !== null && n !== '') {
          $scope.pageInfo = {
            currentPage : 1,
            pageSize : 10
          };
          $scope.groupList = [];
          getGroup();
        }
      });

      $scope.$on("$ionicView.beforeEnter", function () {
        if (!isFirst) {
          $scope.domore = false;
          $scope.pageInfo = {
            currentPage : 1,
            pageSize : 10
          };
          $scope.groupList = [];
          getGroup();
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
                $scope.projectInfo.projectteamid = $scope.projectTeamList[0].projectteamId;
              }
            } else {
              loading.alertHint("温馨提示", data.msg);
            }
          }, function (err) {
            loading.alertError();
          })
        } catch (e) {
          exception.collectException(e, "trainCtrl");
        }
      }

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
              "currentPage" : $scope.pageInfo.currentPage,
              "orderSort" : "desc",
              "pageSize" : $scope.pageInfo.pageSize,
              "whereMap" : {
                "user_id" : userInfo.id,
                "eng_team_code": $scope.projectInfo.projectteamid
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
            exception.collectException(e, "trainCtrl");
          }
        } else {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      }
      $scope.myTrainRecord = function(){
        $state.go('tab.myTrainRecord', {
          projectId : $scope.projectInfo.projectteamid
        })
      };



  }];
  return train;
});
