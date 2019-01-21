/**
 * Created by liyachun on 2017/9/4.
 */
define(["weixin"], function (wx) {
  "use strict";
  var myTeamDetail = ["$scope", "bdbAPI","$stateParams", "locals", "$ionicPopup", "$timeout", "loading", "$rootScope", "$ionicHistory",
    function ($scope, bdbAPI, $stateParams, locals, $ionicPopup, $timeout, loading, $rootScope, $ionicHistory) {

    $scope.isSearch = false;
    var userInfo = locals.getObject("userInfo");

    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.searchInfo = {
        phoneAndName : ""
      }
    });

    $scope.pageInfo = {
      currentPage : 0,
      pageSize : 10
    };

    $scope.captainId = $stateParams.captainId;

    $scope.domore = false;
    $scope.userInfoList = [];
    var timer = null;
    var type = 0;
    $scope.loadMore = function () {
      if (!$scope.domore) {
        $scope.pageInfo.currentPage++;
        type = $stateParams.id;
        getUserInfoById(type);
      }
    };

    function getUserInfoById(type) {
      try {
        var reqData = {
          currentPage : $scope.pageInfo.currentPage,
          orderSort : "desc",
          pageSize : $scope.pageInfo.pageSize,
          whereMap : {}
        };
        switch (type) {
          case "0":
            reqData.whereMap.team_id = $stateParams.teamId;
            break;
          case "1":
            reqData.whereMap.group_id = $stateParams.teamId;
            break;
          case "2":
            reqData.whereMap.engTeamCode = $stateParams.teamId;
            break;
        }
        bdbAPI.searchUsers(reqData).then(function (result) {
          if (result.code === 200) {
            if (result.data.totalPages === 0) {
              $scope.domore = true;
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              if ($scope.userInfoList.length === 0) {
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
            captionTop($scope.userInfoList);
          } else {
            $scope.domore = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          loading.alertError();
        })
      } catch (e) {
        exception.collectException(e, "deleteMemberCtrl");
      }
    }

    function captionTop(userInfoList) {
      angular.forEach(userInfoList, function (userInfo, index) {
        if (userInfo.id == $stateParams.captainId) {
          userInfoList.splice(index, 1);
        }
      });
    }

    $scope.searchUsers = function () {
      if ($stateParams.id == 2) {
        searchUsersByEngTeamCode();
      } else {
        if ($scope.searchInfo.phoneAndName !== "") {
          $("[name=chkItem2]:checked").each(function () {
            $(this)[0].checked = false;
          });
          $scope.deleteList = [];
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
          captionTop($scope.userInfoTempList);
          $scope.isSearch = true;
        }
      }
    };

    function searchUsersByEngTeamCode() {
      if ($scope.searchInfo.phoneAndName === "") {
        loading.toast($scope, "请输入搜索内容");
      } else {
        var reqData = {
          currentPage : 1,
          orderSort : "desc",
          pageSize : 999,
          whereMap : {
            engTeamCode : $stateParams.teamId
          }
        };
        if (/\d+/.test($scope.searchInfo.phoneAndName)) {
          reqData.whereMap.mobile = $scope.searchInfo.phoneAndName;
        } else {
          reqData.whereMap.name = $scope.searchInfo.phoneAndName;
        }
        bdbAPI.searchUsers(reqData).then(function (result) {
          if (result.code === 200) {
            $scope.userInfoList = result.data.resultObject;
            captionTop($scope.userInfoList);
          }
        }, function (err) {
          loading.alertError();
        })
      }
    }

    $scope.changeSearchInfo = function () {
      if ($scope.searchInfo.phoneAndName === "") {
        $scope.isSearch = false;
      }
    };

    $scope.transfer = function (user) {
      $ionicPopup.confirm({
        title: '温馨提示',
        template: '您是否要进行队长转让',
        cssClass: 'myBtn',
        buttons:[
          {
            text:"确认",
            type:"button button-outline button-balanced",
            onTap : function () {
              switch (type) {
                case "0":
                  var reqData = {
                    teamId : $stateParams.teamId,
                    oldCaptain : userInfo.id,
                    newCaptain : user.id
                  };
                  bdbAPI.captainTransferByTeam(reqData).then(function (result) {
                    if (result.code === 200) {
                      loading.toast($rootScope, result.data);
                      $ionicHistory.goBack();
                    } else {
                      loading.alertHint("温馨提示", result.data);
                    }
                  }, function (err) {
                    loading.alertError();
                  });
                  break;
                case "1":
                  var reqData = {
                    groupId : $stateParams.teamId,
                    oldCaptainId : userInfo.id,
                    newCaptainId : user.id
                  };
                  bdbAPI.captainTransferByGroup(reqData).then(function (result) {
                    if (result.code === 200) {
                      loading.toast($rootScope, result.data);
                      addGroupByAZB($stateParams.teamId, user);
                      $ionicHistory.goBack();
                    } else {
                      loading.alertHint("温馨提示", result.data);
                    }
                  }, function (err) {
                    loading.alertError();
                  });
                  break;
                case "2":
                  var reqData = {
                    projectteam : $stateParams.teamId,
                    oldLeaderCode : $stateParams.captainId,
                    newLeaderCode : user.id,
                    newLeaderName : user.name,
                    newLeadertel : user.mobile,
                    newLeaderIDCard : user.idCard
                  };
                  bdbAPI.teamAttorn(reqData).then(function (result) {
                    if (result.code === 200) {
                      loading.toast($rootScope, "审核中，请稍后");
                      $ionicHistory.goBack();
                    } else {
                      loading.alertHint("温馨提示", result.data);
                    }
                  }, function (err) {
                    loading.alertError();
                  });
                  break;
              }

            }
          },
          {
            text:"取消",
            type:"button "
          }
        ]
      });
    };

    $scope.call = function (e) {
      e.stopPropagation();
    };

    //同步班组信息到安质保
    function addGroupByAZB(groupId,userInfo) {
      var reqData = {
        name : $stateParams.groupName,
        code : groupId,
        projectteamid : $stateParams.projectId,
        captainCode : userInfo.id,
        teamName : userInfo.name
      };
      bdbAPI.addGroupByAZB(reqData).then(function (data) {
        console.log(data);
      }, function (err) {
        console.log(err);
      })
    }

  }];
  return myTeamDetail;
});
