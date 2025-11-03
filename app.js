// ... (Objeto dashboardData VA AQUÍ, es el mismo de la respuesta anterior) ...
// ... (Las funciones document.addEventListener y renderOnpeTable / renderNoOnpeTable van después) ...


// --- Funciones de Renderizado (SOLO LAS TRES FUNCIONES DE RESUMEN CAMBIAN) ---

function renderColeccionGeneral() {
    const data = dashboardData;
    const generalContent = document.getElementById('general-content');

    const indexacion = data.descriptores;
    const clasificacion = data.clasificación;

    const indexacionPct = indexacion['%_Colección_indexada'];
    const clasificacionPct = clasificacion['%_Colección_clasificada'];

    let html = `
        <div class="data-item">
            <strong>Total de Registros:</strong>
            <span>${indexacion.Total_Registros}</span>
        </div>
        
        <div class="data-item">
            <div>
                <strong>Avance de Indexación:</strong>
                Indexados: ${indexacion.Colección_indexada} | No Indexados: ${indexacion.Colección_no_indexada}
            </div>
            <div>
                <div class="progress-container">
                    <div class="progress-bar bg-index" style="width: ${indexacionPct}%;"></div>
                </div>
                <span class="text-ok">${indexacionPct}% Indexado</span>
            </div>
        </div>

        <div class="data-item">
            <div>
                <strong>Avance de Clasificación:</strong>
                Clasificados: ${clasificacion.Colección_clasificada} | No Clasificados: ${clasificacion.Colección_no_clasificada}
            </div>
            <div>
                <div class="progress-container">
                    <div class="progress-bar bg-clasif" style="width: ${clasificacionPct}%;"></div>
                </div>
                <span class="text-ok">${clasificacionPct}% Clasificado</span>
            </div>
        </div>
    `;
    generalContent.innerHTML = html;
}

function renderColeccionOnpe() {
    const data = dashboardData.onpe;
    const onpeContent = document.getElementById('onpe-content');
    const indexacion = data.indexacion;
    const clasificacion = data.clasificacion;

    const indexacionPct = indexacion['%_Indexados'];
    const clasificacionPct = clasificacion['%_Clasificados'];

    let html = `
        <div class="data-item">
            <strong>Total Registros ONPE:</strong>
            <span>${indexacion.Total_registros}</span>
        </div>

        <div class="data-item">
            <div>
                <strong>Indexación ONPE:</strong>
                Indexados: ${indexacion.Registros_Indexados} | No Indexados: ${indexacion.Registros_No_Indexados}
            </div>
            <div>
                <div class="progress-container">
                    <div class="progress-bar bg-index" style="width: ${indexacionPct}%;"></div>
                </div>
                <span class="text-ok">${indexacionPct}% Indexado</span>
            </div>
        </div>

        <div class="data-item">
            <div>
                <strong>Clasificación ONPE:</strong>
                Clasificados: ${clasificacion.Registros_Clasificados} | No Clasificados: ${clasificacion.Registros_No_Clasificados}
            </div>
            <div>
                <div class="progress-container">
                    <div class="progress-bar bg-clasif" style="width: ${clasificacionPct}%;"></div>
                </div>
                <span class="text-ok">${clasificacionPct}% Clasificado</span>
            </div>
        </div>
    `;
    onpeContent.innerHTML = html;
}

function renderColeccionNoOnpe() {
    const data = dashboardData.no_onpe;
    const noOnpeContent = document.getElementById('no-onpe-content');
    const indexacion = data.indexacion;
    const clasificacion = data.clasificacion;

    const indexacionPct = indexacion['%_Indexados'];
    const clasificacionPct = clasificacion['%_Colección_clasificada'];

    let html = `
        <div class="data-item">
            <strong>Total Registros No ONPE:</strong>
            <span>${indexacion.Total_registros}</span>
        </div>

        <div class="data-item">
            <div>
                <strong>Indexación No ONPE:</strong>
                Indexados: ${indexacion.Registros_Indexados} | No Indexados: ${indexacion.Registros_No_Indexados}
            </div>
            <div>
                <div class="progress-container">
                    <div class="progress-bar bg-index" style="width: ${indexacionPct}%;"></div>
                </div>
                <span class="${indexacionPct >= 90 ? 'text-ok' : 'text-pending'}">${indexacionPct}% Indexado</span>
            </div>
        </div>

        <div class="data-item">
            <div>
                <strong>Clasificación No ONPE:</strong>
                Clasificados: ${clasificacion.Colección_clasificada} | No Clasificados: ${clasificacion.Colección_no_clasificada}
            </div>
            <div>
                <div class="progress-container">
                    <div class="progress-bar bg-clasif" style="width: ${clasificacionPct}%;"></div>
                </div>
                <span class="${clasificacionPct >= 90 ? 'text-ok' : 'text-pending'}">${clasificacionPct}% Clasificado</span>
            </div>
        </div>
    `;
    noOnpeContent.innerHTML = html;
}
