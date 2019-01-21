/**
 * Created by liyachun on 2017/9/4.
 */
define(["weixin"], function (wx) {
  "use strict";
  var certification = ["$scope","bdbAPI","$state","$ionicPopup","loading","compressImage","$rootScope", "locals", "$location", "$ionicHistory",
    function ($scope,bdbAPI,$state,$ionicPopup,loading,compressImage,$rootScope, locals, $location, $ionicHistory) {

    var userInfo = locals.getObject("userInfo");
    $scope.images = {
      carImg : [
        {id:0,name:"上传身份证正面照",paramFile:'',names:"身份证正面照示例",paramFiles:'./././img/zheng.jpg'},
        {id:1,name:"上传身份证反面照",paramFile:'',names:"上传身份证反面照",paramFiles:'./././img/fan.jpg'},
        {id:2,name:"上传手持身份证照片",paramFile:'',names:"手持身份证照示例",paramFiles:'./././img/shou.jpg'}
      ]
    };

    $scope.bba = function (index) {
      $scope.index = index;
    };
    $scope.selectImgChanged = function (files) {
      //图片大小大于300kb进行压缩
      var isCompress = false;
      if ((files[0].size / 1024).toFixed(0) > 300) {
        isCompress = true;
      }
      loading.show("图片获取中请稍后...");
      compressImage.compress(files[0],800,isCompress).then(function (result) {
        $scope.images.carImg[$scope.index].paramFile = result;
        loading.hide();
      })
    };
    // 快速认证
    $scope.quickBtn = function(){
      $rootScope.uploadfileImg1 = undefined;
      useAgreement();
    };
    $rootScope.selectImgChanged2 = function (files) {//快速认证报错未解决
      //图片大小大于300kb进行压缩
      var isCompress = false;
      if ((files[0].size / 1024).toFixed(0) > 300) {
        isCompress = true;
      }
      loading.show("身份证识别中请稍后...");
      compressImage.compress(files[0],800,isCompress).then(function (result) {
        $rootScope.uploadfileImg1 = result;
        $scope.images.carImg[0].paramFile = result;
        myPopup.close();
        var reqData = {
          uploadfile : compressImage.dataURItoBlob(result)
        };
        bdbAPI.ocrIdcard(reqData).then(function (result) {
          if (result.code === 200) {
            $scope.personInfo.name = result.data.name;
            $scope.personInfo.idCard = result.data.cardno;
            loading.hide();
          } else {
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          loading.alertHint("温馨提示", err);
        });
      })
    };
    var myPopup;
    function useAgreement(){
      myPopup = $ionicPopup.show({
        title: '快速认证',
        templateUrl: 'useAgreement.html',
        cssClass: 'myPopup'
      });
      var htmlEl = angular.element(document.querySelector('html'));
      htmlEl.on('click', function (event) {
        if (event.target.nodeName === 'HTML') {
          if (myPopup) {//myPopup即为popup
            myPopup.close();
          }
        }
      });
    }

    $scope.certification = function () {
      if ($scope.personInfo.name === "") {
        loading.toast($rootScope, "请输入真实姓名");
      } else if ($scope.personInfo.idCard === "") {
        loading.toast($rootScope, "请输入身份证号");
      } else {
        for (var i=0; i<$scope.images.carImg.length; i++) {
          if ($scope.images.carImg[i].paramFile === "") {
            loading.toast($rootScope, "请上传指定图片");
            return;
          }
        }
        var reqData = {
          id : userInfo.id,
          photoFrontFile : $scope.images.carImg[0].paramFile.indexOf("data:image/jpeg;base64") === -1 ? null : compressImage.dataURItoBlob($scope.images.carImg[0].paramFile),
          photoBackFile : $scope.images.carImg[1].paramFile.indexOf("data:image/jpeg;base64") === -1 ? null : compressImage.dataURItoBlob($scope.images.carImg[1].paramFile),
          photoHandFile : $scope.images.carImg[2].paramFile.indexOf("data:image/jpeg;base64") === -1 ? null : compressImage.dataURItoBlob($scope.images.carImg[2].paramFile),
          name : $scope.personInfo.name,
          idCard : $scope.personInfo.idCard
        };
        $scope.btnDisabed = true;
        loading.show("审核中请稍后...");
        bdbAPI.certification(reqData).then(function (result) {
          if (result.code === 200) {
            loading.hide();
            locals.setObject("userInfo", result.data);
            if (userInfo.authentication === 1) {
              loading.toast($rootScope, "保存信息成功");
              $ionicHistory.goBack();
            } else {
              loading.toast($rootScope, "实名认证成功");
              var url = $location.absUrl().substring(0, $location.absUrl().indexOf("#")+1) + "/tab/home";
              location.replace(url);
            }
          } else {
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          loading.alertError();
        })
      }
    };

    $scope.$on("$ionicView.beforeEnter", function(){
      $scope.btnDisabed = false;
      userInfo = locals.getObject("userInfo");
      $scope.userInfo = userInfo;

      $scope.personInfo = {
        name : userInfo.name,
        idCard : userInfo.idCard
      };

      if (userInfo.authentication === 1) {
        $scope.images.carImg[0].paramFile = userInfo.photoFront;
        $scope.images.carImg[1].paramFile = userInfo.photoBack;
        $scope.images.carImg[2].paramFile = userInfo.photoHand;
      }
    });
      if (userInfo.authentication === 0) {
        $scope.modifyBut = false;
        $scope.ngSelecte = false;
      }else {
        $scope.modifyBut = true;
        $scope.ngSelecte = true;
      }
      $scope.modify = function(){
        $scope.modifyBut = false;
        $scope.ngSelecte = false;
      };
      $scope.goBackBtn = function(){
        if(!$scope.modifyBut || userInfo.authentication === 0){
          if($scope.personInfo.name !== '' || $scope.personInfo.idCard !== ''){
            $ionicPopup.confirm({
              title: '温馨提示',
              template: '信息未保存，确定放弃么？',
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
          }else {
          $ionicHistory.goBack();
        }
      }

  }];
  return certification;
});
