/* ============================================
   МИРОК НТ — Основной JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initHeaderScroll();
  initCountdown();
  initScrollAnimations();
});

/* --- Мобильное меню (бургер) --- */
function initBurgerMenu() {
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('mobile-menu--open');

    if (isOpen) {
      mobileMenu.classList.remove('mobile-menu--open');
      burger.classList.remove('burger--active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('mobile-menu--open');
      burger.classList.add('burger--active');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  // Закрываем меню при клике на ссылку
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('mobile-menu--open');
      burger.classList.remove('burger--active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* --- Шапка: эффект при прокрутке --- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Обратный отсчёт до ближайшего турнира --- */
function initCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minEl = document.getElementById('countdown-min');
  const secEl = document.getElementById('countdown-sec');

  if (!daysEl) return;

  // Ближайший турнир: среда 26 февраля 2026, 10:30 по Москве (UTC+3)
  const targetDate = new Date('2026-02-25T07:30:00Z'); // 10:30 MSK = 07:30 UTC

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minEl.textContent = '0';
      secEl.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minEl.textContent = minutes;
    secEl.textContent = seconds;
  }

  update();
  setInterval(update, 1000);
}

/* --- Анимации при прокрутке (IntersectionObserver) --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Каскадная задержка для элементов в одной группе
          setTimeout(() => {
            entry.target.classList.add('animate-on-scroll--visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}
