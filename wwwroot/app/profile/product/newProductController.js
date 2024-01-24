app.controller('newProductController', ['$scope', '$rootScope', '$window', '$location', '$http', 'authService', 'DATA_URLS', '$filter', 'appConstant', '$routeParams', '$anchorScroll', 'localStorageService',
    function ($scope, $rootScope, $window, $location, $http, authService, DATA_URLS, $filter, appConstant, $routeParams, $anchorScroll, localStorageService) {

        'use strict';
        $anchorScroll();
        $scope.formData = {};
        $scope.formData.isAvailable = true;
        $scope.imageFiles = null;
        var btn = null;
        $scope.categoryList = [];
        $scope.businessData = {};

        if ($routeParams.uid != undefined) {
            $scope.listingId = parseInt($routeParams.uid);
            $scope.businessData = localStorageService.get('businessData');
        }

        getList();

        function getList() {

            var fdata = {};
            var promise = $http.post(DATA_URLS.LIST_CATEGORY, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.categoryList = data;
                }
            });
        };

        $scope.submit = function () {

            btn = Ladda.create(document.querySelector('#createbtn'));
            btn.start();

            var fdata = angular.copy($scope.formData);
            fdata.serviceId = $scope.listingId;

            var promise = $http.post(DATA_URLS.NEW_PRODUCT, fdata);

            promise.then(function (data) {
                if (!data.status || data.status === 200) {

                    if ($scope.imageFiles) {
                        $scope.submitImageFile(data.id);
                    }
                    else {
                        toastr["success"]("New product added successfully", "Success");
                        localStorageService.remove('businessData');
                        $location.path('/listing/' + $scope.listingId);
                    }
                }
                else {
                    btn.stop();
                }
            });
        }

        $scope.saveFileImage = function (files) {
            $scope.imageFiles = files;
        }

        $scope.submitImageFile = function (id) {

            var data = new FormData();
            data.append('files', $scope.imageFiles[0]);
            data.append('id', id);

            var config = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }

            var promise = $http.post(DATA_URLS.UPLOAD_PRODUCTFEATUREIMAGE, data, config);

            promise.then(function (data) {

                if (!data.status || data.status == 200) {

                    $scope.imageFiles = null;
                    $('#customFile').val('');
                }

                btn.stop();
                toastr["success"]("New product added successfully", "Success");
                localStorageService.remove('businessData');
                $location.path('/listing/' + $scope.listingId);
            });
        }

        $scope.onBackClick = function () {
            $window.history.back();
        }

    }]);