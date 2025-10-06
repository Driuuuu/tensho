const contenedor = document.getElementById("lista-productos");

let todosLosProductos = [];

const obtenerProductos = async () => {
  try {
    const respuesta = await fetch("../js/store.json");
    const productos = await respuesta.json();
    todosLosProductos = productos;
    renderizarProductos(productos);
    generarFiltrosCategoria(productos);
    agregarCheckboxCategoria();
  } catch (error) {
    contenedor.innerHTML = `<p class="text">Error al cargar los productos.</p>`;
    console.error("Error:", error);
  }
};

const renderizarProductos = (productos) => {
  contenedor.innerHTML = "";

  if (productos.length === 0) {
    contenedor.innerHTML = `<p class="text">No se encontraron productos.</p>`;
    return;
  }

  productos.forEach((producto) => {
    contenedor.innerHTML += `
      <div class="col-12 col-md-6 mb-4">
        <div class="box-product card h-100">
          <img src="../images/${producto.imagen}" class="card-img-top" alt="${
      producto.nombre
    }">
          <div class="card-body">
            <h5 class="card-title fw-bold">${producto.nombre}</h5>
            <p class="card-text mb-3">${producto.descripcion}</p>
            <h3 class="fw-bold">$${producto.precio.toLocaleString("es-CL")}</h3>
            <p><small>Stock: ${producto.stock}</small></p>

            <div class="input-group mb-2">
              <button class="btn btn-outline-secondary restar-cantidad" data-id="${
                producto.id
              }">-</button>
              <input type="number" class="form-control cantidad-input" id="cantidad-${
                producto.id
              }" value="1" min="1" max="${producto.stock}" readonly>
              <button class="btn btn-outline-secondary sumar-cantidad" data-id="${
                producto.id
              }">+</button>
            </div>

            <button class="btn w-100 agregar-carrito" data-id="${
              producto.id
            }">Agregar al carrito</button>
          </div>
        </div>
      </div>
    `;
  });

  contador();
  agregarItemCarrito();
};

const generarFiltrosCategoria = (productos) => {
  const contenedor = document.getElementById("filtro-categorias");
  const categoriasUnicas = [
    ...new Set(productos.map((p) => p.categoria.toLowerCase())),
  ];

  contenedor.innerHTML = "";
  console.log(categoriasUnicas);

  categoriasUnicas.forEach((cat, i) => {
    const capitalizado = cat.charAt(0).toUpperCase() + cat.slice(1);

    contenedor.innerHTML += `
      <div class="form-check">
        <input
          class="form-check-input filtro-categoria"
          type="checkbox"
          value="${cat}"
          id="categoria-${i}"
        />
        <label class="form-check-label" for="categoria-${i}">
          ${capitalizado}
        </label>
      </div>
    `;
  });
};

const agregarCheckboxCategoria = () => {
  const checkboxesCategoria = document.querySelectorAll(".filtro-categoria");
  const checkboxesPrecio = document.querySelectorAll(
    ".precios .form-check-input"
  );

  checkboxesCategoria.forEach((cb) => {
    cb.addEventListener("change", filtrarProductos);
  });

  checkboxesPrecio.forEach((cb) => {
    cb.addEventListener("change", filtrarProductos);
  });
};

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contador = () => {
  document.querySelectorAll(".sumar-cantidad").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const input = document.getElementById(`cantidad-${id}`);
      const max = parseInt(input.getAttribute("max"));
      let cantidad = parseInt(input.value);
      if (cantidad < max) input.value = cantidad + 1;
    });
  });

  document.querySelectorAll(".restar-cantidad").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const input = document.getElementById(`cantidad-${id}`);
      let cantidad = parseInt(input.value);
      if (cantidad > 1) input.value = cantidad - 1;
    });
  });
};

const abrirOffcanvas = () => {
  const offcanvasElement = document.getElementById("carritoOffcanvas");
  const offcanvasInstance =
    bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
  offcanvasInstance.show();
};

const agregarItemCarrito = () => {
  document.querySelectorAll(".agregar-carrito").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const inputCantidad = document.getElementById(`cantidad-${id}`);
      const cantidad = parseInt(inputCantidad.value);

      const producto = todosLosProductos.find((p) => p.id === id);
      if (!producto) return;

      const existente = carrito.find((item) => item.id === id);

      if (existente) {
        if (existente.cantidad + cantidad <= producto.stock) {
          existente.cantidad += cantidad;
        } else {
          Swal.fire({
            icon: "warning",
            title: "Stock máximo alcanzado",
            text: "No puedes agregar más de este producto.",
          });
        }
      } else {
        carrito.push({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          stock: producto.stock,
          cantidad: cantidad,
        });
        Swal.fire({
          icon: "success",
          title: "Producto agregado al carrito",
          showConfirmButton: false,
          timer: 1200,
        });
      }

      actualizarCarrito();
      abrirOffcanvas();
    });
  });
};

