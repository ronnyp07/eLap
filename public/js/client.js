var myApp = angular.module('myApp', []);

 myApp.controller("ListController", function($scope, $http){
	$http.get('/js/data.json').success(function(data){
			$scope.name = data;
			$scope.select = 'name';
	});
});

 myApp.controller("ListUserRegistraton", 
 	["$scope", "$http", 
 	   function($scope, $http){
       $scope.master = [];
       $http.get("/master")
           .then(function(result){
              $scope.master = result.data;
              /*[
                 {
                	 sex : "Masculino"
        
                }
              ];*/
           },  function(err){
             alert(err);

           });
 	}
 ]);

/*	$http.get('/master').success(function(data){
			$scope.master = data;
			 console.log('Hola');
			//$scope.select = 'name';
		});*/
