angular.module('member.mySubordinateController', [])

  .controller('MySubordinateCtl', function ($scope,
                                            $ionicScrollDelegate,
                                            $timeout,
                                            $ionicLoading,
                                            MySubordinateAttention,
                                            basicConfig,
                                            dialogsManager) {
    //上拉加载更多开关
    $scope.more=true;
    //默认选择所有下线
    $scope.all = true;
    $scope.first = false;
    $scope.second = false;
    //默认选择下线业绩
    $scope.isActive = true;
    $scope.noActive = false;
    $scope.sub = '';
    //分页查询下线业绩全部页
    var allSubordinatePage = 1;
    //分页查询下线业绩一级分销页
    var firstSubordinatePage = 1;
    //分页查询下线业绩二级分销页
    var secondSubordinatePage = 1;
    //我的下线发展状况页
    var mySubordinatePage = 1;
    $scope.noMore = false;

    //下线发展状况
    $scope.subordinateStateList = [];
    //下拉刷新页面
    var refreshState = 1;
    //全部分销状态
    var allType = 0;
    //一级分销状态
    var firstType = 1;
    //二级分销状态
    var secondType = 2;

    var _user;
    if(!_user) {
      _user = basicConfig.getObject('user');
    }

    $ionicLoading.show();
    MySubordinateAttention.getUserInfoFormat(_user.userId,firstSubordinatePage,allType).success(function(result){
      if(result.flag == 200){
        if(result.data==null || result.data.length==0){
          $scope.show=true;
          $scope.more=false;
        }else {
          $scope.sub = result.data;
        }
      }else{
        dialogsManager.showMessage("网络故障,请稍后再试!！");
      }
      $ionicLoading.hide();
    }).error(function (error) {
      $ionicLoading.hide();
    });
    $scope.contentUrl = 'js/member/templates/mySubordinateScore.html';

    MySubordinateAttention.getUserDescendant(_user.userId, mySubordinatePage, 0, function (result) {
      if (null == result.data || 0 == result.data.length){
        $scope.subStateshow = true;
      }else{
        $scope.subordinateStateList = result.data;
      }

    }, function (error) {

    });

    //下拉刷新
    $scope.doRefresh = function(){
      $scope.show = false;
      $scope.more = false;
      if(refreshState == 1){//下拉刷新全部下线业绩
        allSubordinatePage = 1;
        MySubordinateAttention.getUserInfoFormat(_user.userId,allSubordinatePage,allType).success(function (result) {
          if(result.flag == 200){
            if(result.data == null || result.data.length == 0){
              $scope.show = true;
              $scope.more = false;
            }else{
              $scope.sub = result.data;
            }
          }else{
            dialogsManager.showMessage("网络故障,请稍后再试!！");
          }
        });
        $scope.contentUrl = 'js/member/templates/mySubordinateScore.html';
      }else if(refreshState == 2){//下拉刷新一级分销业绩
        firstSubordinatePage = 1;
        MySubordinateAttention.getUserInfoFormat(_user.userId,firstSubordinatePage,firstType).success(function (result) {
          if(result.flag == 200){
            if(result.data == null || result.data.length == 0){
              $scope.show = true;
              $scope.more = false;
            }else{
              $scope.sub = result.data;
            }
          }else{
            dialogsManager.showMessage("网络故障,请稍后再试!！");
          }
        });
        $scope.contentUrl = 'js/member/templates/mySubordinateScore.html';
      }else if(refreshState == 3){//下拉刷新二级分享业绩
        secondSubordinatePage = 1;
        MySubordinateAttention.getUserInfoFormat(_user.userId,secondSubordinatePage,secondType).success(function(result){
          if(result.flag==200){
            if(result.data == null || result.data.length == 0){
              $scope.show = true;
              $scope.more = false;
            }else{
              $scope.sub = result.data;
            }

          }else{
            dialogsManager.showMessage("网络故障,请稍后再试!");
          }
        });
        $scope.contentUrl = 'js/member/templates/mySubordinateScore.html';
      }else if(refreshState == 4){//下拉刷新下线会员发展情况
        mySubordinatePage = 1;
        MySubordinateAttention.getUserDescendant(_user.userId, mySubordinatePage, 0, function (result) {
          $scope.subordinateStateList = result.data;
        }, function (error) {

        });
      }else if(refreshState == 5){//下拉刷新会员的下线

      }
      //广播结束事件
      $scope.$broadcast('scroll.refreshComplete');
    };

    //上拉加载更多
    $scope.loadMore = function(){
      if(refreshState == 1){//加载更多全部下线业绩 0表示查询全部下线
        allSubordinatePage++;
        MySubordinateAttention.getUserInfoFormat(_user.userId,allSubordinatePage,allType).success(function(result){
          if(result.flag==200){
            if(result.data==null||result.data.length==0){
              $scope.show=true;
              $scope.more=false;
            }else{
              $timeout(function () {
                //显示上拉加载返回的数据
                $scope.sub = $scope.sub.concat(result.data);
              });
            }
          }else{
            dialogsManager.showMessage("网络故障,请稍后再试!");
          }
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        },function () {
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });

      }else if(refreshState == 2){//加载更多一级分销业绩 1表示查询一级分销
        firstSubordinatePage++;
        MySubordinateAttention.getUserInfoFormat(_user.userId,firstSubordinatePage,firstType).success(function(result){
          if(result.flag==200){
            if(result.data==null||result.data.length==0){
              $scope.show=true;
              $scope.more=false;
            }else{
              $timeout(function () {
                //显示上拉加载返回的数据
                $scope.sub = $scope.sub.concat(result.data);
              });
            }
          }else{
            dialogsManager.showMessage("网络故障,请稍后再试!");
          }
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        },function () {
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });

      }else if(refreshState == 3){//加载跟多二级分销业绩 2表示二级分销
        secondSubordinatePage++;
        MySubordinateAttention.getUserInfoFormat(_user.userId,secondSubordinatePage,secondType).success(function(result){
          if(result.flag==200){
            if(result.data==null||result.data.length==0){
              $scope.show=true;
              $scope.more=false;
            }else{
              $timeout(function () {
                //显示上拉加载返回的数据
                $scope.sub = $scope.sub.concat(result.data);
              });
            }
          }else{
            $scope.more=false;
          }
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        },function () {
          $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });

      }else if(refreshState == 4){
        mySubordinatePage++;
        MySubordinateAttention.getUserDescendant(_user.userId, mySubordinatePage, 0, function (result) {
          if(result.data==null||result.data.length==0){
            $scope.show=true;
            $scope.noMore = true;
            $scope.more=false;
          }else{
            $timeout(function () {
              //显示上拉加载返回的数据
              $scope.subordinateStateList = $scope.subordinateStateList.concat(result.data);
            });
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function (error) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }

    };

    //查看下线业绩
    $scope.seeSubordinateSocre = function () {
      refreshState = 1;
      $scope.isActive = true;
      $scope.noActive = false;
      $scope.contentUrl = 'js/member/templates/mySubordinateScore.html';
    };

    //查看下线会员发展情况
    $scope.seeSubordinateState = function () {
      refreshState = 4;
      $scope.isActive = false;
      $scope.noActive = true;
      $scope.contentUrl = 'js/member/templates/mySubordinateState.html';
    };

    //查询所有的下级
    $scope.findAll = function(){
      $ionicScrollDelegate.scrollTop();
      $scope.sub = '';
      allSubordinateList = '';
      refreshState = 1;
      allSubordinatePage = 1;
      $scope.show=false;
      $scope.all = true;
      $scope.first = false;
      $scope.second = false;
      $scope.more = true;
      MySubordinateAttention.getUserInfoFormat(_user.userId,allSubordinatePage,allType).success(function (result) {
        if(result.flag == 200){
          if(result.data == null || result.data.length == 0){
            $scope.show=true;
            $scope.more=false;
          }else{
            $scope.sub = result.data;
          }
        }else{
          dialogsManager.showMessage("网络故障,请稍后再试!");
        }
      });

      $scope.contentUrl = 'js/member/templates/mySubordinateScore.html';
    };
    //查询一级下级
    $scope.findFirst = function () {
      $ionicScrollDelegate.scrollTop();
      $scope.sub = '';
      firstSubordinateList = '';
      refreshState = 2;
      firstSubordinatePage = 1;
      $scope.show=false;
      $scope.all = false;
      $scope.first = true;
      $scope.second = false;
      $scope.more = true;
      MySubordinateAttention.getUserInfoFormat(_user.userId,firstSubordinatePage,firstType).success(function (result) {
        if(result.flag == 200){
          if(result.data == null || result.data.length == 0){
            $scope.show=true;
            $scope.more=false;
          }else{
            $scope.sub = result.data;
          }
        }else {
          dialogsManager.showMessage("网络故障,请稍后再试!");
        }
      });

      $scope.contentUrl = 'js/member/templates/mySubordinateScore.html';
    };
    //查询二级下级
    $scope.findSecond = function () {
      $ionicScrollDelegate.scrollTop();
      $scope.sub = '';
      secondSubordinateList = '';
      refreshState = 3;
      secondSubordinatePage = 1;
      $scope.show=false;
      $scope.all = false;
      $scope.first = false;
      $scope.second = true;
      $scope.more = true;
      MySubordinateAttention.getUserInfoFormat(_user.userId,secondSubordinatePage,secondType).success(function (result) {
        if(result.flag == 200){
          if(result.data == null || result.data.length == 0){
            $scope.show=true;
            $scope.more=false;
          }else{
            $scope.sub = result.data;
          }
        }else{
          dialogsManager.showMessage("网络故障,请稍后再试!");
        }
      });
      $scope.contentUrl = 'js/member/templates/mySubordinateScore.html';
    };

    //

  })

  .filter('mySubordinateInfo', function (pathService) {
    return function (input, attribute) {
      var out = '';
      switch (attribute) {
        case 'avatar':
          if(null != input && 0 != input.length){
            out = pathService.getFilePath()+input;
          }
          break;
        default:
          break;
      }

      return out;
    }
  });
