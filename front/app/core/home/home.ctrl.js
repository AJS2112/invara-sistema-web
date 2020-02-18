(function(){
	'use strict';

  	angular.module("myApp")
  	.controller("homeController", homeController);

  	homeController.$inject=['$rootScope', '$scope','CONFIG'];

  	function homeController($rootScope, $scope, CONFIG){
      
      console.log('Home')

        console.log('el script')
        const slides = document.querySelectorAll('.slide');
        const next = document.querySelector('#next');
        const prev = document.querySelector('#prev');
        const auto = true; // Auto scroll
        const intervalTime = 5000;
        let slideInterval;

        const nextSlide = () => {
          // Get current class
          const current = document.querySelector('.current');
          if (current){
              // Remove current class
              current.classList.remove('current');
              // Check for next slide
              if (current.nextElementSibling) {
                // Add current to next sibling
                current.nextElementSibling.classList.add('current');
              } else {
                // Add current to start
                slides[0].classList.add('current');
              }
              setTimeout(() => current.classList.remove('current'));
          }
        };

        const prevSlide = () => {
          // Get current class
          const current = document.querySelector('.current');
          // Remove current class
          current.classList.remove('current');
          // Check for prev slide
          if (current.previousElementSibling) {
            // Add current to prev sibling
            current.previousElementSibling.classList.add('current');
          } else {
            // Add current to last
            slides[slides.length - 1].classList.add('current');
          }
          setTimeout(() => current.classList.remove('current'));
        };

        // Button events
        next.addEventListener('click', e => {
          nextSlide();
          if (auto) {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, intervalTime);
          }
        });

        prev.addEventListener('click', e => {
          prevSlide();
          if (auto) {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, intervalTime);
          }
        });

        // Auto slide
        if (auto) {
            console.log('hell yeah, autoslide!')
          // Run next slide at interval time
          slideInterval = setInterval(nextSlide, intervalTime);
        };



        $scope.slides = [
            {
                id: 1,
                title: 'Triven Import and Export',
                description:'Servicios Integrales en Logística y Comercio Internacional',
                img: 'front/assets/img/pic05.jpg',
            },
            {
                id: 2,
                title: 'Soluciones en logística y comercio internacional',
                description:'Ofrecemos nuestra experiencia en servicios de exportación e importación de productos a nivel mundial.',
                img: 'front/assets/img/pic02.jpg',
            },
            {
                id: 3,
                title: 'Tiempos de entrega',
                description:'Los tiempos de entrega siempre se verán favorecidos con nuestros servicios directos aunado a los despachos aduanales rápidos.',
                img: 'front/assets/img/pic03.jpg',
            },
            {
                id: 4,
                title: 'Documentación correcta',
                description:'Revisamos la documentación antes de la salida de origen para evitar contratiempos en el despacho de sus mercancías.',
                img: 'front/assets/img/pic04.jpg',
            },
            {
                id: 5,
                title: 'Servicios Integrales',
                description:'Manejamos el transporte que usted necesite (Aéreo, marítimo y terrestre) desde y para cualquier parte del mundo.',
                img: 'front/assets/img/pic05.jpg',
            },

        ];
                


    }

})();