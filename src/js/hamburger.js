//! Es el código para el menú hamburguesa

/**
 * Botón que activa/desactiva el menú hamburguesa.
 * @type {HTMLElement}
 */
let menuToggle = document.getElementById("menu-toggle");

/**
 * Contenedor de los enlaces de navegación que se muestran/ocultan.
 * @type {HTMLElement}
 */
let navLinks = document.getElementById("nav-links");

/**
 * Alterna la visibilidad del menú de navegación cuando se hace click
 * en el botón del menú hamburguesa.
 *
 * Agrega o elimina la clase `active` en el contenedor de enlaces,
 * lo que permite mostrar u ocultar el menú según el estado actual.
 *
 * @event click
 * @returns {void}
 */
menuToggle.addEventListener("click", () => {
	navLinks.classList.toggle("active");
});
