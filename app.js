// app.js — espera que datos.json esté en:
// https://gabrielaqf16.github.io/ONPE/datos.json
// Carga, genera tabla, filtro por año, gráfico y descarga CSV.

const JSON_URL = 'https://gabrielaqf16.github.io/ONPE/datos.json';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const yearFilter = document.getElementById('yearFilter');
  const tableHead = document.getElementById('tableHead');
  const tableBody = document.getElementById('tableBody');
  const message = document.getElementById('message');
  const summary = document.getElementById('summary');
  const downloadBtn = document.getElementById('downloadCsv');
  const resetBtn = document.getElementById('reset');
  const ctx = document.getElementById('serieChart').getContext('2d');

  let rawData = null;       // objeto JSON completo
  let rows = [];            // array de objetos que se muestran en tabla (ej. serie_por_ano)
  let chart = null;

  // Mensaje de estado
  function setMessage(text){
    message.textContent = text || '';
  }

  // Detecta la propiedad principal a mostrar: preferimos "serie_por_ano" si existe, sino el primer array objeto
  function findPrimaryArray(obj){
    if (!obj) return null;
    if (Array.isArray(obj)) return obj;
    if (obj.serie_por_ano && Array.isArray(obj.serie_por_ano)) return obj.serie_por_ano;
    // buscar la primera propiedad que sea array de objetos
    for (const k of Object.keys(obj)){
      if (Array.isArray(obj[k]) && obj[k].length && typeof obj[k][0] === 'object'){
        return obj[k];
      }
    }
    return null;
  }

  // Render tabla
  function renderTable(data){
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    if (!data || data.length === 0){
      tableBody.innerHTML = '<tr><td colspan="99">No hay registros para mostrar.</td></tr>';
      return;
    }
    // columnas = keys unidas de todos los objetos (asegura cobertura)
    const colsSet = new Set();
    data.forEach(r => Object.keys(r).forEach(k => colsSet.add(k)));
    const cols = Array.from(colsSet);

    // encabezado
    const trHead = document.createElement('tr');
    cols.forEach(c => {
      const th = document.createElement('th');
      th.textContent = c;
      trHead.appendChild(th);
    });
    tableHead.appendChild(trHead);

    // cuerpo
    data.forEach(r => {
      const tr = document.createElement('tr');
      cols.forEach(c => {
        const td = document.createElement('td');
        const val = r[c] ?? '';
        td.textContent = (typeof val === 'object') ? JSON.stringify(val) : String(val);
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  }

  // Construye lista años
  function populateYears(data){
    yearFilter.innerHTML = '<option value="all">Todos los años</option>';
    const years = new Set();
    data.forEach(r => {
      // detectamos campo Año, Año (string), Year, year, año
      const yearKeys = ['Año','Año','AÑO','Anio','anio','year','Year','YYYY','Year'];
      const found = Object.keys(r).find(k => /\b(año|anio|year|yr|YYYY)\b/i.test(k));
      if (found && r[found] != null){
        years.add(String(r[found]));
      } else if (r['Año'] != null) {
        years.add(String(r['Año']));
      }
    });
    const sorted = Array.from(years).filter(Boolean).sort((a,b)=>{
      const na = Number(a), nb = Number(b);
      if (!isNaN(na) && !isNaN(nb)) return na-nb;
      return a.localeCompare(b);
    });
    sorted.forEach(y=>{
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearFilter.appendChild(opt);
    });
  }

  // Filtrado por búsqueda libre y año
  function applyFilters(){
    const q = (searchInput.value || '').trim().toLowerCase();
    const year = yearFilter.value;
    let filtered = rows.slice();
    if (year && year !== 'all'){
      filtered = filtered.filter(r=>{
        const found = Object.keys(r).find(k => /\b(año|anio|year|yr|YYYY)\b/i.test(k));
        if (found) return String(r[found]) === year;
        if (r['Año'] != null) return String(r['Año']) === year;
        return false;
      });
    }
    if (q){
      filtered = filtered.filter(r=>{
        return Object.values(r).some(v=>{
          if (v === null || v === undefined) return false;
          return String(v).toLowerCase().includes(q);
        });
      });
    }
    renderTable(filtered);
    renderSummary(filtered);
    updateChart(filtered);
  }

  // Resumen simple (conteo y suma de columas numéricas importantes si existen)
  function renderSummary(filtered){
    if (!filtered) {
      summary.innerHTML = '';
      return;
    }
    const count = filtered.length;
    // buscar la primera columna numérica para sumar (ej. Total_Registros_ONPE o Total_Reg)
    const sample = filtered[0] || {};
    const numericKeys = new Set();
    filtered.forEach(r => {
      Object.entries(r).forEach(([k,v])=>{
        if (v !== null && v !== undefined && !isNaN(Number(v))) numericKeys.add(k);
      });
    });
    let html = `<p><strong>Registros mostrados:</strong> ${count}</p>`;
    if (numericKeys.size){
      html += '<p><strong>Sumas (columnas numéricas):</strong> ';
      const parts = [];
      Array.from(numericKeys).slice(0,6).forEach(k=>{
        const sum = filtered.reduce((s,r)=>s + (isNaN(Number(r[k])) ? 0 : Number(r[k])),0);
        parts.push(`${k}: ${sum}`);
      });
      html += parts.join(' — ') + '</p>';
    }
    summary.innerHTML = html;
  }

  // Gráfico: Asumimos que hay columna de año y una columna numérica importante.
  function updateChart(filtered){
    const data = filtered || [];
    if (!data.length) {
      if (chart) chart.destroy();
      return;
    }
    // determinar clave de año:
    const yearKey = Object.keys(data[0]).find(k => /\b(año|anio|year|yr|YYYY)\b/i.test(k)) || Object.keys(data[0]).find(k => k.toLowerCase().includes('año') || k.toLowerCase().includes('year')) || 'Año';
    // determinar clave num (preferencias comunes)
    const preferredNums = ['Total_Registros_ONPE','Total_Registros','Total','Total_Reg','Indexados','Clasificados'];
    let numKey = Object.keys(data[0]).find(k => preferredNums.includes(k));
    if (!numKey){
      // primer campo numérico
      numKey = Object.keys(data[0]).find(k => !isNaN(Number(data[0][k])));
    }
    if (!numKey) {
      // no hay cifra numérica clara: no dibujar
      if (chart) chart.destroy();
      return;
    }

    const pairs = data.map(r => {
      const y = r[yearKey] ?? r['Año'] ?? '';
      const v = Number(r[numKey]) || 0;
      return {x: y, y: v};
    }).sort((a,b)=>{
      const na = Number(a.x), nb = Number(b.x);
      if (!isNaN(na) && !isNaN(nb)) return na-nb;
      return String(a.x).localeCompare(String(b.x));
    });

    const labels = pairs.map(p=>p.x);
    const values = pairs.map(p=>p.y);

    // crear/actualizar chart
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: numKey,
          data: values,
          tension: 0.25,
          fill: false,
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { title: { display: true, text: yearKey } },
          y: { title: { display: true, text: numKey }, beginAtZero: true }
        }
      }
    });
  }

  // CSV
  function downloadCSV(){
    if (!rows || rows.length === 0) return alert('No hay datos para descargar.');
    const colsSet = new Set();
    rows.forEach(r => Object.keys(r).forEach(k => colsSet.add(k)));
    const cols = Array.from(colsSet);
    const lines = [];
    lines.push(cols.map(c => `"${c.replace(/"/g,'""')}"`).join(','));
    rows.forEach(r=>{
      const row = cols.map(c=>{
        const v = r[c] ?? '';
        return `"${String(v).replace(/"/g,'""')}"`;
      }).join(',');
      lines.push(row);
    });
    const blob = new Blob([lines.join('\n')], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos_onpe.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // MAIN: fetch
  async function load(){
    setMessage('Cargando datos...');
    try {
      const resp = await fetch(JSON_URL, {cache: 'no-store'});
      if (!resp.ok) throw new Error(`Error HTTP ${resp.status} ${resp.statusText}`);
      const json = await resp.json();
      rawData = json;
      // detectar array principal
      const primary = findPrimaryArray(json);
      if (!primary){
        setMessage('No se encontró un array de registros en el JSON.');
        console.error('JSON completo:', json);
        renderTable([]);
        return;
      }
      rows = primary.map(r => {
        // aplanar keys simples (si hay subobjetos los dejamos en JSON)
        return r;
      });

      renderTable(rows);
      populateYears(rows);
      renderSummary(rows);
      updateChart(rows);
      setMessage(`Cargados ${rows.length} registros.`);
    } catch (err){
      console.error(err);
      setMessage(`No se pudo cargar datos desde ${JSON_URL} — ${err.message}`);
      renderTable([]);
    }
  }

  // event listeners
  searchInput.addEventListener('input', debounce(applyFilters, 220));
  yearFilter.addEventListener('change', applyFilters);
  downloadBtn.addEventListener('click', downloadCSV);
  resetBtn.addEventListener('click', ()=>{ searchInput.value=''; yearFilter.value='all'; applyFilters(); });

  // small debounce util
  function debounce(fn, wait=200){
    let t;
    return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
  }

  // arranca
  load();
});
