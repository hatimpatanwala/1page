app.controller('enquiryListController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', '$routeParams', '$anchorScroll',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, $routeParams, $anchorScroll) {

        'use strict';
        $anchorScroll();
        $scope.recordList = [];
        $scope.isLoading = false;


        getList();

        function getList() {
            $scope.isLoading = true;
            var promise = $http.post(DATA_URLS.LIST_PRODUCT_ENQUIRY);
            promise.then(function (data) {
                $scope.isLoading = false;
                if (!data.status || data.status == 200) {
                    $scope.recordList = data;

                    angular.forEach($scope.recordList, function (v) {
                        v.dateString = timeAgo(Date.parse(v.createdDate));
                    });
                }
            });
        }
    }]);