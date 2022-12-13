function encontrarPersonas(personaBusqueda) {
    return salarios.find( element => element.name == personaBusqueda );
};

function medianaXPersona(personaMediana) {
    const personaTrabajos = encontrarPersonas(personaMediana).trabajos;
    const personaSalarios = personaTrabajos.map( (element) => element.salario);
    return MhMath.calcularMediana(personaSalarios);
};

function proyeccionSalarial(personaProyeccion) {
    const trabajos = encontrarPersonas(personaProyeccion).trabajos;    
    const proyeccionCrecimiento = []
    
    for( i=1; i<trabajos.length; i++) {
        const salarioActual = trabajos[i].salario;
        const salarioPasado = trabajos[i-1].salario;
        const porcentajeCrecimiento = (salarioActual - salarioPasado) / salarioPasado;
        proyeccionCrecimiento.push(porcentajeCrecimiento);       
    };

    const medianaPorcentajeCrecimiento = MhMath.calcularMediana(proyeccionCrecimiento);    
    const ultimoSalario = trabajos[trabajos.length - 1].salario;
    const nuevoSalario = (ultimoSalario * medianaPorcentajeCrecimiento) + ultimoSalario;
    console.log(`Tu próximo nuevo salario 2024 estimado es u$ ${nuevoSalario}`);
    
    let proyeccion = [];
    let years = 2023;
    let sueldo = ultimoSalario;
    for( i=0; i<trabajos.length; i++) {
        years++;
        sueldo += sueldo * medianaPorcentajeCrecimiento;
        proyeccion.push({
            year: years,
            sueldo: sueldo,
        });
    };
    return proyeccion;
};

console.log(salarios);
const empresas = {};
for(persona of salarios) {
    for(trabajo of persona.trabajos) {
        if(!empresas[trabajo.empresa]) {
            empresas[trabajo.empresa] = {};
        };

        if(!empresas[trabajo.empresa][trabajo.year]) {
            empresas[trabajo.empresa][trabajo.year] = [];
        };

        empresas[trabajo.empresa][trabajo.year].push(trabajo.salario);
    };
};
console.log(empresas);

function calcularMedianaEmpresas(company, year) {
    if(!empresas[company] || !empresas[company][year]) {
        console.warn('No hay datos disponibles para los criterios de búsqueda');
        return;
    };
    return MhMath.calcularMediana(empresas[company][year]);
};

function calcularProyeccionEmpresas(empresa) {
    if(!empresas[empresa]) {
        console.warn('la empresa no existe');
    } else {
        const empresaYears = Object.keys(empresas[empresa]);
        const listMedianaYears = empresaYears.map((year) => {
            return calcularMedianaEmpresas(empresa, year);
        });
        console.log(empresaYears);
        console.log(listMedianaYears);

        let porcentajesCrecimiento = [];
        for (let i=1; i<listMedianaYears.length; i++) {
            const yearActual = listMedianaYears[i];
            const yearAnterior = listMedianaYears[i-1];
            const crecimiento = (yearActual - yearAnterior) / yearAnterior;
            porcentajesCrecimiento.push(crecimiento);
        };
        console.log(porcentajesCrecimiento);

        const medianaCrecimiento = MhMath.calcularMediana(porcentajesCrecimiento);
        console.log(medianaCrecimiento);

        const ultMediana = listMedianaYears[listMedianaYears.length - 1];
        const newMediana = (ultMediana * medianaCrecimiento) + ultMediana;
        return newMediana;

    };
};

function calcularMedianaGeneral(){
    const listMedianas = salarios.map( persona => medianaXPersona(persona.name) );
    const generalMediana = MhMath.calcularMediana(listMedianas);

    console.log({
        listMedianas,
        generalMediana,
    });

    return generalMediana;
};

function calcularTop10(){
    const listMedianas = salarios.map( persona => medianaXPersona(persona.name) );
    const listOrdenada = listMedianas.sort( (a,b) => a-b );
    const listLimit = listOrdenada.length / 10;

    const top10 = listOrdenada.slice( listOrdenada.length - listLimit, listOrdenada.length);
    const medianaTop10 = MhMath.calcularMediana(top10);

    console.log({
        listOrdenada,
        top10,
        medianaTop10,
    });

    return medianaTop10;
};

// Mostrando información seleccionada en HTML
/*
        <section class="analisis-container">
            <h2>Analisis Salarial</h2>
            <div class="info-container">
                <h3>Elegir persona para información salarial:</h3>
                <label for="selectPersonal">Seleccionar</label>
                <select id="selectPersonal">
                    <option value="">--Nombre del empleado--</option>
                </select>
                <button id="btnPersonal" type="text">Mostrar</button>
                <p id="pPersonal"></p>
                <div id="divContainerPersonal">
                    <p id="pResultPersonal"></p>
                </div>
                <div id="btnContainer"></div>
                <div id="divCalcResult"></div>
            </div>
        </section>
*/
function renderInfoPersonal() {
    const selectPersonal = document.querySelector("#selectPersonal");
    for ( persona of salarios ) {
        const selectOption = document.createElement('option');
        selectOption.setAttribute('value', persona.name);
        selectOption.innerText = persona.name;
        selectPersonal.appendChild(selectOption);
    };

    const btnPersonal = document.querySelector('#btnPersonal');
    btnPersonal.classList.add('btn-calc-persona');
    btnPersonal.addEventListener('click', () => {
        const divContainerPersonal = document.querySelector('#divContainerPersonal');
        divContainerPersonal.innerText = '';
        
        const pPersonal = document.querySelector('#pPersonal');
        pPersonal.classList.add('p-result-name');
        const objPersona = encontrarPersonas(selectPersonal.value);
        pPersonal.innerText = objPersona.name;
        
        for ( trabajo of objPersona.trabajos ) {            
            let pResultPersonal = document.createElement('p');
            pResultPersonal.innerText = `Año: ${trabajo.year} | Empresa: ${trabajo.empresa} | Salario: u$${trabajo.salario}`;
            divContainerPersonal.appendChild(pResultPersonal);            
        };

        const btnContainer = document.querySelector('#btnContainer');
        const btnMedianaPersona = document.createElement('button');
        const btnProyeccionPersona = document.createElement('button');
        btnMedianaPersona.classList.add('btn-calc-persona');
        btnProyeccionPersona.classList.add('btn-calc-persona');
        btnMedianaPersona.innerText = 'Mediana';
        btnProyeccionPersona.innerText = 'Proyección';
        btnContainer.innerText = '';
        btnContainer.appendChild(btnMedianaPersona);
        btnContainer.appendChild(btnProyeccionPersona);

        btnMedianaPersona.addEventListener('click', () => {
            const divCalcResult = document.querySelector('#divCalcResult');
            divCalcResult.innerText = '';
            const pCalcResult = document.createElement('p');
            pCalcResult.innerText = 
                `La mediana de salarios de ${objPersona.name} es de u$${medianaXPersona(objPersona.name)}`;
            pCalcResult.style.fontWeight='bold';
            divCalcResult.appendChild(pCalcResult);
        });

        btnProyeccionPersona.addEventListener('click', () => {
            //const divCalcResult = document.querySelector('#divCalcResult');
            divCalcResult.innerText = '';
            const pCalcResult = document.createElement('p');
            pCalcResult.innerText = 
                `La mediana de salarios de ${objPersona.name} es de u$${medianaXPersona(objPersona.name)}`;
            pCalcResult.style.fontWeight='bold';
            divCalcResult.appendChild(pCalcResult);
        });
    });
};
renderInfoPersonal();