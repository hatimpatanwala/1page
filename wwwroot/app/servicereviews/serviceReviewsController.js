app.controller('serviceReviewsController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', '$routeParams', 'appConstant', '$filter', '$anchorScroll', 'localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, $routeParams, appConstant, $filter, $anchorScroll, localStorageService) {

        'use strict';
        $scope.recordList = [];
        $scope.editFormData = {};
        $scope.pageSize = 5;
        $scope.pageNumber = 1;
        $scope.totalRecords = [];
        $scope.serviceReviewCount = {};

        $('html, body').animate({ scrollTop: ($(".reviewdetails").offset().top) - 100 }, 500);

        if ($routeParams.uid != undefined) {
            $scope.serviceId = parseInt($routeParams.uid);
            getList($scope.serviceId);
            get($scope.serviceId);
            starCountReviews($scope.serviceId);
        }

        function get(id) {

            var promise = $http.post(DATA_URLS.GET_SERVICE_FOR_REVIEW, id);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.editFormData = data;
                    if ($scope.editFormData.featuredImage) {
                        $scope.editFormData.featuredImage = DATA_URLS.BASEURL + $scope.editFormData.featuredImage;
                    }
                }
            });
        }

        function getList(id) {

            var fdata = {
                serviceId: id,
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize,
                //searchText: $scope.filterFormData.searchText
            };
            var promise = $http.post(DATA_URLS.LIST_ALL_SERVICE_REVIEW, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.recordList = data.list;
                    $scope.totalRecords = data.totalCount;
                }
            });
        }

        function starCountReviews(id) {

              var promise = $http.post(DATA_URLS.STAR_COUNT_SERVICE_REVIEW, $scope.serviceId);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.serviceReviewCount = data;
                    if ($scope.serviceReviewCount.totalCount > 0)
                        calculateAverage($scope.serviceReviewCount.oneStar, $scope.serviceReviewCount.twoStar, $scope.serviceReviewCount.threeStar, $scope.serviceReviewCount.fourStar, $scope.serviceReviewCount.fiveStar, $scope.serviceReviewCount.totalCount);
                    $scope.serviceReviewCount.oneStarPer = $scope.serviceReviewCount.oneStar == 0 ? 0 : ($scope.serviceReviewCount.oneStar / $scope.serviceReviewCount.totalCount) * 100;
                    $scope.serviceReviewCount.twoStarPer = $scope.serviceReviewCount.twoStar == 0 ? 0 : ($scope.serviceReviewCount.twoStar / $scope.serviceReviewCount.totalCount) * 100;
                    $scope.serviceReviewCount.threeStarPer = $scope.serviceReviewCount.threeStar == 0 ? 0 : ($scope.serviceReviewCount.threeStar / $scope.serviceReviewCount.totalCount) * 100;
                    $scope.serviceReviewCount.fourStarPer = $scope.serviceReviewCount.fourStar == 0 ? 0 : ($scope.serviceReviewCount.fourStar / $scope.serviceReviewCount.totalCount) * 100;
                    $scope.serviceReviewCount.fiveStarPer = $scope.serviceReviewCount.fiveStar == 0 ? 0 : ($scope.serviceReviewCount.fiveStar / $scope.serviceReviewCount.totalCount) * 100;

                    
                 }
            });
            function calculateAverage(OneStar, TwoStar, ThreeStar, FourStar, FiveStar, totalStar) {
                $scope.reviewAveragecount = Math.round((5 * FiveStar + 4 * FourStar + 3 * ThreeStar + 2 * TwoStar + 1 * OneStar) / totalStar);
            }
        }

        $scope.onDetailsClick = function () {
            localStorageService.set('serviceId', $scope.serviceId);
            window.location.href = window.location.origin + '/service/details';
        }

        //Pagination-------------------------------------------------------//
        $scope.range = function () {

            var rangeSize = appConstant.PaginationRangeSize;
            var ps = [];
            var start;
            var end;

            if ($scope.pageCount() > rangeSize) {
                start = $scope.pageNumber <= 0 ? 0 : $scope.pageNumber - 1;
                end = start + (rangeSize - 1);

                var diff = start + (rangeSize - 1) - $scope.pageCount();

                if (diff > 0) {
                    start = start - diff;
                    end = end - diff;
                }

            }
            else {
                start = 0;
                end = $scope.pageCount()
            }

            for (var i = start; i <= end; i++) {
                ps.push(i);
            }

            return ps;
        };

        $scope.prevPage = function () {
            if ($scope.pageNumber > 1) {
                $scope.pageNumber--;
                $anchorScroll();
                moveToNext();
            }
        };

        $scope.DisablePrevPage = function () {
            return $scope.pageNumber === 0 ? "disabled" : "";
        };

        $scope.pageCount = function () {
            return Math.ceil($scope.totalRecords / $scope.pageSize) - 1;
        };

        $scope.nextPage = function () {
            if ($scope.pageNumber < $scope.pageCount()) {
                $scope.pageNumber++;
                $anchorScroll();
                moveToNext();
            }
        };

        $scope.DisableNextPage = function () {
            return $scope.pageNumber === $scope.pageCount() ? "disabled" : "";
        };

        $scope.setPage = function (n) {
            $scope.pageNumber = n;
            $anchorScroll();
            moveToNext();
        };

        function moveToNext() {
            getList($scope.serviceId);
        }
        //----------------------------------------------------------------//

    }]);