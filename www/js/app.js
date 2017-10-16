// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter',
  ['ionic',
    'starter.loginOutControllers',
    'starter.loginOutServices',
    'starter.shareControllers',
    'starter.shareServices',
    'starter.downControllers',
    'starter.downServices',
    'home.controllers',
    'home.services',
    'member.userCenter',
    'member.profileController',
    'memeber.taskAttentionServices',
    'member.profileServices',
    'member.profileModifyControllers',
    'member.myOrderController',
    'member.myOrderServices',
    'member.mySubordinateController',
    'member.mySubordinateServices',
    'starter.registerControllers',
    'starter.registerServices',
    'starter.directives',
    'starter.config',
    'ngCordova',
    'ngMessages',
    'ngNova',
    'ngAnimate',
    'numbersdirective',
    'goods.goodsDetailController',
    'goods.goodsDetailServices',
    'network.netSource',
    'base.persistencce',
    'utils.photo',
    'share.controllers',
    'share.services',
    'goods.shareDetailController',
    'member.futureAwardController',
    'member.awardServices',
    'member.allAwardController',
    'showOrder.showOrderSubmit',
    'showOrder.showOrderController',
    'showOrder.showOrderSquare',
    'showOrder.showOrderService',
    'goods.shareDetailController',
    'member.complainCtr',
    'member.complainSer',
    'member.userSubordinateController',
    'order.goodsDetailController',
    'member.mySearchOrderController',
    'messageInfo.messageInfoCtr',
    'messageInfo.messageInfoSer',
    'member.onlineConsultController',
    'member.onlineConsultServices',
    'home.advGoodsController',
    'home.scoreRankControllers',
    'home.scoreRankServices',
    'home.squareGoodsController',
    'home.goodsModuleController',
    'member.mySubordinateController2'
    ])

  .run(function ($ionicPlatform,dialogsManager,$rootScope,$location,$ionicPopup,$ionicHistory,$ionicViewSwitcher,$http,pathService,basicConfig,messageSer,$state,$cordovaBadge) {
	//通知红色按钮
	var inBackground = false;
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
        //监听app是否激活
        document.addEventListener("resume", function(){inBackground = false;}, false);//监听激活事件
        document.addEventListener("pause", function(){inBackground = true;}, false);
        //启动极光推送服务
		window.plugins.jPushPlugin.init();
		//调试模式
		window.plugins.jPushPlugin.setDebugMode(true);
		//判断平台
		if(window.plugins.jPushPlugin.isPlatformIOS()) {
		    // iOS
			if(basicConfig.getObject('user')){
				//设置标签别名(后台单独推送时将使用别名)
				var userId = basicConfig.getObject('user').userId;
				//JPushPlugin.prototype.setAlias(userId)
				window.plugins.jPushPlugin.setTagsWithAlias([], userId);
			}
		} else {
		    // Android
			if(basicConfig.getObject('user')){
				var userId = basicConfig.getObject('user').userId;
				//设置标签别名
				window.plugins.jPushPlugin.setTagsWithAlias([], userId);
			}
		}
		//监听设置别名状态
		document.addEventListener("jpush.setTagsWithAlias", function(event){
		    var result = "result code:"+event.resultCode + " ";
		    result += "tags:" + event.tags + " ";
		    result += "alias:" + event.alias + " ";
		}, false);
        //监听打开推送消息事件
        document.addEventListener("jpush.openNotification", function(event){
        	messageSer.setParams(event.extras);//设置推送内存
        	//标记该消息已读(商品，类目)extras
        	var _params ={
        			id:event.extras.id
        	}
        	messageSer.updataStateToRead(_params);//更新改消息为已读
        	//路由跳转
        	$state.go('tab.home');
        }, false);
        document.addEventListener("resume", onResume, false);//监听唤醒app事件(此处是修改：当app处于首页进入后台时点击手机推送，不按照业务自动跳转bug)
        function onResume() {
            setTimeout(function() {
              $cordovaBadge.clear();
              var type = messageSer.getParams().type;//获取推送类型（1：商品详情,2：类目,3:其他）
              var data = messageSer.getParams().data;//获取推送data（商品时为商品id，类目时为类目id，其他时为空）
              var name = messageSer.getParams().name;//获取推送data（类目名称）
                  if(type!=''){//从内存中获取推送，推送不为空
                    if($state.current.name=="tab.home"){//当前页面是home页(不是home不做处理)
                        if(type==300){//推送商品
                          messageSer.clearParams();//清除service中的推送消息
                          $state.go('tab.goodsDetail',{goodsId:data});//跳转至推送的商品详情
                        }else if(type==301){//推送类目
                          messageSer.clearParams();//清除service中的推送消息
                          $state.go('tab.kindGoods',{categoryId:data,categoryName:name});
                        }else{//推送其他
                          messageSer.clearParams();//清除service中的推送消息
                          $state.go('tab.messageList');//跳转到消息列表
                        }
                    }
                  }
            }, 0);
        }
        //监听app激活状态收到通知
        document.addEventListener("jpush.receiveNotification", function(event){
        	//消息通知红点
        	$rootScope.redButtonSwich = true;
        	//激活状态清除推送
        	if(!inBackground){
        		window.plugins.jPushPlugin.clearNotificationById(event.extras['cn.jpush.android.NOTIFICATION_ID'])
        		dialogsManager.showMessage("您有新消息，及时查看！");
        	}
        }, false);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      // var device = $cordovaDevice.getDevice();
      // var cordova = $cordovaDevice.getCordova();
      // var model = $cordovaDevice.getModel();
      // var platform = $cordovaDevice.getPlatform();
      // var uuid = $cordovaDevice.getUUID();
      // var version = $cordovaDevice.getVersion();

      document.addEventListener("offline", onOffline, false);

      function onOffline() {
        // Handle the offline event
        dialogsManager.showMessage("请检查网络");
      }

    });
    $ionicPlatform.registerBackButtonAction(function(event){
      event.preventDefault();
      $rootScope.popup = {
        isPopup: false,
        index: 0
      };
      function showConfirm(){
        if($rootScope.isAndroidBack){
          $rootScope.isAndroidBack = false;
          return;
        }
        var confirmPopup= $ionicPopup.confirm({
          title:"<strong>退出应用？</strong>",
          template:"你确定要退出应用吗？",
          cancelText: '再逛逛',
          cancelType: 'button-small myTitle-bg',
          okText: '确定',
          okType: 'button-light button-small'
        });
        $rootScope.popup.isPopup=true;
        confirmPopup.then(function(res){
          if(res){
            ionic.Platform.exitApp();
          }
        })
      }
      if($location.path() =="/tab/home"){
        if(!$rootScope.popup.isPopup){
          showConfirm();
        }
      }else if($ionicHistory.backView()){
        $ionicHistory.goBack();
        $ionicViewSwitcher.nextDirection("back");
      }else{
        showConfirm();
      }
      return false;
    },101);
  })

 .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {
	 //配置soket
	/* var _socket = io(path);
		_socket.emit('set_room',params);
		_socket.on('get_normal_message',function(result){
		});	*/
	//$httpProvider.defaults.headers.get={'Content-Type':'application/json; charset=utf-8'};
   //隐藏back返回文字
   $ionicConfigProvider.backButton.text("");
   $ionicConfigProvider.backButton.previousTitleText(false);
   //使导航居下
   $ionicConfigProvider.platform.ios.tabs.style('standard');
   $ionicConfigProvider.platform.ios.tabs.position('bottom');
   $ionicConfigProvider.platform.android.tabs.style('standard');
   $ionicConfigProvider.platform.android.tabs.position('standard');
   $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
   $ionicConfigProvider.platform.android.navBar.alignTitle('left');
   $ionicConfigProvider.platform.ios.views.transition('ios');
   $ionicConfigProvider.platform.android.views.transition('android');
   //标题居中
   $ionicConfigProvider.navBar.alignTitle('center');
   //禁用Ios侧滑后退功能
   $ionicConfigProvider.views.swipeBackEnabled(false);
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'js/tabs.html'
      })
      // Each tab has its own nav history stack:
      //home
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl:'js/home/templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      //我的下线
      .state('tab.mySubordinate',{
        url:'/mySubordinate',
        views:{
          'tab-share':{
            templateUrl:'js/mysubordinate/templates/mySubordinate.html',
            controller:'MySubordinateCtl2'
          }
        }
      })
      //其他用户的下线
      .state('tab.mySubordinate3',{
        url: '/mySubordinate/userSubordinate/:userId/:alias',
        views:{
          'tab-share': {
            templateUrl: 'js/mysubordinate/templates/userSubordinate.html',
            controller: 'userSubordinateCtrl'
          }
        }
      })
       .state('tab.share', {
        url: '/share',
        views: {
          'tab-share': {
            templateUrl:'js/share/templates/shareList.html',
            controller: 'shareCtrl'
          }
        }
      })
      .state('tab.kindGoods', {
    	  url: '/home/kindGoods/:categoryId/:categoryName',
    	  views: {
    		  'tab-home': {
    			  templateUrl:'js/home/templates/kindGoodsList.html',
    			  controller: 'kindGoodsCtrl'
    		  }
    	  }
      })
      .state('tab.memberKindGoods', {
    	  url: '/member/kindGoods/:categoryId/:categoryName',
    	  views: {
    		  'tab-member': {
    			  templateUrl:'js/home/templates/kindGoodsList.html',
    			  controller: 'kindGoodsCtrl'
    		  }
    	  }
      })
       .state('tab.goodsDetail3',{
        url:'/share/goodsDetail/:goodsId',
        cache:false,
        views:{
          'tab-share':{
            templateUrl:'js/share/templates/goodsDetail.html',
            controller:'shareGoodsDetailCtrl'
          }
        }
      })
      .state('tab.home-goodlist', {
    	  url: '/home/good-list',
    	  views: {
    		  'tab-home': {
    			  templateUrl:'js/home/templates/goodList.html',
    			  controller: 'searchGoodCtrl'
    		  }
    	  }
      })

      //商品模块列表页面
      .state('tab.goodsModule',{
        url:'/home/:goodsModuleId/:goodsModuleTitle',
        views:{
          'tab-home':{
            templateUrl:'js/home/templates/goodsModule.html',
            controller:'GoodsModuleCtrl'
          }
        }
      })
      .state('tab.advGoodsList', {
        url:'/home/advGoodsList/:advGoodsId/:advImgUrl/:advTitle',
        views: {
          'tab-home': {
            templateUrl:'js/home/templates/advGoodsList.html',
            controller:'advGoodsCtrl'
          }
        }
      })
      .state('tab.squareGoodsList', {
        url:'/home/squareGoodsList/:squareGoodsId/:squareTitle',
        views: {
          'tab-home': {
            templateUrl:'js/home/templates/squareGoodsList.html',
            controller:'squareGoodsCtrl'
          }
        }
      })
      .state('tab.goodsDetail2',{
        url:'/goodsDetail/:goodsId/:tagId',
        views:{
          'tab-home':{
            templateUrl:'js/goods/templates/goodsDetail.html',
            controller:'GoodsDetailCtrl'
          }
        }
      })

      .state('tab.goodsDetail',{
        url:'/goodsDetail/:goodsId',
        views:{
          'tab-home':{
            templateUrl:'js/goods/templates/goodsDetail.html',
            controller:'GoodsDetailCtrl'
          }
        }
      })

       .state('tab.signIn',{
        url:'/signIn',
        views:{
          'tab-signIn':{
            templateUrl:'js/home/templates/signIn.html'
          }
        }
      })

      .state('tab.score',{
        url:'/score',
        views:{
          'tab-score':{
            templateUrl:'js/task/templates/example.html'
          }
        }
      })

      .state('tab.square', {
        url: '/square',
        views: {
          'tab-square': {
            templateUrl: 'js/task/templates/example.html'
          }
        }
      })

      //会员中心
      .state('tab.member', {
        url: '/member',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/user-center.html',
            controller: 'UserCenterCtrl'
          }
        }
      })
      //积分兑换
      .state('tab.exchangeIntegral', {
    	  url: '/member/exchangeIntegral',
    	  views: {
    		  'tab-member': {
    			  templateUrl: 'js/member/templates/exchangeIntegral.html',
    			  controller: 'exchangIntegralCtr'
    		  }
    	  }
      })
      //会员资料
      .state('tab.profile', {
        url: '/member/profile',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/profile.html',
            controller: 'ProfileCtrl'
          }
        }
      })
      //会员资料-修改用户名
      .state('tab.nameModify', {
        url: '/member/profile/nameModify',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/username-modify.html',
            controller: 'NameModifyCtrl'
          }
        }
      })
      //会员资料-修改邮箱
      .state('tab.emailModify', {
        url: '/member/profile/emailModify',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/email-modify.html',
            controller: 'EmailModifyCtrl'
          }
        }
      })
      //会员资料-修改真实姓名
      .state('tab.realNameModify', {
        url: '/member/profile/realNameModify',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/user-realname-modify.html',
            controller: 'UserRealNameModifyCtrl'
          }
        }
      })
      //会员资料-修改性别
      .state('tab.genderModify', {
        url: '/member/profile/genderModify',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/gender-modify.html',
            controller: 'GenderModifyCtrl'
          }
        }
      })
      //会员资料-修改生日
      .state('tab.birthdayModify', {
        url: '/member/profile/birthdayModify',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/birthday-modify.html',
            controller: 'BirthdayModifyCtrl'
          }
        }
      })
      //会员资料-修改地址
      .state('tab.addressModify', {
        url: '/member/profile/addressModify',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/address-modify.html',
            controller: 'AddressModifyCtrl'
          }
        }
      })
      //会员资料-支付宝账号
      .state('tab.alipayNumberModify', {
        url: '/member/profile/alipayNumberModify',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/alipayNumberModify.html',
            controller: 'AlipayNumberModifyCtrl'
          }
        }
      })
      //会员资料-支付宝名称
      .state('tab.alipayNameModify', {
        url: '/member/profile/alipayNameModify',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/alipayNameModify.html',
            controller: 'AlipayNameModifyCtrl'
          }
        }
      })
      //会员资料-修改密码
      .state('tab.passwordModify', {
        url: '/member/profile/passwordModify',
        views: {
          'tab-member': {
            templateUrl: 'js/member/templates/password-modify.html',
            controller: 'PasswordModifyCtrl'
          }
        }
      })

      //即将可用积分
      .state('tab.futureAward',{
        url:'/member/futureAward',
        cache:false,
        views:{
          'tab-member':{
            templateUrl: 'js/member/templates/futureAward.html',
            controller: 'FutureAward'
          }
        }
      })

      //累计积分
      .state('tab.allAward',{
        url:'/member/allAward',
        cache:false,
        views:{
          'tab-member':{
            templateUrl: 'js/member/templates/allAward.html',
            controller: 'AllAward'
          }
        }
      })


      //我的订单
      .state('tab.myOrder',{
        url:'/member/myOrder/:entryType',
        views:{
          'tab-member':{
            templateUrl:'js/member/templates/myOrder.html',
            controller:'myOrderCtrl'
          }
        }
      })
      .state('tab.myOrderComplain',{
        url:'/complain/:orderNum',
        views:{
        	'tab-member':{
        		templateUrl:'js/member/templates/complain.html',
        		controller:'complainCtr'
        	}
        }
      })
      //搜索我的订单列表
      .state('tab.myOrderList',{
        url:'/member/myOrderList',
        views:{
          'tab-member':{
            templateUrl:'js/member/templates/searchOrderList.html',
            controller:'mySearchOrderCtrl'
          }
        }
      })
      //晒单广场
      .state('tab.showOrderSquare', {
        url: '/showOrderSquare',
        views: {
          'tab-showOrderSquare': {
            templateUrl: 'js/showOrder/templates/showOrderSquare.html',
            controller: 'ShowOrderSquareCtrl'
          }
        }
      })
      .state('tab.showOrderSquare_goodsDetail',{
        url:'/showOrderSquare/goodsDetail/:goodsId',
        views:{
          'tab-showOrderSquare':{
            templateUrl:'js/goods/templates/goodsDetail.html',
            controller:'GoodsDetailCtrl'
          }
        }
      })
      //我的晒单
      .state('tab.myShowOrder', {
        url: '/member/myShowOrder',
        views: {
          'tab-member': {
            templateUrl: 'js/showOrder/templates/myShowOrder.html',
            controller: 'MyShowOrderCtrl'
          }
        }
      })
       .state('tab.myShowOrder_goodsDetail',{
        url:'/member/goodsDetail/:goodsId',
        views:{
          'tab-member':{
            templateUrl:'js/goods/templates/goodsDetail.html',
            controller:'GoodsDetailCtrl'
          }
        }
      })
      //消息通知
      .state('tab.messageList',{
    	  url:'/home/messageList',
    	  views:{
    		'tab-home':{
    			templateUrl: 'js/notification/templates/messageList.html',
    			controller: 'messageListCtr'
    		}
    	  }
      })
      .state('tab.memberMessageList',{
    	  url:'/memeber/messageList',
    	  views:{
    		  'tab-member':{
    			  templateUrl: 'js/notification/templates/messageList.html',
    			  controller: 'messageListCtr'
    		  }
    	  }
      })
      .state('tab.messageGoodsDetil',{
    	  url:'/messageGoodsDetil/:goodsId',
    	  views:{
    		  'tab-member':{
    			  templateUrl:'js/goods/templates/goodsDetail.html',
    	          controller:'GoodsDetailCtrl'
    		  }
    	  }

      })
      //发布晒单
      .state('tab.showOrderSubmit', {
        url: '/member/showOrderSubmit/:orderNum/:goodsId',
        views: {
          'tab-member': {
            templateUrl: 'js/showOrder/templates/showOrderSubmit.html',
            controller: 'ShowOrderSubmitCtrl'
          }
        }
      })

      //我的下线
      .state('tab.mySubordinate2',{
        url:'/member/mySubordinate',
        views:{
          'tab-member':{
            templateUrl:'js/member/templates/mySubordinate.html',
            controller:'MySubordinateCtl'
          }
        }
      })
      //其他用户的下线
      .state('tab.userSubordinate',{
        url: '/member/mySubordinate/userSubordinate/:userId/:alias',
        views:{
          'tab-member': {
            templateUrl: 'js/member/templates/userSubordinate.html',
            controller: 'userSubordinateCtrl'
          }
        }
      })
      .state('toShare',{
        url:'/toShare',
        templateUrl:'js/general/templates/shareApp.html',
        controller:'ToShare'
      })

      //下载APP
      .state('toDown',{
        url:'/toDown',
        templateUrl:'js/general/templates/downApp.html',
        controller:'ToDown'
      })


      //登录 yangyihao
      .state('toLogin', {
    	url: '/toLogin/:goodsId/:tagId/:type',
        templateUrl: 'js/general/templates/login.html',
        controller: 'ToLogin'
      })
      //找回密码
      .state('lostPassword', {
    	  url: '/toLogin/lostPassword',
    	  templateUrl: 'js/general/templates/lostPassword.html',
    	  controller:'lostPController',
    	  cache:false
      })
      //注册
      .state('register', {
        url: '/general/register/:pUId',
        templateUrl: 'js/general/templates/register.html',
        controller: 'RegisterCtrl'
      })
      //阅读逛逛街注册协议
      .state('detail', {
        url: '/general/detail',
        templateUrl: 'js/general/templates/detail.html',
        controller: 'DetailCtrl'
      })
      //设置初始密码
      .state('setPassword', {
        url: '/general/setPassword/:tagId/:goodsId/:type/:pUId',
        templateUrl: 'js/general/templates/setPassword.html',
        controller: 'setPassword'
      })

    .state('tab.temporary', {
      url: '/temporary',
      views: {
        'tab-member': {
          templateUrl: 'js/member/templates/user-center.html',
          controller: 'UserCenterCtrl'
        }
      }
    })

      //平台介绍页面
      .state('tab.platform',{
        url:'/platform',
        views:{
          'tab-home':{
            templateUrl:'js/home/templates/platformInfo.html',
            controller:'PlatformGoLogin'
          }
        }
      })
      // .state('tab.goodsDetail', {
      //   url: '/goodsDetail',
      //   views: {
      //     'tab-home': {
      //       templateUrl: 'js/goods/templates/goodsDetail.html',
      //       controller: 'GoodsDetailCtrl'
      //     }
      //   }
      // })
      //我的订单搜索页面
      .state('myOrderSearch',{
        url:'/myOrderSeacher',
        views:{
          'tab-member':{
            templateUrl: 'js/member/templates/myOrderSearch.html',
            controller: 'myOrderSearch'
          }
        }

      })
      //我的订单商品详情
      .state('tab.myOrderGoodsDetail',{
        url:'/member/myOrder/goodsDetail/:goodsId',
        views:{
          'tab-member':{
            templateUrl:'js/member/templates/orderGoodsDetail.html',
            controller:'myOrderGoodsCtrl'
          }
        }
      })

   //在线咨询
      .state('tab.onlineService',{
        url:'/member/onlineService',
        cache:false,
        views:{
          'tab-member':{
            templateUrl:'js/member/templates/onlineConsult.html',
              controller:'onlineConsultController'
          }
        }
      })

   //积分排行
      .state('tab.scoreRank',{
        url:'/scoreRank',
        views:{
          'tab-scoreRank':{
            templateUrl:'js/home/templates/scoreRank.html',
            controller:'scoreRankController'
          }
        }
      })



    $urlRouterProvider.otherwise('/tab/home');
  })

//隐藏指令
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        scope.$on('$ionicView.beforeEnter', function() {
          scope.$watch(attributes.hideTabs, function(value){
            $rootScope.hideTabs = value;
          });
        });
        scope.$on('$ionicView.beforeLeave', function() {
          $rootScope.hideTabs = false;
        });
      }
    };
  })
  .constant('$ionicLoadingConfig', {
    template: "<ion-spinner icon='android'></ion-spinner>",
    duration: 15000,
    noBackdrop:true
  });
