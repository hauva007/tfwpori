/* app.routes.js */

(function() {
    'use strict';
   
    module.exports = function(app) {
        app.config(config);

        config.$inject = ['$routeProvider', '$locationProvider'];

        function config($routeProvider, $locationProvider) {
            $routeProvider
                .when("/",{
                    templateUrl: "templates/application.html"
            });
            $locationProvider.html5Mode(true);
        }
    };

})();