/**
 * Created by user on 2016/12/14.
 */

/**
 * <p>类描述: 用户信息修改模块</p>
 * <p>创建人:  liuyang</p>
 * <p>创建时间: 2016/12/14</p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 */

angular.module('member.profileModifyControllers', ['ion-datetime-picker'])

/**
 * <p>方法描述:修改用户昵称controller </p>
 * <p>创建人: liuyang</p>
 * <p>创建时间: </p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 */
  .controller('NameModifyCtrl', function ($scope,
                                          $ionicLoading,
                                          $ionicHistory,
                                          $timeout,
                                          dialogsManager,
                                          UserInfoSupport,
                                          UserInfoService,
                                          pathService) {
    $scope.$on('$ionicView.beforeEnter', function () {
      var userEntity = UserInfoSupport.getUserEntity();
      $scope.userinfo = {alias: userEntity.alias};
      $scope.input = {alias: ''};
    });

    $scope.downAction = function () {
      if (null == $scope.input.alias || 0 == $scope.input.alias.length) {
        dialogsManager.showMessage("昵称不能为空");
        return;
      }
      if (11 < $scope.input.alias.length) {
        dialogsManager.showMessage("昵称不超过11字");
        return;
      }
      var reg = /\s/;
      if (reg.test($scope.input.alias)) {
        dialogsManager.showMessage("昵称禁止输入空格");
        return;
      }
      var reg2 = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
      if (!reg2.test($scope.input.alias)) {
        dialogsManager.showMessage("昵称禁止输入特殊字符");
        return;
      }

      var userEntity = UserInfoSupport.getUserEntity();
      userEntity.alias = $scope.input.alias;
      $ionicLoading.show();
      UserInfoService.updateUserInfo(userEntity, function () {
        $ionicLoading.hide();
        $ionicHistory.goBack();
      }, function (error) {
        if (null != error){
          if (900 == error.flag) {
            dialogsManager.showMessage("昵称重复");
          }
        }
        $ionicLoading.hide();
      });
      $timeout(function () {
        $ionicLoading.hide();
      },pathService.getTimeout());
    }
  })

  /**
   * <p>方法描述:修改会员邮箱controller </p>
   * <p>创建人: liuyang</p>
   * <p>创建时间: </p>
   * <p>修改人: </p>
   * <p>修改时间: </p>
   * <p>修改备注: </p>
   */
  .controller('EmailModifyCtrl', function ($scope,
                                           $ionicLoading,
                                           $ionicHistory,
                                           $timeout,
                                           dialogsManager,
                                           UserInfoSupport,
                                           UserInfoService,
                                           pathService) {
    $scope.$on('$ionicView.beforeEnter', function () {
      var userEntity = UserInfoSupport.getUserEntity();
      $scope.userinfo = {email: userEntity.email};
      $scope.input = {email: ''};
    });

    $scope.downAction = function () {
      if (null == $scope.input.email || 0 == $scope.input.email.length) {
        dialogsManager.showMessage("邮箱不能为空");
        return;
      }
      var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if (!reg.test($scope.input.email) || $scope.input.email.length > 200) {
        dialogsManager.showMessage("邮箱格式不正确");
        return;
      }
      var reg2 = /\s/;
      if (reg2.test($scope.input.email)) {
        dialogsManager.showMessage("邮箱禁止输入空格");
        return;
      }

      var userEntity = UserInfoSupport.getUserEntity();
      userEntity.email = $scope.input.email;
      $ionicLoading.show();
      UserInfoService.updateUserInfo(userEntity, function () {
        $ionicLoading.hide();
        $ionicHistory.goBack();
      }, function (error) {
        if (null != error) {
          if (900 == error.flag) {
            dialogsManager.showMessage("邮箱重复");
          }
        }
        $ionicLoading.hide();
      });
      $timeout(function () {
        $ionicLoading.hide();
      },pathService.getTimeout());
    }
  })

  /**
   * <p>方法描述:修改会员真实姓名controller </p>
   * <p>创建人: liuyang</p>
   * <p>创建时间: </p>
   * <p>修改人: </p>
   * <p>修改时间: </p>
   * <p>修改备注: </p>
   */
  .controller('UserRealNameModifyCtrl', function ($scope,
                                                  $ionicLoading,
                                                  $ionicHistory,
                                                  dialogsManager,
                                                  UserInfoSupport,
                                                  UserInfoService) {
    $scope.$on('$ionicView.beforeEnter', function () {
      var userEntity = UserInfoSupport.getUserEntity();
      $scope.userinfo = {userRealName: userEntity.userRealName};
      $scope.input = {userRealName: ''};
    });

    $scope.downAction = function () {
      if (null == $scope.input.userRealName || 0 == $scope.input.userRealName.length) {
        dialogsManager.showMessage("真实姓名不能为空");
        return;
      }

      var userEntity = UserInfoSupport.getUserEntity();
      userEntity.userRealName = $scope.input.userRealName;
      $ionicLoading.show();
      UserInfoService.updateUserInfo(userEntity, function () {
        $ionicLoading.hide();
        $ionicHistory.goBack();
      }, function () {
        $ionicLoading.hide();
      });
    }
  })

  /**
   * <p>方法描述:修改会员生日controller </p>
   * <p>创建人: liuyang</p>
   * <p>创建时间: </p>
   * <p>修改人: </p>
   * <p>修改时间: </p>
   * <p>修改备注: </p>
   */
  .controller('BirthdayModifyCtrl', function ($scope,
                                              $ionicLoading,
                                              $ionicHistory,
                                              $timeout,
                                              dialogsManager,
                                              UserInfoSupport,
                                              UserInfoService) {
    var userEntity = UserInfoSupport.getUserEntity();
    $scope.dateSelected = {birthdayDate: userEntity.birthday};
    $scope.title = '选择生日';

    $scope.downAction = function () {
      if (!($scope.dateSelected.birthdayDate instanceof Date)) {
        $ionicHistory.goBack();
        return;
      }
      if (new Date() < $scope.dateSelected.birthdayDate){
        dialogsManager.showMessage('日期错误');
        return;
      }

      userEntity.birthday = $scope.dateSelected.birthdayDate.getTime();
      $ionicLoading.show();
      UserInfoService.updateUserInfo(userEntity, function () {
        $ionicLoading.hide();
        $ionicHistory.goBack();
      }, function () {
        $ionicLoading.hide();
      });
    };
  })

  /**
   * <p>方法描述:修改会员性别controller </p>
   * <p>创建人: liuyang</p>
   * <p>创建时间: </p>
   * <p>修改人: </p>
   * <p>修改时间: </p>
   * <p>修改备注: </p>
   */
  .controller('GenderModifyCtrl', function ($scope,
                                            $ionicLoading,
                                            $ionicHistory,
                                            $timeout,
                                            UserInfoSupport,
                                            UserInfoService) {
    var userEntity = UserInfoSupport.getUserEntity();
    $scope.userinfo = {gender: userEntity.gender};
    $scope.genderList = [
      {text: '男', value: '0'},
      {text: '女', value: '1'}
    ];
    $scope.choice = {
      userGender: $scope.userinfo.gender
    };

    $scope.downAction = function () {
      userEntity.gender = $scope.choice.userGender;
      $ionicLoading.show();
      UserInfoService.updateUserInfo(userEntity, function () {
        $ionicLoading.hide();
        $ionicHistory.goBack();
      }, function () {
        $ionicLoading.hide();
      });
    }
  })

  /**
   * <p>方法描述:修改会员地址controller </p>
   * <p>创建人: liuyang</p>
   * <p>创建时间: </p>
   * <p>修改人: </p>
   * <p>修改时间: </p>
   * <p>修改备注: </p>
   */
  .controller('AddressModifyCtrl', function ($scope,
                                             $ionicLoading,
                                             $ionicHistory,
                                             dialogsManager,
                                             UserInfoSupport,
                                             UserInfoService) {
    $scope.$on('$ionicView.beforeEnter', function () {
      var userEntity = UserInfoSupport.getUserEntity();
      $scope.userinfo = {address: userEntity.address};
      $scope.input = {address: ''};
    });

    $scope.downAction = function () {
      if (null == $scope.input.address || 0 == $scope.input.address.length) {
        dialogsManager.showMessage("地址不能为空");
        return;
      }

      var userEntity = UserInfoSupport.getUserEntity();
      userEntity.address = $scope.input.address;
      $ionicLoading.show();
      UserInfoService.updateUserInfo(userEntity, function () {
        $ionicLoading.hide();
        $ionicHistory.goBack();
      }, function () {
        $ionicLoading.hide();
      });
    }
  })

  /**
   * <p>方法描述:修改支付宝账号controller </p>
   * <p>创建人: liuyang</p>
   * <p>创建时间: </p>
   * <p>修改人: </p>
   * <p>修改时间: </p>
   * <p>修改备注: </p>
   */
  .controller('AlipayNumberModifyCtrl', function ($scope,
                                                  $ionicLoading,
                                                  $ionicHistory,
                                                  $timeout,
                                                  dialogsManager,
                                                  UserInfoSupport,
                                                  UserInfoService,
                                                  pathService) {
    $scope.$on('$ionicView.beforeEnter', function () {
      var userEntity = UserInfoSupport.getUserEntity();
      $scope.userinfo = {alipayAccount: userEntity.alipayAccount};
      $scope.input = {alipayAccount: ''};
    });

    $scope.downAction = function () {
      if (0 == $scope.input.alipayAccount.length) {
        dialogsManager.showMessage("支付宝账号不能为空");
        return;
      }
      if (100 < $scope.input.alipayAccount.length) {
        dialogsManager.showMessage("支付宝账号不超过100字");
        return;
      }
      var reg = /\s/;
      if (reg.test($scope.input.alipayAccount)) {
        dialogsManager.showMessage("支付宝账号禁止输入空格");
        return;
      }
      var reg2 = /[^\u4e00-\u9fa5]/;
      if (!reg2.test($scope.input.alipayAccount)) {
        dialogsManager.showMessage("请输入正确支付宝账号");
        return;
      }
      var reg3 = /<|>/;
      if (reg3.test($scope.input.alipayAccount)) {
        dialogsManager.showMessage("请输入正确支付宝账号");
        return;
      }

      var userEntity = UserInfoSupport.getUserEntity();
      userEntity.alipayAccount = $scope.input.alipayAccount;
      $ionicLoading.show();
      UserInfoService.updateUserInfo(userEntity, function () {
          $ionicLoading.hide();
          $ionicHistory.goBack();
        }, function () {
          $ionicLoading.hide();
        });
      $timeout(function () {
        $ionicLoading.hide();
      },pathService.getTimeout());
    }
  })

  /**
   * <p>方法描述:修改支付宝名称controller </p>
   * <p>创建人: liuyang</p>
   * <p>创建时间: </p>
   * <p>修改人: </p>
   * <p>修改时间: </p>
   * <p>修改备注: </p>
   */
  .controller('AlipayNameModifyCtrl', function ($scope,
                                                $ionicLoading,
                                                $ionicHistory,
                                                $timeout,
                                                $interval,
                                                $ionicPopup,
                                                dialogsManager,
                                                UserInfoSupport,
                                                UserInfoService,
                                                basicConfig,
                                                checkRegister,
                                                pathService) {
    $scope.$on('$ionicView.beforeEnter', function () {
      var userEntity = UserInfoSupport.getUserEntity();
      $scope.phoneNum = userEntity.mobile;
      $scope.userinfo = {alipayName: userEntity.alipayName, alipayAccount: userEntity.alipayAccount};
      $scope.input = {alipayName: '',alipayAccount: '',code: ''};
    });

    //打开此页面距上一次获取验证码的时间 大于5分钟则清空倒计时
    if(new Date-basicConfig.getObject('date')>=300000){
      basicConfig.removeObject('time');
    }

    //检测倒计时时间是否为空，不为空获取验证码按钮倒计时
    timeOut();

    $scope.getCode = function () {
      //获取图片验证码
      $scope.src = checkRegister.getPictureValidCode()+'&mobile='+$scope.phoneNum+'&num='+Math.random();
      var myPopup = $ionicPopup.alert({
        //弹窗标题rnd=Math.random()
        title: '请输入图片中的信息！',
        //弹窗元素 绑定输入框，图片绑定点击事件，点击时在次获取验证码
        //引入弹窗html
        templateUrl:'js/general/templates/popup.html',
        scope: $scope, // Scope (可选)。一个链接到弹窗内容的scope（作用域）。
        buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
          text: '取消',
          type: 'button-light button-small',
          onTap: function(e) {
            // 当点击时，e.preventDefault() 会阻止弹窗关闭。
            //e.preventDefault();
            $scope.timer = false;
          }
        },
          {
            text: '确定',
            type: 'button-small myTitle-bg',
            onTap: function(e) {
              $scope.confirm = false;
              $ionicLoading.show();
              var _params={
                mobile:$scope.phoneNum,
                type:'2', //2修改支付宝账号名称
                authcode:$scope.code
              };
              //获取手机验证码，关闭窗口，既不阻止关闭。获取验证码按钮倒计时。
              checkRegister.sendCode(_params).success(
                function(result){
                  //失败时提示消息
                  if(result.flag==400){
                    //图片验证码错误
                    $ionicLoading.hide();
                    dialogsManager.showMessage("验证码输入错误")
                  }else if(result.flag==200){
                    //获取按钮倒计时
                    timeOut().get();
                    //关闭弹出窗口
                    myPopup.close();
                    //清空倒计时
                    basicConfig.removeObject('Time');
                    $ionicLoading.hide();
                  }else if(result.flag==500){
                    //出错啦
                    $ionicLoading.hide();
                  }
                }).error(function(){
                $ionicLoading.hide();
              });
              //阻止窗口关闭
              e.preventDefault();
            }
          }]
      });
    };

    //点击图片更换验证码
    $scope.clickPicture=function(){
      $scope.src=checkRegister.getPictureValidCode()+'&mobile='+$scope.phoneNum+'&num='+Math.random();
      $scope.code='';
    };

    var timeout = 0;
    //定时器
    function timeOut(){
      $scope.timer = false;
      timeout = 60000;
      $scope.timerCount = timeout / 1000;
      $scope.text = "获取验证码";
      //获取time如果有值说明之前的倒计时没有结束，开始计时
      if(basicConfig.getObject('Time')){
        timeout = basicConfig.getObject('Time');
        $scope.timerCount = timeout / 1000;
        _time_();
      }
      function _time_(){
        //basicConfig.setObject('Time',$scope.timerCount);
        $scope.showTimer = true;
        $scope.timer = true;
        $scope.text = "秒";
        var counter = $interval(function(){
          $scope.timerCount = $scope.timerCount - 1;
          basicConfig.setObject('Time',$scope.timerCount * 1000);
        }, 1000);
        $timeout(function(){
          $scope.text = "获取验证码";
          $scope.timer = false;
          $interval.cancel(counter);
          $scope.showTimer = false;
          //$scope.timerCount = $scope.timeout / 1000;
          basicConfig.removeObject('Time');
        }, timeout);
      }
      return{
        get:function(){
          _time_();
        }
      }
    }


    $scope.downAction = function () {
      if (0 == $scope.input.alipayName.length) {
        dialogsManager.showMessage("支付宝名称不能为空");
        return;
      }
      if (30 < $scope.input.alipayName.length) {
        dialogsManager.showMessage("支付宝名称不超过30字");
        return;
      }
      var reg = /\s/;
      if (reg.test($scope.input.alipayName)) {
        dialogsManager.showMessage("支付宝名称禁止输入空格");
        return;
      }
      var reg2 = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
      if (!reg2.test($scope.input.alipayName)) {
        dialogsManager.showMessage("支付宝名称禁止输入特殊字符");
        return;
      }

      if (0 == $scope.input.alipayAccount.length) {
        dialogsManager.showMessage("支付宝账号不能为空");
        return;
      }
      if (100 < $scope.input.alipayAccount.length) {
        dialogsManager.showMessage("支付宝账号不超过100字");
        return;
      }
      var reg3 = /\s/;
      if (reg3.test($scope.input.alipayAccount)) {
        dialogsManager.showMessage("支付宝账号禁止输入空格");
        return;
      }
      var reg4 = /[^\u4e00-\u9fa5]/;
      if (!reg4.test($scope.input.alipayAccount)) {
        dialogsManager.showMessage("请输入正确支付宝账号");
        return;
      }
      var reg5 = /<|>/;
      if (reg5.test($scope.input.alipayAccount)) {
        dialogsManager.showMessage("请输入正确支付宝账号");
        return;
      }

      if (0 == $scope.input.code.length) {
        dialogsManager.showMessage("请输入验证码");
        return;
      }

      var userEntity = UserInfoSupport.getUserEntity();
      userEntity.alipayName = $scope.input.alipayName;
      userEntity.alipayAccount = $scope.input.alipayAccount;
      userEntity.code = $scope.input.code;
      $ionicLoading.show();
      UserInfoService.updateUserInfo(userEntity, function () {
          $ionicLoading.hide();
          $ionicHistory.goBack();
        }, function (error) {
          $ionicLoading.hide();
          if (null != error && 400 == error.flag) {
            dialogsManager.showMessage("验证码错误");
          }
        });
    }
  })

  /**
   * <p>方法描述:修改密码controller </p>
   * <p>创建人: liuyang</p>
   * <p>创建时间: </p>
   * <p>修改人: </p>
   * <p>修改时间: </p>
   * <p>修改备注: </p>
   */
  .controller('PasswordModifyCtrl', function ($scope,
                                              $state,
                                              $ionicLoading,
                                              $ionicHistory,
                                              $timeout,
                                              dialogsManager,
                                              UserInfoService,
                                              UserInfoSupport,
                                              pathService) {
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.input = {oldPassword: '', newPassword: ''};
    });

    $scope.downAction = function () {
      if (0 == $scope.input.oldPassword.length || 0 == $scope.input.newPassword.length) {
        dialogsManager.showMessage("密码不能为空");
        return;
      }
      if (6 > $scope.input.newPassword.length) {
        dialogsManager.showMessage("密码不少于6字");
        return;
      }
      if (15 < $scope.input.newPassword.length) {
        dialogsManager.showMessage("密码不超过15字");
        return;
      }
      var reg = /\s/;
      if (reg.test($scope.input.newPassword)) {
        dialogsManager.showMessage("密码禁止输入空格");
        return;
      }

      var member = UserInfoSupport.getUserEntity();
      $ionicLoading.show();
      UserInfoService.updateUserPassword(member.userId, $scope.input.oldPassword, $scope.input.newPassword,
        function (result) {
        $ionicLoading.hide();
        if (200 == result.flag){
          dialogsManager.showMessage("密码修改成功");
          $ionicHistory.goBack();
          // basicConfig.removeObject('user');
          // $state.go('toLogin');
        }else if (500 == result.flag) {
          dialogsManager.showMessage("原始密码错误！");
        }
      }, function () {
          $ionicLoading.hide();
        });
      $timeout(function () {
        $ionicLoading.hide();
      },pathService.getTimeout());
    }
  })

  .run(function($ionicPickerI18n) {
    $ionicPickerI18n.weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    $ionicPickerI18n.months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    $ionicPickerI18n.ok = "确定";
    $ionicPickerI18n.cancel = "取消";
    $ionicPickerI18n.okClass = "button-assertive";
    $ionicPickerI18n.cancelClass = "button-assertive";
  })
  .filter('placeholder', function () {
  return function (input, attribute) {
    var out = '';
    switch (attribute) {
      case 'alias':
        if (null == input || 0 == input.length){
          out = '请输入昵称';
        }else{
          out = input;
        }
        break;
      case 'email':
        if (null == input || 0 == input.length){
          out = '请输入邮箱';
        }else{
          if (null != input && 0 != input.length) {
            var emailSplit = input.split('@');
            var emailCount = emailSplit[0];
            if (6 < emailCount.length) {
              emailCount = emailCount.substring(0, 3) + '***' + emailCount.substring(emailCount.length - 4, emailCount.length - 1);
            } else {
              emailCount = emailCount.substring(0, 1) + '***' + emailCount.substring(emailCount.length - 2, emailCount.length - 1);
            }
            out = emailCount + '@' + emailSplit[1];
          }
        }
      default:
        break;
    }

    return out;
  }
});
