angular.module('goods.shareDetailController', [])

  .controller('shareGoodsDetailCtrl', function ($scope,
                                                $ionicActionSheet,
                                                $location,
                                                GoodsDetailService,
                                                $stateParams,
                                                $ionicPopup,
                                                $state,
                                                basicConfig,
                                                pathService,
                                                getCouponLink,
                                                dialogsManager,
                                                $ionicLoading) {
    var _scope = $scope;
    _scope.goodsDetail = {};

    var goodsId = '';
    if (null == $stateParams.goodsId || 0 == $stateParams.goodsId.length) {
      goodsId = $location.search()['goodsId'];
    } else {
      goodsId = $stateParams.goodsId;
    }
    $ionicLoading.show();
    $scope.isEmpty = true;
    GoodsDetailService.queryGoodsDetail(goodsId, function (result) {
      $scope.isEmpty = false;
      _scope.goodsDetail = result.data;
      $ionicLoading.hide();
    }, function (error) {
      $ionicLoading.hide();
    });
    //点击领券按钮后：
    _scope.getCouponLink = function (couponLink) {
      var user = basicConfig.getObject("user");
      //判断是否是App
      var isApp = false;
      if ($location.absUrl().indexOf('file://') >= 0) {
        isApp = true;
      }
      //如果没有用户信息或者不是App就去登录页面
      if (!user) {
        $state.go('toLogin', {
          goodsId: goodsId,
          'tagId': $location.search()['tagId'] ? $location.search()['tagId'] : ''
        });
        return false;
      } else if (user && !isApp) {
        $state.go('toLogin', {
          goodsId: goodsId,
          'tagId': $location.search()['tagId'] ? $location.search()['tagId'] : ''
        });
        return false;
      }
        //储存领取优惠券的用户信息
        var userId = user.userId;
        var promise = getCouponLink.getCouponLinkMsg(goodsId, userId);
        //成功回调
        promise.success(function (result) {
          if (result.flag == 200) {
            //点击跳转淘宝领券页面
            var couponLink = _scope.goodsDetail.couponLink;
            window.open(couponLink, '_blank', 'location=no');
            return true;
          }
          if (result.flag == 500) {
            return false;
          }
        }).error(function (error) {
        });
    };
    /**
     * 首次进入商品详情页面弹出分享获利介绍
     */
    if (basicConfig.getObject('firstGoodsDetail') == null) {
      basicConfig.setObject('firstGoodsDetail', 1);//第一次进入商品详情页，在本地储存一个对象
      var confirmPopup = $ionicPopup.alert({
        title: '分享返利',
        template: '登录分享商品后，商品被购买，分享者与买家均可以获得积分返利',
        okText: '确认',
        okType: 'button-small myTitle-bg'
      });
    }

    /**
     * 弹出分享框
     */
    _scope.hideSheet = function () {
      //获取储存在本地user对象
      var _user = basicConfig.getObject('user');
      var shareUrl;
      //获取路径中参数为tagId的值
      var _tagId = $location.search()['tagId'];
      var isApp = false;
      //判断是否是在app中
      if ($location.absUrl().indexOf('file://') >= 0) {
        isApp = true;
      }
      //登陆了且在app中
      if (_user && isApp) {
        if ($location.absUrl().indexOf('?') > 0) {//非第一次分享链接
          var wapShareUrl = 'http://106.14.18.10/www/index.html#/tab/goodsDetail/' + '?tagId=' + $location.search()['tagId'] + '&goodsId=' + _scope.goodsDetail.id
          shareUrl = pathService.get3wSource() + wapShareUrl.substr(wapShareUrl.indexOf('/www/'))
        } else {//第一次分享链接
          var wapShareUrl = 'http://106.14.18.10/www/index.html#/tab/goodsDetail/' + '?tagId=' + _user.userId + '&goodsId=' + _scope.goodsDetail.id;
          shareUrl = pathService.get3wSource() + wapShareUrl.substr(wapShareUrl.indexOf('/www/'))
        }
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
              ShareAppGetScore.getShareAppScore(_user.userId,1,_scope.goodsDetail.title,goodsId);
              QQSDK.checkClientInstalled(function () {
                var args = {};
                args.scene = QQSDK.Scene.QQ;
                args.url = shareUrl;
                args.title = '积分吧';
                //args.description = '积分吧APP下载，更多惊喜快来积分吧！';
                args.description = '购物优惠返利就来积分吧';
                args.image = _scope.goodsDetail.picLink;
                args.appName = _scope.goodsDetail.title;
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
              ShareAppGetScore.getShareAppScore(_user.userId,1,_scope.goodsDetail.title,goodsId);
              //分享App成功获取积分
              QQSDK.checkClientInstalled(function () {
                var args = {};
                args.scene = QQSDK.Scene.QQZone;
                args.url = shareUrl;
                args.title = _scope.goodsDetail.title;
                //args.description = '积分吧APP下载，更多惊喜快来积分吧！';
                args.description = '购物优惠返利就来积分吧';
                args.image = _scope.goodsDetail.picLink;
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
              ShareAppGetScore.getShareAppScore(_user.userId,1,_scope.goodsDetail.title,goodsId);
              Wechat.isInstalled(function (installed) {
                if(installed){
                  Wechat.share({
                    message: {
                      title: _scope.goodsDetail.title,
                      //description: _scope.goodsDetail.title,
                      description : '购物优惠返利就来积分吧',
                      thumb: _scope.goodsDetail.picLink,
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
                    hideSheet();
                  });
                }else{
                  dialogsManager.showMessage("请安装微信！");
                }
              });
            } else if (3 == index) {
              hideSheet();
              ShareAppGetScore.getShareAppScore(_user.userId,1,_scope.goodsDetail.title,goodsId);
              Wechat.isInstalled(function (installed) {
                if(installed){
                  Wechat.share({
                    message: {
                      title: _scope.goodsDetail.title,
                      //description: _scope.goodsDetail.title,
                      description : '购物优惠返利就来积分吧',
                      thumb: _scope.goodsDetail.picLink,
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
              ShareAppGetScore.getShareAppScore(_user.userId,1,_scope.goodsDetail.title,goodsId);
              YCWeibo.checkClientInstalled(function(){
                var args = {};
                args.url = shareUrl;
                args.title = _scope.goodsDetail.title;
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
      } else if (!_user) {//没登录跳到登陆页面
        $state.go('toLogin', {
          'goodsId': _scope.goodsDetail.id,
          'tagId': $location.search()['tagId'] ? $location.search()['tagId'] : '',
          'type': ''
        });
      } else if (_user && !isApp) {//浏览器中没有清除缓存有用户信息直接跳到登陆页面
        $state.go('toLogin', {
          'goodsId': _scope.goodsDetail.id,
          'tagId': $location.search()['tagId'] ? $location.search()['tagId'] : '',
          'type': ''
        });
      } else {
        $state.go('toDown');
      }
    }
  });
