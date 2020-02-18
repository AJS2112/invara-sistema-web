(function(){
	'use strict';

  	angular.module("myApp")
  	.controller("menuController", menuController);

  	menuController.$inject=['$rootScope', '$scope','$state','$mdBottomSheet'];

  	function menuController($rootScope, $scope, $state, $mdBottomSheet){
    	var vm=this;
      vm.currentNavItem = 'page1';

      activate();

      function activate(){
        //console.log('MENU')
      }


      vm.goto = function(state) {
        console.log('goto: ',state)
        $state.go(state);
      };

      vm.scrollTo=function(elemento){
        console.log('scroll',elemento)
        if ($state.current.name=='menu.home'){
          var elmnt = document.getElementById(elemento);
          elmnt.scrollIntoView();
        } else{
          $state.go('menu.home');
        }
      }

      vm.showSheet=function(){
        $mdBottomSheet.show({
          templateUrl: 'front/app/common/menu/menu.sheet.tpl.html',
          controller: 'menuSheetController',
          controllerAs: 'ctrl'
        }).then(function() {
        }).catch(function(error) {
          // User clicked outside or hit escape
        });
      }
      


  	}

})();