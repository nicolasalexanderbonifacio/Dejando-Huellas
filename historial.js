/* ==========================================
   DEJANDO HUELLAS - HISTORIAL
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const CLAVE_CITAS = "dejanHuellaCitas";

  const listaHistorial = document.getElementById("listaHistorial");
  const historialVacio = document.getElementById("historialVacio");
  const filtroHistorial = document.getElementById("filtroHistorial");

  const totalHistorial = document.getElementById("totalHistorial");
  const totalFinalizadas = document.getElementById("totalFinalizadas");
  const totalCanceladas = document.getElementById("totalCanceladas");

  function leerCitas() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_CITAS) || "[]");
      return Array.isArray(datos) ? datos : [];
    } catch (error) {
      console.error("Error al leer las citas:", error);
      return [];
    }
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

    return [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, "0"),
      String(hoy.getDate()).padStart(2, "0")
    ].join("-");
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

  function mostrarHistorial() {

    const citas = leerCitas();

    // Solo se muestran citas finalizadas o canceladas.
    const historial = citas.filter(cita => {
      return obtenerEstado(cita) !== "Pendiente";
    });

    const finalizadas = historial.filter(cita =>
      obtenerEstado(cita) === "Finalizada"
    );

    const canceladas = historial.filter(cita =>
      obtenerEstado(cita) === "Cancelada"
    );

    totalHistorial.textContent = historial.length;
    totalFinalizadas.textContent = finalizadas.length;
    totalCanceladas.textContent = canceladas.length;

    const filtro = filtroHistorial.value;

    let filtradas = historial.filter(cita => {
      const estado = obtenerEstado(cita);

      if (filtro === "finalizadas") {
        return estado === "Finalizada";
      }

      if (filtro === "canceladas") {
        return estado === "Cancelada";
      }

      return true;
    });

    // Ordenar de la más reciente a la más antigua.
    filtradas.sort((a, b) =>
      `${b.fecha} ${b.hora}`.localeCompare(`${a.fecha} ${a.hora}`)
    );

    listaHistorial.innerHTML = "";

    if (filtradas.length === 0) {
      listaHistorial.hidden = true;
      historialVacio.hidden = false;

      if (historial.length > 0) {
        historialVacio.querySelector("h3").textContent =
          "No hay citas en esta categoría";

        historialVacio.querySelector("p").textContent =
          "Selecciona otro filtro para consultar tu historial.";
      } else {
        historialVacio.querySelector("h3").textContent =
          "Tu historial está vacío";

        historialVacio.querySelector("p").textContent =
          "Cuando una cita finalice o sea cancelada, aparecerá aquí.";
      }

      return;
    }

    listaHistorial.hidden = false;
    historialVacio.hidden = true;

    filtradas.forEach(cita => {

      const estado = obtenerEstado(cita);

      const tarjeta = document.createElement("article");
      tarjeta.className = "tarjeta-historial";

      tarjeta.innerHTML = `
        <div class="historial-tarjeta-superior">

          <div class="historial-mascota-icono">🐾</div>

          <div class="historial-mascota-datos">
            <h3>${escaparHTML(cita.nombre)}</h3>
            <p>
              ${escaparHTML(cita.especie)}
              ${cita.raza ? " · " + escaparHTML(cita.raza) : ""}
            </p>
          </div>

          <span class="historial-estado ${estado.toLowerCase()}">
            ${escaparHTML(estado)}
          </span>

        </div>

        <div class="historial-detalles">

          <div>
            <i class="fa-regular fa-calendar"></i>
            <span>
              <small>Fecha</small>
              <strong>${escaparHTML(formatearFecha(cita.fecha))}</strong>
            </span>
          </div>

          <div>
            <i class="fa-regular fa-clock"></i>
            <span>
              <small>Hora</small>
              <strong>${escaparHTML(cita.hora)}</strong>
            </span>
          </div>

          <div>
            <i class="fa-solid fa-stethoscope"></i>
            <span>
              <small>Motivo</small>
              <strong>${escaparHTML(cita.motivo)}</strong>
            </span>
          </div>

          <div>
            <i class="fa-solid fa-paw"></i>
            <span>
              <small>Edad</small>
              <strong>${escaparHTML(cita.edad)}</strong>
            </span>
          </div>

        </div>

        <div class="historial-informacion">
          <p><strong>Sexo:</strong> ${escaparHTML(cita.sexo)}</p>
          <p><strong>Peso:</strong> ${escaparHTML(cita.peso)} kg</p>
          ${
            cita.descripcion
              ? `<p><strong>Descripción:</strong> ${escaparHTML(cita.descripcion)}</p>`
              : ""
          }
        </div>

        <div class="historial-pie">
          <i class="fa-solid fa-heart"></i>
          ${
            estado === "Cancelada"
              ? "Esta cita fue cancelada."
              : "Cita finalizada."
          }
        </div>
      `;

      listaHistorial.appendChild(tarjeta);
    });
  }

  filtroHistorial.addEventListener("change", mostrarHistorial);

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
  function salir() {
    window.location.href = "index.html";
  }

  const cerrarSesion = document.getElementById("cerrarSesion");
  const cerrarSesionFooter = document.getElementById("cerrarSesionFooter");

  if (cerrarSesion) cerrarSesion.addEventListener("click", salir);
  if (cerrarSesionFooter) cerrarSesionFooter.addEventListener("click", salir);

  mostrarHistorial();

});