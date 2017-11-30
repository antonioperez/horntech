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
                  name: 'angles',
                  files: ['js/plugins/chartJs/angles.js']
              },
              {
                name: 'fumiForm',
                files: ['components/report/fumi.js']
              }
            ]);
          }]
        },
        templateUrl: "components/report/report.html",
        url: "/report",
      })
  }

})();