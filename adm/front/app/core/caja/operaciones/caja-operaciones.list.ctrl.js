(function(){
  'use strict';

  angular.module("cajaModule")
  .controller("cajaOperacionesListController", cajaOperacionesListController);
  cajaOperacionesListController.$inject=['$rootScope','$filter', '$state', '$scope', '$mdDialog', '$mdMedia', 'uiGridConstants', 'cajOperacionesService', 'sisOperacionesService', 'sisListasService', 'cnfCuentasbancariasService', 'CONFIG'];

  function cajaOperacionesListController($rootScope, $filter, $state, $scope, $mdDialog, $mdMedia, uiGridConstants, cajOperacionesService, sisOperacionesService, sisListasService, cnfCuentasbancariasService, CONFIG){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));
    var myEmpresa=JSON.parse(sessionStorage.getItem("empresa"));
    var _listaOperaciones=[];

    var lista=[];

    var vm=this;
    vm.filtro="";
    vm.list=[];
    vm.listaTipoOperaciones=[];
    vm.tipo_operacion={};
    vm.loading=false;

    var _tipoOperacion={};
    var _listaInstrumentos=[];
    var _listaBancos=[];
    var _listaCuentas=[];

    vm.gridLista = {
        columnDefs: [
          { field: 'nro_control', displayName: 'NRO CONTROL', sort: { direction: uiGridConstants.DESC }, maxWidth: 140, visible: !$mdMedia('xs') },
          { field: 'fecha', displayName: 'FECHA', cellFilter: 'date:"dd/MM/yyyy"', maxWidth: 140 },
          { field: 'descripcion', displayName: 'DESCRIPCION', },
          { field: 'monto', displayName: 'MONTO',cellFilter: 'currency:""',cellClass: 'cell-align-right', maxWidth: 140,width:'25%' },
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/caja/operaciones/caja-operaciones.list.row.tpl.html',
        enableExpandableRowHeader: false,
        expandableRowScope: { 
          editar: function(ev){
              var sel=vm.gridApi.selection.getSelectedRows();
              vm.selOne(sel[0])
          } 
        },
        rowStyle: function(row){
                if(row.entity.id_status > 1){
                  return 'row-null';
                }
              },
            rowTemplate : `<div ng-class="grid.options.rowStyle(row)"><div ng-mouseover="rowStyle={'background-color': (rowRenderIndex%2 == 1) ? '#F5F5F5' : '#F5F5F5','cursor':'pointer' };" 
               ng-mouseleave="rowStyle={}" ng-style="selectedStyle={'background-color': (row.isSelected) ? '#2196F3' : '','color': (row.isSelected) ? '#E6E6E6' : ''}">
                <div  ng-style="(!row.isSelected) ? rowStyle : selectedStyle" 
                    ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" 
                    ui-grid-one-bind-id-grid="rowRenderIndex + '-' + col.uid + '-cell'"
                    class="ui-grid-cell"   
                    ng-class="{ 'ui-grid-row-header-cell': col.isRowHeader }" role="{{col.isRowHeader ? 'rowheader' : 'gridcell'}}" 
                    ui-grid-cell>
                </div>
            </div></div>`              

    };

    $scope.$watch('$root.factor', function() {
        calcularMoneda();
    });

    function calcularMoneda(){
      var factor=$rootScope.factor;
      angular.forEach(lista, function(item, index) {
        item.deuda_moneda=item.deuda*factor;
      });
    }

    activate();

    function activate(){
      Pace.restart();

      sisOperacionesService.getList('11E8FA24BAAD31B9AC3D00270E383B06').then(function(res){
        vm.listaTipoOperaciones=res.data.response.datos;
        console.log('vm.listaTipoOperaciones',vm.listaTipoOperaciones)
      })

      //SISTEMA INSTRUMENTOS PAGO
      sisListasService.getByCampo('instrumento_pago').then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaInstrumentos=res.data.response.datos;

        }
      })

      //BANCOS
      sisListasService.getByCampo('bancos').then(function(res){
          _listaBancos=res.data.response.datos;
      })

      //CUENTAS
      cnfCuentasbancariasService.getList(myEmpresa.id).then(function(res){
          _listaCuentas=res.data.response.datos;
      })
    
    }

    function getList (){        
      vm.loading=true;   
      angular.copy(vm.tipo_operacion,sisOperacionesService.one)
      _tipoOperacion=vm.tipo_operacion;
      _listaOperaciones=[];     

      return cajOperacionesService.getList(logUser.id_empresa, vm.tipo_operacion.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaOperaciones=res.data.response.datos;
          calcularMoneda();
          vm.filtrar();
          vm.loading=false;
          Pace.stop();
        }
      })
    }

    vm.getList=function(){
      getList().then(function(){
          vm.gridLista.data = _listaOperaciones;          
      })
    }

    vm.filtrar = function() {
      vm.gridLista.data = $filter('multiFiltro')(_listaOperaciones, vm.filtro);
    };

    vm.agregar = function(ev){
      var one={
        id_empresa:logUser.id_empresa,
        id_tipo:vm.tipo_operacion.id,
        id:0
      }   
      return cajOperacionesService.getOne(one).then(function(res){
        console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          cajOperacionesService.one={};
          angular.copy(res.data.response.datos,cajOperacionesService.one)
          openDialog(ev);            
        }
      })
    }

    vm.selOne = function(item,ev){
      var one={
        id_empresa:logUser.id_empresa,
        id_tipo:vm.tipo_operacion.id,
        id:item.id
      }   
      return cajOperacionesService.getOne(one).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          cajOperacionesService.one={};
          angular.copy(res.data.response.datos,cajOperacionesService.one)
          openDialog(ev);            
        }
      })
    }

    function openDialog(ev){
        $mdDialog.show({
          controller: 'cajaOperacionesDetailController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/caja/operaciones/caja-operaciones.detail.tpl.html',
          locals:{
            listaInstrumentos:_listaInstrumentos,
            listaBancos:_listaBancos,
            listaCuentas:_listaCuentas
          },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(){
          $rootScope.showToast('Operación guardada con exito');
          return getList().then(function(){
              vm.list=lista;
              vm.gridLista.data = vm.list;          
              vm.filtrar();
          })
        });

    }


  }

})();