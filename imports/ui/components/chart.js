import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from 'chart.js';
import moment from 'moment';

import { Impulses } from '../../api/impulses.js';

import './chart.html';

Template.chart.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('impulses');
});

Template.chart.onRendered(function() {
  sub =   Meteor.subscribe('impulses');
   this.autorun(() => {

     if (sub.ready()){
       var ctx = document.getElementById("myChart");
       var dp = Impulses.find({}, {fields: {'sessionImpulse':1,'dateTimeCompleted':1}}).fetch();
       // var data = Impulses.find().fetch();
       // console.log(dp);
       var retVal = 0;
       var retVals = [];
       var tVals = [];
       for (var i=0; i < dp.length; i++) {
           retVals[i] = dp[i].sessionImpulse;
           tVals[i] = dp[i].dateTimeCompleted;
       }

       // console.log(retVals);
       const data = retVals.map((y, i) => {
         return {
           t: tVals[i],
           y: y
         };
       });
       console.log(data);
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
         // labels: retVals,
         datasets: [{data:data}]
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
         scales: {
           xAxes: [{
             type: 'time',
             time: {
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
         },
       }
         });
       // });

   }
   });
 });
