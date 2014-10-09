'use strict';

angular.module('finalversionApp')
  .controller('MainCtrl', function ($scope,Auth,$location) {
    //redirect to tasks page if we're already logged in
    Auth.isLoggedInAsync(function(loggedIn) {
      if(loggedIn){
        $location.path('/tasks');
      }
    });
  });
