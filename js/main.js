
/*
 * APRENDAMOS A PROGRAMAR
 * JavaScript de la pantalla principal.
 *
 * Este archivo controla las interacciones de la Home Screen.
 * La navegación hacia otras pantallas se implementará posteriormente.
 */

// Seleccionamos el botón principal mediante su identificador HTML.
const startButton = document.querySelector("#startButton");

/*
 * EVENTO DEL BOTÓN INICIO
 *
 * addEventListener permite detectar cuándo el usuario
 * hace clic sobre el botón.
 *
 * Por ahora, la acción es provisional y muestra un mensaje
 * en la consola del navegador.
 */
startButton.addEventListener("click", () => {

  console.info(
    "Botón INICIO activado. Conecta aquí la navegación del videojuego."
  );

});
