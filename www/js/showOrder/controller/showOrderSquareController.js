/**
 * Created by user on 2016/12/31.
 */
angular.module('showOrder.showOrderSquare', [])

.controller('ShowOrderSquareCtrl', function ($scope,
                                             $ionicScrollDelegate,
                                             $timeout,
                                             $ionicLoading,
                                             showOrderService,
                                             UserInfoSupport,
                                             dialogsManager,
                                             basicConfig) {
  $scope.$on('$ionicView.enter', function () {
    if(basicConfig.getObject('user')!=null){
    	myId=	basicConfig.getObject('user').userId;
    }else{
    	myId = '';
    }
    id = UserInfoSupport.getHistory();
    if(myId != id){
    	UserInfoSupport.setHistory(myId);
    	 queryShowOrderList();
    }
  });

  $scope.isEmpty = false;
  $scope.noMore = false;
  $scope.canLoadMore = true;
  $scope.showOrderList = [];
  $scope.starArray = [
    {"id":1, "src":"img/score.png"},
    {"id":2, "src":"img/score.png"},
    {"id":3, "src":"img/score.png"},
    {"id":4, "src":"img/score.png"},
    {"id":5, "src":"img/score.png"}
  ];
  $scope.nStarArray = [
    {"id":1, "src":"img/score_no.png"},
    {"id":2, "src":"img/score_no.png"},
    {"id":3, "src":"img/score_no.png"},
    {"id":4, "src":"img/score_no.png"},
    {"id":5, "src":"img/score_no.png"}
  ];

  var myId = '';
  if(basicConfig.getObject('user')!=null){
  	myId=	basicConfig.getObject('user').userId;
  }
  var currentIndex = 1;
  var pageSize = 10;

  /**
   * 进入初始化数据查询
   */
  queryShowOrderList();

  /**
   * 下拉刷新
   */
  $scope.doRefresh = function () {
    currentIndex = 1;
    showOrderService.queryAllShowOrder(myId, currentIndex, pageSize, function (result) {
      if (null == result.data || 0 == result.data.length) {
        $scope.isEmpty = true;
        $scope.canLoadMore = false;
      }else if (pageSize > result.data.length) {
        $scope.isEmpty = false;
        $scope.noMore = true;
        $scope.canLoadMore = false;
      }else {
        $scope.isEmpty = false;
        $scope.noMore = false;
        $scope.canLoadMore = true;
      }
      $scope.showOrderList = result.data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function () {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  /**
   * 上拉刷新
   */
  $scope.loadMore = function () {
    currentIndex++;
    showOrderService.queryAllShowOrder(myId, currentIndex, pageSize, function (result) {
      if (null == result.data || pageSize > result.data.length){
        $scope.canLoadMore = false;
        $scope.noMore = true;
      }
      $scope.showOrderList = $scope.showOrderList.concat(result.data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, function () {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.likeAction = function (item) {
    if (null == myId || 0 == myId.length){
      dialogsManager.showMessage('请登录');
      return;
    }
    if (1 == item.like){
      dialogsManager.showMessage('已经点过赞了！');
      return;
    }

    showOrderService.likeShowOrder(myId, item.id,function (result) {
      if (200 == result.flag){

      }
    },function (error) {
      if (null != error && 900 == error.flag){
        // dialogsManager.showMessage(error.msg);
      }
    });
    item.likeNum += 1;
    item.like = 1;
    dialogsManager.showMessage('点赞成功');
  };

  /**
   * 置顶按钮隐藏与显示
   */
  var position;
  $scope.getScrollPosition=function () {
    //获取垂直滚动条到顶的距离
    position=$ionicScrollDelegate.$getByHandle('showOrderHandle').getScrollPosition().top;
    //小与150隐藏置顶按钮，否则显示
    if(position<150){
      $timeout(function () {
        $scope.showTop=false;
      },100);
    }else{
      $timeout(function () {
        $scope.showTop=true;
      },100);
    }
  };

  /**
   * 置顶
   */
  $scope.goTop=function () {
    $ionicScrollDelegate.$getByHandle('showOrderHandle').scrollTop();
    $scope.showTop=false;
  };

  function queryShowOrderList() {
    $ionicLoading.show();
    showOrderService.queryAllShowOrder(myId, currentIndex, pageSize, function (result) {
      if (null == result.data || 0 == result.data.length) {
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
      $scope.showOrderList = result.data;
      $ionicLoading.hide();
    }, function () {
      $scope.canLoadMore = false;
      $ionicLoading.hide();
    });
  }

});
