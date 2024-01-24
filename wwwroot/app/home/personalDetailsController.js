app.controller('personaldetailsController', ['$scope', '$rootScope', '$window', '$location', '$http', 'authService', 'DATA_URLS', '$filter', 'productService', 'localStorageService',
    function ($scope, $rootScope, $window, $location, $http, authService, DATA_URLS, $filter, productService, localStorageService) {

        'use strict';
        $scope.editFormData = {};

        var onProfileChange = $rootScope.$on('onProfileChange', function (e, d) {
            get();
        });
               
        get();

        function get() {
            var promise = $http.post(DATA_URLS.GET_CUSTOMER);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.editFormData = data;

                    if ($scope.editFormData.imageName) {
                        //$scope.editFormData.imageName = $scope.editFormData.imageName.replace(/\\/g, "\/");
                        $scope.editFormData.imageName = DATA_URLS.BASEURL + $scope.editFormData.imageName;
                    }
                }
            });
        }

        $scope.$on('$destroy', function () {
            onProfileChange();
        });
    }]);