
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. ELEMENTOS PRINCIPALES
  // ==========================================

  const categorias = document.querySelectorAll(".cuidado-categoria");
  const filtros = document.querySelectorAll(".filtro-servicio");
  const serviciosGrid = document.getElementById("serviciosGrid");
  const sinServicios = document.getElementById("sinServicios");

  const modal = document.getElementById("modalTip");
  const modalTitulo = document.getElementById("modalTipTitulo");
  const modalTexto = document.getElementById("modalTipTexto");

  // ==========================================
  // 2. CATÁLOGO DE SERVICIOS
  // ==========================================

  const servicios = [
    {
      id: 1,
      tipo: "peluqueria",
      icono: "🐶",
      foto: "foto-bano",
      simbolo: "🐾",
      nombre: "Baño y peluquería canina",
      descripcion: "Limpieza, corte de uñas, limpieza de oídos y mucho más.",
      precio: "$ 35.000"
    },
    {
      id: 2,
      tipo: "salud",
      icono: "🐱",
      foto: "foto-veterinaria",
      simbolo: "✚",
      nombre: "Consulta veterinaria",
      descripcion: "Revisión general, diagnóstico y seguimiento.",
      precio: "$ 45.000"
    },
    {
      id: 3,
      tipo: "vacunacion",
      icono: "🐕",
      foto: "foto-vacunas",
      simbolo: "♥",
      nombre: "Plan de vacunación",
      descripcion: "Consulta las vacunas que necesita tu mascota según su edad y especie.",
      precio: "$ 30.000"
    },
    {
      id: 4,
      tipo: "hospedaje",
      icono: "🐈",
      foto: "foto-hospedaje",
      simbolo: "⌂",
      nombre: "Hospedaje temporal",
      descripcion: "Un lugar cómodo y seguro mientras estás fuera.",
      precio: "$ 60.000 / noche"
    },
    {
      id: 5,
      tipo: "alimentacion",
      icono: "🥣",
      foto: "foto-vacunas",
      simbolo: "♥",
      nombre: "Asesoría nutricional",
      descripcion: "Orientación para elegir una alimentación adecuada para tu mascota.",
      precio: "Consultar"
    },
    {
      id: 6,
      tipo: "terapias",
      icono: "🐕",
      foto: "foto-veterinaria",
      simbolo: "✚",
      nombre: "Terapias y rehabilitación",
      descripcion: "Acompañamiento profesional para apoyar su movilidad y recuperación.",
      precio: "Consultar"
    },
    {
      id: 7,
      tipo: "salud",
      icono: "🐾",
      foto: "foto-veterinaria",
      simbolo: "♥",
      nombre: "Control de bienestar",
      descripcion: "Seguimiento preventivo de la salud y el bienestar de tu mascota.",
      precio: "Consultar"
    },
    {
      id: 8,
      tipo: "peluqueria",
      icono: "🐩",
      foto: "foto-bano",
      simbolo: "🐾",
      nombre: "Cepillado y cuidado del pelaje",
      descripcion: "Mantenimiento del pelaje para ayudar a conservarlo limpio y cuidado.",
      precio: "Consultar"
    }
  ];

  // ==========================================
  // 3. FAVORITOS
  // ==========================================

  const CLAVE_FAVORITOS = "dejanHuellaServiciosFavoritos";

  function obtenerFavoritos() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_FAVORITOS)) || [];
    } catch {
      return [];
    }
  }

  let favoritos = obtenerFavoritos();

  function guardarFavoritos() {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
  }

  // ==========================================
  // 4. MOSTRAR LOS SERVICIOS
  // ==========================================

  function mostrarServicios(lista) {
    serviciosGrid.innerHTML = "";

    if (lista.length === 0) {
      sinServicios.hidden = false;
      return;
    }

    sinServicios.hidden = true;

    lista.forEach(servicio => {
      const guardado = favoritos.includes(servicio.id);

      const tarjeta = document.createElement("article");
      tarjeta.className = "servicio-card";

      tarjeta.innerHTML = `
        <div class="servicio-foto ${servicio.foto}" role="img"
             aria-label="${servicio.nombre}">
          <span>${servicio.icono}</span>
          <button class="guardar-servicio"
                  type="button"
                  data-favorito="${servicio.id}"
                  aria-label="Guardar ${servicio.nombre}"
                  aria-pressed="${guardado}">
            ${guardado ? "♥" : "♡"}
          </button>
        </div>

        <h3><span>${servicio.simbolo}</span> ${servicio.nombre}</h3>
        <p>${servicio.descripcion}</p>
        <strong class="precio-servicio">${servicio.precio}</strong>

        <a class="boton-agendar" href="citas.html">
          <i class="fa-solid fa-calendar-check"></i>
          Agendar
        </a>
      `;

      serviciosGrid.appendChild(tarjeta);
    });
  }

  // ==========================================
  // 5. FILTROS Y CATEGORÍAS
  // ==========================================

  function aplicarFiltro(filtro) {
    let resultado;

    if (filtro === "todos") {
      resultado = servicios;
    } else if (filtro === "bienestar") {
      resultado = servicios.filter(servicio =>
        ["vacunacion", "alimentacion", "terapias"].includes(servicio.tipo)
      );
    } else {
      resultado = servicios.filter(servicio =>
        servicio.tipo === filtro
      );
    }

    mostrarServicios(resultado);

    // Actualizar categoría lateral
    categorias.forEach(boton => {
      boton.classList.toggle(
        "activa",
        boton.dataset.filtro === filtro
      );
    });

    // Actualizar filtros superiores
    filtros.forEach(boton => {
      boton.classList.toggle(
        "activo",
        boton.dataset.filtro === filtro
      );
    });

    // Cambiar título y descripción
    const titulos = {
      todos: [
        "Servicios de cuidado",
        "Nuestros servicios están diseñados para mantener a tu mascota saludable, feliz y siempre en las mejores condiciones."
      ],
      salud: [
        "Salud y bienestar",
        "Cuida la salud de tu mascota con revisiones y atención preventiva."
      ],
      vacunacion: [
        "Vacunación",
        "Mantén al día la protección de tu mascota con orientación veterinaria."
      ],
      peluqueria: [
        "Peluquería y estética",
        "Servicios de higiene y cuidado para que tu mascota esté cómoda."
      ],
      alimentacion: [
        "Alimentación especial",
        "Encuentra orientación para ofrecerle una alimentación adecuada."
      ],
      hospedaje: [
        "Hospedaje",
        "Un espacio cómodo y seguro para el cuidado de tu mascota."
      ],
      terapias: [
        "Terapias y rehabilitación",
        "Atención y acompañamiento para apoyar su bienestar y recuperación."
      ],
      bienestar: [
        "Bienestar de tu mascota",
        "Descubre servicios que ayudan a cuidar su salud y calidad de vida."
      ]
    };

    const titulo = document.querySelector(".cuidado-titulo h1");
    const descripcion = document.querySelector(".cuidado-titulo p");

    if (titulos[filtro]) {
      titulo.textContent = titulos[filtro][0];
      descripcion.textContent = titulos[filtro][1];
    }

    serviciosGrid.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  categorias.forEach(boton => {
    boton.addEventListener("click", () => {
      aplicarFiltro(boton.dataset.filtro);
    });
  });

  filtros.forEach(boton => {
    boton.addEventListener("click", () => {
      aplicarFiltro(boton.dataset.filtro);
    });
  });

  // ==========================================
  // 6. GUARDAR Y QUITAR FAVORITOS
  // ==========================================

  serviciosGrid.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-favorito]");

    if (!boton) return;

    const id = Number(boton.dataset.favorito);

    if (favoritos.includes(id)) {
      favoritos = favoritos.filter(item => item !== id);
    } else {
      favoritos.push(id);
    }

    guardarFavoritos();

    const filtroActivo = document.querySelector(
      ".cuidado-categoria.activa"
    );

    aplicarFiltro(filtroActivo?.dataset.filtro || "todos");
  });

  // ==========================================
  // 7. VENTANA DE CONSEJOS
  // ==========================================

  function abrirConsejo(titulo, texto) {
    modalTitulo.textContent = titulo;
    modalTexto.textContent = texto;

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      alert(titulo + "\n\n" + texto);
    }
  }

  document.querySelectorAll(".ver-tip").forEach(boton => {
    boton.addEventListener("click", () => {
      const datos = boton.dataset.tip.split("|");

      abrirConsejo(datos[0], datos.slice(1).join("|"));
    });
  });

  function cerrarModal() {
    if (modal.open) {
      modal.close();
    }
  }

  document.getElementById("cerrarModalTip")
    .addEventListener("click", cerrarModal);

  document.getElementById("modalEntendido")
    .addEventListener("click", cerrarModal);

  modal.addEventListener("click", evento => {
    if (evento.target === modal) {
      cerrarModal();
    }
  });

  // ==========================================
  // 8. MOSTRAR TODOS LOS TIPS
  // ==========================================

  const botonTodosTips = document.getElementById("verTodosTips");
  const tipsGrid = document.querySelector(".tips-grid");

  const tipsExtra = [
    {
      icono: "fa-solid fa-tooth",
      titulo: "Salud dental",
      texto: "Revisa su salud bucal y consulta con el veterinario sobre su higiene dental."
    },
    {
      icono: "fa-solid fa-moon",
      titulo: "Descanso adecuado",
      texto: "Prepara un lugar tranquilo y cómodo para que tu mascota pueda descansar."
    },
    {
      icono: "fa-solid fa-heart",
      titulo: "Cariño y compañía",
      texto: "Dedica tiempo al juego, la compañía y la atención diaria de tu mascota."
    }
  ];

  let tipsExpandidos = false;

  botonTodosTips.addEventListener("click", () => {
    if (!tipsExpandidos) {
      tipsExtra.forEach(tip => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tip-card";

        tarjeta.innerHTML = `
          <span class="tip-icono">
            <i class="${tip.icono}"></i>
          </span>
          <h3>${tip.titulo}</h3>
          <p>${tip.texto}</p>
          <button class="ver-tip"
                  data-tip="${tip.titulo}|${tip.texto}">
            Ver más →
          </button>
        `;

        tipsGrid.appendChild(tarjeta);

        tarjeta.querySelector(".ver-tip").addEventListener("click", () => {
          abrirConsejo(tip.titulo, tip.texto);
        });
      });

      botonTodosTips.innerHTML = 'Ver menos tips <span>↑</span>';
      tipsExpandidos = true;
    } else {
      document.querySelectorAll(".tip-card.extra").forEach(tip => tip.remove());

      // Quitar las tarjetas adicionales creadas
      while (tipsGrid.children.length > 5) {
        tipsGrid.removeChild(tipsGrid.lastElementChild);
      }

      botonTodosTips.innerHTML = 'Ver todos los tips <span>→</span>';
      tipsExpandidos = false;
    }
  });

  // ==========================================
  // 9. RECORDATORIOS
  // ==========================================

  const recordatorios = document.querySelectorAll(".recordatorio");

  recordatorios.forEach(recordatorio => {
    const accion = recordatorio.querySelector("span");

    if (!accion) return;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "accion-recordatorio";
    boton.textContent = accion.textContent;
    boton.setAttribute("aria-label", accion.textContent);

    accion.replaceWith(boton);

    boton.addEventListener("click", () => {
      window.location.href = "citas.html";
    });
  });

  // ==========================================
  // 10. MENÚ DE NAVEGACIÓN
  // ==========================================

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  menuToggle?.addEventListener("click", () => {
    const abierto = mainNav.classList.toggle("menu-abierto");
    menuToggle.setAttribute("aria-expanded", abierto);
  });

  // ==========================================
  // 11. MENÚ MÁS Y PERFIL
  // ==========================================

  const masToggle = document.getElementById("masToggle");
  const masMenu = document.getElementById("masMenu");

  const perfilToggle = document.getElementById("perfilToggle");
  const perfilMenu = document.getElementById("perfilMenu");

  function cerrarMenus() {
    masMenu.hidden = true;
    perfilMenu.hidden = true;

    masToggle.setAttribute("aria-expanded", "false");
    perfilToggle.setAttribute("aria-expanded", "false");
  }

  masToggle.addEventListener("click", evento => {
    evento.stopPropagation();

    const abrir = masMenu.hidden;
    cerrarMenus();

    masMenu.hidden = !abrir;
    masToggle.setAttribute("aria-expanded", abrir);
  });

  perfilToggle.addEventListener("click", evento => {
    evento.stopPropagation();

    const abrir = perfilMenu.hidden;
    cerrarMenus();

    perfilMenu.hidden = !abrir;
    perfilToggle.setAttribute("aria-expanded", abrir);
  });

  document.addEventListener("click", evento => {
    if (!evento.target.closest(".inicio-mas-contenedor") &&
        !evento.target.closest(".inicio-perfil-contenedor")) {
      cerrarMenus();
    }
  });

  // ==========================================
  // 12. CERRAR SESIÓN
  // ==========================================

  function cerrarSesion() {
    const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");

    if (confirmar) {
      window.location.href = "index.html";
    }
  }

  document.getElementById("cerrarSesion")
    ?.addEventListener("click", cerrarSesion);

  document.getElementById("cerrarSesionFooter")
    ?.addEventListener("click", cerrarSesion);

  // ==========================================
  // 13. INICIAR PÁGINA
  // ==========================================

  mostrarServicios(servicios);
  aplicarFiltro("todos");
});
