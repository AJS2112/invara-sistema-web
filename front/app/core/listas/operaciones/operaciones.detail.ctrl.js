(function(){
  'use strict';
  
  angular.module("sistemaModule")
  .controller("operacionesDetailController", operacionesDetailController);
  operacionesDetailController.$inject=['$mdDialog', '$scope', 'sisOperacionesService', 'tipos'];

  function operacionesDetailController($mdDialog, $scope, sisOperacionesService, tipos){
    var vm=this;
    vm.listaTipos=tipos;
    vm.one = {};
    vm.error="";

    activate();

    function activate(){
      vm.one=sisOperacionesService.one;
      vm.one.es_fiscal=!!+vm.one.es_fiscal;
      vm.one.es_autorizado=!!+vm.one.es_autorizado;
      vm.one.es_visible=!!+vm.one.es_visible;
      vm.full=true;
    }

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.guardar = function() {
      vm.one.es_fiscal=+vm.one.es_fiscal;
      vm.one.es_autorizado=+vm.one.es_autorizado;
      vm.one.es_visible=+vm.one.es_visible;

      sisOperacionesService.setOne(vm.one).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          $mdDialog.hide();
        } else if (res.data && res.data.code!==0){
          localStorage.setItem("token",res.data.response.token);
          vm.error=res.data.response.token;
        } 
      })
    } 
  }

})();