(function(){
  'use strict';

  angular.module("ventasModule")
  .controller("ventasOperacionesSelProdController", ventasOperacionesSelProdController);
  ventasOperacionesSelProdController.$inject=['$rootScope','$filter', '$mdDialog', 'uiGridConstants', 'invMovimientosService', 'invProductosService', 'listaProductos'];

  function ventasOperacionesSelProdController($rootScope, $filter, $mdDialog, uiGridConstants, invMovimientosService, invProductosService, listaProductos){
    var factor=Number($rootScope.factor);
    var _listaCotizacion=JSON.parse(sessionStorage.getItem("listaCotizacion"));

    var vm=this;
    vm.filtro="";
    vm.full=true;
    vm.list=[];
    vm.listaCotizacion=JSON.parse(sessionStorage.getItem("listaCotizacion"));

    vm.one={};
    vm.nombre="";
    vm.valor="";
    vm.cantidad=1;

    vm.total_precio=0;
    vm.total_precio_moneda=0;

    vm.searchText=null;
    vm.selectedProducto=null;

    var listaProductos=listaProductos;


    
    vm.selProducto=function(item){
      console.log('selProducto')
      if (item){
        angular.copy(item,vm.one)
        calcularPctUtil();
        toMoneda();
        totalizar();
      }
    }

    vm.seleccionaCotizacion=function(){
      var _lista=vm.listaCotizacion;
      var filtro={};
      filtro.id_moneda=$rootScope.id_moneda;   

      var result = $filter('filter')(_lista, filtro, true);
      if (result.length){
        $rootScope.factor=result[0].valor;
        factor=$rootScope.factor;
        sessionStorage.setItem("oneCotizacion",JSON.stringify(result[0]));
        toMoneda();
      }
      totalizar();
    }

    activate();

    function activate(){
      Pace.restart();
      vm.selectedProducto=selectById(listaProductos, invMovimientosService.one.id_producto);
      if (vm.selectedProducto){
        vm.cantidad=invMovimientosService.one.cantidad;      
        vm.selProducto(vm.selectedProducto);
  
        if (invMovimientosService.one.id_producto){
          vm.one.costo=invMovimientosService.one.costo;
          vm.one.precio=invMovimientosService.one.precio;
        }
  
        calcularPctUtil();
        vm.seleccionaCotizacion();

      }
    }

    /****************************************************************************/

    vm.querySearch = function( item ) {
      var result= $filter('filter')(listaProductos, item);
      return result;
    }

    /**************************************************************************/
    /*GENERALES ***********************************************************************************************************/
    function dbl(numero){
      return parseFloat(numero).toFixed(2);
    }

    function toDolar(){
      vm.one.costo=vm.one.costo_moneda/factor;
      vm.one.precio=vm.one.precio_moneda/factor;
    }

    function toMoneda(){
      vm.one.costo_moneda=vm.one.costo*factor;
      vm.one.precio_moneda=vm.one.precio*factor;
    }    

    function calcularPctUtil(){
      var pctUtil= ((vm.one.precio*100)/vm.one.costo)-100;
      vm.one.pct_util=pctUtil;
    }

    function calcularPrecio(){
      var precio=vm.one.costo * ((vm.one.pct_util/100)+1);
      vm.one.precio=precio;
    }    

    function totalizar(){
      vm.total_precio=vm.one.precio*vm.cantidad;
      vm.total_precio_moneda=vm.one.precio_moneda*vm.cantidad;
    }

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

    vm.calcularPrecio=function(){
      toDolar();
      calcularPrecio();
      totalizar();
    }

    vm.calcularPctUtil=function(){
      toDolar();
      calcularPctUtil();
      totalizar();
    }

    vm.multiplicar=function(){
      totalizar();
    }

    vm.dividir=function(){
      vm.one.precio_moneda=vm.total_precio_moneda/vm.cantidad;
      toDolar();
      calcularPctUtil();
      totalizar();
    }


    /********************************************************************************************************************/

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.guardar = function(ev){
      var one={
        id_producto: vm.one.id, 
        id_impuesto: vm.one.id_impuesto, 
        producto_codigo: vm.one.codigo,
        producto_nombre: vm.one.nombre, 
        producto_unidad: vm.one.unidad_nombre, 
        cantidad: vm.cantidad,
        costo: vm.one.costo,
        pct_util:vm.one.pct_util,
        precio: vm.one.precio,
        precio_moneda: vm.one.precio_moneda,
        valor_impuesto: vm.one.impuesto_valor,
      };

      Pace.restart();
      $mdDialog.hide(one);
      Pace.stop();
    }

  }

})();