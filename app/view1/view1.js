// 'use strict';
//TODO: This is a module declaration and should be in its own file later
angular.module('app.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'view1Ctrl',
    controllerAs: 'vm'
  });
}]);

//TODO: move this to another file later
(function() {
// 'use strict';

  angular
    .module('app.view1')
    .controller('view1Ctrl', View1Ctrl);

  View1Ctrl.$inject = ['fqCancelableQ'];

  function View1Ctrl(fqCancelableQ) {
    var vm = this;
    vm.request1   = new fqCancelableQ('https://public.opencpu.org/ocpu/library/?foo=' + 1);
    vm.request2   = new fqCancelableQ('https://public.opencpu.org/ocpu/library/?foo=' + 2);

    vm.request = function() {
      _request1();
    };

    function _request1(){
      vm.request1.get()
        .then(function(res) {
          console.log(res);
        }, function (err) {
          //ERROR: will run on cancelation: status -1
          if(err.status !== -1) {
            console.log('error');
            console.error(err);
          }
        });
    }

    function _request2(){
      vm.request2.get()
        .then(function(res) {
          console.log(res);
        }, function (err) {
          //ERROR: will run on cancelation: status -1
          if(err.status !== -1) {
            console.log('error');
            console.error(err);
          }
        });
    }

    vm.addRequests = function() {

      for (var i = 0, l = 10; i < l; i++) {
      //  _request1(); 
       _request2();
      }

    };
  }
})();
