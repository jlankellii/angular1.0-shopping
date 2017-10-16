/**
 * Created by user on 2016/12/20.
 */
angular.module('goods.goodsDetailServices', [])

.factory('GoodsDetailService', function ($http, pathService, NetSource) {
  return {
    queryGoodsDetail: function(goodsId, successCallback, errorCallback) {
      var args = {'id': goodsId};
      NetSource.getRequest('goodsDetailUrl', args, function (response) {
          if (200 == response.flag){
            successCallback(response);
          }
        }, function (error) {
          errorCallback(error);
        });
    }
  }
})
//领取优惠券
 .factory('getCouponLink',function($http,$q,pathService){
    return{
      /**
       * <p>方法描述:通过$http与后台交互，储存领取优惠券信息</p>
       * <p>创建人: xuke</p>
       * <p>创建时间: 2016.12.21</p>
       * <p>修改人: </p>
       * <p>修改时间: </p>
       * <p>修改备注: </p>
       * goodsId:商品Id
       * title:商品名称
       * userId：用户Id
       * $state:路由跳转
       * $http:进行异步请求
       */
      getCouponLinkMsg:function(goodsId,userId){
        var url = pathService.getPath('addGetCoupon');
        //发送请求
        var data = {goodsId:goodsId,userId:userId};
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  })
 /**
  * <p>方法描述:通过$http与后台交互，存储首单16位数字</p>
  * <p>创建人: lujiaming</p>
  * <p>创建时间: 2016.12.21</p>
  * <p>修改人: </p>
  * <p>修改时间: </p>
  * <p>修改备注: </p>
  * pathService:获取请求路径服务
  * $http:进行异步请求
  * userId 用户id
  * orderNum 首单后4位
  */
  .factory('firstOrder',function($http, pathService){
    return {
      firstOrder: function(userId,orderNum){
        var url = pathService.getPath('boundOrder');
        var promise = $http.jsonp(url,{params:{"userId":userId,"orderNum":orderNum}})
        return promise;
      }
    }
  });

