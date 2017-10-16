angular.module('share.controllers', [])
.controller('shareCtrl',shareCtrl);

function shareCtrl(shareService,$scope,basicConfig,$ionicLoading,dialogsManager,$ionicScrollDelegate,$timeout){
	var _scope = $scope;
	//定义分享商品数组
	_scope.shareList = [];
	//没有更多数据开关
	_scope.noMore = false;
	//上拉加载更多开关
	_scope.swich = false;
	var _flag = false;
	var _pageNum = 1;
	//获取参数
	var _userId = basicConfig.getObject('user').userId;
	var _params ={
			pageNumber:'1',
			userId:_userId
	};
	//loading
	$ionicLoading.show();
	//实例化时直接请求分享列表数据
	shareService.getShareList(_params).then(function(result){
		$ionicLoading.hide();
		if(result.flag==200){
			if(!result.data||result.data.length==0){
				_scope.noMore=true;
				_scope.swich = false;
			}else{
				_scope.shareList = _scope.shareList.concat(result.data);
				_scope.swich = true;
			}
		}else{
			dialogsManager.showMessage(result.msg);
		}
	},
	function(){
		$ionicLoading.hide();
		dialogsManager.showMessage("网络故障请稍后重试！");
	});

	_scope.doRefresh = function (){
		_flag = true;
		var _params ={
				pageNumber:'1',
				userId:_userId
		};
		_scope.shareList=[];
		shareService.getShareList(_params).then(function(result){
			//滚动条回滚顶部
			$ionicScrollDelegate.scrollTop();
			_flag = false;
			$ionicLoading.hide();
			if(result.flag==200){
				if(!result.data||result.data.length==0){
					_scope.noMore=true;
					_scope.swich = false;
				}else{
					$timeout(function(){
						_scope.shareList = _scope.shareList.concat(result.data);
						_scope.swich = true;
					});
				}
			}else{
					dialogsManager.showMessage(result.msg);
			}
			$timeout(function(){
				$scope.$broadcast('scroll.refreshComplete');
			});
		},function(){
			_flag = false;
			$timeout(function(){
				$scope.$broadcast('scroll.refreshComplete');
			});
			dialogsManager.showMessage("网络故障请稍后重试！");
		});
	};
	//上拉加载更多
	_scope.loadMore = function(){
		if(_flag){
			$scope.$broadcast('scroll.infiniteScrollComplete');
			return;
		}
		_scope.noMore = false;
		_scope.swich = false;
			_pageNum+=1;
			//获取参数
			_params ={
					pageNumber:_pageNum,
					userId:_userId
			};
			//调用service获取数据
			shareService.getShareList(_params).then(
					//获取商品集
					function(result){
						if(!result.data||result.data.length==0){
							_scope.noMore = true;
							_scope.swich = false;
						}else{
							$timeout(function(){
								_scope.shareList = _scope.shareList.concat(result.data);
								_scope.swich = true;
							});
						}
						$timeout(function(){
							$scope.$broadcast('scroll.refreshComplete');
						});
					},
					function (){
						$timeout(function(){
							$scope.$broadcast('scroll.refreshComplete');
						});
						dialogsManager.showMessage("网络故障请稍后重试！");
					});

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
