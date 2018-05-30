import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from 'chart.js';
import moment from 'moment';

import { Wellnesses } from '../../api/wellnesses.js';
import { Efforts }    from '../../api/efforts.js';
import { createChart, create2yAxisChart } from './createChart.js'
import {processMongo} from './processMongo.js'
import { collapseSection ,expandSection ,toggleSection } from '../components/changeSection.js'

// import ,{}
// import { export1 , export2 } from "module-name";

import './charts.html';

Template.charts.onCreated(function () {
    Session.set('showDE', false);
    Session.set('showDW', false);
});

Template.charts.helpers({
  showDE() {
    return Session.get('showDE');
  },
  showDW() {
    return Session.get('showDW');
  },
});

Chart.defaults.global.elements.line.borderWidth  = 1.5;
Chart.defaults.global.elements.line.tension      = 0.2;
Chart.defaults.global.elements.point.radius      = 2;
Chart.defaults.global.elements.point.hoverRadius = 2.5;


Template.charts.onRendered(function() {
  subWellness= Meteor.subscribe('wellnesses');
  subEfforts = Meteor.subscribe('efforts');
  this.autorun(() => {

    if (subWellness.ready() && subEfforts.ready()){

      // work out dates
      const sw = moment().subtract(15, 'days');
      const tr = moment().subtract(21, 'days');

      //get wellness dataframe
      var wdf = Wellnesses.find({dateTimeTaken : { $gte : tr.format()}}, {fields: { 'sleepQuality'   :1
                                                                                   ,'sleepLength'    :1
                                                                                   ,'mood'           :1
                                                                                   ,'energy'         :1
                                                                                   ,'stress'         :1
                                                                                   ,'upperSoreness'  :1
                                                                                   ,'lowBackSoreness':1
                                                                                   ,'lowerSoreness'  :1
                                                                                   ,'dateTimeTaken'  :1 },sort: {dateTimeTaken: 1}}).fetch();

      var edf = Efforts.find({dateTimeCompleted : { $gte : tr.format()}}, {fields: { 'effortImpulse'     :1
                                                                                    ,'effortRPE'         :1
                                                                                    ,'effortDuration'    :1
                                                                                    ,'dateTimeCompleted' :1 },sort: {dateTimeCompleted: 1}}).fetch();

      //cannot move this up as tr is need for data collection
      var dates = {now:[],m1d:[],m1w:[]};
      for(var i=0; i<=14; i++){
        dates.m1w[i] = tr.add(1, 'days').format("YYYY-MM-DD");
        dates.m1d[i] = sw.add(1, 'days').format("YYYY-MM-DD");
        dates.now[i] = moment(dates.m1d[i]).add(1, 'days'  ).format("YYYY-MM-DD");
      }

      // var xids = ;
      //process wellness data
      var w = processMongo(wdf,["dateTimeTaken", "_id"],dates,"dateTimeTaken",false);

      //wellness data every entry and wellness data weekly average
      wDataEE  = w[0];
      // wDataDT = w[1];
      wDataWA  = w[2];

      var e = processMongo(edf,["dateTimeCompleted", "_id"],dates,"dateTimeCompleted",true);

      //wellness data every entry and wellness data weekly average
      eDataEE = e[0];
      eDataDT = e[1];
      eDataWA = e[2];

      /*add 5% to the max value for impulses for charting purposes*/
      if (eDataDT['effortImpulse']) {
      var eMax = Math.ceil(Math.max.apply(Math,eDataDT['effortImpulse' ].map(function(o){return o.y;}))*1.05/100)*100;
      var dMax = Math.ceil(Math.max.apply(Math,eDataDT['effortDuration'].map(function(o){return o.y;}))*1.05/100)*100;
      }
      // console.log(eMax);

      var impulseVsWellnessCD = [ {data:eDataDT['effortImpulse'],borderColor:"#F7C700",backgroundColor:"#F7C700",fill:false,label:'Total Effort (Day)'   ,yAxisID: 'yLeft' }
                                 ,{data:wDataEE['overall'      ],borderColor:"#09D483",backgroundColor:"#09D483",fill:false,label:'Wellness (Day)'       ,yAxisID: 'yRight'}
                                 ,{data:eDataWA['effortImpulse'],borderColor:"#AE8A01",backgroundColor:"#8B6E01"           ,label:"Average Effort (Week)",yAxisID: 'yLeft' }
                                 ,{data:wDataWA['overall'      ],borderColor:"#06AD6A",backgroundColor:"#048852"           ,label:"Wellness (Week)"      ,yAxisID: 'yRight'}];

                          // (xValues,chartId,datasets,title,yLMax,yLTitle,yLStepSize,yRMax,yRTitle,yRStepSize)
      var impulseVsWellnessChart = create2yAxisChart(dates.now,"impulseVsWellness",impulseVsWellnessCD,"Effort vs Wellness",eMax,"Impulse (RPE * Duration)",null ,5.2,"Score",null);


      var impulseCD = [{data:eDataEE['effortImpulse'],label:"Effort (Session)"     ,borderColor:"#4A3900",backgroundColor:"#4A3900",fill: false},
                       {data:eDataDT['effortImpulse'],label:"Total Effort (Day)"   ,borderColor:"#F7C700",backgroundColor:"#F7C700",fill: false},
                       {data:eDataWA['effortImpulse'],label:"Average Effort (Week)",borderColor:"#AE8A01",backgroundColor:"#8B6E01" }];

      var impulseChart = createChart(dates.now,"impulseChart",impulseCD,"Effort",eMax,"Impulse (RPE * Duration)");

      var durationCD = [{data:eDataEE['effortDuration'],label:"Duration (Session)"     ,borderColor:"#1DF6C7",backgroundColor:"#1DF6C7",fill: false},
                        {data:eDataDT['effortDuration'],label:"Total Duration (Day)"   ,borderColor:"#00221B",backgroundColor:"#00221B",fill: false},
                        {data:eDataWA['effortDuration'],label:"Average Duration (Week)",borderColor:"#059A7E",backgroundColor:"#006F5B" }];

      var duartionChart = createChart(dates.now,"durationChart",durationCD,"Duration",dMax,"Minutes");

      var RPECD = [{data:eDataEE['effortRPE'],label:"RPE (Session)"     ,borderColor:"#EEFF5F",backgroundColor:"#EEFF5F",fill: false},
                   {data:eDataWA['effortRPE'],label:"Average RPE (Week)",borderColor:"#969F38",backgroundColor:"#6C7226" }];

      var RPEChart = createChart(dates.now,"RPEChart",RPECD,"Rate of Percieved Exertion (RPE)",10,"Rating");



      var wellnessCD = [ {data:wDataEE['overall'  ],borderColor:"#09D483",backgroundColor:"#09D483",fill:false,label:'Wellness (Day)' },
                         {data:wDataEE['sleep'    ],borderColor:"#59AFFE",backgroundColor:"#59AFFE",fill:false,label:'Sleep (Day)'    },
                         {data:wDataEE['physical' ],borderColor:"#FC5B6B",backgroundColor:"#FC5B6B",fill:false,label:'Physical (Day)' },
                         {data:wDataEE['mental'   ],borderColor:"#F3A319",backgroundColor:"#F3A319",fill:false,label:'Mental (Day)'   },
                         {data:wDataWA['overall'  ],borderColor:"#06AD6A",backgroundColor:"#048852"           ,label:"Wellness (Week)"}];//,borderColor: "#e8c3b9",backgroundColor: "#e8c3b9"


      var wellnessChart = createChart(dates.now,"wellnessChart",wellnessCD,"Wellness",5.2,"Score");


      var mentalCD = [ {data:wDataEE['mood'  ],borderColor:"#F3A319",backgroundColor:"#F3A319",fill:false,label:"Mood (Day)"   },
                       {data:wDataEE['stress'],borderColor:"#482F01",backgroundColor:"#482F01",fill:false,label:"Stress (Day)" },
                       {data:wDataWA['mental'],borderColor:"#AA720D",backgroundColor:"#885B08"           ,label:'Mental (Week)'} ];

      var mentalChart = createChart(dates.now,"mentalChart",mentalCD,"Mental",5.4,"Score");


      // var datasets2 = [ {data:wDataEE['upperSoreness'  ],label:"Upper Body" ,borderColor: "#FF9500",backgroundColor: "#FF9500",fill: false},
      //                   {data:wDataEE['lowBackSoreness'],label:"Low Back"   ,borderColor: "#4CD964",backgroundColor: "#4CD964",fill: false},
      //                   {data:wDataEE['lowerSoreness'  ],label:"Lower Body" ,borderColor: "#33C3F0",backgroundColor: "#33C3F0",fill: false},
      //                   {data:wDataWA['overall'],label:"Previous Week (Average)"}
      //                 ];

      var sleepCD =  [  {data:wDataEE['sleepQuality'],borderColor:"#33C3F0",backgroundColor:"#33C3F0",fill:false,label:'Quality (Day)',yAxisID: 'yLeft' }
                       ,{data:wDataEE['sleepLength' ],borderColor:"#0B2336",backgroundColor:"#0B2336",fill:false,label:'Length (Day)' ,yAxisID: 'yRight'}
                       ,{data:wDataWA['sleep'       ],borderColor:"#3673A8",backgroundColor:"#27577F"           ,label:"Sleep (Week)" ,yAxisID: 'yLeft' }];

                          // (xValues,chartId,datasets,title,yLMax,yLTitle,yLStepSize,yRMax,yRTitle,yRStepSize)
      var sleepChart = create2yAxisChart(dates.now,"sleepChart",sleepCD,"Sleep",5.2,"Score",1,14,"Hours",);


      var physicalCD = [{data:wDataEE['upperSoreness'  ],borderColor:"#370D13",backgroundColor:"#370D13",fill:false,label:"Upper Body (Day)"},
                        {data:wDataEE['lowBackSoreness'],borderColor:"#802A34",backgroundColor:"#802A34",fill:false,label:"Low Back (Day)"  },
                        {data:wDataEE['lowerSoreness'  ],borderColor:"#D14A58",backgroundColor:"#fff",fill:false,label:"Lower Body (Day)"},
                        {data:wDataEE['energy'         ],borderColor:"#FC5B6B",backgroundColor:"#FC5B6B",fill:false,label:"Energy (Day)"    },
                        {data:wDataWA['physical'       ],borderColor:"#A83A45",backgroundColor:"#5A1B23"           ,label:'Physical (Week)' } ];

                          // (xValues,chartId,datasets,title,yLMax,yLTitle,yLStepSize,yRMax,yRTitle,yRStepSize)
      var physicalChart = createChart(dates.now,"physicalChart",physicalCD,"Physical",5.2,"Score");

    }
  });
});


Template.charts.events({

  'click #showDE'(event,template) {
       event.preventDefault();
       Session.set('showDE', true);
       toggleSection(template.find("[class='smartToggleDE']"));
     },

  'click #hideDE'(event,template) {
       event.preventDefault();
       Session.set('showDE', false);
       toggleSection(template.find("[class='smartToggleDE']"));
     },

  'click #showDW'(event,template) {
       event.preventDefault();
       Session.set('showDW', true);
       toggleSection(template.find("[class='smartToggleDW']"));
     },

  'click #hideDW'(event,template) {
       event.preventDefault();
       Session.set('showDW', false);
       toggleSection(template.find("[class='smartToggleDW']"));
     },
});
