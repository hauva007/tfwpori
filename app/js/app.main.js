/* app.main.js */

(function() {
    'use strict';

    // application module
    var angular = require('angular');

    // dependencies
    var ngRoute = require('angular-route');
    
    var app = angular.module('tfwpori', [ngRoute]);

    require('./app.routes.js')(app);
})();