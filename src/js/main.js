//! IMPORTANTE!!!!
// La mezcla de español e ingles es intencional
// Para no mezclar nombres de variables
// que podrían llevar a errores o confusiones

// Array de objetos de productos
// Cada objeto tiene un nombre y un precio
//* Tengo preparado un json con los productos, pero por ahora lo haré así
//* para no complicarme con el fetch
const listaProductos = [
	{
		nombre: "Auriculares Bluetooth",
		image: "auriculares-bt.jpg",
		precio: 15000,
	},
	{
		nombre: "Mouse Gamer",
		image: "mouse-gamer.jpeg",
		precio: 8000,
	},
	{
		nombre: "Teclado Mecánico",
		image: "teclado-mecanico.jpeg",
		precio: 12000,
	},
	{
		nombre: "Monitor 24 pulgadas",
		image: "monitor-24.jpeg",
		precio: 60000,
	},
	{
		nombre: "Silla Ergonómica",
		image: "silla-ergonomica.jpeg",
		precio: 45000,
	},
	{
		nombre: "Notebook 14''",
		image: "notebook-14.jpeg",
		precio: 220000,
	},
	{
		nombre: "Webcam HD",
		image: "webcam-hd.jpeg",
		precio: 10000,
	},
	{
		nombre: "Parlantes Estéreo",
		image: "parlantes-estereo.jpeg",
		precio: 7000,
	},
	{
		nombre: "Disco SSD 512GB",
		image: "disco-ssd-512gb.jpeg",
		precio: 30000,
	},
	{
		nombre: "Cargador USB-C",
		image: "cargador-usb-c.jpeg",
		precio: 5000,
	},
];

// Array para almacenar los productos del carrito
// Inicialmente está vacío
let storedCartProducto = localStorage.getItem("cart");
let listaCarrito = storedCartProducto ? JSON.parse(storedCartProducto) : [];

// Agregar un producto al carrito
//* Tendría que manejarme por ID pero como me di cuenta tarde
//* lo hago por nombre, no es lo mejor pero funciona
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

// Actualiza el badge del carrito con la cantidad de productos
function actualizarBadgeCarrito(lcart) {
	let cartBadge = document.getElementById("cart-badge");

	if (lcart.length > 0) {
		cartBadge.style.display = "flex";
		cartBadge.innerHTML = lcart.reduce(
			(total, item) => total + item.cantidad,
			0
		);
	} else {
		cartBadge.style.display = "none";
		cartBadge.innerHTML = "0";
	}
}

// Mostrar una notificación al usuario cuando un producto es agregado al carrito
// Aplica un efecto de fade-in al aparecer y fade-out al desaparecer
// La notificación se muestra por 5 segundos
let ocultarNotificacionTimeOut;
let ocultarTotalTimeOut;

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

// Renderiza los productos en el DOM
// Crea elementos HTML para cada producto y los agrega al contenedor de productos
function renderizarProductos() {
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
