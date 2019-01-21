/**
 * Created by xuehaipeng on 2017/4/11.
 */
define(["route"], function (route) {
	"use strict";

    /** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
     可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
     Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
     * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
    Date.prototype.pattern = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      var week = {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
  };

  Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == val) return i;
    }
    return -1;
  };

  Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };

   route.constant("constValue",{
      //host: "https://api.wugongbang.com",
      hostSuffix: { wgb:"/wgbapi/v1", common:"/base/v1", img:"/wgbapi/"},
      host: "http://47.94.249.206:881",
      //azbHost : "https://www.qhse.cn",
      azbHost : "https://beta1.qhse.cn",
      httpType : {
        GET : "GET",
        POST : "POST",
        PUT : "PUT",
        DELETE : "DELETE"
      }
   });

/*  route.constant("constValue",{
    host: "http://localhost:1111/",
    username: "baodaibaoDev", //dev 测试php 回调端口对应8888
    password: "96e79218965eb72c92a549dd5a330112",
    api:"http://113.200.156.88:8000/dispatch/quote", //dispath路径
    payCallBack : "http://116.62.19.49:9090",
    directApi : "http://testwd.baodaibao.com.cn/"
  });*/

  //Test环境
  // route.constant("constValue",{
  //    host: "http://116.62.19.49:9090/",
  //    wxHost : "http://116.62.19.49:9997/",
  //  //wxHost : "http://192.168.199.196/bdbweixin/",
  //    username: "baodaibaoDev", //dev 测试php 回调端口对应8888
  //    password: "96e79218965eb72c92a549dd5a330112",
  //    api:"http://113.200.156.88:8000/dispatch/quote", //dispath路径
  //    payCallBack : "http://apibeta.baodaibao.com.cn",
  //    directApi : "http://testwd.baodaibao.com.cn/"
  //  });

  route.constant("regularExpression",{
    nameLength: 40,
    nameRegEx : /^([\u4E00-\uFA29]*[a-z]*[A-Z]*)+$/, //中文，英文
    numberAndEnglishRegEx : /^([a-z]*[A-Z]*[0-9]*)+$/, //英文，数字
    priceRegEx :  /^[0-9]+([.]{1}[0-9]{1,2})?$/, //非负整数或小数，小数最多精确到小数点后两位
    cellPhoneLength: 11,
    cellPhoneRegEx: /^\d{11}$/,
    phoneRegEx: /^((0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|\d{11}|((400\-)([0-9]{3,7})+(\-[0-9]{1,4}))$/,
    idCardMinLength : 15,
    idCardMaxLength : 18,
    idCardRegEx : /^([1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2})|([1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])$/,
    addressLength : 125,
    remindDateRegEx : /^(([0-9])|([1-2][0-9])|(30))$/,
    remindDateRegExDescription : "0-30天",
    remindCarDateRegEx : /^(([0-9])|([1-8][0-9])|(90))$/,
    remindCarDateRegExDescription : "0-90天",
    monthRegEx : /^(0[[1-9]|1[0-2])$/,
    yearRegEx : /^\d\d$/,
    cvv2: /^\d{3}$/,
    carNumberRegEx : /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/,
    carNumberPartRegEx : /^[A-Z]{1}[A-Z_0-9]{5}$/,
    maxLength: 250,
    orgRegEx : /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]|[a-zA-Z0-9]+$/,
    orgLength: 40
  });


  route.filter("httpFilter",['constValue',function(constValue) { //img的过滤器
    return function(text) {
      if(text == undefined || text == ''){
        return;
      }
      if(text.indexOf("/img/") != -1){
        return text;
      }
      if(text.indexOf("data:image/jpeg;base64") != -1){
        return text;
      }
      // return "http://image.baodaibao.com.cn/fileTemp/"+ text;
      return constValue.host + constValue.hostSuffix.img + text;
    }
  }]);

  route.factory("getUUID",function () {
    return{
        generateUUID: function (str) {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid + str;
      }
    }
  });

  route.factory("locals",['$cookies', function ($cookies) {
    return {
      //存储单个属性
      set: function (key, value) {
        var expiresDate=new Date();
        expiresDate.setDate(expiresDate.getDate()+365);
        $cookies.put(key, value, {'expires':expiresDate.toGMTString()})
      },
      //读取单个属性
      get: function (key) {
        return $cookies.get(key);
      },
      setObject: function (key, value) {
        var expiresDate=new Date();
        expiresDate.setDate(expiresDate.getDate()+365);
        $cookies.putObject(key,value, {'expires':expiresDate.toGMTString()});
      },
      getObject: function (key) {
        return $cookies.getObject(key);
      },
      //判断key是否存在
      containsKey: function (key1) {
        var res = null;
        $cookies.get(key1) ? res = true : res = false;
        return res;
      },
      //清除所有存储的值
      clear: function () {
        var cookie = $cookies.getAll();
        for ( var key in cookie){
          $cookies.remove( key );
        }
      },
      //移除单个值
      removeItem: function (key) {
        $cookies.remove(key);
      }
    }
  }]);

	route.factory("loading", ["$ionicLoading", "$timeout","$ionicPopover","$ionicPopup", "$rootScope", function ($ionicLoading, $timeout,$ionicPopover,$ionicPopup,$rootScope) {
    return {
      show : function (str) {
        if (angular.isUndefined(str)) {
          $rootScope.loadHint = "Loading...";
        } else {
          $rootScope.loadHint = str;
        }
        $ionicLoading.show({
          content: 'Loading',
          templateUrl: 'loading.html',
          animation: 'fade-in',
          showBackdrop: true
        });
        $timeout(function () {
          $ionicLoading.hide();
        }, 5000);
      },
      hide : function () {
        $ionicLoading.hide();
      },
      toast : function (element, content) {
        if (!element.toastClass || element.toastClass == "") {
          element.toastClass = "loading-container visible toast toast2";
          element.toastContent = content;
          $timeout(function () {
            element.toastClass = "";
            element.toastContent = "";
          }, 3000);
        }
      },
      popover : function () {
        $ionicPopover.fromTemplateUrl({
          title : 'title',
          content : 'popover',
          templateUrl : 'popover.html'
        })
      },
      inquiry : function (content) {
        $ionicLoading.show({
          content: 'Loading',
          template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><div style="text-align: left;"><span>'+content+'</span></div>',
          animation: 'fade-in',
          showBackdrop: true
        });
      },
      ocrAlert : function (str) {
        if (str != null && str != undefined){
          $ionicPopup.alert({
            title: '温馨提示',
            template: '请核实信息',
            cssClass: 'myPopupOneBtn',
            buttons:[
              {
                text:"关闭",
                type:"button button-outline button-positive"
              }
            ]
          });
        }
      },
      alertHint : function (title, str) {
        if (str != null && str != undefined) {
          $ionicPopup.alert({
            title: title,
            template: str,
            cssClass: 'myBtn',
            buttons:[
              {
                text:"关闭",
                type:"button button-outline button-balanced"
              }
            ]
          });
        }
      },
      alertError : function () {
        $ionicPopup.alert({
          title: "温馨提示",
          template: "数据异常，请稍后再试...",
          cssClass: 'myBtn',
          buttons:[
            {
              text:"关闭",
              type:"button button-outline button-balanced"
            }
          ]
        });
      }
    }
  }]);

	route.factory("bdbHttp", ["$q", "$http", "locals",function ($q, $http,locals) {
		return {
			httpPost : function (params) {
				var deferred = $q.defer();
        var data = {
          method : "POST",
          url : params.url,
          data : angular.toJson(params.data)
        };
        if (params.isPhp) {
          data.headers = {
            'Content-Type': "application/x-www-form-urlencoded",
            "channel": angular.isUndefined(params.headers) ? "" : params.headers
          }
        } else {
          data.headers = {
            'Content-Type': "application/json",
            "channel": angular.isUndefined(params.headers) ? "" : params.headers,
            "USER_TOKEN": angular.isUndefined(locals.get("USER_TOKEN")) ? "" : locals.get("USER_TOKEN")
          }
        }
				$http(data).then(function success(data) {
                    deferred.resolve(data.data);
                }, function error(err) {
                    deferred.reject(err);
                });
				return deferred.promise;
			},
      httpPostParams : function (params) {
          var deferred = $q.defer();
          $http({
              method : "POST",
              url : params.url,
              params : params.data,
			  headers :{"USER_TOKEN": angular.isUndefined(locals.get("USER_TOKEN")) ? "" : locals.get("USER_TOKEN")}
          }).then(function success(data) {
              deferred.resolve(data.data);
          }, function error(err) {
              deferred.reject(err);
          });
          return deferred.promise;
      },
			httpGet : function (params) {
				var deferred = $q.defer();
				var content = [];
				for (var key in params.data) {
					content.push(key+"="+params.data[key]);
				}
				if (!angular.isUndefined(params.data.id)) {
          params.url += params.data.id;
        }
				params.url += "?" + content.join("&");
				$http({
					method : "GET",
					headers : {"channel": angular.isUndefined(params.headers) ? "" : params.headers,
								"USER_TOKEN": angular.isUndefined(locals.get("USER_TOKEN")) ? "" : locals.get("USER_TOKEN")
								},
					url : params.url
				}).then(function success(data) {
                    deferred.resolve(data.data);
                }, function error(err) {
                    deferred.reject(err);
                });
				return deferred.promise;
			},
      httpDelete : function (params) {
        var deferred = $q.defer();
        params.url += params.data.id;
        $http({
          method : "DELETE",
          url : params.url,
		  headers : {"channel": angular.isUndefined(params.headers) ? "" : params.headers,
					"USER_TOKEN": angular.isUndefined(locals.get("USER_TOKEN")) ? "" : locals.get("USER_TOKEN")}
        }).then(function success(data) {
          deferred.resolve(data.data);
        }, function error(err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      httpPut : function (params) {
        var deferred = $q.defer();
        params.url += angular.isUndefined(params.data.id) ? "" : params.data.id;
        $http({
          method : "PUT",
          url : params.url,
          data : angular.toJson(params.data.data),
		  headers : {"channel": angular.isUndefined(params.headers) ? "" : params.headers,
					"USER_TOKEN": angular.isUndefined(locals.get("USER_TOKEN")) ? "" : locals.get("USER_TOKEN")
					}
        }).then(function success(data) {
          deferred.resolve(data.data);
        }, function error(err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
			httpFile : function (params) {

				var isBlobArray =function (obj){
					if($.isArray(obj)){
						for (var i in obj) {
							if(obj[i]&&obj[i].type){//is Blob
								return true;
							}else{
								return false;
							}
						}
					}else{
						return false;
					}
				}
				var fd = new FormData();
				for (var key in params.data) {
                    if(isBlobArray(params.data[key])){
						var blobArray = params.data[key];
						for (var i in blobArray) {
							fd.append(key, blobArray[i]);
						}

					}else{
						fd.append(key, params.data[key]);
					}
				}
				var deferred = $q.defer();
				$http({
					method : "POST",
					url : params.url,
					data : fd,
					headers : {'Content-Type': undefined,"USER_TOKEN": angular.isUndefined(locals.get("USER_TOKEN")) ? "" : locals.get("USER_TOKEN")},
					transformRequest: angular.identity
				}).then(function success(data) {
                    deferred.resolve(data.data);
                }, function error(err) {
                    deferred.reject(err);
                });
				return deferred.promise;
			}
		}
	}]);

	route.factory("tabSwitch", ["locals", function (locals) {
    return {
      setTab : function (index) {
        locals.set("tab", index);
      },
      getTab : function () {
        return locals.get("tab");
      }
    }
  }]);

	route.factory("exception", ["bdbAPI", function (bdbAPI) {
    return {
      collectException : function (err, pageName) {
        var exceptionParam = {pageName:pageName,content:err.stack.replace("\t"," ").toString()};
        console.log(exceptionParam);
        bdbAPI.collectionErrorInfo(exceptionParam).then(function (result) {
          if (result.code === 200) {

          }
        },function (err) {
          console.log(err);
        })
      }
    }
  }]);

	route.factory("bdbAPI",["bdbHttp","constValue", function (bdbHttp,constValue) {
    var host = constValue.host;
    var azbHost = constValue.azbHost;
    var suffix = constValue.hostSuffix;
		return {
        getWorkTypes : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/worktypes/",
            data : reqData
          };
          return bdbHttp.httpGet(params);
        },
        workTypesHandler : function (reqData, httpType) {
          var params = {
            url : host + suffix.wgb + "/worktypes/",
            data : reqData
          };
          switch (httpType) {
            case constValue.httpType.GET:
              return bdbHttp.httpGet(params);
              break;
            case constValue.httpType.POST:
              return bdbHttp.httpPost(params);
              break;
            case constValue.httpType.DELETE:
              return bdbHttp.httpDelete(params);
              break;
            case constValue.httpType.PUT:
              return bdbHttp.httpPut(params);
              break;
          }
        },
        teamHandler : function (reqData, httpType) {
          var params = {
            url : host + suffix.wgb + "/team/",
            data : reqData
          };
          switch (httpType) {
            case constValue.httpType.GET:
              return bdbHttp.httpGet(params);
              break;
            case constValue.httpType.POST:
              return bdbHttp.httpPost(params);
              break;
            case constValue.httpType.DELETE:
              return bdbHttp.httpDelete(params);
              break;
            case constValue.httpType.PUT:
              return bdbHttp.httpPut(params);
              break;
          }
        },
        getTeamListByUserId : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/team/listTeam",
            data : reqData
          };
          return bdbHttp.httpGet(params);
        },
        insertException : function (reqData) {
          // var params = {
          //   url : host + suffix.common + "/errorCollction/insert",
          //   data : reqData
          // };
          // return bdbHttp.httpPost(params);
        },
        getArticleList : function (reqData) {     //文章列表
          var params = {
            url : host + suffix.wgb + "/posts/findArticle",
            data : reqData
          };
          return bdbHttp.httpPost(params);
        },
        getArticleCategory : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/posts/type/",
            data : reqData
          };
          return bdbHttp.httpGet(params);
        },
        sms : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/sms/sendMessage",
            data : reqData
          };
          return bdbHttp.httpPost(params);
        },
        register : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/sms/verifiy",
            data : reqData
          };
          return bdbHttp.httpPost(params);
        },
        ocrIdcard : function (reqData) {
          var params = {
            url : host + suffix.common + "/ocr/idcard",
            data : reqData
          };
          return bdbHttp.httpFile(params);
        },
        userInfoHandler : function (reqData, httpType) {
          var params = {
            url : host + suffix.wgb + "/users/",
            data : reqData
          };
          switch (httpType) {
            case constValue.httpType.GET:
              return bdbHttp.httpGet(params);
              break;
            case constValue.httpType.PUT:
              return bdbHttp.httpPut(params);
              break;
          }
        },
        getRegions : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/regions/",
            data : reqData
          };
          return bdbHttp.httpGet(params);
        },
        addKill : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/skills/",
            data : reqData
          };
          return bdbHttp.httpFile(params);
        },
        getsKill : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/skills/",
            data : reqData
          };
          return bdbHttp.httpGet(params);
        },
        getGroup : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/groups/findGroupRels",
            data : reqData
          };
          return bdbHttp.httpPost(params);
        },
        addGroup : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/groups/",
            data : reqData
          };
          return bdbHttp.httpPostParams(params);
        },
        groupHandler : function (reqData, httpType) {
          var params = {
            url : host + suffix.wgb + "/groups/",
            data : reqData
          };
          switch (httpType) {
            case constValue.httpType.GET:
              return bdbHttp.httpGet(params);
              break;
            case constValue.httpType.PUT:
              return bdbHttp.httpPut(params);
              break;
          }
        },
        searchUsers : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/users/searchUsers",
            data : reqData
          };
          return bdbHttp.httpPost(params);
        },
        captainTransferByTeam : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/team/captainTransfer",
            data : reqData
          };
          return bdbHttp.httpPostParams(params);
        },
        captainTransferByGroup : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/groups/captain",
            data : reqData
          };
          return bdbHttp.httpPostParams(params);
        },
        addInvitations : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/invitations/",
            data : reqData
          };
          return bdbHttp.httpPost(params);
        },
        findInvitations : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/invitations/findInvitations",
            data :reqData
          };
          return bdbHttp.httpPost(params);
        },
        delteUsers : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/users/",
            data : reqData
          };
          return bdbHttp.httpPostParams(params);
        },
        inviteCount : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/invitations/countByRespondent/",
            data : reqData
          };
          return bdbHttp.httpGet(params);
        },
        confirmInvitation : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/invitations/confirmInvitation",
            data : reqData
          };
          return bdbHttp.httpPostParams(params);
        },
        refuseInvitation : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/invitations/",
            data : reqData
          };
          return bdbHttp.httpDelete(params);
        },
        certification : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/users/"+reqData.id+"/certification",
            data : reqData
          };
          return bdbHttp.httpFile(params);
        },
        getTeamsByCaptainId : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/team/findTeams",
            data : reqData
          };
          return bdbHttp.httpPost(params);
        },
        deleteInvitation : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/invitations/",
            data : reqData
          };
          return bdbHttp.httpDelete(params);
        },
        saveGroupInfo : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/groups/",
            data : reqData
          };
          return bdbHttp.httpPut(params);
        },
        addFeedBack : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/feedbacks/",
            data : reqData
          };
          return bdbHttp.httpFile(params);
        },
        skillHander : function (reqData, httpType) {
          var params = {
            url : host + suffix.wgb + "/skills/",
            data : reqData
          };
          switch (httpType) {
            case constValue.httpType.GET:
              return bdbHttp.httpGet(params);
              break;
            case constValue.httpType.DELETE:
              return bdbHttp.httpDelete(params);
              break;
          }
        },
        updateSkill : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/skills/"+reqData.id,
            data : reqData
          };
          return bdbHttp.httpFile(params);
        },
        teamFollowersNum : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/team/teamFollowersNum",
            data : reqData
          };
          return bdbHttp.httpGet(params);
        },
        getWXjsSDK : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/wxCallBack/getSDKConfig",
            data : reqData
          };
          return bdbHttp.httpPostParams(params);
        },
        collectionErrorInfo : function (reqData) {
          var params = {
            url : host + suffix.common + "/errorCollction/insert",
            data : reqData
          };
          return bdbHttp.httpPostParams(params);
        },
        getAticleInfo : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/posts/",
            data : reqData
          };
          return bdbHttp.httpGet(params);
        },
        goLike : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/posts/like",
            data : reqData
          };
          return bdbHttp.httpPostParams(params);
        },
        updateMoblie : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/users/"+reqData.uid+"/updateMoblie/",
            data : reqData
          };
          return bdbHttp.httpPut(params);
        },
        getUserByInviteId : function (reqData) {
          var params = {
            url : host + suffix.wgb + "/invitations/getUserDetail",
            data : reqData
          };
          return bdbHttp.httpPostParams(params);
        },
        getProjectTeamList : function (reqData) {   //获取工程队
          var params = {
            url : azbHost + "/WuGongBang/projectTeam/projectTeamList",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        getProjectTeamInfo : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/thirdParty/projectTeamInfoByID",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        joinProject : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/thirdParty/joinRecordAdd",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        getEducationCategory : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/thirdParty/teachTypeTags",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        getEducationRecord : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/thirdParty/safetyEducationList",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        getEducationDetail : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/thirdParty/safetyEducationInfo",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        teamAttorn : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/thirdParty/teamAttorn",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        agreeInviteProject : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/thirdParty/workPersonConfirminvitation",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        addGroupByAZB : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/thirdParty/teamAdd",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        deleteGroupUsersByAZB : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/thirdParty/projectTeamRemove",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        addUsersByAZB : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/thirdParty/projectTeamAddList",
            data : reqData,
            headers : "WUGONGBANG"
          };
          return bdbHttp.httpPost(params);
        },
        getHighScoreByAZB : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/integral/detailes/scoreValue",
            data : reqData
          };
          return bdbHttp.httpPost(params);
        },
        getBarrage : function (reqData) {
          var params = {
            url : azbHost + "/WuGongBang/integral/detailes/findNewIntergralsTrends",
            data : reqData
          };
          return bdbHttp.httpPost(params);
        }
      }
	}]);

	return route;
});
