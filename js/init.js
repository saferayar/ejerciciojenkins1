//Aqui voy a marcar la aplicacion en su estado iniciada sesion (ocultar lo que tenga que ocultar y mostrar lo
//que tenga que mostrar)
const marcarSesionIniciada = ()=>{
    //1. Ocultar el boton de login
    document.querySelector("#iniciar-btn").classList.add('d-none');
    //2. Mostrar los datos del usuario en el body
    //3. Mostrar el botón de cierre de sesión
    document.querySelector('#cerrar-btn').classList.remove('d-none');
    let usuario = getUsuario();
    document.querySelector("#nombre-usuario").innerText = usuario.name;
    document.querySelector("#correo-usuario").innerText = usuario.mail;
    document.querySelector("#imagen-usuario").src = usuario.image;
    document.querySelector('#datos-usuario').classList.remove("d-none");
    //4. Mostrar el formulario y la funcionalidad de la agenda
    document.querySelector("#datos-agenda").classList.remove('d-none');
    cargarTabla();
};

//Aqui voy a marcar la aplicacion en su estado cerrada sesión (ocultar lo que tenga que ocultar y mostrar lo que tenga que mostrar)
const marcarSesionCerrada = ()=>{
    //1. Mostrar el boton de login
    document.querySelector("#iniciar-btn").classList.remove('d-none');
    //2. Ocultar los datos del usuario en el body
    //3. Ocultar el botón de cierre de sesión
    document.querySelector("#cerrar-btn").classList.add("d-none");
    //4. Ocultar el formulario y la funcionalidad de la agende
    document.querySelector("#datos-usuario").classList.add("d-none");
    document.querySelector("#datos-agenda").classList.add('d-none');
};

const getUsuario = ()=>{
    let usuario = localStorage.getItem("usuario");
    if(usuario){
        //Convertir desde JSON a JS
        usuario = JSON.parse(usuario);
    }else {
        usuario = null;
    }
    return usuario;
};

const getAgenda = ()=>{
    let agenda = localStorage.getItem("agenda");
    if(agenda){
        agenda = JSON.parse(agenda);
    } else{
        agenda = [];
    }
    return agenda;
}

const agregarAgenda = (contacto)=>{
    let agenda = getAgenda();
    agenda.push(contacto);
    localStorage.setItem("agenda", JSON.stringify(agenda));
}


function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    let usuario = {};
    usuario.id = profile.getId();
    usuario.name = profile.getName();
    usuario.image = profile.getImageUrl();
    usuario.mail = profile.getEmail();
    //crea un key en el localstorage con los datos del usuario
    //EN LOCAL STORAGE SE GUARDAN STRINGS
    localStorage.setItem("usuario",JSON.stringify(usuario));
    marcarSesionIniciada();
}
  
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      //Borrar todo lo almacenado en el local storage
      localStorage.clear();
      marcarSesionCerrada();
    });
  }

  window.addEventListener('DOMContentLoaded', ()=>{
     if(true){
        marcarSesionIniciada();
     } else{
         marcarSesionCerrada();
     }
  });

document.querySelector("#cerrar-btn").addEventListener("click",signOut);

const cargarTabla = ()=>{
   //Buscar la agenda
   const agenda = getAgenda();
   const agendaDiv = document.querySelector('.agenda-div');
   agendaDiv.innerHTML = '';
    //Si la agenda esta vacia, mostrar el molde de que no existen datos
    if(agenda.length === 0){
        agendaDiv.appendChild(document.querySelector('.mensaje-vacio').cloneNode(true));
    } else {
        //Si la agenda tiene datos, generar la tabla
        const moldeTabla = document.querySelector('.personas-table').cloneNode(true);
        const tbody = moldeTabla.querySelector('tbody');
        agenda.forEach(a=>{
            let tr = document.createElement("tr");
            let tdNombre = document.createElement("td");
            let tdCorreo = tdNombre.cloneNode(true);
            tdNombre.innerText = a.nombre;
            tdCorreo.innerText = a.correo;
            tr.appendChild(tdNombre);
            tr.appendChild(tdCorreo);
            tbody.appendChild(tr);

        });
        agendaDiv.appendChild(moldeTabla);
    }
};


document.querySelector("#registrar-btn").addEventListener('click', function(){
    let nombre = document.querySelector("#nombre-txt").value.trim();
    let correo = document.querySelector("#correo-txt").value.trim();
    agregarAgenda({nombre:nombre,correo:correo});
    toastr.success("Contacto registrado!");
    cargarTabla();
});