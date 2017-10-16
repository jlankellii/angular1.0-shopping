/**
 * Created by user on 2016/12/23.
 */
angular.module('utils.photo', ['ionic'])

//消息模板
.factory("dialogsManager", dialogsManager)

.factory('CameraTool', function ($cordovaCamera) {

  return {
    getFromCamera: function (successCallback, errorCallback) {
      var cameraOption = {
        //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
        quality: 20,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
        allowEdit: true,                                        //在选择之前允许修改截图
        encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        targetWidth: 200,                                        //照片宽度
        targetHeight: 200,                                       //照片高度
        mediaType:0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        cameraDirection:0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true                                   //保存进手机相册
      };

      $cordovaCamera.getPicture(cameraOption).then(function (imageUrl) {
        successCallback(imageUrl);
      }, function (error) {
        errorCallback(error);
      });
    },
    getFromPhotolib: function (successCallback, errorCallback) {
      var photolibOption = {
        //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
        quality: 20,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
        allowEdit: true,                                        //在选择之前允许修改截图
        mediaType:0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        targetWidth: 200,
        targetHeight: 200
      };

      $cordovaCamera.getPicture(photolibOption).then(function (imageUrl) {
        successCallback(imageUrl);
      }, function (error) {
        errorCallback(error);
      });
    }
  };

})

.factory('getClipboard',getClipboard);

function dialogsManager($q,$http,$compile,$timeout,$rootScope) {
    var megTmp="<div class='nspop_megcontainer myactive' >" +
      "<div class='main'>" +
      "<div class='textContent'>{{content}}</div>" +
      "</div>" +
      "</div>";

    var dialog={
      megs:[],
      showMessage:showMessage,
      alert:alert,  //未实现
      confirm:confirm //未实现
    };

    //消息展示
    function showMessage(content,options) {
      //移除已存在的消息展示
      angular.forEach(dialog.megs, function (item,index) {
        item.remove();
      });
      createMeg(content,options);
    }

    //消息创建
    function createMeg(content,options){
      options = angular.extend({
        bottom: 55, //继续下边距离
        scope: $rootScope.$new(), //创建一个继承自根的作用域
        timeout: 3000  //多少秒后自动隐藏
      }, options);
      //消息文本
      options.scope.content = content;
      var megPromise = $q.when(compileTmp({template: megTmp, scope: options.scope, appendTo: angular.element(document.body)}))
      megPromise.then(function (result) {
        dialog.megs.push(result);
        result.css("bottom", options.bottom + "px");
        $timeout(function () {
          result.remove(); //移除消息展示
          options.scope.$destroy();  //摧毁作用域
        },options.timeout);
      })
    }

    //编译模板
    function compileTmp(options){
      var tem=  $compile(options.template)(options.scope);
      if(options.appendTo){
        options.appendTo.append(tem);
      }
      return tem;
    }
    return dialog;
}

function getClipboard($ionicPopup,$cordovaClipboard,$location){
  return{
    showPopup:function(){
      var isApp = false;
      //判断是否是在app中
      if ($location.absUrl().indexOf('file://')>=0){
        isApp = true;
      }
      if(isApp){
        $cordovaClipboard
          .paste()
          .then(function (result) {
            var myreg = /^\d{16}$/;
            if(myreg.test(result)){
              $ionicPopup.show({
                template: '<div style="align-content: center"><span>'+result+'</span></div>',
                title: '小XX检测到您复制了以下内容',
                //subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                  { text: '取消',
                    onTap: function(e) {
                      $cordovaClipboard
                        .copy('')
                        .then(function () {
                          // success
                        }, function () {
                          // error
                        });
                    }},
                  {
                    text: '去绑定单号',
                    type: 'button-small myTitle-bg',
                    onTap: function(e) {
                      $cordovaClipboard
                        .copy('')
                        .then(function () {
                          // success
                        }, function () {
                          // error
                        });
                    }
                  }
                ]
              });
            }
          }, function () {
            // error
          })
      }
    }
  }
}
