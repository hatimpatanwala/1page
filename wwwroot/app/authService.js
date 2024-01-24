'use strict';
app.factory('authService', ['$q', '$injector', 'localStorageService', 'appConstant', '$rootScope', 'DATA_URLS',
    function ($q, $injector, localStorageService, appConstant, $rootScope, DATA_URLS) {

        'use strict';
        var authServiceFactory = {}
        var _isRefreshToken = false;

        var authentication = localStorageService.get('authentication') ||
        {
            isAuth: false,
            loginError: '',
            loginData: {}
        }

        var authStatusChanged = function () {
            $rootScope.$broadcast('authStatusChanged');
            var phase = $rootScope.$$phase;
            if (!(phase === '$apply' || phase === '$digest')) {
                $rootScope.$apply();
            }
        };

        var clearAuthData = function () {
            authentication.isAuth = false;
            authentication.loginError = '';
            authentication.loginData = {};

            localStorageService.remove('authentication');
        }

        var login = function (formdata) {

            var btn = Ladda.create(document.querySelector('#loginbtn'));
            // var btn1 = Ladda.create(document.querySelector('#loginbtn1'));
            btn.start();
            // btn1.start();

            var loginData = {
                email: formdata.username,
                password: formdata.password,
            };

            if (formdata.instance) {
                loginData.instance = formdata.instance.id;
            }

            var $http = $injector.get('$http');
            var promise = $http.post(DATA_URLS.Authenticate, loginData);

            promise.then(function (data) {
                btn.stop();
                // btn1.stop();
                if (!data.status || data.status == 200) {
                    if (data.isVerified) {
                        authentication.isAuth = true;
                        authentication.loginData = {
                            id: data.id,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            phoneNumber: data.phoneNumber,
                            role: data.role,
                            created: data.created,
                            isVerified: data.isVerified,
                            jwtToken: data.jwtToken,
                            image: data.image,
                        };

                        localStorageService.set('authentication', authentication);
                        authStatusChanged();
                        //console.log('authentication.loginData -', authentication.loginData);
                    } else {
                        localStorageService.set('registeredBuyer', data);
                        window.location.href = '/#otp/verify'
                    };
                }
                else {
                    clearAuthData();
                    if (data.status == -1) {
                        authentication.loginError = 'Could not connect. Check your internet connection or try again later';
                    }
                    else {
                        authentication.loginError = data.data.message;
                    }
                    authStatusChanged();
                }
            });
        }

        var logout = function () {

            var headers = {};
            var accesstoken = authentication.isAuth ? authentication.loginData.access_token : null;
            if (accesstoken) {
                headers.Authorization = 'Bearer ' + authentication.loginData.access_token;
            }

            clearAuthData();
            authStatusChanged();

            //$.ajax({
            //    type: 'POST',
            //    url: DATA_URLS.USER_LOGOUT,
            //    headers: headers
            //});
        }

        var refreshToken = function () {
            var deferred = $q.defer();

            var authData = authentication.loginData;
            var data = "grant_type=refresh_token&refresh_token=" + authData.refresh_token + "&client_id=" + appConstant.ClientId;


            var $http = $injector.get('$http');
            if (_isRefreshToken) return;
            _isRefreshToken = true;

            $http.post(DATA_URLS.ROOT_PATH + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .success(function (response) {

                    _isRefreshToken = false;

                    authentication.isAuth = true;
                    authentication.loginData = {
                        access_token: response.access_token,
                        expires_in: response.expires_in,
                        permissions: response.permissions,
                        userName: response.userName,
                        userid: response.userid,
                        refresh_token: response.refresh_token,
                        userFullName: data.userFullName,
                        type: data.type
                    };

                    localStorageService.set('authentication', authentication);
                    deferred.resolve(response);

                }).error(function (err, status) {
                    _isRefreshToken = false;
                    logout();
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        var refreshStatus = function () {
            return _isRefreshToken;
        }

        authServiceFactory.authentication = authentication;
        authServiceFactory.login = login;
        authServiceFactory.logout = logout;
        authServiceFactory.refreshToken = refreshToken;
        authServiceFactory.refreshStatus = refreshStatus;
        return authServiceFactory;

    }]);