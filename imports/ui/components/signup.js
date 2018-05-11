Template.signup.onRendered(function(){
  $('#application-signup').validate({
    rules: {
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      emailAddress: {
        required: "Please enter your email address to sign up.",
        email: "Please enter a valid email address."
      },
      password: {
        required: "Please enter a password to sign up.",
        minlength: "Please use at least six characters."
      }
    },
    submitHandler: function(){
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
});

Template.signup.events({
  'submit form': function(e){
    // Prevent form from submitting.
    e.preventDefault();
  }
});
