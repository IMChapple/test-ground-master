(function() {
'use strict';

    angular
        .module('app')
        .service('cancelableHttp', CancelableHttp);

    // This service wraps $http to make sure pending requests are tracked 
    CancelableHttp.$inject = ['$http', '$q', 'cancelableRequest'];
    function CancelableHttp($http, $q, cancelableRequest) {

        // this.get = function(url) {
        //     var canceller = $q.defer();
        //     pendingRequest.add({
        //         url: url,
        //         canceller: canceller
        //     });
        //     //Request gets cancelled if the timeout-promise is resolved
        //     var requestPromise = $http.get(url, { timeout: canceller.promise });
        //     //Once a request has failed or succeeded, remove it from the pending list
        //     requestPromise.finally(function() {
        //         pendingRequest.remove(url);
        //     });
        //     return requestPromise;
        // }; 
    }
})();