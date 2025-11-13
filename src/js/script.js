import "/src/sass/style.scss";
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.promo__slider');
    
    setTimeout(() => {
        slider.classList.add('active');
    }, 500);

    const swiper = new Swiper('.mySwiper', {
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
});
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productList = document.getElementById('product-list');
    const products = productList ? Array.from(productList.querySelectorAll('.product-item')) : [];
    const noResults = document.getElementById('no-results');

    if (!filterBtns || !productList) return;

    function applyFilter(filter) {
        if (filter === 'tea') {
            products.forEach(p => p.style.display = 'block');
            if (noResults) noResults.style.display = 'none';
        } else {
            products.forEach(p => p.style.display = 'none');
            if (noResults) noResults.style.display = 'block';
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(f);
        });
    });

    const defaultBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === 'tea');
    if (defaultBtn) {
        defaultBtn.classList.add('active');
        applyFilter('tea');
    }
});