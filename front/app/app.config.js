(function (){
	'use strict';
	
	angular.module('myApp')

	.config(["$provide", "$stateProvider","$urlRouterProvider", '$httpProvider', '$ocLazyLoadProvider','$mdDateLocaleProvider', '$mdThemingProvider', function($provide, $stateProvider,$urlRouterProvider,$httpProvider,$ocLazyLoadProvider,$mdDateLocaleProvider,$mdThemingProvider){
		$mdThemingProvider.definePalette('araPalette', {
		    '50': 'ffebee',
		    '100': 'ffcdd2',
		    '200': 'ef9a9a',
		    '300': 'e57373',
		    '400': 'ef5350',
		    '500': 'f44336',
		    '600': 'e53935',
		    '700': 'd32f2f',
		    '800': 'c62828',
		    '900': 'b71c1c',
		    'A100': 'ff8a80',
		    'A200': 'ff5252',
		    'A400': 'ff1744',
		    'A700': 'd50000',
		    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
		                                        // on this palette should be dark or light

		    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
		     '200', '300', '400', 'A100'],
		    'contrastLightColors': undefined    // could also specify this if default was 'dark'
		  });

		$mdThemingProvider.theme('ara')
		    .primaryPalette('deep-orange', {
			      'default': '400', // by default use shade 400 from the pink palette for primary intentions
			      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
			      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
			      'hue-3': '800' // use shade A100 for the <code>md-hue-3</code> class
			  })
		    .accentPalette('yellow')
		    .warnPalette('red')
		    .backgroundPalette('grey');
		$mdThemingProvider.setDefaultTheme('ara');

		
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
		

        /*********** HTTP PROVIDER ***************/
		$httpProvider.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";

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
		$urlRouterProvider.otherwise("/home");

		$stateProvider
		/*************************************************** APP MENU CONTAINER **********************************************************/
	   	.state('menu',{
			abstract:true,
			url:"/",
			templateUrl:"front/app/common/menu/menu.tpl.html",
			controller:"menuController",
			controllerAs:"ctrl",
			resolve:{
		        menuLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
			          						{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
												    	"front/app/common/menu/menu.ctrl.js",
												    	"front/app/common/menu/menu.sheet.ctrl.js"

												    	]
					          				},
					]);
		        }]
			}
		})		
		
		/*************************************************** HOME **********************************************************/
	    .state('menu.home', {
	      	url: "home",
			templateUrl:'front/app/core/home/home.tpl.html',
			controller:"homeController",
			controllerAs:"ctrl",
			resolve:{
		        menuLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
			          						{
			          							name: 'sistemaModule',
				          						serie:true,
				          						files:[	
												    	"front/app/core/home/home.ctrl.js"]
					          				},
					]);
		        }]
			}
	    })

	    /*************************************************** CATALOGO **********************************************************/
	    .state('menu.catalogo', {
	      	url: "catalogo",
			templateUrl:'front/app/core/catalogo/catalogo.tpl.html',
			controller:"catalogoController",
			controllerAs:"ctrl",
			resolve:{
		        menuLoad: ['$ocLazyLoad' ,function($ocLazyLoad){
		          return $ocLazyLoad.load([
			          						{
			          							name: 'catalogoModule',
				          						serie:true,
				          						files:[	
				          								"front/app/common/services/lst-cotizaciones.srv.js",
				          								"front/app/common/services/inv-productos.srv.js",
												    	"front/app/core/catalogo/catalogo.ctrl.js"]
					          				},
					]);
		        }]
			}
	    })






	}]);

})();