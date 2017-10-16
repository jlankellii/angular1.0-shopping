/**
 * Created by user on 2016/12/31.
 */
angular.module('showOrder.showOrderService', [])

.factory('showOrderService', function (NetSource) {
  return {
    submitMyShowOrder: function (entity, successCallback, errorCallback) {
      var args = {
        userId: entity.userId,
        order: entity.order,
        score: entity.score,
        describe: entity.describe,
        goodsId:entity.goodsId
      };
      var file = entity.pic;

      NetSource.fileUpload('exposureGoods',args, file, function (response) {
        successCallback(response);
      }, function (error) {
        errorCallback(error);
      });
    },

    queryAllShowOrder: function (userId, pageNum, pageSize, successCallback, errorCallback) {
      var args = {userId:userId, pageNumber: pageNum, pageSize: pageSize};
      NetSource.getRequest('searchAllExposureGoods', args, function (response) {
        if (200 == response.flag){

          successCallback(response);
        }else{
          errorCallback(response);
        }
      }, function (error) {
        errorCallback(error);
      });
    },

    queryMyShowOrder: function (userId,pageNum, pageSize,successCallback, errorCallback) {
      var args = {userId: userId, pageNumber: pageNum, pageSize: pageSize};
      NetSource.getRequest('searchExposureGoods', args, function (response) {
        if (200 == response.flag){

          successCallback(response);
        }else{
          errorCallback(response);
        }
      }, function (error) {
        errorCallback(error);
      })
    },

    likeShowOrder: function (userId, exposureId, successCallback, errorCallback) {
      var args = {userId: userId, exposureId: exposureId};
      NetSource.getRequest('iLike', args, function (response) {
        if (200 == response.flag){

          successCallback(response);
        }else{
          errorCallback(response);
        }
      }, function (error) {
        errorCallback(error);
      })
    }
  }
});
