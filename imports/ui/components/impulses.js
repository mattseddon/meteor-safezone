import moment from 'moment';

import './impulses.html';
import './dateTimePicker.html';
import './dateTimePicker.js';
import { Athletes } from '../../api/athletes.js';
import { Impulses } from '../../api/impulses.js';

//only impulses published are for this user
Template.impulses.helpers({
  impulses: function() {
    var getImpulses = Impulses.find();

    if ( getImpulses ) {
      return getImpulses;
    }
  },
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

Template.athleteProfile.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('impulses');
  Meteor.subscribe('athletes');
});
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
  'submit form': function( event ) {
    event.preventDefault();
  }
});
