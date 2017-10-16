/**
 * Created by yangyihao on 2016/12/19.
 */
angular.module('memeber.taskAttentionServices', [])
  .factory('TaskAttention',function ($http,basicConfig,pathService,$q) {
    return {
      //任务信息获取
      myTask:function (userId) {
        var userId = userId;
        var data = {'userId':userId};
        var url = pathService.getPath('currentTask');
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  });



