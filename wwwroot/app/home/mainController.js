app.controller('mainController', ['$scope', '$rootScope', '$window', '$location', '$http', 'authService', 'DATA_URLS', '$filter', 'localStorageService', 'customNavigation',
    function ($scope, $rootScope, $window, $location, $http, authService, DATA_URLS, $filter, localStorageService, customNavigation) {

        'use strict';
        $scope.userData = {};
        $scope.isUserAuthenticated = authService.authentication.isAuth;
        $scope.userName = '';
        $scope.fullName = '';
        $scope.firstName = '';

        if ($scope.isUserAuthenticated) { $scope.userData = authService.authentication.loginData; };
        if ($scope.userData.image) $scope.userData.image = DATA_URLS.BASEURL + $scope.userData.image;

        var authStatusChanged = $rootScope.$on('authStatusChanged', function () {
            $scope.userData = {};
            $scope.isUserAuthenticated = authService.authentication.isAuth;
            if ($scope.isUserAuthenticated) {
                $scope.userData = localStorageService.get('authentication').loginData;
                if ($scope.userData.image) $scope.userData.image = DATA_URLS.BASEURL + $scope.userData.image;
            }
            else {
                //window.location.href = window.location.origin + 'app/login/login.html';
            }
        });

        $scope.$on('$destroy', function () {
            authStatusChanged();
        });

        $scope.onProfileClick = function () {
            if (mobileapp) {
                $location.path('/profile');
            }
            else {
                window.location.href = '/#profile'
            }
        }

        $scope.onAddListingClick = function () {
            if (mobileapp) {
                $location.path('/listing/new');
            }
            else {
                window.location.href = '/#listing/new'
            }
        }

        $scope.logOut = function () {
            authService.logout();
            toastr["success"]("You are successfully logged out.", "Success");
            setTimeout(function () {
                window.location.href = '/';
                //$scope.onHomeClick();
            }, 300);
        }
    }]);