/* app.routes.js */

(function() {
    'use strict';
   
    module.exports = function(app) {
        app.config(config);

        config.$inject = ['$routeProvider', '$locationProvider'];

        function config($routeProvider, $locationProvider) {
            $routeProvider
            .when('/', {
                templateUrl: 'views/home.html'
            })
            .when('/test', {
                templateUrl: 'views/test.html'
            });
            $locationProvider.html5Mode(true);
        }
    };

})();