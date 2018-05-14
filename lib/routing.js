import { Accounts } from 'meteor/accounts-base'

exposed = FlowRouter.group({ name: 'exposed' });

// hidden = FlowRouter.group({
//     triggersEnter: [function () {
//         if (!Meteor.user() && !Meteor.loggingIn()) {
//             FlowRouter.go('login')
//         }
//     }]
// });

// function isNotLoggedIn(context, redirect) {
//     if (!Meteor.user() && !Meteor.loggingIn()) {
//         redirect('/');
//     }
// }
//
// function isLoggedIn(context, redirect) {
//     if (Meteor.user() || Meteor.loggingIn()) {
//         redirect('/profile');
//     }
// }
//
// // Check if user is logged in an redirect to /login
// FlowRouter.triggers.enter([isNotLoggedIn], {
//     except: ['login']
// });
//
// // Check if user is logged in an redirect to /clients
// FlowRouter.triggers.enter([isLoggedIn], {
//     only: ['login']
// });

Accounts.onLogin(function(){
    FlowRouter.go('homePage');
});

FlowRouter.route('/', {
  name: 'homePage',
  action() {
    Promise.all([
      import('../imports/api/tasks.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('homePage');
    });
  },
});

exposed.route('/signup', {
  name: 'signup',
  action() {
    Promise.all([
      import('../imports/api/tasks.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('signup');
    });
  },
});

exposed.route('/login', {
  name: 'login',
  action() {
    Promise.all([
      import('../imports/api/tasks.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('login');
    });
  },
});

FlowRouter.route('/profile', {
  name: 'profile',
  action() {
    Promise.all([
      import('../imports/api/tasks.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('athleteProfile');
    });
  },
});
