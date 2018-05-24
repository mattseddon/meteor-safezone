import moment from 'moment';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// import './dateTimePicker.js';
import { Wellnesses } from '../../api/wellnesses.js';

import './manageWellness.html';

Template.manageWellness.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('wellnesses');
});



Template.manageWellness.helpers({
  wellnesses() {
    const tr = moment().subtract(21, 'days');

    var getWellnesses = Wellnesses.find({dateTimeTaken : { $gte : tr.format()}}, {sort: {dateTimeTaken: -1}});

    if ( getWellnesses ) {
      return getWellnesses;
    }
  },
});

Template.manageWellness.events({
  'click .delete'() {
    Meteor.call('wellnesses.remove', this._id);
  },
});
