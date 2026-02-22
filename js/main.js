/* ============================================
   МИРОК НТ — Основной JavaScript
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initBurgerMenu();
  initHeaderScroll();
  initCountdown();
  initScrollAnimations();
  initAccordion();
  initTournamentFilter();
  initRegisterForm();
  initQuiz();
  initLightbox();
  initBookingModal();
  initHeroVideo();
});

/* --- Мобильное меню (бургер) --- */
function initBurgerMenu() {
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!burger || !mobileMenu) return;

  burger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("mobile-menu--open");

    if (isOpen) {
      mobileMenu.classList.remove("mobile-menu--open");
      burger.classList.remove("burger--active");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    } else {
      mobileMenu.classList.add("mobile-menu--open");
      burger.classList.add("burger--active");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  });

  // Закрываем меню при клике на ссылку
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("mobile-menu--open");
      burger.classList.remove("burger--active");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

/* --- Hero-видео: постер поверх видео, пока оно не начнёт играть --- */
function initHeroVideo() {
  const video = document.getElementById("heroVideo");
  const poster = document.getElementById("heroPoster");
  if (!video || !poster) return;

  video.addEventListener("playing", () => {
    poster.classList.add("hero__poster--hidden");
  });
}

/* --- Шапка: эффект при прокрутке --- */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* --- Обратный отсчёт до ближайшего турнира --- */
function initCountdown() {
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minEl = document.getElementById("countdown-min");
  const secEl = document.getElementById("countdown-sec");

  if (!daysEl) return;

  // Ближайший турнир: среда 25 февраля 2026, 10:30 по Москве (UTC+3)
  const targetDate = new Date("2026-02-25T07:30:00Z"); // 10:30 MSK = 07:30 UTC

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = "0";
      hoursEl.textContent = "0";
      minEl.textContent = "0";
      secEl.textContent = "0";
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
  const elements = document.querySelectorAll(".animate-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Каскадная задержка для элементов в одной группе
          setTimeout(() => {
            entry.target.classList.add("animate-on-scroll--visible");
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  elements.forEach((el) => observer.observe(el));
}

/* --- Аккордеон (правила, FAQ) --- */
function initAccordion() {
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains("accordion-item--open");
      const expanded = !isOpen;

      item.classList.toggle("accordion-item--open");
      header.setAttribute("aria-expanded", expanded);
    });
  });
}

/* --- Фильтр турниров --- */
function initTournamentFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".archive-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");

      cards.forEach((card) => {
        if (filter === "all" || card.dataset.month === filter) {
          card.classList.remove("archive-card--hidden");
        } else {
          card.classList.add("archive-card--hidden");
        }
      });
    });
  });
}

/* --- Форма регистрации --- */
function initRegisterForm() {
  const form = document.getElementById("registerForm");
  const success = document.getElementById("formSuccess");
  if (!form || !success) return;

  function showError(input, message) {
    input.classList.add("form-input--error");
    let errorEl = input.parentElement.querySelector(".form-error");
    if (!errorEl) {
      errorEl = document.createElement("p");
      errorEl.className = "form-error";
      input.after(errorEl);
    }
    errorEl.textContent = message;
    errorEl.classList.add("form-error--visible");
  }

  function clearErrors() {
    form.querySelectorAll(".form-input--error").forEach((el) => {
      el.classList.remove("form-input--error");
    });
    form.querySelectorAll(".form-error").forEach((el) => {
      el.classList.remove("form-error--visible");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const fullname = form.querySelector("#fullname");
    const contact = form.querySelector("#contact");
    const agree = form.querySelector("#agree");
    let hasError = false;

    if (!fullname.value.trim()) {
      showError(fullname, "Укажите ваше ФИО");
      if (!hasError) fullname.focus();
      hasError = true;
    }
    if (!contact.value.trim()) {
      showError(contact, "Укажите Telegram или телефон для связи");
      if (!hasError) contact.focus();
      hasError = true;
    }
    if (!agree.checked) {
      const checkbox = agree.closest(".form-checkbox");
      if (checkbox) checkbox.style.outline = "2px solid var(--color-error)";
      if (!hasError) agree.focus();
      hasError = true;
    }

    if (hasError) return;

    // Отправляем данные через fetch
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          form.style.display = "none";
          success.classList.add("form-success--visible");
        } else {
          throw new Error("Ошибка сервера");
        }
      })
      .catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить заявку";
        showError(
          fullname,
          "Не удалось отправить заявку. Проверьте интернет и попробуйте ещё раз.",
        );
      });
  });
}

