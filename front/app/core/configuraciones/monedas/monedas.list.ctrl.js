(function(){
  'use strict';

  angular.module("configuracionesModule")
  .controller("monedasListController", monedasListController);
  monedasListController.$inject=['$rootScope','$filter', '$state', '$mdDialog', '$mdMedia', 'uiGridConstants', 'cnfMonedasService', 'CONFIG'];

  function monedasListController($rootScope, $filter, $state, $mdDialog, $mdMedia, uiGridConstants, cnfMonedasService,  CONFIG){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));

    var vm=this;
    vm.filtro="";
    vm.list=[];
    vm.loading=false;

    var lista=[];

    var nuevo={};
    vm.gridOptions = {
        columnDefs: [
          { field: 'nombre', displayName: 'NOMBRE', sort: { direction: uiGridConstants.ASC }, },
          { field: 'descrip', displayName: 'DESCRIPCION', visible: !$mdMedia('xs')},
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/configuraciones/monedas/monedas.list.row.tpl.html',
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
      vm.loading=true;        
      return cnfMonedasService.getList(logUser.id_empresa).then(function(res){
        //console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;
          vm.loading=false;
          return lista;
        }
      })
    }

    vm.filtrar = function() {
      vm.gridOptions.data = $filter('multiFiltro')(lista, vm.filtro);
    };

    vm.agregar = function(ev){
      return cnfMonedasService.getOne(logUser.id_empresa, 0).then(function(res){
        console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          cnfMonedasService.one={};
          angular.copy(res.data.response.datos,cnfMonedasService.one)
          openDialog(ev);            
        }
      })
    }

    vm.selOne = function(item,ev){
      return cnfMonedasService.getOne(logUser.id_empresa, item.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          cnfMonedasService.one={};
          angular.copy(res.data.response.datos,cnfMonedasService.one)
          openDialog(ev);            
        }
      })
    }

    function openDialog(ev){
        $mdDialog.show({
          controller: 'monedasDetailController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/configuraciones/monedas/monedas.detail.tpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(){
          $rootScope.showToast('Moneda guardada con exito');
          return getList().then(function(){
              vm.list=lista;
              vm.gridOptions.data = vm.list;          
              vm.filtrar();
          })
        });

    }

  }

})();