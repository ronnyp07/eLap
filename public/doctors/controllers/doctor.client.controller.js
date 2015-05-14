'use strict';

var doctorModule = angular.module('doctor');

doctorModule.controller
('doctorsController', 
['$scope', 
 '$http', 
 '$routeParams', 
 '$location',
 'Doctors',  
 'Authentication', 
 'ngTableParams',
 '$modal', 
  '$log',
 'Pais',
 'Ciudad',
 'Sector',
 'Cliente',
 function($scope, $http, $routeParams, $location, Doctors, Authentication, ngTableParams, $modal, $log,
  //Seguros, 
  Pais, Ciudad, Sector, Cliente) {
      
      // var patient = Patients.query()
       var params = {
          page: 1,            
          count: 15,
          filter: {             
              name: name
        }
       }

       var settings = {
      //  groupBy: 'tipo',
         total: 0,  
         counts: [15,20,25],        
         getData: function($defer, params) {
         Doctors.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
               // console.log(response);
          });
        
          }
       }

    $scope.calculateAge = function calculateAge(birthday) { 
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    console.log(Math.abs(ageDate.getUTCFullYear() - 1970));
    //return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    $scope.tableParams = new ngTableParams( params, settings);
    //Open the middleware to open a single cliente modal.
     this.modelRemove = function (size, selectedcliente) {
          $scope.patient = selectedcliente;
        var modalInstance = $modal.open({
          templateUrl: 'patients/views/patient-delete.template.html',
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
   this.modelUpdate = function (size, selectedDoctor) {

        var modalInstance = $modal.open({
          templateUrl: 'doctors/views/edit-doctor.client.view.html',
          controller: function ($scope, $modalInstance, doctor) {
                $scope.doctor = doctor;
                $scope.doctor.rpais = selectedDoctor.pais;
                $scope.doctor.rciudad = selectedDoctor.ciudad;
                $scope.doctor.rsector = selectedDoctor.sector;
                // console.log($scope.doctor.rsector);

          $scope.ok = function () {  
              $modalInstance.close($scope.doctor);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            doctor: function () {
              return selectedDoctor;
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
          templateUrl: 'doctors/views/create-doctor.client.view.html',
          controller: 'modalResutl',
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

doctorModule.controller
  ('doctorCreateController', 
  ['$scope', 
   '$http', 
   '$routeParams',  
   'Authentication', 
   'Doctors',
   'Pais',
   'Ciudad',
   'Sector',
   'Cliente',
   'Notify', '$mdToast', '$animate',
   function($scope, $http, $routeParams,  Authentication, 
    Doctors, 
    Pais, Ciudad, Sector, Cliente, Notify, $mdToast, $animate) {

    this.pais = Pais.query();
    //this.cliente = Cliente.get();
     this.ciudad = Ciudad.query();
     this.sector = Sector.query();

    this.filterByPais = function(){
      this.sector = {};      
    };

    this.filterByCiudad = function(){
      this.sector = Sector.query();
    };

    this.DoctorCI = {};
    $scope.authentication = Authentication;
    $scope.referred = true;
    //$scope.seguros = Seguros.query();

    this.showPatientSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

    this.create = function(){
    this.DoctorCI = {
      tipo: this.DoctorCI.tipo, 
      value: this.DoctorCI.tipovalue 
    }

      var doctor = new Doctors({
      DoctorCI: this.DoctorCI,
      firstName: this.firstName,
      lastName: this.lastName,
      DoctorTelefono : this.DoctorTelefono,
      DoctorEmail: this. DoctorEmail,
      DoctorDireccion: this.DoctorDireccion,   
      pais: this.doctorPais,
      ciudad: this.doctorCiudad,
      sector: this.doctorSector
      });

      console.log(doctor);

      // Usar el método '$save' de Patient para enviar una petición POST apropiada
      doctor.$save(function(response){ 
      Notify.sendMsg('newPis', {'id': 'nada'});
      }, function(errorResponse) {
       // En otro caso, presentar al usuario el mensaje de error
       $scope.error = errorResponse.data.message
       console.log($scope.error);
       });
    };
    }
]);

doctorModule.controller
  ('doctorUpdateController', 
  ['$scope', 
   '$http', 
   '$routeParams',  
   'Authentication', 
   'Doctors', 
   //'Seguros',
   'Pais',
   'Ciudad',
   'Sector',
   'Cliente',
   'Notify', '$mdToast', '$animate',
   function($scope, $http, $routeParams,  Authentication, Doctors, 
    Pais, Ciudad, Sector, Cliente, Notify, $mdToast, $animate) {

     this.pais = Pais.query();
     this.ciudad = Ciudad.query();
     this.sector = Sector.query();
     this.cliente = Cliente.get();
     
     this.filterByPais = function(){
            this.sector = {}; 
     };

     this.filterByCiudad = function(){
      this.sector = Sector.query();
     };

    this.showDoctorSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

    this.update = function(selectedDoctor){
    this.DoctorCI = {
      tipo: selectedDoctor.DoctorCI.tipo, 
      value: selectedDoctor.DoctorCI.value 
    }
    // Usar los campos form para crear un nuevo objeto $resource Patient
      var doctors = new Doctors({
      _id: selectedDoctor._id,
      DoctorCI : this.DoctorCI,
      firstName: selectedDoctor.firstName,
      lastName: selectedDoctor.lastName,
      DoctorEmail : selectedDoctor.DoctorEmail,
      DoctorTelefono: selectedDoctor.DoctorTelefono,
      DoctorDireccion: selectedDoctor.DoctorDireccion,
      pais: $scope.doctor.rpais,
      ciudad: $scope.doctor.rciudad,
      sector: $scope.doctor.rsector

      });

      console.log(doctors);
      //
     // Usar el método '$save' de Patient para enviar una petición POST apropiada
      doctors.$update(function(){ 
      Notify.sendMsg('newPis', {'id': 'nada'});
      }, function(errorResponse) {
       $scope.error = errorResponse.data.message
       });
    };
    }
]);

doctorModule.controller('patientDeleteController', ['$scope', 'Authentication', 'Patients', 'Notify', '$mdToast', '$animate',
  function($scope, Authentication, Patients, Notify, $mdToast, $animate) {
    $scope.authentication = Authentication;
      // Update existing Pai
        
        this.delete = function(patient) {
          //console.log ('passed');
         var patient = new Patients({
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


doctorModule.directive('doctorsList', ['Patients', 'Notify', function(Cliente, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'doctors/views/doctor-list.template.html',
     link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
            Notify.getMsg('newPis', function(event, data){
                scope.doctorsCtrl.doSearch(); 
         });
    }
   };
 }]);