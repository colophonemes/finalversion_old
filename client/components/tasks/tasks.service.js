'use strict';

angular.module('finalversionApp')
  .service('TasksService', function ($rootScope, $q, $http) {


    // expose public methods
  	return {
      indexTasks: indexTasks,
      getTasksByUserId: getTasksByUserId,
      createTask: createTask,
      setTaskAsSelected: setTaskAsSelected,
      setTaskStatus: setTaskStatus,
      updateTask: updateTask,
      destroyTask: destroyTask
    };


    function indexTasks(callback){
      return $http.get('/api/tasks/');
    }

		function getTasksByUserId (id,orderby){
      // default to sort by date
      orderby = orderby || 'date'
      // create the request
      var request = $http.get('/api/tasks/user/'+id);
      return request.then(function(response){
        // strip data from promise response and sort using helper function
        return handleSuccess(response).sort( $rootScope.helpers.sortArrayByObjKey(orderby) )
      }, handleError);
		}

		function createTask (task, callback){
      var request = $http.post('/api/tasks/', {
          name:               task.name,
          user:               task.user,
          recurring:          task.recurring,
          recurringInterval:  task.recurringInterval,
          status:             'incomplete'
      });
      return request.then(handleSuccess,handleError);
		}
    // set task as selected or not
    function setTaskAsSelected (id,selected,callback){
      return $http.put('/api/tasks/'+id,{selected:selected});
    }
    // update task status
    function setTaskStatus (id,status,callback){
      return $http.put('/api/tasks/'+id,{status:status});
    } 
    function updateTask (id, data, callback){
      // build request
      var request = $http.put('/api/tasks/'+id,data);
      return request.then(handleSuccess, handleError);
    }
    function destroyTask (id,callback){
      return $http.delete('/api/tasks/'+id);
    }

    // ERROR HANDLING (code from http://www.bennadel.com/blog/2612-using-the-http-service-in-angularjs-to-make-ajax-requests.htm)
    function handleError( response ) {

    // The API response from the server should be returned in a
    // nomralized format. However, if the request was not handled by the
    // server (or what not handles properly - ex. server error), then we
    // may have to normalize it on our end, as best we can.
    if (
    ! angular.isObject( response.data ) ||
    ! response.data.message
    ) {

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
