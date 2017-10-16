/**
 * <p>类描述: </p>
 * <p>创建人: YangLiu</p>
 * <p>创建时间: 1/16/17</p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 */
angular.module('home.goodsModuleController', [])
  .controller('GoodsModuleCtrl',function($scope,
                                         $timeout,
                                         $stateParams,
                                         $ionicScrollDelegate,
                                         $ionicLoading,
                                         GoodsModuleDetails){
    $scope.show=false;
    //获取模块title
    $scope.goodsModuleId = $stateParams.goodsModuleId;
    $scope.title = $stateParams.goodsModuleTitle;
    $scope.more=true;
    //商品模块查询列表
    $scope.goodsModuleList=[];
    var currentPage=1;
    var count=6;
    $ionicLoading.show();
    GoodsModuleDetails.getGoodsModuleDetail($scope.goodsModuleId,currentPage,count).then(function(result) {

      if (result.flag == 200) {
        if (result.data == null || result.data.length == 0) {
          $scope.show=true;
        } else {
          $scope.goodsModuleList = result.data;
        }
      }
      $ionicLoading.hide();
    },function () {
      $ionicLoading.hide();
    });

    $scope.doRefresh = function(){
      $scope.show=false;
      currentPage = 1;
      GoodsModuleDetails.getGoodsModuleDetail($scope.goodsModuleId,currentPage,count).then(function(result){
        if(result.flag==200){
          if(result.data==null||result.data.length==0){
            $scope.show=true;
          }else {
            $scope.goodsModuleList=result.data;
          }
        }
      });
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function(){
      currentPage++;
      GoodsModuleDetails.getGoodsModuleDetail($scope.goodsModuleId,currentPage,count).then(function(result){
        if(result.flag==200){
          if(result.data==null||result.data.length==0){
            $scope.show=true;
            $scope.more=false;
          }else{
            $timeout(function (){
              $scope.goodsModuleList = $scope.goodsModuleList.concat(result.data);
            });
          }
        }
        $timeout(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      },function () {
        $timeout(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      });
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
