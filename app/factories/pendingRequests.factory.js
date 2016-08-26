(function() {
'use strict';

    angular
        .module('app')
        .factory('fqCancelableQ', fqCancelableQ);

        //TODO: can define these types globally, need to look up how
    /**
     * @ngInject
     * @param {ng.IQService} $q
     * @param {ng.IHttpService} $http
     * @param { {debounce: function(): function(function(), number, Boolean): function()} } fqDebounceQ
     */
    function fqCancelableQ($http, $q, fqDebounceQ) {

        //original function call
        /* 
        function _buildCancelableRequestOriginal() {
            _cancelAllRequests();
            var canceler = $q.defer();
            _addRequest({
                url: url,
                canceler: canceler
            });
            return $http.get(url, {timeout: canceler.promise }).finally(function() {
                _removeRequest(url);
            });
        }
        */


        /* TODO:
            ISSUE: when a request is debounced, the return response "then" is ran the number of times the request was made
                    even though the request is only fired in the Network tab once.
                    This does not happen with a falt cancel
        */
        
        //TODO: optionally throttle the http requests
        function init(url, _wait, _immediate) {
            /* Private Propertys */
            var _pendingRequests = [];

            /* Private Functions: Util */
            function _attachData(data, config) {
                return angular.extend(config, {data: data}); 
            }
            function _debounce(_func) {
                return fqDebounceQ.debounce(_func, _wait, _immediate);
            }

            /* Private Functions: Modify Pending Requests */
            function _getPendingRequests() {
                return _pendingRequests;
            }
            function _addRequest(request) {
                console.log('adding request');
                _pendingRequests.push(request);
            }
            function _removeRequest(request) {
                _pendingRequests = _.filter(_pendingRequests, function(p) {
                    return p.Id !== request;
                });
            }
            function _cancelAllRequests() {
                console.log('clearing all');
                angular.forEach(_pendingRequests, function(p) {
                    p.canceler.resolve();
                });
                _pendingRequests.length = 0;
            }

            
            //TODO simplify these into a generic call: maybe use string matching on the call type
            /* Private Functions: Verbs */
            // --------------------------------
            function _delete(data, config) {
                config = _buildConfig(config);
                return $http.delete(url, (data ? _attachData(data, config) : config)).finally(function() {
                    _removeRequest(url);
                });
            }
            function _get(data, config) {
                config = _buildConfig(config);
                return $http.get(url, (data ? _attachData(data, config) : config)).finally(function() {
                    _removeRequest(url);
                });
            }
            function _head(data, config) {
                config = _buildConfig(config);
                return $http.head(url, (data ? _attachData(data, config) : config)).finally(function() {
                    _removeRequest(url);
                });
            }
            function _jsonp(data, config) {
                config = _buildConfig(config);
                return $http.jsonp(url, (data ? _attachData(data, config) : config)).finally(function() {
                    _removeRequest(url);
                });
            }
            function _patch(data, config) {
                return $http.patch(url, data, _buildConfig(config)).finally(function() {
                    _removeRequest(url);
                });
            }
            function _post(data, config) {
                return $http.post(url, data, _buildConfig(config)).finally(function() {
                    _removeRequest(url);
                });
            }
            function _put(data, config) {
                return $http.put(url, data, _buildConfig(config)).finally(function() {
                    _removeRequest(url);
                });
            }
            
            /* BUILD CALL */
            // --------------------------------
            function _buildConfig(config) {
                /* TODO: 
                    removal of previous requests should probably take place outside of and before this function call,
                    or toggled based off an optional "auto remove" param */
                _cancelAllRequests();

                var canceler = $q.defer();

                //TODO: maybe move the add call somewhere else once it is good
                _addRequest({ 
                    Id: url, //TODO: using the url temporarily, could use GUID for now
                    canceler: canceler
                });
                /*
                 adds the cancelable request defer to thetimeout function of the config
                 params for the request.  When this resolves, the request will cancel 
                */
                config = config || {};
                config = angular.extend(config, { timeout: canceler.promise });
                return config;
            }

            /* EXPORTS */
            // var instance = {};
            return angular.extend(this, {
                //TODO: may expost the URL here as well to allow for potential changes to it, or swapping requests
                getPending: _getPendingRequests,
                remove:     _removeRequest, //probably dont need to expose this
                cancelAll:  _cancelAllRequests,
                //TODO: function to cancel specific request
                /* VERBS 
                    TODO: these are repetative, pass the function into a function that attaches the debounce automatically */
                delete:     _debounce(_delete),
                get:        _debounce(_get),
                head:       _debounce(_head),
                jsonp:      _debounce(_jsonp),
                patch:      _debounce(_patch),
                post:       _debounce(_post),
                put:        _debounce(_put)
            });
        }
        return init; 
    }
})();
