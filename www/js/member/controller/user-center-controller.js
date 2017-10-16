/**
 * Created by user on 2016/12/16.
 */

/**
 * <p>类描述: 个人中心模块</p>
 * <p>创建人:  liuyang</p>
 * <p>创建时间: 2016/12/16</p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 */
angular.module('member.userCenter', [])

  .controller('exchangIntegralCtr',exchangIntegralCtr)
  .controller('UserCenterCtrl', function ($scope,
                                          $state,
                                          $ionicHistory,
                                          TaskAttention,
                                          basicConfig,
                                          UserInfoSupport,
                                          UserInfoService,
                                          firstOrder,
                                          dialogsManager,
                                          $ionicModal,
                                          $rootScope,
                                          exchangIntegralSer) {
    $scope.$on('$ionicView.enter', function () {
      $ionicHistory.clearHistory();
      $scope.userInfo = UserInfoSupport.getUserEntity();
      queryUserInfo();
      queryTaskList();
    });
    $scope.goExchange =function(){
    	$scope.userinfo = UserInfoSupport.getUserEntity();
		var _params={
			userId : $scope.userinfo.userId
		};
		exchangIntegralSer.validateConvert(_params).then(function(result){
			if(result.flag!=200){
				dialogsManager.showMessage("请先绑定支付宝！");
				$state.go('tab.alipayNameModify');
			}else{
				$state.go('tab.exchangeIntegral');
			}
		},function(error){
			dialogsManager.showMessage("链接超时，请稍后重试！");
			$ionicHistory.goBack();
		});
    };
    //跳转站内通知
    $scope.goMessage = function(){
    	$state.go('tab.memberMessageList');
    };

    var userId = UserInfoSupport.getUserEntity().userId;
    $scope.userInfo = UserInfoSupport.getUserEntity();

    $scope.seeUserProfile = function () {
      $state.go('tab.profile');
    };

    $scope.seeUserOrder=function (entryType) {
      $state.go('tab.myOrder', {'entryType':entryType});
    };
    $scope.seeMySubordinate=function(){
      $state.go('tab.mySubordinate');
    };

    $scope.seeMyShowOrder = function () {
      $state.go('tab.myShowOrder');
    };

    //手动绑定首单
    $scope.boundOrder = function(){
      var orderNum = $scope.orderNum;
      var myreg = /^\d{16}$/;
      if(myreg.test(orderNum)){
        //绑定订单号
        firstOrder.firstOrder(userId, orderNum).success(function (data) {
          if (data.flag == 200) {
            //调整为频幕下方弹框 by 杨义豪
            dialogsManager.showMessage('提交成功');
          } else if (data.flag == 500) {
            dialogsManager.showMessage('网络故障,请稍后再试!');
          }
        }).error(function () {
            dialogsManager.showMessage('网络故障,请稍后再试');
          });
      }else{
        dialogsManager.showMessage('请输入正确的16位订单号');
      }
    };

    //query user information from server and save, then update UI.
    function queryUserInfo() {
      UserInfoService.queryUserInfo(userId, function (result) {
        var userEntity = UserInfoSupport.getUserEntity();
        $scope.userInfo = {
          userId : userEntity.userId,
          avatar : userEntity.avatar,
          alias : userEntity.alias,
          score : userEntity.score,
          allScore: userEntity.allScore,
          sealScore: userEntity.sealScore,
          money: userEntity.money
        };
      }, function (error) {

      });
    }
    //即将可用积分
    $scope.future = function () {
      $state.go('tab.futureAward');
    };
    //累计积分
    $scope.allAward = function () {
      $state.go('tab.allAward');
    };

    /**
     * <p>描述: 获取任务详情</p>
     * <p>创建人: yangyihao</p>
     * <p>创建时间: </p>
     * <p>修改人: YangLiu</p>
     * <p>修改时间: 1/9/17</p>
     * <p>修改备注: 修改任务图标展示样式</p>
     */
    var queryTaskList = function () {
      var taskPromise = TaskAttention.myTask(userId);
      var myTask ='';
      //成功函调
      taskPromise.success(function (result) {
        if(result.flag==500){
          return false;
        }
        myTask = result.data;
        var doneTask = [];
        var unfinished = [];
        for(var i=0;i<myTask.length;i++){
          if(myTask[i].isOver==0){
            var item = {taskName:myTask[i].rule.taskName,img:'img/task.png',taskScore:myTask[i].rule.score,done:true};
            unfinished.push(item);
          }else {
            var item = {taskName:myTask[i].rule.taskName,img:'img/task_done.png',taskScore:myTask[i].rule.score,done:false};
            doneTask.push(item);
          }
        }
        for(var j=0;j<doneTask.length;j++){
          unfinished.push(doneTask[j]);
        }
        $scope.task = unfinished;
      })
      //失败函调
        .error(function (error) {

        });
      };

      //弹出绑定首单引导
    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    //自动弹出首单绑定引导框
    UserInfoSupport.orderGuide(userId).success(function(data){
      if(data.flag==200){
        if(data.data == 'true'){
          $scope.modal.show();
          dialogsManager.showMessage('您最近的订单有异常,请手动输入绑定');
        }
      }else {
        dialogsManager.showMessage('网络故障,请稍后再试');
      }

    });

    //跳到在线咨询页面
    $scope.goOnlineConsult = function(){
      $state.go('tab.onlineService');
    };

    //输入订单号时隐藏tabs
    $scope.hideTabs = function(){
      $rootScope.hideTabs = true;
    };
    //不输入订单号时显示tabs
    $scope.showTabs = function(){
      $rootScope.hideTabs = false;
    }


  });

