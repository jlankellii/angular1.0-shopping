angular.module('starter.registerControllers', [])
/**
 * <p>注册验证 </p>
 * <p>创建人: xuke</p>
 * <p>创建时间: 2016.12.17</p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 * $scope:作用域
 * checkRegister:service,检查账号验证码
 * $state：路由跳转
 */
  .controller('RegisterCtrl',function($scope,checkRegister,read,$state,$http,$interval,$ionicPopup,basicConfig,$timeout,dialogsManager,$stateParams,$ionicLoading) {
	//打开此页面距上一次获取验证码的时间 大于5分钟则清空倒计时
	if(new Date-basicConfig.getObject('Date')>=300000){
		basicConfig.removeObject('Time');
	}
	//手机号正则表达式
	var re = /^1[3|4|5|7|8|9]\d{9}$/;
	var _scope = $scope;
	//检测倒计时时间是否为空，不为空获取验证码按钮倒计时
	timeOut();
	//提交按钮开关
	_scope.confirm = false;
	//返回按钮
	_scope.rollback = function () {
		history.back();
  	};
	// var Puid = $stateParams.Puid;  2016.12.25 15:57 注 by yang yihao because:参数应为 pUId
    var pUId = $stateParams.pUId; // by yang yihao
    //注册下一步，跳转到设置密码
    _scope.user = {phoneNum: '', mobileCode: ''};
    //检测手机号是否正确输入
    _scope.checkPhone = function () {
      //验证输入框是否都输入
      if(_scope.user.phoneNum == "" || _scope.user.mobileCode == ""){
    	  dialogsManager.showMessage("请输入正确的信息");
    	  return false;
      }
      //验证短信验证码是否正确
      $ionicLoading.show();
      checkRegister.checkPhoneValidCode(_scope.user.phoneNum,_scope.user.mobileCode).success(
        function(result){
          if(result.flag!=200){
        	  dialogsManager.showMessage("短信验证码错误");
        	  $ionicLoading.hide();
          }else{
            $state.go('setPassword',{pUId:pUId});
            $ionicLoading.hide();
          }
        }
      );
    };
    //读取“积分吧”注册协议
    _scope.read = function(){
      var m =read.ReadMessage();
    };
    //timeOut();
    //点击图片更换验证码
    _scope.clickPicture=function(){
      _scope.src=checkRegister.getPictureValidCode()+'&mobile='+_scope.user.phoneNum+'&num='+Math.random();
      _scope.code='';
    };
    //获取图片验证码
    $scope.getCode = function () {
      basicConfig.setObject('Date',new Date-0);
      //获取验证码按钮无法点击
      _scope.timer = true;
      _params={
        mobile:_scope.user.phoneNum
      };
      //检测手机号是否为空
      if(_scope.user.phoneNum==""){
    	  _scope.timer = false;
    	  dialogsManager.showMessage("手机号不正确")
        return false;
      }
      //正则检测手机号
  	  if(!_scope.user.phoneNum||!re.test(_scope.user.phoneNum)){
  		  _scope.timer = false;
  		  dialogsManager.showMessage("请输入正确的手机号！");
  		return false;
  	  }
  	  $ionicLoading.show();
  	  //检测用户是否存在
      checkRegister.getUserPhoneNumMessage(_scope.user.phoneNum).success(
        function(result){
          if(result.flag==400){
        	  _scope.timer = false;
        	  $ionicLoading.hide();
        	  dialogsManager.showMessage("手机号已注册")
          }else{
            //获取图片验证码
            _scope.src = checkRegister.getPictureValidCode()+'&mobile='+_scope.user.phoneNum+'&num='+Math.random();
            var myPopup = $ionicPopup.alert({
              //弹窗标题rnd=Math.random()
              title: '请输入图片中的信息！',
              //弹窗元素 绑定输入框，图片绑定点击事件，点击时在次获取验证码
              //引入弹窗html
              templateUrl:'js/general/templates/popup.html',
              scope: _scope, // Scope (可选)。一个链接到弹窗内容的scope（作用域）。
              buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                text: '取消',
                type: 'button-light button-small',
                onTap: function(e) {
                  // 当点击时，e.preventDefault() 会阻止弹窗关闭。
                  //e.preventDefault();
                	_scope.timer = false;
                }
              },
                {
                text: '确定',
                type: 'button-small myTitle-bg',
                onTap: function(e) {
                  _scope.confirm = false;
                  $ionicLoading.show();
                  var _params={
                    mobile:_scope.user.phoneNum,
                    type:'0',
                    authcode:_scope.code
                  };
                  //获取手机验证码，关闭窗口，既不阻止关闭。获取验证码按钮倒计时。
                  checkRegister.sendCode(_params).success(
                    function(result){
                      //失败时提示消息
                      if(result.flag==400){
                        //图片验证码错误
                    	  $ionicLoading.hide();
                    	  dialogsManager.showMessage("验证码输入错误")
                      }else if(result.flag==200){
                    	//获取按钮倒计时
                        timeOut().get();
                        flg = false;
                        //关闭弹出窗口
                        myPopup.close();
                        //清空倒计时
    					basicConfig.removeObject('Time');
    					$ionicLoading.hide();
                      }else if(result.flag==500){
                        //出错啦
                    	$ionicLoading.hide();
                      }
                    }).error(function(){
                    	$ionicLoading.hide();
                    });
                  //阻止窗口关闭
                  e.preventDefault();
                }
              }]
            });
          }
          $ionicLoading.hide();
        });
    };
    _scope.user = {phoneNum: '', mobileCode: ''};
    //定时器
    function timeOut(){
      _scope.timer = false;
      timeout = 60000;
      _scope.timerCount = timeout / 1000;
      _scope.text = "获取验证码";
      //获取time如果有值说明之前的倒计时没有结束，开始计时
      if(basicConfig.getObject('Time')){
    	timeout = basicConfig.getObject('Time');
    	_scope.timerCount = timeout / 1000;
        _time_();
      }
      function _time_(){
        //basicConfig.setObject('Time',_scope.timerCount);
        _scope.showTimer = true;
        _scope.timer = true;
        _scope.text = "秒";
        var counter = $interval(function(){
          _scope.timerCount = _scope.timerCount - 1;
          basicConfig.setObject('Time',_scope.timerCount * 1000);
        }, 1000);
        $timeout(function(){
          _scope.text = "获取验证码";
          _scope.timer = false;
          $interval.cancel(counter);
          _scope.showTimer = false;
          //_scope.timerCount = _scope.timeout / 1000;
          basicConfig.removeObject('Time');
        }, timeout);
      }
      return{
        get:function(){
          _time_();
        }
      }
    }
  })
  //阅读“积分吧”注册协议
  .controller('DetailCtrl',function($scope,read,$state,$http) {
    var _scope = $scope;
    _scope.read = function () {
      var s = read.ReadMessage();
    };
  //返回上一级按钮
	_scope.rollback = function () {
		history.back();
  	}
  })
  .controller('lostPController',lostPController)
    /**
 * <p>描述:设置密码 </p>
 * <p>创建人: xuke</p>
 * <p>创建时间: 20161220</p>
*/
  .controller('setPassword',function($scope,UserInfoSupport,checkPassword,$state,$http,$ionicPopup,checkRegister,basicConfig,$ionicHistory,$ionicViewSwitcher,$stateParams,dialogsManager,$ionicLoading) {
	//注册的电话号码
	var phoneNum = checkRegister.get();
	var pUId = $stateParams.pUId; // by yang yihao
    //注册下一步，跳转到设置密码
	var _scope = $scope;
	//返回按钮
	_scope.rollback = function () {
		history.back();
  	};
    _scope.user = {password:'',newPassword:''};
    if(pUId == ''){
    	//分享的商品链接注册
        var shareUrlChain = basicConfig.getObject('shareUrlChain');
        var type = shareUrlChain.type;
        var goodsId =shareUrlChain.goodsId;
        var tagId = shareUrlChain.tagId;
        if(type==20 || type==10){
            //商品分享链接
        	_scope.checkPassword = function () {
        	//判断两次密码输入是否一致
            if(_scope.user.password != _scope.user.newPassword){
            	dialogsManager.showMessage("两次密码输入不一致！");
            	return false;
            }
        	var password = _scope.user.password;
        	//检测密码长度
    	    if(!password||password.length<6||password.length>15){
    	  		dialogsManager.showMessage("密码不合法！");
    	  		return false;
    	  	}
        	    var isApp = basicConfig.getObject('isApp');
        	    $ionicLoading.show();
                var promise = '';
        	      if(isApp){ //是App
                  //发送请求
                  promise = checkPassword.getPasswordMessage(phoneNum,password,'',goodsId,tagId);
                }else{
                  promise = checkPassword.getPasswordMessage(phoneNum,password,20,goodsId,tagId);
                }
        	      //成功回调
        	      promise.success(function(result){
        	        if(result.flag==200){
                    basicConfig.setObject('user', result.data);
                    UserInfoSupport.setUserEntity(result.data);
                    //跳转页面
                    // $ionicHistory.clearCache()
                    //   .then(function () {
                    var currentUrl = basicConfig.getObject('currentUrl');
                    var isApp = basicConfig.getObject('isApp');
                    if (isApp != null && !isApp) {
                      var url = currentUrl.url;
                      var params = currentUrl.params;
                      $state.go('toDown');
                      $ionicLoading.hide();
                      return;
                    }

                    if (currentUrl.params.goodsId) {
                      var url = currentUrl.url;
                      var params = currentUrl.params;
                      $state.go(url, params);
                      $ionicLoading.hide();
                      return;
                    }
                    if (currentUrl.url == ''
                      || currentUrl.url == 'tab.home'
                      || currentUrl.url == 'tab.signIn'
                      || currentUrl.url == 'tab.square'
                      || currentUrl.url == 'tab.share'
                      || currentUrl.url == 'register') {
                      $state.go('tab.member');
                      $ionicLoading.hide();
                      return;
                    }
                    var url = currentUrl.url;
                    $state.go(url);
                    $ionicLoading.hide();
                    dialogsManager.showMessage("注册成功");

                    // 2016.12.25  14:40  修改 By yang yihao  原因：不需要向服务器发送登录请求
                    // //发送请求  注册后返回当前页
        	          // var promise = checkPassword.getUserMessage(phoneNum,password);
        	          // //成功回调
        	          // promise.success(function (result) {
        	          //   //储存用户信息
        	          //   basicConfig.setObject('user',result.data);
        	          //   //跳转页面
        	          //   $ionicHistory.clearCache()
        	          //     .then(function () {
        	          //       var currentUrl = basicConfig.getObject('currentUrl');
        	          //       var url = currentUrl.url;
        	          //       $state.go(url,{goodsId:goodsId});
        	          //       $ionicViewSwitcher.nextDirection('back');
        	          //     })})

        	        }else{
        	        	 $ionicLoading.hide();
        	        	 dialogsManager.showMessage("网络故障,请稍后再试!");
        	          return false;
        	        }
        	      })
        	    };
//        }else if(type==25){   type 25获取有问题
        }else{
        	//常规注册，没有pUId，type值
            _scope.checkPassword = function () {
        		//判断两次密码输入是否一致
            	if(_scope.user.password != _scope.user.newPassword){
            	    dialogsManager.showMessage("两次密码输入不一致！");
            	    return false;
            	}
        		var password = _scope.user.password;
        		  //检测密码长度
        		if(!_scope.user.password||_scope.user.password.length<6||_scope.user.password.length>15){
        		  	dialogsManager.showMessage("密码不合法！");
        		  	return false;
        		}
        	      //发送请求
        		$ionicLoading.show();
        	    var promise = checkPassword.getPasswordMessage(phoneNum,password);
        	      //成功回调
                //2016.12.25 16：03  by yang yihao
                promise.success(function(result){
        	        if(result.flag==200) {
                    basicConfig.setObject('user', result.data);
                    UserInfoSupport.setUserEntity(result.data);
                    //跳转页面
                    // $ionicHistory.clearCache()
                    //   .then(function () {
                    var currentUrl = basicConfig.getObject('currentUrl');
                    var isApp = basicConfig.getObject('isApp');
                    if (isApp != null && !isApp) {
                      var url = currentUrl.url;
                      var params = currentUrl.params;
                      $state.go(url, params);
                      $ionicLoading.hide();
                      return;
                    }
                    if (currentUrl.params.goodsId) {
                      var url = currentUrl.url;
                      var params = currentUrl.params;
                      $state.go(url, params);
                      $ionicLoading.hide();
                      return;
                    }
                    if (currentUrl.url == ''
                      || currentUrl.url == 'tab.home'
                      || currentUrl.url == 'tab.signIn'
                      || currentUrl.url == 'tab.square'
                      || currentUrl.url == 'tab.share'
                      || currentUrl.url == 'register') {
                      $state.go('tab.member');
                      $ionicLoading.hide();
                      return;
                    }
                    var url = currentUrl.url;
                    $state.go(url);
                    //$ionicLoading.hide();
                    dialogsManager.showMessage("注册成功");

                    // 2016.12.25 15:40  注 by yangyihao   原因：注册成功后不需要再调用登录接口
                    // //发送请求  注册后返回当前页
        	          // var promise = checkPassword.getUserMessage(phoneNum,password);
        	          // //成功回调
        	          // promise.success(function (result) {
        	          //   //储存用户信息
        	          //   basicConfig.setObject('user',result.data);
        	          //   //跳转页面
        	          //   $ionicHistory.clearCache()
        	          //     .then(function () {
        	          //       $state.go('tab.home');
        	          //     })})

        	        }else{
        	        	//$ionicLoading.hide();
        	        	dialogsManager.showMessage("网络故障,请稍后再试!");
        	          return false;
        	        }
        	      })
        	    }
        }
    }
    else if(pUId!=null&&pUId!=''){
    	//app分享链接
    	//var Puid = $stateParams.Puid;
    	_scope.checkPassword = function () {
    	//判断两次密码输入是否一致
        if(_scope.user.password != _scope.user.newPassword){
        	dialogsManager.showMessage("两次密码输入不一致！");
        	return false;
        }
    	var password = _scope.user.password;
    	//检测密码长度
    	if(!_scope.user.password||_scope.user.password.length<6||_scope.user.password.length>15){
    	  	dialogsManager.showMessage("密码不合法！");
    	  	return false;
    	 }
  	      //发送请求
    	  $ionicLoading.show();
  	      var tagId = pUId;                              //phoneNum,password,type,goodsId,tagId
    	  var promise = checkPassword.getPasswordMessage(phoneNum,password,10,'',tagId);
  	      //成功回调
  	      promise.success(function(result){
  	        if(result.flag==200){
              basicConfig.setObject('user', result.data);
              UserInfoSupport.setUserEntity(result.data);
              $state.go('toDown');
              $ionicLoading.hide();
  	          dialogsManager.showMessage("注册成功,请下载App，开始积分吧");
              // 2016.12.25 15:40  注 by yangyihao   原因：注册成功后不需要再调用登录接口
              // //发送请求  注册后返回当前页
  	          // var promise = checkPassword.getUserMessage(phoneNum,password);
  	          // //成功回调
  	          // promise.success(function (result) {
  	          //   //储存用户信息
  	          //   basicConfig.setObject('user',result.data);
  	          //   //跳转页面
  	          //   $state.go('tab.home');
  	          //  })
  	        }else{
  	        	$ionicLoading.hide();
  	        	dialogsManager.showMessage("网络故障,请稍后再试!");
  	          return false;
  	        }
  	      })
  	    }
    }
    //var shareUrlChain = basicConfig.getObject("shareUrlChain");
    //var puid = shareUrlChain.puid;
  });
 /**
  *
  * <p>方法描述:找回密码 </p>
  * <p>创建人: wangjian</p>
  * <p>创建时间: 下午12:00:34</p>
  * <p>修改人: </p>
  * <p>修改时间: </p>
  * <p>修改备注: </p>
  * @param $scope
  * @param findPassword
  * @param $ionicPopup
  * @param basicConfig
  * @param $interval
  * @param $timeout
  * @param $state
  */
