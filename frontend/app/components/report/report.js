(function () {

  angular
    .module('app').directive('chart', function () {
      return {
        link: function (scope, elem, attrs) {
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
      url: "https://perezprogramming.com/upload.php"
      // filters: [{
      //   name: 'csvOnly',
      //   // A user-defined filter
      //   fn: function (item) {
      //     $scope.errorMessage = "";
      //     console.log(item);
      //     if (item.type != 'text/csv' && item.type != 'text/plain') {
      //       $scope.errorMessage = "CSV or Txt Files Only!";
      //       return false;
      //     } 
      //     return true;
      //   }
      // }]
    });

    $scope.dataRows = [];
    $scope.errorMessage = "";
    $scope.activeKey = 0;
    $scope.loading = false;

    $scope.formValues = {
      treatment: "",
      customer: "",
      container: "",
      commodity: "",
      fumigant: "",
      dosage: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      exposure: "",
      certGas: "",
      fumigator: "",
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

    $scope.createPdf = function () {
      $scope.loading = true;
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
        width: pageWidth / 1.9,
        height: pageHeigth / 3
      });

      fumiForm.content.push(rawDataTable);

      
      var doc = pdfMake.createPdf(fumiForm);
      $scope.loading = false;
      doc.getBlob(function (data) {
        var upload = new FormData();
        upload.append('file', data);

        if((navigator.userAgent.indexOf("MSIE") != -1 )){
          doc.download();
        } else if((navigator.userAgent.indexOf("Edge") != -1 )){
          doc.download();
        } else {
          var win = window.open('', '_blank');
          doc.open({}, win);
        }
        $scope.loading = false;
        // $.ajax({
        //     url: '/upload.php',
        //     type: 'POST',
        //     data: upload,
        //     contentType: false,
        //     processData: false,
        //     success: function(data) {
        //       if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
        //         doc.download();
        //       } else {
        //         doc.open({}, win);
        //       }
        //     },    
        //     error: function() {

        //       doc.open({}, win);
        //     }
        //   });
      });
      
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

          var date = moment(row[0] + " " + row[1], 'DD.MM.YY h:mm:ss')
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
      } catch (e) {
        console.log(e);
      }

    };

    uploader.onCompleteAll = function () {
      $scope.activeKey += 1;
      $scope.activeView = $scope.map[$scope.activeKey];
    };

    $scope.lineData = {
      labels: [],
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
      title: {
        display: true,
        text: "PH3 [PPM]"
      },
      data: $scope.lineData,
      options: {
        scales: {
          xAxes: [{
            gridLines: {
              offsetGridLines: true
            },
            type: "time",
            distribution: 'linear',
            ticks: {
              source: 'auto',
              autoSkip: true,
              maxTicksLimit: 10
            },
            time: {
              unit: 'hour',
              stepSize: 0.5,
              source: "labels",
              tooltipFormat: "MMM D, h:mm A",
              displayFormats: {
                hour: 'M/D/YY h:mm A'
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
      var dates = [];
  
      $scope.dataRows.forEach(function (data) {
        var date = moment(data[0], 'LLL');
        data[0] = date;
        dates.push(date);

        if ($scope.zoneModel.zone1 && data[2] > 0) {
          $scope.zone1.push({
            t: date,
            y: data[2]
          });
        }

        if ($scope.zoneModel.zone2 && data[3] > 0) {
          $scope.zone2.push({
            t: date,
            y: data[3]
          });
        }
        
        if ($scope.zoneModel.zone3 && data[4] > 0) {
          $scope.zone3.push({
            t: date,
            y: data[4]
          });
        }
      });
      
      var startDate = $scope.dataRows[0]
      var endDate = $scope.dataRows[$scope.dataRows.length - 1];
      startDate = startDate[0];
      endDate = endDate[0];

      var dayDiff = Math.abs(startDate.diff(endDate, 'days', true));

      var duration = moment.duration(endDate.diff(startDate));
      var hours = parseInt(duration.asHours());
      var minutes = parseInt(duration.asMinutes())-hours*60;
      
      $scope.formValues.startDate = startDate.format("M/D/YY");
      $scope.formValues.startTime = startDate.format("h:mm A");
      $scope.formValues.endDate = endDate.format("M/D/YY");
      $scope.formValues.endTime = endDate.format("h:mm A");
      $scope.formValues.exposure = hours + " hrs and "+ minutes +' minutes.';

      console.log(dayDiff);
      if (dayDiff > 60) {
        $scope.graphConfig.options.scales.xAxes[0].time.unit = 'week';
        $scope.graphConfig.options.scales.xAxes[0].time.round = 'day';
        $scope.graphConfig.options.scales.xAxes[0].time.stepSize = 5;

      } else if (dayDiff > 14) {
        $scope.graphConfig.options.scales.xAxes[0].time.unit = 'day';
        $scope.graphConfig.options.scales.xAxes[0].time.round = 'hour';
        $scope.graphConfig.options.scales.xAxes[0].time.stepSize = 2;
      }

      $scope.lineData.labels = dates;
      $scope.activeKey += 1;
      $scope.activeView = $scope.map[$scope.activeKey];
    };

  }

})();