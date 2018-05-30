import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

// import { Tasks } from '../../api/tasks.js';
import { Athletes } from '../../api/athletes.js'
import { Efforts } from '../../api/efforts.js'
import { Wellnesses } from '../../api/wellnesses.js'

// import '../components/task.js';
// import '../components/chart.js';
import { collapseSection ,expandSection ,toggleSection } from '../components/changeSection.js'

import '../components/charts.js';
import '../components/athleteInfo.js';

import './athleteProfile.html';


//var athletes = ;

Template.athleteProfile.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  // Meteor.subscribe('tasks');
  Meteor.subscribe('athletes');
  Meteor.subscribe('efforts');
  Meteor.subscribe('wellnesses');
  Session.set('showUpdateInfo', false);
},
// function(){
  // Session.set('showKeyScale'    , false);

// }, function(){}
);

Template.athleteProfile.helpers({
  // tasks() {
  //   const instance = Template.instance();
  //   if (instance.state.get('hideCompleted')) {
  //     // If hide completed is checked, filter tasks
  //     return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
  //   }
  //   // Otherwise, return all of the tasks
  //   return Tasks.find({}, { sort: { createdAt: -1 } });
  // },
  // incompleteCount() {
  //   return Tasks.find({ checked: { $ne: true } }).count();
  // },
  athlete() {
    var getAthlete = Athletes.findOne( { "userId": Meteor.userId() } );
    if ( getAthlete ) {
      getAthlete.context = "profile";
      return getAthlete;
    }
  },
  effort() {
    var getEffort = Efforts.find( { "userId": Meteor.userId() },{sort: {dateTimeCompleted: -1},limit: 5} );
    if ( getEffort ) {
      return getEffort;
    }
  },
  showUpdateInfo() {
    return Session.get('showUpdateInfo');
  },
});

Template.athleteProfile.events({
  // 'submit .new-task'(event) {
  //   // Prevent default browser form submit
  //   event.preventDefault();
  //
  //   // Get value from form element
  //   const target = event.target;
  //   const text = target.text.value;
  //
  //   // Insert a task into the collection
  //   Meteor.call('tasks.insert', text);
  //
  //   // Clear form
  //   target.text.value = '';
  // },
  // 'change .hide-completed input'(event, instance) {
  //   instance.state.set('hideCompleted', event.target.checked);
  // },

  'click #showUpdateInfo'(event,template) {
       event.preventDefault();
       Session.set('showUpdateInfo', true);
       toggleSection(template.find("[class='smartToggleForm']"));
     },

  'click #hideUpdateInfo'(event,template) {
       event.preventDefault();
       Session.set('showUpdateInfo', false);
       toggleSection(template.find("[class='smartToggleForm']"));
     },

});
