(function(){
  'use strict';
  
  angular.module("inventariosModule")
  .controller("categoriasDetailController", categoriasDetailController);
  categoriasDetailController.$inject=['$mdDialog', '$scope', 'invCategoriasService', 'grupos'];

  function categoriasDetailController($mdDialog, $scope, invCategoriasService, grupos){
    var vm=this;
    vm.listaGrupos=grupos;
    vm.one = {};
    vm.error="";
    vm.full=true;

    activate();

    function activate(){
      vm.one=invCategoriasService.one;
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
      invCategoriasService.setOne(vm.one)
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