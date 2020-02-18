(function(){
  'use strict';

  angular.module("inventariosModule")
  .controller("modalInventarioController", modalInventarioController);
  modalInventarioController.$inject=['$rootScope','$filter', '$mdDialog', 'uiGridConstants', 'listaProductos', 'listaUnidades', 'CONFIG'];

  function modalInventarioController($rootScope, $filter, $mdDialog, uiGridConstants, listaProductos, listaUnidades, CONFIG){
    var vm=this;
    vm.filtro="";
    vm.full=true;
    vm.list=[];
    vm.listaUnidades=[];

    vm.nombre="";
    vm.valor="";
    vm.cantidad=1;
    vm.cntSel=0;
    vm.cntComponentes=0;
    vm.rowSel=null;
    vm.id_unidad=0;
    vm.unidad={};
    vm.totalCosto=0;

    vm.searchText=null;
    vm.selectedProducto=null;

    var lista=[];
    var listaProductos=listaProductos;
    var listaUnidades=listaUnidades;


    activate();

    function activate(){
      Pace.restart();
    }

    /****************************************************************************/
    vm.selProducto=function(item){
      if (item){
        //OBTENER SISTEMA DE UNIDADES
        if (item.id_unidad_venta){
          var filtro={};
          filtro.id=item.id_unidad_venta;   
          var result = $filter('filter')(listaUnidades, filtro, true);
          if (result.length){
            var filtroUnd={};
            filtroUnd.id_tipo=result[0].id_tipo;
            vm.listaUnidades = $filter('filter')(listaUnidades, filtroUnd, true);
            vm.id_unidad=item.id_unidad_venta;
            vm.unidad=selUnidad(vm.id_unidad);
          }
        }
      }
    }

    function selUnidad(idUnd){
      //OBTENER SISTEMA DE UNIDADES
      if (idUnd){
        var filtro={};
        filtro.id=idUnd;   
        var result = $filter('filter')(listaUnidades, filtro, true);
        if (result.length){
          return result[0];
        }
      }
    }    

    vm.selUnidad=function(){
      vm.unidad=selUnidad(vm.id_unidad);
    }    

    vm.querySearch = function( item ) {
      var result= $filter('filter')(listaProductos, item);
      return result;
    }

    /**************************************************************************/

    function dbl(numero){
      return parseFloat(numero).toFixed(2);
    }


    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.guardar = function(ev){
      var one={
        producto_id:vm.selectedProducto.id,
        producto_codigo:vm.selectedProducto.codigo,
        producto_nombre:vm.selectedProducto.nombre,
        producto_unidad:vm.id_unidad,
        unidad_nombre:vm.unidad.nombre,
        cantidad:vm.cantidad,                        
      }
      Pace.restart();
      $mdDialog.hide(one);
      Pace.stop();
    }

  }

})();