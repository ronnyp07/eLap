var mainApplicationModuleName = 'mean';

var mainApplicationModule = angular.module('mean', 
	['ngRoute',
	 'ngResource', 
	 'users', 
	 'example', 
	 'patients', 
	 'pais',
	 'sector',
	 'ciudad',
	 'ui.select2',
	 'ui.bootstrap',
	 'ngTable',
	 'clientes',
	 'tempresult',
	 'procs',
	 'doctor',
	 'orders', 
	 'cierre',
	 'ngMaterial',
	 'ui.date',
	 'angularUtils.directives.dirPagination',
	 'daterangepicker']);

mainApplicationModule.config(['$locationProvider',
 function($locationProvider){
	$locationProvider.hashPrefix('!');
}
]);

angular.element(document).ready(function(){
    angular.bootstrap(document, [mainApplicationModuleName]);
});