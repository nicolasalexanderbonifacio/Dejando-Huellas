document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. CATÁLOGO DE PRODUCTOS
  // ==========================================

  const productosBase = [
    {
      id: 1,
      nombre: "Alimento Royal Canin Adulto 8+",
      categoria: "Alimento",
      precio: 89900,
      emoji: "🐕"
    },
    {
      id: 2,
      nombre: "Alimento Pro Plan Gatos Adultos",
      categoria: "Alimento",
      precio: 76500,
      emoji: "🐈"
    },
    {
      id: 3,
      nombre: "Arnés ajustable para perros",
      categoria: "Accesorios",
      precio: 45500,
      emoji: "🦮"
    },
    {
      id: 4,
      nombre: "Cama para mascotas mediana",
      categoria: "Accesorios",
      precio: 69900,
      emoji: "🛏️"
    },
    {
      id: 5,
      nombre: "Shampoo medicado para perros",
      categoria: "Higiene y cuidado",
      precio: 32500,
      emoji: "🧴"
    },
    {
      id: 6,
      nombre: "Juguete de cuerda resistente",
      categoria: "Juguetes",
      precio: 22900,
      emoji: "🪢"
    },
    {
      id: 7,
      nombre: "Antipulgas Bravecto para perros",
      categoria: "Medicamentos",
      precio: 78900,
      emoji: "📦"
    },
    {
      id: 8,
      nombre: "Arena sanitaria para gatos",
      categoria: "Higiene y cuidado",
      precio: 28500,
      emoji: "🐾"
    },
    {
      id: 9,
      nombre: "Pelota para perros",
      categoria: "Juguetes",
      precio: 15900,
      emoji: "🎾"
    },
    {
      id: 10,
      nombre: "Plato para alimento",
      categoria: "Accesorios",
      precio: 18900,
      emoji: "🥣"
    },
    {
      id: 11,
      nombre: "Cepillo para mascotas",
      categoria: "Higiene y cuidado",
      precio: 21500,
      emoji: "🪮"
    },
    {
      id: 12,
      nombre: "Snack para perros",
      categoria: "Alimento",
      precio: 12500,
      emoji: "🦴"
    },
    {
      id: 13,
      nombre: "Juguete para gatos",
      categoria: "Juguetes",
      precio: 13900,
      emoji: "🧶"
    },
    {
      id: 14,
      nombre: "Collar reflectivo",
      categoria: "Accesorios",
      precio: 27500,
      emoji: "🐕‍🦺"
    }
  ];

  // ==========================================
  // 2. ELEMENTOS HTML
  // ==========================================

  const grid = document.getElementById("productosGrid");
  const busqueda = document.getElementById("buscarProducto");
  const ordenar = document.getElementById("ordenarProductos");
  const paginacion = document.getElementById("paginacion");
  const sinResultados = document.getElementById("sinResultados");
  const compraEstado = document.getElementById("compraEstado");

  // Comprobar que los elementos necesarios existen.
  if (
    !grid ||
    !busqueda ||
    !ordenar ||
    !paginacion ||
    !sinResultados ||
    !compraEstado
  ) {
    console.error(
      "No se encontraron los elementos HTML necesarios para productos.js."
    );
    return;
  }

  const POR_PAGINA = 8;

  let categoriaActiva = "Todos los productos";
  let paginaActual = 1;

  let carrito = leerStorage("dejanHuellaCarrito", []);
  let favoritos = leerStorage("dejanHuellaFavoritos", []);

  // ==========================================
  // 3. ALMACENAMIENTO LOCAL
  // ==========================================

  function leerStorage(clave, defecto) {
    try {
      const valor = JSON.parse(
        localStorage.getItem(clave) || "null"
      );

      return valor ?? defecto;

    } catch (error) {
      return defecto;
    }
  }

  function guardarStorage() {
    try {
      localStorage.setItem(
        "dejanHuellaCarrito",
        JSON.stringify(carrito)
      );

      localStorage.setItem(
        "dejanHuellaFavoritos",
        JSON.stringify(favoritos)
      );

    } catch (error) {
      console.error(
        "No se pudieron guardar los datos:",
        error
      );
    }
  }

  // ==========================================
  // 4. FORMATO DE PRECIOS
  // ==========================================

  function formatoPrecio(valor) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(valor);
  }

  // ==========================================
  // 5. BUSCAR Y FILTRAR PRODUCTOS
  // ==========================================

  function productosFiltrados() {

    const texto = busqueda.value
      .trim()
      .toLocaleLowerCase("es");

    let lista = productosBase.filter(producto => {

      const coincideCategoria =
        categoriaActiva === "Todos los productos" ||
        producto.categoria === categoriaActiva;

      const coincideBusqueda =
        producto.nombre
          .toLocaleLowerCase("es")
          .includes(texto) ||
        producto.categoria
          .toLocaleLowerCase("es")
          .includes(texto);

      return coincideCategoria && coincideBusqueda;
    });

    // Ordenar productos.
    switch (ordenar.value) {

      case "nombre":
        lista.sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es")
        );
        break;

      case "precio-asc":
        lista.sort((a, b) =>
          a.precio - b.precio
        );
        break;

      case "precio-desc":
        lista.sort((a, b) =>
          b.precio - a.precio
        );
        break;
    }

    return lista;
  }

  // ==========================================
  // 6. CREAR TARJETAS DE PRODUCTOS
  // ==========================================

  function crearTarjeta(producto) {

    const tarjeta = document.createElement("article");

    tarjeta.className = "producto-card";

    const esFavorito = favoritos.includes(producto.id);

    tarjeta.innerHTML = `
      <div class="producto-imagen">

        <button
          class="favorito ${esFavorito ? "activo" : ""}"
          type="button"
          aria-label="${esFavorito
            ? "Quitar de favoritos"
            : "Agregar a favoritos"}"
          aria-pressed="${esFavorito}"
          data-favorito="${producto.id}"
        >
          ${esFavorito ? "♥" : "♡"}
        </button>

        <span class="producto-emoji" aria-hidden="true">
          ${producto.emoji}
        </span>

      </div>

      <h3 class="producto-nombre"></h3>

      <p class="producto-categoria"></p>

      <p class="producto-precio">
        ${formatoPrecio(producto.precio)}
      </p>

      <button
        class="agregar-carrito"
        type="button"
        data-agregar="${producto.id}"
      >
        <i class="fa-solid fa-cart-shopping"></i>
        Agregar al carrito
      </button>
    `;

    tarjeta.querySelector(".producto-nombre").textContent =
      producto.nombre;

    tarjeta.querySelector(".producto-categoria").textContent =
      producto.categoria;

    return tarjeta;
  }

  // ==========================================
  // 7. MOSTRAR PRODUCTOS Y PAGINACIÓN
  // ==========================================

  function renderizar() {

    const lista = productosFiltrados();

    const paginasTotales = Math.max(
      1,
      Math.ceil(lista.length / POR_PAGINA)
    );

    paginaActual = Math.min(
      paginaActual,
      paginasTotales
    );

    const inicio = (paginaActual - 1) * POR_PAGINA;

    const productosPagina = lista.slice(
      inicio,
      inicio + POR_PAGINA
    );

    grid.replaceChildren(
      ...productosPagina.map(crearTarjeta)
    );

    sinResultados.hidden = lista.length > 0;

    paginacion.replaceChildren();

    if (lista.length === 0) {
      return;
    }

    // Botón anterior.
    paginacion.appendChild(
      crearBotonPagina(
        "‹",
        paginaActual - 1,
        paginaActual === 1,
        "Página anterior"
      )
    );

    // Números de página.
    for (let i = 1; i <= paginasTotales; i++) {

      const boton = crearBotonPagina(
        i,
        i,
        false,
        `Página ${i}`
      );

      if (i === paginaActual) {
        boton.classList.add("activa");
        boton.setAttribute("aria-current", "page");
      }

      paginacion.appendChild(boton);
    }

    // Botón siguiente.
    paginacion.appendChild(
      crearBotonPagina(
        "›",
        paginaActual + 1,
        paginaActual === paginasTotales,
        "Página siguiente"
      )
    );
  }

  function crearBotonPagina(
    texto,
    destino,
    deshabilitado,
    etiqueta
  ) {

    const boton = document.createElement("button");

    boton.type = "button";
    boton.textContent = texto;
    boton.disabled = deshabilitado;

    boton.setAttribute("aria-label", etiqueta);

    boton.dataset.pagina = destino;

    return boton;
  }

  // ==========================================
  // 8. MOSTRAR EL CARRITO
  // ==========================================

  function renderizarCarrito() {

    const totalUnidades = carrito.reduce(
      (suma, item) => suma + item.cantidad,
      0
    );

    // Carrito vacío.
    if (totalUnidades === 0) {

      compraEstado.innerHTML = `
        <span>🐾</span>

        <div>
          <strong>
            Aún no has agregado<br>
            productos a tu carrito.
          </strong>

          <p>
            Explora nuestro catálogo y encuentra
            lo mejor para tu mascota.
          </p>
        </div>
      `;

      return;
    }

    // Resumen del carrito.
    compraEstado.innerHTML = `
      <span>🛒</span>

      <div>
        <strong>
          Tu carrito tiene ${totalUnidades}
          producto${totalUnidades === 1 ? "" : "s"}.
        </strong>

        <p>
          Revisa los artículos antes de continuar
          con tu compra.
        </p>
      </div>
    `;

    const lista = document.createElement("div");

    lista.className = "carrito-lista";

    // Crear cada artículo.
    carrito.forEach(item => {

      const producto = productosBase.find(
        p => p.id === item.id
      );

      if (!producto) {
        return;
      }

      const fila = document.createElement("div");

      fila.className = "carrito-item";

      fila.innerHTML = `
        <span class="carrito-miniatura">
          ${producto.emoji}
        </span>

        <div>
          <strong class="carrito-nombre"></strong>

          <small>
            ${formatoPrecio(producto.precio)} c/u
          </small>

          <div class="carrito-cantidad">

            <button
              type="button"
              data-restar="${producto.id}"
              aria-label="Restar uno"
            >−</button>

            <span>${item.cantidad}</span>

            <button
              type="button"
              data-sumar="${producto.id}"
              aria-label="Sumar uno"
            >+</button>

          </div>
        </div>

        <button
          type="button"
          class="quitar-item"
          data-quitar="${producto.id}"
        >
          Quitar
        </button>
      `;

      fila.querySelector(".carrito-nombre").textContent =
        producto.nombre;

      lista.appendChild(fila);
    });

    // Calcular subtotal.
    const subtotal = carrito.reduce(
      (suma, item) => {

        const producto = productosBase.find(
          p => p.id === item.id
        );

        return suma + (
          producto
            ? producto.precio * item.cantidad
            : 0
        );
      },
      0
    );

    const total = document.createElement("div");

    total.className = "carrito-subtotal";

    total.innerHTML = `
      <span>Subtotal</span>
      <span>${formatoPrecio(subtotal)}</span>
    `;

    // Botón para vaciar el carrito.
    const vaciar = document.createElement("button");

    vaciar.type = "button";
    vaciar.className = "vaciar-carrito";
    vaciar.id = "vaciarCarrito";
    vaciar.textContent = "Vaciar carrito";

    // Botón para continuar.
    const finalizar = document.createElement("button");

    finalizar.type = "button";
    finalizar.className = "finalizar-compra";
    finalizar.id = "finalizarCompra";
    finalizar.textContent = "Continuar compra";

    // Mostrar resumen.
    compraEstado.after(
      lista,
      total,
      vaciar,
      finalizar
    );
  }

  // Eliminar el resumen anterior antes de actualizarlo.
  function actualizarCarrito() {

    document.querySelectorAll(
      ".carrito-lista, .carrito-subtotal, " +
      ".vaciar-carrito, .finalizar-compra"
    ).forEach(elemento => elemento.remove());

    renderizarCarrito();
  }

  // ==========================================
  // 9. AGREGAR PRODUCTOS AL CARRITO
  // ==========================================

  function agregarAlCarrito(id) {

    const producto = productosBase.find(
      p => p.id === id
    );

    if (!producto) {
      return;
    }

    const existente = carrito.find(
      item => item.id === id
    );

    if (existente) {

      existente.cantidad++;

    } else {

      carrito.push({
        id: id,
        cantidad: 1
      });
    }

    guardarStorage();
    actualizarCarrito();
  }

  // ==========================================
  // 10. FAVORITOS Y BOTONES DE PRODUCTOS
  // ==========================================

  grid.addEventListener("click", evento => {

    const botonFavorito = evento.target.closest(
      "[data-favorito]"
    );

    const botonAgregar = evento.target.closest(
      "[data-agregar]"
    );

    // Marcar o desmarcar favorito.
    if (botonFavorito) {

      const id = Number(
        botonFavorito.dataset.favorito
      );

      if (favoritos.includes(id)) {

        favoritos = favoritos.filter(
          favorito => favorito !== id
        );

      } else {

        favoritos.push(id);
      }

      guardarStorage();
      renderizar();
    }

    // Agregar al carrito.
    if (botonAgregar) {

      const id = Number(
        botonAgregar.dataset.agregar
      );

      agregarAlCarrito(id);
    }
  });

  // ==========================================
  // 11. CAMBIAR DE PÁGINA
  // ==========================================

  paginacion.addEventListener("click", evento => {

    const boton = evento.target.closest(
      "[data-pagina]"
    );

    if (!boton || boton.disabled) {
      return;
    }

    paginaActual = Number(
      boton.dataset.pagina
    );

    renderizar();
  });

  // ==========================================
  // 12. FILTRAR POR CATEGORÍA
  // ==========================================

  const categorias = document.querySelector(".categorias");

  if (categorias) {

    categorias.addEventListener("click", evento => {

      const boton = evento.target.closest(
        "[data-categoria]"
      );

      if (!boton) {
        return;
      }

      categoriaActiva = boton.dataset.categoria;

      paginaActual = 1;

      document.querySelectorAll(".categoria").forEach(
        categoria => {

          categoria.classList.toggle(
            "activa",
            categoria === boton
          );
        }
      );

      renderizar();
    });
  }

  // ==========================================
  // 13. BUSCADOR
  // ==========================================

  busqueda.addEventListener("input", () => {

    paginaActual = 1;

    renderizar();
  });

  // ==========================================
  // 14. ORDENAR PRODUCTOS
  // ==========================================

  ordenar.addEventListener("change", () => {

    paginaActual = 1;

    renderizar();
  });

  // ==========================================
  // 15. MODIFICAR CANTIDADES Y ELIMINAR
  // ==========================================

  document.addEventListener("click", evento => {

    const botonSumar = evento.target.closest(
      "[data-sumar]"
    );

    const botonRestar = evento.target.closest(
      "[data-restar]"
    );

    const botonQuitar = evento.target.closest(
      "[data-quitar]"
    );

    // Aumentar cantidad.
    if (botonSumar) {

      const id = Number(botonSumar.dataset.sumar);

      const item = carrito.find(
        producto => producto.id === id
      );

      if (item) {
        item.cantidad++;
      }
    }

    // Disminuir cantidad.
    if (botonRestar) {

      const id = Number(botonRestar.dataset.restar);

      const item = carrito.find(
        producto => producto.id === id
      );

      if (item) {
        item.cantidad--;
      }

      // Eliminar artículos con cantidad cero.
      carrito = carrito.filter(
        producto => producto.cantidad > 0
      );
    }

    // Eliminar un producto.
    if (botonQuitar) {

      const id = Number(botonQuitar.dataset.quitar);

      carrito = carrito.filter(
        producto => producto.id !== id
      );
    }

    if (botonSumar || botonRestar || botonQuitar) {

      guardarStorage();

      actualizarCarrito();
    }

    // Vaciar carrito.
    if (evento.target.closest("#vaciarCarrito")) {

      carrito = [];

      guardarStorage();

      actualizarCarrito();
    }

    // Continuar compra.
    if (evento.target.closest("#finalizarCompra")) {

      alert(
        "Tu carrito está listo. " +
        "Para procesar pagos reales, debes conectar " +
        "esta página a un servidor o pasarela de pagos."
      );
    }
  });

  // ==========================================
  // 16. MENÚ RESPONSIVE
  // ==========================================

  const menuToggle = document.getElementById("menuToggle");

  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

      const abierto = mainNav.classList.toggle(
        "menu-abierto"
      );

      menuToggle.setAttribute(
        "aria-expanded",
        String(abierto)
      );
    });
  }

  // ==========================================
  // 17. MENÚS DESPLEGABLES
  // ==========================================

  function configurarDropdown(botonId, menuId) {

    const boton = document.getElementById(botonId);

    const menu = document.getElementById(menuId);

    if (!boton || !menu) {
      return;
    }

    boton.addEventListener("click", evento => {

      evento.stopPropagation();

      const abrir = menu.hidden;

      menu.hidden = !abrir;

      boton.setAttribute(
        "aria-expanded",
        String(abrir)
      );
    });

    document.addEventListener("click", evento => {

      if (
        !boton.contains(evento.target) &&
        !menu.contains(evento.target)
      ) {

        menu.hidden = true;

        boton.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });
  }

  configurarDropdown("masToggle", "masMenu");

  configurarDropdown("perfilToggle", "perfilMenu");

  // ==========================================
  // 18. CERRAR SESIÓN
  // ==========================================

  function cerrarSesion() {

    const confirmar = confirm(
      "¿Estás seguro de que deseas cerrar la sesión?"
    );

    if (confirmar) {

      window.location.href = "index.html";
    }
  }

  const cerrarSesionBoton =
    document.getElementById("cerrarSesion");

  const cerrarSesionFooter =
    document.getElementById("cerrarSesionFooter");

  if (cerrarSesionBoton) {

    cerrarSesionBoton.addEventListener(
      "click",
      cerrarSesion
    );
  }

  if (cerrarSesionFooter) {

    cerrarSesionFooter.addEventListener(
      "click",
      cerrarSesion
    );
  }

  // ==========================================
  // 19. INICIALIZAR LA PÁGINA
  // ==========================================

  renderizar();

  actualizarCarrito();

});