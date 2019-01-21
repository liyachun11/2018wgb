/**
 * Created by liyachun on 2017/9/4.
 */
define([], function () {
  "use strict";
  var memberList = ["$scope","locals","bdbAPI","$state","loading","$rootScope", "$stateParams", "$timeout", "exception",
    function ($scope,locals,bdbAPI,$state,loading,$rootScope,$stateParams, $timeout, exception) {
    $scope.isSearch = false;
    var isFirst = true;

    $scope.addMember = function(){
      $state.go('tab.addMember',{
        id : $stateParams.id
      });
    };
    $scope.deleteMember = function(){
      $state.go('tab.deleteMember',{
        id : $stateParams.id,
        captainId : $stateParams.captainId
      });
    };
    $scope.memberData = function(id){
      $state.go('tab.myTrainRecord',{
        uid : id,
        projectId : $stateParams.projectId
      });
    };

    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.userInfo = locals.getObject("userInfo");
      $scope.searchInfo = {
        phoneAndName : ""
      };
      isFirst = true;
      $scope.domore = false;
      $scope.pageInfo = {
        currentPage : 1,
        pageSize : 10
      };
      getUserInfoByTeamId();
    });

    $scope.pageInfo = {
      currentPage : 0,
      pageSize : 10
    };

    $scope.captainId = $stateParams.captainId;

    $scope.domore = false;
    $scope.userInfoList = [];
    var timer = null;
    $scope.loadMore = function () {
      if (!$scope.domore && !isFirst) {
        $scope.pageInfo.currentPage++;
        getUserInfoByTeamId();
      }
    };

    function getUserInfoByTeamId() {
      try {
        var reqData = {
          currentPage : $scope.pageInfo.currentPage,
          orderSort : "desc",
          pageSize : $scope.pageInfo.pageSize,
          whereMap : {
            group_id : $stateParams.id
          }
        };
        bdbAPI.searchUsers(reqData).then(function (result) {
          if (result.code === 200) {
            if (result.data.totalPages === 0) {
              $scope.domore = true;
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              if ($scope.userInfoList.length === 0 || isFirst) {
                $scope.userInfoList = result.data.resultObject;
              } else {
                angular.forEach(result.data.resultObject, function (item) {
                  $scope.userInfoList.push(item);
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
            captionTop();
          } else {
            $scope.domore = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            loading.alertHint("温馨提示", result.data);
          }
          isFirst = false;
        }, function (err) {
          loading.alertError();
        });
      } catch (e) {
        exception.collectException(e, "memberListCtrl");
      }
    }

    function captionTop() {
      var captionInfo = "";
      angular.forEach($scope.userInfoList, function (userInfo, index) {
        if (userInfo.id == $stateParams.captainId) {
          captionInfo = userInfo;
          $scope.userInfoList.splice(index, 1);
        }
      });
      if (captionInfo !== "") {
        $scope.userInfoList.splice(0,0,captionInfo);
      }
    }

    $scope.searchUsers = function () {
      if ($scope.searchInfo.phoneAndName !== "") {
        $scope.userInfoTempList = [];
        angular.forEach($scope.userInfoList, function (userInfo) {
          if (/\d+/.test($scope.searchInfo.phoneAndName)) {
            if (userInfo.mobile.indexOf($scope.searchInfo.phoneAndName) !== -1) {
              $scope.userInfoTempList.push(userInfo);
            }
          } else {
            if (userInfo.name.indexOf($scope.searchInfo.phoneAndName) !== -1) {
              $scope.userInfoTempList.push(userInfo);
            }
          }
        });
        $scope.isSearch = true;
      }
    };

    $scope.changeSearchInfo = function () {
      if ($scope.searchInfo.phoneAndName === "") {
        $scope.isSearch = false;
      }
    }

  }];
  return memberList;
});
