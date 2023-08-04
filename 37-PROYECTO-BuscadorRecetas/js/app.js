function iniciarApp(){
    const selectCategorias= document.querySelector('#categorias')
    const resultado= document.querySelector('#resultado')
    
    const modal=new bootstrap.Modal('#modal',{})
    if(selectCategorias){
        selectCategorias.addEventListener('change',seleccionarCategoria)
        obtenerCategoria()
    }
    
    const favoritosDiv=document.querySelector('.favoritos')
    if(favoritosDiv){
        obtenerFavoritos()
    }
    
    
    function obtenerCategoria(){
        const url='https://www.themealdb.com/api/json/v1/1/categories.php'
        fetch(url)
        .then(respuesta=> {
            return respuesta.json()})
        .then(resultado=> {
            console.log(resultado)
            mostrarCategorias(resultado.categories)
        })
    }
    function mostrarCategorias(categorias=[]){
        console.log(categorias)
        categorias.forEach(categoria=>{
            const {strCategory} = categoria;
            const option= document.createElement('option')
            option.value=strCategory;
            option.textContent=strCategory;
            selectCategorias.appendChild(option)
        })
        

        

    }
    function seleccionarCategoria(e){
        const categoria=e.target.value;
        const url=`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
        
       
        fetch(url)
        .then(respuesta=> respuesta.json())
        .then(respuesta=>mostrarRecetas(respuesta.meals))
        
        
    
    }
    function mostrarRecetas(recetas=[]){
        
        limpiarHTML(resultado)

        const heading=document.createElement('H2')
        heading.classList.add('text-center','text-black','my-5')
        heading.textContent=recetas.length? 'Resultados': 'No hay resultados'
        resultado.appendChild(heading)
        //Iterar en los resultados
        recetas.forEach(receta=>{
            const recetaContenedor=document.createElement('div')
            const {idMeal, strMeal,strMealThumb}=receta
            recetaContenedor.classList.add('col-md-4')
           
           const recetaCard=document.createElement('div')
           recetaCard.classList.add('card','mb-4')

           const recetaImagen=document.createElement('img')
           recetaImagen.classList.add('card-img-top')
           recetaImagen.alt=`Imagen de la receta ${strMeal??receta.titulo}`
           recetaImagen.src= strMealThumb?? receta.img
            console.log(recetaContenedor)

            const recetaCardBody=document.createElement('DIV')
            recetaCardBody.classList.add('card-body')

            const recetaHeading= document.createElement('H3')
            recetaHeading.classList.add('card-title','mb-3')
            recetaHeading.textContent=strMeal??receta.titulo

            const recetaButton= document.createElement('button')
            recetaButton.classList.add('btn','btn-danger','w-100')
            recetaButton.textContent='Ver receta'
            //recetaButton.dataset.bsTarget="#modal"
            //recetaButton.dataset.bsToggle="modal"//Llama las funciones que estan en boostrap
            recetaButton.onclick=function(){seleccionarReceta(idMeal??receta.id)}
            //Inyectar el codigo al HTML

            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);
            
            recetaCard.appendChild(recetaImagen)
            recetaCard.appendChild(recetaCardBody)

            recetaContenedor.appendChild(recetaCard)
            resultado.appendChild(recetaContenedor)
        })
    }
    function seleccionarReceta(id){
        url=`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        fetch(url)
        .then(resultdos=>resultdos.json())
        .then(resultado=> mostrarRecetaModal(resultado.meals[0]))

    }
    function mostrarRecetaModal(receta){
        console.log(receta)
        const {idMeal, strInstructions,strMeal, strMealThumb} = receta;

        //Añadir contenido al modal
        const modalTitel= document.querySelector('.modal .modal-title')
        const modalBody= document.querySelector('.modal .modal-body')
        
        modalTitel.textContent=strMeal;
        modalBody.innerHTML=`
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}" />
            <h3 class="my-3">Instrucciones</h3>
            <p>${strInstructions}
            <h3 class="my.3">Ingredientes y Cantidades</h3>
            `

            const listGroup=document.createElement('ul')
            listGroup.classList.add('list-group');
        //Mostrar cantidades de ingredientes
        for(let i=1; i<=20; i++){
            if(receta[`strIngredient${i}`]){
                const ingrediente= (receta[`strIngredient${i}`])
                const cantidad= receta[`strMeasure${i}`]
                const ingredienteLi=document.createElement('LI')
                ingredienteLi.classList.add('list-group-item');
                ingredienteLi.textContent=`${ingrediente} - ${cantidad}`
            
                listGroup.appendChild(ingredienteLi)
            }
            
        }
        modalBody.appendChild(listGroup)

        //Botoner de cerrar y favorito
        const modalFooter= document.querySelector('.modal-footer')
        limpiarHTML(modalFooter)
        const btnFavorito= document.createElement('BUTTON');
        btnFavorito.classList.add('btn','btn-danger','col')
        console.log(existeStorage(idMeal))
        
            btnFavorito.textContent=existeStorage(idMeal)? 'Quitar Favorito':'Guardar Favoritos';
        
        
         
        //Local storage
        btnFavorito.onclick= function(){
            if(existeStorage(idMeal)){
                eliminarFavoritos(idMeal)
                btnFavorito.textContent='Guardar Favoritos'
                mostrarToast('Eliminado correctamente')
                if(favoritosDiv){
                    obtenerFavoritos()
                }
                return;
            }
            agregarFavoritos({
                id:idMeal,
                titulo:strMeal,
                img: strMealThumb})
                btnFavorito.textContent='Eliminar Favoritos'
                mostrarToast('Agregado Correctamente')
            
        }


        const btnCerrar= document.createElement('BUTTON')
        btnCerrar.classList.add('btn','btn-secondary','col')
        btnCerrar.textContent='Cerrar'
        btnCerrar.onclick= function(){modal.hide()}


        modalFooter.appendChild(btnFavorito)
        modalFooter.appendChild(btnCerrar)

        //Muestra el modal
        modal.show()
    }
    function agregarFavoritos(receta){
        
        const favoritos=JSON.parse(localStorage.getItem('favoritos'))?? [];
        localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]))
        
    }
    function eliminarFavoritos(id){
        
        const favoritos=JSON.parse(localStorage.getItem('favoritos'))?? [];
        const nuevosFavoritos= favoritos.filter(favorito=> favorito.id!==id)
        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos))
        
    }
    function existeStorage(id){
        
        const favoritos=JSON.parse(localStorage.getItem('favoritos'))?? [];
        return favoritos.some(favorito=> favorito.id===id); 
    }
    function mostrarToast(mensaje){
        const toastDiv=document.querySelector('#toast');
        const toastBody=document.querySelector('.toast-body')
        const toast =new bootstrap.Toast(toastDiv)
        toastBody.textContent=mensaje;
        toast.show()
    }

    function obtenerFavoritos(){
        const favoritos=JSON.parse(localStorage.getItem('favoritos'))??[];
        console.log(favoritos)
        if(favoritos.length){
            mostrarRecetas(favoritos)
            return
        }
        const noFavoritos=document.createElement('P')
        noFavoritos.textContent='No hay favoritos'
        noFavoritos.classList.add('fs-4','text-center','font-bold','mt-5')
        resultado.appendChild(noFavoritos)
    }
    function limpiarHTML(result){
        while(result.firstChild){
            result.removeChild(result.firstChild)
        }
    }
}

document.addEventListener('DOMContentLoaded',iniciarApp)