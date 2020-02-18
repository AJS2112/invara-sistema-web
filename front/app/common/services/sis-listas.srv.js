(function(){
	'use strict';
	
	angular.module('sistemaModule')
	.factory('sisListasService',sisListasService) 
	sisListasService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function sisListasService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var listasSrv = {
			delOne:delOne,
			getByCampo:getByCampo,
			getById:getById,
			getByPadre:getByPadre,
			getCampos:getCampos,
			getList:getList,
			getOne:getOne,
			one:one,
			setOne:setOne
		}
		return listasSrv;


		function getByCampo (campo){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_listas/getByCampo/'+campo
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }

		function getById (Id){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_listas/getById/'+Id
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }	    

		function getByPadre (idPadre){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_listas/getByPadre/'+idPadre
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }	    

	    function getCampos(){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_listas/getCampos'
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
		function getList2(ids){	
			console.log(ids)
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_listas/getList/'+ids
	        })				
			.then (function(res){
				console.log('getList',res.data.response.datos)
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
		}
		*/
		function getList (ids){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:true,
	            url: CONFIG.APIURL+'sis_listas/getList',
	            data: $httpParamSerializerJQLike(ids),
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

		function getOne(id){	
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_listas/getOne/'+id
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
		}


		function setOne(obj){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_listas/setOne',
	            data: $httpParamSerializerJQLike(obj),
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

		function delOne(id){	
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_listas/delOne/'+id
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