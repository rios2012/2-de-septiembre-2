/* ==========================================
   PARTÍCULAS - se conserva la Parte 1
   ========================================== */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];

const PARTICLE_COUNT = 115;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createParticles();
}

function randomParticle(startAtBottom = false) {
  return {
    x: Math.random() * width,
    y: startAtBottom
      ? height + Math.random() * height * .25
      : Math.random() * height,

    radius: Math.random() * 1.45 + .45,
    speed: Math.random() * .55 + .18,
    drift: (Math.random() - .5) * .22,
    alpha: Math.random() * .65 + .20,
    phase: Math.random() * Math.PI * 2,
    glow: Math.random() > .72
  };
}

function createParticles() {
  particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(
      randomParticle(i < PARTICLE_COUNT * .7)
    );
  }
}

function drawParticle(p, time) {
  const pulse =
    .82 + Math.sin(time * .0017 + p.phase) * .18;

  const alpha = Math.max(.08, p.alpha * pulse);

  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

  ctx.fillStyle = `rgba(242, 211, 35, ${alpha})`;

  if (p.glow) {
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(240, 210, 30, .65)";
  } else {
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(240, 210, 30, .30)";
  }

  ctx.fill();
}

function animate(time) {
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    p.y -= p.speed;

    p.x +=
      p.drift +
      Math.sin(time * .0008 + p.phase) * .035;

    if (p.y < -8) {
      p.x = Math.random() * width;
      p.y = height + Math.random() * height * .18;
    }

    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;

    drawParticle(p, time);
  }

  ctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);

resize();
requestAnimationFrame(animate);


/* ==========================================
   6 FOTOS + 6 MENSAJES
   ==========================================

   REEMPLAZA solamente las rutas de "image"
   cuando tengas tus 6 fotos.
*/

const messages = [
  {
    image: "fotos/foto1.svg",
    title: "Para ti 💛",
    text: "Un pequeño detalle para recordarte lo especial que eres."
  },
  {
    image: "fotos/foto2.svg",
    title: "Con mucho cariño 🌻",
    text: "Que estas flores iluminen tu día y te saquen una sonrisa."
  },
  {
    image: "fotos/foto3.svg",
    title: "Una sonrisa para ti ✨",
    text: "Espero que este detalle haga tu día un poquito más bonito."
  },
  {
    image: "fotos/foto4.svg",
    title: "Siempre especial 💛",
    text: "Hay personas que hacen más bonitos los días simplemente estando."
  },
  {
    image: "fotos/foto5.svg",
    title: "Para alguien bonita 🌼",
    text: "Que nunca te falten motivos para sonreír y momentos felices."
  },
  {
    image: "fotos/foto6.svg",
    title: "Feliz día 🌻",
    text: "Estas flores son un pequeño recuerdo de lo mucho que vales."
  }
];

const messageButton = document.getElementById("messageButton");
const messageViewer = document.getElementById("messageViewer");
const closeViewer = document.getElementById("closeViewer");

const photo = document.getElementById("photo");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");

const previous = document.getElementById("previous");
const next = document.getElementById("next");
const indicators = document.getElementById("indicators");

let currentPhoto = 0;

function buildIndicators() {
  indicators.innerHTML = "";

  messages.forEach((_, index) => {
    const dot = document.createElement("span");

    dot.className =
      "indicator" +
      (index === currentPhoto ? " active" : "");

    dot.addEventListener("click", () => {
      currentPhoto = index;
      showMessage();
    });

    indicators.appendChild(dot);
  });
}

function showMessage() {
  const item = messages[currentPhoto];

  photo.style.opacity = "0";
  photo.style.transform = "scale(.97)";

  setTimeout(() => {
    photo.src = item.image;
    photo.alt = `Foto ${currentPhoto + 1}`;
    messageTitle.textContent = item.title;
    messageText.textContent = item.text;

    photo.style.opacity = "1";
    photo.style.transform = "scale(1)";
  }, 120);

  buildIndicators();
}

function openMessages() {
  currentPhoto = 0;
  showMessage();

  messageViewer.classList.add("open");
  messageViewer.setAttribute("aria-hidden", "false");
}

function closeMessages() {
  messageViewer.classList.remove("open");
  messageViewer.setAttribute("aria-hidden", "true");
}

messageButton.addEventListener("click", openMessages);
closeViewer.addEventListener("click", closeMessages);

previous.addEventListener("click", () => {
  currentPhoto =
    (currentPhoto - 1 + messages.length) %
    messages.length;

  showMessage();
});

next.addEventListener("click", () => {
  currentPhoto =
    (currentPhoto + 1) %
    messages.length;

  showMessage();
});

/* Cerrar tocando fuera de la tarjeta */
messageViewer.addEventListener("click", (event) => {
  if (event.target === messageViewer) {
    closeMessages();
  }
});

/* Teclado */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMessages();
  }

  if (!messageViewer.classList.contains("open")) return;

  if (event.key === "ArrowRight") {
    currentPhoto =
      (currentPhoto + 1) % messages.length;

    showMessage();
  }

  if (event.key === "ArrowLeft") {
    currentPhoto =
      (currentPhoto - 1 + messages.length) %
      messages.length;

    showMessage();
  }
});

/* Deslizar en celular */
let touchStartX = 0;

document
  .querySelector(".viewer-card")
  .addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

document
  .querySelector(".viewer-card")
  .addEventListener("touchend", (event) => {
    const difference =
      event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(difference) < 45) return;

    if (difference < 0) {
      currentPhoto =
        (currentPhoto + 1) % messages.length;
    } else {
      currentPhoto =
        (currentPhoto - 1 + messages.length) %
        messages.length;
    }

    showMessage();
  }, { passive: true });
