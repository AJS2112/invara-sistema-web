(function(){
	'use strict';

  	angular.module("sistemaModule")
  	.controller("configController", configController);

    configController.$inject=['$rootScope', '$scope', '$state', '$filter'];

  	function configController($rootScope, $scope, $state, $filter){
      var vm=this;
      vm.empresa=JSON.parse(sessionStorage.getItem("empresa"));
      vm.listaCotizacion=JSON.parse(sessionStorage.getItem("listaCotizacion"));
      var oneCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      

      $rootScope.id_moneda=oneCotizacion.id_moneda;
      $rootScope.factor=oneCotizacion.valor;

      if (vm.empresa.es_modo_fiscal){
        $rootScope.id_moneda="11E93A6F6D57549E838500E04C6F7E24";
        $rootScope.factor=1;
      }

      activate();

      function activate(){
      }

      vm.seleccionaCotizacion=function(){
        var _lista=vm.listaCotizacion;
        var filtro={};
        if (vm.empresa.es_modo_fiscal){
          filtro.id_moneda="11E93A6F6D57549E838500E04C6F7E24";   
        }else{
          filtro.id_moneda=$rootScope.id_moneda;   
        }

        var result = $filter('filter')(_lista, filtro, true);
        if (result.length){
          $rootScope.factor=result[0].valor;
          sessionStorage.setItem("oneCotizacion",JSON.stringify(result[0]));
        }

      }


    	vm.goBack=function(){
        var prevState=sessionStorage.getItem("prevState");
        $state.go(prevState)
    	}

  	}

})();