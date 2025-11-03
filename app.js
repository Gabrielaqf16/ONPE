/* app.js */
if(!res.ok) throw new Error('HTTP ' + res.status + ' — No se pudo cargar datos.json');
const data = await res.json();


mostrarGeneral(data.descriptores, data.clasificación);
mostrarOnpe(data.onpe);
mostrarNoOnpe(data.no_onpe);
} catch(err) {
console.error(err);
showError('Error cargando datos.json — ' + err.message + '.


Si abres el archivo localmente (file:///) es probable que el navegador bloquee fetch. Ejecuta un servidor local (ver instrucciones en la documentación).');
// Dejar mensajes de carga visibles
document.getElementById('general-info').textContent = 'No se pudo cargar.';
document.getElementById('onpe-info').textContent = 'No se pudo cargar.';
document.getElementById('no-onpe-info').textContent = 'No se pudo cargar.';
}


function mostrarGeneral(descriptores, clasificacion) {
const cont = document.getElementById('general-info');
if(!descriptores || !clasificacion) return;
cont.innerHTML = `
<p><strong>Total de registros:</strong> ${format(descriptores.Total_Registros)}</p>
<h3>Avance de Indexación</h3>
${barra(descriptores['%_Colección_indexada'], descriptores['%_Colección_no_indexada'])}
<h3>Avance de Clasificación</h3>
${barra(clasificacion['%_Colección_clasificada'], clasificacion['%_Colección_no_clasificada'])}
`;
}


function mostrarOnpe(onpe) {
const cont = document.getElementById('onpe-info');
if(!onpe) return;
cont.innerHTML = `
<p><strong>Total Registros ONPE:</strong> ${format(onpe.indexacion.Total_registros)}</p>
<h3>Indexación ONPE</h3>
${barra(onpe.indexacion['%_Indexados'], onpe.indexacion['%_No_Indexados'])}
<h3>Clasificación ONPE</h3>
${barra(onpe.clasificacion['%_Clasificados'], onpe.clasificacion['%_No_Clasificados'])}
`;


const tabla = document.getElementById('onpe-table');
tabla.innerHTML = `
<tr><th>Año</th><th>Total</th><th>Clasificados</th><th>%</th><th>No Clasificados</th><th>%</th><th>Indexados</th><th>%</th><th>No Indexados</th><th>%</th></tr>
`;
onpe.serie_por_ano.forEach(a=>{
const tr = document.createElement('tr');
tr.innerHTML = `
<td>${a.Año}</td>
<td>${format(a.Total_Registros_ONPE)}</td>
<td>${format(a.Clasificados)}</td>
<td>${a['%_Clasificados']}%</td>
<td>${format(a.No_Clasificados)}</td>
<td>${a['%_No_Clasificados']}%</td>
<td>${format(a.Indexados)}</td>
<td>${a['%_Indexados']}%</td>
<td>${format(a.No_Indexados)}</td>
<td>${a['%_No_Indexados']}%</td>
`;
tabla.appendChild(tr);
});
}


function mostrarNoOnpe(no_onpe) {
const cont = document.getElementById('no-onpe-info');
if(!no_onpe) return;
cont.innerHTML = `
<p><strong>Total Registros No ONPE:</strong> ${format(no_onpe.indexacion.Total_registros)}</p>
<h3>Indexación No ONPE</h3>
${barra(no_onpe.indexacion['%_Indexados'], no_onpe.indexacion['%_No_Indexados'])}
<h3>Clasificación No ONPE</h3>
${barra(no_onpe.clasificacion['%_Colección_clasificada'], no_onpe.clasificacion['%_Colección_no_clasificada'])}
`;


const tabla = document.getElementById('instituciones-table');
tabla.innerHTML = `
<tr><th>Institución</th><th>Total</th><th>Clasificados</th><th>%</th><th>No Clasificados</th><th>%</th><th>Indexados</th><th>%</th><th>No Indexados</th><th>%</th></tr>
`;
no_onpe.instituciones.forEach(inst=>{
const tr = document.createElement('tr');
tr.innerHTML = `
<td>${inst.Institución}</td>
<td>${format(inst.Total_Registros)}</td>
<td>${format(inst.Clasificados)}</td>
<td>${inst['%_Clasificados']}%</td>
<td>${format(inst.No_Clasificados)}</td>
<td>${inst['%_No_Clasificados']}%</td>
<td>${format(inst.Indexados)}</td>
<td>${inst['%_Indexados']}%</td>
<td>${format(inst.No_Indexados)}</td>
<td>${inst['%_No_Indexados']}%</td>
`;
tabla.appendChild(tr);
});
}


function barra(p1, p2) {
return `
<div class="progress"><div class="progress-bar indexado" style="width:${p1}%">${p1}%</div></div>
<div class="progress"><div class="progress-bar no-indexado" style="width:${p2}%">${p2}%</div></div>
`;
}


function format(n){ return new Intl.NumberFormat('es-PE').format(n); }
})();
