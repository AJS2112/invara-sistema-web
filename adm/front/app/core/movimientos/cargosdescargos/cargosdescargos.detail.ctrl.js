(function(){
  'use strict';
  
  angular.module("inventariosModule")
  .controller("cargosdescargosDetailController", cargosdescargosDetailController);
  cargosdescargosDetailController.$inject=['$state', '$scope', '$mdDialog', '$rootScope', '$filter', 'sisListasService', 'invAlmacenesService', 'invProductosService', 'invUnidadesService', 'invMovimientosService', 'invOperacionesService'];

  function cargosdescargosDetailController($state, $scope, $mdDialog, $rootScope, $filter, sisListasService, invAlmacenesService, invProductosService, invUnidadesService, invMovimientosService, invOperacionesService){
    var vm=this;
    vm.one = {};
    vm.full=true;
    vm.error="";
    vm.id_sistema="";

    vm.listaOperaciones=[];
    vm.listaAlmacenes=[];

    vm.listaTipos= [];
    vm.listaCategorias= [];
    vm.listaSistemas= [];
    vm.listaUnidades= [];
    vm.listaImpuestos= [];
    vm.listaExistencia=[];
    
    var listaUnidades=[];
    var listaProductos=[];
    var lista=[];

    var _listaProductos=[];
    var _listaUnidades=[];
    var _listaAlmacenes=[];


    vm.gridDetail = {
        columnDefs: [
          { field: 'producto_codigo', displayName: 'CÓDIGO', maxWidth: 140},
          { field: 'producto_nombre', displayName: 'DESCRIPCION'},
          { field: 'unidad_nombre', displayName: 'UNIDAD', maxWidth: 140},
          { field: 'cantidad', displayName: 'CANTIDAD', maxWidth: 140 },
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
        },
    };

    activate();


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

    function activate(){
      Pace.restart();
      if ($state.params.listaOperaciones){
        vm.listaOperaciones=$state.params.listaOperaciones;
      }

      //PRODUCTOS
      invProductosService.getList().then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaProductos=res.data.response.datos;
        }
      })

      //UNIDADES
      invUnidadesService.getList().then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaUnidades=res.data.response.datos;
        }
      })

      //ALMACENES
      invAlmacenesService.getList().then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          vm.listaAlmacenes=res.data.response.datos;
        }
      })      

      vm.one=invOperacionesService.one;
      vm.one.fecha=new Date(vm.one.fecha);

      //console.log(vm.one)
      return getList().then(function(){
        if (lista){
          vm.gridDetail.data = lista;          
        } else {
          lista=[];
        }

          vm.filtrar();
          Pace.stop();
      })

    }

    function getList (){        
        var obj={
          id_tipo:vm.one.id_tipo,
          id_operacion:vm.one.id_operacion 
        }
        return invMovimientosService.getList(obj).then(function(res){
          console.log('respuesta')
          console.log(res)
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            lista=res.data.response.datos;
            return lista;
          }
        })
    }

    vm.showDate = function() {
      console.log(vm.one.fecha)
    };    


    vm.filtrar = function() {
      if (lista){
        vm.gridDetail.data = $filter('multiFiltro')(lista, vm.filtro);
      }
    };    

    vm.filtrarUnidades = function() {
      var filtro={};
      filtro.id_tipo=vm.id_sistema;
      vm.listaUnidades = $filter('filter')(listaUnidades, filtro, true);

       //vm.listaUnidades = $filter('filter')(listaUnidades, vm.id_sistema);
    }

    vm.guardar = function() {
      vm.full=false;
      Pace.restart();
      invoperacionesService.setOne(vm.one).then(function(res){ 
        var fecha=new Date(res.data);
        console.log(res)
        console.log(fecha)

      })
    } 

    function agregar(obj){
      lista.push(obj);
      vm.gridDetail.data = lista;
    }


    /************************* DIALOGS *******************************/
    /*
    */
    vm.openDialogProductos=function(ev){
        $mdDialog.show({
          controller: 'modalInventarioController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/movimientos/modals/modal.inventario.tpl.html',
          parent: angular.element(document.body),
          locals:{
            listaProductos:_listaProductos,
            listaUnidades:_listaUnidades,
          },
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(producto){
          console.log('asigno')
          agregar(producto);
          $rootScope.showToast('Formula generada con exito');
        });
    }    

  
  }

})();