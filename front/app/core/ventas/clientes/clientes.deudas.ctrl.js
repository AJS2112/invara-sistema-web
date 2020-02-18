(function(){
  'use strict';

  angular.module("ventasModule")
  .controller("clientesDeudasController", clientesDeudasController);
  clientesDeudasController.$inject=['$rootScope','$filter', '$state', '$scope', '$mdDialog', 'uiGridConstants', 'vntClientesService', 'vntOperacionesService'];

  function clientesDeudasController($rootScope, $filter, $state, $scope, $mdDialog, uiGridConstants, vntClientesService, vntOperacionesService){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));
    var one=JSON.parse(sessionStorage.getItem("one"));
    var lista=[];
    var _listaInstrumentosPago=[];

    var vm=this;
    vm.filtro="";
    vm.list=[];
    vm.one = {};



    vm.gridOptions = {
        columnDefs: [
          { field: 'fecha', displayName: 'FECHA', cellFilter: 'date:"dd/MM/yyyy"', sort: { direction: uiGridConstants.ASC },width:'20%'  },
          { field: 'tipo_documento_nombre', displayName: 'DOCUMENTO',width:'20%' },
          { field: 'nro_control', displayName: 'Nº CONTROL',width:'20%' },
          { field: 'total_moneda',displayName: 'MONTO', cellFilter: 'currency:""',cellClass: 'cell-align-right',width:'20%' },
          { field: 'deuda_moneda',displayName: 'DEUDA', cellFilter: 'currency:""',cellClass: 'cell-align-right',width:'20%' },
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/ventas/clientes/clientes.deudas.row.tpl.html',
        enableExpandableRowHeader: false,
        expandableRowScope: { 
          abonos: function(){
              var sel=vm.gridApi.selection.getSelectedRows();
              vm.verAbonos(sel[0])
          },
          pagar: function(){
              var sel=vm.gridApi.selection.getSelectedRows();
              vm.pagarDocumento(sel[0])
          } 
        },          

    };

    $scope.$watch('$root.factor', function() {
        calcularMoneda();
    });

    function calcularMoneda(){
      var factor=$rootScope.factor;
      angular.forEach(lista, function(item, index) {
        item.total_moneda=item.total*factor;
        item.abonos_moneda=item.abonos*factor;
        item.deuda_moneda=item.deuda*factor;
      });

      vm.one.total_moneda=vm.one.total*factor;
      vm.one.abonos_moneda=vm.one.abonos*factor;
      vm.one.deuda_moneda=vm.one.deuda*factor;
    }

    activate();

    function activate(){
      Pace.restart();
      vm.one=one;
      console.log(vm.one)
      return getList().then(function(){
          vm.list=lista;
          vm.filtrar();
          Pace.stop();
      })
    }

    function getList (){        
      console.log('mando',vm.one.id)
      return vntClientesService.getDeudas(vm.one.id).then(function(res){

        console.log('res',res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;
          calcularMoneda();
          return lista;
        }
      })
    }

    vm.filtrar = function() {
      vm.gridOptions.data = $filter('multiFiltro')(lista, vm.filtro);
    };

    

    vm.verAbonos=function(documento){
      $mdDialog.show({
        controller: 'clientesAbonosController',
        controllerAs: 'ctrl',
        templateUrl: 'front/app/core/ventas/clientes/clientes.abonos.tpl.html',
        parent: angular.element(document.body),
        locals:{documento:documento},
        clickOutsideToClose:true
      })
      .then(function(){
      });
    }

    vm.pagarDocumento=function(documento){
      console.log('_listaInstrumentosPago',_listaInstrumentosPago)
      var listaPago=[];
      angular.copy(_listaInstrumentosPago,listaPago)
      $mdDialog.show({
        controller: 'cajMovimientosModalController',
        controllerAs: 'ctrl',
        templateUrl: 'front/app/core/caja/movimientos/caj-movimientos.modal.tpl.html',
        parent: angular.element(document.body),
        locals:{
          padre:'abono',
          instrumentosPago: listaPago,
          totalDocumento: documento.deuda
        },
        clickOutsideToClose:true
      })
      .then(function(instrumentosPagoSeleccionados){
        _listaInstrumentosPago=instrumentosPagoSeleccionados;

        angular.forEach(_listaInstrumentosPago, function(item, index) {
          item.id_empresa=logUser.id_empresa;
          item.fecha=new Date();
          item.id_tipo_operacion=documento.id_tipo_operacion;
          item.id_operacion=documento.id;
        });
        console.log('_listaInstrumentosPago',_listaInstrumentosPago)
        confirmarAbono();
      });
      //console.log('pagarDocumento',documento)
    }

    function confirmarAbono(){
      var confirm = $mdDialog.confirm()
            .title('¿Desea registrar el pago?')
            .multiple(true)
            .textContent('Esta acción no se podrá deshacer!.')
            .ariaLabel('Abonar')
            .ok('Si, realizar pago!')
            .cancel('No');

      $mdDialog.show(confirm).then(function() {
        console.log('voy a pagar')
        /*vm.one.id_usuario=logUser.id;
        */
        var one={
          pago:_listaInstrumentosPago,
        }

        vntOperacionesService.setAbono(one).then(function(res){
          console.log('retorna setAbono: ',res)
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            $rootScope.showToast('Pago registrado con exito');
            //$state.go('menu.ventas-operaciones-list'); 
            activate();
          } else if (res.data && res.data.code!==0){
            localStorage.setItem("token",res.data.response.token);
            vm.error=res.data.response.token;
          } 
        })

      }, function() {
        $mdDialog.cancel();
      });
    }

    

  }

})();