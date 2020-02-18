(function(){
	'use strict';
	
	angular.module('sistemaModule')
	.factory('sisLoginService',sisLoginService) 
	sisLoginService.$inject=['$http','$q','CONFIG', '$httpParamSerializerJQLike'];

	function sisLoginService($http,$q,CONFIG,$httpParamSerializerJQLike){
		var loginService = {
			logIn:logIn
		}
		return loginService;


		function logIn(user){	
			var deferred;
			deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:true,
	            url: CONFIG.APIURL+'Sis_login/log',
	            data:$httpParamSerializerJQLike(user),
	            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
		}
			

	}
})();