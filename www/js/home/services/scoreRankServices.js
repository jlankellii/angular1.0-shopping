angular.module('home.scoreRankServices',[])
  .factory('scoreRank',function($http,pathService){
    return{
      queryRank:function(userId,pageNum,type){
        var pageSize = 10;
        var url = pathService.getPath('scoreRank');
        var data = {'userId':userId,'pageSize':pageSize,'pageNumber':pageNum,'type':type};
        var primise = $http.jsonp(url,{params:data});
        return primise;
      },
      querySelfRank:function (userId,type) {
        var url = pathService.getPath('selfRank');
        var data = {'userId':userId,'type':type};
        var primise = $http.jsonp(url,{params:data});
        return primise;
      }
    }
  })
