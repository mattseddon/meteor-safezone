import moment from 'moment';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './dateTimePicker.js';
import { Athletes } from '../../api/athletes.js';
import { Impulses } from '../../api/impulses.js';
import {placeImpulse} from  '../../api/impulses.js';

import './impulses.html';


//only impulses published are for this user
Template.impulses.helpers({

  athlete: function( userId ) {
    var getAthlete = Athletes.findOne( { "userId": userId } );

    if ( getAthlete ) {
      return getAthlete;
    }
  },
  sessionTypes: function(){
    return Meteor.settings.public.sessionTypes;
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

 Template.impulses.onCreated(function(){
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

Template.impulses.events({
  'change': function(event, template) {
  var sessionRPE = template.find("input[name=sessionRPE]").valueAsNumber;
  var sessionLength = template.find("input[name=sessionLength]").valueAsNumber;
  var calcImpulse = sessionRPE * sessionLength;
  Session.set('calcImpulse', calcImpulse);
  },
  'submit form': function( event, template ) {
    event.preventDefault();

    console.log(template.find( "[name='dateTimeCompleted']" ).value);

    var impulse  = {
             userId:            Meteor.userId(),
             date:              (new Date()),
             athleteStatus:     template.find( "[name='athleteStatus']"     ).value,
             sessionType:       template.find( "[name='sessionType']"       ).value,
             sessionRPE:        Number(template.find( "[name='sessionRPE']"        ).value),
             sessionLength:     Number(template.find( "[name='sessionLength']"     ).value),
             sessionImpulse:    Number(template.find( "[name='sessionImpulse']"    ).value),
             dateTimeCompleted: moment(template.find( "[name='dateTimeCompleted']" ).value,"YYYY-MMM-DD").format()
           };
           console.log(impulse)
           Meteor.call( "placeImpulse", impulse, function( error, response ) {
             if ( error ) {
               Bert.alert( error.reason, "danger" );
             } else {
               Bert.alert( "Impulse submitted!", "success" );

               FlowRouter.go( "profile" );
             }
           });

  },
});
