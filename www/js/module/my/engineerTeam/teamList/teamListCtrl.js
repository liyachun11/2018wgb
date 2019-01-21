/**
 * Created by liyachun on 2017/9/8.
 */
define(["weixin"], function (wx) {
  "use strict";
  var teamList = ["$scope","locals","bdbAPI","$state","loading","$stateParams","constValue", "$timeout", function ($scope,locals,bdbAPI,$state,loading,$stateParams,constValue, $timeout) {
    $scope.isSearch = false;
    var isFirst = true;
    $scope.teamName = $stateParams.name;
    $scope.workstate = $stateParams.status;
    $scope.informList = [
      {id:0,name:'班组详情'},
      {id:1,name:'添加'},
      {id:2,name:'待加入'},
      {id:3,name:'退场'}
    ];
    $scope.detailList = function(id){
      if(id == 0){
        $state.go('tab.teamListDetail',{
          id : $stateParams.id,
          captainId : $scope.groupInfo.user.id,
          name : $scope.groupInfo.name,
          projectId : $stateParams.projectId
        });
      }
      if(id == 1){
        $state.go('tab.teamDetailAddMembers',{
          groupId : $stateParams.id,
          captainId : $scope.groupInfo.user.id,
          projectId : $stateParams.projectId
        });
      }
      if(id == 2){
        $state.go('tab.waitMember',{
          id : $stateParams.id
        });
      }
      if(id == 3){
        $state.go('tab.exitApplication',{
          groupId : $stateParams.id,
          captainId : $scope.groupInfo.user.id,
          projectId : $stateParams.projectId
        });
      }
    };

    $scope.memberData = function(id){
      $state.go('tab.memberData',{
        id : id
      });
    };

    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.userInfo = locals.getObject("userInfo");
      getTeamInfo();
    });

    function getTeamInfo() {
      var reqData = {
        id : $stateParams.id
      };
      bdbAPI.groupHandler(reqData, constValue.httpType.GET).then(function (result) {
        if (result.code === 200) {
          $scope.groupInfo = result.data;
          $scope.searchInfo = {
            phoneAndName : ""
          };
          isFirst = true;
          $scope.domore = false;
          $scope.pageInfo = {
            currentPage : 1,
            pageSize : 10
          };
          getUserInfoByGroupId();
        } else {
          loading.alertHint("温馨提示", result.data);
        }
      }, function (err) {
        loading.alertError();
      })
    }

    $scope.pageInfo = {
      currentPage : 0,
      pageSize : 10
    };

    $scope.domore = false;
    $scope.userInfoList = [];
    var timer = null;
    $scope.loadMore = function () {
      if (!$scope.domore && !isFirst) {
        $scope.pageInfo.currentPage++;
        getUserInfoByGroupId();
      }
    };

    function getUserInfoByGroupId() {
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
        exception.collectException(e, "teamListCtrl");
      }
    }

    function captionTop() {
      angular.forEach($scope.userInfoList, function (userInfo, index) {
        if (userInfo.id == $scope.groupInfo.user.id) {
          $scope.userInfoList.splice(index, 1);
        }
      });
    }

  }];
  return teamList;
});
