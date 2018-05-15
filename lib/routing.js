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
      import('../imports/api/tasks.js'),
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
      import('../imports/api/tasks.js'),
      import('../imports/api/athletes.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('athleteProfile');
    });
  },
});

FlowRouter.route('/impulses', {
  name: 'impulses',
  action() {
    Promise.all([
      import('../imports/api/impulses.js'),
      import('../imports/ui/components/impulses.js'),      
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('impulses');
    });
  },
});
