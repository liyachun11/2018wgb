/**
 * Created by liyachun on 2017/9/11.
 */
define(["weixin"], function (wx) {
  "use strict";
  var applyEngineerTeam = ["$scope","$location","locals","bdbAPI","$state","$ionicScrollDelegate", "$timeout", "$ionicPopup", "loading",
    function ($scope,$location,locals,bdbAPI,$state,$ionicScrollDelegate, $timeout, $ionicPopup, loading) {
      var userInfo = locals.getObject("userInfo");
      $scope.istab1 = true;
      $scope.applyCont1 = true;
      $scope.tabApply = function(data){
        switch (data) {
          case 1:
            $scope.istab1 = true;
            $scope.istab2 = false;
            $scope.applyCont1 = true;
            $scope.applyCont2 = false;
            $ionicScrollDelegate.scrollTop();
            break;
          case 2:
            $scope.istab1 = false;
            $scope.istab2 = true;
            $scope.applyCont1 = false;
            $scope.applyCont2 = true;
            $ionicScrollDelegate.scrollTop();
            break;
        }
      };
      $scope.applyEngineerDetail = function (projectteamId, workstate,project) {
        $state.go('tab.applyEngineerDetail',{
          id : projectteamId,
          status : workstate,
          data:project
        });
      };
      $scope.applyEngineerDetail2 = function () {
        $state.go('tab.applyEngineerDetail',{});
      };
      //随机颜色
      function getRandomColor()
      {
        var c = '#';
        var cArray = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
        for(var i = 0; i < 6;i++)
        {
          var cIndex = Math.round(Math.random()*15);
          c += cArray[cIndex];
        }
        return c;
      }

      $scope.projectList = [];

      $scope.pageInfo = {
        currentPage : 0,
        pageSize : 10
      };

      $scope.domore = false;
      var timer = null;
      $scope.loadMore = function () {
        console.log("222");
        if (!$scope.domore) {
          $scope.pageInfo.currentPage++;
          findInvitations();
        }
      };
      function getProjectAll(reqData) {
        try {
          if ($scope.projectInfo.name !== "") {
            reqData.whereMap.name = $scope.projectInfo.name;
          }
          if ($scope.projectInfo.province !== "" && $scope.projectInfo.province !== null) {
            reqData.whereMap.province = $scope.projectInfo.province;
          }
          if ($scope.projectInfo.city !== "" && $scope.projectInfo.city !== null) {
            reqData.whereMap.city = $scope.projectInfo.city
          }
          console.log(reqData);
          bdbAPI.getProjectTeamList(reqData).then(function (result) {
            if (result.code === 200) {
              if (result.result.pages === 0) {
                $scope.domore = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
              } else {
                if ($scope.projectList.length === 0) {
                  $scope.projectList = result.result.rows;
                } else {
                  angular.forEach(result.result.rows, function (item) {
                    $scope.projectList.push(item);
                  })
                }
                if (result.result.rows.length === 0) {
                  $scope.domore = true;
                } else if (result.result.rows.length < $scope.pageInfo.pageSize) {
                  $scope.domore = true;
                }
                timer = $timeout(function () {
                  $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 1500);
              }
              $(function(){
                $(".engTem_div2 .engTem_tp").each(function(){
                  $(this).css("background-color",getRandomColor());
                });
              });
              console.log($scope.projectList);
              angular.forEach($scope.invitationList, function (item) {
                item.engTeamDetail = angular.fromJson(item.engTeamDetail);
                angular.forEach($scope.projectList, function (project) {
                  if (item.engineeringTeamCode == project.projectteamId && item.response === 0) {
                    project.workstate = 6;
                  }
                })
              });
              projectSort();
            } else {
              $scope.domore = true;
              $scope.$broadcast('scroll.infiniteScrollComplete');
              loading.alertHint("温馨提示", result.msg);
            }
          }, function (err) {
            console.log(err);
            $timeout.cancel(timer);
          })
        } catch (e) {
          exception.collectException(e, "ApplyEngineerTeamCtrl");
        }
      }

      $scope.projectInfo = {
        name : "",
        province : "",
        city : "",
        provinceList : [],
        cityList : [],
        cityTempList : [],
        isSearch : true
      };
      var isLoadFirst = true;
      $scope.$watch("projectInfo.province", function (n, o) {
        if (n !== '') {
          console.log("111");
          var cityList = [];
          angular.forEach($scope.projectInfo.cityList, function (city) {
            if (city.parentid == n) {
              cityList.push(city);
            }
          });
          $scope.projectInfo.cityTempList = cityList;
          if (isLoadFirst){
            $scope.projectInfo.city = userInfo.serviceCity === null ? "" : userInfo.serviceCity;
            $scope.projectList = [];
            // $scope.pageInfo = {
            //   currentPage : 1,
            //   pageSize : 10
            // };
            // findInvitations();
            isLoadFirst = false;
          }
        }
      });
      var isFirst = true;
      $scope.$on("$ionicView.beforeEnter", function () {
        userInfo = locals.getObject("userInfo");
        if (isFirst) {
          getRegions();
          isFirst = false;
        }
      });

      //查看邀请单
      function findInvitations() {
        var reqData = {
          currentPage : 1,
          orderSort : "desc",
          pageSize : 999,
          whereMap : {
            applicant : userInfo.id,
            respondent : 0,
            type : 2,
            orderColumns : ['create_date']
          }
        };
        var reqData2 = {
          currentPage : $scope.pageInfo.currentPage,
          orderSort : "desc",
          pageSize : $scope.pageInfo.pageSize,
          whereMap : {}
        };
        bdbAPI.findInvitations(reqData).then(function (result) {
          if (result.code === 200) {
            $scope.invitationList = result.data.resultObject;
            getProjectAll(reqData2);
          } else {
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          loading.alertError();
        })
      }

      function getRegions() {
        bdbAPI.getRegions({}).then(function (result) {
          if (result.code === 200) {
            angular.forEach(result.data, function (item) {
              if (item.regionlevel === 1) {
                $scope.projectInfo.provinceList.push(item);
              } else {
                $scope.projectInfo.cityList.push(item);
              }
            });
            $scope.projectInfo.province = userInfo.serviceProvince === null ? "" : userInfo.serviceProvince;
          } else {
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          loading.alertHint("温馨提示", err);
        })
      }

      $scope.searchProject = function () {
        $scope.projectInfo.isSearch = false;
        $timeout(function () {
          $scope.projectInfo.isSearch = true;
        }, 1000);
        $scope.pageInfo = {
          currentPage : 0,
          pageSize : 10
        };
        $scope.domore = false;
        timer = null;
        $scope.projectList = [];
        $scope.loadMore();
      };

      $scope.invitationProject = function (project) {
        console.log(project);
        bdbAPI.teamFollowersNum({userId:userInfo.id}).then(function (result) {
          if (result.code === 200) {
            if (result.data >= project.personno) {
              $ionicPopup.confirm({
                title: '温馨提示',
                template: '您是否要申请该工程队',
                cssClass: 'myBtn',
                buttons:[
                  {
                    text:"确认",
                    type:"button button-outline button-balanced",
                    onTap : function () {
                      var reqData = [
                        {
                          applicant : userInfo.id,
                          respondent : 0,
                          type : 2,
                          pattern : 0,
                          engineeringTeamCode : project.projectteamId,
                          engTeamDetail : angular.toJson({
                            name : project.name,
                            leaderName : project.leader,
                            phone : project.tel,
                            personno : project.personno,
                            planstarttime : project.planstarttime,
                            planendtime : project.planendtime,
                            province : project.province,
                            city : project.city
                          })
                        }
                      ];
                      bdbAPI.addInvitations(reqData).then(function (data) {
                        if (data.code === 200) {
                          project.workstate = 6;
                          joinProject(project.projectteamId, data.data.invitationId, result.data);
                        } else {
                          loading.alertHint("温馨提示", data.data);
                        }
                      }, function (err) {
                        loading.alertError();
                      })
                    }
                  },
                  {
                    text:"取消",
                    type:"button "
                  }
                ]
              });
            } else {
              loading.alertHint("温馨提示", "该工程对要求最低申请人数为"+project.personno+"，您不符合要求");
            }
          } else {
            loading.alertHint("温馨提示", result.data);
          }
        }, function (err) {
          loading.alertError();
        });

      };

      function projectSort() {
        var arrays = [];
        var arraysTemp = [];
        angular.forEach($scope.projectList, function (project) {
          if (project.workstate === 1 || project.workstate === 5 || project.workstate === 6) {
            arrays.push(project);
          } else {
            arraysTemp.push(project);
          }
        });
        $scope.projectList = arraysTemp;
        $scope.projectList = arrays.concat($scope.projectList);

      }

      function joinProject(projectteamId, invitId, personno) {
        var reqData = {
          projectteamid : projectteamId,
          object : userInfo.name,
          tel : userInfo.mobile,
          idcard : userInfo.idCard,
          personnum : personno,
          channel : 1,
          code : userInfo.id,
          id : invitId[0]
        };
        console.log(reqData);
        bdbAPI.joinProject(reqData).then(function (result) {
          console.log(result);
          if (result.code === 200) {
            loading.toast($scope, "申请成功，请等待审核");
          } else {
            loading.alertHint("温馨提示", result.msg);
          }
        }, function (err) {
          loading.alertError();
        })
      }


    }];
  return applyEngineerTeam;
});
