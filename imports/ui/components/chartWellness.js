import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from 'chart.js';
import moment from 'moment';

import { Wellnesses } from '../../api/wellnesses.js';
import { processMongo , createChart } from './createChart.js'
// import ,{}
// import { export1 , export2 } from "module-name";

import './chartWellness.html';

// Template.chartWellness.onCreated(function bodyOnCreated() {
//   this.state = new ReactiveDict();
//   Meteor.subscribe('wellnesses');
// });

// Meteor.subscribe('wellnesses');

 // const sw = moment().subtract(15, 'days');
 // const tr = moment().subtract(21, 'days');



Template.chartWellness.onRendered(function() {
  sub =   Meteor.subscribe('wellnesses');
  this.autorun(() => {

    if (sub.ready()){

      const sw = moment().subtract(22, 'days');
      const tr = moment().subtract(28, 'days');
      //start of week and time range
      var dp = Wellnesses.find({dateTimeTaken : { $gte : tr.format()}}, {fields: { 'sleepQuality'   :1
                                                                                  ,'mood'           :1
                                                                                  ,'energy'         :1
                                                                                  ,'stress'         :1
                                                                                  ,'upperSoreness'  :1
                                                                                  ,'lowBackSoreness':1
                                                                                  ,'lowerSoreness'  :1
                                                                                  ,'dateTimeTaken'  :1 },sort: {dateTimeTaken: 1}}).fetch();
   console.log(dp);

    var xids = ["dateTimeTaken", "_id"];
     //I think that we need the dates inside the function because
     //they have to be manipulated differently for different circumstances
     //need an extra data of time period now which will map wellness to the previous day and impulse to the subsequent day
     //NOT REQUIRED
      var dates = {now:[],m1d:[],m1w:[]};
      for(var i=0; i<=21; i++){
        dates.m1w[i] = tr.add(1, 'days').format("YYYY-MM-DD");
        dates.m1d[i] = sw.add(1, 'days').format("YYYY-MM-DD");
        dates.now[i] = moment(dates.m1d[i]).add(1, 'days'  ).format("YYYY-MM-DD");
      }

      var x = processMongo(dp,xids,dates,false);
  // console.log (x);
      data   = x[0];
      datact = x[1];
      dataf  = x[2];
// dates = x[3];
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

var datasets = [ {data:data['overall'],label:"Individual Survey (Average)"    ,borderColor: "#33C3F0",backgroundColor: "#33C3F0",fill: false},
                 // {data:dataf['energy'],label:"Energy Previous Week (Average)"   ,borderColor: "#4CD964",backgroundColor: "#4CD964",fill: false},
                 {data:dataf['overall'],label:"Previous Week (Average)" //,borderColor: "#e8c3b9",backgroundColor: "#e8c3b9"
               }];
//var chartId = ;
//var title =  "Wellness Tracker";
// var yMax = 5.4;
// console.log(yMax);
      var x0 = createChart(dates.now,"wellnessChart",datasets,"Wellness Tracker",5.4,"Score");


      var datasets1 = [ {data:data['energy'  ],label:"Energy" ,borderColor: "#FF9500",backgroundColor: "#FF9500",fill: false},//borderDash:[5, 5],
                        {data:data['mood'    ],label:"Mood"   ,borderColor: "#4CD964",backgroundColor: "#4CD964",fill: false},//borderDash:[15, 15],
                        {data:data['stress'  ],label:"Stress" ,borderColor: "#33C3F0",backgroundColor: "#33C3F0",fill: false},//borderDash:[10, 10],
                        {data:dataf['overall'],label:"Previous Week (Average)"}
                      ];
      var x1 = createChart(dates.now,"wellnessChart1",datasets1,"All entries - wellbeing",5.4,"Score");


      var datasets2 = [ {data:data['upperSoreness'  ],label:"Upper Body" ,borderColor: "#FF9500",backgroundColor: "#FF9500",fill: false},
                        {data:data['lowBackSoreness'],label:"Low Back"   ,borderColor: "#4CD964",backgroundColor: "#4CD964",fill: false},
                        {data:data['lowerSoreness'  ],label:"Lower Body" ,borderColor: "#33C3F0",backgroundColor: "#33C3F0",fill: false},
                        {data:dataf['overall'],label:"Previous Week (Average)"}
                      ];


      var x2 = createChart(dates.now,"wellnessChart2",datasets2,"All entries - soreness",5.4,"Score");



    }
  });
});