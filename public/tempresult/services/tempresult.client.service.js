// Crear el service 'patients'
angular.module('tempresult').factory('Tempresult', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
    return $resource('api/tempresult/:tempresultId', {
        tempresultId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        'save': {
            method: 'POST',
            isArray: false
        }
    });
}])
.factory('ConvertArray', function(){

    var arrayConvert = function(tags) {
        "use strict";

        var cleaned = [];

        var tags_array = tags.split(',');

        for (var i = 0; i < tags_array.length; i++) {
            if ((cleaned.indexOf(tags_array[i]) == -1) && tags_array[i] != "") {
              //cleaned.push(tags_array[i].replace(/\s/g,''));
               cleaned.push(tags_array[i].replace(/^\s+/,""));
              //cleaned.push(tags_array[i]);
            }
        }

        return cleaned
    }

   return {
   arrayConvert: arrayConvert
  };

});