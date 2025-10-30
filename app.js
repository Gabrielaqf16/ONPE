document.addEventListener('DOMContentLoaded', () => {
    fetch('datos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar datos.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            renderGeneralStats(data);
            renderOnpeStats(data);
            renderNoOnpeStats(data);
        })
        .catch(error => console.error('Error:', error));
});

/**
 * Función auxiliar para actualizar la barra de progreso
 * @param {string} barId - ID del elemento .progress-bar
 * @param {string} textId - ID del elemento .progress-text
 * @param {number} percentage - Porcentaje a mostrar (0-100)
 * @param {number} total - Total de registros
 * @param {number} done - Registros completados
 */
function updateProgressBar(barId, textId, percentage, total, done) {
    const bar = document.getElementById(barId);
    const text = document.getElementById(textId);
    
    // Asegurar que el porcentaje sea un número válido y dentro de 0-100
    const validPercentage = Math.max(0, Math.min(100, percentage));

    bar.style.width = `${validPercentage}%`;
    text.textContent = `${done.toLocaleString()} / ${total.toLocaleString()} (${validPercentage.toFixed(2)}%)`;
}

// --- 1. Colección General ---
function renderGeneralStats(data) {
    const total = data.descriptores.Total_Registros;

    // Total de Registros
    document.getElementById('total-registros').textContent = total.toLocaleString();

    // Indexación General
    const indexacionPct = data.descriptores['%_Colección_indexada'];
    const indexacionDone = data.descriptores.Colección_indexada;
    updateProgressBar(
        'progreso-indexacion', 
        'texto-indexacion', 
        indexacionPct, 
        total, 
        indexacionDone
    );

    // Clasificación General
    const clasificacionPct = data.clasificación['%_Colección_clasificada'];
    const clasificacionDone = data.clasificación.Colección_clasificada;
    updateProgressBar(
        'progreso-clasificacion', 
        'texto-clasificacion', 
        clasificacionPct, 
        total, 
        clasificacionDone
    );
}

// --- 2. Colección ONPE ---
function renderOnpeStats(data) {
    const onpe = data.onpe;
    const totalOnpe = onpe.indexacion.Total_registros; 
    
    document.getElementById('total-registros-onpe').textContent = totalOnpe.toLocaleString();

    // Indexación ONPE
    const indexacionPct = onpe.indexacion['%_Indexados'];
    const indexacionDone = onpe.indexacion.Registros_Indexados;
    updateProgressBar(
        'progreso-onpe-indexacion', 
        'texto-onpe-indexacion', 
        indexacionPct, 
        totalOnpe, 
        indexacionDone
    );

    // Clasificación ONPE
    const clasificacionPct = onpe.clasificacion['%_Clasificados'];
    const clasificacionDone = onpe.clasificacion.Registros_Clasificados;
    updateProgressBar(
        'progreso-onpe-clasificacion', 
        'texto-onpe-clasificacion', 
        clasificacionPct, 
        totalOnpe, 
        clasificacionDone
    );

    // Tabla ONPE por Año
    const tableContainer = document.getElementById('tabla-onpe-ano');
    tableContainer.innerHTML = createOnpeYearTable(onpe.serie_por_ano);
}

function createOnpeYearTable(series) {
    let html = '<table>';
    html += `<thead><tr>
                <th>Año</th>
                <th>Total Registros</th>
                <th>Clasificados (%)</th>
                <th>Avance Clasificación</th>
                <th>Indexados (%)</th>
                <th>Avance Indexación</th>
             </tr></thead><tbody>`;

    series.forEach(item => {
        html += `<tr>
                    <td>${item.Año}</td>
                    <td>${item.Total_Registros_ONPE}</td>
                    <td>${item['%_Clasificados'].toFixed(2)}% (${item.Clasificados})</td>
                    <td>${createTableProgressBar(item['%_Clasificados'], '#007bff')}</td>
                    <td>${item['%_Indexados'].toFixed(2)}% (${item.Indexados})</td>
                    <td>${createTableProgressBar(item['%_Indexados'], '#007bff')}</td>
                 </tr>`;
    });

    html += '</tbody></table>';
    return html;
}

