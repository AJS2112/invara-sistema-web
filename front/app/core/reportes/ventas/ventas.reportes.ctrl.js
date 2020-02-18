(function(){
  'use strict';

  angular.module("reportesModule")
  .controller("ventasReportesController", ventasReportesController);
  ventasReportesController.$inject=['$rootScope', '$scope', '$filter', '$state', '$mdDialog', 'uiGridConstants', 'repVentasService', 'sisOperacionesService', 'sisListasService', 'vntClientesService', 'CONFIG'];

  function ventasReportesController($rootScope, $scope, $filter, $state, $mdDialog, uiGridConstants, repVentasService, sisOperacionesService, sisListasService, vntClientesService, CONFIG){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));
    var logEmpresa=JSON.parse(sessionStorage.getItem("empresa"));
    var factor=sessionStorage.getItem("valorCotizacion");
    var _factor=1;
    
    var vm=this;
    vm.filtro="";
    vm.filtroUsuario="";
    vm.idReporte="1";
    vm.idOperacion="";
    vm.listaOperaciones=[];
    vm.listaClientes=[];
    vm.listaUsuarios=[];
    vm.activeItem={};

    vm.btnImprimir=true;
    vm.usa_fecha=false;
    vm.usa_clientes=false;
    vm.usa_tipo=false;

    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    vm.desde= d;
    vm.hasta= new Date();


    var lista=[];
    var _listaOperaciones=[];
    var _listaClientes=[];
    var _listaUsuarios=[];

    vm.selOptReport=function(){
      switch (vm.idReporte){
        case '1':
          //OPERACIONES RESUMEN
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_clientes=false;
          vm.usa_usuarios=false;
          break;
        case '2':
          //OPERACIONES DETALLE    
          vm.usa_tipo=true;
          vm.usa_fecha=true;
          vm.usa_clientes=false;
          vm.usa_usuarios=false;
          break;
        case '3':
          //CLIENTES RESUMEN
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_clientes=false;
          vm.usa_usuarios=false;
          break;
        case '4':
          //CLIENTES DETALLE
          vm.btnImprimir=false;
          vm.activeItem=null;
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_clientes=true;
          vm.usa_usuarios=false;
          break;
        case '5':
          //DEUDAS RESUMEN
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_clientes=false;
          vm.usa_usuarios=false;
          break;
        case '6':
          //DEUDAS DETALLE
          vm.btnImprimir=false;
          vm.activeItem=null;
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_clientes=true;
          vm.usa_usuarios=false;
          break;
        case '8':
          //PAGOS RECIBIDOS DETALLE
          vm.btnImprimir=false;
          vm.activeItem=null;
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_clientes=true;
          vm.usa_usuarios=false;
          break;
        /*case '5':
          //COMISIONES RESUMEN
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_clientes=false;
          vm.usa_usuarios=false;
          break;                
        case '8':
          //USUARIOS
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_clientes=false;
          vm.usa_usuarios=true;
          break;*/                                      
      }
    }

    activate();

    function activate(){
      Pace.restart();

      //OPERACIONES
      sisOperacionesService.getList('11E7C39A0EACD9A08F1A00E04C6F7E24').then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaOperaciones=res.data.response.datos;
          vm.listaOperaciones=_listaOperaciones;
        }
      })

      //CLIENTES
      vntClientesService.getList(logEmpresa.id).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaClientes=res.data.response.datos;
          vm.filtrar();
        }
      })

      vm.selOptReport();
    }

    
    vm.filtrar = function() {
      vm.listaClientes = $filter('multiFiltro')(_listaClientes, vm.filtro);
    };

    vm.selItem=function(item,event){
      vm.activeItem=item;
      if(vm.activeItem)vm.btnImprimir=true;
    }
    

    vm.selectReport = function() {
      switch (vm.idReporte){
        case '1': //OPERACIONES RESUMEN
          repOperacionesResumen();
          break;
        case '2': //OPERACIONES DETALLE
          repOperacionesDetalle();        
          break;
        case '3': //CLIENTES RESUMEN
          repClientesResumen();
          break;        
        case '4': //CLIENTES DETALLE
          repClientesDetalle();
          break; 
        case '5': //DEUDAS RESUMEN
          repDeudasResumen();
          break;
        case '6': //DEUDAS DETALLE
          repDeudasDetalle();
          break;   
        case '8': //DEUDAS DETALLE
          repPagosDetalle();
          break;                          

      }  
    };


    /*********************************************************************************************************************************/
    /****************************************************** RESUMEN OPERACIONES ******************************************************/
    /*********************************************************************************************************************************/
    function repOperacionesResumen(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        desde:vm.desde,
        hasta:vm.hasta
      }
      repVentasService.getOperacionesResumen(obj).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;


          //DO ROWS
          var doRows = function(data){
            var numero=0;
            for (var i = 0; i < data.length; i++) {
              numero+=1;
              data[i].numero=numero;
              data[i].monto=$filter('currency')(Number(data[i].monto), '');
            }

            return data;
          }

          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "NOMBRE", dataKey: "nombre"},
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
          centerText('RESUMEN DE OPERACIONES DE VENTA ('+miCotizacion.moneda_descrip+")",110);                                                

          doc.setFontSize(12);
          centerText(_desde+  ' - ' +_hasta,130);
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
          
          //////////////
        }
      })          
    }


    /*********************************************************************************************************************************/
    /****************************************************** OPERACIONES DETALLE ******************************************************/
    /*********************************************************************************************************************************/
    function repOperacionesDetalle(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        idOperacion:vm.idOperacion,
        desde:vm.desde,
        hasta:vm.hasta
      }

      repVentasService.getOperacionesDetalle(obj).then(function(res){
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
              {title: "Nº CONTROL", dataKey: "nro_control"},
              {title: "FECHA", dataKey: "fecha"}, 
              {title: "CLIENTE", dataKey: "cliente_nombre"},
              {title: "RIF", dataKey: "cliente_rif"},
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
          centerText('DETALLE DE OPERACIONES DE VENTA ('+miCotizacion.moneda_descrip+")",110);                                                

          doc.setFontSize(12);
          centerText(_desde+  ' - ' +_hasta,130);

          //OPERACION
          var filtroTipo={};
          filtroTipo.id=vm.idOperacion;           
          var miOperacion = $filter('filter')(_listaOperaciones, filtroTipo, true);
          if (miOperacion.length){
            doc.text(miOperacion[0].nombre +" ( "+ total_monto + ")" ,40,160);
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
                      fecha: {columnWidth: 80, halign: 'left'},
                      cliente_rif: {columnWidth: 90, halign: 'left'},
                      cotizacion_valor: {columnWidth: 70, halign: 'right'},
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
    /****************************************************** RESUMEN CLIENTES *********************************************************/
    /*********************************************************************************************************************************/
    function repClientesResumen(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        desde:vm.desde,
        hasta:vm.hasta
      }
      repVentasService.getClientesResumen(obj).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;


          //DO ROWS
          var doRows = function(data){
            var numero=0;
            for (var i = 0; i < data.length; i++) {
              numero+=1;
              data[i].numero=numero;
              data[i].tp=$filter('currency')(Number(data[i].tp), '');
              data[i].tn=$filter('currency')(Number(data[i].tn), '');
              data[i].tm=$filter('currency')(Number(data[i].tm), '');
            }

            return data;
          }


          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "NOMBRE", dataKey: "cliente_nombre"},
              {title: "RIF", dataKey: "cliente_rif"}, 
              {title: "ENTRADA", dataKey: "tp"},
              {title: "NEUTRO", dataKey: "tn"},
              {title: "SALIDA", dataKey: "tm"},
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
          centerText('RESUMEN DE OPERACIONES DE VENTA POR CLIENTES',110);                                                

          doc.setFontSize(12);
          centerText(_desde+  ' - ' +_hasta,130);
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
                      rif: {columnWidth: 70, halign: 'left'},
                      tp: {columnWidth: 100, halign: 'right'},
                      tn: {columnWidth: 100, halign: 'right'},
                      tm: {columnWidth: 100, halign: 'right'},
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
    /****************************************************** CLIENTES DETALLE ******************************************************/
    /*********************************************************************************************************************************/
    function repClientesDetalle(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        idCliente:vm.activeItem.id,
        desde:vm.desde,
        hasta:vm.hasta
      }

      console.log(obj)

      repVentasService.getClientesDetalle(obj).then(function(res){
        console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;


          //DO ROWS
          var doRows = function(data){
            var numero=0;
            for (var i = 0; i < data.length; i++) {
              numero+=1;
              data[i].numero=numero;

              data[i].fecha=new Date(data[i].fecha);
              data[i].fecha=$filter('date')(data[i].fecha, 'dd/MM/yyyy');
              data[i].cotizacion_valor=$filter('currency')(Number(data[i].cotizacion_valor), '');
              data[i].monto=$filter('currency')(Number(data[i].monto), '');
            }
            return data;
          }


          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "OPERACION", dataKey: "operacion_nombre"},
              {title: "Nº CONTROL", dataKey: "nro_control"},
              {title: "FECHA", dataKey: "fecha"},
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
          centerText('DETALLE DE OPERACIONES DE VENTA ('+miCotizacion.moneda_descrip+")",110);                                                

          doc.setFontSize(12);
          centerText(_desde+  ' - ' +_hasta,130);

          doc.text(vm.activeItem.nombre,40,156);                                                
          doc.setFontSize(9);
          doc.text(vm.activeItem.rif,40,170);


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
                      fecha: {columnWidth: 80, halign: 'left'},
                      cotizacion_valor: {columnWidth: 70, halign: 'right'},
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
    /****************************************************** RESUMEN DEUDAS *********************************************************/
    /*********************************************************************************************************************************/
    function repDeudasResumen(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        desde:vm.desde,
        hasta:vm.hasta
      }
      repVentasService.getDeudasResumen(obj).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;


          //DO ROWS
          var doRows = function(data){
            var numero=0;
            for (var i = 0; i < data.length; i++) {
              numero+=1;
              data[i].numero=numero;
              data[i].total_moneda=$filter('currency')(Number(data[i].total_moneda), '');
              data[i].abonos_moneda=$filter('currency')(Number(data[i].abonos_moneda), '');
              data[i].deuda_moneda=$filter('currency')(Number(data[i].deuda_moneda), '');
            }

            return data;
          }


          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "NOMBRE", dataKey: "nombre"},
              {title: "RIF", dataKey: "rif"}, 
              {title: "MONTO", dataKey: "total_moneda"},
              {title: "ABONOS", dataKey: "abonos_moneda"},
              {title: "DEUDA", dataKey: "deuda_moneda"},
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
          centerText('RESUMEN DE CUENTAS POR COBRAR ('+miCotizacion.moneda_descrip+")",110);                                                

          doc.setFontSize(12);
          //centerText(_desde+  ' - ' +_hasta,130);
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
                      rif: {columnWidth: 70, halign: 'left'},
                      total_moneda: {columnWidth: 100, halign: 'right'},
                      abonos_moneda: {columnWidth: 100, halign: 'right'},
                      deuda_moneda: {columnWidth: 100, halign: 'right'},
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
    /****************************************************** DEUDAS DETALLE ******************************************************/
    /*********************************************************************************************************************************/
    function repDeudasDetalle(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        idCliente:vm.activeItem.id,
        desde:vm.desde,
        hasta:vm.hasta
      }

      console.log(obj)

      repVentasService.getDeudasDetalle(obj).then(function(res){
        console.log(res)
        var totalTotal=0;
        var totalAbonos=0;
        var totalDeuda=0;
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;


          //DO ROWS
          var doRows = function(data){
            var numero=0;
            totalTotal=0;
            totalAbonos=0;
            totalDeuda=0;
            for (var i = 0; i < data.length; i++) {
              numero+=1;
              data[i].numero=numero;

              data[i].fecha=new Date(data[i].fecha);
              data[i].fecha=$filter('date')(data[i].fecha, 'dd/MM/yyyy');

              totalTotal+=Number(data[i].total_moneda);
              totalAbonos+=Number(data[i].abonos_moneda);
              totalDeuda+=Number(data[i].deuda_moneda);

              data[i].total_moneda=$filter('currency')(Number(data[i].total_moneda), '');
              data[i].abonos_moneda=$filter('currency')(Number(data[i].abonos_moneda), '');
              data[i].deuda_moneda=$filter('currency')(Number(data[i].deuda_moneda), '');
            }

            totalTotal=$filter('currency')(Number(totalTotal), '');
            totalAbonos=$filter('currency')(Number(totalAbonos), '');
            totalDeuda=$filter('currency')(Number(totalDeuda), '');

            return data;
          }


          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "OPERACION", dataKey: "tipo_documento_nombre"},
              {title: "Nº CONTROL", dataKey: "nro_control"},
              {title: "FECHA", dataKey: "fecha"},
              {title: "MONTO", dataKey: "total_moneda"}, 
              {title: "ABONOS", dataKey: "abonos_moneda"},
              {title: "DEUDA", dataKey: "deuda_moneda"},
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
          centerText('DETALLE DE CUENTAS POR COBRAR ('+miCotizacion.moneda_descrip+")",110);                                                

          doc.setFontSize(12);
          //centerText(_desde+  ' - ' +_hasta,130);

          doc.text(vm.activeItem.nombre,40,156);                                                
          doc.setFontSize(9);
          doc.text(vm.activeItem.rif,40,170);


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
                      fecha: {columnWidth: 80, halign: 'left'},
                      total_moneda: {columnWidth: 120, halign: 'right'},
                      abonos_moneda: {columnWidth: 120, halign: 'right'},
                      deuda_moneda: {columnWidth: 120, halign: 'right'},
                  },
                  drawRow: function (row, data) {
                      if (data.row.index === data.table.rows.length - 1) {
                          var miY=doc.internal.pageSize.width-data.settings.margin.right;
                          //doc.line(data.settings.margin.left, data.row.y +30, miY, data.row.y +30); // line, line, bezier curve, line
                          doc.setFontSize(9);
                          doc.text("Totales: ", data.settings.margin.left, data.row.y+35);
                          doc.text(totalTotal, 506 - (doc.getStringUnitWidth(totalTotal) * doc.internal.getFontSize() ), data.row.y+35);
                          doc.text(totalAbonos, 626 - (doc.getStringUnitWidth(totalAbonos) * doc.internal.getFontSize() ), data.row.y+35);
                          doc.text(totalDeuda, 746 - (doc.getStringUnitWidth(totalDeuda) * doc.internal.getFontSize() ), data.row.y+35);
                      }
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
    /****************************************************** DEUDAS DETALLE ******************************************************/
    /*********************************************************************************************************************************/
    function repPagosDetalle (){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        idCliente:vm.activeItem.id,
        desde:vm.desde,
        hasta:vm.hasta
      }

      console.log(obj)

      repVentasService.getPagosDetalle(obj).then(function(res){
        console.log(res)
        var totalPagos=0;
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;


          //DO ROWS
          var doRows = function(data){
            var numero=0;
            totalPagos=0;
            for (var i = 0; i < data.length; i++) {
              numero+=1;
              data[i].numero=numero;

              data[i].fecha=new Date(data[i].fecha);
              data[i].fecha=$filter('date')(data[i].fecha, 'dd/MM/yyyy');

              totalPagos+=Number(data[i].monto_moneda);

              data[i].factor=$filter('currency')(Number(data[i].factor), '');
              data[i].monto_moneda=$filter('currency')(Number(data[i].monto_moneda), '');
            }

            totalPagos=$filter('currency')(Number(totalPagos), '');

            return data;
          }


          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "FECHA PAGO", dataKey: "fecha"},
              {title: "OPERACION", dataKey: "tipo_operacion_nombre"},
              {title: "Nº CONTROL", dataKey: "nro_control"},
              {title: "INSTRUMENTO", dataKey: "instrumento_nombre"},
              {title: "Nº REFERENCIA", dataKey: "numero_operacion"},
              {title: "MONEDA", dataKey: "moneda_descrip"},
              {title: "TASA", dataKey: "factor"},
              {title: "MONTO", dataKey: "monto_moneda"}, 
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
          centerText('DETALLE DE PAGOS RECIBIDOS',110);                                                

          doc.setFontSize(12);
          centerText(_desde+  ' - ' +_hasta,130);

          doc.text(vm.activeItem.nombre,40,156);                                                
          doc.setFontSize(9);
          doc.text(vm.activeItem.rif,40,170);


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
                      fecha: {columnWidth: 80, halign: 'left'},
                      numero_operacion: {columnWidth: 90, halign: 'left'},
                      moneda_descrip: {columnWidth: 50, halign: 'left'},
                      factor: {columnWidth: 60, halign: 'right'},
                      monto_moneda: {columnWidth: 100, halign: 'right'},
                  },
                  
                  drawRow: function (row, data) {
                      if (data.row.index === data.table.rows.length - 1) {
                          var miY=doc.internal.pageSize.width-data.settings.margin.right;
                          doc.setFontSize(9);
                          doc.text("Total: ", data.settings.margin.left, data.row.y+35);
                          doc.text(totalPagos, 746 - (doc.getStringUnitWidth(totalPagos) * doc.internal.getFontSize() ), data.row.y+35);
                      }
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