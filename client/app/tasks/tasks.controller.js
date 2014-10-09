'use strict';

angular.module('finalversionApp')
  .controller('TasksCtrl', function ($scope, Auth, Tasks,$timeout) {
    

    $scope.tasks = Tasks.listTasks();
    $scope.formValid = true;

    // fires when 'new task' form is submitted 
    
    $scope.newTaskSubmitted = function(){
    	var newTask = {
    		name:				$scope.taskName,
    		status:				'incomplete',
    		recurring:			$scope.taskRecurring,
    		recurringInterval:	$scope.taskRecurringInterval
    	};
    	//console.log(newTask);
    	$scope.tasks.push(newTask); 
    	Tasks.addTask(newTask);
    }


  });
