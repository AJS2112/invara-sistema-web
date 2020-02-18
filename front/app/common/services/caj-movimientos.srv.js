(function(){
	'use strict';
	
	angular.module('cajaModule')
	.factory('cajMovimientosService',cajMovimientosService) 
	cajMovimientosService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function cajMovimientosService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var mySrv = {
			getList:getList,
			getOne:getOne,
			one:one,
			//setOne:setOne,
		}
		return mySrv;

		function getList(idEmpresa){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'caj_movimientos/getList/'+idEmpresa
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }
	    
		function getOne(idOperacion){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'caj_movimientos/getOne/'+idOperacion
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
				skipAutorization:false,
	            url: CONFIG.APIURL+'caj_movimientos/setOne',
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
	}
})();