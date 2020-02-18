(function (){
	angular.module('myApp',[
		'angular-jwt',
	    'ui.router',
	    'oc.lazyLoad',
	    'ct.ui.router.extras',
	    'ngAnimate',
	    'ngMessages',
	    'ngIdle',
	    'ngMaterial',
	    'ui.grid',
	    'ui.grid.selection',
	    'ui.grid.expandable',
	    'ui.grid.autoResize',
		'ui.grid.edit',
		'ui.grid.rowEdit',
		'ui.grid.cellNav',	    	    
		])

	.constant('CONFIG',{
		'appName':'Ginit Retenciones',
		/* env:dev *#/
    		'APIURL':'http://localhost/ginit-retenciones/rest/',		
			'URL':'http://localhost/ginit-retenciones/front/',		
    	/* env:dev:end */
    	
    	/* env:prod */
     		'APIURL':'/rest/',
			'URL':'/front/',	
     	/* env:prod:end */
		
		'logUser':{},
		'logEmpresa':{},
		'idAgente':0,
	})

	.run(['$rootScope', '$state', 'CONFIG', 'jwtHelper', 'Idle', '$mdDialog', '$mdToast', function ($rootScope, $state, CONFIG, jwtHelper, Idle, $mdDialog, $mdToast) {
		$rootScope.appSeccion="";
		$rootScope.formColor="background-50";
		$rootScope.formBcolor="background-400";
		
		/*********** IDLE *********************/
		function closeWarning(){
			$mdDialog.hide();
		}
		function openWarning(){
          	$mdDialog.show({
	          	templateUrl: 'front/app/common/templates/idle-warning.tpl.html',
	          	parent: angular.element(document.body),
	          	clickOutsideToClose:false
	        });
		}

        $rootScope.$on('IdleStart', function() {
        	openWarning();
        });        

        $rootScope.$on('IdleEnd', function() {
       		closeWarning();
        });        

        $rootScope.$on('IdleTimeout', function() {
        	closeWarning();
		   	$state.go('login');
        });

        /*
		$rootScope.$on('IdleWarn', function() {
        });*/


        /************** ROUTE CHANGE ************/
		$rootScope.$on('$stateChangeStart', function(event, toState) {
		   	if (toState.name === "login") {
		      	return; // already going to login
		   	}

		   	if (toState.name === "signup") {
		      	return; // already going to signup
		   	}

		   	var token=localStorage.getItem("token");

		   	if (!token) {
		   		event.preventDefault();
		   		$state.go('login');

		   	} else {
		        //VERIFICA PERMISOS 
		   	}

		   	var bool = jwtHelper.isTokenExpired(token);
        	if(bool === true){     
        		//console.log('token expirado')
		   		event.preventDefault();        	       
        		$state.go('login');
        	} else {
        		CONFIG.logUser=jwtHelper.decodeToken(token);
        	}
		});

		$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams,CONFIG) {
			if (from.name){
				localStorage.setItem("prevState",from.name);
			}
			var obj={	
						sectionName:'nada'
					};
			if (to.params){

				obj=to.params;
			}
			$rootScope.appSeccion=obj.sectionName;
		});

		$rootScope.$state=$state;

		$rootScope.showToast =  function(texto) {
	      $mdToast.show(
	        $mdToast.simple()
	          .textContent(texto)
	          .action('CERRAR')
	          .highlightAction(true)
	          .highlightClass('md-accent')
	          .position('top right')
	      ).then(function(response) {
	          if ( response == 'ok' ) {
	            $mdToast.hide();
	          }
	      });
	    };


	}])

	.filter('optionGridDropdownFilter', function () {
		return function (input, context) {
			if (context.constructor.name!='c'){
		        var fieldLevel = (context.editDropdownOptionsArray === undefined) ? context.col.colDef : context;
		        var map = fieldLevel.editDropdownOptionsArray;
		        var idField = fieldLevel.editDropdownIdLabel;
		        var valueField = fieldLevel.editDropdownValueLabel;
		        var initial = context.row.entity[context.col.field];
		        if (typeof map !== "undefined") {
		            for (var i = 0; i < map.length; i++) {
		                if (map[i][idField] == input) {
		                    return map[i][valueField];
		                }
		            }
		        }
		        else if (initial) {
		            return initial;
		        }
		        return input;
		    }
				
		};
	})

	/* ********* DIRECTIVAS ******************* */
	/* FORMATO NUMERICO */

	.directive('formatoNumerico', ['$filter', function ($filter)  {
	  	var decimalCases = 2,
        whatToSet = function (str) {
          /**
           * TODO:
           * don't allow any non digits character, except decimal seperator character
           */
          return str ? Number(str) : '';
        },
        whatToShow = function (num) {
          return $filter('number')(num, decimalCases);
        };

        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attr, ngModel) {
            ngModel.$parsers.push(whatToSet);
            ngModel.$formatters.push(whatToShow);

            element.bind('blur', function() {
              element.val(whatToShow(ngModel.$modelValue));
            });
            element.bind('focus', function () {
              element.val(ngModel.$modelValue);
            });
          }
        };
	}])
	
	/* ********* FILTRO ******************* */
	/* MULTI FILTRO */
	.filter('multiFiltro', ['$filter', function($filter) {
	  	return function multiFiltro(items, predicates, group) {
	      predicates = predicates.split(' ');
	      if (group){
	        items=$filter('filter')(items, group, true);
	      }

	      angular.forEach(predicates, function(predicate) {
	        items = $filter('filter')(items, predicate.trim());
	      });
	      return items;
	  			
	    };
	}]);

})();
(function (){
	'use strict';
	
	angular.module('myApp')

	.config(["$provide", "$stateProvider","$urlRouterProvider","$stickyStateProvider", "jwtInterceptorProvider", '$httpProvider','IdleProvider', 'TitleProvider','$ocLazyLoadProvider','$mdDateLocaleProvider', '$mdThemingProvider', function($provide, $stateProvider,$urlRouterProvider,$stickyStateProvider,jwtInterceptorProvider,$httpProvider,IdleProvider,TitleProvider,$ocLazyLoadProvider,$mdDateLocaleProvider,$mdThemingProvider){
		

		$mdThemingProvider.theme('retenciones')
		    .primaryPalette('teal')
		    .accentPalette('deep-orange')
		    .warnPalette('red')
		    .backgroundPalette('grey');
		$mdThemingProvider.setDefaultTheme('retenciones');


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
	          	parent: angular.element(document.body),
	          	clickOutsideToClose:false
	        });
	      }],
	      resolve: {
	        loginLoad: ['$ocLazyLoad', function($ocLazyLoad){
	          return $ocLazyLoad.load([
						            {
						              name: "loginModule",
						              files: ["front/app/common/login/login.mdl.js"]
						            },
				  					{
				  						name: 'usuariosModule',
				  						serie:true,
				  						files:[	
				  								"front/app/core/listas/usuarios/usuarios.mdl.js",
												"front/app/core/listas/usuarios/usuarios.srv.js",
											   ]
									}
	          	]

	          );
	        }]
	      }
	    })


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
			          								"front/app/core/listas/usuarios/usuarios.mdl.js",
													"front/app/core/listas/usuarios/usuarios.srv.js",
												    "front/app/core/listas/usuarios/usuarios.signup.ctrl.js"
												   ]
										}
									]
	          );
	        }]
	      }
	    })


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
			          								"front/app/core/listas/usuarios/usuarios.mdl.js",
													"front/app/core/listas/usuarios/usuarios.srv.js",
												    "front/app/core/listas/usuarios/usuarios.detail.ctrl.js"
												   ]
										}
									]
	          );
	        }]
	      }
	    })	    


	    /************ CONFIG ******************/
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
				          						files:[	"front/app/common/config/config.mdl.js",
												    	"front/app/common/config/config.ctrl.js"]
					          				}

					]);
		        }]
			}
		})		


		.state('config.listas-usuarios-lista',{
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
				          						name: 'usuariosModule',
				          						serie:true,
				          						files:[	
				          								"front/app/core/listas/usuarios/usuarios.mdl.js",
														"front/app/core/listas/usuarios/usuarios.srv.js",
													    "front/app/core/listas/usuarios/usuarios.lista.ctrl.js",
													    "front/app/core/listas/usuarios/usuarios.permisos.ctrl.js",													    			    
													    "front/app/core/listas/usuarios/usuarios.detail.ctrl.js",
													    "front/app/core/listas/usuarios/usuarios.signup.ctrl.js"
													   ]
											},
				          					{
				          						name: 'agentesModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/agentes/agentes.mdl.js",
				          								"front/app/core/listas/agentes/agentes.srv.js",
														]
											},											
											{
			          							name: 'menuModule',
				          						serie:true,
				          						files:[	"front/app/common/menu/menu.mdl.js",
												    	"front/app/common/menu/menu.srv.js",
													   ]											
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
				          						files:[	"front/app/core/listas/menu/menu.lista.ctrl.js",			    
													    "front/app/core/listas/menu/menu.detail.ctrl.js"]
											}		              	
					]);
		        }]
			}
		})

	    /************ APP ******************/
	   	.state('menu',{
			abstract:true,
			url:"/",
			templateUrl:"front/app/common/menu/menu.tpl.html",
			controller:"menuController",
			controllerAs:"ctrl",
			params: {
	            sectionName: 'Retenciones'
	        },			
			resolve:{
		        menuLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
			          						{
			          							name: 'menuModule',
				          						serie:true,
				          						files:[	"front/app/common/menu/menu.mdl.js",
												    	"front/app/common/menu/menu.srv.js",
												    	"front/app/common/menu/menu.ctrl.js"]
					          				},
			          						{
			          							name: 'usuariosModule',
				          						serie:true,
				          						files:[	"front/app/core/listas/usuarios/usuarios.mdl.js",
												    	"front/app/core/listas/usuarios/usuarios.srv.js",												    	
														]
					          				},
					          				

					]);
		        }]
			}
		})		
		/******** LOGIN *******/
	    .state('menu.dashboard', {
	      	url: "inicio",
			templateUrl:'front/app/common/dashboard/dashboard.tpl.html',
			controller:"dashboardController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Retenciones'
	        },						
	      	resolve: {
		        loginLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load(
		            {
		              name: "loginModule",
		              files: ["front/app/common/dashboard/dashboard.mdl.js"]
		            }
		          );
	        	}]
	      	}
	    })


	    /*****************************************************/	    	    
	    /**************** COMPROBANTES ************************/	    
	    /*****************************************************/	    	    

	    /**************** IVA ************************/
		.state('menu.comprobantes-iva',{
			url:'comprobantes-iva',
			templateUrl:'front/app/core/comprobantes/iva/iva.lista.tpl.html',
			controller:"ivaListaController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Retenciones de IVA'
	        },						
			resolve:{
		        comprobantesiva: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'beneficiariosModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/beneficiarios/beneficiarios.mdl.js",
				          								"front/app/core/listas/beneficiarios/beneficiarios.srv.js",
													    "front/app/core/listas/beneficiarios/beneficiarios.detail.ctrl.js",
														]
											},
				          					{
				          						name: 'ivaModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/comprobantes/iva/iva.mdl.js",
				          								"front/app/core/comprobantes/iva/iva.srv.js",
													    "front/app/core/comprobantes/iva/iva.lista.ctrl.js",				          								
													    "front/app/core/comprobantes/iva/iva.detail.ctrl.js",
														]
											},		          	

					]);
		        }]
			}
		})

		.state('config.comprobantes-iva-detail',{
			url:'comprobanteiva',
			templateUrl:'front/app/core/comprobantes/iva/iva.detail.tpl.html',
			controller:"ivaDetailController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Comprobante IVA',
				catProg: null,
				beneficiarios: null,
	        },						
			resolve:{
		        comprobantesivadetail: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'listasModule',
				          						serie:true,
				          						files:[
				          								"front/app/common/listas/listas.mdl.js",
														"front/app/common/listas/listas.srv.js",
														]
											},
				          					{
				          						name: 'alicuotasModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/alicuotas/alicuotas.mdl.js",
														"front/app/core/listas/alicuotas/alicuotas.srv.js",
														]
											},		          	
				          					{
				          						name: 'beneficiariosModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/beneficiarios/beneficiarios.mdl.js",
				          								"front/app/core/listas/beneficiarios/beneficiarios.srv.js",
													    "front/app/core/listas/beneficiarios/beneficiarios.detail.ctrl.js",
														]
											},
				          					{
				          						name: 'ivaModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/comprobantes/iva/iva.mdl.js",
				          								"front/app/core/comprobantes/iva/iva.srv.js",
													    "front/app/core/comprobantes/iva/iva.detail.ctrl.js",
													    "front/app/core/comprobantes/iva/iva.modal.ctrl.js",
														]
											},		          	

					]);
		        }]
			}
		})



	    /**************** ISLR ************************/
		.state('menu.comprobantes-islr',{
			url:'comprobantes-islr',
			templateUrl:'front/app/core/comprobantes/islr/islr.lista.tpl.html',
			controller:"islrListaController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Retenciones de ISLR'
	        },						
			resolve:{
		        comprobantesislr: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'beneficiariosModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/beneficiarios/beneficiarios.mdl.js",
				          								"front/app/core/listas/beneficiarios/beneficiarios.srv.js",
													    "front/app/core/listas/beneficiarios/beneficiarios.detail.ctrl.js",
														]
											},
				          					{
				          						name: 'islrModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/comprobantes/islr/islr.mdl.js",
				          								"front/app/core/comprobantes/islr/islr.srv.js",
													    "front/app/core/comprobantes/islr/islr.lista.ctrl.js",				          								
													    "front/app/core/comprobantes/islr/islr.detail.ctrl.js",
														]
											},		          	

					]);
		        }]
			}
		})

		.state('config.comprobantes-islr-detail',{
			url:'comprobanteislr',
			templateUrl:'front/app/core/comprobantes/islr/islr.detail.tpl.html',
			controller:"islrDetailController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Comprobante ISLR',
				catProg: null,
				beneficiarios: null,
	        },						
			resolve:{
		        comprobantesislrdetail: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'listasModule',
				          						serie:true,
				          						files:[
				          								"front/app/common/listas/listas.mdl.js",
														"front/app/common/listas/listas.srv.js",
														]
											},
				          					{
				          						name: 'alicuotasModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/alicuotas/alicuotas.mdl.js",
														"front/app/core/listas/alicuotas/alicuotas.srv.js",
														]
											},		          	
				          					{
				          						name: 'beneficiariosModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/beneficiarios/beneficiarios.mdl.js",
				          								"front/app/core/listas/beneficiarios/beneficiarios.srv.js",
													    "front/app/core/listas/beneficiarios/beneficiarios.detail.ctrl.js",
														]
											},
				          					{
				          						name: 'islrModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/comprobantes/islr/islr.mdl.js",
				          								"front/app/core/comprobantes/islr/islr.srv.js",
													    "front/app/core/comprobantes/islr/islr.detail.ctrl.js",
													    "front/app/core/comprobantes/islr/islr.modal.ctrl.js",
														]
											},		          	

					]);
		        }]
			}
		})		


		/*****************************************************/	    	    
	    /**************** COMPRAS ************************/	    
	    /*****************************************************/	    	    

	    /**************** EXENTAS ************************/
		.state('menu.compras-exentas',{
			url:'compras-exentas',
			templateUrl:'front/app/core/compras/exentas/exentas.lista.tpl.html',
			controller:"exentasListaController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Compras Exentas'
	        },						
			resolve:{
		        comprobantesiva: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
		          							{
				          						name: 'listasModule',
				          						serie:true,
				          						files:[
				          								"front/app/common/listas/listas.mdl.js",
														"front/app/common/listas/listas.srv.js",
														]
											},
				          					{
				          						name: 'beneficiariosModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/beneficiarios/beneficiarios.mdl.js",
				          								"front/app/core/listas/beneficiarios/beneficiarios.srv.js",
													    "front/app/core/listas/beneficiarios/beneficiarios.detail.ctrl.js",
														]
											},
				          					{
				          						name: 'comprasModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/compras/exentas/compras.mdl.js",
				          								"front/app/core/compras/exentas/compras.srv.js",
													    "front/app/core/compras/exentas/exentas.lista.ctrl.js",				          								
													    "front/app/core/compras/exentas/exentas.modal.ctrl.js",
														]
											},		          	

					]);
		        }]
			}
		})

	    /*****************************************************/	    	    
	    /**************** DECLARACIONES ************************/	    
	    /*****************************************************/	    	    

	    /**************** IVA ************************/
		.state('menu.declaracion-iva',{
			url:'declaracion-iva',
			templateUrl:'front/app/core/declaraciones/iva/declaracion-iva.lista.tpl.html',
			controller:"declaracion-ivaListaController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Declaracion de IVA'
	        },						
			resolve:{
		        comprobantesiva: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'ivaModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/comprobantes/iva/iva.mdl.js",
				          								"front/app/core/comprobantes/iva/iva.srv.js",
													    "front/app/core/declaraciones/iva/declaracion-iva.lista.ctrl.js",				          								
														]
											},		          	

					]);
		        }]
			}
		})
	    /**************** ISLR ************************/
		.state('menu.declaracion-islr',{
			url:'declaracion-islr',
			templateUrl:'front/app/core/declaraciones/islr/declaracion-islr.lista.tpl.html',
			controller:"declaracion-islrListaController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Declaracion de ISLR'
	        },						
			resolve:{
		        comprobantesiva: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'ivaModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/comprobantes/islr/islr.mdl.js",
				          								"front/app/core/comprobantes/islr/islr.srv.js",
													    "front/app/core/declaraciones/islr/declaracion-islr.lista.ctrl.js",				          								
														]
											},		          	

					]);
		        }]
			}
		})
	    /**************** ISLR ************************/
		.state('menu.declaracion-librocompras',{
			url:'declaracion-librocompras',
			templateUrl:'front/app/core/declaraciones/librocompras/declaracion-librocompras.lista.tpl.html',
			controller:"declaracionlibrocomprasListaController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Libro de Compras'
	        },						
			resolve:{
		        comprobantesiva: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'comprasModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/compras/exentas/compras.mdl.js",
				          								"front/app/core/compras/exentas/compras.srv.js",
													    "front/app/core/declaraciones/librocompras/declaracion-librocompras.lista.ctrl.js",				          								
														]
											},		          	

					]);
		        }]
			}
		})		



	    /*****************************************************/	    	    
	    /**************** LISTAS ************************/	    
	    /*****************************************************/

	    /**************** AGENTES ************************/
		.state('menu.listas-agentes',{
			url:'agentes',
			templateUrl:'front/app/core/listas/agentes/agentes.lista.tpl.html',
			controller:"agentesListaController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Agentes'
	        },						
			resolve:{
		        agentesLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'listasModule',
				          						serie:true,
				          						files:[
				          								"front/app/common/listas/listas.mdl.js",
														"front/app/common/listas/listas.srv.js",
														]
											},
				          					{
				          						name: 'beneficiariosModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/beneficiarios/beneficiarios.mdl.js",
				          								"front/app/core/listas/beneficiarios/beneficiarios.srv.js",
														]
											},													          	
				          					{
				          						name: 'agentesModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/agentes/agentes.mdl.js",
				          								"front/app/core/listas/agentes/agentes.srv.js",
													    "front/app/core/listas/agentes/agentes.lista.ctrl.js",				          								
													    "front/app/core/listas/agentes/agentes.detail.ctrl.js",
														]
											},		          	

					]);
		        }]
			}
		})	

	   

	    /**************** BENEFICIARIOS ************************/
		.state('menu.listas-beneficiarios',{
			url:'beneficiarios',
			templateUrl:'front/app/core/listas/beneficiarios/beneficiarios.lista.tpl.html',
			controller:"beneficiariosListaController",
			controllerAs:"ctrl",			
			params: {
	            sectionName: 'Beneficiarios'
	        },						
			resolve:{
		        beneficiariosLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
				          					{
				          						name: 'listasModule',
				          						serie:true,
				          						files:[
				          								"front/app/common/listas/listas.mdl.js",
														"front/app/common/listas/listas.srv.js",
														]
											},		          	
				          					{
				          						name: 'beneficiariosModule',
				          						serie:true,
				          						files:[
				          								"front/app/core/listas/beneficiarios/beneficiarios.mdl.js",
				          								"front/app/core/listas/beneficiarios/beneficiarios.srv.js",
													    "front/app/core/listas/beneficiarios/beneficiarios.lista.ctrl.js",				          								
													    "front/app/core/listas/beneficiarios/beneficiarios.detail.ctrl.js",
														]
											},		          	

					]);
		        }]
			}
		});	










	}]);

})();