/* ==========================================
   DEJANDO HUELLAS - MIS CITAS
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const CLAVE_CITAS = "dejanHuellaCitas";

  const listaCitas = document.getElementById("listaCitas");
  const mensajeVacio = document.getElementById("mensajeVacio");
  const filtroCitas = document.getElementById("filtroCitas");

  const totalCitas = document.getElementById("totalCitas");
  const citasPendientes = document.getElementById("citasPendientes");
  const citasCanceladas = document.getElementById("citasCanceladas");

  function leerCitas() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_CITAS) || "[]");
      return Array.isArray(datos) ? datos : [];
    } catch (error) {
      console.error("Error al leer las citas:", error);
      return [];
    }
  }

  function guardarCitas(citas) {
    localStorage.setItem(CLAVE_CITAS, JSON.stringify(citas));
  }

  function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[caracter]);
  }

  function fechaActual() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  }

  function obtenerEstado(cita) {
    if (cita.estado === "Cancelada") {
      return "Cancelada";
    }

    if (cita.fecha < fechaActual()) {
      return "Finalizada";
    }

    return "Pendiente";
  }

  function formatearFecha(fecha) {
    if (!fecha) return "Fecha no disponible";

    const partes = fecha.split("-");
    const fechaLocal = new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      Number(partes[2])
    );

    return fechaLocal.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function actualizarEstadisticas(citas) {
    totalCitas.textContent = citas.length;

    citasPendientes.textContent = citas.filter(cita =>
      obtenerEstado(cita) === "Pendiente"
    ).length;

    citasCanceladas.textContent = citas.filter(cita =>
      obtenerEstado(cita) === "Cancelada"
    ).length;
  }

  function mostrarCitas() {
    const citas = leerCitas();

    actualizarEstadisticas(citas);

    const filtro = filtroCitas.value;

    let citasFiltradas = citas.filter(cita => {
      const estado = obtenerEstado(cita);

      if (filtro === "pendientes") return estado === "Pendiente";
      if (filtro === "canceladas") return estado === "Cancelada";
      if (filtro === "finalizadas") return estado === "Finalizada";

      return true;
    });

    // Ordenar por fecha, de la más próxima a la más lejana.
    citasFiltradas.sort((a, b) => {
      return `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`);
    });

    listaCitas.innerHTML = "";

    if (citasFiltradas.length === 0) {
      listaCitas.hidden = true;
      mensajeVacio.hidden = false;

      if (citas.length > 0) {
        mensajeVacio.querySelector("h3").textContent =
          "No hay citas en esta categoría";

        mensajeVacio.querySelector("p").textContent =
          "Prueba seleccionando otro filtro para ver tus citas.";
      } else {
        mensajeVacio.querySelector("h3").textContent =
          "Aún no tienes citas";

        mensajeVacio.querySelector("p").textContent =
          "Cuando agendes una cita, aparecerá aquí toda la información.";
      }

      return;
    }

    listaCitas.hidden = false;
    mensajeVacio.hidden = true;

    citasFiltradas.forEach(cita => {
      const estado = obtenerEstado(cita);

      const tarjeta = document.createElement("article");
      tarjeta.className = "tarjeta-cita";

      const claseEstado = estado.toLowerCase();

      tarjeta.innerHTML = `
        <div class="tarjeta-cita-superior">

          <div class="mascota-cita-icono">🐾</div>

          <div class="mascota-cita-datos">
            <h3>${escaparHTML(cita.nombre)}</h3>
            <p>${escaparHTML(cita.especie)}${cita.raza ? " · " + escaparHTML(cita.raza) : ""}</p>
          </div>

          <span class="estado-cita ${claseEstado}">
            ${escaparHTML(estado)}
          </span>

        </div>

        <div class="detalles-cita">

          <div class="detalle-cita">
            <i class="fa-regular fa-calendar"></i>
            <div>
              <small>Fecha</small>
              <strong>${escaparHTML(formatearFecha(cita.fecha))}</strong>
            </div>
          </div>

          <div class="detalle-cita">
            <i class="fa-regular fa-clock"></i>
            <div>
              <small>Hora</small>
              <strong>${escaparHTML(cita.hora)}</strong>
            </div>
          </div>

          <div class="detalle-cita">
            <i class="fa-solid fa-stethoscope"></i>
            <div>
              <small>Motivo</small>
              <strong>${escaparHTML(cita.motivo)}</strong>
            </div>
          </div>

          <div class="detalle-cita">
            <i class="fa-solid fa-paw"></i>
            <div>
              <small>Edad</small>
              <strong>${escaparHTML(cita.edad)}</strong>
            </div>
          </div>

        </div>

        <div class="informacion-extra">
          <p><strong>Sexo:</strong> ${escaparHTML(cita.sexo)}</p>
          <p><strong>Peso:</strong> ${escaparHTML(cita.peso)} kg</p>
          ${cita.descripcion ? `<p><strong>Descripción:</strong> ${escaparHTML(cita.descripcion)}</p>` : ""}
        </div>

        <div class="acciones-cita">
          ${
            estado === "Pendiente"
            ? `<button class="boton-cancelar" type="button" data-id="${escaparHTML(cita.id)}">
                 <i class="fa-solid fa-xmark"></i> Cancelar cita
               </button>`
            : `<span class="texto-estado">
                 ${estado === "Cancelada" ? "Esta cita fue cancelada." : "Esta cita ya finalizó."}
               </span>`
          }
        </div>
      `;

      listaCitas.appendChild(tarjeta);
    });
  }

  // Cancelar una cita.
  listaCitas.addEventListener("click", event => {
    const boton = event.target.closest(".boton-cancelar");

    if (!boton) return;

    const id = boton.dataset.id;

    const confirmar = confirm(
      "¿Estás seguro de que deseas cancelar esta cita?"
    );

    if (!confirmar) return;

    const citas = leerCitas();

    const cita = citas.find(item => String(item.id) === id);

    if (!cita || obtenerEstado(cita) !== "Pendiente") {
      alert("Esta cita ya no se puede cancelar.");
      mostrarCitas();
      return;
    }

    cita.estado = "Cancelada";

    guardarCitas(citas);
    mostrarCitas();

    alert("La cita fue cancelada correctamente.");
  });

  filtroCitas.addEventListener("change", mostrarCitas);

  // Menú responsive.
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const abierto = mainNav.classList.toggle("abierto");
      menuToggle.setAttribute("aria-expanded", abierto);
    });
  }

  // Menú Más.
  const masToggle = document.getElementById("masToggle");
  const masMenu = document.getElementById("masMenu");

  if (masToggle && masMenu) {
    masToggle.addEventListener("click", () => {
      masMenu.hidden = !masMenu.hidden;
      masToggle.setAttribute("aria-expanded", !masMenu.hidden);
    });
  }

  // Menú de perfil.
  const perfilToggle = document.getElementById("perfilToggle");
  const perfilMenu = document.getElementById("perfilMenu");

  if (perfilToggle && perfilMenu) {
    perfilToggle.addEventListener("click", () => {
      perfilMenu.hidden = !perfilMenu.hidden;
      perfilToggle.setAttribute("aria-expanded", !perfilMenu.hidden);
    });
  }

  // Cerrar sesión.
  const cerrarSesion = document.getElementById("cerrarSesion");
  const cerrarSesionFooter = document.getElementById("cerrarSesionFooter");

  function salir() {
    window.location.href = "index.html";
  }

  if (cerrarSesion) {
    cerrarSesion.addEventListener("click", salir);
  }

  if (cerrarSesionFooter) {
    cerrarSesionFooter.addEventListener("click", salir);
  }

  // Mostrar las citas al abrir la página.
  mostrarCitas();

});