/**
 * Created by user on 2016/12/14.
 */
angular.module('member.profileServices', [])

  .factory('exchangIntegralSer',exchangIntegralSer)
  .factory('UserInfoSupport', function ($http,Preferences, basicConfig, pathService) {
    var userEntity = {
      userId: '',
      avatar: '',
      alias: '',
      mobile: '',
      email: '',
      gender: '',
      birthday: '',
      alipayName: '',
      alipayAccount: '',
      score: '',
      sealScore: '',
      allScore: '',
      money: ''
    };
    userEntity = basicConfig.getObject('user');

    var history='';

    return {
      isLogin: function() {
        return  null != userEntity && null != userEntity.userId && 0 != userEntity.userId;;
      },
      getUserEntity: function() {
        return userEntity;
      },
      setUserEntity: function (entity) {
        if (null == userEntity){
          userEntity = {};
        }
        userEntity.userId = entity.userId;
        userEntity.avatar = entity.avatar;
        userEntity.alias = entity.alias;
        userEntity.mobile = entity.mobile;
        userEntity.email = entity.email;
        userEntity.gender = entity.gender;
        userEntity.birthday = entity.birthday;
        userEntity.alipayAccount = entity.alipayAccount;
        userEntity.alipayName = entity.alipayName;
        userEntity.score = entity.score;
        userEntity.sealScore = entity.sealScore;
        userEntity.allScore = entity.allScore;
        userEntity.money = entity.money;
      },
      saveUserInfo: function (entity) {
        Preferences.setUser(entity);
      },
      getHistory:function(){
    	  return history;
      },
      setHistory:function(value){
    	  history = value;
      },

      orderGuide:function (userId) {
        var url = pathService.getPath('orderGuide');
        var data = {userId:userId};
        return $http.jsonp(url,{params:data})
      }
    }
  })

  .factory('UserInfoService', communicateWithServer);

function communicateWithServer(NetSource, UserInfoSupport,dialogsManager) {
  return {
    queryUserInfo: function (userId, successCallback, errorCallback) {
      var args = {'userId': userId};
      NetSource.getRequest('userInfoUrl', args, function (response) {
        if (200 == response.flag){
          UserInfoSupport.setUserEntity(response.data);
          UserInfoSupport.saveUserInfo(response.data);
          successCallback(response);
        }else{
          errorCallback(response);
        }
      },
      function (error) {
        errorCallback(error);
      });
    },

    updateUserInfo: function (userEntity, successCallback, errorCallback) {
      var args = {
        'userId': userEntity.userId,
        'alias': userEntity.alias,
        'email': userEntity.email,
        'gender': userEntity.gender,
        'birthday': userEntity.birthday,
        'alipayAccount': userEntity.alipayAccount,
        'alipayName': userEntity.alipayName,
        'code': userEntity.code
      };
      NetSource.getRequest('updateUserInfoUrl', args, function (response) {
        if (200 == response.flag){
          UserInfoSupport.setUserEntity(response.data);
          UserInfoSupport.saveUserInfo(response.data);
          successCallback(response);
          dialogsManager.showMessage("数据修改成功！");
        }else{
          errorCallback(response);
        }
      }, function (error) {
        errorCallback(error);
        dialogsManager.showMessage("网络故障,请稍后再试!");
      });
    },

    uploadUserAvatar: function (userId, avatarData, successCallback, errorCallback) {
      var args = {
        userId: userId
      };

      NetSource.fileUpload('uploadHeadUrl',args, avatarData, function (response) {
        var userinfo = UserInfoSupport.getUserEntity();
        userinfo.avatar = response.data;
        UserInfoSupport.setUserEntity(userinfo);
        UserInfoSupport.saveUserInfo(userinfo);
        successCallback(response);
      }, function (error) {
        errorCallback(error);
      });
    },

    updateUserPassword: function (userId, oldPassword, newPassword, successCallback, errorCallback) {
      var args = {
        'userId': userId,
        'userPassword': oldPassword,
        'newPassword': newPassword
      };
      NetSource.getRequest('updatePasswordUrl', args, successCallback, errorCallback);
    }
  }
}

function exchangIntegralSer($q,$http,pathService){
	return {
		getBasicData : function(_params){
			var _deferred = $q.defer();
			$http.jsonp(pathService.getPath("toScoreConvertPage"),{params:_params}).success(function(result){
				_deferred.resolve(result);
			}).error(function(result){
				_deferred.reject(result);
			});
			return _deferred.promise
		},
		exchangeIntegral : function(_params){
			var _deferred = $q.defer();
			$http.jsonp(pathService.getPath("scoreConvert"),{params:_params}).success(function(result){
				_deferred.resolve(result);
			}).error(function(result){
				_deferred.reject(result);
			});
			return _deferred.promise
		},
		validateConvert:function(_params){
			var _deferred = $q.defer();
			$http.jsonp(pathService.getPath("validateConvert"),{params:_params}).success(function(result){
				_deferred.resolve(result);
			}).error(function(result){
				_deferred.reject(result);
			});
			return _deferred.promise
		}
	}
}
