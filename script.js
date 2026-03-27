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

// Función para crear un nuevo color
function crearColor() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('color-wrapper');

  const div = document.createElement('div');
  div.classList.add('color-box');

  const rgb = colorRandom();
  div.dataset.rgb = JSON.stringify(rgb);

  const hex = rgbToHex(rgb);
  div.style.backgroundColor = hex;
  div.setAttribute("data-locked", "false");

  div.innerHTML = `<button class="lock-btn">🔓</button>`;

  // TEXTO DEL CÓDIGO (afuera)
  const codigo = document.createElement('div');
  codigo.classList.add('codigo-texto');
  codigo.textContent = hex;

  // Copiar al hacer click
  div.addEventListener("click", (e) => {
    if (e.target.classList.contains("lock-btn")) return;

    const formato = document.getElementById("formato").value;
    const rgbActual = JSON.parse(div.dataset.rgb);
    const color = formato === "hex" ? rgbToHex(rgbActual) : rgbToHsl(rgbActual);

    navigator.clipboard.writeText(color);

    codigo.textContent = "¡Copiado!";
    setTimeout(() => {
      codigo.textContent = color;
    }, 1000);
  });

  wrapper.appendChild(div);
  wrapper.appendChild(codigo);

  return wrapper;
}

function cambiarFormato() {
  const formato = document.getElementById("formato").value;
  const contenedor = document.getElementById("paleta");

  contenedor.querySelectorAll(".color-box").forEach(div => {
    const rgb = JSON.parse(div.dataset.rgb);
    const nuevoColor = formato === "hex" ? rgbToHex(rgb) : rgbToHsl(rgb);

    div.querySelector(".hex").textContent = nuevoColor;
    
  });
}
// Función para agregar evento a candados
function agregarEventos() {
  document.querySelectorAll(".lock-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const contenedor = btn.parentElement;
      const locked = contenedor.getAttribute("data-locked") === "true";
      contenedor.setAttribute("data-locked", !locked);
      btn.textContent = locked ? "🔓" : "🔒";
    }
  });
}

// Generar paleta respetando bloqueos
function generarPaleta() {
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const contenedor = document.getElementById("paleta");

  const wrappers = Array.from(contenedor.querySelectorAll(".color-wrapper"));

  // Si no hay colores, crear
  if (wrappers.length === 0) {
    for (let i = 0; i < cantidad; i++) {
      contenedor.appendChild(crearColor());
    }
  } else {

    wrappers.forEach(wrapper => {
      const div = wrapper.querySelector(".color-box");
      const codigo = wrapper.querySelector(".codigo-texto");

      const locked = div.getAttribute("data-locked") === "true";

      if (!locked) {
        const rgb = colorRandom();
        div.dataset.rgb = JSON.stringify(rgb);

        const hex = rgbToHex(rgb);
        div.style.backgroundColor = hex;

        const formato = document.getElementById("formato").value;
        const texto = formato === "hex" ? hex : rgbToHsl(rgb);

        codigo.textContent = texto;
      }
    });

    // Eliminar extras
    if (wrappers.length > cantidad) {
      for (let i = wrappers.length - 1; i >= cantidad; i--) {
        wrappers[i].remove();
      }
    }

    // Agregar nuevos
    if (wrappers.length < cantidad) {
      for (let i = wrappers.length; i < cantidad; i++) {
        contenedor.appendChild(crearColor());
      }
    }
  }

  agregarEventos();
}