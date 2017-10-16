angular.module('starter.shareControllers',[])
  .controller('ToShare',function  ($scope,$state,$location,$http) {
    var _scope = $scope;
    _scope.registered = function(){
      $state.go('register', {'pUId': $location.search()['pUId']?$location.search()['pUId']:''})
      //$state.go('register', {'pUId': $location.search()['pUId']?$location.search()['pUId']:'','type': $location.search()['type']?$location.search()['type']:''})
    };
    _scope.downed=function () {
      $state.go('toDown');
    }
  });

