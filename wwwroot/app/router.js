app.config(['$routeProvider', 'DATA_URLS', function ($routeProvider, DATA_URLS) {

    $routeProvider
        .when('/', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/home/home.html'
        })
        .when('/otp/verify', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/register/otpScreen.html',
            controller: 'otpScreenController'
        })
        .when('/forgotpassword', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/login/forgotPassword.html',
            controller: 'forgotPasswordController'
        })
        .when('/resetpassword', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/login/resetPassword.html',
            controller: 'resetPasswordController'
        })
        .when('/profile', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/profile.html',
            controller: 'profileController'
        })
        .when('/mylisting', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/mylisting/listingList.html',
            controller: 'listingListController'
        })
        .when('/listing/new', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/mylisting/newListing.html',
            controller: 'newListingController'
        })
        .when('/listing/:uid', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/mylisting/listingDetails.html',
            controller: 'listingDetailsController'
        })
        .when('/product/new/:uid', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/product/newProduct.html',
            controller: 'newProductController'
        })
        .when('/product/:uid', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/product/productDetails.html',
            controller: 'productDetailsController'
        })
        .when('/thankyou', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/thankyou/thankyou.html',
            controller: 'thankyouController'
        })
        .when('/productdetail/:pname/:uid', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/product/productDetails.html',
            controller: 'frontProductDetailsController'
        })
        .when('/profile/details', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/profileDetails.html',
            controller: 'profileDetailsController'
        })
        .when('/changepassword', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/changepassword/changePassword.html',
            controller: 'changePasswordController'
        })
        .when('/search/listing', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/service/searchServiceListing.html',
            controller: 'searchServiceListingController'
        })
        .when('/business/reviews/:name/:uid', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/servicereviews/serviceReviews.html',
            controller: 'serviceReviewsController'
        })
        .when('/enquiries', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/enquiry/enquiryList.html',
            controller: 'enquiryListController'
        })
        .when('/bookmarkList', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/bookmark/bookmarkList.html',
            controller: 'bookmarkListController'
        })
        .when('/product/reviews/:name/:uid', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/productreviews/productReviews.html',
            controller: 'productreviewsController'
        })
        .when('/reviewList', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/profile/reviewlist/reviewList.html',
            controller: 'reviewListController'
        })
        .when('/flight-search', {
            templateUrl: DATA_URLS.ROOT_PATH + 'app/flightsearch/flight-search.html',
            controller: 'flightSearchController'
        })
        .otherwise({
            redirectTo: '/'
        });

    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
}]);
