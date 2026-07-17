/**
 * @file script.js
 * @description Lógica interna del mapa interactivo y coordenadas.
 * @author Kit Guadarrama
 * @date Julio 2026
 */

console.log("Mapa cargado correctamente.");

$(document).ready(function () {
    // Asegurarnos de que las etiquetas hover y las ventanas estén ocultas al inicio
    $('.edificio, .ventana').hide();
    $('.sidebar-placeholder').show();

    // 1. Efecto Hover: Mostrar el nombre del edificio al pasar el mouse por el botón
    $('.botoncito').hover(
        function () {
            var edifId = $(this).attr('id').replace('btn_', '#tx_');
            $(edifId).stop(true, true).fadeIn(200);
        },
        function () {
            var edifId = $(this).attr('id').replace('btn_', '#tx_');
            $(edifId).stop(true, true).fadeOut(200);
        }
    );

    // 2. Efecto Clic: Mostrar la ventana de información del edificio en el panel lateral
    $('.botoncito').click(function (e) {
        e.stopPropagation();
        var infoId = $(this).attr('id').replace('btn_', '#info_');
        
        if ($(infoId).is(':visible')) {
            // Si ya está visible, la cerramos y volvemos a mostrar el placeholder
            $(infoId).fadeOut(200, function() {
                $('.sidebar-placeholder').fadeIn(200);
            });
        } else {
            // Ocultar el placeholder y cualquier otra ventana abierta
            $('.sidebar-placeholder').hide();
            $('.ventana').not(infoId).hide();
            // Mostrar la ventana correspondiente con animación
            $(infoId).fadeIn(300);
        }
    });

    // 3. Cerrar la ventana al hacer clic en el botón de cerrar (x) y regresar al placeholder
    $('.btn-cerrar').click(function (e) {
        e.stopPropagation();
        $(this).closest('.ventana').fadeOut(200, function() {
            $('.sidebar-placeholder').fadeIn(200);
        });
    });

    // 4. Cerrar la ventana al hacer clic en cualquier parte fuera del mapa y del panel
    $(document).click(function (e) {
        if (!$(e.target).closest('.sidebar-info').length && !$(e.target).hasClass('botoncito')) {
            $('.ventana').fadeOut(200, function() {
                if ($('.sidebar-placeholder').is(':hidden')) {
                    $('.sidebar-placeholder').fadeIn(200);
                }
            });
        }
    });
});
