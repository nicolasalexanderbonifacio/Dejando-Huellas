document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // ELEMENTOS DEL FORMULARIO
    // =====================================

    const formulario = document.getElementById("formulario-login");
    if (!formulario) return;

    const nombres = document.getElementById("nombres");
    const apellidos = document.getElementById("apellidos");
    const telefono = document.getElementById("telefono");

    const correo = document.getElementById("correo");
    const contrasena = document.getElementById("contrasena");
    const confirmarContrasena = document.getElementById("confirmar-contrasena");

    const camposRegistro = document.getElementById("campos-registro");
    const campoConfirmar = document.getElementById("campo-confirmar");

    const mostrarContrasena = document.getElementById("mostrar-contrasena");

    const mensaje = document.getElementById("mensaje-login");
    const textoBoton = document.getElementById("texto-boton");

    // =====================================
    // ELEMENTOS DEL PANEL LATERAL
    // =====================================

    const botonCrear = document.getElementById("boton-crear-cuenta");

    const tituloFormulario = document.getElementById("titulo-formulario");
    const descripcion = document.getElementById("descripcion-formulario");

    const tituloBienvenida = document.getElementById("titulo-bienvenida");
    const textoBienvenida = document.getElementById("texto-bienvenida");

    const opcionesLogin = document.getElementById("opciones-login");

    let modo = "login";

    // Nombre de almacenamiento de las cuentas
    const CLAVE_USUARIOS = "dejanHuellaUsuarios";


    // =====================================
    // OBTENER USUARIOS GUARDADOS
    // =====================================

    function obtenerUsuarios() {

        try {
            return JSON.parse(
                localStorage.getItem(CLAVE_USUARIOS) || "[]"
            );
        } catch (error) {
            return [];
        }

    }


    // =====================================
    // CAMBIAR ENTRE LOGIN Y REGISTRO
    // =====================================

    function cambiarModo(nuevoModo) {

        modo = nuevoModo;

        mensaje.textContent = "";

        const esRegistro = modo === "registro";

        camposRegistro.hidden = !esRegistro;
        campoConfirmar.hidden = !esRegistro;

        // Activar o desactivar campos de registro
        nombres.disabled = !esRegistro;
        apellidos.disabled = !esRegistro;
        telefono.disabled = !esRegistro;
        confirmarContrasena.disabled = !esRegistro;

        nombres.required = esRegistro;
        apellidos.required = esRegistro;
        telefono.required = esRegistro;
        confirmarContrasena.required = esRegistro;

        opcionesLogin.hidden = esRegistro;

        if (esRegistro) {

            tituloFormulario.textContent = "Crear cuenta";

            descripcion.textContent =
                "Completa tus datos para formar parte de Dejando Huellas.";

            textoBoton.textContent = "Registrarme";

            tituloBienvenida.innerHTML =
                "¡Qué bueno tenerte<br>por aquí!";

            textoBienvenida.textContent =
                "Crea tu cuenta y descubre nuestros servicios para el cuidado de tus mascotas.";

            botonCrear.innerHTML =
                'Iniciar sesión <span aria-hidden="true">→</span>';

            contrasena.autocomplete = "new-password";

            confirmarContrasena.value = "";

        } else {

            tituloFormulario.textContent = "Iniciar sesión";

            descripcion.textContent =
                "Ingresa a tu cuenta para acceder a todos nuestros servicios y beneficios.";

            textoBoton.textContent = "Iniciar sesión";

            tituloBienvenida.innerHTML =
                "¿Aún no tienes<br>una cuenta?";

            textoBienvenida.textContent =
                "Regístrate ahora y disfruta de nuestros servicios: citas, productos y cuidado para mascotas.";

            botonCrear.innerHTML =
                'Crear cuenta <span aria-hidden="true">→</span>';

            contrasena.autocomplete = "current-password";

            nombres.value = "";
            apellidos.value = "";
            telefono.value = "";
            confirmarContrasena.value = "";
        }

        document.title = esRegistro
            ? "Crear cuenta | Dejando Huellas"
            : "Iniciar sesión | Dejando Huellas";

        mostrarContrasena.textContent = "◉";
        mostrarContrasena.setAttribute("aria-label", "Mostrar contraseña");
        mostrarContrasena.setAttribute("aria-pressed", "false");

        contrasena.type = "password";
        confirmarContrasena.type = "password";
    }


    // =====================================
    // BOTÓN PARA CAMBIAR DE MODO
    // =====================================

    botonCrear.addEventListener("click", () => {

        cambiarModo(
            modo === "login" ? "registro" : "login"
        );

    });


    // =====================================
    // MOSTRAR U OCULTAR CONTRASEÑA
    // =====================================

    mostrarContrasena.addEventListener("click", () => {

        const estaOculta = contrasena.type === "password";

        contrasena.type = estaOculta ? "text" : "password";

        if (modo === "registro") {
            confirmarContrasena.type = estaOculta ? "text" : "password";
        }

        mostrarContrasena.textContent = estaOculta ? "◎" : "◉";

        mostrarContrasena.setAttribute(
            "aria-label",
            estaOculta ? "Ocultar contraseña" : "Mostrar contraseña"
        );

        mostrarContrasena.setAttribute(
            "aria-pressed",
            String(estaOculta)
        );

    });


    // =====================================
    // ABRIR REGISTRO DESDE LA URL
    // =====================================

    const parametros = new URLSearchParams(window.location.search);

    if (parametros.get("registro") === "1") {
        cambiarModo("registro");
    }


    // =====================================
    // REGISTRO E INICIO DE SESIÓN
    // =====================================

    formulario.addEventListener("submit", (evento) => {

        evento.preventDefault();

        mensaje.textContent = "";

        const correoValor = correo.value.trim().toLowerCase();
        const contrasenaValor = contrasena.value;

        if (!correo.checkValidity()) {

            mensaje.textContent =
                "Por favor, escribe un correo electrónico válido.";

            correo.focus();
            return;
        }

        if (contrasenaValor.length < 6) {

            mensaje.textContent =
                "La contraseña debe tener al menos 6 caracteres.";

            contrasena.focus();
            return;
        }


        // =================================
        // REGISTRAR USUARIO
        // =================================

        if (modo === "registro") {

            const nombresValor = nombres.value.trim();
            const apellidosValor = apellidos.value.trim();
            const telefonoValor = telefono.value.trim();
            const confirmarValor = confirmarContrasena.value;

            if (!nombresValor || !apellidosValor || !telefonoValor) {

                mensaje.textContent =
                    "Completa todos tus datos personales.";

                return;
            }

            if (telefonoValor.length < 7) {

                mensaje.textContent =
                    "Escribe un número de teléfono válido.";

                telefono.focus();
                return;
            }

            if (contrasenaValor !== confirmarValor) {

                mensaje.textContent =
                    "Las contraseñas no coinciden.";

                confirmarContrasena.focus();
                return;
            }

            const usuarios = obtenerUsuarios();

            const usuarioExiste = usuarios.some(usuario =>
                usuario.correo === correoValor
            );

            if (usuarioExiste) {

                mensaje.textContent =
                    "Este correo ya tiene una cuenta registrada.";

                correo.focus();
                return;
            }

            const nuevoUsuario = {

                nombres: nombresValor,
                apellidos: apellidosValor,
                telefono: telefonoValor,
                correo: correoValor,
                contrasena: contrasenaValor

            };

            usuarios.push(nuevoUsuario);

            try {

                localStorage.setItem(
                    CLAVE_USUARIOS,
                    JSON.stringify(usuarios)
                );

            } catch (error) {

                mensaje.textContent =
                    "No se pudo guardar la cuenta en este navegador.";

                return;
            }

            // Cambiar al inicio de sesión
            cambiarModo("login");

            correo.value = correoValor;
            contrasena.value = "";

            mensaje.textContent =
                "¡Cuenta creada correctamente! Ahora inicia sesión.";

            correo.focus();

            return;
        }


        // =================================
        // INICIAR SESIÓN
        // =================================

        const usuarios = obtenerUsuarios();

        const usuarioEncontrado = usuarios.find(usuario =>
            usuario.correo === correoValor &&
            usuario.contrasena === contrasenaValor
        );

        if (!usuarioEncontrado) {

            mensaje.textContent =
                "El correo o la contraseña son incorrectos.";

            contrasena.focus();
            return;
        }

        // Guardar los datos básicos de la sesión
        sessionStorage.setItem(
            "dejanHuellaSesion",
            JSON.stringify({
                nombres: usuarioEncontrado.nombres,
                apellidos: usuarioEncontrado.apellidos,
                correo: usuarioEncontrado.correo
            })
        );

        mensaje.textContent = "¡Bienvenido a Dejando Huellas!";

        // Enviar al inicio
        window.location.href = "inicio.html";

    });


    // =====================================
    // RECUPERAR CONTRASEÑA
    // =====================================

    const modal = document.getElementById("modal-recuperacion");

    const abrirRecuperacion =
        document.getElementById("abrir-recuperacion");

    const cerrarModal =
        document.getElementById("cerrar-modal");

    const correoRecuperacion =
        document.getElementById("correo-recuperacion");

    const formularioRecuperacion =
        document.getElementById("formulario-recuperacion");

    const mensajeRecuperacion =
        document.getElementById("mensaje-recuperacion");


    abrirRecuperacion.addEventListener("click", () => {

        correoRecuperacion.value = correo.value.trim();

        mensajeRecuperacion.textContent = "";

        modal.showModal();

    });


    cerrarModal.addEventListener("click", () => {

        modal.close();

    });


    modal.addEventListener("click", (evento) => {

        if (evento.target === modal) {
            modal.close();
        }

    });


    formularioRecuperacion.addEventListener("submit", (evento) => {

        evento.preventDefault();

        const correoValor =
            correoRecuperacion.value.trim().toLowerCase();

        if (!correoRecuperacion.checkValidity()) {

            correoRecuperacion.reportValidity();
            return;
        }

        const usuarios = obtenerUsuarios();

        const existe = usuarios.some(usuario =>
            usuario.correo === correoValor
        );

        if (existe) {

            mensajeRecuperacion.textContent =
                "Tu cuenta existe. La recuperación por correo todavía necesita conectarse a un servicio externo.";

        } else {

            mensajeRecuperacion.textContent =
                "No encontramos una cuenta registrada con ese correo.";

        }

    });

});
// =====================================
// MENÚS DE LA PÁGINA DE INICIO
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const botonMas = document.getElementById("mas-boton");
    const menuMas = document.getElementById("menu-mas");

    const botonPerfil = document.getElementById("perfil-boton");
    const menuPerfil = document.getElementById("menu-perfil");

    const botonCerrarSesion = document.getElementById("cerrar-sesion");

    const nombreUsuario = document.getElementById("nombre-usuario");
    const nombreBienvenida = document.getElementById("nombre-bienvenida");

    const menuToggle = document.getElementById("menu-toggle");
    const menuPrincipal = document.getElementById("menu-principal");


    // =====================================
    // MOSTRAR NOMBRE DEL USUARIO
    // =====================================

    const sesion = sessionStorage.getItem("dejanHuellaSesion");

    if (sesion) {

        try {

            const usuario = JSON.parse(sesion);

            const nombre = usuario.nombres || "Usuario";

            if (nombreUsuario) {
                nombreUsuario.textContent = nombre;
            }

            if (nombreBienvenida) {
                nombreBienvenida.textContent = nombre;
            }

        } catch (error) {
            console.error("No se pudo cargar la sesión.");
        }

    }


    // =====================================
    // CERRAR TODOS LOS MENÚS
    // =====================================

    function cerrarMenus() {

        if (menuMas) {
            menuMas.hidden = true;
            botonMas.setAttribute("aria-expanded", "false");
        }

        if (menuPerfil) {
            menuPerfil.hidden = true;
            botonPerfil.setAttribute("aria-expanded", "false");
        }

    }


    // =====================================
    // MENÚ MÁS
    // =====================================

    if (botonMas && menuMas) {

        botonMas.addEventListener("click", (evento) => {

            evento.stopPropagation();

            const abrir = menuMas.hidden;

            cerrarMenus();

            menuMas.hidden = !abrir;

            botonMas.setAttribute(
                "aria-expanded",
                String(abrir)
            );

        });

        menuMas.addEventListener("click", (evento) => {
            evento.stopPropagation();
        });

    }


    // =====================================
    // MENÚ DEL PERFIL
    // =====================================

    if (botonPerfil && menuPerfil) {

        botonPerfil.addEventListener("click", (evento) => {

            evento.stopPropagation();

            const abrir = menuPerfil.hidden;

            cerrarMenus();

            menuPerfil.hidden = !abrir;

            botonPerfil.setAttribute(
                "aria-expanded",
                String(abrir)
            );

        });

        menuPerfil.addEventListener("click", (evento) => {
            evento.stopPropagation();
        });

    }


    // =====================================
    // CERRAR AL HACER CLIC FUERA
    // =====================================

    document.addEventListener("click", () => {
        cerrarMenus();
    });


    // =====================================
    // CERRAR CON LA TECLA ESCAPE
    // =====================================

    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {
            cerrarMenus();
        }

    });


    // =====================================
    // CERRAR SESIÓN
    // =====================================

    if (botonCerrarSesion) {

        botonCerrarSesion.addEventListener("click", () => {

            sessionStorage.removeItem("dejanHuellaSesion");

            window.location.href = "login.html";

        });

    }


    // =====================================
    // MENÚ PARA CELULARES
    // =====================================

    if (menuToggle && menuPrincipal) {

        menuToggle.addEventListener("click", () => {

            const abrir = menuPrincipal.classList.toggle("mostrar");

            menuToggle.setAttribute(
                "aria-expanded",
                String(abrir)
            );

            menuToggle.setAttribute(
                "aria-label",
                abrir ? "Cerrar menú" : "Abrir menú"
            );

        });

    }

});