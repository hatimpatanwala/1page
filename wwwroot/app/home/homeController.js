app.controller('homeController', ['$scope', '$rootScope', '$window', '$location', '$http', 'authService', 'DATA_URLS', '$filter', 'appConstant', 'localStorageService', 'customNavigation',
    function ($scope, $rootScope, $window, $location, $http, authService, DATA_URLS, $filter, appConstant, localStorageService, customNavigation) {

        'use strict';
        $scope.pageBannerList = [];
        $scope.popularServiceListList = [];
        $scope.popularSearchList = [];
        $scope.popularLocationList = [];
        $scope.homePageServiceListList = [];
        $scope.homePageEventList = [];
        $scope.eventData = [];
        $scope.countryList = [];
        $scope.businessTypeList = [];
        $scope.selectedService = null;
        $scope.popularProductListList = [];

        getLocation();
        $scope.latitude = null;
        $scope.longitude = null;
        $scope.formData = {};
        initializeAutoComplete(null);
        getPageBanners();
        getPopularService();
        getPopularLocation();
        getPopularSearch();
        getHomePageService();
        getHomePageEvent();
        getEventData();
        getCountryList();
        getBusinessTypeList();
        getPopularProduct();

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

        function getLocation() {

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.latitude = position.coords.latitude;
                    $scope.longitude = position.coords.longitude;
                });
            }
        }

        function getCountryList() {

            var fdata = { type: 1 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.countryList = data;
                }
            });
        };

        function getBusinessTypeList() {

            var fdata = { type: 3 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.businessTypeList = data;

                    setTimeout(function () {
                        $('#businessType').selectpicker('refresh');
                        $('#businessType1').selectpicker('refresh');
                    }, 500);
                }
            });
        };
      
        function getPageBanners() {

            var fdata = { type: 1 };
            var promise = $http.post(DATA_URLS.LIST_PAGEBANNER, fdata);

            promise.then(function (data) {

                if (!data.status || data.status == 200) {

                    $scope.pageBannerList = data;

                    angular.forEach($scope.pageBannerList, function (v) {
                        if (v.image) {
                            v.image = v.image.replace(/\\/g, "\/");
                            v.image = DATA_URLS.BASEURL + v.image;
                        }
                    });

                    setTimeout(function () {
                        pageBannerCarousel();

                        if ($scope.pageBannerList.length > 0) {
                            $('.dum_bnr').hide();
                        }
                    }, 500);
                }
            });
        }

        function pageBannerCarousel() {
            $('#main_bnr').owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayTimeout: 4000,
                autoplayHoverPause: false,
                responsive: {
                    0: {
                        items: 1,
                        autoplay: false
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

        function getPopularService() {

            var fdata = {};
            var promise = $http.post(DATA_URLS.LIST_POPULAR_SERVICE, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.popularServiceListList = data;

                    angular.forEach($scope.popularServiceListList, function (v) {
                        if (v.featuredImage) {
                            v.featuredImage = v.featuredImage.replace(/\\/g, "\/");
                            v.featuredImage = DATA_URLS.BASEURL + v.featuredImage;
                        }

                        if (v.listingTitle && v.listingTitle.length > 51)
                            v.listingTitle = v.listingTitle.limit(48);
                    });

                    setTimeout(function () {
                        featuredServiceCarousel();
                    }, 500);
                }
            });
        }

        function featuredServiceCarousel() {
            $('#place_slide').owlCarousel({
                loop: false,
                margin: 10,
                nav: true,
                dots: false,
                autoplay: true,
                autoplayTimeout: 4000,
                autoplayHoverPause: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    1000: {
                        items: 3
                    }
                }
            })
        }

        function getPopularLocation() {

            var fdata = {};
            var promise = $http.post(DATA_URLS.POPULAR_LOCATION, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.popularLocationList = data.locations;
                }
            });
        }

        function getPopularSearch() {

            var fdata = {};
            var promise = $http.post(DATA_URLS.POPULAR_SEARCH, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.popularSearchList = data.searches;
                }
            });
        }

        function getHomePageService() {

            var fdata = { type: 3 };
            var promise = $http.post(DATA_URLS.LIST_HOMEPAGE_SERVICE, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.homePageServiceListList = data;

                    angular.forEach($scope.homePageServiceListList, function (v) {
                        if (v.imageName) {
                            v.imageName = v.imageName.replace(/\\/g, "\/");
                            v.imageName = DATA_URLS.BASEURL + v.imageName;
                        }

                        if (v.text) {
                            v.textTrim = v.text.limit(20);
                        }
                        else {
                            v.textTrim = v.text;
                        }

                        if (v.description) {
                            if (v.description.length > 50)
                                v.description = v.description.limit(47);
                        }
                        else {
                            v.description = 'Explore all ' + v.text.toLowerCase() + ' services';
                        }
                    });

                    setTimeout(function () {
                        homeServiceCarousel();
                    }, 500);
                }
            });
        }

        function homeServiceCarousel() {
            $('#service_home_slid').owlCarousel({
                loop: false,
                margin: 10,
                nav: true,
                dots: false,
                autoplay: true,
                autoplayTimeout: 4000,
                autoplayHoverPause: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 4
                    }
                }
            })
        }

        $scope.onServiceClick = function (item) {
            localStorageService.set('serviceId', item.id);
            window.location.href = window.location.origin + '/service/details';
        }

        function getHomePageEvent() {

            var promise = $http.post(DATA_URLS.LIST_HOMEPAGE_EVENT);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.homePageEventList = data;

                    angular.forEach($scope.homePageEventList, function (v) {
                        if (v.listingBanner) {
                            v.listingBanner = DATA_URLS.BASEURL + v.listingBanner;
                        }
                        if (v.homePageBanner) {
                            v.homePageBanner = DATA_URLS.BASEURL + v.homePageBanner;
                        }
                        if (v.shortDescription && v.shortDescription.length > 200)
                            v.shortDescription = v.shortDescription.limit(197);
                    });

                    setTimeout(function () {
                        homeEventCarousel();
                    }, 500);
                }
            });
        }

        function homeEventCarousel() {
            $('#follow_slide').owlCarousel({
                loop: true,
                margin: 10,
                nav: true,
                items: 1,
                dots: false,
                autoplay: false,
                autoplayTimeout: 4000,
                autoplayHoverPause: false,
                responsive: {
                    0: {
                        items: 1,
                        loop: false,
                        margin: 0
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

        function getEventData() {

            var promise = $http.post(DATA_URLS.EVENT_DATA);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.eventData = data;
                    angular.forEach($scope.eventData, function (v) {
                        if (v.shortDescription && v.shortDescription.length > 60)
                            v.shortDescription = v.shortDescription.limit(57);
                    });
                }

            });
        }
        $scope.onSearchClick = function () {
          
            var fdata = angular.copy($scope.formData);
            fdata.location = $("#location").val();
            localStorageService.set(appConstant.LocalStorageKeys.SearchFormData, fdata);
            $location.path('/search/listing');
        }

        $scope.onPopularSearchClick = function (item) {
            var fdata = {};
            fdata.businessType = $filter('filter')($scope.businessTypeList, { text: item.text }, true)[0];
            localStorageService.set(appConstant.LocalStorageKeys.SearchFormData, fdata);
            $location.path('/search/listing');
        }

        $scope.onPopularLocationClick = function (item) {
            var fdata = {};
            fdata.location = item.text;
            localStorageService.set(appConstant.LocalStorageKeys.SearchFormData, fdata);
            $location.path('/search/listing');
        }

        $scope.onPopularListing = function (item) {
            var fdata = {};
            fdata.businessType = $filter('filter')($scope.businessTypeList,  item.id ,true)[0];
            localStorageService.set(appConstant.LocalStorageKeys.SearchFormData, fdata);
            $location.path('/search/listing');
        }

        $scope.onCountryChange = function () {

            $('#location').val('');

            initializeAutoComplete($scope.formData.country.shortCode);
        }

        $scope.onAddBookMark = function (item) {

            //$scope.selectedItem = item;
            var promise = $http.post(DATA_URLS.ADD_BOOK_MARK, item.id);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    toastr["success"]("Book mark added successfully.", "Success");
                    item.isBookMarked = true;
                    item.totalBookMarkedCount = item.totalBookMarkedCount + 1;
                }
            });
        }

        $scope.onAddBookMarkClick = function (item) {
            $scope.selectedService = item;
            console.log(item);
            if ($scope.isUserAuthenticated) {
                $scope.onAddBookMark(item);

            }
            else {

                $('#hdforbookmark').click();
            }
        }

           function getPopularProduct() {

            var fdata = {};
               var promise = $http.post(DATA_URLS.POPULAR_PRODUCT_LIST, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.popularProductListList = data;

                    angular.forEach($scope.popularProductListList, function (v) {
                        if (v.imageName) {
                            v.imageName = v.imageName.replace(/\\/g, "\/");
                            v.imageName = DATA_URLS.BASEURL + v.imageName;
                        }                      
                    });

                    setTimeout(function () {
                        homeProductCarousel();
                    }, 500);
                }
            });
        }

        function homeProductCarousel() {
            $('#product_home_slid').owlCarousel({
                loop: false,
                margin: 10,
                nav: true,
                dots: false,
                autoplay: true,
                autoplayTimeout: 4000,
                autoplayHoverPause: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 4
                    }
                }
            })
        }

        $scope.onProductClick = function (item) {
            window.location.href = '/#/productdetail/' + item.name + '/' + item.id
        }
    }]);
