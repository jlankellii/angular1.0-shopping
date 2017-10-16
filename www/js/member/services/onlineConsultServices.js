angular.module('member.onlineConsultServices',[])
.factory('onlineConsultServices',function($http,pathService){
  return{
    queryConsult:function(userId,pageSize,pageNum){
      var url = pathService.getPath('queryOnlineConsult');
      var data = {'userId':userId,'pageSize':pageSize,'pageNumber':pageNum};
      var primise = $http.jsonp(url,{params:data});
      return primise;
    },

    addConsult:function (userId,userName,userAvatar,content) {
      var url = pathService.getPath('addConsult');
      var data = {'userId':userId,'userName':userName,'userAvatar':userAvatar,'content':content};
      var primise = $http.jsonp(url,{params:data});
      return primise;
    },

    concatInfo:function () {
      var url = pathService.getPath('concatInfo');
      var primise = $http.jsonp(url);
      return primise;
    }
  }

});
