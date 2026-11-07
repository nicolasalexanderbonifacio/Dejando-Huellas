document.addEventListener("DOMContentLoaded", function () {

    // PREGUNTAS FRECUENTES
    const botonesPreguntas = document.querySelectorAll(".pregunta-btn");

    botonesPreguntas.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const respuesta = boton.nextElementSibling;
            const estabaAbierta = respuesta.classList.contains("activa");

            document.querySelectorAll(".respuesta").forEach(function (r) {
                r.classList.remove("activa");
            });

            document.querySelectorAll(".pregunta-btn span").forEach(function (s) {
                s.textContent = "＋";
            });

            if (!estabaAbierta) {
                respuesta.classList.add("activa");
                boton.querySelector("span").textContent = "−";
            }

        });

    });


    // BUSCADOR DE PREGUNTAS
    const buscador = document.getElementById("buscadorAyuda");
    const buscarBtn = document.getElementById("buscarBtn");
    const preguntas = document.querySelectorAll(".pregunta");
    const sinResultados = document.getElementById("sinResultados");

    function buscarPreguntas() {

        const texto = buscador.value.toLowerCase().trim();
        let encontrados = 0;

        preguntas.forEach(function (pregunta) {

            const contenido = pregunta.textContent.toLowerCase();

            if (contenido.includes(texto)) {
                pregunta.style.display = "block";
                encontrados++;
            } else {
                pregunta.style.display = "none";
                pregunta.querySelector(".respuesta").classList.remove("activa");
                pregunta.querySelector(".pregunta-btn span").textContent = "＋";
            }

        });

        sinResultados.style.display =
            encontrados === 0 ? "block" : "none";
    }

    buscarBtn.addEventListener("click", buscarPreguntas);

    buscador.addEventListener("input", buscarPreguntas);

    buscador.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarPreguntas();
        }
    });


    // FORMULARIO DE AYUDA
    const formulario = document.getElementById("formAyuda");

    formulario.addEventListener("submit", function (e) {

        e.preventDefault();

        const nombre = document.getElementById("nombreAyuda").value.trim();
        const correo = document.getElementById("correoAyuda").value.trim();
        const tema = document.getElementById("temaAyuda").value;
        const mensaje = document.getElementById("mensajeAyuda").value.trim();

        if (!nombre || !correo || !tema || !mensaje) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const consulta = {
            nombre: nombre,
            correo: correo,
            tema: tema,
            mensaje: mensaje,
            fecha: new Date().toLocaleString()
        };

        let consultas = JSON.parse(
            localStorage.getItem("dejanHuellaConsultas") || "[]"
        );

        consultas.push(consulta);

        localStorage.setItem(
            "dejanHuellaConsultas",
            JSON.stringify(consultas)
        );

        document.getElementById("mensajeConfirmacion").textContent =
            "¡Tu consulta quedó guardada correctamente!";

        formulario.reset();

    });


    // MENÚ PARA CELULARES
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            mainNav.classList.toggle("menu-abierto");
        });
    }


    // CERRAR SESIÓN
    function cerrarSesion() {
        const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");

        if (confirmar) {
            window.location.href = "index.html";
        }
    }

    const botonCerrar = document.getElementById("cerrarSesion");
    const botonCerrarFooter = document.getElementById("cerrarSesionFooter");

    if (botonCerrar) {
        botonCerrar.addEventListener("click", cerrarSesion);
    }

    if (botonCerrarFooter) {
        botonCerrarFooter.addEventListener("click", cerrarSesion);
    }

});