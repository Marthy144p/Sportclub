function login(e) {
    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const pass = document.getElementById("password").value;
    const error = document.getElementById("error");

    const clave = "1234567";

    if (pass !== clave) {
        error.textContent = "Contraseña incorrecta";
        return;
    }

    if (correo === "user@mail.com") {
        window.location.href = "dashboard-usuario.html";
    } 
    else if (correo === "coach@mail.com") {
        window.location.href = "dashboard-coach.html";
    } 
    else if (correo === "admin@mail.com") {
        window.location.href = "dashboard-admin.html";
    } 
    else {
        error.textContent = "Usuario no encontrado";
    }
}