'use strict';

angular.module('result')
.factory('Result', ['$resource', function($resource) {
  // Usar el service '$resource' para devolver un objeto '$resource' Patients
    return $resource('api/result/:resultId', {
        resultId: '@_id'
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
    this.broadCast(mgs);
    console.log(this.mgs);
  }

  notify.broadCast = function(msg){
    $rootScope.$broadcast('noError', msg);
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
 
}]).factory("GetResults", ["$http", function($http){
      
  var fResult = {};
  var cleaned = [];
  

   var getResultlist = function(orderId){
    $http.get('api/resultfilter',  {
      params: {
        orderId: orderId 
      }
    })
    .then(function(result) {
       cleaned = result.data;
     console.log(cleaned);     
    });

      return cleaned;
    }
  
     var getArrayToString = function(resultado){
      var resultadoString = "";
     for(var i = 0; i < resultado.length; i++){
        resultadoString = resultadoString + ', '  + resultado[i];
     }
      return resultadoString;
    }



    return {
         getResultlist: getResultlist,
         getArrayToString: getArrayToString
     };


}]);

