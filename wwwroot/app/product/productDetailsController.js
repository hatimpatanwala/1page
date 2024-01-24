app.controller('frontProductDetailsController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant', '$routeParams', '$anchorScroll', '$timeout',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant, $routeParams, $anchorScroll, $timeout) {

        'use strict';
        $anchorScroll();
        $scope.editFormData = {};
        $scope.productList = [];
        $scope.categoryList = [];
        $scope.productImages = [];
        $scope.formData = {};
        $scope.userDate = {};
        $scope.isUserAuthenticated = authService.authentication.isAuth;
        $scope.isRatingZero = false;
        $scope.productReviewCount = {};
        $scope.totalCount = 0;
        $scope.reviewAveragecount = 0;
        $scope.reviewWidthPercentage = {};
        $scope.productReviewList = [];

        if ($routeParams.uid != undefined) {
            get($routeParams.uid);
            getCategoryList();
            starCountReviews($routeParams.uid);
        }

        if ($scope.isUserAuthenticated) {
            $scope.userData = authService.authentication.loginData;
            $scope.formData.phoneNumber = $scope.userData.phoneNumber;
            $scope.formData.name = $scope.userData.firstName + $scope.userData.lastName;
            $scope.formData.email = $scope.userData.email;
        };



        //$rootScope.$on('authStatusChanged', function () {
        //    $scope.isUserAuthenticated = authService.authentication.isAuth;
        //    if ($scope.isUserAuthenticated) {
        //        $scope.userData = authService.authentication.loginData;
        //    }
        //});

        function get(id) {
            var promise = $http.post(DATA_URLS.FRONT_GET_PRODUCT, id);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.editFormData = data;

                    if ($scope.editFormData.imageName) {
                        $scope.editFormData.imageName = $scope.editFormData.imageName.replace(/\\/g, "\/");
                        $scope.editFormData.imageName = DATA_URLS.BASEURL + $scope.editFormData.imageName;
                    }

                    getRelatedProductsList()
                    $scope.listPI();
                    $scope.listProductReviews();
                }
            });
        }

        function getCategoryList() {

            var fdata = {};
            var promise = $http.post(DATA_URLS.LIST_CATEGORY, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.categoryList = data;
                }
            });
        };

        $scope.listPI = function () {

            var fdata = { productId: $scope.editFormData.id };
            var promise = $http.post(DATA_URLS.FRONT_LIST_ACTIVEPRODUCTIMAGES, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.productImages = data;

                    angular.forEach($scope.productImages, function (v) {
                        if (v.fileName) {
                            v.fileName = v.fileName.replace(/\\/g, "\/");
                            v.fileName = DATA_URLS.BASEURL + v.fileName;
                        }
                    });

                    setTimeout(productimageCarousel, 500);
                }
            })
        }

        function productimageCarousel() {
            $('#prod_sub_slid').owlCarousel({
                loop: true,
                margin: 10,
                nav: true,
                dots: false,
                responsive: {
                    0: {
                        items: 3
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 3
                    }
                }
            })
        }

        function getRelatedProductsList() {

            var fdata = { categoryId: $scope.editFormData.category.id };
            var promise = $http.post(DATA_URLS.LIST_RELATEDPRODUCT, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.productList = [];

                    angular.forEach(data, function (v) {
                        if (v.id != $scope.editFormData.id) {
                            $scope.productList.push(v);
                        }
                    });

                    angular.forEach($scope.productList, function (v) {
                        if (v.imageName) {
                            v.imageName = v.imageName.replace(/\\/g, "\/");
                            v.imageName = DATA_URLS.BASEURL + v.imageName;
                        }
                        if (v.shortDescription && v.shortDescription.length > 51)
                            v.shortDescription = v.shortDescription.limit(48);
                    });

                    setTimeout(productCarousel(), 500);
                }
            });
        };

        function productCarousel() {
            $('#rela_prod_slid').owlCarousel({
                loop: false,
                margin: 10,
                nav: true,
                dots: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 1
                    },
                    1000: {
                        items: 2
                    }
                }
            })
        }

        $scope.onProductClick = function (item) {
            window.location.href = '/#/productdetail/' + item.name + '/' + item.id
        }

        $scope.sendEnquiry = function () {

            var btn = Ladda.create(document.querySelector('#enqrybtn'));
            btn.start();

            var fdata = angular.copy($scope.formData);
            fdata.productId = $scope.editFormData.id;
            var promise = $http.post(DATA_URLS.ADD_PRODUCT_ENQUIRY, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Enquiry sent successfully.", "Success");
                    $('#editBox').click();
                    $scope.formData = {};
                }
            });
        }

        $scope.onRegisterAndSendEnquiry = function () {
            if ($scope.formData.password != $scope.formData.confirmPassword) {
                alert('Password & confirm password does not match.');
                return;
            }
            var btn = Ladda.create(document.querySelector('#enqrybtn'));
            btn.start();

            var fdata = angular.copy($scope.formData);
            fdata.productId = $scope.editFormData.id;
            fdata.firstName = fdata.name;
            var promise = $http.post(DATA_URLS.REGISTER, fdata);
            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Registration & Enquiry sent successfully.", "Success");
                    $('#editBox').click();
                    $scope.formData = {};
                }
            });
        }

        $scope.onSendEnquiryClick = function () {
            $timeout(function () {
                if ($scope.isUserAuthenticated) {
                    $("#message").focus();
                }
                else {
                    $("#name").focus();
                }
            }, 500);
        }
        $scope.onSubmitClick = function () {
            if ($scope.isUserAuthenticated) {
                $scope.sendEnquiry();
            }
            else {
                $scope.onRegisterAndSendEnquiry();
            }
        }
        $scope.submitReview = function () {
            if ($scope.formData.review == 0 || $scope.formData.review == null) {
                $scope.isRatingZero = true;
                return;
            }
            $scope.selectRating = true;
            var btn = Ladda.create(document.querySelector('#enqrybtn'));
            btn.start();

            var fdata = angular.copy($scope.formData);
            fdata.productId = $scope.editFormData.id;
            fdata.review = parseInt(fdata.review);
            var promise = $http.post(DATA_URLS.ADD_PRODUCT_REVIEW, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Review submitted successfully.", "Success");
                    $('#editReviewBox').click();
                    $scope.formData = {};
                    $scope.totalCount += 1;
                    starCountReviews($routeParams.uid);
                }
            });
        }

        $scope.onReviewSubmitClick = function () {
            if ($scope.isUserAuthenticated) {
                $scope.submitReview();
            }
            else {
            }
        }

        $scope.onRatingClick = function (item) {
            $scope.formData.review = item;
        }

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

        $scope.listProductReviews = function () {
            var fdata = { productId: $scope.editFormData.id };
            var promise = $http.post(DATA_URLS.LIST_PRODUCT_REVIEW, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.productReviewList = data.list;
                    $scope.totalCount = data.totalCount;
                }
            })
        }
        $scope.viewAllReviews = function () {
            $anchorScroll();
            window.location.href = '/#/product/reviews/' + $scope.editFormData.name + '/' + $scope.editFormData.id;
        }
    }]);