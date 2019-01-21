/**
 * Created by liyachun on 2017/9/22.
 */
define(["weixin"], function (wx) {
  "use strict";
  var myTrainRecord = ["$scope","$location","locals","bdbAPI","$state", "$stateParams", "loading",
    function ($scope,$location,locals,bdbAPI,$state,$stateParams, loading) {
      $scope.categoryInfo = {
        id : "",
        educationTime : ""
      };
      var userInfo = locals.getObject("userInfo");
      $scope.dateTitle = "请选择日期";
      $scope.datePickerCallback_firstDate = function (val) {
        if(typeof(val)!=='undefined'){
          $scope.categoryInfo.educationTime = new Date(val).pattern("yyyy-MM-dd");
        }
      };
      $scope.myTrainDetail = function(educationid){
        $state.go('tab.myTrainDetail', {
          id : educationid
        })
      };

      $scope.$on("$ionicView.beforeEnter", function () {
        getEducationCategory();
      });

      $scope.$watch("categoryInfo.id", function (n, o) {
          getEducationRecord(n);
      });

      function getEducationCategory() {
        bdbAPI.getEducationCategory({}).then(function (data) {
          if (data.code === 200) {
            $scope.categoryList = data.result;
            // if ($scope.categoryList.length > 0) {
            //   $scope.categoryInfo.id = $scope.categoryList[0].id;
            // }
          } else {
            loading.alertHint("温馨提示", data.msg);
          }
        }, function (err) {
          loading.alertError();
        })
      }

      function getEducationRecord(teachtype) {
        var reqData = {
          code : $stateParams.uid === "" ? userInfo.id : $stateParams.uid
        };
        if (teachtype !== null && teachtype !== "") {
          reqData.teachtype = teachtype;
        }
        if ($scope.categoryInfo.educationTime !== "") {
          var timestamp = Date.parse(new Date($scope.categoryInfo.educationTime));
          timestamp = timestamp / 1000;
          reqData.teachtime = timestamp;
        }
        reqData.projectteamid = $stateParams.projectId;
        bdbAPI.getEducationRecord(reqData).then(function (data) {
          if (data.code === 200) {
            $scope.educationRecordList = data.result;
          } else {
            loading.alertHint("温馨提示", data.msg);
          }
        }, function (err) {
          loading.alertError();
        })
      }

      $scope.searchRecord = function () {
        if ($scope.categoryInfo.id === "" && $scope.categoryInfo.educationTime === "") {
          loading.toast($scope, "请选择教育类别和教育时间")
        } else {
          getEducationRecord($scope.categoryInfo.id);
        }
      }


  }];
  return myTrainRecord;
});
