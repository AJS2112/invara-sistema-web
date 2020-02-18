(function(){
  'use strict';
  
  angular.module("ventasModule")
  .controller("clientesAbonosController", clientesAbonosController);
  clientesAbonosController.$inject=['$rootScope','$mdDialog', '$scope', 'vntClientesService','cajMovimientosService','documento'];

  function clientesAbonosController($rootScope, $mdDialog, $scope, vntClientesService,cajMovimientosService,documento){
    var vm=this;
    vm.one = {};
    vm.pago=[];
    vm.error="";
    vm.full=true;
    vm.miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
    console.log(vm.miCotizacion)
    $scope.$watch('$root.factor', function() {
        calcularMoneda();
    });

    function calcularMoneda(){
      var factor=$rootScope.factor;
      angular.forEach(vm.pago, function(item, index) {
        item.monto_moneda=item.monto*item.factor;
      });
      vm.one.abonos_moneda=vm.one.abonos*factor;
      vm.one.deuda_moneda=vm.one.deuda*factor;
    }
  
    activate();

    function activate(){
      Pace.restart();
      vm.one=documento;
      //PAGO
      cajMovimientosService.getOne(vm.one.id).then(function(res){
        console.log('pago',res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          vm.pago=res.data.response.datos;
          calcularMoneda();
        }
      })
      Pace.stop();
    }

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    /*
    vm.guardar = function() {
      vm.full=false;
      Pace.restart();
      vntClientesService.setOne(vm.one).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          $mdDialog.hide(res.data.response.datos);
          Pace.stop();
        } else if (res.data && res.data.code!==0){
          Pace.stop();
          vm.full=true;
          localStorage.setItem("token",res.data.response.token);
          vm.error=res.data.response.token;
        } 
      })
    } 
    */
  }

})();