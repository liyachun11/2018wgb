/**
 * Created by liyachun on 2017/9/4.
 */
define([], function () {
  "use strict";
  var informationAll = ["$scope","$location","locals","bdbAPI","$state","loading","$rootScope", "tabSwitch", "$timeout","statisticsFactory",
    function ($scope,$location,locals,bdbAPI,$state,loading,$rootScope, tabSwitch,$timeout,statisticsFactory) {

   //资讯类别
    $scope.informList = [];
    $scope.categoryId = '';
    $scope.informationDetail = function(id){
      $state.go('tab.informationDetail',{
        id : id
      });
      statisticsFactory._newsDetails();
    };

    $scope.pageInfo = {
      currentPage : 0,
      pageSize : 10
    };

    var isFirst = true;
    $scope.domore = false;
    $scope.articleList = [];
    var timer = null;
    $scope.loadMore = function () {
      if (!$scope.domore && !isFirst) {
        $scope.pageInfo.currentPage++;
        getArticleListByTop();
      }
    };
    function getArticleListByTop() {
      try {
        var reqData = {
          "currentPage" : $scope.pageInfo.currentPage,
          "orderSort" : "desc",
          "pageSize" : $scope.pageInfo.pageSize,
          "whereMap" : {
            "orderColumns": ["listorder"],
            "istop": "true",
            "status":1,
            "category_id": $scope.categoryId
          }
        };
        bdbAPI.getArticleList(reqData).then(function (result) {
          if (result.code === 200) {
            if (result.data.totalPages === 0) {
              $scope.domore = true;
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              if ($scope.articleList.length === 0) {
                $scope.articleList = result.data.resultObject;
              } else {
                angular.forEach(result.data.resultObject, function (item) {
                  $scope.articleList.push(item);
                })
              }
              if (result.data.resultObject.length === 0) {
                $scope.domore = true;
              } else if (result.data.resultObject.length < $scope.pageInfo.pageSize) {
                $scope.domore = true;
              }
              timer = $timeout(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
              }, 1500);
            }
            isFirst = false;
          } else {
            $scope.domore = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          console.log(err);
          $timeout.cancel(timer);
        })
      } catch (e) {
        exception.collectException(e, "informationListCtrl");
      }
    }

    $scope.doRefresh = function () {
      try {
        var reqData = {
          "currentPage" : 1,
          "orderSort" : "desc",
          "pageSize" : $scope.pageInfo.pageSize,
          "whereMap" : {
            "orderColumns": ["listorder"],
            "istop": "true",
            "status":1,
            "category_id": $scope.categoryId
          }
        };
        bdbAPI.getArticleList(reqData).then(function (result) {
          if (result.code === 200) {
            $scope.articleList = result.data.resultObject;
            $scope.$broadcast('scroll.refreshComplete');
          } else {
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          console.log(err);
        })
      } catch (e) {
        exception.collectException(e, "informationListCtrl");
      }
    };

    $scope.$on("$ionicView.enter", function () {
      if (isFirst) {
        getCategory();
      }
    });

    function getCategory() {
      bdbAPI.getArticleCategory({}).then(function (result) {
        if (result.code === 200) {
          $scope.informList = result.data;
          if ($scope.informList.length > 0) {
            // $scope.categoryId = $scope.informList[0].id;
            $scope.pageInfo = {
              currentPage : 1,
              pageSize : 10
            };
            getArticleListByTop();
          }
        } else {
          loading.alertHint("温馨提示", result.data);
        }
      }, function (err) {
        console.log(err);
      })
    }

    $scope.changeCategory = function () {
      $scope.doRefresh();
    }


  }];
  return informationAll;
});
