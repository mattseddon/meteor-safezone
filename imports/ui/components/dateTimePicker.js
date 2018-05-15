
Template.dateTimePicker.rendered = function(){
    $('.datetimepicker').datetimepicker(
      {
        defaultDate: moment(),
        sideBySide: true//,
        //useCurrent: true
      }
    );
};
