let usuarioAEliminar = null;
async function cargarUsuarios() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:3000/api/users", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const resultado = await response.json();
        console.log("USUARIOS API:", resultado);
        const usuarios = Array.isArray(resultado.data)
            ? resultado.data
            : resultado.data?.users || [];
        const tabla = document.getElementById("tablaUsuarios");

        tabla.innerHTML = "";

        usuarios.forEach(user => {
            tabla.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td>
                    <span class="badge ${user.role}">
                        ${user.role}
                    </span>
                </td>
                <td>
                    ${formatearFecha(user.createdAt || user.created_at)}
                </td>
                <td>
                    <button class="btn-edit" onclick="cargarFormularioEditar('${user.id}')">
                        ✏️
                    </button>

                    <button class="btn-delete" onclick="eliminarUsuario('${user.id}')">
                        🗑️
                    </button>
                </td>
            </tr>
            `;
        });

    } catch (err) {
        console.log(err);
    }
}

function formatearFecha(fecha) {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function mostrarFormularioNuevo() {
    document.getElementById("formularioCard").style.display = "block";
    document.getElementById("tituloFormulario").textContent = "Nuevo Usuario";
    document.getElementById("usuarioId").value = "";
    document.querySelector("form").reset();

    document.getElementById("password").required = true;
    document.getElementById("confirmar").required = true;

    limpiarMensajes();
}

function cancelarFormulario() {
    document.getElementById("formularioCard").style.display = "none";
    document.querySelector("form").reset();
    limpiarMensajes();
}

function limpiarMensajes() {
    document.getElementById("error").textContent = "";
    document.getElementById("mensaje").textContent = "";
}

async function cargarFormularioEditar(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const resultado = await response.json();
        const user = resultado.data;

        document.getElementById("formularioCard").style.display = "block";
        document.getElementById("tituloFormulario").textContent = "Editar Usuario";

        document.getElementById("usuarioId").value = user.id;
        document.getElementById("nombre").value = user.full_name;
        document.getElementById("correo").value = user.email;
        document.getElementById("rol").value = user.role;

        document.getElementById("password").value = "";
        document.getElementById("confirmar").value = "";
        document.getElementById("password").required = false;
        document.getElementById("confirmar").required = false;

        limpiarMensajes();

    } catch (err) {
        console.log(err);
    }
}

async function guardarUsuario(e) {
    e.preventDefault();

    const id = document.getElementById("usuarioId").value;
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const rol = document.getElementById("rol").value;
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar").value;

    const error = document.getElementById("error");
    const mensaje = document.getElementById("mensaje");

    limpiarMensajes();

    if (!nombre || !correo || !rol) {
        error.textContent = "Todos los campos obligatorios deben completarse";
        return;
    }

    if (!id || password || confirmar) {
        if (password !== confirmar) {
            error.textContent = "Las contraseñas no coinciden";
            return;
        }

        if (password.length < 8) {
            error.textContent = "La contraseña debe tener mínimo 8 caracteres";
            return;
        }
    }

    const token = localStorage.getItem("token");

    const datos = {
        full_name: nombre,
        email: correo,
        role: rol
    };

    if (password) {
        datos.password = password;
    }

    const url = id
        ? `http://localhost:3000/api/users/${id}`
        : "http://localhost:3000/api/users";

    const metodo = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(datos)
        });

        const data = await response.json();

        if (!response.ok) {
            error.textContent = data.message || "No se pudo guardar el usuario";
            return;
        }

        mensaje.textContent = id
            ? "Usuario actualizado correctamente"
            : "Usuario creado correctamente";

        cargarUsuarios();

        setTimeout(() => {
            cancelarFormulario();
        }, 800);

    } catch (err) {
        console.log(err);
        error.textContent = "Error de conexión";
    }
}

function eliminarUsuario(id) {
    const usuarioActual = JSON.parse(localStorage.getItem("usuario"));

    const errorGeneral = document.getElementById("errorGeneral");
    const mensajeGeneral = document.getElementById("mensajeGeneral");

    errorGeneral.textContent = "";
    mensajeGeneral.textContent = "";

    if (usuarioActual.id == id) {
        errorGeneral.textContent = "No puedes eliminar tu propio usuario.";
        return;
    }

    usuarioAEliminar = id;

    document.getElementById("confirmarEliminar").style.display = "block";
}

function cancelarEliminarUsuario() {
    usuarioAEliminar = null;
    document.getElementById("confirmarEliminar").style.display = "none";
}

async function confirmarEliminarUsuario() {
    const token = localStorage.getItem("token");

    const errorGeneral = document.getElementById("errorGeneral");
    const mensajeGeneral = document.getElementById("mensajeGeneral");

    errorGeneral.textContent = "";
    mensajeGeneral.textContent = "";

    try {
        const response = await fetch(`http://localhost:3000/api/users/${usuarioAEliminar}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            errorGeneral.textContent = data.message || "No se pudo eliminar el usuario.";
            return;
        }

        mensajeGeneral.textContent = "Usuario eliminado correctamente.";
        cancelarEliminarUsuario();
        cargarUsuarios();

    } catch (err) {
        console.log(err);
        errorGeneral.textContent = "Error de conexión con servidor.";
    }
}

cargarUsuarios();