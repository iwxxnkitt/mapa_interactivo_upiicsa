/**
 * @file script.js
 * @description Lógica interna del mapa interactivo — Vanilla JS (sin jQuery).
 * @author Kit
 * @date 2026
 * @version 1.1 — Optimizado
 */

console.log("Mapa cargado correctamente.");

(function () {
    "use strict";

    // --- Referencias al DOM (una sola vez) ---
    const placeholder = document.querySelector('.sidebar-placeholder');
    const ventanas    = document.querySelectorAll('.ventana');

    /**
     * Muestra un elemento con animación de opacidad vía CSS.
     * Usamos requestAnimationFrame para forzar un reflow antes de
     * cambiar la opacidad → asegura que la transición se reproduzca.
     */
    function mostrar(el) {
        el.style.display = 'block';
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                el.style.opacity = '1';
            });
        });
    }

    /**
     * Oculta un elemento con fade-out. Escucha el 'transitionend'
     * para poner display:none solo cuando la animación termine.
     */
    function ocultar(el, callback) {
        el.style.opacity = '0';
        function onEnd() {
            el.removeEventListener('transitionend', onEnd);
            el.style.display = 'none';
            if (callback) callback();
        }
        el.addEventListener('transitionend', onEnd, { once: true });
        // Fallback: si no hay transición activa (ya oculto), ejecutar de inmediato
        if (getComputedStyle(el).opacity === '0') {
            el.removeEventListener('transitionend', onEnd);
            el.style.display = 'none';
            if (callback) callback();
        }
    }

    /** Oculta todas las ventanas de información de edificios */
    function cerrarTodas(callback) {
        var pendientes = 0;
        ventanas.forEach(function (v) {
            if (v.style.display !== 'none' && v.style.display !== '') {
                pendientes++;
                ocultar(v, function () {
                    pendientes--;
                    if (pendientes === 0 && callback) callback();
                });
            }
        });
        if (pendientes === 0 && callback) callback();
    }

    // =============================================
    // 1. HOVER — Mostrar etiqueta del edificio
    // =============================================
    // Event delegation: un solo listener para todos los botones
    var contenedor = document.getElementById('contenedor');

    contenedor.addEventListener('mouseenter', function (e) {
        if (!e.target.classList.contains('botoncito')) return;
        var txId = e.target.id.replace('btn_', 'tx_');
        var label = document.getElementById(txId);
        if (label) label.style.display = 'block';
    }, true); // useCapture para mouseenter delegation

    contenedor.addEventListener('mouseleave', function (e) {
        if (!e.target.classList.contains('botoncito')) return;
        var txId = e.target.id.replace('btn_', 'tx_');
        var label = document.getElementById(txId);
        if (label) label.style.display = 'none';
    }, true);

    // =============================================
    // 2. CLIC — Mostrar ventana de información
    // =============================================
    contenedor.addEventListener('click', function (e) {
        if (!e.target.classList.contains('botoncito')) return;
        e.stopPropagation();

        var infoId = e.target.id.replace('btn_', 'info_');
        var ventana = document.getElementById(infoId);
        if (!ventana) return;

        var yaVisible = ventana.style.display === 'block' && ventana.style.opacity === '1';

        if (yaVisible) {
            // Si ya está visible → cerrar y regresar al placeholder
            ocultar(ventana, function () {
                mostrar(placeholder);
            });
        } else {
            // Ocultar placeholder y cualquier otra ventana abierta
            placeholder.style.display = 'none';
            cerrarTodas(function () {
                mostrar(ventana);
            });
        }
    });

    // =============================================
    // 3. BOTÓN CERRAR (×) — Regresar al placeholder
    // =============================================
    document.querySelector('.sidebar-info').addEventListener('click', function (e) {
        if (!e.target.classList.contains('btn-cerrar')) return;
        e.stopPropagation();

        var ventana = e.target.closest('.ventana');
        if (ventana) {
            ocultar(ventana, function () {
                mostrar(placeholder);
            });
        }
    });

    // =============================================
    // 4. CLIC FUERA — Cerrar ventanas abiertas
    // =============================================
    document.addEventListener('click', function (e) {
        if (e.target.closest('.sidebar-info') || e.target.classList.contains('botoncito')) return;

        var hayAbiertas = false;
        ventanas.forEach(function (v) {
            if (v.style.display === 'block') hayAbiertas = true;
        });

        if (hayAbiertas) {
            cerrarTodas(function () {
                mostrar(placeholder);
            });
        }
    });
})();
