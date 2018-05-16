import moment from 'moment';
import './dateTimePicker.html'

Template.dateTimePicker.rendered = function(){
    $('.datetimepicker').datetimepicker(
      {  format:      'YYYY-MMM-DD',
         // formatTime:  'HH:mm',
         // formatDate:  'YYYY-MM-DD',
        defaultDate: moment().format(),
        sideBySide: true//,
        //useCurrent: true
      }
    );
};
