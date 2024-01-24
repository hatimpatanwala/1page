app.controller('resetPasswordController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant', '$routeParams', 'localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant, $routeParams, localStorageService) {

        'use strict';
        $scope.userData = localStorageService.get('userDetails');
        $scope.editFormData = {};
        $scope.formData = {};
        $scope.isVerified = false;
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

        if ($routeParams.u != undefined) {
            $scope.mobileoremail = $routeParams.u;
        }

        $scope.submit = function () {

            var btn = Ladda.create(document.querySelector('#btn2'));
            btn.start();

            var fdata = angular.copy($scope.formData);

            var promise = $http.post(DATA_URLS.VERIFY_OTP, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status === 200) {
                    $scope.isOtpVerified = true;
                    $scope.isOtpSend = false;
                    $scope.loginError = '';
                    $scope.isVerified = true;
                } else {
                    $scope.otpError = data.data.message;
                }
            });
        };

        $scope.resetPassword = function () {

            if ($scope.formData.password != $scope.formData.confirmPassword) {
                alert('Password & confirm password does not match.');
                return;
            }

            var btn = Ladda.create(document.querySelector('#btn3'));
            btn.start();

            var fdata = angular.copy($scope.formData);

            var promise = $http.post(DATA_URLS.RESET_PASSWORDLOGIN, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status === 200) {
                    alert('Password reset successfully.');

                    setTimeout(function () {
                        window.location.href = '/login'
                    }, 100);
                }
            });
        };

        $scope.resendOTP = function () {

            var fdata = angular.copy($scope.userData);

            var promise = $http.post(DATA_URLS.FORGOT_PASSWORD, fdata);

            promise.then(function (data) {
                if (!data.status || data.status === 200) {
                    $scope.isResend = true;
                }
            });
        };
    }]);