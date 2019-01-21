/**
 * Created by xuehaipeng on 2017/4/7.
 */
define(["angular", "routeSetting"], function (angular, stateObj) {
  "use strict";
  var route = angular.module("ionic");
  route.config(["$stateProvider", "$controllerProvider", "$urlRouterProvider", "$ionicConfigProvider","$locationProvider","$httpProvider",
    function ($stateProvider, $controllerProvider, $urlRouterProvider, $ionicConfigProvider,$locationProvider,$httpProvider) {
      $ionicConfigProvider.platform.ios.tabs.style('standard');
      $ionicConfigProvider.platform.ios.tabs.position('bottom');
      $ionicConfigProvider.platform.android.tabs.style('standard');
      $ionicConfigProvider.platform.android.tabs.position('bottom');
      $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
      $ionicConfigProvider.platform.android.navBar.alignTitle('center');
      $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-chevron-left btn_i');
      $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-chevron-left btn_i');
      $ionicConfigProvider.platform.ios.views.transition('ios');
      $ionicConfigProvider.platform.android.views.transition('android');
      $ionicConfigProvider.backButton.text("返回");
      $ionicConfigProvider.backButton.previousTitleText(false);
      $ionicConfigProvider.views.swipeBackEnabled(false);

      $locationProvider.html5Mode(false);//启用h5模式

      $httpProvider.interceptors.push("httpInterceptor");

      $stateProvider.state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      });
      angular.forEach(stateObj.states, function (state) {
        var params = {
          url: state.url,
          views: {}
        };
        params.views[state.tab] = {
          templateUrl: state.templateUrl,
          controller: state.stateName,
          resolve: {
            deps: ["$q", function ($q) {
              var deferred = $q.defer(), deps = [];
              angular.isArray(state.controller) ? (deps = state.controller) : deps.push(state.controller);
              require(deps, function (deps) {
                $controllerProvider.register(state.stateName, deps);
                deferred.resolve();
              });
              return deferred.promise;
            }]
          }
        };
        $stateProvider.state(state.stateName, params);
      });

      $urlRouterProvider.otherwise(stateObj.defaultStates);
    }]);

  return route;
});
