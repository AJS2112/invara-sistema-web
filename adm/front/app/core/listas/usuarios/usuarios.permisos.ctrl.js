(function(){
  'use strict';
  
  angular.module("sistemaModule")
  .controller("usuariosPermisosController",usuariosPermisosController);
  usuariosPermisosController.$inject=['$mdDialog', 'sisUsuariosService', 'sisMenuService', 'CONFIG'];

  function usuariosPermisosController($mdDialog, sisUsuariosService,sisMenuService,CONFIG){

    var vm=this;
    vm.arbol=[];
    vm.error="";
    vm.logUser={};
    vm.one = {};
    vm.secciones=[];
    vm.selected = [];
    activate();

    function activate(){
      Pace.restart();
      vm.logUser=CONFIG.logUser;
      vm.secciones=sisMenuService.secciones;

      getArbol()
      vm.one=sisUsuariosService.one;
      vm.one.oldpass=sisUsuariosService.one.pass;
      
      if (vm.one.permisos){
        vm.selected=JSON.parse(vm.one.permisos);        
      } else {
        vm.selected=[];
      }
      vm.one.permisos=vm.selected;
      Pace.stop();
    }

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

 
    function getArbol (){        
      return sisMenuService.getArbol()
      .then(function(res){
        if (res.data && res.data.code==0){
          vm.arbol=sisMenuService.arbol;
          localStorage.setItem("token",res.data.response.token);
          return sisMenuService.arbol;
        }
      })
    }

    vm.guardar = function() {
      vm.full=false;
      Pace.restart();
      vm.one.permisos=JSON.stringify(vm.selected);
      sisUsuariosService.setOne(vm.one)
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

    vm.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };

    vm.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };



  }

})();

