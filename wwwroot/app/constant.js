app.constant('appConstant', {
    appBaseurl: '/',
    ClientId: 'ngAuthApp',
    HomePageCarouselSize: 15,
    PaginationRangeSize: 5,

    MasterTypeList: [
        { id: 1, text: 'Country' },
        { id: 2, text: 'City' },
        { id: 3, text: 'Business Type' },
        { id: 4, text: 'Timezone' },
        { id: 5, text: 'State' },
    ],

    LocalStorageKeys: {
        SearchFormData: "srch_frm_data"
    },

    SortBy: [
        { id: 1, text: 'Most Relevant' },
        { id: 2, text: 'A to Z' },
        { id: 3, text: 'Z to A' }
    ],

    MarketPlaceSortBy: [
        { id: 1, text: 'Most Relevant' },
        { id: 2, text: 'Price - Low to High' },
        { id: 3, text: 'Price - High to Low' },
        { id: 4, text: 'Newest First' },
    ]
});

app.constant('DATA_URLS', (function () {
    'use strict';

    var URLS = {
        // ROOT_PATH: baseUrl,
        BASEURL: baseUrl,
        ROOT_PATH: '/',
        DEFAULT_PATH: '/dashboard',

        Authenticate: baseUrl + 'Accounts/Authenticate',
        VerifyPhone: baseUrl + 'Accounts/verify-phone',
        ReSendMobileOTP: baseUrl + 'Accounts/resend-mobile-otp',
        FORGOT_PASSWORD: baseUrl + 'Accounts/forgot-password',
        VERIFY_OTP: baseUrl + 'Accounts/validate-reset-token',
        VerifyEmailOTP: baseUrl + 'Accounts/VerifyEmailOTP',
        UPDATE_EMAIL: baseUrl + 'Accounts/UpdateEmail',
        UPDATE_PHONENO: baseUrl + 'Accounts/UpdatePhoneNo',
        UPDATE_USER: baseUrl + 'Accounts/Update',
        GET_USER: baseUrl + 'Accounts/Get',
        UPLOAD_PROFILE_IMAGE: baseUrl + 'Accounts/UploadImage',
        DELETE_PROFILE_IMAGE: baseUrl + 'Accounts/DeleteImage',

        REGISTER: baseUrl + 'Accounts/Register',
        UPLOAD_IMAGE: baseUrl + 'Accounts/UploadImage',
        VerifyEmail: baseUrl + 'Accounts/verify-email',
        ReSendEmailOTP: baseUrl + 'Accounts/resend-email-otp',
        RESET_PASSWORDLOGIN: baseUrl + 'Accounts/resetPasswordLogin',
        RESET_PASSWORD: baseUrl + 'Accounts/reset-password',

        LIST_ACTIVEMV: baseUrl + 'api/Common/ActiveList',
        LIST_PAGEBANNER: baseUrl + 'api/Common/PageBannerList',
        ADD_ENQUIRY: baseUrl + 'api/Common/AddEnquiry',
        POPULAR_LOCATION: baseUrl + 'api/Common/PopularLocation',
        POPULAR_SEARCH: baseUrl + 'api/Common/PopularSearch',
        LIST_HOMEPAGE_SERVICE: baseUrl + 'api/Common/HomePageServiceList',
        LIST_HOMEPAGE_EVENT: baseUrl + 'api/Common/HomePageEventList',
        EVENT_DATA: baseUrl + 'api/Common/EventData',
        LIST_ACTIVE_EVENT: baseUrl + 'api/Common/ActiveEventList',
        ADD_PRODUCT_ENQUIRY: baseUrl + 'api/Common/AddProductEnquiry',
        LIST_PRODUCT_ENQUIRY: baseUrl + 'api/Common/ProductEnquiryList',
        ADD_NEWSLETTER: baseUrl + 'api/Common/AddNewsLetter',

        NEW_SERVICE: baseUrl + 'api/Service/Add',
        LIST_SERVICE: baseUrl + 'api/Service/List',
        GET_SERVICE: baseUrl + 'api/Service/Get',
        UPDATE_SERVICE: baseUrl + 'api/Service/Update',
        DELETE_SERVICE: baseUrl + 'api/Service/Delete',
        LIST_SERVICEIMAGES: baseUrl + 'api/Service/ListServiceImages',
        EDIT_SERVICEIMAGE: baseUrl + 'api/Service/EditServiceImage',
        DELETEFEATUREDIMAGE_SERVICE: baseUrl + 'api/Service/DeleteFeaturedImage',
        REMOVE_SERVICEIMAGE: baseUrl + 'api/Service/RemoveServiceImage',
        UPLOAD_SERVICEFEATUREIMAGE: baseUrl + 'api/Service/UploadServiceFeaturedImage',
        UPLOAD_SERVICEIMAGE: baseUrl + 'api/Service/UploadServiceImage',

        FRONT_LIST_SERVICE: baseUrl + 'api/Service/ListService',
        VIEW_AND_GET_SERVICE: baseUrl + 'api/Service/ViewAndGetService',
        FRONT_LIST_ACTIVESERVICEIMAGES: baseUrl + 'api/Service/ListActiveServiceImages',
        LIST_POPULAR_SERVICE: baseUrl + 'api/Service/PopularServiceList',
        SEARCH_SERVICE: baseUrl + 'api/Service/Search',
        GET_SERVICE_FOR_REVIEW: baseUrl + 'api/Service/GetService',
        //LIST_HOMEPAGE_SERVICE: baseUrl + 'api/Service/HomePageServiceList',
        DELETE_SERVICE_TIME: baseUrl + 'api/Service/DeleteServiceTiming',

        NEW_PRODUCT: baseUrl + 'api/Product/Add',
        LIST_PRODUCT: baseUrl + 'api/Product/List',
        GET_PRODUCT: baseUrl + 'api/Product/Get',
        UPDATE_PRODUCT: baseUrl + 'api/Product/Update',
        DELETE_PRODUCT: baseUrl + 'api/Product/Delete',
        LIST_PRODUCTIMAGES: baseUrl + 'api/Product/ListProductImages',
        EDIT_PRODUCTIMAGE: baseUrl + 'api/Product/EditProductImage',
        DELETEFEATUREDIMAGE_PRODUCT: baseUrl + 'api/Product/DeleteFeaturedImage',
        REMOVE_PRODUCTIMAGE: baseUrl + 'api/Product/RemoveProductImage',
        UPLOAD_PRODUCTFEATUREIMAGE: baseUrl + 'api/Product/UploadProductFeaturedImage',
        UPLOAD_PRODUCTIMAGE: baseUrl + 'api/Product/UploadProductImage',

        SEARCH_PRODUCT: baseUrl + 'api/Product/Search',
        FRONT_GET_PRODUCT: baseUrl + 'api/Product/GetProduct',
        FRONT_LIST_ACTIVEPRODUCTIMAGES: baseUrl + 'api/Product/ListActiveProductImages',
        LIST_RELATEDPRODUCT: baseUrl + 'api/Product/ListRelatedProduct',
        GET_PRODUCT_FOR_REVIEW: baseUrl + 'api/Product/GetProductForReview',

        POPULAR_PRODUCT_LIST: baseUrl + 'api/Product/PopularList',

        LIST_CATEGORY: baseUrl + 'api/Category/List',

        LIST_SERVICE_REVIEW: baseUrl + 'api/ServiceReivew/List',
        ADD_SERVICE_REVIEW: baseUrl + 'api/ServiceReivew/Add',
        UPLOAD_SERVIC_IMAGE: baseUrl + 'api/ServiceReivew/UploadImage',
        LIST_ALL_SERVICE_REVIEW: baseUrl + 'api/ServiceReivew/ListAll',
        STAR_COUNT_SERVICE_REVIEW: baseUrl + 'api/ServiceReivew/ServiceStarCount',
        REVIEW_LIST_FOR_BUSINESS: baseUrl + 'api/ServiceReivew/ListForBussinessUser',

        LIST_BOOK_MARK: baseUrl + 'api/WishList/List',
        ADD_BOOK_MARK: baseUrl + 'api/WishList/Add',
        DELETE_BOOK_MARK: baseUrl + 'api/WishList/Delete',

        //Product review
        LIST_PRODUCT_REVIEW: baseUrl + 'api/ProductReview/List',
        ADD_PRODUCT_REVIEW: baseUrl + 'api/ProductReview/Add',
        UPLOAD_PRODUCT_IMAGE: baseUrl + 'api/ProductReview/UploadImage',
        LIST_ALL_PRODUCT_REVIEW: baseUrl + 'api/ProductReview/ListAll',
        STAR_COUNT_PRODUCT_REVIEW: baseUrl + 'api/ProductReview/ProductStarCount',
        REVIEW_LIST_FOR_PRODUCT: baseUrl + 'api/ProductReview/ListForBussinessUser',

        //Common
        PROFILE_DASHBOARD: baseUrl + 'api/Common/DashboardResult',
    };

    return URLS;
}()))