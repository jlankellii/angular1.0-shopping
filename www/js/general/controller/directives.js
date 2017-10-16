angular.module('starter.directives', [])
.directive('phonenumber', function () {
    return {
        restrict: "A",  //AEMC
        require: "ngModel",
        link: function (scope, ele, attrs, ngModelController) {
            ngModelController.$parsers.push(function (viewValue) {
                var re = /^1[3|4|5|7|8|9]\d{9}$/;
                ngModelController.$setValidity('phonenumber', re.test(viewValue));
                return viewValue;
            });
        }
    }
})
.directive('timerButton',function($timeout,$interval,basicConfig){
  return {
    restrict: 'AE',
    scope:false,
    //  showTimer: '=',
    //  timeout: '='
    //},
    link: function(scope, element, attrs){
    	scope.timer = false;
    	scope.timeout = 10000;
    	scope.timerCount = scope.timeout / 1000;
    	scope.text = "获取验证码";
    	if(basicConfig.getObject('time')){
    		scope.time();
    	}
    	scope.onClick = function(){scope.time();}
    	scope.time=function(){
    		basicConfig.setObject('time',scope.timerCount);
	        scope.showTimer = true;
	        scope.timer = true;
	        scope.text = "秒后重新获取";
	        var counter = $interval(function(){
	          	scope.timerCount = scope.timerCount - 1;
	        }, 1000);
	        $timeout(function(){
	        	scope.text = "获取验证码";
	        	scope.timer = false;
	        	$interval.cancel(counter);
	        	scope.showTimer = false;
	        	scope.timerCount = scope.timeout / 1000;
	        	basicConfig.removeObject('time');
	        }, scope.timeout);
      }
    },
    template: '<button ng-click="$ionicView.loaded;getCode(scope.onClick());" class="button button-small button-outline button-assertive" style="color:red;" ng-disabled="timer"><span ng-if="showTimer">{{ timerCount }}</span>{{text}}</button>'
  };
})
// 验证两次输入的密码是否相同的自定义验证
  .directive('pwdRepeat', function () {
    return {
      require: 'ngModel',
      link: function (scope, ele, attrs, ctrl) {

        ctrl.$validators.pwdRepeat = function (modelValue) {
          // 当值为空时，通过验证，因为有required
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          }
          return modelValue === scope.user.password ? true : false;
        }
      }
    }
  });

