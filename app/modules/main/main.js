(function() {
    'use strict';

    angular.module('app.main', [
        'ngRoute'
    ])

    //TODO: move routes into their own file
    .config([
        '$routeProvider', 
        function($routeProvider) {
            $routeProvider.when('/main', {
                templateUrl: 'modules/main/views/main.html',
                controller: 'mainCtrl',
                controllerAs: 'vm'
            });
    }]);
})();