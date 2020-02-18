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
		'appName':'Gids Pyme',
		/* env:dev */
    		'APIURL':'../rest/',		
			'URL':'adm/front/',		
    	/* env:dev:end */
    	
    	/* env:prod *#/
     		'APIURL':'/rest/',
			'URL':'/front/',	
     	/* env:prod:end */


		
		'logUser':{},
		'logEmpresa':{},
		'cotizacion_dolar':0,
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
			$rootScope.preloader = false;

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
			$rootScope.preloader = true;

			if (from.name){
				if (from.name!=to.name){
					sessionStorage.setItem("prevState",from.name);
				}
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

	.directive('image', ['$q',
		function($q) {


			var URL = window.URL || window.webkitURL;

			var getResizeArea = function() {
				var resizeAreaId = 'fileupload-resize-area';

				var resizeArea = document.getElementById(resizeAreaId);

				if (!resizeArea) {
					resizeArea = document.createElement('canvas');
					resizeArea.id = resizeAreaId;
					resizeArea.style.visibility = 'hidden';
					document.body.appendChild(resizeArea);
				}

				return resizeArea;
			};

			/**
			 * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
			 * @param {Image} sourceImgObj The source Image Object
			 * @param {Integer} quality The output quality of Image Object
			 * @return {Image} result_image_obj The compressed Image Object
			 */

			var jicCompress = function(sourceImgObj, options) {
				var outputFormat = options.resizeType;
				var quality = options.resizeQuality * 100 || 70;
				var mimeType = 'image/jpeg';
				if (outputFormat !== undefined && outputFormat === 'png') {
					mimeType = 'image/png';
				}


				var maxHeight = options.resizeMaxHeight || 300;
				var maxWidth = options.resizeMaxWidth || 250;

				var height = sourceImgObj.height;
				var width = sourceImgObj.width;

				// calculate the width and height, constraining the proportions
				if (width > height) {
					if (width > maxWidth) {
						height = Math.round(height *= maxWidth / width);
						width = maxWidth;
					}
				}
				else {
					if (height > maxHeight) {
						width = Math.round(width *= maxHeight / height);
						height = maxHeight;
					}
				}

				var cvs = document.createElement('canvas');
				cvs.width = width; //sourceImgObj.naturalWidth;
				cvs.height = height; //sourceImgObj.naturalHeight;
				var ctx = cvs.getContext('2d').drawImage(sourceImgObj, 0, 0, width, height);
				var newImageData = cvs.toDataURL(mimeType, quality / 100);
				var resultImageObj = new Image();
				resultImageObj.src = newImageData;
				return resultImageObj.src;

			};

			var resizeImage = function(origImage, options) {
				var maxHeight = options.resizeMaxHeight || 300;
				var maxWidth = options.resizeMaxWidth || 250;
				var quality = options.resizeQuality || 0.7;
				var type = options.resizeType || 'image/jpg';

				var canvas = getResizeArea();

				var height = origImage.height;
				var width = origImage.width;

				// calculate the width and height, constraining the proportions
				if (width > height) {
					if (width > maxWidth) {
						height = Math.round(height *= maxWidth / width);
						width = maxWidth;
					}
				}
				else {
					if (height > maxHeight) {
						width = Math.round(width *= maxHeight / height);
						height = maxHeight;
					}
				}

				canvas.width = width;
				canvas.height = height;

				//draw image on canvas
				var ctx = canvas.getContext('2d');
				ctx.drawImage(origImage, 0, 0, width, height);

				// get the data from canvas as 70% jpg (or specified type).
				return canvas.toDataURL(type, quality);
			};

			var createImage = function(url, callback) {
				var image = new Image();
				image.onload = function() {
					callback(image);
				};
				image.src = url;
			};

			var fileToDataURL = function(file) {
				var deferred = $q.defer();
				var reader = new FileReader();
				reader.onload = function(e) {
					deferred.resolve(e.target.result);
				};
				reader.readAsDataURL(file);
				return deferred.promise;
			};


			return {
				restrict: 'A',
				scope: {
					image: '=',
					resizeMaxHeight: '@?',
					resizeMaxWidth: '@?',
					resizeQuality: '@?',
					resizeType: '@?'
				},
				link: function postLink(scope, element, attrs) {

					var doResizing = function(imageResult, callback) {
						createImage(imageResult.url, function(image) {
							//var dataURL = resizeImage(image, scope);
							var dataURLcompressed = jicCompress(image, scope);
							// imageResult.resized = {
							// 	dataURL: dataURL,
							// 	type: dataURL.match(/:(.+\/.+);/)[1]
							// };
							imageResult.compressed = {
								dataURL: dataURLcompressed,
								type: dataURLcompressed.match(/:(.+\/.+);/)[1]
							};
							callback(imageResult);
						});
					};

					var applyScope = function(imageResult) {
						scope.$apply(function() {
							console.log(imageResult);
							if (attrs.multiple) {
								scope.image.push(imageResult);
							}
							else {
								scope.image = imageResult;
							}
						});
					};


					element.bind('change', function(evt) {
						//when multiple always return an array of images
						if (attrs.multiple)
							{scope.image = [];}

						var files = evt.target.files;
						for (var i = 0; i < files.length; i++) {
							//create a result object for each file in files
							var imageResult = {
								file: files[i],
								url: URL.createObjectURL(files[i])
							};

							fileToDataURL(files[i]).then(function(dataURL) {
								console.log(dataURL)
								imageResult.dataURL = dataURL;
							});

							if (scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
								doResizing(imageResult, function(imageResult) {
									applyScope(imageResult);
								});
							}
							else { //no resizing
								applyScope(imageResult);
							}
						}
					});
				}
			};
		}
	])
	
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