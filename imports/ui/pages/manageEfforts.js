import moment from 'moment';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// import './dateTimePicker.js';
import { Efforts } from '../../api/efforts.js';

import './manageEfforts.html';

Template.manageEfforts.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('efforts');
});



Template.manageEfforts.helpers({
  efforts() {
    const tr = moment().subtract(21, 'days');
    console.log(tr);
    var getEfforts = Efforts.find({dateTimeCompleted : { $gte : tr.format()}}, {sort: {dateTimeCompleted: -1}});

    if ( getEfforts ) {
      return getEfforts;
    }
  },
});

Template.manageEfforts.events({
  'click .delete'() {
    Meteor.call('efforts.remove', this._id);
  },
});
