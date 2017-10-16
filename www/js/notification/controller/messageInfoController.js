angular.module('messageInfo.messageInfoCtr',[])
.controller('messageListCtr',messgeListCtr);

function messgeListCtr(
		messageSer,
		$ionicHistory,
		$scope,
		$timeout,
		$ionicScrollDelegate,
		$ionicActionSheet,
		$rootScope,
		basicConfig,
		$state,
		$ionicLoading,
		$cordovaBadge){
	var _scope = $scope;
	var pageNumber = 1;
	$scope.messageList=[];//清空列表
	_scope.canLoadMore = false;
	$scope.$on('$ionicView.beforeLeave', function () {
		$scope.messageList=[];
	});
	$scope.$on('$ionicView.enter',function(){//视图进入处理
		$rootScope.redButtonSwich = false;//清除红点
		$cordovaBadge.clear().then(function(){//视图进入站内信界面后清楚app图片上的1
    	},function(){
    	});//清除应用上方的1
		//初始化数据
		$ionicLoading.show();
		getMessage(1);
	});
	_scope.getDetil=function(type,commonKey){//点击消息
		if(type==300){//推送为商品
			if($state.current.name == 'tab.messageList'){
				$state.go('tab.goodsDetail',{goodsId:commonKey});
			}else if($state.current.name == 'tab.memberMessageList'){
				$state.go('tab.messageGoodsDetil',{goodsId:commonKey});
			}
		}else if(type==301){//推送为类目
			var list = commonKey.split('|');
			if(list.length>0){
				if($state.current.name == 'tab.messageList'){
					$state.go('tab.kindGoods',{categoryId:list[0],categoryName:list[1]});
				}else if($state.current.name == 'tab.memberMessageList'){
					$state.go('tab.memberKindGoods',{categoryId:list[0],categoryName:list[1]});
				}
			}
		}else if(type==302){//推送为链接
			window.open(commonKey, '_system', 'location=yes');  
		}
	}
	 //长按消息删除
	 $scope.deleteMsg = function(e,_id) {
		 return;//暂时不做删除通知处理
	   // 显示操作表
	   $ionicActionSheet.show({
	     destructiveText: '删除',
	     titleText: '您要删除该消息吗？',
	     cancelText: '取消',
	     buttonClicked: function(index) {
	    	 return true;
	     },
	     destructiveButtonClicked:function(){
	    	 _scope.messageList.splice(e,1);//从列表中移除该项
	    		var _params ={
	    				id:_id
	    		}
	    		messageSer.deleltMessage(_params);//请求删除
	    	 return true;
	     }
	   });
	 };
	 
	//刷新
	_scope.doRefresh = function(){
		$scope.messageList=[];
		pageNumber=1;
		getMessage(1);
	}
	
	//加载更多
	_scope.loadMore = function(){
		pageNumber++;
		_scope.canLoadMore = false;
		getMessage(pageNumber);
	}
	//获取消息
	function getMessage(pageNum){
		$scope.canLoadMore = false;
		var pageSize = 10;
		var _params = {
			pageNumber:pageNum,
			userId:basicConfig.getObject('user').userId
		};
		messageSer.getMessageList(_params).then(function(result){
			if (0 == result.data.length) {
				$scope.isEmpty = true;
				$scope.canLoadMore = false;
				$scope.noMore = false;
			}else if (pageSize > result.data.length) {
				$timeout(function(){$scope.messageList = $scope.messageList.concat(result.data);});
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.isEmpty = false;
				$scope.canLoadMore = false;
				$scope.noMore = true;
			}else {
				$timeout(function(){$scope.messageList = $scope.messageList.concat(result.data);});
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.isEmpty = false;
				$scope.canLoadMore = true;
				$scope.noMore = false;
			}
			$timeout(function(){$scope.$broadcast('scroll.infiniteScrollComplete');$scope.$broadcast('scroll.refreshComplete');});
			$ionicLoading.hide();
		},function(error){
			$timeout(function(){$scope.$broadcast('scroll.infiniteScrollComplete');$scope.$broadcast('scroll.refreshComplete');});
			$ionicLoading.hide();
		});
	}
   //置顶按钮隐藏与显示
    var position;
    _scope.getScrollPosition=function () {
       position=$ionicScrollDelegate.getScrollPosition().top;
      if(position<150){
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
};