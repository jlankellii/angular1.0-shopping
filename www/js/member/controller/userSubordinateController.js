/**
 * <p>方法描述:描述信息 </p>
 * <p>创建人: YangLiu</p>
 * <p>创建时间: </p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 */
angular.module('member.userSubordinateController', [])

.controller('userSubordinateCtrl', function ($scope,
                                             $stateParams,
                                             $ionicLoading,
                                             MySubordinateAttention) {
  var userId = $stateParams.userId;
  var pageSize = 10;
  $scope.alias = $stateParams.alias;

  $scope.isEmpty = false;
  $scope.noMore = false;
  $scope.canLoadMore = true;
  $scope.subordinateUserList = [];
  var currentIndex = 1;

  queryShowOrderList();

  $scope.doRefresh = function () {
    currentIndex = 1;
    MySubordinateAttention.getUserDescendant(userId, currentIndex, 0, function (result) {
      if (null == result.data || 0 == result.data.length){
        $scope.isEmpty = true;
        $scope.canLoadMore = false;

      }else if (pageSize > result.data.length){
        $scope.isEmpty = false;
        $scope.noMore = true;
        $scope.canLoadMore = false;
      }else {
        $scope.isEmpty = false;
        $scope.noMore = false;
        $scope.canLoadMore = true;
      }

      $scope.subordinateUserList = result.data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function () {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMore = function () {
    currentIndex++;
    MySubordinateAttention.getUserDescendant(userId, currentIndex, 0, function (result) {
      if (null == result.data || pageSize > result.data.length){
        $scope.canLoadMore = false;
        $scope.noMore = true;
      }

      $scope.subordinateUserList = $scope.subordinateUserList.concat(result.data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, function () {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  function queryShowOrderList() {
    $ionicLoading.show();
    MySubordinateAttention.getUserDescendant(userId, currentIndex, 0, function (result) {
      if (null == result.data || 0 == result.data.length){
        $scope.isEmpty = true;
        $scope.canLoadMore = false;

      }else if (pageSize > result.data.length){
        $scope.isEmpty = false;
        $scope.noMore = true;
        $scope.canLoadMore = false;
      }else {
        $scope.isEmpty = false;
        $scope.noMore = false;
        $scope.canLoadMore = true;
      }

      $scope.subordinateUserList = result.data;
      $ionicLoading.hide();
    }, function (error) {

    });
  }
});
