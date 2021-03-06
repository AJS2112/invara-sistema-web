(function(){
  'use strict';
  
  angular.module("comprasModule")
  .controller("comprasOperacionesDetailController", comprasOperacionesDetailController);
  comprasOperacionesDetailController.$inject=['$rootScope', '$scope', '$mdDialog', '$mdMedia', '$state', '$filter', 'uiGridConstants', 'cmpOperacionesService', 'cmpProveedoresService', 'invMovimientosService', 'invProductosService', 'sisImpuestosService', 'sisListasService', 'sisOperacionesService'];

  function comprasOperacionesDetailController($rootScope, $scope, $mdDialog, $mdMedia, $state, $filter, uiGridConstants, cmpOperacionesService, cmpProveedoresService, invMovimientosService, invProductosService, sisImpuestosService, sisListasService, sisOperacionesService){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));
    var logEmpresa=JSON.parse(sessionStorage.getItem("empresa"));
    var factor=sessionStorage.getItem("valorCotizacion");
    var one=JSON.parse(sessionStorage.getItem("one"));

    var _listaProveedores=[]; 
    var _listaProductos=[];
    var _listaImpuestos=[];
    var _listaTipoDocumentos=[];
    var _listaCompra=[];

    var _productoSeleccionado={};
    
    var vm=this;
    vm.one = {};
    vm.monto_total=0;

    vm.listaTipoDocumentos=[];
    vm.tipoOperacion={};

    vm.loading=false;
    vm.searchText=null;
    vm.selectedProveedor=null;
    
    vm.cntSel=0;

    vm.totales={
      items: 0,
      monto_exento:0,
      base_imponible_tg:0,
      iva_tg:0,
      base_imponible_tr:0,
      iva_tr:0,
      base_imponible_ta:0,
      iva_ta:0,
      total:0,
      total_bs:0,
    };

    
    vm.gridLista = {
        columnDefs: [
        { name: 'producto_codigo',displayName: 'Codigo', maxWidth: 150, visible: !$mdMedia('xs') },
        { name: 'producto_nombre',displayName: 'Nombre', },
        { name: 'producto_unidad',displayName: 'Unidad', maxWidth: 120, visible: !$mdMedia('xs') },
        { name: 'cantidad',displayName: 'Cantidad',cellFilter: 'currency:""',cellClass: 'cell-align-right',maxWidth:'120',width:'25%' },
        { name: 'costo_moneda',displayName: 'Costo', cellFilter: 'currency:""',cellClass: 'cell-align-right',maxWidth:'150',width:'25%' }

        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApiCompras=gridApi;
          gridApi.selection.on.rowSelectionChanged(null, function (rows) {
            vm.cntSel=gridApi.selection.getSelectedCount()
          });        
        },
        showColumnFooter: true,
        enableExpandableRowHeader: false,
        rowHeight: 30,
    };


    $scope.$watch('$root.factor', function() {
        calcularMoneda();
    });

    activate();

    function calcularMoneda(){
      var factor=$rootScope.factor;
      angular.forEach(_listaCompra, function(item, index) {
        item.costo_moneda=item.costo*factor;
      });
      vm.totales.total_moneda=vm.totales.total*factor;
    }

    function activate(){
      vm.one=one;
      vm.one.fecha=new Date(vm.one.fecha);

      sisOperacionesService.getOne(vm.one.id_tipo_operacion).then(function(res){
        vm.tipoOperacion=res.data.response.datos;
        $rootScope.appSeccion= vm.tipoOperacion.nombre + " (" + vm.one.nro_control + ")";
      });

      vm.searchText="";
      vm.gridLista.data = _listaCompra;

      //CARGAR LISTAS
      cmpProveedoresService.getList(logUser.id_empresa).then(function(res){
        _listaProveedores=res.data.response.datos;
        vm.selectedProveedor=selectById(_listaProveedores, vm.one.id_proveedor);
        
        invProductosService.getList(logUser.id_empresa).then(function(res){
            _listaProductos=res.data.response.datos;
        
            sisImpuestosService.getList("11E7A7016E303D9D9B0700270E383B06").then(function(res){
                _listaImpuestos=res.data.response.datos;
        
                sisListasService.getByCampo('tipo_documento').then(function(res){
                    _listaTipoDocumentos=res.data.response.datos;
                    vm.listaTipoDocumentos=_listaTipoDocumentos;
        
                    //CARGAR DETALLE
                    invMovimientosService.getList(vm.one.id).then(function(res){
                      vm.loading=true;
                      if (res.data && res.data.code==0){
                        vm.loading=false;
                        localStorage.setItem("token",res.data.response.token);
                        if (res.data.response.datos){
                          _listaCompra=res.data.response.datos;
                          vm.gridLista.data = _listaCompra;
                          calcularTotales();
                          vm.loading=false;
                        }
                      }
                    })


                })
            })
        })
      })

    }

    
    /* PROVEEDORES ***************************************************************************/
    vm.seleccionarProveedor=function(item){
      if (item){
        vm.one.id_proveedor=item.id;
      }
    }

    vm.querySearch = function( item ) {
      var result= $filter('filter')(_listaProveedores, item);
      return result;
    }

    vm.modalProveedor=function(ev,idProveedor) {
      cmpProveedoresService.getOne(logUser.id_empresa, idProveedor).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          angular.copy(res.data.response.datos,cmpProveedoresService.one)
          if (idProveedor==0)cmpProveedoresService.one.nombre=vm.searchText;
        }
      })

      $mdDialog.show({
        controller: 'proveedoresDetailController',
        controllerAs: 'ctrl',
        templateUrl: 'front/app/core/compras/proveedores/proveedores.detail.tpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(id){
        console.log('regrese de crear proveedor voy a actualizar lista')
          cmpProveedoresService.getList(logUser.id_empresa).then(function(res){
            _listaProveedores=res.data.response.datos;
            console.log('_listaProveedores',_listaProveedores)
            vm.selectedProveedor=selectById(_listaProveedores, id.toUpperCase());
          })
      }, function(){
        //openMe(vm.one)
      });
    }

    /************************ COMPRAS *******************************************/
    vm.addCompra = function(ev){
      _productoSeleccionado={};
      invMovimientosService.one={};
      angular.copy(_productoSeleccionado,invMovimientosService.one)
      openCompra(ev);
    };

    vm.selCompra = function(ev){
      var sel=vm.gridApiCompras.selection.getSelectedRows();
      _productoSeleccionado={};
      invMovimientosService.one={};
      _productoSeleccionado=sel[0];
      angular.copy(sel[0],invMovimientosService.one)
      openCompra(ev);
    };

    vm.delCompra = function(ev){
      var sel=vm.gridApiCompras.selection.getSelectedRows();
      var confirm=$mdDialog.confirm()
        .title('¿Desea eliminar el Producto?')
        .textContent(sel[0].producto_nombre+' '+sel[0].producto_unidad)
        .ariaLabel('Eliminar')
        .targetEvent(ev)
        .ok('Aceptar')
        .cancel('Cancelar');
      $mdDialog.show(confirm).then(function(){
        var indice = _listaCompra.indexOf(sel[0]);
        _listaCompra.splice(indice,1);        
        vm.gridLista.data = _listaCompra;
        vm.cntSel=0;
        calcularTotales();
      });
    };

    /*
    */
    function openCompra(ev){
      $mdDialog.show({
        controller: 'comprasOperacionesSelProdController',
        controllerAs: 'ctrl',
        templateUrl: 'front/app/core/compras/operaciones/compras-operaciones.selprod.tpl.html',
        parent: angular.element(document.body),
        locals:{
            listaProductos:_listaProductos,
          },   
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      }).then(function(res){
        if (!_productoSeleccionado.$$hashKey){
          _listaCompra.push(res)
        } else {
          var indice = _listaCompra.indexOf(_productoSeleccionado);
          _listaCompra[indice] = res;     
        }
        vm.gridLista.data = _listaCompra;
        calcularTotales();
      })
    }
  


    /*GENERALES ***********************************************************************************************************/
    function selectById (lista, id) {
      if (id){
        var filtro={};
        filtro.id=id;   
        var result = $filter('filter')(lista, filtro, true);
        if (result){
          if (result.length){
            return result[0];
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null
      }
    }

    function calcularTotales(){
      

      vm.totales.items=0;
      vm.totales.monto_exento=0;
      vm.totales.base_imponible_tg=0;
      vm.totales.iva_tg=0;
      vm.totales.base_imponible_tr=0;
      vm.totales.iva_tr=0;
      vm.totales.base_imponible_ta=0;
      vm.totales.iva_ta=0;
      vm.totales.total=0;
      vm.totales.total_moneda=0;

      if(_listaCompra.length){
        vm.totales.items=_listaCompra.length;

        for (var i = 0; i < _listaCompra.length; i++) {
          var monto=0;
          var valor_impuesto=0;
          var impuesto=0;
          var total=0;

          impuesto=(Number(_listaCompra[i].valor_impuesto)/100)+1;
          monto=Number(_listaCompra[i].costo)*Number(_listaCompra[i].cantidad);
          var tax=selectById(_listaImpuestos,_listaCompra[i].id_impuesto);
          switch(tax.codigo) {
              case '0001':
                  vm.totales.base_imponible_tg+=monto;
                  vm.totales.iva_tg+=(Number(_listaCompra[i].valor_impuesto)/100)*monto;
                  break;
              case '0002':
                  vm.totales.base_imponible_tr+=monto;
                  vm.totales.iva_tr+=(Number(_listaCompra[i].valor_impuesto)/100)*monto;
                  break;
              case '0003':
                  vm.totales.base_imponible_ta+=monto;
                  vm.totales.iva_ta+=(Number(_listaCompra[i].valor_impuesto)/100)*monto;
                  break;
              default:
                  vm.totales.monto_exento+=monto;
          }

          var total=monto*impuesto;
          vm.totales.total += Number(total);
        }
        calcularMoneda();
      }

    }





    vm.guardar = function() {
      console.log('voy a mandar')
      console.log(vm.one)
      console.log(_listaCompra)

      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      vm.one.id_cotizacion=miCotizacion.id_cotizacion;
      vm.one.monto_exento=vm.totales.monto_exento;
      vm.one.base_imponible_tg=vm.totales.base_imponible_tg;
      //vm.one.iva_tg=vm.totales.iva_tg;
      vm.one.base_imponible_tr=vm.totales.base_imponible_tr;
      //vm.one.iva_tr=vm.totales.iva_tr;
      vm.one.base_imponible_ta=vm.totales.base_imponible_ta;
      //vm.one.iva_ta=vm.totales.iva_ta;      
      vm.one.id_usuario=logUser.id;

      //console.log()
      var one={
        tipo:vm.tipoOperacion,
        head:vm.one,
        detail:_listaCompra
      }

      console.log('envio:', one)
      cmpOperacionesService.setOne(one).then(function(res){
        console.log('retorna: ',res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          vm.one.id=res.data.response.datos;
          $rootScope.showToast('Documento guardado con exito');
          vm.imprimir();
          $state.go('menu.compras-operaciones-list'); 
        } else if (res.data && res.data.code!==0){
          localStorage.setItem("token",res.data.response.token);
          vm.error=res.data.response.token;
        } 
      })
    } 

    vm.anular = function() {
      var confirm = $mdDialog.confirm()
            .title('¿Realmente desea anular el documento?')
            .multiple(true)
            .textContent('Esta acción no se podrá deshacer!.')
            .ariaLabel('Eliminar')
            .ok('Si, deseo anularlo!')
            .cancel('No');

      $mdDialog.show(confirm).then(function() {
        console.log('voy a anular')
        vm.one.id_usuario=logUser.id;

        var one={
          tipo:vm.tipoOperacion,
          head:vm.one,
        }

        console.log('envio:', one)
        cmpOperacionesService.nullOne(one).then(function(res){
          console.log('retorna: ',res)
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            vm.one.id=res.data.response.datos;
            $rootScope.showToast('Documento anulado con exito');
            $state.go('menu.compras-operaciones-list'); 
          } else if (res.data && res.data.code!==0){
            localStorage.setItem("token",res.data.response.token);
            vm.error=res.data.response.token;
          } 
        })

      }, function() {
        $mdDialog.cancel();
      });

    } 


    vm.imprimir=function(ev){
        vm.full=false;
        var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
        //INICIALIZADORES
        var _factor=$rootScope.factor;;

        if (vm.one.id_tipo_operacion!='11E8F22378C9E7EB8FF600270E383B06'){
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "CODIGO", dataKey: "producto_codigo"},
              {title: "DESCRIPCION", dataKey: "producto_nombre"}, 
              {title: "UND", dataKey: "producto_unidad"},
              {title: "CANT", dataKey: "cantidad"},
              {title: "PRECIO", dataKey: "valor"},
              {title: "MONTO", dataKey: "monto"},            
          ];
        } else {
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "CODIGO", dataKey: "producto_codigo"},
              {title: "DESCRIPCION", dataKey: "producto_nombre"}, 
              {title: "UND", dataKey: "producto_unidad"},
              {title: "CANT", dataKey: "cantidad"},
          ];
        }

        var rows=[];
        var totales={};

        //FUNCIONES
        function alinearDerecha(texto){
          var margen=doc.internal.pageSize.width-20;
          return margen - (doc.getStringUnitWidth(texto) * doc.internal.getFontSize());
        }

        var centerText = function(texto, alto){
          var xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(texto) * doc.internal.getFontSize() / 2); 
          doc.text(texto, xOffset, alto);        
        }

        var doRows = function(data){
          var numero=0;
          var _datos=[];

          for (var i = 0; i < data.length; i++) {
            var _fila={};

            numero+=1;
            var _valor=data[i].costo*_factor;
            var _monto=(data[i].cantidad*_valor)

            _fila.numero=numero;
            _fila.producto_codigo=data[i].producto_codigo;
            _fila.producto_nombre=data[i].producto_nombre;
            _fila.producto_unidad=data[i].producto_unidad;
            _fila.cantidad=$filter('currency')(Number(data[i].cantidad),'');
            _fila.valor=$filter('currency')(Number(_valor),'');
            _fila.monto=$filter('currency')(Number(_monto),'');

            _datos.push(_fila);
          }

          return _datos;
        }

        var doTotals = function(){
          var _totales={};
          var _monto_exento= vm.totales.monto_exento*_factor;
          var _base_imponible= (vm.totales.base_imponible_tg + vm.totales.base_imponible_tr + vm.totales.base_imponible_ta)*_factor;
          var _monto_impuesto= (vm.totales.iva_tg + vm.totales.iva_tr + vm.totales.iva_ta)*_factor;
          var _total = _monto_exento + _base_imponible + _monto_impuesto;

          _totales.monto_exento=$filter('currency')(Number(_monto_exento), '');
          _totales.base_imponible=$filter('currency')(Number(_base_imponible), '');
          _totales.monto_impuesto=$filter('currency')(Number(_monto_impuesto), '');
          _totales.total=$filter('currency')(Number(_total), '');

          return _totales;
        };

        var pageContent = function () {
            // HEADER ***************************************************************************************************
            var topH=80;

            doc.setFontStyle('normal');
            /*EMPRESA*/
            doc.setFontSize(12);
            doc.text(logEmpresa.nombre,32,75);
            doc.setFontSize(10);
            doc.text(logEmpresa.rif,32,88);

            var miFecha=$filter('date')(vm.one.fecha, 'dd/MM/yyyy');
            doc.text("FECHA: "+ miFecha,440,topH+10);
            doc.text("Nº: "+ vm.one.nro_control,440,topH+25);

            doc.setFontSize(14);
            centerText(vm.tipoOperacion.nombre,topH+50);                                                

            doc.setFontSize(10);
            doc.text("NOMBRE: "+ vm.selectedProveedor.nombre.substr(0, 60),30,topH+80);
            doc.text("RIF: "+ vm.selectedProveedor.rif,460,topH+80);
            doc.text("DIRECCIÓN: "+ vm.selectedProveedor.direccion.substr(0, 60),30,topH+95);
            doc.text("TELÉFONO: "+ vm.selectedProveedor.telefono,460,topH+95);

            // FOOTER ***************************************************************************************************
            var topF=doc.internal.pageSize.height - 100;
            var left=doc.internal.pageSize.width -260;
            
            if (vm.one.id_tipo_operacion!='11E8F22378C9E7EB8FF600270E383B06'){
              //ETIQUETAS
              doc.text("BASE IMPONIBLE: ",left,topF);
              doc.text("IVA: ",left,topF+20);
              doc.text("TOTAL ("+miCotizacion.moneda_descrip+"): ",left,topF+40);                

              //TOTALES
              var x1= 0;
              doc.text(totales.base_imponible,alinearDerecha(totales.base_imponible) ,topF);
              doc.text(totales.monto_impuesto,alinearDerecha(totales.monto_impuesto) ,topF+20);
              doc.text(totales.total,alinearDerecha(totales.total) ,topF+40);   
            }                             
        };

        //INICIALIZAR PDF
        var doc = new jsPDF('p', 'pt', 'letter');
        var totalPagesExp = "{total_pages_count_string}";
        var topT=200;
        doc.setFontSize(10);

        rows = doRows(_listaCompra);
        totales=doTotals();

        doc.autoTable(columns, rows, {
            addPageContent: pageContent,
            margin: {top: topT, bottom: 40, left:20, right:30}, 
            theme: 'grid',
            headerStyles: {
              fillColor: 255,
              textColor: 0,
              lineWidth: 1,
              fontSize: 8,
            },
            bodyStyles: {fontSize: 8},
            columnStyles: {
                numero: {columnWidth: 25, halign: 'right'},
                producto_codigo: {columnWidth: 50, halign: 'left'},
                producto_unidad: {columnWidth: 40, halign: 'left'},
                cantidad: {columnWidth: 40, halign: 'right'},
                valor: {columnWidth: 75, halign: 'right'},
                monto: {columnWidth: 90, halign: 'right'},
            },
        });

        var blob= doc.output("blob");
        window.open(URL.createObjectURL(blob));
        vm.full=true;
    }


  }

})();