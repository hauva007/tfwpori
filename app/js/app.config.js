/* app.config.js */

(function() {
    'use strict';
   
    module.exports = function(app) {
        app.run(run);

        run.$inject = ['$templateCache'];

        function run($templateCache) {
            // $templateCache.put('home.html', require('./views/home.html'));
        }
    };

})();