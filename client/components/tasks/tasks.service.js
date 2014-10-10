'use strict';

angular.module('finalversionApp')
  .factory('Tasks', function (Auth, $q, $http) {

  	return {
      indexTasks: function (callback){
        return $http.get('/api/tasks/');
      },
  		getTasksByUserId: function (id,orderby,callback){
        return $http.get('/api/tasks/user/'+id);
  		},
  		createTask: function (task, callback){
  			console.log('createTask processing:',task.name);
  			var cb = callback || angular.noop;
        var deferred = $q.defer();

        return $http.post('/api/tasks/', {
            name:               task.name,
            user:               task.user,
            recurring:          task.recurring,
            recurringInterval:  task.recurringInterval,
            status:             'incomplete'
        });
  		},
      setTaskAsSelected : function (id,selected,callback){
        //selected =  selected || true;
        return $http.put('/api/tasks/'+id,{selected:selected});
      },
      destroyTask : function(id,callback){
        return $http.delete('/api/tasks/'+id);
      }

  	}

  });
