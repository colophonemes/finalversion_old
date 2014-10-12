'use strict';

angular.module('finalversionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tasks', {
        url: '/tasks',
        templateUrl: 'app/tasks/tasks.html',
        controller: 'TasksCtrl',
        authenticate: true
      }).state('tasks.select', {
        url: '/select',
        templateUrl: 'app/tasks/tasks-select.html',
        controller: 'TasksCtrl',
        authenticate: true
      }).state('tasks.run', {
        url: '/run',
        templateUrl: 'app/tasks/tasks-run.html',
        controller: 'TasksCtrl',
        authenticate: true
      });
  });