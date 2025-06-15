function cargarPagina(abrir){
    const url = abrir;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("body").innerHTML= xhr.responseText;
            document.getElementById("TablaAdmin").addEventListener("click", function() {
                listaAdmin();
            });
        }
    };
    xhr.send();
}

function cargarContenido(abrir) {
    const url = abrir;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("contenido_2").innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}

function verificarsesion() {
    const form = document.getElementById('formlogin');
    const formData = new FormData(form);

    fetch('autenticar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log(response);
        return response.json();
    })
    .then(datos => {
        if (datos.status === 'success') {
             // Guardamos datos en localStorage
            localStorage.setItem('userId', datos.id);
            localStorage.setItem('userRol', datos.rol);
            
            alert(datos.message);
            const rol = datos.rol;

            if (rol === 'admin') {
                window.location.href = 'frontend/admin/index.html';
            } else {
                const estado = datos.estado;
                if(estado === 'suspendido'){
                    alert('Usuario inactivo, por favor contacta al administrador');
                    return;
                }
                window.location.href = 'frontend/usuario/index.html';
            }
        } else {
            alert(datos.message);
        }
    })
    .catch(error => console.error('Error:', error));
}










































//pagina del administrador
























function listaAdmin(){
    fetch('backend/api/readadmin.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById("contenido_A1").innerHTML = renderizarTablaAdmin(data);
        })
        .catch(error => {
            console.error('Error fetching the data:', error);
        });
}

function renderizarTablaAdmin(data) {
    let html = `<table> 
    <thead>
        <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado Actual</th>
            <th>Operaciones</th>
        </tr>
    </thead>
    <tbody>`;

    for(let i = 0; i < data.length; i++){ 
        html += `<tr>
            <td>${data[i].email}</td>
            <td>${data[i].rol}</td>
            <td>${data[i].estado}</td>
            <td>
                <a href="#" onclick="updateAdmin(${data[i].id})">Editar</a>
                <a href="#" onclick="cargarContenidoA('deleteadmin.php?id=${data[i].id}')">Eliminar</a>
            </td>
        </tr>`;
    }

    html += `</tbody>
    </table>`;
    return html;
}

function updateAdmin(id) {
   
    const formData = new FormData();
    formData.append('id', id); 

    console.log("Id del admin a editar:", id);

    fetch(`backend/api/formeditA.php?id=${id}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text()) 
    .then(html => {
    
        abrirModal(html);  
    })
    .catch(error => console.error('Error:', error));
}

function abrirModal(contenidoHtml) {
    const modal = document.getElementById('modal');
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.innerHTML = contenidoHtml;
    modal.style.display = 'flex';
}


