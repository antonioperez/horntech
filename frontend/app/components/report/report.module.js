(function () {

  angular
    .module('app')
    .config([ '$stateProvider', config ]);

  function config($stateProvider) {
    $stateProvider
      .state('report', {
        controller: 'ReportCtrl',
        controllerAs: 'report',
        data: {
          pageTitle: ''
        },
        resolve: {
          loadPlugin: [ '$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                  files: ['js/plugins/chartJs/Chart.min.js']
              },
              {
                  name: 'angles',
                  files: ['js/plugins/chartJs/angles.js']
              }
          ]);
          }]
        },
        templateUrl: "components/report/report.html",
        url: "/report",
      })
  }

})();