var app = angular.module('app', ['LocalStorageModule', 'toastr', 'ngRoute', 'ui.router']);

app.run(['authService',function (authService) {
    //authService.fillAuthData();
}]);

app.run(['$rootScope', '$location', 'authService', 'localStorageService', 'customNavigation', function ($rootScope, $location, authService, localStorageService, customNavigation) {
    $rootScope.$on('$routeChangeStart', function (e) {
        console.log($location.path());
        //console.log(window.location.href);

        if ($location.path() == '/seller/products' || $location.path() == '/seller/pricing') {
            if (!localStorageService.get('registeredSeller')) {
                window.location.href = window.location.origin + '/';
            }
        }

        var authroute = false;
        angular.forEach(['/buyerprofile', '/order/', '/orders', '/wishlist', '/search/transport','/vendorprofile'], function (v) {
            if ($location.path().indexOf(v) !== -1) {
                authroute = true;
            }
        });

        if (!authService.authentication.isAuth && authroute) {
            e.preventDefault();
            customNavigation.onLoginPageClick();
        }
    });
}]);

app.config(['$httpProvider', '$locationProvider',function ($httpProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $httpProvider.interceptors.push('authInterceptorService');
    $httpProvider.interceptors.push('preventTemplateCache');
}]);

app.factory('preventTemplateCache', ['$injector', function ($injector) {
    return {
        'request': function (config) {

            if (config.url.indexOf('.html') !== -1) {
                config.url = config.url + '?t=' + (new Date()).toLocaleString();
            }
            else {
                //console.log('config - ', config.url);
            }
            return config;
        }
    }
}]);


app.directive('viewInclude', function () {

    return {
        templateUrl: function (elem, attr) {
            return '/' + attr.src;
        }
    };
});

app.directive('autoFocus', ['$timeout', function ($timeout) {
    return {
        restrict: 'AC',
        link: function (_scope, _element) {
            $timeout(function () {
                window.focus()
                _element[0].focus();
            }, 0);
        }
    };
}]);

app.filter('safeHtml', ['$sce', function ($sce) {
    return function (val) {
        if (val) {
            return $sce.trustAsHtml(val);
        }
        else {
            return '';
        }
    };
}]);

app.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);

app.filter('htmlToPlaintext', ['$sce', function ($sce) {
    return function (text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
}]);

app.directive('moveFocus', function () {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            elem.on('input', function (e) {

                var l = elem.val().length;
                var num = elem.val();

                if ((l == 0 && num == '') || (num.includes('.'))) {
                    return
                }

                if (l >= 1) {
                    if (!isNaN(num) && Number.isInteger(+num) && num >= 0 && num < 10) {

                        if (elem.attr("id") == "field1") {
                            document.querySelector('#field2').focus();
                        }
                        else if (elem.attr("id") == "field2") {
                            document.querySelector('#field3').focus();
                        }
                        else if (elem.attr("id") == "field3") {
                            document.querySelector('#field4').focus();
                        }
                        else if (elem.attr("id") == "field4") {
                            document.querySelector('#field5').focus();
                        }
                        else if (elem.attr("id") == "field5") {
                            document.querySelector('#field6').focus();
                        }
                    }
                    else {
                        elem.val('');
                    }
                }
            });
        }
    };
});