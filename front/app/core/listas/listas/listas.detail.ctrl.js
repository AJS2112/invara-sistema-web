(function(){
  'use strict';
  
  angular.module("sistemaModule")
  .controller("listasDetailController", listasDetailController);
  listasDetailController.$inject=['$mdDialog', '$scope', 'sisListasService', 'campos', 'padres'];

  function listasDetailController($mdDialog, $scope, sisListasService, campos, padres){
    var vm=this;
    vm.categorias=[];
    vm.listaCampos=campos;
    vm.listaPadres=padres;
    vm.one = {};
    vm.error="";
    vm.full=true;

    activate();

    function activate(){
      Pace.restart();
      vm.one=sisListasService.one;
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
      sisListasService.setOne(vm.one)
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

