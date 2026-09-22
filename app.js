const data = [
  {
    title: "Обучение RKO",
    children: [
      {
        title: "Модуль 01 — Введение в RKO",
        children: [
          { title: "Урок 01 — Что такое RKO", body: [{ heading: "Что такое RKO" }, { text: "Это демонстрационный урок. На основной платформе здесь размещаются полноценные обучающие материалы: текст, изображения, видео, аудио и прикреплённые файлы." }, { text: "В демоверсии можно посмотреть структуру платформы, переходы между разделами и внешний вид готового урока." }] },
          { title: "Урок 02 — Откуда берутся выплаты", body: [{ heading: "Партнёрская модель" }, { text: "Пример материала о том, как устроены партнёрские выплаты и из каких этапов состоит работа." }] }
        ]
      },
      { title: "Модуль 02 — Начало работы", children: [{ title: "Урок 01 — Первые действия", body: [{ heading: "Начало работы" }, { text: "Пошаговый демонстрационный материал для нового ученика." }] }] }
    ]
  },
  {
    title: "Скрипты",
    children: [
      { title: "Первый диалог", children: [{ title: "Начало общения", body: [{ heading: "Первое сообщение" }, { text: "Пример структуры первого сообщения, вопросов и плавного перехода к дальнейшему разговору." }] }] },
      { title: "Созвон", children: [{ title: "Структура созвона", body: [{ heading: "План созвона" }, { text: "Подготовка, выявление ситуации и завершение разговора — всё собрано в одном демонстрационном уроке." }] }] }
    ]
  },
  {
    title: "База знаний",
    children: [
      { title: "Полезные материалы", children: [{ title: "Подборка статей", body: [{ heading: "Полезные материалы" }, { text: "Здесь могут находиться статьи, видео, памятки и дополнительные материалы по работе." }] }] },
      { title: "ИИ в работе", children: [{ title: "Практическое применение", body: [{ heading: "ИИ как инструмент" }, { text: "Пример урока об использовании искусственного интеллекта для текстов, анализа и подготовки материалов." }] }] }
    ]
  },
  { title: "Инструменты", children: [{ title: "Шаблоны и таблицы", children: [{ title: "Рабочие материалы", body: [{ heading: "Готовые инструменты" }, { text: "В этом разделе могут храниться шаблоны, таблицы, чек-листы и файлы для скачивания." }] }] }] }
];

const $ = (selector) => document.querySelector(selector);
const screens = [$("#loginScreen"), $("#welcomeScreen"), $("#dashboardScreen"), $("#noAdmin")];
const loginForm = $("#loginForm");
const loginInput = $("#login");
const passwordInput = $("#password");
const eyeButton = $("#eye");
const courseList = $("#list");
let path = [];
let transitionTimer;

function setScreen(active) {
  screens.forEach((screen) => screen.classList.toggle("is-active", screen === active));
}

function updateReadyState() {
  const ready = loginInput.value.trim().length > 0 && passwordInput.value.length > 0;
  loginForm.classList.toggle("is-ready", ready);
  eyeButton.classList.toggle("is-visible", passwordInput.value.length > 0);
}

window.setTimeout(() => $("#splash").classList.add("is-gone"), 4500);
loginInput.addEventListener("input", updateReadyState);
passwordInput.addEventListener("input", updateReadyState);
eyeButton.addEventListener("click", () => {
  const reveal = passwordInput.type === "password";
  passwordInput.type = reveal ? "text" : "password";
  eyeButton.setAttribute("aria-pressed", String(reveal));
  eyeButton.setAttribute("aria-label", reveal ? "Скрыть пароль" : "Показать пароль");
  passwordInput.focus({ preventScroll: true });
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!loginInput.value.trim() || !passwordInput.value) return;
  loginForm.classList.remove("is-ready");
  loginForm.classList.add("is-authenticated");
  window.setTimeout(() => {
    $("#success").classList.add("is-success");
    window.setTimeout(() => {
      loginForm.classList.add("is-success");
      window.setTimeout(() => {
        setScreen($("#welcomeScreen"));
        window.setTimeout(() => {
          setScreen($("#dashboardScreen"));
          render();
        }, 1350);
      }, 620);
    }, 300);
  }, 180);
});

function currentItems() {
  let items = data;
  path.forEach((index) => { items = items[index].children || []; });
  return items;
}

function currentTrail() {
  const trail = [];
  let items = data;
  path.forEach((index) => {
    trail.push(items[index].title);
    items = items[index].children || [];
  });
  return trail;
}

function render() {
  const browser = $("#browser");
  const article = $("#article");
  article.classList.remove("is-visible");
  article.setAttribute("aria-hidden", "true");
  browser.classList.remove("is-hidden");
  $("#pageTitle").classList.remove("is-reader-hidden");
  courseList.classList.add("is-changing");
  window.setTimeout(() => {
    courseList.innerHTML = "";
    $("#back").classList.toggle("is-visible", path.length > 0);
    $("#guide").textContent = path.length === 0 ? "ВЫБЕРИ РАЗДЕЛ, ЧТОБЫ ПЕРЕЙТИ К МОДУЛЯМ КУРСА." : path.length === 1 ? "ВЫБЕРИ МОДУЛЬ, ЧТОБЫ ПЕРЕЙТИ К УРОКАМ И МАТЕРИАЛАМ КУРСА." : "ВЫБЕРИ УРОК, ЧТОБЫ ПЕРЕЙТИ К МАТЕРИАЛАМ.";
    currentItems().forEach((item, index) => {
      const button = document.createElement("button");
      button.className = "course-row";
      button.type = "button";
      button.innerHTML = `<span class="course-number">[${String(index + 1).padStart(2, "0")}]</span><strong class="course-name"></strong><span class="course-state" aria-hidden="true"></span><span class="course-arrow">→</span>`;
      button.querySelector(".course-name").textContent = item.title;
      button.addEventListener("click", () => {
        button.classList.add("is-opening");
        window.setTimeout(() => {
          if (item.children) { path.push(index); render(); }
          else openArticle(item);
        }, 170);
      });
      courseList.appendChild(button);
    });
    courseList.classList.remove("is-changing");
  }, 90);
}

function openArticle(item) {
  $("#browser").classList.add("is-hidden");
  $("#pageTitle").classList.add("is-reader-hidden");
  const article = $("#article");
  $("#articlePath").textContent = currentTrail().join("  /  ");
  $("#articleTitle").textContent = item.title;
  const body = $("#articleBody");
  body.innerHTML = "";
  item.body.forEach((block) => {
    const section = document.createElement("section");
    section.className = "reader-block";
    if (block.heading) {
      const heading = document.createElement("h2");
      heading.textContent = block.heading;
      section.appendChild(heading);
    } else {
      const text = document.createElement("p");
      text.textContent = block.text;
      section.appendChild(text);
    }
    body.appendChild(section);
  });
  article.classList.add("is-visible");
  article.setAttribute("aria-hidden", "false");
}

$("#back").addEventListener("click", () => { if (path.length) { path.pop(); render(); } });
$("#articleBack").addEventListener("click", render);
$("#admin").addEventListener("click", () => {
  clearTimeout(transitionTimer);
  setScreen($("#noAdmin"));
  transitionTimer = window.setTimeout(() => setScreen($("#dashboardScreen")), 1600);
});
$("#logout").addEventListener("click", () => {
  path = [];
  loginForm.reset();
  loginForm.classList.remove("is-ready", "is-authenticated", "is-success");
  $("#success").classList.remove("is-success");
  eyeButton.classList.remove("is-visible");
  passwordInput.type = "password";
  setScreen($("#loginScreen"));
});

render();
