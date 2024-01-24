app.controller('searchServiceListingController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant', '$anchorScroll', 'localStorageService', '$filter',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant, $anchorScroll, localStorageService, $filter) {

        'use strict';
        $anchorScroll();

        $scope.searchFormData = {};
        $scope.recordList = [];
        $scope.srchCount = 0;
        $scope.filters = [];
        initializeAutoComplete(null);

        $scope.sortByList = appConstant.SortBy;
        $scope.searchFormData.sortBy = $scope.sortByList[1];

        $scope.categoryList = [];
        $scope.countryList = [];
        $scope.businessTypeList = [];

        $scope.pageSize = 25;
        $scope.pageNumber = 1;


        //$(window).scroll(function () {

        //    var footerHeight = 373 - 117;
        //    $scope.isNotScrolling = true;

        //    console.log('1 -', $(window).scrollTop());
        //    console.log('2 -', $(document).height() - $(window).height() - footerHeight);

        //    if ($(window).scrollTop() >= $(document).height() - $(window).height() - footerHeight) {

        //        $scope.pageNumber++;
        //        doSearch(false);
        //    }
        //});

        //check local storage
        var searchFormData = localStorageService.get(appConstant.LocalStorageKeys.SearchFormData);
        if (searchFormData) {
            $scope.searchFormData = searchFormData;
            $scope.searchFormData.sortBy = $scope.sortByList[1];

            //console.log('$scope.searchFormData -', $scope.searchFormData);
            if ($scope.searchFormData.location) {
                $("#location").val($scope.searchFormData.location);
            }

            if ($scope.searchFormData.locality) selectLocation();

            if ($scope.searchFormData.popularSearch) selectBusiness();

            selectCountry();
            selectBusinessType();
        }

        doSearch(true);
        getCategoryList();
        getCountryList();
        getBusinessTypeList();

        var fromAutocomplete;
        function initializeAutoComplete(countrycode) {

            var options = {
                types: ['(regions)']
            };

            if (countrycode) {
                options.componentRestrictions = {
                    country: countrycode
                }
            }

            var input = document.getElementById('location');

            fromAutocomplete = new google.maps.places.Autocomplete(input, options);
            google.maps.event.addListener(fromAutocomplete, 'place_changed', function () {
                //console.log(fromAutocomplete.getPlace());
            });
        }

        // Bias the autocomplete object to the user's geographical location,
        // as supplied by the browser's 'navigator.geolocation' object.
        $scope.geolocate = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });
                    fromAutocomplete.setBounds(circle.getBounds());
                });
            }
        }

        function getCountryList() {

            var fdata = { type: 1 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.countryList = data;

                    selectCountry();
                    if ($scope.searchFormData.locality) selectLocation();
                }
            });
        };

        function selectCountry() {
            if ($scope.searchFormData != null && !!$scope.searchFormData.country && $scope.countryList.length > 0) {
                $scope.searchFormData.country = $filter('filter')($scope.countryList, { id: $scope.searchFormData.country.id }, true)[0];
            }
        }

        function selectLocation() {
            if ($scope.searchFormData != null && !!$scope.searchFormData.locality && $scope.countryList.length > 0) {
                $scope.searchFormData.country = $filter('filter')($scope.countryList, { text: $scope.searchFormData.locality }, true)[0];
            }
        }

        $scope.onCountryChange = function () {

            $('#location').val('');
            initializeAutoComplete($scope.searchFormData.country.shortCode);
        }


        function getBusinessTypeList() {

            var fdata = { type: 3 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.businessTypeList = data;

                    selectBusinessType();

                    if ($scope.searchFormData.popularSearch) selectBusiness();
                }
            });
        };

        function selectBusinessType() {
            if ($scope.searchFormData != null && !!$scope.searchFormData.businessType && $scope.businessTypeList.length > 0) {
                $scope.searchFormData.businessType = $filter('filter')($scope.businessTypeList, { id: $scope.searchFormData.businessType.id }, true)[0];
            }
        }

        function selectBusiness() {
            if ($scope.searchFormData != null && !!$scope.searchFormData.popularSearch && $scope.businessTypeList.length > 0) {
                $scope.searchFormData.businessType = $filter('filter')($scope.businessTypeList, { text: $scope.searchFormData.popularSearch }, true)[0];
            }
        }

        function doSearch(includeFilters) {

            //var fdata = {};

            var filters = setfilters();
            filters.includeFilters = includeFilters;
            filters.location = $("#location").val();

            if (filters.businessType) {
                filters.businessType = filters.businessType.id;
            }

            if (filters.country) {
                filters.country = filters.country.id;
            }

            //console.log('fdata - ', fdata);
            var promise = $http.post(DATA_URLS.SEARCH_SERVICE, filters);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {

                    //$scope.recordList = data.listing;
                    var lst = data.listing;

                    angular.forEach(lst, function (value, key) {
                        $scope.recordList.push(value);
                    });

                    if (lst.length == 0 && $scope.pageNumber == 1) {
                        $scope.nomoreresult = 'No post found matching your search';
                    }
                    else if (lst.length == 0 && $scope.pageNumber > 1) {
                        $scope.nomoreresult = 'It looks like there are no more search results matching';
                    }
                    else if ($scope.pageNumber == 1 && $scope.pageSize > lst.length) {
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
                        if (v.featuredImage) {
                            v.featuredImage = DATA_URLS.BASEURL + v.featuredImage;
                        }

                        if (v.description && v.description.length > 51)
                            v.description = v.description.limit(45);

                        angular.forEach(v.images, function (v1) {
                            if (v1.fileName) {
                                v1.fileName = v1.fileName.replace(/\\/g, "\/");
                                v1.fileName = DATA_URLS.BASEURL + v1.fileName;
                            }

                        });
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

            searchFilter.businessType = $scope.searchFormData.businessType;
            searchFilter.country = $scope.searchFormData.country;
            searchFilter.location = $scope.searchFormData.location;
            searchFilter.businessName = $scope.searchFormData.businessName;

            return searchFilter;
        }

        function getCategoryList() {

            var fdata = {};
            var promise = $http.post(DATA_URLS.LIST_CATEGORY, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    //$scope.categoryList = data;
                }
            });
        }

        $scope.onEdit = function (item) {
            localStorageService.set('serviceId', item.id);
            window.location.href = window.location.origin + '/service/details';
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

        $scope.onPhoneNumber = function (item) {

            var aTag = document.createElement('a');
            aTag.setAttribute('href', "tel:" + item.phoneNumber);
            aTag.click();
        }

        $scope.onWebsite = function (item) {

            var aTag = document.createElement('a');
            aTag.href = (item.website.indexOf('http://') != -1 || item.website.indexOf('https://') != -1 ? '' : 'http://') + item.website;
            aTag.setAttribute('target', '_blank');
            aTag.click();
        }

        $scope.onEmail = function (item) {

            var aTag = document.createElement('a');
            aTag.setAttribute('href', "mailto:" + item.email);
            aTag.click();
        }

        $scope.onSortChange = function () {
            $scope.pageNumber = 1;
            $scope.recordList = [];
            $scope.srchCount = 0;

            doSearch(true);
        }
    }]);