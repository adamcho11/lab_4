

function suspendido(){
    
}

// Obtener userId de localStorage, si no existe redirige
const userId = localStorage.getItem('userId');
console.log(userId);
if (!userId) {
    alert('No estás autenticado, redirigiendo...');
    window.location.href = '../../index.html';
}

function cargarBandejaEntrada() {
    // Opcional: Aquí puedes cambiar clases si quieres mostrar activo/inactivo visualmente.
    fetch('../../backend/api/correos.php?accion=listar_entrada&userId=' + userId)
        .then((res) => res.json())
        .then((data) => {
            mostrarBandeja(data, 'entrada')
        });
}

function cargarBandejaSalida() {
    fetch('../../backend/api/correos.php?accion=listar_salida&userId=' + userId)
        .then(res => res.json())
        .then(data => {
            if(data.message === 'success'){
                mostrarBandeja(data.correos, 'salida');
            } else {
                alert('Error al cargar correos de salida');
            }
        })
        .catch(console.error);
}


function cargarBorradores() {
    fetch('../../backend/api/correos.php?accion=listar_borradores&userId=' + userId)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            mostrarBorradores(data)})
        .catch(console.error);
}

function mostrarBorradores(datos){
    const tablaBandeja = document.getElementById("tabla-bandeja");
    const tbody = tablaBandeja.querySelector('tbody');
    tbody.innerHTML = '';

    correos.forEach(correo => {
        const fila = document.createElement('tr');
        fila.setAttribute('data-correo-id', correo.id);

        // Primera columna: Remitente si es entrada, Destinatario si es salida o borradores
        const primerCampo = (tipo === 'entrada') ? correo.remitente_email : correo.destinatario_email;

        fila.innerHTML = `
            <td>${primerCampo}</td>
            <td>${correo.asunto}</td>
            <td>${correo.estado}</td>
            <td>
                <button class="boton" onclick="verCorreo(${correo.id}, '${tipo}')">Ver</button>
                ${tipo === 'entrada' ? `<button class="boton boton-peligro" onclick="eliminarCorreo(${correo.id}, 'entrada')">Eliminar</button>` : ''}
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function mostrarBandeja(correos, tipo) {
    const tablaBandeja = document.getElementById("tabla-bandeja");
    const tbody = tablaBandeja.querySelector('tbody');
    tbody.innerHTML = '';

    correos.forEach(correo => {
        const fila = document.createElement('tr');
        fila.setAttribute('data-correo-id', correo.id);

        // Primera columna: Remitente si es entrada, Destinatario si es salida o borradores
        const primerCampo = (tipo === 'entrada') ? correo.remitente_email : correo.destinatario_email;

        fila.innerHTML = `
            <td>${primerCampo}</td>
            <td>${correo.asunto}</td>
            <td>${correo.estado}</td>
            <td>
                <button class="boton" onclick="verCorreo(${correo.id}, '${tipo}')">Ver</button>
                ${tipo === 'entrada' ? `<button class="boton boton-peligro" onclick="eliminarCorreo(${correo.id}, 'entrada')">Eliminar</button>` : ''}
            </td>
        `;
        tbody.appendChild(fila);
    });
}



// Mostrar modal ver correo
function verCorreo(id, tipo) {
    fetch(`../../backend/api/correos.php?accion=ver&id=${id}`)
        .then(res => res.json())
        .then(correo => {
            document.getElementById("modal-titulo").textContent = correo.asunto;
            document.getElementById("modal-contenido").innerHTML = `
                <div class="email-info">
                    <p><strong>De:</strong> ${correo.remitente_email || 'Desconocido'}</p>
                    <p><strong>Para:</strong> ${correo.destinatario_email || 'Desconocido'}</p>
                    <p><strong>Fecha:</strong> ${correo.fecha}</p>
                </div>
                <hr>
                <div class="email-content">${correo.mensaje}</div>
            `;
            document.getElementById("modal-ver-correo").style.display = "block";

            if (tipo === 'entrada' && correo.estado !== 'leido') {
                marcarComoLeido(id);
            }
        })
        .catch(console.error);
}

// Cerrar modales
function cerrarModal(idModal) {
    document.getElementById(idModal).style.display = 'none';
}

// Eliminar correo
function eliminarCorreo(id, tipo) {
    if (!confirm("¿Seguro que deseas eliminar este correo?")) return;

    fetch(`../../backend/api/correos.php?accion=eliminar&id=${id}&tipo=${tipo}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (tipo === 'entrada') cargarBandejaEntrada();
                else if (tipo === 'salida') cargarBandejaSalida();
                else cargarBorradores();
            }
        })
        .catch(console.error);
}

