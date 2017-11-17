(function () {

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  function MainCtrl() {
    
    var self = this;

  }

  angular.module('app')
  .filter('capitalizeWord', function() {
    return function(text) {
      return (!!text) ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : '';
    }
  });

})();

