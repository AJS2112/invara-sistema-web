(function(){
  'use strict';

  angular.module("inventariosModule")
  .controller("cargosdescargosListaController", cargosdescargosListaController);
  cargosdescargosListaController.$inject=['$rootScope','$filter', '$state', '$mdDialog', 'uiGridConstants', 'sisOperacionesService', 'sisListasService', 'invOperacionesService', 'CONFIG'];

  function cargosdescargosListaController($rootScope, $filter, $state, $mdDialog, uiGridConstants, sisOperacionesService, sisListasService, invOperacionesService, CONFIG){
    

    var vm=this;
    vm.filtro="";
    vm.id_tipo=0;
    vm.list=[];
    vm.full=true;
    vm.listaOperaciones=[];

    var lista=[];
    var _listaOperaciones=[];
    var _listaTipos=[];

    var nuevo={};
    vm.gridOptions = {
        columnDefs: [
          { field: 'nro_control', displayName: 'Nº CONTROL', sort: { direction: uiGridConstants.DESC }, maxWidth: 140},
          { field: 'fecha', displayName: 'FECHA', maxWidth: 140},
          { field: 'destino_nombre', displayName: 'ALMACEN', maxWidth: 140},
          { field: 'usuario_nombre', displayName: 'USUARIO' },
          { field: 'observacion', displayName: 'OBSERVACION'},
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/movimientos/cargosdescargos/cargosdescargos.lista.row.tpl.html',
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
      //OPERACIONES
      sisOperacionesService.getList('11E7A87DDEF65E619B0700270E383B06').then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaOperaciones=res.data.response.datos;
          vm.listaOperaciones=_listaOperaciones;
        }
      })
      /*
      //TIPOS
      listasService.getByCampo('tipo_producto').then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaTipos=res.data.response.datos;
        }
      })
      //CATEGORIAS
      categoriasService.getList().then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaCategorias=res.data.response.datos;
        }
      })
      //SISTEMA UNIDADES
      listasService.getByCampo('sistema_unidades').then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaSistemas=res.data.response.datos;
        }
      })
      //UNIDADES
      unidadesService.getList().then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaUnidades=res.data.response.datos;
        }
      })
      //IMPUESTOS
      impuestosService.getList().then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaImpuestos=res.data.response.datos;
        }
      })


      return getList().then(function(){
          vm.list=lista;
          vm.gridOptions.data = vm.list;          
          vm.filtrar();
          Pace.stop();
      })
      */
    }


    vm.getList = function(){        
      Pace.restart();
      return invOperacionesService.getList(vm.id_tipo).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;
          vm.gridOptions.data = lista;          
          vm.filtrar();
          return lista;
        }
      })
      Pace.stop();
    }

    vm.filtrar = function() {
      vm.gridOptions.data = $filter('multiFiltro')(lista, vm.filtro);
    };

    vm.agregar = function(ev){
      var one={
        id:0,
        id_tipo:vm.id_tipo
      }
      return invOperacionesService.getOne(one).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          invOperacionesService.one={};
          angular.copy(res.data.response.datos,invOperacionesService.one)
          $state.go('config.movimientos-cargosdescargos-detail', 
                    { 
                      listaOperaciones: _listaOperaciones,
                      /*sectionName: invoperacionesService.one.nombre,
                      listaCategorias: _listaCategorias,
                      listaSistemas: _listaSistemas,
                      listaUnidades: _listaUnidades,
                      listaImpuestos: _listaImpuestos,
                      listaProductos: lista*/
                    });            
        }
      })
    }

    vm.selOne = function(item,ev){
      var one={
        id:item.id,
        id_tipo:vm.id_tipo
      }
      return invOperacionesService.getOne(one).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          invOperacionesService.one={};
          angular.copy(res.data.response.datos,invOperacionesService.one)
          $state.go('config.movimientos-cargosdescargos-detail', 
                    { 
                      sectionName: invOperacionesService.one.nombre,
                      listaTipos: _listaTipos,
                      listaCategorias: _listaCategorias,
                      listaSistemas: _listaSistemas,
                      listaUnidades: _listaUnidades,
                      listaImpuestos: _listaImpuestos,
                      listaProductos: lista
                    });
        }
      })
    }

  }

})();