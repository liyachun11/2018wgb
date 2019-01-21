/**
 * Created by liyachun on 2017/9/19.
 */
define([], function () {
  "use strict";
  var workTypes = ["$scope","locals","bdbAPI","loading", "$stateParams", "$timeout", "$rootScope", "$ionicHistory",
    function ($scope,locals,bdbAPI,loading,$stateParams,$timeout,$rootScope,$ionicHistory) {
      $scope.workTypeList = [];
      $scope.workType = {};
      $('.workType-cont1 ul li').removeClass('active');
      $scope.workTypeLi = function(index,id){
        $('.workType-cont1 ul li').removeClass('active');
        $('.workTypeList'+id).find('li').eq(index).addClass('active');
        angular.forEach($scope.workTypeList, function (item) {
          if (item.id == id) {
            $rootScope.workType = item.types[index];
          }
        });
        $ionicHistory.goBack();
      };
      // $scope.resetBtn = function(){//重置
      //   $('.workType-cont1 ul li').removeClass('active');
      //   $rootScope.workType = {};
      // };
      // $scope.saveBtn = function () {
      //   if (angular.isUndefined($rootScope.workType.id)) {
      //     loading.toast($scope, "请选择工种");
      //   } else {
      //     $ionicHistory.goBack();
      //   }
      // };

      bdbAPI.getWorkTypes({}).then(function (result) {
        if (result.code === 200) {
          workTypeHandler(result.data);
        } else {
          loading.alertHint("温馨提示", result.data);
        }
      }, function (err) {
        loading.alertError();
      });

      function workTypeHandler(workTypeList) {
        angular.forEach(workTypeList, function (workType) {
          if (workType.parentId === 0) {
            var item = {
              typeWork : workType.name,
              id : workType.id,
              types : []
            };
            $scope.workTypeList.push(item);
          }
        });
        angular.forEach($scope.workTypeList, function (item) {
          angular.forEach(workTypeList, function (workType) {
            if (item.id === workType.parentId) {
              var cell = {
                id : workType.id,
                name : workType.name,
                parentId : workType.parentId,
                special : workType.isSpecial
              };
              item.types.push(cell);
            }
          })
        });
        if ($stateParams.id != 0) {
          var position = 0;
          angular.forEach($scope.workTypeList, function (item, index) {
            if (item.id == $stateParams.parentId) {
              angular.forEach(item.types, function (type, i) {
                if (type.id == $stateParams.id) {
                  position = i;
                }
              })
            }
          });
          $timeout(function () {
            $('.workType-cont1 ul li').removeClass('active');
            $('.workTypeList'+parseInt($stateParams.parentId)).find('li').eq(position).addClass('active');
            angular.forEach($scope.workTypeList, function (item) {
              if (item.id == parseInt($stateParams.parentId)) {
                $rootScope.workType = item.types[position];
              }
            });
          })
        }
      }

    }];
  return workTypes;
});
