// Array de objetos de productos
// Cada objeto tiene un nombre y un precio
const listaProductos = [
	{ nombre: "Auriculares Bluetooth", precio: 15000 },
	{ nombre: "Mouse Gamer", precio: 8000 },
	{ nombre: "Teclado Mecánico", precio: 12000 },
	{ nombre: "Monitor 24 pulgadas", precio: 60000 },
	{ nombre: "Silla Ergonómica", precio: 45000 },
	{ nombre: "Notebook 14''", precio: 220000 },
	{ nombre: "Webcam HD", precio: 10000 },
	{ nombre: "Parlantes Estéreo", precio: 7000 },
	{ nombre: "Disco SSD 512GB", precio: 30000 },
	{ nombre: "Cargador USB-C", precio: 5000 },
];

// Array para almacenar los productos del carrito
// Inicialmente está vacío
const listaCarrito = [];

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

// Eliminar un producto del carrito
// Busca el producto en el carrito y lo elimina si existe
function eliminarDelCarrito(producto) {
	const index = listaCarrito.indexOf(producto);

	if (index > -1) {
		if (listaCarrito[index].cantidad > 1) {
			listaCarrito[index].cantidad -= 1; // Reduce la cantidad si es mayor a 1
		} else {
			// Si la cantidad es 1, elimina el producto del carrito
			listaCarrito.splice(index, 1);
		}
	}
}

// Calcular el total del carrito
// Suma los precios de todos los productos en el carrito
function calcularTotal() {
	let total = 0;

	listaCarrito.forEach((producto) => {
		total += producto.precio * producto.cantidad;
	});

	return total;
}

// Devuelve un string con el contenido del carrito
function devolverCarrito() {
	let mensaje = "";

	if (listaCarrito.length === 0) {
		mensaje = "El carrito está vacío.";
	} else {
		listaCarrito.forEach((producto, index) => {
			mensaje +=
				index +
				1 +
				". " +
				producto.nombre +
				" - $" +
				producto.precio +
				" - Cantidad: " +
				producto.cantidad +
				"\n";
		});
	}

	return mensaje;
}

// Devuelve un string con la lista de productos disponibles
// Cada producto se muestra con un indice, nombre y precio
function devolverProductos() {
	let mensaje = "Productos disponibles:\n";

	listaProductos.forEach((producto, index) => {
		mensaje +=
			index +
			1 +
			". " +
			producto.nombre +
			" - $" +
			producto.precio +
			"\n";
	});

	return mensaje;
}

// Función principal que simula la compra
// Permite al usuario agregar productos al carrito, eliminarlos y ver el total
function simulador() {
	alert("Bienvenido al simulador de compras");

	// Sección de adición de productos al carrito
	// Muestra la lista de productos y permite al usuario agregar productos al carrito
	let index_producto;

	do {
		index_producto = prompt(
			devolverProductos() +
				"\nIngrese el número del producto que desea agregar al carrito (0 para terminar el ingreso):"
		);

		if (index_producto !== "0") {
			const producto = listaProductos[index_producto - 1];

			if (producto) {
				agregarAlCarrito(producto);
				alert("Agregado al carrito: " + producto.nombre);
			} else {
				alert("Producto no encontrado.");
			}
		}
	} while (index_producto !== "0");

	// Sección de eliminación de productos
	// Pregunta al usuario si desea eliminar productos del carrito
	let respuesta = prompt(
		"¿Desea eliminar algún producto del carrito? (si/no)"
	);

	while (respuesta.toLowerCase() === "si") {
		let eliminarProducto = prompt(
			devolverCarrito() + "\nIngrese el nombre del producto a eliminar:"
		);

		// Busca el producto a eliminar en el carrito
		const productoAEliminar = listaCarrito.find(
			(producto) =>
				producto.nombre.toLowerCase() === eliminarProducto.toLowerCase()
		);

		if (productoAEliminar) {
			eliminarDelCarrito(productoAEliminar);
			alert("Eliminado del carrito: " + productoAEliminar.nombre);
		} else {
			alert("Producto no encontrado en el carrito.");
		}
		respuesta = prompt(
			"¿Desea eliminar algún producto del carrito? (si/no)"
		);
	}

	// Sección de visualización del carrito y total
	// Muestra el contenido del carrito y el total a pagar
	alert(
		"Los productos que esta llevando son:\n" +
			devolverCarrito() +
			"\nTotal: $" +
			calcularTotal()
	);
}

// Ejecución de la simulación
simulador();
