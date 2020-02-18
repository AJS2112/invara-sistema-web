(function(){
	'use strict';
	
	angular.module('sistemaModule')
	.factory('sisEmpresasService',sisEmpresasService) 
	sisEmpresasService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function sisEmpresasService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var mySrv = {
			getList:getList,
			getOne:getOne,
			one:one,
			setOne:setOne,
		}
		return mySrv;

		function getList(){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_empresas/getList'
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
			console.log('srv.getOne',CONFIG.APIURL+'sis_empresas/getOne/'+id)
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_empresas/getOne/'+id
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
	            url: CONFIG.APIURL+'sis_empresas/setOne',
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