'use strict';

var ciudadModule = angular.module('ciudad');

// ciudad controller
ciudadModule.controller('ciudadController', [
	'$scope', 
	'$http', 
	'$routeParams',  
	'$location', 
	'Authentication', 
	'Ciudad', 
	'Pais',
	'Notify',
	'$modal', 
	'$log',
	function($scope, $http, $routeParams, $location, Authentication, Ciudad, Pais, Notify, $modal, $log) {
		this.authentication = Authentication;
       console.log(this.authentication);
	    // Find a list of ciudad
	   this.ciudad = Ciudad.query();
	  // this.pais = Pais.query();

  //Open the middleware to open a single ciudad modal.
	 this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'ciudad/views/create-ciudad.client.view.html',
		      controller: 'modalResutl',

		    //    function ($scope, $modalInstance) {
                
      //            $scope.ok = function (result) {
      //            	console.log($scope.refered);
      //            	if(this.refered){
      //            		$modalInstance.close();
      //            	}
				  // };

				  // $scope.cancel = function () {
				  //   $modalInstance.dismiss('cancel');
				  // };

		    //   },
		      size: size
		 });

	 modalInstance.result.then(function (selectedItem) {
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };


     //Open the middleware to open a single ciudad modal.
	 this.modelUpdate = function (size, selectedciudad) {

            console.log(selectedciudad);
		    var modalInstance = $modal.open({
		      templateUrl: 'ciudad/views/edit-ciudad.client.view.html',
		      controller: function ($scope, $modalInstance, ciudad) {
                 $scope.ciudad = ciudad;

                 $scope.ciudad.rpais = selectedciudad.pais._id;

             
                 Notify.sendbroadCast('noError', 'this is a message');

                 $scope.ok = function () { 	
                  $modalInstance.close($scope.ciudad);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        ciudad: function () {
		          return selectedciudad;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedciudad) {
      $scope.selected = selectedciudad;
      //console.log($scope.selected);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

/*	  $scope.$on('handleBroadcast', function(){

	  if($scope.returnciudad){

	  	$scope.returnciudad = '';
	  }
	  	  // this.ciudad = $scope.ciudad;
	  });*/
	  
	// Notify.getMgs('hola', function(event, data){
	// 	 console.log('JODETE');
	// });

	  // Remove existing Pai
	this.remove = function(ciudad) {
			if( ciudad ) { 
				ciudad.$remove();

				for (var i in this.ciudad) {
					if (this.ciudad [i] === ciudad) {
						this.ciudad.splice(i, 1);
					}
				}
			} else {
				this.ciudad.$remove(function() {
				});
			}
		};

		
	
	 }
]);




ciudadModule.controller('modalResutl',  function ($scope, $modalInstance) {

/*  $scope.$on('noError', function(){
  	
 });
*/

  $scope.ok = function () {	
    $modalInstance.close();
   };


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


ciudadModule.controller('CiudadCreateController', ['$scope',  'Ciudad', 'Notify', 'Pais',
	function($scope, Ciudad, Notify, Pais) {

		this.pais = Pais.query();
	  	// // Create new Pai
	  this.create = function() {
			// Create new Pai object
	   var ciudads = new Ciudad ({
				name: this.name,
				pais: this.Selectedpais
	   });
			

			//console.log(ciudads);
			// Redirect after save
			ciudads.$save(function(response) {
             Notify.sendMsg('newPis', {'id': response._id});
            // Notify.sendbroadCast('noError');*/
            // this.ciudad = Ciudad.query();
				// Clear form fields
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

ciudadModule.controller('ciudadUpdateController', ['$scope', 'Authentication', 'Ciudad', 'Pais', 'Notify',
	function($scope, Authentication, Ciudad, Pais, Notify) {
		//$scope.authentication = Authentication;
	    // Update existing Pai
        
          this.pais = Pais.query();
	      this.update = function(updateciudad) {
          
	      var ciudad = new Ciudad ({
	      		_id: updateciudad._id,
				name: updateciudad.name,
				pais: $scope.ciudad.rpais
	       });

		  ciudad.$update(function() {
		  	 Notify.sendMsg('newPis', {'id': 'update'});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
	   };
     	
	}
]);


ciudadModule.directive('ciudadList', ['Ciudad', 'Notify', function(Ciudad, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'ciudad/views/ciudad-list.template.html',
    link: function(scope, element, attr){
         // when a new ciudad is added update the ciudad List..
         // Notify.getMsg('newCiudad', function(event, data){
         // 	scope.rpais = data;
            
         // });

           Notify.getMsg('newPis', function(event, data){
           	console.log('got the message');
            scope.ciudadCtrl.ciudad = Ciudad.query();
         });
    }
  };
}]);


