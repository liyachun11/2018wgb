/**
 * Created by liyachun on 2017/9/8.
 */
define([], function () {
  "use strict";
  var deleteMember = ["$scope", "bdbAPI", "$timeout", "exception", "$stateParams", "loading", "$ionicPopup", function ($scope, bdbAPI, $timeout, exception, $stateParams, loading, $ionicPopup) {

    $scope.isSearch = false;
    $scope.captainId = $stateParams.captainId;

    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.searchInfo = {
        phoneAndName : ""
      };
      $scope.pageInfo = {
        currentPage : 1,
        pageSize : 10
      };
      $scope.domore = false;
      $scope.userInfoList = [];
      getUserInfoByTeamId();
    });

    $scope.pageInfo = {
      currentPage : 0,
      pageSize : 10
    };

    $scope.domore = false;
    $scope.userInfoList = [];
    var timer = null;
    $scope.loadMore = function () {
      if (!$scope.domore) {
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
            team_id : $stateParams.id
          }
        };
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
            captionTop();
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

    function captionTop() {
      angular.forEach($scope.userInfoList, function (userInfo, index) {
        if (userInfo.id == $stateParams.captainId) {
          $scope.userInfoList.splice(index, 1);
        }
      });
    }

    $scope.searchUsers = function () {
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
        $scope.isSearch = true;
      }
    };

    $scope.changeSearchInfo = function () {
      if ($scope.searchInfo.phoneAndName === "") {
        $scope.isSearch = false;
      }
    };

    $scope.deleteList = [];
    $scope.deleteOk = function () {
      var userIdList = [];
      if (!$scope.isSearch) {
        $("[name=chkItem]:checked").each(function () {
          userIdList.push($(this).val());
        });
      } else {
        $("[name=chkItem2]:checked").each(function () {
          userIdList.push($(this).val());
        });
      }
      if (userIdList.length === 0) {
        loading.toast($scope, "请选择您要移除的人员");
        return;
      }
      angular.forEach(userIdList, function (userId) {
        if (userId == $stateParams.captainId) {
          loading.toast($scope, "不能移除队长");
          return;
        }
      });
      $ionicPopup.confirm({
        title: '温馨提示',
        template: '您是否要移除人员',
        cssClass: 'myBtn',
        buttons:[
          {
            text:"取消",
            type:"button "
          },
          {
            text:"移除",
            type:"button button-outline button-assertive",
            onTap : function () {
              try {
                var reqData = {
                  usersId : userIdList,
                  teamId : $stateParams.id
                };
                bdbAPI.delteUsers(reqData).then(function (result) {
                  if (result.code === 200) {
                    if (!$scope.isSearch) {
                      angular.forEach($scope.userInfoList, function (userInfo, index) {
                        angular.forEach(userIdList, function (userId) {
                          if (userInfo.id == userId) {
                            if ($scope.isSearch) {
                              $scope.userInfoTempList.splice(index, 1);
                              $scope.userInfoList.splice(index, 1);
                            } else {
                              $scope.userInfoList.splice(index, 1);
                            }
                          }
                        })
                      })
                    } else {
                      angular.forEach($scope.userInfoTempList, function (userInfo, index) {
                        angular.forEach(userIdList, function (userId) {
                          if (userInfo.id == userId) {
                            if ($scope.isSearch) {
                              $scope.userInfoTempList.splice(index, 1);
                              $scope.userInfoList.splice(index, 1);
                            } else {
                              $scope.userInfoList.splice(index, 1);
                            }
                          }
                        })
                      })
                    }
                    loading.toast($scope, result.data);
                  } else {
                    loading.alertHint("温馨提示", result.data);
                  }
                }, function (err) {
                  loading.alertError();
                })
              } catch (e) {
                exception.collectException(e, "deleteMemberCtrl");
              }
            }
          }
        ]
      });
    };

    $scope.changeChecked = function () {
      var deletes = [];
      if (!$scope.isSearch) {
        $("[name=chkItem]:checked").each(function () {
          deletes.push($(this).val());
        });
      } else {
        $("[name=chkItem2]:checked").each(function () {
          deletes.push($(this).val());
        });
      }
      $scope.deleteList = deletes;
    }

  }];
  return deleteMember;
});
