
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const dashboard = document.querySelector('.dashboard')
const paginacion = document.querySelector('#paginacion')
const numeroPagina = document.querySelector('.numeroPagina')

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

document.addEventListener('DOMContentLoaded', () => {
    buscarImagenes("Rock and roll")
})


window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();
    
    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === "") {
        mostrarAlerta('Type something for search')
        return
    }

    buscarImagenes();
}

function mostrarAlerta (mensaje) {

    const exiteAlerta = document.querySelector('.bg-red-100')

    if (!exiteAlerta) {
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'max-auto', 'mt-6','text-center')

        alerta.innerHTML = `
            ${mensaje}
        `

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove()
        }, 3000)
    }
    
}




//async
async function buscarImagenes() {
    const termino = document.querySelector('#termino').value;

    const key = '33052814-901a4545a8f2266420a0f5be9';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    
    try {
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        totalPaginas = calcularPaginas(resultado.totalHits)
        mostrarImagenes(resultado.hits)
    } catch {
        console.log(error)
    }
}


//function fech
// function buscarImagenes() {
//     const termino = document.querySelector('#termino').value;

//     const key = '33052814-901a4545a8f2266420a0f5be9';
//     const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    
//     fetch(url)
//         .then(respuesta => respuesta.json())
//         .then(resultado => {
//             // console.log(resultado)
//             totalPaginas = calcularPaginas(resultado.totalHits)
//             // console.log(totalPaginas)
//             mostrarImagenes(resultado.hits)
//         })
        
// }


//generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
        //lo cargamos
    }
}

function calcularPaginas(total) {
    return parseInt( Math.ceil(total / registrosPorPagina))
}

function mostrarImagenes (imagenes) {
    // console.log(imagenes)
    //vamos eliminando resultador previos
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    //iterar sobre el arregllo de imagenes y construir el html
    imagenes.forEach(imagen => {
        const { previewURL, views, largeImageURL , tags, imageSize } = imagen

        const size = (imageSize / 1000).toFixed(2)
        
        //usamos el grid de tailwind
        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-transparent border-slate-50 w-60 lg:80">
                <img src="${previewURL}" alt="${tags}" class="w-full">
                <div class="p-4 shadow-md border-slate-50">
                    <p class="font-bold">${size}<span class="font-light">KB</span></p>
                    <p class="font-bold">${views} <span class="font-light">Views</span></p>
                    <a class="block w-full minecraft-btn text-white uppercase font-bold text-center mx-auto mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">view</a>
                </div>
            </div>
        </div>
        `
    })

    //limpiar paginador viejo
    while (paginacion.firstElementChild) {
        paginacion.removeChild(paginacion.firstChild)
    } 

    imprimirPaginador();
}



function imprimirPaginador () {
    //creando el paginador
    iterador = crearPaginador(totalPaginas)
    // console.log(iterador.next().done)
    while (true) {
        const {value,done} = iterador.next();
        if(done) return;

        //caso contrario, genera un boton por cada elemento en el generador
        const boton = document.createElement('A')
        const numeroPag = document.createElement('h1')
        boton.href = '#'
        boton.dataset.pagina = value //?????????????
        boton.textContent = value
        boton.classList.add('minecraft-btn', 'px-4', 'py-1', 'mr-2', 'mb-5')
        numeroPag.textContent = `Page # ${value}`
        numeroPag.classList.add('text-center', 'mb-10')

        boton.onclick = () => {
            // volver a consultar la api
            paginaActual = value
            numeroPagina.appendChild(numeroPag)
            buscarImagenes()
        }
        //la paginacion deberia de tener paginacion

        paginacion.appendChild(boton)
        
    }
    
}
