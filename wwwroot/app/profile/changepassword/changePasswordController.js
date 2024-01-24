app.controller('changePasswordController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant', '$anchorScroll', 'localStorageService', '$filter',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant, $anchorScroll, localStorageService, $filter) {

        'use strict';
        $anchorScroll();
        $scope.formData = {};
                              
        $scope.resetPassword = function () {

            if ($scope.formData.password != $scope.formData.confirmPassword) {
                alert('Password & confirm password does not match.');
                return;
            }

            var btn = Ladda.create(document.querySelector('#updatebtn'));
            btn.start();

            var fdata = angular.copy($scope.formData);

            var promise = $http.post(DATA_URLS.RESET_PASSWORD, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status === 200) {
                    toastr["success"]("Password changed successfully", "Success");
                    $location.path('/profile');
                }
            });
        };

        $scope.onBackClick = function () {
            $window.history.back();
        }
    }]);