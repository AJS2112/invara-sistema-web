(function(){
	'use strict';
	
	angular.module('sistemaModule')
	.factory('sisUsuariosService',sisUsuariosService) 
	sisUsuariosService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function sisUsuariosService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var usuariosSrv = {
			checkName:checkName,
			getList:getList,
			getNew:getNew,
			getOne:getOne,
			one:one,
			setOne:setOne,
		}
		return usuariosSrv;

		function checkName(one){
			var deferred;
			deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:true,
	            url: CONFIG.APIURL+'sis_usuarios/checkOne',
	            data:$httpParamSerializerJQLike(one),
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

		function getList (){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_usuarios/getList'
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }

		function getNew(id){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:true,
	            url: CONFIG.APIURL+'sis_usuarios/getNew/'
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
	            url: CONFIG.APIURL+'sis_usuarios/getOne/'+id
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }
	    /*
		function setOne(one){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:true,
	            url: CONFIG.APIURL+'sis_usuarios/setNew',
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
			*/
		function setOne(one){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_usuarios/setOne',
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