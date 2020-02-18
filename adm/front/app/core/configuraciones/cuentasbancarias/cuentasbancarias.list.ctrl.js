(function(){
  'use strict';

  angular.module("configuracionesModule")
  .controller("cuentasbancariasListController", cuentasbancariasListController);
  cuentasbancariasListController.$inject=['$rootScope','$filter', '$state', '$mdDialog', 'uiGridConstants', 'cnfCuentasbancariasService', 'sisListasService'];

  function cuentasbancariasListController($rootScope, $filter, $state, $mdDialog, uiGridConstants, cnfCuentasbancariasService, sisListasService){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));

    var vm=this;
    vm.filtro="";
    vm.list=[];
    vm.loading=false;

    var lista=[];
    var _listaBancos=[];

    var nuevo={};
    vm.gridLista = {
        columnDefs: [
          { field: 'banco_nombre', displayName: 'BANCO', sort: { direction: uiGridConstants.ASC }, },
          { field: 'numero', displayName: 'NOMBRE', sort: { direction: uiGridConstants.ASC }, },
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/configuraciones/cuentasbancarias/cuentasbancarias.list.row.tpl.html',
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
      //BANCOS
      sisListasService.getByCampo('bancos').then(function(res){
        _listaBancos=res.data.response.datos;
        console.log('_listaBancos',_listaBancos)
      });

      return getList().then(function(){
          vm.list=lista;
          vm.gridLista.data = vm.list;          
          vm.filtrar();
          Pace.stop();
      })
    }

    function getList (){
      vm.loading=true;        
      return cnfCuentasbancariasService.getList(logUser.id_empresa).then(function(res){
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
      vm.gridLista.data = $filter('multiFiltro')(lista, vm.filtro);
    };

    vm.agregar = function(ev){
      return cnfCuentasbancariasService.getOne(logUser.id_empresa, 0).then(function(res){
        console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          cnfCuentasbancariasService.one={};
          angular.copy(res.data.response.datos,cnfCuentasbancariasService.one)
          openDialog(ev);            
        }
      })
    }

    vm.selOne = function(item,ev){
      return cnfCuentasbancariasService.getOne(logUser.id_empresa, item.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          cnfCuentasbancariasService.one={};
          angular.copy(res.data.response.datos,cnfCuentasbancariasService.one)
          openDialog(ev);            
        }
      })
    }

    function openDialog(ev){
        $mdDialog.show({
          controller: 'cuentasbancariasDetailController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/configuraciones/cuentasbancarias/cuentasbancarias.detail.tpl.html',
          locals:{
            bancos:_listaBancos
          },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(){
          $rootScope.showToast('Cuenta Bancaria guardada con exito');
          return getList().then(function(){
              vm.list=lista;
              vm.gridLista.data = vm.list;          
              vm.filtrar();
          })
        });

    }

  }

})();