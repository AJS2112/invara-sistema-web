(function(){
	'use strict';
	
	angular.module('inventariosModule')
	.factory('invMovimientosService',invMovimientosService) 
	invMovimientosService.$inject=['$http','$q','$httpParamSerializerJQLike','CONFIG'];

	function invMovimientosService($http,$q,$httpParamSerializerJQLike,CONFIG){
		var one={};
		var mySrv = {
			getList:getList,
			one:one,
			setOne:setOne,
		}
		return mySrv;

		function getList(idOperacion){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'inv_movimientos/getList/'+idOperacion
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
	            url: CONFIG.APIURL+'inv_movimientos/setOne',
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