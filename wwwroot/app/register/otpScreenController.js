app.controller('otpScreenController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant', '$anchorScroll', 'localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant, $anchorScroll, localStorageService) {

        'use strict';
        $anchorScroll();
        $scope.formData = {};

        $scope.registeredBuyer = localStorageService.get('registeredBuyer');

        $scope.submit = function () {

            var btn = Ladda.create(document.querySelector('#btnverifyotp'));
            btn.start();

            //var fdata = {
            //    'token': $scope.formData.field1.toString()
            //        + $scope.formData.field2.toString()
            //        + $scope.formData.field3.toString()
            //        + $scope.formData.field4.toString()
            //        + $scope.formData.field5.toString()
            //        + $scope.formData.field6.toString(),
            //    'id': $scope.registeredBuyer.id
            //};

            var fdata = { 'token': $scope.formData.token, 'id': $scope.registeredBuyer.id };

            var promise = $http.post(DATA_URLS.VerifyEmail, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    alert('You have Successfully Verified ');
                    localStorageService.remove('registeredBuyer');
                    if (mobileapp) {
                        $location.path('/login');
                    }
                    else {
                        window.location.href = '/login'
                    }
                }
            }, function (err) {
                btn.stop();
                alert(err.data.message);
            });
        }

        $scope.onResendOtp = function () {

            var btn = Ladda.create(document.querySelector('#btnresendotp'));
            btn.start();

            var promise = $http.post(DATA_URLS.ReSendEmailOTP, $scope.registeredBuyer.id);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    alert('OTP resend to your email ' + $scope.registeredBuyer.email);
                }
            }, function (err) {
                btn.stop();
                alert(err.data.message);
            });

        }
    }]);