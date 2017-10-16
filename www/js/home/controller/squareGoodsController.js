/**
 * <p>类描述: </p>
 * <p>创建人: YangLiu</p>
 * <p>创建时间: 1/16/17</p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 */
angular.module('home.squareGoodsController', [])
  .controller('squareGoodsCtrl', function($scope,
                                       $timeout,
                                       $stateParams,
                                       $ionicScrollDelegate,
                                       $ionicLoading,
                                       $state,
                                       pathService,
                                       HomeService){
    $scope.show=false;
    //获取模块title
    $scope.squareGoodsId = $stateParams.squareGoodsId;
    $scope.advTitle = $stateParams.squareTitle;
    $scope.more=true;
    //商品模块查询列表
    $scope.goodsList=[];
    $scope.prefix=pathService.getFilePath();
    var currentPage=1;
    var count=6;
    $ionicLoading.show();
    HomeService.queryAdvGoodsList($scope.squareGoodsId, currentPage, count, function (result) {
      if (0 == result.data.length) {
        $scope.show=true;
        $scope.more=false;
      }else {
        $scope.more=true;
      }
      $scope.goodsList = result.data;
      $ionicLoading.hide();
    },function (error) {
      $ionicLoading.hide();
    });

    $scope.doRefresh = function(){
      $scope.show=false;
      currentPage = 1;
      HomeService.queryAdvGoodsList($scope.squareGoodsId, currentPage, count, function (result) {
        $timeout(function () {
          if (null == result.data || 0 == result.data.length){
            $scope.show=true;
            $scope.more=false;
          }else {
            $scope.more=true;
          }
          $scope.goodsList=result.data;
          $scope.$broadcast('scroll.refreshComplete');
        });

      }, function (error) {

      });
    };

    $scope.loadMore = function(){
      currentPage++;
      HomeService.queryAdvGoodsList($scope.squareGoodsId, currentPage, count, function (result) {
        if(result.data==null||result.data.length==0){
          $scope.show=true;
          $scope.more=false;
        }
        $timeout(function () {
          $scope.goodsList = $scope.goodsList.concat(result.data);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }, function (error) {
        $timeout(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      });
    };

    $scope.goGoodsDetail = function (goodsId) {
      $state.go('tab.goodsDetail',{'goodsId':goodsId});
    };

    //置顶按钮隐藏与显示
    var position;
    $scope.getScrollPosition=function () {
      position=$ionicScrollDelegate.getScrollPosition().top;
      if(position<1500){
        $timeout(function () {
          $scope.showTop=false;
        },100);
      }else{
        $timeout(function () {
          $scope.showTop=true;
        },100);
      }
    };

    $scope.goTop=function () {
      $ionicScrollDelegate.scrollTop();
      $scope.showTop=false;
    }
  });
