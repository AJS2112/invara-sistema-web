(function(){
	'use strict';
	
	angular.module('reportesModule')
	.factory('repInventariosService',repInventariosService) 
	repInventariosService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function repInventariosService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var mySrv = {
			getList:getList,
			getDisponibilidadFormulas:getDisponibilidadFormulas,
			getMovimientosResumen:getMovimientosResumen,
			getMovimientosDetalle:getMovimientosDetalle
		}
		return mySrv;

		function getList(idEmpresa,idCategoria){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_inventarios/getList/'+idEmpresa+'/'+idCategoria
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }

	    function getMovimientosResumen(datos){
			var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_inventarios/getMovimientosResumen',
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

	    function getMovimientosDetalle(datos){
			var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_inventarios/getMovimientosDetalle',
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

		function getDisponibilidadFormulas(idEmpresa){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'rep_inventarios/getDisponibilidadFormulas/'+idEmpresa
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