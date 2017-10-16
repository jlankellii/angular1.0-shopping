/**
 * Created by user on 2016/12/25.
 */
angular.module('member.mySubordinateServices', [])

  .factory('MySubordinateAttention',function($http,pathService, NetSource){
    return {
      getUserInfoFormat: function (userId,page,state) {
        var url = pathService.getPath('getSubordinate');
        var data = {'userId':userId,'pageNumber':page,'type':state};
        var primise = $http.jsonp(url,{params:data});
        return primise;
      },

      getUserDescendant: function (userId, page, state, successCallback, errorCallback) {
        var args = {userId: userId, pageNumber: page};
        NetSource.getRequest('getDescendant', args, function (response) {
          if (200 == response.flag){

            successCallback(response);
          }else{
            errorCallback(response);
          }
        }, function (error) {
          errorCallback(error);
        });
      }
    }
  });
