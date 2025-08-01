//! Es el código para el menú hamburguesa

let menuToggle = document.getElementById("menu-toggle");
let navLinks = document.getElementById("nav-links");

// Agrega un evento al botón del menú hamburguesa para alternar la visibilidad de los enlaces de navegación
menuToggle.addEventListener("click", () => {
	navLinks.classList.toggle("active");
});
