fetch("datos.json")
  .then(response => response.json())
  .then(data => {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = `
      <h2>📘 Resultados de la ONPE</h2>
      <p><b>Total de registros:</b> ${data.onpe.indexacion.Total_registros}</p>
      <p><b>Registros indexados:</b> ${data.onpe.indexacion.Registros_Indexados} (${data.onpe.indexacion["%_Indexados"]}%)</p>
      <p><b>Registros no indexados:</b> ${data.onpe.indexacion.Registros_No_Indexados} (${data.onpe.indexacion["%_No_Indexados"]}%)</p>

      <h3>📗 Clasificación</h3>
      <p><b>Total de registros:</b> ${data.onpe.clasificacion.Total_registros}</p>
      <p><b>Registros clasificados:</b> ${data.onpe.clasificacion.Registros_Clasificados} (${data.onpe.clasificacion["%_Clasificados"]}%)</p>
      <p><b>Registros no clasificados:</b> ${data.onpe.clasificacion.Registros_No_Clasificados} (${data.onpe.clasificacion["%_No_Clasificados"]}%)</p>
    `;
  })
  .catch(error => {
    document.getElementById("resultados").innerText = "Error cargando datos: " + error.message;
  });
