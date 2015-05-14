'use strict';

var procsModule = angular.module('procs');

// seguro controller
procsModule.controller('procsController', [
	'$scope', 
	'$http', 
	'$routeParams',  
	'$location', 
	'Authentication', 
	'Procs', 
	'Notify',
	'$modal', 
	'$log',
	'ngTableParams',
	'$mdToast', 
	'$animate',
	function($scope, $http, $routeParams, $location, Authentication, Procs, Notify, $modal, $log, ngTableParams, $mdToast, $animate) {
		
	this.authentication = Authentication;
       // console.log(this.authentication);	 

       var params = {
       	  page: 1,            
	      count: 5,
	      filter: {
            name: name
        }
       }

       var settings = {
       	total: 0,  
       	counts: [5,10,15],        
	    getData: function($defer, params) {
	        Procs.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
	        });
	        }
       };

	  $scope.tableParams = new ngTableParams( params, settings);

      //Open the middleware to open a single seguro modal.
	  this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'procedimientos/views/create-procedimientos.client.view.html',
		      controller: 'modalResutl',

		      size: size
		 });

	  modalInstance.result.then(function (selectedItem) {
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

     //Open the middleware to open a single seguro modal.
	 this.modelUpdate = function (size, selectedprocs) {

            console.log(selectedprocs);
		    var modalInstance = $modal.open({
		      templateUrl: 'procedimientos/views/edit-procedimientos.client.view.html',
		      controller: function ($scope, $modalInstance, procs) {
                 $scope.procs = procs;
                 

                 //$scope.procedure.rpais = selectedprocs.pais._id;
      
                  Notify.sendbroadCast('noError', 'this is a message');
                  $scope.ok = function () { 	
                  $modalInstance.close($scope.procs);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        procs: function () {
		          return selectedprocs;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedprocs) {
      $scope.selected = selectedprocs;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };


	   this.modelRemove = function (size, selectedcliente) {
	   	    $scope.procs = selectedcliente;
		    var modalInstance = $modal.open({
		      templateUrl: 'procedimientos/views/procedimientos-delete.template.html',
		      controller: 
		      //'modalDelete',
		      function ($scope, $modalInstance, procs) {
                 $scope.procs = procs;

                  $scope.ok = function () {
                   //console.log($scope.cliente);
                  // $scope.doSearch();
                  $modalInstance.close($scope.procs);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        procs: function () {
		          return selectedcliente;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedcliente) {
      $scope.selected = selectedcliente;
      //console.log($scope.selected);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  this.doSearch = function () {
		    $scope.tableParams.reload();
	  };

	  // $scope.showSimpleToast = function() {
	  //   $mdToast.show(
	  //     $mdToast.simple()
	  //       .content('Simple Toast!')
	  //       .position('top, right')
	  //       .hideDelay(3000)
	  //   );
	  // };

	  // Remove existing Pai
	 this.remove = function(seguro) {
			if( seguro ) { 
				seguro.$remove();

				for (var i in this.seguro) {
					if (this.seguro [i] === seguro) {
						this.seguro.splice(i, 1);
					}
				}
			} else {
				this.seguro.$remove(function() {
				});
			}
     };

	 }
]);




procsModule.controller('modalResutl',  function ($scope, $modalInstance) {

  $scope.ok = function () {	
    $modalInstance.close();
   };


  $scope.cancel = function () {

    $modalInstance.dismiss('cancel');
    
  };
});


procsModule.controller('procsCreateController', ['$scope',  'Procs', 'Notify', '$mdToast', '$animate',
	function($scope, Procs, Notify, $mdToast, $animate) {

	  	// // Create new Pai
	  this.create = function() {
	  // Create new Pai object
	   var procse = new Procs ({
				name: this.name,
				costo: this.costo,
				proType: this.proType
	   });

			// // Redirect after save
	     procse.$save(function(response) {
             Notify.sendMsg('newPis', {'id': response._id});
			}, function(errorResponse) {
				//console.log (errorResponse);
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

procsModule.controller('procsDeleteController', ['$scope', 'Authentication', 'Procs', 'Notify', '$mdToast', '$animate',
	function($scope, Authentication, Procs, Notify, $mdToast, $animate) {
		$scope.authentication = Authentication;
	    // Update existing Pai
        
	      this.delete = function(procs) {
	      	//console.log ('passed');
	       var procs = new Procs({
                _id: $scope.procs._id
	       });

	       console.log($scope.procs);

	       procs.$remove(function(){
	        Notify.sendMsg('newPis', {'id': 'nada'});
	       }, function(errorResponse) {
		  	$scope.error = errorResponse.data.message;
		   });

	   };

	   this.showSimpleToast = function() {
	    $mdToast.show(
	      $mdToast.simple()
	        .content('Procedimiento Eliminado!!')
	        .position('bottom right')
	        .hideDelay(3000)
	    );
	  };
     	
	}
]);

procsModule.controller('procsUpdateController', ['$scope', 'Authentication',  'Notify', 'Procs', '$mdToast', '$animate',
	function($scope, Authentication, Notify, Procs, $mdToast, $animate) {
		//$scope.authentication = Authentication;
	    
	    // Update existing Procedimiento
	      this.update = function(updateprocs) {
          
	      	var procs = new  Procs ({
	      		_id: updateprocs._id,
				name: updateprocs.name,
				costo: updateprocs.costo,
				proType: updateprocs.proType
	       });

		  procs.$update(function() {
		  	 Notify.sendMsg('newPis', {'id': 'update'});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
	   };

	     this.showSimpleUdpdate = function() {
			    $mdToast.show(
			      $mdToast.simple()
			        .content('Procedimiento Guardado!!')
			        .position('bottom right')
			        .hideDelay(3000)
			    );
		};
     	
	}
]);


clienteModule.directive('procsList', ['Procs', 'Notify', function(Cliente, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'procedimientos/views/procedimientos-list.template.html',
     link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
            Notify.getMsg('newPis', function(event, data){
           
            scope.procsCtrl.doSearch(); 
         });
    }
   };
 }]);
