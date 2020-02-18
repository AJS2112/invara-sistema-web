(function(){
	'use strict';
	
	angular.module('sistemaModule')
	.factory('sisOperacionesService',sisOperacionesService) 
	sisOperacionesService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function sisOperacionesService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var operacionesSrv = {
			getList:getList,
			getOne:getOne,
			one:one,
			setOne:setOne,
		}
		return operacionesSrv;

		function getList(id){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_operaciones/getList/'+id
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
	            url: CONFIG.APIURL+'sis_operaciones/getOne/'+id
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
	            url: CONFIG.APIURL+'sis_operaciones/setOne',
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