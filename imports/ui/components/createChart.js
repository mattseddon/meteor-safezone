import moment from 'moment';

export const processMongo = function(dp,xids,dates,avgDT){

  function getKeys(d){
    var uniqueKeys = Object.keys(d.reduce(function(result, obj) {
      return Object.assign(result, obj);
    }, {}))
    return uniqueKeys.filter(k => !xids.includes(k));
  }

  function sumobj( obj ) {
    var sum = 0;
    for( var el in obj ) {
      sum += obj[el];
    }
    return sum;
  }

  function cntobj( obj ) {
    var count = 0;
    for( var el in obj ) {
       count += 1;
    }
    return count;
  }

  var dtVals   = {};
  var dtCnt    = {};
  var ctVals   = {};
  var ctCnt    = {};
  var allVals  = {};
  var alltVals = [];

  var keys = getKeys(dp);
   // console.log(keys);

   //sum all values in the object that aren't dateTimeTaken

  for (var i=0; i < dates.now.length; i++) {

     dtVals[i]   = {};
     dtCnt[i]    = {};
     ctVals[i]   = {};
     ctCnt[i]    = {};

     for (var k in keys){

        dtVals[i][keys[k]] = 0;
        dtCnt[i][keys[k]]  = 0;
        ctVals[i][keys[k]] = 0;
        ctCnt[i][keys[k]]  = 0;

        dp.forEach(function(d,j) {

          if (i==0){

            if (k==0){
            allVals[j] = {};
            alltVals[j] = moment(d.dateTimeTaken).format("YYYY-MM-DD HH:mm");
            };

            allVals[j][keys[k]]  = d[keys[k]];
            //console.log(keys.length,k);
            if (k==keys.length-1){
              allVals[j]['overall'] = sumobj(allVals[j]) / cntobj(allVals[j]);
            };

          };

          if (   (dates.m1d[i] <= d.dateTimeTaken && d.dateTimeTaken < dates.now[i])
              || (dates.m1d[i] <= d.dateTimeTaken &&                 ! dates.now[i]))
              { dtVals[i][keys[k]] += d[keys[k]];
                dtCnt[i][keys[k]]  += 1;
              };
          if (   (dates.m1w[i] <= d.dateTimeTaken && d.dateTimeTaken < dates.now[i])
              || (dates.m1w[i] <= d.dateTimeTaken &&                 ! dates.now[i]))
              { ctVals[i][keys[k]] += d[keys[k]];
                ctCnt[i][keys[k]]  += 1;
              };

            });
          //for Impulse we want weekly average based on 7 days
          if (avgDT){
            ctVals[i][keys[k]] = ctVals[i][keys[k]] / 7;
          }
          else {
            ctVals[i][keys[k]] = ctVals[i][keys[k]] / ctCnt[i][keys[k]];
          };
     }
     dtVals[i]['overall'] = sumobj(dtVals[i])  / cntobj(dtVals[i]);
     ctVals[i]['overall'] = sumobj(ctVals[i])  / cntobj(ctVals[i]);

  }

  keys.push('overall');

  //data for each entry
  dataEE = {};
  for (var k in keys){

    dataEE[keys[k]] = [];
    dataEE[keys[k]] = alltVals.map((t, i) => {
      return {
        t: t,
        y: Number(allVals[i][keys[k]].toFixed(2))
      };
    }).filter((i) => {return i.t > dates.now[0];});
  }

  //data for daily totals
  dataDT = {};
  for (var k in keys){

    dataDT[keys[k]] = [];
    dataDT[keys[k]] = dates.now.map((t, i) => {
      return {
        t: t,
        y: Number(dtVals[i][keys[k]].toFixed(2))
      };
    });
  }

  //data for weekly average
  dataWA = {};
  for (var k in keys){

    dataWA[keys[k]] = [];
    dataWA[keys[k]] = dates.now.map((t, i) => {
      return {
        t: t,
        y: Number(ctVals[i][keys[k]].toFixed(2))
      };
    });
  }

  return [dataEE, dataDT, dataWA];
}

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
      legend: {
        display: true,
        position: 'bottom'
      },
      title:{
        display: true,
        text: title
      },
      scales: {
        xAxes: [{
         // ticks:{display: false},
         // gridLines: {
         //           display:false
         //       },
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
          scaleLabel: {
            display: true,
            labelString: yTitle
          },
          ticks: {
            beginAtZero: true,

            userCallback: function(label, index, labels) {
              // when the floored value is the same as the value we have a whole number
              if (Math.floor(label) === label) {
                return label;
              }
            },
            max: yMax,
            stepSize: 1
            // console.log(ytickops);
          }
        }]
      },
    }
  });
}
