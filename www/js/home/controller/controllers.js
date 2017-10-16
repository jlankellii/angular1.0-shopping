angular.module('home.controllers', [])

.controller('searchGoodCtrl',searchGoodCtrl)

.controller('kindGoodsCtrl',kindGoodsCtrl)

  .controller('HomeCtrl', function($scope,
                                   $stateParams,
                                   $ionicSlideBoxDelegate,
                                   $timeout,
                                   $ionicLoading,
                                   $state,
                                   $location,
                                   $ionicActionSheet,
                                   $ionicScrollDelegate,
                                   $ionicPopup,
                                   $rootScope,
                                   GoodsModuleDetails,
                                   basicConfig,
                                   pathService,
                                   dialogsManager,
                                   ShareAppGetScore,
                                   takSer,
                                   messageSer,
                                   HomeService) {
		$scope.$on('$ionicView.enter', function () {//监听视图进入事件
			//获取内存中的推送内容
			var type = messageSer.getParams().type;//获取推送类型（1：商品详情,2：类目,3:其他）
			var data = messageSer.getParams().data;//获取推送data（商品时为商品id，类目时为类目id，其他时为空）
			var name = messageSer.getParams().name;//获取推送类目名字
			if(type!=''){//推送不为空
				if(type==300){//推送商品
					messageSer.clearParams();//清除service中的推送消息
					$state.go('tab.goodsDetail',{goodsId:data});//跳转至推送的商品详情
				}else if(type==301){//推送类目
					messageSer.clearParams();//清除service中的推送消息
					$state.go('tab.kindGoods',{categoryId:data,categoryName:name});
				}else{//推送其他
					messageSer.clearParams();//清除service中的推送消息
					$state.go('tab.messageList');//跳转到消息列表
				}
			}
      if (null != $scope.categories.length &&
        null != $scope.categories[$scope.currentCIndex]) {
        $location.hash($scope.categories[$scope.currentCIndex].id);
        $ionicScrollDelegate.$getByHandle("goodsCategories").anchorScroll(true);
      }
		});

    /**
     * 弹出分享框
     */
    var _rootScope = $rootScope;
    var _user = basicConfig.getObject('user');
    var shareUrl;

    //跳转站内通知
    $scope.goMessage = function(){
    	if(!basicConfig.getObject('user')){
    		dialogsManager.showMessage("请登录！");
    		return;
    	}
    	$state.go('tab.messageList');
    }
    _rootScope.attention = function(){
      dialogsManager.showMessage("研发中敬请期待！");
    };
    _rootScope.signIn = function(){
      _user = basicConfig.getObject('user');
      if(_user==null||_user.userId==null){
        $state.go("toLogin");
        return;
      }
      var _params={
        userId:_user.userId
      };
      takSer.signIn(_params).then(function(result){
        if(result.flag==200){
          dialogsManager.showMessage("签到成功");
        }else if(result.flag==400){
          dialogsManager.showMessage("已签到");
        }else if(result.flag==500){
          dialogsManager.showMessage(result.msg);
        }
      },function(){
        dialogsManager.showMessage("网络故障,请稍后再试!！");
      });
    };

    _rootScope.shareApp = function() {
      var isApp = false;
      //判断是否是在app中
      if ($location.absUrl().indexOf('file://')>=0) {
        isApp = true;
      }
      var _user = basicConfig.getObject('user');
      var  shareUrl;
      if (_user && isApp) {
        //10表示app分享，20表示商品分享
        shareUrl=pathService.get3wSource()+'/www/\#/toShare'+'?pUId=' + _user.userId;
        $rootScope.isAndroidBack = true;
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
              ShareAppGetScore.getShareAppScore(_user.userId,3,'平台分享','', function (result) {

              }, function (error) {

              });//分享App成功获取积分
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
              ShareAppGetScore.getShareAppScore(_user.userId,3,'平台分享','', function (result) {
              }, function (error) {
              });//分享App成功获取积分
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
              ShareAppGetScore.getShareAppScore(_user.userId,3,'平台分享','', function (result) {

              }, function (error) {

              });//分享App成功获取积分
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
                    hideSheet();
                  });
                }else{
                  dialogsManager.showMessage("请安装微信！");
                }
              });
            } else if (3 == index) {//app下载链接分享到微信朋友圈
              hideSheet();
              ShareAppGetScore.getShareAppScore(_user.userId,3,'平台分享','', function (result) {

              }, function (error) {

              });//分享App成功获取积分
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
                    hideSheet();
                  });
                }else{
                  dialogsManager.showMessage("请安装微信！");
                }
              });
            } else if (4 == index) {
              hideSheet();
              ShareAppGetScore.getShareAppScore(_user.userId,3,'平台分享','', function (result) {

              }, function (error) {

              });//分享App成功获取积分
              YCWeibo.checkClientInstalled(function(){
                var args = {};
                args.url = shareUrl;
                args.title = '积分吧';
                //args.description = '积分吧APP下载，更多惊喜快来积分吧！';
                args.description = '购物优惠返利就来积分吧';
                //args.imageUrl = 'http://img.alicdn.com/imgextra/i1/2259544175/TB2KapMgXXXXXX0XpXXXXXXXXXX_!!2259544175.jpg';
                args.appName = '积分吧';
                args.defaultText = "";
                YCWeibo.shareToWeibo(function () {
                  dialogsManager.showMessage("分享成功！");
                }, function (failReason) {
                  hideSheet();
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
    };

    $scope.homeSection = true;
    /**
     * 当前分类下标
     */
    $scope.currentCIndex = 0;
    $scope.preCIndex = null;
    $scope.afterCIndex = $scope.currentCIndex+1;

    /**
     * 商品分类列表，数组中每个元素为当前分类的集合数据,$scope.homeData 或 categoryData
     */
    $scope.goodsCategoryList = [];

    /**
     * 分类信息数组
     */
    $scope.categories = [];

    /**
     * 相关动画定义
     * @type {{}}
     */
    $scope.animObj = {};
    angular.forEach(['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend'], function(value){
      $scope.$on(value, function(event){
        $scope.animObj = {};
      });
    });

    //分页查询一次返回数目
    var count = 6;
    var receiveCount = 0;

    /**
     * 首页数据
     */
    $scope.homeData = {
      categoryIndex: 0,
      categoryId: '',
      currentPage: 1,
      isEmpty: true,
      canLoadMore: true,
      noMore: false,
      bannerList: [],
      modelList: [],
      advList: [],
      squareList: [],
      goodsList: [],
      showTop : false,

      /**
       * 查询首页商品列表数据
       */
      doRefresh: function () {
        this.currentPage = 1;
        HomeService.queryGoodsCategoryList(this.categoryId, this.currentPage, count, function (result) {
          $timeout(function () {
            if (0 == result.goods.length) {
              $scope.homeData.isEmpty = true;
              $scope.homeData.canLoadMore = false;
              $scope.homeData.noMore = true;
            }else if (count > result.goods.length) {
              $scope.homeData.isEmpty = false;
              $scope.homeData.canLoadMore = false;
              $scope.homeData.noMore = true;
            }else {
              $scope.homeData.isEmpty = false;
              $scope.homeData.canLoadMore = true;
              $scope.homeData.noMore = false;
            }
            $scope.homeData.goodsList = result.goods;
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
          });
        }, function (error) {
          $timeout(function () {
            receiveCount++;
            console.log(error);
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
          });
        });

      },
      loadMore: function () {
        this.currentPage++;
        HomeService.queryGoodsCategoryList(this.categoryId, this.currentPage, count, function (result) {
          $timeout(function () {
            if (count > result.goods.length) {
              $scope.homeData.canLoadMore = false;
              $scope.homeData.noMore = true;
            }else {
              $scope.homeData.canLoadMore = true;
              $scope.homeData.noMore = false;
            }
            $scope.homeData.goodsList = $scope.homeData.goodsList.concat(result.goods);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });

        }, function (error) {
          $timeout(function () {

            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });

      }
    };

    var categoryData = function () {
      var obj = new Object();
      obj.categoryIndex = 0;
      obj.categoryId = '';
      obj.currentPage = 1;
      obj.isEmpty = true;
      obj.canLoadMore = false;
      obj.noMore = false;
      obj.advList = [];
      obj.goodsList = [];
      obj.showTop = false;

      obj.doRefresh = function () {
        obj.canLoadMore = false;
        obj.currentPage = 1;
        HomeService.queryGoodsCategoryList(obj.categoryId, obj.currentPage, count, function (result) {
          $timeout(function () {
            obj.goodsList = result.goods;
            obj.advList = result.banner;
            if (0 == result.goods.length) {
              obj.isEmpty = true;
              obj.canLoadMore = false;
              obj.noMore = false;
            }else if (count > result.goods.length) {
              obj.isEmpty = false;
              obj.canLoadMore = false;
              obj.noMore = true;
            }else {
              obj.isEmpty = false;
              obj.canLoadMore = true;
              obj.noMore = false;
            }
            $ionicLoading.hide();

            $scope.$broadcast('scroll.refreshComplete');
          });
        }, function (error) {
          $timeout(function () {
            console.log(error);
            $scope.$broadcast('scroll.refreshComplete');
          });
        });

      };

      obj.loadMore = function () {
        this.currentPage++;
        HomeService.queryGoodsCategoryList(obj.categoryId, obj.currentPage, count, function (result) {
          $timeout(function () {
            if (count > result.goods.length) {
              obj.canLoadMore = false;
              obj.noMore = true;
            }else {
              obj.canLoadMore = true;
              obj.noMore = false;
            }
            obj.goodsList = obj.goodsList.concat(result.goods);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        }, function (error) {
          $timeout(function () {
            console.log(error);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });

        });
      };

      return obj;
    };

    /**
     * <p>描述: 加载首页时先请求分类数据，再根据分类请求每个分类下的商品列表</p>
     * <p>创建人: YangLiu</p>
     * <p>创建时间: 1/10/17</p>
     * <p>修改人: </p>
     * <p>修改时间: </p>
     * <p>修改备注: </p>
     */
    $ionicLoading.show();
    HomeService.getHomeData(function (result) {

      /**
       * 首页商品列表数据
       */
      $scope.categories = result.group;

      $scope.homeData.categoryId = $scope.categories[0].id;
      $scope.homeData.modelList = result.label;
      $scope.homeData.bannerList = result.customBanner;
      $scope.homeData.squareList = result.custom;

      $scope.homeData.doRefresh();
      $ionicSlideBoxDelegate.update();

      /**
       * 初始化动画
       */
      for(var i = 0; i < result.group.length; i++)
      {
        $scope.animObj['anim' + i] = "";
      }
      /**
       * 查询首页之后的分类商品列表数据
       * 遍历每种分类，请求改分类下的商品列表数据
       * 初始先请求1个分类
       */
      var initNum = $scope.categories.length>2?2:$scope.categories.length;
      for (var j = 1; j < $scope.categories.length; j++){
        var categoryEntity = categoryData();
        categoryEntity.categoryIndex = j;
        categoryEntity.categoryId = $scope.categories[j].id;
        $scope.goodsCategoryList.push(categoryEntity);
        if (j < initNum) {
          categoryEntity.doRefresh();
        }

      }

    }, function (error) {
      $ionicLoading.hide();
      console.log(error);
    });

    /**
     * 点击home直接跳转到首页
     */
    _rootScope.goHome = function () {
      $state.go('tab.home');
      $scope.homeSection = true;
      $scope.currentCIndex = 0;
      $scope.preCIndex = null;
      $scope.afterCIndex = $scope.currentCIndex+1;
      slideHasChanged(0);

      $timeout(function () {
        //获取垂直滚动条滑动到顶
        $ionicScrollDelegate.$getByHandle("homeView").scrollTop();
      },500);

    };

    $scope.animslide = "";

    $scope.seePrevious = function (animate) {
      if (null != $scope.preCIndex) {
        var preClassId = $scope.categories[$scope.preCIndex].id;
        $scope.choseCategory(preClassId, $scope.preCIndex);
        $scope.animslide = "no-mo-slideright";
      }else {
        // dialogsManager.showMessage("已经是第一页了！");
      }
    };

    $scope.seeAfter = function (animate) {
      if (null != $scope.afterCIndex) {
        $scope.animslide = "no-mo-slideleft";
        var afterClassId = $scope.categories[$scope.afterCIndex].id;
        $scope.choseCategory(afterClassId, $scope.afterCIndex);
      }else {
        dialogsManager.showMessage("已经是最后一页了！");
      }
    };

    /**
     * 点击分类查询商品显示该类商品列表
     * @param id
     * @param index
     */
    $scope.choseCategory=function(id, index){
      if($scope.currentCIndex == index){
        return;
      }

      $scope.currentCIndex = index;
      $scope.preCIndex = (index-1)<0?null:index-1;
      $scope.afterCIndex = (index+1)>$scope.categories.length-1?null:index+1;

      $location.hash(id);
      $ionicScrollDelegate.$getByHandle("goodsCategories").anchorScroll(true);
      if (0 == $scope.currentCIndex) {
        $scope.homeSection = true;
        // $timeout(function () {
        //   $ionicScrollDelegate.$getByHandle('homeView').scrollTop();
        // });
      }else{
        $scope.homeSection = false;
        slideHasChanged(index);
      }

    };

    /**
     * 第0页是首页，goodsCategoryList中的第0个数据是页面的第一页
     * index-2 goodsCategoryList[index-2]数据对应上一页
     * index-1 当前显示页
     * index 下一页
     */
    var slideHasChanged = function (index) {
      $scope.currentCIndex = index;

      $location.hash($scope.categories[index].id);
      $ionicScrollDelegate.$getByHandle("goodsCategories").anchorScroll(true);

      if (0 == index) {
        return;
      }

      if (0 <= index-2) {
        if (true == $scope.goodsCategoryList[index-2].isEmpty) {
          $scope.goodsCategoryList[index-2].doRefresh();
        }
      }

      if (true == $scope.goodsCategoryList[index-1].isEmpty) {
        $scope.goodsCategoryList[index-1].doRefresh();
        $ionicLoading.show();
      }else {
        $ionicLoading.hide();
      }

      if (index < $scope.goodsCategoryList.length) {
        if (true == $scope.goodsCategoryList[index].isEmpty) {
          $scope.goodsCategoryList[index].doRefresh();
        }
      }

    };

    $scope.prefix=pathService.getFilePath();

    //置顶按钮隐藏与显示
    var position = 0;
    $scope.getScrollLength=function (index, handleId) {
      //获取垂直滚动条到顶的距离
      if ($scope.homeSection) {
        position=$ionicScrollDelegate.$getByHandle('homeView').getScrollPosition().top;
        if (1000 < position) {
          $timeout(function () {
            $scope.homeData.showTop = true;
          },100);
        }else {
          $timeout(function () {
            $scope.homeData.showTop = false;
          },100);
        }
      }else {
        position=$ionicScrollDelegate.$getByHandle(handleId).getScrollPosition().top;
        if (1000 < position) {
          $timeout(function () {
            $scope.goodsCategoryList[index].showTop = true;
          },100);
        }else {
          $timeout(function () {
            $scope.goodsCategoryList[index].showTop = false;
          },100);
        }
      }

    };
    //置顶
    $scope.goTop=function (index, handleId) {
      if ($scope.homeSection) {
        $ionicScrollDelegate.$getByHandle('homeView').scrollTop();
        $scope.homeData.showTop = false;
      }else {
        $ionicScrollDelegate.$getByHandle(handleId).scrollTop();
        $scope.goodsCategoryList[index].showTop = false;
      }

    };

    $scope.goAdvGoodsList = function (advId, advImgUrl, advTitle) {
      $state.go('tab.advGoodsList',{'advGoodsId':advId,'advImgUrl':advImgUrl,'advTitle':advTitle});
    };

    $scope.goSquareGoodsList = function (squareId, squareTitle) {
      $state.go('tab.squareGoodsList',{'squareGoodsId':squareId, 'squareTitle':squareTitle});
    };

  })

  .controller('PlatformGoLogin',function($state,$scope){
    var _scope = $scope;
    _scope.goLogin = function(){
      $state.go('register');
    }
  });

/**
 * <p>方法描述:搜索商品（列表）</p>
 * <p>创建人: wangjian</p>
 * <p>创建时间: 2016.12.19</p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 *
 */
function searchGoodCtrl(
  $scope,
  searchGoodSer,
  basicConfig,
  $ionicScrollDelegate,
  dialogsManager,
  $templateCache,
  $state,
  $timeout,
  $ionicLoading,
  pathService,
  $ionicHistory,
  $stateParams){
  //basicConfig.removeObject('searchHistory');
  var _scope = $scope;
  //监听视图离开事件清理商品列表
  $scope.$on('$ionicView.beforeLeave', function () {
    if($ionicHistory.forwardView()){
      _scope.search='';
      _scope.goodList=[];
      _scope.goodsList=false;
      //显示搜索历史
      _scope.historyList=true;
      $scope.historys=basicConfig.getObject('searchHistory');
      //滚动条回滚顶部
      $ionicScrollDelegate.scrollTop();
    }
  });
  //搜索关键字
  var _keyWord;
  //显示搜索历史
  _scope.historyList=true;
  //搜索历史字段
  _scope.historyFont = '';
  //商品列表开关
  _scope.goodsList=false;
  //没有更多数据开关
  _scope.noMore = false;
  //上拉加载更多开关
  _scope.swich = false;
  var _pageNum = 1;
  //定义商品列表数组
  _scope.goodList=[];
  //获取访问历史
  var _historys = basicConfig.getObject('searchHistory');
  //首次访问时历史为空不做处理
  if(_historys){
    $scope.historys=_historys;
    _scope.historyFont = true;
  }
  _scope.searchInputFocus = true;
  //搜索商品
  _scope.searchGoods = function(){
    if(!_scope.search||!_scope.search.trim()){
      dialogsManager.showMessage("搜索内容不能为空！");
      return;
    }
    _scope.noMore = false;
    _scope.goodList=[];
    //滚动条回滚顶部
    $ionicScrollDelegate.scrollTop();
    //隐藏搜索历史
    _scope.historyList= false;
    _scope.goodsList=true;
    _keyWord = _scope.search;
    //获取参数
    _params ={
      keyWord:_keyWord,
      pageNumber:'1'
    };
    $ionicLoading.show();
    //调用service获取数据
    searchGoodSer.getGoodsList(_params).then(function(result){
      if(!result.data||result.data.length==0){
        _scope.noMore=true;
      }else{
        //结果集加进goodList
        _scope.goodList = _scope.goodList.concat(result.data);
        _scope.swich= true;
      }
      $ionicLoading.hide();
    },function(result){
      $ionicLoading.hide();
    });
    $timeout(function(){$ionicLoading.hide();},pathService.getTimeout());
    //获取搜索历史
    var _data_=basicConfig.getObject('searchHistory');
    //历史为空时定义为数组，push搜索关键字，持久化搜索历史
    if(!_data_){
      _data_=[];
      _data_.push(_scope.search);
      basicConfig.setObject('searchHistory',_data_);
    }else if(_data_.length<6){//历史不为空 倒叙，push新关键字，倒叙，持久化搜索历史
      //遍历搜索历史有相同关键词删除旧关键次
      for(var i =0;i<_data_.length;i++){
        if(_data_[i]==_scope.search.trim()){
          _data_.splice(i,1);
        }
      }
      _list_=_data_.reverse();
      _list_.push(_scope.search);
      _list_.reverse();
      basicConfig.setObject('searchHistory',_list_);
    }else if(_data_.length>=6){//限制持久化的搜索历史长度，超长时倒叙，删除第一个，push新关键字，倒叙，持久化
      var _swich_ = false;
      //遍历搜索历史有相同关键词删除旧关键次
      for(var i =0;i<_data_.length;i++){
        if(_data_[i]==_scope.search.trim()){
          _data_.splice(i,1);
          _swich_ = true;
        }
      }
      _list_=_data_.reverse();
      if(!_swich_){
        _list_.shift();
      }
      _list_.push(_scope.search);
      _list_.reverse();
      basicConfig.setObject('searchHistory',_list_);
    }
    _pageNum = 1;
    _scope.searchInputFocus = false;
    cordova.plugins.Keyboard.close();
  };
  _scope.loadMore = function(){
    _scope.noMore = false;
    _scope.swich = false;
    _pageNum+=1;
    //获取参数
    _params ={
      keyWord:_keyWord,
      pageNumber:_pageNum
    };
    //调用service获取数据
    searchGoodSer.getGoodsList(_params).then(function(result){
      if(!result.data||result.data.length==0){
        _scope.noMore=true;
      }else{
        $timeout(function(){
          _scope.goodList = _scope.goodList.concat(result.data);
          _scope.swich= true;
        });
      }
      $timeout(function(){$scope.$broadcast('scroll.infiniteScrollComplete')});
    },function(result){
      $timeout(function(){$scope.$broadcast('scroll.infiniteScrollComplete')});
    });
  };
  //点击搜索历史中的词条，搜索该词条
  _scope.searchHistory= function(e){
    _scope.noMore = false;
    //清空商品列表
    _scope.goodList=[];
    _keyWord = e.history;
    _scope.search = e.history;
    //隐藏搜索历史
    _scope.historyList= false;
    _scope.goodsList=true;
    //获取参数
    _params ={
      keyWord:_keyWord,
      pageNumber:'1'
    };
    //调用service获取数据
    $ionicLoading.show();
    searchGoodSer.getGoodsList(_params).then(function(result){
      if(!result.data||result.data.length==0){
        _scope.noMore=true;
      }else{
        _scope.goodList = _scope.goodList.concat(result.data);
        _scope.swich= true;
      }
      $ionicLoading.hide();
    },function(result){
      $ionicLoading.hide();
    });
    $timeout(function(){$ionicLoading.hide();},pathService.getTimeout());
    _pageNum = 1;
  };
  //输入框改变时
  _scope.backHistory = function(){
    $scope.historys=basicConfig.getObject('searchHistory');
    if($scope.historys){
      _scope.historyFont = true;
    }
    //上拉加载更多开关
    _scope.swich = false;
    _scope.noMore = false;
    //清空商品列表
    _scope.goodList=[];
    //商品列表开关
    _scope.goodsList=false;
    //显示搜索历史
    _scope.historyList=true;
    //滚动条回滚顶部
    $ionicScrollDelegate.scrollTop();
    _pageNum = 1;
  };
  //置顶按钮隐藏与显示
  var position;
  _scope.getScrollPosition=function () {
    position=$ionicScrollDelegate.getScrollPosition().top;
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
  _scope.goTop=function () {
    $ionicScrollDelegate.scrollTop();
    _scope.showTop=false;
  }
}
function kindGoodsCtrl(
		$scope,
		$stateParams,
		$ionicScrollDelegate,
		HomeService,
		$timeout,
		$state,
		$ionicLoading){

	var _scope = $scope;
	var categoryId = $stateParams.categoryId;//获取类目id
	var categoryName = $stateParams.categoryName;//获取类目name
	_scope.categoryName = categoryName;
	var pageNum = 1;
	$scope.kindGoodsList =[];
	queryGoodsCategoryList(1,10);//初始化数据
	function queryGoodsCategoryList(pageNum,pageSize){
		if(pageNum==1){
			$ionicLoading.show();//显示loading
		}
		$scope.canLoadMore = false;
		HomeService.queryGoodsCategoryList(categoryId, pageNum, pageSize, function (result) {
			if (0 == result.goods.length) {
				$scope.isEmpty = true;
				$scope.canLoadMore = false;
				$scope.noMore = true;
				$ionicLoading.hide();
				$timeout(function(){$scope.kindGoodsList = $scope.kindGoodsList.concat(result.goods);});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}else if (pageSize > result.goods.length) {
				$scope.isEmpty = false;
				$scope.canLoadMore = false;
				$scope.noMore = true;
				$ionicLoading.hide();
				$timeout(function(){$scope.kindGoodsList = $scope.kindGoodsList.concat(result.goods);});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}else {
				$scope.isEmpty = false;
				$scope.canLoadMore = true;
				$scope.noMore = false;
				$ionicLoading.hide();
				$timeout(function(){$scope.kindGoodsList = $scope.kindGoodsList.concat(result.goods);});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
			$timeout(function(){$scope.$broadcast('scroll.infiniteScrollComplete')});

		}, function (error) {
			$ionicLoading.hide();
			console.log(error);
			$timeout(function(){$scope.$broadcast('scroll.infiniteScrollComplete')});
		});
	}
	_scope.loadMore = function(){
		$scope.canLoadMore = false;
		pageNum++;
		queryGoodsCategoryList(pageNum,10);
	};
	_scope.goToGoodsDetil = function(_goodsId){
		var viewName = $state.current.name;
		if(viewName == 'tab.memberKindGoods'){
			$state.go('tab.messageGoodsDetil',{goodsId:_goodsId});
		}else if(viewName == 'tab.kindGoods'){
			$state.go('tab.goodsDetail',{goodsId:_goodsId});
		}
	};
	   //置顶按钮隐藏与显示
    var position;
    _scope.getScrollPosition=function () {
       position=$ionicScrollDelegate.getScrollPosition().top;
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
    _scope.goTop=function () {
      $ionicScrollDelegate.scrollTop();
      _scope.showTop=false;
    }
}
