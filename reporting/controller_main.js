
app.controller('MainReportingCtrl', ['$scope', '$location', function($scope, $location) {

	$scope.mainChartData = {};
	$scope.fixedChartDatas = [];
	$scope.fixedChartDatasWithUnique = [];
	$scope.browserUsageDatas = [];
	$scope.deviceUsageDatas = [];
	$scope.osUsageDatas = [];
	$scope.geoLocDatas = [];
	$scope.range = "30-0";
	$scope.selectedScene = {};
	$scope.chart;
	$scope.loadMoreStatus = true;
	$scope.filter = {};

	//init daterangepicker
	$('input[name="daterange"]').daterangepicker({
	  "showDropdowns": false,
	  "showWeekNumbers": true,
	  "showISOWeekNumbers": true,
	  "maxDate": moment(),
	  "ranges": {
	      'Today': [moment(), moment()],
	      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
	      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
	      'This Month': [moment().startOf('month'), moment().endOf('month')],
	      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	  },
	  "locale": {
	      "format": "MM/DD/YYYY",
	      "separator": " - ",
	      "applyLabel": "Apply",
	      "cancelLabel": "Cancel",
	      "fromLabel": "From",
	      "toLabel": "To",
	      "customRangeLabel": "Custom",
	      "weekLabel": "W",
	      "daysOfWeek": [
	          "Su",
	          "Mo",
	          "Tu",
	          "We",
	          "Th",
	          "Fr",
	          "Sa"
	      ],
	      "monthNames": [
	          "January",
	          "February",
	          "March",
	          "April",
	          "May",
	          "June",
	          "July",
	          "August",
	          "September",
	          "October",
	          "November",
	          "December"
	      ],
	      "firstDay": 1
	  },
	  "alwaysShowCalendars": true,
	  "endDate": moment(),
	  "startDate": moment().subtract(1, 'month')
	}, function(start, end, label) {
	  var _startDate = moment().diff(start, 'days');
	  var _endDate = moment().diff(end, 'days');
	  $scope.getMainChartData(_startDate, _endDate);            
	});
      	


	$scope.toMs = function (_date){
    	_date = _date.split("-");
    	return new Date(parseInt(_date[0]), parseInt(_date[1])-1, parseInt(_date[2])).getTime() - (new Date().getTimezoneOffset()*60*1000); // add/remove hours for local date
	};

	$scope.toHms = function (time) {
		var hours = Math.floor(time / 3600);
		time = time - hours * 3600;
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;

		var watchedTimeString = "";
		if (hours > 0) {
		watchedTimeString += hours + "h ";
		}

		if (minutes > 0) {
		watchedTimeString += minutes + "m ";
		}

		if (seconds > 0) {
		watchedTimeString += seconds + "s";
		}

		return watchedTimeString;
	};



	$scope.clearChartDatas = function () {
		$scope.mainChartData = {};
		$scope.fixedChartDatas = [];
		$scope.fixedChartDatasWithUnique = [];
		$scope.deviceUsageDatas = [];
		$scope.osUsageDatas = [];
		$scope.browserUsageDatas = [];
		$scope.geoLocDatas = [];
		$scope.mainChartData.sceneTimeBasedChartDatas = [];      
	};



	$scope.createMainChart = function () {
	    $scope.chart = Highcharts.chart('main-chart-container', {
	        chart: {
	            type: 'area',
	            spacingBottom: 30
	        },
	        title: {
	            text: 'Slides statistics'
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'left',
	            verticalAlign: 'top',
	            x: 150,
	            y: 100,
	            floating: true,
	            borderWidth: 1,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
	        },
	        xAxis: {
	            /*
	            categories: [
	                'Monday',
	                'Tuesday',
	                'Wednesday',
	                'Thursday',
	                'Friday',
	                'Saturday',
	                'Sunday'
	            ]
	            */
	            tickPixelInterval: 30,
	            tickmarkPlacement: 'on',
	            type: 'datetime',
	            labels: {
	                formatter: function() {
	                    var monthStr = Highcharts.dateFormat('%m-%e', this.value );
	                    return monthStr;
	                }
	            }

	        },
	        yAxis: {
	            title: {
	                text: 'View counts'
	            },
	            labels: {
	                formatter: function () {
	                    return this.value;
	                }
	            },
	            min: 0
	            
	        },
	        tooltip: {
	            shared: true,
	            valueSuffix: ''
	        },
	        credits: {
	            enabled: false
	        },
	        plotOptions: {
	            series: {
	                allowPointSelect: true
	            }
	        },
	        exporting: { 
	          enabled: true 
	        },
	        series: [{
	            // Define the data points. All series have a dummy year
	            // of 1970/71 in order to be compared on the same x axis. Note
	            // that in JavaScript, months start at 0 for January, 1 for February etc.
	            name: 'Views',
	            data: $scope.fixedChartDatas
	        },
	        {
	            // Define the data points. All series have a dummy year
	            // of 1970/71 in order to be compared on the same x axis. Note
	            // that in JavaScript, months start at 0 for January, 1 for February etc.
	            name: 'Unique Views',
	            data: $scope.fixedChartDatasWithUnique
	        }
	        ]
	  });
	};





	$scope.createBrowserUsageChart = function () {
      // Build the chart
      Highcharts.chart('browser-usage-chart-container', {
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: 'Browser Usage'
          },
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          exporting: { 
              enabled: true 
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                      style: {
                          color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                      },
                      connectorColor: 'silver'
                  }
              }
          },
          series: [{
              name: 'Brands',
              data: $scope.browserUsageDatas
          }],
          credits: {
              enabled: false
          }
      });
    };




    $scope.createDeviceUsageChart = function () {
      // Build the chart
      Highcharts.chart('device-usage-chart-container', {
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: 'Device Usage'
          },
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          exporting: { 
              enabled: true 
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                      style: {
                          color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                      },
                      connectorColor: 'silver'
                  }
              }
          },
          series: [{
              name: 'Brands',
              data: $scope.deviceUsageDatas
          }],
          credits: {
              enabled: false
          }
      });
    };



    $scope.createOSUsageChart = function () {
      // Build the chart
      Highcharts.chart('os-usage-chart-container', {
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: 'Operating System Usage'
          },
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          exporting: { 
              enabled: true 
          },  
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                      style: {
                          color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                      },
                      connectorColor: 'silver'
                  }
              }
          },
          series: [{
              name: 'Brands',
              data: $scope.osUsageDatas
          }],
          credits: {
              enabled: false
          }
      });
    };





    $scope.setChartData = function (response) {
        $scope.mainChartData = response;
        $scope.mainChartData.totalWatchTime = Math.round($scope.mainChartData.totalWatchTime/60);

        angular.forEach($scope.mainChartData.chartDatas, function (chartData, key) {
            var tmpArray = [];
            tmpArray[0] = $scope.toMs(chartData.date);
            tmpArray[1] = chartData.viewCount;
            $scope.fixedChartDatas.push(tmpArray);

            var tmpUArray = [];
            tmpUArray[0] = $scope.toMs(chartData.date);
            tmpUArray[1] = chartData.uniqueViewCount;
            $scope.fixedChartDatasWithUnique.push(tmpUArray);
        });

        if ($scope.mainChartData.browserUsageData) {
          angular.forEach($scope.mainChartData.browserUsageData, function (browserData, key) {
              var newBrowserUsageData = {};
              newBrowserUsageData.name = key;
              newBrowserUsageData.y = browserData;
              $scope.browserUsageDatas.push(newBrowserUsageData);
          });  
        }

        if ($scope.mainChartData.deviceUsageData) {
          angular.forEach($scope.mainChartData.deviceUsageData, function (deviceData, key) {
              var newDeviceUsageData = {};
              newDeviceUsageData.name = key;
              newDeviceUsageData.y = deviceData;
              $scope.deviceUsageDatas.push(newDeviceUsageData);
          });  
        }

        if ($scope.mainChartData.osUsageData) {
          angular.forEach($scope.mainChartData.osUsageData, function (osData, key) {
              var newOsUsageData = {};
              newOsUsageData.name = key;
              newOsUsageData.y = osData;
              $scope.osUsageDatas.push(newOsUsageData);
          });  
        }

        if ($scope.mainChartData.geoLocData) {
          angular.forEach($scope.mainChartData.geoLocData, function (geoLoc, key) {
              var newGeoLoc = {};
              newGeoLoc.name = key;
              newGeoLoc.value = geoLoc;
              $scope.geoLocDatas.push(newGeoLoc);
          });  
        }
    };


	    


	$scope.getMainChartData = function (_startDate, _endDate, deleteSelectedScene) {
		if (_startDate != undefined && _startDate != null && _endDate != undefined && _endDate != null) {
			$scope.range = _startDate + "-" + _endDate;
		}
	  
		if(deleteSelectedScene){
			$scope.selectedScene = {};
		}

		$scope.startChart = 0;
		var chartParams = {
			start: $scope.startChart,
			offset: 10
		};
	  
	  
		if($scope.selectedScene != null && $scope.selectedScene.id != null){
			$scope.getSceneBasedChartData($scope.selectedScene.id, $scope.selectedScene.name);
			return; 
		}
	  
	  //Restangular.all('analytics/data/time?range='+$scope.range).post(chartParams, {}, {'Content-Type': 'application/json'}).then(function (response) {        	  
			var response = JSON.parse('{"chartDatas":[{"date":"2017-08-29","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-08-30","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-08-31","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-01","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-02","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-03","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-04","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-05","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-06","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-07","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-08","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-09","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-10","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-11","viewCount":1,"uniqueViewCount":1,"watchTime":18,"engagement":60},{"date":"2017-09-12","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-13","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-14","viewCount":34,"uniqueViewCount":6,"watchTime":144,"engagement":8},{"date":"2017-09-15","viewCount":19,"uniqueViewCount":6,"watchTime":58,"engagement":8},{"date":"2017-09-16","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-17","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-18","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-19","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-20","viewCount":1,"uniqueViewCount":1,"watchTime":7,"engagement":17},{"date":"2017-09-21","viewCount":9,"uniqueViewCount":5,"watchTime":42,"engagement":9},{"date":"2017-09-22","viewCount":17,"uniqueViewCount":10,"watchTime":40,"engagement":7},{"date":"2017-09-23","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-24","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-25","viewCount":9,"uniqueViewCount":5,"watchTime":92,"engagement":19},{"date":"2017-09-26","viewCount":8,"uniqueViewCount":4,"watchTime":51,"engagement":14},{"date":"2017-09-27","viewCount":13,"uniqueViewCount":4,"watchTime":135,"engagement":22},{"date":"2017-09-28","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null}],"sceneTimeBasedChartDatas":[{"id":200,"name":"demo3","viewCount":1,"uniqueViewCount":1,"watchTime":8,"engagement":8},{"id":150,"name":"demo2","viewCount":5,"uniqueViewCount":2,"watchTime":49,"engagement":8},{"id":100,"name":"demo","viewCount":105,"uniqueViewCount":39,"watchTime":530,"engagement":12}],"browserUsageData":{"Java":6,"Chrome":43,"Firefox":3},"osUsageData":{"JVM":6,"Linux":46},"deviceUsageData":{"Personal computer":46,"Other":6},"geoLocData":{"Turkey":52},"totalViewCount":111,"totalUniqueViewCount":42,"totalWatchTime":587,"totalEngagement":11}');
			$scope.clearChartDatas();
			if (response.sceneTimeBasedChartDatas == null) {
				$scope.loadMoreStatus = false;
			}
	      
			if(response.sceneTimeBasedChartDatas != null){
				if (response.sceneTimeBasedChartDatas.length < 10) {
					$scope.loadMoreStatus = false;
				}else {
					$scope.loadMoreStatus = true;
				}
			}                            

			if(response.sceneTimeBasedChartDatas != null && response.sceneTimeBasedChartDatas.length > 0) {
				$scope.setChartData(response);

				if ($scope.mainChartData.sceneTimeBasedChartDatas && $scope.mainChartData.sceneTimeBasedChartDatas.length > 0) {
					angular.forEach($scope.mainChartData.sceneTimeBasedChartDatas, function (sceneTimeBasedChartData, key) {
						sceneTimeBasedChartData.watchTime = $scope.toHms(sceneTimeBasedChartData.watchTime);
					});
				}
			}
	      
			$scope.createMainChart();
			$scope.createBrowserUsageChart();
			$scope.createDeviceUsageChart();
			$scope.createOSUsageChart();
	     
	  //});
	};





	$scope.fetchSceneTimeBasedChartData = function (isLoadMore, isSearch) {
		if (isLoadMore || $scope.filter.name) {
			$scope.startChart = $scope.startChart + 10;
		}

		if (isSearch) {
			$scope.startChart = 0;
			$scope.clearChartDatas();
			$scope.loadMoreStatus = true;
		}

		var chartParams = {
			filterMap: {
				sceneName: [$scope.filter.name]
			},
			start: $scope.startChart,
			offset: 10
		};

		$scope.loading = true;

      //Restangular.all('analytics/data/time?range='+$scope.range).post(chartParams, {}, {'Content-Type': 'application/json'}).then(function (response) {

			// Sample search response
			var response = JSON.parse('{"chartDatas":[{"date":"2017-08-29","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-08-30","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-08-31","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-01","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-02","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-03","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-04","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-05","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-06","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-07","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-08","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-09","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-10","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-11","viewCount":1,"uniqueViewCount":1,"watchTime":18,"engagement":60},{"date":"2017-09-12","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-13","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-14","viewCount":34,"uniqueViewCount":6,"watchTime":144,"engagement":8},{"date":"2017-09-15","viewCount":19,"uniqueViewCount":6,"watchTime":58,"engagement":8},{"date":"2017-09-16","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-17","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-18","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-19","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-20","viewCount":1,"uniqueViewCount":1,"watchTime":7,"engagement":17},{"date":"2017-09-21","viewCount":9,"uniqueViewCount":5,"watchTime":42,"engagement":9},{"date":"2017-09-22","viewCount":17,"uniqueViewCount":10,"watchTime":40,"engagement":7},{"date":"2017-09-23","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-24","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-25","viewCount":9,"uniqueViewCount":5,"watchTime":92,"engagement":19},{"date":"2017-09-26","viewCount":8,"uniqueViewCount":4,"watchTime":51,"engagement":14},{"date":"2017-09-27","viewCount":13,"uniqueViewCount":4,"watchTime":135,"engagement":22},{"date":"2017-09-28","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null}],"sceneTimeBasedChartDatas":[{"id":150,"name":"demo2","viewCount":5,"uniqueViewCount":2,"watchTime":49,"engagement":8}],"browserUsageData":{"Java":6,"Chrome":43,"Firefox":3},"osUsageData":{"JVM":6,"Linux":46},"deviceUsageData":{"Personal computer":46,"Other":6},"geoLocData":{"Turkey":52},"totalViewCount":111,"totalUniqueViewCount":42,"totalWatchTime":587,"totalEngagement":11}');
          
			if (response.sceneTimeBasedChartDatas == null) {
				$scope.loadMoreStatus = false;
			}

			if (response.sceneTimeBasedChartDatas.length < 10) {
				$scope.loadMoreStatus = false;
			}else{
				$scope.loadMoreStatus = true;
			}
          
			if (response.sceneTimeBasedChartDatas != null) {
				response.sceneTimeBasedChartDatas = $scope.mainChartData.sceneTimeBasedChartDatas.concat(response.sceneTimeBasedChartDatas);
            
				$scope.clearChartDatas();
				$scope.setChartData(response);

	            if ($scope.mainChartData.sceneTimeBasedChartDatas && $scope.mainChartData.sceneTimeBasedChartDatas.length > 0) {
					angular.forEach($scope.mainChartData.sceneTimeBasedChartDatas, function (sceneTimeBasedChartData, key) {
						if (sceneTimeBasedChartData.watchTime) {
							if(Number.isInteger(sceneTimeBasedChartData.watchTime) ) {
								sceneTimeBasedChartData.watchTime = $scope.toHms(sceneTimeBasedChartData.watchTime);
							}
						}
					});
				}
			}
      //});
      $scope.loading = false;
	};


	//init main chart data
    $scope.getMainChartData();

      

      

    

    $scope.getSceneBasedChartData = function (id, name) {

    	/*
        var sceneBasedChartDataRequest = {
          method: 'POST',
          url: applicationWsPath + '/analytics/data/time?range='+$scope.range+"&sceneId="+id,
          headers: {
              'Content-Type': 'application/json'
          },
          data: {}
        };
        */	
        /*
        $http(sceneBasedChartDataRequest)
          .success(function (response) {
          	*/
          	
            var response = JSON.parse('{"chartDatas":[{"date":"2017-08-29","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-08-30","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-08-31","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-01","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-02","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-03","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-04","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-05","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-06","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-07","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-08","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-09","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-10","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-11","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-12","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-13","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-14","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-15","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-16","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-17","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-18","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-19","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-20","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-21","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-22","viewCount":2,"uniqueViewCount":1,"watchTime":6,"engagement":3},{"date":"2017-09-23","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-24","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-25","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-26","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null},{"date":"2017-09-27","viewCount":3,"uniqueViewCount":1,"watchTime":43,"engagement":12},{"date":"2017-09-28","viewCount":0,"uniqueViewCount":0,"watchTime":0,"engagement":null}],"sceneTimeBasedChartDatas":null,"browserUsageData":{"Chrome":2},"osUsageData":{"Linux":2},"deviceUsageData":{"Personal computer":2},"geoLocData":{"Turkey":2},"totalViewCount":5,"totalUniqueViewCount":2,"totalWatchTime":49,"totalEngagement":8}');
            response.sceneTimeBasedChartDatas = $scope.mainChartData.sceneTimeBasedChartDatas;
            $scope.clearChartDatas();
            $scope.selectedScene = {"id":id, "name":name};
           
            $scope.setChartData(response);
            
            $scope.createMainChart();
            $scope.createBrowserUsageChart();
            $scope.createDeviceUsageChart();
            $scope.createOSUsageChart();

            $("html, body").stop().animate({scrollTop:0}, '500', 'swing');

           /*
          })
			
			
          .error(function (response) {
              if (response.status == "500"){
                  Notification.error({     
                      message: '<i class="fa fa-times-circle" aria-hidden="true"></i><span>Scene main chart data get error</span>',
                      delay: 2000
                  });
              }
          })
          .finally(function() {
          });
          */
    };


    
}]);