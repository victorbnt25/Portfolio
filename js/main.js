const iconoMenu = document.querySelector('#icono-menu');
const iconoMenuI = document.querySelector('#icono-menu i');
const enlacesMenu = document.querySelector('.enlaces-navegacion');

iconoMenu.onclick = () => {
    iconoMenuI.classList.toggle('bx-menu');
    iconoMenuI.classList.toggle('bx-x');
    enlacesMenu.classList.toggle('activo');
};

document.addEventListener('click', (e) => {
    if (!iconoMenu.contains(e.target) && !enlacesMenu.contains(e.target)) {
        iconoMenuI.classList.add('bx-menu');
        iconoMenuI.classList.remove('bx-x');
        enlacesMenu.classList.remove('activo');
    }
});

const enlaces = document.querySelectorAll('.enlaces-navegacion li a');

enlaces.forEach(enlace => {
    enlace.addEventListener('click', () => {
        iconoMenuI.classList.add('bx-menu');
        iconoMenuI.classList.remove('bx-x');
        enlacesMenu.classList.remove('activo');
    });
});

const navegacion = document.querySelector('.navegacion');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navegacion.classList.add('scrolled');
    } else {
        navegacion.classList.remove('scrolled');
    }
});


const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('mostrar-elemento');
        }
    });
}, {
    threshold: 0.1 
});

const elementosOcultos = document.querySelectorAll('.elemento-oculto');
elementosOcultos.forEach((el) => observador.observe(el));


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

document.querySelectorAll('.carrusel').forEach(carrusel => {
    const pista = carrusel.querySelector('.carrusel-pista');
    const imagenes = carrusel.querySelectorAll('.carrusel-pista img');
    const contenedorPuntos = carrusel.querySelector('.carrusel-puntos');
    const btnPrev = carrusel.querySelector('.carrusel-btn-prev');
    const btnNext = carrusel.querySelector('.carrusel-btn-next');
    let indiceActual = 0;

    imagenes.forEach((_, i) => {
        const punto = document.createElement('button');
        punto.classList.add('carrusel-punto');
        if (i === 0) punto.classList.add('activo');
        
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

const modal = document.getElementById('modal-imagen');
const imgAmpliada = document.getElementById('img-ampliada');
const cerrarModal = document.querySelector('.cerrar-modal');
const btnModalPrev = document.querySelector('.modal-btn-prev');
const btnModalNext = document.querySelector('.modal-btn-next');

let imagenesActuales = []; 
let indiceImgAmpliada = 0; 

document.querySelectorAll('.carrusel-pista img').forEach(img => {
    img.style.cursor = 'pointer';
    img.style.position = 'relative'; 
    img.style.zIndex = '50';
    
    img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        
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
    document.body.style.overflow = 'hidden'; 
}

function cerrarFunc() {
    modal.classList.remove('activo');
    document.body.style.overflow = 'auto'; 
}

function cambiarImgModal(direccion) {
    if (imagenesActuales.length === 0) return;
    
    indiceImgAmpliada += direccion;
    
    if (indiceImgAmpliada >= imagenesActuales.length) {
        indiceImgAmpliada = 0;
    } else if (indiceImgAmpliada < 0) {
        indiceImgAmpliada = imagenesActuales.length - 1;
    }
    
    imgAmpliada.src = imagenesActuales[indiceImgAmpliada];
}

cerrarModal.addEventListener('click', cerrarFunc);
btnModalPrev.addEventListener('click', () => cambiarImgModal(-1));
btnModalNext.addEventListener('click', () => cambiarImgModal(1));

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        cerrarFunc();
    }
});
