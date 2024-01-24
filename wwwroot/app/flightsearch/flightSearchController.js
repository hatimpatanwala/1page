app.controller('flightSearchController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant', '$anchorScroll', 'localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant, $anchorScroll, localStorageService) {

        'use strict';
        $anchorScroll();

        $scope.recordList = [];
        $scope.categoryList = [];
        $scope.pageBannerList = [];
        $scope.searchFormData = {};
        $scope.srchCount = 0;
        $scope.filters = [];

        $scope.sortByList = appConstant.MarketPlaceSortBy;
        $scope.searchFormData.sortBy = $scope.sortByList[1];

        $scope.pageSize = 25;
        $scope.pageNumber = 1;

        //check local storage
        var searchFormData = localStorageService.get(appConstant.LocalStorageKeys.MarketPlaceSearchFormData);
        if (searchFormData) {
            $scope.searchFormData = searchFormData;

            //console.log('$scope.searchFormData -', $scope.searchFormData);

            selectCategory();
        }


        doSearch(true);
        getPageBanners();
        getCategoryList();


        function getCategoryList() {

            var fdata = {};
            var promise = $http.post(DATA_URLS.LIST_CATEGORY, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.categoryList = data;
                }
            });
        };

        function getPageBanners() {

            var fdata = { type: 2 };
            var promise = $http.post(DATA_URLS.LIST_PAGEBANNER, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.pageBannerList = data;

                    angular.forEach($scope.pageBannerList, function (v) {

                        v.image = v.image.replace(/\\/g, "\/");
                        v.image = DATA_URLS.BASEURL + v.image;
                    });

                    setTimeout(function () {
                        pageBannerCarousel();

                        if ($scope.pageBannerList.length > 0) {
                            $('.dum_inr_bnr').hide();
                        }
                    }, 500);
                }
            });
        }

        function pageBannerCarousel() {
            $('#mrkt_plc').owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayTimeout: 4000,
                autoplayHoverPause: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 1
                    },
                    1000: {
                        items: 1
                    }
                }
            })
        }

        $scope.onProductClick = function (item) {
            window.location.href = '/#/productdetail/' + item.name + '/' + item.id
        }

        function doSearch(includeFilters) {

            //var fdata = {};
            var filters = setfilters();
            filters.includeFilters = includeFilters;

            if (filters.category) {
                filters.category = filters.category.id;
            }

            //console.log('fdata - ', fdata);
            var promise = $http.post(DATA_URLS.SEARCH_PRODUCT, filters);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {

                    //$scope.recordList = data.listing;
                    var lst = data.listing;

                    if (lst.length > 0) {
                        $('.grid_dum').hide();
                    }

                    angular.forEach(lst, function (value, key) {
                        $scope.recordList.push(value);
                    });

                    if (lst.length == 0 && $scope.pageNumber == 1) {
                        $scope.nomoreresult = 'No post found matching your search';
                    }
                    else if (lst.length == 0 && $scope.pageNumber > 1) {
                        $scope.nomoreresult = 'It looks like there are no more search results matching';
                    }
                    else if ($scope.pageSize > lst.length) {
                        $scope.nomoreresult = 'It looks like there are no more search results matching';
                    }
                    else {
                        $scope.nomoreresult = null;
                    }

                    $scope.srchCount = data.total;

                    if (includeFilters) {
                        $scope.filters = data.filters;
                    }

                    angular.forEach($scope.recordList, function (v) {

                        if (v.imageName) {
                            v.imageName = v.imageName.replace(/\\/g, "\/");
                            v.imageName = DATA_URLS.BASEURL + v.imageName;
                        }

                    });
                }
            });
        }

        function setfilters() {

            var searchFilter = {};

            if ($scope.searchFormData.sortBy) {
                searchFilter.sortBy = $scope.searchFormData.sortBy.id;
            }

            searchFilter.pageSize = $scope.pageSize;
            searchFilter.pageNumber = $scope.pageNumber;

            searchFilter.searchTerm = $scope.searchFormData.searchTerm;
            searchFilter.category = $scope.searchFormData.category;

            return searchFilter;
        }


        $scope.onSearchClick = function () {

            if (localStorageService.get(appConstant.LocalStorageKeys.SearchFormData)) {
                localStorageService.remove(appConstant.LocalStorageKeys.SearchFormData)
            }

            $scope.recordList = [];
            $scope.pageNumber = 1;
            $scope.nomoreresult = null;

            doSearch(true);
        }

        $scope.onClearClick = function () {

            if (localStorageService.get(appConstant.LocalStorageKeys.SearchFormData)) {
                localStorageService.remove(appConstant.LocalStorageKeys.SearchFormData)
            }

            $scope.searchFormData = {};
            $scope.searchFormData.sortBy = $scope.sortByList[1];

            $("#location").val('');

            $scope.nomoreresult = null;
            $scope.recordList = [];
            $scope.pageNumber = 1;

            doSearch(true);
        }

        $scope.onViewMoreResult = function () {


            $scope.pageNumber++;
            doSearch(true);
        }

        $scope.onSortChange = function () {
            $scope.pageNumber = 1;
            $scope.recordList = [];
            $scope.srchCount = 0;

            doSearch(true);
        }
    }]);