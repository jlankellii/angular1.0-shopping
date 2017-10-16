angular.module('starter.loginOutServices', [])
  .factory('CheckLogin',function ($http,$q,basicConfig,pathService) {
    return {
      /**
       * <p>方法描述:通过$http与后台交互，登录验证，获得用户信息</p>
       * <p>创建人: yihao yang</p>
       * <p>创建时间: 2016.12.13</p>
       * <p>修改人: </p>
       * <p>修改时间: </p>
       * <p>修改备注: </p>
       * userName:用户手机号
       * password:用户密码
       * $state:路由跳转
       * $http:进行异步请求
       */
      getUserMessage:function (phoneNum,password) {
        var phoneNum = phoneNum;
        var pwd = password;
        var url = pathService.getPath('login');
        var shareUrlChain = basicConfig.getObject('shareUrlChain');
        var type = shareUrlChain.type;
        //商品信息链条
        var goodsId = shareUrlChain.goodsId;
        var tagId =shareUrlChain.tagId;
        //参数
        var data = {'mobile':phoneNum,'userPassword':pwd,'type':type,'goodsId':goodsId,'tagId':tagId};
        //发送请求
        var promise = $http.jsonp(url,{params:data});
        return promise;
      }
    }
  })


 //登录状态监听
 /*.run(function($ionicPlatform, $rootScope, $ionicHistory,$state,$ionicViewSwitcher,basicConfig) {
   var needLoginView = ["tab.member","tab.profile","tab.share","tab.scoreRank","tab.mySubordinate"];//需要登录的页面state
   $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options) {
     if (toState.name=='toLogin'){
       var url = fromState.name;
       //判断是否是商品详情页面过来的
       basicConfig.setObject('isApp',true);
       if(fromState.name=='tab.goodsDetail'){
         var goodsId = toParams.goodsId;
         var tagId = toParams.tagId;
         var type = toParams.type;
         //登录跳转回路由：
         var currentUrl = {url:fromState.name,params:{'goodsId':goodsId}};
         basicConfig.setObject('currentUrl',currentUrl);
         basicConfig.setObject('isApp',true);
         //判断是否为app端打开
         if(tagId!=null&&tagId!=""){
           basicConfig.setObject('isApp',false);
           var shareUrlChain = {'type':20,'goodsId':goodsId,'tagId':tagId};
           basicConfig.setObject('shareUrlChain',shareUrlChain);
           //干掉返回键
           $ionicHistory.nextViewOptions({
             disableBack: true
           });
           return true;
         }
         //是app存储
         var shareUrlChain = {type:10,goodsId:goodsId,tagId:''};
         basicConfig.setObject('shareUrlChain',shareUrlChain);
         //干掉返回键
         $ionicHistory.nextViewOptions({
           disableBack: true
         });
       }else{
       //非商品详情
         var currentUrl = {url:fromState.name,params:''};
         basicConfig.setObject('currentUrl',currentUrl);
         var shareUrlChain = {type:15,goodsId:'','tagId':''};
         basicConfig.setObject('shareUrlChain',shareUrlChain);
         //干掉返回键
         $ionicHistory.nextViewOptions({
           disableBack: true
         });
       }
     }
     //判断当前是否登录
     var userInfo = basicConfig.getObject('user');
     if(needLoginView.indexOf(toState.name)>=0&&!userInfo){
       //跳转至登录页面
       $state.go("toLogin");
       $ionicViewSwitcher.nextDirection('forward');
       event.preventDefault();
     }
   })});
*/
