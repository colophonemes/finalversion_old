'use strict';

angular.module('finalversionApp')
	.service('TasksService', function ( $rootScope, $q, $http, Auth, $interval ) {
		
		// alias helpers
  	var h = $rootScope.helpers;

		// set main tasks object, including helper function for controllers to access data
		var tasks;
		var pushTasks = function(){
			return tasks;
		}

		// get current user ID
		var id = Auth.getCurrentUser()._id;

		// expose public methods
		return {
			getTasks: getTasks,
			getTasksByUserId: getTasksByUserId,
			createTask: createTask,
			setTaskAsSelected: setTaskAsSelected,
			setTaskStatus: setTaskStatus,
			updateTask: updateTask,
			destroyTask: destroyTask,
			tasks: pushTasks,
			countTasks: countTasks
		};

		// get all tasks
		function getTasks(callback){
			return $http.get('/api/tasks/');
		}

		function getTasksByUserId (force,orderby){
			// use local data if we've already got it and there's no 'force' directive
			if(!tasks || force){
				// create the request
				var request = $http.get('/api/tasks/user/'+id);
				return request.then(function(response){
					// strip data from promise response, sort using helper function, assign to global tasks var
					tasks = sortTasks( handleSuccess(response) );
				}, handleError);
			}
		}


		function createTask (task, callback){
			var data = {
					name:               task.name,
					user:               id,
					recurring:          task.recurring,
					recurringInterval:  task.recurringInterval
			};
			var request = $http.post('/api/tasks/', data);
			return request.then(function(response){
				tasks.push = handleSuccess(response).sortTasks();
			},handleError);
		}
		// set task as selected or not
		function setTaskAsSelected (id,selected,callback){
			// update server
			var request = $http.put('/api/tasks/'+id,{selected:selected});
			return request.then(function(response){
				// update client
				tasks[h.findObjectByKey(tasks,'_id',id)].selected = selected;
			},handleError);
		}
		// update task status
		function setTaskStatus (id,status,callback){
			tasks[h.findObjectByKey(tasks,'_id',id)].status = status;
			var request = $http.put('/api/tasks/'+id,{status:status});
			return request.then(handleSuccess,handleError);
		} 
		function updateTask (id, data, callback){
			if(!data) return false;
			// update client
			task = tasks[h.findObjectByKey(tasks,'_id',id)];
			for (key in data) {
				task[key] = data[key];
			};
			// build request
			var request = $http.put('/api/tasks/'+id,data);
			return request.then(handleSuccess, handleError);
		}
		function destroyTask (id,callback){
			tasks.splice(h.findObjectByKey(tasks,'_id',id),1);
			return $http.delete('/api/tasks/'+id);
		}
		// default sort for tasks
		function sortTasks(tasks,orderby){
			// default to sort by date
			orderby = orderby || 'date'
			 return tasks.sort( h.sortArrayByObjKey( orderby ) );
		}
		// count all tasks & selected tasks
		function countTasks(){
			if(!tasks) return {
				all : 		0,
				selected:	0
			}
			var taskCount = tasks.length;
			var selectedTaskCount = 0;
			for (var i = 0; i < tasks.length; i++) {
				if(tasks[i].selected) selectedTaskCount++;
			};
			return {
				all : 		taskCount,
				selected:	selectedTaskCount
			}
		}



		// ERROR HANDLING (code from http://www.bennadel.com/blog/2612-using-the-http-service-in-angularjs-to-make-ajax-requests.htm)
		function handleError( response ) {

			// The API response from the server should be returned in a
			// nomralized format. However, if the request was not handled by the
			// server (or what not handles properly - ex. server error), then we
			// may have to normalize it on our end, as best we can.
			if ( ! angular.isObject( response.data ) || ! response.data.message ) {
				return( $q.reject( "An unknown error occurred." ) );
			}
			// Otherwise, use expected error message.
			return( $q.reject( response.data.message ) );
		}
		// I transform the successful response, unwrapping the application data
		// from the API response payload.
		function handleSuccess( response ) {
			return( response.data );
		}
		

	});
