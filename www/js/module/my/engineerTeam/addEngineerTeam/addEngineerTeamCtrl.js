/**
 * Created by liyachun on 2017/9/8.
 */
define(["weixin"], function (wx) {
  "use strict";
  var addEngineerTeam = ["$scope","locals","bdbAPI","loading","$rootScope", "$stateParams", "$ionicHistory", "regularExpression",
    function ($scope,locals,bdbAPI,loading,$rootScope,$stateParams,$ionicHistory,regularExpression) {
    var userInfo = locals.getObject("userInfo");

   $scope.groupInfo = {
     name : ""
   };

   $scope.addGroup = function () {
     if ($scope.groupInfo.name.length === 0) {
       loading.toast($scope, "班组名称不能为空");
     } else if ($scope.groupInfo.name.length > regularExpression.nameLength) {
       loading.toast($scope, "班组名称不能超过40个字符");
     } else if (!regularExpression.nameRegEx.test($scope.groupInfo.name)) {
       loading.toast($scope, "班组名称必须是由中文或英文组成");
     } else {
       var reqData = {
         name : $scope.groupInfo.name,
         engTeamCode : $stateParams.id,
         leaderId : userInfo.id
       };
       bdbAPI.addGroup(reqData).then(function (result) {
         if (result.code === 200) {
           loading.toast($rootScope, "班组创建成功");
           addGroupByAZB(result.data.id);
           $ionicHistory.goBack();
         } else {
           loading.alertHint("温馨提示", result.data);
         }
       }, function (err) {
         loading.alertError();
       });

     }
   };

   //同步班组信息到安质保
   function addGroupByAZB(groupId) {
     var reqData = {
       name : $scope.groupInfo.name,
       code : groupId,
       projectteamid : $stateParams.id,
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
  return addEngineerTeam;
});
