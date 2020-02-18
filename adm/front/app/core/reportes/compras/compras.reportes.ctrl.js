(function(){
  'use strict';

  angular.module("reportesModule")
  .controller("comprasReportesController", comprasReportesController);
  comprasReportesController.$inject=['$rootScope','$filter', '$state', '$mdDialog', 'uiGridConstants', 'repComprasService', 'sisOperacionesService', 'cmpProveedoresService', 'sisUsuariosService', 'CONFIG'];

  function comprasReportesController($rootScope, $filter, $state, $mdDialog, uiGridConstants, repComprasService, sisOperacionesService, cmpProveedoresService, sisUsuariosService, CONFIG){
    var logEmpresa=JSON.parse(sessionStorage.getItem("empresa"));
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));
    var vm=this;
    vm.filtro="";
    vm.filtroUsuario="";
    vm.idReporte="1";
    vm.idOperacion="";
    vm.listaOperaciones=[];
    vm.listaProveedores=[];
    vm.listaUsuarios=[];
    vm.activeItem={};

    vm.btnImprimir=true;
    vm.usa_fecha=false;
    vm.usa_proveedores=false;
    vm.usa_tipo=false;
    vm.usa_usuarios=false;

    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    vm.desde= d;
    vm.hasta= new Date();


    var lista=[];
    var _listaOperaciones=[];
    var _listaProveedores=[];
    var _listaUsuarios=[];

    vm.selOptReport=function(){
      switch (vm.idReporte){
        case '1':
          //OPERACIONES RESUMEN
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_proveedores=false;
          vm.usa_usuarios=false;
          break;
        case '2':
          //OPERACIONES DETALLE    
          vm.usa_tipo=true;
          vm.usa_fecha=true;
          vm.usa_proveedores=false;
          vm.usa_usuarios=false;
          break;
        case '3':
          //PROVEEDORES RESUMEN
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_proveedores=false;
          vm.usa_usuarios=false;
          break;
        case '4':
          //PROVEEDORES DETALLE
          vm.btnImprimir=false;
          vm.activeItem=null;
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_proveedores=true;
          vm.usa_usuarios=false;
          break;
        case '5':
          //COMISIONES RESUMEN
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_proveedores=false;
          vm.usa_usuarios=false;
          break;                
        case '8':
          //USUARIOS
          vm.usa_tipo=false;
          vm.usa_fecha=true;
          vm.usa_proveedores=false;
          vm.usa_usuarios=true;
          break;                                      
      }
    }

    activate();

    function activate(){
      Pace.restart();
      //OPERACIONES
      sisOperacionesService.getList('11E8F22292A5ED4B8FF600270E383B06').then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaOperaciones=res.data.response.datos;
          vm.listaOperaciones=_listaOperaciones;
        }
      })

      //PROVEEDORES
      cmpProveedoresService.getList(logUser.id_empresa).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaProveedores=res.data.response.datos;
          console.log(_listaProveedores)
          vm.filtrar();
        }
      })

      //USUARIOS
      sisUsuariosService.getList().then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaUsuarios=res.data.response.datos;
          vm.filtrarUsuarios();
        }
      })

      vm.selOptReport();
    }

    vm.filtrar = function() {
      vm.listaProveedores = $filter('multiFiltro')(_listaProveedores, vm.filtro);
    };

    vm.filtrarUsuarios = function() {
      vm.listaUsuarios = $filter('multiFiltro')(_listaUsuarios, vm.filtroUsuario);
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
        case '3': //PROVEEDORES RESUMEN
          repProveedoresResumen();
          break;        
        case '4': //PROVEEDORES DETALLE
          repProveedoresDetalle();
          break; 
        case '5': //COMISIONES RESUMEN
          repComisionesResumen();
          break;
        case '8': //USUARIOS DETALLE
          repUsuariosDetalle();
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
        idEmpresa:logUser.id_empresa,
        idMoneda:miCotizacion.id_moneda,
        desde:vm.desde,
        hasta:vm.hasta
      }
      repComprasService.getOperacionesResumen(obj).then(function(res){
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
          centerText('RESUMEN DE OPERACIONES DE COMPRA ('+miCotizacion.moneda_descrip+")",110);                                                

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

      repComprasService.getOperacionesDetalle(obj).then(function(res){
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
              data[i].monto=$filter('currency')(Number(data[i].monto), '');
              data[i].cotizacion_valor=$filter('currency')(Number(data[i].cotizacion_valor), '');
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
              {title: "PROVEEDOR", dataKey: "proveedor_nombre"},
              {title: "RIF", dataKey: "proveedor_rif"},
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
          centerText('DETALLE DE OPERACIONES DE COMPRA ('+miCotizacion.moneda_descrip+")",110);                                                

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
                      proveedor_rif: {columnWidth: 90, halign: 'left'},
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
    /**************************************************** RESUMEN PROVEEDORES ********************************************************/
    /*********************************************************************************************************************************/
    function repProveedoresResumen(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        desde:vm.desde,
        hasta:vm.hasta
      }
      repComprasService.getProveedoresResumen(obj).then(function(res){
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

          var logoA = new Image();

          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "NOMBRE", dataKey: "proveedor_nombre"},
              {title: "RIF", dataKey: "proveedor_rif"}, 
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
          centerText('RESUMEN DE OPERACIONES DE COMPRA POR PROVEEDOR',110);                                                

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
    /****************************************************** PROVEEDORES DETALLE ******************************************************/
    /*********************************************************************************************************************************/
    function repProveedoresDetalle(){
      vm.full=false;
      var miCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
      var obj={
        idEmpresa:logEmpresa.id,
        idMoneda:miCotizacion.id_moneda,
        idProveedor:vm.activeItem.id,
        desde:vm.desde,
        hasta:vm.hasta
      }


      repComprasService.getProveedoresDetalle(obj).then(function(res){
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
          centerText('DETALLE DE OPERACIONES DE COMPRA ('+miCotizacion.moneda_descrip+")",110);                                                

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
                      cotizacion_valor: {columnWidth: 80, halign: 'right'},
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
    /******************************************************** USUARIOS DETALLE *******************************************************/
    /*********************************************************************************************************************************/
    function repUsuariosDetalle(){
      vm.full=false;
      var obj={
        idEmpresa:logEmpresa.id,
        idUsuario:vm.activeItem.id,
        desde:vm.desde,
        hasta:vm.hasta
      }


      repComprasService.getUsuariosDetalle(obj).then(function(res){
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
              data[i].monto=$filter('currency')(Number(data[i].monto), '');
            }
            return data;
          }

          var logoA = new Image();

          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "OPERACION", dataKey: "operacion_nombre"},
              {title: "Nº CONTROL", dataKey: "nro_control"},
              {title: "FECHA", dataKey: "fecha"},
              {title: "CLIENTE", dataKey: "cliente_nombre"},
              {title: "RIF", dataKey: "cliente_rif"}, 
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

          
          logoA.src = 'front/assets/img/logo2.png';
          logoA.onload = function(){


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
              centerText('DETALLE DE OPERACIONES DE VENTA',110);                                                

              doc.setFontSize(12);
              centerText(_desde+  ' - ' +_hasta,130);

              doc.text(vm.activeItem.nombre,40,156);                                                
              doc.setFontSize(9);
              doc.text(vm.activeItem.cedula,40,170);


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
                          cliente_rif: {columnWidth: 80, halign: 'left'},
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
        }
      })          
    }










  }
})();