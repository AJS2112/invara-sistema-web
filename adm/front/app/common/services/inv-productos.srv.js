(function(){
	'use strict';
	
	angular.module('inventariosModule')
	.factory('invProductosService',invProductosService) 
	invProductosService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function invProductosService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var formula=[];
		var caracteristicas=[];
		var operacionesSrv = {
			caracteristicas:caracteristicas,
			formula:formula,
			getList:getList,
			getOne:getOne,
			one:one,
			setOne:setOne,
		}
		return operacionesSrv;

		function getList(idEmpresa){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'inv_productos/getList/'+idEmpresa
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
	            url: CONFIG.APIURL+'inv_productos/getOne/'+idEmpresa+'/'+id
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
			console.log('srv One:',one);

			var fd = new FormData();
	        var deferred=$q.defer();

	        for(var key in one){
	        	fd.append(key,one[key]);
	        }
	        fd.append('_method','put')
	        

			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'inv_productos/setOne',
	            data: fd,
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}

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