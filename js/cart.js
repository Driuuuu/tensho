const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const contenedor = document.getElementById("carrito-contenido");
const badge = document.getElementById("carrito-badge");

const renderizarCarrito = () => {
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = `<p class="text">El carrito está vacío.</p>`;
    actualizarBadge();
    return;
  }

  carrito.forEach((producto, index) => {
    const total = producto.precio * producto.cantidad;

    const item = document.createElement("div");
    item.className = "col-12 mb-4";
    item.innerHTML = `
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-2 overflow-hidden">
            <img src="../images/${
              producto.imagen
            }" class="img-fluid rounded-start" alt="${producto.nombre}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p><span class="fw-bold">Precio:</span> $${producto.precio.toLocaleString(
                "es-CL"
              )}</p>
               <p class="mb-3"><span class="fw-bold">Total:</span> $${total.toLocaleString(
                 "es-CL"
               )}</p>

              <div class="input-group mb-2 w-50">
                <button class="btn btn-outline-secondary btn-sm restar" data-index="${index}">-</button>
                <input type="text" class="form-control form-control-sm text-center" value="${
                  producto.cantidad
                }" readonly>
                <button class="btn btn-outline-secondary btn-sm sumar" data-index="${index}">+</button>
              </div>
              <button class="btn btn-danger btn-sm eliminar w-50" data-index="${index}">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(item);
  });

  sumarItems();
  eliminarProducto();
  actualizarBadge();
};

const sumarItems = () => {
  document.querySelectorAll(".sumar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      if (carrito[index].cantidad < carrito[index].stock) {
        carrito[index].cantidad++;
        guardarYActualizar();
      } else {
        Swal.fire({
          icon: "warning",
          title: "Stock máximo alcanzado",
          text: "No hay más stock disponible de este producto.",
        });
      }
    });
  });

  document.querySelectorAll(".restar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        guardarYActualizar();
      } else {
        Swal.fire({
          title: "¿Eliminar producto?",
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            carrito.splice(index, 1);
            guardarYActualizar();
            Swal.fire({
              title: "Eliminado",
              text: "El producto fue eliminado del carrito.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      }
    });
  });
};

const eliminarProducto = () => {
  document.querySelectorAll(".eliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      Swal.fire({
        title: "¿Eliminar producto?",
        text: "¿Estás seguro de eliminar este producto del carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          carrito.splice(index, 1);
          guardarYActualizar();
          Swal.fire({
            title: "Eliminado",
            text: "El producto fue eliminado.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    });
  });
};

const actualizarBadge = () => {
  if (!badge) return;
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "inline-block" : "none";
};

const guardarYActualizar = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
};

document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
});
