'use strict';

angular.module('finalversionApp')
  .controller('TasksCtrl', function ($scope, Auth, TasksService, $timeout) {
  	// alias helpers
  	var h = $scope.helpers;
    // get the current ID
    var id = Auth.getCurrentUser()._id;
  	// populates main 'tasks' array from API
  	$scope.tasks = [];
  	var getTasksByUserId = function(){
	  	TasksService.getTasksByUserId(id,'date')
	    .then(function(data){
	    	//success
	    	$scope.tasks = data;
	    	console.log($scope.tasks);
	    });
	}();
	// refresh task list from DB. Currently just makes whole new API call by aliasing getTasksByUserId
	var refreshTasks = function(){
		getTasksByUserId();
	}
	// utility function for sorting tasks
	var sortTasks = function(orderby){
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
		// Update server
		TasksService.setTaskAsSelected(id,selected);
		// Update client
		var target = $scope.tasks;
		target[h.findObjectByKey(target,'_id',id)].selected = selected;
	}
	// set a task to a specific status ('incomplete','complete')
	$scope.setTaskStatus = function(id, status, target){
		// set allowed statuses and default to 'incomplete' if illegal value
		var allowedStatuses = ['incomplete','complete'];
		defaultStatus = allowedStatuses[0];
		if(!status) status = defaultStatus;
		if(allowedStatuses.indexOf(status) == -1) status = defaultStatus;
		// update server
		TasksService.setTaskStatus(id,status);
		// update client
		target = $scope.tasks;
		target[h.findObjectByKey(target,'_id',id)].status = status;
		console.log(target);
	}
	$scope.updateTask = function (id,data){
		// update server
		TasksService.updateTask(id, data);
		// update client
		var task = $scope.tasks[h.findObjectByKey($scope.tasks,'_id',id)];
		for (var key in data) {
				task[key] = data[key];
		};
	}
    $scope.destroyTask = function(id){
    	TasksService.destroyTask(id)
    	.then(function(){
    		console.log('Deleted task',id);
    		refreshTasks();
    	});
    }
    // count the number of tasks + selected tasks
    var countTasks = function(){
    	$scope.tasksCount = 0;
    	$scope.tasksSelectedCount = 0;
    	for (var i = 0; i < $scope.tasks.length; i++) {
    		if($scope.tasks[i].selected) $scope.tasksSelectedCount++;
    	};
    	if($scope.tasksSelectedCount==0){
    		$scope.started = false;
    	}
    	// console.log('tasks',$scope.tasksCount,'selected',$scope.tasksSelectedCount);
    };
    // things to do if the 'tasks' array changes
    $scope.$watch('tasks',function(newValue,Oldvalue){
    	countTasks();
    	sortTasks();
    },true);
    // tell the view whether we're running tasks or not
    $scope.started = false;
    // function for running 
    $scope.startTasks = function(){
    	$scope.started = true;

    }
    $scope.stopTasks = function(){
    	$scope.started = false;
    }


    /////////////
   	//   RUN   //
    /////////////


}).filter('reverse', function() {
	return function(items) {
	return items.slice().reverse();
	};
});
