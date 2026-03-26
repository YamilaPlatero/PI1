function colorRandom() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// Función para crear un nuevo color
function crearColor(color = null) {
  const div = document.createElement('div');
  div.classList.add('color-box');

  const colorValue = color || colorRandom();
  div.style.backgroundColor = colorValue;
  div.setAttribute("data-locked", "false");

  div.innerHTML = `
    <span class="hex">${colorValue}</span>
    <button class="lock-btn">🔓</button>
  `;

  // Copiar al hacer click (si no es el candado)
  div.addEventListener("click", (e) => {
    if (e.target.classList.contains("lock-btn")) return;

    navigator.clipboard.writeText(colorValue);
    const texto = div.querySelector(".hex");
    texto.textContent = "¡Copiado!";
    setTimeout(() => {
      texto.textContent = colorValue;
    }, 1000);
  });
    console.log("Color creado:", colorValue);
    
  return div;
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

  const coloresActuales = Array.from(contenedor.querySelectorAll(".color-box"));

  // Si no hay colores existentes, crear todos
  if (coloresActuales.length === 0) {
    for (let i = 0; i < cantidad; i++) {
      const nuevoColor = crearColor();
      contenedor.appendChild(nuevoColor);
    }
  } else {
    // Actualizar solo los no bloqueados
    coloresActuales.forEach(div => {
      const locked = div.getAttribute("data-locked") === "true";
      if (!locked) {
        const nuevoColor = colorRandom();
        div.style.backgroundColor = nuevoColor;
        div.querySelector(".hex").textContent = nuevoColor;

        // Actualizar evento copiar
        div.onclick = (e) => {
          if (e.target.classList.contains("lock-btn")) return;
          navigator.clipboard.writeText(nuevoColor);
          const texto = div.querySelector(".hex");
          texto.textContent = "¡Copiado!";
          setTimeout(() => {
            texto.textContent = nuevoColor;
          }, 1000);
        }
      }
    });

    // Si se redujo la cantidad, eliminar extras
    if (coloresActuales.length > cantidad) {
      for (let i = coloresActuales.length - 1; i >= cantidad; i--) {
        coloresActuales[i].remove();
      }
    }

    // Si se aumentó la cantidad, crear nuevos
    if (coloresActuales.length < cantidad) {
      for (let i = coloresActuales.length; i < cantidad; i++) {
        contenedor.appendChild(crearColor());
      }
    }
  }

  agregarEventos();
}

// Botón (asegúrate que el HTML tenga id="btn")
document.getElementById("btn").addEventListener("click", generarPaleta);

// Generar al cargar
generarPaleta();