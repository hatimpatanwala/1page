app.controller('listingListController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', '$routeParams','$anchorScroll',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, $routeParams, $anchorScroll) {

        'use strict';
        $anchorScroll();
        $scope.recordList = [];
        $scope.isLoading = false;


        getList();

        function getList() {
            $scope.isLoading = true;
            var filters = {};
            var promise = $http.post(DATA_URLS.LIST_SERVICE, filters);
            promise.then(function (data) {
                $scope.isLoading = false;
                if (!data.status || data.status == 200) {
                    $scope.recordList = data;

                    angular.forEach($scope.recordList, function (v) {
                        if (v.featuredImage) {
                            v.featuredImage = DATA_URLS.BASEURL + v.featuredImage;
                        }
                    });
                }
            });
        }

        $scope.onEdit = function (item) {
            $location.path('listing/' + item.id);
        }

        $scope.onBackClick = function () {
            $window.history.back();
        }

        $scope.new = function () {
            $location.path('/listing/new');
        }
    }]);