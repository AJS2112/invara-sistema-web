(function(){
  'use strict';
  
  angular.module("ventasModule")
  .controller("clientesDetailController", clientesDetailController);
  clientesDetailController.$inject=['$mdDialog', '$scope', 'vntClientesService'];

  function clientesDetailController($mdDialog, $scope, vntClientesService){
    var vm=this;
    vm.one = {};
    vm.error="";
    vm.full=true;
  
    activate();

    function activate(){
      Pace.restart();
      vm.one=vntClientesService.one;
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
  }

})();