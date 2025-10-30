async function cargarDatos() {
  const res = await fetch('datos.json');
  const datos = await res.json();

  mostrarGeneral(datos);
  mostrarOnpe(datos.onpe);
  mostrarNoOnpe(datos.no_onpe);
}

// ---------- GENERAL ----------
function mostrarGeneral(datos) {
  const descriptores = datos.descriptores;
  const clasificacion = datos.clasificación;
  const cont = document.getElementById("tabla-general");

  cont.innerHTML = `
    <table>
      <tr><th>Tipo</th><th>Total</th><th>Clasificados / Indexados</th><th>%</th><th>Barra de progreso</th></tr>
      <tr>
        <td>Clasificación</td>
        <td>${clasificacion.Total_de_registros}</td>
        <td>${clasificacion.Colección_clasificada}</td>
        <td>${clasificacion["%_Colección_clasificada"]}%</td>
        <td>${crearBarra(clasificacion["%_Colección_clasificada"], 'green')}</td>
      </tr>
      <tr>
        <td>Indexación</td>
        <td>${descriptores.Total_Registros}</td>
        <td>${descriptores.Colección_indexada}</td>
        <td>${descriptores["%_Colección_indexada"]}%</td>
        <td>${crearBarra(descriptores["%_Colección_indexada"], 'blue')}</td>
      </tr>
    </table>
  `;
}

// ---------- ONPE ----------
function mostrarOnpe(onpe) {
  const contResumen = document.getElementById("tabla-onpe-resumen");
  contResumen.innerHTML = `
    <table>
      <tr><th>Tipo</th><th>Total</th><th>Completados</th><th>%</th><th>Barra</th></tr>
      <tr>
        <td>Clasificación</td>
        <td>${onpe.clasificacion.Total_registros}</td>
        <td>${onpe.clasificacion.Registros_Clasificados}</td>
        <td>${onpe.clasificacion["%_Clasificados"]}%</td>
        <td>${crearBarra(onpe.clasificacion["%_Clasificados"], 'green')}</td>
      </tr>
      <tr>
        <td>Indexación</td>
        <td>${onpe.indexacion.Total_registros}</td>
        <td>${onpe.indexacion.Registros_Indexados}</td>
        <td>${onpe.indexacion["%_Indexados"]}%</td>
        <td>${crearBarra(onpe.indexacion["%_Indexados"], 'blue')}</td>
      </tr>
    </table>
  `;

  // Serie por año
  const contAnos = document.getElementById("tabla-onpe-anos");
  const filas = onpe.serie_por_ano.map(a => `
    <tr>
      <td>${a.Año}</td>
      <td>${a.Total_Registros_ONPE}</td>
      <td>${a["%_Clasificados"]}% ${crearBarra(a["%_Clasificados"], 'green')}</td>
      <td>${a["%_Indexados"]}% ${crearBarra(a["%_Indexados"], 'blue')}</td>
    </tr>
  `).join("");

  contAnos.innerHTML = `
    <table>
      <tr><th>Año</th><th>Total</th><th>Clasificación</th><th>Indexación</th></tr>
      ${filas}
    </table>
  `;
}

// ---------- NO ONPE ----------
function mostrarNoOnpe(noonpe) {
  const contResumen = document.getElementById("tabla-noonpe-resumen");
  contResumen.innerHTML = `
    <table>
      <tr><th>Tipo</th><th>Total</th><th>Completados</th><th>%</th><th>Barra</th></tr>
      <tr>
        <td>Clasificación</td>
        <td>${noonpe.clasificacion.Total_de_registros}</td>
        <td>${noonpe.clasificacion.Colección_clasificada}</td>
        <td>${noonpe.clasificacion["%_Colección_clasificada"]}%</td>
        <td>${crearBarra(noonpe.clasificacion["%_Colección_clasificada"], 'green')}</td>
      </tr>
      <tr>
        <td>Indexación</td>
        <td>${noonpe.indexacion.Total_registros}</td>
        <td>${noonpe.indexacion.Registros_Indexados}</td>
        <td>${noonpe.indexacion["%_Indexados"]}%</td>
        <td>${crearBarra(noonpe.indexacion["%_Indexados"], 'blue')}</td>
      </tr>
    </table>
  `;

  // Por instituciones
  const contInst = document.getElementById("tabla-noonpe-inst");
  const filas = noonpe.instituciones.map(i => `
    <tr>
      <td>${i.Institución}</td>
      <td>${i.Total_Registros}</td>
      <td>${i["%_Clasificados"]}% ${crearBarra(i["%_Clasificados"], 'green')}</td>
      <td>${i["%_Indexados"]}% ${crearBarra(i["%_Indexados"], 'blue')}</td>
    </tr>
  `).join("");

  contInst.innerHTML = `
    <table>
      <tr><th>Institución</th><th>Total</th><th>Clasificación</th><th>Indexación</th></tr>
      ${filas}
    </table>
  `;
}

// ---------- FUNCIÓN AUXILIAR ----------
function crearBarra(porcentaje, color) {
  return `
    <div class="progress-bar">
      <div class="progress ${color}" style="width:${porcentaje}%;"></div>
    </div>
  `;
}

cargarDatos();
