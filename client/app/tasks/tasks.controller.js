'use strict';

angular.module('finalversionApp')
  .controller('TasksCtrl', function ($scope, Auth, TasksService, $timeout) {
  	// alias helpers
  	var h = $scope.helpers;
    // get the current ID
    var id = Auth.getCurrentUser()._id;
  	// populates main 'tasks' array from API
  	var getTasksByUserId = function(){
	  	TasksService.getTasksByUserId(id,'date')
	    .then(function(data){
	    	//success
	    	$scope.tasks = data;
	    });
	}
	// refresh task list from DB. Currently just makes whole new API call by aliasing getTasksByUserId
	var refreshTasks = function(){
		getTasksByUserId();
	}
	// utility function for sorting tasks
	var sortTasks = function(orderby){
		if($scope.tasks===null) return false;
		orderby = orderby || 'date';
		$scope.tasks.sort( h.sortArrayByObjKey(orderby) );
	};
    // fires when 'new task' form is submitted 
    $scope.newTaskSubmitted = function(){
    	var newTask = {
    		name:				$scope.taskName,
    		status:				'incomplete',
    		recurring:			$scope.taskRecurring,
    		recurringInterval:	$scope.taskRecurringInterval,
    		user:				id
    	}
    	TasksService.createTask(newTask).then(function(data){
    		refreshTasks();
    		$scope.resetNewTaskForm();
    		$scope.newTaskCreated = true;
    	});

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
		TasksService.setTaskAsSelected(id,selected)
		.then( function(){
			//success
			console.log('Task selected');
		});
	}
    // delete a specific task
    $scope.destroyTask = function(id){
    	TasksService.destroyTask(id)
    	.then(function(){
    		console.log('Deleted task',id);
    		refreshTasks();
    	});
    }
    // tell the view whether we're running tasks or not
    $scope.running = false;
    $scope.runTasks = function(){
    	$scope.running = true;
    	// get a copy of the items that are currently selected
    	$scope.selectedTasks = $scope.tasks.slice(0);
    	for (var i = 0 ; i < $scope.selectedTasks.length; i++) {
    		if(!$scope.selectedTasks[i].selected){
    			$scope.selectedTasks.splice(i,1);
    		}
    	};
    	$scope.selectedTasks.sort( h.sortArrayByObjKey('-date') );
    	console.log($scope.selectedTasks);
    }
    $scope.stopTasks = function(){
    	$scope.running = false;
    	sortTasks('date');
    }


    /////////////
   	//   RUN   //
    /////////////

    // set $scope.tasks on init
	getTasksByUserId();
	// set first task to be selected by default


  });
