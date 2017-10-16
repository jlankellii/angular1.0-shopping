angular.module('home.scoreRankControllers',[])
.controller('scoreRankController',function($scope,$ionicLoading,$timeout,basicConfig,scoreRank,$ionicScrollDelegate,dialogsManager){
  //初始数据
  var user = basicConfig.getObject('user');
  $scope.userId = user.userId;
  $ionicLoading.show();//显示loading
  $scope.more = true;
  $scope.alias = user.alias;
  $scope.totalRank = true;
  $scope.monthRank = false;
  $scope.dayRank = false;
  $scope.show = false;
  $scope.showTop = false;
  var pageNum = 1;
  //刷新类型
  var rfreshType = 0;
  var total = 0;
  var month = 1;
  var day = 2;
  scoreRank.queryRank(user.userId, pageNum, total).success(function (result) {
    if (result.flag == 200) {
      if (result.data == null || result.data.length == 0) {
        $scope.show = true;
        $scope.more = false;
        $scope.showTop = false;
        $ionicLoading.hide();
      } else {
        $scope.sub = result.data;
        $ionicLoading.hide();
      }
    } else {
      $ionicLoading.hide();
      dialogsManager.showMessage("网络故障,请稍后再试！");
    }
  });
  scoreRank.querySelfRank(user.userId,total).success(function (result) {
    if (result.flag == 200) {
        $scope.self = result.data;
        $ionicLoading.hide();
    } else {
      dialogsManager.showMessage("网络故障,请稍后再试!！");
      $ionicLoading.hide();
    }
  });

  //总排名
  $scope.seeTotal = function(){
    $ionicScrollDelegate.$getByHandle('backTop').scrollTop();
    $scope.sub = [];
    $ionicLoading.show();//显示loading
    pageNum = 1;
    rfreshType = 0;
    $scope.show = false;
    $scope.showTop = false;
    $scope.totalRank = true;
    $scope.monthRank = false;
    $scope.dayRank = false;
    $scope.more = true;
    scoreRank.queryRank(user.userId, pageNum, total).success(function (result) {
      if (result.flag == 200) {
        if (result.data == null || result.data.length == 0) {
          $scope.show = true;
          $scope.more = false;
          $scope.showTop = false;
          $ionicLoading.hide();
        } else {
          $scope.sub = result.data;
          $ionicLoading.hide();
        }
      } else {
        dialogsManager.showMessage("网络故障,请稍后再试！");
        $ionicLoading.hide();
      }
    });
    scoreRank.querySelfRank(user.userId,total).success(function (result) {
      if (result.flag == 200) {
          $scope.self = result.data;
          $ionicLoading.hide();
      } else {
        dialogsManager.showMessage("网络故障,请稍后再试！");
        $ionicLoading.hide();
      }
    })
  }

  //月排名
  $scope.seeMonth = function(){
    $ionicScrollDelegate.$getByHandle('backTop').scrollTop();
    $scope.sub = [];
    $ionicLoading.show();//显示loading
    pageNum = 1;
    rfreshType = 1;
    $scope.show = false;
    $scope.showTop = false;
    $scope.totalRank = false;
    $scope.monthRank = true;
    $scope.dayRank = false;
    $scope.more = true;
    scoreRank.queryRank(user.userId, pageNum, month).success(function (result) {
      if (result.flag == 200) {
        if (result.data == null || result.data.length == 0) {
          $scope.show = true;
          $scope.more = false;
          $scope.showTop = false;
          $ionicLoading.hide();
        } else {
          $scope.sub = result.data;
          $ionicLoading.hide();
        }
      } else {
        dialogsManager.showMessage("网络故障,请稍后再试！");
        $ionicLoading.hide();
      }
    });
    scoreRank.querySelfRank(user.userId,month).success(function (result) {
      if (result.flag == 200) {
          $scope.self = result.data;
          $ionicLoading.hide();
      } else {
        dialogsManager.showMessage("网络故障,请稍后再试！");
        $ionicLoading.hide();
      }
    })
  };

  //日排名
  $scope.seeDay = function(){
    $ionicScrollDelegate.$getByHandle('backTop').scrollTop();
    $scope.sub = [];
    $ionicLoading.show();//显示loading
    pageNum = 1;
    rfreshType = 2;
    $scope.show = false;
    $scope.showTop = false;
    $scope.totalRank = false;
    $scope.monthRank = false;
    $scope.dayRank = true;
    $scope.more = true;
    scoreRank.queryRank(user.userId, pageNum, day).success(function (result) {
      if (result.flag == 200) {
        if (result.data == null || result.data.length == 0) {
          $scope.show = true;
          $scope.more = false;
          $scope.showTop = false;
          $ionicLoading.hide();
        } else {
          $scope.sub = result.data;
          $ionicLoading.hide();
        }
      } else {
        dialogsManager.showMessage("网络故障,请稍后再试！");
        $ionicLoading.hide();
      }
    });
    scoreRank.querySelfRank(user.userId,day).success(function (result) {
      if (result.flag == 200) {
          $scope.self = result.data;
          $ionicLoading.hide();
      } else {
        var data = {'num':1001,'score':0,'avatar':user.avatar,'alias':user.alias};
        $scope.self = data;
        $ionicLoading.hide();
      }
    })
  };

  //加载更多
  $scope.loadMore = function(){
    if(rfreshType == 0) {//加载更多总积分排名
      pageNum++;
      if(pageNum>=10){
        $scope.more = false;
        $scope.showTop = true;
        return false;
      };
      $timeout(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      },15000);
      scoreRank.queryRank(user.userId, pageNum, total).success(function (result) {
        if (result.flag == 200) {
          if (result.data == null || result.data.length == 0) {
            $scope.show = true;
            $scope.more = false;
            $scope.showTop = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.sub = $scope.sub.concat(result.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        } else {
          dialogsManager.showMessage("网络故障,请稍后再试！");
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      },function(){
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }else if(rfreshType == 1){
      pageNum++;
      if(pageNum>=10){
        $scope.more = false;
        $scope.showTop = true;
        return false;
      }
      scoreRank.queryRank(user.userId, pageNum, month).success(function (result) {
        if (result.flag == 200) {
          if (result.data == null || result.data.length == 0) {
            $scope.show = true;
            $scope.more = false;
            $scope.showTop = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.sub = $scope.sub.concat(result.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        } else {
          dialogsManager.showMessage("网络故障,请稍后再试！");
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      },function(){
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }else if(rfreshType == 2){
      pageNum++;
      if(pageNum>=10){
        $scope.more = false;
        $scope.showTop = true;
        return false;
      }
      scoreRank.queryRank(user.userId, pageNum, day).success(function (result) {
        if (result.flag == 200) {
          if (result.data == null || result.data.length == 0) {
            $scope.show = true;
            $scope.more = false;
            $scope.showTop = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.sub = $scope.sub.concat(result.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        } else {
          dialogsManager.showMessage("网络故障,请稍后再试！");
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      },function(){
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }
  };

  //下拉刷新
  $scope.doRefresh = function(){
    if(rfreshType == 0) {//下拉刷新总积分排名
      pageNum = 1;
      scoreRank.queryRank(user.userId, pageNum, total).success(function (result) {
        if (result.flag == 200) {
          if (result.data == null || result.data.length == 0) {
            $scope.show = true;
            $scope.more = false;
            $scope.showTop = false;
            $ionicLoading.hide();
          } else {
            $scope.sub = result.data;
            $ionicLoading.hide();
          }
        } else {
          dialogsManager.showMessage("网络故障,请稍后再试！");
          $ionicLoading.hide();
        }
      });
    }else if(rfreshType==1){
      pageNum = 1;
      scoreRank.queryRank(user.userId, pageNum, month).success(function (result) {
        if (result.flag == 200) {
          if (result.data == null || result.data.length == 0) {
            $scope.show = true;
            $scope.more = false;
            $scope.showTop = false;
            $ionicLoading.hide();
          } else {
            $scope.sub = result.data;
            $ionicLoading.hide();
          }
        } else {
          dialogsManager.showMessage("网络故障,请稍后再试！");
          $ionicLoading.hide();
        }
      });
    }else if(rfreshType==2){
      pageNum = 1;
      scoreRank.queryRank(user.userId, pageNum, day).success(function (result) {
        if (result.flag == 200) {
          if (result.data == null || result.data.length == 0) {
            $scope.show = true;
            $scope.more = false;
            $scope.showTop = false;
            $ionicLoading.hide();
          } else {
            $scope.sub = result.data;
            $ionicLoading.hide();
          }
        } else {
          dialogsManager.showMessage("网络故障,请稍后再试！");
          $ionicLoading.hide();
        }
      });
    }
    //广播结束事件
    $scope.$broadcast('scroll.refreshComplete');
  }

  //置顶按钮隐藏与显示
  var position;
  $scope.getScrollPosition=function () {
    position=$ionicScrollDelegate.getScrollPosition().top;
    if(position<1000){
      $timeout(function () {
        $scope.showToTop=false;
      },100);
    }else{
      $timeout(function () {
        $scope.showToTop=true;
      },100);
    }
  };
  $scope.goTop=function () {
    $ionicScrollDelegate.scrollTop();
    $scope.showToTop=false;
  }
});
