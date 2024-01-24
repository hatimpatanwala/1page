app.controller('pushmenuController', ['$scope', '$rootScope', '$window', '$location', '$http', 'authService', 'DATA_URLS', '$filter', 'appConstant',
    function ($scope, $rootScope, $window, $location, $http, authService, DATA_URLS, $filter, appConstant) {

        'use strict';
        $scope.categories = [];
        $scope.products = [];

        getCategories();
        getProducts();

        function getCategories() {

            var promise = $http.post(DATA_URLS.LIST_CATEGORY);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.categories = data;

                    angular.forEach($scope.categories, function (v) {
                        v.catname = v.name.replace(/\s+/g, '').trim();
                        v.catname = v.catname.replace(/[^a-zA-Z ]/g, "");
                    });

                    setTimeout(function () {
                        jQuery('#dismiss, .overlay, .dimissLink').on('click', function () {
                            jQuery('#sidebar').removeClass('active');
                            jQuery('.overlay').fadeOut();
                        });
                    }, 150);
                }
            });
        }

        function getProducts() {

            var promise = $http.post(DATA_URLS.LIST_PRODUCT);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.products = data;
                }
            });
        }

    }]);