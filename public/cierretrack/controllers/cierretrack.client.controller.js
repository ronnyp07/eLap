'use strict';


var cierreModule = angular.module('cierre');


cierreModule.controller( 'CtrlCierre', 
['$scope',
'Cierre', 
'$animate',
'$modal', 
'$log',
function($scope, Cierre , $animate,
 	$modal, 
	$log) {

    var d = new Date();
	var n = d.getFullYear();
	$scope.monthN = d.getMonth();
	$scope.date = n.toString();
 	$scope.data = {
      group1 : 'Cierre Mensual'
    };
   

   $scope.read = function(data){
     console.log(data);
   };
 

var month = [
{
   value: 0,
   desc: "Enero"
},
{
   value: 1,
   desc: "Febrero"
},{
   value: 2,
   desc: "Marzo"
},{
   value: 3,
   desc: "Abril"
},{
   value: 4,
   desc: "Mayo"
},{
   value: 5,
   desc: "Junio"
},{
   value: 6,
   desc: "Julio"
},{
   value: 7,
   desc: "Agosto"
},{
   value: 8,
   desc: "Septiembre"
},{
   value: 9,
   desc: "Octubre"
},{
   value: 10,
   desc: "Noviembre"
},{
   value: 11,
   desc: "Diciembre"
}
]



$scope.monthResult = month.filter(function(item){
            return (item.value >= ($scope.monthN -1))
 });



$scope.modelCierre = function (size, selectedcliente) {
	      //  console.log($scope.monthselected);

		    var modalInstance = $modal.open({
		      templateUrl: 'cierretrack/views/cierretrack-comfirm.template.html',
		      controller: 
		      //'modalDelete',
		      function ($scope, $modalInstance, selectedMonth) {
                 $scope.sMonth = selectedMonth;
                   
                  $scope.ok = function () {
                  console.log( $scope.sMonth);
                  // $scope.doSearch();
                  $modalInstance.close($scope.procs);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        selectedMonth: function () {
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

$scope.modelYearCierre = function (size, selectedcliente) {

        var modalInstance = $modal.open({
          templateUrl: 'cierretrack/views/cierretrack-yearcomfirm.template.html',
          controller: 
          //'modalDelete',
          function ($scope, $modalInstance, selectedMonth) {
                   
                  $scope.ok = function () {
                  
                  $modalInstance.close();
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            selectedMonth: function () {
              return selectedcliente;
            }
          }
     });

   modalInstance.result.then(function (selectedcliente) {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
};



}]);



cierreModule.controller( 'confirmCtrl', 
['$scope',
'Cierre',
function($scope, Cierre){
        
$scope.setCierre = function(r){
    
	var d = new Date();
	var m = d.getMonth();
	var n = d.getFullYear();
	var year = n.toString();

     var cierre = new Cierre({
        year : year,
        month: parseInt($scope.sMonth) + 1,
        proType: 'B',
        counter: 0
     });

     cierre.$save(function(response) {
             //Notify.sendMsg('newPis', {'id': response._id});
			}, function(errorResponse) {
				//console.log (errorResponse);
	  $scope.error = errorResponse.data.message;
    });
};
  
}]);

cierreModule.controller( 'confirmyearCtrl', 
['$scope',
'Cierre',
function($scope, Cierre){
        
$scope.setyearCierre = function(r){
    
  var d = new Date();
  var m = d.getMonth();
  var n = d.getFullYear();
  var year = n.toString();

  var cierre = new Cierre({
        year : year,
        proType: 'P',
        counter: 1
     });

    cierre.$save(function(response) {
             //Notify.sendMsg('newPis', {'id': response._id});
      }, function(errorResponse) {
        //console.log (errorResponse);
    $scope.error = errorResponse.data.message;
    });
    
     var pcierre = new Cierre({
        year : year,
        proType: 'BL',
        counter: 1
     });

    pcierre.$save(function(response) {
             //Notify.sendMsg('newPis', {'id': response._id});
      }, function(errorResponse) {
        //console.log (errorResponse);
    $scope.error = errorResponse.data.message;
    });
  
};
  
}]);

