(function(){
	'use strict';

  	angular.module("sistemaModule")
  	.controller("loginController", loginController);

  	loginController.$inject=['$rootScope','jwtHelper','$state', '$mdDialog', '$filter', 'Idle','sisLoginService','sisUsuariosService', 'sisEmpresasService', 'lstCotizacionesService'];

  	function loginController($rootScope,jwtHelper,$state,$mdDialog,$filter,Idle,sisLoginService,sisUsuariosService,sisEmpresasService, lstCotizacionesService){
      var vm=this;
      vm.user={};

      vm.crear=function(){
          sisUsuariosService.one={};
          $state.go("signup");
          $mdDialog.hide();        
      }

      vm.logIn = function(user){
        //console.log('log')
        //USUARIO
        sisLoginService.logIn(user).then(function(res){
          //console.log('sisLoginService.logIn',res)
          if (res.data && res.data.code == 0){
            localStorage.setItem("token",res.data.response.token);
            var myLogUser=res.data.response.datos
            sessionStorage.setItem("logUser",JSON.stringify(myLogUser));

            //EMPRESA
            sisEmpresasService.getOne(myLogUser.id_empresa).then(function(res){
                //console.log('sisEmpresasService.getOne',res.data)
                var myEmpresa=res.data.response.datos;
                console.log('res.data.response.datos',res.data.response.datos)
                myEmpresa.es_modo_fiscal=!!+myEmpresa.es_modo_fiscal;
                sessionStorage.setItem("empresa",JSON.stringify(myEmpresa));
                console.log('myEmpresa: ',myEmpresa)                  
                //COTIZACION
                lstCotizacionesService.getLast(myLogUser.id_empresa).then(function(res){
                  if (res.data && res.data.code==0){
                    sessionStorage.setItem("listaCotizacion",JSON.stringify(res.data.response.datos));
                    var _lista=res.data.response.datos;
                    console.log(myEmpresa)
                    if (myEmpresa.moneda_defecto){
                      var filtro={};
                      filtro.id_moneda=myEmpresa.moneda_defecto;  

                      var result = $filter('filter')(_lista, filtro, true);
                      if (result.length){
                        $rootScope.factor=result[0].valor;
                        sessionStorage.setItem("oneCotizacion",JSON.stringify(result[0]));
                      }
                    }
        
                    Idle.watch();
                    $state.go("menu.dashboard");
                    $mdDialog.hide();
                  }
                })
            })
            
          } else {
            vm.error="Nombre de usuario y/o contraseña inválidos";
          }
        },function(){
        });
      }   

  	}

})();