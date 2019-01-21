/**
 * Created by xuehaipeng on 2017/3/28.
 */
define([], function () {
  "use strict";
  var stateArray = [

    {
      tab: "tab-home",
      url: "/home",
      stateName: "tab.home",
      templateUrl: "js/module/home/tab-home.html",
      controller: "module/home/homeCtrl"
    },
    {
      tab: "tab-home",
      url: "/home/informationList",
      stateName: "tab.informationList",
      templateUrl: "js/module/home/informationList/informationList.html",
      controller: "module/home/informationList/informationListCtrl"
    },
    {
      tab: "tab-home",
      url: "/home/informationDetail/:id",
      stateName: "tab.informationDetail",
      templateUrl: "js/module/home/informationDetail/informationDetail.html",
      controller: "module/home/informationDetail/informationDetailCtrl"
    },
    {
      tab: "tab-home",//手机号验证
      url: "/iphoneVerification",
      stateName: "tab.iphoneVerification",
      templateUrl: "js/module/iphoneVerification/iphoneVerification.html",
      controller: "module/iphoneVerification/iphoneVerificationCtrl"
    },
    {
      tab: "tab-train",
      url: "/train",
      stateName: "tab.train",
      templateUrl: "js/module/train/tab-train.html",
      controller: "module/train/trainCtrl"
    },
    {
      tab: "tab-train",
      url: "/train/myTrainRecord/:uid/:projectId",
      stateName: "tab.myTrainRecord",
      templateUrl: "js/module/train/myTrainRecord/myTrainRecord.html",
      controller: "module/train/myTrainRecord/myTrainRecordCtrl"
    },
    {
      tab: "tab-train",
      url: "/train/myTrainDetail/:id",
      stateName: "tab.myTrainDetail",
      templateUrl: "js/module/train/myTrainDetail/myTrainDetail.html",
      controller: "module/train/myTrainDetail/myTrainDetailCtrl"
    },
    {
      tab: "tab-train",
      url: "/train/groupList/:id/:captainId/:projectId",
      stateName: "tab.groupMemberList",
      templateUrl: "js/module/train/groupList/memberList.html",
      controller: "module/train/groupList/memberListCtrl"
    },
    {
      tab: "tab-my",
      url: "/my",
      stateName: "tab.my",
      templateUrl: "js/module/my/tab-my.html",
      controller: "module/my/myCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/certification",
      stateName: "tab.certification",
      templateUrl: "js/module/my/certification/certification.html",
      controller: "module/my/certification/certificationCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/personalData",
      stateName: "tab.personalData",
      templateUrl: "js/module/my/personalData/personalData.html",
      controller: "module/my/personalData/personalDataCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/mySkills",
      stateName: "tab.mySkills",
      templateUrl: "js/module/my/mySkills/mySkills.html",
      controller: "module/my/mySkills/mySkillsCtrl"
    },
    {
      tab: 'tab-my',
      url: "/my/mySkills/skillDetail/:id",
      stateName: "tab.skillDetail",
      templateUrl: "js/module/my/mySkills/skillDetail/skillDetail.html",
      controller: "module/my/mySkills/skillDetail/skillDetailCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/mySkills/addSkills",
      stateName: "tab.addSkills",
      templateUrl: "js/module/my/mySkills/addSkills/addSkills.html",
      controller: "module/my/mySkills/addSkills/addSkillsCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/myTeam",
      stateName: "tab.myTeam",
      templateUrl: "js/module/my/myTeam/myTeam.html",
      controller: "module/my/myTeam/myTeamCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/myTeam/addTeam",
      stateName: "tab.addTeam",
      templateUrl: "js/module/my/myTeam/addTeam/addTeam.html",
      controller: "module/my/myTeam/addTeam/addTeamCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/myTeam/myTeamDetail/:id",
      stateName: "tab.myTeamDetail",
      templateUrl: "js/module/my/myTeam/myTeamDetail/myTeamDetail.html",
      controller: "module/my/myTeam/myTeamDetail/myTeamDetailCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/myTeam/captainChange/:id/:teamId/:captainId/:groupName/:projectId",
      stateName: "tab.captainChange",
      templateUrl: "js/module/my/myTeam/captainChange/captainChange.html",
      controller: "module/my/myTeam/captainChange/captainChangeCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/myTeam/memberList/:id/:captainId",
      stateName: "tab.memberList",
      templateUrl: "js/module/my/myTeam/memberList/memberList.html",
      controller: "module/my/myTeam/memberList/memberListCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/myTeam/addMember/:id",
      stateName: "tab.addMember",
      templateUrl: "js/module/my/myTeam/addMember/addMember.html",
      controller: "module/my/myTeam/addMember/addMemberCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/myTeam/deleteMember/:id/:captainId",
      stateName: "tab.deleteMember",
      templateUrl: "js/module/my/myTeam/deleteMember/deleteMember.html",
      controller: "module/my/myTeam/deleteMember/deleteMemberCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/myTeam/memberData/:id",
      stateName: "tab.memberData",
      templateUrl: "js/module/my/myTeam/memberData/memberData.html",
      controller: "module/my/myTeam/memberData/memberDataCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam",
      stateName: "tab.engineerTeam",
      templateUrl: "js/module/my/engineerTeam/engineerTeam.html",
      controller: "module/my/engineerTeam/engineerTeamCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam/engineerTeamDetail/:id/:captainId",
      stateName: "tab.engineerTeamDetail",
      templateUrl: "js/module/my/engineerTeam/engineerTeamDetail/engineerTeamDetail.html",
      controller: "module/my/engineerTeam/engineerTeamDetail/engineerTeamDetailCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam/addEngineerTeam/:id",
      stateName: "tab.addEngineerTeam",
      templateUrl: "js/module/my/engineerTeam/addEngineerTeam/addEngineerTeam.html",
      controller: "module/my/engineerTeam/addEngineerTeam/addEngineerTeamCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam/teamList/:id/:projectId/:name/:status",
      stateName: "tab.teamList",
      templateUrl: "js/module/my/engineerTeam/teamList/teamList.html",
      controller: "module/my/engineerTeam/teamList/teamListCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam/teamListDetail/:id/:captainId/:name/:projectId",
      stateName: "tab.teamListDetail",
      templateUrl: "js/module/my/engineerTeam/teamListDetail/teamListDetail.html",
      controller: "module/my/engineerTeam/teamListDetail/teamListDetailCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam/teamDetailAddMembers/:groupId/:captainId/:projectId",
      stateName: "tab.teamDetailAddMembers",
      templateUrl: "js/module/my/engineerTeam/teamDetailAddMembers/teamDetailAddMembers.html",
      controller: "module/my/engineerTeam/teamDetailAddMembers/teamDetailAddMembersCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam/invitedMember",
      stateName: "tab.invitedMember",
      templateUrl: "js/module/my/engineerTeam/invitedMember/invitedMember.html",
      controller: "module/my/engineerTeam/invitedMember/invitedMemberCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam/waitMember/:id",
      stateName: "tab.waitMember",
      templateUrl: "js/module/my/engineerTeam/waitMember/waitMember.html",
      controller: "module/my/engineerTeam/waitMember/waitMemberCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam/exitApplication/:groupId/:captainId/:projectId",
      stateName: "tab.exitApplication",
      templateUrl: "js/module/my/engineerTeam/exitApplication/exitApplication.html",
      controller: "module/my/engineerTeam/exitApplication/exitApplicationCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam/applyEngineerTeam",
      stateName: "tab.applyEngineerTeam",
      templateUrl: "js/module/my/engineerTeam/applyEngineerTeam/applyEngineerTeam.html",
      controller: "module/my/engineerTeam/applyEngineerTeam/applyEngineerTeamCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/engineerTeam/applyEngineerDetail/:id/:status/:name/:ctiyId",
      stateName: "tab.applyEngineerDetail",
      templateUrl: "js/module/my/engineerTeam/applyEngineerDetail/applyEngineerDetail.html",
      controller: "module/my/engineerTeam/applyEngineerDetail/applyEngineerDetailCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/invitation",
      stateName: "tab.invitation",
      templateUrl: "js/module/my/invitation/invitation.html",
      controller: "module/my/invitation/invitationCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/Invitation/invitingTeamDetail",
      stateName: "tab.invitingTeamDetail",
      templateUrl: "js/module/my/Invitation/invitingTeamDetail/invitingTeamDetail.html",
      controller: "module/my/Invitation/invitingTeamDetail/invitingTeamDetailCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/feedBack",
      stateName: "tab.feedBack",
      templateUrl: "js/module/my/feedBack/feedBack.html",
      controller: "module/my/feedBack/feedBackCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/workTypes/:id/:parentId",
      stateName: "tab.workTypes",
      templateUrl: "js/module/my/workTypes/workTypes.html",
      controller: "module/my/workTypes/workTypesCtrl"
    },
    {
      tab: "tab-my",
      url: "/my/useHelp",
      stateName: "tab.useHelp",
      templateUrl: "js/module/my/useHelp/useHelp.html",
      controller: "module/my/useHelp/useHelpCtrl"
    }
  ];
  var stateObj = {
    defaultStates: "/tab/home",
    states: stateArray
  };
  return stateObj;
});
