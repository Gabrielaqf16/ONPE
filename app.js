
fetch('datos.json')
  .then(response => response.json())
  .then(data => {
    // --- Tabla 1: Descriptores ---
    const descriptores = data.descriptores;
    let html1 = `
      <h2>Colección Indexada</h2>
      <table border="1">
        <tr>
          <th>Total Registros</th>
          <th>Con Descriptores 6XX</th>
          <th>% Con Descriptores</th>
          <th>Sin Descriptores 6XX</th>
          <th>% Sin Descriptores</th>
        </tr>
        <tr>
          <td>${descriptores.Total_Registros}</td>
          <td>${descriptores.Con_Descriptores_6XX}</td>
          <td>${descriptores["%_Con_Descriptores"]}%</td>
          <td>${descriptores.Sin_Descriptores_6XX}</td>
          <td>${descriptores["%_Sin_Descriptores"]}%</td>
        </tr>
      </table>
    `;

    // --- Tabla 2: Clasificación ---
    const clasificacion = data.clasificacion;
    let html2 = `
      <h2>Colección Clasificada</h2>
      <table border="1">
        <tr>
          <th>Colección Clasificada</th>
          <th>% Colección Clasificada</th>
          <th>Colección No Clasificada</th>
          <th>% Colección No Clasificada</th>
          <th>Total de Registros</th>
        </tr>
        <tr>
          <td>${clasificacion.Coleccion_clasificada}</td>
          <td>${clasificacion["%_Coleccion_clasificada"]}%</td>
          <td>${clasificacion.Coleccion_no_clasificada}</td>
          <td>${clasificacion["%_Coleccion_no_clasificada"]}%</td>
          <td>${clasificacion.Total_de_registros}</td>
        </tr>
      </table>
    `;

    document.getElementById('contenedor').innerHTML = html1 + html2;
  })
  .catch(error => console.error('Error al cargar los datos:', error));
