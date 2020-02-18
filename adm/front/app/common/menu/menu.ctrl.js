(function(){
	'use strict';

  	angular.module("sistemaModule")
  	.controller("menuController", menuController);

  	menuController.$inject=['$rootScope', '$scope', '$state', '$mdMedia', '$mdDialog', '$filter', 'jwtHelper','sisMenuService', 'sisUsuariosService', 'sisEmpresasService'];

  	function menuController($rootScope, $scope, $state, $mdMedia, $mdDialog, $filter, jwtHelper,sisMenuService,sisUsuariosService,sisEmpresasService){
      var logUser=JSON.parse(sessionStorage.getItem("logUser"));

      var originatorEv;
    	var vm=this;
      vm.lockLeft = true;
      vm.logUser={};
      vm.menuArbol=[];
      vm.menuItems=[];
      vm.titulo="";
      vm.empresa=JSON.parse(sessionStorage.getItem("empresa"));
      vm.listaCotizacion=JSON.parse(sessionStorage.getItem("listaCotizacion"));
      var oneCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      
      if (oneCotizacion){
        $rootScope.id_moneda=oneCotizacion.id_moneda;
        $rootScope.factor=oneCotizacion.valor;
      }

      if (vm.empresa.es_modo_fiscal){
        $rootScope.id_moneda="11E93A6F6D57549E838500E04C6F7E24";
        $rootScope.factor=1;
      }

      activate();

      function activate(){
        vm.logUser=logUser;
        vm.menuItems=sisMenuService.menuItems;
        getMenuByUser();
      }


      vm.seleccionaCotizacion=function(){
        var _lista=vm.listaCotizacion;
        var filtro={};
        if (vm.empresa.es_modo_fiscal){
          filtro.id_moneda="11E93A6F6D57549E838500E04C6F7E24";   
        }else{
          filtro.id_moneda=$rootScope.id_moneda;   
        }

        var result = $filter('filter')(_lista, filtro, true);
        if (result.length){
          $rootScope.factor=result[0].valor;
          sessionStorage.setItem("oneCotizacion",JSON.stringify(result[0]));
        }
      }
      

      vm.showLeftSection=function(){
        sisMenuService.toggleSideBar();
      }
      vm.collapseAll = function(data) {
       for(var i in vm.menuArbol) {
         if(vm.menuArbol[i] != data) {

           vm.menuArbol[i].expanded = false;   
         }
       }
       data.expanded = !data.expanded;
       };

      function getMenuByUser (){        
        var permisos={permisos:vm.logUser.permisos};
        return sisMenuService.getMenuByUser(permisos).then(function(res){
          if (res.data && res.data.code==0){
            vm.menuArbol=sisMenuService.arbol;
            localStorage.setItem("token",res.data.response.token);
            return sisMenuService.arbol;
          }
        })
      }      

      vm.openConfig=function($mdMenu, ev){
        originatorEv=ev;
        $mdMenu.open(ev);
      }

      vm.openAccount=function(state){
        sisUsuariosService.one=vm.logUser;
        $state.go(state);
      }      

    	vm.goto=function(state){
        var tokenPayload=jwtHelper.decodeToken(localStorage.getItem("token"));
    		$state.go(state);
        sisMenuService.toggleSideBar();        
    	}

  	}

})();