(function () {

  angular
  .module('app').directive('chart', function(){
    return {
        link: function(scope, elem, attrs){
            console.log(scope.graphConfig);
            var ctx = document.getElementById("graphOutput").getContext("2d");
            window.myLine = new Chart(ctx, scope.graphConfig);
        }
    }
  });

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
      url: "https://perezprogramming.com/upload.php",
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

    $scope.formValues = {
      treatment : "",
      customer : "",
      container : "",
      commodity : "",
      fumigant : "",
      dosage : "",
      startTime : "",
      endTime : "",
      exposure : "",
      certGas : "",
      fumigator : "",
    }

    $scope.zoneModel = {
      zone1: true,
      zone2: true,
      zone3: true
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

    $scope.createPdf = function() {
      for (var prop in $scope.formValues) {
        if ($scope.formValues.hasOwnProperty(prop)) {
          for (var idx in fumiForm.content) {
            var obj = fumiForm.content[idx];
            if (obj.hasOwnProperty('id') && obj.id === prop) {
              fumiForm.content[idx].text += $scope.formValues[prop];
            }
          }
        } 
      }

      var canvas = document.getElementById('graphOutput');
      var ctx = canvas.getContext('2d');
      var imgData = canvas.toDataURL();

      var pageWidth = 1000;
      var pageHeigth = 1000;

      fumiForm.content.push({
        image: imgData,
        pageBreak: 'after',
        width: pageWidth/1.8, 
        height: pageHeigth / 2
      });

      fumiForm.content.push(rawDataTable);
      pdfMake.createPdf(fumiForm).open();
    };

    $scope.uploader.uploadItem = function (value) {

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

          var date = moment(row[0] + " " + row[1],'DD.MM.YY h:mm:ss')
          row[0] = date.format('LLL');
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
          var dataRow = [date.format('LLL'), row[2], row[3], row[4]];
          rawDataTable.table.body.push(dataRow);
          $scope.dataRows.push(row);
          self._render();

          $scope.$apply();
        }
      });

    try {
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
     }
     catch (e) {
        console.log(e); 
     }

    };

    uploader.onCompleteAll = function () {
      $scope.activeKey += 1;
      $scope.activeView = $scope.map[$scope.activeKey];
    };

    $scope.lineData = {
      labels: $scope.xAxis,
      datasets: [{
          label: "Zone 1",
          fill: false,
          borderColor: "rgba(155,44,77,1)",
          backgroundColor: "rgba(155,44,77,.5)",
          data: $scope.zone1
        },
        {
          label: "Zone 2",
          fill: false,
          borderColor: "rgba(41,37,172,1)",
          backgroundColor: "rgba(41,37,172,.5)",
          data: $scope.zone2
        },
        {
          label: "Zone 3",
          fill: false,
          borderColor: "rgba(88,172,75,1)",
          backgroundColor: "rgba(88,172,75,.5)",
          data: $scope.zone3
        }
  
      ]
    };

    $scope.graphConfig = {
      type: 'line',
      responsive: true,
      title:{
        display:true,
        text:"PH3 [PPM]"
      },
      data : $scope.lineData, 
      options: {
        scales: {
          xAxes: [{
            gridLines: {	
              offsetGridLines: true
            },
            type: "time",
            distribution: 'series',
						ticks: {
              source: 'labels',
              major: {
                fontSize: "3"
              }
            },
            time: {
              unit: 'hour',
              round: "hour",
              unitStepSize: 2,
              tooltipFormat: "MMM D, h:mm A",
              displayFormats: {
                hour: 'MMM D, h:mm A'
              }
						}
          }],
          yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'PPM'
						}
					}]
        },
        legend: {
          position: 'bottom',
        },
      }
    };

    $scope.generateReport = function () {
      
      $scope.dataRows.forEach(function(data) {
        var date = moment(data[0], 'LLL').startOf('hour');
        $scope.xAxis.push(date);

        if($scope.zoneModel.zone1) {
          $scope.zone1.push(data[2]);
        }
        if($scope.zoneModel.zone2) {
          $scope.zone2.push(data[3]);
        }
        if($scope.zoneModel.zone3) {
          $scope.zone3.push(data[4]);
        }
      });

      var parsedDates = []
      for (var i = 0; i < $scope.xAxis.length; i = i+10) {
        parsedDates.push($scope.xAxis[i]);
      };

      $scope.xAxis = parsedDates;
      $scope.activeKey += 1;
      $scope.activeView = $scope.map[$scope.activeKey];
    };

  }

})();