app.controller('browserServiceListingController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant) {

        'use strict';
        $scope.selectedBusinessType = $('#forSrvListing').val();
    }]);