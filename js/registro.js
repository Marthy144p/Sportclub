async function validarRegistro(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const pass1 = document.getElementById("pass1").value;
    const pass2 = document.getElementById("pass2").value;

    const error = document.getElementById("error");
    const mensaje = document.getElementById("mensaje");

    error.textContent = "";
    mensaje.textContent = "";

    if (!nombre || !correo || !pass1 || !pass2) {
        error.textContent = "Todos los campos son obligatorios";
        return;
    }

    if (pass1 !== pass2) {
        error.textContent = "Las contraseñas no coinciden";
        return;
    }

    if (pass1.length < 8) {
        error.textContent = "La contraseña debe tener mínimo 8 caracteres";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name: nombre,
                email: correo,
                password: pass1,
                role: "user"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            error.textContent = data.message || "Error al registrar usuario";
            return;
        }

        mensaje.textContent = "Cuenta creada correctamente. Ahora puedes iniciar sesión.";

        document.querySelector("form").reset();

    } catch (err) {
        console.log(err);
        error.textContent = "Error de conexión con servidor";
    }
}