define(["weixin"], function (wx) {
  "use strict";
  var account = ["$scope", "exception", "bdbAPI", "$timeout", "$state", "locals", "loading", "$window", "$location","statisticsFactory",
    function ($scope,exception, bdbAPI, $timeout, $state, locals, loading, $window, $location,statisticsFactory) {

    $scope.$on("$ionicView.enter", function () {
      $scope.userInfo = locals.getObject("userInfo");
    });

    $scope.goYinHuan = function () {
      if (!angular.isUndefined($scope.userInfo.authentication) && $scope.userInfo.authentication === 0) {
        $state.go('tab.certification');
      } else {
        statisticsFactory._yinHuanTiBao();
        $window.location.href = "https://www.qhse.cn/WGB/view/YHTB/YHTB.html?userid="+$scope.userInfo.id;
      }
    };

    $scope.Jifen = function () {
      if (!angular.isUndefined($scope.userInfo.authentication) && $scope.userInfo.authentication === 0) {
        $state.go('tab.certification');
      } else {
        statisticsFactory._anQuanJiFen();
        $window.location.href = "https://www.qhse.cn/WGB/view/AQJF/AQJF.html?userid="+$scope.userInfo.id;
      }
    };

    $scope.Genzong = function () {
      statisticsFactory._yinHuanZhuiZong();
      $window.location.href = "https://www.qhse.cn/WGB/view/XMLB/projectlist.html?userid="+$scope.userInfo.id;
    };

    $scope.highScore = function () {
      statisticsFactory._myRanking();
      $window.location.href = "https://www.qhse.cn/WGB/view/JFZX/JFZX.html?userid="+$scope.userInfo.id+"&state=1";
    };

    $scope.JifenDongtai = function () {
      statisticsFactory._jiFenDongTai();
      $window.location.href = "https://www.qhse.cn/WGB/view/JFZX/JFZX.html?userid="+$scope.userInfo.id+"&state=2";
    };

    $scope.lookAll = function(){//查看全部
      $state.go('tab.informationList',{});
      statisticsFactory._newsLookAll();
    };
    $scope.informationDetail = function(id){//资讯详情
      $state.go('tab.informationDetail',{
        id : id
      });
      statisticsFactory._newsDetails();
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      try {
        var userInfo = locals.getObject("userInfo");

        if ( userInfo === null || userInfo === undefined) {
          $state.go('tab.iphoneVerification');
        } else {
          if( userInfo.id !== null || userInfo.id !== "" ){
            if(!angular.isUndefined(userInfo.id)){
              getHighScoreByAZB(userInfo.id);
              getBarrage(userInfo.id);
            }
          }
        }
      } catch (e) {
        exception.collectException(e, "homeCtrl");
      }
    });


    $scope.pageInfo = {
      currentPage : 0,
      pageSize : 10
    };

    $scope.domore = false;
    $scope.articleList = [];
    var timer = null;
    $scope.loadMore = function () {
      if (!$scope.domore) {
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
            "orderColumns": ["postDate"],
            "istop": "true",
            "status":1
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
        exception.collectException(e, "homeCtrl");
      }
    }
    wxJsSDK();
    function wxJsSDK() {
      try {
        //微信jssdk初始化
        var url = $location.absUrl();
        if (url.indexOf("#") !== -1) {
          url = url.split("#")[0];
        }
        var reqData = {
          url : url
        };
        bdbAPI.getWXjsSDK(reqData).then(function (result) {
          if (result.message === "success") {
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: result.data.appId, // 必填，公众号的唯一标识
              timestamp: result.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
              signature: result.data.signature,// 必填，签名，见附录1
              jsApiList: ["hideAllNonBaseMenuItem"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
          }
        }, function (err) {
          console.log(err);
        });
        wx.ready(function(){
          $timeout(function(){
            wx.hideAllNonBaseMenuItem();
          },300)
        });
      }catch (e){
        exception.collectException(e);
      }
    }

    function getHighScoreByAZB(userId) {
      var reqData = {
        usercode : userId
      };
      bdbAPI.getHighScoreByAZB(reqData).then(function (data) {
        if (data.code === 200) {
          $scope.score = data.result.score;
          $scope.order = data.result.order;
        }
      }, function (err) {
        console.log(err);
      })
    }

    function getBarrage(userId) {
      var reqData = {
        usercode : userId
      };
      bdbAPI.getBarrage(reqData).then(function (data) {
        if (data.code === 200) {
          console.log(data);
          $scope.barrageList = data.result;
          $timeout(barrageScroll);
        }
      }, function (err) {
        console.log(err);
      })
    }

      //弹幕控制
      function barrageScroll() {
        var Mar = document.getElementById("Marquee");
        var child_div = Mar.getElementsByTagName("p");
        var picH = 30;//移动高度
        var scrollstep=3;//移动步幅,越大越快
        var scrolltime=20;//移动频度(毫秒)越大越慢
        var stoptime=3000;//间断时间(毫秒)
        var tmpH = 0;
        Mar.innerHTML += Mar.innerHTML;
        function start(){
          if(tmpH < picH){
            tmpH += scrollstep;
            if(tmpH > picH )tmpH = picH ;
            Mar.scrollTop = tmpH;
            $timeout(start, scrolltime);
          }else{
            tmpH = 0;
            if(child_div>0){
              Mar.appendChild(child_div[0]);
            }
            Mar.scrollTop = 0;
            $timeout(start, stoptime);
          }
        }
        $timeout(start, stoptime);
      }

  }];
  return account;
});
