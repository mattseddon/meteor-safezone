import moment from 'moment';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './dateTimePicker.js';
import { Impulses } from '../../api/impulses.js';

import './manageEfforts.html';


Template.manageEfforts.helpers({
  impulses() {
    const tr = moment().subtract(21, 'days');
    console.log(tr);
    var getImpulses = Impulses.find({dateTimeCompleted : { $gte : tr.format()}}, {sort: {dateTimeCompleted: -1}});

    if ( getImpulses ) {
      return getImpulses;
    }
  },
});

Template.manageEfforts.events({
  'click .delete'() {
    Meteor.call('impulses.remove', this._id);
  },
});
