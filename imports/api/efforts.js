import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

export const Efforts = new Meteor.Collection( 'efforts' );

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user

    Meteor.publish('efforts', function impulsesPublication() {
      return Efforts.find( { userId: this.userId });
    });

}

Meteor.methods({
  placeEffort: function( effort ){
    Efforts.simpleSchema().validate(effort, {check});

    Efforts.insert({
      userId: effort.userId,
      date: effort.date,
      athleteStatus: effort.athleteStatus,
      effortType: effort.effortType,
      effortRPE: effort.effortRPE,
      effortLength: effort.effortLength,
      effortImpulse: effort.effortImpulse,
      dateTimeCompleted: effort.dateTimeCompleted
      comments: effort.comments
    });
  },
  'efforts.remove'(effortId) {
    check(effortId, String);

    const effort = Efforts.findOne(effortId);
    if (effort.userId !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Efforts.remove(effortId);
  },
});

Efforts.deny({
  insert: function(){
    // Deny inserts on the client by default.
    return true;
  },
  update: function(){
    // Deny updates on the client by default.
    return true;
  }
});

var EffortsSchema = new SimpleSchema({
  "userId": {
    type: String,
    label: "Athlete User ID"
  },
  "createdDate": {
    type: "datetime",
    label: "Date Effort Was Logged"
  },
  "athleteStatus": {
    type: String,
    label: "Status of Athlete"
  },
  "effortType": {
    type: String,
    label: "Type of Effort"
  },
  "effortRPE": {
    type: Number,
    label: "RPE of Effort"
  },
  "effortLength": {
    type: Number,
    label: "Length of Effort"
  },
  "effortImpulse": {
    type: Number,
    label: "Impulse of Effort"
  },
  "dateTimeCompleted": {
    type: "datetime",
    label: "Date/Time Effort was Completed"
  }
  "comments": {
    type: "text",
    label: "Comments on Effort"
  }
});

Efforts.attachSchema( EffortsSchema );
