/**
 * Created by liyachun on 2017/9/13.
 */
define(["weixin"], function (wx) {
  "use strict";
  var work = ["$scope","$ionicHistory","locals","bdbAPI","$state","compressImage","$rootScope", "loading","statisticsFactory",
    function ($scope,$ionicHistory,locals,bdbAPI,$state,compressImage,$rootScope,loading,statisticsFactory) {

      statisticsFactory._feedBack();

      var userInfo = locals.getObject("userInfo");
      $scope.replyHTML = "";
      var thumbReplyImgs = [];
      var bigReplyImgs = [];
      $scope.thumbReplyImgLength = 0;
      $scope.selectImgChanged = function (files) {
        loading.show("图片获取中请稍后...");
        //图片大小大于300kb进行压缩
        var isCompress = false;
        if ((files[0].size / 1024).toFixed(0) > 300) {
          isCompress = true;
        }
        compressImage.compress(files[0],400,isCompress).then(function (result) {
          thumbReplyImgs.push(result);
          $scope.thumbReplyImgLength = thumbReplyImgs.length;
          var replyHTML = "";
          angular.forEach(thumbReplyImgs,function (data,index) {
            replyHTML += "<div class='group-reply-image-item'><img src='"+data+"'><i ng-click='replyRemoves("+index+")'></i></div>";
          });
          $scope.replyHTML = replyHTML;
        });
        compressImage.compress(files[0],800,isCompress).then(function (result) {
          loading.hide();
          bigReplyImgs.push(result);
        });
      };
      $scope.replyRemoves = function (index) {
        thumbReplyImgs.splice(index,1);
        bigReplyImgs.splice(index,1);
        $scope.thumbReplyImgLength = thumbReplyImgs.length;
        var replyHTML = "";
        angular.forEach(thumbReplyImgs,function (data,index) {
          replyHTML += "<div class='group-reply-image-item'><img src='"+data+"'><i ng-click='replyRemoves("+index+")'></i></div>";
        });
        $scope.replyHTML = replyHTML;
      };
      $('.feedBack2').on('click','li',function () {
        $('.feedBack2 li').removeClass('activeLi');
        $(this).addClass('activeLi');
        $scope.feedBackInfo.type = $(this).val();
      });

      $scope.feedBackInfo = {
        type : 0,
        content : "",
        uploadFile : []
      };

      $scope.addFeedBack = function () {
        try {
          if ($scope.feedBackInfo.type === 0) {
            loading.toast($scope, "请选择问题类型");
          } else if ($scope.feedBackInfo.content.length === 0) {
            loading.toast($scope, "请输入问题内容");
          } else {
            var reqData = {
              userId : userInfo.id,
              type : $scope.feedBackInfo.type,
              content : $scope.feedBackInfo.content,
              uploadfile : $scope.feedBackInfo.uploadFile
            };
            if (bigReplyImgs.length > 0) {
              angular.forEach(bigReplyImgs, function (image) {
                $scope.feedBackInfo.uploadFile.push(compressImage.dataURItoBlob(image));
              });
              reqData.uploadfile = $scope.feedBackInfo.uploadFile;
            }
            loading.show("提交中请稍后...");
            bdbAPI.addFeedBack(reqData).then(function (result) {
              if (result.code === 200) {
                loading.hide();
                loading.toast($rootScope, "意见反馈成功");
                $ionicHistory.goBack();
              } else {
                loading.alertHint("温馨提示", result.data);
              }
            }, function (err) {
              loading.alertError();
            })
          }
        } catch (e) {
          exception.collectException(e, "feedBackCtrl");
        }
      }

  }];
  return work;
});
