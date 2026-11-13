
// =========================================
// SELECTOR DE LECCIONES
// JavaScript exclusivo de selector.html
// =========================================

// Espera a que el documento HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // Obtener las cuatro tarjetas de lecciones
    const lessonCards = document.querySelectorAll('.lesson-card');

    // Preparar cada tarjeta para conectar su contenido más adelante
    lessonCards.forEach((card) => {

        // Evita que los botones recarguen o envíen formularios
        card.addEventListener('click', (event) => {
            event.preventDefault();

            // Aquí se conectará la navegación de cada lección
            // cuando sus respectivas pantallas estén desarrolladas.
        });

    });

});