const actualizarCarrito = () => {
  const carritoLista = document.getElementById("carrito-lista");
  const totalCantidad = document.getElementById("total-cantidad");
  const totalPrecio = document.getElementById("total-precio");

  carritoLista.innerHTML = "";

  let totalItems = 0;
  let totalPagar = 0;

  carrito.forEach((item) => {
    totalItems += item.cantidad;
    totalPagar += item.precio * item.cantidad;
    carritoLista.innerHTML += `
      <div class="card mb-2">
        <div class="card-body d-flex flex-column justify-content-between ">
          <div class="d-flex">
            <img src="../images/${
              item.imagen
            }" width="50" height="50" class="me-2">
            <div>
            <p class="fw-bold">${item.nombre}</p>
            <h5 class="card-text fw-bold mb-3">$${item.precio.toLocaleString(
              "es-CL"
            )} c/u</h5>
            </div>
          </div>
          <div class="input-group mb-3">
            <button class="btn btn-outline-secondary btn-sm restar-cantidad-carrito" data-id="${
              item.id
            }">-</button>
            <input type="text" class="form-control form-control-sm text-center" value="${
              item.cantidad
            }" readonly>
            <button class="btn btn-outline-secondary btn-sm sumar-cantidad-carrito" data-id="${
              item.id
            }">+</button>
          </div>
          <button class="btn btn-sm btn-danger eliminar-item" data-id="${
            item.id
          }"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `;
  });

  totalCantidad.textContent = totalItems;
  totalPrecio.textContent = "$" + totalPagar.toLocaleString("es-CL");
  localStorage.setItem("carrito", JSON.stringify(carrito));

  if (window.actualizarBadgeCarrito) {
    window.actualizarBadgeCarrito();
  }

  agregarEventosOffcanvas();
};

const agregarEventosOffcanvas = () => {
  // Aumentar cantidad
  document.querySelectorAll(".sumar-cantidad-carrito").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = carrito.find((p) => p.id === id);
      if (item && item.cantidad < item.stock) {
        item.cantidad++;
        actualizarCarrito();
      }
    });
  });

  // Disminuir cantidad
  document.querySelectorAll(".restar-cantidad-carrito").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = carrito.find((p) => p.id === id);
      if (item && item.cantidad > 1) {
        item.cantidad--;
        actualizarCarrito();
      }
    });
  });

  // Eliminar producto
  document.querySelectorAll(".eliminar-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);

      Swal.fire({
        title: "¿Eliminar producto?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          carrito = carrito.filter((p) => p.id !== id);
          actualizarCarrito();
          Swal.fire({
            title: "Eliminado",
            text: "El producto fue eliminado del carrito.",
            icon: "success",
            timer: 1200,
            showConfirmButton: false,
          });
        }
      });
    });
  });
};

const filtrarProductos = () => {
  const seleccionCategorias = Array.from(
    document.querySelectorAll(".filtro-categoria:checked")
  ).map((cb) => cb.value.toLowerCase());
  const seleccionPrecios = Array.from(
    document.querySelectorAll(".precios .form-check-input:checked")
  ).map((cb) => cb.value);

  let filtrados = [...todosLosProductos];

  // Filtro por categoría
  if (seleccionCategorias.length > 0) {
    filtrados = filtrados.filter((p) =>
      seleccionCategorias.includes(p.categoria.toLowerCase())
    );
  }

  // Filtro por precio
  if (seleccionPrecios.length > 0) {
    filtrados = filtrados.filter((p) => {
      return seleccionPrecios.some((rango) => {
        const precio = p.precio;

        switch (rango) {
          case "1":
            return precio <= 10000;
          case "2":
            return precio > 10000 && precio <= 30000;
          case "3":
            return precio > 30000 && precio <= 50000;
          case "4":
            return precio > 50000;
          default:
            return true;
        }
      });
    });
  }

  renderizarProductos(filtrados);
};

document.addEventListener("DOMContentLoaded", () => {
  obtenerProductos();

  const checkboxes = document.querySelectorAll(".form-check-input");
  checkboxes.forEach((check) => {
    check.addEventListener("change", filtrarProductos);
  });
});
