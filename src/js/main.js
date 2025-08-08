//! IMPORTANTE!!!!
// La mezcla de español e ingles es intencional
// Para no mezclar nombres de variables
// que podrían llevar a errores o confusiones

// Array de objetos de productos
// Cada objeto tiene un nombre y un precio
let listaProductos = [];

// Promesa para cargar los productos desde un archivo JSON
// Utiliza fetch para obtener los datos y los resuelve o rechaza según el resultado
const cargarProductos = new Promise((resolve, reject) => {
	fetch("../src/json/productos.json")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			resolve(data);
		})
		.catch((error) => {
			reject(error);
		});
});
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
		cartBadge.innerHTML = lcart.length;
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
async function renderizarProductos() {
	// Espera a que se carguen los productos antes de renderizar
	await cargarProductos
		.then((data) => {
			listaProductos = data;
		})
		.catch((error) => {
			console.error("Error al cargar los productos:", error);
		});

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
