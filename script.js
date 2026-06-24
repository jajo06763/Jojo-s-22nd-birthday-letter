let current = 0;

const pages = document.querySelectorAll(".page");
const counter = document.querySelector(".counter");

/* =========================
   TYPEWRITER ENGINE
========================= */

function typeWriter(element, text, speed = 20, callback) {
  element.innerHTML = "";
  let i = 0;

  function type() {
    if (i < text.length) {
      element.innerHTML += text[i] === "\n" ? "<br>" : text[i];
      i++;
      setTimeout(type, speed);
    } else {
      if (callback) callback();
    }
  }

  type();
}

/* =========================
   PAGE SYSTEM
========================= */

function showPage(index) {
  pages.forEach(p => p.classList.remove("active"));
  pages[index].classList.add("active");

  counter.innerHTML = (index + 1) + " / " + pages.length;

  window.scrollTo({ top: 0, behavior: "smooth" });

  const activePage = pages[index];

  const paragraphs = Array.from(activePage.querySelectorAll("p"));

  const filtered = paragraphs.filter(p =>
    !p.closest(".buttons") &&
    p.id !== "videoText" &&
    p.id !== "videoTextFinal"
  );

  filtered.forEach(p => {
    if (!p.dataset.fulltext) {
      p.dataset.fulltext = p.innerHTML.replace(/<br\s*\/?>/gi, "\n");
    }
    p.innerHTML = "";
  });

  function typeNext(i) {
    if (i >= filtered.length) return;

    const el = filtered[i];
    typeWriter(el, el.dataset.fulltext, 18, () => {
      setTimeout(() => typeNext(i + 1), 250);
    });
  }

  typeNext(0);
}

function nextPage() {
  if (current < pages.length - 1) {
    current++;
    showPage(current);

    if (current === pages.length - 1) {
      startConfetti();
    }
  }
}

function prevPage() {
  if (current > 0) {
    current--;
    showPage(current);
  }
}

/* =========================
   EYE ANIMATION (WORKING)
========================= */

function transformEye() {
  const eye = document.getElementById("eye");
  const btn = document.getElementById("enterBtn");

  eye.classList.add("happy");

  spawnSparkles(eye);

  setTimeout(() => {
    btn.style.display = "inline-block";
  }, 1200);
}

function spawnSparkles(container) {
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = Math.random() * 180 + "px";
    s.style.top = Math.random() * 180 + "px";
    container.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
}

function zoomIntoEye() {
  const zoom = document.getElementById("eyeZoom");

  if (!zoom) return;

  // freeze current page so it doesn't "skip"
  document.querySelector(".book").style.pointerEvents = "none";

  zoom.classList.remove("hidden");
  zoom.classList.add("show");

  setTimeout(() => {

    zoom.classList.remove("show");
    zoom.classList.add("hide");

    setTimeout(() => {

      // re-enable interaction
      document.querySelector(".book").style.pointerEvents = "auto";

      nextPage();

    }, 700);

  }, 1500);
}

/* =========================
   PUZZLE (MOBILE + DESKTOP FIXED)
========================= */

let draggedShape = null;
let selectedShape = null;

document.addEventListener("DOMContentLoaded", () => {

  const shapes = document.querySelectorAll(".shape");
  const dropZone = document.getElementById("dropZone");

  if (!dropZone) return;

  shapes.forEach(shape => {

    shape.addEventListener("dragstart", (e) => {
      draggedShape = e.target.dataset.shape;
    });

    shape.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedShape = shape.dataset.shape;

      shapes.forEach(s => s.classList.remove("selected"));
      shape.classList.add("selected");
    });

  });

  dropZone.addEventListener("dragover", e => e.preventDefault());

  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    checkPuzzle();
  });

  dropZone.addEventListener("click", () => {
    checkPuzzle();
  });

});

function checkPuzzle() {
  const active = selectedShape || draggedShape;

  if (active === "heart") {
    unlockVideoPuzzle();
    if (navigator.vibrate) navigator.vibrate(40);
  } else {
    shake(document.getElementById("dropZone"));
  }
}

function shake(el) {
  el.style.transform = "scale(0.95) rotate(-2deg)";
  setTimeout(() => {
    el.style.transform = "scale(1)";
  }, 200);
}

/* =========================
   VIDEO UNLOCK
========================= */

function unlockVideoPuzzle() {
  const dropZone = document.getElementById("dropZone");

  const text1 = document.getElementById("videoText");
  const text2 = document.getElementById("videoTextFinal");
  const video = document.getElementById("videoContainer");
  const btn = document.getElementById("continueBtn");

  dropZone.classList.add("filled");
  dropZone.innerHTML = "💖";

  if (text1) text1.style.display = "none";
  if (text2) text2.style.display = "block";

  setTimeout(() => {
    if (video) video.style.display = "block";
  }, 600);

  setTimeout(() => {
    if (btn) btn.style.display = "inline-block";
  }, 900);
}

/* =========================
   CONFETTI
========================= */

function startConfetti() {
  for (let i = 0; i < 80; i++) {
    const c = document.createElement("div");
    c.className = "confetti";

    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDuration = (Math.random() * 3 + 2) + "s";

    document.body.appendChild(c);

    setTimeout(() => c.remove(), 5000);
  }
}