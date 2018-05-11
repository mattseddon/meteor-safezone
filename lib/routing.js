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
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('signup');
    });
  },
});

FlowRouter.route('/signin', {
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
