/**
 * Created by liyachun on 2017/9/11.
 */
define([], function () {
  "use strict";
  var waitMember = ["$scope","$location","locals","bdbAPI","$timeout", "$ionicPopup", "loading", "$stateParams", function ($scope,$location,locals,bdbAPI,$timeout, $ionicPopup, loading, $stateParams) {

    var userInfo = locals.getObject("userInfo");
    $scope.pageInfo = {
      currentPage : 0,
      pageSize : 10
    };

    $scope.domore = false;
    $scope.invitationList = [];
    var timer = null;
    $scope.loadMore = function () {
      if (!$scope.domore) {
        $scope.pageInfo.currentPage++;
        getInvitationList();
      }
    };
    function getInvitationList() {
      try {
        var reqData = {
          currentPage : $scope.pageInfo.currentPage,
          orderSort : "desc",
          pageSize : $scope.pageInfo.pageSize,
          whereMap : {
            applicant: userInfo.id,
            response: [0,3],
            type : 1,
            groupId : $stateParams.id
          }
        };
        bdbAPI.findInvitations(reqData).then(function (result) {
          if (result.code === 200) {
            if (result.data.totalPages === 0) {
              $scope.domore = true;
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              if ($scope.invitationList.length === 0) {
                $scope.invitationList = result.data.resultObject;
              } else {
                angular.forEach(result.data.resultObject, function (item) {
                  $scope.invitationList.push(item);
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
          console.log(err);
          $timeout.cancel(timer);
        })
      } catch (e) {
        exception.collectException(e, "informationListCtrl");
      }
    }

    $scope.deleteUser = function (invite) {
      $ionicPopup.confirm({
        title: '温馨提示',
        template: '您是否要移除该人员',
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
              var reqData = {
                id : invite.id
              };
              bdbAPI.deleteInvitation(reqData).then(function (result) {
                if (result.code === 200) {
                  invite.delete = true;
                  if (invite.response === 3) {
                    deleteUserByAZB(invite);
                  }
                  loading.toast($scope, result.data);
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
    };

    function deleteUserByAZB(invite) {
      var reqData = {
        projectteamid : invite.group.engteamCode,
        code : invite.respondent.id,
        teamcode : $stateParams.id
      };
      bdbAPI.deleteGroupUsersByAZB(reqData).then(function (data) {
        console.log(data);
      }, function (err) {
        console.log(err);
      });
    }

  }];
  return waitMember;
});
