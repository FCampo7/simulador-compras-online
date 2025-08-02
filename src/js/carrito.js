//! IMPORTANTE!!!!
// La mezcla de español e ingles es intencional
// Para no mezclar nombres de variables como cantidad y quantity
// que podrían llevar a errores o confusiones

let cartList = document.getElementById("cart-list");
let storedCart = localStorage.getItem("cart");

let cartItems = storedCart ? JSON.parse(storedCart) : [];

// Eliminar un producto del carrito
// Busca el producto en el carrito y lo elimina si existe
function eliminarDelCarrito(producto) {
	const index = cartItems.indexOf(producto);

	if (index > -1) {
		if (cartItems[index].cantidad > 1) {
			cartItems[index].cantidad -= 1; // Reduce la cantidad si es mayor a 1
		} else {
			// Si la cantidad es 1, elimina el producto del carrito
			cartItems.splice(index, 1);
		}
	}
}

// Calcular el total del carrito
// Suma los precios de todos los productos en el carrito
function calcularTotal() {
	let total = 0;

	cartItems.forEach((producto) => {
		total += producto.precio * producto.cantidad;
	});

	return total;
}

// Actualizar el total en el DOM
function actualizarTotal() {
	let totalContainer = document.querySelector(".total-container");
	totalContainer.innerHTML = "<h3>Detalle del pedido</h3>";

	// Crea un contenedor para los productos
	let totalItems = document.createElement("div");
	totalItems.className = "total-items";
	totalItems.innerHTML = "<p>";
	cartItems.forEach((element) => {
		totalItems.innerHTML += `${element.cantidad} x ${
			element.nombre
		} - $${element.precio.toFixed(2)}<br>`;
	});
	totalItems.innerHTML += "</p>";

	// Agrega el contenedor de productos al totalContainer
	totalContainer.appendChild(totalItems);
	totalContainer.innerHTML += `<p class="total">Total: $${calcularTotal().toFixed(
		2
	)}</p>`;
	if (cartItems.length === 0) {
		cartList.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
	}
}

function guardarCarrito() {
	localStorage.setItem("cart", JSON.stringify(cartItems));
	actualizarTotal();
}

// Renderiza los productos en el carrito
// Crea elementos HTML para cada producto en el carrito y los agrega al DOM
//? Me quedó una función muy grande
//? Pero no se si vale la pena dividirla
function renderizarCarrito() {
	cartItems.forEach((item) => {
		let cartItemElement = document.createElement("div");

		cartItemElement.className = "product";
		cartItemElement.innerHTML = `
			<div class="image-container">
				<img
					src="../src/images/${item.image}"
					alt="${item.nombre}"
				/>
			</div>
			<h3>${item.nombre}</h3>
			<p>$${item.precio.toFixed(2)}</p>
			<div class="buttons-controller">
				<button class="decrease-quantity"><i class="fas fa-minus"></i></button>
				<input
					type="number"
					value="${item.cantidad}"
					min="1"
					class="quantity-input"
				/>
				<button class="increase-quantity"><i class="fas fa-plus"></i></button>
			</div>
			<button class="remove-from-cart"><i class="fas fa-trash"></i></button>
		`;
		cartList.appendChild(cartItemElement);

		// Agrega eventos a los botones de cada producto en el carrito
		// Permite aumentar, disminuir la cantidad o eliminar el producto del carrito
		let decreaseButton =
			cartItemElement.querySelector(".decrease-quantity");
		let increaseButton =
			cartItemElement.querySelector(".increase-quantity");
		let quantityInput = cartItemElement.querySelector(".quantity-input");
		let removeButton = cartItemElement.querySelector(".remove-from-cart");

		decreaseButton.addEventListener("click", () => {
			let quantity = parseInt(quantityInput.value);
			if (quantity > 1) {
				quantityInput.value = quantity - 1;
				item.cantidad -= 1;
			} else {
				cartList.removeChild(cartItemElement);
				item.cantidad = 0;
				eliminarDelCarrito(item);
			}
			guardarCarrito();
		});

		increaseButton.addEventListener("click", () => {
			let quantity = parseInt(quantityInput.value);
			quantityInput.value = quantity + 1;
			item.cantidad += 1;
			guardarCarrito();
		});

		removeButton.addEventListener("click", () => {
			cartList.removeChild(cartItemElement);
			item.cantidad = 0;
			eliminarDelCarrito(item);
			guardarCarrito();
		});

		quantityInput.addEventListener("change", () => {
			let quantity = parseInt(quantityInput.value);
			if (quantity < 1) {
				quantityInput.value = 1;
				item.cantidad = 1;
			} else {
				item.cantidad = quantity;
			}
			guardarCarrito();
		});
	});

	actualizarTotal();
}

renderizarCarrito();
