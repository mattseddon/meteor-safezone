import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from 'chart.js';
import moment from 'moment';

import { Wellnesses } from '../../api/wellnesses.js';
import { Efforts }    from '../../api/efforts.js';
import { createLineChart, create2yAxisLineChart,createRadarChart } from './createChart.js'
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
Chart.defaults.global.animation.duration         = 2000;
Chart.defaults.global.animation.easing = 'easeInCubic';

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
      self.dates = {now:[],m1d:[],m1w:[]};
      for(var i=0; i<=14; i++){
        self.dates.m1w[i] = tr.add(1, 'days').format("YYYY-MM-DD");
        self.dates.m1d[i] = sw.add(1, 'days').format("YYYY-MM-DD");
        self.dates.now[i] = moment(dates.m1d[i]).add(1, 'days'  ).format("YYYY-MM-DD");
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
      self.eMax = Math.ceil(Math.max.apply(Math,eDataDT['effortImpulse' ].map(function(o){return o.y;}))*1.05/100)*100;
      self.dMax = Math.ceil(Math.max.apply(Math,eDataDT['effortDuration'].map(function(o){return o.y;}))*1.05/100)*100;
      }
      // console.log(eMax);

      self.durationLD = [{data:eDataEE['effortDuration'],label:"Duration (Session)"     ,borderColor:"#1DF6C7",backgroundColor:"#1DF6C7",fill:false,lineTension:0                   },
                         {data:eDataDT['effortDuration'],label:"Total Duration (Day)"   ,borderColor:"#00221B",backgroundColor:"#00221B",fill:false                   },
                         {data:eDataWA['effortDuration'],label:"Average Duration (Week)",borderColor:"#059A7E",backgroundColor:"#059A7E",fill:false,borderDash: [10,5]} ];

      self.durationLine = createLineChart(dates.now,"durationLine",durationLD,"Duration",dMax,"Minutes");


      self.RPELD = [{data:eDataEE['effortRPE'],label:"RPE (Session)"     ,borderColor:"#C0C0C0",backgroundColor:"#C0C0C0",fill: false,lineTension:0},
                   {data:eDataWA['effortRPE'],label:"Average RPE (Week)" ,borderColor:"#433E33",backgroundColor:"#433E33",fill: false,borderDash: [10,5]}];

      self.RPELine = createLineChart(dates.now,"RPELine",RPELD,"Rate of Percieved Exertion (RPE)",10,"Rating");


      self.mentalLD = [{data:wDataEE['mood'  ],borderColor:"#F3A319",backgroundColor:"#F3A319",fill:false,label:"Mood (Day)"                      },
                       {data:wDataEE['stress'],borderColor:"#482F01",backgroundColor:"#482F01",fill:false,label:"Stress (Day)"                    },
                       {data:wDataWA['mental'],borderColor:"#AA720D",backgroundColor:"#AA720D",fill:false,label:'Mental (Week)',borderDash: [10,5]} ];

      self.mentalLine = createLineChart(dates.now,"mentalLine",mentalLD,"Mental",5.4,"Score");


      self.sleepLD =  [ {data:wDataEE['sleepQuality'],borderColor:"#33C3F0",backgroundColor:"#33C3F0",fill:false,label:'Quality (Day)',yAxisID: 'yLeft'                    }
                       ,{data:wDataEE['sleepLength' ],borderColor:"#0B2336",backgroundColor:"#0B2336",fill:false,label:'Length (Day)' ,yAxisID: 'yRight'                   }
                       ,{data:wDataWA['sleep'       ],borderColor:"#3673A8",backgroundColor:"#3673A8",fill:false,label:"Sleep (Week)" ,yAxisID: 'yLeft' ,borderDash: [10,5]}];

                          // (xValues,chartId,datasets,title,yLMax,yLTitle,yLStepSize,yRMax,yRTitle,yRStepSize)
      self.sleepLine = create2yAxisLineChart(dates.now,"sleepLine",sleepLD,"Sleep",5.2,"Score",1,14,"Hours",);


      self.physicalLD = [{data:wDataEE['upperSoreness'  ],borderColor:"#370D13",backgroundColor:"#370D13",fill:false,label:"Upper Body (Day)"},
                         {data:wDataEE['lowBackSoreness'],borderColor:"#802A34",backgroundColor:"#802A34",fill:false,label:"Low Back (Day)"  },
                         {data:wDataEE['lowerSoreness'  ],borderColor:"#D14A58",backgroundColor:"#D14A58",fill:false,label:"Lower Body (Day)"},
                         {data:wDataEE['energy'         ],borderColor:"#F3A319",backgroundColor:"#F3A319",fill:false,label:"Energy (Day)"    },
                         {data:wDataWA['physical'       ],borderColor:"#A83A45",backgroundColor:"#A83A45",fill:false,label:'Physical (Week)' ,borderDash: [10,5]} ];

                          // (xValues,chartId,datasets,title,yLMax,yLTitle,yLStepSize,yRMax,yRTitle,yRStepSize)
      self.physicalLine = createLineChart(dates.now,"physicalLine",physicalLD,"Physical",5.2,"Score");

      //these charts need to be created last so that they will render on screen
      self.impulseLD = [{data:eDataEE['effortImpulse'],label:"Effort (Session)"     ,borderColor:"#AE8A01",backgroundColor:"#AE8A01",fill: false},
                        {data:eDataDT['effortImpulse'],label:"Total Effort (Day)"   ,borderColor:"#F7C700",backgroundColor:"#F7C700",fill: false},
                        {data:eDataWA['effortImpulse'],label:"Average Effort (Week)",borderColor:"#4A3900",backgroundColor:"#4A3900",fill: false,borderDash: [10,5]}];


      self.impulseLine = createLineChart(dates.now,"impulseLine",impulseLD,"Effort",eMax,"Impulse (RPE * Duration)");


      self.wellnessLD = [ //{data:wDataEE['overall' ],borderColor:"#09D483",backgroundColor:"#09D483",fill:false,label:'Wellness (Day)'                    },
                         {data:wDataEE['sleep'    ],borderColor:"#59AFFE",backgroundColor:"#59AFFE",fill:false,label:'Sleep (Day)'                       },
                         {data:wDataEE['physical' ],borderColor:"#FC5B6B",backgroundColor:"#FC5B6B",fill:false,label:'Physical (Day)'                    },
                         {data:wDataEE['mental'   ],borderColor:"#F3A319",backgroundColor:"#F3A319",fill:false,label:'Mental (Day)'                      },
                         {data:wDataWA['overall'  ],borderColor:"#06AD6A",backgroundColor:"#06AD6A",fill:false,label:"Wellness (Week)",borderDash: [10,5]}];//,borderColor: "#e8c3b9",backgroundColor: "#e8c3b9"

      self.wellnessLine = createLineChart(dates.now,"wellnessLine",wellnessLD,"Wellness",5.2,"Score");

      self.impulseVsWellnessLD = [{data:eDataDT['effortImpulse'],borderColor:"#F7C700",backgroundColor:"#F7C700",fill:false,label:'Total Effort (Day)'   ,yAxisID: 'yLeft' },
                                  {data:wDataEE['overall'      ],borderColor:"#09D483",backgroundColor:"#09D483",fill:false,label:'Wellness (Day)'       ,yAxisID: 'yRight'},
                                  {data:eDataWA['effortImpulse'],borderColor:"#4A3900",backgroundColor:"#4A3900",fill:false,label:"Average Effort (Week)",yAxisID: 'yLeft' ,borderDash: [10,5]},
                                  {data:wDataWA['overall'      ],borderColor:"#06AD6A",backgroundColor:"#06AD6A",fill:false,label:"Wellness (Week)"      ,yAxisID: 'yRight',borderDash: [10,5]} ];

                          // (xValues,chartId,datasets,title,yLMax,yLTitle,yLStepSize,yRMax,yRTitle,yRStepSize)
      self.impulseVsWellnessLine = create2yAxisLineChart(dates.now,"impulseVsWellness",impulseVsWellnessLD,"Effort vs Wellness",eMax,"Impulse (RPE * Duration)",null ,5.2,"Score",null);


      self.wellnessRD = [{label: "Current",
                      backgroundColor: "#33C3F0",
                      borderColor: "#33C3F0",
                      fill: false,
                      radius: 3,
                      pointRadius: 3,
                      pointBorderWidth: 3,
                      pointBackgroundColor: "#33C3F0",
                      pointBorderColor: "#33C3F0",
                      pointHoverRadius: 3.5,
                      data: [ wDataEE['overall' ][wDataEE['overall' ].length-1]["y"],
                              wDataEE['physical'][wDataEE['physical'].length-1]["y"],
                              wDataEE['sleep'   ][wDataEE['sleep'   ].length-1]["y"],
                              wDataEE['mental'  ][wDataEE['mental'  ].length-1]["y"] ]
                    }, {
                      label: "Average (Week)",
                      backgroundColor: "#433E33",
                      borderColor: "#433E33",
                      fill: false,
                      radius: 3,
                      pointRadius: 3,
                      pointBorderWidth: 3,
                      pointBackgroundColor: "#433E33",
                      pointBorderColor: "#433E33",
                      pointHoverRadius: 3.5,
                      borderDash: [10,5],
                      data: [ wDataWA['overall' ][wDataWA['overall' ].length-1]["y"],
                              wDataWA['physical'][wDataWA['physical'].length-1]["y"],
                              wDataWA['sleep'   ][wDataWA['sleep'   ].length-1]["y"],
                              wDataWA['mental'  ][wDataWA['mental'  ].length-1]["y"] ]
                    }, {
                      label: "Wellness (Week)",
                      backgroundColor: "#06AD6A",
                      borderColor: "#06AD6A",
                      fill: false,
                      radius: 2,
                      pointRadius: 0,
                      pointBorderWidth: 0,
                      pointBackgroundColor: "#06AD6A",
                      pointBorderColor: "#06AD6A",
                      pointHoverRadius: 0,
                      borderDash: [10,5],
                      data: [ wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                              wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                              wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                              wDataWA['overall' ][wDataWA['overall'].length-1]["y"] ]
                    }];

      self.wellnessRadar = createRadarChart(['Wellness',
      'Physical','Sleep','Mental'],"wellnessRadar",wellnessRD);



            self.physicalRD = [{label: "Current",
                            backgroundColor: "#33C3F0",
                            borderColor: "#33C3F0",
                            fill: false,
                            radius: 2,
                            pointRadius: 2,
                            pointBorderWidth: 3,
                            pointBackgroundColor: "#33C3F0",
                            pointBorderColor: "#33C3F0",
                            pointHoverRadius: 2.5,
                            data: [ //wDataEE['physical'       ][wDataEE['physical'        ].length-1]["y"],
                                    wDataEE['upperSoreness'  ][wDataEE['upperSoreness'   ].length-1]["y"],
                                    wDataEE['lowBackSoreness'][wDataEE['lowBackSoreness' ].length-1]["y"],
                                    wDataEE['lowerSoreness'  ][wDataEE['lowerSoreness'   ].length-1]["y"],
                                    // wDataEE['energy'         ][wDataEE['energy'          ].length-1]["y"],
                                    wDataEE['mental'         ][wDataEE['mental'          ].length-1]["y"],
                                    wDataEE['mood'           ][wDataEE['mood'            ].length-1]["y"],
                                    wDataEE['stress'         ][wDataEE['stress'          ].length-1]["y"],
                                    // wDataEE['sleep'          ][wDataEE['sleep'           ].length-1]["y"],
                                    wDataEE['sleepQuality'   ][wDataEE['sleepQuality'    ].length-1]["y"],
                  Math.max(Math.min(wDataEE['sleepLength'    ][wDataEE['sleepLength'     ].length-1]["y"]-4,5),0) ]
                          }, {
                            label: "Average (Week)",
                            backgroundColor: "#433E33",
                            borderColor: "#433E33",
                            fill: false,
                            radius: 2,
                            pointRadius: 2,
                            pointBorderWidth: 3,
                            pointBackgroundColor: "#433E33",
                            pointBorderColor: "#433E33",
                            pointHoverRadius: 2.5,
                            borderDash: [10,5],
                            data: [ //wDataWA['physical'       ][wDataWA['physical'        ].length-1]["y"],
                                    wDataWA['upperSoreness'  ][wDataWA['upperSoreness'   ].length-1]["y"],
                                    wDataWA['lowBackSoreness'][wDataWA['lowBackSoreness' ].length-1]["y"],
                                    wDataWA['lowerSoreness'  ][wDataWA['lowerSoreness'   ].length-1]["y"],
                                    wDataWA['energy'         ][wDataWA['energy'          ].length-1]["y"],
                                    //wDataWA['mental'         ][wDataWA['mental'          ].length-1]["y"],
                                    wDataWA['mood'           ][wDataWA['mood'            ].length-1]["y"],
                                    wDataWA['stress'         ][wDataWA['stress'          ].length-1]["y"],
                                    // wDataWA['sleep'          ][wDataWA['sleep'           ].length-1]["y"],
                                    wDataWA['sleepQuality'   ][wDataWA['sleepQuality'    ].length-1]["y"],
                  Math.max(Math.min(wDataWA['sleepLength'    ][wDataWA['sleepLength'     ].length-1]["y"]-4,5),0) ]
                          }, {
                            label: "Wellness (Day)",
                            backgroundColor: "#09D483",
                            borderColor: "#09D483",
                            fill: false,
                            radius: 0,
                            pointRadius: 0,
                            pointBorderWidth: 0,
                            pointBackgroundColor: "#09D483",
                            pointBorderColor: "#09D483",
                            pointHoverRadius: 0,
                            // lineTension:1,
                            data: [ //wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    // wDataEE['overall' ][wDataEE['overall'].length-1]["y"],
                                    // wDataEE['overall' ][wDataEE['overall'].length-1]["y"],
                                    // wDataEE['overall' ][wDataEE['overall'].length-1]["y"],
                                    wDataEE['overall' ][wDataEE['overall'].length-1]["y"],
                                    wDataEE['overall' ][wDataEE['overall'].length-1]["y"],
                                    wDataEE['overall' ][wDataEE['overall'].length-1]["y"],
                                    wDataEE['overall' ][wDataEE['overall'].length-1]["y"],
                                    wDataEE['overall' ][wDataEE['overall'].length-1]["y"],
                                    wDataEE['overall' ][wDataEE['overall'].length-1]["y"],
                                    wDataEE['overall' ][wDataEE['overall'].length-1]["y"],
                                    wDataEE['overall' ][wDataEE['overall'].length-1]["y"] ]
                          }, {
                            label: "Wellness (Week)",
                            backgroundColor: "#06AD6A",
                            borderColor: "#06AD6A",
                            fill: false,
                            radius: 0,
                            pointRadius: 0,
                            pointBorderWidth: 0,
                            pointBackgroundColor: "#06AD6A",
                            pointBorderColor: "#06AD6A",
                            pointHoverRadius: 0,
                            borderDash: [10,5],
                            data: [ //wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    // wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    // wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    // wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    wDataWA['overall' ][wDataWA['overall'].length-1]["y"],
                                    wDataWA['overall' ][wDataWA['overall'].length-1]["y"] ]
                          }];

            self.physicalRadar = createRadarChart(['Upper Body','Low Back','Lower Body','Energy','Mood','Stress','Sleep Quality','Sleep Length'],"physicalRadar",physicalRD);

    }
  });
});


Template.charts.events({

  'click #showDE'(event,template) {
       event.preventDefault();
       Session.set('showDE', true);
       toggleSection(template.find("[class='smartToggleDE']"));
       createLineChart(dates.now,"RPELine"     ,RPELD     ,"Rate of Percieved Exertion (RPE)",10  ,"Rating");
       createLineChart(dates.now,"durationLine",durationLD,"Duration"                        ,dMax,"Minutes");

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
       createLineChart(dates.now,"physicalLine",physicalLD,"Physical",5.2,"Score");
       create2yAxisLineChart(dates.now,"sleepLine",sleepLD,"Sleep",5.2,"Score",1,14,"Hours",);
       createRadarChart(['Upper Body','Low Back','Lower Body','Energy','Mood','Stress','Sleep Quality','Sleep Length'],"physicalRadar",physicalRD);
       createLineChart(dates.now,"mentalLine",mentalLD,"Mental",5.4,"Score");
     },

  'click #hideDW'(event,template) {
       event.preventDefault();
       Session.set('showDW', false);
       toggleSection(template.find("[class='smartToggleDW']"));
     },
});
