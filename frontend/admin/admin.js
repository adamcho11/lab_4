document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
});

async function cargarUsuarios() {
    try {
        const response = await fetch('../../backend/api/usuarios.php?accion=listar');
        console.log('Response:', response);  // <-- Aquí cambio importante

        const usuarios = await response.json();  // <-- Aquí cambio importante
        
        const user = usuarios.user;  // <-- Aquí cambio importante

        const tbody = document.getElementById('tabla-usuarios-body');
        tbody.innerHTML = '';

        user.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.email}</td>
                <td>${usuario.rol}</td>
                <td>${usuario.estado}</td>
                <td>
                    <button class="boton boton-accion" onclick="editarUsuario(${usuario.id})">Editar</button>
                    ${usuario.estado === 'activo' ? 
                        `<button class="boton boton-peligro" onclick="suspenderUsuario(${usuario.id})">Suspender</button>` :
                        `<button class="boton boton-accion" onclick="habilitarUsuario(${usuario.id})">Habilitar</button>`
                    }
                    <button class="boton boton-peligro" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}


function mostrarModalCrearUsuario() {
    document.getElementById('modal-titulo').textContent = 'Crear Usuario';
    document.getElementById('form-usuario').reset();
    document.getElementById('usuario-id').value = '';
    document.getElementById('modal-usuario').style.display = 'block';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

async function guardarUsuario(event) {
    event.preventDefault();
    const id = document.getElementById('usuario-id').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    const data = { email, password, rol };
    const accion = id ? 'actualizar' : 'crear';
    if (id) data.id = id;

    try {
        const response = await fetch(`../../backend/api/usuarios.php?accion=${accion}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            cerrarModal('modal-usuario');
            cargarUsuarios();
        } else {
            alert('Error al guardar usuario: ' + result.mensaje);
        }
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        alert('Error al guardar usuario');
    }
}

async function suspenderUsuario(id) {
    if (confirm('¿Está seguro de suspender este usuario?')) {
        try {
            const response = await fetch(`../../backend/api/usuarios.php?accion=suspender&id=${id}`);
            const result = await response.json();
            if (result.success) {
                cargarUsuarios();
            }
        } catch (error) {
            console.error('Error al suspender usuario:', error);
        }
    }
}

async function habilitarUsuario(id) {
    try {
        const response = await fetch(`../../backend/api/usuarios.php?accion=habilitar&id=${id}`);
        const result = await response.json();
        if (result.success) {
            cargarUsuarios();
        }
    } catch (error) {
        console.error('Error al habilitar usuario:', error);
    }
}

async function eliminarUsuario(id) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        try {
            const response = await fetch(`../../backend/api/usuarios.php?accion=eliminar&id=${id}`);
            const result = await response.json();
            if (result.success) {
                cargarUsuarios();
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    }
}

async function enviarAvisoMasivo(event) {
    event.preventDefault();
    const asunto = document.getElementById('asunto-aviso').value;
    const mensaje = document.getElementById('mensaje-aviso').value;

    try {
        const response = await fetch('../../backend/api/correos.php?accion=enviar_masivo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ asunto, mensaje })
        });

        const result = await response.json();
        if (result.success) {
            alert('Aviso enviado correctamente');
            cerrarModal('modal-aviso');
            document.getElementById('form-aviso').reset();
        } else {
            alert('Error al enviar aviso: ' + result.mensaje);
        }
    } catch (error) {
        console.error('Error al enviar aviso:', error);
        alert('Error al enviar aviso');
    }
}

function mostrarModalAviso() {
    document.getElementById('modal-aviso').style.display = 'block';
}