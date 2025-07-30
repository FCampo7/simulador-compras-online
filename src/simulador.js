// IMPORTANTE!!!!
// Actualmente no esta en uso, era para simular la primera entrega

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
