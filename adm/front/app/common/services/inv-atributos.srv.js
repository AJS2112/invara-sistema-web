(function(){
	'use strict';
	
	angular.module('inventariosModule')
	.factory('invAtributosService',invAtributosService) 
	invAtributosService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function invAtributosService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var mySrv = {
			getList:getList,
			getOne:getOne,
			one:one,
			setOne:setOne,
		}
		return mySrv;

		function getList(id){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'inv_atributos/getList/'+id
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
	            url: CONFIG.APIURL+'inv_atributos/getOne/'+id
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
	            url: CONFIG.APIURL+'inv_atributos/setOne',
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