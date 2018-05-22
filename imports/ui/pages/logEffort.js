import moment from 'moment';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../components/dateTimePicker.js';
// import { Athletes } from '../../api/athletes.js';
import {  Efforts    } from '../../api/efforts.js';
import { placeEffort } from  '../../api/efforts.js';

import './logEffort.html';


//only impulses published are for this user
Template.logEffort.helpers({

  // athlete: function( userId ) {
  //   var getAthlete = Athletes.findOne( { "userId": userId } );
  //
  //   if ( getAthlete ) {
  //     return getAthlete;
  //   }
  // },
  effortTypes: function(){
    return Meteor.settings.public.effortTypes;
  },
  athleteStatuses: function(){
    return Meteor.settings.public.athleteStatuses;
  },
  calcImpulse: function () {
    if (Session.get('calcImpulse')) {
    return Session.get('calcImpulse');
    }
    else {return 360;}
  }
});

 Template.logEffort.onCreated(function(){
   delete Session.keys['calcImpulse'];
});
// Template.impulses.onCreated(function bodyOnCreated() {
//   this.state = new ReactiveDict();
//   Meteor.subscribe('impulses');
//   Meteor.subscribe('athletes');
// });
//
// Template.impulse.onRendered( function() {
//
//   var template = Template.instance();
//
//   $( "#log-impulse" ).validate({
//     rules: {
//       sessionType: {
//         required: true
//       },
//       sessionRPE: {
//         required: true
//       },
//       sessionLength: {
//         required: true
//       },
//       sessionImpulse: {
//         required: true
//       },
//       dateTimeCompleted: {
//         required: true
//       }
//     },
//     submitHandler: function() {
//       var impulse  = {
//             athleteStatus:     template.find( "[name='athleteStatus']"     ).value,
//             sessionType:       template.find( "[name='sessionType']"       ).value,
//             sessionRPE:        template.find( "[name='sessionRPE']"        ).value,
//             sessionLength:     template.find( "[name='sessionLength']"     ).value,
//             sessionImpulse:    template.find( "[name='sessionImpulse']"    ).value,
//             dateTimeCompleted: template.find( "[name='dateTimeCompleted']" ).value
//           };
//
//           Meteor.call( "placeImpulse", impulse, function( error, response ) {
//             if ( error ) {
//               Bert.alert( error.reason, "danger" );
//             } else {
//               Bert.alert( "Impulse submitted!", "success" );
//
//               FlowRouter.go( "/profile" );
//             }
//           });
//     }
//   });
// });

// Template.impulse.helpers({
//   customer: function() {
//     if ( Meteor.userId() ) {
//       var getCustomer = Customers.findOne( { "userId": Meteor.userId() } );
//     } else {
//       var getCustomer = {};
//     }
//
//     if ( getCustomer ) {
//       getCustomer.context = "impulse";
//       return getCustomer;
//     }
//   },
//
// });

Template.logEffort.events({
  'change': function(event, template) {
  var effortRPE = template.find("input[name=effortRPE]").valueAsNumber;
  var effortDuration = template.find("input[name=effortDuration]").valueAsNumber;
  var calcImpulse = effortRPE * effortDuration;
  Session.set('calcImpulse', calcImpulse);
  },
  'submit form': function( event, template ) {
    event.preventDefault();

    // console.log(template.find( "[name='dateTimeCompleted']" ).value);

    var effort  = {
             userId:            Meteor.userId(),
             createdDate:       (new moment().format("YYYY-MM-DD HH:mm")),
             athleteStatus:            template.find( "[name='athleteStatus']"    ).value,
             effortType:               template.find( "[name='effortType']"       ).value,
             effortRPE:         Number(template.find( "[name='effortRPE']"        ).value),
             effortDuration:    Number(template.find( "[name='effortDuration']"   ).value),
             effortImpulse:     Number(template.find( "[name='effortImpulse']"    ).value),
             dateTimeCompleted: moment(template.find( "[name='dateTimeCompleted']" ).value,"DD-MMM-YYYY HH:mm").format("YYYY-MM-DD HH:mm"),
             comments:                 template.find( "[name='comments']" ).value
           };
           Meteor.call( "placeEffort", effort, function( error, response ) {
             if ( error ) {
               Bert.alert( error.reason, "danger" );
             } else {
               Bert.alert( "Effort submitted!", "success" );

               FlowRouter.go( "profile" );
             }
           });

  },
});
