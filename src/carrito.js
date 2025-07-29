let cartList = document.getElementById("cart-list");
let storedCart = localStorage.getItem("carrito");

if (storedCart) {
	listaCarrito.push(...JSON.parse(storedCart));
}
listaCarrito.forEach((producto) => {
	let cartElement = document.createElement("div");
	cartElement.className = "product";
	cartElement.innerHTML = `
            <div class="image-container">
                <img src="../src/images/${producto.image}" alt="${producto.nombre}" />
            </div>
			<h3>${producto.nombre}</h3>
			<p>Precio: $${producto.precio}</p>
			<p>Cantidad: ${producto.cantidad}</p>
			<button class="remove-from-cart">Eliminar</button>
		`;
	cartList.appendChild(cartElement);

	let removeFromCartButton = cartElement.querySelector(".remove-from-cart");
	removeFromCartButton.addEventListener("click", () => {
		eliminarDelCarrito(producto);
		alert(`${producto.nombre} eliminado del carrito.`);
		cartList.removeChild(cartElement);
		localStorage.setItem("carrito", JSON.stringify(listaCarrito));
	});
});
