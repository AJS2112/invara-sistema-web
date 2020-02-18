(function(){
  'use strict';

  angular.module("inventariosModule")
  .controller("modalVentasProductosController", modalVentasProductosController);
  modalVentasProductosController.$inject=['$rootScope','$filter', '$mdDialog', 'uiGridConstants', 'invMovimientosService', 'invProductosService', 'listaProductos', 'listaUnidades', 'invExistenciasService', 'CONFIG'];

  function modalVentasProductosController($rootScope, $filter, $mdDialog, uiGridConstants, invMovimientosService, invProductosService, listaProductos, listaUnidades, invExistenciasService, CONFIG){
    var vm=this;
    vm.filtro="";
    vm.full=true;
    vm.list=[];
    vm.listaUnidades=[];

    vm.one={};
    vm.nombre="";
    vm.valor="";
    vm.cantidad=1;
    vm.precio=0;
    vm.cantidad_compra=1;

    vm.cntSel=0;
    vm.cntComponentes=0;
    vm.rowSel=null;
    vm.unidad={};
    vm.totalCosto=0;

    vm.searchText=null;
    vm.selectedProducto=null;

    var lista=[];
    var listaProductos=listaProductos;
    var listaUnidades=listaUnidades;


    vm.gridExistencias = {
        enableCellEditOnFocus: true,
        columnDefs: [
          { field: 'almacen_nombre', displayName: 'ALMACEN', enableCellEdit: false, },
          { name: 'cantidad', displayName: 'CANTIDAD',  validators: {required: true}, cellTemplate: 'ui-grid/cellTitleValidator', maxWidth: 120},
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.edit.on.afterCellEdit(null,function(rowEntity, colDef, newValue, oldValue){
          });
        },
    };


    vm.selProducto=function(item){
      if (item){
        vm.one=item;
        console.log('item seleccionado')
        console.log(vm.one)
        vm.precio=item.precio_venta;

        //OBTENER SISTEMA DE UNIDADES
        if (item.id_unidad_venta){
          var filtro={};
          filtro.id=item.id_unidad_venta;   
          var result = $filter('filter')(listaUnidades, filtro, true);
          if (result.length){
            var filtroUnd={};
            filtroUnd.id_tipo=result[0].id_tipo;
            vm.listaUnidades = $filter('filter')(listaUnidades, filtroUnd, true);
          }
        }
        /*
        */
      }
    }

    vm.calcularCantidades= function(){
      vm.cantidad_compra=dbl(vm.cantidad/vm.one.cantidad_unidad_compra);
    }


    activate();

    function activate(){
      Pace.restart();
      vm.one=invMovimientosService.one;

      vm.selectedProducto=selectById(listaProductos, vm.one.id_producto);
      vm.selProducto(vm.selectedProducto);
    }

    /****************************************************************************/


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
    /*GENERALES ***********************************************************************************************************/
    function selectById (lista, id) {
      if (id){
        var filtro={};
        filtro.id=id;   
        var result = $filter('filter')(lista, filtro, true);
        if (result.length){
          return result[0];
        } else {
          return null;
        }
      } else {
        return null
      }
    }


    function dbl(numero){
      return parseFloat(numero).toFixed(2);
    }

    

    vm.calcular= function (){
      //INICIALIZAR
      if(vm.one.precio_venta!=vm.precio){
        vm.cantidad= dbl(vm.precio/vm.one.precio_venta);
      }
    }



    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.guardar = function(ev){

      var miCosto=0;
      var miPrecio=0;
      var miMonto=0;
      var miMontoImpuesto=0;

      miCosto=vm.selectedProducto.f_cn;
      
      miPrecio=vm.precio;

      miMonto= dbl(vm.precio* vm.cantidad);
      miMontoImpuesto= dbl((((vm.selectedProducto.impuesto_valor/100)+1)*miMonto)-miMonto) ;

      var one={
        id_producto: vm.selectedProducto.id, 
        id_producto_padre: vm.selectedProducto.id_padre, 
        id_unidad: vm.selectedProducto.id_unidad_venta,
        id_impuesto: vm.selectedProducto.id_impuesto, 
        producto_codigo: vm.selectedProducto.codigo,
        producto_nombre: vm.selectedProducto.nombre, 
        producto_unidad: vm.selectedProducto.unidad_venta_nombre, 
        cantidad: vm.cantidad,
        costo: miCosto,
        //precio: miPrecio,
        //precio_venta: vm.selectedProducto.precio_venta,
        precio: vm.selectedProducto.precio_venta,
        valor_impuesto: vm.selectedProducto.impuesto_valor,
        monto: miPrecio* vm.cantidad,
        monto_impuesto: miMontoImpuesto
      };

      console.log('voy a enviar ')
      console.log(one)
      Pace.restart();
      $mdDialog.hide(one);
      Pace.stop();
    }

  }

})();