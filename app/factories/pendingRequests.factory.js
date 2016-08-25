(function() {
'use strict';

    angular
        .module('app')
        .factory('cancelableRequest', CancelableRequest);

    CancelableRequest.$inject = ['$http', '$q'];
    function CancelableRequest($http, $q) {

        //TODO: optionally debounce the http requests
        function init(url, debounceInterval, immediate) {
            // var self = this;

            function _attachData(data, config) {
                return angular.extend(config, {data: data}); 
            }

            function _buildCancelableRequest(data, config) {
                instance.cancelAll(); //remove existing incomplete requests
                var canceler = $q.defer();
                //TODO: the url will always be the same now, will need to push in some kind of ID to be able to track requests
                instance.add({
                    url: url,
                    canceler: canceler
                });
                config = config || {};
                config = angular.extend(config, {timeout: canceler.promise });

                //TODO: add function for all verbs here
                //Request gets cancelled if the timeout-promise is resolved
                //Remove itself from the list once it has been resolved
                // return {
                //     get: function(){
                //         return $http.get(url, (data ? _attachData(data, config) : config)).finally(function() {
                //             instance.remove(url);
                //         });
                //     },
                //     delete: function() {
                //         return $http.delete(url, (data ? _attachData(data, config) : config)).finally(function() {
                //             instance.remove(url);
                //         });
                //     },
                //     head: function() {
                //         return $http.head(url, (data ? _attachData(data, config) : config)).finally(function() {
                //             instance.remove(url);
                //         });
                //     },
                //     jsonp: function() {
                //         return $http.jsonp(url, (data ? _attachData(data, config) : config)).finally(function() {
                //             instance.remove(url);
                //         });
                //     },
                //     post: function(data, config) {
                //         return $http.post(url, data, config).finally(function() {
                //             instance.remove(url);
                //         });
                //     },
                //     put: function(data, config) {
                //         return $http.put(url, data, config).finally(function() {
                //             instance.remove(url);
                //         });
                //     },
                //     patch: function(data, config) {
                //         return $http.patch(url, data, config).finally(function() {
                //             instance.remove(url);
                //         });
                //     }
                // };


                return $http.get(url, (data ? _attachData(data, config) : config)).finally(function() {
                    instance.remove(url);
                });
                // // Request gets cancelled if the timeout-promise is resolved
                // var requestPromise = $http.get(url, { timeout: canceler.promise });
                // //Remove itself from the list once it has been resolved
                // requestPromise.finally(function() {
                //     instance.remove(url);
                // });
                // return requestPromise;
            }

            var instance = {
                pending: [],
                //TODO: pending is exposed, no need for this get function
                //TODO: dont like these function names, too similar to http verbs
                get: function() {
                    return instance.pending;
                },
                add: function(request) {
                    console.log('adding request');
                    instance.pending.push(request);
                },
                remove: function(request) {
                    instance.pending = _.filter(instance.pending, function(p) {
                        return p.url !== request;
                    });
                },
                cancelAll: function() {
                    angular.forEach(instance.pending, function(p) {
                        p.canceler.resolve();
                    });
                    instance.pending.length = 0;
                },
                makeRequest: debounceInterval ? debouncePromise(_buildCancelableRequest, debounceInterval, immediate) : _buildCancelableRequest
            };

            return instance;
        }

        //TODO: pull this into a separate service or find a better way to integrate it
        // into the current pendingRequest function, might even be able to just wrap Underscores
        // debounce in a $q.defer()
        function debouncePromise(func, wait, immediate) {
            var timeout;
            var deferred = $q.defer();
            return function() {
                var context = this;
                var args    = arguments;
                var later = function() {
                    timeout = null;
                    if(!immediate) {
                        $q.when(func.apply(context, args))
                            .then(deferred.resolve, deferred.reject, deferred.notify);
                        deferred = $q.defer();
                    }
                };
                var callNow = immediate && !timeout;
                if(timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(later, wait);
                if(callNow) {
                    deferred = $q.defer();
                    $q.when(func.apply(context, args))
                        .then(deferred.resolve, deferred.reject, deferred.notify);
                }
                return deferred.promise;
            };
        }

        return init; 
    }
})();