// --- 3. Colección NO ONPE ---
function renderNoOnpeStats(data) {
    const noOnpe = data.no_onpe;
    const totalNoOnpe = noOnpe.indexacion.Total_registros; // Usamos el total de indexación de NO ONPE

    document.getElementById('total-registros-no-onpe').textContent = totalNoOnpe.toLocaleString();
    
    // Indexación NO ONPE
    const indexacionPct = noOnpe.indexacion['%_Indexados'];
    const indexacionDone = noOnpe.indexacion.Registros_Indexados;
    updateProgressBar(
        'progreso-no-onpe-indexacion', 
        'texto-no-onpe-indexacion', 
        indexacionPct, 
        totalNoOnpe, 
        indexacionDone
    );

    // Clasificación NO ONPE (Usamos el cálculo basado en el total NO ONPE del JSON)
    const clasificacionPct = (noOnpe.clasificacion.Colección_clasificada / totalNoOnpe) * 100;
    const clasificacionDone = noOnpe.clasificacion.Colección_clasificada;
    
    // NOTA: El JSON de 'no_onpe.clasificacion' tiene datos de la colección general (6259), 
    // pero para ser lógicamente 'Clasificación NO ONPE', calculamos con los totales de NO ONPE.
    // Si quisieras usar los valores directos del JSON, el total sería 6259, lo cual no es correcto para NO ONPE.
    // Asumimos que los totales clasificados (2406) son los correctos de NO ONPE (suma de las instituciones).
    // Corregimos la lógica: la suma de clasificados en instituciones es 2406. El total NO ONPE es 3659.
    const clasifNoOnpeTotal = noOnpe.instituciones.reduce((sum, inst) => sum + inst.Clasificados, 0); // 2082 + 248 + 76 = 2406
    const clasifNoOnpePct = (clasifNoOnpeTotal / totalNoOnpe) * 100; // 2406 / 3659 = 65.76% (coincide con el dato)
    
    updateProgressBar(
        'progreso-no-onpe-clasificacion', 
        'texto-no-onpe-clasificacion', 
        clasifNoOnpePct, 
        totalNoOnpe, 
        clasifNoOnpeTotal
    );

    // Tabla NO ONPE por Institución
    const tableContainer = document.getElementById('tabla-no-onpe-institucion');
    tableContainer.innerHTML = createNoOnpeInstitucionTable(noOnpe.instituciones);
}

function createNoOnpeInstitucionTable(instituciones) {
    let html = '<table>';
    html += `<thead><tr>
                <th>Institución</th>
                <th>Total Registros</th>
                <th>Clasificados (%)</th>
                <th>Avance Clasificación</th>
                <th>Indexados (%)</th>
                <th>Avance Indexación</th>
             </tr></thead><tbody>`;

    instituciones.forEach(item => {
        html += `<tr>
                    <td>${item.Institución}</td>
                    <td>${item.Total_Registros}</td>
                    <td>${item['%_Clasificados'].toFixed(2)}% (${item.Clasificados})</td>
                    <td>${createTableProgressBar(item['%_Clasificados'], '#ffc107')}</td>
                    <td>${item['%_Indexados'].toFixed(2)}% (${item.Indexados})</td>
                    <td>${createTableProgressBar(item['%_Indexados'], '#ffc107')}</td>
                 </tr>`;
    });

    html += '</tbody></table>';
    return html;
}

// --- Función auxiliar para la barra de progreso dentro de la tabla ---
function createTableProgressBar(percentage, color) {
    const validPercentage = Math.max(0, Math.min(100, percentage));
    return `
        <div class="table-progress-bar-container">
            <div class="table-progress-bar" style="width: ${validPercentage}%; background-color: ${color};"></div>
        </div>
    `;
}
