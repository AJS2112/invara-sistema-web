(function(){
	'use strict';
	
	angular.module('ventasModule')
	.factory('vntClientesService',vntClientesService) 
	vntClientesService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function vntClientesService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var mySrv = {
			getDeudas:getDeudas,
			getList:getList,
			getOne:getOne,
			one:one,
			setOne:setOne,
		}
		return mySrv;

		function getDeudas(idCliente){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'vnt_clientes/getDeudas/'+idCliente
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }

		function getList(idEmpresa){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'vnt_clientes/getList/'+idEmpresa
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }

		function getOne(idEmpresa,id){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'vnt_clientes/getOne/'+idEmpresa+'/'+id
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
	            url: CONFIG.APIURL+'vnt_clientes/setOne',
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