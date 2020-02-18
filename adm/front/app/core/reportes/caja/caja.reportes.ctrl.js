(function(){
  'use strict';

  angular.module("reportesModule")
  .controller("cajaReportesController", cajaReportesController);
  cajaReportesController.$inject=['$rootScope', '$scope', '$filter', '$state', '$mdDialog', 'uiGridConstants', 'repCajaService', 'sisListasService', 'cnfCuentasbancariasService', 'CONFIG'];

  function cajaReportesController($rootScope, $scope, $filter, $state, $mdDialog, uiGridConstants, repCajaService, sisListasService, cnfCuentasbancariasService, CONFIG){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));
    var logEmpresa=JSON.parse(sessionStorage.getItem("empresa"));
    var factor=sessionStorage.getItem("valorCotizacion");
    var _factor=1;
    var vm=this;
    vm.filtro="";
    vm.filtroUsuario="";
    vm.idReporte="1";
    vm.idInstrumento="";
    vm.idCuenta="";
    vm.listaInstrumentos=[];
    vm.listaCuentas=[];
    vm.activeItem={};

    vm.usa_fecha=false;
    vm.usa_instrumento=false;
    vm.usa_cuenta=false;

    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    vm.desde= d;
    vm.hasta= new Date();


    var lista=[];
    var _listaInstrumentos=[];
    var _listaCuentas=[];

    var _oneCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));

    $scope.$watch('$root.factor', function() {
        _oneCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
    });

    vm.selOptReport=function(){
      switch (vm.idReporte){
        case '1':
          //INSTRUMENTO RESUMEN
          vm.usa_fecha=true;
          vm.usa_instrumento=false;
          vm.usa_cuenta=false;
          break;
        case '2':
          //INSTRUMENTO DETALLE    
          vm.usa_fecha=true;
          vm.usa_instrumento=true;
          vm.usa_cuenta=false;
          break;
        case '3':
          //CUENTAS RESUMEN
          vm.usa_fecha=true;
          vm.usa_instrumento=false;
          vm.usa_cuenta=false;
          break;
        case '4':
          //CUENTAS DETALLE
          vm.usa_fecha=true;
          vm.usa_instrumento=false;
          vm.usa_cuenta=true;
          break;
      }
    }

    activate();

    function activate(){
      Pace.restart();

      //SISTEMA INSTRUMENTOS PAGO
      sisListasService.getByCampo('instrumento_pago').then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaInstrumentos=res.data.response.datos;
          vm.listaInstrumentos=_listaInstrumentos;

        }
      })

      //BANCOS
      sisListasService.getByCampo('bancos').then(function(res){
          var _listaBancos=res.data.response.datos;
      })

      //CUENTAS
      cnfCuentasbancariasService.getList(logUser.id_empresa).then(function(res){
          _listaCuentas=res.data.response.datos;
          vm.listaCuentas=_listaCuentas;
      })

      vm.selOptReport();
    }

    /*
    vm.filtrar = function() {
      vm.listaClientes = $filter('multiFiltro')(_listaClientes, vm.filtro);
    };

    vm.selItem=function(item,event){
      vm.activeItem=item;
    }
    */

    vm.selectReport = function() {
      _factor=$rootScope.factor;

      switch (vm.idReporte){
        case '1': //OPERACIONES RESUMEN
          repInstrumentosResumen();
          break;
        case '2': //OPERACIONES DETALLE
          repInstrumentosDetalle();        
          break;
        case '3': //CUENTAS RESUMEN
          repCuentasResumen();
          break;        
        case '4': //CUENTAS DETALLE
          repCuentasDetalle();
          break; 

      }  
    };

    /*********************************************************************************************************************************/
    /****************************************************** RESUMEN INSTRUMENTOS *****************************************************/
    /*********************************************************************************************************************************/
    function repInstrumentosResumen(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        desde:vm.desde,
        hasta:vm.hasta
      }

      repCajaService.getInstrumentosResumen(obj).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;


          //DO ROWS
          var doRows = function(data){
            var numero=0;
            for (var i = 0; i < data.length; i++) {
              numero+=1;
              data[i].numero=numero;
              data[i].monto=data[i].monto;
              data[i].monto=$filter('currency')(Number(data[i].monto), '');
            }

            return data;
          }

          

          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "NOMBRE", dataKey: "instrumento_nombre"},
              {title: "CANTIDAD", dataKey: "cantidad"}, 
              {title: "MONTO", dataKey: "monto"},
          ];

          //ASIGNACION
          var rows = doRows(lista);
          var doc = new jsPDF('p', 'pt', 'letter');

          function alinearDerecha(texto){
            var margen=doc.internal.pageSize.width-20;
            return margen - (doc.getStringUnitWidth(texto) * doc.internal.getFontSize());
          }

          var centerText = function(texto, alto){
            var xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(texto) * doc.internal.getFontSize() / 2); 
            doc.text(texto, xOffset, alto);        
          }

          var doc = new jsPDF('l', 'pt', 'letter');
          //console.log(doc)
          var totalPagesExp = "{total_pages_count_string}";

          
          


          // HEADER ***************************************************************************************************
          doc.setFontStyle('normal');
          /*EMPRESA*/                
          doc.setFontSize(14);
          doc.text(logEmpresa.nombre,32,60);
          doc.setFontSize(10);
          doc.text(logEmpresa.rif,32,75);

          var laFecha=new Date();
          var miFecha=$filter('date')(laFecha, 'dd/MM/yyyy');
          doc.setFontSize(9);
          doc.text(miFecha,alinearDerecha(miFecha)-20,75);
          
          var _desde=$filter('date')(vm.desde, 'dd/MM/yyyy');
          var _hasta=$filter('date')(vm.hasta, 'dd/MM/yyyy');

          doc.setFontSize(16);
          centerText('RESUMEN DE INSTRUMENTOS DE VENTA ('+miCotizacion.moneda_descrip+")",110);                                                

          doc.setFontSize(12);
          centerText(_desde+  ' - ' +_hasta,125);

          doc.setFontSize(10);
          // FOOTER ***************************************************************************************************
          var pageContent = function (data) {
              var str = "Page " + data.pageCount;
              if (typeof doc.putTotalPages === 'function') {
                  str = str + " of " + totalPagesExp;
              }

          };

          // CONTENIDO ***************************************************************************************************
          var miY=160;
          doc.autoTable.previous=false;
          for (var i = 0; i < rows.length; i++) {
              //SEPARADOR DE TABLA CATEGORIA
              doc.setFontSize(12);

              doc.autoTable(columns, rows, {
                  addPageContent: pageContent,
                  startY: miY + 20,
                  theme: 'grid',                  
                  margin: {top: 170, bottom: 40}, 
                  theme: 'grid',
                  headerStyles: {
                    fillColor: 255,
                    textColor: 0,
                    lineWidth: 1,
                    fontSize: 9,
                  },
                  bodyStyles: {fontSize: 9},
                  columnStyles: {
                      numero: {columnWidth: 30, halign: 'right'},
                      cantidad: {columnWidth: 70, halign: 'right'},
                      monto: {columnWidth: 120, halign: 'right'},
                  },
              });
          }

          // Total page number plugin only available in jspdf v1.0+
          if (typeof doc.putTotalPages === 'function') {
              doc.putTotalPages(totalPagesExp);
          }


          // CIERRE ***************************************************************************************************
          var blob= doc.output("blob");
          window.open(URL.createObjectURL(blob));
          vm.full=true;
          
        }
      })          
    }


    /*********************************************************************************************************************************/
    /***************************************************** INSTRUMENTOS DETALLE ******************************************************/
    /*********************************************************************************************************************************/
    function repInstrumentosDetalle(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        idInstrumento:vm.idInstrumento,
        desde:vm.desde,
        hasta:vm.hasta
      }

      repCajaService.getInstrumentosDetalle(obj).then(function(res){
        console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;

          var total_monto=0;

          //DO ROWS
          var doRows = function(data){
            var numero=0;
            for (var i = 0; i < data.length; i++) {
              numero+=1;
              data[i].numero=numero;
              data[i].monto=data[i].monto;
              total_monto+=Number(data[i].monto);
              console.log(total_monto)

              data[i].fecha=new Date(data[i].fecha);
              data[i].fecha=$filter('date')(data[i].fecha, 'dd/MM/yyyy');
              data[i].cotizacion_valor=$filter('currency')(Number(data[i].cotizacion_valor), '');
              data[i].monto=$filter('currency')(Number(data[i].monto), '');
            }
            console.log(total_monto)
            total_monto=$filter('currency')(Number(total_monto), '');
            return data;
          }

          

          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "FECHA", dataKey: "fecha"}, 
              {title: "DOCUMENTO", dataKey: "operacion_nombre"},
              {title: "Nº CONTROL", dataKey: "nro_control"},
              {title: "CLIENTE", dataKey: "cliente_nombre"},
              {title: "RIF", dataKey: "cliente_rif"},
              {title: "Nº OPERACION", dataKey: "numero_operacion"},
              {title: "COTIZACION", dataKey: "cotizacion_valor"},
              {title: "MONTO", dataKey: "monto"},
          ];

          //ASIGNACION
          var rows = doRows(lista);
          var doc = new jsPDF('p', 'pt', 'letter');

          function alinearDerecha(texto){
            var margen=doc.internal.pageSize.width-20;
            return margen - (doc.getStringUnitWidth(texto) * doc.internal.getFontSize());
          }

          var centerText = function(texto, alto){
            var xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(texto) * doc.internal.getFontSize() / 2); 
            doc.text(texto, xOffset, alto);        
          }

          var doc = new jsPDF('l', 'pt', 'letter');
          var totalPagesExp = "{total_pages_count_string}";

          
          

          // HEADER ***************************************************************************************************
          doc.setFontStyle('normal');
          /*EMPRESA*/                
          doc.setFontSize(14);
          doc.text(logEmpresa.nombre,32,60);
          doc.setFontSize(10);
          doc.text(logEmpresa.rif,32,75);

          var laFecha=new Date();
          var miFecha=$filter('date')(laFecha, 'dd/MM/yyyy');
          doc.setFontSize(9);
          doc.text(miFecha,alinearDerecha(miFecha)-20,75);
          
          var _desde=$filter('date')(vm.desde, 'dd/MM/yyyy');
          var _hasta=$filter('date')(vm.hasta, 'dd/MM/yyyy');

          doc.setFontSize(16);
          centerText('DETALLE DE INSTRUMENTOS DE PAGO ('+miCotizacion.moneda_descrip+")",110);                                                

          doc.setFontSize(12);
          centerText(_desde+  ' - ' +_hasta,125);

          //OPERACION
          var filtroTipo={};
          filtroTipo.id=vm.idInstrumento;           
          var miInstrumento = $filter('filter')(_listaInstrumentos, filtroTipo, true);
          if (miInstrumento.length){
            doc.text(miInstrumento[0].nombre +" ( "+ total_monto + ")" ,40,160);
          }


          doc.setFontSize(10);
          // FOOTER ***************************************************************************************************
          var pageContent = function (data) {
              var str = "Page " + data.pageCount;
              if (typeof doc.putTotalPages === 'function') {
                  str = str + " of " + totalPagesExp;
              }

          };

          // CONTENIDO ***************************************************************************************************
          var miY=160;
          doc.autoTable.previous=false;
          for (var i = 0; i < rows.length; i++) {
              doc.setFontSize(12);

              doc.autoTable(columns, rows, {
                  addPageContent: pageContent,
                  startY: miY + 20,
                  theme: 'grid',                  
                  margin: {top: 170, bottom: 40}, 
                  theme: 'grid',
                  headerStyles: {
                    fillColor: 255,
                    textColor: 0,
                    lineWidth: 1,
                    fontSize: 9,
                  },
                  bodyStyles: {fontSize: 9},
                  columnStyles: {
                      numero: {columnWidth: 30, halign: 'right'},
                      nro_control: {columnWidth: 70, halign: 'left'},
                      operacion_nombre: {columnWidth: 90, halign: 'left'},
                      fecha: {columnWidth: 65, halign: 'left'},
                      cliente_rif: {columnWidth: 80, halign: 'left'},
                      numero_operacion: {columnWidth: 80, halign: 'left'},
                      cotizacion_valor: {columnWidth: 70, halign: 'right'},
                      monto: {columnWidth: 110, halign: 'right'},
                  },
              });
          }

          // Total page number plugin only available in jspdf v1.0+
          if (typeof doc.putTotalPages === 'function') {
              doc.putTotalPages(totalPagesExp);
          }


          // CIERRE ***************************************************************************************************
          var blob= doc.output("blob");
          window.open(URL.createObjectURL(blob));
          vm.full=true;
          
        }
      })          
    }

    /*********************************************************************************************************************************/
    /******************************************************** RESUMEN CUENTAS ********************************************************/
    /*********************************************************************************************************************************/
    function repCuentasResumen(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        desde:vm.desde,
        hasta:vm.hasta
      }
      repCajaService.getCuentasResumen(obj).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;


          //DO ROWS
          var doRows = function(data){
            var numero=0;
            for (var i = 0; i < data.length; i++) {
              numero+=1;
              data[i].numero=numero;
              data[i].monto=data[i].monto;
              data[i].monto=$filter('currency')(Number(data[i].monto), '');
            }

            return data;
          }

          

          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "NUMERO", dataKey: "cuenta_numero"},
              {title: "BANCO", dataKey: "banco_nombre"},
              {title: "CANTIDAD", dataKey: "cantidad"}, 
              {title: "MONTO", dataKey: "monto"},
          ];

          //ASIGNACION
          var rows = doRows(lista);
          var doc = new jsPDF('p', 'pt', 'letter');

          function alinearDerecha(texto){
            var margen=doc.internal.pageSize.width-20;
            return margen - (doc.getStringUnitWidth(texto) * doc.internal.getFontSize());
          }

          var centerText = function(texto, alto){
            var xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(texto) * doc.internal.getFontSize() / 2); 
            doc.text(texto, xOffset, alto);        
          }

          var doc = new jsPDF('l', 'pt', 'letter');
          //console.log(doc)
          var totalPagesExp = "{total_pages_count_string}";

          
          

          // HEADER ***************************************************************************************************
          doc.setFontStyle('normal');
          /*EMPRESA*/                
          doc.setFontSize(14);
          doc.text(logEmpresa.nombre,32,60);
          doc.setFontSize(10);
          doc.text(logEmpresa.rif,32,75);

          var laFecha=new Date();
          var miFecha=$filter('date')(laFecha, 'dd/MM/yyyy');
          doc.setFontSize(9);
          doc.text(miFecha,alinearDerecha(miFecha)-20,75);
          
          var _desde=$filter('date')(vm.desde, 'dd/MM/yyyy');
          var _hasta=$filter('date')(vm.hasta, 'dd/MM/yyyy');

          doc.setFontSize(16);
          centerText('RESUMEN DE CUENTAS BANCARIAS ('+miCotizacion.moneda_descrip+")",110);                                                

          doc.setFontSize(12);
          centerText(_desde+  ' - ' +_hasta,125);
          doc.setFontSize(10);

          // FOOTER ***************************************************************************************************
          var pageContent = function (data) {
              var str = "Page " + data.pageCount;
              if (typeof doc.putTotalPages === 'function') {
                  str = str + " of " + totalPagesExp;
              }

          };

          // CONTENIDO ***************************************************************************************************
          var miY=160;
          doc.autoTable.previous=false;
          for (var i = 0; i < rows.length; i++) {
              //SEPARADOR DE TABLA CATEGORIA
              doc.setFontSize(12);

              doc.autoTable(columns, rows, {
                  addPageContent: pageContent,
                  startY: miY + 20,
                  theme: 'grid',                  
                  margin: {top: 170, bottom: 40}, 
                  theme: 'grid',
                  headerStyles: {
                    fillColor: 255,
                    textColor: 0,
                    lineWidth: 1,
                    fontSize: 9,
                  },
                  bodyStyles: {fontSize: 9},
                  columnStyles: {
                      numero: {columnWidth: 30, halign: 'right'},
                      cantidad: {columnWidth: 70, halign: 'right'},
                      monto: {columnWidth: 120, halign: 'right'},
                  },
              });
          }

          // Total page number plugin only available in jspdf v1.0+
          if (typeof doc.putTotalPages === 'function') {
              doc.putTotalPages(totalPagesExp);
          }


          // CIERRE ***************************************************************************************************
          var blob= doc.output("blob");
          window.open(URL.createObjectURL(blob));
          vm.full=true;
          
        }
      })          
    }

    /*********************************************************************************************************************************/
    /******************************************************** CUENTAS DETALLE ********************************************************/
    /*********************************************************************************************************************************/
    function repCuentasDetalle(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        idCuenta:vm.idCuenta,
        desde:vm.desde,
        hasta:vm.hasta
      }

      repCajaService.getCuentasDetalle(obj).then(function(res){
        console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;

          var total_monto=0;

          //DO ROWS
          var doRows = function(data){
            var numero=0;
            for (var i = 0; i < data.length; i++) {
              numero+=1;
              data[i].numero=numero;
              data[i].monto=data[i].monto;
              total_monto+=Number(data[i].monto);
              console.log(total_monto)

              data[i].fecha=new Date(data[i].fecha);
              data[i].fecha=$filter('date')(data[i].fecha, 'dd/MM/yyyy');
              data[i].cotizacion_valor=$filter('currency')(Number(data[i].cotizacion_valor), '');
              data[i].monto=$filter('currency')(Number(data[i].monto), '');
            }
            console.log(total_monto)
            total_monto=$filter('currency')(Number(total_monto), '');
            return data;
          }

          

          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "FECHA", dataKey: "fecha"}, 
              {title: "DOCUMENTO", dataKey: "operacion_nombre"},
              {title: "Nº CONTROL", dataKey: "nro_control"},
              {title: "CLIENTE", dataKey: "cliente_nombre"},
              {title: "RIF", dataKey: "cliente_rif"},
              {title: "INSTRUMENTO", dataKey: "instrumento_nombre"},
              {title: "Nº OPERACION", dataKey: "numero_operacion"},
              {title: "COTIZACION", dataKey: "cotizacion_valor"},
              {title: "MONTO", dataKey: "monto"},
          ];

          //ASIGNACION
          var rows = doRows(lista);
          var doc = new jsPDF('p', 'pt', 'letter');

          function alinearDerecha(texto){
            var margen=doc.internal.pageSize.width-20;
            return margen - (doc.getStringUnitWidth(texto) * doc.internal.getFontSize());
          }

          var centerText = function(texto, alto){
            var xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(texto) * doc.internal.getFontSize() / 2); 
            doc.text(texto, xOffset, alto);        
          }

          var doc = new jsPDF('l', 'pt', 'letter');
          var totalPagesExp = "{total_pages_count_string}";

          
          

          // HEADER ***************************************************************************************************
          doc.setFontStyle('normal');
          /*EMPRESA*/                
          doc.setFontSize(14);
          doc.text(logEmpresa.nombre,32,60);
          doc.setFontSize(10);
          doc.text(logEmpresa.rif,32,75);

          var laFecha=new Date();
          var miFecha=$filter('date')(laFecha, 'dd/MM/yyyy');
          doc.setFontSize(9);
          doc.text(miFecha,alinearDerecha(miFecha)-20,75);
          
          var _desde=$filter('date')(vm.desde, 'dd/MM/yyyy');
          var _hasta=$filter('date')(vm.hasta, 'dd/MM/yyyy');

          doc.setFontSize(16);
          centerText('DETALLE DE INSTRUMENTOS DE PAGO ('+miCotizacion.moneda_descrip+")",110);                                                

          doc.setFontSize(12);
          centerText(_desde+  ' - ' +_hasta,125);

          //OPERACION
          var filtroTipo={};
          filtroTipo.id=vm.idCuenta;           
          var miCuenta = $filter('filter')(_listaCuentas, filtroTipo, true);
          if (miCuenta.length){
            doc.text(miCuenta[0].numero + " - " + miCuenta[0].banco_nombre +" ( "+ total_monto + ")" ,40,160);
          }


          doc.setFontSize(10);
          // FOOTER ***************************************************************************************************
          var pageContent = function (data) {
              var str = "Page " + data.pageCount;
              if (typeof doc.putTotalPages === 'function') {
                  str = str + " of " + totalPagesExp;
              }

          };

          // CONTENIDO ***************************************************************************************************
          var miY=160;
          doc.autoTable.previous=false;
          for (var i = 0; i < rows.length; i++) {
              doc.setFontSize(12);

              doc.autoTable(columns, rows, {
                  addPageContent: pageContent,
                  startY: miY + 20,
                  theme: 'grid',                  
                  margin: {top: 170, bottom: 40}, 
                  theme: 'grid',
                  headerStyles: {
                    fillColor: 255,
                    textColor: 0,
                    lineWidth: 1,
                    fontSize: 9,
                  },
                  bodyStyles: {fontSize: 9},
                  columnStyles: {
                      numero: {columnWidth: 30, halign: 'right'},
                      fecha: {columnWidth: 65, halign: 'left'},
                      operacion_nombre: {columnWidth: 70, halign: 'left'},
                      nro_control: {columnWidth: 70, halign: 'left'},
                      cliente_rif: {columnWidth: 70, halign: 'left'},
                      instrumento_nombre: {columnWidth: 80, halign: 'left'},
                      numero_operacion: {columnWidth: 80, halign: 'left'},
                      cotizacion_valor: {columnWidth: 70, halign: 'right'},
                      monto: {columnWidth: 100, halign: 'right'},
                  },
              });
          }

          // Total page number plugin only available in jspdf v1.0+
          if (typeof doc.putTotalPages === 'function') {
              doc.putTotalPages(totalPagesExp);
          }


          // CIERRE ***************************************************************************************************
          var blob= doc.output("blob");
          window.open(URL.createObjectURL(blob));
          vm.full=true;
      
        }
      })          
    }





  }
})();