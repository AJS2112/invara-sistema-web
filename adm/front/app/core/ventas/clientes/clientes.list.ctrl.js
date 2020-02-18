(function(){
  'use strict';

  angular.module("ventasModule")
  .controller("clientesListController", clientesListController);
  clientesListController.$inject=['$rootScope','$filter', '$state', '$scope', '$mdDialog', 'uiGridConstants', 'vntClientesService'];

  function clientesListController($rootScope, $filter, $state, $scope, $mdDialog, uiGridConstants, vntClientesService){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));

    var vm=this;
    vm.filtro="";
    vm.list=[];
    var lista=[];

    vm.gridOptions = {
        columnDefs: [
          { field: 'nombre', displayName: 'NOMBRE', sort: { direction: uiGridConstants.ASC }, },
          { field: 'rif', displayName: 'RIF',maxWidth:'150',width:'25%' },
          { field: 'deuda_moneda',displayName: 'DEUDA', cellFilter: 'currency:""',cellClass: 'cell-align-right',maxWidth:'150',width:'25%' },
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/ventas/clientes/clientes.list.row.tpl.html',
        enableExpandableRowHeader: false,
        expandableRowScope: { 
          editar: function(ev){
              var sel=vm.gridApi.selection.getSelectedRows();
              vm.selOne(sel[0])
          }, 
          deudas: function(ev){
              var sel=vm.gridApi.selection.getSelectedRows();
              vm.estadoCuenta(sel[0])
          } 
        },          

    };

    $scope.$watch('$root.factor', function() {
        calcularMoneda();
    });

    function calcularMoneda(){
      var factor=$rootScope.factor;
      angular.forEach(lista, function(item, index) {
        item.total_moneda=item.total*factor;
        item.abonos_moneda=item.abonos*factor;
        item.deuda_moneda=item.deuda*factor;
      });
    }

    activate();

    function activate(){
      Pace.restart();

      return getList().then(function(){
          vm.list=lista;
          vm.filtrar();
          Pace.stop();
      })
    }

    function getList (){        
      return vntClientesService.getList(logUser.id_empresa).then(function(res){
        console.log('res',res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;
          calcularMoneda();
          return lista;
        }
      })
    }

    vm.filtrar = function() {
      vm.gridOptions.data = $filter('multiFiltro')(lista, vm.filtro);
    };

    vm.agregar = function(ev){
      return vntClientesService.getOne(logUser.id_empresa,0).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          vntClientesService.one={};
          angular.copy(res.data.response.datos,vntClientesService.one)
          openDialog(ev);            
        }
      })
    }

    vm.selOne = function(item,ev){
      return vntClientesService.getOne(logUser.id_empresa, item.id).then(function(res){

        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          vntClientesService.one={};
          angular.copy(res.data.response.datos,vntClientesService.one)
          openDialog(ev);            
        }
      })
    }

    function openDialog(ev){
        $mdDialog.show({
          controller: 'clientesDetailController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/ventas/clientes/clientes.detail.tpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(){
          $rootScope.showToast('Cliente guardado con exito');
          return getList().then(function(){
              vm.list=lista;
              vm.gridOptions.data = vm.list;          
              vm.filtrar();
          })
        });
    }

    vm.estadoCuenta=function(cliente){
      vntClientesService.one={};
      angular.copy(cliente,vntClientesService.one)
      
      sessionStorage.setItem("one",JSON.stringify(cliente));
      $state.go('config.ventas-clientes-deudas');

    }

  }

})();