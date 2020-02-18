(function(){
  'use strict';
  
  angular.module("sistemaModule")
  .controller("empresasDetailController", empresasDetailController);
  empresasDetailController.$inject=['$mdDialog', '$scope', 'sisEmpresasService'];

  function empresasDetailController($mdDialog, $scope, sisEmpresasService){
    var vm=this;
    vm.one = {};
    vm.error="";
    vm.full=true;
    activate();

    function activate(){
      Pace.restart();
      vm.one=sisEmpresasService.one;
      console.log('inicia', vm.one)
     /*
      //INSTRUMENTOS PAGO
              if (vm.one.instrumentos_pago){
                vm.instrumentosSeleccionados=JSON.parse(vm.one.instrumentos_pago);        
              } else {
                vm.instrumentosSeleccionados=[];
              }
              vm.one.instrumentos_pago=vm.instrumentosSeleccionados;
      */
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
      //vm.one.instrumentos_pago=JSON.stringify(vm.one.instrumentos_pago);

            console.log('manda', vm.one)
      sisEmpresasService.setOne(vm.one).then(function(res){
              console.log('recibe', res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
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
  }

})();