(function(){
	'use strict';
	
	angular.module('sistemaModule')
	.factory('sisMenuService',sisMenuService) 
	sisMenuService.$inject=['$http', '$q', '$httpParamSerializerJQLike', '$mdSidenav','$rootScope','CONFIG'];

	function sisMenuService($http,$q,$httpParamSerializerJQLike,$mdSidenav,$rootScope,CONFIG){
		var arbol=[];
		//var configItems=[];
	   	var fuentes={
	   		grupos:[],
	   		lista:[]
	   	};
        var menuItems=[
            { name: 'Productos', heading: "Productos", state: "menu.productos", active: false },
            { name: 'Clientes', heading: "Productos", state: "menu.clientes", active: false },
      	];
		var lista=[];
		var secciones=[
	        {id:1, nombre:"Main"},
	        {id:2, nombre:"Configuraciones"},        
	   	];

		var menuService = {
			//currentMenuItem:currentMenuItem,
			arbol:arbol,
			//configItems:configItems,
			delOne:delOne,
			fuentes:fuentes,
			getArbol:getArbol,
			getMenuByUser:getMenuByUser,			
			getFonts:getFonts,
			getList:getList,
			getOne:getOne,
			lista:lista,
			menuItems:menuItems,
			secciones:secciones,
			setOne:setOne,
			toggle:toggle,
	   		toggleSideBar:toggleSideBar
		}
		return menuService;

		function toggleSideBar (){
			$mdSidenav('left').toggle()
		}

		function getArbol (){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.APIURL+'sis_menu/getMenu'
	        })				
			.then (function(res){
              	menuService.arbol=res.data.response.datos;				
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }


		function getMenuByUser (user){
	        var deferred=$q.defer();
			$http({
	            method: 'POST',
				skipAutorization:true,
	            url: CONFIG.APIURL+'sis_menu/getMenuByUser',
	            data: $httpParamSerializerJQLike(user),
	            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	        })				
			.then (function(res){
              	menuService.arbol=res.data.response.datos;				
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
	    }


	    function getFonts (){
	        var deferred=$q.defer();
			$http({
	            method: 'GET',
				skipAutorization:false,
	            url: CONFIG.URL+'assets/fonts/fontawesome-list.json'
	        })				
			.then (function(res){
				deferred.resolve(res);
              	menuService.fuentes.lista=res.data;
					var flags = [], output = [], l = res.data.length, i;
			    	for( i=0; i<l; i++) {
			          if( flags[res.data[i].grupo]) continue;
			          flags[res.data[i].grupo] = true;
			          output.push(res.data[i].grupo);
			    	}       
              	menuService.fuentes.grupos=output;			    	

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
	            url: CONFIG.APIURL+'sis_menu/getList'
	        })				
			.then (function(res){
              	menuService.lista=res.data.response.datos;				
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
	            url: CONFIG.APIURL+'sis_menu/getOne/'+id
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
	            url: CONFIG.APIURL+'sis_menu/setOne',
	            data: $httpParamSerializerJQLike(one),
	            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	        })				
			.then (function(res){
				console.log(res)
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
	            url: CONFIG.APIURL+'sis_menu/delOne/'+id
	        })				
			.then (function(res){
				deferred.resolve(res);
			})
			.then (function(error){
				deferred.reject(error);
			})
			return deferred.promise;
		}		
	
		function toggle(){
	        $mdSidenav('left_section')
	        .toggle();
	    }

	}
})();