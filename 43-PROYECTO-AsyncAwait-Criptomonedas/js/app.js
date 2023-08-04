const cryptomonedasSelect= document.querySelector('#criptomonedas')
const formulario= document.querySelector('#formulario')
const resultado= document.querySelector('#resultado')
const monedaSelect=document.querySelector('#moneda')
const objBusqueda={
    moneda:"",
    criptomoneda:""
}


//Crear un promise
const obtenerCriptomenedas = criptomonedas=> new Promise(resolve=>{
    resolve(criptomonedas)
})

document.addEventListener('DOMContentLoaded',() =>{
    consultarCritoMonedas()
    formulario.addEventListener('submit', submitformulario)

    cryptomonedasSelect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change',leerValor)
})

async function consultarCritoMonedas(){
    const url="https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD"
    
    try{
        const respuesta= await fetch(url)
        const monedas= await respuesta.json()
        const criptomonedas= await obtenerCriptomenedas(monedas.Data)
        selectCriptomonedas(criptomonedas)
    }
    catch(error){
        console.log(error)
    }
    
       
}
function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto =>{
        const {CoinInfo:{Name, FullName}}=cripto
        console.log(Name)
        const option= document.createElement('option')
        option.value=Name
        option.textContent=FullName
        cryptomonedasSelect.appendChild(option)
    })
}
function leerValor(e){
    objBusqueda[e.target.name]= e.target.value
    //console.log(objBusqueda)
}
function submitformulario(e){
    e.preventDefault()
    const {moneda, criptomoneda}=objBusqueda
    if(moneda==="" || criptomoneda===""){
        mostrarAlerta("Todos los campos son obligatorios")
        return
    } 
    consultarApi()
    console.log("monedas seleccionadas")
    console.log()
    console.log(cryptomonedasSelect.value)
}
function mostrarAlerta(msg){
    if(!document.querySelector(".error"))
    {
        const divMensaje=document.createElement('div')
        divMensaje.classList.add('error')
        divMensaje.textContent=msg
        formulario.appendChild(divMensaje)
        setTimeout(()=>{
            divMensaje.remove()
        },3000)
    }
}
async function consultarApi(){
    const {moneda, criptomoneda}=objBusqueda
    url=`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    mostrarSpinner()
    try{
    const respuesta=await fetch(url)
    const cotizacion= await respuesta.json() 
    mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
    }
    catch(error){
        console.log(error)
    }
}
function mostrarCotizacionHTML(cotizacion){
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE}=cotizacion
    limpiarHTML()
    const precio= document.createElement('p')
    precio.classList.add('precio')
    precio.innerHTML=`El precio es: <span>${PRICE}</span>`
    
    const precioAlto=document.createElement('p')
    precioAlto.innerHTML= `<p> Precio más alto del día <span>${HIGHDAY}</span>`

    const precioBajo=document.createElement('p')
    precioBajo.innerHTML= `<p> Precio más bajo del día <span>${LOWDAY}</span>`

    const ultimasHoras=document.createElement('p')
    ultimasHoras.innerHTML= `<p> Variación en las últimas 24 horas <span>${CHANGEPCT24HOUR} %</span>`
    
    const ultimaActualiazción=document.createElement('p')
    ultimaActualiazción.innerHTML= `<p> Actualización <span>${LASTUPDATE}</span>`
    
    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimaActualiazción)
} 
function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}  
function mostrarSpinner(){
    limpiarHTML()
    
    console.log("Me usan")
    const spinner=document.createElement('div')
    spinner.classList.add('spinner')
    spinner.innerHTML=`
    
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `
   resultado.appendChild(spinner)
    
    
}