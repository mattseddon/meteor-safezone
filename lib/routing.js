FlowRouter.route('/', {
  name: 'root',
  action() {
    Promise.all([
      import('../imports/api/tasks.js'),
      //import('../imports/ui/task.js'),
      //import('../imports/ui/body1.js'),
      import('../client/main.js')
    ]).then(() => {
      BlazeLayout.render('body1',{top:"task"});
    });
  },
});
