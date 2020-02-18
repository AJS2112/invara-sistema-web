(function(){
  'use strict';

  angular.module("inventarioModule")
  .controller("cargosdescargosModalProductosController", cargosdescargosModalProductosController);
  cargosdescargosModalProductosController.$inject=['$rootScope','$filter', '$mdDialog', 'uiGridConstants', 'invProductosService', 'listaProductos', 'listaUnidades', 'CONFIG'];

  function cargosdescargosModalProductosController($rootScope, $filter, $mdDialog, uiGridConstants, invProductosService, listaProductos, listaUnidades, CONFIG){
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
    var listaFormulas=listaFormulas;

    vm.gridModal = {
        columnDefs: [
          { field: 'componente_codigo', displayName: 'CODIGO', maxWidth:140, enableCellEdit: false},
          { field: 'componente_nombre', displayName: 'COMPONENTE', enableCellEdit: false, sort: { direction: uiGridConstants.ASC }, },
          { field: 'componente_unidad', displayName: 'UNIDAD', maxWidth:120, enableCellEdit: false},
          { field: 'cantidad', displayName: 'CANTIDAD', cellFilter: 'currency:""',cellClass: 'cell-align-right',maxWidth:100},
          { field: 'componente_dolar_costo_neto', displayName: 'COSTO', cellFilter: 'currency:""',cellClass: 'cell-align-right',maxWidth:100},
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.edit.on.beginCellEdit(null,function(rowEntity, colDef){
            vm.cntSel=1;
            vm.rowSel=rowEntity;
          });
        },
        enableCellEditOnFocus: true,
        selectionRowHeaderWidth: 40,
        rowHeight: 40
    };

    activate();

    function activate(){
      Pace.restart();
      if (lista){
        vm.cntComponentes=lista.length;
        vm.totalCosto=totalizar();
      }
    }

    function getList (){        
      /*return formulasService.getList(productosService.one.id).then(function(res){
        if (res.data && res.data.code==0){
          console.log(res.data.response.datos)
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;
          vm.totalCosto=totalizar();
          return lista;
        }
      })*/
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
    vm.agregar = function(ev){
      var und=selUnidad(vm.selectedProducto.id_unidad_venta);
      var costoUnd=(vm.selectedProducto.dolar_costo_neto*vm.unidad.factor_conversion)/und.factor_conversion;
      var one={
        id:"",
        order_id:"",
        id_producto: invProductosService.one.id,
        id_componente: vm.selectedProducto.id,
        id_unidad: vm.unidad.id,
        componente_codigo: vm.selectedProducto.codigo,
        componente_nombre: vm.selectedProducto.nombre,
        componente_unidad:vm.unidad.nombre,
        componente_dolar_costo_neto:costoUnd*vm.cantidad,
        cantidad: vm.cantidad
      }
      if (!lista){
        lista=[];
      }
      lista.push(one);
      vm.nombre="";
      vm.valor="";
      vm.gridModal.data = lista;
      vm.selectedProducto=null;
      vm.searchText=null;
      vm.cantidad=1;

      vm.cntComponentes=lista.length;
      vm.totalCosto=totalizar();
    }

    vm.eliminar = function(ev){
      var sel=vm.rowSel;
      var indice = lista.indexOf(sel);
      lista.splice(indice,1);        
      vm.cntSel=0;
      vm.gridModal.data = lista;
      vm.cntComponentes=lista.length;

      vm.totalCosto=totalizar();
    }    

    function totalizar(){
      var total=0;
      for (var i = 0; i < lista.length; i++) {
        total += Number(lista[i].componente_dolar_costo_neto);
      }
      return total;
    }    

    function dbl(numero){
      return parseFloat(numero).toFixed(2);
    }

    function calcular  (){
      //INICIALIZAR
      var one={};
      one=invProductosService.one;

      var dolar= parseFloat(CONFIG.cotizacion_dolar).toFixed(2);
      var pctDcto=(parseFloat(one.costo_pct_dcto)/100)+1;
      var pctAdic=(parseFloat(one.costo_pct_adic)/100)+1;
      var utilDolar=(parseFloat(one.dolar_pct_utilidad)/100)+1;
      var totalCosto=totalizar();

      //DOLAR
      one.dolar_costo_bruto=dbl(totalCosto);
      one.dolar_costo_neto= dbl(one.dolar_costo_bruto/pctDcto);
      one.dolar_costo_neto= dbl(one.dolar_costo_neto*pctAdic);
      one.dolar_precio_final= dbl(one.dolar_costo_neto*utilDolar);
      one.dolar_costo_dolar= totalCosto / dolar;

      invProductosService.one=one;
    }    

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.guardar = function(ev){
      Pace.restart();
      calcular();      
      $mdDialog.hide(lista);
      Pace.stop();
    }

  }

})();