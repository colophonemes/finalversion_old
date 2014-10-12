'use strict';

angular.module('finalversionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tasks', {
        url: '/tasks',
        templateUrl: 'app/tasks/tasks.html',
        controller: 'TasksCtrl',
        authenticate: true
      });
      $stateProvider.state('tasks_select', {
        url: '/tasks/select',
        templateUrl: 'app/tasks/tasks_select.html',
        controller: 'TasksCtrl',
        authenticate: true
      });
  });