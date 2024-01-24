app.controller('reviewListController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', '$routeParams', '$anchorScroll',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, $routeParams, $anchorScroll) {

        'use strict';
        $anchorScroll();
        $scope.serviceRecordList = [];
        $scope.productRecordLis = [];
        $scope.isLoading = false;
        $scope.selectedReview = {};


        getProductReviewList();
        getServiceReviewList();

        function getProductReviewList() {
            $scope.isLoading = true;
            var promise = $http.post(DATA_URLS.REVIEW_LIST_FOR_PRODUCT, $scope.selectedReview);
            promise.then(function (data) {
                $scope.isLoading = false;
                if (!data.status || data.status == 200) {
                    $scope.productRecordList = data.list;
                    
                    angular.forEach($scope.recordList, function (v) {
                        v.dateString = timeAgo(Date.parse(v.createdDate));
                    });
                }
            });
        }

        function getServiceReviewList() {
            $scope.isLoading = true;
            var promise = $http.post(DATA_URLS.REVIEW_LIST_FOR_BUSINESS, $scope.selectedReview);
            promise.then(function (data) {
                $scope.isLoading = false;
                if (!data.status || data.status == 200) {
                    $scope.serviceRecordList = data.list;

                    angular.forEach($scope.recordList, function (v) {
                        v.dateString = timeAgo(Date.parse(v.createdDate));
                    });
                }
            });
        }
    }]);