// Editar borrador (abre modal)
function editarBorrador(id) {
    mostrarRedactarModal(id);
}

// Guardar borrador
function guardarBorrador() {
    const data = {
        destinatario_email: document.getElementById('destinatario').value,
        asunto: document.getElementById('asunto').value,
        mensaje: document.getElementById('mensaje').value
    };

    fetch('../../backend/api/correos.php?accion=guardar_borrador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert('Borrador guardado correctamente');
                cerrarModal('modal-redactar');
                if (document.getElementById('btn-borradores').classList.contains('boton-activo')) {
                    cargarBorradores();
                }
            } else {
                alert('Error guardando borrador: ' + result.mensaje);
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error guardando borrador');
        });
}

// Enviar borrador
function enviarBorrador(id) {
    if (!confirm('¿Deseas enviar este borrador?')) return;

    fetch('../../backend/api/correos.php?accion=enviar_borrador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert('Borrador enviado correctamente');
                cargarBorradores();
            } else {
                alert('Error enviando borrador: ' + result.mensaje);
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error enviando borrador');
        });
}

// Marcar correo como leído
function marcarComoLeido(id) {
    fetch(`../../backend/api/correos.php?accion=marcar_leido&id=${id}`)
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                const fila = document.querySelector(`tr[data-correo-id="${id}"]`);
                if (fila) fila.classList.add('correo-leido');
            }
        })
        .catch(console.error);
}

// Mostrar modal redactar correo
function mostrarRedactarModal() {
    document.getElementById('form-correo').reset();
    document.getElementById('modal-redactar').style.display = 'block';

    // Cargar los usuarios para seleccionar el destinatario
    cargarUsuarios();

    fetch(`../../backend/api/correos.php?accion=ver`)
            .then(res => res.json())
            .then(correo => {
                document.getElementById('destinatario').value = correo.destinatario_id;  // Cambiar a ID del destinatario
                document.getElementById('asunto').value = correo.asunto;
                document.getElementById('mensaje').value = correo.mensaje;
            })
            .catch(console.error);
}

// Cargar usuarios para el select
function cargarUsuarios() {
    fetch('../../backend/api/usuarios.php?accion=listar') // O la ruta donde obtienes los usuarios
        .then(res => res.json())
        .then(data => {
            const selectDestinatario = document.getElementById('destinatario');
            selectDestinatario.innerHTML = ''; // Limpiar select
            data.user.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.id;  // ID del usuario
                option.textContent = usuario.email; // O nombre del usuario
                selectDestinatario.appendChild(option);
            });
        })
        .catch(console.error);
}

// Enviar correo nuevo o editado
function enviarCorreo() {
    const data = {
      // Obtener el ID del remitente desde localStorage
        remitente_id: userId,
        destinatario_id: document.getElementById('destinatario').value, // Obtener el ID del destinatario
        asunto: document.getElementById('asunto').value,
        mensaje: document.getElementById('mensaje').value
    };

    fetch('../../backend/api/correos.php?accion=enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert('Correo enviado correctamente');
                cerrarModal('modal-redactar');
                if (document.getElementById('btn-salida').classList.contains('boton-activo')) {
                    cargarBandejaSalida();
                }
            } else {
                alert('Error enviando correo');
            }
        })
        .catch(console.error);
}
