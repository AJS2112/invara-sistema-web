(function(){
  'use strict';

  angular.module("inventariosModule")
  .controller("modalComprasProductosController", modalComprasProductosController);
  modalComprasProductosController.$inject=['$rootScope','$filter', '$mdDialog', 'uiGridConstants', 'invMovimientosService', 'invProductosService', 'listaProductos', 'listaImpuestos'];

  function modalComprasProductosController($rootScope, $filter, $mdDialog, uiGridConstants, invMovimientosService, invProductosService, listaProductos, listaImpuestos){
    var vm=this;
    vm.filtro="";
    vm.full=true;
    vm.list=[];
    vm.listaUnidades=[];

    vm.one={};
    vm.nombre="";
    vm.valor="";
    vm.cantidad=1;
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
        vm.calcularCantidades('uc');
        invExistenciasService.getOne(item.id).then(function(res){
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            if (res.data.response.datos){
              vm.listaExistencia=res.data.response.datos;
            } else {
              vm.listaExistencia=[{
                              almacen_nombre:"",
                              cantidad:0
                            }];
            }
            vm.gridExistencias.data=vm.listaExistencia;
          }
        })

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

    vm.calcularCantidades= function(cnt){
      switch(cnt) {
          case 'uv':
              vm.cantidad_compra=dbl(vm.cantidad/vm.one.cantidad_unidad_compra);
              break;
          case 'uc':
              vm.cantidad=dbl(vm.cantidad_compra * vm.one.cantidad_unidad_compra);
              break;
          default:
              vm.cantidad=dbl(vm.cantidad_compra * vm.one.cantidad_unidad_compra);
      }
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

    

    vm.calcular= function (tipo){
      //INICIALIZAR
      var pctDcto=(parseFloat(vm.one.costo_pct_dcto)/100)+1;
      var pctAdic=(parseFloat(vm.one.costo_pct_adic)/100)+1;
      var utilFactura=(parseFloat(vm.one.factura_pct_utilidad)/100)+1;
      var utilLista=(parseFloat(vm.one.lista_pct_utilidad)/100)+1;
      var impuesto=0;
      if (vm.one.impuesto_valor){
        impuesto=vm.one.impuesto_valor;
      }
      var valorIva=(parseFloat(impuesto)/100)+1;
      var fpi=0;
      var lpi=0;

      //FACTURA
      vm.one.factura_costo_neto= dbl(vm.one.factura_costo_bruto/pctDcto);
      vm.one.factura_costo_neto= dbl(vm.one.factura_costo_neto*pctAdic);

      //LISTA
      vm.one.lista_costo_neto= dbl(vm.one.lista_costo_bruto/pctDcto);
      vm.one.lista_costo_neto= dbl(vm.one.lista_costo_neto*pctAdic);

      switch(tipo) {
          case 'precio':
              fpi=dbl(vm.one.factura_precio_final/valorIva);
              lpi= dbl(vm.one.lista_precio_final/valorIva);

              vm.one.factura_pct_utilidad= parseFloat(((fpi/vm.one.factura_costo_neto)-1)*100);
              vm.one.lista_pct_utilidad= parseFloat(((lpi/vm.one.lista_costo_neto)-1)*100);
              break;
          case 'util':
              fpi=dbl(vm.one.factura_costo_neto*utilFactura);
              lpi= dbl(vm.one.lista_costo_neto*utilLista);
              vm.one.factura_precio_final= dbl(fpi*valorIva);
              vm.one.lista_precio_final= dbl(lpi*valorIva);
              break;
      }
    }



    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.guardar = function(ev){
      console.log('quiero guardar vm.one')
      console.log(vm.one)
      invProductosService.setOne(vm.one).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          console.log('se modifico el producto')
        }
      })

      var miCosto=0;
      var miPrecio=0;
      var miMonto=0;
      var miMontoImpuesto=0;

      miCosto=vm.selectedProducto.f_cn;
      
      if (Number(vm.selectedProducto.factura_precio_final)>Number(vm.selectedProducto.lista_precio_final)){
        miPrecio=vm.selectedProducto.factura_precio_final;
      } else {
        miPrecio=vm.selectedProducto.lista_precio_final;
      }

      miMonto= dbl(miPrecio* vm.cantidad);
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
        precio: miPrecio,
        valor_impuesto: vm.selectedProducto.impuesto_valor,
        monto: miPrecio* vm.cantidad,
        monto_impuesto: miMontoImpuesto
      };

      Pace.restart();
      $mdDialog.hide(one);
      Pace.stop();
    }

  }

})();