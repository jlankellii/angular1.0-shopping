/**
 * Created by rensiyu on 2016/12/31.
 */
angular.module('member.awardServices', [])

  .factory('Future',function($http,basicConfig,pathService){
    return{
      getAward:function (currentPage) {
        var url = pathService.getPath('getFutureScore');
        var count = 10;
        var userId =basicConfig.getObject('user').userId;
        var data = {pageNumber:currentPage,pageSize:count,userId:userId};
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  })
  //全部积分
  .factory('AllAward',function($http,basicConfig,pathService,NetSource){
    return{
      //获得积分查询
      getAward: function (currentPage, successCallback, errorCallback) {
        var count = 10;
        var userId = basicConfig.getObject('user').userId;
        var args = {pageNumber:currentPage,pageSize:count,userId:userId};
        NetSource.getRequest('getAllAward', args, function (response) {
          if (200 == response.flag) {
            successCallback(response);
          }else{
            errorCallback(response);
          }
        }, function (error) {
          errorCallback(error);
        });
      },
      //扣除积分查询
      getDeductAward:function (currentPage) {
        var url = pathService.getPath('getAllAward');//假地址 此接口还未做
        var count = 10;
        var userId =basicConfig.getObject('user').userId;
        var data = {pageNumber:currentPage,pageSize:count,userId:userId};
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  });
