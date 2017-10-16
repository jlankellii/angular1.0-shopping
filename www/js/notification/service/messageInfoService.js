angular.module('messageInfo.messageInfoSer',[])
.factory('messageSer',messageSer);

function messageSer(pathService,$q,$http){
	var params = {
			type:'',
			data:'',
			name:''
	};
	return {
		getMessageList:function(_params){
			var _deferred = $q.defer();
			$http.jsonp(pathService.getPath('messageList'),{params:_params}).success(function(result){
				_deferred.resolve(result);
			}).error(function(result){
				_deferred.reject(result);
			});
			return _deferred.promise;
		},
		updataStateToRead:function(_params){
			var _deferred = $q.defer();
			$http.jsonp(pathService.getPath('messageIsReady'),{params:_params}).success(function(result){
				_deferred.resolve(result);
			}).error(function(result){
				_deferred.reject(result);
			});
			return _deferred.promise;
		},
		deleltMessage:function(_params){
			var _deferred = $q.defer();
			$http.jsonp(pathService.getPath('messageDelete'),{params:_params}).success(function(result){
				_deferred.resolve(result);
			}).error(function(result){
				_deferred.reject(result);
			});
			return _deferred.promise;
		},
		setParams :function(_params){
			var _data = '';
			var _name = '';
			if(_params.commonKey){
				var list =_params.commonKey.split("|");
				if(list.length>0){
					_data = list[0];
					_name = list[1];
				}else{
					_data = list;
				}
			}
			params={
				type:_params.type,
				data:_data,
				name:_name
			}
		},
		getParams :function(){
			return params;
		},
		clearParams:function(){
			params={
				type:'',
				data:''
			}
		}
	}
}
