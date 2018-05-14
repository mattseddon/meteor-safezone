import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Athletes = new Mongo.Collection('athletes');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('Athletes', function athletesPublication() {
    return Athletes.find({
      userId: this.userId,
    });
  });

  Accounts.onCreateUser( function( options, user ) {
    // Here, we have access to the newly created user document. We want to set up
    // a new document in our Customers collection to store some profile info for
    // our customer. We can do that here by grabbing the userId off our onCreateUser
    // callback and inserting a blank document associated *to* that user into our
    // customers collection. Neat!

    if ( options.profile && options.profile.athlete ) {
      athlete        = options.profile.athlete;
      athlete.userId = user._id;

      // We don't actually want to store this in the user profile (we just use profile
      // as a piggyback mechanism) object, so remove it so it's not inserted by accident.
      delete options.profile;

      Athletes.insert( athlete );
    }

    if ( options.profile ) {
      user.profile = options.profile;
    }

    return user;
  });

}

Athletes.deny({
  insert: function(){
    // Deny inserts on the client by default.
    return true;
  },
  update: function(){
    // Deny updates on the client by default.
    return true;
  },
  remove: function(){
    // Deny removes on the client by default.
    return true;
  }
});

var AthletesSchema = new SimpleSchema({
  "name": {
    type: String,
    defaultValue: "",
    label: "Athlete Name"
  },
  "sport": {
    type: String,
    defaultValue: "",
    label: "Sport"
  },
  "lineup": {
    type: String,
    defaultValue: "",
    label: "Lineup"
  },
  "pos": {
    type: String,
    defaultValue: "",
    label: "Position"
  },
  "number": {
    type: String,
    defaultValue: "",
    label: "Number"
  },
  "userId": {
    type: String,
    label: "Associated User ID"
  }
});

Athletes.attachSchema( AthletesSchema );
