import './custNavBar.html';
import {toggleSection } from '../components/changeSection.js'
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Template.custNavBar.onCreated(function() {
//     // Subscribe only the relevant subscription to this page
//     var self = this;
//     self.autorun(function() { // Stops all current subscriptions
//         var id = FlowRouter.getParam('id'); // Get the collection id from the route parameter
//         // self.subscribe('singlePost', id); // Subscribe to the single entry in the collection with the route params id
//     });
// });


  // var $codeSnippets = $('.code-example-body'),
  //     $nav = $('.navbar'),
  //     $body = $('body'),
  //     $window = $(window),
  //     $popoverLink = $('[data-popover]'),
  //     // navOffsetTop = $nav.offset().top,
  //     $document = $(document),
  //     entityMap = {
  //       "&": "&amp;",
  //       "<": "&lt;",
  //       ">": "&gt;",
  //       '"': '&quot;',
  //       "'": '&#39;',
  //       "/": '&#x2F;'
  //     }
  //
  // function init() {
  //   $window.on('scroll', onScroll)
  //   $window.on('resize', resize)
  //   $document.on('click', closePopover)
  //   $('a[href^="#"]').on('click', smoothScroll)
  //   buildSnippets();
  // }
  //
  // function smoothScroll(e) {
  //   e.preventDefault();
  //   $(document).off("scroll");
  //   var target = this.hash,
  //       menu = target;
  //   $target = $(target);
  //   $('html, body').stop().animate({
  //       'scrollTop': $target.offset().top-40
  //   }, 0, 'swing', function () {
  //       window.location.hash = target;
  //       $(document).on("scroll", onScroll);
  //   });
  // }
  //
  // function openPopover(e) {
  //   e.preventDefault()
  //   closePopover();
  //
  // }
  //
  // function closePopover(e) {
  //   if($('.popover.open').length > 0) {
  //     $('.popover').removeClass('open')
  //   }
  // }

Template.custNavBar.events({

"click #nav-logout": function(event) {
        event.preventDefault();
        Meteor.logout();
        Bert.alert('Logged out!', 'success');
},

// "click #yoyoyo": function(e,template) {
//   var popover = template.find("[id='codeNavPopover']");
//   isCollapsed = toggleSection(popover);
//
//   //the value is reversed as it has just been changed
//    if (isCollapsed){
//      popover.style.display = 'block';
//    }
//    else {
//      popover.style.display = 'none';
//    }
// }
// "click #yoyoyo": function (e,t) {
//   e.preventDefault()
//   // closePopover();
//   console.log($(event.currentTarget));
//   var popover = $($(this).data('popover'));
//   console.log($(this).data);
//   popover.toggleClass('open');
//   // e.stopImmediatePropagation();
// }

});
