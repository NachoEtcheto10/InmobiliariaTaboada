(function () {
  'use strict';

  var WHATSAPP = '5493442512301';
  var EMAIL = 'info@grupotaboada.com.ar';
  var root = document.documentElement;

  /* ---------- Tema claro / oscuro ---------- */
  var themeBtn = document.getElementById('themeToggle');
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    if (metaTheme) metaTheme.setAttribute('content', t === 'dark' ? '#1b1817' : '#2b2826');
  }
  applyTheme(root.getAttribute('data-theme') || 'light');

  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('taboada-theme', next); } catch (e) {}
  });

  /* ---------- Header al hacer scroll ---------- */
  var header = document.getElementById('header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Link activo según sección visible ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Animaciones de entrada ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Formulario de contacto ---------- */
  var opciones = {
    inmobiliaria: [
      'Consulta general',
      'Departamento en Edificio Centro Comercial',
      'TERRUS – Loteo Barrio Privado Las Acacias',
      'ECO EDIFICIO Guay I',
      'Casa en Barrio Privado Zona Centro',
      'Quiero vender / alquilar mi propiedad'
    ],
    ingenieria: [
      'Consulta general',
      'Movimientos de suelos y transporte de áridos',
      'Movimientos de suelos y trabajos viales',
      'Nivelaciones',
      'Cocheras'
    ],
    contable: [
      'Consulta general',
      'Servicios contables',
      'Servicios laborales',
      'Servicios impositivos',
      'Servicios societarios',
      'Administración de consorcios'
    ]
  };
  var nombresSeccion = { inmobiliaria: 'Negocios Inmobiliarios', ingenieria: 'Ingeniería', contable: 'Estudio Contable' };

  var nombresCortos = { inmobiliaria: 'inmobiliaria', ingenieria: 'ingeniería', contable: 'contable' };

  var form = document.getElementById('contactForm');
  var selTema = document.getElementById('fTema');
  var errorBox = document.getElementById('formError');

  // Un solo desplegable, agrupado por área (valor: "seccion|tema")
  Object.keys(opciones).forEach(function (sec) {
    var group = document.createElement('optgroup');
    group.label = nombresSeccion[sec];
    opciones[sec].forEach(function (txt) {
      var o = document.createElement('option');
      o.value = sec + '|' + txt;
      o.textContent = txt === 'Consulta general' ? 'Consulta general (' + nombresCortos[sec] + ')' : txt;
      group.appendChild(o);
    });
    selTema.appendChild(group);
  });

  // Los botones "Consultar" y "Pedir presupuesto" precargan el tema
  document.querySelectorAll('[data-seccion]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sec = a.getAttribute('data-seccion');
      selTema.value = sec + '|' + (a.getAttribute('data-pub') || 'Consulta general');
      if (sec === 'ingenieria') {
        var p = form.querySelector('input[name="motivo"][value="Presupuesto"]');
        if (p) p.checked = true;
      }
    });
  });

  function buildMessage() {
    var d = new FormData(form);
    var tema = d.get('tema').split('|');
    var lines = [
      'Hola Grupo Taboada, les escribo desde la web.',
      '',
      'Motivo: ' + d.get('motivo'),
      'Área: ' + nombresSeccion[tema[0]],
      'Tema: ' + tema[1],
      'Nombre: ' + d.get('nombre').trim(),
      'E-mail: ' + d.get('email').trim(),
      '',
      d.get('comentarios').trim()
    ];
    return { text: lines.join('\n'), subject: d.get('motivo') + ' – ' + nombresSeccion[tema[0]] };
  }

  function validate() {
    var ok = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(function (el) {
      var valid = el.value.trim() !== '' && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.classList.toggle('is-invalid', !valid);
      el.setAttribute('aria-invalid', String(!valid));
      if (!valid && ok) { el.focus(); ok = false; }
    });
    errorBox.hidden = ok;
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    var m = buildMessage();
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(m.text), '_blank', 'noopener');
  });

  document.getElementById('sendMail').addEventListener('click', function (e) {
    e.preventDefault();
    if (!validate()) return;
    var m = buildMessage();
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.text);
  });

  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('is-invalid') && e.target.value.trim() !== '') {
      e.target.classList.remove('is-invalid');
      e.target.removeAttribute('aria-invalid');
    }
  });

  /* ---------- Año ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
