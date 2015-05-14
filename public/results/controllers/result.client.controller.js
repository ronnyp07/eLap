'use strict';

var resultModule = angular.module('result');

resultModule.controller('resultController', [
	'$scope', 
	'$http', 
	'$routeParams',  
	'$location', 
	'Authentication',
	'Result',
	'Orders',
	'Notify',
	'ngTableParams',
	'$modal', 
	'$log',
	'ConvertArray',
	'GetResults',
	function($scope, $http, $routeParams, $location, Authentication, Result, Orders, Notify, ngTableParams, $modal, $log, ConvertArray, GetResults) {
		this.authentication = Authentication;

		var param1= $routeParams.resultId;
		var resultId = param1.replace(':', '')
        var resultado = [];
        var reportStatus = "";
        $scope.resultDetails = {}
	    
	 
	 //    $scope.resultDetails = Result.get({ 
		// 		resultId: resultId
		// });

         $http.post('api/resultfilter', {resultId: resultId}).
		     success(function(data){
		     	$scope.resultData = data;
		     	$scope.resultDetails.diagnostico = $scope.resultData[0].diagnostico
                $scope.resultDetails.resultado = $scope.resultData[0].resultado.toString();
                $scope.resultDetails.resultadoArray = $scope.resultData[0].resultado;
                $scope.resultDetails.rSereal = $scope.resultData[0].rSereal;
                $scope.resultDetails.nombre = $scope.resultData[0].orders.patientName;
                $scope.resultDetails.doctorName = $scope.resultData[0].orders.doctorName;
                $scope.resultDetails.clienteName = $scope.resultData[0].orders.clienteName; 
                $scope.resultDetails.created = $scope.resultData[0].orders.created;
                $scope.resultDetails.patiendEdad = $scope.resultData[0].orders.patientEdad;
                $scope.resultDetails.tipomuestraDesc = $scope.resultData[0].tipomuestraDesc;
                $scope.resultDetails.tipomuestra = $scope.resultData[0].tipomuestra;
                $scope.resultDetails.total = $scope.resultData[0].total;
                $scope.resultDetails.noAutho = $scope.resultData[0].noAutho;
                $scope.resultDetails.reportStatus = $scope.resultData[0].reportStatus;

                if($scope.resultData[0].tipomuestra == 'C'){
                	$scope.resultDetails.reportName = 'Reporte Citológico';
                }else if ($scope.resultData[0].tipomuestra == 'B'){
                	$scope.resultDetails.reportName = 'Reporte Histopatológico';
                }
                
        //          var resultadoString = "";
			     // for(var i = 0; i < resultado.length; i++){
			     //    resultadoString = resultadoString + ', '  + resultado[i];
     //}
		 }).
		 error(function(err){
		  console.log(err);
		});

		
	$scope.update = function(){
          if($scope.resultDetails.resultado){
            resultado = ConvertArray.arrayConvert($scope.resultDetails.resultado);
          }
          // if($scope.resultDetails.reportStatus == 'undefined'){
          // 	$scope.resultDetails.reportStatus = "Pendiente"
          // }

             var resultupdate = new Result({
             	 _id: resultId,
               resultado: resultado,
               diagnostico:  $scope.resultDetails.diagnostico,
               noAutho: $scope.resultDetails.noAutho,
               total: $scope.resultDetails.total,
               reportStatus: $scope.resultDetails.reportStatus
             })

             console.log($scope.resultDetails.reportStatus);
             
          resultupdate.$update(function(){ 
	      }, function(errorResponse) {
	       $scope.error = errorResponse.data.message
	       });

          location.reload(true);
		};

	 }
]);

 resultModule.controller('resultUpdateController', 
 	['$scope', 
 	 '$http',
 	'$routeParams', 
	'Orders',
	'ngTableParams',
 	'Notify',
 	'$mdToast', 
 	'$animate',
 	'$modal', 
	'$log',
 	function(
 	 $scope, 
 	 $http,
 	 $routeParams, 
 	 Orders, 
 	 ngTableParams,
 	 Notify, 
 	 $mdToast, 
 	 $animate,
 	 $modal,
 	 $log
 		//, $stateParams
 		) {
    
   //Auto Cierre


     } 
 ]);

  resultModule.controller('resultListController', 
 	['$scope', 
 	 '$http',
 	'$routeParams', 
	'Orders',
	'ngTableParams',
 	'Notify',
 	'$mdToast', 
 	'$animate',
 	'$modal', 
	'$log',
	'$location',
 	function(
 	 $scope, 
 	 $http,
 	 $routeParams, 
 	 Orders, 
 	 ngTableParams,
 	 Notify, 
 	 $mdToast, 
 	 $animate,
 	 $modal,
 	 $log,
 	 $location
 		//, $stateParams
 		) {

   $scope.date = {
        startDate: moment().subtract("months", 1),
        endDate: moment()
    };

    $scope.getDate = function(){
    	console.log($scope.date);
    }

   

   $scope.getDatecurrentPage = 1;
   $scope.pageSize = 10;
   
   $scope.q = "";

    $scope.users = [];
    $scope.totalUsers = 0;
    $scope.usersPerPage = 25; // this should match however many results your API puts on one page
    getResultsPage(1, $scope.q, setDateVariables());

    // $scope.pagination = {
    //     current: 1
    // };

    $scope.dateChange = function(pagination, filter){
    	console.log(pagination);
    	 //$scope.pagination.current = ; 
    	 getResultsPage($scope.cPage, filter, setDateVariables());
    };


    $scope.pageChanged = function(newPage, filter, pgCurrent) {
    	console.log($scope.cPage);
    	 var startDate = new Date($scope.date.startDate);
    	 var endDate = new Date($scope.date.endDate);

    	// var startDateMonth = moment($scope.date.startDate).month();
    	// var startDateYear = moment($scope.date.startDate).year();
    	// var startDateDays = startDate.getDate();
    
        var dateFilter = {
        	startDate: startDate,
        	endDate: endDate
        	
        }

        getResultsPage(newPage, filter, setDateVariables());

    };

    function setDateVariables(){
         var startDate = new Date($scope.date.startDate);
    	 var endDate = new Date($scope.date.endDate);
    	// var startDateMonth = moment($scope.date.startDate).month();
    	// var startDateYear = moment($scope.date.startDate).year();
    	// var startDateDays = startDate.getDate();
    
        var dateFilter = {
        	startDate: startDate,
        	endDate: endDate
        	
        }

    	return dateFilter;
    }

 	function getResultsPage(pageNumber, filterLetter, dateFilter) {
 		console.log(dateFilter.startDate);
        $http.get('/api/result',  {
      params: {
        page: pageNumber,
        count: 5,
        filter: filterLetter
         ,
         startDate: { day: dateFilter.startDate.day},
         endDate: dateFilter.endDate
      }
    })
      .then(function(result) {
                $scope.users = result.data.results;
                $scope.totalUsers = result.data.total
                console.log(result);  
    });
    }
    
     $scope.setResult = function(result){
             $location.path('/result/:' + result._id);
     };
    
   //Auto Cierre


     } 
 ]);


resultModule.directive('ngPrint', function(){
 var printSection = document.getElementById('printSection');
 // var result = document.getElementById('resultValue');
 // printSection.appendChild(result);
 //$('#resultValue').append("this text was appended");
 //var resultValue = document.getElementById('resultValue').value;
        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'printSection';
            document.body.appendChild(printSection);
        }
        function link(scope, element, attrs) {
            element.on('click', function () {
                var elemToPrint = document.getElementById(attrs.printElementId);
                //elemToPrint.innerHTML = document.getElementById('resultValue').value;
                if (elemToPrint) {
                    printElement(elemToPrint);
                }
            });
            window.onafterprint = function () {
                // clean the print section before adding new content
                printSection.innerHTML = '';
            }
        }
        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            printSection.appendChild(domClone);
            window.print();
            location.reload(true);
        }
        return {
            link: link,
            restrict: 'A',
            controller: function($scope){
              
            }
        };

});







