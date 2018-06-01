export const createChart = function(xValues,chartId,datasets,title,yMax,yTitle){
  var ctx = document.getElementById(chartId);

  var anotherChart = new Chart(ctx, {
    type: 'line',
    data: {
     // labels: impulses.date,
     labels: xValues,
     datasets: datasets

    },
    options: {
      // responsiveAnimationDuration: 2000,
      legend: {
        display: true,
        position: 'bottom',
        labels:{fontSize:10}
      },
      title:{
        display: true,
        text: title
      },
      scales: {
        xAxes: [{
         // ticks:{display: false},
         gridLines: {
                   // drawOnChartArea:false,drawBorder:true
               },
         ticks: {fontSize:10},
         type: 'time',
         time: {
           unit: 'day',
           displayFormats: {
            'millisecond': 'DD MMM',
             'second': 'DD MMM',
             'minute': 'DD MMM',
             'hour': 'DD MMM',
             'day': 'DD MMM',
             'week': 'DD MMM',
             'month': 'DD MMM',
             'quarter': 'DD MMM',
             'year': 'DD MMM',
           }
         }
        }],
        yAxes: [{
          gridLines: {
                    // drawOnChartArea:false,drawBorder:true
                },
          scaleLabel: {
            display: true,
            labelString: yTitle,
          },
          ticks: {
            autoSkip: true,
            autoSkipPadding: 20,
            beginAtZero: true,
            fontSize:10,
            userCallback: function(label, index, labels) {
              // when the floored value is the same as the value we have a whole number
              if (Math.floor(label) === label && index != 0) {
                return label;
              }
            },
            max: yMax,
            // stepSize: 1
            // console.log(ytickops);
          }
        }]
      }
    }
  });
  return anotherChart;
}

export const create2yAxisChart = function(xValues,chartId,datasets,title,yLMax,yLTitle,yLStepSize,yRMax,yRTitle,yRStepSize){
  var ctx = document.getElementById(chartId);

  var anotherChart = new Chart(ctx, {
      responsive: true,
      type: 'line',
      data: {
          datasets: datasets,
          labels: xValues
      },
      options: {
          // responsiveAnimationDuration: 2000,
          legend: {
            display: true,
            position: 'bottom',
            labels:{fontSize:10}
          },
          title:{
            display: true,
            text: title
          },
          scales: {
            xAxes: [{
             // ticks:{display: false},
             ticks: {fontSize:10},
             type: 'time',
             time: {
               unit: 'day',
               displayFormats: {
                'millisecond': 'DD MMM',
                 'second': 'DD MMM',
                 'minute': 'DD MMM',
                 'hour': 'DD MMM',
                 'day': 'DD MMM',
                 'week': 'DD MMM',
                 'month': 'DD MMM',
                 'quarter': 'DD MMM',
                 'year': 'DD MMM',
               }
             }
            }],
            yAxes: [{
                id: 'yLeft',
                type: 'linear',
                position: 'left',
                scaleLabel: {
                  display: true,
                  labelString: yLTitle,
                },
                ticks: {
                  autoSkip: true,
                  // maxTicksLimit:6,
                  beginAtZero: true,
                  fontSize:10,
                  userCallback: function(label, index, labels) {
                    if (Math.floor(label) === label && index != 0) {
                      return label;
                    }
                  },
                  max: yLMax,
                  // stepSize: yLStepSize
                  // suggestedMax: 5
                  // maxTicksLimit: 6
                }
            }, {
                id: 'yRight',
                type: 'linear',
                position: 'right',
                gridLines: {
                          drawOnChartArea:false //,drawBorder:true
                      },
                scaleLabel: {
                  display: true,
                  labelString: yRTitle,
                },
                ticks: {
                  autoSkip: true,
                  // maxTicksLimit:6,
                  display:true,
                  beginAtZero: true,
                  fontSize:10,
                  userCallback: function(label, index, labels) {
                    // when the floored value is the same as the value we have a whole number
                    if (Math.floor(label) === label  && index != 0) {
                      return label;
                    }
                  },
                  max: yRMax,
                  // maxTicksLimit: 6
                  // stepSize: yRStepSize
                }
            }]
          }
      }
  });
  return anotherChart;
}
