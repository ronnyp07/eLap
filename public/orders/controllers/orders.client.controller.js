'use strict';

var ordersModule = angular.module('orders');

// cliente controller
ordersModule.controller('ordersController', [
	'$scope', 
	'$http', 
	'$routeParams',  
	'$location', 
	'Authentication',
	'Doctors',
	'Patients', 
	'Cliente',
	'Orders',
	'Notify',
	'ngTableParams',
	'$modal', 
	'$log',
	'GetResults',
	function($scope, $http, $routeParams, $location, Authentication, Doctors, Patients,  Cliente, Orders, Notify, ngTableParams, $modal, $log, GetResults) {
		this.authentication = Authentication;

       $scope.edit = false;
	    // Find a list of cliente
       var params = {
       	  page: 1,            
	      count: 10,
       }

        $scope.data = {
          group1 : 'Ordenes'
          }

       var settings = {
       	total: 0,  
       	counts: [10,15,20],        
	    getData: function($defer, params) {
	            Orders.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
	        });
	      
	        }
       }

	  $scope.tableParams = new ngTableParams( params, settings);
	  console.log($scope.tableParams);

	  $scope.openExams = function(value, order){
	  	$scope.edit = value;
	  	//$scope.orderExam = order;
	  	console.log(order._id);
	  	$scope.orderExam = GetResults.getResultlist(order._id);
	  }


	    $scope.modelDetail = function (size, selectedPatient) {
       
       //console.log(selectedPatient);
        var modalInstance = $modal.open({
          templateUrl: 'orders/views/orders-list-details.template.html',
          controller: function ($scope, $modalInstance, patient) {
           var cleaned = {};
			$http.get('api/resultfilter',  {
			      params: {
			        orderId: selectedPatient._id
			      }
			    })
			    .then(function(result) {
			       $scope.orderExam = result.data;    
			    });

			   // $scope.orderExam = cleaned;
			    

         // $scope.orderExam = GetResults.getResultlist(selectedPatient._id);
          $scope.ok = function () {  
              $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
          
          $scope.setResult = function(result){
             $location.path('/result/:' + result._id);
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


	 }
]);

 ordersModule.controller('ordersCreateController', 
 	['$scope', 
 	 '$http',
 	'$routeParams', 
 	'Doctors',
	'Patients', 
	'Cliente',
	'Procs',
	'Orders',
	'ngTableParams',
 	'Notify',
 	'$mdToast', 
 	'$animate',
 	'$modal', 
	'$log',
	'Cierre',
	'Result',
	'$location',
 	function(
 	 $scope, 
 	 $http,
 	 $routeParams, 
 	 Doctors, 
 	 Patients,  
 	 Cliente,
 	 Procs, 
 	 Orders, 
 	 ngTableParams,
 	 Notify, 
 	 $mdToast, 
 	 $animate,
 	 $modal,
 	 $log,
 	 Cierre,
 	 Result,
 	 $location
 		//, $stateParams
 		) {
    
   //Auto Cierre



    var createCtrl = this;
    $scope.rcliente = {};
    $scope.rpaciente = {};
    $scope.rdoctor = {};
    $scope.rprocs = {};
    $scope.isNotSave = false;
    $scope.BcounterIncrement = 1;
    $scope.PcounterIncrement = 1;
    $scope.BLcounterIncrement = 1;
    $scope.addbAvalilable = false;

    //$scope.orderDetail = {};

 	//$scope.cliente = Cliente.get();
 	//$scope.paciente = Patients.get();
 	//$scope.doctor = Doctors.get();
    //$scope.getProcInit();
 	//$scope.procedimeinto = Procs.get();
 	$scope.orderDetail = [];
 	$scope.rpaciente.aseguradora = "";
 	
   $http.post('procs/getList').
		     success(function(data){
        $scope.procedimeinto = data;
        	console.log(procs.selectedIndex);
        console.log(data);     
		     }).
		     error(function(err){
		     	console.log(err);
   });

    $http.post('patient/getList').
    success(function(data){
    $scope.paciente = data;
    console.log(procs.selectedIndex);
     }).
     error(function(err){
   });

   $http.post('doctor/getList').
    success(function(data){
    $scope.doctor = data;
    console.log(procs.selectedIndex);
     }).
     error(function(err){
   });

    $http.post('cliente/getList').
    success(function(data){
    $scope.cliente = data;
    console.log(procs.selectedIndex);
     }).
     error(function(err){
   });

 	
  $scope.getProcInit = function(){ 
 	$http.post('procs/getList').
		     success(function(data){
        $scope.procedimeinto = data;  
		     }).
		     error(function(err){
		     	console.log(err);
   });
  };

 	    var params = {
       	  page: 1,            
	      count: 5
       }

       var settings = {
        total: $scope.orderDetail.length, // length of data
        getData: function($defer, params) {
        $defer.resolve($scope.orderDetail.slice((params.page() - 1) * params.count(), params.page() * params.count()));
           }
       };
 
    $scope.tableParams = new ngTableParams(params, settings);
   

   $scope.doSearch = function () {
        $scope.tableParams.reload();
    };  
 	 //$scope.getTotal();


 	$scope.addOrderProcs = function (procs) {
 		Procs.get({ procsId: procs }, function(procsResult){
            var costo = 0;   
		 $scope.orderDetail.push({"id": $scope.nserie, "procType":procsResult.proType,  "name": procsResult.name, "costo": procsResult.costo})
	     
        console.log($scope.orderDetail);
	     $scope.getProcInit();
	     $scope.doSearch();

	     if(procsResult.proType == 'B'){
	     	 if($scope.InitFlag == true){
	     	 	$scope.BcounterIncrement = 1;
	     	 	$scope.InitFlag = false;
	     	 } else {
	     	 	$scope.BcounterIncrement +=  1;
	     	 }    	
	     	//$scope.Bcounter = $scope.Bcounter + $scope.BcounterIncrement;
	     	$scope.flag = true;
	     }else if (procsResult.proType == 'BL'){
	     	if($scope.InitFlag == true){
	     	 	$scope.BLcounterIncrement = 1;
	     	 	$scope.InitFlag = false;
	     	 } else {
	     	 	$scope.BLcounterIncrement +=  1;
	     	 } 
	     	 $scope.BLflag = true;     	
	     }else{
	     	if($scope.InitFlag == true){
	     	 	$scope.PcounterIncrement = 1;
	     	 	$scope.InitFlag = false;
	     	 } else {
	     	 	$scope.PcounterIncrement +=  1;
	     	 }    	
	     	$scope.Pflag = true;
	     };

	     $scope.getTotal();
	     
	     console.log($scope.counter);
	    });
 		//Add the detail to the order array		
 		 //$scope.clearProcForm();
 		
 	}

    this.setClienteDetail = function(){
    var sCliente = $scope.clientes
    $scope.getCliente(sCliente);
    };

    $scope.getCliente = function(cliente){
    	Cliente.get({ clienteId: cliente }, function(clienteResult){
    	$scope.rcliente._id = clienteResult._id;
		$scope.rcliente.ID = clienteResult.clienteId;
	    $scope.rcliente.name = clienteResult.name;		
		$scope.rcliente.telefono = clienteResult.clienteTelefono;
		$scope.rcliente.IC = clienteResult.clienteRNC;
	    });
    };

    $scope.clearClientForm = function(){
    	$scope.cliente = Cliente.get();
    	$scope.rcliente = {};
    };

    this.setPatientDetail = function(){
        var sPatient = $scope.patient
        Patients.get({ patientId: sPatient }, function(patientResult){
		$scope.rpaciente.FullName = patientResult.patientFirstName + ' ' + patientResult.patientLastName;
		$scope.rpaciente._id = patientResult._id;
		$scope.rpaciente.ID = patientResult.patientId;
		$scope.rpaciente.telefono = patientResult.patientTelefono;
		$scope.rpaciente.polisa = patientResult.patientPolisa;
		$scope.rpaciente.age = patientResult.patientEdad;
		Cliente.get({ clienteId: patientResult.clientes }, function(clienteResult){
		$scope.rpaciente.aseguradora = clienteResult.name;
	
	    });
	    });
    };

     $scope.setDoctorDetail = function(){
        var sDoctor = $scope.doctors
        Doctors.get({ doctorId: sDoctor }, function(doctorResult){
          $scope.doctorName = doctorResult.firstName + ' ' + doctorResult.lastName;
		  $scope.rdoctor.ID = doctorResult.DoctorId;
		  $scope.rdoctor._id = doctorResult._id;
		  $scope.rdoctor.telefono = doctorResult.DoctorTelefono;
	    });
    };

     $scope.setProcsDetail = function(){
        var sProcs = $scope.procs
        console.log(procs);
        var nserie = '';
        Procs.get({ procsId: sProcs }, function(procsResult){
		 //$scope.rprocs.ID = procsResult.ProcsId;
		 $scope.rprocs.costo = procsResult.costo;
         console.log(procsResult);
		  var d = new Date();
				var y = d.getFullYear();
				var m = d.getMonth();
				var year = y.toString();
			    var info = {
			    	year: year,
			    	month: m,
			    	proType: procsResult.proType
		       };
          if(sProcs) {
          	console.log(info);
		   $http.post('api/counter', {info: info}).
		     success(function(data){
		   if(data.length >= 0){
		    	console.log(data);
		         var yResult = data[0].year.substr(2,2);
		         var mResult = parseInt(data[0].month) + 1;
		              
		         if(data[0].proType == 'B'){
		         	if($scope.flag == true){
		         	  $scope.nserie = mResult + data[0].proType + yResult + '-' + ($scope.currentCount + $scope.BcounterIncrement);
		         	  $scope.Bcounter = $scope.currentCount + $scope.BcounterIncrement;
		         	}else{
		         	 $scope.currentCount = parseInt(data[0].counter);
		         	 $scope.Bcounter = $scope.currentCount + 1;
		         	  // if($scope.currentCount == 1){
		         	  // 	$scope.Bcounter = 1
		         	  // 	$scope.InitFlag = true;
		         	  // } else {
		         	  // 	 $scope.Bcounter = $scope.currentCount + 1;
		         	  // }	         	
		         	 $scope.nserie = mResult + data[0].proType + yResult + '-' + $scope.Bcounter;
		              }
		         }else if (data[0].proType == 'BL') {
                    if($scope.BLflag == true){
		         	  $scope.nserie = data[0].proType + yResult + '-' + ($scope.blcurrentCount + $scope.BLcounterIncrement);
		         	  $scope.BLcounter = $scope.blcurrentCount + $scope.BLcounterIncrement;
		         	}else{
		         	 $scope.blcurrentCount = parseInt(data[0].counter);
		         	  $scope.BLcounter = $scope.blcurrentCount + 1;
		         	  // if($scope.blcurrentCount == 1){
		         	  // 	$scope.BLcounter = 1
		         	  // 	$scope.InitFlag = true;
		         	  // } else {
		         	  // 	 $scope.BLcounter = $scope.blcurrentCount + 1;
		         	  // }	         	
		         	 $scope.nserie =  data[0].proType + yResult + '-' + $scope.BLcounter;
		            }

		         }else {
		         	if($scope.Pflag == true){
		         	$scope.nserie = data[0].proType + yResult + '-' + ($scope.pcurrentCount + $scope.PcounterIncrement);
		         	$scope.Pcounter = $scope.pcurrentCount + $scope.PcounterIncrement;
		         	}else{
		         	$scope.pcurrentCount = parseInt(data[0].counter);
		         	$scope.Pcounter = $scope.pcurrentCount + 1;
		         	  // if($scope.pcurrentCount == 1){
		         	  // 	$scope.Pcounter = 1
		         	  // 	$scope.InitFlag = true;
		         	  // } else {
		         	  // 	 $scope.Pcounter = $scope.pcurrentCount + 1;
		         	  // }	         	
		         	 $scope.nserie = data[0].proType + yResult + '-' + $scope.Pcounter;
		              } 

		         };	        
		         $scope.rprocs.ID = $scope.nserie;
		     }else {
		     	console.log('something here');
		     }

		     }).
		     error(function(err){
		     	console.log(err);
		     });
		 }

	    });



    };
    
     $scope.clearPatientForm = function(){
    	$scope.paciente = Patients.get();
    	$scope.rpaciente = {};
    };

    $scope.clearDoctorForm = function(){
    	$scope.doctor = Doctors.get();
    	$scope.rdoctor = {};
    };

    $scope.clearProcForm = function(){	
    	$scope.rprocs = {};
    	$scope.procedimeinto =  Procs.get();
    };

    $scope.getTotal = function(){
          $scope.total = 0
          for(var i = 0; i < $scope.orderDetail.length; i++ ){
          	$scope.orderd = $scope.orderDetail[i];
          	$scope.total += Number($scope.orderd.costo ? $scope.orderd.costo : 0 )
          } 
          return $scope.total;   	
    }

   this.deleteProcs = function(index) { 
     $scope.orderDetail.splice(index, 1);
     //$scope.counter = $scope.counter - 1;
     $scope.BcounterIncrement -= 1
     $scope.doSearch();
   };

   $scope.clearOrderForm =  function(){
     	 $scope.orderDetail = [];
     	 $scope.doSearch();
     	 $scope.note = "";
     	 $scope.duedate = "";
     	 $scope.autorisation = "";
     	 $scope.statusOrder = "";

   };

   $scope.showSimpleUdpdate = function() {
	    $mdToast.show(
		$mdToast.simple()
	    .content('Folio Guardado Exitosamente!!')
	    .position('bottom right')
	    .hideDelay(3000)
		);
   };

   $scope.cleanForm = function(){
          $scope.clearDoctorForm();
	      $scope.clearPatientForm();
	      $scope.clearClientForm();
	      //$scope.clearClientForm();
	      $scope.clearOrderForm();
	      $scope.showSimpleUdpdate();
   };

  this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'clientes/views/create-clientes.client.view.html',
		      controller: 'modalResutl',
		      size: size
		 });

	 modalInstance.result.then(function (selectedItem) {
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
  };


    $scope.modelRemove = function (size, selectedcliente) {
		    var modalInstance = $modal.open({
		      templateUrl: 'orders/views/orders-cancel.template.html',
		      controller: 
		      //'modalDelete',
		      function ($scope, $modalInstance) {
                  $scope.ok = function () {  
                  console.log('works');                 
                  $scope.cleanForm();
                  $modalInstance.close();
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size
	});

     modalInstance.result.then(function (selectedcliente) {

	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};


    // Create new Pai
 	this.create = function() {

            var patientClient = false;
            if($scope.clientes == ""){
            	patientClient = true;
            }
 	      var orders = new Orders({
               clienteName : $scope.rcliente.name,
               clienteId: $scope.rcliente.ID,
               clienteIc: $scope.rcliente.IC,
               proclist: $scope.orderDetail,
               nota: $scope.note,
               total: $scope.total ,
               statusOrder : $scope.statusOrder,
               fechaValida: $scope.duedate,
               patientName: $scope.rpaciente.FullName,
               patientId: $scope.rpaciente.ID,
               patientsClient : patientClient,
               patientEdad: $scope.rpaciente.age,
               doctorName : $scope.doctorName,
               doctorId: $scope.rdoctor.ID,
               cliente: $scope.rcliente._id,
               doctor: $scope.rdoctor._id,
               patients: $scope.rpaciente._id
 	      });
        $scope.orderResult = orders;
        
           
        
        var d = new Date();
	    var y = d.getFullYear();
		var m = d.getMonth();
		var year = y.toString();
        if($scope.Bcounter){
			    var info = {
			    	year: year,
			    	month: m,
			    	proType: 'B',
			    	newCount: $scope.Bcounter
		       };
        $http.post('/api/count', {info: info})
        .success(function(){
        	$scope.BcounterIncrement = 0;
        }).error(function(err){
		     	console.log(err);
		 });
	   };

	    if($scope.Pcounter){
        	var d = new Date();
				var y = d.getFullYear();
				var m = d.getMonth();
				var year = y.toString();
			    var info = {
			    	year: year,
			    	month: "",
			    	proType: 'P',
			    	newCount: $scope.Pcounter 
		       };
        $http.post('/api/count', {info: info})
        .success(function(){
        	$scope.PcounterIncrement = 0;
        }).error(function(err){
		     	console.log(err);
		 });
	   };

	    if($scope.BLcounter){
        	var d = new Date();
				var y = d.getFullYear();
				var m = d.getMonth();
				var year = y.toString();
			    var info = {
			    	year: year,
			    	month: "",
			    	proType: 'BL',
			    	newCount: $scope.BLcounter 
		       };
        $http.post('/api/count', {info: info})
        .success(function(){
        	$scope.BLcounterIncrement = 0;
        }).error(function(err){
		     	console.log(err);
		 });
	   };

 	    orders.$save(function(response){
 	     
	      Notify.sendMsg('newPis', {'id': 'nada'});
	      $scope.orderResponse = response;
          console.log($scope.orderResponse.proclist);
 	      
         for(var i = 0; i < $scope.orderResponse.proclist.length; i++ ){
          var report = new Result({
	          rSereal: $scope.orderResponse.proclist[i].id,
	          tipomuestra : $scope.orderResponse.proclist[i].procType,
	          tipomuestraDesc: $scope.orderResponse.proclist[i].name,
	          orders: $scope.orderResponse._id
           }); 


         report.$save(function(response){

         	  $location.path('/ordenesList');
          }, function(errorResponse){
	       // En otro caso, presentar al usuario el mensaje de error
	      $scope.error = errorResponse.data.message
	      console.log($scope.error);
	      });
         };

	     // $scope.cleanForm();

	   
         
	    }, function(errorResponse) {
	       // En otro caso, presentar al usuario el mensaje de error
	    $scope.error = errorResponse.data.message
	    console.log($scope.error);
	   });
 	};
     	
	}

 ]);

 ordersModule.directive('autoComplete', function(){
 	   return{
           
 	   };
 });
			



// clienteModule.controller('clienteDeleteController', ['$scope', 'Authentication', 'Cliente', 'Notify',
// 	function($scope, Authentication, Cliente, Notify) {
// 		//$scope.authentication = Authentication;
        
// 	      this.delete = function(cliente) {
// 	       var cliente = new Cliente({
//                 _id: $scope.cliente._id
// 	       });

// 	       cliente.$remove(function(){
// 	        Notify.sendMsg('newPis', {'id': 'nada'});
// 	       }, function(errorResponse) {
// 		  	$scope.error = errorResponse.data.message;
// 		   });
// 	   };	
// 	}
// ]);

// clienteModule.controller('clienteUpdateController', ['$scope', 'Authentication', 'Cliente', 'Notify', 'Pais', 'Ciudad', 'Sector', '$mdToast', '$animate',
// 	function($scope, Authentication, Cliente, Notify, Pais, Ciudad, Sector, $mdToast, $animate) {

// 		 this.pais = Pais.query();
// 		 this.ciudad = Ciudad.query();
// 		 this.sector = Sector.query();
		 
// 		 this.filterByPais = function(){
//             this.sector = {};
           
// 		 };

// 		 this.filterByCiudad = function(){
// 		 	this.sector = Sector.query();
// 		 };
	 
// 	    this.update = function(updateCliente) {
// 	   	   //  console.log(updateCliente);

// 	      	var cliente  = new Cliente ({
// 	      		_id: updateCliente._id,
// 				name: updateCliente.name,
// 				tipo: updateCliente.tipo,
//                 clienteRNC: updateCliente.clienteRNC,
//                 clienteTelefono: updateCliente.clienteTelefono,
//                 pais: $scope.cliente.rpais,
// 	            ciudad: $scope.cliente.rciudad,
// 	            sector: $scope.cliente.rsector,
// 	            clienteDireccion: updateCliente.clienteDireccion
// 	       });

// 	     this.showSimpleUdpdate = function() {
// 			    $mdToast.show(
// 			      $mdToast.simple()
// 			        .content('Cliente Guardado!!')
// 			        .position('bottom right')
// 			        .hideDelay(3000)
// 			    );
// 		};
		
// 		   cliente.$update(function() {
// 		  	 Notify.sendMsg('newPis', {'id': 'update'});
// 			}, function(errorResponse) {
// 				$scope.error = errorResponse.data.message;
// 			});
// 	   };
     	
// 	}
// ]);

//  clienteModule.controller('modalResutl',  function ($scope, $modalInstance) {

//    $scope.ok = function () {
//      $modalInstance.close();
//     };


//    $scope.cancel = function () {
//      $modalInstance.dismiss('cancel');
//    };
//  });



//  			//console.log(clientes);
//  			// Redirect after save
// 			clientes.$save(function(response) {
//               Notify.sendMsg('newPis', {'id': response._id});
//              // Notify.sendbroadCast('noError');*/
//              // this.cliente = cliente.query();
//  				// Clear form fields
//  			}, function(errorResponse) {
//  				$scope.error = errorResponse.data.message;
//  			});
//  		 };

//  	}
//  ]);



ordersModule.directive('orderList', ['Orders', 'Notify', function(Orders, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'orders/views/orders-list.template.html',
     link: function(scope, element, attr){          // when a new cliente is added update the cliente List..

            Notify.getMsg('newPis', function(event, data){                 	
            scope.clienteCtrl.doSearch(); 
         });
    }
   };
 }]);

ordersModule.directive('resultList', ['Orders', 'Notify', 'Result', function(Orders, Notify, Result){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'results/views/result-list.template.html',
     link: function(scope, element, attr){          // when a new cliente is added update the cliente List..

            Notify.getMsg('newPis', function(event, data){                 	
         });
    }
   };
 }]);




      //  window.onafterprint = function () {
      //           // clean the print section before adding new content
      //           printSection.innerHTML = '';
      //  }

      // var printSection = document.getElementById('printSection');
      //   // if there is no printing section, create one
      //   if (!printSection) {
      //       printSection = document.createElement('div');
      //       printSection.id = 'printSection';
      //       document.body.appendChild(printSection);
      //   };

      //   function printElement(elem) {
      //       // clones the element you want to print
      //       var domClone = elem.cloneNode(true);
      //       printSection.appendChild(domClone);
      //       window.print();
      //   }

         //    Notify.getMsg('newPis', function(event, data){            	
         //    scope.clienteCtrl.doSearch(); 
         // });



