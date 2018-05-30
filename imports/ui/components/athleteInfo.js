import './athleteInfo.html';
import '../../api/athletes.js';

Template.athleteInfo.helpers({
  isProfile: function( location ) {
    return Template.instance().data.context === "profile" ? true : false;
  },
  sports: function(){
    return Meteor.settings.public.sports;
  },
  lineups: function(){
    return Meteor.settings.public.lineups;
  },
});

Template.athleteInfo.events({
  'click #updateInfo': function( event, template ) {
      event.preventDefault();

      var athlete = {
        name: template.find( "[name='name']" ).value,
        sport: template.find( "[name='sport']" ).value,
        lineup: template.find( "[name='lineup']" ).value,
        pos: template.find( "[name='pos']" ).value,
        number: template.find( "[name='number']" ).value,
        userId: this.userId
      };

      Meteor.call( 'updateAthlete', athlete, function( error, response ) {
        if ( error ) {
          Bert.alert( error.reason, "danger" );
          console.log(athlete);
        } else {
          Bert.alert( "Athlete information updated!", "success" );
        }
      });
    },



  });
