/**
 * 处理数字相关directive
 */
(function () {
    angular.module('numbersdirective', [])
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
	    .directive('space', function () {
	    	return {
	    		restrict: "A",  //AEMC
	    		require: "ngModel",
	    		link: function (scope, ele, attrs, ngModelController) {
	    			ngModelController.$parsers.push(function (viewValue) {
	    				var re = /\s*/;
	    				ngModelController.$setValidity('newPS', re.test(viewValue));
	    				return viewValue;
	    			});
	    		}
	    	}
	    });
})();