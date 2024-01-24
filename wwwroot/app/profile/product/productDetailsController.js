app.controller('productDetailsController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', '$routeParams', 'appConstant', '$filter', '$anchorScroll','localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, $routeParams, appConstant, $filter, $anchorScroll, localStorageService) {

        'use strict';
        $anchorScroll();
        $scope.editFormData = null;
        $scope.recordList = [];
        $scope.categories = [];
        $scope.productImages = [];
        $scope.edit = false;
        $scope.isLoading = false;
        $scope.docFilePI = null;
        $scope.businessData = {};

        if ($routeParams.uid != undefined) {

            getCategories();
            get($routeParams.uid);
            $scope.businessData = localStorageService.get('businessData');
        }

        function getCategories() {

            var filters = {};
            var promise = $http.post(DATA_URLS.LIST_CATEGORY, filters);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.categories = data;
                    selectCategories();
                }
            });
        }

        function selectCategories() {
            if ($scope.editFormData != null && $scope.categories.length > 0) {

                $scope.editFormData.category = $filter('filter')($scope.categories, { id: $scope.editFormData.category.id })[0];
            }
        }

        function get(id) {
            $scope.isLoading = true;
            var promise = $http.post(DATA_URLS.GET_PRODUCT, id);

            promise.then(function (data) {
                $scope.isLoading = false;
                if (!data.status || data.status == 200) {
                    $scope.editFormData = data;

                    if ($scope.editFormData.imageName) {
                        $scope.editFormData.imageName = DATA_URLS.BASEURL + $scope.editFormData.imageName;
                    }

                    $scope.listPI();
                    selectCategories();
                }
            });
        }

        $scope.listPI = function () {

            var fdata = { productId: $scope.editFormData.id };
            var promise = $http.post(DATA_URLS.LIST_PRODUCTIMAGES, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.productImages = data;

                    angular.forEach($scope.productImages, function (v) {
                        if (v.fileName) {
                            v.fileName = DATA_URLS.BASEURL + v.fileName;
                        }
                    });
                }
            })
        }

        $scope.submit = function () {

            var btn = Ladda.create(document.querySelector('#updatebtn'));
            btn.start();

            var fdata = angular.copy($scope.editFormData);
            var promise = $http.post(DATA_URLS.UPDATE_PRODUCT, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Product updated successfully", "Success");
                    localStorageService.remove('businessData');
                    $location.path('/listing/' + $scope.editFormData.serviceId);
                }
            });
        }

        $scope.new = function () {
            $location.path('/product/new');
        }

        $scope.onBackClick = function () {
            $window.history.back();
        }

        $scope.onEdit = function () {
            $scope.edit = true;
        }

        $scope.onCloseEdit = function () {
            $scope.edit = false;
        }

        $scope.clearPFI = function () {
            $scope.docFilePFI = null;
            $('#fileNamePFI').val('');
        }

        $scope.formDatePI = {};


        $scope.createNewPI = function () {

            var data = new FormData();
            for (var i = 0; i < $scope.docFilePI.length; i++) {
                data.append($scope.docFilePI[i].name, $scope.docFilePI[i]);
                data.append('filename', $scope.docFilePI[i].name);
            }
            data.append('productId', $scope.editFormData.id);
            data.append('sequenceNumber', "0");
            data.append('isActive', "true");

            var promise = $http.post(DATA_URLS.ADD_PRODUCTIMAGE, data, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    toastr["success"]("Product image added.", "Success");

                    $scope.clearPI();
                    $scope.listPI();
                }
            });
        }

        $scope.removePI = function (sb) {

            var btn = Ladda.create(document.querySelector('#deletePIbtn'));
            btn.start();

            var promise = $http.post(DATA_URLS.REMOVE_PRODUCTIMAGE, sb);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Product image removed", "Success");
                    $scope.productImages.splice(sb.index, 1);
                    $('#confirmDeleteImage').click();
                }
            });
        }

        $scope.editPI = function (sb, index) {
            $scope.formDatePI = angular.copy(sb);
            $scope.formDatePI.index = index;
        }

        $scope.updatePI = function (item, isActive) {

            var fdata = angular.copy(item);
            fdata.isActive = isActive;
            var promise = $http.post(DATA_URLS.EDIT_PRODUCTIMAGE, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    toastr["success"]("Product image updated.", "Success");
                    item.isActive = fdata.isActive;

                    $scope.clearPI();
                }
            });
        }

        $scope.selectedImage = null;
        $scope.onImageDelete = function (item, index) {

            $scope.selectedImage = item;
            $scope.selectedImage.index = index;
        }

        $scope.docFilePFI = null;
        $scope.saveFilesReferencePFI = function (files) {
            $scope.docFilePFI = files;
        }

        $scope.clearPFI = function () {
            $scope.docFilePFI = null;
            $('#fileNamePFI').val('');
            $('#fileNamePFI').next('label').html('Choose an image file');
        }

        $scope.savePFI = function () {

            var btn = Ladda.create(document.querySelector('#changeImageBtn'));
            btn.start();

            var data = new FormData();
            data.append('files', $scope.docFilePFI[0]);
            data.append('id', $scope.editFormData.id);

            var config = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }

            var promise = $http.post(DATA_URLS.UPLOAD_PRODUCTFEATUREIMAGE, data, config);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {

                    btn.stop();
                    toastr["success"]("Image added successfully", "Success");
                    $scope.clearPFI();
                    get($routeParams.uid);
                }
            });
        }

        $scope.deleteFeaturedImage = function () {

            var btn = Ladda.create(document.querySelector('#deleteFIbtn'));
            btn.start();

            var fdata = angular.copy($scope.editFormData.id);
            var promise = $http.post(DATA_URLS.DELETEFEATUREDIMAGE_PRODUCT, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Featured image removed.", "Success");
                    $('#deleteFeaturedImage').click();
                    get($routeParams.uid);
                }
            });
        }

        $scope.clearPI = function () {
            $scope.docFilePI = null;
            $('#fileNamePI').val('');
            $('#fileNamePI').next('label').html('Choose an image file');
        }

        $scope.saveFilesReferencePI = function (files) {
            $scope.docFilePI = files;
        }

        //For multiple Image upload
        $scope.savePI = function () {

            var btn = Ladda.create(document.querySelector('#changeImageBtn1'));
            btn.start();

            var data = new FormData();

            angular.forEach($scope.docFilePI, function (v) {
                data.append('files', v);
            });

            data.append('id', $scope.editFormData.id);

            var config = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }

            var promise = $http.post(DATA_URLS.UPLOAD_PRODUCTIMAGE, data, config);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {

                    btn.stop();
                    toastr["success"]("Image added successfully", "Success");
                    $scope.clearPI();
                    get($routeParams.uid);
                }
            });
        }
    }]);;