(function(){
	'use strict';

  angular.module("sistemaModule")
  .controller("usuariosListaController", usuariosListaController);
  usuariosListaController.$inject=['$rootScope','$filter', '$state', '$mdDialog', 'uiGridConstants', 'sisUsuariosService', 'CONFIG'];

  function usuariosListaController($rootScope, $filter, $state, $mdDialog, uiGridConstants, sisUsuariosService, CONFIG){
    var vm=this;
  	vm.message="";
    vm.list=[];
    vm.filtro="";

    var lista=[];
    var nuevo={};

    vm.gridOptions = {
        columnDefs: [
          { field: 'nombre', displayName: 'Nombre', sort: { direction: uiGridConstants.ASC }, },
          { field: 'cedula', displayName: 'Cédula', maxWidth: 200},
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/listas/usuarios/usuarios.lista.row.tpl.html',
        enableExpandableRowHeader: false,
        expandableRowScope: { 
          editar: function(ev){
              var sel=vm.gridApi.selection.getSelectedRows();
              vm.selOne(sel[0])
          },
          permisos: function(ev){
              var sel=vm.gridApi.selection.getSelectedRows();
              vm.selPermisos(sel[0])
          }           
        },          

    };

    activate();

    function activate(){
      Pace.restart();
      return getList()
      .then(function(){
          vm.list=lista;
          vm.gridOptions.data = vm.list;  
          vm.filtrar();
          Pace.stop();
      })
    }

    function getList (){  
        return sisUsuariosService.getList()
        .then(function(res){
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            lista=res.data.response.datos;
            return lista;
          }
        },function(){
        })
    }

    vm.filtrar = function() {
      vm.gridOptions.data = $filter('multiFiltro')(lista, vm.filtro);
    };

    vm.navigateTo=function(item,event){
      vm.activeItem=item;
    }

    vm.agregar = function(ev){
      return sisUsuariosService.getOne(0).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisUsuariosService.one=res.data.response.datos;
          openDialog(ev);            
        }
      })
    }

    vm.selOne = function(item,ev){
      console.log(item)
      return sisUsuariosService.getOne(item.id).then(function(res){
        console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisUsuariosService.one={};
          angular.copy(res.data.response.datos,sisUsuariosService.one)
          openDialog(ev);            
        }
      })
    }

    vm.selPermisos = function(item,ev){
      return sisUsuariosService.getOne(item.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisUsuariosService.one={};
          angular.copy(res.data.response.datos,sisUsuariosService.one)
          openPermisos(ev);            
        }
      })
    }

    function openDialog(ev){
      $mdDialog.show({
        controller: 'usuariosSignupController',
        controllerAs: 'ctrl',
        templateUrl: 'front/app/core/listas/usuarios/usuarios.signup.tpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(){
        return getList().then(function(){
          vm.list=lista;
          vm.list=lista;
          vm.gridOptions.data = vm.list;          
          vm.filtrar();
        })
      });
    }

    function openPermisos(ev){
      $mdDialog.show({
        controller: 'usuariosPermisosController',
        controllerAs: 'ctrl',
        templateUrl: 'front/app/core/listas/usuarios/usuarios.permisos.tpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(){
        $rootScope.showToast('Permisos guardados con exito');
        return getList().then(function(){
          vm.list=lista;
        })
      });      
    }


  }

})();