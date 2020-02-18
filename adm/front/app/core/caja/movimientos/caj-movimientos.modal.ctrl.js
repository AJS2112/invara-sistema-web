(function(){
  'use strict';

  angular.module("cajaModule")
  .controller("cajMovimientosModalController", cajMovimientosModalController);

  cajMovimientosModalController.$inject=['$rootScope','$filter', '$mdDialog', 'sisListasService', 'cajMovimientosService', 'cnfCuentasbancariasService', 'padre', 'totalDocumento', 'instrumentosPago'];
  function cajMovimientosModalController($rootScope, $filter, $mdDialog, sisListasService,  cajMovimientosService, cnfCuentasbancariasService, padre,  totalDocumento, instrumentosPago){
    var myEmpresa=JSON.parse(sessionStorage.getItem("empresa"));

    var vm=this;
    vm.factor=sessionStorage.getItem("valorCotizacion");
    vm.filtro="";
    vm.full=true;
    vm.list=[];
    vm.listaInstrumentos=[];
    vm.listaCotizacion=JSON.parse(sessionStorage.getItem("listaCotizacion"));
    vm.padre=padre;
    vm.totales={
      documento:0,
      documento_moneda:0,
      seleccionado:0,
      seleccionado_moneda:0,
      resta:0,
      resta_moneda:0

    };
    vm.id_instrumento=0;

    vm.id_banco=0;
    vm.id_cuenta=0;
    vm.nro_operacion="";

    vm.bancos_visible=false;
    vm.cuentas_visible=false;
    vm.nro_operacion_visible=false;

    vm.monto=0;
    vm.seleccionPago=[];
    console.log('instrumentosPago',instrumentosPago)
    vm.seleccionPago=instrumentosPago;

    var lista=[];
    var listaInstrumentos=[];

    vm.calcularTotales=function(){
        vm.pagoTotal = false
        vm.totales.seleccionado=0;
        vm.totales.documento=totalDocumento*vm.factor;

        if (vm.seleccionPago){
          for (var i = 0; i < vm.seleccionPago.length; i++) {
            vm.totales.seleccionado += Number(vm.seleccionPago[i].monto_moneda);
          }
          
          vm.totales.resta=vm.totales.documento-vm.totales.seleccionado;
          vm.monto=vm.totales.resta;
          //vm.one.monto=vm.totalResta;
          if (vm.totales.seleccionado >= vm.totales.documento){
            vm.pagoTotal = true
          }
        }
        console.log('vm.totales',vm.totales)
    }

    vm.seleccionaCotizacion=function(){
      var _lista=vm.listaCotizacion;
      var filtro={};
      filtro.id_moneda=$rootScope.id_moneda;   

      var result = $filter('filter')(_lista, filtro, true);
      if (result.length){
        $rootScope.factor=result[0].valor;
        vm.factor=$rootScope.factor;
        sessionStorage.setItem("oneCotizacion",JSON.stringify(result[0]));
        for (var i = 0; i < vm.seleccionPago.length; i++) {
          vm.seleccionPago[i].monto_moneda= Number(vm.seleccionPago[i].monto)*vm.factor;
        }

      }
      vm.calcularTotales();
    }

    vm.calcularFactor=function(){
      for (var i = 0; i < vm.seleccionPago.length; i++) {
        vm.seleccionPago[i].monto_moneda= Number(vm.seleccionPago[i].monto)*vm.factor;
      }
      vm.calcularTotales();
    }

    activate();

    function activate(){
      Pace.restart();
      vm.calcularTotales();

      //INSTRUMENTOS
      var instrumentos={instrumentos:myEmpresa.instrumentos_pago};
      sisListasService.getList(instrumentos).then(function(res){
          vm.listaInstrumentos=res.data.response.datos;
      })    

      //BANCOS
      sisListasService.getByCampo('bancos').then(function(res){
          vm.listaBancos=res.data.response.datos;
      })

      //CUENTAS
      cnfCuentasbancariasService.getList(myEmpresa.id).then(function(res){
          vm.listaCuentas=res.data.response.datos;
      })
    }

    /****************************************************************************/
    function dbl(numero){
      return parseFloat(numero).toFixed(2);
    }

    vm.addInstrumento = function(){
      var objPago={
        id_empresa:myEmpresa.id,
        id_instrumento:"",        
        instrumento_nombre:"",
        monto:0,
        monto_moneda:0,
        id_banco:"",
        id_cuenta:"",
        numero_operacion:"",
        id_moneda:"",
        factor:vm.factor
      };

      objPago.id_instrumento=vm.id_instrumento;
      var instSeleccionado= $filter('filter')(vm.listaInstrumentos,vm.id_instrumento, undefined);
      objPago.instrumento_nombre=instSeleccionado[0].nombre;
      objPago.monto=Number(vm.monto/vm.factor);
      objPago.monto_moneda=Number(vm.monto);

      if(vm.bancos_visible)objPago.id_banco=vm.id_banco;
      if(vm.cuentas_visible)objPago.id_cuenta=vm.id_cuenta;
      if (vm.nro_operacion_visible)objPago.numero_operacion=vm.nro_operacion;

      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      objPago.id_moneda=miCotizacion.id_moneda;
      objPago.factor=vm.factor;

      vm.seleccionPago.push(objPago);
      console.log(vm.seleccionPago)
      vm.nro_operacion="";
      vm.calcularTotales();
    }

    vm.delInstrumento = function(id){
      var indice = vm.seleccionPago.indexOf(id);
      vm.seleccionPago.splice(indice,1);   
       vm.calcularTotales();    
    }

    vm.selInstrumento = function(){
      switch(vm.id_instrumento) {
          case "11E8F78E1E002ADFB23400270E383B06": //EFECTIVO
              vm.bancos_visible=false;
              vm.cuentas_visible=false;
              vm.nro_operacion_visible=false;
              break;
          case "11E8F78E51460978B23400270E383B06": //CHEQUE
              vm.bancos_visible=true;
              vm.cuentas_visible=false;
              vm.nro_operacion_visible=true;
              break;
          case "11E8F78E5F7F6327B23400270E383B06": //DEPOSITO
              vm.bancos_visible=false;
              vm.cuentas_visible=true;
              vm.nro_operacion_visible=true;
              break;
          case "11E8F78E66E6B6F5B23400270E383B06": //PUNTO VENTA
              vm.bancos_visible=false;
              vm.cuentas_visible=true;
              vm.nro_operacion_visible=false;
              break;      
          case "11E93E7A9E776D889B0D00E04C6F7E24": //CREDITO
              vm.bancos_visible=false;
              vm.cuentas_visible=false;
              vm.nro_operacion_visible=false;
              break;    
          default:
              vm.bancos_visible=false;
              vm.cuentas_visible=false;
              vm.nro_operacion_visible=false;
      }      
    }

    
    vm.cancel = function() {
      $mdDialog.cancel();
    };


    vm.guardar = function(ev){
      Pace.restart();
      $mdDialog.hide(vm.seleccionPago);
      Pace.stop();
    }
    
  }

})();