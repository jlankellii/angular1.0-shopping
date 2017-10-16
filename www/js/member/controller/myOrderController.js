angular.module('member.myOrderController', [])
  .controller('myOrderCtrl',function($scope,
                                     $ionicScrollDelegate,
                                     $stateParams,
                                     OrderAttention,
                                     totalOrder,
                                     $timeout,
                                     dialogsManager,
                                     $state,
                                     basicConfig,
                                     $ionicPopover,
                                     ShareAppGetScore,
                                     $location,
                                     $ionicHistory,
                                     $ionicActionSheet,
                                     $ionicLoading,
                                     pathService,
                                     validateException,
                                     isExposure
                                     ){
    $scope.$on('$ionicView.beforeEnter', function () {
      var entryType = $stateParams.entryType;
      if (1 == entryType) {
        //即将可用
        seeFutureOrder();
      }else if (2 == entryType) {
        //带领取
        seeHoldOrder();
      }else if (3 == entryType) {
        //可用
        seeUserOrder();
      }else if (4 == entryType) {
        //申诉
        seeComolainOrder();
      }else {
        //0是全部，非以上情况是也查看全部
        seeTotalOrder();
      }
    });
    //初始数据
    var currentPage = 1;
    var userId = basicConfig.getObject('user').userId;
    var _scope = $scope;
    _scope.more = true;
    //搜索标题
    var searchTitle = '';
    //获取订单的类型
    _scope.type = 0;
    //订单集合
    var orderLists = [];
    //搜索订单集合
    var searchOrderLists = [];
    //搜索状态
    var searchType = 1;
    _scope.total = true;
    _scope.future = false;
    _scope.hold = false;
    _scope.user = false;
    _scope.comolain = false;
    $ionicLoading.show();

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });
      _scope.rollback = function () {
        searchType = 1;
        $scope.popover.hide();
        $ionicHistory.goBack();
      };
    _scope.backHome = function(){
      $state.go('tab.myOrder');
    };
    //搜索全部订单
    _scope.searchTotalOrder = function () {
      _scope.show = false;
      _scope.more = true;
      _scope.total = true;
      _scope.future = false;
      _scope.hold = false;
      _scope.user = false;
      _scope.comolain = false;
      _scope.type = 0;
      currentPage = 1;
    };
    //全部订单
    _scope.totalOrder=function(){
      seeTotalOrder();
    };
    function seeTotalOrder() {
      $ionicScrollDelegate.scrollTop();
      _scope.show = false;
      _scope.more = true;
      _scope.total = true;
      _scope.future = false;
      _scope.hold = false;
      _scope.user = false;
      _scope.comolain = false;
      _scope.type = 0;
      currentPage = 1;
      _scope.order = '';
      $ionicLoading.show();
      OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle)
        .success(function(data){
          if(data.data == null || data.data.length ==0){
            _scope.more = false;
            _scope.show = true;
          }
          _scope.order = data.data;
          if (data.flag == 500) {//登录失败
            dialogsManager.showMessage("网络故障,请稍后再试!");
            return false;
          }
          $ionicLoading.hide();
        })
        .error(function (error) {
          dialogsManager.showMessage("网络故障,请稍后再试!");
          $ionicLoading.hide();
          return false;
        });
      $timeout(function(){$ionicLoading.hide();},pathService.getTimeout());
    }
    //搜索即将可用
    _scope.searchFutureOrder = function () {
      _scope.show = false;
      _scope.more = true;
      _scope.total = false;
      _scope.future = true;
      _scope.hold = false;
      _scope.user = false;
      _scope.comolain = false;
      _scope.type = 1;
      currentPage = 1;
      _scope.searchOrderList = [];
    };
    //即将可用
    _scope.futureOrder=function(){
      seeFutureOrder();
    };
    function seeFutureOrder() {
      $ionicScrollDelegate.scrollTop();
      _scope.show = false;
      _scope.more = true;
      _scope.total = false;
      _scope.future = true;
      _scope.hold = false;
      _scope.user = false;
      _scope.comolain = false;
      _scope.type = 1;
      currentPage = 1;
      _scope.order = '';
      $ionicLoading.show();
      OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle)
        .success(function(data){
          if(data.data == null || data.data.length ==0){
            _scope.more = false;
            _scope.show = true;
          }
          _scope.order = data.data;
          if (data.flag == 500) {//登录失败
            dialogsManager.showMessage("网络故障,请稍后再试!");
            return false;
          }
          $ionicLoading.hide();
        })
        .error(function (error) {
          $ionicLoading.hide();
          dialogsManager.showMessage("网络故障,请稍后再试!");
          return false;
        });
      $timeout(function(){$ionicLoading.hide();},pathService.getTimeout());
    }
    //搜索待领取
    _scope.searchHoldOrder = function () {
      _scope.show = false;
      _scope.more = true;
      _scope.total = false;
      _scope.future = false;
      _scope.hold = true;
      _scope.user = false;
      _scope.comolain = false;
      _scope.type = 2;
      currentPage = 1;
      _scope.searchOrderList = [];
    };
    //待领取
    _scope.holdOrder=function(){
      seeHoldOrder();
    };
    function seeHoldOrder() {
      $ionicScrollDelegate.scrollTop();
      _scope.show = false;
      _scope.more = true;
      _scope.total = false;
      _scope.future = false;
      _scope.hold = true;
      _scope.user = false;
      _scope.comolain = false;
      _scope.type = 2;
      currentPage = 1;
      _scope.order = '';
      $ionicLoading.show();
      OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle)
        .success(function(data){
          if(data.data == null || data.data.length ==0){
            _scope.more = false;
            _scope.show = true;
          }
          _scope.order = data.data;
          if (data.flag == 500) {//登录失败
            dialogsManager.showMessage("网络故障,请稍后再试!");
            return false;
          }
          $ionicLoading.hide();
        })
        .error(function (error) {
          $ionicLoading.hide();
          dialogsManager.showMessage("网络故障,请稍后再试!");
          return false;
        });
      $timeout(function(){$ionicLoading.hide();},pathService.getTimeout());
    }
    //搜索可用
    _scope.searchUserOrder = function () {
      _scope.show = false;
      _scope.more = true;
      _scope.total = false;
      _scope.future = false;
      _scope.hold = false;
      _scope.user = true;
      _scope.comolain = false;
      _scope.type = 3;
      currentPage = 1;
      _scope.searchOrderList = [];
    };
    //可用
    _scope.userOrder=function(){
      seeUserOrder();
    };
    function seeUserOrder() {
      $ionicScrollDelegate.scrollTop();
      _scope.show = false;
      _scope.more = true;
      _scope.total = false;
      _scope.future = false;
      _scope.hold = false;
      _scope.user = true;
      _scope.comolain = false;
      _scope.type = 3;
      currentPage = 1;
      _scope.order = '';
      $ionicLoading.show();
      OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle)
        .success(function(data){
          if(data.data == null || data.data.length ==0){
            _scope.more = false;
            _scope.show = true;
          }
          _scope.order = data.data;
          if (data.flag == 500) {//登录失败
            dialogsManager.showMessage("网络故障,请稍后再试!");
            return false;
          }
          $ionicLoading.hide();
        })
        .error(function (error) {
          dialogsManager.showMessage("网络故障,请稍后再试!");
          $ionicLoading.hide();
          return false;
        });
      $timeout(function(){$ionicLoading.hide();},pathService.getTimeout());
    }
    //搜索申诉
    _scope.searchComolainOrder = function () {
      _scope.more = true;
      _scope.total = false;
      _scope.future = false;
      _scope.hold = false;
      _scope.user = false;
      _scope.comolain = true;
      _scope.show = false;
      _scope.type = 4;
      currentPage = 1;
      _scope.searchOrderList = [];
    };
    //申诉
    _scope.comolainOrder = function(e){
      seeComolainOrder();
    };
    function seeComolainOrder() {
      _scope.show = false;
      _scope.order = [];
      _scope.comolainFlag = true;
      $ionicScrollDelegate.scrollTop();
      _scope.more = true;
      _scope.total = false;
      _scope.future = false;
      _scope.hold = false;
      _scope.user = false;
      _scope.comolain = true;
      _scope.type = 4;
      currentPage = 1;
      _scope.order = [];
      _scope.user = {isShow: ''};
      $ionicLoading.show();
      OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle)
        .success(function(data){
            if(data.flag == 200){
              if(data.data == null || data.data.length ==0){
                _scope.more = false;
                _scope.show = true;
              }
              _scope.order = data.data;
            }
            if (data.flag == 500) {//登录失败
              dialogsManager.showMessage("网络故障,请稍后再试!");
            }else{
              _scope.user.isShow = false;
            }
            $ionicLoading.hide();
          })
        .error(function (error) {
          dialogsManager.showMessage("网络故障,请稍后再试!");
          $ionicLoading.hide();
          return false;
        });
      $timeout(function(){$ionicLoading.hide();},pathService.getTimeout());
    }
    //申诉按钮
    _scope.comolainFun = function(goodsId){
    	var params={
    			ordersId:goodsId
    	};
    	 $ionicLoading.show();
    	validateException.validateException(params).success(function(result){
    		if(result.flag!=200){
    			dialogsManager.showMessage("已经申诉过啦!");
    			$ionicLoading.hide();
    			return;
    		}
    		$ionicLoading.hide();
    		$state.go('tab.myOrderComplain',{'orderNum':goodsId});
    	}).error(function(){
    		$ionicLoading.hide();
    	});
    	 $timeout(function(){$ionicLoading.hide();},pathService.getTimeout());
    };
    //晒单按钮
    _scope.open = function(orderId,goodsId){
    	var params={
    			orderNum:orderId
    	};
    	$ionicLoading.show();
    	isExposure.isExposure(params).success(function(result){
    		if(result.flag!=200){
    			dialogsManager.showMessage("已经晒过啦!");
    			$ionicLoading.hide();
    			return;
    		}
    		$ionicLoading.hide();
    		$state.go('tab.showOrderSubmit',{'orderNum':orderId,'goodsId':goodsId});
    	}).error(function(){
    		$ionicLoading.hide();
    	});
    	$timeout(function(){$ionicLoading.hide();},pathService.getTimeout());
    };
    //分享按钮
    _scope.share = function(orderNum,platformGoodsId){
      //判断是否是在app中
      var isApp =false;
      if ($location.absUrl().indexOf('file://')>=0) {
        isApp = true;
      }
     if(!userId || !isApp){
       $state.go('toLogin', {'pUId': $location.search()['pUId']?$location.search()['pUId']:''});
        return;
      }
      var shareUrl=pathService.get3wSource()+'/www/#/toShare'+'?pUId=' + userId;
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: '<p>分享到QQ</p>'},
          {text: '<p>分享到QQ空间</p>'},
          {text: '<p>分享到微信</p>'},
          {text: '<p>分享到微信朋友圈</p>'},
          {text: '<p>分享到微博</p>'}
        ],
        cancelText: '取消',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          if (0 == index) {
            hideSheet();
            ShareAppGetScore.getShareAppScore(userId,4,'订单'+orderNum+'的分享',platformGoodsId);
            QQSDK.checkClientInstalled(function () {
              var args = {};
              args.scene = QQSDK.Scene.QQ;
              args.url = shareUrl;
              args.title = '积分吧';
              //args.description = '积分吧APP下载，更多惊喜快来积分吧！';
              args.description = '购物优惠返利就来积分吧';
              args.image = 'http://106.14.18.10/sandbox/www/img/sharescreen.jpg';
              args.appName = '积分吧';
              QQSDK.shareNews(function () {
                dialogsManager.showMessage("分享成功！");
              }, function (failReason) {
                hideSheet();
              }, args);
            }, function () {
              // if installed QQ Client version is not supported sso,also will get this error
              dialogsManager.showMessage("请安装QQ！");
            });
          } else if (1 == index) {
            hideSheet()
            ShareAppGetScore.getShareAppScore(userId,4,'订单'+orderNum+'的分享',platformGoodsId);
            //分享App成功获取积分
            QQSDK.checkClientInstalled(function () {
              var args = {};
              args.scene = QQSDK.Scene.QQZone;
              args.url = shareUrl;
              args.title = '积分吧';
              //args.description = '积分吧APP下载，更多惊喜快来积分吧！';
              args.description = '购物优惠返利就来积分吧';
              args.image = 'http://106.14.18.10/sandbox/www/img/sharescreen.jpg';
              args.appName = '积分吧';
              QQSDK.shareNews(function () {
                dialogsManager.showMessage("分享成功！");
              }, function (failReason) {
                hideSheet();
              }, args);
            }, function () {
              // if installed QQ Client version is not supported sso,also will get this error
              dialogsManager.showMessage("请安装QQ！");
            });

          } else if (2 == index) {
            hideSheet();
            ShareAppGetScore.getShareAppScore(userId,4,'订单'+orderNum+'的分享',platformGoodsId);
            Wechat.isInstalled(function (installed) {
              if(installed){
                Wechat.share({
                  message: {
                    title: '积分吧',
                    //description: _scope.goodsDetail.title,
                    description : '购物优惠返利就来积分吧',
                    thumb: 'http://106.14.18.10/sandbox/www/img/sharescreen.jpg',
                    media: {
                      type: Wechat.Type.WEBPAGE,
                      webpageUrl: shareUrl
                    }
                  },
                  //scene: Wechat.Scene.TIMELINE // share to Timeline
                  scene: Wechat.Scene.SESSION
                }, function () {
                  dialogsManager.showMessage("分享成功！");
                }, function (reason) {
                  hideSheet()
                });
              }else{
                dialogsManager.showMessage("请安装微信！");
              }
            });
          } else if (3 == index) {
            hideSheet();
            ShareAppGetScore.getShareAppScore(userId,4,'订单'+orderNum+'的分享',platformGoodsId);
            Wechat.isInstalled(function (installed) {
              if(installed){
                Wechat.share({
                  message: {
                    title: '积分吧',
                    //description: _scope.goodsDetail.title,
                    description : '购物优惠返利就来积分吧',
                    thumb: 'http://106.14.18.10/sandbox/www/img/sharescreen.jpg',
                    media: {
                      type: Wechat.Type.WEBPAGE,
                      webpageUrl: shareUrl
                    }
                  },
                  //scene: Wechat.Scene.TIMELINE // share to Timeline
                  scene: Wechat.Scene.TIMELINE
                }, function () {
                  dialogsManager.showMessage("分享成功！");
                }, function (reason) {
                  hideSheet()
                });
              }else{
                dialogsManager.showMessage("请安装微信！");
              }
            });
          } else if (4 == index) {
            hideSheet();
            ShareAppGetScore.getShareAppScore(userId,4,'订单'+orderNum+'的分享',platformGoodsId);
            YCWeibo.checkClientInstalled(function(){
              var args = {};
              args.url = shareUrl;
              args.title = '积分吧';
              //args.description = _scope.goodsDetail.title;
              args.description = '购物优惠返利就来积分吧';
                //args.imageUrl = _scope.goodsDetail.picLink;//if you don't have imageUrl,for android http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png will be the defualt one
                args.defaultText = "";
              YCWeibo.shareToWeibo(function () {
                dialogsManager.showMessage("分享成功！");
              }, function (failReason) {
                hideSheet()
              }, args);
              //WEIBOINSTALL=true;
            },function(){
              dialogsManager.showMessage("请安装微博！");
              //WEIBOINSTALL=false;
            });

          }
        }
      })
    };
    var position;
    _scope.getScrollPosition=function () {
      //获取垂直滚动条到顶的距离
      position=$ionicScrollDelegate.getScrollPosition().top;
      //小与1500隐藏置顶按钮，否则显示
      if(position<1500){
        $timeout(function () {
          _scope.showTop=false;
        },100);
      }else{
        $timeout(function () {
          _scope.showTop=true;
        },100);
      }
    };
    //置顶
    _scope.goTop=function () {
      $ionicScrollDelegate.$getByHandle('orderList').scrollTop();
      _scope.showTop=false;
    };
    //下拉刷新
    _scope.doRefresh = function(e){
      _scope.show=false;
      _scope.more = true;
      currentPage = 1;
      var promise = OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle);
      promise.success(function (data) {
        if (data.flag == 500) {//登录失败
          dialogsManager.showMessage("网络故障,请稍后再试!");
          return false;
        }
        if(data.flag == 200){
          if(data.data == null || data.data.length == 0){
            _scope.more = false;
            _scope.show = true;
          }else{
            _scope.order = data.data;
          }
        }
      })
        .error(function (error) {
          dialogsManager.showMessage("网络故障,请稍后再试!");
          return false;
        });
      //广播结束事件
      $scope.$broadcast('scroll.refreshComplete');
    };
    //搜索下拉刷新
    _scope.searchDoRefresh = function(e){
      _scope.show=false;
      _scope.more = true;
      currentPage = 1;
      searchTitle = _scope.search?_scope.search:'';
      var promise = OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle);
      promise.success(function (data) {
        if (data.flag == 500) {//登录失败
          dialogsManager.showMessage("网络故障,请稍后再试!");
          return false;
        }
        if(data.flag == 200){
          if(data.data == null || data.data.length == 0){
            _scope.more = false;
            _scope.show = true;
          }
          searchOrderLists = data.data;
          _scope.searchOrderList = searchOrderLists;
        }
      })
        .error(function (error) {
          dialogsManager.showMessage("网络故障,请稍后再试!");
          return false;
        });
      //广播结束事件
      $scope.$broadcast('scroll.refreshComplete');
    };
    //上拉加载
    _scope.loadMore = function(){
      _scope.more = false;
      currentPage++;
      var promise = OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle);
      promise.success(function (data) {
        if (data.flag == 200) {
          _scope.more = true;
          if(data.data==null||data.data.length==0){
            _scope.more = false;
            _scope.show=true;
          }else {
            _scope.order = _scope.order.concat(data.data);
          }
        }
        $timeout(function () {
          _scope.$broadcast('scroll.infiniteScrollComplete');
        });
      });
      _scope.$broadcast('scroll.infiniteScrollComplete');
    };
    //搜索上拉加载
    _scope.searchLoadMore = function(){
      _scope.more = false;
      currentPage++;
      searchTitle = _scope.search?_scope.search:'';
      var promise = OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle);
      promise.success(function (data) {
        if (data.flag == 200) {
          _scope.more = true;
          if(data.data==null||data.data.length==0){
            _scope.more = false;
            _scope.show=true;
          }else {
            _scope.searchOrderList = _scope.searchOrderList.concat(data.data);
          }
        }
        $timeout(function () {
          _scope.$broadcast('scroll.infiniteScrollComplete');
        });
      });
      _scope.$broadcast('scroll.infiniteScrollComplete');
    };
    //搜索订单
    _scope.searchOrder = function(){
      $state.go('tab.myOrderList');
    };

    //查看商品详情
    _scope.findGoodsDetails = function (goodsId) {
      if(_scope.type == 4){
        return;
      }
      $state.go('tab.myOrderGoodsDetail',{'goodsId':goodsId})
    }
  });

