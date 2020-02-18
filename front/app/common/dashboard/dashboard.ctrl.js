(function(){
	'use strict';

  	angular.module("sistemaModule")
  	.controller("dashboardController", dashboardController);

  	dashboardController.$inject=['$rootScope', '$scope','sisDashboardService', 'lstCotizacionesService', 'jwtHelper','CONFIG'];

  	function dashboardController($rootScope, $scope, sisDashboardService,lstCotizacionesService,jwtHelper,CONFIG){
      var logUser=JSON.parse(sessionStorage.getItem("logUser"));

      var lista=[];
      var _lista_resumen=[];
      var _lista_caja=[];

      var vm=this;
      vm.lista_resumen=[];
      vm.lista_caja=[];
      vm.totales_caja={};

      var d = new Date();
      var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
      vm.desde= firstDay;
      vm.hasta= new Date();
      vm.fechaStr="";

      lstCotizacionesService.getLast(logUser.id_empresa).then(function(res){
        if (res.data && res.data.code==0){
          vm.listaCotizacion=res.data.response.datos;
        }
      })

      $scope.$watch('$root.factor', function() {
        fillList();
      });

      function calcularMoneda(){
        var factor=$rootScope.factor;
        angular.forEach(lista, function(item, index) {
          item.precio_moneda=item.precio*factor;
        });
      }

      activate();

      function activate(){
        $rootScope.appSeccion=logUser.empresa_nombre;

        selMes();

        lstCotizacionesService.getLast(logUser.id_empresa).then(function(res){
          if (res.data && res.data.code==0){
            vm.factor=res.data.response.datos[0].valor;
            sessionStorage.setItem("valorCotizacion",res.data.response.datos[0].valor);
          }
        })

        var obj={
          idEmpresa:logUser.id_empresa,
          desde:vm.desde,
          hasta:vm.hasta
        }


        sisDashboardService.getList(obj).then(function(res){
          //console.log(res)
          if (res.data && res.data.code==0){
            _lista_resumen=res.data.response.datos;

            obj.desde=obj.hasta;
            sisDashboardService.getCaja(obj).then(function(res){
              //console.log(res)
              if (res.data && res.data.code==0){
                _lista_caja=res.data.response.datos;
                fillList();
              }
            })
          }
        })

      }

      function selMes(){
        var f= new Date();
        var mes=f.getMonth()+1;
        switch ( mes.toString() ){
          case "1":
            mes="ENERO";
            break;
          case "2":
            mes="FEBRERO";
            break;            
          case "3":
            mes="MARZO";
            break;
          case "4":
            mes="ABRIL";
            break;
          case "5":
            mes="MAYO";
            break;
          case "6":
            mes="JUNIO";
            break;
          case "7":
            mes="JULIO";
            break;
          case "8":
            mes="AGOSTO";
            break;
          case "9":
            mes="SEPTIEMBRE";
            break;
          case "10":
            mes="OCTUBRE";
            break;
          case "11":
            mes="NOVIEMBRE";
            break;
          case "12":
            mes="DICIEMBRE";
            break;                                                                                                                        

        }
        vm.fechaStr=mes +" " + d.getFullYear().toString();
      }

      function fillList(){
        vm.lista_resumen=[];
        vm.lista_caja=[];
        var _factor=$rootScope.factor;
        var total={
          cuenta:0,
          instrumento:"Total",
          ent:0,
          sal:0,
          total:0
        };
        
        //RESUMEN
        if(_lista_resumen){
          for (var i = 0; i < _lista_resumen.length; i++) {
            var item={};
            item.item=_lista_resumen[i].item;
            item.cantidad=_lista_resumen[i].cantidad;
            item.total=_lista_resumen[i].total*_factor;

            vm.lista_resumen.push(item);
          }
        }

        //CAJA
        if(_lista_caja){

          for (var i = 0; i < _lista_caja.length; i++) {
            var item={};
            item.instrumento=_lista_caja[i].instrumento;
            item.cuenta=_lista_caja[i].cuenta;
            item.ent=_lista_caja[i].ent*_factor;
            item.sal=_lista_caja[i].sal*_factor;
            item.total=_lista_caja[i].total*_factor;

            total.cuenta+=Number(item.cuenta);
            total.ent+=item.ent;
            total.sal+=item.sal;
            total.total+=item.total;

            vm.lista_caja.push(item);
          }

        }
        vm.totales_caja=total;
      }
     

    }

})();