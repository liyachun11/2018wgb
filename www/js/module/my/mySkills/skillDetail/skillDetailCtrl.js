/**
 * Created by liyachun on 2017/9/4.
 */
define(["weixin"], function (wx) {
  "use strict";
  var addSkills = ["$scope","locals","bdbAPI","$state","loading","compressImage", "$rootScope", "$ionicHistory", "exception", "$stateParams", "constValue", "$filter", "$timeout",
    function ($scope,locals,bdbAPI,$state,loading,compressImage,$rootScope,$ionicHistory,exception,$stateParams,constValue,$filter,$timeout) {
      var userInfo = locals.getObject("userInfo");
      $scope.dateTitle = "请选择日期";
      $scope.datePickerCallback_firstDate = function (val) {
        if(typeof(val)!=='undefined'){
          $scope.skillInfo.validityDate = new Date(val).pattern("yyyy-MM-dd");
        }
      };
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
            replyHTML += "<div class='group-reply-image-item'><img src='"+data+"'><i ng-click='replyRemoves("+index+",$event)'></i></div>";
          });
          $scope.replyHTML = replyHTML;
        });
        compressImage.compress(files[0],800,isCompress).then(function (result) {
          loading.hide();
          bigReplyImgs.push(compressImage.dataURItoBlob(result));
        });
      };
      $scope.replyRemoves = function (index,e) {
        thumbReplyImgs.splice(index,1);
        bigReplyImgs.splice(index,1);
        $scope.thumbReplyImgLength = thumbReplyImgs.length;
        var replyHTML = "";
        angular.forEach(thumbReplyImgs,function (data,index) {
          replyHTML += "<div class='group-reply-image-item'><img src='"+data+"'><i ng-click='replyRemoves("+index+",$event)'></i></div>";
        });
        $scope.replyHTML = replyHTML;
        e.preventDefault();
      };
      var isFirst = true;
      $scope.$on("$ionicView.beforeEnter", function () {
        if (isFirst) {
          getKill();
          isFirst = false;
          $scope.btnDisabed = false;
        }
      });

      function getKill() {
        var reqData = {
          id : $stateParams.id
        };
        bdbAPI.skillHander(reqData, constValue.httpType.GET).then(function (result) {
          if (result.code === 200) {
            $scope.skillInfo = result.data;
            $scope.skillInfo.validityDate = $filter("date")($scope.skillInfo.validityDate, "yyyy-MM-dd");
            $scope.skillInfo.picture = $scope.skillInfo.picture.split(',');
            var replyHTML = "";
            angular.forEach($scope.skillInfo.picture,function (data,index) {
              data = constValue.host+ constValue.hostSuffix.img + data;
              convertImgToBase64(data, function (base64Img) {
                thumbReplyImgs.push(base64Img);
                bigReplyImgs.push(compressImage.dataURItoBlob(base64Img));
              });
              replyHTML += "<div class='group-reply-image-item'><img ng-src='"+data+"'><i ng-click='replyRemoves("+index+",$event)'></i></div>";
            });
            $timeout(function () {
              $scope.thumbReplyImgLength = thumbReplyImgs.length;
            },500);
            $scope.replyHTML = replyHTML;
          }
        }, function (err) {
          loading.alertError();
        })
      }


      $scope.updateSkill = function () {
        try {
          $scope.btnDisabed = true;
          var reqData = {
            id : $stateParams.id,
            name : $scope.skillInfo.name,
            number : $scope.skillInfo.number,
            validityDate : $scope.skillInfo.validityDate,
            uploadfile : bigReplyImgs,
            userId : userInfo.id
          };
          if (!angular.isUndefined($rootScope.workType) && !angular.isUndefined($rootScope.workType.id)) {
            reqData.workType = $rootScope.workType.id;
          } else {
            reqData.workType = $scope.skillInfo.workType.id;
          }
          loading.show("提交中请稍后...");
          bdbAPI.updateSkill(reqData).then(function (result) {
            if (result.code === 200) {
              loading.hide();
              loading.toast($rootScope, "更新技能成功");
              $rootScope.workType = null;
              $ionicHistory.goBack();
            } else {
              loading.alertHint("温馨提示", result.data);
            }
          }, function (err) {
            loading.alertError();
          })
        } catch (e) {
          exception.collectException(e, "addSkillsCtrl");
        }

      };

      $scope.workTypeBtn = function(){
        var params = {};
        if (!angular.isUndefined($rootScope.workType) && !angular.isUndefined($rootScope.workType.name)) {
          params.id = $rootScope.workType.id;
          params.parentId = $rootScope.workType.parentId
        } else {
          params.id = $scope.skillInfo.workType.id;
          params.parentId = $scope.skillInfo.workType.parentId
        }
        $state.go('tab.workTypes', params);
      };

      function convertImgToBase64(url, callback){
        var canvas = document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          img = new Image;
          img.crossOrigin = 'Anonymous';
          img.onload = function(){
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img,0,0);
          var dataURL = canvas.toDataURL('image/jpeg');
          callback.call(this, dataURL);
          canvas = null;
        };
        img.src = url;
      }


  }];
  return addSkills;
});
