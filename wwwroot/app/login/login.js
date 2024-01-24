app.controller('login', ['$scope', '$rootScope', '$window', '$location', '$http', 'authService', 'DATA_URLS', '$filter', 'customNavigation',
    function ($scope, $rootScope, $window, $location, $http, authService, DATA_URLS, $filter, customNavigation) {

        'use strict';
        $scope.isUserAuthenticated = authService.authentication.isAuth;
        $scope.isSigningIn = { value: false };
        $scope.loginError = { value: '' }
        $scope.signinData = {};

        //TODO: For testing only
        //$scope.signinData.username = 'admin@yopmail.com';
        //$scope.signinData.password = '123456';

        if ($scope.isUserAuthenticated) {
            window.location.href = '/';
        }

        var authStatusChanged = $rootScope.$on('authStatusChanged', function () {
            $scope.isSigningIn.value = false;

            if (!authService.authentication.isAuth) {
                $scope.loginError.value = authService.authentication.loginError;
                //toastr["error"]($scope.loginError.value, "Error");
            }
            else {
                toastr["success"]("You are successfully logged in", "Success");
                $scope.onHomeClick();
            }
        });

        $scope.signIn = function () {
            $scope.isSigningIn.value = true;
            $scope.loginError.value = '';
            authService.login($scope.signinData);
        }

        $scope.getUserName = function () {

            var promise = $http.post(DATA_URLS.USER_FINDBYMOBILEOREMAIL, { mobileOrEmail: $scope.signinData.mobileoremail });

            promise.then(function (data) {
                if (!data.status || data.status === 200) {
                    $scope.signinData.username = data.userName;
                    $scope.loginError.value = '';
                }
                else {
                    $scope.loginError.value = 'Invalid Username';
                }
            });
        }

        $scope.clearUserName = function () {
            $scope.signinData = {};
        }

        $scope.forgotPassword = function () {
            if (mobileapp) {
                $location.path('/forgotpassword');
            }
            else {
                window.location.href = window.location.origin + '/#/forgotpassword';
            }
        }

        $scope.navigateToSignUp = function () {
            if (mobileapp) {
                $location.path('/signup');
            }
            else {
                window.location.href = '/signup'
            }
        }

        $scope.onHomeClick = function () {
            if (mobileapp) {
                window.location.href = '/';
            }
            else {
                window.location.href = '/'
            }
        }

        $scope.$on('$destroy', function () {
            authStatusChanged();
        });

        $scope.onForgotPasswordClick = function () {
            window.location.href = '/#forgotpassword'
        }

        $scope.onRegisterClick = function () {
            window.location.href = '/register'
        }
    }]);