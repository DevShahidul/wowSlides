
app.controller('DetailedReportingCtrl', ['$scope', '$location', 'localStorageService', function($scope, $location, localStorageService) {
   $scope.scene = {};
    $scope.sceneStats = {};
    $scope.allHeatMaps = new Map();
    $scope.chartSeriesData = [];
    $scope.sceneTotalTime = 0;
    $scope.tracksExposure = [];
    $scope.questionTrackStatistics = {};
    $scope.questionTrackStatisticsMap = new Map();
    $scope.trackInteractionStatistics = {};
    $scope.trackInteractionStatisticsMap = new Map();
    $scope.fetchButtonStatus = false;
    $scope.filter = {};
    var hls = undefined;
    var applicationPath = '/';
    var wowApi = null;



    $scope.toHHMMSS = function(sec) {
        var milliSeconds = parseInt((sec*1000)%1000);
        var sec_num = parseInt(sec, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        if (milliSeconds < 10) {milliSeconds = "00"+milliSeconds;}
        if (milliSeconds > 10 && milliSeconds < 100) {milliSeconds = "0"+milliSeconds;}
        return hours+':'+minutes+':'+seconds;//+'.'+milliSeconds;
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


	Date.prototype.customFormat = function(formatString){
      var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
        YY = ((YYYY=this.getFullYear())+"").slice(-2);
        MM = (M=this.getMonth()+1)<10?('0'+M):M;
        MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
        DD = (D=this.getDate())<10?('0'+D):D;
        DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
        th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
      formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
        h=(hhh=this.getHours());
        if (h==0) h=24;
        if (h>12) h-=12;
        hh = h<10?('0'+h):h;
        hhhh = hhh<10?('0'+hhh):hhh;
        AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
        mm=(m=this.getMinutes())<10?('0'+m):m;
        ss=(s=this.getSeconds())<10?('0'+s):s;
      return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
    };



    //$(document).ready(function() {

    	
    	/**video-controls**/
        var video = document.getElementById('video-report');
        $(".play-video").click(function(){
            video.play();
            $('.play-video').css('display','none');
            $('.pause-video').css('display','block');
        });

        $(".pause-video").click(function(){
            video.pause();
            $('.play-video').css('display','block');
            $('.pause-video').css('display','none');
        });
        /**video-controls**/


    	$scope.createVideoChart = function (argument) {
          var chart = Highcharts.chart('scene-chart-container', {
              credits: {
                  enabled: false
              },
              chart: {
                  type: 'line',
                  events: {
                      click: function (event) {
                          $('.highcharts-plot-lines-0').remove();
                          var sec = Highcharts.numberFormat(event.xAxis[0].value, 0)
                          //video.currentTime = sec;
                          wowApi.currentSlide(sec);
                      }
                  }       

              },
              title: {
                  text: '',
                  style: {
                      display: 'none'
                  }
              },
              xAxis: {
                  allowDecimals: false,
                  tickInterval: 1,
                  lineWidth: 0,
                  min: 1,
                  minorGridLineWidth: 0,
                  lineColor: 'transparent',
                  minorTickLength: 0,
                  tickLength: 0,
                  labels: {
                      enabled: false
                  }
              },
              yAxis: {
                  allowDecimals: false,
                  tickInterval: 1,
                  lineWidth: 0,
                  minorGridLineWidth: 0,
                  lineColor: 'transparent',
                  minorTickLength: 0,
                  tickLength: 0,
                  gridLineWidth: 0,
                  title: {
                      enabled: false
                  },
                  labels: {
                      enabled: false
                  }

              },
              tooltip: {
                  formatter: function () {
                      //return "Views: " + this.y+"<br>Time: "+$scope.toHHMMSS(this.x);
                      return "Views: " + this.y+"<br>Page: "+this.x;
                  },
                  crosshairs: {
                      color: '#FFF',
                      width: "1px"
                  }
              },
              exporting: {
                  buttons: {
                      contextButton: {
                          enabled: false
                      }    
                  }
              },   
              plotOptions: {
                  area: {
                      pointStart: 0,
                      marker: {
                          enabled: false,
                          states: {
                              hover: {
                                  enabled: true
                              }
                          }
                      }
                  },

                  series: {
                      cursor: 'pointer',
                      point: {
                          events: {
                              click: function (e) {
                                  $('.highcharts-plot-lines-0').remove();
                                  // video.currentTime = this.x;
                                  wowApi.currentSlide(this.x);
                              },
                              mouseOver: function () {

                              }

                          }
                      },
                      marker: {
                          enabled: false
                      } 
                  }


              },
              series: [{
                  showInLegend: false,
                  data: $scope.chartSeriesData
              }]
          });


           function videoTimeUpdate() {
              if(!video.paused){
                  if(chart.xAxis[0].plotLinesAndBands.length > 0) {
                        chart.xAxis[0].update({
                            plotLines:[{
                                id: 'xPlotLine',
                                value: video.currentTime,
                                width: 1,
                                color: '#FFF'
                            }]
                        });

                  } else {
                      chart.xAxis[0].addPlotLine({
                          id: 'xPlotLine',
                          value: video.currentTime,
                          width: 1,
                          color: '#FFF'
                      });
                  }
              }
          };

          //video.ontimeupdate = function() {videoTimeUpdate()};
          

          /*Tracks Tab Start*/
          /*
          var sceneExposureRequest = {
              method: 'GET',
              url: applicationWsPath + '/analytics/exposure/' + $routeParams.id,
              headers: {
                  'Content-Type': undefined
              }
          };

          $http(sceneExposureRequest)
          .success(function (response) {
          	*/
          	var response = JSON.parse('[{"trackId":1600,"trackName":null,"trackType":"FORM_DESIGNER","interactionType":null,"exposure":0,"interactions":0},{"trackId":1462,"trackName":"de","trackType":"DRAWING","interactionType":null,"exposure":1,"interactions":0},{"trackId":1451,"trackName":null,"trackType":"FORM_DESIGNER","interactionType":"AFD","exposure":2,"interactions":2},{"trackId":1500,"trackName":null,"trackType":"SCENE_SELECTION","interactionType":null,"exposure":8,"interactions":0},{"trackId":1501,"trackName":null,"trackType":"IMAGE","interactionType":null,"exposure":4,"interactions":0},{"trackId":1550,"trackName":null,"trackType":"FORM_DESIGNER","interactionType":null,"exposure":0,"interactions":0}]');
            if (response) {
              $scope.tracksExposure = response;
              angular.forEach($scope.tracksExposure, function (value, key) {
                if (value.interactionType == "C") {
                  value.interactionType = "Click"
                }else if (value.interactionType == "AQ") {
                  value.interactionType = "Answered Question"
                }else if (value.interactionType == "AFD") {
                  value.interactionType = "Answered Form"
                }
              });
            }
            /*
          })
            
          .error(function (response) {
              if (response.status == "500"){
                  Notification.error({     
                      message: '<i class="fa fa-times-circle" aria-hidden="true"></i><span>Tracks exposure get error</span>',
                      delay: 2000
                  });
              }
          })
          .finally(function() {
          });
		*/
          
          	

         

          $scope.getQuestionTrackStatistics = function (trackId, loadMore, search) {
              var _start = 0;
              $scope.questionTrackStatistics = $scope.questionTrackStatisticsMap.get(trackId);
              
              if (loadMore && $scope.questionTrackStatistics.userAnswerStatistics.length < $scope.questionTrackStatistics.userAnswerCount) {
                _start = $scope.questionTrackStatistics.userAnswerStatistics.length;
              }

              if (!$scope.questionTrackStatistics || ($scope.questionTrackStatistics && loadMore) || search ) {
                  if (!search) {
                    $scope.clearFilter();
                  }else{
                    $("#questionTrackExcelBtn").attr('data-url',$scope.getExcelPath("question-track", trackId));
                  }
                  $scope.questionTrackStatisticsParam = {
                    filterMap: {
                      name: [$scope.filter.name],
                      surname: [$scope.filter.surname],
                      username: [$scope.filter.username]
                    },
                    start: _start,
                    offset: 10
                  };
                  
                  $scope.loading = true;

                  Restangular.all('analytics/question-track/'+trackId).post($scope.questionTrackStatisticsParam, {}, {'Content-Type': 'application/json'}).then(function (response) {
                    if (loadMore) {
                      $scope.questionTrackStatistics.userAnswerStatistics = $scope.questionTrackStatistics.userAnswerStatistics.concat(response.userAnswerStatistics);
                    }else{
                      $scope.questionTrackStatistics = response;
                      if ($scope.questionTrackStatistics.questionType != "FREE_TEXT" && $scope.questionTrackStatistics.optionDatas.length > 0 && !search){
                          var datas = [];
                          angular.forEach($scope.questionTrackStatistics.optionDatas, function (optionData, key) {
                            var data = {};
                            data.name = optionData.optionText;
                            data.y = optionData.answerCount;
                            datas.push(data);
                          });  
                          $scope.createQuestionAnswerStatisticsChart(trackId, datas);
                      }
                        
                    }
                    var totalOptionAnswerCount = 0;
                    angular.forEach($scope.questionTrackStatistics.optionDatas, function (optionData, key) {
                        totalOptionAnswerCount += optionData.answerCount;
                    });
                    $scope.questionTrackStatistics.totalOptionAnswerCount = totalOptionAnswerCount;
                    $scope.questionTrackStatisticsMap.set(trackId, $scope.questionTrackStatistics);
                    $scope.loading = false;
                  });
              } 

              if (!(search || loadMore)) {
                $("#chevron"+trackId).toggleClass('fa-rotate-180');
                $scope.closeTrackDetailTabs(trackId);
              }
          };

          $scope.getTrackInteractionStatistics = function (trackId, loadMore, search) {
              var _start = 0;
              $scope.trackInteractionStatistics = $scope.trackInteractionStatisticsMap.get(trackId);
              
              if (loadMore && $scope.trackInteractionStatistics.trackInteractionStatisticsUserDetailDtos.length < $scope.trackInteractionStatistics.userInteractionCount) {
                _start = $scope.trackInteractionStatistics.trackInteractionStatisticsUserDetailDtos.length;
              }

              if (!$scope.trackInteractionStatistics || ($scope.trackInteractionStatistics && loadMore) || search) {
                  if (!search) {
                    $scope.clearFilter();
                  }else{
                    $("#trackInteractionExcelBtn").attr('data-url',$scope.getExcelPath("track-interaction", trackId));
                  }

                  $scope.trackInteractionStatisticsParam = {
                    filterMap: {
                      name: [$scope.filter.name],
                      surname: [$scope.filter.surname],
                      username: [$scope.filter.username]
                    },
                    start: _start,
                    offset: 10
                  };
                  
                  $scope.loading = true;

                  //Restangular.all('analytics/track-interaction/'+trackId).post($scope.trackInteractionStatisticsParam, {}, {'Content-Type': 'application/json'}).then(function (response) {
					var response = JSON.parse('{"trackId":1451,"userInteractionCount":2,"trackInteractionStatisticsUserDetailDtos":[{"sceneVisitorId":3201,"sittingId":3151,"personAccessId":150,"name":"anonymous","surname":"anonymous","username":"anonymous","interactedAt":"2017-09-27 16:29:19.52","interactionType":"AFD","introductionInput":null,"utmSource":"DIRECT","exposureCount":null,"interactionCount":null},{"sceneVisitorId":3200,"sittingId":3150,"personAccessId":150,"name":"anonymous","surname":"anonymous","username":"anonymous","interactedAt":"2017-09-27 16:26:33.043","interactionType":"AFD","introductionInput":null,"utmSource":"DIRECT","exposureCount":null,"interactionCount":null}]}');
					if (loadMore) {
                      $scope.trackInteractionStatistics.trackInteractionStatisticsUserDetailDtos = $scope.trackInteractionStatistics.trackInteractionStatisticsUserDetailDtos.concat(response.trackInteractionStatisticsUserDetailDtos);
                    }else{
                      $scope.trackInteractionStatistics = response;
                    }

                    $scope.trackInteractionStatisticsMap.set(trackId, $scope.trackInteractionStatistics);
                    $scope.loading = false;
                  //});
              } 

              if (!(search || loadMore)) {
                $("#chevron"+trackId).toggleClass('fa-rotate-180');
                $scope.closeTrackDetailTabs(trackId);
              }
          };

          $scope.closeTrackDetailTabs = function (trackId) {
            angular.forEach($scope.tracksExposure, function (track, key) {
                if ( $("#customRow"+track.trackId).hasClass("in") && track.trackId != trackId) {
                  $scope.clearFilter();
                  $("#chevron"+track.trackId).toggleClass('fa-rotate-180');
                  $("#customRow"+track.trackId).removeClass("in")
                }
            });
          };

          $scope.loadMoreQuestionTrackStatistics = function (trackId) {
            $scope.getQuestionTrackStatistics(trackId, true);
          };

          $scope.loadMoreTrackInteractionStatistics = function (trackId) {
            $scope.getTrackInteractionStatistics(trackId, true);
          };

          $scope.clearFilter = function () {
            $scope.filter.name = "";
            $scope.filter.surname = "";
            $scope.filter.username = "";
          };

          $scope.getInteractionTypeName = function (value) {
            if (value == "C") {
              value = "Click"
            }else if (value == "AQ") {
              value= "Answered Question"
            }else if (value == "AFD") {
              value= "Answered Form"
            }
            return value;
          };

          $scope.createQuestionAnswerStatisticsChart = function (trackId, datas) {
            // Build the chart
            Highcharts.chart('question-user-answer-statistics-chart-container'+trackId, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Answer Statistics'
                },
                /*tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> {series.y}'
                },*/
                tooltip: {
                    formatter: function() {
                        return this.key + ' <br/> <b>' + Math.round(this.percentage * 100) / 100  + '%</b> '+ '(' + this.y + ')';
                    }
                },
                exporting: { 
                    enabled: false 
                },  
                plotOptions: {
                    pie: {
                        showInLegend: false,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                            format: '<b>{point.name}</b>: {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            },
                            connectorColor: 'silver'
                        }
                    }

                },
                /*legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'left',
                    y: 30,
                    navigation: {
                        activeColor: '#3E576F',
                        animation: true,
                        arrowSize: 12,
                        inactiveColor: '#CCC',
                        style: {
                            fontWeight: 'bold',
                            color: '#333',
                            fontSize: '12px'    
                        }
                    }
                },*/
                series: [{
                    name: 'Rate',
                    data: datas
                }],
                credits: {
                    enabled: false
                }
            });
          };

          $scope.getSelectedOptionText = function (trackId, optionId, optionIds) {
            var selectedQuestionTrack = $scope.questionTrackStatisticsMap.get(trackId);
            var optionText = "";

            if (selectedQuestionTrack.questionType == "SINGLE_SELECT") {
                angular.forEach(selectedQuestionTrack.optionDatas, function (optionData, key) {
                    if (optionData.optionId == optionId) {
                      optionText = optionData.optionText;
                    }
                });
                return optionText;
            }else if (selectedQuestionTrack.questionType == "MULTI_SELECT"){
               angular.forEach(selectedQuestionTrack.optionDatas, function (optionData, key) {
                  for (var i = 0; i < optionIds.length; i++) {
                    if (optionData.optionId == optionIds[i]) {
                      optionText += optionData.optionText + ", ";
                    }
                  }
              });
              return optionText = optionText.replace(/,\s*$/, "");
            }
           
          };
         
          $scope.clearHtmlTags = function (text) {
        	  return text ? String(text).replace(/<[^>]+>/gm, '') : '';
          };

          $scope.getQuestionOptionSelectionRate = function (answerCount, totalOptionAnswerCount) {
            var rate = 0;
            if (answerCount && totalOptionAnswerCount) {
              rate = Math.round(answerCount / totalOptionAnswerCount * 100);
              if (rate == null) {
                rate = 0;
              }
            }
            return rate;
          };

          /*Tracks Tab End*/
        };






    	/*
        var sceneReportRequest = {
            method: 'GET',
            url: applicationWsPath + '/analytics/scene/' + $routeParams.id,
            headers: {
                'Content-Type': undefined
            }
        };

        $http(sceneReportRequest)
        .success(function (response) {

       */ 	

       		var response = JSON.parse('{"id":null,"scene":{"id":null,"hashId":"YVX3eKO4","name":"demo","description":"demo","mediaContent":{"id":null,"mediaPlatform":"STREAMX","name":"big_buck_bunny_720p_5mbx","entryStatus":null,"duration":30,"url":"http://prod.streamx.io/p/233/sp/23300/serveFlavor/entryId/0_oeidqn6v/v/12/flavorId/0_jm0hptrs/fileName/big_buck_bunny_720p_5mbx_(Source).mp4/forceproxy/true/name/a.mp4","hlsUrl":null,"thumbnail":null,"entryId":"0_oeidqn6v","mediaType":"VIDEO","mediaSourceType":null,"hashId":"BmJdPqJZ"},"remoteRef":null,"autoplay":false,"tracks":null,"uuid":null,"image":{"id":100,"version":null,"status":"ACTIVE","selected":false,"organisation":null,"name":null,"fileHash":null,"folder":false,"fileSize":null,"url":"http://localhost:8090/gplayer/gallery/100/2a82bb0d-8b6a-4be7-8911-b8ab68d9d351/0","createdBy":null,"createdAt":null,"mimeType":null,"hasChild":false,"uuid":null,"imageTagList":null},"showTrackMark":false,"showShareIcon":false,"retakeable":false,"anonymousAllowed":false,"suggestedScenes":false,"layers":null,"subtitles":null,"scenePlayer":null,"tags":null,"createdAt":null,"duration":30,"editorEnabled":true,"permissions":null},"viewCount":167,"uniqueViewCount":79,"watchTime":1106,"engagement":16,"data":"1:156,2:109,3:64,4:47,5:35,6:28,7:25,8:28,9:29,10:33,11:23,12:21,13:18,14:21,15-17:19,18:16,19-20:15,21:14,22:16,23:15,24:17,25:14,26-27:12,28:11,29:10,30-34"}');
            if (response) {
              $scope.sceneStats = response;
              $scope.sceneTotalTime = response.scene.duration;
              if ($scope.sceneStats.scene.description) {
                $scope.sceneStats.scene.description = $scope.sceneStats.scene.description.replace(/<\/?[^>]+(>|$)/g, "");
              }
              $scope.sceneStats.scene.duration = $scope.toHHMMSS(response.scene.duration);
              $scope.sceneStats.watchTime = $scope.toHms(response.watchTime);

              //$("#video-report").attr("src", $scope.sceneStats.scene.mediaContent.url);

               wowApi = new WowSlides('.scene-video-container',{
		            url: 'https://www.wowslides.com/users/al/is/alisan.erdemli/projects/2017/07/media_bitcoin-seminar-pptx/.e.html',
		            embedded: true,
		            sections: '',
		            //autoAdvance: false,
		            //slide: 4,
		            onReady: function(){
		                //console.log("__ONREADY FIRED!");
		            },
		            onSlideChange: function(currentSlideNumber){
		               //console.log("__ONSLIDE_CHANGE FIRED --> " + currentSlideNumber );
		            },
		            onProgressChange: function(progress){
		               //console.log("__ONPROGRESS_CHANGE FIRED --> " + progress );
		            }
		        });
              


              if ($scope.sceneStats.data) {
                  var heatMapDataArray = $scope.sceneStats.data.split(",");
                  if (heatMapDataArray != null) {

                      for (var k = 0; k < heatMapDataArray.length; k++) {
                          var heatMapDataSubPartial = heatMapDataArray[k].split(":");
                          var _count = 1;

                          if(heatMapDataSubPartial.length == 2 && heatMapDataSubPartial[1] != null){
                              _count = parseInt(heatMapDataSubPartial[1]);
                          }

                          var heatMapDataSubSubPartial = heatMapDataSubPartial[0].split("-");

                          var len = 0;
                          if (heatMapDataSubSubPartial.length < 2) {
                              len = parseInt(heatMapDataSubSubPartial[0]);
                          }else {
                              len = parseInt(heatMapDataSubSubPartial[1]);
                          }
                          
                          for (var l = parseInt(heatMapDataSubSubPartial[0]); l <= len; l++) {
                              var oldValue = $scope.allHeatMaps.get(l);
                              if (oldValue == null) {
                                  oldValue = 0;
                              }
                              $scope.allHeatMaps.set(parseInt(l) , oldValue + _count );
                          }

                      }

                      var _key = 0;    
                      $scope.allHeatMaps.forEach(function (item, key, mapObj) {
                          if (_key == key)  {
                            $scope.chartSeriesData.push(item);
                            _key++;
                          }else{
                            var zeroCount = key - _key;
                            for (var x = 0; x < zeroCount; x++) {
                              $scope.chartSeriesData.push(0);
                            }
                            $scope.chartSeriesData.push(item);
                            _key = _key + zeroCount + 1; 
                          }
                          
                      });

                      var zeroValues = $scope.sceneTotalTime - $scope.chartSeriesData.length;

                      for (var m = 0; m < zeroValues; m++) {
                        $scope.chartSeriesData.push(0);
                      }

                      $scope.createVideoChart();

                  }
              }
              


            }

            /*
        })
          
        .error(function (response) {
            if (response.status == "500"){
                Notification.error({     
                    message: '<i class="fa fa-times-circle" aria-hidden="true"></i><span>Scene report get error</span>',
                    delay: 2000
                });
            }
        })

        .finally(function() {
        });

        */

        $scope.fetchSceneAnalytics = function(fetchStatus) {
            if (!fetchStatus) {
              $scope.start = 0;
              $scope.heatMapWithUserList = [];
            } else {
              $scope.start = $scope.start + 10;
            }

            var params = {
              start: $scope.start,
              offset: 10
            };
              
            // Restangular.all('analytics/scene/heatmap/'+$routeParams.id).post(params, {}, {'Content-Type': 'application/json'}).then(function (response) {
				
              var response = JSON.parse('{"id":null,"scene":{"id":100,"hashId":null,"name":"demo","description":null,"mediaContent":{"id":null,"mediaPlatform":null,"name":null,"entryStatus":null,"duration":null,"url":null,"hlsUrl":null,"thumbnail":null,"entryId":null,"mediaType":null,"mediaSourceType":null,"hashId":null},"remoteRef":null,"autoplay":false,"tracks":null,"uuid":null,"image":null,"showTrackMark":false,"showShareIcon":false,"retakeable":false,"anonymousAllowed":false,"suggestedScenes":false,"layers":null,"subtitles":null,"scenePlayer":null,"tags":null,"createdAt":null,"duration":30,"editorEnabled":true,"permissions":null},"heatMap":[{"id":null,"createdAt":1506518979659,"userId":150,"geoLoc":{"id":null,"remoteAddress":"127.0.0.1","latitude":null,"longitude":null,"isp":null,"country":"Turkey","countryCode":"TR","city":"Istanbul","url":"http://localhost:8090/gplayer/watch?iv=YVX3eKO4"},"ua":{"id":null,"visitedAt":1506518938808,"name":"Firefox","osFamily":"Linux","os":"Linux (Ubuntu)","userAgentType":"Browser","userAgentFamily":"Firefox","deviceCategory":"Personal computer","versionNumber":"55.0","producer":"Mozilla Foundation","ua":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0"},"heatMap":"0-1","introductionInput":null,"utmSource":"DIRECT","engagement":7,"watchTime":2},{"id":null,"createdAt":1506518799670,"userId":150,"geoLoc":{"id":null,"remoteAddress":"0:0:0:0:0:0:0:1","latitude":null,"longitude":null,"isp":null,"country":"Turkey","countryCode":"TR","city":"Istanbul","url":"http://localhost:8090/gplayer/watch?iv=YVX3eKO4"},"ua":{"id":null,"visitedAt":1506518771440,"name":"Chrome","osFamily":"Linux","os":"Linux","userAgentType":"Browser","userAgentFamily":"Chrome","deviceCategory":"Personal computer","versionNumber":"60.0.3112.78","producer":"Google Inc.","ua":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36"},"heatMap":"0-1","introductionInput":null,"utmSource":"DIRECT","engagement":7,"watchTime":2},{"id":null,"createdAt":1506512966536,"userId":150,"geoLoc":{"id":null,"remoteAddress":"0:0:0:0:0:0:0:1","latitude":null,"longitude":null,"isp":null,"country":"Turkey","countryCode":"TR","city":"Istanbul","url":"http://localhost:8090/gplayer/watch?iv=YVX3eKO4"},"ua":{"id":null,"visitedAt":1506493925477,"name":"Chrome","osFamily":"Linux","os":"Linux","userAgentType":"Browser","userAgentFamily":"Chrome","deviceCategory":"Personal computer","versionNumber":"60.0.3112.78","producer":"Google Inc.","ua":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36"},"heatMap":"0-1","introductionInput":null,"utmSource":"DIRECT","engagement":7,"watchTime":2},{"id":null,"createdAt":1506509126537,"userId":150,"geoLoc":{"id":null,"remoteAddress":"0:0:0:0:0:0:0:1","latitude":null,"longitude":null,"isp":null,"country":"Turkey","countryCode":"TR","city":"Istanbul","url":"http://localhost:8090/gplayer/watch?iv=YVX3eKO4"},"ua":{"id":null,"visitedAt":1506493925477,"name":"Chrome","osFamily":"Linux","os":"Linux","userAgentType":"Browser","userAgentFamily":"Chrome","deviceCategory":"Personal computer","versionNumber":"60.0.3112.78","producer":"Google Inc.","ua":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36"},"heatMap":"0-12","introductionInput":null,"utmSource":"DIRECT","engagement":43,"watchTime":13},{"id":null,"createdAt":1506502406549,"userId":150,"geoLoc":{"id":null,"remoteAddress":"0:0:0:0:0:0:0:1","latitude":null,"longitude":null,"isp":null,"country":"Turkey","countryCode":"TR","city":"Istanbul","url":"http://localhost:8090/gplayer/watch?iv=YVX3eKO4"},"ua":{"id":null,"visitedAt":1506493925477,"name":"Chrome","osFamily":"Linux","os":"Linux","userAgentType":"Browser","userAgentFamily":"Chrome","deviceCategory":"Personal computer","versionNumber":"60.0.3112.78","producer":"Google Inc.","ua":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36"},"heatMap":"0-12","introductionInput":null,"utmSource":"DIRECT","engagement":43,"watchTime":13},{"id":null,"createdAt":1506495712841,"userId":150,"geoLoc":{"id":null,"remoteAddress":"0:0:0:0:0:0:0:1","latitude":null,"longitude":null,"isp":null,"country":"Turkey","countryCode":"TR","city":"Istanbul","url":"http://localhost:8090/gplayer/watch?iv=YVX3eKO4"},"ua":{"id":null,"visitedAt":1506493925477,"name":"Chrome","osFamily":"Linux","os":"Linux","userAgentType":"Browser","userAgentFamily":"Chrome","deviceCategory":"Personal computer","versionNumber":"60.0.3112.78","producer":"Google Inc.","ua":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36"},"heatMap":"0-3","introductionInput":null,"utmSource":"DIRECT","engagement":13,"watchTime":4},{"id":null,"createdAt":1506495292850,"userId":150,"geoLoc":{"id":null,"remoteAddress":"0:0:0:0:0:0:0:1","latitude":null,"longitude":null,"isp":null,"country":"Turkey","countryCode":"TR","city":"Istanbul","url":"http://localhost:8090/gplayer/watch?iv=YVX3eKO4"},"ua":{"id":null,"visitedAt":1506493925477,"name":"Chrome","osFamily":"Linux","os":"Linux","userAgentType":"Browser","userAgentFamily":"Chrome","deviceCategory":"Personal computer","versionNumber":"60.0.3112.78","producer":"Google Inc.","ua":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36"},"heatMap":"0-3","introductionInput":null,"utmSource":"DIRECT","engagement":13,"watchTime":4},{"id":null,"createdAt":1506495172865,"userId":150,"geoLoc":{"id":null,"remoteAddress":"0:0:0:0:0:0:0:1","latitude":null,"longitude":null,"isp":null,"country":"Turkey","countryCode":"TR","city":"Istanbul","url":"http://localhost:8090/gplayer/watch?iv=YVX3eKO4"},"ua":{"id":null,"visitedAt":1506493925477,"name":"Chrome","osFamily":"Linux","os":"Linux","userAgentType":"Browser","userAgentFamily":"Chrome","deviceCategory":"Personal computer","versionNumber":"60.0.3112.78","producer":"Google Inc.","ua":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36"},"heatMap":"0-3","introductionInput":null,"utmSource":"DIRECT","engagement":13,"watchTime":4},{"id":null,"createdAt":1506495172842,"userId":150,"geoLoc":{"id":null,"remoteAddress":"0:0:0:0:0:0:0:1","latitude":null,"longitude":null,"isp":null,"country":"Turkey","countryCode":"TR","city":"Istanbul","url":"http://localhost:8090/gplayer/watch?iv=YVX3eKO4"},"ua":{"id":null,"visitedAt":1506493925477,"name":"Chrome","osFamily":"Linux","os":"Linux","userAgentType":"Browser","userAgentFamily":"Chrome","deviceCategory":"Personal computer","versionNumber":"60.0.3112.78","producer":"Google Inc.","ua":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36"},"heatMap":"0-1","introductionInput":null,"utmSource":"DIRECT","engagement":7,"watchTime":2},{"id":null,"createdAt":1506493972851,"userId":150,"geoLoc":{"id":null,"remoteAddress":"0:0:0:0:0:0:0:1","latitude":null,"longitude":null,"isp":null,"country":"Turkey","countryCode":"TR","city":"Istanbul","url":"http://localhost:8090/gplayer/watch?iv=YVX3eKO4"},"ua":{"id":null,"visitedAt":1506493925477,"name":"Chrome","osFamily":"Linux","os":"Linux","userAgentType":"Browser","userAgentFamily":"Chrome","deviceCategory":"Personal computer","versionNumber":"60.0.3112.78","producer":"Google Inc.","ua":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36"},"heatMap":"0-3:2,4-41","introductionInput":null,"utmSource":"DIRECT","engagement":100,"watchTime":46}],"userMap":{"150":{"id":null,"createdBy":null,"createdAt":1506594213801,"updatedBy":null,"updatedAt":1506594213801,"frozen":false,"status":null,"name":"anonymous","middleName":null,"surname":"anonymous","uuid":null,"gender":null,"dob":null,"avatarURL":null,"uniqueName":null,"workIndustry":null,"educationLevel":null,"aboutMe":null,"interests":null,"tenant":null,"personAccesses":null,"attributes":null,"identificationNumber":null,"source":null,"sourceId":null,"username":null,"personAccessId":150,"password":null,"email":null,"companyAdmin":false,"securityGroups":null}},"totalRecords":167}');
              if (response) {
                  $scope.scene = response.scene;
                  
                  angular.forEach(response.heatMap, function (heat, key) {
                    var heatMapWithUser = heat;
                    heatMapWithUser.name = response.userMap[heat.userId].name;
                    heatMapWithUser.surname = response.userMap[heat.userId].surname;
                    heatMapWithUser.date = new Date(heat.createdAt).customFormat( "#DDD# #DD#/#MM#/#YYYY# #hh#:#mm#:#ss# #AMPM#" );
                    $scope.heatMapWithUserList.push(heatMapWithUser);
                  });

                  if ($scope.heatMapWithUserList.length < response.totalRecords) {
                    $scope.fetchButtonStatus = true;
                  }else{
                    $scope.fetchButtonStatus = false;
                  }

                  setTimeout(function() {
                      angular.forEach(response.heatMap, function (heat, key) {
                      var heatMapDataArray = heat.heatMap.split(",");
                      var totalWatcedPercentage = 0;

                      if (heatMapDataArray != null) {

                          for (var i = 0; i < heatMapDataArray.length; i++) {
                              var heatMapDataSubPartial = heatMapDataArray[i].split(":");
                              var _count = 1;

                              if(heatMapDataSubPartial.length == 2 && heatMapDataSubPartial[1] != null){
                                  _count = parseInt(heatMapDataSubPartial[1]);
                              }

                              var rectColor = "#E4FF7A";
                              if (_count != 1) {
                                if (_count == 2) {
                                    rectColor = "#E5D462"
                                }else if (_count == 3) {
                                    rectColor = "#E7A94A"
                                }else if (_count == 4) {
                                    rectColor = "#E87E33"
                                }else if (_count == 5) {
                                    rectColor = "#EA531B"
                                }else if (_count > 5) {
                                    rectColor = "#EC2904"
                                }
                              }
                              
                              var heatMapDataSubSubPartial = heatMapDataSubPartial[0].split("-");

                              var heatmap = Snap("#heatMap_" + (key + params.start) );

                              var _startPosition = Math.round((heatMapDataSubSubPartial[0] / $scope.scene.duration) * 100 * 100) / 100 ;

                              var _rectWidth = Math.round(100 / $scope.scene.duration * 100) / 100;

                              if (heatMapDataSubSubPartial[1]) {
                                _rectWidth = Math.round((heatMapDataSubSubPartial[1] - heatMapDataSubSubPartial[0] + 1) / $scope.scene.duration * 100 * 100) / 100;
                              }

                              //totalWatcedPercentage += _rectWidth;

                              var heatmapSvg = heatmap.rect(_startPosition+"%", 0, _rectWidth+"%", 30).attr({  
                                fill: rectColor, 
                                opacity: 1 
                              });  

                          }
                          
                          totalWatcedPercentage = heat.engagement;
                          
                          if (totalWatcedPercentage > 100) {
                            totalWatcedPercentage = 100;
                          }

                          totalWatcedPercentage = Math.round(totalWatcedPercentage) + "%";

                          if ($scope.scene.duration == 0) {
                            totalWatcedPercentage = "-";
                          }

                          //todo watched percentage
                          var text = heatmap.text("50%", 20, totalWatcedPercentage).attr({
                            'text-anchor': "middle"
                          });
                          
                          /*heatmap.text({text:["Line1", "Line2", "Line3"]})
                           .attr({fill:"black", fontSize:"18px"})
                           .selectAll("tspan").forEach(function(tspan, i){
                              tspan.attr({x:0, y:25*(i+1)});
                           });*/

                      }

                    });//end of heatMap forEach

                  }, 300);

              }             
            // });


        };
     
        //init scene analytics data
        $scope.fetchSceneAnalytics();

        $scope.previewVideo = function (hashId){
          var locPort = "";
          if($location.port() != 80 && $location.port() != 443){
              locPort = ':' + $location.port();
          }

          return $location.protocol() + '://'+ $location.host() + locPort + applicationPath + "/watch?iv=" + hashId + '&prev=1'; 
          // var win = window.open(sceneSrc, '_blank');
          // win.focus();
        };

        $scope.getExcelPath = function (excelType, trackId) {
          var locPort = "";
          var excelId = "";
          
          if($location.port() != 80 && $location.port() != 443){
              locPort = ':' + $location.port();
          }

          if (excelType == "tracks" || excelType == "heatmap") {
            excelId = $scope.scene.id
          }else if (excelType == "question-track" || excelType == "track-interaction" || excelType == "form-design") {
            excelId = trackId;
          }
          
          excelPath = $location.protocol() + '://' + $location.host() + locPort + applicationPath + '/service/analytics/export/excel/' + excelType + '/' + excelId + '?token=' + localStorageService.get('token');
          
          if ($scope.filter.name) {
            excelPath += '&name='+$scope.filter.name;
          }

          if ($scope.filter.surname) {
            excelPath += '&surname='+$scope.filter.surname;
          }

          if ($scope.filter.username) {
            excelPath += '&username='+$scope.filter.username;
          }

          return excelPath;
        };
        
        $(document).off('click', 'button.downloadExcelReport');
        $(function() {
            $(document).on("click", "button.downloadExcelReport", function() {
         
                var $preparingFileModal = $("#preparing-file-modal");
         
                $preparingFileModal.dialog({ modal: true });
         
                $.fileDownload($(this).attr('data-url'), {
                    successCallback: function(url) {
                        $preparingFileModal.dialog('close');
                    },
                    failCallback: function(responseHtml, url) {
                        $preparingFileModal.dialog('close');
                        $("#error-modal").dialog({ modal: true });
                    }
                });
                //return false; //this is critical to stop the click event which will trigger a normal file download!
            });
        });
 


        $scope.$on('$routeChangeStart', function(next, current) { 
           if (Hls.isSupported() && hls) {
              hls.stopLoad();
           }
        });

        

        $scope.showHeatmapTab = function (argument) {
          $("#heatmap-tab").addClass("active");
          $("#heatmap-detail-tab").addClass("active");
          $("#tracks-tab").removeClass("active");
          $("#tracks-detail-tab").removeClass("active");
        };

        $scope.showTracksTab = function () {
          $("#heatmap-tab").removeClass("active");
          $("#heatmap-detail-tab").removeClass("active");
          $("#tracks-tab").addClass("active");
          $("#tracks-detail-tab").addClass("active");
        };

        $scope.searchUser = function () {
          
        };
    
        

        $scope.getDeviceName = function(heatMapWithUser){
        	if(heatMapWithUser == null || heatMapWithUser.ua == null){
        		return "-";
        	}
        	return heatMapWithUser.ua.userAgentType +"/" + heatMapWithUser.ua.userAgentFamily +"-"+heatMapWithUser.ua.versionNumber +"/"+ heatMapWithUser.ua.os;
        }
      
    //});//end of ready function
    
}]);