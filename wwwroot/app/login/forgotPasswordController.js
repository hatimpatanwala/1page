app.controller('forgotPasswordController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant', 'localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant, localStorageService) {

        'use strict';
        $scope.formData = {};
        $scope.isUserAuthenticated = authService.authentication.isAuth;

        if ($scope.isUserAuthenticated) {
            $location.path('/');
        }

        var authStatusChanged = $rootScope.$on('authStatusChanged', function () {
            if (authService.authentication.isAuth) {
                $scope.isUserAuthenticated = authService.authentication.isAuth;
                $location.path('/');
            }
        });

        $scope.$on('$destroy', function () {
            authStatusChanged();
        });

        $scope.submit = function () {

            var btn = Ladda.create(document.querySelector('#btn1'));
            btn.start();

            var fdata = angular.copy($scope.formData);

            var promise = $http.post(DATA_URLS.FORGOT_PASSWORD, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status === 200) {
                    localStorageService.set('userDetails', $scope.formData);
                    toastr["success"]("OTP send to your registered email id.", "Success");
                    $location.path('/resetpassword');
                    $scope.formData = {};
                }
                else {
                    // toastr["info"](data.data.message, "Success");
                }
            });
        };
    }]);


