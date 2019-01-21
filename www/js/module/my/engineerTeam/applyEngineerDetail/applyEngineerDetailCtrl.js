/**
 * Created by liyachun on 2017/9/8.
 */
define(["weixin"], function (wx) {
  "use strict";
  var applyEngineerDetail = ["$scope","locals","bdbAPI","$stateParams", "loading","$ionicPopup","$state","$timeout", function ($scope,locals,bdbAPI,$stateParams,loading,$ionicPopup,$state,$timeout) {
    $scope.workstate = $stateParams.status;
    var userInfo = locals.getObject("userInfo");
    $scope.$on("$ionicView.beforeEnter", function () {
      getProjectDetail();
    });
    // console.log(userInfo);
    // console.log($stateParams);
    function getProjectDetail() {
      var reqData = {
        projectteamid : $stateParams.id
      };
      bdbAPI.getProjectTeamInfo(reqData).then(function (data) {
        if (data.code === 200) {
          $scope.projectTeamInfo = data.result;
          console.log($scope.projectTeamInfo);
        } else {
          loading.alertHint("温馨提示", data.msg);
        }
      }, function (err) {
        loading.alertError();
      })
    }

    $scope.invitationProject = function () {
      bdbAPI.teamFollowersNum({userId:userInfo.id}).then(function (result) {
        if (result.code === 200) {
          console.log($scope.projectTeamInfo.projectteamid);
          if (result.data >= $scope.projectTeamInfo.personno) {
            $ionicPopup.confirm({
              title: '温馨提示',
              template: '您是否要申请该工程队',
              cssClass: 'myBtn',
              buttons:[
                {
                  text:"确认",
                  type:"button button-outline button-balanced",
                  onTap : function () {
                    var reqData = [
                      {
                        applicant : userInfo.id,
                        respondent : 0,
                        type : 2,
                        pattern : 0,
                        engineeringTeamCode : $scope.projectTeamInfo.projectteamid,
                        engTeamDetail : angular.toJson({
                          name : $scope.projectTeamInfo.name,
                          leaderName : $scope.projectTeamInfo.leader,
                          phone : $scope.projectTeamInfo.tel,
                          personno : $scope.projectTeamInfo.personno,
                          planstarttime : $scope.projectTeamInfo.planstarttime,
                          planendtime : $scope.projectTeamInfo.planendtime,
                          province : $stateParams.ctiyId,
                          city : $stateParams.name
                        })
                      }
                    ];
                    bdbAPI.addInvitations(reqData).then(function (data) {
                       console.log(data.data);
                      if (data.code === 200) {
                        $scope.workstate = 6;
                        joinProject($scope.projectTeamInfo.projectteamid, data.data.invitationId, result.data);
                      } else {
                        loading.alertHint("温馨提示", data.data);
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
          } else {
            loading.alertHint("温馨提示", "该工程对要求最低申请人数为"+$scope.projectTeamInfo.personno+"，您不符合要求");
          }
        } else {
          loading.alertHint("温馨提示", result.data);
        }
      }, function (err) {
        loading.alertError();
      });

    };
    function joinProject(projectteamId, invitId, personno) {
      var reqData = {
        projectteamid : projectteamId,
        object : userInfo.name,
        tel : userInfo.mobile,
        idcard : userInfo.idCard,
        personnum : personno,
        channel : 1,
        code : userInfo.id,
        id : invitId[0]
      };
      console.log(reqData);
      bdbAPI.joinProject(reqData).then(function (result) {
        console.log(result);
        if (result.code === 200) {
          loading.toast($scope, "申请成功，请等待审核");
          $timeout(function(){
            $state.go("tab.applyEngineerTeam",{});
          },2000);
        } else {
          loading.alertHint("温馨提示", result.msg);
        }
      }, function (err) {
        loading.alertError();
      })
    }



  }];
  return applyEngineerDetail;
});
