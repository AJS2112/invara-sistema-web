(function(){
  'use strict';
  
  angular.module("sistemaModule")
  .controller("cotizacionesDetailController", cotizacionesDetailController);
  cotizacionesDetailController.$inject=['$mdDialog', '$scope', '$mdMedia', 'lstCotizacionesService', 'sisListasService'];

  function cotizacionesDetailController($mdDialog, $scope, $mdMedia, lstCotizacionesService, sisListasService){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));
    var myEmpresa=JSON.parse(sessionStorage.getItem("empresa"));

    var vm=this;
    vm.one = {};
    vm.error="";
    vm.full=true;
    vm.id_moneda="";
    vm.valor=1;

    vm.lista=[];
    vm.listaMonedas=[];    

    var _listaMonedas=[];
    var _moneda={};

    vm.selMoneda=function(){
      for (var i = 0; i < _listaMonedas.length; i++) {
        if (_listaMonedas[i].id==vm.id_moneda){
          _moneda=_listaMonedas[i];
        }
      }
    }

    activate();

    function activate(){
      Pace.restart();
      vm.one=lstCotizacionesService.one;

      var monedas={monedas:myEmpresa.monedas};
      sisListasService.getList(monedas).then(function(res){
          _listaMonedas=res.data.response.datos;
          for (var i = 0; i < _listaMonedas.length; i++) {
            if (_listaMonedas[i].id=='11E8F819279E29CC9E9100270E383B06'){
              _listaMonedas.splice(i,1);
            }
          }
          vm.id_moneda=_listaMonedas[0].id;
          _moneda=_listaMonedas[0];
          vm.listaMonedas=_listaMonedas;
      })    

      /*
      sisListasService.getList(logUser.id_empresa).then(function(res){
        _listaMonedas=res.data.response.datos;
        for (var i = 0; i < _listaMonedas.length; i++) {
          if (_listaMonedas[i].id=='11E8F819279E29CC9E9100270E383B06'){
            _listaMonedas.splice(i,1);
          }
        }
        vm.id_moneda=_listaMonedas[0].id;
        _moneda=_listaMonedas[0];
        vm.listaMonedas=_listaMonedas;
      })
      */
      lstCotizacionesService.getListDetail(vm.one.id).then(function(res){
        vm.lista=res.data.response.datos;
      })


      Pace.stop();
    }

    vm.addMoneda = function(){
      var esta=false;
      var objMoneda={
        id:"0",
        order_id:0,
        last_update:0,
        id_cotizacion:vm.one,
        id_moneda:"",
        moneda_nombre:"",
        moneda_descrip:"",
        valor_anterior:0,
        valor:0
      };

      objMoneda.id_moneda=vm.id_moneda;
      objMoneda.moneda_nombre=_moneda.nombre;
      objMoneda.moneda_descrip=_moneda.descrip;
      objMoneda.valor=vm.valor;

      for (var i = 0; i < vm.lista.length; i++) {
        if (vm.lista[i].id_moneda==vm.id_moneda){
          esta=true;
        }
      }
      if (!esta)vm.lista.push(objMoneda);
      
      console.log(vm.lista)
    }

    vm.delMoneda = function(id){
      var indice = vm.lista.indexOf(id);
      vm.lista.splice(indice,1);   
    }

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.miFecha = function() {
      console.log(vm.one.fecha)
    };

    vm.guardar = function() {
      vm.full=false;
      Pace.restart();

      var objMoneda={
        id:"0",
        order_id:0,
        last_update:0,
        id_cotizacion:vm.one,
        id_moneda:"11E8F819279E29CC9E9100270E383B06",
        moneda_nombre:"",
        moneda_descrip:"",
        valor_anterior:0,
        valor:1
      };
      vm.lista.push(objMoneda);

      var one={
        head:vm.one,
        detail:vm.lista,
      }
      console.log('envio:', one)

      lstCotizacionesService.setOne(one).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          $mdDialog.hide();
          Pace.stop();
        } else if (res.data && res.data.code!==0){
          localStorage.setItem("token",res.data.response.token);
          vm.error=res.data.response.token;
          Pace.stop();
          vm.full=false;
        } 
      })
    } 
  }

})();