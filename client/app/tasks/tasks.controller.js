'use strict';

angular.module('finalversionApp')
  .controller('TasksCtrl', function ($scope, Auth, Tasks,$timeout) {
  	// alias helpers
  	var h = $scope.helpers;

    // Set some vars
    var id = Auth.getCurrentUser()._id;
    $scope.newTaskCreated = null;
    $scope.tasks = null;

  	// populates main 'tasks' array from API
  	var getTasksByUserId = function(){
	  	$scope.tasks = Tasks.getTasksByUserId(id);
	  	console.log("Here be tasks:",$scope.tasks);
	    /*.then(function(response){
	    	//success
	    	$scope.tasks = response.data;
	    	sortTasks();
	    },function(response){
	    	//error
	    	$scope.tasks = false;
	    });*/
	}
	// refresh task list from DB. Currently just makes whole new API call by aliasing getTasksByUserId
	var refreshTasks = function(){
		getTasksByUserId();
	}

	// sort tasks
	var sortTasks = function(orderby){
		if($scope.tasks===null) return false;
		orderby = orderby || 'date';
		$scope.tasks.sort( h.sortArrayByObjKey(orderby) );
	};

	getTasksByUserId();
	sortTasks();

    // fires when 'new task' form is submitted 
    $scope.newTaskSubmitted = function(){
    	var newTask = {
    		name:				$scope.taskName,
    		status:				'incomplete',
    		recurring:			$scope.taskRecurring,
    		recurringInterval:	$scope.taskRecurringInterval,
    		user:				id
    	}
    	Tasks.createTask(newTask).then(function(response){
    		// success
    		refreshTasks();
    		$scope.resetNewTaskForm();
    		$scope.newTaskCreated = true;
    	}, function (response){
    		// error
    		$scope.newTaskCreated = false;
    	}
    	);

    }
    // resets the New Task form
   	$scope.resetNewTaskForm = function(){
   		$scope.taskName = "";
    	$scope.taskRecurring = false;
    	$scope.taskRecurringInterval = 1;
    	$scope.newTask.$setPristine();
   	}
	// mark a task as currently 'selected' in the database
	$scope.setTaskAsSelected = function(id, selected){
		//if(id) return
		Tasks.setTaskAsSelected(id,selected)
		.then( function(){
			//success
		});
	}
    // delete a specific task
    $scope.destroyTask = function(id){
    	Tasks.destroyTask(id)
    	.then(function(){
    		// success
    		console.log('Deleted',id);
    		refreshTasks();
    	},function(){
    		// error
    	});
    }

    // helper to purge all tasks from the list
    $scope.purgeTasks = function() {
    	Tasks.purgeTasks().then(function(){
    		getTasksByUserId();
    	});
    }

  });
