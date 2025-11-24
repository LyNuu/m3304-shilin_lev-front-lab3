import "/src/sass/style.scss";
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { initNavigation } from './navigation.js';

initNavigation();

let swiperInstance = null;

function initSwiper() {
    const swiperContainer = document.querySelector('.mySwiper');
    if (!swiperContainer) return;
    
    if (swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
    }
    
    swiperInstance = new Swiper('.mySwiper', {
        modules: [Navigation, Pagination],
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 1,
        spaceBetween: 30,
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });
}

function initSlider() {
    const slider = document.querySelector('.promo__slider');
    if (slider) {
        setTimeout(() => {
            slider.classList.add('active');
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    initSwiper();

    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.promo__menu');
    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });
        mobileMenu.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });
    }
});
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productList = document.getElementById('product-list');
    const products = productList ? Array.from(productList.querySelectorAll('.product-item')) : [];
    const noResults = document.getElementById('no-results');

    if (!filterBtns.length || !productList) return;

    filterBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });

    const newFilterBtns = document.querySelectorAll('.filter-btn');

    function applyFilter(filter) {
        if (filter === 'tea') {
            products.forEach(p => p.style.display = 'block');
            if (noResults) noResults.style.display = 'none';
        } else {
            products.forEach(p => p.style.display = 'none');
            if (noResults) noResults.style.display = 'block';
        }
    }

    newFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.getAttribute('data-filter');
            newFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(f);
        });
    });

    const defaultBtn = Array.from(newFilterBtns).find(b => b.getAttribute('data-filter') === 'tea');
    if (defaultBtn) {
        defaultBtn.classList.add('active');
        applyFilter('tea');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initFilters();
});

document.addEventListener('catalogLoaded', function() {
    initFilters();
});

document.addEventListener('pageUpdated', function() {
    initSlider();
    initSwiper();
    initFilters();
});