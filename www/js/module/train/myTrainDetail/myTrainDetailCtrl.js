/**
 * Created by liyachun on 2017/9/22.
 */
define(["weixin"], function (wx) {
  "use strict";
  var myTrainDetail = ["$scope","$location","locals","bdbAPI","$stateParams","loading",
    function ($scope,$location,locals,bdbAPI,$stateParams,loading) {

      $scope.$on("$ionicView.beforeEnter", function () {
        getEducationDetail();
      });

      function getEducationDetail() {
        var reqData = {
          educationid : $stateParams.id
        };
        bdbAPI.getEducationDetail(reqData).then(function (data) {
          if (data.code === 200) {
            $scope.recordInfo = data.result;
          } else {
            loading.alertHint("温馨提示", data.msg);
          }
        }, function (err) {
          loading.alertError();
        })
      }

    }];
  return myTrainDetail;
});
