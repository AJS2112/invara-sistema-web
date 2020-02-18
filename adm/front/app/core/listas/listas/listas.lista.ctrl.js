(function(){
  'use strict';

  angular.module("sistemaModule")
  .controller("listasListaController", listasListaController);
  listasListaController.$inject=['$rootScope','$filter', '$state', '$mdDialog', 'uiGridConstants', 'sisListasService', 'CONFIG'];

  function listasListaController($rootScope, $filter, $state, $mdDialog, uiGridConstants, sisListasService, CONFIG){
    var vm=this;
    vm.filtro="";
    vm.list=[];

    var lista=[];
    var listaCampos=[];
    var listaStatus=[];

    var nuevo={};
    vm.gridOptions = {
        columnDefs: [
          { field: 'campo', displayName: 'CAMPO', sort: { direction: uiGridConstants.ASC }, },
          { field: 'padre', displayName: 'PADRE', sort: { direction: uiGridConstants.ASC }, },
          { field: 'nombre', displayName: 'NOMBRE', maxWidth: 200},
        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApi=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.gridApi.expandable.collapseAllRows();
            vm.gridApi.expandable.toggleRowExpansion(rows.entity)
          });        
        },
        expandableRowTemplate: 'front/app/core/listas/listas/listas.lista.row.tpl.html',
        enableExpandableRowHeader: false,
        expandableRowScope: { 
          editar: function(ev){
              var sel=vm.gridApi.selection.getSelectedRows();
              vm.selOne(sel[0])
          } 
        },          

    };

    activate();

    function activate(){
      Pace.restart();
      //CAMPOS
      sisListasService.getCampos().then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          listaCampos=res.data.response.datos;
        }

      /*
          //STATUS
          listasService.getByCampo('status').then(function(res){
            if (res.data && res.data.code==0){
              localStorage.setItem("token",res.data.response.token);
              listaStatus=res.data.response.datos;
            }
          })
      */
      })

      return getList()
      .then(function(){
          vm.list=lista;
          vm.gridOptions.data = vm.list;          
          vm.filtrar();
          Pace.stop();
      })
    }

    function getList (){        
        return sisListasService.getList().then(function(res){
          console.log(res)
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            lista=res.data.response.datos;
            return lista;
          }
        })
    }

    vm.filtrar = function() {
      vm.gridOptions.data = $filter('multiFiltro')(lista, vm.filtro);
    };

    vm.navigateTo=function(item,event){
      vm.activeItem=item;
    }

    vm.agregar = function(ev){
      return sisListasService.getOne(0).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisListasService.one={};
          angular.copy(res.data.response.datos,sisListasService.one)
          openDialog(ev);            
        }
      })
    }

    vm.selOne = function(item,ev){
      return sisListasService.getOne(item.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          sisListasService.one={};
          angular.copy(res.data.response.datos,sisListasService.one)
          openDialog(ev);            
        }
      })
    }

    function openDialog(ev){
        $mdDialog.show({
          controller: 'listasDetailController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/listas/listas/listas.detail.tpl.html',
          locals: {
            campos: listaCampos,
            padres: lista
          },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(){
          $rootScope.showToast('Lista guardada con exito');
          return getList()
          .then(function(){
              vm.list=lista;
              vm.gridOptions.data = vm.list;          
              vm.filtrar();
          })
        });

    }

  }

})();