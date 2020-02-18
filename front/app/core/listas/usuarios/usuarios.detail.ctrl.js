(function(){
  'use strict';
  
  angular.module("sistemaModule")
  .controller("usuariosDetailController", usuariosDetailController);
  usuariosDetailController.$inject=['$rootScope', '$mdDialog', 'sisUsuariosService', 'sisEmpresasService'];

  function usuariosDetailController($rootScope, $mdDialog, sisUsuariosService, sisEmpresasService){
  	var vm=this;
    vm.one = {};
    vm.passChecked=true;
    vm.error="";
    vm.full=true;
    vm.listaEmpresas=[];

    activate();

    function activate(){
      Pace.restart();
      sisEmpresasService.getList().then(function(res){
        if (res.data && res.data.code==0){
          vm.listaEmpresas=res.data.response.datos;
        }
      })


      sisUsuariosService.getOne(sisUsuariosService.one.id).then(function(res){
        if (res.data && res.data.code==0){
          vm.one=res.data.response.datos;
          vm.one.passcheck=vm.one.pass;
          vm.one.oldpass=vm.one.pass;
          localStorage.setItem("token",res.data.response.token);
          Pace.stop();
        }
      })

    }

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.checkPass=function(){
      if (vm.one.pass===vm.one.passcheck){
        vm.passChecked=true;
      } else {
        vm.passChecked=false;
      }
    }

  	vm.guardar = function() {
      vm.full=false;
      Pace.restart();
      sisUsuariosService.setOne(vm.one).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          $rootScope.showToast('Datos guardados con exito');
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

