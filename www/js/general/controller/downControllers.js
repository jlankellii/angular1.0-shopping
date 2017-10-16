angular.module('starter.downControllers',[])
  .controller('ToDown',function  ($scope,$state,$location,$http) {
    var _scope = $scope;
    $scope.returnShare=function(){
      var currentUrl = basicConfig.getObject('currentUrl');
      //修改跳回地址 by yangyihao 2016.12.28 11:26
      $state.go(currentUrl.url,currentUrl.params);
  }
});

