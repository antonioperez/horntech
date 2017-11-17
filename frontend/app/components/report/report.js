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
  
          var uploader = $scope.uploader = new FileUploader();
          var recentFilesRef = {};
          $scope.uploadedFiles = [];
         
          function writeUserData(userId, filename, size, downloadUrl, lastModified) {
              //fancy hashing algorithm goes here
              
          }
  
          uploader.uploadItem = function (value) {
  
              //HAD TO OVERWRITE EXISTING UPLOAD ITEM FUNCTION. 
              //BECAUSE IT IS SENDING TO A LOCAL PORT/URL. NEED TO SEND TO FIREBASE INSTEAD
              var self = this;
              var file = value._file;

    
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