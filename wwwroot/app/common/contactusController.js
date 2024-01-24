app.controller('contactusController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant) {

        'use strict';
        $scope.formData = {};

        $scope.submit = function () {
            var btn = Ladda.create(document.querySelector('#createbtn'));
            btn.start();
            var fdata = angular.copy($scope.formData);
            fdata.type = 3;
            var promise = $http.post(DATA_URLS.ADD_ENQUIRY, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status === 200) {
                    toastr["success"]("Thanks For Contacting us. We will reach out shortly.", "Success");
                    $scope.formData = {};
                }
            });
        };
    }]);