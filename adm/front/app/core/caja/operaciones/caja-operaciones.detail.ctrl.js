(function(){
  'use strict';
  
  angular.module("cajaModule")
  .controller("cajaOperacionesDetailController", cajaOperacionesDetailController);
  cajaOperacionesDetailController.$inject=['$rootScope','$mdDialog', '$scope', 'cajOperacionesService', 'cnfCuentasbancariasService', 'cajMovimientosService', 'listaInstrumentos', 'listaBancos', 'listaCuentas'];

  function cajaOperacionesDetailController($rootScope, $mdDialog, $scope, cajOperacionesService, cnfCuentasbancariasService, cajMovimientosService, listaInstrumentos, listaBancos, listaCuentas){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));

    var vm=this;
    vm.one = {};
    vm.ip={
      id_instrumento:0,
      id_cuenta:0,
      id_banco:0,
      numero_operacion:""
    };

    vm.error="";
    vm.full=true;
    vm.listaInstrumentos=listaInstrumentos;
    vm.listaBancos=listaBancos;
    vm.listaCuentas=listaCuentas;

    vm.id_banco=0;
    vm.id_cuenta=0;
    vm.nro_operacion="";

    vm.bancos_visible=false;
    vm.cuentas_visible=false;
    vm.nro_operacion_visible=false;

    vm.selInstrumento = function(){
      console.log('EVALUA')
      switch(vm.ip.id_instrumento) {
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
          default:
              vm.bancos_visible=false;
              vm.cuentas_visible=false;
              vm.nro_operacion_visible=false;
      }   
    }

    activate();

    function activate(){
      Pace.restart();
      vm.one=cajOperacionesService.one;
      console.log('llega', vm.one)

      //MOVIMIENTO
      if (vm.one.id){
        cajMovimientosService.getOne(vm.one.id).then(function(res){
          console.log(res)
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            vm.ip=res.data.response.datos[0];
            console.log('instrumentoPago',vm.ip)
            vm.selInstrumento();
          }
        })
      } else {
        console.log('NEW ONE')
      }

      if(vm.one.fecha.length<11){
        vm.one.fecha+=" 12:00:00";
      }
      vm.one.fecha=new Date(vm.one.fecha);

      Pace.stop();
    }

    

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.guardar = function() {
      vm.full=false;
      Pace.restart();
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      vm.one.id_cotizacion=miCotizacion.id_cotizacion;
      vm.one.id_usuario=logUser.id;

      var one={
        head:vm.one,
        pago:vm.ip
      }

      //console.log('save one',one)
      cajOperacionesService.setOne(one).then(function(res){
        console.log('return setOne',res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          $rootScope.showToast('Operación guardada con exito');
          $mdDialog.hide();
          Pace.stop();
        } else if (res.data && res.data.code!==0){
          Pace.stop();
          vm.full=true;
          localStorage.setItem("token",res.data.response.token);
          vm.error=res.data.response.token;
        } 
      })
    } 

    vm.anular = function() {
      var confirm = $mdDialog.confirm()
            .title('¿Realmente desea anular el documento?')
            .multiple(true)
            .textContent('Esta acción no se podrá deshacer!.')
            .ariaLabel('Eliminar')
            .ok('Si, deseo anularlo!')
            .cancel('No');

      $mdDialog.show(confirm).then(function() {
        console.log('voy a anular')
        vm.one.id_usuario=logUser.id;
        
        var one={
          //tipo:vm.tipoOperacion,
          head:vm.one,
        }
        
        console.log('envio:', vm.one)
        cajOperacionesService.nullOne(vm.one).then(function(res){
          console.log('retorna: ',res)
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            vm.one.id=res.data.response.datos;
            $rootScope.showToast('Documento anulado con exito');
            $state.go('menu.caja-operaciones-list'); 
          } else if (res.data && res.data.code!==0){
            localStorage.setItem("token",res.data.response.token);
            vm.error=res.data.response.token;
          } 
        })

      }, function() {
        $mdDialog.cancel();
      });

    } 


  }

})();