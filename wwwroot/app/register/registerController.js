app.controller('registerController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', 'appConstant', 'localStorageService', '$filter',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, appConstant, localStorageService, $filter) {

        'use strict';
        $scope.countryList = [];
        $scope.businessTypeList = [];
        $scope.cityList = [];
        $scope.stateList = [];
        $scope.formData = {};
        $scope.imageFiles = null;
        var btn = null;

        initializeAddress();
        initializeAutoComplete();
        getCountryList();
        getCityList();
        getBusinessTypeList();
        getStateList();

        var localityAutocomplete;
        function initializeAutoComplete() {

            var options = {
                types: ['(regions)'],
                //componentRestrictions: { country: "in" }
            };
            var input = document.getElementById('locality');

            localityAutocomplete = new google.maps.places.Autocomplete(input, options);
            google.maps.event.addListener(localityAutocomplete, 'place_changed', function () {
                //console.log(JSON.stringify(localityAutocomplete.getPlace()));

            });
        }

        function initializeAddress() {
            var input = document.getElementById("select-ml");
            var autocomplete = new google.maps.places.Autocomplete(input);

            autocomplete.setComponentRestrictions({

            });

            autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

            autocomplete.addListener("place_changed", function () {

                var place = autocomplete.getPlace();

                // console.log('place lat - ', place.geometry.location.lat());
                // console.log('place lng - ', place.geometry.location.lng());

                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                // $('#select-ml').val(place);
                $('#lat').val(place.geometry.location.lat());
                $('#lng').val(place.geometry.location.lng());

                onSelectMlChange();
            });
        }

        function getCountryList() {

            var fdata = { type: 1 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.countryList = data;
                }
            });
        };

        function getCityList() {

            var fdata = { type: 2 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.cityList = data;
                }
            });
        };

        function getStateList() {

            var fdata = { type: 5 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.stateList = data;
                }
            });
        };

        function getBusinessTypeList() {

            var fdata = { type: 3 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.businessTypeList = data;
                }
            });
        };

        $scope.submit = function () {

            if ($scope.formData.password != $scope.formData.confirmPassword) {
                alert('Password & confirm password does not match.');
                return;
            }

            btn = Ladda.create(document.querySelector('#createbtn'));
            btn.start();

            var fdata = angular.copy($scope.formData);
            fdata.role = 'Seller';
            fdata.address1 = $('#select-ml').val();
            fdata.latitude = parseFloat($('#lat').val());
            fdata.longitude = parseFloat($('#lng').val());
            fdata.isBusinessUser = true;
            var promise = $http.post(DATA_URLS.REGISTER, fdata);

            promise.then(function (data) {
                if (!data.status || data.status === 200) {
                    localStorageService.set('registeredBuyer', data);

                    if ($scope.imageFiles) {
                        $scope.submitImageFile(data.id);
                    }
                    else {
                        toastr["success"]("Registration successful, please enter OTP to complete.", "Success");
                        //$location.path('/otp/verify');
                        window.location.href = '/#otp/verify'
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

            var promise = $http.post(DATA_URLS.UPLOAD_IMAGE, data, config);

            promise.then(function (data) {

                if (!data.status || data.status == 200) {

                    $scope.imageFiles = null;
                    $('#customFile').val('');
                }

                btn.stop();
                //toastr["success"]("Page banner added successfully", "Success");
                $location.path('/otp/verify');
            });
        }

        $scope.onBackClick = function () {
            $window.history.back();
        }

        $scope.onStateClick = function () {
            $scope.formData.country = $filter('filter')($scope.countryList, { id: $scope.formData.state.parent })[0];
        }

        $scope.onCityClick = function () {
            $scope.formData.state = $filter('filter')($scope.stateList, { id: $scope.formData.city.parent })[0];

            $scope.onStateClick();
        }

        //-----------google maps----------------//

        var geocoder, map, marker, mapzoom = 17, animationInterval;

        // Initialize and add the map
        function initMap() {

            if ($('#lat').val() && $('#lng').val()) {

                var selectedLocation = { lat: parseFloat($('#lat').val()), lng: parseFloat($('#lng').val()) };

                // The map, centered at SelectedLocation
                map = new google.maps.Map(document.getElementById("map"), {
                    center: selectedLocation,
                    zoom: mapzoom,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                // The marker, positioned at SelectedLocation
                marker = new google.maps.Marker({
                    position: selectedLocation,
                    map: map,
                });

                getPlaceOnMapClick();
                getAddress(selectedLocation);
            }
            else {
                //set default location
            }
        }

        function getPlaceOnMapClick() {

            geocoder = new google.maps.Geocoder();

            google.maps.event.addListener(map, 'click', function (event) {

                console.log('map click lat- ', event.latLng.lat());
                console.log('map click lng- ', event.latLng.lng());

                var latlng = { lat: event.latLng.lat(), lng: event.latLng.lng() };

                placeMarker(latlng);
            });
        }

        function placeMarker(location) {

            if (marker) {
                marker.setPosition(location);
            } else {
                marker = new google.maps.Marker({
                    position: location,
                    map: map
                });
            }

            $('#lat').val(location.lat);
            $('#lng').val(location.lng);
            getAddress(location);
        }

        function getAddress(latLng) {
            //console.log('getAddress latLng -', latLng);

            geocoder.geocode({ 'latLng': new google.maps.LatLng(latLng.lat, latLng.lng) },
                function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            $('#select-ml').val(results[0].formatted_address);
                        }
                        else {
                            alert("No results");
                        }
                    }
                    else {
                        alert(status);
                    }
                });
        }

        function onSelectMlChange() {

            if ($('#lat').val() && $('#lng').val()) {
                var latlng = { lat: parseFloat($('#lat').val()), lng: parseFloat($('#lng').val()) };

                //var latlng = new google.maps.LatLng(parseFloat($('#lat').val()), parseFloat($('#lng').val()));
                if (map) {
                    map.setCenter(latlng);
                    placeMarker(latlng);
                }
                else {

                    // The map, centered at SelectedLocation
                    map = new google.maps.Map(document.getElementById("map"), {
                        center: latlng,
                        zoom: mapzoom,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });

                    // The marker, positioned at SelectedLocation
                    marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                    });

                    getPlaceOnMapClick();
                    getAddress(selectedLocation);
                }
            }
        }

        function getCurrentLocation() {

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {

                    //var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var latlng = { lat: position.coords.latitude, lng: position.coords.longitude };

                    map.setCenter(latlng);

                    if (animationInterval) {
                        clearInterval(animationInterval);
                    }
                    placeMarker(latlng);

                    secondChild.style['background-position'] = '-144px 0';
                }, function (err) {
                    alert('We cannot locate your current location. Please change your mobile phone location permission settings.');
                    if (animationInterval) {
                        clearInterval(animationInterval);
                    }
                },
                    { enableHighAccuracy: true, timeout: 5000 });
            } else {

                if (animationInterval) {
                    clearInterval(animationInterval);
                }
                secondChild.style['background-position'] = '0 0';
            }
        }

        setTimeout(function () { initMap(); }, 500);
    }]);