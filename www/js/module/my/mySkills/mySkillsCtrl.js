/**
 * Created by liyachun on 2017/9/4.
 */
define(["weixin"], function (wx) {
  "use strict";
  var mySkills = ["$scope","$location","locals","bdbAPI","$state","$ionicPopup","loading", "constValue",
    function ($scope,$location,locals,bdbAPI,$state,$ionicPopup,loading,constValue) {
    var userInfo = locals.getObject("userInfo");
    $scope.addSkills = function(){
      $state.go('tab.addSkills',{});
    };

    $scope.skillDetail = function (id) {
      $state.go('tab.skillDetail',{
        id : id
      });
    };

    $scope.$on("$ionicView.beforeEnter", function () {
      getsKill();
    });
    function getsKill() {
      var reqData = {
        userId : userInfo.id
      };
      bdbAPI.getsKill(reqData).then(function (result) {
        if (result.code === 200) {
          $scope.skillList = result.data;
          angular.forEach($scope.skillList, function (skill) {
            skill.picture = skill.picture.split(',');
          })
        } else {
          loading.alertHint("温馨提示", result.data);
        }
      }, function (err) {
        loading.alertError();
      })
    }

    $scope.delteSkill = function (id) {
      $ionicPopup.confirm({
        title: '温馨提示',
        template: '技能删除后不可恢复，是否删除?',
        cssClass: 'myBtn',
        buttons:[
          {
            text:"取消",
            type:"button "
          },
          {
            text:"删除",
            type:"button button-outline button-assertive",
            onTap : function () {
              var reqData = {
                id : id
              };
              bdbAPI.skillHander(reqData, constValue.httpType.DELETE).then(function (result) {
                if (result.code === 200) {
                  loading.toast($scope, "删除成功");
                  getsKill();
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

      //点击显示大图
      var myPopup;
      $scope.loadBigImg = function (imgurl) {
        $scope.curImg = imgurl;
        if($scope.curImg != null){
          if($scope.curImg != ""){
            myPopup = $ionicPopup.show({
              cssClass: 'group-bigImage-box',
              templateUrl: 'BigImg.html',
              scope: $scope
            });
            myPopup.then(function (res) {
            });
          }
        }
      };
      $scope.closeBigImg = function () {
        myPopup.close();
      };

  }];
  return mySkills;
});
