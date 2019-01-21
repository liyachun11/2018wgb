/**
 * Created by liyachun on 2017/9/8.
 */
define(["weixin"], function (wx) {
  "use strict";
  var memberData = ["$scope","$location","locals","bdbAPI","$state","$ionicPopup","loading","$rootScope", "constValue", "$stateParams",
    function ($scope,$location,locals,bdbAPI,$state,$ionicPopup,loading,$rootScope, constValue,$stateParams) {

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

      getUserInfo();

    function getUserInfo() {
      try {
        var reqData = {
          id : $stateParams.id
        };
        bdbAPI.userInfoHandler(reqData, constValue.httpType.GET).then(function (result) {
          if (result.code === 200) {
            $scope.userInfo = result.data;
            getRegions();
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
          getRegionName();
        } else {
          loading.alertHint("温馨提示", result.data);
        }
      }, function (err) {
        loading.alertHint("温馨提示", err);
      })
    }

    function getRegionName() {
      angular.forEach($scope.provinceList, function (province) {
        if (province.id === $scope.userInfo.locationProvince) {
          $scope.userInfo.locationProvinceName = province.namecn;
        }
        if (province.id === $scope.userInfo.serviceProvince) {
          $scope.userInfo.serviceProvinceName = province.namecn;
        }
      });
      angular.forEach($scope.cityList, function (city) {
        if (city.id === $scope.userInfo.locationCity) {
          $scope.userInfo.locationCityName = city.namecn;
        }
        if (city.id === $scope.userInfo.serviceCity) {
          $scope.userInfo.serviceCityName = city.namecn;
        }
      })
    }

  }];
  return memberData;
});
