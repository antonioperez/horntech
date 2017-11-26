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

    $scope.zoneModel = {
      zone1: false,
      zone2: false,
      zone3: false
    };

    $scope.xAxis = [];
    $scope.zone1 = [];
    $scope.zone2 = [];
    $scope.zone3 = [];

    $scope.map = [{
        key: "uploader",
        template: "components/report/subviews/upload.html"
      },
      {
        key: "data",
        template: "components/report/subviews/data.html"
      },
      {
        key: "output",
        template: "components/report/subviews/output.html"
      },
      {
        key: "pdfpreview",
        template: "components/report/subviews/pdfpreview.html"
      }
    ];

    $scope.activeView = $scope.map[$scope.activeKey];

    function createPdf(userId, filename, size, downloadUrl, lastModified) {
      //fancy hashing algorithm goes here

    };

    uploader.uploadItem = function (value) {

      //HAD TO OVERWRITE EXISTING UPLOAD ITEM FUNCTION. 
      var self = this;
      var file = value._file;

      Papa.parse(file, {
        delimiter: ";",
        worker: true,
        skipEmptyLines: true,
        step: function (results) {

          var row = results.data[0].filter(function (x) {
            y = $.trim(x);
            return (y !== (undefined || null));
          });

          row[0] = new Date(row[0] + " " + row[1]);
          row[2] = parseInt(row[2].replace(/,/g, '.'));
          row[3] = parseInt(row[3].replace(/,/g, '.'));
          row[4] = parseInt(row[4].replace(/,/g, '.'));

          if (isNaN(row[2])) {
            row[2] = 0;
          }

          if (isNaN(row[3])) {
            row[3] = 0;
          }

          if (isNaN(row[4])) {
            row[4] = 0;
          }

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

    uploader.onCompleteAll = function () {
      console.log("complete");
      
      $scope.activeKey += 1;
      $scope.activeView = $scope.map[$scope.activeKey];
    };

    $scope.lineData = {
      //labels: [0,20,40,60,80,100,120,140,160,180,200],
      labels: $scope.xAxis,
      datasets: [{
          label: "Zone 1",
          type: 'line',
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          backgroundColor: "#000080",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          backgroundColor: "#d3d3d3",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: $scope.zone1
        }
        // {
        //   label: "Zone 2",
        //   type: 'line',
        //   fillColor: "rgba(26,179,148,0.5)",
        //   strokeColor: "rgba(26,179,148,0.7)",
        //   pointColor: "rgba(26,179,148,1)",
        //   pointStrokeColor: "#fff",
        //   pointHighlightFill: "#fff",
        //   pointHighlightStroke: "rgba(26,179,148,1)",
        //   data: $scope.zone2
        // }     
      ]
    };

    $scope.lineOptions = {
      scales: {
        scales: {
					xAxes: [{
						type: 'time',
						distribution: 'series',
						ticks: {
							source: 'labels'
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'PPM'
						}
					}]
				}
      },
      datasetFill: false
    };

    $scope.generateReport = function () {
      
      $scope.dataRows.forEach(function(data) {
        $scope.xAxis.push(data[0].valueOf());
        $scope.zone1.push({
          y: data[2],
          t: data[0].valueOf(),
        });
        $scope.zone2.push({
          y: data[3],
          t: data[0].valueOf(),
        });
        
        $scope.zone3.push(data[4]);
      });

      $scope.activeKey += 1;
      $scope.activeView = $scope.map[$scope.activeKey];
    };

  }
})();