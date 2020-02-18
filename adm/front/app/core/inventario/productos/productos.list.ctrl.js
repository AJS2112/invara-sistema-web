(function(){
  'use strict';

  angular.module("inventariosModule")
  .controller("productosListController", productosListController);
  productosListController.$inject=['$rootScope', '$scope', '$filter', '$state', '$mdDialog', '$mdMedia', 'uiGridConstants', 'invProductosService', 'invCategoriasService', 'sisListasService', 'sisImpuestosService'];

  function productosListController($rootScope, $scope, $filter, $state, $mdDialog, $mdMedia, uiGridConstants, invProductosService,  invCategoriasService, sisListasService, sisImpuestosService){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));

    var vm=this;
    vm.filtro="";
    vm.loading=false;

    var lista=[];
    var _listaCategorias=[];
    var _listaUnidades=[];
    var _listaImpuestos=[];

    var nuevo={};
    vm.gridOptions = {
        columnDefs: [
          { field: 'categoria_nombre', displayName: 'CATEGORIA',visible: !$mdMedia('xs'), sort: { direction: uiGridConstants.ASC }, maxWidth:160},
          { field: 'nombre', displayName: 'NOMBRE', sort: { direction: uiGridConstants.ASC }, },
          { field: 'unidad_nombre', displayName: 'UNIDAD', visible: !$mdMedia('xs'), maxWidth:80},
          { field: 'precio_moneda', displayName: 'PRECIO' , cellFilter: 'currency:""',cellClass: 'cell-align-right',maxWidth:140,width:'25%' },
          { field: 'existencia', displayName: 'EXISTENCIA', cellFilter: 'currency:""',cellClass: 'cell-align-right',maxWidth:120,width:'25%' },
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/inventario/productos/productos.list.row.tpl.html',
        enableExpandableRowHeader: false,
        expandableRowScope: { 
          editar: function(ev){
              var sel=vm.gridApi.selection.getSelectedRows();
              vm.selOne(sel[0])
          } 
        },          

    };

    $scope.$watch('$root.factor', function() {
        calcularMoneda();
    });

    activate();

    function calcularMoneda(){
      var factor=$rootScope.factor;
      angular.forEach(lista, function(item, index) {
        item.precio_moneda=item.precio*factor;
      });
    }


    function activate(){
      Pace.restart();
      //UNIDADES
      sisListasService.getByCampo('unidades').then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaUnidades=res.data.response.datos;
        }
      })
      //CATEGORIAS
      invCategoriasService.getList(logUser.id_empresa).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaCategorias=res.data.response.datos;
        }
      })
      //IMPUESTOS
      sisImpuestosService.getList("11E7A7016E303D9D9B0700270E383B06").then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaImpuestos=res.data.response.datos;
        }
      })           

      return getList().then(function(){
          vm.filtrar();
          Pace.stop();
      })
    }

    function getList (){
      vm.loading=true;        
      return invProductosService.getList(logUser.id_empresa).then(function(res){
        //console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;
          calcularMoneda();
          vm.loading=false;
          return lista;
        }
      })
    }

    vm.filtrar = function() {
      vm.gridOptions.data = $filter('multiFiltro')(lista, vm.filtro);
    };

    vm.agregar = function(ev){
      return invProductosService.getOne(logUser.id_empresa, 0).then(function(res){
        console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          invProductosService.one={};
          angular.copy(res.data.response.datos,invProductosService.one)
          openDialog(ev);            
        }
      })
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

    vm.actualiza=function(){
      vm.filtrar();
    }

  }

})();