(function(){
  'use strict';

  angular.module("myApp")
  .controller("catalogoController", catalogoController);
  catalogoController.$inject=['$rootScope', '$scope', '$filter', '$state', '$mdDialog', '$mdMedia', 'invProductosService','lstCotizacionesService'];

  function catalogoController($rootScope, $scope, $filter, $state, $mdDialog, $mdMedia,  invProductosService, lstCotizacionesService){
    var vm=this;
    vm.filtro="";
    vm.loading=false;
    vm.productos=[];

    vm.id_moneda="11E8F819279E29CC9E9100270E383B06";
    vm.cotizacion={};
    vm.listaCotizacion=[];

    var lista=[];
    var factor=1;

    vm.myUrl="http://localhost/triven/uploads/";

    activate();

    function calcularMoneda(){
      angular.forEach(lista, function(item, index) {
        item.precio_moneda=item.precio*factor;
      });
    }

    function activate(){
      Pace.restart();

      return getList().then(function(){
        lstCotizacionesService.getLastWeb("11E8F19B472752B18FF600270E383B06").then(function(res){
          vm.listaCotizacion=res.data;
          console.log('vm.listaCotizacion',vm.listaCotizacion)
          vm.seleccionaCotizacion();
        })
        Pace.stop();
      })

    }

    function getList (){
      vm.loading=true;        
      return invProductosService.getListWeb("11E8F19B472752B18FF600270E383B06").then(function(res){
        console.log(res)
          lista=res.data;
          vm.loading=false;
          return lista;
      })
    }

    vm.filtrar = function() {
      vm.productos = $filter('multiFiltro')(lista, vm.filtro);
    };

    vm.seleccionaCotizacion=function(){
      var _lista=vm.listaCotizacion;
      var filtro={};
      filtro.id_moneda=vm.id_moneda;
      var result = $filter('filter')(_lista, filtro, true);

      if (result.length){
        vm.cotizacion=result[0];
        factor=result[0].valor;
        calcularMoneda();
        vm.filtrar();
      }
    }

    vm.selOne = function(item,ev){
      return invProductosService.getOne(logUser.id_empresa, item.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          invProductosService.one={};
          angular.copy(res.data.response.datos,invProductosService.one)
          openDialog(ev);            
        }
      })
    }

    function openDialog(ev){
        $mdDialog.show({
          controller: 'productosDetailController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/inventario/productos/productos.detail.tpl.html',
          locals: {
            listaCategorias: _listaCategorias,
            listaUnidades: _listaUnidades,
            listaImpuestos: _listaImpuestos,
          },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(){
          $rootScope.showToast('Producto guardado con exito');
          return getList().then(function(){
              //vm.gridOptions.data = lista;          
              vm.filtrar();
          })
        });


    }

    
  }

})();