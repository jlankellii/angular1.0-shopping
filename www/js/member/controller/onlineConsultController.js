angular.module('member.onlineConsultController',[])
  .controller('onlineConsultController',function($scope,$ionicScrollDelegate,onlineConsultServices,basicConfig,dialogsManager){
    var user = basicConfig.getObject('user');
    //QQ微信
    onlineConsultServices.concatInfo().success(function(data){
      $scope.qq = data.data;
      $scope.weixin = data.msg;
    })
    var pageSize = 5;
    var pageNum = 1;
    $scope.showMore = true;
    $scope.chatAll = [];
    onlineConsultServices.queryConsult(user.userId,pageSize,pageNum).success(function(data){
      if(data.flag==200){
        if(data.data==null || data.data == ''){
          $scope.showMore = false;
        }
        $scope.chatAll = data.data.reverse();
        $ionicScrollDelegate.$getByHandle('buttom').scrollBottom();
      }else {
        dialogsManager.showMessage("网络故障,请稍后再试!");
      }
    });
    $scope.firstEnter = '有事请留言，客服会在24小时内与您联系！';
    $scope.isUser = function(userId){
      if(userId==user.userId && userId != ''){
        return false;
      }else{
        return true;
      }
    };
    //下拉加载更多
    $scope.loadMore = function(){
     pageNum++;
      onlineConsultServices.queryConsult(user.userId,pageSize,pageNum).success(function(data){
        if(data.flag==200){
          if(data.data==null || data.data==''){
            $scope.showMore = false;
            $scope.show = true;
          }else {
            $scope.showMore = true;
            $scope.chatAll = data.data.reverse().concat($scope.chatAll);
          }
        }else{
          dialogsManager.showMessage("网络故障,请稍后再试!");
        }
      }).error(function(){
        dialogsManager.showMessage("网络故障,请稍后再试!");
      });
      $scope.$broadcast('scroll.refreshComplete');
    };

    //发送消息
    $scope.sendMessage = function(){
      if($scope.send_content=='' || $scope.send_content==null ){
        dialogsManager.showMessage("发送消息不能为空!");
        return false;
      };
      //匹配html标签正则
      var reg = new RegExp('^<([^>\s]+)[^>]*>(.*?<\/\\1>)?$');
      if(reg.test($scope.send_content)){
        dialogsManager.showMessage("您输入的含有特殊字符，请重新输入!");
        return;
      };
      var dateTime = {'time':new Date()};
      var sendContent = {'userId':user.userId,'userName':user.alias,'userAvatar':user.avatar,'content':$scope.send_content,'createTime':dateTime}
      onlineConsultServices.addConsult(user.userId,user.alias,user.avatar,$scope.send_content).success(function(data){
        if(data.flag==200){
          $scope.send_content = '';
          $scope.chatAll.push(sendContent);
          $ionicScrollDelegate.$getByHandle('buttom').scrollBottom();
        }else {
          dialogsManager.showMessage("网络故障,请稍后再试!");
        }
      }).error(function(){
        dialogsManager.showMessage("网络故障,请稍后再试!");
      })
    }
  })

  .directive('keyboardshow', function($rootScope, $ionicPlatform, $timeout, $ionicHistory, $cordovaKeyboard,$location) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        if ($location.absUrl().indexOf('file://')<0){
          return;
        };
        if(window.plugins.jPushPlugin.isPlatformIOS()){
          window.addEventListener('native.keyboardshow',function (e){
            angular.element(element).css({
              'bottom':e.keyboardHeight + 'px'
            });
          });
          window.addEventListener('native.keyboardhide',function (e){
            angular.element(element).css({
              'bottom':0
            });
          });
        }else{
          return;
        }
      }
    };
  });
