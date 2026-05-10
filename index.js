// cursor personalizado
const cursor = document.getElementById('cursor');
const anillo = document.getElementById('cursor-anillo');
let mx = 0, my = 0, ax = 0, ay = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animarCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  ax += (mx - ax) * 0.1;
  ay += (my - ay) * 0.1;
  anillo.style.left = ax + 'px';
  anillo.style.top  = ay + 'px';
  requestAnimationFrame(animarCursor);
})();

document.querySelectorAll('a, button, .pastilla, .tarjeta-proyecto').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovereado'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovereado'));
});

// particulas en el lienzo
const lienzo = document.getElementById('lienzo');
const ctx    = lienzo.getContext('2d');
let W, H;
const raton = { x: -9999, y: -9999 };

function ajustarLienzo() {
  W = lienzo.width  = window.innerWidth;
  H = lienzo.height = window.innerHeight;
}
ajustarLienzo();
window.addEventListener('resize', ajustarLienzo);
document.addEventListener('mousemove', e => { raton.x = e.clientX; raton.y = e.clientY; });

class Particula {
  constructor() { this.iniciar(); }
  iniciar() {
    this.x  = this.bx = Math.random() * W;
    this.y  = this.by = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.r  = Math.random() * 1.2 + 0.8;
    this.a  = Math.random() * 0.9 + 0.05;
  }
  actualizar() {
    const dx = this.x - raton.x;
    const dy = this.y - raton.y;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 100) {
      const f = (100 - d) / 100;
      this.x += (dx / d) * f * 2.5;
      this.y += (dy / d) * f * 2.5;
    } else {
      this.x  += (this.bx - this.x) * 0.02;
      this.y  += (this.by - this.y) * 0.02;
      this.bx += this.vx;
      this.by += this.vy;
    }
    if (this.bx < 0 || this.bx > W) this.vx *= -1;
    if (this.by < 0 || this.by > H) this.vy *= -1;
  }
  dibujar() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.a})`;
    ctx.fill();
  }
}

const CANTIDAD   = Math.min(110, Math.floor(window.innerWidth * window.innerHeight / 13000));
const particulas = Array.from({ length: CANTIDAD }, () => new Particula());

function dibujarLineas() {
  for (let i = 0; i < particulas.length; i++) {
    for (let j = i + 1; j < particulas.length; j++) {
      const dx = particulas[i].x - particulas[j].x;
      const dy = particulas[i].y - particulas[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 115) {
        ctx.beginPath();
        ctx.moveTo(particulas[i].x, particulas[i].y);
        ctx.lineTo(particulas[j].x, particulas[j].y);
        ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 115) * 0.07})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

(function bucle() {
  ctx.clearRect(0, 0, W, H);
  dibujarLineas();
  particulas.forEach(p => { p.actualizar(); p.dibujar(); });
  requestAnimationFrame(bucle);
})();

// navegacion activa segun seccion visible
const secciones  = ['inicio', 'acerca', 'habilidades', 'proyectos'];
const navEnlaces = document.querySelectorAll('.nav-enlace[data-seccion]');

function actualizarNav() {
  let actual = 'inicio';
  secciones.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 200) actual = id;
  });
  navEnlaces.forEach(a => a.classList.toggle('activo', a.dataset.seccion === actual));
}
window.addEventListener('scroll', actualizarNav, { passive: true });

// revelar elementos al hacer scroll
const observador = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.revelar').forEach(el => observador.observe(el));

// scroll suave para anclas internas
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const destino = document.querySelector(a.getAttribute('href'));
    if (destino) { e.preventDefault(); destino.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// efecto de escritura en el hero
const roles  = ['Desarrollador Full Stack', 'Disenador UX/UI', 'Docente de Digital Services'];
const rolEl  = document.getElementById('hero-rol');
let ri = 0, ci = 0, borrando = false;

function escribir() {
  const r = roles[ri];
  if (!borrando) {
    rolEl.textContent = r.slice(0, ++ci);
    if (ci === r.length) { borrando = true; setTimeout(escribir, 2100); return; }
  } else {
    rolEl.textContent = r.slice(0, --ci);
    if (ci === 0) { borrando = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(escribir, borrando ? 44 : 82);
}
setTimeout(escribir, 800);