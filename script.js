// --- FONDO MATRIX ---
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
    if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975)
      rainDrops[i] = 0;
    rainDrops[i]++;
  }
};
setInterval(draw, 30);

// --- NAVEGACIÓN ---
const welcomeScreen = document.getElementById("welcomeScreen");
const editorScreen = document.getElementById("editorScreen");
const btnAprender = document.getElementById("btnAprender");

btnAprender.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  editorScreen.classList.remove("hidden");
  updatePreview(); // Inicializa el preview
});

// --- LÓGICA DEL EDITOR ---
const tabs = document.querySelectorAll(".tab");
const inputs = document.querySelectorAll(".code-input");
const htmlInput = document.getElementById("htmlCode");
const cssInput = document.getElementById("cssCode");
const jsInput = document.getElementById("jsCode");
const preview = document.getElementById("preview");

// Cambio de pestañas (HTML/CSS/JS)
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    inputs.forEach((i) => i.classList.add("hidden"));

    tab.classList.add("active");
    const lang = tab.getAttribute("data-lang");
    document.getElementById(`${lang}Code`).classList.remove("hidden");
  });
});

// Actualización en tiempo real
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

// Escuchar cambios en los textareas
[htmlInput, cssInput, jsInput].forEach((el) => {
  el.addEventListener("input", updatePreview);
});

// Manejo de ventana
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
