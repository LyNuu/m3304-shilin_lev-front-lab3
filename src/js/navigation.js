const API_BASE = "https://ceramic-api.onrender.com";

async function fetchPageContent(page) {
  try {
    const response = await fetch(`${API_BASE}/api/pages/${page}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    return getLocalPageContent(page);
  }
}

function getLocalPageContent(page) {
  const pages = {
    index: {
      title: "Ceramic soul",
      content: getIndexContent()
    },
    catalog: {
      title: "Ceramic soul - Catalog",
      content: getCatalogContent()
    },
    notes: {
      title: "Ceramic soul - Blog",
      content: getNotesContent()
    },
    began: {
      title: "Ceramic soul - About",
      content: getBeganContent()
    }
  };
  return pages[page] || pages.index;
}

async function navigateToPage(page) {
  try {
    showLoadingIndicator();
    
    const pageData = await fetchPageContent(page);
    
    document.title = pageData.title || "Ceramic soul";
    
    const newUrl = page === 'index' ? '/' : `/${page}.html`;
    window.history.pushState({ page }, pageData.title, newUrl);
    
    updatePageContent(pageData.content);
    
    initializePageComponents(page);
    
    hideLoadingIndicator();
    
    document.dispatchEvent(new Event('pageUpdated'));
    
    window.scrollTo(0, 0);
  } catch (error) {
    console.error(`Error navigating to ${page}:`, error);
    hideLoadingIndicator();
    alert('Ошибка загрузки страницы. Попробуйте позже.');
  }
}

function updatePageContent(htmlContent) {
  const scripts = Array.from(document.querySelectorAll('script[type="module"]'));
  
  const existingSections = document.querySelectorAll('section.promo, section.promo__footer, section:not(.promo):not(.promo__footer)');
  existingSections.forEach(section => section.remove());
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const newSections = tempDiv.querySelectorAll('section');
  newSections.forEach(section => {
    document.body.appendChild(section.cloneNode(true));
  });
  
  if (!tempDiv.querySelector('section.promo__footer')) {
    const footer = getFooterContent();
    const footerDiv = document.createElement('div');
    footerDiv.innerHTML = footer;
    const footerSection = footerDiv.querySelector('section');
    if (footerSection) {
      document.body.appendChild(footerSection);
    }
  }
  
  scripts.forEach(script => {
    if (!document.body.contains(script)) {
      document.body.appendChild(script);
    }
  });
}

function initializePageComponents(page) {
  const swiperContainer = document.querySelector('.mySwiper');
  if (swiperContainer && page === 'index') {
    const existingSwiper = swiperContainer.swiper;
    if (existingSwiper) {
      existingSwiper.update();
    }
  }
  
  if (page === 'catalog') {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
      document.dispatchEvent(new Event('catalogLoaded'));
    }
  }
  
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.promo__menu');
  if (burger && mobileMenu) {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
}

function showLoadingIndicator() {
  let loader = document.getElementById('page-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-size: 24px;
      color: #A22DC6;
    `;
    loader.textContent = 'Загрузка...';
    document.body.appendChild(loader);
  }
  loader.style.display = 'flex';
}

function hideLoadingIndicator() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

function getFooterContent() {
  return `
    <section class="promo__footer">
      <div class="promo__footer-container">
        <div class="promo__footer-content">
          <div class="promo__footer-newsletter">
            <h2 class="promo__footer-title">newsletter</h2>
            <p class="promo__footer-text">Keep up to date with news and promotions</p>
            <input type="email" placeholder="Enter your e-mail" class="promo__footer-input" />
            <label class="promo__footer-checkbox-wrapper" for="footer-terms">
              <input type="checkbox" class="promo__checkbox" id="footer-terms" />
              <span>I agree with the <span class="promo__footer-link">terms</span></span>
            </label>
            <button class="btn-default promo__footer-btn">SUBMIT</button>
          </div>
          <div class="promo__footer-links">
            <div class="promo__footer-link-column">
              <h2 class="promo__footer-title">discover</h2>
              <a href="#" class="promo__footer-link-item" data-page="began">About Us</a>
              <a href="#" class="promo__footer-link-item" data-page="notes">Blog</a>
            </div>
            <div class="promo__footer-link-column">
              <h2 class="promo__footer-title">shopping</h2>
              <a href="#" class="promo__footer-link-item" data-page="catalog">Catalog</a>
            </div>
            <div class="promo__footer-link-column">
              <h2 class="promo__footer-title">information</h2>
              <a href="#" class="promo__footer-link-item">Terms and Conditions</a>
            </div>
          </div>
          <div class="promo__footer-follow">
            <h2 class="promo__footer-title">follow us</h2>
            <div class="promo__footer-social">
              <a href="#" class="promo__footer-social-link">
                <img src="/src/img/follow/facebook.png" alt="Facebook" />
              </a>
              <a href="#" class="promo__footer-social-link">
                <img src="/src/img/follow/facebook.png" alt="Instagram" />
              </a>
              <a href="#" class="promo__footer-social-link">
                <img src="/src/img/follow/facebook.png" alt="Pinterest" />
              </a>
            </div>
          </div>
        </div>
        <div class="promo__footer-copyright">
          <p>© Copyright 2025, Ceramic soul</p>
        </div>
      </div>
    </section>
  `;
}

function getIndexContent() {
  return `
    <section class="promo">
      <div class="container">
        <header class="header">
          <div class="burger"><span></span><span></span><span></span></div>
          <a href="#" class="header__logo"><img src="/src/logo/logo.png" alt="logo" /></a>
          <div class="header__icons">
            <a href="#"><span class="icon-search"></span></a>
            <a href="#"><span class="icon-shopping-bag"></span></a>
          </div>
        </header>
        <div class="promo__menu">
          <a href="#" class="menu-link" data-page="catalog">catalog</a>
          <a href="#" class="menu-link" data-page="notes">blog</a>
          <a href="#" class="menu-link" data-page="began">about</a>
        </div>
      </div>
      <div class="promo__slider">
        <img src="/src/img/promo/ceramic-vase.jpg" alt="vase" class="promo__img" />
        <button class="btn-default promo__btn">shop now</button>
      </div>
      <div class="promo__icons">
        <img src="/src/img/promo/potter.jpg" alt="potter" />
      </div>
      <h1 class="title-h1-italic promo__title">
        Make your dream come true or decorate your home
      </h1>
    </section>
    <section class="promo">
      <div class="promo__text">
        <h1>create or buy</h1>
      </div>
      <div class="promo__container">
        <h1 class="promo__text-grid">our store</h1>
        <h1 class="promo__text-grid">our store</h1>
        <img src="/src/img/about/store.jpg" alt="store" />
        <img src="/src/img/about/ceramic.jpg" alt="ceeramic" />
        <h1 class="promo__text-block">Welcome to <span class="promo__accent">Ceramic Soul</span>, where each piece tells
          a story of craftsmanship and creativity. Our handmade
          ceramics are thoughtfully designed and carefully crafted, blending traditional techniques with modern
          aesthetics. Whether you're looking for a unique gift or a special addition to your home, our collection
          offers timeless pieces that bring warmth and authenticity to any space.</h1>
        <h1 class="promo__text-block">At <span class="promo__accent">Ceramic Soul</span> workshop, we don't just craft
          ceramics—we invite you to get hands-on and create your own
          unique pieces. Through our engaging masterclasses, you'll learn traditional techniques, work with
          natural materials, and experience the joy of shaping clay into something truly personal.</h1>
      </div>
    </section>
    <section class="promo">
      <div class="promo__text">
        get in touch
      </div>
      <div class="promo__container-getIn-touch">
        <img src="/src/img/form/tea.jpg" alt="tea" />
        <div>
          <div class="promo__container-flex">
            <div>
              <h1>Name</h1>
              <input type="name" placeholder="Name" />
            </div>
            <div>
              <h1>Email</h1>
              <input type="email" placeholder="Email" />
            </div>
            <div class="promo__input-full">
              <h1>Your question</h1>
              <input type="Your question" placeholder="Question" class="promo__textarea" />
            </div>
          </div>
          <div class="promo__container-flex-vase">
            <div>
              <input type="checkbox" class="promo__checkbox" />
              I agree with the <span style="color: #A22DC6;">terms</span>
              <button class="btn-default">send request</button>
            </div>
            <div>
              <img src="/src/img/form/vase.png" alt="vase" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="promo">
      <div class="promo__text-last">
        check out our works
      </div>
      <div class="swiper mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <img src="/src/img/works/tea-1.jpg" alt="tea1" />
          </div>
          <div class="swiper-slide">
            <img src="/src/img/works/tea-2.jpg" alt="tea2" />
          </div>
          <div class="swiper-slide">
            <img src="/src/img/works/tea-3.jpg" alt="tea3" />
          </div>
          <div class="swiper-slide">
            <img src="/src/img/works/tea-1.jpg" alt="tea1" />
          </div>
          <div class="swiper-slide">
            <img src="/src/img/works/tea-2.jpg" alt="tea2" />
          </div>
          <div class="swiper-slide">
            <img src="/src/img/works/tea-3.jpg" alt="tea3" />
          </div>
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </div>
    </section>
    ${getFooterContent()}
  `;
}

function getCatalogContent() {
  return `
    <section class="promo">
      <div class="container">
        <header class="header">
          <div class="burger"><span></span><span></span><span></span></div>
          <a href="#" class="header__logo"><img src="/src/logo/logo.png" alt="logo" /></a>
          <div class="header__icons">
            <a href="#"><span class="icon-search"></span></a>
            <a href="#"><span class="icon-shopping-bag"></span></a>
          </div>
        </header>
        <div class="promo__menu">
          <a href="#" class="menu-link" data-page="index">home</a>
          <a href="#" class="menu-link" data-page="notes">blog</a>
          <a href="#" class="menu-link" data-page="began">about</a>
        </div>
      </div>
      <div class="promo__text-last">
        our pottery
      </div>
      <div class="catalog-filters-wrapper">
        <div class="catalog-filters">
          <button class="filter-btn" data-filter="tea">for tea</button>
          <button class="filter-btn" data-filter="kitchen">for kitchen</button>
          <button class="filter-btn" data-filter="plants">for plants</button>
        </div>
      </div>
      <div class="promo__container-flex-last" id="product-list">
        <div class="product-item" data-category="tea"><img src="/src/img/pottery/Product card.jpg" alt="product 1" /></div>
        <div class="product-item" data-category="tea"><img src="/src/img/pottery/Product card (1).jpg" alt="product 2" /></div>
        <div class="product-item" data-category="tea"><img src="/src/img/pottery/Product card (2).jpg" alt="product 3" /></div>
        <div class="product-item" data-category="tea"><img src="/src/img/pottery/Product card (3).jpg" alt="product 4" /></div>
      </div>
      <div id="no-results" style="display:none; text-align:center; padding:40px; color:#666;">No items for this filter</div>
    </section>
    ${getFooterContent()}
  `;
}

function getNotesContent() {
  return `
    <section class="promo">
      <div class="container">
        <header class="header">
          <div class="burger"><span></span><span></span><span></span></div>
          <a href="#" class="header__logo"><img src="/src/logo/logo.png" alt="logo" /></a>
          <div class="header__icons">
            <a href="#"><span class="icon-search"></span></a>
            <a href="#"><span class="icon-shopping-bag"></span></a>
          </div>
        </header>
        <div class="promo__menu">
          <a href="#" class="menu-link" data-page="catalog">catalog</a>
          <a href="#" class="menu-link" data-page="index">home</a>
          <a href="#" class="menu-link" data-page="began">about</a>
        </div>
      </div>
      <div class="promo__text-last">
        our digital notes
      </div>
      <div class="promo__container-flex-last">
        <img src="/src/img/pottery/Blog card.jpg" />
        <img src="/src/img/pottery/Blog card (1).jpg" />
      </div>
    </section>
    ${getFooterContent()}
  `;
}

function getBeganContent() {
  return `
    <section class="promo">
      <div class="container">
        <header class="header">
          <div class="burger"><span></span><span></span><span></span></div>
          <a href="#" class="header__logo"><img src="/src/logo/logo.png" alt="logo" /></a>
          <div class="header__icons">
            <a href="#"><span class="icon-search"></span></a>
            <a href="#"><span class="icon-shopping-bag"></span></a>
          </div>
        </header>
        <div class="promo__menu">
          <a href="#" class="menu-link" data-page="catalog">catalog</a>
          <a href="#" class="menu-link" data-page="notes">blog</a>
          <a href="#" class="menu-link" data-page="index">home</a>
        </div>
      </div>
      <div class="promo__text-last">
        where it all began
      </div>
      <div class="promo__began-grid">
        <img src="/src/img/began/crafts-5276736_1280 1.jpg" class="promo__began-img" />
        <pre style="white-space: pre-wrap; text-align: left; margin: 0;">
Our small pottery workshop began as a simple passion project, rooted in a love for handmade artistry and traditional craftsmanship. What started with a single wheel and a few lumps of clay has grown into a cozy creative space where ideas take shape and stories are told through every piece. Inspired by timeless techniques and the beauty of natural materials, we've built a place where both beginners and experienced artists can come together, share their skills, and celebrate the art of pottery. Each creation reflects our journey—shaped by hand, fired with care, and made to be cherished.

Over the years, our workshop has become more than just a place to create—it's a community. Friends, families, and curious visitors gather here to learn, connect, and experience the joy of working with clay. From intimate masterclasses to collaborative projects, we believe in the power of handmade art to bring people together and spark creativity in unexpected ways.

Every piece that leaves our studio carries a bit of our story, blending tradition with personal expression. Whether it's a simple cup or an intricate vase, our ceramics are crafted to be both beautiful and functional, adding warmth and authenticity to any space.
        </pre>
      </div>
    </section>
    <section class="promo">
      <div class="promo__text">
        get in touch
      </div>
      <div class="promo__container-getIn-touch">
        <img src="/src/img/form/tea.jpg" alt="tea" />
        <div>
          <div class="promo__container-flex">
            <div>
              <h1>Name</h1>
              <input type="name" placeholder="Name" />
            </div>
            <div>
              <h1>Email</h1>
              <input type="email" placeholder="Email" />
            </div>
            <div class="promo__input-full">
              <h1>Your question</h1>
              <input type="Your question" placeholder="Question" class="promo__textarea" />
            </div>
          </div>
          <div class="promo__container-flex-vase">
            <div>
              <input type="checkbox" class="promo__checkbox" />
              I agree with the <span style="color: #A22DC6;">terms</span>
              <button class="btn-default">send request</button>
            </div>
            <div>
              <img src="/src/img/form/vase.png" alt="vase" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="promo__text-last">
        Find us
      </div>
      <div class="promo__map-container">
        <a href="https://yandex.by/maps/2/saint-petersburg/?utm_medium=mapframe&utm_source=maps"
          class="promo__map-link">Санкт‑Петербург</a>
        <a href="https://yandex.by/maps/2/saint-petersburg/house/kronverkskiy_prospekt_49/Z0kYdQZgSUQGQFtjfXV0d39lZw==/?ll=30.310011%2C59.956363&utm_medium=mapframe&utm_source=maps&z=16.87"
          class="promo__map-link promo__map-link-second">Навигатор онлайн: построение маршрута на
          карте — Яндекс Карты</a>
        <iframe
          src="https://yandex.by/map-widget/v1/?ll=30.310011%2C59.956363&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NzQxMjY4NRJa0KDQvtGB0YHQuNGPLCDQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQsywg0JrRgNC-0L3QstC10YDQutGB0LrQuNC5INC_0YDQvtGB0L_QtdC60YIsIDQ5IgoN6XryQRVR029C&z=16.87"
          class="promo__map-iframe" frameborder="1" allowfullscreen="true"></iframe>
      </div>
    </section>
    ${getFooterContent()}
  `;
}

function initNavigation() {
  document.addEventListener('click', async (e) => {
    const link = e.target.closest('a[data-page], .menu-link[data-page], .promo__footer-link-item[data-page]');
    if (link) {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page) {
        await navigateToPage(page);
      }
    }
    
    const footerLink = e.target.closest('.promo__footer-link-item');
    if (footerLink && footerLink.hasAttribute('href')) {
      const href = footerLink.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http')) {
        e.preventDefault();
        const page = href.replace('.html', '').replace('index.html', 'index').replace('/', '');
        if (page) {
          await navigateToPage(page || 'index');
        }
      }
    }
  });
  
  window.addEventListener('popstate', async (e) => {
    if (e.state && e.state.page) {
      await navigateToPage(e.state.page);
    }
  });
  
  document.addEventListener('click', async (e) => {
    const logo = e.target.closest('.header__logo');
    if (logo) {
      e.preventDefault();
      await navigateToPage('index');
    }
  });
}

export { initNavigation, navigateToPage, fetchPageContent };

