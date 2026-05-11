function volverInicio() {

    const usuario =
        JSON.parse(
            localStorage.getItem("usuario")
        );

    if (usuario.role === "admin") {

        window.location.href =
            "dashboard-admin.html";
    }

    else if (usuario.role === "coach") {

        window.location.href =
            "dashboard-coach.html";
    }

    else {

        window.location.href =
            "dashboard-usuario.html";
    }
}

async function cargarPerfil() {

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/me",
            {

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const resultado =
            await response.json();

        const user = resultado.data;

        document.getElementById("nombreTexto")
            .textContent = user.full_name;

        document.getElementById("emailTexto")
            .textContent =
            user.email.toLowerCase();

        document.getElementById("rolTexto")
            .innerHTML = `

            <span class="badge ${user.role}">
                ${user.role}
            </span>

            `;

        document.getElementById("fechaTexto")
            .textContent =
            formatearFecha(user.birth_date);

        document.getElementById("registroTexto")
            .textContent =
            formatearFecha(
                user.createdAt ||
                user.created_at
            );

        document.getElementById("nombre")
            .value = user.full_name;

        document.getElementById("email")
            .value =
            user.email.toLowerCase();

        document.getElementById("fecha")
            .value =
            user.birth_date?.split("T")[0];

        document.getElementById("metadata")
            .value =
            user.metadata?.info || "";

        localStorage.setItem(
            "usuario",
            JSON.stringify(user)
        );

    } catch (err) {

        console.log(err);
    }
}

function formatearFecha(fecha) {

    if (!fecha) return "Sin fecha";

    return new Date(fecha)
        .toLocaleDateString("es-CL", {

        day: "2-digit",
        month: "2-digit",
        year: "numeric"

    });
}

async function actualizarPerfil(e) {

    e.preventDefault();

    const token =
        localStorage.getItem("token");

    const nombre =
        document.getElementById("nombre")
        .value.trim();

    const fecha =
        document.getElementById("fecha")
        .value;

    const metadataTexto =
        document.getElementById("metadata")
        .value.trim();

    const error =
        document.getElementById("errorPerfil");

    const mensaje =
        document.getElementById("mensajePerfil");

    error.textContent = "";
    mensaje.textContent = "";

    if (!nombre) {

        error.textContent =
            "El nombre es obligatorio";

        document.getElementById("nombre")
            .classList.add("input-error");

        return;
    }

    document.getElementById("nombre")
        .classList.remove("input-error");

    const datos = {

        full_name: nombre,
        birth_date: fecha,

        metadata: {
            info: metadataTexto
        }
    };

    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/me",
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify(datos)
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            error.textContent =
                data.message ||
                "Error al actualizar perfil";

            return;
        }

        mensaje.textContent =
            "Perfil actualizado correctamente";

        cargarPerfil();

    } catch (err) {

        console.log(err);

        error.textContent =
            "Error de conexión";
    }
}

async function cambiarPassword(e) {

    e.preventDefault();

    const actual =
        document.getElementById("actual").value;

    const nueva =
        document.getElementById("nueva").value;

    const confirmar =
        document.getElementById("confirmar").value;

    const error =
        document.getElementById("errorPassword");

    const mensaje =
        document.getElementById("mensajePassword");

    error.textContent = "";
    mensaje.textContent = "";

    if (nueva.length < 8) {

        error.textContent =
            "La nueva contraseña debe tener mínimo 8 caracteres";

        return;
    }

    if (nueva !== confirmar) {

        error.textContent =
            "Las contraseñas no coinciden";

        return;
    }

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/me/password",
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({

                    currentPassword: actual,
                    newPassword: nueva
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            error.textContent =
                data.message ||
                "Error al cambiar contraseña";

            return;
        }

        mensaje.textContent =
            "Contraseña actualizada correctamente";

        e.target.reset();

    } catch (err) {

        console.log(err);

        error.textContent =
            "Error de conexión";
    }
}

cargarPerfil();