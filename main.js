const heroBlocks = document.querySelectorAll(".js-hero-block");
const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {
    const cord = window.scrollY;

    if (cord > window.innerHeight * 3) {
        heroBlocks[0].classList.remove("active");
        heroBlocks[1].classList.add("active");
        hero.classList.add("active");
    } else {
        heroBlocks[1].classList.remove("active");
        heroBlocks[0].classList.add("active");
        hero.classList.remove("active");
    }
});

// loader
var animationData = {
    container: document.getElementById("lottie-container"),
    renderer: "svg", // или 'canvas' или 'html'
    loop: true, // true или false
    autoplay: true, // true или false
    path: "lotties/loader.json", // Путь к вашему JSON-файлу
};

// Инициализируйте анимацию
var anim = lottie.loadAnimation(animationData);

// work with form
const form = document.querySelector(".js-form");
const loader = document.querySelector(".js-loader");
const success = document.querySelector(".js-success");

setInterval(() => {
    loader.classList.remove("active");
}, 1100);

form.addEventListener("submit", (event) => {
    event.preventDefault();
    loader.classList.add("active");
    document.body.classList.add("is-loader");

    const scriptURL =
        "https://script.google.com/macros/s/AKfycbxu7MR_X6JxodmETeylftvdEjI_aoX0tmGUDde0uvWYP78PrcqPTkceSBP6ZGBE-7mz/exec";

    const dataTime = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    document.querySelector(".js-form-date").value = dataTime;

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
        .then((response) => {
            console.log("Success!", response);
            loader.classList.remove("active");
            document.body.classList.remove("is-loader");
            success.classList.add("active");

            setTimeout(() => {
                success.classList.remove("active");
            }, 3500);
            form.reset();
        })
        .catch((error) => {
            console.error("Error!", error.message);
        });
});

// timer
const targetDate = new Date("2024-09-28T11:00:00+02:00").getTime();
const timerElement = document.querySelector(".date__timer");

function updateTimer() {
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    if (timeRemaining <= 0) {
        timerElement.textContent = "00:00:00:00";
        clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Форматируем и обновляем текст таймера
    timerElement.textContent = `${days.toString().padStart(2, "0")}:${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
}

const countdownInterval = setInterval(updateTimer, 1000);
updateTimer();

const isChrome = () => {
    return (
        /Chrome/.test(navigator.userAgent) &&
        !/Edg/.test(navigator.userAgent) &&
        !/OPR/.test(navigator.userAgent)
    );
};

const isSafari = () => {
    return (
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent) &&
        !/Edg/.test(navigator.userAgent) &&
        !/OPR/.test(navigator.userAgent)
    );
};

const isTelegram = () => {
    return (
        /Telegram/.test(navigator.userAgent) ||
        /TELEGRAM/.test(navigator.userAgent)
    );
};

// Выполняем код только в Chrome и Safari
if (!isTelegram() && (isChrome() || isSafari())) {
    const titles = document.querySelectorAll(".title");

    // Настройки для IntersectionObserver
    const options = {
        root: null, // Используем окно браузера как контейнер
        threshold: 0.1, // 10% заголовка должны быть видны, чтобы начать анимацию
    };

    // Функция анимации печатания текста
    const typeTextAnimation = (element) => {
        const lines = element.innerHTML.split("<br>"); // Разделяем текст на строки по тегу <br>
        element.innerHTML = ""; // Очищаем заголовок

        // Добавляем строки обратно как элементы span
        let totalDuration = 0; // Общая продолжительность анимации всех строк

        lines.forEach((line, index) => {
            const span = document.createElement("span"); // Создаем новый элемент строки
            span.textContent = line.trim(); // Добавляем текст строки
            element.appendChild(span); // Добавляем span в заголовок

            const lineDuration = 0.6; // Длительность анимации печати каждой строки (в секундах)

            // Анимация с использованием GSAP
            gsap.fromTo(
                span,
                { width: 0, opacity: 1 }, // Начальное состояние: ширина 0 и видимость
                {
                    width: span.scrollWidth, // Конечная ширина - полная ширина текста
                    duration: lineDuration, // Длительность анимации печати
                    ease: "linear", // Линейная анимация
                    delay: totalDuration, // Динамическая задержка для последовательного печатания
                    onStart: () => {
                        // Удаляем мигающий курсор со всех строк
                        element
                            .querySelectorAll("span")
                            .forEach((s) => s.classList.remove("blinking"));
                        // Добавляем мигающий курсор на текущую строку
                        span.classList.add("blinking");
                    },
                    onComplete: () => {
                        // Убираем мигающий курсор после завершения печати последней строки
                        if (index === lines.length - 1) {
                            span.classList.remove("blinking");
                        }
                    },
                }
            );

            // Обновляем общую продолжительность для следующей строки
            totalDuration += lineDuration;
        });
    };

    // Инициализируем IntersectionObserver
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                typeTextAnimation(element); // Запускаем анимацию
                observer.unobserve(element); // Убираем наблюдателя после начала анимации
            }
        });
    }, options);

    // Наблюдаем за всеми заголовками
    titles.forEach((title) => {
        observer.observe(title);
    });

    const texts = document.querySelectorAll(".text");

    // Настройки для IntersectionObserver
    const options2 = {
        root: null, // Используем окно браузера как контейнер
        threshold: 0.1, // 10% элемента должны быть видны, чтобы начать анимацию
    };

    // Функция для запуска анимации появления
    const fadeInAnimation = (element) => {
        element.classList.add("visible"); // Добавляем класс, который запускает анимацию
    };

    // Инициализируем IntersectionObserver
    const observer2 = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                fadeInAnimation(element); // Запускаем анимацию
                observer2.unobserve(element); // Убираем наблюдателя после начала анимации
            }
        });
    }, options2);

    // Наблюдаем за всеми элементами с классом text
    texts.forEach((text) => {
        observer2.observe(text);
    });
}

var swiper = new Swiper(".swiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
