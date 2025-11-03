// === CARGA DEL JSON DESDE GITHUB PAGES ===
fetch("https://gabrielaqf16.github.io/ONPE/datos.json")
  .then(response => {
    if (!response.ok) throw new Error("Error al cargar datos.json");
    return response.json();
  })
  .then(datos => {
    mostrarDatos(datos);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
    document.body.innerHTML += `<p style="color:red">No se pudieron cargar los datos del JSON.</p>`;
  });

// === FUNCIÓN PRINCIPAL ===
function mostrarDatos(datos) {
  // Colección general
  const descriptores = datos.descriptores;
  const clasificacion = datos.clasificación;

  document.getElementById("coleccion-general").innerHTML = `
    <h3>Avance de Indexación</h3>
    <p>Total registros: ${descriptores.Total_Registros}</p>
    <p>Colección indexada: ${descriptores.Colección_indexada} (${descriptores["%_Colección_indexada"]}%)</p>
    <p>No indexada: ${descriptores.Colección_no_indexada} (${descriptores["%_Colección_no_indexada"]}%)</p>

    <h3>Avance de Clasificación</h3>
    <p>Total registros: ${clasificacion.Total_de_registros}</p>
    <p>Colección clasificada: ${clasificacion.Colección_clasificada} (${clasificacion["%_Colección_clasificada"]}%)</p>
    <p>No clasificada: ${clasificacion.Colección_no_clasificada} (${clasificacion["%_Colección_no_clasificada"]}%)</p>
  `;

  // Colección ONPE (indexación y clasificación)
  const onpe = datos.onpe;
  const onpeIndex = onpe.indexacion;
  const onpeClas = onpe.clasificacion;

  document.getElementById("coleccion-onpe").innerHTML = `
    <h3>Indexación ONPE</h3>
    <p>Total registros: ${onpeIndex.Total_registros}</p>
    <p>Indexados: ${onpeIndex.Registros_Indexados} (${onpeIndex["%_Indexados"]}%)</p>
    <p>No indexados: ${onpeIndex.Registros_No_Indexados} (${onpeIndex["%_No_Indexados"]}%)</p>

    <h3>Clasificación ONPE</h3>
    <p>Total registros: ${onpeClas.Total_registros}</p>
    <p>Clasificados: ${onpeClas.Registros_Clasificados} (${onpeClas["%_Clasificados"]}%)</p>
    <p>No clasificados: ${onpeClas.Registros_No_Clasificados} (${onpeClas["%_No_Clasificados"]}%)</p>
  `;

  // Serie por año (tabla)
  const serie = onpe.serie_por_ano;
  const tablaAños = serie.map(a => `
    <tr>
      <td>${a.Año}</td>
      <td>${a.Total_Registros_ONPE}</td>
      <td>${a.Clasificados}</td>
      <td>${a["%_Clasificados"]}%</td>
      <td>${a.No_Clasificados}</td>
      <td>${a["%_No_Clasificados"]}%</td>
      <td>${a.Indexados}</td>
      <td>${a["%_Indexados"]}%</td>
      <td>${a.No_Indexados}</td>
      <td>${a["%_No_Indexados"]}%</td>
    </tr>
  `).join("");

  document.getElementById("serie-onpe").innerHTML = `
    <table border="1" cellspacing="0" cellpadding="4">
      <tr>
        <th>Año</th>
        <th>Total</th>
        <th>Clasificados</th>
        <th>% Clas.</th>
        <th>No Clas.</th>
        <th>% No Clas.</th>
        <th>Indexados</th>
        <th>% Index.</th>
        <th>No Index.</th>
        <th>% No Index.</th>
      </tr>
      ${tablaAños}
    </table>
  `;

  // Colección NO ONPE
  const noOnpe = datos.no_onpe;
  const noIndex = noOnpe.indexacion;
  const noClas = noOnpe.clasificacion;

  document.getElementById("coleccion-no-onpe").innerHTML = `
    <h3>Indexación No ONPE</h3>
    <p>Total registros: ${noIndex.Total_registros}</p>
    <p>Indexados: ${noIndex.Registros_Indexados} (${noIndex["%_Indexados"]}%)</p>
    <p>No indexados: ${noIndex.Registros_No_Indexados} (${noIndex["%_No_Indexados"]}%)</p>

    <h3>Clasificación No ONPE</h3>
    <p>Total registros: ${noClas.Total_de_registros}</p>
    <p>Colección clasificada: ${noClas.Colección_clasificada} (${noClas["%_Colección_clasificada"]}%)</p>
    <p>No clasificada: ${noClas.Colección_no_clasificada} (${noClas["%_Colección_no_clasificada"]}%)</p>
  `;

  // Instituciones (tabla)
  const inst = noOnpe.instituciones;
  const tablaInst = inst.map(i => `
    <tr>
      <td>${i.Institución}</td>
      <td>${i.Total_Registros}</td>
      <td>${i.Clasificados}</td>
      <td>${i["%_Clasificados"]}%</td>
      <td>${i.No_Clasificados}</td>
      <td>${i["%_No_Clasificados"]}%</td>
      <td>${i.Indexados}</td>
      <td>${i["%_Indexados"]}%</td>
      <td>${i.No_Indexados}</td>
      <td>${i["%_No_Indexados"]}%</td>
    </tr>
  `).join("");

  document.getElementById("instituciones").innerHTML = `
    <table border="1" cellspacing="0" cellpadding="4">
      <tr>
        <th>Institución</th>
        <th>Total</th>
        <th>Clasificados</th>
        <th>% Clas.</th>
        <th>No Clas.</th>
        <th>% No Clas.</th>
        <th>Indexados</th>
        <th>% Index.</th>
        <th>No Index.</th>
        <th>% No Index.</th>
      </tr>
      ${tablaInst}
    </table>
  `;
}

