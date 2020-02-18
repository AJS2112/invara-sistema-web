(function(){
	'use strict';
	
	angular.module('sistemaModule')
	.factory('sisImpuestosService',sisImpuestosService) 
	sisImpuestosService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function sisImpuestosService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var impuestosSrv = {
			getList:getList,
			getListByTipo:getListByTipo,
			getOne:getOne,
			one:one,
			setOne:setOne,
		}
		return impuestosSrv;

		function getList(idTipo){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_impuestos/getList/'+idTipo
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }

		function getListByTipo(idTipo){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_impuestos/getListByTipo/'+idTipo
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }

		function getOne(id){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_impuestos/getOne/'+id
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }


		function setOne(one){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_impuestos/setOne',
	            data: $httpParamSerializerJQLike(one),
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