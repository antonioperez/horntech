(function () {

  angular
    .module('app')
    .controller('ReportCtrl', [
      '$http',
      '$scope',
      'FileUploader',
      Ctrl
    ]);

  function Ctrl($http, $scope, FileUploader) {

    var uploader = $scope.uploader = new FileUploader({
      filters: [{
        name: 'csvOnly',
        // A user-defined filter
        fn: function (item) {
          if (item.type != 'text/csv') {
            $scope.errorMessage = "CSV Files Only!";
            return false;
          }
          return true;
        }
      }]
    });

    $scope.dataRows = [];
    $scope.errorMessage = "";
    $scope.activeKey = 0;

    $scope.map = [
      {
        key: "uploader",
        template : "components/report/subviews/upload.html"
      },
      {
        key: "data",
        template : "components/report/subviews/data.html"
      }, 
      {
        key: "output",
        template : "components/report/subviews/output.html"
      }, 
      {
        key: "fumiform",
        template : "components/report/subviews/upload.html"
      },
      {
        key: "pdfpreview",
        template : "components/report/subviews/pdfpreview.html"
      }
    ];

    $scope.activeView = $scope.map[$scope.activeKey];

    function createPdf(userId, filename, size, downloadUrl, lastModified) {
      //fancy hashing algorithm goes here

    }

    uploader.uploadItem = function (value) {

      //HAD TO OVERWRITE EXISTING UPLOAD ITEM FUNCTION. 
      //BECAUSE IT IS SENDING TO A LOCAL PORT/URL. NEED TO SEND TO FIREBASE INSTEAD
      var self = this;
      var file = value._file;

      Papa.parse(file, {
        delimiter: ";",
        worker: true,
        skipEmptyLines: true,
        step: function(results) {
          
          var row = results.data[0].filter(function(x){
            y = $.trim(x);
            return (y !== (undefined || null ));
          });
          
          row[0] = new Date(row[0] + " " + row[1]);
          row[2] = parseInt(row[2].replace(/,/g, '.'));
          row[3] = parseInt(row[3].replace(/,/g, '.'));
          row[4] = parseInt(row[4].replace(/,/g, '.'));
          
          if (isNaN(row[2])) {
            row[2] = '';
          }

          if (isNaN(row[3])) {
            row[3] = '';
          }

          if (isNaN(row[4])) {
            row[4] = '';
          }

          $scope.dataRows.push(row);
          $scope.$apply();
        }
      });

      $scope.activeKey += 1;
      $scope.activeView = $scope.map[$scope.activeKey];

      var index = this.getIndexOfItem(value);
      var item = this.queue[index];
      var transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';

      item._prepareToUploading();
      if (this.isUploading) return;

      this._onBeforeUploadItem(item);
      if (item.isCancel) return;

      item.isUploading = true;
      this.isUploading = true;
      this[transport](item);
      this._render();
    };

  }
})();