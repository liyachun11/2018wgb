/**
 * Created by liyachun on 2017/9/11.
 */
define(["weixin"], function (wx) {
  "use strict";
  var teamListDetail = ["$scope","locals","bdbAPI","$state","loading","$stateParams", "$rootScope", "$ionicHistory", "regularExpression","$ionicPopup",
    function ($scope,locals,bdbAPI,$state,loading,$stateParams, $rootScope, $ionicHistory, regularExpression,$ionicPopup) {
      $scope.teamChange = function(){
        $state.go('tab.captainChange', {
          id : 1,
          teamId : $stateParams.id,
          captainId : $stateParams.captainId,
          groupName : $scope.groupInfo.name,
          projectId : $stateParams.projectId
        })
      };
      $scope.teamName = $stateParams.name;
      $scope.groupInfo = {
        name : $stateParams.name
      };

      $scope.saveGroupInfo = function () {
        if ($scope.groupInfo.name.length === 0) {
          loading.toast($scope, "班组名称不能为空");
        } else if ($scope.groupInfo.name.length > regularExpression.nameLength) {
          loading.toast($scope, "班组名称不能超过40个字符");
        } else {
          var reqData = {
            id : $stateParams.id,
            data : {
              name : $scope.groupInfo.name
            }
          };
          bdbAPI.saveGroupInfo(reqData).then(function (result) {
            if (result.code === 200) {
              loading.toast($rootScope, "班组名称更新成功");
              addGroupByAZB();
              $ionicHistory.goBack();
            } else {
              loading.alertHint("温馨提示", result.data);
            }
          }, function (err) {
            loading.alertError();
          })
        }
      };
      $scope.modifyBut = true;
      $scope.ngSelecte = true;
      $scope.modify = function(){
        $scope.modifyBut = false;
        $scope.ngSelecte = false;
      };
      $scope.goBackBtn = function(){
        if(!$scope.modifyBut){
          $ionicPopup.confirm({
            title: '温馨提示',
            template: '个人信息未保存，确定放弃么？',
            cssClass: 'myBtn',
            buttons:[
              {
                text:"继续编辑",
                type:"button "
              },
              {
                text:"放弃",
                type:"button button-outline button-assertive",
                onTap : function () {
                  $ionicHistory.goBack();
                }
              }
            ]
          });
        }else {
          $ionicHistory.goBack();
        }
      };

      //同步班组信息到安质保
      function addGroupByAZB() {
        var reqData = {
          name : $scope.groupInfo.name,
          code : $stateParams.id,
          projectteamid : $stateParams.projectId,
          captainCode : $stateParams.captainId
        };
        bdbAPI.addGroupByAZB(reqData).then(function (data) {
          console.log(data);
        }, function (err) {
          console.log(err);
        })
      }

    }];
  return teamListDetail;
});
