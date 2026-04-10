// =============================
// FONDO MATRIX
// =============================
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const alphabet = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fontSize = 16;
const columns = canvas.width / fontSize;
const rainDrops = Array.from({ length: columns }).fill(1);

const draw = () => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < rainDrops.length; i++) {
    const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

    if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      rainDrops[i] = 0;
    }

    rainDrops[i]++;
  }
};

let lastTime = 0;
const fps = 30; // 👈 cambia este valor

function animate(time) {
  if (time - lastTime > 1000 / fps) {
    draw();
    lastTime = time;
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// =============================
// NAVEGACIÓN
// =============================
const welcomeScreen = document.getElementById("welcomeScreen");
const editorScreen = document.getElementById("editorScreen");
const btnAprender = document.getElementById("btnAprender");

btnAprender.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  editorScreen.classList.remove("hidden");
  updatePreview();
});

// =============================
// EDITOR BASE
// =============================
const tabs = document.querySelectorAll(".tab");
const inputs = document.querySelectorAll(".code-input");

const htmlInput = document.getElementById("htmlCode");
const cssInput = document.getElementById("cssCode");
const jsInput = document.getElementById("jsCode");

const preview = document.getElementById("preview");

// CAMBIO DE PESTAÑAS
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    inputs.forEach((i) => i.classList.add("hidden"));

    tab.classList.add("active");
    const lang = tab.getAttribute("data-lang");
    document.getElementById(`${lang}Code`).classList.remove("hidden");
  });
});

// =============================
// 🔥 DEBOUNCE (SOLUCIÓN)
// =============================
let debounceTimer;

function updatePreviewDebounced() {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    updatePreview();
  }, 600);
}

// =============================
// PREVIEW
// =============================
function updatePreview() {
  const html = htmlInput.value;
  const css = `<style>${cssInput.value}</style>`;
  const js = `<script>${jsInput.value}<\/script>`;

  const content = `
    <!DOCTYPE html>
    <html>
      <head>${css}</head>
      <body>
        ${html}
        ${js}
      </body>
    </html>
  `;

  const dest = preview.contentDocument || preview.contentWindow.document;
  dest.open();
  dest.write(content);
  dest.close();
}

// ⚠️ ahora usa debounce
[htmlInput, cssInput, jsInput].forEach((el) => {
  el.addEventListener("input", () => {
    // 🔥 detectar <hr> y actualizar inmediato
    if (el.id === "htmlCode" && el.value.includes("<hr")) {
      updatePreview();
      return;
    }

    updatePreviewDebounced();
  });
});

// =============================
// NUEVAS FUNCIONALIDADES
// =============================

// TAGS HTML
const htmlTags = [
  "html",
  "head",
  "body",
  "title",
  "meta",
  "link",
  "style",
  "script",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "div",
  "section",
  "article",
  "header",
  "footer",
  "nav",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "button",
  "input",
  "form",
  "label",
  "textarea",
  "table",
  "tr",
  "td",
  "th",
  "thead",
  "tbody",
  "br",
  "hr",
];

// TAGS SIN CIERRE (VOID)
const voidTags = ["br", "hr", "img", "input", "meta", "link"];

// AUTO-CIERRE BRACKETS
function autoCloseBrackets(e) {
  const pairs = {
    "(": ")",
    "{": "}",
    "[": "]",
    '"': '"',
    "'": "'",
  };

  if (pairs[e.key]) {
    e.preventDefault();

    const start = this.selectionStart;
    const end = this.selectionEnd;

    this.value =
      this.value.substring(0, start) +
      e.key +
      pairs[e.key] +
      this.value.substring(end);

    this.selectionStart = this.selectionEnd = start + 1;
  }
}

// TAB: AUTOCOMPLETADO + INDENTACIÓN
function handleTab(e) {
  if (e.key !== "Tab") return;

  const textarea = e.target;
  const start = textarea.selectionStart;
  const value = textarea.value;

  const beforeCursor = value.substring(0, start);
  const lastWordMatch = beforeCursor.match(/(\w+)$/);

  if (textarea.id === "htmlCode" && lastWordMatch) {
    const word = lastWordMatch[1];

    if (htmlTags.includes(word)) {
      e.preventDefault();

      let tag;

      if (voidTags.includes(word)) {
        const cleanWord = word.toLowerCase();
        tag = `<${cleanWord}>`;

        textarea.value =
          value.substring(0, start - word.length) +
          tag +
          value.substring(start);

        textarea.selectionStart = textarea.selectionEnd =
          start - word.length + tag.length;

        return;
      }

      tag = `<${word}></${word}>`;

      const newStart = start - word.length;

      textarea.value =
        value.substring(0, newStart) + tag + value.substring(start);

      textarea.selectionStart = textarea.selectionEnd =
        newStart + word.length + 2;

      return;
    }
  }

  // INDENTACIÓN
  e.preventDefault();

  textarea.value = value.substring(0, start) + "\t" + value.substring(start);

  textarea.selectionStart = textarea.selectionEnd = start + 1;
}

// EVENTOS
[htmlInput, cssInput, jsInput].forEach((el) => {
  el.addEventListener("keydown", autoCloseBrackets);
  el.addEventListener("keydown", handleTab);
});

// =============================
// RESPONSIVE CANVAS
// =============================
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
