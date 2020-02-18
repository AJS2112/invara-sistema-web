(function(){
  'use strict';
  
  angular.module("configuracionesModule")
  .controller("monedasDetailController", monedasDetailController);
  monedasDetailController.$inject=['$mdDialog', '$scope', 'cnfMonedasService'];

  function monedasDetailController($mdDialog, $scope, cnfMonedasService){
    var vm=this;
    vm.one = {};
    vm.error="";
    vm.full=true;

    activate();

    function activate(){
      vm.one=cnfMonedasService.one;
    }

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.guardar = function() {
      Pace.restart();
      vm.full=false;
      cnfMonedasService.setOne(vm.one)
      .then(function(res){
        console.log('res guardar')
        console.log(res)
        if (res.data && res.data.code==0){
          localStorage.setItem("token",res.data.response.token);
          $mdDialog.hide();
          Pace.stop();
        } else if (res.data && res.data.code!==0){
          localStorage.setItem("token",res.data.response.token);
          vm.error=res.data.response.token;
          Pace.stop();
          vm.full=true;
        } 
      })
    } 
  }

})();