(function(){
  'use strict';
  
  angular.module("sistemaModule")
  .controller("impuestosDetailController", impuestosDetailController);
  impuestosDetailController.$inject=['$mdDialog', '$scope', 'sisImpuestosService', 'tipos'];

  function impuestosDetailController($mdDialog, $scope, sisImpuestosService, tipos){
    var vm=this;
    vm.listaTipos=tipos;
    vm.one = {};
    vm.error="";
    vm.full=true;

    activate();

    function activate(){
      Pace.restart();
      vm.one=sisImpuestosService.one;
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
      sisImpuestosService.setOne(vm.one)
      .then(function(res){
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