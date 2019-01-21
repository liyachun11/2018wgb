/**
 * Created by liyachun on 2017/9/4.
 */
define(["weixin"], function (wx) {
  "use strict";
  var personalData = ["$scope","$location","locals","bdbAPI","$state","$ionicPopup","loading","$rootScope", "tabSwitch", "$timeout","regularExpression","$interval", "constValue", "$ionicHistory",
    function ($scope,$location,locals,bdbAPI,$state,$ionicPopup,loading,$rootScope, tabSwitch,$timeout,regularExpression,$interval,constValue,$ionicHistory) {
    var userInfo = locals.getObject("userInfo");

    $scope.provinceList = [];
    $scope.cityList = [];

    $scope.informList = [
      {id:0,name:'群众',gender:'男'},
      {id:1,name:'团员',gender:'女'},
      {id:2,name:'党员',gender:''}
    ];
    $scope.listName = 0;
    $scope.genderList = [
      {id:1,gender:'男'},
      {id:2,gender:'女'}
    ];
    $scope.listGender = 0;
    $scope.iphoneBtn = function(){
      useAgreement()
    };
    function useAgreement(){
      $ionicPopup.show({
        title: '修改手机号',
        templateUrl: 'useAgreement.html',
        cssClass: 'myPopup',
        buttons:[
          { text: '取消' },
          {
            text:"提交",
            type:"button  button-balanced",
            onTap: function(e) {
              if ($rootScope.verificationInfo.code === "") {
                loading.toast($scope, "请输入验证码");
                e.preventDefault();
              } else {
                var reqData = {
                  uid : userInfo.id,
                  data : {
                    vcode : $rootScope.verificationInfo.code
                  }
                };
                bdbAPI.updateMoblie(reqData).then(function (result) {
                  if (result.code === 200) {
                    loading.toast($scope, result.data);
                  } else {
                    loading.alertHint("温馨提示", result.data);
                  }
                }, function (err) {
                  loading.alertError();
                })
              }
            }
          }
        ]
      });
    }
    //获取验证码
      var timer;
      $rootScope.paracont = '获取验证码';
      $rootScope.paraevent = true;
      $rootScope.flag = false;
      $rootScope.verificationInfo = {
        telephone : "",
        code : ""
      };

      $rootScope.verification = function () {
        try {
          if($scope.verificationInfo.telephone === ''){
            loading.toast($scope,"手机号不能为空");
          } else if (!regularExpression.cellPhoneRegEx.test($scope.verificationInfo.telephone)){
            loading.toast($scope,"手机号格式错误");
          } else {
            if($rootScope.paraevent){
              $rootScope.paraevent = false;
              $rootScope.flag = true;
              var second = 59;
              $rootScope.paracont = second + '秒后重发';
              timer = $interval(function(){
                if(second <=0){
                  $interval.cancel(timer);
                  $rootScope.paracont = '重发验证码';
                  second = 59;
                  $rootScope.paraevent = true;
                  $rootScope.flag = false;
                  $rootScope.arr = '';
                }else{
                  second--;
                  $rootScope.paracont = second + '秒后重发';
                  $rootScope.paraevent = false;
                  $rootScope.flag = true;
                }
              },1000);
              var reqData = {
                phoneNumber : $rootScope.verificationInfo.telephone
              };
              bdbAPI.sms(reqData).then(function (result) {
                if (result.code === 200) {
                  locals.set("USER_TOKEN",result.message);
                  console.log(result.message);
                  loading.toast($scope, "短信发送成功");

                } else {
                  loading.alertHint("温馨提示", result.data);
                }
              }, function (err) {
                loading.alertHint("温馨提示", err);
              })
            }
          }
        } catch (e) {
          exception.collectException(e, "personalDataCtrl");
        }
      };

    $scope.$on("$ionicView.beforeEnter", function () {
      getRegions();
    });

    function getUserInfo() {
      try {
        var reqData = {
          id : userInfo.id
        };
        bdbAPI.userInfoHandler(reqData, constValue.httpType.GET).then(function (result) {
          if (result.code === 200) {
            $scope.userInfo = result.data;
            $scope.region1 = {
              provinceId : $scope.userInfo.locationProvince,
              cityId : $scope.userInfo.locationCity
            };

            $scope.region2 = {
              provinceId : $scope.userInfo.serviceProvince,
              cityId : $scope.userInfo.serviceCity
            };
            if ($rootScope.workType !== null && !angular.isUndefined($rootScope.workType) && !angular.isUndefined($rootScope.workType.id)) {
              $scope.userInfo.workType = $rootScope.workType;
            }
          } else {
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          loading.alertHint("温馨提示", err);
        })
      } catch (e) {
        exception.collectException(e, "personalDataCtrl");
      }
    }

    function getRegions() {
      bdbAPI.getRegions({}).then(function (result) {
        if (result.code === 200) {
          angular.forEach(result.data, function (item) {
            if (item.regionlevel === 1) {
              $scope.provinceList.push(item);
            } else {
              $scope.cityList.push(item);
            }
          });
          getUserInfo();
        } else {
          loading.alertHint("温馨提示", result.data);
        }
      }, function (err) {
        loading.alertHint("温馨提示", err);
      })
    }

    $scope.cityTempList1 = [];
    $scope.cityTempList2 = [];
    $scope.$watch("region1.provinceId", function (n, o) {
      if (n !== '') {
        var arrays = [];
        angular.forEach($scope.cityList, function (city) {
          if (city.parentid == n) {
            arrays.push(city);
          }
        });
        if (arrays.length > 0) {
          $scope.cityTempList1 = arrays;
          $scope.region1.cityId = $scope.cityTempList1[0].id;
        } else {
          $scope.cityTempList1 = [];
        }
      }
    });
      $scope.$watch("region2.provinceId", function (n, o) {
        if (n !== '') {
          var arrays = [];
          angular.forEach($scope.cityList, function (city) {
            if (city.parentid == n) {
              arrays.push(city);
            }
          });
          if (arrays.length > 0) {
            $scope.cityTempList2 = arrays;
            $scope.region2.cityId = $scope.cityTempList2[0].id;
          } else {
            $scope.cityTempList2 = [];
          }
        }
      });

    $scope.saveBtn = function () {
      var reqData = {
        id : userInfo.id,
        data : {
          politicalStatus : $scope.userInfo.politicalStatus,
          sex : $scope.userInfo.sex,
          workType : $scope.userInfo.workType === null ? null : $scope.userInfo.workType.id,
          locationProvince : $scope.region1.provinceId,
          locationCity : $scope.region1.cityId,
          serviceProvince : $scope.region2.provinceId,
          serviceCity : $scope.region2.cityId
        }
      };
      bdbAPI.userInfoHandler(reqData, constValue.httpType.PUT).then(function (result) {
        if (result.code === 200) {
          loading.toast($rootScope, "个人资料保存成功");
          $ionicHistory.goBack();
        } else {
          loading.alertHint("温馨提示",result.data);
        }
      }, function (err) {
        loading.alertError();
      });
    };
      $scope.workTypeBtn = function(){
        $state.go('tab.workTypes', {
          id : $scope.userInfo.workType === null ?  0 : $scope.userInfo.workType.id,
          parentId : $scope.userInfo.workType === null ?  0 : $scope.userInfo.workType.parentId
        })
      };
      $scope.modifyBut = true;
      $scope.ngSelecte = true;
      $scope.modify = function(){
        $scope.modifyBut = false;
        $scope.ngSelecte = false;
      };
      $scope.goBackBtn = function(){
        if(!$scope.modifyBut){
          $ionicPopup.confirm({
            title: '温馨提示',
            template: '个人信息未保存，确定放弃么？',
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
      }
  }];
  return personalData;
});
