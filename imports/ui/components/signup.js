Template.signup.events({
  'submit form': function(e){
    // Prevent form from submitting.
    e.preventDefault();
    var user = {
      email: $('[name="emailAddress"]').val(),
      password: $('[name="password"]').val()
    };

    Accounts.createUser( {
      email: user.email,
      password: user.password,
      profile: {
        athlete: {
          userId: "",
          name: "",
          sport: "",
          lineup: "",
          pos: "",
          number: ""
        }
      }
    }, function( error, userId ){
      if( error ) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Welcome to Constant Data Collection!', 'success');
      }
    });
  }
});