function exchangIntegralCtr($scope,
							basicConfig,
							findPassword,
							$ionicPopup,
							$timeout,
							$interval,
							exchangIntegralSer,
							UserInfoSupport,
							dialogsManager,
							$state,
							$ionicHistory,
							$ionicLoading){
	var _scope = $scope;
	var _userId ='';
	var phonenumber = '';
	$scope.$on('$ionicView.enter', function () {//监听视图进去
		$scope.userinfo = UserInfoSupport.getUserEntity();//获取用户信息
		var _params={
				userId : $scope.userinfo.userId
		};
		phonenumber = $scope.userinfo.mobile;//获取用户手机号
		_userId = $scope.userinfo.userId;//获取用户id
		exchangIntegralSer.getBasicData(_params).then(function(result){//获取兑换积分基础数据
			_scope.userScore = result.data.userScore;//用户积分
			_scope.procedureFee = result.data.procedureFee;//手续费
			_scope.convertScore = result.data.convertScore;//兑换规则积分
			_scope.convertMoney = result.data.convertMoney;//兑换规则钱
			_scope.minMoney = result.data.minMoney;//一次最少兑换
			_scope.maxMoney = result.data.maxMoney;//一天最大多换
		},function(error){
			dialogsManager.showMessage("网络故障，请稍后重试！");
		});
		_scope.params.number='';//初始化兑换钱数
	});
	//打开此页面距上一次获取验证码的时间 大于5分钟则清空倒计时
	if(new Date-basicConfig.getObject('date')>=300000){
		basicConfig.removeObject('time');
	}
	//检测倒计时时间是否为空，不为空获取验证码按钮倒计时
	timeOut();
	//提交按钮开关
	_scope.confirm = false;
    //获取图片验证码
    $scope.getCode = function () {
    	basicConfig.setObject('date',new Date-0);
    	//获取验证码按钮无法点击
    	_scope.timer = true;
    	//获取图片验证码
		_scope.src = findPassword.getPictureValidCode()+'&mobile='+phonenumber+'&num='+Math.random();
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
			    			mobile:phonenumber,
			    			//'1'代表已注册用户
			    			type:'1',
			    			authcode:_scope.code//图片验证码
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
    };
    //点击图片更换验证码
	_scope.clickPicture=function(){
		_scope.src=findPassword.getPictureValidCode()+'&mobile='+phonenumber+'&num='+Math.random();
		//清空验证码输入区
		_scope.code='';
	};
	_scope.params={
			number:'',
			validCode:''
	};
	//兑换积分
	_scope.exchangeIntegral=function(){
		if(!_scope.params.validCode||!_scope.params.validCode==6){
    		dialogsManager.showMessage("请输入6位手机验证码！");
    		return;
    	}
		if(_scope.userScore-_scope.params.number/convertMoney*_scope.convertScore<0){
			dialogsManager.showMessage("积分不足！");
			return;
		}
		//提交兑换
		_scope.confirm = true;
		var _params={
				userId:_userId,
				score:_scope.params.number,//要兑换的积分
				type:1//1代表支付宝转账 2代表集分宝 3代表微信转账
		};
		//请求兑换积分
		exchangIntegralSer.exchangeIntegral(_params).then(function(result){
			if(result.data.flag==200){
				dialogsManager.showMessage("兑换申请已提交，请耐心等待！");
				$ionicHistory.goBack();
			}else{
				dialogsManager.showMessage("网络故障，请稍后重试！");
			}
		},function(error){
			dialogsManager.showMessage("网络故障，请稍后重试！");
		});
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
