/**
 * Created by yangyihao on 2016/12/31.
 * 累计积分查询
 * 获得积分
 * 扣除积分
 *
 */

angular.module('member.allAwardController', [])
  .controller('AllAward',function ($scope,
                                   $ionicHistory,
                                   $state,
                                   $ionicScrollDelegate,
                                   $ionicLoading,
                                   $timeout,
                                   AllAward) {
    $scope.$on('$ionicView.enter', function () {
      $scope.gainAward();
    });

    $scope.awardList = [];
    $scope.isEmpty = false;
    $scope.noMore = false;
    $scope.canLoadMore = true;
    var currentPage = 1;

    //获得积分查询
    $scope.gainAward = function () {
      currentPage = 1;
      $scope.isEmpty = false;
      $scope.noMore = false;
      $scope.canLoadMore = true;
      $scope.awardList = [];
      $scope.isActive = true;
      $scope.noActive = false;
      $ionicLoading.show();
      AllAward.getAward(currentPage, function (result) {
        $ionicLoading.hide();
        if(null == result.data || 0 == result.data.length){
          $scope.isEmpty = true;
          $scope.canLoadMore = false;
        }
        $scope.awardList = result.data;
      }, function () {
        $ionicLoading.hide();
      });
    };

    //扣除积分
    $scope.deductAward = function () {
      $scope.isEmpty = true;
      $scope.noMore = false;
      $scope.canLoadMore = false;
      $scope.awardList =[];
      $scope.isActive = false;
      $scope.noActive = true;

      // currentPage = 1;
      // $scope.isEmpty=false;
      // $scope.more= true;
      // $scope.awardList =[];
      // $scope.isActive = false;
      // $scope.noActive = true;
      // $ionicLoading.show();
      // var promise = AllAward.getDeductAward(currentPage);
      // promise.success(function (result) {
      //   $ionicLoading.hide();
      //   if(result.flag==200){
      //     if(result.data==null||result.data.length==0){
      //       $scope.show=true;
      //       $scope.more=false;
      //     }else{
      //       $scope.awardList=result.data;
      //     }
      //   }
      // })
      // .error(function (error) {
      //   $ionicLoading.hide();
      //   return false;
      // });
    };

    //置顶按钮隐藏与显示
    var position;
    $scope.getScrollPosition=function () {
      //获取垂直滚动条到顶的距离
      position=$ionicScrollDelegate.$getByHandle('allAward').getScrollPosition().top;
      //小与1500隐藏置顶按钮，否则显示
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

    //置顶
    $scope.goTop=function () {
      $ionicScrollDelegate.$getByHandle('allAward').scrollTop();
      $scope.showTop=false;
    };

    //下拉刷新
    $scope.doRefresh = function(){
      $scope.canLoadMore= true;
      $scope.isEmpty=false;
      currentPage = 1;
      if($scope.isActive) {
        AllAward.getAward(currentPage, function (result) {
          if(null == result.data || 0 == result.data.length){
            $scope.isEmpty = true;
            $scope.canLoadMore = false;
          }
          $scope.awardList = result.data;
          $scope.$broadcast('scroll.refreshComplete');
        }, function () {
          $scope.$broadcast('scroll.refreshComplete');
        });

      }else{
        //暂无扣除积分功能，注释以下方法
      //   var promise = AllAward.getDeductAward(currentPage);
      //   promise.success(function (result) {
      //     if (result.flag == 200) {//登录失败
      //       if (result.data == null || result.data.length == 0) {
      //         $scope.isEmpty = true;
      //         $scope.more=false;
      //       } else {
      //         $scope.more = true;
      //         $scope.awardList = result.data;
      //       }
      //     }
      //   })
      //     .error(function (error) {
      //       dialogsManager.showMessage("网络故障,请稍后再试!");
      //       return false;
      //     });

        $scope.isEmpty=true;
        $scope.canLoadMore= false;
        $scope.awardList =[];
        $scope.isActive = false;
        $scope.noActive = true;
        $scope.$broadcast('scroll.refreshComplete');
      }
    };

    //上滑加载
    $scope.loadMore = function(){
      currentPage++;
      if($scope.isActive) {
        AllAward.getAward(currentPage, function (result) {
          if(result.data==null||result.data.length==0){
            $scope.noMore = true;
            $scope.canLoadMore=false;
          }else{
            $timeout(function (){
              $scope.awardList = $scope.awardList.concat(result.data);
            });
          }
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        }, function () {
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });
      }else{
        // var promise = AllAward.getDeductAward(currentPage);
        // promise.success(function (result) {
        //   if (result.flag == 200) {
        //     if(result.data==null||result.data.length==0){
        //       $scope.canLoadMore=false;
        //     }else{
        //       $timeout(function (){
        //         $scope.awardList = $scope.awardList.concat(result.data);
        //       });
        //     }
        //   }
        //   $timeout(function () {
        //     $scope.$broadcast('scroll.infiniteScrollComplete');
        //   });
        // })
        //   .error(function () {
        //   $timeout(function () {
        //     $scope.$broadcast('scroll.infiniteScrollComplete');
        //   });
        // });

        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    };
  });
