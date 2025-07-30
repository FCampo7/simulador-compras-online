// Array de objetos de productos
// Cada objeto tiene un nombre y un precio
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
const listaCarrito = [];

listaCarrito.push(...(JSON.parse(localStorage.getItem("carrito")) || []));

// Funciones para manejar el carrito de compras

// Agregar un producto al carrito
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
}

let productList = document.getElementById("product-list");

listaProductos.forEach((producto) => {
	let productElement = document.createElement("div");
	productElement.className = "product";
	productElement.innerHTML = `
			<div class="image-container">
				<img src="../src/images/${producto.image}" alt="${producto.nombre}" />
			</div>
			<h3>${producto.nombre}</h3>
			<p>Precio: $${producto.precio}</p>
			<button class="add-to-cart">Agregar al carrito</button>
		`;
	productList.appendChild(productElement);

	let addToCartButton = productElement.querySelector(".add-to-cart");

	addToCartButton.addEventListener("click", () => {
		agregarAlCarrito(producto);
		localStorage.setItem("carrito", JSON.stringify(listaCarrito));
		let notification = document.getElementsByClassName("notification");
		notification[0].style.visibility = "visible";
		setTimeout(() => {
			let notification =
				document.getElementsByClassName("notification")[0];
			notification.style.visibility = "hidden";
		}, 5000);
	});
});
