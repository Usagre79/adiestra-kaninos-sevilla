// === 1. FLECHA "SCROLL TO TOP" ===
window.addEventListener('scroll', () => {
  const flecha = document.querySelector('.scroll-to-top');
  if (flecha) {
    flecha.style.display = (window.scrollY > 300) ? 'block' : 'none';
  }
});

// === 2. CAMBIO DE LOGO SEGÚN TEMA (Oscuro/Claro) ===
function actualizarLogoSegunTema() {
  const logo = document.getElementById('logoPrincipal');
  if (!logo) return;
  logo.src = document.body.classList.contains('dark-theme')
    ? 'images/logo-dark.svg'
    : 'images/logo.svg';
}

// === 3. EVENTOS AL CARGAR EL DOM ===
document.addEventListener("DOMContentLoaded", () => {
  // 3.1. Carga de tema oscuro desde localStorage
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
  }
  actualizarLogoSegunTema();

  // 3.2. Cambiar tema manualmente
  const btnTema = document.getElementById('toggleTheme');
  btnTema?.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    actualizarLogoSegunTema();
  });

  // 3.3. Botón cambio de idioma entre index.html y index-en.html
  document.getElementById('toggleIdioma')?.addEventListener('click', () => {
    const rutaActual = window.location.pathname;
    window.location.href = rutaActual.includes('-en') ? 'index.html' : 'index-en.html';
  });

  // 3.4. Animación sit/plas en icono
  const imagen = document.getElementById("imagenPerrito");
  const imagen1 = "images/sit.svg", imagen2 = "images/plas.svg";
  let actual = true;
  if (imagen) {
    setInterval(() => {
      imagen.src = actual ? imagen2 : imagen1;
      actual = !actual;
    }, 1500);
  }

  // 3.5. Controles del vídeo modal
  const video = document.getElementById("tutorialVideo");
  if (video) {
    document.getElementById("btnPlay")?.addEventListener("click", () => video.play());
    document.getElementById("btnPause")?.addEventListener("click", () => video.pause());
    document.getElementById("btnStop")?.addEventListener("click", () => { video.pause(); video.currentTime = 0; });
    document.getElementById("btnVolUp")?.addEventListener("click", () => { if (video.volume < 1) video.volume = Math.min(1, video.volume + 0.1); });
    document.getElementById("btnVolDown")?.addEventListener("click", () => { if (video.volume > 0) video.volume = Math.max(0, video.volume - 0.1); });
    document.getElementById("videoModal")?.addEventListener("hidden.bs.modal", () => video.pause());
  }

  // 3.6. Cierre de menú responsive al hacer clic
  document.querySelectorAll('.navbar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse?.classList.contains('show')) {
        new bootstrap.Collapse(navbarCollapse).toggle();
      }
    });
  });

  // 3.7. Reset vídeos testimonios al cerrar modal
  ['Sasha', 'Charlie', 'Rocky', 'Zoe'].forEach(nombre => {
    const modal = document.getElementById(`video${nombre}`);
    const video = document.getElementById(`video${nombre}Player`);
    if (modal && video) {
      modal.addEventListener('hidden.bs.modal', () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  });

  // 3.9. Animación escalonada en navbar
  const navItems = document.querySelectorAll('.animation-escalonada li');
  const navList = document.querySelector('.animation-escalonada');
  if (navList) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach((item, index) => {
            item.style.animation = 'none';
            void item.offsetWidth;
            item.style.animation = `slideInFromLeft 0.6s ease forwards`;
            item.style.animationDelay = `${index * 0.1}s`;
          });
        }
      });
    }, { threshold: 0.1 });
    observer.observe(navList);
  }

  // 3.10. Repetir animación al clicar en menú
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navItems.forEach((item, index) => {
        item.style.animation = 'none';
        void item.offsetWidth;
        item.style.animation = `slideInFromLeft 0.6s ease forwards`;
        item.style.animationDelay = `${index * 0.1}s`;
      });
    });
  });

  // 3.11. Animación de entrada observada (servicios, historia…)
  const elementosAnimados = document.querySelectorAll('.animacion-observada');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.animationDelay = el.dataset.delay || '0s';
        el.classList.add('parrafo-animado', 'animate__animated', 'animate__zoomIn');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  elementosAnimados.forEach(el => observer.observe(el));

  // 3.12. Reiniciar animación historia
  document.querySelector('a[href="#historia"]')?.addEventListener('click', () => {
    const seccion = document.getElementById("historia");
    setTimeout(() => {
      seccion.querySelectorAll('.animacion-observada').forEach(el => {
        el.classList.remove('parrafo-animado', 'animate__animated', 'animate__zoomIn');
        void el.offsetWidth;
        el.style.animationDelay = el.dataset.delay || '0s';
        el.classList.add('parrafo-animado', 'animate__animated', 'animate__zoomIn');
      });
    }, 500);
  });

  // 3.13. Reanimar servicios al pulsar en el menú
  document.querySelector('a[href="#servicios"]')?.addEventListener('click', () => {
    const elementosServicios = document.querySelectorAll('#servicios .animacion-observada');
    elementosServicios.forEach(el => {
      el.classList.remove('animate__animated', 'animate__zoomIn');
      void el.offsetWidth;
    });
    setTimeout(() => {
      elementosServicios.forEach(el => el.classList.add('animate__animated', 'animate__zoomIn'));
    }, 500);
  });
});

