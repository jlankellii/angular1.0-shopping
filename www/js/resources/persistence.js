/**
 * Created by user on 2016/12/23.
 */
angular.module('base.persistencce', [])

.factory('Preferences', function (basicConfig) {
  return {
    getUser: function () {
      return basicConfig.getObject('user');
    },
    setUser: function (userEntity) {
      basicConfig.setObject('user', userEntity);
    }
  }
});
