'use strict';

var sectorModule = angular.module('sector');

// ciudad controller
sectorModule.controller('sectorController', [
	'$scope', 
	'$http', 
	'$routeParams',  
	'$location', 
	'Authentication', 
	'Sector',
	'Ciudad', 
	'Notify',
	'$modal', 
	'$log',
	function($scope, $http, $routeParams, $location, Authentication, Sector,Ciudad, Notify, $modal, $log) {
		this.authentication = Authentication;

	    // Find a list of ciudad
	   this.sector = Sector.query();
	   this.ciudad = Ciudad.query();
	  // this.pais = Pais.query();

  //Open the middleware to open a single ciudad modal.
	 this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'sectors/views/create-sector.client.view.html',
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
	 this.modelUpdate = function (size, selectedsector) {

            console.log(selectedsector);
		    var modalInstance = $modal.open({
		      templateUrl: 'sectors/views/edit-sector.client.view.html',
		      controller: function ($scope, $modalInstance, sector) {
                 $scope.sector = sector;
                 $scope.sector.rciudad = selectedsector.ciudad._id;

             
                 //Notify.sendbroadCast('noError', 'this is a message');

                 $scope.ok = function () { 	
                  $modalInstance.close($scope.sector);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        sector: function () {
		          return selectedsector;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedsector) {
      $scope.selected = selectedsector;
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
	this.remove = function(sector) {
			if( sector ) { 
				sector.$remove();

				for (var i in this.sector) {
					if (this.sector [i] === sector) {
						this.sector.splice(i, 1);
					}
				}
			} else {
				this.sector.$remove(function() {
				});
			}
		};

		
	
	 }
]);


sectorModule.controller('modalResutl',  function ($scope, $modalInstance) {

 $scope.$on('noError', function(){
  	
 });

  $scope.ok = function () {	
    $modalInstance.close();
   };


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


sectorModule.controller('sectorCreateController', ['$scope',  'Ciudad', 'Notify', 'Sector',
	function($scope, Ciudad, Notify, Sector) {

	  this.ciudad = Ciudad.query();
	  	// // Create new Pai
	  this.create = function() {
			// Create new Pai object
	   var sector = new Sector ({
				name: this.name,
				ciudad: this.Selectedciudad
	   });
			
			// Redirect after save
	   sector.$save(function(response) {
             Notify.sendMsg('newPis', {'id': response._id});
            // Notify.sendbroadCast('noError');
            // this.ciudad = Ciudad.query();
				// Clear form fields
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

sectorModule.controller('sectorUpdateController', ['$scope',  'Ciudad', 'Sector', 'Notify',
	function($scope, Ciudad, Sector, Notify) {
		//$scope.authentication = Authentication;

          this.ciudad = Ciudad.query();
          
	      this.update = function(updateSector) {

	      	var sector  = new Sector ({
	      		_id: updateSector._id,
				name: updateSector.name,
				ciudad: $scope.sector.rciudad
	       });
		
		  sector.$update(function() {
		  	 Notify.sendMsg('newPis', {'id': 'update'});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
	   };
     	
	}
]);


sectorModule.directive('sectorList', ['Sector', 'Notify', function(Sector, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'sectors/views/sector-list.template.html',
    link: function(scope, element, attr){
         // when a new ciudad is added update the ciudad List..
         // Notify.getMsg('newCiudad', function(event, data){
         // 	scope.rpais = data;
            
         // });
           Notify.getMsg('newPis', function(event, data){
           	console.log('got the message');
            scope.sectorCtrl.sector = Sector.query();
         });
    }
  };
}]);


