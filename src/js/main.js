//! IMPORTANTE!!!!
// La mezcla de español e ingles es intencional
// Para no mezclar nombres de variables
// que podrían llevar a errores o confusiones

/**
 * @typedef {Object} Producto
 * @property {string} nombre - Nombre del producto
 * @property {number} precio - Precio del producto
 * @property {string} image - Ruta de la imagen del producto
 * @property {number} [cantidad] - Cantidad de este producto (en el carrito)
 */

/**
 * Array de objetos de productos disponibles en la tienda.
 * Cada objeto debe incluir nombre, precio e imagen.
 * @type {Producto[]}
 */
let listaProductos = [];

/**
 * Carga los productos desde un archivo JSON.
 *
 * @async
 * @returns {Promise<Producto[]>} Una promesa que se resuelve con la lista de productos.
 * @throws {Error} Si ocurre un error al obtener los productos desde el servidor.
 */
async function cargarProductos() {
	const response = await fetch("./src/json/productos.json");
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
}

/**
 * Array para almacenar los productos del carrito.
 * Inicialmente se carga desde localStorage (si existe).
 *
 * @type {Producto[]}
 */
let storedCartProducto = localStorage.getItem("cart");
let listaCarrito = storedCartProducto ? JSON.parse(storedCartProducto) : [];

//* Tendría que manejarme por ID pero como me di cuenta tarde
//* lo hago por nombre, no es lo mejor pero funciona
/**
 * Agrega un producto al carrito.
 *
 * Si el producto ya existe en el carrito, incrementa su cantidad.
 * De lo contrario, lo agrega con cantidad inicial 1.
 *
 * @param {Producto} producto - Producto a agregar al carrito.
 * @returns {void}
 */
function agregarAlCarrito(producto) {
	const copiaProducto = { ...producto }; // Crea una copia del producto para evitar mutaciones, Lo busque en internet

	const index = listaCarrito.findIndex(
		(item) => item.nombre === copiaProducto.nombre
	);
	if (index > -1) {
		listaCarrito[index].cantidad += 1;
	} else {
		copiaProducto.cantidad = 1; // Inicializa la cantidad del producto
		listaCarrito.push(copiaProducto);
	}
	localStorage.setItem("cart", JSON.stringify(listaCarrito));
}

/**
 * Actualiza el badge del carrito con la cantidad de productos.
 *
 * @param {Producto[]} lcart - Carrito del que se quiere actualizar el badge.
 * @returns {void}
 */
function actualizarBadgeCarrito(lcart) {
	let cartBadge = document.getElementById("cart-badge");

	if (lcart.length > 0) {
		cartBadge.style.display = "flex";
		cartBadge.innerHTML = lcart.length;
	} else {
		cartBadge.style.display = "none";
		cartBadge.innerHTML = "0";
	}
}

/**
 * Timeout para ocultar la notificación de producto agregado.
 * @type {number|undefined}
 */
let ocultarNotificacionTimeOut;

/**
 * Timeout para ocultar completamente la notificación después del fade-out.
 * @type {number|undefined}
 */
let ocultarTotalTimeOut;

/**
 * Muestra una notificación al usuario cuando un producto es agregado al carrito.
 *
 * La notificación aparece con un efecto de fade-in,
 * permanece visible durante 4 segundos y luego desaparece con fade-out.
 *
 * @param {Producto} producto - El producto que se ha agregado al carrito.
 * @returns {void}
 */
function mostrarNotificacion(producto) {
	let notification = document.getElementsByClassName("notification");

	if (!notification[0]) return;

	clearTimeout(ocultarNotificacionTimeOut);
	clearTimeout(ocultarTotalTimeOut);

	notification[0].innerHTML = `<p>${producto.nombre} agregado al carrito</p>`;

	notification[0].style.visibility = "visible";
	notification[0].classList.remove("fade-out");
	notification[0].classList.add("fade-in");

	ocultarNotificacionTimeOut = setTimeout(() => {
		notification[0].classList.remove("fade-in");
		notification[0].classList.add("fade-out");
		ocultarTotalTimeOut = setTimeout(() => {
			notification[0].style.visibility = "hidden";
		}, 1000);
	}, 4000);
}

/**
 * Renderiza los productos en el DOM.
 *
 * Crea elementos HTML para cada producto y los agrega al contenedor de productos.
 * También añade eventos para permitir al usuario agregarlos al carrito.
 *
 * @async
 * @returns {Promise<void>}
 */
async function renderizarProductos() {
	// Espera a que se carguen los productos antes de renderizar
	try {
		listaProductos = await cargarProductos();
	} catch (error) {
		console.error("Error al cargar los productos:", error);
		return;
	}

	let productList = document.getElementById("product-list");
	productList.innerHTML = ""; // Limpia el contenedor antes de renderizar
	listaProductos.forEach((producto) => {
		let productElement = document.createElement("div");
		productElement.className = "product";
		productElement.innerHTML = `
				<div class="image-container">
					<img src="./src/images/${producto.image}" alt="${producto.nombre}" />
				</div>
				<h3>${producto.nombre}</h3>
				<p>$${producto.precio}</p>
				<button class="add-to-cart"><i class="fa-solid fa-cart-plus"></i></button>
			`;
		productList.appendChild(productElement);

		let addToCartButton = productElement.querySelector(".add-to-cart");

		addToCartButton.addEventListener("click", () => {
			agregarAlCarrito(producto);
			mostrarNotificacion(producto);
			actualizarBadgeCarrito(listaCarrito);
		});
	});
	actualizarBadgeCarrito(listaCarrito);
}

// Inicializa la carga de productos al cargar la página
renderizarProductos();
