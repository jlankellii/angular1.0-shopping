angular.module('member.complainCtr', [])
.controller('complainCtr',complainCtr);
function complainCtr(complainSer,
                     $scope,
                     basicConfig,
                     dialogsManager,
                     CameraTool,
                     $stateParams,
                     $state,
                     $ionicActionSheet,
                     $ionicLoading,
                     $ionicHistory,
                     $timeout,
                     $ionicPopup,
                     $ionicHistory){
	//手机号码 正则
	var re = /^1[3|4|5|7|8|9]\d{9}$/;
	//空额正则
	var space = /\s/;
	var _scope = $scope;
	//本地获取用户数据
	var _user = basicConfig.getObject('user');
	//获取订单号码
	var _orderNum =$stateParams.orderNum;
	_scope.user = {
			userName:_user.alias,
			mobile:_user.mobile,
			userId:_user.userId,
			title:'',
			gender:_user.gender,
			ordersId:_orderNum
	};
	//上传图片
    $scope.selectPhoto = function () {
	      $ionicActionSheet.show({
	        buttons: [
	          {text: '<p>拍照</p>'},
	          {text: '<p>从相册中选择</p>'}
	        ],
	        cancelText: '<p>取消</p>',
	        cancel: function () {

	        },
	        buttonClicked: function (index) {
	          if (0 == index) {
	            CameraTool.getFromCamera(function (imageUrl) {
	            	_scope.user.file = imageUrl;
	            }, function (error) {
	              //get image filed
	            });
	          } else if (1 == index) {
	            CameraTool.getFromPhotolib(function (imageUrl) {
	            	_scope.user.file = imageUrl;
	            }, function (error) {
	              //get image filed
	            });
	          }
	          return true;
	        }
	      });
	    };
	//提交申诉
	_scope.submit = function(){
		//数据验证
		if(!re.test(_scope.user.mobile)){
			dialogsManager.showMessage("请输入正确的手机号！");
			return;
		}
		if(space.test(_user.alias)||_user.alias==null){
			dialogsManager.showMessage("用户名为空或含有空格！");
			return;
		}
		if(_scope.user.title==null||_scope.user.title==""){
			dialogsManager.showMessage("描述不能为空！");
			return
		}
		if(_scope.user.title.length>=255){
			dialogsManager.showMessage("描述长度不能超过255！");
			return;
		}
		if(_scope.user.file== null || _scope.user.file.length==0){
      dialogsManager.showMessage("请上传相关图片");
		  return;
    }
		var _params = _scope.user;
		//loading
		$ionicLoading.show();
		//请求
		complainSer.submitComplain(_params,_scope.user.file, function (result) {
			if(result.flag==200){
			    var myPopup = $ionicPopup.show({
			    	 template: '您的申诉已经提交，请等候工作人员与您联系！',
			         title: '提示',
			         scope: $scope,
			         buttons: [
			           {
			             text: '<b>关闭</b>',
			             type: 'button-small myTitle-bg',
			             onTap: function(e) {
			            	 $ionicHistory.goBack();
			             }
			           }
			         ]
			       });
			}else{
				dialogsManager.showMessage("网络故障,请稍后再试!");
			}
			$ionicLoading.hide();
		}, function (error) {
			$ionicLoading.hide();
			dialogsManager.showMessage("网络故障,请稍后再试!");
		});
		//5秒强制隐藏loading
		$timeout(function(){
			$ionicLoading.hide();
		},5000);
	}
}
