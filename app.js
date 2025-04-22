const umbral = 0.85;

const estado = document.getElementById('estado');
const boton = document.getElementById('analizar');
const input = document.getElementById('oracion');
const contenedor = document.getElementById('resultados');

boton.addEventListener("click", async (e) => {
  e.preventDefault();

  const texto = input.value;
  contenedor.innerHTML = "";

  if (!texto) {
    estado.innerText = "Escribe algo";
    return;
  }

  estado.innerText = "Cargando modelo...";

  try {
    const modelo = await toxicity.load(umbral);
    estado.innerText = "Modelo cargado. Analizando...";

    const predicciones = await modelo.classify([texto]);
    estado.innerText = "Análisis completo.";

    predicciones.forEach(p => {
      const etiqueta = p.label;
      const resultado = p.results[0];

      const div = document.createElement('div');
      div.innerHTML = `
        <strong>${etiqueta}</strong><br>
        Coincidencia: <span style="color:${resultado.match ? 'red' : 'green'}">${resultado.match}</span><br>
        Probabilidades: [No tóxico: ${resultado.probabilities[0].toFixed(2)}, Tóxico: ${resultado.probabilities[1].toFixed(2)}]
        <hr>
      `;
      contenedor.appendChild(div);
    });
  } catch (error) {
    estado.innerText = "Error al cargar el modelo o analizar el texto.";
    console.error(error);
  }
});