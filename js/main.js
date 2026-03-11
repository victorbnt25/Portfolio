// ==========================================
// MENÚ MÓVIL Y BARRA DE NAVEGACIÓN
// ==========================================
const iconoMenu = document.querySelector('#icono-menu');
const enlacesMenu = document.querySelector('.enlaces-navegacion');

iconoMenu.onclick = () => {
    iconoMenu.classList.toggle('bx-x');
    enlacesMenu.classList.toggle('activo');
};

// Cerrar el menú al hacer clic en un enlace o fuera de él
document.addEventListener('click', (e) => {
    if (!iconoMenu.contains(e.target) && !enlacesMenu.contains(e.target)) {
        iconoMenu.classList.remove('bx-x');
        enlacesMenu.classList.remove('activo');
    }
});

const enlaces = document.querySelectorAll('.enlaces-navegacion li a');

enlaces.forEach(enlace => {
    enlace.addEventListener('click', () => {
        iconoMenu.classList.remove('bx-x');
        enlacesMenu.classList.remove('activo');
    });
});

// Cambiar estilo de la barra de navegación al hacer scroll
const navegacion = document.querySelector('.navegacion');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navegacion.classList.add('scrolled');
    } else {
        navegacion.classList.remove('scrolled');
    }
});


// ==========================================
// ANIMACIONES AL HACER SCROLL
// ==========================================
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('mostrar-elemento');
        }
    });
}, {
    threshold: 0.1 // El elemento aparecerá cuando sea visible al menos un 10%
});

const elementosOcultos = document.querySelectorAll('.elemento-oculto');
elementosOcultos.forEach((el) => observador.observe(el));


// ==========================================
// RESALTAR ENLACE ACTIVO SEGÚN LA SECCIÓN VISIBLE
// ==========================================
const secciones = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let seccionActual = '';

    secciones.forEach(seccion => {
        const topSeccion = seccion.offsetTop;
        const alturaSeccion = seccion.clientHeight;
        if (window.scrollY >= (topSeccion - alturaSeccion / 3)) {
            seccionActual = seccion.getAttribute('id');
        }
    });

    enlaces.forEach(enlace => {
        enlace.classList.remove('activo');
        if (enlace.getAttribute('href').includes(seccionActual)) {
            enlace.classList.add('activo');
        }
    });
});

// ==========================================
// CARRUSELES DE PROYECTOS
// ==========================================
document.querySelectorAll('.carrusel').forEach(carrusel => {
    const pista = carrusel.querySelector('.carrusel-pista');
    const imagenes = carrusel.querySelectorAll('.carrusel-pista img');
    const contenedorPuntos = carrusel.querySelector('.carrusel-puntos');
    const btnPrev = carrusel.querySelector('.carrusel-btn-prev');
    const btnNext = carrusel.querySelector('.carrusel-btn-next');
    let indiceActual = 0;

    // Crear puntos indicadores
    imagenes.forEach((_, i) => {
        const punto = document.createElement('button');
        punto.classList.add('carrusel-punto');
        if (i === 0) punto.classList.add('activo');
        
        // Evento al hacer click en el punto
        punto.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            irA(i);
        });
        
        contenedorPuntos.appendChild(punto);
    });

    function actualizarPuntos() {
        contenedorPuntos.querySelectorAll('.carrusel-punto').forEach((p, i) => {
            p.classList.toggle('activo', i === indiceActual);
        });
    }

    function irA(indice) {
        // Manejar el ciclo: si pasa del final, vuelve al inicio, y viceversa
        if (indice < 0) {
            indiceActual = imagenes.length - 1;
        } else if (indice >= imagenes.length) {
            indiceActual = 0;
        } else {
            indiceActual = indice;
        }
        
        pista.style.transform = `translateX(-${indiceActual * 100}%)`;
        actualizarPuntos();
    }

// Botones siguiente / anterior
    btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        irA(indiceActual - 1);
    });

    btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        irA(indiceActual + 1);
    });
});

// ==========================================
// MODAL DE IMAGEN (LIGHTBOX)
// ==========================================
const modal = document.getElementById('modal-imagen');
const imgAmpliada = document.getElementById('img-ampliada');
const cerrarModal = document.querySelector('.cerrar-modal');
const btnModalPrev = document.querySelector('.modal-btn-prev');
const btnModalNext = document.querySelector('.modal-btn-next');

let imagenesActuales = []; // Array con las imágenes del carrusel actual
let indiceImgAmpliada = 0; // Índice de la imagen que estamos viendo

// Asignar evento de click a todas las imágenes de los carruseles
document.querySelectorAll('.carrusel-pista img').forEach(img => {
    // Puntero para indicar que se puede hacer click
    img.style.cursor = 'pointer';
    // Estilo para asegurar que la imagen puede recibir clicks por encima de otros elementos (como el contenedor)
    img.style.position = 'relative'; 
    img.style.zIndex = '50';
    
    img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evitar que el click se propague a la tarjeta del proyecto
        
        // Encontrar todas las imágenes del MISMO carrusel
        const carruselPadre = img.closest('.carrusel');
        const todasLasFotos = Array.from(carruselPadre.querySelectorAll('img'));
        
        imagenesActuales = todasLasFotos.map(imagen => imagen.src);
        indiceImgAmpliada = todasLasFotos.indexOf(img);
        
        abrirModal();
    });
});

function abrirModal() {
    imgAmpliada.src = imagenesActuales[indiceImgAmpliada];
    modal.classList.add('activo');
    document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
}

function cerrarFunc() {
    modal.classList.remove('activo');
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

function cambiarImgModal(direccion) {
    if (imagenesActuales.length === 0) return;
    
    indiceImgAmpliada += direccion;
    
    // Bucle: si pasa del final, volver al inicio
    if (indiceImgAmpliada >= imagenesActuales.length) {
        indiceImgAmpliada = 0;
    } else if (indiceImgAmpliada < 0) {
        indiceImgAmpliada = imagenesActuales.length - 1;
    }
    
    imgAmpliada.src = imagenesActuales[indiceImgAmpliada];
}

// Botones del Modal
cerrarModal.addEventListener('click', cerrarFunc);
btnModalPrev.addEventListener('click', () => cambiarImgModal(-1));
btnModalNext.addEventListener('click', () => cambiarImgModal(1));

// Cerrar al hacer click fuera de la imagen
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        cerrarFunc();
    }
});
