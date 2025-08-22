//! IMPORTANTE!!!!
// La mezcla de español e ingles es intencional
// Para no mezclar nombres de variables como cantidad y quantity
// que podrían llevar a errores o confusiones

let cartList = document.getElementById("cart-list");
let storedCart = localStorage.getItem("cart");

/**
 * Lista de productos en el carrito.
 * Se inicializa desde localStorage si existe,
 * de lo contrario empieza vacío.
 * @type {Array<{nombre: string, precio: number, cantidad: number, image: string}>}
 */
let cartItems = storedCart ? JSON.parse(storedCart) : [];

/**
 * Elimina un producto del carrito o reduce su cantidad.
 *
 * @param {{nombre: string, precio: number, cantidad: number, image: string}} producto - Producto a eliminar o reducir.
 */
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

/**
 * Calcula el total del carrito sumando precios * cantidades.
 *
 * @returns {number} Total del carrito en dinero.
 */
function calcularTotal() {
	let total = 0;

	cartItems.forEach((producto) => {
		total += producto.precio * producto.cantidad;
	});

	return total;
}

function sweetAlertFinalizarCompra() {
	Swal.fire({
		title: "Datos de la tarjeta",
		text: "Sistema de pagos aún no implementado",
		html: `<input placeholder='Titular de la tarjeta' id='swal-input-nombre' class='swal2-input'>
			<input type="text" placeholder='Número de tarjeta' id='swal-input-numero' class='swal2-input'>
			<div class="swal2-input-container">
				<input type='number' min=1 max=12 placeholder='MM' id='swal-input-month' class='swal2-input'>
				<input type='number' min=1920 max=2050 placeholder='AAAA' id='swal-input-year' class='swal2-input'>
				<input type="number" min=0 max=999 placeholder='CVV' id='swal-input-cvv' class='swal2-input'>
			</div>`,
		confirmButtonText: "Ok",
		focusConfirm: false,
		didOpen: () => {
			const numeroInput = document.getElementById("swal-input-numero");

			const monthInput = document.getElementById("swal-input-month");

			monthInput.addEventListener("change", () => {
				let value = monthInput.value.replace(/\D/g, ""); // eliminar todo lo que no sea número
				value = value.substring(0, 2); // máximo 2 dígitos
				if (value.length === 1) {
					value = "0" + value; // agregar un 0 al principio si es necesario
				}
				if (value <= 0) {
					value = "01"; // si el valor es menor o igual a 0, establecerlo en 01
				}
				monthInput.value = value;
			});
			//Separa el numero de la tarjeta de crédito cada 4 dígitos
			numeroInput.addEventListener("input", () => {
				let value = numeroInput.value.replace(/\D/g, ""); // eliminar todo lo que no sea número
				value = value.substring(0, 16); // máximo 16 dígitos
				numeroInput.value = value.replace(/(.{4})/g, "$1 ").trim(); // separar cada 4 dígitos
			});
		},
		preConfirm: () => {
			const nombre = document
				.getElementById("swal-input-nombre")
				.value.trim();
			const numero = document
				.getElementById("swal-input-numero")
				.value.trim();
			const month = document
				.getElementById("swal-input-month")
				.value.trim();
			const year = document
				.getElementById("swal-input-year")
				.value.trim();
			const cvv = document.getElementById("swal-input-cvv").value.trim();

			// Validaciones
			if (!nombre) {
				Swal.showValidationMessage("El nombre es obligatorio");
				return false;
			}

			if (!numero || numero.length < 13 || numero.length > 19) {
				Swal.showValidationMessage(
					"Número de tarjeta inválido (13-19 dígitos)"
				);
				return false;
			}

			if (
				!month ||
				month < 1 ||
				month > 12 ||
				(month < new Date().getMonth() + 1 &&
					year == new Date().getFullYear())
			) {
				Swal.showValidationMessage("Mes inválido (1-12)");
				return false;
			}

			if (!year || year < new Date().getFullYear()) {
				Swal.showValidationMessage("Año inválido");
				return false;
			}

			if (!cvv || cvv.length < 3 || cvv.length > 4) {
				Swal.showValidationMessage("CVV inválido (3-4 dígitos)");
				return false;
			}

			return { nombre, numero, month, year, cvv };
		},
	}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
				title: `Felicidades ${result.value.nombre}`,
				icon: "success",
				text: `Su compra fue confirmada`,
			});
		}
	});
}

/**
 * Actualiza en el DOM la visualización del total del carrito
 * y muestra el detalle de cada producto.
 *
 * Si el carrito está vacío, muestra un mensaje indicándolo.
 */
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
	)}</p>
	<button class="btn-finalizar">Finalizar compra</button>`;

	const btnFinalizar = document.querySelector(".btn-finalizar");

	btnFinalizar.addEventListener("click", () => {
		sweetAlertFinalizarCompra();
	});

	if (cartItems.length === 0) {
		cartList.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
	}
}

/**
 * Guarda el carrito en localStorage y actualiza
 * la interfaz gráfica.
 */
function guardarCarrito() {
	localStorage.setItem("cart", JSON.stringify(cartItems));
	actualizarTotal();
	actualizarBadgeCarrito(cartItems);
}

/**
 * Renderiza los productos del carrito en el DOM.
 *
 * Crea elementos HTML para cada producto y agrega
 * eventos para modificar cantidades o eliminar productos.
 *
 * @todo Evaluar si conviene dividir esta función en funciones más pequeñas.
 */
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
			if (quantity < 1 || isNaN(quantity)) {
				quantityInput.value = 1;
				item.cantidad = 1;
			} else {
				item.cantidad = quantity;
			}
			guardarCarrito();
		});
	});

	actualizarTotal();
	actualizarBadgeCarrito(cartItems);
}

renderizarCarrito();
