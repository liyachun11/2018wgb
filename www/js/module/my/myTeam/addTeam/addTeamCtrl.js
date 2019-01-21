/**
 * Created by liyachun on 2017/9/4.
 */
define([], function () {
  "use strict";
  var myTeam = ["$scope","bdbAPI","$state", "locals", "exception", "constValue", "loading", "$ionicHistory", "$rootScope", "regularExpression","$ionicPopup",
    function ($scope,bdbAPI,$state, locals, exception, constValue, loading, $ionicHistory, $rootScope, regularExpression,$ionicPopup) {
    var userInfo = locals.getObject("userInfo");

    $scope.teamInfo = {
      title : "",
      description : ""
    };

    $scope.addTeam = function() {
      try {
        if ($scope.teamInfo.title.length === 0) {
          loading.toast($scope, "团队名称不能为空");
        } else if ($scope.teamInfo.title.length > regularExpression.nameLength) {
          loading.toast($scope, "团队名称不能超过40个字符");
        } else if (!regularExpression.nameRegEx.test($scope.teamInfo.title)) {
          loading.toast($scope, "团队名称必须是由中文或英文组成");
        } else {
          var reqData = {
            captain : userInfo.id,
            name : $scope.teamInfo.title,
            introduction : $scope.teamInfo.description
          };
          bdbAPI.teamHandler(reqData, constValue.httpType.POST).then(function (result) {
            if (result.code === 200) {
              loading.toast($rootScope, "创建团队成功");
              $ionicHistory.goBack();
            } else {
              loading.alertHint("温馨提示", result.data);
            }
          }, function (err) {
            console.log(err);
          })
        }
      } catch (e) {
        exception.collectException(e, "addTeamCtrl");
      }
    };
      $scope.goBackBtn = function(){
        if($scope.teamInfo.title.length !== 0){
          $ionicPopup.confirm({
            title: '温馨提示',
            template: '团队未创建，是否放弃？',
            cssClass: 'myBtn',
            buttons:[
              {
                text:"继续创建",
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

      }


  }];
  return myTeam;
});
