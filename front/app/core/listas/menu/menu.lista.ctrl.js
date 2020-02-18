(function(){
	'use strict';

  angular.module("sistemaModule")
  .controller("menuListaController", menuListaController);
  menuListaController.$inject=['$rootScope','$filter', '$state', '$mdDialog', 'sisMenuService', 'CONFIG'];

  function menuListaController($rootScope, $filter, $state, $mdDialog, sisMenuService, CONFIG){
    var vm=this;
    vm.arbol=[];
    vm.filtro="";
    vm.list=[];
    vm.message="";
    vm.secciones=[];
    vm.selectedSeccion=0;
    vm.showButtons=false;

    var nuevo={};

    activate();

    function activate(){
      vm.secciones=sisMenuService.secciones;

      getArbol()

      sisMenuService.getFonts();

      return getList()
      .then(function(){
          vm.list=sisMenuService.lista;
      })
    }

    function getArbol (){        
      return sisMenuService.getArbol()
      .then(function(res){
        if (res.data && res.data.code==0){
          //vm.arbol=sismenuService.arbol;
          vm.arbol=res.data.response.datos;
          localStorage.setItem("token",res.data.response.token);
          return sisMenuService.arbol;
        }
      })
    }


    function getList (){        
      return sisMenuService.getList()
      .then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          return sisMenuService.lista;
        }
      })
    }

    vm.navigateTo=function(item,event){
      vm.activeItem=item;
    }

    vm.agregar = function(id, ev){
      return sisMenuService.getOne(0).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisMenuService.one=res.data.response.datos;

          sisMenuService.one.id_seccion=vm.selectedSeccion;
          sisMenuService.one.id_padre=id;          
          openDialog(ev);            
        }
      })
    }

    vm.selOne = function(item,ev){
      return sisMenuService.getOne(item.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisMenuService.one=res.data.response.datos;
          openDialog(ev);            
        }
      })
    };

    vm.delOne = function(item,ev){
      var confirm=$mdDialog.confirm()
        .title("¿Desea eliminar la selección?")
        .textContent(item.nombre)
        .ariaLabel("eliminar")
        .targetEvent(ev)
        .ok('Aceptar')
        .cancel('Cancelar');
  
      $mdDialog.show(confirm).then(function(){

        sisMenuService.delOne(item.id).then(function(res){
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            getArbol();
          }
        })

      }, function(){

      })

    };    

    function openDialog(ev){
      $mdDialog.show({
        controller: 'menuDetailController',
        controllerAs: 'ctrl',
        templateUrl: 'front/app/core/listas/menu/menu.detail.tpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(){
        $rootScope.showToast('Elemento guardado con exito');
        getArbol();
      });
    }

  }

})();