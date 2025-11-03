// ================================
// CARGA DEL JSON DESDE GITHUB PAGES
// ================================
fetch("datos.json")
  .then(response => {
    if (!response.ok) throw new Error("Error al cargar datos.json");
    return response.json();
  })
  .then(datos => {
    mostrarColeccionGeneral(datos);
    mostrarColeccionONPE(datos);
    mostrarColeccionNoONPE(datos);
    mostrarTablaONPE(datos);
    mostrarTablaNoONPE(datos);
  })
  .catch(error => {
    console.error("❌ Error al cargar los datos:", error);
    document.body.innerHTML += `<p style="color:red; text-align:center;">No se pudieron cargar los datos del JSON.</p>`;
  });


// ================================
// FUNCIÓN: COLECCIÓN GENERAL
// ================================
function mostrarColeccionGeneral(datos) {
  const descriptores = datos.descriptores;
  const clasificacion = datos.clasificación;

  const html = `
    <div class="data-item"><strong>Total de registros:</strong> ${descriptores.Total_Registros}</div>
    <div class="data-item">
      <strong>Avance de Indexación:</strong>
      Indexados: ${descriptores.Colección_indexada} (<span class="index-ok">${descriptores["%_Colección_indexada"]}%</span>)
      | No Indexados: ${descriptores.Colección_no_indexada} (<span class="index-pending">${descriptores["%_Colección_no_indexada"]}%</span>)
    </div>
    <div class="data-item">
      <strong>Avance de Clasificación:</strong>
      Clasificados: ${clasificacion.Colección_clasificada} (<span class="clasif-ok">${clasificacion["%_Colección_clasificada"]}%</span>)
      | No Clasificados: ${clasificacion.Colección_no_clasificada} (<span class="clasif-pending">${clasificacion["%_Colección_no_clasificada"]}%</span>)
    </div>
  `;
  document.getElementById("general-content").innerHTML = html;
}


// ================================
// FUNCIÓN: COLECCIÓN ONPE
// ================================
function mostrarColeccionONPE(datos) {
  const onpeIndex = datos.onpe.indexacion;
  const onpeClas = datos.onpe.clasificacion;

  const html = `
    <div class="data-item">
      <strong>Indexación ONPE:</strong>
      Total: ${onpeIndex.Total_registros} |
      Indexados: ${onpeIndex.Registros_Indexados} (<span class="index-ok">${onpeIndex["%_Indexados"]}%</span>) |
      No Indexados: ${onpeIndex.Registros_No_Indexados} (<span class="index-pending">${onpeIndex["%_No_Indexados"]}%</span>)
    </div>

    <div class="data-item">
      <strong>Clasificación ONPE:</strong>
      Total: ${onpeClas.Total_registros} |
      Clasificados: ${onpeClas.Registros_Clasificados} (<span class="clasif-ok">${onpeClas["%_Clasificados"]}%</span>) |
      No Clasificados: ${onpeClas.Registros_No_Clasificados} (<span class="clasif-pending">${onpeClas["%_No_Clasificados"]}%</span>)
    </div>
  `;
  document.getElementById("onpe-content").innerHTML = html;
}


// ================================
// FUNCIÓN: TABLA DE SERIE POR AÑO (ONPE)
// ================================
function mostrarTablaONPE(datos) {
  const serie = datos.onpe.serie_por_ano;
  const tbody = document.querySelector("#onpe-table tbody");
  tbody.innerHTML = serie.map(a => `
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
}


// ================================
// FUNCIÓN: COLECCIÓN NO ONPE
// ================================
function mostrarColeccionNoONPE(datos) {
  const noOnpeIndex = datos.no_onpe.indexacion;
  const noOnpeClas = datos.no_onpe.clasificacion;

  const html = `
    <div class="data-item">
      <strong>Indexación No ONPE:</strong>
      Total: ${noOnpeIndex.Total_registros} |
      Indexados: ${noOnpeIndex.Registros_Indexados} (<span class="index-ok">${noOnpeIndex["%_Indexados"]}%</span>) |
      No Indexados: ${noOnpeIndex.Registros_No_Indexados} (<span class="index-pending">${noOnpeIndex["%_No_Indexados"]}%</span>)
    </div>

    <div class="data-item">
      <strong>Clasificación No ONPE:</strong>
      Total: ${noOnpeClas.Total_de_registros} |
      Clasificados: ${noOnpeClas.Colección_clasificada} (<span class="clasif-ok">${noOnpeClas["%_Colección_clasificada"]}%</span>) |
      No Clasificados: ${noOnpeClas.Colección_no_clasificada} (<span class="clasif-pending">${noOnpeClas["%_Colección_no_clasificada"]}%</span>)
    </div>
  `;
  document.getElementById("no-onpe-content").innerHTML = html;
}


// ================================
// FUNCIÓN: TABLA DE INSTITUCIONES (NO ONPE)
// ================================
function mostrarTablaNoONPE(datos) {
  const instituciones = datos.no_onpe.instituciones;
  const tbody = document.querySelector("#no-onpe-table tbody");
  tbody.innerHTML = instituciones.map(i => `
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
}
