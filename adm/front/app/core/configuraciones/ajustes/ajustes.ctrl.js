(function(){
  'use strict';

  angular.module("sistemaModule")
  .controller("ajustesController", ajustesController);
  ajustesController.$inject=['$rootScope','$filter', '$state', 'sisEmpresasService', 'sisListasService'];

  function ajustesController($rootScope, $filter, $state, sisEmpresasService, sisListasService){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));

    var vm=this;
    vm.filtro="";
    vm.list=[];
    vm.loading=false;

    vm.listaInstrumentos=[];
    vm.instrumentosSeleccionados = [];

    vm.listaMonedas=[];
    vm.listaMonedasSeleccionadas=[];
    vm.monedasSeleccionadas = [];

    activate();

    function activate(){
      Pace.restart();

      sisListasService.getByCampo('instrumento_pago').then(function(res){
        vm.listaInstrumentos=res.data.response.datos;

        sisListasService.getByCampo('monedas').then(function(res){
          vm.listaMonedas=res.data.response.datos;
        
          sisEmpresasService.getOne(logUser.id_empresa).then(function(res){
            if (res.data && res.data.code==0){
              localStorage.setItem("token",res.data.response.token);
              vm.one=res.data.response.datos;

              //INSTRUMENTOS PAGO
              if (vm.one.instrumentos_pago){
                vm.instrumentosSeleccionados=JSON.parse(vm.one.instrumentos_pago);        
              } else {
                vm.instrumentosSeleccionados=[];
              }
              vm.one.instrumentos_pago=vm.instrumentosSeleccionados;

              //MONEDAS
              if (vm.one.monedas){
                vm.monedasSeleccionadas=JSON.parse(vm.one.monedas);        
              } else {
                vm.monedasSeleccionadas=[];
              }
              vm.one.monedas=vm.monedasSeleccionadas;

              //MODO FISCAL
              vm.one.es_modo_fiscal=!!+vm.one.es_modo_fiscal;


            }
          })

        })

      })





      Pace.stop();
    }


    vm.myFilterBy = function(e) {
      return vm.monedasSeleccionadas.indexOf(e.id) !== -1;
    }

    vm.guardar = function() {
      vm.full=false;
      Pace.restart();
      vm.one.instrumentos_pago=JSON.stringify(vm.instrumentosSeleccionados);
      vm.one.monedas=JSON.stringify(vm.monedasSeleccionadas);
      vm.one.es_modo_fiscal=+vm.one.es_modo_fiscal;
      console.log('monedas: ', vm.one.monedas);
      console.log('toSave',vm.one)
      sisEmpresasService.setOne(vm.one).then(function(res){
        console.log('res',res)
        if (res.data && res.data.code==0){
          $rootScope.showToast('Ajustes guardados con exito');
          $state.go('login');
          localStorage.setItem("token",res.data.response.token);
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