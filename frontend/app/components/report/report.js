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
          
          $scope.dataRows.push(row);
          $scope.$apply();
        }
      });

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