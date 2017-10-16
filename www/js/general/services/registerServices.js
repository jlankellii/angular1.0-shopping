angular.module('starter.registerServices', [])
.factory('checkRegister',function($http,$q,pathService){
    var phone ;
    return{
    	//验证手机号
      getUserPhoneNumMessage:function(phoneNum){
        var num = phoneNum;
        var url = pathService.getPath('validateMobile');
      //发送请求
        var data = {mobile:num};
        var promise = $http.jsonp(url,{params:data});
          promise.success(function(result){
              phone=num;
          });
        return promise;
      },
      get:function(){
        return phone;
      },
      //点击更换验证码图片
      getPictureValidCode:function(){
        return pathService.getPath('getCodeMaker');
      },
      //发送手机验证码
      sendMsg:function(mobile){
        return "发送手机验证码";
      },
      //检测短信验证码
      checkPhoneValidCode:function(phoneNum,mobileCode){
        var data = {mobile:phoneNum,mobileCode:mobileCode};
        return $http.jsonp(pathService.getPath('validateMobileCode'),{params:data});
      },
      //获取手机验证码
      sendCode:function(mobile){
        return $http.jsonp(pathService.getPath('sendCode'),{params:mobile});
      }
      };

    //  getUserCodeMessage:function(phoneNum){
    //    var num = phoneNum;
    //    var url = pathService.getPath('validateMobile');
    //    //发送请求
    //    var data = {mobile:num};
    //    var promise = $http.jsonp(url,{params:data});
    //    return promise;
    //  }
    //}
  })
  //阅读“积分吧”注册协议
  .factory('read',function($state,$http){
    return{
      ReadMessage:function(){
        $state.go('detail');
        return 'Hello';
      }
    }
  })
  //登录
  .factory('login',function($state,$http){
  return{
    message:function(){
      $state.go('toLogin');
      return 'G';
    }
  }
})
//检测密码
  .factory('checkPassword',function($http,$q,pathService,basicConfig){
    return{
	 getPasswordMessage:function(phoneNum,password,type,goodsId,tagId){
        var url = pathService.getPath('register');
        //发送请求
        var data = {mobile:phoneNum,userPassword:password,type:type,goodsId:goodsId,tagId:tagId};
        var promise = $http.jsonp(url,{params:data});
        return promise;
      },
      //登录
      getUserMessage:function (phoneNum,password) {
        var phoneNum = phoneNum;
        var pwd = password;
        var url = pathService.getPath('login');
        // var url = "http://localhost:8080/zhelaigou_mgmt/app/mobile/user/login?jsonp=JSON_CALLBACK";
        var shareUrlChain = basicConfig.getObject('shareUrlChain');
        var type = shareUrlChain.type;
        //商品信息链条
        var typeValue = shareUrlChain.url+','+shareUrlChain.goodsId+','+shareUrlChain.puid;
        // var typeValue = "Hello"
        //参数
        var data = {phoneNum:phoneNum,password:pwd,type:type,typeValue:typeValue};
        //发送请求
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  })
 /**
 * <p>描述:找回密码 </p>
 * <p>创建人: wangjian</p>
 * <p>创建时间: 20161217</p>
*/
  .factory('findPassword',findPassword);
function findPassword($state,$http,pathService){
    return{
    	//检查用户存在
    	validateMobile:function(_params){
    	return $http.jsonp(pathService.getPath('validateMobile'),{params:_params});
      },
       //获取图片验证码
       getPictureValidCode:function(){
    	 return pathService.getPath('getCodeMaker');
      },
       //获取手机验证码
       sendCode:function(_params){
    	  return $http.jsonp(pathService.getPath('sendCode'),{params:_params});
      },
       //修改密码
       resetPassword:function(_params){
    	  return $http.jsonp(pathService.getPath('resetPassword'),{params:_params});
      }

    }
  }


