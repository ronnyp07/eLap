'use strict';

var seguroModule = angular.module('seguros');

// seguro controller
seguroModule.controller('seguroController', [
  '$scope', 
  '$routeParams',  
  'Authentication', 
  //'Seguro', 
  'Notify',
  '$modal', 
  '$log',
  function($scope, $routeParams,  Authentication,  Notify, $modal, $log) {
    this.authentication = Authentication;

      // Find a list of seguro
    // this.seguro = Seguro.query();
    // this.pais = Pais.query();

  //Open the middleware to open a single seguro modal.
   this.modelCreate = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'seguro/views/create-seguro.client.view.html',
          controller: 'modalResutl',

          size: size
     });

   modalInstance.result.then(function (selectedItem) {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


     //Open the middleware to open a single seguro modal.
   this.modelUpdate = function (size, selectedseguro) {

            console.log(selectedseguro);
        var modalInstance = $modal.open({
          templateUrl: 'seguro/views/edit-seguro.client.view.html',
          controller: function ($scope, $modalInstance, seguro) {
                 $scope.seguro = seguro;

                 //$scope.seguro.rpais = selectedseguro.pais._id;

             
                 Notify.sendbroadCast('noError', 'this is a message');

                 $scope.ok = function () {  
                  $modalInstance.close($scope.seguro);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            seguro: function () {
              return selectedseguro;
            }
          }
     });

   modalInstance.result.then(function (selectedseguro) {
      $scope.selected = selectedseguro;
      //console.log($scope.selected);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


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




seguroModule.controller('modalResutl',  function ($scope, $modalInstance) {

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


seguroModule.controller('seguroCreateController', ['$scope',  'seguro', 'Notify', 'Pais',
  function($scope, seguro, Notify, Pais) {

    this.pais = Pais.query();
      // // Create new Pai
    this.create = function() {
      // Create new Pai object
     var seguros = new seguro ({
        name: this.name,
        pais: this.Selectedpais
     });
      

      console.log(seguros);
      // Redirect after save
      seguros.$save(function(response) {
             Notify.sendMsg('newPis', {'id': response._id});
            // Notify.sendbroadCast('noError');*/
            // this.seguro = seguro.query();
        // Clear form fields
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

  }
]);

seguroModule.controller('seguroUpdateController', ['$scope', 'Authentication', 'seguro', 'Pais', 'Notify',
  function($scope, Authentication, seguro, Pais, Notify) {
    //$scope.authentication = Authentication;
      // Update existing Pai
        
          //this.pais = Pais.query();
        this.update = function(updateseguro) {
          
          var seguro = new seguro ({
            _id: updateseguro._id,
        name: updateseguro.name,
        pais: $scope.seguro.rpais
         });

      seguro.$update(function() {
         Notify.sendMsg('newPis', {'id': 'update'});
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
     };
      
  }
]);


seguroModule.directive('seguroList', ['Seguro', 'Notify', function(Seguro, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'seguro/views/seguro-list.template.html',
    link: function(scope, element, attr){
         // when a new seguro is added update the seguro List..
         // Notify.getMsg('newseguro', function(event, data){
         //   scope.rpais = data;
            
         // });

           Notify.getMsg('newPis', function(event, data){
            console.log('got the message');
            scope.seguroCtrl.seguro = Seguro.query();
         });
    }
  };
}]);
