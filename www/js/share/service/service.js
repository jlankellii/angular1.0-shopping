angular.module('share.services', [])
.factory('shareService',shareService);
function shareService($http,pathService,$q){
	  return {
		  getShareList:function(_params){
			  var deferred = $q.defer();
			  $http.jsonp(pathService.getPath('getSharedGoodsList'),{params:_params}).
			  success(function(data, status, headers, config) {
				  deferred.resolve(data);
			  }).
			  error(function(data, status, headers, config) {
				  deferred.reject(data);
			  });
			  return deferred.promise;
		  },
		  getShareDetial:function(_params){
			  return $http.jsonp(pathService.getPath('getSharedGoodsDetails'),{params:_params})
		  }
	  }
}