/**
 * Created by liyachun on 2017/9/8.
 */
define(["weixin"], function (wx) {
  "use strict";
  var invitation = ["$scope","$location","locals","bdbAPI","$state","$ionicScrollDelegate", "$ionicPopup", "loading",
    function ($scope,$location,locals,bdbAPI,$state,$ionicScrollDelegate, $ionicPopup, loading) {

      var usrInfo = locals.getObject("userInfo");

      $scope.istab1 = true;
      $scope.isConter1 = true;
      $scope.tab = 0;
      $scope.tabApply = function(data){
        $scope.tab = data;
        switch (data){
          case 0:
            $scope.istab1 = true;
            $scope.istab2 = false;
            $scope.istab3 = false;
            $scope.isConter1 = true;
            $scope.isConter2 = false;
            $scope.isConter3 = false;
            $ionicScrollDelegate.scrollTop();
            break;
          case 1:
            $scope.istab1 = false;
            $scope.istab2 = true;
            $scope.istab3 = false;
            $scope.isConter1 = false;
            $scope.isConter2 = true;
            $scope.isConter3 = false;
            $ionicScrollDelegate.scrollTop();
            break;
          case 2:
            $scope.istab1 = false;
            $scope.istab2 = false;
            $scope.istab3 = true;
            $scope.isConter1 = false;
            $scope.isConter2 = false;
            $scope.isConter3 = true;
            $ionicScrollDelegate.scrollTop();
            break;
        }
        getInvitations(data);
      };
      $scope.engineerTeamDetail = function(){
        $state.go('tab.engineerTeamDetail',{})
      };
      $scope.engineerTeamDetail2 = function(){
        $state.go('tab.engineerTeamDetail',{})
      };
      $scope.invitingTeamDetail = function(){
        $state.go('tab.invitingTeamDetail',{});
      };

      $scope.$on("$ionicView.beforeEnter", function () {
        getInvitations(0);
        // getProjectAll();
      });

      function getInvitations(type) {
        var reqData = {
          currentPage : 1,
          orderSort : "desc",
          pageSize : 999,
          whereMap : {
            respondent : usrInfo.id,
            response : [0],
            pattern : 1,
            type : type
          }
        };
        bdbAPI.findInvitations(reqData).then(function (result) {
          if (result.code === 200) {
            $scope.inviteList = result.data.resultObject;
            if (type === 2) {
              angular.forEach($scope.inviteList, function (invite) {
                if (!angular.isUndefined(invite.engTeamDetail) && invite.engTeamDetail !== null) {
                  invite.projectName = angular.fromJson(invite.engTeamDetail).name;
                }
              })
            }
          } else {
            loading.alertHint("温馨提示",result.data);
          }
        }, function (err) {
          loading.alertError();
        })
      }

      function getProjectAll() {
        var reqData = {
          currentPage : 1,
          orderSort : "desc",
          pageSize : 999,
          whereMap : {}
        };
        bdbAPI.getProjectTeamList(reqData).then(function (data) {
          if (data.code === 200) {
            $scope.projectList = data.result.rows;
          }
        }, function (err) {
          loading.alertError();
        });
      }
      $scope.acceptTeam3 = function(invite){
        var msg = "是否接受邀请，加入工程队？";
        prompt(msg,invite)
      };
      $scope.acceptTeam2 = function(invite){
        var msg = "是否接受邀请，加入班组？";
        prompt(msg,invite)
      };
      $scope.acceptTeam = function (invite) {
        var msg = "是否接受邀请，加入团队？";
        prompt(msg,invite)
      };
      function prompt(msg,invite) {
        $ionicPopup.confirm({
          title: '温馨提示',
          template: msg,
          cssClass: 'myBtn',
          buttons:[
            {
              text:"接受",
              type:"button button-outline button-balanced",
              onTap : function () {
                var reqData = {
                  invitationId : invite.id,
                  userId : invite.respondent.id
                };
                bdbAPI.confirmInvitation(reqData).then(function (result) {
                  if (result.code === 200) {
                    switch ($scope.tab) {
                      case 0 :
                        invite.response = 1;
                        break;
                      case 1:
                        getUserInfoByInviteId(invite, 1);
                        invite.response = 3;
                        break;
                      case 2:
                        agreeInviteProject(invite, 1);
                        invite.response = 1;
                        break;
                    }
                    loading.toast($scope, "邀请成功");
                  } else {
                    loading.alertHint("温馨提示", result.data);
                  }
                }, function (err) {
                  loading.alertError()
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
      $scope.refuse = function (invite) {
        var msg = "是否拒绝加入团队邀请？";
        promptRefuse(msg,invite)
      };
      $scope.refuse2 = function (invite) {
        var msg = "是否拒绝加入班组邀请？";
        promptRefuse(msg,invite)
      };
      $scope.refuse3 = function (invite) {
        var msg = "是否拒绝加入工程队邀请？";
        promptRefuse(msg,invite)
      };
      function promptRefuse(msg,invite) {
        $ionicPopup.confirm({
          title: '温馨提示',
          template: msg,
          cssClass: 'myBtn',
          buttons:[
            {
              text:"取消",
              type:"button "
            },
            {
              text:"拒绝",
              type:"button button-outline button-assertive",
              onTap : function () {
                var reqData = {
                  id : invite.id
                };
                bdbAPI.refuseInvitation(reqData).then(function (result) {
                  if (result.code === 200) {
                    switch ($scope.tab) {
                      case 1:
                        getUserInfoByInviteId(invite, 0);
                        break;
                      case 2:
                        agreeInviteProject(invite, 2);
                        break;
                    }
                    invite.response = 2;
                    loading.toast($scope, "拒绝邀请成功");
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
      }

      function agreeInviteProject(invite, state) {
        if ($scope.tab === 2) {
          var reqData = {
            projectteamid : invite.engineeringTeamCode,
            state : state,
            code : invite.respondent.id
          };
          bdbAPI.agreeInviteProject(reqData).then(function (data) {
            if (data.code === 200) {
              console.log("同意邀请");
            }
          }, function (err) {
            loading.alertError();
          })
        }
      }

      function getUserInfoByInviteId(invite, status) {
        var reqData = {
          invitationId : invite.id
        };
        bdbAPI.getUserByInviteId(reqData).then(function (result) {
          if (result.code === 200) {
            switch (status) {
              case 0:
                var reqData = {
                  projectteamid : result.data.projectteam,
                  code : result.data.code,
                  teamcode : result.data.team
                };
                bdbAPI.deleteGroupUsersByAZB(reqData).then(function (data) {
                  console.log(data);
                }, function (err) {
                  console.log(err);
                });
                break;
              case 1:
                var arrays = [];
                arrays.push(result.data);
                bdbAPI.addUsersByAZB(arrays, function (data) {
                  console.log(data);
                }, function (err) {
                  console.log(err);
                });
                break;
            }

          }
        }, function (err) {
          loading.alertError();
        })
      }


  }];
  return invitation;
});
