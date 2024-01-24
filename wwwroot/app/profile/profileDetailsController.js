app.controller('profileDetailsController', ['$scope', '$rootScope', '$window', '$location', '$http', 'authService', 'DATA_URLS', '$filter', 'appConstant', '$anchorScroll', 'localStorageService',
    function ($scope, $rootScope, $window, $location, $http, authService, DATA_URLS, $filter, appConstant, $anchorScroll, localStorageService) {

        'use strict';
        $scope.userData = {};
        $anchorScroll();
        $scope.editFormData = {};
        $scope.profileImageFile = null;
        $scope.profileImageFileSrc = null;
        $scope.isUserAuthenticated = authService.authentication.isAuth;
        if ($scope.isUserAuthenticated) { $scope.userData = authService.authentication.loginData; };

        get();

        function get() {
            var promise = $http.post(DATA_URLS.GET_USER);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.editFormData = data;

                    if ($scope.editFormData.image) {

                        var authentication = {};
                        authentication.isAuth = true;
                        authentication.loginData = {
                            id: $scope.userData.id,
                            firstName: $scope.userData.firstName,
                            lastName: $scope.userData.lastName,
                            email: $scope.userData.email,
                            phoneNumber: $scope.userData.phoneNumber,
                            role: $scope.userData.role,
                            created: $scope.userData.created,
                            isVerified: $scope.userData.isVerified,
                            jwtToken: $scope.userData.jwtToken,
                            image: $scope.editFormData.image,
                        };
                        localStorageService.set('authentication', authentication);
                        $rootScope.$broadcast('authStatusChanged');
                        $scope.editFormData.image = DATA_URLS.BASEURL + $scope.editFormData.image;
                    }
                }
            });
        }

        $scope.submit = function () {

            var btn = Ladda.create(document.querySelector('#updatebtn'));
            btn.start();

            var fdata = angular.copy($scope.editFormData);
            var promise = $http.post(DATA_URLS.UPDATE_USER, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Profile updated successfully", "Success");
                }
            });
        }

        $scope.openFileDialog = function () {
            $('#profilepic').click();
        }
        $scope.saveReqAttach = function (files) {
            $scope.profileImageFile = files;

            var reader = new FileReader();

            reader.onload = function (data) {

                var src = data.target.result;
                $scope.profileImageFileSrc = src;

                var phase = $rootScope.$$phase;
                if (!(phase === '$apply' || phase === '$digest')) {
                    $rootScope.$apply();
                }
            }
            reader.readAsDataURL($scope.profileImageFile[0]);
        }

        $scope.uploadProfilePhoto = function () {

            var btn = Ladda.create(document.querySelector('#btn'));
            btn.start();

            var data = new FormData();

            if (!!$scope.profileImageFile && $scope.profileImageFile.length > 0) {
                data.append('files', $scope.profileImageFile[0]);
            }
            if (!!$scope.editFormData.id) {
                data.append('id', $scope.editFormData.id);
            }

            var config = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }

            var promise = $http.post(DATA_URLS.UPLOAD_PROFILE_IMAGE, data, config);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    $scope.editFormData.image = $scope.profileImageFile[0].name;
                    $scope.profileImageFile = null;
                    $scope.profileImageFileSrc = null;
                    $('#profilepic').val('');
                    toastr["success"]("Profile image uploaded successfully", "Success");
                    get();

                    $rootScope.$broadcast("onProfileChange");
                }
                btn.stop();
            });
        }

        $scope.deleteProfilePhoto = function () {

            var btn = Ladda.create(document.querySelector('#deletebtn'));
            btn.start();

            var promise = $http.post(DATA_URLS.DELETE_PROFILE_IMAGE, $scope.editFormData.id);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Profile image removed", "Success");
                    $scope.editFormData.image = null;

                    $rootScope.$broadcast("onProfileChange");

                    var authentication = {};
                    authentication.isAuth = true;
                    authentication.loginData = {
                        id: $scope.userData.id,
                        firstName: $scope.userData.firstName,
                        lastName: $scope.userData.lastName,
                        email: $scope.userData.email,
                        phoneNumber: $scope.userData.phoneNumber,
                        role: $scope.userData.role,
                        created: $scope.userData.created,
                        isVerified: $scope.userData.isVerified,
                        jwtToken: $scope.userData.jwtToken,
                        image: '',
                    };
                    localStorageService.set('authentication', authentication);
                    $rootScope.$broadcast('authStatusChanged');
                }
            });
        }

        $scope.onBackClick = function () {
            $window.history.back();
        }
    }]);