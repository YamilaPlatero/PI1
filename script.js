function colorRandom() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function generarPaleta() {
  let cantidad = document.getElementById("cantidad").value;
  let contenedor = document.getElementById("paleta");

  contenedor.innerHTML = ""; // limpia antes

  for (let i = 0; i < cantidad; i++) {
    let color = colorRandom(); // ahora usamos HEX

    const div = document.createElement('div');
    div.classList.add('color-box');
    div.style.backgroundColor = color;
    div.textContent = color; // muestra HEX en la caja

    


    // copiar al hacer click
    div.addEventListener("click", () => {
      navigator.clipboard.writeText(color);

      div.textContent = "¡Copiado!";
      
      setTimeout(() => {
        div.textContent = color;
      }, 1000);

      
    });

    contenedor.appendChild(div);
  }
}

// botón
document.getElementById("btn").addEventListener("click", generarPaleta);

// generar al cargar
generarPaleta();
