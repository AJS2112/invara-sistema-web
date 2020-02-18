(function(){
  'use strict';
  
  angular.module("sistemaModule")
  .controller("menuDetailController", menuDetailController);
  menuDetailController.$inject=['$mdDialog', '$filter', 'sisMenuService'];

  function menuDetailController($mdDialog, $filter, sisMenuService){
  	var vm=this;
    vm.error="";
    vm.one = {};
    vm.padre=[];
    vm.seccion=[];
    vm.padreNombre="";
    vm.iconos=[];
    vm.iconosGrupos=[];
    activate();

    function activate(){
      var filtroPadre={};
      vm.iconosGrupos=sisMenuService.fuentes.grupos;
      vm.iconos=sisMenuService.fuentes.lista;

      vm.one=sisMenuService.one;
      vm.seccion=$filter('filter')(sisMenuService.secciones, vm.one.id_seccion, undefined);

      filtroPadre.id= vm.one.id_padre;
      vm.padre=$filter('filter')(sisMenuService.lista, filtroPadre, undefined);      

      if (!vm.padre.length){
        vm.padreNombre="Root";
      } else {
        vm.padreNombre=vm.padre[0].nombre;
      }

    }

    function getGrupos(){
      var flags = [], output = [], l = vm.iconos.length, i;
      for( i=0; i<l; i++) {
          if( flags[vm.iconos[i].grupo]) continue;
          flags[vm.iconos[i].grupo] = true;
          vm.iconosGrupos.push(vm.iconos[i].grupo);
      }

    }

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

  	vm.guardar = function() {
      sisMenuService.setOne(vm.one)
      .then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          $mdDialog.hide();
        } else if (res.data && res.data.code!==0){
          localStorage.setItem("token",res.data.response.token);
          vm.error=res.data.response.token;
        }
        sisMenuService.getArbol(); 
      })
    }	
  }

})();