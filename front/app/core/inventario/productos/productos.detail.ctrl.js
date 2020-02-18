(function(){
  'use strict';
  
  angular.module("inventariosModule")
  .controller("productosDetailController", productosDetailController);
  productosDetailController.$inject=['$rootScope', '$filter', '$mdDialog', '$scope', '$http', 'invProductosService', 'listaCategorias', 'listaUnidades', 'listaImpuestos', 'CONFIG'];

  function productosDetailController($rootScope, $filter, $mdDialog, $scope, $http, invProductosService, listaCategorias, listaUnidades, listaImpuestos, CONFIG){
    var factor=Number($rootScope.factor);
    var _listaCotizacion=JSON.parse(sessionStorage.getItem("listaCotizacion"));

    var vm=this;
    vm.one = {};
    vm.error="";
    vm.full=true;

    vm.swBs=false;
    vm.valIva=0;

    vm.listaCategorias=listaCategorias;
    vm.listaUnidades= listaUnidades;
    vm.listaImpuestos=listaImpuestos;
    vm.listaCotizacion=JSON.parse(sessionStorage.getItem("listaCotizacion"));
    //console.log('vm.listaCotizacion',vm.listaCotizacion)
    activate();

    function activate(){
      vm.one=invProductosService.one;

      if (!vm.one.imagen){
        vm.one.imagen= "imagen_no_disponible.gif";
      }

      $scope.image1={
        compressed:{
          dataURL:"http://localhost/gids-pyme/uploads/"+vm.one.imagen
        },
        file:{
          name: vm.one.imagen
        }
      };


      //$scope.image1.file.name
      console.log('$scope.image1',$scope.image1)
      console.log(vm.one)

      console.log('________________')
      console.log('activate')

      vm.one.costo_moneda=Number(vm.one.costo*factor);
      vm.one.precio_moneda=Number(vm.one.precio * factor);
      
      console.log(vm.one.costo_moneda)
      console.log(vm.one.precio_moneda)
      if(vm.one.precio) calcularPctUtil();
      
      
    }

    vm.seleccionaCotizacion=function(){
      var _lista=vm.listaCotizacion;
      var filtro={};
      filtro.id_moneda=$rootScope.id_moneda;   

      var result = $filter('filter')(_lista, filtro, true);
      if (result.length){
        $rootScope.factor=result[0].valor;
        factor=$rootScope.factor;
        vm.one.costo_moneda=vm.one.costo*factor;
        vm.one.precio_moneda=vm.one.precio * factor;
        sessionStorage.setItem("oneCotizacion",JSON.stringify(result[0]));
      }
    }

    function calcularPctUtil(){
      console.log('________________')
      console.log('calcularPctUtil')

      vm.one.costo=vm.one.costo_moneda/factor;
      vm.one.precio=vm.one.precio_moneda/factor;
      var pctUtil= ((vm.one.precio*100)/vm.one.costo)-100;
      vm.one.pct_util=pctUtil;
    }

    function calcularPrecio(){
      console.log('________________')
      console.log('calcularPrecio')
      vm.one.costo=vm.one.costo_moneda/factor;
      vm.one.precio=vm.one.precio_moneda/factor;
      var precio= vm.one.costo * ((vm.one.pct_util/100)+1);
      vm.one.precio=precio;
      vm.one.precio_moneda=precio * factor;
    }    
    
    function selectById (lista, id) {
      if (id){
        var filtro={};
        filtro.id=id;   
        var result = $filter('filter')(lista, filtro, true);
        if (result.length){
          return result[0];
        } else {
          return null;
        }
      } else {
        return null
      }
    }

    vm.calcularPrecio=function(){
      calcularPrecio();
    }

    vm.calcularPctUtil=function(){
      calcularPctUtil();
    }

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.getSelectedIVA=function(){
      calcularPrecio();
    };

    vm.guardar = function() {
      Pace.restart();
      vm.full=false;
      /*
      invProductosService.setOne(vm.one).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          $mdDialog.hide(res.data.response.datos);
          Pace.stop();
        } else if (res.data && res.data.code!==0){
          localStorage.setItem("token",res.data.response.token);
          vm.error=res.data.response.token;
          Pace.stop();
          vm.full=true;
        } 
      })
      */
      console.log('$scope',$scope.image1)
      if ($scope.image1){
        
        $http.get($scope.image1.compressed.dataURL,{responseType: "blob"}).success((data) => {
          var file = new File([data], $scope.image1.file.name);

          if (file){
            vm.one.image=file;
            //console.log('toSave',vm.one)
      
            Pace.restart();
            //vm.full=false;
                        
            invProductosService.setOne(vm.one).then(function(res){
              //console.log('res',res)
              localStorage.setItem("token",res.data.response.token);
              $mdDialog.hide(res.data.response.datos);
              Pace.stop();
              vm.full=true;
            },function(error){
              vm.error=error.data.error;
            });
            
          }else{
            vm.error="Archivo invalido";       
          }
        });

      }else{
        vm.error="Debe seleccionar un archivo";       
      }
      
      console.log('tiene error',vm.error)
      



    } 
  }

})();