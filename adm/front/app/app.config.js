(function (){
	'use strict';
	
	angular.module('myApp')

	.config(["$provide", "$stateProvider","$urlRouterProvider","$stickyStateProvider", "jwtInterceptorProvider", '$httpProvider','IdleProvider', 'TitleProvider','$ocLazyLoadProvider','$mdDateLocaleProvider', '$mdThemingProvider', function($provide, $stateProvider,$urlRouterProvider,$stickyStateProvider,jwtInterceptorProvider,$httpProvider,IdleProvider,TitleProvider,$ocLazyLoadProvider,$mdDateLocaleProvider,$mdThemingProvider){
		

		$mdThemingProvider.theme('ara')
		    .primaryPalette('deep-orange')
		    .accentPalette('yellow')
		    .warnPalette('red')
		    .backgroundPalette('grey');
		$mdThemingProvider.setDefaultTheme('ara');

		/************** GRID OPTIONS *************/
		$provide.decorator('GridOptions', [ '$delegate', function($delegate){
		    var gridOptions;
		    gridOptions = angular.copy($delegate);
		    gridOptions.initialize = function(options) {
		      var initOptions;
		      initOptions = $delegate.initialize(options);
		      initOptions.enableColumnMenus = false;
		      initOptions.enableSorting= false;
		      initOptions.showColumnFooter= false;
	  		  initOptions.showGridFooter= false;      
	  		  initOptions.noUnselect=true;
		      initOptions.enableRowSelection= true;
		      initOptions.enableRowHeaderSelection= false;
		      initOptions.enableAutoResizing= true;
		      initOptions.enableexpandAll= false;
		      initOptions.selectionRowHeaderWidth= 50;
		      initOptions.multiSelect= false;
		      initOptions.rowHeight=50;
		      initOptions.enableHorizontalScrollbar=0;
		      initOptions.enableVerticalScrollbar=1;

		      return initOptions;
		    };
		    return gridOptions;
		}]);

		/************** $mdDateLocaleProvider *************/
		$mdDateLocaleProvider.formatDate = function(date) {
			var d = new Date(date),
			    month = '' + (d.getMonth() + 1),
			    day = '' + d.getDate(),
			    year = d.getFullYear();

			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;

			var miD=[day, month, year].join('/');
			return miD;
		};
		
        //$ocLazyLoadProvider.config({debug:true});
		/******** IDLE PROVIDER *********/
        IdleProvider.idle(60 * 10);
        IdleProvider.timeout(15);
        TitleProvider.enabled(false);


        /*********** HTTP PROVIDER ***************/
		$httpProvider.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";
		jwtInterceptorProvider.tokenGetter=function(){
			return localStorage.getItem("token");
		};
		$httpProvider.interceptors.push('jwtInterceptor');

		//BY TIMEOUT
		$httpProvider.interceptors.push(function ($q, $injector) {
		    var incrementalTimeout = 1000;

		    function retryRequest (httpConfig) {
		        var $timeout = $injector.get('$timeout');
		        var thisTimeout = incrementalTimeout;
		        incrementalTimeout *= 2;
		        return $timeout(function() {
		            var $http = $injector.get('$http');
		            return $http(httpConfig);
		        }, thisTimeout);
		    };

		    return {
		        responseError: function (response) {
		            if (response.status === 500) {
		                if (incrementalTimeout < 5000) {
		                    return retryRequest(response.config);
		                }
		                else {
		                    alert('The remote server seems to be busy at the moment. Please try again in 5 minutes');
		                }
		            }
		            else {
		                incrementalTimeout = 1000;
		            }
		            return $q.reject(response);
		        }
		    };
		});

        /*********** STATE PROVIDER ***************/
		$urlRouterProvider.otherwise("/login");
		//$stickyStateProvider.enableDebug(true);

		$stateProvider
		/******** LOGIN *******/
	    .state('login', {
	      url: "/login",
	      authorization: false,
	      onEnter: [ '$stateParams', '$state', '$mdDialog', function($stateParams, $state, $mdDialog) {
	        $mdDialog.show({
	        	controller: 'loginController',
	          	controllerAs: 'ctrl',
	          	templateUrl: 'front/app/common/login/login.tpl.html',
	          	fullscreen:true,
	          	parent: angular.element(document.body),
	          	clickOutsideToClose:false
	        });
	      }],
	      resolve: {
	        loginLoad: ['$ocLazyLoad', function($ocLazyLoad){
	          return $ocLazyLoad.load([
	          								{
				          						name: 'listasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/listas.mdl.js",
								              			"front/app/common/services/lst-cotizaciones.srv.js",
													   ]
											},
								            {
								              name: "loginModule",
								              serie:true,
								              files: [
								              			"front/app/common/modules/sistema.mdl.js",
								              			"front/app/common/services/sis-login.srv.js",
								              			"front/app/common/services/sis-usuarios.srv.js",
								              			"front/app/common/services/sis-empresas.srv.js",
								              			"front/app/common/login/login.ctrl.js"
								              			]
								            },
	          	]

	          );
	        }]
	      }
	    })

	    /*
	    .state('signup', {
	      url: "/signup",
	      authorization: false,
	      onEnter: [ '$stateParams', '$state', '$mdDialog',function($stateParams, $state, $mdDialog) {
	        $mdDialog.show({
	        	controller: 'usuariosSignupController',
	          	controllerAs: 'ctrl',
	          	templateUrl: 'front/app/core/listas/usuarios/usuarios.signup.tpl.html',
	          	parent: angular.element(document.body),
	          	clickOutsideToClose:false
	        })
	        .then(function(){
		       	$state.go('login');
		   	}, function(){
		       	$state.go('login');
		   	});
	      }],
	      resolve: {
	        signupLoad: [ '$ocLazyLoad',function($ocLazyLoad){
	          return $ocLazyLoad.load([
			          					{
			          						name: 'usuariosModule',
			          						serie:true,
			          						files:[	
							              			"front/app/common/modules/usuarios.mdl.js",
							              			"front/app/common/services/usuarios.srv.js",
												    "front/app/core/listas/usuarios/usuarios.signup.ctrl.js"
												   ]
										}
									]
	          );
	        }]
	      }
	    })
		*/
	
	    .state('profile', {
	      url: "/profile",
	      authorization: true,
	      onEnter: [ '$stateParams', '$state', '$mdDialog',function($stateParams, $state, $mdDialog) {
	        $mdDialog.show({
	        	controller: 'usuariosDetailController',
	          	controllerAs: 'ctrl',
	          	templateUrl: 'front/app/core/listas/usuarios/usuarios.detail.tpl.html',
	          	parent: angular.element(document.body),
	          	clickOutsideToClose:false
	        })
	        .then(function(){
		       	$state.go('login');
		   	}, function(){
		       	$state.go('login');
		   	});
	      }],
	      resolve: {
	        signupLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
	          return $ocLazyLoad.load([
			          					{
			          						name: 'usuariosModule',
			          						serie:true,
			          						files:[	
							              			"front/app/common/modules/sistema.mdl.js",
							              			"front/app/common/services/sis-usuarios.srv.js",
												    "front/app/core/listas/usuarios/usuarios.detail.ctrl.js"
												   ]
										}
									]
	          );
	        }]
	      }
	    })	    


	    /******************************************************************************************************************/	    	    
	    /***** APP ********************************************************************************************************/	    
	    /******************************************************************************************************************/

	    /***** MENU ********************************************************************************************************/
	   	.state('menu',{
			abstract:true,
			url:"/",
			templateUrl:"front/app/common/menu/menu.tpl.html",
			controller:"menuController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Inversiones ARA'
	        },			
			resolve:{
		        menuLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
			          						{
			          							name: 'menuModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-usuarios.srv.js",												    	
												    	"front/app/common/services/sis-empresas.srv.js",
												    	"front/app/common/services/sis-menu.srv.js",
												    	"front/app/common/menu/menu.ctrl.js"]
					          				},

					]);
		        }]
			}
		})		

	    /***** CONFIG ******************************************************************************************************/
	   	.state('config',{
			abstract:true,
			url:"/config",
			templateUrl:"front/app/common/config/config.tpl.html",
			controller:"configController",
			controllerAs:"ctrl",
			resolve:{
		        menuLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
			          						{
			          							name: 'configModule',
				          						serie:true,
				          						files:[	"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/config/config.ctrl.js"]
					          				}

					]);
		        }]
			}
		})		


		.state('config.listas-menu-lista',{
			url:'menu',
			templateUrl:'front/app/core/listas/menu/menu.lista.tpl.html',
			controller:"menuListaController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Configuración de Menú'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'menuModule',
				          						serie:true,
				          						files:[	
			          								"front/app/common/modules/sistema.mdl.js",
											    	"front/app/common/services/sis-menu.srv.js",
				          							"front/app/core/listas/menu/menu.lista.ctrl.js",			    
													"front/app/core/listas/menu/menu.detail.ctrl.js"
													]
											}		              	
					]);
		        }]
			}
		})

		.state('config.listas-operaciones-lista',{
			url:'operaciones',
			templateUrl:'front/app/core/listas/operaciones/operaciones.lista.tpl.html',
			controller:"operacionesListaController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Configuración de operaciones'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'menuModule',
				          						serie:true,
				          						files:[	
			          								"front/app/common/modules/sistema.mdl.js",
												    "front/app/common/services/sis-listas.srv.js",
											    	"front/app/common/services/sis-operaciones.srv.js",
				          							"front/app/core/listas/operaciones/operaciones.lista.ctrl.js",			    
													"front/app/core/listas/operaciones/operaciones.detail.ctrl.js"
													]
											}		              	
					]);
		        }]
			}
		})


		/***** DASHBOARD **************************************************************************************************/
	    .state('menu.dashboard', {
	      	url: "inicio",
			templateUrl:'front/app/common/dashboard/dashboard.tpl.html',
			controller:"dashboardController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Inversiones ARA'
	        },						
	      	resolve: {
		        loginLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		            						{
				          						name: 'listasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/listas.mdl.js",
								              			"front/app/common/services/lst-cotizaciones.srv.js",
													   ]
											},
								            {
								              	name: "dashboardModule",
						  						serie:true,		              
								              	files: [
														"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-dashboard.srv.js",
										              	"front/app/common/dashboard/dashboard.ctrl.js"
								              	]
								            }

		          ]);
	        	}]
	      	}
	    })



		/******************************************************************************************************************/	    	    
	    /***** INVENTARIO ************************************************************************************************/	    
	    /******************************************************************************************************************/

		/***** CATEGORIAS ************************************************************************************************/	    	    
		.state('menu.inventario-categorias-list',{
			url:'categorias',
			templateUrl:'front/app/core/inventario/categorias/categorias.list.tpl.html',
			controller:"categoriasListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Categorias'
	        },			
			resolve:{
		        moduleLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'categoriasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/inventarios.mdl.js",
								              			"front/app/common/services/inv-categorias.srv.js",
													    "front/app/core/inventario/categorias/categorias.list.ctrl.js",
													    "front/app/core/inventario/categorias/categorias.detail.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		/***** PRODUCTOS ************************************************************************************************/
		.state('menu.inventario-productos-list',{
			url:'productos',
			templateUrl:'front/app/core/inventario/productos/productos.list.tpl.html',
			controller:"productosListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Productos'
	        },			
			resolve:{
		        moduleLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
											{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-listas.srv.js",
								              			"front/app/common/services/sis-impuestos.srv.js",
													   ]											
											},		              	
				          					{
				          						name: 'inventariosModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/inventarios.mdl.js",
								              			"front/app/common/services/inv-categorias.srv.js",
								              			"front/app/common/services/inv-productos.srv.js",
								              			"front/app/core/inventario/productos/productos.list.ctrl.js",
								              			"front/app/core/inventario/productos/productos.detail.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		/***** OPERACIONES *********************************************************************************************/	    	    
		.state('menu.inventario-operaciones-list',{
			url:'operaciones-inventario',
			templateUrl:'front/app/core/inventario/operaciones/inventario-operaciones.list.tpl.html',
			controller:"inventarioOperacionesListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Operaciones de Inventario'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-operaciones.srv.js",
													   ]											
											},
				          					{
				          						name: 'inventarioModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/inventarios.mdl.js",
								              			"front/app/common/services/inv-operaciones.srv.js",
													    "front/app/core/inventario/operaciones/inventario-operaciones.list.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		.state('config.inventario-operaciones-detail',{
			url:'operaciones-inventario-detalle',
			templateUrl:'front/app/core/inventario/operaciones/inventario-operaciones.detail.tpl.html',
			controller:"inventarioOperacionesDetailController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Operación de Inventario',
	            tipoOperacion: null
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-operaciones.srv.js",
												    	"front/app/common/services/sis-impuestos.srv.js",
												    	"front/app/common/services/sis-listas.srv.js",
													   ]											
											},
		          							{
			          							name: 'inventarioModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/inventarios.mdl.js",
												    	"front/app/common/services/inv-categorias.srv.js",
												    	"front/app/common/services/inv-productos.srv.js",
								              			"front/app/common/services/inv-movimientos.srv.js",
								              			"front/app/common/services/inv-operaciones.srv.js",
													    "front/app/core/inventario/operaciones/inventario-operaciones.detail.ctrl.js",
													    "front/app/core/inventario/operaciones/inventario-operaciones.selprod.ctrl.js",
													   ]											
											},
					]);
		        }]
			}
		})


		

		/***************************************************************************************************************/	    	    
	    /***** MOVIMIENTOS *********************************************************************************************/	    
	    /***************************************************************************************************************/

		/***** CARGOS-DECARGOS MAIN ************************************************************************************/	    	    
		.state('menu.movimientos-cargosdescargos-lista',{
			url:'cargos-descargos',
			templateUrl:'front/app/core/movimientos/cargosdescargos/cargosdescargos.lista.tpl.html',
			controller:"cargosdescargosListaController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Cargos/Descargos'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad', function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'sistemaModule',
				          						serie:true,
				          						files:[	
			          									"front/app/common/modules/sistema.mdl.js",
											    		"front/app/common/services/sis-operaciones.srv.js",
								              			"front/app/common/services/sis-listas.srv.js",
													]
											},
				          					{
				          						name: 'inventariosModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/inventarios.mdl.js",
								              			"front/app/common/services/inv-operaciones.srv.js",
													    "front/app/core/movimientos/cargosdescargos/cargosdescargos.lista.ctrl.js",
													    //"front/app/core/movimientos/cargosdescargos/cargosdescargos.detail.ctrl.js",
													   ]
											},


					]);
		        }]
			}
		})

		/***** CARGOS-DECARGOS DETAIL**********************************************************************************/	    	    
		.state('config.movimientos-cargosdescargos-detail',{
			url:'cargos-descargos-detalle',
			templateUrl:'front/app/core/movimientos/cargosdescargos/cargosdescargos.detail.tpl.html',
			controller:"cargosdescargosDetailController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'DETALLE',
	            listaOperaciones: null,
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad', function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'sistemaModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/sistema.mdl.js",
								              			"front/app/common/services/sis-listas.srv.js",
													   ]
											},
				          					{
				          						name: 'inventariosModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/inventarios.mdl.js",
								              			"front/app/common/services/inv-productos.srv.js",
								              			"front/app/common/services/inv-unidades.srv.js",
								              			"front/app/common/services/inv-almacenes.srv.js",
								              			"front/app/common/services/inv-movimientos.srv.js",
								              			"front/app/common/services/inv-operaciones.srv.js",
														"front/app/core/movimientos/modals/modal.inventario.ctrl.js",
													    "front/app/core/movimientos/cargosdescargos/cargosdescargos.detail.ctrl.js",
													   ]
											},


					]);
		        }]
			}
		})


	    /***************************************************************************************************************/	    	    
	    /***** CONFIGURACIONES *****************************************************************************************/	    
	    /***************************************************************************************************************/
		
		/***** AJUSTES ***************************************************************************************************/	   
		.state('menu.configuraciones-ajustes',{
			url:'ajustes',
			templateUrl:'front/app/core/configuraciones/ajustes/ajustes.tpl.html',
			controller:"ajustesController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Ajustes'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'sistemaModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/sistema.mdl.js",
								              			"front/app/common/services/sis-empresas.srv.js",
								              			"front/app/common/services/sis-listas.srv.js",
													    "front/app/core/configuraciones/ajustes/ajustes.ctrl.js",
													   ]
											},

					]);
		        }]
			}
		})
		
		/***** LISTAS ***************************************************************************************************/	   
		.state('menu.listas-listas-lista',{
			url:'listas',
			templateUrl:'front/app/core/listas/listas/listas.lista.tpl.html',
			controller:"listasListaController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Listas'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'sistemaModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/inventarios.mdl.js",
								              			"front/app/common/services/sis-listas.srv.js",
													    "front/app/core/listas/listas/listas.lista.ctrl.js",
													    "front/app/core/listas/listas/listas.detail.ctrl.js",
													   ]
											},

					]);
		        }]
			}
		})

		/***** COTIZACIONES ********************************************************************************************/	    	    
		.state('menu.listas-cotizaciones-list',{
			url:'Cotizaciones',
			templateUrl:'front/app/core/listas/cotizaciones/cotizaciones.list.tpl.html',
			controller:"cotizacionesListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Cotizaciones'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							/*{
				          						name: 'configuracionesModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/configuraciones.mdl.js",
								              			"front/app/common/services/cnf-monedas.srv.js",
													   ]
											},*/
											{
				          						name: 'sistemaModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-listas.srv.js",
													   ]
											},	
				          					{
				          						name: 'listasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/listas.mdl.js",
								              			"front/app/common/services/lst-cotizaciones.srv.js",
													    "front/app/core/listas/cotizaciones/cotizaciones.list.ctrl.js",
													    "front/app/core/listas/cotizaciones/cotizaciones.detail.ctrl.js",
													   ]
											}

					]);
		        }]
			}
		})

		/***** CUENTAS BANCARIAS ***************************************************************************************/	    	    
		.state('menu.configuraciones-cuentasbancarias-list',{
			url:'cuentas-bancarias',
			templateUrl:'front/app/core/configuraciones/cuentasbancarias/cuentasbancarias.list.tpl.html',
			controller:"cuentasbancariasListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Cuentas Bancarias'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'sistemaModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-listas.srv.js",
													   ]
											},		          	
				          					{
				          						name: 'configuracionesModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/configuraciones.mdl.js",
								              			"front/app/common/services/cnf-cuentasbancarias.srv.js",
													    "front/app/core/configuraciones/cuentasbancarias/cuentasbancarias.list.ctrl.js",
													    "front/app/core/configuraciones/cuentasbancarias/cuentasbancarias.detail.ctrl.js",
													   ]
											}

					]);
		        }]
			}
		})		

		/***** MONEDAS ***************************************************************************************/	    	    
		.state('menu.configuraciones-monedas-list',{
			url:'monedas',
			templateUrl:'front/app/core/configuraciones/monedas/monedas.list.tpl.html',
			controller:"monedasListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Monedas'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'configuracionesModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/configuraciones.mdl.js",
								              			"front/app/common/services/cnf-monedas.srv.js",
													    "front/app/core/configuraciones/monedas/monedas.list.ctrl.js",
													    "front/app/core/configuraciones/monedas/monedas.detail.ctrl.js",
													   ]
											}

					]);
		        }]
			}
		})	

	    /***************************************************************************************************************/	    	    
	    /***** SISTEMA **************************************************************************************************/	    
	    /***************************************************************************************************************/

		/***** EMPRESAS **********************************************************************************************/	    	    
		.state('menu.sistema-empresas-list',{
			url:'empresas',
			templateUrl:'front/app/core/sistema/empresas/empresas.list.tpl.html',
			controller:"empresasListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Empresas'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'sistemaModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/sistema.mdl.js",
								              			"front/app/common/services/sis-empresas.srv.js",
													    "front/app/core/sistema/empresas/empresas.list.ctrl.js",
													    "front/app/core/sistema/empresas/empresas.detail.ctrl.js",
													   ]
											}

					]);
		        }]
			}
		})

		/***** IMPUESTOS **********************************************************************************************/	    	    
		.state('menu.listas-impuestos-lista',{
			url:'impuestos',
			templateUrl:'front/app/core/listas/impuestos/impuestos.lista.tpl.html',
			controller:"impuestosListaController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Impuestos'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'sistemaModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-listas.srv.js",
								              			"front/app/common/services/sis-impuestos.srv.js",
													    "front/app/core/listas/impuestos/impuestos.lista.ctrl.js",
													    "front/app/core/listas/impuestos/impuestos.detail.ctrl.js",
													   ]
											}

					]);
		        }]
			}
		})

		/***** USUARIOS **********************************************************************************************/	    	    
		.state('menu.listas-usuarios-lista',{
			url:'usuarios',
			templateUrl:'front/app/core/listas/usuarios/usuarios.lista.tpl.html',
			controller:"usuariosListaController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Usuarios'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'sistemaModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/sistema.mdl.js",
								              			"front/app/common/services/sis-usuarios.srv.js",
								              			"front/app/common/services/sis-empresas.srv.js",
												    	"front/app/common/services/sis-menu.srv.js",
													    "front/app/core/listas/usuarios/usuarios.lista.ctrl.js",
													    "front/app/core/listas/usuarios/usuarios.permisos.ctrl.js",													    			    
													    "front/app/core/listas/usuarios/usuarios.detail.ctrl.js",
													    "front/app/core/listas/usuarios/usuarios.signup.ctrl.js"
													   ]
											},

					]);
		        }]
			}
		})

		/***** UNIDADES *************************************************************************************************/		
		.state('menu.inventario-unidades-lista',{
			url:'unidades',
			templateUrl:'front/app/core/inventario/unidades/unidades.lista.tpl.html',
			controller:"unidadesListaController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Unidades'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
											{
			          							name: 'listasModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-listas.srv.js",
													   ]											
											},		              	
				          					{
				          						name: 'unidadesModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/inventarios.mdl.js",
								              			"front/app/common/services/inv-unidades.srv.js",
													    "front/app/core/inventario/unidades/unidades.lista.ctrl.js",
													    "front/app/core/inventario/unidades/unidades.detail.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		/****************************************************************************************************************/	    	    
	    /***** COMPRAS *************************************************************************************************/	    
	    /***************************************************************************************************************/

		/***** PROVEEDORES **********************************************************************************************/	    	    
		.state('menu.compras-proveedores-list',{
			url:'proveedores',
			templateUrl:'front/app/core/compras/proveedores/proveedores.list.tpl.html',
			controller:"proveedoresListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Proveedores'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'comprasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/compras.mdl.js",
								              			"front/app/common/services/cmp-proveedores.srv.js",
													    "front/app/core/compras/proveedores/proveedores.list.ctrl.js",
													    "front/app/core/compras/proveedores/proveedores.detail.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})


		/***** OPERACIONES *********************************************************************************************/	    	    
		.state('menu.compras-operaciones-list',{
			url:'operaciones-compras',
			templateUrl:'front/app/core/compras/operaciones/compras-operaciones.list.tpl.html',
			controller:"comprasOperacionesListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Operaciones de Compra'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-operaciones.srv.js",
													   ]											
											},
				          					{
				          						name: 'comprasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/compras.mdl.js",
								              			"front/app/common/services/cmp-operaciones.srv.js",
													    "front/app/core/compras/operaciones/compras-operaciones.list.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		.state('config.compras-operaciones-detail',{
			url:'operaciones-compras-detalle',
			templateUrl:'front/app/core/compras/operaciones/compras-operaciones.detail.tpl.html',
			controller:"comprasOperacionesDetailController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Operación de Compra',
	            tipoOperacion: null
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-operaciones.srv.js",
												    	"front/app/common/services/sis-impuestos.srv.js",
												    	"front/app/common/services/sis-listas.srv.js",
													   ]											
											},
		          							{
			          							name: 'inventarioModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/inventarios.mdl.js",
												    	"front/app/common/services/inv-categorias.srv.js",
												    	"front/app/common/services/inv-productos.srv.js",
								              			"front/app/common/services/inv-movimientos.srv.js",
													   ]											
											},
				          					{
				          						name: 'comprasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/compras.mdl.js",
								              			"front/app/common/services/cmp-proveedores.srv.js",
								              			"front/app/common/services/cmp-operaciones.srv.js",
													    "front/app/core/compras/operaciones/compras-operaciones.detail.ctrl.js",
													    "front/app/core/compras/operaciones/compras-operaciones.selprod.ctrl.js",
													    "front/app/core/compras/proveedores/proveedores.detail.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		/***************************************************************************************************************/	    	    
	    /***** VENTAS *************************************************************************************************/	    
	    /**************************************************************************************************************/

		/***** CLIENTES ***********************************************************************************************/	    	    
		.state('menu.ventas-clientes-list',{
			url:'clientes',
			templateUrl:'front/app/core/ventas/clientes/clientes.list.tpl.html',
			controller:"clientesListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Clientes'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'ventasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/ventas.mdl.js",
								              			"front/app/common/services/vnt-clientes.srv.js",
													    "front/app/core/ventas/clientes/clientes.list.ctrl.js",
													    "front/app/core/ventas/clientes/clientes.detail.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		.state('config.ventas-clientes-deudas',{
			url:'clientes-deudas',
			templateUrl:'front/app/core/ventas/clientes/clientes.deudas.tpl.html',
			controller:"clientesDeudasController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Estado de Cuenta'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-operaciones.srv.js",
												    	"front/app/common/services/sis-impuestos.srv.js",
												    	"front/app/common/services/sis-listas.srv.js",
													   ]											
											},
				          					{
				          						name: 'ventasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/ventas.mdl.js",
								              			"front/app/common/services/vnt-clientes.srv.js",
								              			"front/app/common/services/vnt-operaciones.srv.js",
													    /*"front/app/core/ventas/operaciones/ventas-operaciones.detail.ctrl.js",
														"front/app/core/ventas/operaciones/ventas-operaciones.selprod.ctrl.js",*/													    
								              			"front/app/core/ventas/clientes/clientes.deudas.ctrl.js",
								              			"front/app/core/ventas/clientes/clientes.abonos.ctrl.js",
													   ]
											},
											{
			          							name: 'cajaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/caja.mdl.js",
												    	"front/app/common/services/caj-movimientos.srv.js",
														"front/app/core/caja/movimientos/caj-movimientos.modal.ctrl.js",													    
													   ]											
											},											
											{
			          							name: 'configuracionesModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/configuraciones.mdl.js",
												    	"front/app/common/services/cnf-cuentasbancarias.srv.js",
													   ]											
											},																						
					]);
		        }]
			}
		})


		/***** OPERACIONES *******************************************************************************************/	    
		.state('menu.ventas-operaciones-list',{
			url:'operaciones-ventas',
			templateUrl:'front/app/core/ventas/operaciones/ventas-operaciones.list.tpl.html',
			controller:"ventasOperacionesListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Operaciones de Ventas'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-operaciones.srv.js",
													   ]											
											},
				          					{
				          						name: 'ventasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/ventas.mdl.js",
								              			"front/app/common/services/vnt-operaciones.srv.js",
													    "front/app/core/ventas/operaciones/ventas-operaciones.list.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		.state('config.ventas-operaciones-detail',{
			url:'operaciones-ventas-detalle',
			templateUrl:'front/app/core/ventas/operaciones/ventas-operaciones.detail.tpl.html',
			controller:"ventasOperacionesDetailController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Operación de Venta'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-operaciones.srv.js",
												    	"front/app/common/services/sis-impuestos.srv.js",
												    	"front/app/common/services/sis-listas.srv.js",
													   ]											
											},
		          							{
			          							name: 'inventarioModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/inventarios.mdl.js",
												    	"front/app/common/services/inv-categorias.srv.js",
												    	"front/app/common/services/inv-productos.srv.js",
								              			"front/app/common/services/inv-movimientos.srv.js",
													   ]											
											},
				          					{
				          						name: 'ventasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/ventas.mdl.js",
								              			"front/app/common/services/vnt-clientes.srv.js",
								              			"front/app/common/services/vnt-operaciones.srv.js",
													    "front/app/core/ventas/operaciones/ventas-operaciones.detail.ctrl.js",
														"front/app/core/ventas/operaciones/ventas-operaciones.selprod.ctrl.js",													    
								              			"front/app/core/ventas/clientes/clientes.detail.ctrl.js",
													   ]
											},
											{
			          							name: 'cajaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/caja.mdl.js",
												    	"front/app/common/services/caj-movimientos.srv.js",
														"front/app/core/caja/movimientos/caj-movimientos.modal.ctrl.js",													    
													   ]											
											},											
											{
			          							name: 'configuracionesModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/configuraciones.mdl.js",
												    	"front/app/common/services/cnf-cuentasbancarias.srv.js",
													   ]											
											},																						
					]);
		        }]
			}
		})
		/*	    
		*/

		/*****************************************************/	    	    
	    /**************** CAJA ************************/	    
	    /*****************************************************/

		/******** OPERACIONES *******/	    
		.state('menu.caja-operaciones-list',{
			url:'operaciones-caja',
			templateUrl:'front/app/core/caja/operaciones/caja-operaciones.list.tpl.html',
			controller:"cajaOperacionesListController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Operaciones de Caja'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'configuracionesModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/configuraciones.mdl.js",
												    	"front/app/common/services/cnf-cuentasbancarias.srv.js",
													   ]											
											},		          	
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-operaciones.srv.js",
												    	"front/app/common/services/sis-listas.srv.js",
													   ]											
											},
				          					{
				          						name: 'cajaModule',
				          						serie:true,
				          						files:[					          						
								              			"front/app/common/modules/caja.mdl.js",
								              			"front/app/common/services/caj-operaciones.srv.js",
								              			"front/app/common/services/caj-movimientos.srv.js",
													    "front/app/core/caja/operaciones/caja-operaciones.list.ctrl.js",
													    "front/app/core/caja/operaciones/caja-operaciones.detail.ctrl.js",

													   ]
											},
					]);
		        }]
			}
		})

		/**************************************************************************************************************/	    	    
	    /***** REPORTES **********************************************************************************************/	    
	    /**************************************************************************************************************/

		/******** INVENTARIO *******/		
		.state('menu.reportes-inventario-list',{
			url:'rep-inventario',
			templateUrl:'front/app/core/reportes/inventario/inventario.reportes.tpl.html',
			controller:"inventarioReportesController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Reportes de Inventario'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
											{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-listas.srv.js",
													   ]											
											},		              	
				          					{
				          						name: 'inventariosModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/inventarios.mdl.js",
								              			"front/app/common/services/inv-categorias.srv.js",
								              			"front/app/common/services/inv-productos.srv.js",
													   ]
											},
				          					{
				          						name: 'reportesModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/reportes.mdl.js",
								              			"front/app/common/services/rep-inventarios.srv.js",
													    "front/app/core/reportes/inventario/inventario.reportes.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		/******** COMPRAS *******/		
		.state('menu.reportes-compras-list',{
			url:'rep-compras',
			templateUrl:'front/app/core/reportes/compras/compras.reportes.tpl.html',
			controller:"comprasReportesController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Reportes de Compras'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-listas.srv.js",
												    	"front/app/common/services/sis-operaciones.srv.js",
													   ]											
											},
											{
				          						name: 'comprasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/compras.mdl.js",
								              			"front/app/common/services/cmp-proveedores.srv.js",
													   ]
											},
				          					{
				          						name: 'reportesModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/reportes.mdl.js",
								              			"front/app/common/services/rep-compras.srv.js",
													    "front/app/core/reportes/compras/compras.reportes.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		/******** VENTAS *******/		
		.state('menu.reportes-ventas-list',{
			url:'rep-ventas',
			templateUrl:'front/app/core/reportes/ventas/ventas.reportes.tpl.html',
			controller:"ventasReportesController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Reportes de Ventas'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-listas.srv.js",
												    	"front/app/common/services/sis-operaciones.srv.js",
													   ]											
											},
											{
				          						name: 'ventasModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/ventas.mdl.js",
								              			"front/app/common/services/vnt-clientes.srv.js",
													   ]
											},
				          					{
				          						name: 'reportesModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/reportes.mdl.js",
								              			"front/app/common/services/rep-ventas.srv.js",
													    "front/app/core/reportes/ventas/ventas.reportes.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		/******** CAJA *******/		
		.state('menu.reportes-caja-list',{
			url:'rep-caja',
			templateUrl:'front/app/core/reportes/caja/caja.reportes.tpl.html',
			controller:"cajaReportesController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Reportes de Caja'
	        },			
			resolve:{
		        usuariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
			          							name: 'configuracionesModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/configuraciones.mdl.js",
												    	"front/app/common/services/cnf-cuentasbancarias.srv.js",
													   ]											
											},		          	
		          							{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/modules/sistema.mdl.js",
												    	"front/app/common/services/sis-listas.srv.js",
													   ]											
											},
				          					/*{
				          						name: 'cajaModule',
				          						serie:true,
				          						files:[					          						
								              			"front/app/common/modules/caja.mdl.js",
								              			"front/app/common/services/caj-operaciones.srv.js",
								              			"front/app/common/services/caj-movimientos.srv.js",
													    "front/app/core/caja/operaciones/caja-operaciones.list.ctrl.js",
													    "front/app/core/caja/operaciones/caja-operaciones.detail.ctrl.js",

													   ]
											},*/
				          					{
				          						name: 'reportesModule',
				          						serie:true,
				          						files:[	
								              			"front/app/common/modules/reportes.mdl.js",
								              			"front/app/common/services/rep-caja.srv.js",
													    "front/app/core/reportes/caja/caja.reportes.ctrl.js",
													   ]
											},
					]);
		        }]
			}
		})

		






	}]);

})();