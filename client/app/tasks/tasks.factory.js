'use strict';

angular.module('finalversionApp')
  .factory('Tasks', function (User) {
  	var currentUser = User.get();

  	return {
  		listTasks: function (){
  			return []
  		},
  		addTask: function (task){
  			console.log(task);
  		}

  	}

  });
