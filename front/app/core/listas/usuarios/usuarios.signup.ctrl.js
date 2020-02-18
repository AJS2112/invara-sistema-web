(function(){
  'use strict';
  
  angular.module("sistemaModule")
  .controller("usuariosSignupController", usuariosSignupController);
  usuariosSignupController.$inject=['$rootScope', '$mdDialog', 'sisUsuariosService', 'sisEmpresasService'];

  function usuariosSignupController($rootScope, $mdDialog, sisUsuariosService, sisEmpresasService){
  	var vm=this;
    vm.isNew=false;
    vm.listaEmpresas=[];
    vm.one = {};
    vm.passChecked=true;
    vm.userExist=false;    
    vm.error="";

    activate();

    function activate(){
      Pace.restart();
      sisEmpresasService.getList().then(function(res){
        if (res.data && res.data.code==0){
          vm.listaEmpresas=res.data.response.datos;
        }
      })

      vm.one=sisUsuariosService.one;
      vm.one.passcheck=vm.one.pass;
      vm.one.oldpass=vm.one.pass;      
      Pace.stop();
    }

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      sisUsuariosService.one={};
      $mdDialog.cancel();
    };

    vm.checkUserName=function(){
      sisUsuariosService.checkName(vm.one)
      .then(function(res){
        if (res.data!=0){
          vm.userExist=true;
        } else {
          vm.userExist=false;
        }
      });
    }

    vm.cleanValidation=function(){
      vm.userExist=false;
    }    

    vm.checkPass=function(){
      if (vm.one.pass===vm.one.passcheck){
        vm.passChecked=true;
      } else {
        vm.passChecked=false;
      }
    }

  	vm.guardar = function() {
      Pace.restart();
      sisUsuariosService.setOne(vm.one).then(function(res){
        if (res.data){
          $rootScope.showToast('Usuario registrado con exito');
          $mdDialog.hide();
          Pace.stop();
        } else {
          vm.error="Existió un problema registrando al usuario, por favor intente nuevamente.";
          Pace.stop();
          vm.full=true;
        } 
      })
    }	


  }

})();

