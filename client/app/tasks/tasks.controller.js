'use strict';

angular.module('finalversionApp')
  .controller('TasksCtrl', function ($scope, Auth, TasksService, $timeout) {
  	// alias helpers
  	var h = $scope.helpers;
    // get the current ID
    var id = Auth.getCurrentUser()._id;

    // Alas TasksService
  	$scope.Tasks = TasksService;
  	// update the controller if the service variable changes
  	$scope.$watch($scope.Tasks.tasks,function(){
  		console.log('"tasks" var changed in the service');
  		$scope.tasks = $scope.Tasks.tasks();
  		$scope.tasksCount = $scope.Tasks.countTasks();
  	},true);
  	$scope.Tasks.getTasksByUserId();

  	// put form in $scope
  	$scope.newTaskForm = {};


 //  	var getTasksByUserId = function(){
	//   	TasksService.getTasksByUserId(id,'date')
	//     .then(function(data){
	//     	//success
	//     	$scope.tasks = data;
	//     	// console.log($scope.tasks);
	//     });
	// }();
	// // refresh task list from DB. Currently just makes whole new API call by aliasing getTasksByUserId
	// var refreshTasks = function(){
	// 	getTasksByUserId();
	// }
	// // utility function for sorting tasks
	// var sortTasks = function(orderby){
	// 	orderby = orderby || 'date';
	// 	$scope.tasks.sort( h.sortArrayByObjKey(orderby) );
	// };
    // fires when 'new task' form is submitted 
    $scope.newTaskSubmitted = function(){
    	var newTaskData = {
    		name:				$scope.newTaskForm.taskName,
    		recurring:			$scope.newTaskForm.taskRecurring ? $scope.newTaskForm.taskRecurring  : false,
    		recurringInterval:	$scope.newTaskForm.taskRecurring ? $scope.newTaskForm.taskRecurringInterval : 0
    	}
    	Tasks.createTask(newTaskData);
    }
    // resets the New Task form
   	$scope.resetNewTaskForm = function(){
   		$scope.newTaskForm.taskName = "";
    	$scope.newTaskForm.taskRecurring = false;
    	$scope.newTaskForm.taskRecurringInterval = "";
    	$scope.newTaskForm.form.$setPristine();
   	}
	// // mark a task as currently 'selected' in the database
	// $scope.setTaskAsSelected = function(id, selected){
	// 	// Update server
	// 	TasksService.setTaskAsSelected(id,selected);
	// 	// Update client
	// 	var target = $scope.tasks;
	// 	target[h.findObjectByKey(target,'_id',id)].selected = selected;
	// }
	// // set a task to a specific status ('incomplete','complete')
	// $scope.setTaskStatus = function(id, status, target){
	// 	// set allowed statuses and default to 'incomplete' if illegal value
	// 	var allowedStatuses = ['incomplete','complete'];
	// 	defaultStatus = allowedStatuses[0];
	// 	if(!status) status = defaultStatus;
	// 	if(allowedStatuses.indexOf(status) == -1) status = defaultStatus;
	// 	// update server
	// 	TasksService.setTaskStatus(id,status);
	// 	// update client
	// 	target = $scope.tasks;
	// 	target[h.findObjectByKey(target,'_id',id)].status = status;
	// 	console.log(target);
	// }
	// $scope.updateTask = function (id,data){
	// 	// update server
	// 	TasksService.updateTask(id, data);
	// 	// update client
	// 	var task = $scope.tasks[h.findObjectByKey($scope.tasks,'_id',id)];
	// 	for (var key in data) {
	// 			task[key] = data[key];
	// 	};
	// }
 //    $scope.destroyTask = function(id){
 //    	TasksService.destroyTask(id)
 //    	.then(function(){
 //    		console.log('Deleted task',id);
 //    		refreshTasks();
 //    	});
 //    }
 //    // count the number of tasks + selected tasks
 //    var countTasks = function(){
 //    	$scope.tasksCount = 0;
 //    	$scope.tasksSelectedCount = 0;
 //    	for (var i = 0; i < $scope.tasks.length; i++) {
 //    		if($scope.tasks[i].selected) $scope.tasksSelectedCount++;
 //    	};
 //    	if($scope.tasksSelectedCount==0){
 //    		$scope.started = false;
 //    	}
 //    	// console.log('tasks',$scope.tasksCount,'selected',$scope.tasksSelectedCount);
 //    };
    // watch for things to do if the 'tasks' array changes
    // $scope.$watch('tasks',function(newValue,oldValue){
    // 	countTasks();
    // 	sortTasks();
    // },true);

    // $scope.$watch('taskName',function(newValue,oldValue){
    // 	console.log($scope.taskName);
    // });
}).filter('reverse', function() {
	return function(items) {
	return items.slice().reverse();
	};
});