angular.module('member.complainSer', [])
.factory('complainSer',complainSer);
function complainSer(NetSource){
	return{
		submitComplain:function (_params,file, successCallback, errorCallback){
      NetSource.fileUpload('addOrdersException',_params, file, function (response) {
        successCallback(response);
      }, function (error) {
        errorCallback(error);
      });
		}
	}
}
