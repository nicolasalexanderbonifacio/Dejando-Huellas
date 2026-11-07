/* =========================================================
   DEJANDO HUELLAS - SISTEMA DE CITAS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("citaForm");
  const calendario = document.getElementById("diasCalendario");
  const tituloMes = document.getElementById("mesAnio");
  const textoFecha = document.getElementById("fechaSeleccionada");
  const textoHora = document.getElementById("horaSeleccionada");
  const resumen = document.getElementById("resumenEstado");
  const mensaje = document.getElementById("mensajeFormulario");

  const botonMesAnterior = document.getElementById("mesAnterior");
  const botonMesSiguiente = document.getElementById("mesSiguiente");

  const botonesHora = Array.from(document.querySelectorAll(".hora"));

  if (!form || !calendario || !tituloMes) {
    console.error("No se encontraron los elementos del formulario.");
    return;
  }

  const CLAVE_CITAS = "dejanHuellaCitas";

  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let mesActual = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    1
  );

  let fechaElegida = null;
  let horaElegida = null;


  // CONVERTIR FECHA

  function fechaAClave(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  }


  // LEER CITAS GUARDADAS

  function leerCitas() {
    try {
      const guardadas = JSON.parse(
        localStorage.getItem(CLAVE_CITAS) || "[]"
      );

      return Array.isArray(guardadas) ? guardadas : [];

    } catch (error) {
      console.error("Error al leer las citas:", error);
      return [];
    }
  }


  // GUARDAR CITAS

  function guardarCitas(citas) {
    localStorage.setItem(
      CLAVE_CITAS,
      JSON.stringify(citas)
    );
  }


  // PROTEGER LOS TEXTOS DEL RESUMEN

  function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[caracter]);
  }


  // COMPROBAR SI LA HORA YA PASÓ

  function fechaYHoraYaPasaron(fechaClave, hora) {

    if (!fechaClave || !hora) return false;

    const partes = hora.match(
      /(\d{1,2}):(\d{2})\s*(a\. m\.|p\. m\.)/i
    );

    if (!partes) return false;

    let horas = Number(partes[1]);
    const minutos = Number(partes[2]);
    const periodo = partes[3].toLowerCase();

    if (periodo.includes("p") && horas !== 12) {
      horas += 12;
    }

    if (periodo.includes("a") && horas === 12) {
      horas = 0;
    }

    const fechaHora = new Date(`${fechaClave}T00:00:00`);

    fechaHora.setHours(horas, minutos, 0, 0);

    return fechaHora.getTime() <= Date.now();
  }


  // COMPROBAR SI UN HORARIO ESTÁ OCUPADO

  function horarioOcupado(fechaClave, hora) {

    return leerCitas().some(cita =>
      cita.fecha === fechaClave &&
      cita.hora === hora &&
      cita.estado !== "Cancelada"
    );

  }


  // FORMATO DE FECHA

  function fechaCompleta(fecha) {

    return fecha.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  }


  function fechaYHoraTexto(fecha) {

    return fecha.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  }


  // DIBUJAR CALENDARIO

  function dibujarCalendario() {

    const anio = mesActual.getFullYear();
    const mes = mesActual.getMonth();

    tituloMes.textContent =
      `${nombresMeses[mes]} ${anio}`;

    calendario.innerHTML = "";

    const primerDia = new Date(anio, mes, 1).getDay();

    const espaciosIniciales = (primerDia + 6) % 7;

    const cantidadDias =
      new Date(anio, mes + 1, 0).getDate();


    // ESPACIOS VACÍOS

    for (let i = 0; i < espaciosIniciales; i++) {

      const espacio = document.createElement("span");

      espacio.className = "dia-vacio";

      espacio.setAttribute("aria-hidden", "true");

      calendario.appendChild(espacio);

    }


    // CREAR LOS DÍAS

    for (let numeroDia = 1; numeroDia <= cantidadDias; numeroDia++) {

      const fecha = new Date(anio, mes, numeroDia);

      const clave = fechaAClave(fecha);

      const boton = document.createElement("button");

      boton.type = "button";
      boton.className = "dia";
      boton.textContent = numeroDia;

      boton.setAttribute(
        "aria-label",
        fechaYHoraTexto(fecha)
      );

      boton.disabled = fecha < hoy;


      if (
        fechaElegida &&
        clave === fechaAClave(fechaElegida)
      ) {

        boton.classList.add("seleccionado");

        boton.setAttribute("aria-pressed", "true");

      } else {

        boton.setAttribute("aria-pressed", "false");

      }


      // SELECCIONAR FECHA

      boton.addEventListener("click", () => {

        fechaElegida = fecha;

        horaElegida = null;

        textoFecha.textContent =
          `Fecha elegida: ${fechaCompleta(fecha)}`;

        textoHora.textContent =
          "Selecciona una hora disponible.";

        mensaje.textContent = "";

        dibujarCalendario();

        actualizarHorarios();

        actualizarResumen();

      });


      calendario.appendChild(boton);

    }


    // DESACTIVAR EL MES ANTERIOR

    const mesActualNumero =
      hoy.getFullYear() * 12 + hoy.getMonth();

    const mesMostradoNumero =
      anio * 12 + mes;

    if (botonMesAnterior) {

      botonMesAnterior.disabled =
        mesMostradoNumero <= mesActualNumero;

    }

  }


  // ACTUALIZAR HORARIOS

  function actualizarHorarios() {

    botonesHora.forEach(boton => {

      const hora = boton.dataset.hora;

      const sinFecha = !fechaElegida;

      const ocupada = fechaElegida &&
        horarioOcupado(fechaAClave(fechaElegida), hora);

      const pasada = fechaElegida &&
        fechaYHoraYaPasaron(fechaAClave(fechaElegida), hora);


      boton.disabled = Boolean(
        sinFecha || ocupada || pasada
      );

      boton.classList.toggle(
        "seleccionada",
        hora === horaElegida && !boton.disabled
      );

      boton.setAttribute(
        "aria-pressed",
        String(hora === horaElegida && !boton.disabled)
      );


      if (ocupada) {

        boton.title = "Este horario ya está reservado";

      } else if (pasada) {

        boton.title = "Este horario ya pasó";

      } else {

        boton.title = "";

      }

    });

  }


  // OBTENER DATOS DEL FORMULARIO

  function datosFormulario() {

    const datos = new FormData(form);

    return {

      nombre: datos.get("nombre")?.trim() || "",

      especie: datos.get("especie") || "",

      raza: datos.get("raza")?.trim() || "",

      edad: datos.get("edad")?.trim() || "",

      sexo: datos.get("sexo") || "",

      peso: datos.get("peso") || "",

      motivo: datos.get("motivo") || "",

      descripcion: datos.get("descripcion")?.trim() || ""

    };

  }


  // ACTUALIZAR RESUMEN

  function actualizarResumen() {

    if (!resumen) return;

    const mascota = datosFormulario();


    if (!fechaElegida || !horaElegida) {

      resumen.innerHTML = `
        <span>🐾</span>

        <div>
          <strong>
            Aún no has seleccionado<br>
            una fecha y hora.
          </strong>

          <p>
            Elige un día, una hora y completa
            los datos de tu mascota.
          </p>
        </div>
      `;

      return;

    }


    resumen.innerHTML = `

      <span>🐾</span>

      <div>

        <strong>Tu cita está casi lista</strong>

        <p>
          <b>Fecha:</b>
          ${escaparHTML(fechaCompleta(fechaElegida))}
        </p>

        <p>
          <b>Hora:</b>
          ${escaparHTML(horaElegida)}
        </p>

        <p>
          <b>Mascota:</b>
          ${escaparHTML(mascota.nombre || "Sin completar")}
        </p>

        <p>
          <b>Especie:</b>
          ${escaparHTML(mascota.especie || "Sin completar")}
        </p>

        <p>
          <b>Motivo:</b>
          ${escaparHTML(mascota.motivo || "Sin completar")}
        </p>

      </div>

    `;

  }


  // SELECCIONAR HORA

  botonesHora.forEach(boton => {

    boton.addEventListener("click", () => {

      if (boton.disabled) return;

      horaElegida = boton.dataset.hora;

      textoHora.textContent =
        `Hora elegida: ${horaElegida}`;

      mensaje.textContent = "";

      actualizarHorarios();

      actualizarResumen();

    });

  });


  // BOTÓN MES ANTERIOR

  if (botonMesAnterior) {

    botonMesAnterior.addEventListener("click", () => {

      const mesDeHoy = new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        1
      );

      const anterior = new Date(
        mesActual.getFullYear(),
        mesActual.getMonth() - 1,
        1
      );

      if (anterior >= mesDeHoy) {

        mesActual = anterior;

        dibujarCalendario();

      }

    });

  }


  // BOTÓN MES SIGUIENTE

  if (botonMesSiguiente) {

    botonMesSiguiente.addEventListener("click", () => {

      mesActual = new Date(
        mesActual.getFullYear(),
        mesActual.getMonth() + 1,
        1
      );

      dibujarCalendario();

    });

  }


  // ACTUALIZAR RESUMEN AL ESCRIBIR

  form.addEventListener("input", actualizarResumen);

  form.addEventListener("change", actualizarResumen);


  // AGENDAR CITA

  form.addEventListener("submit", evento => {

    evento.preventDefault();

    mensaje.textContent = "";


    if (!fechaElegida) {

      mensaje.textContent =
        "Por favor, selecciona la fecha de la cita.";

      return;

    }


    if (!horaElegida) {

      mensaje.textContent =
        "Por favor, selecciona una hora disponible.";

      return;

    }


    if (!form.reportValidity()) return;


    const fechaClave = fechaAClave(fechaElegida);


    if (fechaYHoraYaPasaron(fechaClave, horaElegida)) {

      mensaje.textContent =
        "Esa hora ya pasó. Selecciona otro horario.";

      actualizarHorarios();

      return;

    }


    if (horarioOcupado(fechaClave, horaElegida)) {

      mensaje.textContent =
        "Ese horario acaba de ser reservado. Elige otro.";

      horaElegida = null;

      actualizarHorarios();

      actualizarResumen();

      return;

    }


    const mascota = datosFormulario();


    const nuevaCita = {

      id: (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : `cita-${Date.now()}-${Math.random().toString(16).slice(2)}`,

      ...mascota,

      fecha: fechaClave,

      hora: horaElegida,

      estado: "Pendiente",

      creadaEn: new Date().toISOString()

    };


    try {

      const citas = leerCitas();

      citas.push(nuevaCita);

      guardarCitas(citas);


      mensaje.textContent =
        "¡Tu cita fue agendada correctamente! 🐾";


      form.reset();

      fechaElegida = null;

      horaElegida = null;

      textoFecha.textContent =
        "Selecciona un día disponible.";

      textoHora.textContent =
        "Selecciona una hora disponible.";

      dibujarCalendario();

      actualizarHorarios();

      actualizarResumen();


    } catch (error) {

      console.error("No se pudo guardar la cita:", error);

      mensaje.textContent =
        "No se pudo guardar la cita. Inténtalo de nuevo.";

    }

  });


  // MENÚ RESPONSIVE

  const menuToggle = document.getElementById("menuToggle");

  const mainNav = document.getElementById("mainNav");


  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

      const abierto =
        mainNav.classList.toggle("menu-abierto");

      menuToggle.setAttribute(
        "aria-expanded",
        String(abierto)
      );

      menuToggle.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
      );

    });

  }


  // MENÚ DESPLEGABLE

  function configurarDesplegable(idBoton, idMenu) {

    const boton = document.getElementById(idBoton);

    const menu = document.getElementById(idMenu);

    if (!boton || !menu) return;


    boton.addEventListener("click", () => {

      const seAbrira = menu.hidden;

      menu.hidden = !seAbrira;

      boton.setAttribute(
        "aria-expanded",
        String(seAbrira)
      );

    });


    document.addEventListener("click", evento => {

      if (
        !boton.contains(evento.target) &&
        !menu.contains(evento.target)
      ) {

        menu.hidden = true;

        boton.setAttribute("aria-expanded", "false");

      }

    });

  }


  configurarDesplegable("masToggle", "masMenu");

  configurarDesplegable("perfilToggle", "perfilMenu");


  // CERRAR SESIÓN

  function cerrarSesion() {

    window.location.href = "index.html";

  }


  ["cerrarSesion", "cerrarSesionFooter"].forEach(id => {

    const boton = document.getElementById(id);

    if (boton) {

      boton.addEventListener("click", cerrarSesion);

    }

  });


  // INICIAR CALENDARIO

  botonesHora.forEach(boton => {

    boton.classList.remove("seleccionada");

    boton.setAttribute("aria-pressed", "false");

  });


  textoFecha.textContent =
    "Selecciona un día disponible.";

  textoHora.textContent =
    "Selecciona una hora disponible.";

  dibujarCalendario();

  actualizarHorarios();

  actualizarResumen();

});