app.controller('productreviewsController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', '$routeParams', 'appConstant', '$filter', '$anchorScroll', 'localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, $routeParams, appConstant, $filter, $anchorScroll, localStorageService) {

        'use strict';
        $scope.recordList = [];
        $scope.editFormData = {};
        $scope.pageSize = 5;
        $scope.pageNumber = 1;
        $scope.totalRecords = 0;
        $scope.productReviewCount = {};
        if ($routeParams.uid != undefined) {
            $scope.productId = parseInt($routeParams.uid);
            get($scope.productId);
            getList($scope.productId);
            starCountReviews($scope.productId);
        }


        function get(id) {

            var promise = $http.post(DATA_URLS.GET_PRODUCT_FOR_REVIEW, id);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.editFormData = data;
                    if ($scope.editFormData.imageName) {
                        $scope.editFormData.imageName = DATA_URLS.BASEURL + $scope.editFormData.imageName;
                    }
                }
            });
        } 

        function getList(id) {

            var fdata = {
                productId: id,
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize,
                //searchText: $scope.filterFormData.searchText
            };
            var promise = $http.post(DATA_URLS.LIST_ALL_PRODUCT_REVIEW, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.recordList = data.list;
                    $scope.totalRecords = data.totalCount;
                }
            });
        }
        $scope.onProductClick = function () {
            window.location.href = '/#/productdetail/' + $scope.editFormData.name + '/' + $scope.editFormData.id
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
            getList($scope.productId);
        }
        //----------------------------------------------------------------//

        function starCountReviews(id) {

            var promise = $http.post(DATA_URLS.STAR_COUNT_PRODUCT_REVIEW, id);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.productReviewCount = data;

                    if ($scope.productReviewCount.totalCount > 0) {
                        calculateAverage($scope.productReviewCount.oneStar, $scope.productReviewCount.twoStar, $scope.productReviewCount.threeStar, $scope.productReviewCount.fourStar, $scope.productReviewCount.fiveStar, $scope.productReviewCount.totalCount);
                    }

                    $scope.productReviewCount.oneStarPer = $scope.productReviewCount.oneStar == 0 ? 0 : ($scope.productReviewCount.oneStar / $scope.productReviewCount.totalCount) * 100;
                    $scope.productReviewCount.twoStarPer = $scope.productReviewCount.twoStar == 0 ? 0 : ($scope.productReviewCount.twoStar / $scope.productReviewCount.totalCount) * 100;
                    $scope.productReviewCount.threeStarPer = $scope.productReviewCount.threeStar == 0 ? 0 : ($scope.productReviewCount.threeStar / $scope.productReviewCount.totalCount) * 100;
                    $scope.productReviewCount.fourStarPer = $scope.productReviewCount.fourStar == 0 ? 0 : ($scope.productReviewCount.fourStar / $scope.productReviewCount.totalCount) * 100;
                    $scope.productReviewCount.fiveStarPer = $scope.productReviewCount.fiveStar == 0 ? 0 : ($scope.productReviewCount.fiveStar / $scope.productReviewCount.totalCount) * 100;

                }
            })
        }

        function calculateAverage(OneStar, TwoStar, ThreeStar, FourStar, FiveStar, totalStar) {
            $scope.reviewAveragecount = Math.round((5 * FiveStar + 4 * FourStar + 3 * ThreeStar + 2 * TwoStar + 1 * OneStar) / totalStar);
        }
    }]);