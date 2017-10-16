/**
 * Created by user on 2016/12/22.
 */
angular.module('network.netSource', ['ngCordova'])

.factory('NetSource', function ($http,
                                $cordovaFileTransfer,
                                pathService,
                                dialogsManager) {

  return {

    getRequest: function (apiName, args, successCallback, errorCallback) {
      var reqUrl = pathService.getPath(apiName);
      $http.jsonp(reqUrl, {params: args}).success(function (response) {
        successCallback(response);
      }).error(function (error) {
        dialogsManager.showMessage("网络故障,请稍后再试!");
        errorCallback(error);
      });
    },

    fileUpload: function (apiName, args, file, successCallback, errorCallback) {
      var reqUrl = pathService.getPath(apiName);
      var options = {
        fileKey: "file",
        fileName: "image.png",
        chunkedMode: false,
        mimeType: "image/png"
      };
      options.params = args;
      $cordovaFileTransfer.upload(reqUrl, file, options).then(function (response) {
        var result = JSON.parse(response.response);
        successCallback(result);
      }, function (err) {
        dialogsManager.showMessage("网络故障,请稍后再试!");
        errorCallback(err);
      }, function (progress) {

      });

    }
  };

});