// === 4. FUNCIONES CARRITO ===
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContador() {
  document.getElementById('contadorCarrito').textContent = carrito.length;
}

function mostrarCarrito() {
  const contenedor = document.getElementById('contenidoCarrito');
  if (!contenedor) return;

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
    return;
  }

  let total = 0;
  contenedor.innerHTML = '<ul class="list-group mb-3">';
  carrito.forEach(p => {
    contenedor.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${p.nombre} <span class="badge bg-secondary">${p.precio.toFixed(2)} €</span>
      </li>`;
    total += p.precio;
  });
  contenedor.innerHTML += `</ul><p class="text-end fw-bold">Total: ${total.toFixed(2)} €</p>`;
}

// === 5. EVENTOS DEL CARRITO ===
document.getElementById('verCarrito')?.addEventListener('click', () => {
  mostrarCarrito();
  new bootstrap.Modal(document.getElementById('modalCarrito')).show();
});

document.getElementById('btnVaciarCarrito')?.addEventListener('click', () => {
  carrito = []; guardarCarrito(); actualizarContador(); mostrarCarrito();
});

document.getElementById('btnComprarCarrito')?.addEventListener('click', () => {
  if (!carrito.length) return alert("Tu carrito está vacío.");
  alert("¡Gracias por tu compra Kanina! Total: " + carrito.reduce((a, b) => a + b.precio, 0).toFixed(2) + " €");
  carrito = []; guardarCarrito(); actualizarContador(); mostrarCarrito();
});

document.querySelectorAll('[data-producto]').forEach(btn => {
  btn.addEventListener('click', () => {
    const nombre = btn.getAttribute('data-nombre');
    const precio = parseFloat(btn.getAttribute('data-precio'));
    if (!nombre || isNaN(precio)) return;
    carrito.push({ nombre, precio });
    guardarCarrito(); actualizarContador(); mostrarCarrito();
  });
});

// === 6. BOTONES LEER MÁS EN SERVICIOS ===
document.querySelectorAll('.toggle-collapse').forEach(btn => {
  const target = document.querySelector(btn.getAttribute('data-target'));
  const collapse = new bootstrap.Collapse(target, { toggle: false });
  btn.addEventListener('click', () => {
    const isVisible = target.classList.contains('show');
    isVisible ? (collapse.hide(), btn.textContent = 'Leer más') : (collapse.show(), btn.textContent = 'Cerrar');
  });
});

// === 7. ANCLA PERSONALIZADA A UBICACIÓN ===
document.querySelectorAll('a[href="#ubicacion"]').forEach(enlace => {
  enlace.addEventListener('click', e => {
    e.preventDefault();
    const destino = document.querySelector('#ubicacion');
    const offset = destino.getBoundingClientRect().top + window.scrollY - 130;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});
// === 8. ANCLA PERSONALIZADA DEL BANNER AL NAV ===.

// === Posicionar banner justo debajo del navbar dinámicamente ===
function ajustarBanner() {
  const navbar = document.querySelector('.navbar');
  const banner = document.querySelector('.jornada-banner');

  if (navbar && banner) {
    const alturaNavbar = navbar.offsetHeight;
    banner.style.top = `${alturaNavbar}px`;
  }
}

window.addEventListener('resize', ajustarBanner);
window.addEventListener('load', ajustarBanner);



// Ajustar padding-top del inicio según altura navbar + banner
function ajustarPaddingInicio() {
  const navbar = document.querySelector('.navbar');
  const banner = document.querySelector('.jornada-banner');
  const seccionInicio = document.getElementById('inicio');

  if (navbar && banner && seccionInicio) {
    const totalAltura = navbar.offsetHeight + banner.offsetHeight;
    seccionInicio.style.paddingTop = `${totalAltura}px`; // + extra margen
  }
}

window.addEventListener('resize', ajustarPaddingInicio);
window.addEventListener('load', ajustarPaddingInicio);

function ajustarPosicionBanner() {
  const navbar = document.querySelector('.navbar');
  const banner = document.querySelector('.jornada-banner');

  if (navbar && banner) {
    const alturaNav = navbar.getBoundingClientRect().height;
    banner.style.top = `${alturaNav}px`;
  }
}

// Ajuste inicial
window.addEventListener('DOMContentLoaded', ajustarPosicionBanner);
window.addEventListener('load', ajustarPosicionBanner);

// Observa cambios en altura del navbar (animaciones, fuentes, modo oscuro...)
const navbar = document.querySelector('.navbar');
if (navbar) {
  const resizeObserver = new ResizeObserver(() => {
    ajustarPosicionBanner();
  });
  resizeObserver.observe(navbar);
}
// === Cerrar menú hamburguesa al hacer clic en botón si ya está abierto ===
document.querySelector('.navbar-toggler')?.addEventListener('click', () => {
  const menu = document.getElementById('navbarNav');
  const bsCollapse = bootstrap.Collapse.getInstance(menu) || new bootstrap.Collapse(menu, { toggle: false });
  if (menu.classList.contains('show')) {
    bsCollapse.hide();
  }
});
