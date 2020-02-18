(function(){
	'use strict';
	
	angular.module('sistemaModule')
	.factory('sisDashboardService',sisDashboardService) 
	sisDashboardService.$inject=['$http','$q','CONFIG', '$httpParamSerializerJQLike'];

	function sisDashboardService($http,$q,CONFIG,$httpParamSerializerJQLike){
		var dashboardSrv = {
			getList:getList,
			getCaja:getCaja,
			delOne:delOne,
			setOne:setOne
		}
		return dashboardSrv;


		function getList(obj){	
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_dashboard/getList',
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

		function getCaja(obj){	
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_dashboard/getCaja',
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
	            url: CONFIG.APIURL+'sis_dashboard/delOne/'+id
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
	            url: CONFIG.APIURL+'sis_dashboard/setOne',
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

	}
})();