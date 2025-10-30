async function cargarDatos() {
  const response = await fetch("datos.json");
  const data = await response.json();
  mostrarColeccionGeneral(data);
  mostrarColeccionONPE(data);
  mostrarONPEporAnio(data);
  mostrarNoONPE(data);
}

function crearBarra(porcentaje, color) {
  return `
    <div class="progress">
      <div class="bar ${color}" style="width:${porcentaje}%"></div>
    </div>
  `;
}

function mostrarColeccionGeneral(data) {
  const general = data;
  const html = `
    <table>
      <tr>
        <th>Tipo</th>
        <th>Total</th>
        <th>Clasificados / Indexados</th>
        <th>%</th>
        <th>No Clasificados / No Indexados</th>
        <th>%</th>
        <th>Barra</th>
      </tr>
      <tr>
        <td>Clasificación</td>
        <td>${general.clasificación.Total_de_registros}</td>
        <td>${general.clasificación.Colección_clasificada}</td>
        <td>${general.clasificación["%_Colección_clasificada"]}%</td>
        <td>${general.clasificación.Colección_no_clasificada}</td>
        <td>${general.clasificación["%_Colección_no_clasificada"]}%</td>
        <td>${crearBarra(general.clasificación["%_Colección_clasificada"], "green")}</td>
      </tr>
      <tr>
        <td>Indexación</td>
        <td>${general.descriptores.Total_Registros}</td>
        <td>${general.descriptores.Colección_indexada}</td>
        <td>${general.descriptores["%_Colección_indexada"]}%</td>
        <td>${general.descriptores.Colección_no_indexada}</td>
        <td>${general.descriptores["%_Colección_no_indexada"]}%</td>
        <td>${crearBarra(general.descriptores["%_Colección_indexada"], "blue")}</td>
      </tr>
    </table>
  `;
  document.getElementById("tabla-general").innerHTML = html;
}

function mostrarColeccionONPE(data) {
  const onpe = data.onpe;
  const html = `
    <table>
      <tr>
        <th>Tipo</th>
        <th>Total</th>
        <th>Completados</th>
        <th>%</th>
        <th>No completados</th>
        <th>%</th>
        <th>Barra</th>
      </tr>
      <tr>
        <td>Clasificación</td>
        <td>${onpe.clasificacion.Total_registros}</td>
        <td>${onpe.clasificacion.Registros_Clasificados}</td>
        <td>${onpe.clasificacion["%_Clasificados"]}%</td>
        <td>${onpe.clasificacion.Registros_No_Clasificados}</td>
        <td>${onpe.clasificacion["%_No_Clasificados"]}%</td>
        <td>${crearBarra(onpe.clasificacion["%_Clasificados"], "green")}</td>
      </tr>
      <tr>
        <td>Indexación</td>
        <td>${onpe.indexacion.Total_registros}</td>
        <td>${onpe.indexacion.Registros_Indexados}</td>
        <td>${onpe.indexacion["%_Indexados"]}%</td>
        <td>${onpe.indexacion.Registros_No_Indexados}</td>
        <td>${onpe.indexacion["%_No_Indexados"]}%</td>
        <td>${crearBarra(onpe.indexacion["%_Indexados"], "blue")}</td>
      </tr>
    </table>
  `;
  document.getElementById("tabla-onpe").innerHTML = html;
}

function mostrarONPEporAnio(data) {
  const serie = data.onpe.serie_por_ano;
  let filas = serie.map(r => `
    <tr>
      <td>${r.Año}</td>
      <td>${r.Total_Registros_ONPE}</td>
      <td>${r.Clasificados}</td>
      <td>${r["%_Clasificados"]}%</td>
      <td>${r.No_Clasificados}</td>
      <td>${r["%_No_Clasificados"]}%</td>
      <td>${r.Indexados}</td>
      <td>${r["%_Indexados"]}%</td>
      <td>${r.No_Indexados}</td>
      <td>${r["%_No_Indexados"]}%</td>
      <td>
        ${crearBarra(r["%_Clasificados"], "green")}
        ${crearBarra(r["%_Indexados"], "blue")}
      </td>
    </tr>
  `).join("");

  const html = `
    <table>
      <tr>
        <th>Año</th>
        <th>Total</th>
        <th>Clasificados</th>
        <th>%</th>
        <th>No Clasificados</th>
        <th>%</th>
        <th>Indexados</th>
        <th>%</th>
        <th>No Indexados</th>
        <th>%</th>
        <th>Barras</th>
      </tr>
      ${filas}
    </table>
  `;
  document.getElementById("tabla-onpe-anual").innerHTML = html;
}

function mostrarNoONPE(data) {
  const instituciones = data.no_onpe.instituciones;
  let filas = instituciones.map(i => `
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
      <td>
        ${crearBarra(i["%_Clasificados"], "green")}
        ${crearBarra(i["%_Indexados"], "blue")}
      </td>
    </tr>
  `).join("");

  const html = `
    <table>
      <tr>
        <th>Institución</th>
        <th>Total</th>
        <th>Clasificados</th>
        <th>%</th>
        <th>No Clasificados</th>
        <th>%</th>
        <th>Indexados</th>
        <th>%</th>
        <th>No Indexados</th>
        <th>%</th>
        <th>Barras</th>
      </tr>
      ${filas}
    </table>
  `;
  document.getElementById("tabla-no-onpe").innerHTML = html;
}

cargarDatos();