/* --- Тест на знание правил --- */
function initQuiz() {
  const container = document.getElementById("quizContainer");
  const submitBtn = document.getElementById("quizSubmit");
  const resultDiv = document.getElementById("quizResult");
  const scoreEl = document.getElementById("quizScore");
  const messageEl = document.getElementById("quizMessage");
  const retryBtn = document.getElementById("quizRetry");

  if (!container || !submitBtn) return;

  submitBtn.addEventListener("click", () => {
    const questions = container.querySelectorAll(".quiz-question");
    let score = 0;
    let allAnswered = true;

    questions.forEach((q, i) => {
      const correct = q.dataset.correct;
      const selected = q.querySelector(`input[name="q${i + 1}"]:checked`);

      // Сброс стилей
      q.querySelectorAll(".quiz-option").forEach((opt) => {
        opt.classList.remove("quiz-option--correct", "quiz-option--wrong");
      });

      if (!selected) {
        allAnswered = false;
        return;
      }

      const selectedOption = selected.closest(".quiz-option");

      if (selected.value === correct) {
        score++;
        selectedOption.classList.add("quiz-option--correct");
      } else {
        selectedOption.classList.add("quiz-option--wrong");
        // Подсветка правильного ответа
        q.querySelectorAll(".quiz-option").forEach((opt) => {
          const radio = opt.querySelector("input");
          if (radio.value === correct) {
            opt.classList.add("quiz-option--correct");
          }
        });
      }
    });

    if (!allAnswered) return;

    // Блокировка ответов
    container
      .querySelectorAll('input[type="radio"]')
      .forEach((r) => (r.disabled = true));
    submitBtn.style.display = "none";

    scoreEl.textContent = score + "/5";
    if (score === 5) {
      messageEl.textContent = "Отлично! Вы знаете правила на 100%!";
    } else if (score >= 3) {
      messageEl.textContent = "Хороший результат! Но есть что повторить.";
    } else {
      messageEl.textContent =
        "Стоит подучить правила. Загляните на страницу «Правила»!";
    }
    resultDiv.classList.add("quiz-result--visible");
  });

  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      container.querySelectorAll('input[type="radio"]').forEach((r) => {
        r.disabled = false;
        r.checked = false;
      });
      container.querySelectorAll(".quiz-option").forEach((opt) => {
        opt.classList.remove("quiz-option--correct", "quiz-option--wrong");
      });
      submitBtn.style.display = "";
      resultDiv.classList.remove("quiz-result--visible");
    });
  }
}

/* --- Лайтбокс для изображений --- */
function initLightbox() {
  const items = document.querySelectorAll("[data-lightbox]");
  if (!items.length) return;

  // Создаём lightbox-элемент
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML =
    '<button class="lightbox__close" aria-label="Закрыть">&times;</button>' +
    '<img class="lightbox__img" src="" alt="">';
  document.body.appendChild(lightbox);

  const img = lightbox.querySelector(".lightbox__img");
  const closeBtn = lightbox.querySelector(".lightbox__close");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.dataset.lightbox;
      img.src = src;
      const itemImg = item.querySelector("img");
      img.alt = itemImg ? itemImg.alt : "";
      lightbox.classList.add("lightbox--open");
      document.body.style.overflow = "hidden";
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove("lightbox--open");
    document.body.style.overflow = "";
    img.src = "";
  }
}

/* --- Модальное окно записи на занятие --- */
function initBookingModal() {
  const openBtn = document.getElementById("openBookingModal");
  const modal = document.getElementById("bookingModal");
  if (!openBtn || !modal) return;

  const form = document.getElementById("bookingForm");
  const success = document.getElementById("bookingSuccess");

  function openModal() {
    modal.classList.add("modal--open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("modal--open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openModal);

  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("modal--open")) {
      closeModal();
    }
  });

  if (form && success) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#booking-name");
      const contact = form.querySelector("#booking-contact");

      if (!name.value.trim()) {
        name.focus();
        return;
      }
      if (!contact.value.trim()) {
        contact.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправка...";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            form.style.display = "none";
            success.style.display = "";
          } else {
            throw new Error("Ошибка");
          }
        })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Отправить заявку";
        });
    });
  }
}
