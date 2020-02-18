(function(){
	'use strict';
	
	angular.module('reportesModule')
	.factory('repVentasService',repVentasService) 
	repVentasService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function repVentasService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var mySrv = {
			getOperacionesResumen:getOperacionesResumen,
			getOperacionesDetalle:getOperacionesDetalle,
			getClientesResumen:getClientesResumen,
			getClientesDetalle:getClientesDetalle,
			getDeudasResumen:getDeudasResumen,
			getDeudasDetalle:getDeudasDetalle,
			getPagosDetalle:getPagosDetalle,
			getComisionesResumen:getComisionesResumen,
			getUsuariosDetalle:getUsuariosDetalle
		}
		return mySrv;

		function getOperacionesResumen(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_ventas/getOperacionesResumen',
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
	            url: CONFIG.APIURL+'rep_ventas/getOperacionesDetalle',
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

	    function getClientesResumen(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_ventas/getClientesResumen',
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

	    function getClientesDetalle(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_ventas/getClientesDetalle',
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

	    function getDeudasResumen(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_ventas/getDeudasResumen',
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

	    function getDeudasDetalle(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_ventas/getDeudasDetalle',
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

	    function getPagosDetalle(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_ventas/getPagosDetalle',
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


	    function getComisionesResumen(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_ventas/getComisionesResumen',
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


	    function getUsuariosDetalle(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_ventas/getUsuariosDetalle',
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