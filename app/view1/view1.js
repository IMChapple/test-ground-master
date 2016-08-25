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

  View1Ctrl.$inject = ['$scope', 'cancelableHttp', 'cancelableRequest'];

  function View1Ctrl($scope, httpService, cancelableRequest) {
    var vm = this;
    // var counter = 1;
    vm.requests   = new cancelableRequest('https://public.opencpu.org/ocpu/library/?foo=' + 1, 0, false);
    vm.requests2  = new cancelableRequest('https://public.opencpu.org/ocpu/library/?foo=' + 2, 0, false);

    vm.addRequests = function() {

      (function(count) {
          if (count < 10) {
              // call the function.
              vm.requests.makeRequest().then(function(res) {
                console.log(res);
              }, function(err) {
                console.log(err);
              }); 

              // The currently executing function which is an anonymous function.
              var caller = arguments.callee; 
              window.setTimeout(function() {
                  caller(count + 1);
              }, 0);    
          }
      })(0);


      for (var i = 0, l = 5; i < l; i++) {
        vm.requests2.makeRequest();  
      }
      
      console.log(vm.requests);
      console.log(vm.requests2);
    };

    vm.cancelAll = function() {
      vm.requests.cancelAll();
      vm.requests2.cancelAll();
    };
  }
})();