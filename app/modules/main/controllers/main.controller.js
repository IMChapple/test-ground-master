
//TODO: use a component rather than a controller
(function() {
'use strict';

    angular
        .module('app.main')
        .controller('mainCtrl', MainCtrl);

    MainCtrl.$inject = ['fqCancelableQ'];
    function MainCtrl(fqCancelableQ) {

        var _request1   = new fqCancelableQ('https://public.opencpu.org/ocpu/library/?foo=' + 1);
        var _request2   = new fqCancelableQ('https://public.opencpu.org/ocpu/library/?foo=' + 2);

        function _callFirstRequest() {
            _request1.get().then(function(res) {
                console.log(res);
            }, function (err) {
                //ERROR: will run on cancelation: status -1
                if(err.status !== -1) {
                    console.error(err);
                }
            });
        }

        function _callSecondRequest() {
            _request2.get().then(function(res) {
                console.log(res);
            }, function (err) {
                //ERROR: will run on cancelation: status -1
                if(err.status !== -1) {
                    console.error(err);
                }
            });
        }
        
        function _addRequests() {
            for (var i = 0, l = 10; i < l; i++) {
            //  _callFirstRequest(); 
                _callSecondRequest();
            }
        }

        //extending what I want to expose onto 'this' rather than using vm. or ctrl. all over the place
        //this is simply easier to easier to read, and all in one location
        angular.extend(this, {
            request1: _request1,
            request2: _request2,
            request: _callFirstRequest,
            addRequests: _addRequests
        });
    }
})();