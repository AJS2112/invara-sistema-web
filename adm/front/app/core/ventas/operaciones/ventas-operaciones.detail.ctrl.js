(function(){
  'use strict';
  
  angular.module("ventasModule")
  .controller("ventasOperacionesDetailController", ventasOperacionesDetailController);
  ventasOperacionesDetailController.$inject=['$rootScope', '$scope', '$mdDialog', '$state', '$filter', '$mdMedia', 'uiGridConstants', 'vntOperacionesService', 'vntClientesService', 'invMovimientosService', 'invProductosService', 'sisImpuestosService', 'sisListasService', 'sisOperacionesService', 'cajMovimientosService'];

  function ventasOperacionesDetailController($rootScope, $scope, $mdDialog, $state, $filter, $mdMedia, uiGridConstants, vntOperacionesService, vntClientesService, invMovimientosService, invProductosService, sisImpuestosService, sisListasService, sisOperacionesService, cajMovimientosService){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));
    var logEmpresa=JSON.parse(sessionStorage.getItem("empresa"));
    var factor=sessionStorage.getItem("valorCotizacion");
    var one=JSON.parse(sessionStorage.getItem("one"));

    var _listaClientes=[]; 
    var _listaProductos=[];
    var _listaImpuestos=[];
    var _listaTipoDocumentos=[];
    var _listaVenta=[];
    var _listaInstrumentosPago=[];

    var _productoSeleccionado={};



    var vm=this;
    vm.one = {};
    vm.monto_total=0;

    vm.listaTipoDocumentos=[];
    vm.tipoOperacion={};

    vm.loading=false;
    vm.full=true;
    vm.searchText=null;
    vm.selectedCliente=null;

    vm.guardarPresionado=false;    
    
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
      total_moneda:0,
    };

    /*
    */
    
    vm.gridLista = {
        columnDefs: [
        { name: 'producto_codigo',displayName: 'Codigo', maxWidth: 150, visible: !$mdMedia('xs') },
        { name: 'producto_nombre',displayName: 'Nombre', },
        { name: 'producto_unidad',displayName: 'Unidad', maxWidth: 120, visible: !$mdMedia('xs') },
        { name: 'cantidad',displayName: 'Cantidad',cellFilter: 'currency:""',cellClass: 'cell-align-right',maxWidth:'120',width:'25%' },
        { name: 'precio_moneda',displayName: 'Precio', cellFilter: 'currency:""',cellClass: 'cell-align-right',maxWidth:'150',width:'25%' }

        ],
        onRegisterApi: function( gridApi ) {
          vm.gridApiVentas=gridApi;
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
      angular.forEach(_listaVenta, function(item, index) {
        item.precio_moneda=item.precio*factor;
      });
      vm.totales.total_moneda=vm.totales.total*factor;
    }

    function activate(){
      //console.log(vm.gridLista)
      vm.one=one;
      //console.log(vm.one)
      vm.one.fecha=new Date(vm.one.fecha);

      sisOperacionesService.getOne(vm.one.id_tipo_operacion).then(function(res){
        vm.tipoOperacion=res.data.response.datos;
        $rootScope.appSeccion= vm.tipoOperacion.nombre + " (" + vm.one.nro_control + ")";
      });

      vm.searchText="";
      vm.gridLista.data = _listaVenta;


      //CARGAR LISTAS
      vm.loading=true;
      vntClientesService.getList(logUser.id_empresa).then(function(res){
        _listaClientes=res.data.response.datos;
        vm.selectedCliente=selectById(_listaClientes, vm.one.id_cliente);
        
        invProductosService.getList(logUser.id_empresa).then(function(res){
            _listaProductos=res.data.response.datos;
        
            sisImpuestosService.getList("11E7A7016E303D9D9B0700270E383B06").then(function(res){
                _listaImpuestos=res.data.response.datos;
        
                sisListasService.getByCampo('tipo_documento').then(function(res){
                    _listaTipoDocumentos=res.data.response.datos;
                    vm.listaTipoDocumentos=_listaTipoDocumentos;
        
                    //CARGAR DETALLE
                    invMovimientosService.getList(vm.one.id).then(function(res){
                      vm.loading=false;
                      if (res.data && res.data.code==0){
                        localStorage.setItem("token",res.data.response.token);
                        if (res.data.response.datos){
                          _listaVenta=res.data.response.datos;
                          vm.gridLista.data = _listaVenta;
                          calcularTotales();
                        }
                      }
                    })

                    //PAGO
                    cajMovimientosService.getOne(vm.one.id).then(function(res){
                      //console.log(res)
                      if (res.data && res.data.code==0){
                        localStorage.setItem("token",res.data.response.token);
                        _listaInstrumentosPago=res.data.response.datos;
                      }
                    })


                })
            })
        })
      })
         


    }

    
    /* CLIENTES ***************************************************************************/
    vm.seleccionarCliente=function(item){
      //console.log(item)
      if (item){
        vm.one.id_cliente=item.id;
      }
    }

    vm.querySearch = function( item ) {
      var result= $filter('filter')(_listaClientes, item);
      return result;
    }

    vm.modalCliente=function(ev,idCliente) {
      vntClientesService.getOne(logUser.id_empresa, idCliente).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          angular.copy(res.data.response.datos,vntClientesService.one)
          if (idCliente==0)vntClientesService.one.nombre=vm.searchText;
        }
      })

      $mdDialog.show({
        controller: 'clientesDetailController',
        controllerAs: 'ctrl',
        templateUrl: 'front/app/core/ventas/clientes/clientes.detail.tpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(id){
          vntClientesService.getList(logUser.id_empresa).then(function(res){
            _listaClientes=res.data.response.datos;
            vm.selectedCliente=selectById(_listaClientes, id.toUpperCase());
          }) 
      }, function(){
        //openMe(vm.one)
      });
    }

    /************************ VENTA *******************************************/
    vm.addVenta = function(ev){
      _productoSeleccionado={};
      invMovimientosService.one={};
      angular.copy(_productoSeleccionado,invMovimientosService.one)
      openVenta(ev);
    };

    vm.selVenta = function(ev){
      var sel=vm.gridApiVentas.selection.getSelectedRows();
      _productoSeleccionado={};
      invMovimientosService.one={};
      _productoSeleccionado=sel[0];
      angular.copy(sel[0],invMovimientosService.one)
      openVenta(ev);
    };

    vm.delVenta = function(ev){
      var sel=vm.gridApiVentas.selection.getSelectedRows();
      var confirm=$mdDialog.confirm()
        .title('¿Desea eliminar el Producto?')
        .textContent(sel[0].producto_nombre+' '+sel[0].producto_unidad)
        .ariaLabel('Eliminar')
        .targetEvent(ev)
        .ok('Aceptar')
        .cancel('Cancelar');
      $mdDialog.show(confirm).then(function(){
        var indice = _listaVenta.indexOf(sel[0]);
        _listaVenta.splice(indice,1);        
        vm.gridLista.data = _listaVenta;
        vm.cntSel=0;
        calcularTotales();
      });
    };

    /*
    */
    function openVenta(ev){
      $mdDialog.show({
        controller: 'ventasOperacionesSelProdController',
        controllerAs: 'ctrl',
        templateUrl: 'front/app/core/ventas/operaciones/ventas-operaciones.selprod.tpl.html',
        parent: angular.element(document.body),
        locals:{
            listaProductos:_listaProductos,
          },   
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      }).then(function(res){
        console.log('llega del modal', res)
        if (!_productoSeleccionado.$$hashKey){
          _listaVenta.push(res)
        } else {
          var indice = _listaVenta.indexOf(_productoSeleccionado);
          _listaVenta[indice] = res;     
        }
        vm.gridLista.data = _listaVenta;
        calcularTotales();
      })
    }
  


    /*GENERALES ***********************************************************************************************************/
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

    function calcularTotales(){
      //console.log('calcularTotales')
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

      if(_listaVenta.length){
        vm.totales.items=_listaVenta.length;

        for (var i = 0; i < _listaVenta.length; i++) {
          var monto=0;
          var impuesto=0;
          var total=0;

          impuesto=(Number(_listaVenta[i].valor_impuesto)/100)+1;
          monto=Number(_listaVenta[i].precio)*Number(_listaVenta[i].cantidad);
          var tax=selectById(_listaImpuestos,_listaVenta[i].id_impuesto);
          switch(tax.codigo) {
              case '0001':
                  vm.totales.base_imponible_tg+=monto;
                  vm.totales.iva_tg+=(Number(_listaVenta[i].valor_impuesto)/100)*monto;
                  break;
              case '0002':
                  vm.totales.base_imponible_tr+=monto;
                  vm.totales.iva_tr+=(Number(_listaVenta[i].valor_impuesto)/100)*monto;
                  break;
              case '0003':
                  vm.totales.base_imponible_ta+=monto;
                  vm.totales.iva_ta+=(Number(_listaVenta[i].valor_impuesto)/100)*monto;
                  break;
              default:
                  vm.totales.monto_exento+=monto;
          }

          var total=monto*impuesto;
          vm.totales.total += Number(total);
        }
        console.log('Totales: ',vm.totales)
        calcularMoneda();
      }

    }


    /************************* VALIDACIONES *******************************/    
    vm.seGuarda=function(formValid){
      var valido=false;
      /*
      console.log('VALIDAR')
      console.log('formValid',formValid)
      console.log('vm.full',vm.full)
      console.log('vm.gridLista.data.length',vm.gridLista.data.length)
      console.log('vm.tipoOperacion.signo_caja',vm.tipoOperacion.signo_caja)
      console.log('_listaInstrumentosPago.length',_listaInstrumentosPago.length)
      console.log('vm.one.id_status',vm.one.id_status)
      console.log('__________________')
      */
      if (vm.one.id!="0") return valido;

      if (formValid && vm.full && vm.gridLista.data.length){
        valido= true;
      }

      if (vm.tipoOperacion.signo_caja!='N'){
        if(_listaInstrumentosPago.length){
          valido=true;
        } else {
          valido=false;
        }
      }
            
      return valido;
    }


    vm.pagar=function(ev){
      console.log('_listaInstrumentosPago',_listaInstrumentosPago)
      var listaPago=[];
      angular.copy(_listaInstrumentosPago,listaPago)
        $mdDialog.show({
          controller: 'cajMovimientosModalController',
          controllerAs: 'ctrl',
          templateUrl: 'front/app/core/caja/movimientos/caj-movimientos.modal.tpl.html',
          parent: angular.element(document.body),
          locals:{
            padre:'venta',
            instrumentosPago: listaPago,
            totalDocumento: vm.totales.total
          },
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(instrumentosPagoSeleccionados){
          console.log('_listaInstrumentosPago',_listaInstrumentosPago)
          _listaInstrumentosPago=instrumentosPagoSeleccionados;
        });
    }

    vm.guardar = function() {
      /*console.log('voy a mandar')
      console.log('vm.one',vm.one)
      console.log('_listaVenta',_listaVenta)
      console.log('_listaInstrumentosPago', _listaInstrumentosPago)*/
      console.log('ANTES vm.guardarPresionado',vm.guardarPresionado)
      if (!vm.guardarPresionado){
        vm.guardarPresionado=true;
        console.log('PRESIONDO vm.guardarPresionado',vm.guardarPresionado)

        var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
        vm.one.id_cotizacion=miCotizacion.id_cotizacion;
        vm.one.monto_exento=vm.totales.monto_exento;
        vm.one.base_imponible_tg=vm.totales.base_imponible_tg;
        vm.one.iva_tg=vm.totales.iva_tg;
        vm.one.base_imponible_tr=vm.totales.base_imponible_tr;
        vm.one.iva_tr=vm.totales.iva_tr;
        vm.one.base_imponible_ta=vm.totales.base_imponible_ta;
        vm.one.iva_ta=vm.totales.iva_ta;      
        vm.one.id_usuario=logUser.id;

        //console.log()
        var one={
          tipo:vm.tipoOperacion,
          head:vm.one,
          detail:_listaVenta,
          pago:_listaInstrumentosPago
        }
        console.log('envio:', one)
        vntOperacionesService.setOne(one).then(function(res){
          console.log('retorna: ',res)
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            vm.one.id=res.data.response.datos;
            $rootScope.showToast('Documento guardado con exito');
            vm.imprimir();
            $state.go('menu.ventas-operaciones-list'); 
          } else if (res.data && res.data.code!==0){
            localStorage.setItem("token",res.data.response.token);
            vm.error=res.data.response.token;
          } 
        })
      }
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
        vntOperacionesService.nullOne(one).then(function(res){
          console.log('retorna: ',res)
          if (res.data && res.data.code==0){
            localStorage.setItem("token",res.data.response.token);
            vm.one.id=res.data.response.datos;
            $rootScope.showToast('Documento anulado con exito');
            $state.go('menu.ventas-operaciones-list'); 
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
        var _factor=$rootScope.factor;

        var columns = [
            {title: "Nº", dataKey: "numero"},
            {title: "CODIGO", dataKey: "producto_codigo"},
            {title: "DESCRIPCION", dataKey: "producto_nombre"}, 
            {title: "UND", dataKey: "producto_unidad"},
            {title: "CANT", dataKey: "cantidad"},
            {title: "PRECIO", dataKey: "valor"},
            {title: "MONTO", dataKey: "monto"},            
        ];
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
            var _valor=data[i].precio*_factor;
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
            var topH=100;

            doc.setFontStyle('normal');
            /*EMPRESA*/
            doc.addImage(logoA , 'png', 20, 15, 60, 50);
            /*doc.setFontSize(12);
            doc.text(logEmpresa.nombre,32,75);
            doc.setFontSize(10);
            doc.text(logEmpresa.rif,32,88);*/
            doc.setFontSize(10);
            doc.text("TRIVEN IMPORT AND EXPORT C.A.",85,30);
            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text("TRIVENCA",85,47);
            doc.setFontType("normal");
            doc.setFontSize(10);
            doc.text(logEmpresa.rif,85,60);
            doc.setFontSize(8);
            doc.text("IMPORTACION EXPORTACION DE MATERIALES DE CONSTRUCCION",20,75);
            doc.text("EQUIPOS ELECTRONICOS, VIVERES Y ALIMENTOS",20,85);
            doc.text("Carretera Nacional Vía Paloma Casa S/N Sector Paloma",20,95);
            doc.text("Tucupita Estado Delta Amacuro",20,105);
            doc.text("Correo Electronico: trivenca.0102@gmail.com",20,115);
            doc.text("Número de contacto: (0414) 879.01.71 / (0414) 8790080",20,125);
            

            var miFecha=$filter('date')(vm.one.fecha, 'dd/MM/yyyy');
            doc.text("FECHA: "+ miFecha,440,topH);
            doc.text("Nº: "+ vm.one.nro_control,440,topH+15);

            doc.setFontSize(14);
            centerText(vm.tipoOperacion.nombre,topH+50);                                                

            doc.setFontSize(10);
            doc.text("NOMBRE: "+ vm.selectedCliente.nombre.substr(0, 60),30,topH+80);
            doc.text("RIF: "+ vm.selectedCliente.rif,460,topH+80);
            doc.text("DIRECCIÓN: "+ vm.selectedCliente.direccion.substr(0, 60),30,topH+95);
            doc.text("TELÉFONO: "+ vm.selectedCliente.telefono,460,topH+95);


        };

        //INICIALIZAR PDF
        var logoA = new Image();
        var docWatermark = new Image();

        var doc = new jsPDF('p', 'pt', 'letter');
        var totalPagesExp = "{total_pages_count_string}";
        console.log('doc',doc)
        console.log('paginas: ',doc.internal.pages.length)
        var topT=220;
        var topF=150;
        doc.setFontSize(10);

        rows = doRows(_listaVenta);
        totales=doTotals();

        logoA.src = 'front/assets/img/logo.png';
        logoA.onload = function(){

          docWatermark.src = 'front/assets/img/logo-triven-watermark-min.png';
          docWatermark.onload = function(){
              
              doc.addImage(docWatermark, 'PNG', 190, 250, 250, 250);

              doc.autoTable(columns, rows, {
                  addPageContent: pageContent,
                  margin: {top: topT, bottom: topF, left:20, right:30}, 
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

              // FOOTER ***************************************************************************************************
                var topF=doc.internal.pageSize.height - 100;
                var left=doc.internal.pageSize.width -260;
                
                //ETIQUETAS
                doc.text("BASE IMPONIBLE: ",left,topF);
                doc.text("IVA: ",left,topF+20);
                doc.text("TOTAL ("+miCotizacion.moneda_descrip+"): ",left,topF+40);                

                //TOTALES
                var x1= 0;
                //if (doc.internal.pages.length)
                doc.text(totales.base_imponible,alinearDerecha(totales.base_imponible) ,topF);
                doc.text(totales.monto_impuesto,alinearDerecha(totales.monto_impuesto) ,topF+20);
                doc.text(totales.total,alinearDerecha(totales.total) ,topF+40);  

              //doc = addWaterMark(doc, docWatermark);  

              var blob= doc.output("blob");
              window.open(URL.createObjectURL(blob));
              vm.full=true;
          }
        }
    }


    vm.imprimirAlmacen=function(ev){
        vm.full=false;
        var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
        //INICIALIZADORES
        var _factor=$rootScope.factor;

        var columns = [
            {title: "Nº", dataKey: "numero"},
            {title: "CODIGO", dataKey: "producto_codigo"},
            {title: "DESCRIPCION", dataKey: "producto_nombre"}, 
            {title: "UND", dataKey: "producto_unidad"},
            {title: "CANT", dataKey: "cantidad"},
        ];
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

            _fila.numero=numero;
            _fila.producto_codigo=data[i].producto_codigo;
            _fila.producto_nombre=data[i].producto_nombre;
            _fila.producto_unidad=data[i].producto_unidad;
            _fila.cantidad=$filter('currency')(Number(data[i].cantidad),'');

            _datos.push(_fila);
          }

          return _datos;
        }

        

        var pageContent = function () {
            // HEADER ***************************************************************************************************
            var topH=100;

            doc.setFontStyle('normal');
            /*EMPRESA*/
            doc.addImage(logoA , 'png', 20, 15, 60, 50);
            /*doc.setFontSize(12);
            doc.text(logEmpresa.nombre,32,75);
            doc.setFontSize(10);
            doc.text(logEmpresa.rif,32,88);*/
            doc.setFontSize(10);
            doc.text("TRIVEN IMPORT AND EXPORT C.A.",85,30);
            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text("TRIVENCA",85,47);
            doc.setFontType("normal");
            doc.setFontSize(10);
            doc.text(logEmpresa.rif,85,60);
            doc.setFontSize(8);
            doc.text("IMPORTACION EXPORTACION DE MATERIALES DE CONSTRUCCION",20,75);
            doc.text("EQUIPOS ELECTRONICOS, VIVERES Y ALIMENTOS",20,85);
            doc.text("Carretera Nacional Vía Paloma Casa S/N Sector Paloma",20,95);
            doc.text("Tucupita Estado Delta Amacuro",20,105);
            doc.text("Correo Electronico: trivenca.0102@gmail.com",20,115);
            doc.text("Número de contacto: (0414) 879.01.71 / (0414) 8790080",20,125);
            

            var miFecha=$filter('date')(vm.one.fecha, 'dd/MM/yyyy');
            doc.text("FECHA: "+ miFecha,440,topH);
            doc.text("Nº: "+ vm.one.nro_control,440,topH+15);

            doc.setFontSize(14);
            centerText("Nota Entrega Almacen",topH+50);                                                

            doc.setFontSize(10);
            doc.text("NOMBRE: "+ vm.selectedCliente.nombre.substr(0, 60),30,topH+80);
            doc.text("RIF: "+ vm.selectedCliente.rif,460,topH+80);
            doc.text("DIRECCIÓN: "+ vm.selectedCliente.direccion.substr(0, 60),30,topH+95);
            doc.text("TELÉFONO: "+ vm.selectedCliente.telefono,460,topH+95);


        };

        //INICIALIZAR PDF
        var logoA = new Image();
        var docWatermark = new Image();

        var doc = new jsPDF('p', 'pt', 'letter');
        var totalPagesExp = "{total_pages_count_string}";
        console.log('doc',doc)
        console.log('paginas: ',doc.internal.pages.length)
        var topT=220;
        var topF=150;
        doc.setFontSize(10);

        rows = doRows(_listaVenta);
        

        logoA.src = 'front/assets/img/logo.png';
        logoA.onload = function(){

          docWatermark.src = 'front/assets/img/logo-triven-watermark-min.png';
          docWatermark.onload = function(){
              
              doc.addImage(docWatermark, 'PNG', 190, 250, 250, 250);

              doc.autoTable(columns, rows, {
                  addPageContent: pageContent,
                  margin: {top: topT, bottom: topF, left:20, right:30}, 
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

              // FOOTER ***************************************************************************************************
                var topF=doc.internal.pageSize.height - 100;
                var left=doc.internal.pageSize.width -260;
                
                //ETIQUETAS
                doc.text("Observaciones: ____________________________________________________________________________________",30,topF);                
                doc.text("Entregado por: _________________________________",30,topF+40);
                doc.text("Recibido por: _________________________________",left-20,topF+40);

                

              //doc = addWaterMark(doc, docWatermark);  

              var blob= doc.output("blob");
              window.open(URL.createObjectURL(blob));
              vm.full=true;
          }
        }
    }


    function addWaterMark(doc, wm) {
      var totalPages = doc.internal.getNumberOfPages();
      
      var i=0;
      
      doc.setFontSize(30);
      for (i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.addImage(wm, 'PNG', 190, 250, 250, 250);
        doc.setTextColor(150);
      }

      return doc;
      

    }


  }

})();