import "/src/sass/style.scss";


document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.promo__slider');
    
    setTimeout(() => {
        slider.classList.add('active');
    }, 500);
})