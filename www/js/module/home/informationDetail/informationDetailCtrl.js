/**
 * Created by liyachun on 2017/9/5.
 */
define(["weixin"], function (wx) {
  "use strict";
  var informationDetail = ["$scope","locals","bdbAPI","loading", "$stateParams", "exception", function ($scope,locals,bdbAPI,loading,$stateParams,exception) {
    $scope.ceshi = '资讯详情';
    var userInfo = locals.getObject("userInfo");
    $scope.$on("$ionicView.enter", function () {
      getArticleInfo();
    });

    function getArticleInfo() {
      try {
        var reqData = {
          id : $stateParams.id
        };
        bdbAPI.getAticleInfo(reqData).then(function (result) {
          if (result.code === 200) {
            $scope.articleInfo = result.data;
          } else {
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          loading.alertError();
        })
      } catch (e) {
        exception.collectException(e, "informationDetailCtrl");
      }
    }

    $scope.goLike = function () {
      try {
        var reqData = {
          userId : userInfo.id,
          postsId : $scope.articleInfo.id
        };
        bdbAPI.goLike(reqData).then(function (result) {
          if (result.code === 200) {
            $scope.articleInfo.likeCount = 1;
            loading.toast($scope, result.data);
          } else {
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          loading.alertError();
        })
      } catch (e) {
        exception.collectException(e, "informationDetailCtrl");
      }
    }

  }];
  return informationDetail;
});
