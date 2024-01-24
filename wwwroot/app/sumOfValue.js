app.filter('sumOfValue', function () {
    return function (data, key) {

        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var sum = 0;

        angular.forEach(data, function (v, k) {
            sum = sum + parseFloat(v[key]);
        });
        return sum;
    }
});
