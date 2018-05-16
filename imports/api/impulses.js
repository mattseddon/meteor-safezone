import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

export const Impulses = new Meteor.Collection( 'impulses' );

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user

    Meteor.publish('impulses', function impulsesPublication() {
      return Impulses.find( { userId: this.userId });
    });

}

Meteor.methods({
  placeImpulse: function( impulse ){
    Impulses.simpleSchema().validate(impulse, {check});

    Impulses.insert({
      userId: impulse.userId,
      date: impulse.date,
      athleteStatus: impulse.athleteStatus,
      sessionType: impulse.sessionType,
      sessionRPE: impulse.sessionRPE,
      sessionLength: impulse.sessionLength,
      sessionImpulse: impulse.sessionImpulse,
      dateTimeCompleted: impulse.dateTimeCompleted
    });
  }
});

Impulses.deny({
  insert: function(){
    // Deny inserts on the client by default.
    return true;
  },
  update: function(){
    // Deny updates on the client by default.
    return true;
  }
});

var ImpulsesSchema = new SimpleSchema({
  "userId": {
    type: String,
    label: "Athlete User ID"
  },
  "date": {
    type: Date,
    label: "Date Entry Was Logged"
  },
  "athleteStatus": {
    type: String,
    label: "Status of Athlete"
  },
  "sessionType": {
    type: String,
    label: "Type of Session"
  },
  "sessionRPE": {
    type: Number,
    label: "RPE of Session"
  },
  "sessionLength": {
    type: Number,
    label: "Length of Session"
  },
  "sessionImpulse": {
    type: Number,
    label: "Impulse of Session"
  },
  "dateTimeCompleted": {
    type: "datetime",
    label: "Date/Time Session was Completed"
  }
});

Impulses.attachSchema( ImpulsesSchema );
