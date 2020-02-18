(function(){
	'use strict';
	
	angular.module('inventariosModule')
	.factory('invCategoriasService',invCategoriasService) 
	invCategoriasService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function invCategoriasService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var unidadesSrv = {
			getList:getList,
			getOne:getOne,
			one:one,
			setOne:setOne,
		}
		return unidadesSrv;

		function getList(idEmpresa){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'inv_categorias/getList/'+idEmpresa
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
	            url: CONFIG.APIURL+'inv_categorias/getOne/'+idEmpresa+'/'+id
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
	            url: CONFIG.APIURL+'inv_categorias/setOne',
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