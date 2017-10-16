/**
 * Created by user on 2016/12/31.
 */
angular.module('showOrder.showOrderController', [])

  .controller('MyShowOrderCtrl', function ($scope,
                                           $location,
                                           $ionicLoading,
                                           $state,
                                           $timeout,
                                           $ionicActionSheet,
                                           $ionicScrollDelegate,
                                           showOrderService,
                                           UserInfoSupport,
                                           basicConfig,
                                           ShareAppGetScore,
                                           pathService,
                                           dialogsManager) {
    $scope.isEmpty = false;
    $scope.noMore = false;
    $scope.canLoadMore = true;
    $scope.myShowOrderList = [];
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

    var currentIndex = 1;
    var pageSize = 10;
    var userId = UserInfoSupport.getUserEntity().userId;

    /**
     * 进入初始化数据查询
     */
    queryShowOrderList(currentIndex);

    /**
     * 下拉刷新
     */
    $scope.doRefresh = function () {
      currentIndex = 1;
      showOrderService.queryMyShowOrder(userId, currentIndex, pageSize,function (result) {
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
        $scope.myShowOrderList = result.data;
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
      showOrderService.queryMyShowOrder(userId, currentIndex, pageSize,function (result) {
        if (null == result.data || pageSize > result.data.length) {
          $scope.canLoadMore = false;
          $scope.noMore = true;
        }
        $scope.myShowOrderList = $scope.myShowOrderList.concat(result.data);

        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    /**
     * 置顶按钮隐藏与显示
     */
    var position;
    $scope.getScrollPosition=function () {
      //获取垂直滚动条到顶的距离
      position=$ionicScrollDelegate.$getByHandle('myShowOrderHandle').getScrollPosition().top;
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
      $ionicScrollDelegate.$getByHandle('myShowOrderHandle').scrollTop();
      $scope.showTop=false;
    };

    function queryShowOrderList() {
      $ionicLoading.show();
      showOrderService.queryMyShowOrder(userId, currentIndex, pageSize,function (result) {
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
        $ionicLoading.hide();
        $scope.myShowOrderList = result.data;
      }, function () {
        $scope.canLoadMore = false;
        $ionicLoading.hide();
      });
    }

    /**
     * 弹出分享框
     */
    $scope.shareAction = function(goodsName,id) {
      var isApp = false;
      //判断是否是在app中
      if ($location.absUrl().indexOf('file://')>=0) {
        isApp = true;
      }
      var _user = basicConfig.getObject('user');
      var  shareUrl;
      if (_user && isApp) {
        //10表示app分享，20表示商品分享
        shareUrl=pathService.get3wSource()+'/www/#/toShare'+'?pUId=' + _user.userId;
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
              ShareAppGetScore.getShareAppScore(_user.userId,2,goodsName+'的分享',id);//分享晒单成功获取积分
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
              hideSheet();
              ShareAppGetScore.getShareAppScore(_user.userId,2,goodsName+'的分享',id);//分享晒单成功获取积分
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

            } else if (2 == index) {//app下载链接分享到微信
              hideSheet();
              ShareAppGetScore.getShareAppScore(_user.userId,2,goodsName+'的分享',id);//分享晒单成功获取积分
              Wechat.isInstalled(function (installed) {
                if(installed){
                  Wechat.share({
                    message: {
                      title: '积分吧',
                      //description: '积分吧APP下载，更多惊喜快来积分吧！',
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
            } else if (3 == index) {//app下载链接分享到微信朋友
              hideSheet();
              ShareAppGetScore.getShareAppScore(_user.userId,2,goodsName+'的分享',id);//分享晒单成功获取积分
              Wechat.isInstalled(function (installed) {
                if(installed){
                  Wechat.share({
                    message: {
                      title: '积分吧',
                      //description: '积分吧APP下载，更多惊喜快来积分吧！',
                      description : '购物优惠返利就来积分吧',
                      thumb: 'http://106.14.18.10/sandbox/www/img/sharescreen.jpg',
                      media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: shareUrl
                      }
                    },
                    //scene: Wechat.Scene.SESSION // share to SESSION
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
              ShareAppGetScore.getShareAppScore(_user.userId,2,goodsName+'的分享',id);//分享晒单成功获取积分
              YCWeibo.checkClientInstalled(function(){
                var args = {};
                args.url = shareUrl;
                args.title = '积分吧';
                //args.description = '积分吧APP下载，更多惊喜快来积分吧！';
                args.description = '购物优惠返利就来积分吧';
                //args.imageUrl = 'http://img.alicdn.com/imgextra/i1/2259544175/TB2KapMgXXXXXX0XpXXXXXXXXXX_!!2259544175.jpg';
                args.appName = '积分吧';
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
      } else {
        $state.go('toLogin', {'pUId': $location.search()['pUId']?$location.search()['pUId']:''});
      }
    }


  })
  .filter('showOrderFilter', function (pathService) {
    return function (input, attribute) {
      var out = '';
      switch (attribute) {
        case 'avatar':
          if(null != input && 0 != input.length){
            out = pathService.getFilePath()+input;
          }
          break;
        case 'showPic':
          if (null != input && 0 != input.length) {
            out = pathService.getFilePath()+input;
          }
          break;
        case 'orderId':
          if (null != input && 5 < input.length) {
            out = input.substring(0, 5)+'*********'+input.substring(input.length-3);
          }else{
            out = '**********';
          }
          break;
        case 'scoreFormat':
          if (null != input && 1 < input) {
            out = Math.floor(input);
          }else{
            out = '<1';
          }

          break;
        case 'scoreFormatZero':
          if (null != input && 1 < input) {
            out = Math.floor(input);
          }else{
            out = '0';
          }

          break;
        default:
          break;
      }

      return out;
    }
  });
