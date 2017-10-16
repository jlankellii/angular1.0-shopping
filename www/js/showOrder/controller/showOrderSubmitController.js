/**
 * Created by user on 2016/12/31.
 */
angular.module('showOrder.showOrderSubmit', [])

  .controller('ShowOrderSubmitCtrl', function ($scope,
                                               $ionicHistory,
                                               $stateParams,
                                               $timeout,
                                               CameraTool,
                                               $ionicActionSheet,
                                               showOrderService,
                                               UserInfoSupport,
                                               $ionicLoading,
                                               dialogsManager,
                                               pathService) {

    var userId = UserInfoSupport.getUserEntity().userId;
    var order = $stateParams.orderNum;
    var _goodsId = $stateParams.goodsId
    $scope.input = {desc: ''};
    $scope.photoUrl = '';
    $scope.rollback = function(){
    	$ionicHistory.goBack();
    };
    //定义一个数组 映射五颗星星的位置和图片
    $scope.starArray = [
      {"id":1, "src":"img/score.png"},
      {"id":2, "src":"img/score.png"},
      {"id":3, "src":"img/score.png"},
      {"id":4, "src":"img/score.png"},
      {"id":5, "src":"img/score.png"}
    ];
    //初始化评价星级为5
    $scope.currentStar = 5;

    function changeStars(){
      for(var i = 0;i < $scope.starArray.length; i++){
        if($scope.currentStar >= $scope.starArray[i].id){
          $scope.starArray[i].src = "img/score.png";
        }else{
          $scope.starArray[i].src = "img/score_no.png";
        }
      }
    }

    //点击星星的操作
    $scope.clickStar = function(item){
      $scope.currentStar = item.id;
      changeStars();
    };

    $scope.downAction = function () {
      if (0 == $scope.input.desc.length) {
        dialogsManager.showMessage("请输入描述");
        return;
      }
      if (100 < $scope.input.desc.length) {
        dialogsManager.showMessage("描述不超过100字");
        return;
      }
      var reg2 = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
      if (!reg2.test($scope.input.desc)) {
        dialogsManager.showMessage("描述禁止输入特殊字符");
        return;
      }
      if (null == $scope.photoUrl || 0 == $scope.photoUrl.length){
        dialogsManager.showMessage("请选择晒单图片");
        return;
      }

      var showOrderEntity = {
        userId: userId,
        order: order,
        score: $scope.currentStar,
        describe: $scope.input.desc,
        pic: $scope.photoUrl,
        goodsId:_goodsId};
      $ionicLoading.show();
      showOrderService.submitMyShowOrder(showOrderEntity, function (result) {
        if (200 == result.flag){
          $scope.canLoadMore = false;
          dialogsManager.showMessage("晒单成功");
          $ionicLoading.hide();
          $ionicHistory.goBack();
        }else{
          $ionicLoading.hide();
        }
      }, function () {
        $ionicLoading.hide();
        $scope.canLoadMore = false;
      });
      $timeout(function () {
        $ionicLoading.hide();
      },pathService.getTimeout());
    };

    $scope.selectPhoto = function () {
      $ionicActionSheet.show({
        buttons: [
          {text: '<p>拍照</p>'},
          {text: '<p>从相册中选择</p>'}
        ],
        cancelText: '<p>取消</p>',
        cancel: function () {

        },
        buttonClicked: function (index) {
          if (0 == index) {
            CameraTool.getFromCamera(function (imageUrl) {
              $scope.photoUrl = imageUrl;
            }, function (error) {
              //get image filed
            });
          } else if (1 == index) {
            CameraTool.getFromPhotolib(function (imageUrl) {
              $scope.photoUrl = imageUrl;
            }, function (error) {
              //get image filed
            });
          }
          return true;
        }
      });
    }

  });
