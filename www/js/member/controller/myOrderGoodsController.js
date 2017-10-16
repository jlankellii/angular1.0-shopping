angular.module('order.goodsDetailController', [])

  .controller('myOrderGoodsCtrl', function ($scope,
                                           $ionicActionSheet,
                                           $location,
                                           GoodsDetailService,
                                           $stateParams,
                                            $ionicLoading,
                                            $ionicHistory
                                           ) {
    var _scope = $scope;
    _scope.goodsDetail = {};

    var goodsId = '';
    if (null == $stateParams.goodsId || 0 == $stateParams.goodsId.length) {
      goodsId = $location.search()['goodsId'];
    } else {
      goodsId = $stateParams.goodsId;
    }
    $ionicLoading.show();
    $scope.isEmpty = true;
    GoodsDetailService.queryGoodsDetail(goodsId, function (result) {
      $scope.isEmpty = false;
      _scope.goodsDetail = result.data;
      $ionicLoading.hide();
    }, function (error) {
      $ionicLoading.show();
    });

    //返回我的订单页面
    _scope.backToOrder = function () {
      $ionicHistory.goBack();
    }
  });
