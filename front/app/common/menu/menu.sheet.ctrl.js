(function(){
	'use strict';

  	angular.module("myApp")
  	.controller("menuSheetController", menuSheetController);

  	menuSheetController.$inject=['$rootScope', '$scope','$state','$mdBottomSheet'];

  	function menuSheetController($rootScope, $scope, $state,$mdBottomSheet){
    	var vm=this;
      activate();

      function activate(){
        console.log('MENU SHEET')
      }


      vm.goto = function(state) {
        console.log('goto: ',state)
        $state.go(state);
        $mdBottomSheet.hide();
      };

      
      vm.scrollTo=function(elemento){
        console.log('scroll',elemento)

        if ($state.current.name=='menu.home'){
          var elmnt = document.getElementById(elemento);
          elmnt.scrollIntoView();
        } else{
          $state.go('menu.home');
        }

        $mdBottomSheet.hide();

      }


  	}

})();