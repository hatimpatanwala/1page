app.controller('bookmarkListController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', '$routeParams', '$anchorScroll', 'localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, $routeParams, $anchorScroll, localStorageService) {

        'use strict';
        $anchorScroll();
        $scope.recordList = [];
        $scope.isLoading = false;
        $scope.selectedItem = {};
        $scope.selectedItem.index = {};


        getList();

        function getList() {
            $scope.isLoading = true;
            var promise = $http.post(DATA_URLS.LIST_BOOK_MARK);
            promise.then(function (data) {
                $scope.isLoading = false;
                if (!data.status || data.status == 200) {
                    $scope.recordList = data;

                    angular.forEach($scope.recordList, function (v) {
                        v.dateString = timeAgo(Date.parse(v.createdDate));
                    });
                }
            });
        }
        $scope.onServiceClick = function (item) {
            localStorageService.set('serviceId', item.id);
            window.location.href = window.location.origin + '/service/details';
        }

        $scope.onDeleteClick = function (item, index) {
            $scope.selectedItem = item;
            $scope.selectedItem.index = index;
        }

        $scope.delete = function () {
            var promise = $http.post(DATA_URLS.DELETE_BOOK_MARK, $scope.selectedItem.serviceId);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    toastr["success"]("BookMark deleted successfully.", "Success");
                    $scope.recordList.splice($scope.selectedItem.index, 1);
                    $('#closeBookmarkpopup').click();
                }
                $('#confirmDelete').click();
            });

        }
    }]);
