import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from 'chart.js';
import moment from 'moment';
//import { processMongo } from './chartWellness.js'

import { Efforts } from '../../api/efforts.js';

import './chart.html';

Template.chart.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('efforts');
});

Template.chart.onRendered(function() {
  sub =   Meteor.subscribe('efforts');
   this.autorun(() => {

     if (sub.ready()){
       var ctx = document.getElementById("myChart");
       //start of week and time range
       const sw = moment().subtract(8, 'days');
       const tr = moment().subtract(14, 'days');
       var dp = Efforts.find({dateTimeCompleted : { $gte : tr.format()}}, {fields: {'effortImpulse':1,'dateTimeCompleted':1},sort: {dateTimeCompleted: 1}}).fetch();
       // var dp = cur;
       //this will give us all sessions

       var dates = {now:[],m1d:[],m1w:[]};
       for(var i=0; i<=7; i++){
        dates.m1w[i] = tr.add(1, 'days').format("YYYY-MM-DD");
        dates.m1d[i] = sw.add(1, 'days').format("YYYY-MM-DD");
        dates.now[i] = moment(dates.m1d[i]).add(1, 'days'  ).format("YYYY-MM-DD");
       }
       // console.log(dates);
       var dtVals = [];
       var ctVals = [];

       for (var i=0; i < dates.now.length; i++) {
            dtVals[i] = 0;
            ctVals[i] = 0;
            dp.forEach(function(d) {
            if (   (dates.m1d[i] <= d.dateTimeCompleted && d.dateTimeCompleted < dates.now[i])
                || (dates.m1d[i] <= d.dateTimeCompleted &&                     ! dates.now[i])) { dtVals[i] += d.effortImpulse};
            if (   (dates.m1w[i] <= d.dateTimeCompleted && d.dateTimeCompleted < dates.now[i])
                || (dates.m1w[i] <= d.dateTimeCompleted &&                     ! dates.now[i])) { ctVals[i] += d.effortImpulse};
          });
          ctVals[i] = ctVals[i] / 7;
        }

       allVals=[];
       alltVals=[];

       for (var i=0; i < dp.length; i++) {
           allVals[i] = dp[i].effortImpulse;
           alltVals[i] = moment(dp[i].dateTimeCompleted).format("YYYY-MM-DD HH:mm");
       }
       var data = alltVals.map((t, i) => {
         return {
           t: t,
           y: allVals[i]
         };
       });


   const data1 = data.filter((i) => {return i.t > dates.now[0];});


    // console.log(dtVals,ctVals,dates);
    const datadt = dates.now.map((t, i) => {
      return {
        t: t,
        y: dtVals[i]
      };
    });
    const datact = dates.now.map((t, i) => {
      return {
        t: t,
        y: ctVals[i]
      };
    });

         // To get value from the array
         function getValue(name, month){
         	var value = 0;
         	data.forEach(function(d){
         		if(d.name == name && d.month == month){
         			value = d.count;
         		}
         	});
         	return value;
         }


            var myChart = new Chart(ctx, {
           type: 'line',

       data: {
         // labels: impulses.date,
         labels: dates.now,
         datasets: [{data:data1,label:"Individual Session"    ,borderColor: "#33C3F0",backgroundColor: "#33C3F0",fill: false},
                    {data:datadt,label:"Previous Day (Total)"   ,borderColor: "#4CD964",backgroundColor: "#4CD964",fill: false},
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
          text: "Effort Tracker"
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
               labelString: 'Impulse (RPE * Duration)'
             },
             ticks: {
               beginAtZero: true
             }
           }]
         },
       }
         });
       // });

   }
   });
 });
