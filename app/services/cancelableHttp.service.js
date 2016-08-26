(function() {
'use strict';

    angular
        .module('app')
        .factory('fqDebounceQ', fqDebounceQ);

    /**
     * @ngInject
     * @param {ng.IQService} $q
     */
    function fqDebounceQ($q) {

        return {
            debounce: _debounce
        };

        ////////////////
        //TODO: might even be able to just wrap Underscores
        // debounce in a $q.defer()
        function _debounce(func, _wait, _immediate) {
            if(_wait){
                var timeout;
                var deferred = $q.defer();
                return function() {
                    var context = this;
                    var args    = arguments;
                    var later = function() {
                        timeout = null;
                        if(!_immediate) {
                            $q.when(func.apply(context, args))
                                .then(deferred.resolve, deferred.reject, deferred.notify);
                            deferred = $q.defer();
                        }
                    };
                    var callNow = _immediate && !timeout;
                    if(timeout) {
                        clearTimeout(timeout);
                    }
                    timeout = setTimeout(later, _wait);
                    if(callNow) {
                        deferred = $q.defer();
                        $q.when(func.apply(context, args))
                            .then(deferred.resolve, deferred.reject, deferred.notify);
                    }
                    return deferred.promise;
                };
            } else {
                return func;
            }
        }
    }
})();
