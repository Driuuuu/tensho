const actualizarBadgeCarrito = () => {
  const badge = document.getElementById("carrito-badge");
  if (!badge) return;

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "inline-block" : "none";
};

// Ejecutar cuando carga la página
document.addEventListener("DOMContentLoaded", actualizarBadgeCarrito);

// Global
window.actualizarBadgeCarrito = actualizarBadgeCarrito;
