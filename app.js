// app.js
.then(response => response.json())
.then(data => {
mostrarGeneral(data.descriptores, data.clasificación);
mostrarOnpe(data.onpe);
mostrarNoOnpe(data.no_onpe);
});


function mostrarGeneral(descriptores, clasificacion) {
const cont = document.getElementById('general-info');
cont.innerHTML = `
<p><strong>Total de registros:</strong> ${descriptores.Total_Registros}</p>
<h3>Avance de Indexación</h3>
${barra(descriptores['%_Colección_indexada'], descriptores['%_Colección_no_indexada'])}
<h3>Avance de Clasificación</h3>
${barra(clasificacion['%_Colección_clasificada'], clasificacion['%_Colección_no_clasificada'])}
`;
}


function mostrarOnpe(onpe) {
const cont = document.getElementById('onpe-info');
cont.innerHTML = `
<p><strong>Total Registros ONPE:</strong> ${onpe.indexacion.Total_registros}</p>
<h3>Indexación ONPE</h3>
${barra(onpe.indexacion['%_Indexados'], onpe.indexacion['%_No_Indexados'])}
<h3>Clasificación ONPE</h3>
${barra(onpe.clasificacion['%_Clasificados'], onpe.clasificacion['%_No_Clasificados'])}
`;


const tabla = document.getElementById('onpe-table');
tabla.innerHTML = `
<tr><th>Año</th><th>Total</th><th>Clasificados</th><th>%</th><th>No Clasificados</th><th>%</th><th>Indexados</th><th>%</th><th>No Indexados</th><th>%</th></tr>
${onpe.serie_por_ano.map(a => `
<tr>
<td>${a.Año}</td>
<td>${a.Total_Registros_ONPE}</td>
<td>${a.Clasificados}</td>
<td>${a['%_Clasificados']}</td>
<td>${a.No_Clasificados}</td>
<td>${a['%_No_Clasificados']}</td>
<td>${a.Indexados}</td>
<td>${a['%_Indexados']}</td>
<td>${a.No_Indexados}</td>
<td>${a['%_No_Indexados']}</td>
</tr>
`).join('')}
`;
}


function mostrarNoOnpe(no_onpe) {
const cont = document.getElementById('no-onpe-info');
cont.innerHTML = `
<p><strong>Total Registros No ONPE:</strong> ${no_onpe.indexacion.Total_registros}</p>
<h3>Indexación No ONPE</h3>
${barra(no_onpe.indexacion['%_Indexados'], no_onpe.indexacion['%_No_Indexados'])}
<h3>Clasificación No ONPE</h3>
${barra(no_onpe.clasificacion['%_Colección_clasificada'], no_onpe.clasificacion['%_Colección_no_clasificada'])}
`;


const tabla = document.getElementById('instituciones-table');
tabla.innerHTML = `
<tr><th>Institución</th><th>Total</th><th>Clasificados</th><th>%</th><th>No Clasificados</th><th>%</th><th>Indexados</th><th>%</th><th>No Indexados</th><th>%</th></tr>
${no_onpe.instituciones.map(inst => `
<tr>
<td>${inst.Institución}</td>
<td>${inst.Total_Registros}</td>
<td>${inst.Clasificados}</td>
<td>${inst['%_Clasificados']}</td>
<td>${inst.No_Clasificados}</td>
<td>${inst['%_No_Clasificados']}</td>
<td>${inst.Indexados}</td>
<td>${inst['%_Indexados']}</td>
<td>${inst.No_Indexados}</td>
<td>${inst['%_No_Indexados']}</td>
</tr>
`).join('')}
`;
}


function barra(p1, p2) {
return `
<div class="progress">
<div class="progress-bar indexado" style="width:${p1}%">${p1}%</div>
</div>
<div class="progress">
<div class="progress-bar no-indexado" style="width:${p2}%">${p2}%</div>
</div>
`;
}
