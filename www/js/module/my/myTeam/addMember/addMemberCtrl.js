define([], function () {
  "use strict";
  var addMember = ["$scope","bdbAPI","$timeout", "exception", "$stateParams", "$ionicHistory", "locals", "loading", "$ionicPopup",
    function ($scope,bdbAPI,$timeout, exception, $stateParams, $ionicHistory, locals, loading, $ionicPopup) {

    var userInfo = locals.getObject("userInfo");
    var isFirst = true;
    var isSearch = false;
    $scope.searchInfo = {
      phoneAndName : ""
    };

    $scope.pageInfo = {
      currentPage : 1,
      pageSize : 10
    };

    $scope.domore = false;
    $scope.userInfoList = [];
    var timer = null;
    $scope.loadMore = function () {
      if (!$scope.domore && !isFirst) {
        $scope.pageInfo.currentPage++;
        getUsersByPhone();
      } else {
        $scope.domore = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    };

    $scope.searchUsers = function () {
      isSearch = true;
      getUsersByPhone();
    };

    function getUsersByPhone() {
      try {
        var reqData = {
          currentPage : $scope.pageInfo.currentPage,
          orderSort : "desc",
          pageSize : $scope.pageInfo.pageSize,
          whereMap : {}
        };
        if (/\d+/.test($scope.searchInfo.phoneAndName)) {
          reqData.whereMap = {
            mobile : $scope.searchInfo.phoneAndName,
            inviteTeamId : $stateParams.id

          }
        } else {
          reqData.whereMap = {
            name : $scope.searchInfo.phoneAndName,
            inviteTeamId : $stateParams.id
          }
        }
        bdbAPI.searchUsers(reqData).then(function (result) {
          if (result.code === 200) {
            if (isSearch) {
              $scope.userInfoList = [];
              isSearch = false;
            }
            if (result.data.totalPages === 0) {
              $scope.domore = true;
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              isFirst = false;
              $scope.domore = false;
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
          } else {
            $scope.domore = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          loading.alertError();
        })
      } catch (e) {
        exception.collectException(e, "addMemberCtrl");
      }
    }

    $scope.addInvitations = function (userInfoTemp) {
      if (userInfo.id == userInfoTemp.id) {
        loading.toast($scope, "不能邀请本人");
      } else {
        $ionicPopup.confirm({
          title: '温馨提示',
          template: '是否邀请该人员加入团队？',
          cssClass: 'myBtn',
          buttons:[
            {
              text:"邀请",
              type:"button button-outline button-balanced",
              onTap : function () {
                var reqData = [
                  {
                    applicant : userInfo.id,
                    respondent : userInfoTemp.id,
                    type : 0,
                    pattern : 1,
                    teamId : $stateParams.id
                  }
                ];
                bdbAPI.addInvitations(reqData).then(function (result) {
                  console.log(result);
                  if (result.code === 200) {
                    userInfoTemp.response = 0;
                    loading.toast($scope, result.data.message);
                  } else {
                    loading.alertHint("温馨提示", result.data.message);
                  }
                }, function (err) {
                  loading.alertError();
                })
              }
            },
            {
              text:"取消",
              type:"button "
            }
          ]
        });
      }
    }

  }];
  return addMember;
});
