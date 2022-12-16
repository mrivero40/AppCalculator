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

// Restructurando la información de salarios.js
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

// Análisis salarial x empleado en HTML
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
        divCalcResult.innerText = '';        
        
        const pPersonal = document.querySelector('#pPersonal');
        pPersonal.classList.add('p-result-name');
        const objPersona = encontrarPersonas(selectPersonal.value);
        pPersonal.innerText = `${objPersona.name} - información:`;
        
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
            pCalcResult.style.fontWeight = 'bold';
            divCalcResult.appendChild(pCalcResult);
        });

        btnProyeccionPersona.addEventListener('click', () => {
            const divCalcResult = document.querySelector('#divCalcResult');
            divCalcResult.innerText = '';
            const arrayProyeccion = proyeccionSalarial(objPersona.name);

            for ( proyeccion of arrayProyeccion ) {
                const pCalcResult = document.createElement('p');
                pCalcResult.style.fontWeight='bold';
                pCalcResult.innerText = `Año: ${proyeccion.year} | Sueldo: ${proyeccion.sueldo.toFixed(0)}`;
                divCalcResult.appendChild(pCalcResult);
            };            
        });
    });
};
renderInfoPersonal();

// Análisis de sueldos x empresa en HTML
function renderInfoEmpresa() {
    const selectEmpresa = document.querySelector('#selectEmpresa');
    const btnEmpresa = document.querySelector('#btnEmpresa');
    const pEmpresa = document.querySelector('#pEmpresa');
    const divContainerEmpresa = document.querySelector('#divContainerEmpresa');
    const btnContainerEmpresa = document.querySelector('#btnContainerEmpresa');
    const divCalcResultEmpresa = document.querySelector('#divCalcResultEmpresa');

    for ( empresa of Object.keys(empresas)) {
        const optionSelect = document.createElement('option');
        optionSelect.innerText = empresa;
        selectEmpresa.appendChild(optionSelect);
    };

    btnEmpresa.addEventListener('click', () => {
        divContainerEmpresa.innerText = '';
        btnContainerEmpresa.innerText = '';

        const selectEmpresaValue = selectEmpresa.value;
        pEmpresa.innerText = selectEmpresaValue;
        pEmpresa.classList.add('p-result-name');
        const arrayEmpresas = Object.entries(empresas[selectEmpresaValue]);
        const arraySueldos = [];
        
        for ( item of arrayEmpresas ) {
            arraySueldos.push(item[1].reduce((valorAcumulado, nuevoValor) => (valorAcumulado + nuevoValor) / item[1].length));
            const pResultEmpresa = document.createElement('p');
            pResultEmpresa.innerText = `Año: ${item[0]} | Sueldos: ${item[1].length} | Importes: u$s ${item[1]}`;
            divContainerEmpresa.appendChild(pResultEmpresa);
        }
        console.log(arrayEmpresas);
        console.log(arraySueldos);

        const btnMedianaEmpresa = document.createElement('button');
        const btnProyeccionEmpresa = document.createElement('button');
        btnMedianaEmpresa.innerText = 'Promedio de sueldos';
        btnProyeccionEmpresa.innerText = 'Proyección';
        btnMedianaEmpresa.classList.add('btn-calc-persona');
        btnProyeccionEmpresa.classList.add('btn-calc-persona');
        btnContainerEmpresa.appendChild(btnMedianaEmpresa);
        btnContainerEmpresa.appendChild(btnProyeccionEmpresa);

        btnMedianaEmpresa.addEventListener('click', () => {   
            divCalcResultEmpresa.innerText = '';         
            const promedioEmpresa = MhMath.calcularPromedioSinRender(arraySueldos);
            const pResultPromedio = document.createElement('p');
            pResultPromedio.style.fontWeight = 'bold';
            pResultPromedio.innerText = `El promedio de sueldos es: u$s ${promedioEmpresa.toFixed(2)}`;
            divCalcResultEmpresa.appendChild(pResultPromedio);
        });

        btnProyeccionEmpresa.addEventListener('click', () => {
            divCalcResultEmpresa.innerText = '';
            const pResultProyeccion = document.createElement('p');
            pResultProyeccion.style.fontWeight = 'bold';
            pResultProyeccion.innerText = `Proyección de sueldos para el próximo año es u$s:${calcularProyeccionEmpresas(selectEmpresaValue).toFixed(2)}`;
            divCalcResultEmpresa.appendChild(pResultProyeccion);
        });
    });

};
renderInfoEmpresa();