(function(){
  'use strict';

  angular.module("reportesModule")
  .controller("inventarioReportesController", inventarioReportesController);
  inventarioReportesController.$inject=['$rootScope', '$scope', '$filter', '$state', '$mdDialog', 'uiGridConstants', 'repInventariosService', 'invCategoriasService', 'CONFIG'];

  function inventarioReportesController($rootScope, $scope, $filter, $state, $mdDialog, uiGridConstants, repInventariosService, invCategoriasService, CONFIG){
    var logUser=JSON.parse(sessionStorage.getItem("logUser"));
    var logEmpresa=JSON.parse(sessionStorage.getItem("empresa"));
    var factor=sessionStorage.getItem("valorCotizacion");

    var vm=this;
    vm.filtro="";
    vm.idReporte="1";
    vm.idCategoria="x";
    vm.listaCategorias=[];
    vm.listaProductos=[];
    vm.activeItem={};

    vm.btnImprimir=true;
    vm.usa_fecha=false;
    vm.usa_productos=false;

    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    vm.desde= d;
    vm.hasta= new Date();


    var lista=[];
    var _listaCategorias=[];
    var _listaProductos=[];

    var _oneCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));

    $scope.$watch('$root.factor', function() {
        _oneCotizacion=JSON.parse(sessionStorage.getItem("oneCotizacion"));
        console.log(_oneCotizacion)
    });

    
    activate();

    function activate(){
      Pace.restart();
      //CATEGORIAS
      invCategoriasService.getList(logUser.id_empresa).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaCategorias=res.data.response.datos;
          vm.listaCategorias=_listaCategorias;
        }
      })

    }

    vm.filtrar = function() {
      vm.listaProductos = $filter('multiFiltro')(_listaProductos, vm.filtro);
    };
    
    vm.selItem=function(item,event){
      vm.activeItem=item;
      if(vm.activeItem)vm.btnImprimir=true;
    }

    vm.getProductos=function(){
      console.log('called getProductos')
      if (vm.usa_productos) vm.btnImprimir=false;
      var idCategoria="";
      if (vm.idCategoria!="TODAS"){
        idCategoria=vm.idCategoria;
      }
      if (idCategoria=='x')idCategoria=""
      console.log('idCategoria',idCategoria)
      repInventariosService.getList(logUser.id_empresa,idCategoria).then(function(res){
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          _listaProductos=res.data.response.datos;
          vm.filtrar();
        }
      })

    }

    vm.selOptReport=function(){
      switch (vm.idReporte){
        case '1':
          //LISTA EXISTENCIAS
          vm.usa_fecha=false;
          vm.usa_productos=false;
          vm.btnImprimir=true;
          break;
        case '2':
          //LISTA PRECIOS    
          vm.usa_fecha=false;
          vm.usa_productos=false;
          vm.btnImprimir=true;
          break;
        case '3':
          //MOVIMIENTOS RESUMEN
          vm.usa_fecha=true;
          vm.usa_productos=false;
          vm.btnImprimir=true;
          break;
        case '4':
          //MOVIMIENTOS DETALLE
          vm.usa_fecha=true;
          vm.usa_productos=true;
          vm.btnImprimir=false;
          vm.getProductos();
          break;
        case '5':
          //LISTA INVENTARIO MONETARIO    
          vm.usa_fecha=false;
          vm.usa_productos=false;
          vm.btnImprimir=true;
          break;                  
      }
    }

    vm.selectReport = function() {
      //vm.gridOptions.data = $filter('multiFiltro')(lista, vm.filtro);
      switch (vm.idReporte){
        case '1': //EXISTENCIA
          var colDefinition = [
              {title: "Nº", dataKey: "numero"},
              {title: "CODIGO", dataKey: "codigo"},
              {title: "DESCRIPCION", dataKey: "nombre"}, 
              {title: "UNIDAD", dataKey: "unidad_nombre"},
              {title: "EXISTENCIA", dataKey: "existencia"},
          ];
          var columnStyles= {
                      numero: {columnWidth: 25, halign: 'right'},
                      codigo: {columnWidth: 50, halign: 'left'},
                      unidad_nombre: {columnWidth: 50, halign: 'left'},
                      existencia: {columnWidth: 70, halign: 'right'},
                  };
          repLista("Inventario de Productos", colDefinition, columnStyles);
          break;
        case '2': //PRECIOS
          var colDefinition = [
              {title: "Nº", dataKey: "numero"},
              {title: "CODIGO", dataKey: "codigo"},
              {title: "DESCRIPCION", dataKey: "nombre"}, 
              {title: "UNIDAD", dataKey: "unidad_nombre"},
              {title: "PRECIO", dataKey: "precio"},
          ];
          var columnStyles= {
                      numero: {columnWidth: 25, halign: 'right'},
                      codigo: {columnWidth: 50, halign: 'left'},
                      unidad_nombre: {columnWidth: 50, halign: 'left'},
                      precio: {columnWidth: 70, halign: 'right'},
                  };
          repLista("Lista de Precios ("+_oneCotizacion.moneda_descrip+")", colDefinition, columnStyles);
          //repPrecios();        
          break;
        case '3':
        console.log("tiene q ser este")
          repMovimientosResumen();
          break;        
        case '4':
          repMovimientosDetalle();
          break;                
        case '5': //INVENTARIO MONETARIO
          var colDefinition = [
              {title: "Nº", dataKey: "numero"},
              {title: "CODIGO", dataKey: "codigo"},
              {title: "DESCRIPCION", dataKey: "nombre"}, 
              {title: "UNIDAD", dataKey: "unidad_nombre"},
              {title: "EXISTENCIA", dataKey: "existencia"},
              {title: "MONTO", dataKey: "monto"},
          ];
          var columnStyles= {
                      numero: {columnWidth: 25, halign: 'right'},
                      codigo: {columnWidth: 50, halign: 'left'},
                      unidad_nombre: {columnWidth: 50, halign: 'left'},
                      existencia: {columnWidth: 70, halign: 'right'},
                      monto: {columnWidth: 70, halign: 'right'},
                  };
          repLista("Inventario Monetario ("+_oneCotizacion.moneda_descrip+")", colDefinition, columnStyles);
          //repInventarioMonetario();
          break;                
      }  
    };



    /*********************************************************************************************************************************/
    /********************************************************** LISTAS **********************************************************/
    /*********************************************************************************************************************************/
    function repLista(title, _colDef, _columnStyles ){
      vm.full=false;

      //INICIALIZADORES
      var _factor=1;
      _factor=$rootScope.factor;

      var idCat="";
      if (vm.idCategoria!='x') idCat=vm.idCategoria;

      //CONFIGURAR COLUMNAS

      var columns=_colDef;
      var rows=[];
      var totales={};

      var doc = new jsPDF('p', 'pt', 'letter');

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
        var miCat=0;
        var _datos=[];

        for (var i = 0; i < data.length; i++) {
          //REINICIA NRO EN CATEGORIA
          if (miCat!==data[i]["id_categoria"]){
            miCat=data[i]["id_categoria"];
            var numero=0;
          }
          var _fila={};

          numero+=1;
          var _costo=data[i].costo*_factor;
          var _precio=data[i].precio*_factor;
          var _monto=(data[i].existencia*_precio);

          _fila.numero=numero;
          _fila.id_categoria=data[i]["id_categoria"]
          _fila.categoria_nombre=data[i]["categoria_nombre"]
          _fila.codigo=data[i].codigo;
          _fila.nombre=data[i].nombre;
          _fila.unidad_nombre=data[i].unidad_nombre;
          _fila.existencia=$filter('currency')(Number(data[i].existencia),'');
          _fila.costo=$filter('currency')(Number(_costo),'');
          _fila.precio=$filter('currency')(Number(_precio),'');
          _fila.monto=$filter('currency')(Number(_monto),'');

          _datos.push(_fila);
        }

        return _datos;
      }

      var pageContent = function () {
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

        doc.setFontSize(14);
        centerText(title,110);                                                

        doc.setFontSize(10);

      }

      repInventariosService.getList(logUser.id_empresa,idCat).then(function(res){
        console.log('res repInventariosService',res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;

          var totalPagesExp = "{total_pages_count_string}";
          var topT=200;
          doc.setFontSize(10);

          rows = doRows(lista);

          // CONTENIDO ***************************************************************************************************
          var miCategoria=0;
          var miY=0;
          doc.autoTable.previous=false;
          for (var i = 0; i < rows.length; i++) {
            if (miCategoria!==rows[i]["id_categoria"]){
              miCategoria=rows[i]["id_categoria"];

              var filtroLista={};
              filtroLista.id_categoria=rows[i]["id_categoria"];           
              var filas = $filter('filter')(rows, filtroLista, true);

              //SEPARADOR DE TABLA CATEGORIA
              doc.setFontSize(12);
              if (!doc.autoTable.previous){
                miY=150;
                doc.text(40, miY, rows[i]["categoria_nombre"])
              } else {
                miY=doc.autoTable.previous.finalY + 30;
                doc.text(40, miY, rows[i]["categoria_nombre"])                  
              }

              doc.autoTable(columns, filas, {
                  addPageContent: pageContent,
                  startY: miY + 15,
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
                  columnStyles: _columnStyles
              });
            }   
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
    /**************************************************** MOVIMIENTO RESUMEN *********************************************************/
    /*********************************************************************************************************************************/
    function repMovimientosResumen(){
      console.log("REPORTE RESUMEN MOVIMIENTOS");
      var idCat="";
      if (vm.idCategoria!='x') idCat=vm.idCategoria;
      var obj={
        idEmpresa:logUser.id_empresa,
        idCategoria:idCat,
        desde:vm.desde,
        hasta:vm.hasta
      }

      vm.full=false;
      console.log('Envio peticion: ',obj)
      repInventariosService.getMovimientosResumen(obj).then(function(res){
        //console.log('res getMovimientosResumen',res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          lista=res.data.response.datos;
          //DO ROWS
          var doRows = function(data){
            var miCat=0;
            for (var i = 0; i < data.length; i++) {

              if (miCat!==data[i]["id_categoria"]){
                miCat=data[i]["id_categoria"];
                var numero=0;
              }

                numero+=1;
                data[i].numero=numero;
                //data[i].precio_venta_final=$filter('currency')(Number(data[i].precio_venta_final), '');
                data[i].total_entrada=$filter('number')(data[i].total_entrada, 2);
                data[i].total_neutro=$filter('number')(data[i].total_neutro, 2);
                data[i].total_salida=$filter('number')(data[i].total_salida, 2);
            }

            return data;
          }


          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "CODIGO", dataKey: "producto_codigo"},
              {title: "DESCRIPCION", dataKey: "producto_nombre"}, 
              {title: "UNIDAD", dataKey: "producto_unidad"},
              {title: "ENTRADA", dataKey: "total_entrada"},
              {title: "NEUTRO", dataKey: "total_neutro"},
              {title: "SALIDA", dataKey: "total_salida"},
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
          centerText('RESUMEN DE MOVIMIENTOS',110);    

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
          var miCategoria=0;
          var miY=0;
          doc.autoTable.previous=false;
          for (var i = 0; i < rows.length; i++) {
            if (miCategoria!==rows[i]["id_categoria"]){
              miCategoria=rows[i]["id_categoria"];

              var filtroLista={};
              filtroLista.id_categoria=rows[i]["id_categoria"];           
              var filas = $filter('filter')(rows, filtroLista, true);

              //SEPARADOR DE TABLA CATEGORIA
              doc.setFontSize(12);
              if (!doc.autoTable.previous){
                miY=150;
                doc.text(40, miY, rows[i]["categoria_nombre"])
              } else {
                miY=doc.autoTable.previous.finalY + 30;
                doc.text(40, miY, rows[i]["categoria_nombre"])                  
              }

              doc.autoTable(columns, filas, {
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
                      producto_codigo: {columnWidth: 70, halign: 'left'},
                      producto_unidad: {columnWidth: 60, halign: 'left'},
                      total_entrada: {columnWidth: 70, halign: 'right'},
                      total_neutro: {columnWidth: 70, halign: 'right'},
                      total_salida: {columnWidth: 70, halign: 'right'},
                  },
              });
            }   
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
    /****************************************************** MOVIMIENTO DETALLADO *****************************************************/
    /*********************************************************************************************************************************/
    function repMovimientosDetalle(){
      var obj={
        idEmpresa:logEmpresa.id,
        idProducto:vm.activeItem.id,
        desde:vm.desde,
        hasta:vm.hasta
      }

      vm.full=false;

      repInventariosService.getMovimientosDetalle(obj).then(function(res){
        console.log('res getMovimientosDetalle', res)
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

                
                data[i].total_entrada=$filter('number')(data[i].total_entrada, 2);
                data[i].total_neutro=$filter('number')(data[i].total_neutro, 2);
                data[i].total_salida=$filter('number')(data[i].total_salida, 2);
            }

            return data;
          }

          

          //CONFIGURAR COLUMNAS
          var columns = [
              {title: "Nº", dataKey: "numero"},
              {title: "FECHA", dataKey: "fecha"},
              {title: "TIPO", dataKey: "tipo_nombre"},
              {title: "OPERACION", dataKey: "operacion_nombre"}, 
              {title: "Nº CONTROL", dataKey: "nro_control"},
              {title: "ENTRADA", dataKey: "total_entrada"},
              {title: "NEUTRO", dataKey: "total_neutro"},
              {title: "SALIDA", dataKey: "total_salida"},
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
          doc.setTextColor(0,0,0);
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
          centerText('RESUMEN DE MOVIMIENTOS',100);    

          doc.setFontSize(12);
          centerText(_desde+  ' - ' +_hasta,115);

          doc.setFontSize(12);
          doc.text(vm.activeItem.nombre,40,136);                                                
          doc.setFontSize(9);
          doc.text(vm.activeItem.unidad_nombre,40,148);
          doc.text(vm.activeItem.codigo,40,160);


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
                      fecha: {columnWidth: 70, halign: 'left'},
                      tipo: {columnWidth: 70, halign: 'left'},
                      operacion: {columnWidth: 70, halign: 'left'},
                      nro_control: {columnWidth: 70, halign: 'left'},
                      total_entrada: {columnWidth: 70, halign: 'right'},
                      total_neutro: {columnWidth: 70, halign: 'right'},
                      total_salida: {columnWidth: 70, halign: 'right'},
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