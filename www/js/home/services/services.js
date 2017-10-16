angular.module('home.services', [])
.factory('searchGoodSer',searchGoodSer)

/**
 * <p>描述: app首页接口服务</p>
 * <p>创建人: YangLiu</p>
 * <p>创建时间: 1/13/17</p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 */
  .factory('HomeService', function (NetSource, dialogsManager) {
    return {
      getHomeData : function (successCallback, errorCallback) {
        NetSource.getRequest('getHomeData', '', function (response) {
          var result = [];

          if (null != response.group) {
            result.group = response.group;
          }
          if (null != response.label) {
            result.label = response.label;
          }
          if (null != response.customBanner) {
            result.customBanner = response.customBanner;
          }
          if (null != response.custom) {
            result.custom = response.custom;
          }
          successCallback (result);

          },
          function (error) {
            dialogsManager.showMessage("网络故障,请稍后再试!");
            errorCallback(error);
          });
      },
      queryGoodsCategoryList: function (goodsClassId, pageNum, pageSize, successCallback, errorCallback) {
        var args = {groupId:goodsClassId, pageSize:pageSize, pageNumber:pageNum};
        NetSource.getRequest('getGoodsListByGroup', args, function (response) {
          var result = [];
            if (200 == response.goods.flag && null != response.goods.data) {
              result.goods = response.goods.data;
            }else {
              result.goods = [];
            }
            if (null !=response.banner &&
              200 == response.banner.flag &&
              null != response.banner.data) {
              result.banner = response.banner.data;
            }else {
              result.banner = [];
            }
            successCallback(result);
          },
          function (error) {
            dialogsManager.showMessage("网络故障,请稍后再试!");
            errorCallback(error);
          });
      },
      queryAdvGoodsList: function (advGoodsId, pageNum, pageSize, successCallback, errorCallback) {
        var args = {customId:advGoodsId,pageSize:pageSize,pageNumber:pageNum};
        NetSource.getRequest('advGoodsList', args, function (response) {
          if (200 == response.flag && null != response.data) {
            successCallback(response);
          }else {
            errorCallback(response);
          }
        }, function (error) {
          dialogsManager.showMessage("网络故障,请稍后再试!");
          errorCallback(error);
        })
      }
    }
  })

    /**
    * <p>方法描述:通过$http与后台交互，模块查找商品显示该类商品列表</p>
    * <p>创建人: liuchuxiao</p>
    * <p>创建时间: 2016.12.19</p>
    * <p>修改人: </p>
    * <p>修改时间: </p>
    * <p>修改备注: </p>
    * goodsModuleDetails：模块查询显示出的商品列表
    * $state:路由跳转
    * $http:进行异步请求
    */

  .factory('GoodsModuleDetails',function($http,pathService,$q){
    return {
      getGoodsModuleDetail:function(goodsModuleId,currentPage,count){
        var deferred = $q.defer();
        var url = pathService.getPath('getGoodsListByLable');
        var data = {lableId:goodsModuleId,pageSize:count,pageNumber:currentPage};
        $http.jsonp(url,{params:data}).success(function (result) {
          deferred.resolve(result);
        }).error(function (result) {
          deferred.reject(result);
        });
        return deferred.promise;
      }

    };
  })

  .factory('ShareAppGetScore',function($http,pathService,$q){
    return {
      getShareAppScore:function(userId,type,title,shareId){
        var url = pathService.getPath('getShareAppScore');
        var data = {userId:userId,type:type,title:title,shareId:shareId};
        return $http.jsonp(url,{params:data})
      }
    }
  })
  .factory('takSer',takSer);

function searchGoodSer($http,pathService,$q){
	  return {
		  getGoodsList:function(_params){
			  var deferred = $q.defer();
			  $http.jsonp(pathService.getPath('searchLuceneByCondition'),{params:_params}).
			  success(function(data, status, headers, config) {
				  deferred.resolve(data);
			  }).
			  error(function(data, status, headers, config) {
				  deferred.reject(data);
			  });
			  return deferred.promise;
		  }
	  }
}

function takSer($q,$http,pathService){
	return{
		signIn:function(_params){
			var _deferred = $q.defer();
			$http.jsonp(pathService.getPath('signIn'),{params:_params}).success(function(result){
				_deferred.resolve(result);
			}).error(function(result){
				_deferred.reject(result);
			});
			return _deferred.promise;
		}
	}
}
