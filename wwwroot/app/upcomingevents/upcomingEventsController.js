app.controller('upcomingEventsController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant) {

        'use strict';
        $scope.homePageEventList = [];
        $scope.selecteItem = {};
      
        getEvents();

        function getEvents() {

            var promise = $http.post(DATA_URLS.LIST_ACTIVE_EVENT);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.homePageEventList = data;

                    angular.forEach($scope.homePageEventList, function (v) {
                        if (v.listingBanner) {
                            v.listingBanner = v.listingBanner.replace(/\\/g, "\/");
                            v.listingBanner = DATA_URLS.BASEURL + v.listingBanner;
                        }
                        if (v.homePageBanner) {
                            v.homePageBanner = DATA_URLS.BASEURL + v.homePageBanner;
                        }
                        if (v.shortDescription && v.shortDescription.length > 150)
                            v.shortDescription = v.shortDescription.limit(147);
                    });
                }
            });
        }

        $scope.onEventClick = function (item) {
            $scope.selecteItem = angular.copy(item);
            setTimeout(function () {

                $("#upcoming_modal_1").modal();
            }, 300);
        }
    }]);