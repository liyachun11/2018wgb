/**
 * Created by liyachun on 2017/9/4.
 */
define(["weixin"], function (wx) {
  "use strict";
  var addSkills = ["$scope","locals","bdbAPI","$state","loading","compressImage", "$rootScope", "$ionicHistory", "exception", "regularExpression","$ionicPopup",
    function ($scope,locals,bdbAPI,$state,loading,compressImage,$rootScope,$ionicHistory,exception,regularExpression,$ionicPopup) {
      var userInfo = locals.getObject("userInfo");
      var isFirst = true;
      $scope.$on("$ionicView.beforeEnter", function () {
        if (isFirst) {
          $rootScope.workType = null;
          isFirst = false;
        }
      });

      $scope.dateTitle = "请选择日期";
      $scope.datePickerCallback_firstDate = function (val) {
        if(typeof(val)!=='undefined'){
          $scope.killInfo.validityDate = new Date(val).pattern("yyyy-MM-dd");
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
            replyHTML += "<div class='group-reply-image-item'><img src='"+data+"'><i ng-click='replyRemoves("+index+")'></i></div>";
          });
          $scope.replyHTML = replyHTML;
        });
        compressImage.compress(files[0],800,isCompress).then(function (result) {
          loading.hide();
          bigReplyImgs.push(compressImage.dataURItoBlob(result));
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

      $scope.killInfo = {
        certificateName : "",
        certificateCode : "",
        validityDate : ""
      };

      $scope.addKill = function () {
        try {
          if ($rootScope.workType === null || angular.isUndefined($rootScope.workType) || angular.isUndefined($rootScope.workType.id)) {
            loading.toast($scope, "请选择工种");
          } else if ($scope.killInfo.validityDate === null || angular.isUndefined($scope.killInfo.validityDate) || $scope.killInfo.validityDate === "") {
            loading.toast($scope, "请选择有效期");
          }else if ($scope.killInfo.certificateName.length === 0) {
            loading.toast($scope, "证书名称不能为空");
          } else if ($scope.killInfo.certificateName.length > regularExpression.nameLength) {
            loading.toast($scope, "证书名称不能大于40个字符");
          } else if (!regularExpression.nameRegEx.test($scope.killInfo.certificateName)) {
            loading.toast($scope, "证书名称必须是由中文或英文组成")
          } else if ($scope.killInfo.certificateCode.length > regularExpression.nameLength) {
            loading.toast($scope, "证书号码不能大于40个字符");
          } else if (bigReplyImgs.length === 0) {
            loading.toast($scope, "证书图片不能为空");
          } else {
            var reqData = {
              name : $scope.killInfo.certificateName,
              number : $scope.killInfo.certificateCode,
              validityDate : $scope.killInfo.validityDate,
              uploadfile : bigReplyImgs,
              userId : userInfo.id
            };
            console.log($rootScope.workType);
            if (!angular.isUndefined($rootScope.workType) && !angular.isUndefined($rootScope.workType.id)) {
              reqData.workType = $rootScope.workType.id;
            } else {
              loading.toast($scope, "请选择工种");
              return;
            }
            loading.show("提交中请稍后...");
            bdbAPI.addKill(reqData).then(function (result) {
              if (result.code === 200) {
                loading.hide();
                loading.toast($rootScope, "技能添加成功");
                $ionicHistory.goBack();
              } else {
                loading.alertHint("温馨提示", result.data);
              }
            }, function (err) {
              loading.alertError();
            })
          }
        } catch (e) {
          exception.collectException(e, "addSkillsCtrl");
        }

      };
      // //关闭
      // $scope.closeBtn = function(){
      //   if($scope.killInfo.certificateName.length !== 0 || bigReplyImgs.length !==0 || $scope.killInfo.certificateCode.length !==0 || $scope.killInfo.validityDate !==''){
      //     alertConfirm();
      //   }else {
      //     $state.go('tab.my')
      //   }
      //
      // };
      // $scope.goBack = function() {//返回
      //   if($scope.killInfo.certificateName.length !== 0 || bigReplyImgs.length !==0 || $scope.killInfo.certificateCode.length !==0 || $scope.killInfo.validityDate !==''){
      //     alertConfirm();
      //   }else {
      //     $ionicHistory.goBack();
      //   }
      //
      // };
      function alertConfirm() {
        $ionicPopup.confirm({
          title: '温馨提示',
          template: '是否放弃添加技能？',
          cssClass: 'myBtn',
          buttons:[
            {
              text:"取消",
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
      }

  }];
  return addSkills;
});
