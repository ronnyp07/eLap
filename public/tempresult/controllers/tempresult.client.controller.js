'use strict';

var tempresultModule = angular.module('tempresult');

tempresultModule.controller
('tempresultController', 
['$scope', 
 '$http',
 '$location',  
 'Authentication', 
 'Tempresult', 
 'ngTableParams',
 '$modal', 
  '$log',
  'ConvertArray',
 function($scope, $http,  $location,  Authentication, Tempresult, ngTableParams, $modal, $log, ConvertArray) {
     

    var tags = "Negativo,Inflamacion leve, Celula superficiales X, Flora mixta";
    

   $scope.currentPage = 1;
   $scope.pageSize = 10;
   
   $scope.q = "";

    $scope.users = [];
    $scope.totalUsers = 0;
    $scope.usersPerPage = 25; // this should match however many results your API puts on one page
    getResultsPage(1, $scope.q);

    $scope.pagination = {
        current: 1
    };

    $scope.pageChanged = function(newPage, filter) {
        getResultsPage(newPage, filter);
    };

    function getResultsPage(pageNumber, filterLetter) {
        $http.get('api/template',  {
      params: {
        page: pageNumber,
        count: 4,
        filter: filterLetter
      }
    })
      .then(function(result) {
                $scope.users = result.data.results;
                $scope.totalUsers = result.data.total
                console.log(result);  
    });
    }
    


  



    //Open the middleware to open a single cliente modal.
     this.modelRemove = function (size, selectedcliente) {
          $scope.patient = selectedcliente;
        var modalInstance = $modal.open({
          templateUrl: 'tempresult/views/patient-delete.template.html',
          controller: 
          //'modalDelete',
          function ($scope, $modalInstance, patient) {
                 $scope.patient = patient;
      
                  $scope.ok = function () {
                   //console.log($scope.cliente);
                  // $scope.doSearch();
                  $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            patient: function () {
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

        //Open the middleware to open a single pais modal.
   this.modelUpdate = function (size, selectedPatient) {
        var modalInstance = $modal.open({
          templateUrl: 'tempresult/views/edit-patient.client.view.html',
          controller: function ($scope, $modalInstance, patient) {
               

          $scope.ok = function () {  
              $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            patient: function () {
              return selectedPatient;
            }
          }
     });

   modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    this.modelCreate = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'tempresult/views/create-tempresult.client.view.html',
          controller: function ($scope, $modalInstance) {

          $scope.ok = function () {  
              $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size
     });

     modalInstance.result.then(function (selectedItem) {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    this.doSearch = function () {
        $scope.tableParams.reload();
    };  

 }

]);

tempresultModule.controller
  ('tempresultCreateController', 
  ['$scope', 
   '$http', 
   '$routeParams', 
   'Tempresult', 
   function($scope, $http, $routeParams, Tempresult) {

    this.create = function(){
     var template = new Tempresult({
          reportname : $scope.reportname,
          tipomuestra : $scope.proType,
          resultado: $scope.resultado,
          tecnica: $scope.tecnica,
          diagnostico : $scope.diagnostico,
          nota: $scope.nota
        });

      template.$save(function(response){
        console.log(response); 
      }, function(errorResponse) {
         // En otro caso, presentar al usuario el mensaje de error
      $scope.error = errorResponse.data.message
      console.log($scope.error);
     });

    };
    
    }
]);



tempresultModule.controller
  ('tempresultUpdateController', 
  ['$scope', 
   '$http', 
   '$routeParams',  
   'Authentication', 
   'Tempresult', 
   function($scope, $http, $routeParams,  Authentication, Tempresult) {

    }
]);

tempresultModule.controller('tempresultDeleteController', ['$scope', 'Authentication', 'tempresult', 'Notify', '$mdToast', '$animate',
  function($scope, Authentication, tempresult, Notify, $mdToast, $animate) {
    $scope.authentication = Authentication;
      // Update existing Pai
        
        this.delete = function(patient) {
          //console.log ('passed');
         var patient = new tempresult({
                _id: $scope.patient._id
         });

         console.log($scope.patient);

         patient.$remove(function(){
          Notify.sendMsg('newPis', {'id': 'nada'});
         }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
       });

     };

     this.showSimpleToast = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Paciente Eliminado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };
      
  }
]);


tempresultModule.directive('templateList', ['tempresult', 'Notify', function(Cliente, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'tempresult/views/tempresult-list.template.html',
     link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
            Notify.getMsg('newPis', function(event, data){
                scope.pacientsCtrl.doSearch(); 
         });
    }
   };
}]);