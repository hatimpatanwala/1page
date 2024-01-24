app.factory('customNavigation', ['$location', function ($location) {

    'use strict';
    var customNavigationFactory = {}

    var _onLoginClick = function () {

        if (mobileApp) {

        }
        else {
            setTimeout(function () {
                $("#sign-popup").toggleClass("active");
                $("#register-popup").removeClass("active");
                $(".wrapper").addClass("overlay-bgg");
            }, 300);
        }
    }

    var _onLoginPageClick = function () {
        if (mobileApp) {
            $location.path('/login');
        }
        else {
            window.location.href = '/login'
        }
    }

    var _onHomeClick = function () {

        if (mobileApp) {

        }
        else {
            window.location.href = '/';
        }
    }

    var _onSellerVerifyClick = function () {
        if (mobileApp) {

        }
        else {
            window.location.href = window.location.origin + '/#/seller/verify';
        }
    }


    var _onSellerLoginClick = function () {
        window.location.href = 'https://seller.tradeify.in/';
    }

    var _onForgotPasswordClick = function () {
        if (mobileApp) {
            $location.path('/forgotpassword');
        }
        else {
            setTimeout(function () {
                window.location.href = window.location.origin + '/#/forgotpassword';
            }, 100);
        }
    }

    var _onNearByTransportClick = function () {
        if (mobileApp) {
            $location.path('/search/transport');
        }
        else {
            window.location.href = window.location.origin + '/#/search/transport';
        }
    }

    var _onVendorProfileClick = function (item) {
        if (mobileApp) {
            $location.path('vendorprofile/' + item.id + '/' + item.companyName);
        }
        else {
            window.location.href = window.location.origin + '/#/vendorprofile/' + item.id + '/' + item.companyName;
        }
    }

    customNavigationFactory.onLoginClick = _onLoginClick;
    customNavigationFactory.onLoginPageClick = _onLoginPageClick;
    customNavigationFactory.onHomeClick = _onHomeClick;
    customNavigationFactory.onSellerVerifyClick = _onSellerVerifyClick;
    customNavigationFactory.onSellerLoginClick = _onSellerLoginClick;
    customNavigationFactory.onForgotPasswordClick = _onForgotPasswordClick;
    customNavigationFactory.onNearByTransportClick = _onNearByTransportClick;
    customNavigationFactory.onVendorProfileClick = _onVendorProfileClick;

    return customNavigationFactory;
}]);

function setUpLink() {
    if (mobileApp) {

    }
    else {
        $('#main-header-logo').attr("href", "/");
        $('#main-header-transport').attr("href", "/transport");
        $('#main-header-buyer').attr("href", "/buyer");

        $('#mobile-header-logo').attr("href", "/");
        $('#mobile-header-transport').attr("href", "/transport");

        $('#sidebar-transport').attr("href", "/transport");

        $("#ft-lnk-aboutus").attr("href", "/aboutus");
        $("#ft-lnk-pricing").attr("href", "/pricing");
        $("#ft-lnk-terms").attr("href", "/terms");
        $("#ft-lnk-privacypolicy").attr("href", "/privacypolicy");
        $("#ft-lnk-disclaimer").attr("href", "/disclaimer");
        $("#ft-lnk-faq").attr("href", "/faq");
        $("#ft-lnk-contactus").attr("href", "/contactus");
    }
}