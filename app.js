// app.js - carga datos.json y renderiza tablas y barras de porcentaje

function createCard(title, innerHTML){
  const card = document.createElement('section');
  card.className = 'card';
  const st = document.createElement('div');
  st.className = 'section-title';
  st.innerHTML = `<h2>${title}</h2>`;
  card.appendChild(st);
  const content = document.createElement('div');
  content.className = 'table-wrap';
  content.innerHTML = innerHTML;
  card.appendChild(content);
  return card;
}

function makePercentCell(value){
  // value is number (0-100)
  const percent = Number(value);
  const safe = isNaN(percent) ? 0 : Math.max(0, Math.min(100, percent));
  return `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div class="pbar" style="width:92%;">
        <div class="p" style="width:${safe}%;"></div>
      </div>
      <div class="percent-label">${safe}%</div>
    </div>
  `;
}

function objToTableFromMap(headers, rows){
  let html = '<table><thead><tr>';
  headers.forEach(h => html += `<th>${h}</th>`);
  html += '</tr></thead><tbody>';
  rows.forEach(r => {
    html += '<tr>';
    headers.forEach(h => {
      const key = h;
      const v = (r.hasOwnProperty(h) ? r[h] : (r[h.toString()] ?? ''));
      html += `<td>${v}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

function objArrayToTable(objects){
  if(!objects || objects.length===0) return '<p>No hay datos.</p>';
  const headers = Object.keys(objects[0]);
  let html = '<table><thead><tr>';
  headers.forEach(h => html += `<th>${h}</th>`);
  html += '</tr></thead><tbody>';
  objects.forEach(obj => {
    html += '<tr>';
    headers.forEach(h => {
      let v = obj[h];
      // si es un porcentaje (campo con % o endsWith '_pct' etc) - detectamos números en nombre
      if(typeof v === 'number' && (h.toLowerCase().includes('percent') || h.includes('%') || h.toLowerCase().includes('index') || h.toLowerCase().includes('clasif') || h.toLowerCase().includes('indexad') || h.toLowerCase().includes('no_indexad') || h.toLowerCase().includes('indexados') || h.toLowerCase().includes('clasificados'))) {
        // para seguridad no aplicar barra a todos: aplicaremos barra sólo si el header contiene '%' o 'Index' o 'Clas' keywords
      }
      html += `<td>${v}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

// función para crear fila con barra para porcentaje (usada en tablas específicas)
function makeRowWithPercent(cells){
  // cells: array of values; if a value is an object {type:'percent', value: NUM} render bar
  let row = '<tr>';
  cells.forEach(cell => {
    if(cell && typeof cell === 'object' && cell.type === 'percent'){
      row += `<td>${makePercentCell(cell.value)}</td>`;
    } else {
      row += `<td>${cell}</td>`;
    }
  });
  row += '</tr>';
  return row;
}

fetch('datos.json')
  .then(response => {
    if(!response.ok) throw new Error('No se pudo cargar datos.json (verifica que exista en la raíz).');
    return response.json();
  })
  .then(data => {
    const cont = document.getElementById('contenedor');
    cont.innerHTML = ''; // limpiar

    // --- 1. Colección indexada (antes: descriptores) ---
    const d = data.descriptores;
    const tablaIndexada = `
      <table>
        <thead>
          <tr>
            <th>Total de Registros</th>
            <th>Con indexación (6XX)</th>
            <th>% Con indexación</th>
            <th>Sin indexación (6XX)</th>
            <th>% Sin indexación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${d.Total_Registros}</td>
            <td>${d.Coleccion_indexada}</td>
            <td>${makePercentCell(d["%_coleccion_indexada"])}</td>
            <td>${d.Coleccion_no_indexada}</td>
            <td>${makePercentCell(d["%_Coleccion_no_indexada"])}</td>
          </tr>
        </tbody>
      </table>
    `;
    cont.appendChild(createCard('Colección indexada', tablaIndexada));

    // --- 2. Coleccion Clasificacion SOLO ONPE (indexación + clasificación summaries) ---
    const soloOnpe = data.coleccion_onpe;
    const tablaSoloOnpe = `
      <table>
        <thead>
          <tr>
            <th>Total_registros</th>
            <th>Registros_Indexados</th>
            <th>%_Indexados</th>
            <th>Registros_No_Indexados</th>
            <th>%_No_Indexados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${soloOnpe.total_registros}</td>
            <td>${soloOnpe.registros_indexados}</td>
            <td>${makePercentCell(soloOnpe.pct_indexados)}</td>
            <td>${soloOnpe.registros_no_indexados}</td>
            <td>${makePercentCell(soloOnpe.pct_no_indexados)}</td>
          </tr>
        </tbody>
      </table>

      <table style="margin-top:12px;">
        <thead>
          <tr>
            <th>Total_registros</th>
            <th>Registros_Clasificados</th>
            <th>%_Clasificados</th>
            <th>Registros_No_Clasificados</th>
            <th>%_No_Clasificados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${soloOnpe.total_registros}</td>
            <td>${soloOnpe.registros_clasificados}</td>
            <td>${makePercentCell(soloOnpe.pct_clasificados)}</td>
            <td>${soloOnpe.registros_no_clasificados}</td>
            <td>${makePercentCell(soloOnpe.pct_no_clasificados)}</td>
          </tr>
        </tbody>
      </table>
    `;
    cont.appendChild(createCard('Colección Clasificación — SOLO ONPE', tablaSoloOnpe));

    // --- 3. Año / Serie temporal ONPE (tabla por año) ---
    const anos = data.serie_por_ano; // array de objetos
    // construimos tabla con cabeceras
    if(Array.isArray(anos) && anos.length>0){
      const headers = Object.keys(anos[0]);
      let html = '<table><thead><tr>';
      headers.forEach(h => html += `<th>${h}</th>`);
      html += '</tr></thead><tbody>';
      anos.forEach(row => {
        html += '<tr>';
        headers.forEach(h => {
          const v = row[h];
          // si el header es uno de los porcentajes mostramos barra
          if(typeof v === 'number' && (h.includes('%') || h.toLowerCase().includes('index') || h.toLowerCase().includes('clas'))){
            html += `<td>${makePercentCell(v)}</td>`;
          } else {
            html += `<td>${v}</td>`;
          }
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
      cont.appendChild(createCard('Serie por Año — ONPE', html));
    }

    // --- 4. Colección Clasificación NO ONPE (otras instituciones) ---
    const noOnpe = data.coleccion_no_onpe;
    const tablaNoOnpe = `
      <table>
        <thead>
          <tr>
            <th>Total_registros</th>
            <th>Registros_Indexados</th>
            <th>%_Indexados</th>
            <th>Registros_No_Indexados</th>
            <th>%_No_Indexados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${noOnpe.total_registros}</td>
            <td>${noOnpe.registros_indexados}</td>
            <td>${makePercentCell(noOnpe.pct_indexados)}</td>
            <td>${noOnpe.registros_no_indexados}</td>
            <td>${makePercentCell(noOnpe.pct_no_indexados)}</td>
          </tr>
        </tbody>
      </table>
    `;
    cont.appendChild(createCard('Colección Clasificación — NO ONPE (Otras instituciones)', tablaNoOnpe));

    // --- 5. Resumen general (ya lo tenías) ---
    if(data.resumen_general){
      const r = data.resumen_general;
      const html = `
        <table>
          <thead>
            <tr>
              <th>Total_de_registros</th>
              <th>Colección_clasificada</th>
              <th>%_Colección_clasificada</th>
              <th>Colección_no_clasificada</th>
              <th>%_Colección_no_clasificada</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${r.Total_de_registros}</td>
              <td>${r.Coleccion_clasificada}</td>
              <td>${makePercentCell(r["%_Coleccion_clasificada"])}</td>
              <td>${r.Coleccion_no_clasificada}</td>
              <td>${makePercentCell(r["%_Coleccion_no_clasificada"])}</td>
            </tr>
          </tbody>
        </table>
      `;
      cont.appendChild(createCard('Resumen general', html));
    }

    // --- 6. Instituciones (tabla con filas por institución) ---
    if(Array.isArray(data.instituciones) && data.instituciones.length>0){
      const inst = data.instituciones;
      // construimos tabla
      const headers = Object.keys(inst[0]);
      let html = '<table><thead><tr>';
      headers.forEach(h => html += `<th>${h}</th>`);
      html += '</tr></thead><tbody>';
      inst.forEach(row => {
        html += '<tr>';
        headers.forEach(h => {
          const v = row[h];
          if(typeof v === 'number' && (h.includes('%') || h.toLowerCase().includes('index') || h.toLowerCase().includes('clas'))){
            html += `<td>${makePercentCell(v)}</td>`;
          } else {
            html += `<td>${v}</td>`;
          }
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
      cont.appendChild(createCard('Instituciones', html));
    }
  })
  .catch(err => {
    const cont = document.getElementById('contenedor');
    cont.innerHTML = `<p class="error">Error cargando datos: ${err.message}</p>`;
  });
