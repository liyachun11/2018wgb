/**
 * Created by liyachun on 2017/9/11.
 */
define(["weixin"], function (wx) {
  "use strict";
  var exitApplication = ["$scope","$location","locals","bdbAPI","loading", "$ionicPopup", "$timeout", "$stateParams", function ($scope,$location,locals,bdbAPI,loading,$ionicPopup,$timeout,$stateParams) {
    $scope.dateTitle = "请选择日期";
    $scope.datePickerCallback_firstDate = function (val) {
      if(typeof(val)!=='undefined'){
        $scope.first_register_date = new Date(val).pattern("yyyy-MM-dd");
      }
    };

    $scope.isSearch = false;
    $scope.captainId = $stateParams.captainId;

    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.searchInfo = {
        phoneAndName : ""
      }
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
            group_id : $stateParams.groupId
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
      // var captionInfo = "";
      angular.forEach($scope.userInfoList, function (userInfo, index) {
        if (userInfo.id == $stateParams.captainId) {
          // captionInfo = userInfo;
          $scope.userInfoList.splice(index, 1);
        }
      });
      // if (captionInfo !== "") {
      //   $scope.userInfoList.splice(0,0,captionInfo);
      // }
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
      if (angular.isUndefined($scope.first_register_date) || $scope.first_register_date === "") {
        loading.toast($scope, "请选择退场日期");
        return;
      }
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
      $ionicPopup.confirm({
        title: '温馨提示',
        template: '您是否要移除人员',
        cssClass: 'myBtn',
        buttons:[
          {
            text:"移除",
            type:"button button-outline button-assertive",
            onTap : function () {
              try {
                var reqData = {
                  usersId : userIdList,
                  groupId : $stateParams.groupId,
                  removeTime : $scope.first_register_date
                };
                bdbAPI.delteUsers(reqData).then(function (result) {
                  if (result.code === 200) {
                    if (!$scope.isSearch) {
                      angular.forEach($scope.userInfoList, function (userInfo, index) {
                        angular.forEach(userIdList, function (userId) {
                          if (userInfo.id == userId) {
                            $scope.userInfoList.splice(index, 1);
                            deleteGroupUsersByAZB(userId);
                          }
                        })
                      })
                    } else {
                      angular.forEach($scope.userInfoTempList, function (userInfo, index) {
                        angular.forEach(userIdList, function (userId) {
                          if (userInfo.id == userId) {
                            $scope.userInfoList.splice(index, 1);
                            deleteGroupUsersByAZB(userId);
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
          },
          {
            text:"取消",
            type:"button "
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
    };

    function deleteGroupUsersByAZB(userId) {
      var reqData = {
        projectteamid : $stateParams.projectId,
        code : userId,
        teamcode : $stateParams.groupId
      };
      bdbAPI.deleteGroupUsersByAZB(reqData).then(function (data) {
        console.log(data);
      }, function (err) {
        console.log(err);
      })
    }

  }];
  return exitApplication;
});
