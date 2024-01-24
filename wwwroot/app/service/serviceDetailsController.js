app.controller('serviceDetailsController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant', 'localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant, localStorageService) {

        'use strict';
        $scope.serviceId = null;
        $scope.serviceId = parseInt(localStorageService.get('serviceId'));
        //localStorageService.remove('serviceId');
        $scope.editFormData = {};
        $scope.serviceImages = [];
        $scope.serviceReviewList = [];
        $scope.formData = {};
        $scope.userDate = {};
        $scope.isUserAuthenticated = authService.authentication.isAuth;
        $scope.totalCount = 0;
        $scope.serviceReviewCount = {};
        $scope.reviewAveragecount = 0;
        $scope.isRatingZero = false;
        $scope.reviewWidthPercentage = {};
        $scope.selectedService = null;

        get($scope.serviceId);
        starCountReviews($scope.serviceId);

        if ($scope.isUserAuthenticated) {
            $scope.userData = authService.authentication.loginData;
            $scope.formData.phoneNumber = $scope.userData.phoneNumber;
            $scope.formData.name = $scope.userData.firstName + $scope.userData.lastName;
            $scope.formData.email = $scope.userData.email;
        };

        $rootScope.$on('authStatusChanged', function () {
            $scope.isUserAuthenticated = authService.authentication.isAuth;
            if ($scope.isUserAuthenticated) {
                $scope.userData = authService.authentication.loginData;
            }
        });

        function get(id) {

            var promise = $http.post(DATA_URLS.VIEW_AND_GET_SERVICE, id);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.editFormData = data;

                    if ($scope.editFormData.featuredImage) {
                        $scope.editFormData.featuredImage = DATA_URLS.BASEURL + $scope.editFormData.featuredImage;
                    }

                    $scope.editFormData.dateString = timeAgo(Date.parse($scope.editFormData.createdDate));

                    selectLocation();
                    $scope.listPI();
                    $scope.listServiceReviews();
                    initMap();
                }
            });
        }

        function selectLocation() {
            if ($scope.editFormData.address1)
                $('#select-ml').val($scope.editFormData.address1);

            if ($scope.editFormData.latitude)
                $('#lat').val($scope.editFormData.latitude);

            if ($scope.editFormData.longitude)
                $('#lng').val($scope.editFormData.longitude);
        }

        $scope.listPI = function () {

            var fdata = { serviceId: $scope.editFormData.id };
            var promise = $http.post(DATA_URLS.FRONT_LIST_ACTIVESERVICEIMAGES, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.serviceImages = data;

                    angular.forEach($scope.serviceImages, function (v) {
                        if (v.fileName) {
                            v.fileName = v.fileName.replace(/\\/g, "\/");
                            v.fileName = DATA_URLS.BASEURL + v.fileName;
                        }
                    });

                    if ($scope.serviceImages.length > 1) {
                        setTimeout(sCarousel, 250);
                    }
                }
            })
        }

        function sCarousel() {

            $('#slid_photo').show();

            $('#slid_photo').owlCarousel({
                loop: true,
                margin: 10,
                nav: true,
                dots: false,
                responsive: {
                    0: {
                        items: 3
                    },
                    600: {
                        items: 4
                    },
                    1000: {
                        items: 6
                    }
                }
            })
        }

        $scope.listServiceReviews = function () {

            var fdata = { serviceId: $scope.editFormData.id };
            var promise = $http.post(DATA_URLS.LIST_SERVICE_REVIEW, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.serviceReviewList = data.list;
                    $scope.totalCount = data.totalCount;
                }
            })
        }

        $scope.submit = function () {
            if ($scope.formData.review == 0 || $scope.formData.review == null) {
                $scope.isRatingZero = true;
                return;
            }
            $scope.selectRating = true;
            var btn = Ladda.create(document.querySelector('#enqrybtn'));
            btn.start();

            var fdata = angular.copy($scope.formData);
            fdata.serviceId = $scope.editFormData.id;
            var promise = $http.post(DATA_URLS.ADD_SERVICE_REVIEW, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Review submitted successfully.", "Success");
                    $('#editBox').click();
                    $scope.formData = {};
                    $scope.serviceReviewList.unshift(data);
                    $scope.totalCount += 1;
                    starCountReviews($scope.serviceId);
                }
            });
        }

        $scope.viewAllReviews = function () {
            window.location.href = '/#/business/reviews/' + $scope.editFormData.businessName + '/' + $scope.editFormData.id;
        }

        $scope.onRatingClick = function (item) {
            $scope.formData.review = item;
        }
        $scope.onSubmitClick = function () {
            if ($scope.isUserAuthenticated) {
                $scope.submit();
            }
            else {
            }
        }

        function starCountReviews(id) {

            var promise = $http.post(DATA_URLS.STAR_COUNT_SERVICE_REVIEW, id);

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
            })
        }

        $scope.onAddBookMark = function () {

            //$scope.selectedItem = item;
            var promise = $http.post(DATA_URLS.ADD_BOOK_MARK, $scope.editFormData.id);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {

                    toastr["success"]("Book mark added successfully.", "Success");
                    $scope.editFormData.isBookMarked = true;
                }
            });
        }

        $scope.onAddBookMarkClick = function () {
            if ($scope.isUserAuthenticated) {
                $scope.onAddBookMark();

            }
            else {

                $('#hdforbookmark').click();
            }
        }
        function calculateAverage(OneStar, TwoStar, ThreeStar, FourStar, FiveStar, totalStar) {
            $scope.reviewAveragecount = Math.round((5 * FiveStar + 4 * FourStar + 3 * ThreeStar + 2 * TwoStar + 1 * OneStar) / totalStar);
        }

        $scope.onPhoneNumber = function () {
            if ($scope.editFormData.phoneNumber) {
                var aTag = document.createElement('a');
                aTag.setAttribute('href', "tel:" + $scope.editFormData.phoneNumber);
                aTag.click();
            }
        }

        $scope.onWebsite = function () {
            if ($scope.editFormData.website) {
                var aTag = document.createElement('a');
                aTag.href = ($scope.editFormData.website.indexOf('http://') != -1 || $scope.editFormData.website.indexOf('https://') != -1 ? '' : 'http://') + $scope.editFormData.website;
                aTag.setAttribute('target', '_blank');
                aTag.click();
            }
        }

        $scope.onEmail = function () {
            if ($scope.editFormData.email) {
                var aTag = document.createElement('a');
                aTag.setAttribute('href', "mailto:" + $scope.editFormData.email);
                aTag.click();
            }
        }

        var geocoder, map, marker, mapzoom = 17, animationInterval;

        // Initialize and add the map
        function initMap() {

            if ($('#lat').val() && $('#lng').val()) {

                var selectedLocation = { lat: parseFloat($('#lat').val()), lng: parseFloat($('#lng').val()) };

                // The map, centered at SelectedLocation
                map = new google.maps.Map(document.getElementById("map"), {
                    center: selectedLocation,
                    zoom: mapzoom,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                // The marker, positioned at SelectedLocation
                marker = new google.maps.Marker({
                    position: selectedLocation,
                    map: map,
                });
            }
        }

        // setTimeout(function () { initMap(); }, 500);
    }]);