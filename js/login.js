async function login(e) {

    e.preventDefault();

    const correo =
        document.getElementById("correo").value;

    const password =
        document.getElementById("password").value;

    const error =
        document.getElementById("error");

    error.textContent = "";

    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: correo,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            error.textContent =
                data.message || "Credenciales inválidas";

            return;
        }

        console.log("LOGIN EXITOSO", data);

        localStorage.setItem(
            "token",
            data.data.token
        );

        localStorage.setItem(
            "usuario",
            JSON.stringify(data.data.user)
        );

        const rol = data.data.user.role;

        if (rol === "admin") {

            window.location.href =
                "dashboard-admin.html";
        }

        else if (rol === "coach") {

            window.location.href =
                "dashboard-coach.html";
        }

        else {

            window.location.href =
                "dashboard-usuario.html";
        }

    } catch (err) {

        console.error(err);

        error.textContent =
            "Error de conexión con servidor";
    }
}