app.controller('listingDetailsController', ['$scope', 'authService', '$rootScope', '$window', '$location', 'DATA_URLS', '$http', '$routeParams', 'appConstant', '$filter', '$anchorScroll', 'localStorageService',
    function ($scope, authService, $rootScope, $window, $location, DATA_URLS, $http, $routeParams, appConstant, $filter, $anchorScroll, localStorageService) {

        'use strict';
        $anchorScroll();
        $scope.editFormData = null;
        $scope.recordList = [];
        $scope.countryList = [];
        $scope.businessTypeList = [];
        $scope.cityList = [];
        $scope.timezoneList = [];
        $scope.serviceImages = [];
        $scope.edit = false;
        $scope.isLoading = false;
        $scope.docFilePI = null;
        $scope.stateList = [];
        var placedetails = null;

        if ($routeParams.uid != undefined) {
            initializeAddress();
            initializeAutoComplete();
            getCountryList();
            getCityList();
            getStateList();
            getBusinessTypeList();
            getTimezoneList();
            $scope.listingId = parseInt($routeParams.uid);
            get($routeParams.uid);
            getProductList($scope.listingId);
        }

        var localityAutocomplete;
        function initializeAddress() {
            var input = document.getElementById("select-ml");
            var autocomplete = new google.maps.places.Autocomplete(input);

            autocomplete.setComponentRestrictions({
                // country: ["in"],
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

        function initializeAutoComplete() {

            var options = {
                types: ['(regions)'],
                //componentRestrictions: { country: "in" }
            };
            var input = document.getElementById('locality');

            localityAutocomplete = new google.maps.places.Autocomplete(input, options);
            google.maps.event.addListener(localityAutocomplete, 'place_changed', function () {
                //console.log(JSON.stringify(localityAutocomplete.getPlace()));

                placedetails = localityAutocomplete.getPlace();

                var result = locationDetails(placedetails);
                if (result) {
                    //alert(result.city + ' ' + result.state + ' ' + result.country + ' ' + result.pincode);

                    $scope.editFormData.country = result.country;
                    $scope.editFormData.state = result.state;
                    $scope.editFormData.city = result.city;
                    $scope.editFormData.pincode = result.pincode;

                    var phase = $rootScope.$$phase;
                    if (!(phase === '$apply' || phase === '$digest')) {
                        $rootScope.$apply();
                    }
                }

            });
        }

        function getProductList(id) {

            var fdata = { serviceId: id };
            var promise = $http.post(DATA_URLS.LIST_PRODUCT, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.recordList = data;
                }
            });
        };

        function getCountryList() {

            var fdata = { type: 1 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.countryList = data;

                    selectCountry();
                }
            });
        };

        function getCityList() {

            var fdata = { type: 2 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.cityList = data;

                    selectCity();
                }
            });
        };

        function getStateList() {

            var fdata = { type: 5 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.stateList = data;

                    selectState();
                }
            });
        };

        function getBusinessTypeList() {

            var fdata = { type: 3 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.businessTypeList = data;

                    selectBusinessType();
                }
            });
        };

        function getTimezoneList() {

            var fdata = { type: 4 };
            var promise = $http.post(DATA_URLS.LIST_ACTIVEMV, fdata);
            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.timezoneList = data;

                    selectTimezone();
                }
            });
        };

        function selectTimezone() {
            if ($scope.editFormData != null && !!$scope.editFormData.timezone && $scope.timezoneList.length > 0) {
                $scope.editFormData.timezone = $filter('filter')($scope.timezoneList, { text: $scope.editFormData.timezone }, true)[0];
            }
        }

        function selectCountry() {
            if ($scope.editFormData != null && !!$scope.editFormData.country && $scope.countryList.length > 0) {
                $scope.editFormData.country = $filter('filter')($scope.countryList, { id: $scope.editFormData.country.id }, true)[0];
            }
        }

        function selectCity() {
            if ($scope.editFormData != null && !!$scope.editFormData.city && $scope.cityList.length > 0) {
                $scope.editFormData.city = $filter('filter')($scope.cityList, { id: $scope.editFormData.city.id }, true)[0];
            }
        }

        function selectState() {
            if ($scope.editFormData != null && !!$scope.editFormData.state && $scope.stateList.length > 0) {
                $scope.editFormData.state = $filter('filter')($scope.stateList, { id: $scope.editFormData.state.id }, true)[0];
            }
        }

        function selectBusinessType() {
            if ($scope.editFormData != null && !!$scope.editFormData.businessType && $scope.businessTypeList.length > 0) {
                $scope.editFormData.businessType = $filter('filter')($scope.businessTypeList, { id: $scope.editFormData.businessType.id }, true)[0];
            }
        }

        function get(id) {
            $scope.isLoading = true;
            var promise = $http.post(DATA_URLS.GET_SERVICE, id);

            promise.then(function (data) {
                $scope.isLoading = false;
                if (!data.status || data.status == 200) {
                    $scope.editFormData = data;

                    if ($scope.editFormData.featuredImage) {
                        $scope.editFormData.featuredImage = DATA_URLS.BASEURL + $scope.editFormData.featuredImage;
                    }

                    if ($scope.editFormData.openOnDays) {
                        $scope.editFormData.monday = $scope.editFormData.openOnDays.indexOf("Monday") != -1;
                        $scope.editFormData.tuesday = $scope.editFormData.openOnDays.indexOf("Tuesday") != -1;
                        $scope.editFormData.wednesday = $scope.editFormData.openOnDays.indexOf("Wednesday") != -1;
                        $scope.editFormData.thursday = $scope.editFormData.openOnDays.indexOf("Thursday") != -1;
                        $scope.editFormData.friday = $scope.editFormData.openOnDays.indexOf("Friday") != -1;
                        $scope.editFormData.saturday = $scope.editFormData.openOnDays.indexOf("Saturday") != -1;
                        $scope.editFormData.sunday = $scope.editFormData.openOnDays.indexOf("Sunday") != -1;
                    }

                    if ($scope.editFormData.openOnDays) {
                        $scope.editFormData.hoursopt = "1";
                    }
                    else {

                        if ($scope.editFormData.openAllDays) {
                            $scope.editFormData.hoursopt = "2";
                        }

                        if ($scope.editFormData.closeAllDays) {
                            $scope.editFormData.hoursopt = "3";
                        }
                    }

                    angular.forEach($scope.editFormData.hours, function (v) {
                        v.fromDate = setDateTime(v.fromDate);
                        v.toDate = setDateTime(v.toDate);
                    });

                    selectLocation();
                    $scope.listPI();
                    selectBusinessType();
                    selectCity();
                    selectCountry();
                    selectTimezone();
                    selectState();
                    initMap();
                }
            });
        }

        function selectLocation() {
            if ($scope.editFormData.address1)
                $('#select-ml').val($scope.editFormData.address1);

            if ($scope.editFormData.latitude)
                $('#lat').val($scope.editFormData.latitude);

            if ($scope.editFormData.longitude)
                $('#lng').val($scope.editFormData.longitude);
        }

        $scope.listPI = function () {

            var fdata = { serviceId: $scope.editFormData.id };
            var promise = $http.post(DATA_URLS.LIST_SERVICEIMAGES, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    $scope.serviceImages = data;

                    angular.forEach($scope.serviceImages, function (v) {
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

            fdata.address1 = $('#select-ml').val();
            fdata.latitude = parseFloat($('#lat').val());
            fdata.longitude = parseFloat($('#lng').val());

            if (fdata.timezone)
                fdata.timezone = fdata.timezone.text;

            var opendays = [];
            if ($scope.editFormData.monday) { opendays.push("Monday"); }
            if ($scope.editFormData.tuesday) { opendays.push("Tuesday"); }
            if ($scope.editFormData.wednesday) { opendays.push("Wednesday"); }
            if ($scope.editFormData.thursday) { opendays.push("Thursday"); }
            if ($scope.editFormData.friday) { opendays.push("Friday"); }
            if ($scope.editFormData.saturday) { opendays.push("Saturday"); }
            if ($scope.editFormData.sunday) { opendays.push("Sunday"); }

            fdata.openOnDays = opendays.toString();

            fdata.openAllDays = ($scope.editFormData.hoursopt == 2);
            fdata.closeAllDays = ($scope.editFormData.hoursopt == 3);

            var hours = [];
            angular.forEach(fdata.hours, function (v) {
                if (v.fromDate && v.toDate) {
                    v.fromDate = v.fromDate.getHours() + ":" + v.fromDate.getMinutes() + ":" + v.fromDate.getSeconds();
                    v.toDate = v.toDate.getHours() + ":" + v.toDate.getMinutes() + ":" + v.toDate.getSeconds();

                    hours.push(angular.copy(v));
                }
            });
            fdata.hours = hours;

            var promise = $http.post(DATA_URLS.UPDATE_SERVICE, fdata);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Service updated successfully", "Success");
                    // $location.path('/products');
                }
            });
        }

        $scope.new = function () {
            localStorageService.set('businessData', $scope.editFormData);
            $location.path('/product/new/' + $scope.listingId);
        }

        $scope.onBackClick = function () {
            $window.history.back();
        }

        $scope.editProduct = function (item) {
            localStorageService.set('businessData', $scope.editFormData);
            $location.path('/product/' + item.id);
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

            var promise = $http.post(DATA_URLS.REMOVE_SERVICEIMAGE, sb);

            promise.then(function (data) {
                btn.stop();
                if (!data.status || data.status == 200) {
                    toastr["success"]("Image removed", "Success");
                    $scope.serviceImages.splice(sb.index, 1);
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
            var promise = $http.post(DATA_URLS.EDIT_SERVICEIMAGE, fdata);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {
                    toastr["success"]("Image updated.", "Success");
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

            var promise = $http.post(DATA_URLS.UPLOAD_SERVICEFEATUREIMAGE, data, config);

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
            var promise = $http.post(DATA_URLS.DELETEFEATUREDIMAGE_SERVICE, fdata);

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

            var promise = $http.post(DATA_URLS.UPLOAD_SERVICEIMAGE, data, config);

            promise.then(function (data) {
                if (!data.status || data.status == 200) {

                    btn.stop();
                    toastr["success"]("Image added successfully", "Success");
                    $scope.clearPI();
                    get($routeParams.uid);
                }
            });
        }

        $scope.onStateClick = function () {
            $scope.editFormData.country = $filter('filter')($scope.countryList, { id: $scope.editFormData.state.parent })[0];
        }

        $scope.onCityClick = function () {
            $scope.editFormData.state = $filter('filter')($scope.stateList, { id: $scope.editFormData.city.parent })[0];

            $scope.onStateClick();
        }

        $scope.onBack = function () {
            $location.path('/mylisting');
        }

        function setDateTime(time) {
            if (!time) return time;

            var timeArray = time.split(':');

            var hours = timeArray[0];
            var minutes = timeArray[1];

            return new Date(1970, 0, 1, hours, minutes, 0);
        }

        $scope.selectedItem = {};

        $scope.onDeleteHour = function (item, index) {
            $scope.selectedItem = item;
            $scope.selectedItem.index = index;
        }

        $scope.deleteTiming = function (item, index) {

            var btn = Ladda.create(document.querySelector('#deleteHoursbtn'));
            btn.start();

            if ($scope.selectedItem.id) {

                var promise = $http.post(DATA_URLS.DELETE_SERVICE_TIME, $scope.selectedItem.id);

                promise.then(function (data) {
                    btn.stop();
                    if (!data.status || data.status == 200) {
                        toastr["success"]("Deleted successfully", "Success");
                        $scope.editFormData.hours.splice($scope.selectedItem.index, 1);
                        $('#confirmDeleteHours').click();
                    }
                });

            } else {
                btn.stop();
                toastr["success"]("Deleted successfully", "Success");
                $scope.editFormData.hours.splice($scope.selectedItem.index, 1);
                $('#confirmDeleteHours').click();
            }
        }

        $scope.onHourOptChange = function () {
            if ($scope.editFormData.hours.length == 0) {
                $scope.editFormData.hours.push({});
            }
        }

        $scope.onAddHour = function () {
            $scope.editFormData.hours.push({});
        }


        //----------------------------google maps--------------------------------//
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
                addYourLocationButton(map, marker);
            }
            else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {

                        var currentLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        // The map, centered at Dubai
                        map = new google.maps.Map(document.getElementById("map"), {
                            zoom: mapzoom,
                            center: currentLocation,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        });

                        // The marker, positioned at Uluru
                        marker = new google.maps.Marker({
                            position: currentLocation,
                            map: map,
                        });

                        getPlaceOnMapClick();
                        getAddress(currentLocation);
                        addYourLocationButton(map, marker);

                    }, function (err) {
                        //alert(JSON.stringify(err));
                        setDefaultMapPosition();
                    },
                        { enableHighAccuracy: true, timeout: 5000 });
                } else {
                    setDefaultMapPosition();
                }
            }
        }

        function setDefaultMapPosition() {

            // The location of Pune
            var Pune = { lat: 18.516726, lng: 73.856255 };

            if ($('#lat').val() && $('#lng').val()) {
                Pune = { lat: parseFloat($('#lat').val()), lng: parseFloat($('#lng').val()) };
            }
            else {
                //set default location to hidden variables
                $('#lat').val(Pune.lat);
                $('#lng').val(Pune.lng);
            }

            // The map, centered at Dubai
            map = new google.maps.Map(document.getElementById("map"), {
                center: Pune,
                zoom: mapzoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            // The marker, positioned at Dubai
            marker = new google.maps.Marker({
                position: Pune,
                map: map,
            });

            getPlaceOnMapClick();
            getAddress(Pune);
            addYourLocationButton(map, marker);
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
            console.log('getAddress latLng -', latLng);

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

        function addYourLocationButton(map, marker) {
            var controlDiv = document.createElement('div');

            var firstChild = document.createElement('button');
            firstChild.type = "button";
            firstChild.style.backgroundColor = '#fff';
            firstChild.style.border = 'none';
            firstChild.style.outline = 'none';
            firstChild.style.width = '40px';
            firstChild.style.height = '40px';
            firstChild.style.borderRadius = '2px';
            firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
            firstChild.style.cursor = 'pointer';
            firstChild.style.marginRight = '10px';
            firstChild.style.padding = '0';
            firstChild.title = 'Your Location';
            controlDiv.appendChild(firstChild);

            var secondChild = document.createElement('div');
            secondChild.style.margin = '11px';
            secondChild.style.width = '18px';
            secondChild.style.height = '18px';
            secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
            secondChild.style.backgroundSize = '180px 18px';
            secondChild.style.backgroundPosition = '0 0';
            secondChild.style.backgroundRepeat = 'no-repeat';
            firstChild.appendChild(secondChild);

            google.maps.event.addListener(map, 'center_changed', function () {
                secondChild.style['background-position'] = '0 0';
            });

            firstChild.addEventListener('click', function () {
                var imgX = '0';

                animationInterval = setInterval(function () {
                    imgX = imgX === '-18' ? '0' : '-18';
                    secondChild.style['background-position'] = imgX + 'px 0';
                }, 500);

                getCurrentLocation();
            });

            controlDiv.index = 1;
            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
        }

        function onSelectMlChange() {

            if ($('#lat').val() && $('#lng').val()) {
                var latlng = { lat: parseFloat($('#lat').val()), lng: parseFloat($('#lng').val()) };

                //var latlng = new google.maps.LatLng(parseFloat($('#lat').val()), parseFloat($('#lng').val()));

                map.setCenter(latlng);
                placeMarker(latlng);
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

        //setTimeout(function () { initMap(); }, 500);
        //------------------------------------------------------------------------//
    }]);;