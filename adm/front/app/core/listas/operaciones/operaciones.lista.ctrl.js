(function(){
  'use strict';

  angular.module("sistemaModule")
  .controller("operacionesListaController", operacionesListaController);
  operacionesListaController.$inject=['$rootScope','$filter', '$state', '$mdDialog', 'uiGridConstants', 'sisOperacionesService', 'sisListasService', 'CONFIG'];

  function operacionesListaController($rootScope, $filter, $state, $mdDialog, uiGridConstants, sisOperacionesService, sisListasService, CONFIG){
    var vm=this;
    vm.filtro="";
    vm.list=[];

    var lista=[];
    var listaTipos=[];
    var listaStatus=[];

    var nuevo={};
    vm.gridOptions = {
        columnDefs: [
          { field: 'tipo_nombre', displayName: 'TIPO', sort: { direction: uiGridConstants.ASC }, },
          { field: 'nombre', displayName: 'NOMBRE', sort: { direction: uiGridConstants.ASC }, },
          { field: 'signo_inventario', displayName: 'INVENTARIO', maxWidth: 120},
          { field: 'signo_caja', displayName: 'CAJA', maxWidth: 120},
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/listas/operaciones/operaciones.lista.row.tpl.html',
        enableExpandableRowHeader: false,
        expandableRowScope: { 
          editar: function(ev){
              var sel=vm.gridApi.selection.getSelectedRows();
              vm.selOne(sel[0])
          } 
        },          

    };

    activate();

    function activate(){
      //STATUS
      sisListasService.getByCampo('tipo_operacion').then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          listaTipos=res.data.response.datos;
        }
      })

      return getList()
      .then(function(){
          vm.list=lista;
          vm.gridOptions.data = vm.list;          
          vm.filtrar();
      })
    }

    function getList (){        
        return sisOperacionesService.getList("").then(function(res){
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            lista=res.data.response.datos;
            return lista;
          }
        })
    }

    vm.filtrar = function() {
      vm.gridOptions.data = $filter('multiFiltro')(lista, vm.filtro);
    };

    vm.agregar = function(ev){
      return sisOperacionesService.getOne(0).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisOperacionesService.one={};
          angular.copy(res.data.response.datos,sisOperacionesService.one)
          openDialog(ev);            
        }
      })
    }

    vm.selOne = function(item,ev){
      return sisOperacionesService.getOne(item.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisOperacionesService.one={};
          angular.copy(res.data.response.datos,sisOperacionesService.one)
          openDialog(ev);            
        }
      })
    }

    function openDialog(ev){
        $mdDialog.show({
          controller: 'operacionesDetailController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/listas/operaciones/operaciones.detail.tpl.html',
          locals: {
            tipos: listaTipos
          },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(){
          $rootScope.showToast('Operación guardada con exito');
          return getList()
          .then(function(){
              vm.list=lista;
              vm.gridOptions.data = vm.list;          
              vm.filtrar();
          })
        });

    }

  }

})();