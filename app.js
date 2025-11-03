// app.js
(async function(){
  const showError = msg => {
    const e = document.getElementById('error');
    e.style.display = 'block';
    e.textContent = msg;
  };

  try {
    // fetch datos.json (mismo directorio)
    const res = await fetch('datos.json', {cache: 'no-store'});
    if (!res.ok) throw new Error(`HTTP ${res.status} al cargar datos.json`);
    const datos = await res.json();

    // útiles
    const fmt = n => new Intl.NumberFormat('es-PE').format(n ?? 0);
    const pct = v => (Math.round((+v + Number.EPSILON) * 100) / 100) + '%';

    // --- Colección general ---
    const totalGeneral = datos.descriptores?.Total_Registros ?? datos.clasificación?.Total_de_registros ?? 0;
    document.getElementById('total-general').textContent = fmt(totalGeneral);

    const genIndexados = datos.descriptores?.['Colección_indexada'] ?? 0;
    const genNoIndex = datos.descriptores?.['Colección_no_indexada'] ?? 0;
    const genIndexPct = datos.descriptores?.['%_Colección_indexada'] ?? (genIndexados + genNoIndex ? genIndexados/(genIndexados+genNoIndex)*100 : 0);
    const genNoIndexPct = datos.descriptores?.['%_Colección_no_indexada'] ?? (100 - genIndexPct);

    document.getElementById('gen-indexados').textContent = fmt(genIndexados);
    document.getElementById('gen-noindex').textContent = fmt(genNoIndex);
    document.getElementById('gen-index-pct').textContent = pct(genIndexPct);
    animateBar('gen-index-bar', genIndexPct);

    const genClas = datos.clasificación?.['Colección_clasificada'] ?? 0;
    const genNoClas = datos.clasificación?.['Colección_no_clasificada'] ?? 0;
    const genClasPct = datos.clasificación?.['%_Colección_clasificada'] ?? (genClas + genNoClas ? genClas/(genClas+genNoClas)*100 : 0);
    document.getElementById('gen-clasificados').textContent = fmt(genClas);
    document.getElementById('gen-noclas').textContent = fmt(genNoClas);
    document.getElementById('gen-clas-pct').textContent = pct(genClasPct);
    animateBar('gen-clas-bar', genClasPct);

    // --- ONPE ---
    const onpeIndex = datos.onpe?.indexacion ?? {};
    const onpeClas = datos.onpe?.clasificacion ?? {};
    const onpeSerie = datos.onpe?.serie_por_ano ?? [];

    document.getElementById('total-onpe').textContent = fmt(onpeIndex.Total_registros ?? onpeClas.Total_registros ?? 0);

    document.getElementById('onpe-indexados').textContent = fmt(onpeIndex.Registros_Indexados ?? 0);
    document.getElementById('onpe-noindex').textContent = fmt(onpeIndex.Registros_No_Indexados ?? 0);
    document.getElementById('onpe-index-pct').textContent = pct(onpeIndex['%_Indexados'] ?? (onpeIndex.Registros_Indexados && onpeIndex.Registros_No_Indexados ? (onpeIndex.Registros_Indexados/(onpeIndex.Registros_Indexados+onpeIndex.Registros_No_Indexados)*100) : 0));
    animateBar('onpe-index-bar', onpeIndex['%_Indexados'] ?? 0);

    document.getElementById('onpe-clasificados').textContent = fmt(onpeClas.Registros_Clasificados ?? 0);
    document.getElementById('onpe-noclas').textContent = fmt(onpeClas.Registros_No_Clasificados ?? 0);
    document.getElementById('onpe-clas-pct').textContent = pct(onpeClas['%_Clasificados'] ?? 0);
    animateBar('onpe-clas-bar', onpeClas['%_Clasificados'] ?? 0);

    // tabla ONPE años
    const tbodyOnpe = document.querySelector('#onpe-years tbody');
    tbodyOnpe.innerHTML = '';
    (onpeSerie || []).forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.Año}</td>
        <td>${fmt(r.Total_Registros_ONPE)}</td>
        <td>${fmt(r.Clasificados)}</td>
        <td>${r['%_Clasificados'] ?? '-' }%</td>
        <td>${fmt(r.No_Clasificados)}</td>
        <td>${r['%_No_Clasificados'] ?? '-'}%</td>
        <td>${fmt(r.Indexados)}</td>
        <td>${r['%_Indexados'] ?? '-'}%</td>
        <td>${fmt(r.No_Indexados)}</td>
        <td>${r['%_No_Indexados'] ?? '-'}%</td>
      `;
      tbodyOnpe.appendChild(tr);
    });

    // --- NO ONPE ---
    const noOnpeIndex = datos.no_onpe?.indexacion ?? {};
    const noOnpeClas = datos.no_onpe?.clasificacion ?? {};
    const noOnpeInst = datos.no_onpe?.instituciones ?? [];

    document.getElementById('total-noonpe').textContent = fmt(noOnpeIndex.Total_registros ?? noOnpeClas.Total_de_registros ?? 0);

    document.getElementById('noonpe-indexados').textContent = fmt(noOnpeIndex.Registros_Indexados ?? 0);
    document.getElementById('noonpe-noindex').textContent = fmt(noOnpeIndex.Registros_No_Indexados ?? 0);
    document.getElementById('noonpe-index-pct').textContent = pct(noOnpeIndex['%_Indexados'] ?? 0);
    animateBar('noonpe-index-bar', noOnpeIndex['%_Indexados'] ?? 0);

    document.getElementById('noonpe-clasificados').textContent = fmt(noOnpeClas['Colección_clasificada'] ?? 0);
    document.getElementById('noonpe-noclas').textContent = fmt(noOnpeClas['Colección_no_clasificada'] ?? 0);
    document.getElementById('noonpe-clas-pct').textContent = pct(noOnpeClas['%_Colección_clasificada'] ?? 0);
    animateBar('noonpe-clas-bar', noOnpeClas['%_Colección_clasificada'] ?? 0);

    // tabla instituciones
    const tbodyInst = document.querySelector('#instituciones tbody');
    tbodyInst.innerHTML = '';
    (noOnpeInst || []).forEach(i=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i.Institución}</td>
        <td>${fmt(i.Total_Registros)}</td>
        <td>${fmt(i.Clasificados)}</td>
        <td>${i['%_Clasificados'] ?? '-'}%</td>
        <td>${fmt(i.No_Clasificados)}</td>
        <td>${i['%_No_Clasificados'] ?? '-'}%</td>
        <td>${fmt(i.Indexados)}</td>
        <td>${i['%_Indexados'] ?? '-'}%</td>
        <td>${fmt(i.No_Indexados)}</td>
        <td>${i['%_No_Indexados'] ?? '-'}%</td>
      `;
      tbodyInst.appendChild(tr);
    });

  } catch (err) {
    console.error('Error cargando datos.json:', err);
    showError('No se pudieron cargar los datos desde datos.json. ' +
      'Si abriste el archivo con doble clic (file:///) el navegador bloquea fetch. ' +
      'Ejecuta un servidor local (Live Server o python -m http.server) y vuelve a intentarlo. ' +
      'Mensaje: ' + err.message);
  }

  // anima ancho de barra (segura con min,max)
  function animateBar(id, pct){
    const el = document.getElementById(id);
    const v = Math.max(0, Math.min(100, Number(pct) || 0));
    // pequeña pausa para que la transición se vea
    requestAnimationFrame(()=> setTimeout(()=> el.style.width = v + '%', 50));
  }
})();
