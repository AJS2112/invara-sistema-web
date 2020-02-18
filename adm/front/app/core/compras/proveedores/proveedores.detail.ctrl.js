(function(){
  'use strict';
  
  angular.module("comprasModule")
  .controller("proveedoresDetailController", proveedoresDetailController);
  proveedoresDetailController.$inject=['$mdDialog', '$scope', 'cmpProveedoresService'];

  function proveedoresDetailController($mdDialog, $scope, cmpProveedoresService){
    var vm=this;
    vm.one = {};
    vm.error="";
    vm.full=true;

    activate();

    function activate(){
      Pace.restart();
      vm.one=cmpProveedoresService.one;
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
      vm.one.es_default=+vm.one.es_default;
      cmpProveedoresService.setOne(vm.one).then(function(res){
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