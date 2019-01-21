/**
 * Created by xuehaipeng on 2017/4/7.
 */
define(["route", "exif"], function (route) {
  "use strict";
  //ios图片旋转
  function getImgData(img, dir, next, set_width) {
    var image = new Image();
    image.onload = function () {
      var degree = 0, drawWidth, drawHeight, width, height;
      drawWidth = this.naturalWidth;
      drawHeight = this.naturalHeight;
      //以下改变一下图片大小
      var maxSide = Math.max(drawWidth, drawHeight);
      if (maxSide > set_width) {
        var minSide = Math.min(drawWidth, drawHeight);
        minSide = minSide / maxSide * set_width;
        maxSide = set_width;
        if (drawWidth > drawHeight) {
          drawWidth = maxSide;
          drawHeight = minSide;
        } else {
          drawWidth = minSide;
          drawHeight = maxSide;
        }
      }
      var canvas = document.createElement('canvas');
      canvas.width = width = drawWidth;
      canvas.height = height = drawHeight;
      var context = canvas.getContext('2d');
      //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
      switch (dir) {
        //iphone横屏拍摄，此时home键在左侧
        case 3:
          degree = 180;
          drawWidth = -width;
          drawHeight = -height;
          break;
        //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
        case 6:
          canvas.width = height;
          canvas.height = width;
          degree = 90;
          drawWidth = width;
          drawHeight = -height;
          break;
        //iphone竖屏拍摄，此时home键在上方
        case 8:
          canvas.width = height;
          canvas.height = width;
          degree = 270;
          drawWidth = -width;
          drawHeight = height;
          break;
      }
      //使用canvas旋转校正
      context.rotate(degree * Math.PI / 180);
      context.drawImage(this, 0, 0, drawWidth, drawHeight);
      //返回校正图片
      next(canvas.toDataURL("image/jpeg", 0.5));
    };
    image.src = img;
  }

  route.filter("substring", function () {
    return function (input) {
      if (input.length > 0) {
        return input.substring(0,1);
      }
      return input;
    }
  });

  route.filter("contentFilter", function () {
    return function (input) {
      if (input.length > 0) {
        input = input.replace(/<(.*?)>/g, "");
        input = input.replace(/&nbsp;/gi,'');
        if (input.length > 50) {
          return input.substring(0,50);
        } else {
          return input
        }
      }
      return input;
    }
  });

  route.factory("compressImage",["$q", function ($q) {
    return {
      compress : function (file, targetWidth, isCompress) {
        try {
          var deferred = $q.defer();
          var bigImgs = [];
          var orientation = 0;
          if (!/image\/\w+/.test(file.type)) {
            // toast("请确保文件为图像类型");
            return false;
          }
          EXIF.getData(file, function () {
            EXIF.getAllTags(this);
            orientation = EXIF.getTag(this, 'Orientation');
          });
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            var img_url = this.result;
            if (orientation > 1) {
              getImgData(this.result, orientation, function (data) {
                //这里可以使用校正后的图片data了
                deferred.resolve(data);
              }, targetWidth);
            } else {
              var imgc = new Image();
              imgc.onload = function () {
                //生成比例
                var width = imgc.width;
                var height = imgc.height;
                if (isCompress) {
                  var scale = width / height;
                  if (width > targetWidth) {
                    width = parseInt(targetWidth);
                    height = parseInt(width / scale);
                  }
                }
                //生成canvas
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');  //建立二维画布
                canvas.width = width;
                canvas.height = height;
                // canvas.attr({width : width, height : height});  //设置画布的宽高
                ctx.fillStyle = "#ffffff";//设置背景色
                ctx.fillRect(0, 0, width, height); //填充画布
                ctx.drawImage(imgc, 0, 0, width, height); //在画布上绘制图片

                var base64 = canvas.toDataURL('image/jpeg');
                deferred.resolve(base64);
              };
              imgc.src = img_url;
            }
          }
        } catch (e) {
          deferred.reject(e);
        }
        return deferred.promise;
      },
      dataURItoBlob : function (dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
        else
          byteString = unescape(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {
          type: mimeString
        });
      }
    }
  }]);
  route.filter("trustHtml", ["$sce", function ($sce) {
    return function (input) {
      return $sce.trustAsHtml(input);
    }
  }]);
  route.directive('compile', function ($compile) {//图片上传
    return function (scope, element, attrs) {
      scope.$watch(
        function (scope) {
          return scope.$eval(attrs.compile);
        },
        function (value) {
          element.html(value);
          $compile(element.contents())(scope);
        }
      );
    };
  });
  route.directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        scope.$watch(attributes.hideTabs, function(value){
          $rootScope.hideTabs = value;
        });
      }
    };
  });
  route.filter('articleFilter', function () {
    return function (input) {
      if (!angular.isUndefined(input) && input !== null && input !== "") {
        input = input.replace(/<(.*?)>/g,"");
        input = input.replace(/&nbsp;/g,"");
      }
      return input;
    }
  });
  route.filter('intervalFilter', function () {
    return function (input) {
     if (input < 0) {
       return input * -1;
     }
      return input;
    }
  });
  return route;
});
