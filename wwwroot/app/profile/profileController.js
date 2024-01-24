app.controller('profileController', ['$scope', '$rootScope', '$window', '$location', '$http', 'authService', 'DATA_URLS', '$filter', 'appConstant', '$anchorScroll',
    function ($scope, $rootScope, $window, $location, $http, authService, DATA_URLS, $filter, appConstant, $anchorScroll) {

        'use strict';
        $anchorScroll();
        $scope.userData = {};
        $scope.editFormData = {};
        getDashboardDetials();

        $scope.isUserAuthenticated = authService.authentication.isAuth;
        $scope.userData = authService.authentication.loginData;

        if (!$scope.isUserAuthenticated) {
            window.location.href = '/';
        }

        $rootScope.$on('authStatusChanged', function () {
            $scope.isUserAuthenticated = authService.authentication.isAuth;

            if ($scope.isUserAuthenticated) {
                $scope.userData = authService.authentication;
                $scope.userName = authService.authentication.loginData.userName;
                $scope.fullName = authService.authentication.loginData.userFullName;
            }
            else {
                //window.location.href = window.location.origin + 'app/login/login.html';
            }
        });

        $scope.logOut = function () {
            authService.logout();
            toastr["success"]("You are successfully logged out.", "Success");
            setTimeout(function () {
                window.location.href = '/';
                //$scope.onHomeClick();
            }, 300);
        }

        function getDashboardDetials() {
            $scope.isLoading = true;
            var promise = $http.post(DATA_URLS.PROFILE_DASHBOARD);

            promise.then(function (data) {
                $scope.isLoading = false;
                if (!data.status || data.status == 200) {
                    $scope.editFormData = data;
                }
            });
        }
    }]);