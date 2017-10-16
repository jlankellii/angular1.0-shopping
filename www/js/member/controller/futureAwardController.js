/**
 * Created by yangyihao on 2016/12/31.
 */

angular.module('member.futureAwardController', [])
  .controller('FutureAward', function ($scope,
                                       Future,
                                       dialogsManager,
                                       $state,
                                       $ionicHistory,
                                       $timeout,
                                       $ionicLoading,
                                       $ionicScrollDelegate) {
    $scope.isEmpty = false;
    $scope.noMore = false;
    $scope.canLoadMore = true;
    $scope.award = [];

    var currentPage = 1;
    $ionicLoading.show();
    var promise = Future.getAward(currentPage);
    promise.success(function (result) {
      $ionicLoading.hide();
      if (result.flag == 200) {//登录失败
        if (result.data == null || result.data.length == 0) {
          $scope.isEmpty = true;
          $scope.canLoadMore = false;
        } else {
          $scope.award = result.data;
        }
      }
    })
      .error(function () {
        $ionicLoading.hide();
        dialogsManager.showMessage("网络故障,请稍后再试!");
        return false;
      });

    //置顶按钮隐藏与显示
    var position;
    $scope.getScrollPosition = function () {
      //获取垂直滚动条到顶的距离
      position = $ionicScrollDelegate.$getByHandle('allAward').getScrollPosition().top;
      //小与1500隐藏置顶按钮，否则显示
      if (position < 1500) {
        $timeout(function () {
          $scope.showTop = false;
        }, 100);
      } else {
        $timeout(function () {
          $scope.showTop = true;
        }, 100);
      }
    };

    //置顶
    $scope.goTop = function () {
      $ionicScrollDelegate.$getByHandle('allAward').scrollTop();
      $scope.showTop = false;
    };

    //下拉刷新
    $scope.doRefresh = function () {
      $scope.canLoadMore= true;
      $scope.isEmpty=false;
      currentPage = 1;
      var promise = Future.getAward(currentPage);
      promise.success(function (result) {
        if (result.flag == 200) {
          if (result.data == null || result.data.length == 0) {
            $scope.isEmpty = true;
            $scope.canLoadMore = false;
          }
          $scope.award = result.data;
        }
        $scope.$broadcast('scroll.refreshComplete');
      })
        .error(function () {
          $scope.$broadcast('scroll.refreshComplete');
          dialogsManager.showMessage("网络故障,请稍后再试!");
        });
    };

    //上滑加载
    $scope.loadMore = function () {
      currentPage++;
      var promise = Future.getAward(currentPage);
      promise.success(function (result) {
        if (result.flag == 200) {
          if (result.data == null || result.data.length == 0) {
            $scope.noMore = true;
            $scope.canLoadMore=false;
          } else {
            $scope.award = $scope.award.concat(result.data);
          }
        }
        $timeout(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      })
        .error(function () {
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });
    };
  });
