(function(){
	'use strict';
	
	angular.module('inventariosModule')
	.factory('invUnidadesService',invUnidadesService) 
	invUnidadesService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function invUnidadesService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var unidadesSrv = {
			getList:getList,
			getOne:getOne,
			one:one,
			setOne:setOne,
		}
		return unidadesSrv;

		function getList(id){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'inv_unidades/getList/'+id
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
	            url: CONFIG.APIURL+'inv_unidades/getOne/'+id
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
	            url: CONFIG.APIURL+'inv_unidades/setOne',
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