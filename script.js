// ====== Funciones de color ======
function colorRandom() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
}

function rgbToHex({ r, g, b }) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;

  if(max === min){ h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = ((g-b)/d + (g<b?6:0)); break;
      case g: h = ((b-r)/d + 2); break;
      case b: h = ((r-g)/d + 4); break;
    }
    h *= 60;
  }

  return `hsl(${Math.round(h)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
}

// ====== Crear cada color ======
function crearColor() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('color-wrapper');

  const div = document.createElement('div');
  div.classList.add('color-box');
  div.setAttribute("data-locked", "false");

  const rgb = colorRandom();
  div.dataset.rgb = JSON.stringify(rgb);
  div.style.backgroundColor = rgbToHex(rgb);

  // Candado dentro del color
  div.innerHTML = `<button class="lock-btn">🔓</button>`;

  // Código debajo del color
  const codigo = document.createElement('div');
  codigo.classList.add('codigo-texto');
  codigo.textContent = rgbToHex(rgb);

  // Click en color para copiar
  div.addEventListener("click", (e) => {
  const btn = div.querySelector(".lock-btn");
    if (e.target === btn) return;

    const formato = document.getElementById("formato").value;
    const rgbActual = JSON.parse(div.dataset.rgb);
    const color = formato === "hex" ? rgbToHex(rgbActual) : rgbToHsl(rgbActual);

    navigator.clipboard.writeText(color);

    codigo.textContent = "¡Copiado!👍";
    setTimeout(() => { codigo.textContent = color; }, 1000);
  });

  wrapper.appendChild(div);
  wrapper.appendChild(codigo);
  return wrapper;
}

// ====== Cambiar formato ======
function cambiarFormato() {
  const formato = document.getElementById("formato").value;
  const contenedor = document.getElementById("paleta");

  contenedor.querySelectorAll(".color-wrapper").forEach(wrapper => {
    const div = wrapper.querySelector(".color-box");
    const codigo = wrapper.querySelector(".codigo-texto");
    const rgb = JSON.parse(div.dataset.rgb);
    const texto = formato === "hex" ? rgbToHex(rgb) : rgbToHsl(rgb);
    codigo.textContent = texto;
  });
}

// ====== Candados ======
function agregarEventos() {
  document.querySelectorAll(".lock-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const div = btn.parentElement;
      const locked = div.getAttribute("data-locked") === "true";
      div.setAttribute("data-locked", !locked);
      btn.textContent = locked ? "🔓" : "🔒";
    }
  });
}

// ====== Generar paleta ======
function generarPaleta() {
  const cantidad = parseInt(document.getElementById("cantidad").value);
  if (!cantidad) return alert("Selecciona la cantidad de colores");

  const contenedor = document.getElementById("paleta");

  const wrappers = Array.from(contenedor.querySelectorAll(".color-wrapper"));
  

  // Crear o actualizar colores
  for (let i = 0; i < cantidad; i++) {
    if (wrappers[i]) {
      const div = wrappers[i].querySelector(".color-box");
      const codigo = wrappers[i].querySelector(".codigo-texto");

      if (div.getAttribute("data-locked") === "true") continue;

      const rgb = colorRandom();
      div.dataset.rgb = JSON.stringify(rgb);
      div.style.backgroundColor = rgbToHex(rgb);

      const formato = document.getElementById("formato").value;
      codigo.textContent = formato === "hex" ? rgbToHex(rgb) : rgbToHsl(rgb);
    } else {
      contenedor.appendChild(crearColor());
    }
  }

  // Eliminar extras
  for (let i = wrappers.length - 1; i >= cantidad; i--) {
    wrappers[i].remove();
  }

  agregarEventos();
}