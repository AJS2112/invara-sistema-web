(function(){
  'use strict';
  
  angular.module("configuracionesModule")
  .controller("cuentasbancariasDetailController", cuentasbancariasDetailController);
  cuentasbancariasDetailController.$inject=['$mdDialog', '$scope', 'cnfCuentasbancariasService', 'bancos'];

  function cuentasbancariasDetailController($mdDialog, $scope, cnfCuentasbancariasService, bancos){
    var vm=this;
    vm.listaBancos=bancos;
    vm.one = {};
    vm.error="";
    vm.full=true;

    activate();

    function activate(){
      vm.one=cnfCuentasbancariasService.one;
    }

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.guardar = function() {
      Pace.restart();
      vm.full=false;
      cnfCuentasbancariasService.setOne(vm.one)
      .then(function(res){
        console.log('res guardar')
        console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          $mdDialog.hide();
          Pace.stop();
        } else if (res.data && res.data.code!==0){
          localStorage.setItem("token",res.data.response.token);
          vm.error=res.data.response.token;
          Pace.stop();
          vm.full=true;
        } 
      })
    } 
  }

})();