angular.module('starter.loginOutControllers', [])
/**
 * <p>登录验证 </p>
 * <p>创建人: yihao yang</p>
 * <p>创建时间: 2016.12.13</p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 * $scope:作用域
 * CheckLogin:service,检查账号密码，获得后台返回用户信息
 * $state：路由跳转
 */
  .controller('ToLogin',function  ($ionicLoading,$scope,UserInfoSupport,CheckLogin,$state,$http, $ionicPopup,$ionicViewSwitcher,$ionicHistory,basicConfig,dialogsManager,$stateParams) {
    var _scope = $scope;
    _scope.user = {phoneNum:'',password:''};
    _scope.phoneHidden = false;
    _scope.pwdHidden = false;
      //登录
    _scope.checkUser = function () {
        var password = _scope.user.password;
        var phoneNum = _scope.user.phoneNum;
        var myreg =  /^1[3|4|5|7|8|9]\d{9}$/;
        if(!(myreg.test(phoneNum))){
          dialogsManager.showMessage("手机号密码输入有误");
          return false;
        }
        if (password.length<6||password.length>15) {
          dialogsManager.showMessage("手机号密码输入有误");
          return false;
        }
        if(_scope.phoneHidden||_scope.pwdHidden){
          dialogsManager.showMessage("手机号密码输入有误");
          return false;
        }
        $ionicLoading.show();
        //发送请求
        var promise = CheckLogin.getUserMessage(phoneNum,password);
        //成功回调
        promise.success(function (result) {
          $ionicLoading.hide();
          if(result.flag==500){//登录失败
            dialogsManager.showMessage("手机号密码输入有误");
            return false;
          }
          localStorage.removeItem('user');
          //储存用户信息
          basicConfig.setObject('user',result.data);
          UserInfoSupport.setUserEntity(result.data);
          //设置推送标签个别名
          if (window.cordova){
      		if(window.plugins.jPushPlugin.isPlatformIOS()) {
      		    // iOS
      			//设置推送标签别名
  				  //JPushPlugin.prototype.setAlias(result.data.userId)
      			window.plugins.jPushPlugin.setTagsWithAlias([],result.data.userId);
      		} else {
      		    // Android
  				//设置推送标签别名
  				window.plugins.jPushPlugin.setTagsWithAlias([],result.data.userId);
      		}
        }
          //跳转页面
          var currentUrl = basicConfig.getObject('currentUrl');
          var isApp = basicConfig.getObject('isApp');
          //wap打开页面
          if(isApp!=null&&!isApp){
             var url = currentUrl.url;
             var params =currentUrl.params;
             $state.go('toDown');
             return;
          }
          //商品详情登录
          if(currentUrl.params.goodsId){
            var url = currentUrl.url;
            var params = currentUrl.params;
            $state.go(url,params);
            return;
          }
          //如果地址是如下情况，跳回member页面
          if(currentUrl.url==''
            ||currentUrl.url=='tab.home'
            ||currentUrl.url=='tab.signIn'
            ||currentUrl.url=='tab.square'
            ||currentUrl.url=='tab.share'
            ||currentUrl.url=='register'
            ||currentUrl.url=='lostPassword'){
            $state.go('tab.member');
            return;
          }
          var url = currentUrl.url;
          $state.go(url);
      })

    //失败回调函数
      .error(function (error) {
          $ionicLoading.hide();
          dialogsManager.showMessage("手机号密码输入有误");
          return false;
        });
      };

      //返回按钮
    _scope.rollback = function () {
        var url = basicConfig.getObject('currentUrl').url;
        var params = basicConfig.getObject('currentUrl').params;
        if(!url||url=='toLogin'||url=='lostPassword'||url=='register'||url=='lostPassword'){
          $state.go('tab.home');
          return;
        }
        $state.go(url,params);
      };

      //取消按钮
    _scope.cancelThis = function () {
        var url = basicConfig.getObject('currentUrl').url;
        var params = basicConfig.getObject('currentUrl').params;
        //如果地址是如下情况，跳回Home
       if(!url||url=='toLogin'||url=='lostPassword'||url=='register'||url=='lostPassword'){
          $state.go('tab.home');
          return;
        }
        $state.go(url,params);
      };
      //注册按钮
    _scope.registered = function () {
        $state.go('register');
      };
      //忘记密码
    _scope.missPwd = function () {
        $state.go('setPassword');
      }
    }
  );
