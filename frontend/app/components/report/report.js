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

      var fumiForm = {
        content: [{
            image: 'hornImage',
            alignment: 'center',
            width: 350,
            height: 100,
          },
          {
    
            text: 'HORN TECHNOLOGIES & SERVICES, INC.',
            style: 'header',
            alignment: 'center'
          },
          {
            text: '2020 S. Golden State Blvd suite 103 – Fowler – California 93625',
            style: 'small',
            alignment: 'center'
          },
          {
            text: 'TEL.: (559) 316-7034',
            style: 'small',
            alignment: 'center'
          },
          {
            text: 'Web: www.horn-technologies.com | e-mail: info@horn-technologies.com',
            style: 'small',
            alignment: 'center'
          },
          " ", " ",
          {
            text: 'Fumigation Certificate',
            style: 'subheader',
            alignment: 'center'
          },
          " ", " ",
          {
            text: "This is to certify that the commodity listed below has been fumigated"
          },
          " ", " ",
          {
            id: "treatment",
            text: "TREATMENT N: "
          },
          " ",
          {
            id: "customer",
            text: "CUSTOMER NAME: "
          },
          " ",
          {
            id: "container",
            text: "ROOM#/LOT#: "
          },
          " ", " ",
          {
            id: "commodity",
            text: "COMMODITY: "
          },
          " ",
          {
            id: "fumigant",
            text: "FUMIGANT: "
          },
          " ",
          {
            id: "dosage",
            text: "DOSE RATE (g/cuft): "
          },
          " ",
          {
            id: "startDate",
            text: "START DATE: "
          },
          " ",
          {
            id: "startTime",
            text: "START TIME: "
          },
          " ",
          {
            id: "endDate",
            text: "END DATE: "
          },
          " ",
          {
            id: "endTime",
            text: "END TIME: "
          },
          " ",
          {
            id: "exposure",
            text: "EXPOSURE: "
          },
          " ", 
          {
            id: "fumigator",
            text: "FUMIGATOR: "
          },
          " ", " ", " ", " ",
          {
            text: "________________________________",
            alignment: 'right'
          },
          {
            text: "SIGNATURE OF FUMIGATOR",
            alignment: 'right',
            pageBreak: 'after'
          },
          {
            text: "PH3 [PPM]",
            alignment: 'center',
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true
          },
          subheader: {
            fontSize: 15,
            bold: true
          },
          quote: {
            italics: true
          },
          small: {
            fontSize: 9
          }
        },
        images: {
          hornImage: 'data:image/png;base64,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'
        }
      }

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

        $scope.loading = false;
        $.ajax({
            url: '/hornReport/upload.php',
            type: 'POST',
            data: upload,
            contentType: false,
            processData: false,
            success: function(data) {
              if((navigator.userAgent.indexOf("MSIE") != -1 )){
                doc.download();
              } else if((navigator.userAgent.indexOf("Edge") != -1 )){
                doc.download();
              } else {
                var win = window.open('', '_blank');
                doc.open({}, win);
              }
            },    
            error: function() {
              if((navigator.userAgent.indexOf("MSIE") != -1 )){
                doc.download();
              } else if((navigator.userAgent.indexOf("Edge") != -1 )){
                doc.download();
              } else {
                var win = window.open('', '_blank');
                doc.open({}, win);
              }
            }
          });
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
          onClick: function(e, legendItem) {
            var index = legendItem.datasetIndex;
            var ci = this.chart;
            var meta = ci.getDatasetMeta(index);
        
            // See controller.isDatasetVisible comment
            meta.hidden = meta.hidden === null? !ci.data.datasets[index].hidden : null;
            ci.update();

            var datasetsNum = ci.data.datasets.length;
            var startDate = moment(new Date(8640000000000000));
            var endDate = moment(new Date(-8640000000000000));

            if (datasetsNum > 1) {
              for (var indx = 0; indx < datasetsNum; indx++) {
                var dates = [];
                var tempEnd = null;
                var tempStart = null;
                var dataset = ci.getDatasetMeta(indx);
                
                if (dataset.hidden === null) {
                  if (indx == 0 && $scope.zoneModel.zone1){
                    dates = $scope.zone1.map(function(obj) { 
                      return obj.t;
                    });
                    tempStart = moment.min(dates);
                    tempEnd = moment.max(dates);
                  
                  } else if (indx == 1 && $scope.zoneModel.zone2) {
                    dates = $scope.zone2.map(function(obj) { 
                      return obj.t;
                    });
                    tempStart = moment.min(dates);
                    tempEnd = moment.max(dates);
                  } else if (indx == 2 && $scope.zoneModel.zone3) {
                    dates = $scope.zone3.map(function(obj) { 
                      return obj.t;
                    });
                    tempStart = moment.min(dates);
                    tempEnd = moment.max(dates);
                  }

                  if (tempStart !== null && tempEnd !== null){
                    startDate = moment.min(tempStart, startDate);
                    endDate = moment.max(tempEnd, endDate);
                    $scope.updateTimes(startDate, endDate);
                    $scope.$apply();
                  }
                }
              }
            }
          }
        },
      }
    };

    $scope.updateTimes = function(startDate, endDate) {
      var duration = moment.duration(endDate.diff(startDate));
      var hours = parseInt(duration.asHours());
      var minutes = parseInt(duration.asMinutes())-hours*60;
      $scope.formValues.startDate = startDate.format("M/D/YY");
      $scope.formValues.startTime = startDate.format("h:mm A");
      $scope.formValues.endDate = endDate.format("M/D/YY");
      $scope.formValues.endTime = endDate.format("h:mm A");
      $scope.formValues.exposure = hours + " hrs and "+ minutes +' minutes.';
    }

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

      var startDate = moment(new Date(8640000000000000));
      var endDate = moment(new Date(-8640000000000000));
      if ($scope.zoneModel.zone1) {
        var tempStart = $scope.zone1[0].t
        var tempEnd = $scope.zone1[$scope.zone1.length - 1].t;
        startDate = moment.min(tempStart, startDate);
        endDate = moment.max(tempEnd, endDate);
      }

      if ($scope.zoneModel.zone2) {
        var tempStart = $scope.zone2[0].t
        var tempEnd = $scope.zone2[$scope.zone2.length - 1].t;
        startDate = moment.min(tempStart, startDate);
        endDate = moment.max(tempEnd, endDate);   
      }
      
      if ($scope.zoneModel.zone3) {
        var tempStart = $scope.zone3[0].t
        var tempEnd = $scope.zone3[$scope.zone3.length - 1].t;
        startDate = moment.min(tempStart, startDate);
        endDate = moment.max(tempEnd, endDate);
      }
      
      var dayDiff = Math.abs(startDate.diff(endDate, 'days', true));
      $scope.updateTimes(startDate, endDate);

      if (dayDiff > 60) {
        $scope.graphConfig.options.scales.xAxes[0].time.unit = 'week';
        $scope.graphConfig.options.scales.xAxes[0].time.round = 'day';
        $scope.graphConfig.options.scales.xAxes[0].time.stepSize = 5;

      } else if (dayDiff > 14) {
        $scope.graphConfig.options.scales.xAxes[0].time.unit = 'day';
        $scope.graphConfig.options.scales.xAxes[0].time.round = 'hour';
        $scope.graphConfig.options.scales.xAxes[0].time.stepSize = 2;
      }

      $scope.activeKey += 1;
      $scope.activeView = $scope.map[$scope.activeKey];
    };

  }

})();