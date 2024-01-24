app.controller('newsLetterController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant) {

        'use strict';
        $scope.formData = {};

        $scope.submit = function () {

            var btn = Ladda.create(document.querySelector('#createbtn'));
            btn.start();

            var fdata = angular.copy($scope.formData);

            var promise = $http.post(DATA_URLS.ADD_NEWSLETTER, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status === 200) {
                    toastr["success"]("Your email registered successfully", "Success");
                    window.location.href = '/'
                }
            });
        };
    }]);