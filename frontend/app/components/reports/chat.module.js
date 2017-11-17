(function () {

  angular
    .module('app')
    .config([ '$stateProvider', config ]);

  function config($stateProvider) {
    $stateProvider
      .state('index.chat', {
        controller: 'ChatRoomCtrl',
        controllerAs: 'chatroom',
        data: {
          pageTitle: 'Chat'
        },
        resolve: {
          loadPlugin: [ '$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
 
              {
                name: 'angles',
                files: ['js/plugins/chartJs/angles.js']
              },
              {
                files: ['js/plugins/chartJs/Chart.min.js']
              },
              {
                serie: true,
                name: 'angular-flot',
                files: [ 'js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js' ]
              },
              {
                serie: true,
                files: ['js/plugins/jvectormap/jquery-jvectormap-2.0.2.min.js', 'js/plugins/jvectormap/jquery-jvectormap-2.0.2.css']
              },
              {
                serie: true,
                files: ['js/plugins/jvectormap/jquery-jvectormap-world-mill-en.js']
              },
              {
                name: 'ui.checkbox',
                files: ['js/bootstrap/angular-bootstrap-checkbox.js']
              },
              {
                serie: true,
                files: ['css/plugins/c3/c3.min.css', 'js/plugins/d3/d3.min.js', 'js/plugins/c3/c3.min.js']
              },
              {
                  serie: true,
                  name: 'gridshore.c3js.chart',
                  files: ['js/plugins/c3/c3-angular.min.js']
              }
            ]);
          }]
        },
        templateUrl: "components/chat/chat.html",
        url: "/chat",
      })
  }

})();