(function(){
  'use strict';

  angular.module("sistemaModule")
  .controller("empresasListController", empresasListController);
  empresasListController.$inject=['$rootScope','$filter', '$state', '$mdDialog', 'uiGridConstants', 'sisEmpresasService', 'CONFIG'];

  function empresasListController($rootScope, $filter, $state, $mdDialog, uiGridConstants, sisEmpresasService, CONFIG){
    var vm=this;
    vm.filtro="";
    vm.list=[];
    var lista=[];
    var _listaTipo=[];

    var nuevo={};
    vm.gridOptions = {
        columnDefs: [
          { field: 'nombre', displayName: 'NOMBRE', sort: { direction: uiGridConstants.ASC }, },
          { field: 'rif', displayName: 'RIF', },
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/sistema/empresas/empresas.list.row.tpl.html',
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
      return getList().then(function(){
          vm.list=lista;
          vm.gridOptions.data = vm.list;          
          vm.filtrar();
          Pace.stop();
      })
    }

    function getList (){        
        return sisEmpresasService.getList()
        .then(function(res){
          //console.log(res)
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
      return sisEmpresasService.getOne(0).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisEmpresasService.one={};
          angular.copy(res.data.response.datos,sisEmpresasService.one)
          openDialog(ev);            
        }
      })
    }

    vm.selOne = function(item,ev){
      return sisEmpresasService.getOne(item.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisEmpresasService.one={};
          angular.copy(res.data.response.datos,sisEmpresasService.one)
          openDialog(ev);            
        }
      })
    }

    function openDialog(ev){
        $mdDialog.show({
          controller: 'empresasDetailController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/sistema/empresas/empresas.detail.tpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(){
          $rootScope.showToast('Empresa guardada con exito');
          return getList().then(function(){
              vm.list=lista;
              vm.gridOptions.data = vm.list;          
              vm.filtrar();
          })
        });

    }

  }

})();