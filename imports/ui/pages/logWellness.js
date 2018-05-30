import moment from 'moment';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../components/dateTimePicker.js';
// import { Athletes } from '../../api/athletes.js';
import {  Wellnesses } from '../../api/wellnesses.js';
import { placeWellness } from  '../../api/wellnesses.js';
import { collapseSection ,expandSection ,toggleSection } from '../components/changeSection.js'
import './logWellness.html';


Template.logWellness.helpers({
  showKeyScale() {
    return Session.get('showKeyScale');
  },
  showInstructions() {
    return Session.get('showInstructions');
  },
  });

Template.logWellness.onCreated(function(){
  Session.set('showKeyScale'    , false);
  Session.set('showInstructions', false);
});




Template.logWellness.events({
  'submit form': function( event, template ) {
    event.preventDefault();

    // console.log(template.find( "[name='dateTimeCompleted']" ).value);

    var wellness  = {
             userId:          Meteor.userId(),
             createdDate:    (new moment().format("YYYY-MM-DD HH:mm")),
             sleepQuality:    Number(template.find( "[name='sleepQuality']"      ).value),
             sleepLength:     Number(template.find( "[name='sleepLength']"       ).value),
             mood:            Number(template.find( "[name='mood']"              ).value),
             energy:          Number(template.find( "[name='energy']"            ).value),
             stress:          Number(template.find( "[name='stress']"            ).value),
             upperSoreness:   Number(template.find( "[name='upperSoreness']"     ).value),
             lowBackSoreness: Number(template.find( "[name='lowBackSoreness']"   ).value),
             lowerSoreness:   Number(template.find( "[name='lowerSoreness']"     ).value),
             dateTimeTaken:   moment(template.find( "[name='dateTimeCompleted']" ).value,"DD-MMM-YYYY HH:mm").format("YYYY-MM-DD HH:mm"),
             comments:               template.find( "[name='comments']"          ).value
           };

           Meteor.call( "placeWellness", wellness, function( error, response ) {
             if ( error ) {
               Bert.alert( error.reason, "danger" );
             } else {
               Bert.alert( "Wellness submitted!", "success" );

               FlowRouter.go( "profile" );
             }
           });

  },

  'change': function(event,template){

    if (event.target.name != "sleepLength") {

           if(event.target.value == 5){
      event.target.style.backgroundColor = '#2AC845';
    } else if(event.target.value == 4){
        event.target.style.backgroundColor = '#4CD964';
    } else if(event.target.value == 3){
        event.target.style.backgroundColor = '#FF9500';
    } else if(event.target.value == 2){
      event.target.style.backgroundColor = '#FF3B30';
    } else if(event.target.value == 1){
      event.target.style.backgroundColor = '#FC0D00';
    }
  } else {
        if(event.target.value >= 8){
    event.target.style.backgroundColor = '#2AC845';
  } else if(event.target.value == 7){
     event.target.style.backgroundColor = '#4CD964';
   } else if(event.target.value == 6){
     event.target.style.backgroundColor = '#FF9500';
   } else if(event.target.value >= 4){
    event.target.style.backgroundColor = '#FF3B30';
    } else {
    event.target.style.backgroundColor = '#FC0D00';
    }
  }

  },

  'keypress': function(event,template){

    if (event.target.name != "sleepLength") {
      if(event.which === 13 || event.which === 8) return true;
      var currentChar = parseInt(String.fromCharCode(event.which), 10);
      if(!isNaN(currentChar)){
          var nextValue = event.target.value + currentChar; //It's a string concatenation, not an addition

          if (1 <= parseInt(nextValue, 10) && parseInt(nextValue, 10) <= 5) return true;
      }

      return false;
    }
    else {
    if(event.which === 13 || event.which === 8) return true;
    var currentChar = parseInt(String.fromCharCode(event.which), 10);
    if(!isNaN(currentChar)){
        var nextValue = event.target.value + currentChar; //It's a string concatenation, not an addition

        if (0 <= parseInt(nextValue, 10) && parseInt(nextValue, 10) <= 24) return true;
      }

      return false;
    }
  },

 // "click .showButton": function(event) {
 //   console.log($(".hidder").first().show());
 //  $(".hidder").first().show();
 //  }
  'click #showKeyScale'(event,template) {
       event.preventDefault();
       Session.set('showKeyScale', true);
       toggleSection(template.find("[class='smartToggleKey']"));
     },

  'click #hideKeyScale'(event,template) {
       event.preventDefault();
       Session.set('showKeyScale', false);
       toggleSection(template.find("[class='smartToggleKey']"));
     },

     'click #showInstructions'(event,template) {
          event.preventDefault();
          Session.set('showInstructions', true);
          toggleSection(template.find("[class='smartToggleInstr']"));
        },

     'click #hideInstructions'(event,template) {
          event.preventDefault();
          Session.set('showInstructions', false);
          toggleSection(template.find("[class='smartToggleInstr']"));
        },

});
