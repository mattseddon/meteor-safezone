import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

export const Wellnesses = new Meteor.Collection( 'wellnesses' );

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user

    Meteor.publish('wellnesses', function wellnessPublication() {
      return Wellnesses.find( { userId: this.userId });
    });

}

Meteor.methods({
  placeWellness: function( wellness ){
    Wellnesses.simpleSchema().validate(wellness, {check});

    Wellnesses.insert({
      userId: wellness.userId,
      createdDate: wellness.createdDate,
      sleepQuality: wellness.sleepQuality,
      sleepLength: wellness.sleepLength,
      mood: wellness.mood,
      energy: wellness.energy,
      stress: wellness.stress,
      upperSoreness: wellness.upperSoreness,
      lowBackSoreness: wellness.lowBackSoreness,      
      lowerSoreness: wellness.lowerSoreness,
      dateTimeTaken: wellness.dateTimeTaken,
      comments: wellness.comments
    });
  },

  'wellnesses.remove'(wellnessId) {
    check(wellnessId, String);

    const wellness = Wellnesses.findOne(wellnessId);
    if (wellness.userId !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Wellnesses.remove(wellnessId);
  },
});

Wellnesses.deny({
  insert: function(){
    // Deny inserts on the client by default.
    return true;
  },
  update: function(){
    // Deny updates on the client by default.
    return true;
  }
});

var WellnessesSchema = new SimpleSchema({
  "userId": {
    type: String,
    label: "Athlete User ID"
  },
  "createdDate": {
    type: "datetime",
    label: "Date Wellness Was Logged"
  },
  "sleepQuality": {
    type: Number,
    label: "Sleep Quality"
  },
  "sleepLength": {
    type: Number,
    label: "Length of Sleep"
  },
  "mood": {
    type: Number,
    label: "Mood"
  },
  "energy": {
    type: Number,
    label: "Energy"
  },
  "stress": {
    type: Number,
    label: "Stress"
  },
  "upperSoreness": {
    type: Number,
    label: "Soreness of Upper Body"
  },
  "lowBackSoreness": {
    type: Number,
    label: "Soreness of Low Back"
  },
  "lowerSoreness": {
    type: Number,
    label: "Soreness of Lower Body"
  },
  "dateTimeTaken": {
    type: "datetime",
    label: "Date/Time Wellness was Taken"
  },
  "comments": {
    type: "text",
    label: "Comments on Wellness",
    required:false
  }
});

Wellnesses.attachSchema( WellnessesSchema );
