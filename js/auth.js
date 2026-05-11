const token = localStorage.getItem("token");

const usuario =
    JSON.parse(
        localStorage.getItem("usuario")
    );

if (!token || !usuario) {

    window.location.href =
        "login.html";
}

const paginaActual =
    window.location.pathname;

if (
    paginaActual.includes("usuarios.html")
    &&
    usuario.role !== "admin"
) {

    window.location.href =
        "login.html";
}

if (
    paginaActual.includes("dashboard-admin.html")
    &&
    usuario.role !== "admin"
) {

    window.location.href =
        "login.html";
}

if (
    paginaActual.includes("dashboard-coach.html")
    &&
    usuario.role !== "coach"
) {

    window.location.href =
        "login.html";
}

if (
    paginaActual.includes("dashboard-usuario.html")
    &&
    usuario.role !== "user"
) {

    window.location.href =
        "login.html";
}

function logout() {

    localStorage.clear();

    window.location.href =
        "login.html";
}