(function(){
	'use strict';
	
	angular.module('reportesModule')
	.factory('repComprasService',repComprasService) 
	repComprasService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function repComprasService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var mySrv = {
			getOperacionesResumen:getOperacionesResumen,
			getOperacionesDetalle:getOperacionesDetalle,
			getProveedoresResumen:getProveedoresResumen,
			getProveedoresDetalle:getProveedoresDetalle,
		}
		return mySrv;

		function getOperacionesResumen(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_compras/getOperacionesResumen',
	            data: $httpParamSerializerJQLike(datos),
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

	    function getOperacionesDetalle(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_compras/getOperacionesDetalle',
	            data: $httpParamSerializerJQLike(datos),
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

	    function getProveedoresResumen(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_compras/getProveedoresResumen',
	            data: $httpParamSerializerJQLike(datos),
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

	    function getProveedoresDetalle(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_compras/getProveedoresDetalle',
	            data: $httpParamSerializerJQLike(datos),
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