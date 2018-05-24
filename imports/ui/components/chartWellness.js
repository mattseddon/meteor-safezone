import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from 'chart.js';
import moment from 'moment';

import { Wellnesses } from '../../api/wellnesses.js';

import './chartWellness.html';

// Template.chartWellness.onCreated(function bodyOnCreated() {
//   this.state = new ReactiveDict();
//   Meteor.subscribe('wellnesses');
// });

Template.chartWellness.onRendered(function() {
  sub =   Meteor.subscribe('wellnesses');
   this.autorun(() => {

     if (sub.ready()){
       var ctx = document.getElementById("wellnessChart");
       //start of week and time range
       const sw = moment().subtract(15, 'days');
       const tr = moment().subtract(21, 'days');
       var dp = Wellnesses.find({dateTimeTaken : { $gte : tr.format()}}, {fields: { 'sleepQuality'   :1
                                                                                   ,'mood'           :1
                                                                                   ,'energy'         :1
                                                                                   ,'stress'         :1
                                                                                   ,'upperSoreness'  :1
                                                                                   ,'lowBackSoreness':1
                                                                                   ,'lowerSoreness'  :1
                                                                                   ,'dateTimeTaken'  :1 },sort: {dateTimeTaken: 1}}).fetch();

       var xids = ["dateTimeTaken", "_id"];

       function getKeys(d){
         var uniqueKeys = Object.keys(d.reduce(function(result, obj) {
           return Object.assign(result, obj);
         }, {}))
         return uniqueKeys.filter(k => !xids.includes(k));
       }

        function sumobj( obj ) {
          var sum = 0;
          for( var el in obj ) {
            if (!(xids.includes(el))) {
              sum += obj[el];
            }
          }
          return sum;
        }

        function cntobj( obj ) {
          var count = 0;
          for( var el in obj ) {
            if (!(xids.includes(el))) {
              count += 1;
            }
          }
          return count;
        }



       var dates = {now:[],m1d:[],m1w:[]};
       for(var i=0; i<=14; i++){
        dates.m1w[i] = tr.add(1, 'days').format("YYYY-MM-DD");
        dates.m1d[i] = sw.add(1, 'days').format("YYYY-MM-DD");
        dates.now[i] = moment(dates.m1d[i]).add(1, 'days'  ).format("YYYY-MM-DD");
       }
       // console.log(dates);

       function processMongo(){

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

         for (var name in keys){
              dtVals[i][keys[name]] = 0;
              dtCnt[i][keys[name]]  = 0;
              ctVals[i][keys[name]] = 0;
              ctCnt[i][keys[name]]  = 0;

              dp.forEach(function(d,j) {

                if (i==0){

                  if (name==0){
                  allVals[j] = {};
                  alltVals[j] = moment(d.dateTimeTaken).format("YYYY-MM-DD HH:mm");
                  };

                  allVals[j][keys[name]]  = d[keys[name]];
                  console.log(keys.length,name);
                  if (name==keys.length-1){
                    allVals[j]['overall' ] = sumobj(allVals[j]) / cntobj(allVals[j]);
                  };

                };

                // console.log(d);
              if (   (dates.m1d[i] <= d.dateTimeTaken && d.dateTimeTaken < dates.now[i])
                  || (dates.m1d[i] <= d.dateTimeTaken &&                 ! dates.now[i]))
                  { dtVals[i][keys[name]] += d[keys[name]];
                    dtCnt[i][keys[name]]  += 1;
                  };
              if (   (dates.m1w[i] <= d.dateTimeTaken && d.dateTimeTaken < dates.now[i])
                  || (dates.m1w[i] <= d.dateTimeTaken &&                 ! dates.now[i]))
                  { ctVals[i][keys[name]] += d[keys[name]];
                    ctCnt[i][keys[name]]  += 1;
                  };
                  //get all observations for each variable
                  // alltVals[j][keys[name]] =
                });
              //console.log(keys[name],ctVals[i][keys[name]],ctCnt[i][keys[name]]);
              ctVals[i][keys[name]] = ctVals[i][keys[name]] / ctCnt[i][keys[name]];
         }
         ctVals[i]['overall'] = sumobj(ctVals[i])  / cntobj(ctVals[i]);
         // alltVals[i]['overall'] = alltVals[i]['energy'];
       }

       // console.log(ctVals);

       //
       //
       // for (var i=0; i < dp.length; i++) {
       //     allVals[i] = sumobj(dp[i]) / cntobj(dp[i]);
       //     alltVals[i] = moment(dp[i].dateTimeTaken).format("YYYY-MM-DD HH:mm");
       // }
       console.log(alltVals);
    const data = alltVals.map((t, i) => {
      return {
        t: t,
        y: allVals[i]['overall']
      };
    }).filter((i) => {return i.t > dates.now[0];});

    // console.log(dtVals,ctVals,dates);
    // const datadt = dates.now.map((t, i) => {
    //   return {
    //     t: t,
    //     y: dtVals[i]
    //   };
    // });

    const datact = dates.now.map((t, i) => {
      return {
        t: t,
        y: ctVals[i]['overall']
      };
    });


    dataf = {};
    for (var name in keys){
      if (!(xids.includes(keys[name]))) {
        dataf[keys[name]] = [];
        dataf[keys[name]] = dates.now.map((t, i) => {
          return {
            t: t,
            y: ctVals[i][keys[name]]
          };
        });
      }
    }


    return [data, datact,dataf];
  }

  var x = processMongo();
  console.log (x);
data = x[0];
datact = x[1];
dataf = x[2];
         // To get value from the array
         // function getValue(name, month){
         // 	var value = 0;
         // 	data.forEach(function(d){
         // 		if(d.name == name && d.month == month){
         // 			value = d.count;
         // 		}
         // 	});
         // 	return value;
         // }


            var wellnessChart = new Chart(ctx, {
           type: 'line',

       data: {
         // labels: impulses.date,
         labels: dates.now,
         datasets: [{data:data,label:"Individual Surveys"    ,borderColor: "#33C3F0",backgroundColor: "#33C3F0",fill: false},
                     {data:dataf['energy'],label:"Energy Previous Week (Average)"   ,borderColor: "#4CD964",backgroundColor: "#4CD964",fill: false},
                    {data:datact,label:"Previous Week (Average)" //,borderColor: "#e8c3b9",backgroundColor: "#e8c3b9"
                    }]

       },
       options: {
         legend: {
           display: true,
           position: 'bottom'}
           ,
        title:{
          display: true,
          text: "Wellness Tracker"
        },
         scales: {
           xAxes: [{
             // ticks:{display: false},
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
               labelString: 'Overall Wellness Score'
             },
             ticks: {
               beginAtZero: true,
               stepSize: 1,
               max:5.4,
               userCallback: function(label, index, labels) {
                  // when the floored value is the same as the value we have a whole number
                  if (Math.floor(label) === label) {
                    return label;
                  }
                }
             }
           }]
         },
       }
         });
       // });

   }
   });
 });
