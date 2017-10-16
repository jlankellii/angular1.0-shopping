angular.module('member.mySearchOrderController', [])
  .controller('mySearchOrderCtrl',function($scope,
                                           $ionicScrollDelegate,
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
                                           isExposure){
    var currentPage = 1;
    var _scope = $scope;
    var userId = basicConfig.getObject('user').userId;
    //初始选中全部
    _scope.show = false;
    _scope.more = true;
    _scope.total = true;
    _scope.future = false;
    _scope.hold = false;
    _scope.user = false;
    _scope.comolain = false;
    _scope.type = 0;
    _scope.searchOrderList = [];
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
      _scope.searchOrderList = [];
    };

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

    //申诉按钮
    _scope.comolainFun = function(goodsId){
      var params={
        ordersId:goodsId
      };
      $ionicLoading.show();
      validateException.validateException(params).success(function(result){
        if(result.flag!=200){
          dialogsManager.showMessage("已经申诉过啦!");
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
    _scope.open = function(goodsId){
      var params={
        orderNum:goodsId
      };
      $ionicLoading.show();
      isExposure.isExposure(params).success(function(result){
        if(result.flag!=200){
          dialogsManager.showMessage("已经晒过啦!");
          return;
        }
        $ionicLoading.hide();
        $state.go('tab.showOrderSubmit',{'orderNum':goodsId});
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

    //搜索下拉刷新
      _scope.searchDoRefresh = function(e){
        var searchTitle = _scope.search?_scope.search:'';
        if(!searchTitle){
          _scope.searchOrderList = [];
          dialogsManager.showMessage("请输入要搜索的内容!");
          $scope.$broadcast('scroll.refreshComplete');
          _scope.show = false;
          return false;
        }
        _scope.show=false;
        _scope.more = true;
        currentPage = 1;

        var promise = OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle);
        promise.success(function (data) {
          if (data.flag == 500) {//登录失败
            dialogsManager.showMessage("网络故障,请稍后再试!");
            $scope.$broadcast('scroll.refreshComplete');
            return false;
          }
          if(data.flag == 200){
            if(data.data == null || data.data.length == 0){
              _scope.more = false;
              _scope.show = true;
            }else {
              _scope.searchOrderList = data.data;
            }

          }
        })
          .error(function (error) {
            dialogsManager.showMessage("网络故障,请稍后再试!");
            $scope.$broadcast('scroll.refreshComplete');
            return false;
          });
        //广播结束事件
        $scope.$broadcast('scroll.refreshComplete');
      };


    //搜索上拉加载
    _scope.searchLoadMore = function(){
      if($scope.search=='' || $scope.search == null){
        _scope.$broadcast('scroll.infiniteScrollComplete');
        return;
      }
      _scope.more = false;
      _scope.show = false;
      currentPage++;
      var searchTitle = _scope.search?_scope.search:'';
      var promise = OrderAttention.getOrder(currentPage,userId,_scope.type,searchTitle);
      promise.success(function (data) {
        if (data.flag == 200) {
          _scope.more = true;
          if(data.data==null||data.data.length==0){
            _scope.more = false;
            _scope.show = true;
          }else{
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
      if($scope.search=='' || $scope.search == null){
        dialogsManager.showMessage("请输入要搜索的内容!");
        return;
      };
      //匹配html标签正则
      var reg = new RegExp('^<([^>\s]+)[^>]*>(.*?<\/\\1>)?$');
      if(reg.test($scope.search)){
        dialogsManager.showMessage("您输入的含有特殊字符，请重新输入!");
        return;
      };
      _scope.searchOrderList = [];
      _scope.show = false;
      //$ionicScrollDelegate.$getByHandle('orderList').scrollTop();
      _scope.searchType = 5;
      currentPage = 1;
      searchType = 2;
      var title = $scope.search;
      if(!_scope.type && _scope.type != 0){
        dialogsManager.showMessage("请选择要搜索的类型!");
        return;
      };
      $ionicLoading.show();
      OrderAttention.getOrder(currentPage,userId,_scope.type,title)
        .success(function(data){
          if(data.flag == 200){
            _scope.more = true;
            if(data.data == null || data.data.length == 0){
              _scope.more = false;
              _scope.show = true;
            }else{
              _scope.searchOrderList = data.data;
            }
          }
          $ionicLoading.hide();
          if (data.flag == 500) {//登录失败
            dialogsManager.showMessage("网络故障,请稍后再试!");
            return false;
          }
        })
        .error(function (error) {
          dialogsManager.showMessage("网络故障,请稍后再试!");
          $ionicLoading.hide();
          return false;
        });
      $timeout(function(){
        $ionicLoading.hide();
      },15000);
      cordova.plugins.Keyboard.close();
    };

    //查看商品详情
    _scope.findGoodsDetails = function (goodsId) {
      if(_scope.type == 4){
        return;
      }
      $state.go('tab.myOrderGoodsDetail',{'goodsId':goodsId})
    };
  });

