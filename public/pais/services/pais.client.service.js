'use strict';

// Crear el service 'patients'
angular.module('pais')
.factory('Pais', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
    return $resource('api/pais/:paisId', {
        paisId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}])

.factory('Notify', ['$rootScope', function($rootScope) {
	var notify = {};
	notify.msg = '';

	notify.sendbroadCast = function(mgs){
	  this.msg = mgs;
	  this.broadCast();
	  console.log(this.mgs);
	}

	notify.broadCast = function(){
		$rootScope.$broadcast('noError');
	}

    notify.sendMsg = function(msg, data){
       data = data || {};
       $rootScope.$emit(msg, data);
    }

    notify.getMsg = function(msg, func, scope){
     var unbind = $rootScope.$on(msg, func);

      if(scope){
          scope.$on('destroy', unbind);
      }
    };

    return notify;
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
 
}])


