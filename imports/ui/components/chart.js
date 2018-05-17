import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from 'chart.js';
import moment from 'moment';

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
       console.log(dates);
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

       // const arr = {t:[],y:[]};
       // dp.forEach(function (d,i) {
       //   arr.t[i] = d.dateTimeCompleted;
       //   arr.y[i] = d.effortImpulse;
       // });
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
       console.log(dates.now);
       // console.log(data1);

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
    // console.log(datact);
      //now we want a daily total
    //   var start = new Date(year, month, day);
    //   var end = new Date(year, month, day);
    //
    //   //Invoices with a 'date' field between the 'start' and 'end' dates
    //   var cursor = CollectionName.find({ date : { $gte : start, $lt: end });
    //   var taxTotal = 0;
    //   var results = cursor.forEach(function(doc) {
    //     //Adds the tax field of each document to the total
    //   taxTotal += doc.tax;
    // });


       //   console.log(retVals);
         // console.log(dp1);
         // var data = [{"month":"January","name":"Alex","count":10},{"month":"February","name":"Alex","count":20},{"month":"February","name":"John","count":30},{"month":"February","name":"Mark","count":40},{"month":"March","name":"Alex","count":10},{"month":"March","name":"John","count":20}];
         //
         // // TO FIND UNIQUE ARRAY
         // var months = data.map(function(t){ return t.month});
         // uniqueMonths = months.filter(function(item, pos) {
         //     return months.indexOf(item) == pos;
         // });
         // console.log('UNIQUE MONTHS:- '+uniqueMonths);
         //
         // var names = data.map(function(t){ return t.name});
         // uniqueNames = names.filter(function(item, pos) {
         //     return names.indexOf(item) == pos;
         // });
         // console.log('UNIQUE NAMES:- '+uniqueNames);
         // var countArr = {};
         // uniqueNames.forEach(function(d){
         // 	var arr = [];
         // 	uniqueMonths.forEach(function(k){
         // 		arr.push(getValue(d,k));
         // 	});
         // 	countArr[d] = arr;
         // });
         // console.log('COUNT ARRAY:- '+JSON.stringify(countArr));

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

         // console.log(value);
         // console.log();

            var myChart = new Chart(ctx, {
           type: 'line',

       data: {
         // labels: impulses.date,
         labels: dates.now,
         datasets: [{data:data1,label:"Individual Session"    ,borderColor: "#33C3F0",backgroundColor: "#33C3F0",fill: false},
                    {data:datadt,label:"Previous Day (Total)"   ,borderColor: "#4CD964",backgroundColor: "#4CD964",fill: false},
                    {data:datact,label:"Previous Week (Average)" //,borderColor: "#e8c3b9",backgroundColor: "#e8c3b9"
                    }]

         // datasets: [{
         //     data: [86,114,106,106,107,111,133,221,783,2478],
         //     label: "Africa",
         //     borderColor: "#3e95cd",
         //     fill: false
         //   }, {
         //     data: [282,350,411,502,635,809,947,1402,3700,5267],
         //     label: "Asia",
         //     borderColor: "#8e5ea2",
         //     fill: false
         //   }, {
         //     data: [168,170,178,190,203,276,408,547,675,734],
         //     label: "Europe",
         //     borderColor: "#3cba9f",
         //     fill: false
         //   }, {
         //     data: [40,20,10,16,24,38,74,167,508,784],
         //     label: "Latin America",
         //     borderColor: "#e8c3b9",
         //     fill: false
         //   }, {
         //     data: [6,3,2,2,7,26,82,172,312,433],
         //     label: "North America",
         //     borderColor: "#c45850",
         //     fill: false
         //   }
         // ]
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
