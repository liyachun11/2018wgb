/**
 * Created by liyachun on 2017/9/11.
 */
define(["weixin"], function (wx) {
  "use strict";
  var teamDetailAddMembers = ["$scope","locals","bdbAPI","$state","loading","$stateParams", "$timeout", "$ionicPopup", "$rootScope",
    function ($scope,locals,bdbAPI,$state,loading,$stateParams, $timeout, $ionicPopup, $rootScope) {
      $scope.dateTitle = "请选择日期";
      $scope.datePickerCallback_firstDate = function (val) {
        if(typeof(val)!=='undefined'){
          $scope.first_register_date = new Date(val).pattern("yyyy-MM-dd");
        }
      };
      $scope.informList = [
        {id:0,name:'全部'},
        {id:1,name:'团队1'},
        {id:2,name:'团队2'},
        {id:3,name:'团队3'},
        {id:4,name:'团队4'}
      ];
      $scope.listName = 0;
      $scope.invitedMember = function(){
        $state.go('tab.invitedMember',{})
      };

      $scope.isCheckAll = false;
      var userInfo = locals.getObject("userInfo");
      var isSearch = false;
      var isFirst = true;
      var teamId = "";
      $scope.searchInfo = {
        phoneAndName : "",
        teamId : ""
      };

      $scope.pageInfo = {
        currentPage : 0,
        pageSize : 10
      };

      $scope.domore = false;
      $scope.userInfoList = [];
      var timer = null;
      $scope.loadMore = function () {
        if (!$scope.domore && !isFirst) {
          $scope.pageInfo.currentPage++;
          getUsersByPhone();
        }
      };

      $scope.searchUsers = function () {
        if ($scope.searchInfo.phoneAndName === "") {
          loading.toast($scope, "搜索条件不能为空");
        } else {
          isSearch = true;
          teamId = "";
          getUsersByPhone();
          $scope.cancelAll();
        }
      };

      function getUsersByPhone() {
        try {
          var reqData = {
            currentPage : $scope.pageInfo.currentPage,
            orderSort : "desc",
            pageSize : $scope.pageInfo.pageSize,
            whereMap : {}
          };
          if (/\d+/.test($scope.searchInfo.phoneAndName)) {
            reqData.whereMap = {
              mobile : $scope.searchInfo.phoneAndName,
              inviteGroupId : $stateParams.groupId
            };
          } else {
            reqData.whereMap = {
              inviteGroupId : $stateParams.groupId
            }
          }
          if ($scope.searchInfo.phoneAndName !== "" && !/\d+/.test($scope.searchInfo.phoneAndName)) {
            reqData.whereMap.name =  $scope.searchInfo.phoneAndName;
          }
          if (teamId !== "") {
            reqData.whereMap.team_id = teamId;
          }
          bdbAPI.searchUsers(reqData).then(function (result) {
            if (result.code === 200) {
              if (isSearch) {
                $scope.userInfoList = [];
                isSearch = false;
              }
              if (result.data.totalPages === 0) {
                $scope.domore = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
              } else {
                if ($scope.userInfoList.length === 0) {
                  $scope.userInfoList = result.data.resultObject;
                } else {
                  angular.forEach(result.data.resultObject, function (item) {
                    $scope.userInfoList.push(item);
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
            captionTop();
            isFirst = false;
          }, function (err) {
            loading.alertError();
          })
        } catch (e) {
          exception.collectException(e, "teamDetailAddMembersCtrl");
        }
      }

      function captionTop() {
        angular.forEach($scope.userInfoList, function (userInfo, index) {
          if (userInfo.id == $stateParams.captainId) {
            $scope.userInfoList.splice(index, 1);
          }
        });
      }

      $scope.searchInfoChange = function () {
        if ($scope.searchInfo.phoneAndName === "") {
          $scope.userInfoList = [];
          $scope.cancelAll();
          getTeamsByCaptainId();
        }
      };

      getTeamsByCaptainId();

      $scope.getTeamsByCaptainId = function () {
        $scope.userInfoList = [];
        teamId = $scope.searchInfo.teamId;
        isFirst = true;
        $scope.pageInfo = {
          currentPage : 1,
          pageSize : 10
        };
        $scope.cancelAll();
        getUsersByPhone();
      };

      function getTeamsByCaptainId() {
        var reqData = {
          currentPage : 1,
          orderSort : "desc",
          pageSize : 999,
          whereMap : {
            captain : userInfo.id
          }
        };
        bdbAPI.getTeamsByCaptainId(reqData).then(function (result) {
          if (result.code === 200) {
            $scope.myTeamList = result.data.resultObject;
            if ($scope.myTeamList.length > 0) {
              $scope.searchInfo.teamId = $scope.myTeamList[0].id;
              teamId = $scope.searchInfo.teamId;
              isFirst = true;
              $scope.pageInfo = {
                currentPage : 1,
                pageSize : 10
              };
              getUsersByPhone();
            }
          }
        }, function (err) {
          loading.alertError();
        })
      }
      $scope.addUserList = [];
      $scope.changeChecked = function () {
        var adds = [];
        $("[name=chkItem]:checked").each(function () {
          adds.push($(this).val());
        });
        $scope.addUserList = adds;
      };

      $scope.selectAll = function () {
        $scope.isCheckAll = true;
        $(".chkItem").each(function () {
          $(this).attr("checked", true);
          $(this)[0].checked = true;
        });
        var adds = [];
        angular.forEach($scope.userInfoList, function (userInfo) {
          if (angular.isUndefined(userInfo.response) || userInfo.response === null) {
            adds.push(userInfo.id);
          }
        });
        $scope.addUserList = adds;
        console.log($scope.addUserList.length);
      };

      $scope.cancelAll = function () {
        $scope.isCheckAll = false;
        $(".chkItem").each(function () {
          $(this)[0].checked = false;
        });
        $scope.addUserList = [];
      };

      $scope.addInvitations = function () {
        if ($scope.first_register_date === "" || angular.isUndefined($scope.first_register_date)) {
          loading.toast($scope, "请选择进场时间");
        } else if ($scope.addUserList.length === 0) {
          loading.toast($scope, "请选择添加人员");
        } else if (angular.isUndefined($rootScope.workType) || angular.isUndefined($rootScope.workType.name)) {
          loading.toast($scope, "请选择工种");
        } else {
          $ionicPopup.confirm({
            title: '温馨提示',
            template: '您是否要邀请人员?',
            cssClass: 'myBtn',
            buttons:[
              {
                text:"邀请",
                type:"button button-outline button-balanced",
                onTap : function () {
                  var reqData = [];
                  angular.forEach($scope.addUserList, function (userId) {
                    var item = {
                      applicant : userInfo.id,
                      respondent : userId,
                      type : 1,
                      pattern : 1,
                      engineeringTeamCode : $stateParams.projectId,
                      groupId : $stateParams.groupId,
                      checkinWorktype : $rootScope.workType.id,
                      checkinTime : $scope.first_register_date
                    };
                    reqData.push(item);
                  });
                  bdbAPI.addInvitations(reqData).then(function (result) {
                    if (result.code === 200) {
                      if (result.data.invitationId.length > 0) {
                        if (!angular.isUndefined(result.data.invitationId[0].name)) {
                          console.log(result.data.invitationId);
                          angular.forEach($scope.userInfoList, function (userInfoTemp) {
                            angular.forEach($scope.addUserList, function (userId) {
                              if (userInfoTemp.id == userId) {
                                userInfoTemp.response = 3;
                              }
                            })
                          });
                          bdbAPI.addUsersByAZB(result.data.invitationId).then(function (data) {
                            console.log(data);
                          }, function (err) {
                            console.log(err);
                          })
                        } else {
                          console.log($scope.userInfoList);
                          angular.forEach($scope.userInfoList, function (userInfoTemp) {
                            angular.forEach($scope.addUserList, function (userId) {
                              if (userInfoTemp.id == userId) {
                                userInfoTemp.response = 0;
                              }
                            })
                          });
                        }
                      }
                      loading.toast($scope, result.data.message);
                    } else {
                      loading.alertHint("温馨提示", result.data);
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
        }
      };

      $scope.workTypeBtn = function(){
        var params = {};
        if (!angular.isUndefined($rootScope.workType) && !angular.isUndefined($rootScope.workType.name)) {
          params.id = $rootScope.workType.id;
          params.parentId = $rootScope.workType.parentId
        }
        $state.go('tab.workTypes', params);
      };

    }];
  return teamDetailAddMembers;
});
