fetch('datos.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo datos.json');
    }
    return response.json();
  })
  .then(data => {
    const contenedor = document.getElementById('contenedor');

    // --- Tabla 1: Colección Indexada ---
    const d = data.descriptores;
    const tabla1 = `
      <h2>Colección indexada</h2>
      <table>
        <tr>
          <th>Total de Registros</th>
          <th>Con indexación (6XX)</th>
          <th>% Con indexación</th>
          <th>Sin indexación (6XX)</th>
          <th>% Sin indexación</th>
        </tr>
        <tr>
          <td>${d.Total_Registros}</td>
          <td>${d.Con_Descriptores_6XX}</td>
          <td>${d["%_Con_Descriptores"]}%</td>
          <td>${d.Sin_Descriptores_6XX}</td>
          <td>${d["%_Sin_Descriptores"]}%</td>
        </tr>
      </table>
    `;

    // --- Tabla 2: Colección Clasificada ---
    const c = data.clasificacion;
    const tabla2 = `
      <h2>Colección Clasificada</h2>
      <table>
        <tr>
          <th>Colección Clasificada</th>
          <th>% Colección Clasificada</th>
          <th>Colección No Clasificada</th>
          <th>% Colección No Clasificada</th>
          <th>Total de Registros</th>
        </tr>
        <tr>
          <td>${c.Coleccion_clasificada}</td>
          <td>${c["%_Coleccion_clasificada"]}%</td>
          <td>${c.Coleccion_no_clasificada}</td>
          <td>${c["%_Coleccion_no_clasificada"]}%</td>
          <td>${c.Total_de_registros}</td>
        </tr>
      </table>
    `;

    contenedor.innerHTML = tabla1 + tabla2;
  })
  .catch(error => {
    document.getElementById('contenedor').innerHTML = `
      <p style="color:red;">Error: ${error.message}</p>
      <p>Verifica que <strong>datos.json</strong> esté en la misma carpeta que este archivo.</p>
    `;
  });
