// app1.js
// Dashboard que consume datos1.json (colocar en la misma carpeta)

// --------------------------
// Util: formatea números con separador de miles
const fmtNum = n => {
  if (n === null || n === undefined) return "-";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// --------------------------
// Carga JSON
fetch("datos1.json")
  .then(resp => {
    if (!resp.ok) throw new Error("No se pudo cargar datos1.json");
    return resp.json();
  })
  .then(datos => {
    renderGeneral(datos);
    renderONPE(datos);
    renderNoONPE(datos);
    renderTables(datos);
    createCharts(datos);
  })
  .catch(err => {
    console.error("Error al cargar datos:", err);
    document.getElementById("general-content").innerHTML =
      `<div style="color:#b00">No se pudieron cargar los datos: ${err.message}</div>`;
  });

// --------------------------
// Render: General
function renderGeneral(datos) {
  // Según tu JSON: "Indexacion" y "clasificacion" (observa mayúsculas)
  const indexacion = datos.Indexacion || datos.indexacion || {};
  const clasificacion = datos.clasificacion || {};

  const html = `
    <div class="data-item"><strong>Total de registros:</strong> ${fmtNum(indexacion.Total_Registros ?? clasificacion.Total_de_registros ?? "-")}</div>

    <div class="data-item">
      <strong>Avance de Indexación:</strong><br>
      Indexados: ${fmtNum(indexacion.Colección_indexada ?? indexacion.Registros_Indexados ?? "-")}
      (<span class="index-ok">${indexacion["%_Colección_indexada"] ?? indexacion["%_Indexados"] ?? "-"}%</span>)
      | No Indexados: ${fmtNum(indexacion.Colección_no_indexada ?? indexacion.Registros_No_Indexados ?? "-")}
      (<span class="index-pending">${indexacion["%_Colección_no_indexada"] ?? indexacion["%_No_Indexados"] ?? "-"}%</span>)
    </div>

    <div class="data-item">
      <strong>Avance de Clasificación:</strong><br>
      Clasificados: ${fmtNum(clasificacion.Colección_clasificada ?? clasificacion.Registros_Clasificados ?? "-")}
      (<span class="clasif-ok">${clasificacion["%_Colección_clasificada"] ?? clasificacion["%_Clasificados"] ?? "-"}%</span>)
      | No Clasificados: ${fmtNum(clasificacion.Colección_no_clasificada ?? clasificacion.Registros_No_Clasificados ?? "-")}
      (<span class="clasif-pending">${clasificacion["%_Colección_no_clasificada"] ?? clasificacion["%_No_Clasificados"] ?? "-"}%</span>)
    </div>
  `;
  document.getElementById("general-content").innerHTML = html;
}

// --------------------------
// Render: ONPE
function renderONPE(datos) {
  const onpe = datos.onpe || {};
  const idx = onpe.indexacion || {};
  const cls = onpe.clasificacion || {};

  const html = `
    <div class="data-item"><strong>Total ONPE:</strong> ${fmtNum(idx.Total_registros ?? cls.Total_registros ?? "-")}</div>

    <div class="data-item">
      <strong>Indexación ONPE:</strong><br>
      Indexados: ${fmtNum(idx.Registros_Indexados ?? "-")} (<span class="index-ok">${idx["%_Indexados"] ?? "-"}%</span>)
      | No Indexados: ${fmtNum(idx.Registros_No_Indexados ?? "-")} (<span class="index-pending">${idx["%_No_Indexados"] ?? "-"}%</span>)
    </div>

    <div class="data-item">
      <strong>Clasificación ONPE:</strong><br>
      Clasificados: ${fmtNum(cls.Registros_Clasificados ?? "-")} (<span class="clasif-ok">${cls["%_Clasificados"] ?? "-"}%</span>)
      | No Clasificados: ${fmtNum(cls.Registros_No_Clasificados ?? "-")} (<span class="clasif-pending">${cls["%_No_Clasificados"] ?? "-"}%</span>)
    </div>
  `;
  document.getElementById("onpe-content").innerHTML = html;
}

// --------------------------
// Render: No ONPE
function renderNoONPE(datos) {
  const noOnpe = datos.no_onpe || {};
  const idx = noOnpe.indexacion || {};
  const cls = noOnpe.clasificacion || {};

  const html = `
    <div class="data-item"><strong>Total No ONPE:</strong> ${fmtNum(idx.Total_registros ?? cls.Total_de_registros ?? "-")}</div>

    <div class="data-item">
      <strong>Indexación No ONPE:</strong><br>
      Indexados: ${fmtNum(idx.Registros_Indexados ?? idx.Indexados ?? "-")} (<span class="index-ok">${idx["%_Indexados"] ?? "-"}%</span>)
      | No Indexados: ${fmtNum(idx.Registros_No_Indexados ?? idx.No_Indexados ?? "-")} (<span class="index-pending">${idx["%_No_Indexados"] ?? "-"}%</span>)
    </div>

    <div class="data-item">
      <strong>Clasificación No ONPE:</strong><br>
      Clasificados: ${fmtNum(cls.Colección_clasificada ?? "-")} (<span class="clasif-ok">${cls["%_Colección_clasificada"] ?? "-"}%</span>)
      | No Clasificados: ${fmtNum(cls.Colección_no_clasificada ?? "-")} (<span class="clasif-pending">${cls["%_Colección_no_clasificada"] ?? "-"}%</span>)
    </div>
  `;
  document.getElementById("no-onpe-content").innerHTML = html;
}

// --------------------------
// Render tablas
function renderTables(datos) {
  // ONPE por año
  const serie = (datos.onpe && datos.onpe.serie_por_ano) || [];
  const tbodyOnpe = document.querySelector("#onpe-table tbody");
  tbodyOnpe.innerHTML = serie.map(a => `
    <tr>
      <td>${a.Año}</td>
      <td>${fmtNum(a.Total_Registros_ONPE)}</td>
      <td>${fmtNum(a.Clasificados)}</td>
      <td>${a["%_Clasificados"] ?? "-"}%</td>
      <td>${fmtNum(a.No_Clasificados)}</td>
      <td>${a["%_No_Clasificados"] ?? "-"}%</td>
      <td>${fmtNum(a.Indexados)}</td>
      <td>${a["%_Indexados"] ?? "-"}%</td>
      <td>${fmtNum(a.No_Indexados)}</td>
      <td>${a["%_No_Indexados"] ?? "-"}%</td>
    </tr>
  `).join("");

  // Instituciones No ONPE
  const instituciones = (datos.no_onpe && datos.no_onpe.instituciones) || [];
  const tbodyNoOnpe = document.querySelector("#no-onpe-table tbody");
  tbodyNoOnpe.innerHTML = instituciones.map(i => `
    <tr>
      <td>${i.Institución}</td>
      <td>${fmtNum(i.Total_Registros)}</td>
      <td>${fmtNum(i.Clasificados)}</td>
      <td>${i["%_Clasificados"] ?? "-"}%</td>
      <td>${fmtNum(i.No_Clasificados)}</td>
      <td>${i["%_No_Clasificados"] ?? "-"}%</td>
      <td>${fmtNum(i.Indexados)}</td>
      <td>${i["%_Indexados"] ?? "-"}%</td>
      <td>${fmtNum(i.No_Indexados)}</td>
      <td>${i["%_No_Indexados"] ?? "-"}%</td>
    </tr>
  `).join("");
}

// --------------------------
// Charts (Chart.js)
function createCharts(datos) {
  // 1) General chart: comparación % indexación vs % clasificación (global)
  const idx = datos.Indexacion || {};
  const cls = datos.clasificacion || {};
  const generalCtx = document.getElementById("generalChart").getContext("2d");

  const generalData = {
    labels: ["Indexación (%)", "Clasificación (%)"],
    datasets: [{
      label: "Avance (%)",
      data: [
        Number(idx["%_Colección_indexada"] ?? idx["%_Indexados"] ?? 0),
        Number(cls["%_Colección_clasificada"] ?? cls["%_Clasificados"] ?? 0)
      ],
      backgroundColor: ["rgba(11,94,215,0.6)", "rgba(25,135,84,0.6)"],
      barThickness: 32
    }]
  };

  // eslint-disable-next-line no-unused-vars
  const generalChart = new Chart(generalCtx, {
    type: "bar",
    data: generalData,
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" } }
      }
    }
  });

  // 2) ONPE line chart: %_Clasificados por año (serie)
  const serie = (datos.onpe && datos.onpe.serie_por_ano) || [];
  const years = serie.map(s => s.Año);
  const pctClas = serie.map(s => Number(s["%_Clasificados"] ?? 0));
  const onpeLineCtx = document.getElementById("onpeLineChart").getContext("2d");

  // eslint-disable-next-line no-unused-vars
  const onpeLineChart = new Chart(onpeLineCtx, {
    type: "line",
    data: {
      labels: years,
      datasets: [{
        label: "% Clasificados",
        data: pctClas,
        tension: 0.25,
        fill: true,
        pointRadius: 3,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" } }
      }
    }
  });

  // 3) Instituciones: barras - % Indexados por institución (no_onpe.instituciones)
  const instituciones = (datos.no_onpe && datos.no_onpe.instituciones) || [];
  const instLabels = instituciones.map(i => i.Institución);
  const instPctIndex = instituciones.map(i => Number(i["%_Indexados"] ?? 0));
  const instCtx = document.getElementById("institucionesBarChart").getContext("2d");

  // eslint-disable-next-line no-unused-vars
  const instChart = new Chart(instCtx, {
    type: "bar",
    data: {
      labels: instLabels,
      datasets: [{
        label: "% Indexados",
        data: instPctIndex,
        backgroundColor: instLabels.map((_, idx) => `rgba(${40 + idx*20 % 200}, ${120 + idx*10 % 120}, ${200 - idx*10 % 120}, 0.65)`)
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" } }
      }
    }
  });
}
