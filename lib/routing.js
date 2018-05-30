import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
//exposed = FlowRouter.group({ name: 'exposed' });

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
    FlowRouter.go('profile');
});

Accounts.onLogout(function(){
    FlowRouter.go('homePage');
});

FlowRouter.route('/', {
  name: 'homePage',
  action() {
    Promise.all([
      // import('../imports/api/tasks.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('homePage');
    });
  },
});

FlowRouter.route('/signup', {
  name: 'signup',
  action() {
    Promise.all([
      import('../imports/api/tasks.js'),
      import('../imports/ui/components/signup.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('signup');
    });
  },
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    Promise.all([
      import('../imports/api/tasks.js'),
      import('../imports/ui/components/login.js'),
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
      // import('../imports/api/tasks.js'),
      import('../imports/api/athletes.js'),
      import('../imports/api/efforts.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../imports/ui/pages/athleteProfile.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('athleteProfile');
    });
  },
});

FlowRouter.route('/efforts/log', {
  name: 'logEffort',
  action() {
    Promise.all([
      import('../imports/api/efforts.js'),
      import('../imports/ui/pages/logEffort.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('logEffort');
    });
  },
});

FlowRouter.route('/efforts/manage', {
  name: 'manageEfforts',
  action() {
    Promise.all([
      import('../imports/api/efforts.js'),
      import('../imports/ui/pages/manageEfforts.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('manageEfforts');
    });
  },
});


FlowRouter.route('/wellness/log', {
  name: 'logWellness',
  action() {
    Promise.all([
      import('../imports/api/wellnesses.js'),
      import('../imports/ui/pages/logWellness.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('logWellness');
    });
  },
});

FlowRouter.route('/wellness/manage', {
  name: 'manageWellness',
  action() {
    Promise.all([
      import('../imports/api/wellnesses.js'),
      import('../imports/ui/pages/manageWellness.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('manageWellness');
    });
  },
});
