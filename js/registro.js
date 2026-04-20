function validarRegistro(e) {
    e.preventDefault();

    const pass1 = document.getElementById("pass1").value;
    const pass2 = document.getElementById("pass2").value;
    const error = document.getElementById("error");

    if (pass1 !== pass2) {
        error.textContent = "Las contraseñas no coinciden";
        return;
    }

    if (pass1.length < 6) {
        error.textContent = "La contraseña debe tener al menos 6 caracteres";
        return;
    }

    error.textContent = "";
    alert("Cuenta creada correctamente (simulado)");
}