//Variables
const carrito= document.querySelector('#carrito')
const listaCursos=document.querySelector('#lista-cursos')
const contenedorCarriito= document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn= document.querySelector('#vaciar-carrito')
let articulosCarrito=[];

CargarEventListenners();

function CargarEventListenners(){
    //Cuando agregas un curso presionando "Agregar al carrito"
    document.addEventListener('DOMContentLoaded',()=>{
        articulosCarrito=JSON.parse(localStorage.getItem('articulosCarrito')) || []
        carritoHTML()
    })
    listaCursos.addEventListener('click', agregarCurso);
    carrito.addEventListener('click', eliminarCurso)
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito=[];
        limpiarHtml();
    })
}


function agregarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains("agregar-carrito")){
       // console.log(e.target.parentElement.children[0].textContent)
        console.log("agregando")
        const curso= e.target.parentElement.parentElement;
        leerDatosCurso(curso)
    }

}

//Lee el contenido del HTML AL QUE LE DIMOS CLICK Y EXTRAE LA informacion
function leerDatosCurso(curso){
   
   //Crear un objeto con el contenido del curso
    const infocurso={
        //Como realmente se hace
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad:1
    }
    //Revisar si un elemento ya existe en el carrito
    const existe=articulosCarrito.some(curso => curso.id===infocurso.id)
    if(existe)
    {
        articulosCarrito.forEach(carrito =>{    
            if(carrito.id===infocurso.id)
            {
                carrito.cantidad++;
            }})
    } 
    else{
        articulosCarrito=[...articulosCarrito, infocurso]}
    console.log(articulosCarrito)
    carritoHTML()
}

function carritoHTML() {
    //Limpiar el HTML
    limpiarHtml()

    articulosCarrito.forEach( curso =>{
        const row =document.createElement('tr');
        row.innerHTML= `
        <td>
            <img src="${curso.imagen}" width="100">
        </td>
        <td>
                ${curso.titulo}
        </td>
        <td> ${curso.precio}</td>
        <td> ${curso.cantidad}</td>
        <td> <a href="#" class="borrar-curso" data-id="${curso.id}" >X </a> </td>
        `;
        //agregar el HTML al carrito
        contenedorCarriito.appendChild(row)
    })
    localStorage.setItem('articulosCarrito',JSON.stringify(articulosCarrito))
}
function limpiarHtml(){
    //Forma lenta
    //contenedorCarriito.innerHTML=''
    //Forma rapida
    while(contenedorCarriito.firstChild){
        contenedorCarriito.removeChild(contenedorCarriito.firstChild)
    }
}
function eliminarCurso(e)
{
    if(e.target.classList.contains("borrar-curso"))
    {
        const idcurso = e.target.getAttribute("data-id");
        articulosCarrito= articulosCarrito.filter(curso => curso.id!==idcurso)
        carritoHTML();
    }
}
