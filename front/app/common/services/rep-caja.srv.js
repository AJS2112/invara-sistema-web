(function(){
	'use strict';
	
	angular.module('reportesModule')
	.factory('repCajaService',repCajaService) 
	repCajaService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function repCajaService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var mySrv = {
			getInstrumentosResumen:getInstrumentosResumen,
			getInstrumentosDetalle:getInstrumentosDetalle,
			getCuentasResumen:getCuentasResumen,
			getCuentasDetalle:getCuentasDetalle,
			/*getComisionesResumen:getComisionesResumen,
			getUsuariosDetalle:getUsuariosDetalle*/
		}
		return mySrv;

		function getInstrumentosResumen(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_caja/getInstrumentosResumen',
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

	    function getInstrumentosDetalle(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_caja/getInstrumentosDetalle',
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

	    function getCuentasResumen(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_caja/getCuentasResumen',
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


	    function getCuentasDetalle(datos){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_caja/getCuentasDetalle',
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