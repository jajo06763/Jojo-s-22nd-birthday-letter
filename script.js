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

      // handle line breaks properly
      if (text[i] === "\n") {
        element.innerHTML += "<br>";
      } else {
        element.innerHTML += text[i];
      }

      i++;
      setTimeout(type, speed);

    } else {
      if (callback) callback();
    }
  }

  type();
}

/* =========================
   PAGE SYSTEM + TYPING
========================= */

function showPage(index) {
  pages.forEach(p => p.classList.remove("active"));
  pages[index].classList.add("active");

  counter.innerHTML = (index + 1) + " / " + pages.length;

  window.scrollTo({ top: 0, behavior: "smooth" });

  const activePage = pages[index];

  const paragraphs = Array.from(activePage.querySelectorAll("p"));

  // skip UI / puzzle / special captions
  const filtered = paragraphs.filter(p =>
    !p.closest(".buttons") &&
    p.id !== "videoText" &&
    p.id !== "videoTextFinal"
  );

  // store original text
  filtered.forEach(p => {
   if (!p.dataset.fulltext) {
 p.dataset.fulltext = p.innerHTML
  .replace(/<br\s*\/?>/gi, "\n");
    }
    p.innerHTML = "";
  });

  // TYPE SEQUENTIALLY
  function typeNext(i) {
    if (i >= filtered.length) return;

    const el = filtered[i];
    const text = el.dataset.fulltext;

    typeWriter(el, text, 18, () => {
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
   EYE TRANSFORMATION
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

function goToVideo() {
  nextPage();
}

/* ✨ sparkle effect */
function spawnSparkles(container) {
  for (let i = 0; i < 18; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";

    sparkle.style.left = Math.random() * 180 + "px";
    sparkle.style.top = Math.random() * 180 + "px";

    container.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1200);
  }
}

/* =========================
   EYE ZOOM
========================= */

function zoomIntoEye() {
  const zoom = document.getElementById("eyeZoom");

  zoom.classList.remove("hidden");
  zoom.classList.add("show");

  setTimeout(() => {

    zoom.classList.remove("show");
    zoom.classList.add("hide");

    setTimeout(() => {

      nextPage();

      // reset video puzzle when arriving
      const video = document.getElementById("videoContainer");
      const btn = document.getElementById("continueBtn");

      if (video) {
        video.style.display = "none";
      }

      if (btn) {
        btn.style.display = "none";
      }

    }, 800);

  }, 1500);
}
/* =========================
   PUZZLE SYSTEM
========================= */

let draggedShape = null;
let selectedShape = null;

document.addEventListener("DOMContentLoaded", () => {

  const shapes = document.querySelectorAll(".shape");
  const dropZone = document.getElementById("dropZone");

  if (!dropZone) return;

  // =========================
  // DESKTOP DRAG (unchanged)
  // =========================
  shapes.forEach(shape => {
    shape.addEventListener("dragstart", (e) => {
      draggedShape = e.target.dataset.shape;
    });

    // =========================
    // MOBILE TAP SELECT
    // =========================
    shape.addEventListener("click", () => {
      selectedShape = shape.dataset.shape;

      // small visual feedback
      shapes.forEach(s => s.classList.remove("selected"));
      shape.classList.add("selected");
    });
  });

  // allow drop (desktop)
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  // desktop drop
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();

    if (draggedShape === "heart") {
      unlockVideoPuzzle();
    } else {
      dropZone.style.transform = "scale(0.95)";
      setTimeout(() => dropZone.style.transform = "scale(1)", 200);
    }
  });

  // =========================
  // MOBILE TAP DROP
  // =========================
  dropZone.addEventListener("click", () => {

    const shapeToCheck = selectedShape || draggedShape;

    if (shapeToCheck === "heart") {
      unlockVideoPuzzle();
    } else {
      dropZone.style.transform = "scale(0.95)";
      setTimeout(() => dropZone.style.transform = "scale(1)", 200);
    }
  });

});
/* =========================
   UNLOCK VIDEO
========================= */

function unlockVideoPuzzle() {
  const dropZone = document.getElementById("dropZone");

  const text1 = document.getElementById("videoText");
  const text2 = document.getElementById("videoTextFinal");
  const video = document.getElementById("videoContainer");
  const btn = document.getElementById("continueBtn");

  if (!dropZone) return;

  dropZone.classList.add("filled");
  dropZone.innerHTML = "💖";
  dropZone.style.transform = "scale(1.15)";

  setTimeout(() => {
    dropZone.style.transform = "scale(1)";
  }, 300);

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

    const piece = document.createElement("div");

    piece.className = "confetti";

    piece.style.left = Math.random() * 100 + "vw";
    piece.style.animationDuration =
      (Math.random() * 3 + 2) + "s";

    piece.style.transform =
      "rotate(" + Math.random() * 360 + "deg)";

    document.body.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 5000);

  }
}