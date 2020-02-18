(function(){
  'use strict';

  angular.module("sistemaModule")
  .controller("impuestosListaController", impuestosListaController);
  impuestosListaController.$inject=['$rootScope','$filter', '$state', '$mdDialog', 'uiGridConstants', 'sisImpuestosService', 'sisListasService', 'CONFIG'];

  function impuestosListaController($rootScope, $filter, $state, $mdDialog, uiGridConstants, sisImpuestosService, sisListasService, CONFIG){
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
          { field: 'valor', displayName: 'VALOR', maxWidth: 200},
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/listas/impuestos/impuestos.lista.row.tpl.html',
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
      Pace.restart();
      //STATUS
      sisListasService.getByCampo('impuestos').then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          listaTipos=res.data.response.datos;
        }
      })

      return getList().then(function(){
          vm.list=lista;
          vm.gridOptions.data = vm.list;          
          vm.filtrar();
          Pace.stop();
      })
    }

    function getList (){        
        return sisImpuestosService.getList()
        .then(function(res){
          console.log(res)
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
      return sisImpuestosService.getOne(0).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisImpuestosService.one={};
          angular.copy(res.data.response.datos,sisImpuestosService.one)
          openDialog(ev);            
        }
      })
    }

    vm.selOne = function(item,ev){
      return sisImpuestosService.getOne(item.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisImpuestosService.one={};
          angular.copy(res.data.response.datos,sisImpuestosService.one)
          openDialog(ev);            
        }
      })
    }

    function openDialog(ev){
        $mdDialog.show({
          controller: 'impuestosDetailController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/listas/impuestos/impuestos.detail.tpl.html',
          locals: {
            tipos: listaTipos
          },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(){
          $rootScope.showToast('impuesto guardado con exito');
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