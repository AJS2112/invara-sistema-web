(function(){
  'use strict';

  angular.module("ventasModule")
  .controller("ventasOperacionesListController", ventasOperacionesListController);
  ventasOperacionesListController.$inject=['$rootScope', '$scope', '$filter', '$state', '$mdDialog', '$mdMedia', 'uiGridConstants', 'vntOperacionesService', 'sisOperacionesService'];

  function ventasOperacionesListController($rootScope, $scope, $filter, $state, $mdDialog, $mdMedia, uiGridConstants, vntOperacionesService, sisOperacionesService){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));

    var _listaOperaciones=[];

    var vm=this;
    vm.filtro="";
    vm.list=[];
    vm.listaTipoOperaciones=[];
    vm.tipo_operacion={};
    vm.loading=false;

    var _tipoOperacion={};

    vm.gridLista = {
        columnDefs: [
          { field: 'nro_control', displayName: 'NRO CONTROL', sort: { direction: uiGridConstants.DESC }, maxWidth: 160, visible: !$mdMedia('xs')},
          { field: 'fecha', displayName: 'FECHA', cellFilter: 'date:"dd/MM/yyyy"', maxWidth: 150},
          { field: 'cliente_nombre', displayName: 'NOMBRE', },
          { field: 'cliente_rif', displayName: 'RIF', maxWidth: 150, visible: !$mdMedia('xs')},
          { field: 'total_moneda',displayName: 'MONTO', cellFilter: 'currency:""',cellClass: 'cell-align-right',maxWidth:'150',width:'25%' },
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/ventas/operaciones/ventas-operaciones.list.row.tpl.html',
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

    activate();

    function calcularMoneda(){
      var factor=$rootScope.factor;
      angular.forEach(_listaOperaciones, function(item, index) {
        item.total_moneda=item.total*factor;
      });
    }

    function activate(){
      Pace.restart();

      sisOperacionesService.getList('11E7C39A0EACD9A08F1A00E04C6F7E24').then(function(res){
        console.log(res)
        vm.listaTipoOperaciones=res.data.response.datos;
      })
    }

    function getList (){
      vm.loading=true;   
      angular.copy(vm.tipo_operacion,sisOperacionesService.one)
      _tipoOperacion=vm.tipo_operacion;
      _listaOperaciones=[];     

      return vntOperacionesService.getList(logUser.id_empresa, vm.tipo_operacion.id).then(function(res){
        console.log(res)
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
      console.log('_tipoOperacion',_tipoOperacion)
      var one={
        id_empresa:logUser.id_empresa,
        id_tipo:vm.tipo_operacion.id,
        id:0
      }
      return vntOperacionesService.getOne(one).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          var obj=res.data.response.datos;
          //vntOperacionesService.one={};
          //angular.copy(obj,vntOperacionesService.one);
          sessionStorage.setItem("one",JSON.stringify(obj));
          $state.go('config.ventas-operaciones-detail'); 
        }
      })
    }

    vm.selOne = function(item,ev){
      var one={
        id_empresa:logUser.id_empresa,
        id_tipo:vm.tipo_operacion.id,
        id:item.id
      }      
      console.log(one)
      return vntOperacionesService.getOne(one).then(function(res){
        console.log('res getOne', res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          var obj=res.data.response.datos;
          //vntOperacionesService.one={};
          //angular.copy(res.data.response.datos,vntOperacionesService.one);
          sessionStorage.setItem("one",JSON.stringify(obj));
          $state.go('config.ventas-operaciones-detail');
        }
      })
    }


  }

})();