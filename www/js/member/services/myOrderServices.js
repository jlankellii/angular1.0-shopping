/**
 * Created by user on 2016/12/14.
 */
angular.module('member.myOrderServices', [])
  .factory('OrderAttention',function($http,pathService){
    return {
      getOrder:function(currentPage,userId,type,title){
        var url = pathService.getPath('getOrderRecord');
        var data = {pageNumber:currentPage,userId:userId,type:type,title:title};
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    };
  })
  //下拉刷新
  .factory('totalOrder',function($http,pathService){
    return{
      getTotalOrder:function (currentPage,userId) {
        var url = pathService.getPath('getOrderRecord');
        var userId = "ea8e928a5954544401595467cf92002e";
        var data = {pageNumber:currentPage,userId:userId};
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  })
//上拉加载
  .factory('moreOrder',function($http,pathService){
    return{
      getMoreOrder:function (currentPage,userId,type) {
        var url = pathService.getPath('getOrderRecord');
        var userId = "ea8e928a5954544401595467cf92002e";
        var data = {pageNumber:currentPage,userId:userId,type:type};
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  })
  //搜索订单
  .factory('myOrderSearch',function($http,pathService){
    return{
      getSeacherOrder:function (userId,title,type) {
        var url = pathService.getPath('getOrderRecord');
        var userId = "ea8e928a5954544401595467cf92002e";
        var data = {userId:userId,title:title,type:type};
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  })
  .factory('isExposure',function($http,pathService){
    return{
    	isExposure:function (data) {
        var url = pathService.getPath('isExposure');
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  })
    .factory('validateException',function($http,pathService){
    return{
    	validateException:function (data) {
        var url = pathService.getPath('validateException');
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  });

