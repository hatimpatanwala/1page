app.controller('serviceListingController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant', '$anchorScroll', 'localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant, $anchorScroll, localStorageService) {

        'use strict';
        $anchorScroll();
        $scope.recordList = [];
        $scope.categoryList = [];

        getList();
        getCategoryList();

        function getList() {

            var fdata = {};
            var promise = $http.post(DATA_URLS.FRONT_LIST_SERVICE, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.recordList = data;

                    angular.forEach($scope.recordList, function (v) {
                        if (v.featuredImage) {
                            v.featuredImage = DATA_URLS.BASEURL + v.featuredImage;
                        }

                        if (v.description && v.description.length > 51)
                            v.description = v.description.limit(45);
                    });
                }
            });
        };

        function getCategoryList() {

            var fdata = {};
            var promise = $http.post(DATA_URLS.LIST_CATEGORY, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.categoryList = data;
                }
            });
        };

        $scope.onEdit = function (item) {
            localStorageService.set('serviceId', item.id);
            window.location.href = window.location.origin + '/service/details';
        }
    }]);