function lostPController($scope,findPassword,$ionicPopup,basicConfig,$interval,$timeout,$state,dialogsManager,$ionicLoading,pathService) {
	//$ionicLoading.show();
	//打开此页面距上一次获取验证码的时间 大于5分钟则清空倒计时
	if(new Date-basicConfig.getObject('date')>=300000){
		basicConfig.removeObject('time');
	}
	var re = /^1[3|4|5|7|8|9]\d{9}$/;
	var space = /\s/;
	//获取scope
	var _scope = $scope;
	//检测倒计时时间是否为空，不为空获取验证码按钮倒计时
	timeOut();
	//提交按钮开关
	_scope.confirm = false;
    //获取图片验证码
    $scope.getCode = function () {
    	basicConfig.setObject('date',new Date-0);
    	//获取验证码按钮无法点击
    	_scope.timer = true;
    	if(!_scope.phonenumber||!re.test(_scope.phonenumber)){
    		_scope.timer = false;
    		dialogsManager.showMessage("请输入正确的手机号！");
    		return;
    	}
    	//获取输入的手机号码
    	_params={
    			mobile:_scope.phonenumber
    	};
    	$ionicLoading.show();
    	//验证用户存在
    	findPassword.validateMobile(_params).success(
    			function(result){
    				$ionicLoading.hide();
    				if(result.flag!=400){
    					_scope.timer = false;
    					dialogsManager.showMessage("该手机未注册！");
    				}else{
    					//获取图片验证码
    					_scope.src = findPassword.getPictureValidCode()+'&mobile='+_scope.phonenumber+'&num='+Math.random();
    					var myPopup = $ionicPopup.alert({
    						  //弹窗标题
    						  title: '请输入图片中的信息！',
    						  //引入弹窗html
    						  templateUrl: 'js/general/templates/popup.html',
    						  scope: _scope, // Scope (可选)。一个链接到弹窗内容的scope（作用域）。
    						  buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
    						    text: '取消',
    						    type: 'button-light button-small',
    						    onTap: function(e) {
    						    	_scope.timer = false;
    						    }
    						  }, {
    						    text: '确定',
    						    type: 'button-small myTitle-bg',
    						    onTap: function(e) {
    						    	//提交按钮开关
    						    	_scope.confirm = false;
    						    	$ionicLoading.show();
    						    	var _params={
    						    			mobile:_scope.phonenumber,
    						    			//'1'代表已注册用户
    						    			type:'1',
    						    			authcode:_scope.code
    						    	};
    						    	//获取手机验证码。
    						    	findPassword.sendCode(_params).success(
    						    			function(result){
    						    				$ionicLoading.hide();
    						    				//失败时提示消息
    						    				if(result.flag==400){
    						    					//图片验证码错误
    						    					dialogsManager.showMessage(result.msg);
    						    				}else if(result.flag==200){
    						    					//获取按钮倒计时
    						    					timeOut().get();
    						    					//关闭弹出窗口
    						    					myPopup.close();
    						    					//清空倒计时
    						    					basicConfig.removeObject('time');
    						    				}else if(result.flag==500){
    						    					//出错啦
    						    				}
    						    			}).error(function(){
    						    				$ionicLoading.hide()
    						    			});
    						    		//阻止窗口关闭
    						    		e.preventDefault();
    						    }
    						  }]
    						});
    				}
    			}).error(function(){
    				$ionicLoading.hide();
    			});
    };
    //点击图片更换验证码
	_scope.clickPicture=function(){
		_scope.src=findPassword.getPictureValidCode()+'&mobile='+_scope.phonenumber+'&num='+Math.random();
		//清空验证码输入区
		_scope.code='';
	};
    //请求重新设置密码
    $scope.resetPassword = function(){
    	if(!_scope.phonenumber||!re.test(_scope.phonenumber)){
    		dialogsManager.showMessage("请检查手机号！");
    		return;
    	}
    	if(!_scope.validCode||!_scope.validCode==6){
    		dialogsManager.showMessage("请输入6位手机验证码！");
    		return;
    	}
    	if(space.test(_scope.newPS)||!_scope.newPS||_scope.newPS.length<6||_scope.newPS.length>15){
    		dialogsManager.showMessage("请输入6-15位不含空密码！");
    		return;
    	}
    	var _params = {
    			mobile:_scope.phonenumber,
    			vertificationCode:_scope.validCode,
    			password:_scope.newPS
    	};
    	_scope.confirm = true;
    	$ionicLoading.show();
    	findPassword.resetPassword(_params).success(
    			function(result){
    				$ionicLoading.hide();
    				_scope.confirm = false;
    				if(result.flag==200){
    					$state.go('toLogin');
    					dialogsManager.showMessage(result.msg);
    				}else{
    					dialogsManager.showMessage(result.msg);
    				}

    			}).error(function(){
    				$ionicLoading.hide();
    			});
		$timeout(function(){$ionicLoading.hide();},pathService.getTimeout());
    };
    //定时器
    function timeOut(){
    	_scope.timer = false;
    	timeout = 60000;
    	_scope.timerCount = timeout / 1000;
    	_scope.text = "获取验证码";
    	//获取time如果有值说明之前的倒计时没有结束，开始计时
    	if(basicConfig.getObject('time')){
    		timeout = basicConfig.getObject('time');
    		_scope.timerCount = timeout / 1000;
    		_time_();
    	}
    	function _time_(){
	        _scope.showTimer = true;
	        _scope.timer = true;
	        _scope.text = "";
	        var counter = $interval(function(){
	          	_scope.timerCount = _scope.timerCount - 1;
	          	basicConfig.setObject('time',_scope.timerCount * 1000);
	        }, 1000);
	        $timeout(function(){
	        	_scope.text = "获取验证码";
	        	_scope.timer = false;
	        	$interval.cancel(counter);
	        	_scope.showTimer = false;
	        	//_scope.timerCount = timeout / 1000;
	        	basicConfig.removeObject('time');
	        }, timeout);
      }
    	return{
    		get:function(){
    			_time_();
    		}
    	}
    }
  }
