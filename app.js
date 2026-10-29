(function () {
  'use strict';

  var WHATSAPP = '5493442512301';
  var EMAIL = 'info@grupotaboada.com.ar';
  var root = document.documentElement;

  /* =========================================================
     1. TEMA CLARO / OSCURO
     ========================================================= */
  var themeBtn = document.getElementById('themeToggle');
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', t === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
    if (metaTheme) metaTheme.setAttribute('content', t === 'dark' ? '#1b1817' : '#2b2826');
  }
  applyTheme(root.getAttribute('data-theme') || 'light');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('taboada-theme', next); } catch (e) { }
    });
  }

  /* =========================================================
     2. HEADER AL HACER SCROLL & MENÚ MÓVIL
     ========================================================= */
  var header = document.getElementById('header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    if (!nav || !header || !burger) return;
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  }
  if (nav) {
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      setMenu(false);
      closePropModal();
      closeAdminModal();
    }
  });

  /* =========================================================
     3. NAVEGACIÓN ACTIVA SEGÚN SECCIÓN VISIBLE
     ========================================================= */
  if (nav) {
    var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = '#' + entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
    }
  }

  /* =========================================================
     4. ANIMACIONES DE ENTRADA (REVEAL)
     ========================================================= */
  function initReveals(container) {
    var scope = container || document;
    var reveals = scope.querySelectorAll('.reveal:not(.is-in)');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
      reveals.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 60 + 'ms';
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    }
  }
  initReveals();

  /* =========================================================
     5. DATOS POR DEFECTO Y ALMACENAMIENTO (LOCALSTORAGE)
     ========================================================= */
  var DEFAULT_PROPERTIES = [
    {
      id: 'prop-1',
      title: 'Departamento en Edificio Centro Comercial',
      location: 'Concepción del Uruguay',
      image: 'assets/img/prop-depto-centro.jpg',
      tag: 'En venta',
      price: 'Consultar precio',
      fullDesc: 'Departamento ubicado en pleno centro comercial de Concepción del Uruguay. Excelente luminosidad, cercanía inmediata a servicios, bancos y centros educativos. Ambientes confortables, cocina equipada y balcón al frente.',
      features: ['2 Dormitorios', '1 Baño completo', 'Balcón al frente', 'Cocina integrada', 'Excelente luminosidad']
    },
    {
      id: 'prop-2',
      title: 'TERRUS · Loteo Barrio Privado Las Acacias',
      location: 'En desarrollo · C. del Uruguay',
      image: 'assets/img/prop-terrus.jpg',
      tag: 'En desarrollo',
      price: 'Financiación disponible',
      fullDesc: 'TERRUS Barrio Privado Las Acacias es un desarrollo urbanístico planificado para brindar seguridad, tranquilidad y naturaleza. Lotes residenciales de amplias dimensiones con infraestructura completa y acceso controlado.',
      features: ['Lotes desde 600 m²', 'Seguridad y acceso controlado', 'Servicios subterráneos', 'Entorno natural parquizado', 'Financiación a medida']
    },
    {
      id: 'prop-3',
      title: 'ECO EDIFICIO Guay I',
      location: 'En desarrollo · C. del Uruguay',
      image: 'assets/img/prop-eco-guay.jpg',
      tag: 'Sustentable',
      price: 'Preventa al pozo',
      fullDesc: 'ECO EDIFICIO Guay I es una propuesta arquitectónica moderna orientada a la sustentabilidad, confort térmico y ahorro energético. Unidades funcionales con terrazas verdes, doble vidriado hermético (DVH) y bajas expensas.',
      features: ['Unidades de 1 y 2 dormitorios', 'Aislamiento térmico y DVH', 'Terrazas con vegetación', 'Energía solar en comunes', 'Bajas expensas']
    },
    {
      id: 'prop-4',
      title: 'Casa en Barrio Privado Zona Centro',
      location: 'Concepción del Uruguay',
      image: 'assets/img/prop-casa-alquiler.jpg',
      tag: 'Alquiler',
      price: 'Consultar valor',
      fullDesc: 'Residencia de diseño moderno emplazada en barrio privado con acceso privilegiado a la zona céntrica. Ambientes climatizados, galería semicubierta con parrilla, amplio parque, piscina y cochera cubierta.',
      features: ['3 Dormitorios (1 en suite)', '3 Baños', 'Piscina y gran parque', 'Galería con parrilla', 'Cochera doble']
    }
  ];

  var DEFAULT_WORKS = [
    {
      id: 'work-1',
      title: 'Movimientos de suelos y transporte de áridos',
      image: 'assets/img/ing-movimiento-aridos.jpg'
    },
    {
      id: 'work-2',
      title: 'Movimientos de suelos y trabajos viales',
      image: 'assets/img/ing-trabajos-viales.jpg'
    },
    {
      id: 'work-3',
      title: 'Nivelaciones',
      image: 'assets/img/ing-nivelaciones.jpg'
    },
    {
      id: 'work-4',
      title: 'Cocheras',
      image: 'assets/img/ing-cocheras.jpg'
    }
  ];

  function loadProperties() {
    try {
      var saved = localStorage.getItem('taboada_properties');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return DEFAULT_PROPERTIES.slice();
  }

  function saveProperties(list) {
    try {
      localStorage.setItem('taboada_properties', JSON.stringify(list));
    } catch (e) {
      alert('Atención: El almacenamiento local está lleno. Probá con una imagen de menor peso.');
    }
  }

  function loadWorks() {
    try {
      var saved = localStorage.getItem('taboada_works');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return DEFAULT_WORKS.slice();
  }

  function saveWorks(list) {
    try {
      localStorage.setItem('taboada_works', JSON.stringify(list));
    } catch (e) {
      alert('Atención: El almacenamiento local está lleno. Probá con una imagen de menor peso.');
    }
  }

  var currentProperties = loadProperties();
  var currentWorks = loadWorks();

  /* =========================================================
     6. RENDERIZADO DINÁMICO DE PROPIEDADES Y OBRAS
     ========================================================= */
  var PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23ebe7df'/%3E%3Cpath d='M250 180a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm-70 120h240l-75-100-55 70-35-45-75 75z' fill='%23b5ada4'/%3E%3Ctext x='300' y='330' font-family='sans-serif' font-size='18' fill='%237d756d' text-anchor='middle'%3ESin imagen cargada%3C/text%3E%3C/svg%3E";

  var propCardsContainer = document.getElementById('propCards');
  var worksCardsContainer = document.getElementById('worksCards');

  function renderPropertiesFrontend() {
    if (!propCardsContainer) return;
    propCardsContainer.innerHTML = '';
    currentProperties.forEach(function (prop) {
      var isAvailable = prop.available !== false;
      var article = document.createElement('article');
      article.className = 'card reveal is-in' + (isAvailable ? '' : ' is-unavailable');

      var badgeHtml = '';
      if (!isAvailable) {
        badgeHtml = '<div class="card__tag-group">' +
                    '  <span class="card__tag card__tag--unavailable">No disponible</span>' +
                    (prop.tag ? '  <span class="card__tag">' + escapeHtml(prop.tag) + '</span>' : '') +
                    '</div>';
      } else if (prop.tag) {
        badgeHtml = '<span class="card__tag">' + escapeHtml(prop.tag) + '</span>';
      }

      var imgSrc = sanitizeMediaUrl(prop.image);

      article.innerHTML = [
        '<div class="card__media" role="button" tabindex="0" title="Ver detalle de ' + escapeHtml(prop.title) + '" data-detail-id="' + prop.id + '">',
        '  <img src="' + escapeHtml(imgSrc) + '" alt="' + escapeHtml(prop.title) + '" loading="lazy" decoding="async">',
        badgeHtml,
        '</div>',
        '<div class="card__body">',
        '  <h3>' + escapeHtml(prop.title) + '</h3>',
        '  <p class="card__meta"><svg class="ico"><use href="#i-pin"/></svg> ' + escapeHtml(prop.location || 'Concepción del Uruguay') + '</p>',
        '  <div class="card__actions">',
        '    <button type="button" class="btn-card-detail" data-detail-id="' + prop.id + '">Ver detalle</button>',
        '    <a href="#contacto" class="card__link" data-seccion="inmobiliaria" data-pub="' + escapeHtml(prop.title) + '">' + (isAvailable ? 'Consultar' : 'Consultar disponibilidad') + ' <svg class="ico"><use href="#i-arrow"/></svg></a>',
        '  </div>',
        '</div>'
      ].join('');

      propCardsContainer.appendChild(article);
    });

    // Eventos para abrir el modal de detalle
    propCardsContainer.querySelectorAll('[data-detail-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-detail-id');
        openPropModal(id);
      });
    });

    attachConsultarListeners();
    updateContactOptions();
  }

  function renderWorksFrontend() {
    if (!worksCardsContainer) return;
    worksCardsContainer.innerHTML = '';
    currentWorks.forEach(function (work) {
      var isAvailable = work.available !== false;
      var article = document.createElement('article');
      article.className = 'work reveal is-in' + (isAvailable ? '' : ' is-unavailable');
      var imgSrc = sanitizeMediaUrl(work.image);
      var badgeHtml = isAvailable ? '' : '<span class="work__tag--unavailable">No disponible</span>';

      article.innerHTML = [
        '<img src="' + escapeHtml(imgSrc) + '" alt="' + escapeHtml(work.title) + '" loading="lazy" decoding="async">',
        badgeHtml,
        '<div class="work__overlay">',
        '  <h3>' + escapeHtml(work.title) + '</h3>',
        '</div>'
      ].join('');
      worksCardsContainer.appendChild(article);
    });
    updateContactOptions();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Sanitizador estricto de URLs de medios contra inyecciones XSS (javascript:, vbscript:, data:text/html)
  function sanitizeMediaUrl(url) {
    if (!url || typeof url !== 'string') return PLACEHOLDER_IMG;
    var trimmed = url.trim();
    if (/^(data:image\/[a-zA-Z0-9+.-]+;base64,|https?:\/\/|assets\/)/i.test(trimmed)) {
      return trimmed;
    }
    return PLACEHOLDER_IMG;
  }

  /* =========================================================
     7. MODAL DE DETALLE DE PROPIEDAD
     ========================================================= */
  var propModalBackdrop = document.getElementById('propModalBackdrop');
  var propModalClose = document.getElementById('propModalClose');
  var propModalImg = document.getElementById('propModalImg');
  var propModalBadge = document.getElementById('propModalBadge');
  var propModalTitle = document.getElementById('propModalTitle');
  var propModalLocation = document.getElementById('propModalLocation');
  var propModalPrice = document.getElementById('propModalPrice');
  var propModalDesc = document.getElementById('propModalDesc');
  var propModalFeatures = document.getElementById('propModalFeatures');
  var propModalCta = document.getElementById('propModalCta');

  function openPropModal(propId) {
    var p = currentProperties.find(function (item) { return item.id === propId; });
    if (!p || !propModalBackdrop) return;

    propModalImg.src = sanitizeMediaUrl(p.image);
    propModalImg.alt = p.title || '';

    var isAvailable = p.available !== false;
    var propModalEl = propModalBackdrop.querySelector('.prop-modal');
    if (propModalEl) propModalEl.classList.toggle('is-unavailable', !isAvailable);

    if (!isAvailable) {
      propModalBadge.textContent = 'No disponible';
      propModalBadge.className = 'prop-modal__badge prop-modal__badge--unavailable';
      propModalBadge.style.display = 'inline-block';
    } else if (p.tag) {
      propModalBadge.textContent = p.tag;
      propModalBadge.className = 'prop-modal__badge';
      propModalBadge.style.display = 'inline-block';
    } else {
      propModalBadge.style.display = 'none';
    }

    propModalTitle.textContent = p.title || '';
    propModalLocation.textContent = p.location || 'Concepción del Uruguay';

    if (p.price) {
      propModalPrice.textContent = p.price;
      propModalPrice.style.display = 'block';
    } else {
      propModalPrice.style.display = 'none';
    }

    propModalDesc.textContent = p.fullDesc || 'Propiedad en cartera de Grupo Taboada. Asesoramiento personalizado y seguimiento integral de la operación.';

    propModalFeatures.innerHTML = '';
    var feats = Array.isArray(p.features) ? p.features : (p.features ? String(p.features).split(',') : []);
    feats.forEach(function (f) {
      var txt = f.trim();
      if (!txt) return;
      var li = document.createElement('li');
      li.className = 'prop-modal__feature';
      li.innerHTML = '<svg class="ico" style="width: 14px; height: 14px; color: var(--yellow-600);"><use href="#i-check"/></svg> ' + escapeHtml(txt);
      propModalFeatures.appendChild(li);
    });

    propModalCta.onclick = function (e) {
      e.preventDefault();
      closePropModal();
      if (selTema) {
        selTema.value = 'inmobiliaria|' + p.title;
      }
      var contactSection = document.getElementById('contacto');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    propModalBackdrop.classList.add('is-open');
    propModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePropModal() {
    if (!propModalBackdrop) return;
    propModalBackdrop.classList.remove('is-open');
    propModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (propModalClose) propModalClose.addEventListener('click', closePropModal);
  if (propModalBackdrop) {
    propModalBackdrop.addEventListener('click', function (e) {
      if (e.target === propModalBackdrop) closePropModal();
    });
  }

  /* =========================================================
     8. FORMULARIO DE CONTACTO (DINÁMICO CON PROPIEDADES/OBRAS)
     ========================================================= */
  var nombresSeccion = { inmobiliaria: 'Negocios Inmobiliarios', ingenieria: 'Ingeniería', contable: 'Estudio Contable' };
  var nombresCortos = { inmobiliaria: 'inmobiliaria', ingenieria: 'ingeniería', contable: 'contable' };

  var form = document.getElementById('contactForm');
  var selTema = document.getElementById('fTema');
  var errorBox = document.getElementById('formError');

  function updateContactOptions() {
    if (!selTema) return;
    var prevVal = selTema.value;
    selTema.innerHTML = '';

    var dynamicOpciones = {
      inmobiliaria: ['Consulta general'].concat(currentProperties.map(function (p) { return p.title; })),
      ingenieria: ['Consulta general'].concat(currentWorks.map(function (w) { return w.title; })),
      contable: [
        'Consulta general',
        'Servicios contables',
        'Servicios laborales',
        'Servicios impositivos',
        'Servicios societarios',
        'Administración de consorcios'
      ]
    };

    Object.keys(dynamicOpciones).forEach(function (sec) {
      var group = document.createElement('optgroup');
      group.label = nombresSeccion[sec];
      dynamicOpciones[sec].forEach(function (txt) {
        var o = document.createElement('option');
        o.value = sec + '|' + txt;
        o.textContent = txt === 'Consulta general' ? 'Consulta general (' + nombresCortos[sec] + ')' : txt;
        group.appendChild(o);
      });
      selTema.appendChild(group);
    });

    if (prevVal) selTema.value = prevVal;
  }

  function attachConsultarListeners() {
    document.querySelectorAll('[data-seccion]').forEach(function (a) {
      a.removeEventListener('click', onDataSeccionClick);
      a.addEventListener('click', onDataSeccionClick);
    });
  }

  function onDataSeccionClick(e) {
    var a = e.currentTarget;
    var sec = a.getAttribute('data-seccion');
    var pub = a.getAttribute('data-pub') || 'Consulta general';
    if (selTema) selTema.value = sec + '|' + pub;
    if (sec === 'ingenieria' && form) {
      var p = form.querySelector('input[name="motivo"][value="Presupuesto"]');
      if (p) p.checked = true;
    }
  }

  function buildMessage() {
    var d = new FormData(form);
    var tema = (d.get('tema') || 'inmobiliaria|Consulta general').split('|');
    var lines = [
      'Hola Grupo Taboada, les escribo desde la web.',
      '',
      'Motivo: ' + d.get('motivo'),
      'Área: ' + (nombresSeccion[tema[0]] || tema[0]),
      'Tema: ' + (tema[1] || 'Consulta general'),
      'Nombre: ' + (d.get('nombre') || '').trim(),
      'E-mail: ' + (d.get('email') || '').trim(),
      '',
      (d.get('comentarios') || '').trim()
    ];
    return { text: lines.join('\n'), subject: d.get('motivo') + ' – ' + (nombresSeccion[tema[0]] || tema[0]) };
  }

  function validate() {
    if (!form) return false;
    var ok = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(function (el) {
      var valid = el.value.trim() !== '' && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.classList.toggle('is-invalid', !valid);
      el.setAttribute('aria-invalid', String(!valid));
      if (!valid && ok) { el.focus(); ok = false; }
    });
    if (errorBox) errorBox.hidden = ok;
    return ok;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var m = buildMessage();
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(m.text), '_blank', 'noopener');
    });

    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('is-invalid') && e.target.value.trim() !== '') {
        e.target.classList.remove('is-invalid');
        e.target.removeAttribute('aria-invalid');
      }
    });
  }

  /* =========================================================
     ENVÍO POR CORREO (INTEGRACIÓN SERVERLESS VERCEL + RESEND)
     ========================================================= */
  async function handleSendEmail() {
    if (!validate()) return;

    var d = new FormData(form);
    var tema = (d.get('tema') || 'inmobiliaria|Consulta general').split('|');
    var payload = {
      _trap: (d.get('_trap') || '').trim(), // Honeypot anti-spam
      motivo: (d.get('motivo') || 'Consulta').trim(),
      area: (nombresSeccion[tema[0]] || tema[0]).trim(),
      tema: (tema[1] || 'Consulta general').trim(),
      nombre: (d.get('nombre') || '').trim(),
      email: (d.get('email') || '').trim(),
      comentarios: (d.get('comentarios') || '').trim()
    };

    showToast('Enviando consulta por correo...', 'info');

    try {
      var res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      var data = await res.json().catch(function () { return {}; });

      if (!res.ok || !data.ok) {
        throw new Error(data.error || ('Error en el servidor (' + res.status + ')'));
      }

      showToast('✓ ¡Consulta enviada por correo con éxito!', 'success');
      form.reset();
    } catch (err) {
      console.warn('Error al enviar correo:', err);
      showToast('No se pudo enviar automáticamente (' + err.message + '). Abriendo app de correo...', 'error');
      var m = buildMessage();
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.text);
    }
  }

  var sendMailBtn = document.getElementById('sendMail');
  if (sendMailBtn) {
    sendMailBtn.addEventListener('click', function (e) {
      e.preventDefault();
      handleSendEmail();
    });
  }

  /* =========================================================
     NOTIFICACIONES TOAST PERSONALIZADAS
     ========================================================= */
  var toastContainer = document.getElementById('toastContainer');

  function showToast(message, type) {
    if (!toastContainer) return;
    var t = type || 'info'; // 'success' | 'error' | 'info'
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + t;

    var iconSvg = '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    if (t === 'success') {
      iconSvg = '<svg class="ico" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (t === 'error') {
      iconSvg = '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    }

    toast.innerHTML = [
      '<div class="toast__icon">' + iconSvg + '</div>',
      '<div class="toast__msg">' + escapeHtml(message) + '</div>',
      '<button type="button" class="toast__close" aria-label="Cerrar">✕</button>'
    ].join('');

    var closeBtn = toast.querySelector('.toast__close');
    var isRemoved = false;
    function removeToast() {
      if (isRemoved) return;
      isRemoved = true;
      toast.classList.add('is-leaving');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }

    if (closeBtn) closeBtn.addEventListener('click', removeToast);
    toastContainer.appendChild(toast);
    setTimeout(removeToast, 3800);
  }

  /* =========================================================
     MODAL DE CONFIRMACIÓN PERSONALIZADO
     ========================================================= */
  var confirmModalBackdrop = document.getElementById('confirmModalBackdrop');
  var confirmModalTitle = document.getElementById('confirmModalTitle');
  var confirmModalText = document.getElementById('confirmModalText');
  var confirmModalCancel = document.getElementById('confirmModalCancel');
  var confirmModalOk = document.getElementById('confirmModalOk');
  var onConfirmCallback = null;

  function showConfirm(title, text, onConfirm) {
    if (!confirmModalBackdrop) {
      if (window.confirm(text || title)) onConfirm();
      return;
    }
    if (confirmModalTitle) confirmModalTitle.textContent = title || '¿Confirmar acción?';
    if (confirmModalText) confirmModalText.textContent = text || '¿Estás seguro de continuar?';
    onConfirmCallback = onConfirm;
    confirmModalBackdrop.classList.add('is-open');
    confirmModalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeConfirmModal() {
    if (!confirmModalBackdrop) return;
    confirmModalBackdrop.classList.remove('is-open');
    confirmModalBackdrop.setAttribute('aria-hidden', 'true');
    onConfirmCallback = null;
  }

  if (confirmModalCancel) confirmModalCancel.addEventListener('click', closeConfirmModal);
  if (confirmModalOk) {
    confirmModalOk.addEventListener('click', function () {
      var cb = onConfirmCallback;
      closeConfirmModal();
      if (typeof cb === 'function') cb();
    });
  }
  if (confirmModalBackdrop) {
    confirmModalBackdrop.addEventListener('click', function (e) {
      if (e.target === confirmModalBackdrop) closeConfirmModal();
    });
  }

  /* =========================================================
     9. PANEL DE ADMINISTRACIÓN
     ========================================================= */
  var openAdminBtn = document.getElementById('openAdminBtn');
  var adminModalBackdrop = document.getElementById('adminModalBackdrop');
  var adminCloseBtn = document.getElementById('adminCloseBtn');

  var adminLoginView = document.getElementById('adminLoginView');
  var adminLoginForm = document.getElementById('adminLoginForm');
  var adminPinInput = document.getElementById('adminPinInput');
  var adminLoginError = document.getElementById('adminLoginError');

  var adminDashboardView = document.getElementById('adminDashboardView');
  var tabPropsBtn = document.getElementById('tabPropsBtn');
  var tabWorksBtn = document.getElementById('tabWorksBtn');
  var propCountSpan = document.getElementById('propCount');
  var worksCountSpan = document.getElementById('worksCount');
  var adminAddNewBtn = document.getElementById('adminAddNewBtn');

  var adminPropsList = document.getElementById('adminPropsList');
  var adminPropsGrid = document.getElementById('adminPropsGrid');
  var adminWorksList = document.getElementById('adminWorksList');
  var adminWorksGrid = document.getElementById('adminWorksGrid');

  var adminItemFormView = document.getElementById('adminItemFormView');
  var adminItemForm = document.getElementById('adminItemForm');
  var adminFormTitle = document.getElementById('adminFormTitle');
  var adminCancelEditBtn = document.getElementById('adminCancelEditBtn');

  var adminItemType = document.getElementById('adminItemType');
  var adminItemId = document.getElementById('adminItemId');
  var adminFieldTitle = document.getElementById('adminFieldTitle');
  var adminFieldLocation = document.getElementById('adminFieldLocation');
  var adminFieldTag = document.getElementById('adminFieldTag');
  var adminFieldPrice = document.getElementById('adminFieldPrice');
  var adminFieldFullDesc = document.getElementById('adminFieldFullDesc');
  var adminFieldFeatures = document.getElementById('adminFieldFeatures');
  var adminFileInput = document.getElementById('adminFileInput');
  var adminFileStatus = document.getElementById('adminFileStatus');
  var adminImgPreviewContainer = document.getElementById('adminImgPreviewContainer');
  var adminImgPreview = document.getElementById('adminImgPreview');
  var adminRemoveImgBtn = document.getElementById('adminRemoveImgBtn');
  var adminPropSpecificFields = document.getElementById('adminPropSpecificFields');
  var adminStatusActive = document.getElementById('adminStatusActive');
  var adminStatusInactive = document.getElementById('adminStatusInactive');

  var currentAdminTab = 'props'; // 'props' | 'works'
  var currentFormImgData = ''; // Almacena el DataURL o URL de la imagen en edición

  function openAdminModal() {
    if (!adminModalBackdrop) return;
    adminModalBackdrop.classList.add('is-open');
    adminModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var isAuth = sessionStorage.getItem('taboada_admin_logged') === 'true';
    if (isAuth) {
      showAdminDashboard();
    } else {
      showAdminLogin();
    }
  }

  function closeAdminModal() {
    if (!adminModalBackdrop) return;
    adminModalBackdrop.classList.remove('is-open');
    adminModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showAdminLogin() {
    if (adminLoginView) adminLoginView.style.display = 'block';
    if (adminDashboardView) adminDashboardView.style.display = 'none';
    if (adminLoginError) adminLoginError.hidden = true;
    if (adminPinInput) { adminPinInput.value = ''; adminPinInput.focus(); }
  }

  function showAdminDashboard() {
    if (adminLoginView) adminLoginView.style.display = 'none';
    if (adminDashboardView) adminDashboardView.style.display = 'flex';
    switchAdminTab(currentAdminTab);
    renderAdminLists();
  }

  function switchAdminTab(tab) {
    currentAdminTab = tab;
    if (adminItemFormView) adminItemFormView.style.display = 'none';

    if (tab === 'props') {
      if (tabPropsBtn) tabPropsBtn.classList.add('is-active');
      if (tabWorksBtn) tabWorksBtn.classList.remove('is-active');
      if (adminPropsList) adminPropsList.style.display = 'block';
      if (adminWorksList) adminWorksList.style.display = 'none';
    } else {
      if (tabPropsBtn) tabPropsBtn.classList.remove('is-active');
      if (tabWorksBtn) tabWorksBtn.classList.add('is-active');
      if (adminPropsList) adminPropsList.style.display = 'none';
      if (adminWorksList) adminWorksList.style.display = 'block';
    }
  }

  function renderAdminLists() {
    if (propCountSpan) propCountSpan.textContent = currentProperties.length;
    if (worksCountSpan) worksCountSpan.textContent = currentWorks.length;

    // Render listado admin propiedades
    if (adminPropsGrid) {
      adminPropsGrid.innerHTML = '';
      currentProperties.forEach(function (prop) {
        var card = document.createElement('div');
        card.className = 'admin-item-card';
        var imgSrc = prop.image || PLACEHOLDER_IMG;
        var isAvail = prop.available !== false;
        var statusBadge = isAvail
          ? '<span class="admin-item-status-badge admin-item-status-badge--active">Disponible</span>'
          : '<span class="admin-item-status-badge admin-item-status-badge--inactive">No disponible</span>';
        var toggleBtnText = isAvail ? 'Pausar' : 'Activar';

        card.innerHTML = [
          '<div class="admin-item-card__media">',
          '  <img src="' + escapeHtml(imgSrc) + '" alt="">',
          '</div>',
          '<div class="admin-item-card__body">',
          '  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">',
          '    <div class="admin-item-card__title">' + escapeHtml(prop.title) + '</div>',
          '    ' + statusBadge,
          '  </div>',
          '  <div class="admin-item-card__meta">' + escapeHtml(prop.location || 'Sin ubicación') + (prop.tag ? ' · ' + escapeHtml(prop.tag) : '') + '</div>',
          '  <div class="admin-item-card__actions">',
          '    <button type="button" class="admin-btn admin-btn--toggle btn-toggle-prop" data-id="' + prop.id + '">' + toggleBtnText + '</button>',
          '    <button type="button" class="admin-btn admin-btn--ghost btn-edit-prop" data-id="' + prop.id + '">Editar</button>',
          '    <button type="button" class="admin-btn admin-btn--danger btn-del-prop" data-id="' + prop.id + '">Eliminar</button>',
          '  </div>',
          '</div>'
        ].join('');
        adminPropsGrid.appendChild(card);
      });

      adminPropsGrid.querySelectorAll('.btn-toggle-prop').forEach(function (b) {
        b.addEventListener('click', function () { toggleItemAvailability('props', b.getAttribute('data-id')); });
      });
      adminPropsGrid.querySelectorAll('.btn-edit-prop').forEach(function (b) {
        b.addEventListener('click', function () { openEditForm('props', b.getAttribute('data-id')); });
      });
      adminPropsGrid.querySelectorAll('.btn-del-prop').forEach(function (b) {
        b.addEventListener('click', function () { deleteItem('props', b.getAttribute('data-id')); });
      });
    }

    // Render listado admin obras
    if (adminWorksGrid) {
      adminWorksGrid.innerHTML = '';
      currentWorks.forEach(function (work) {
        var card = document.createElement('div');
        card.className = 'admin-item-card';
        var imgSrc = work.image || PLACEHOLDER_IMG;
        var isAvail = work.available !== false;
        var statusBadge = isAvail
          ? '<span class="admin-item-status-badge admin-item-status-badge--active">Disponible</span>'
          : '<span class="admin-item-status-badge admin-item-status-badge--inactive">No disponible</span>';
        var toggleBtnText = isAvail ? 'Pausar' : 'Activar';

        card.innerHTML = [
          '<div class="admin-item-card__media">',
          '  <img src="' + escapeHtml(imgSrc) + '" alt="">',
          '</div>',
          '<div class="admin-item-card__body">',
          '  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">',
          '    <div class="admin-item-card__title">' + escapeHtml(work.title) + '</div>',
          '    ' + statusBadge,
          '  </div>',
          '  <div class="admin-item-card__actions">',
          '    <button type="button" class="admin-btn admin-btn--toggle btn-toggle-work" data-id="' + work.id + '">' + toggleBtnText + '</button>',
          '    <button type="button" class="admin-btn admin-btn--ghost btn-edit-work" data-id="' + work.id + '">Editar</button>',
          '    <button type="button" class="admin-btn admin-btn--danger btn-del-work" data-id="' + work.id + '">Eliminar</button>',
          '  </div>',
          '</div>'
        ].join('');
        adminWorksGrid.appendChild(card);
      });

      adminWorksGrid.querySelectorAll('.btn-toggle-work').forEach(function (b) {
        b.addEventListener('click', function () { toggleItemAvailability('works', b.getAttribute('data-id')); });
      });
      adminWorksGrid.querySelectorAll('.btn-edit-work').forEach(function (b) {
        b.addEventListener('click', function () { openEditForm('works', b.getAttribute('data-id')); });
      });
      adminWorksGrid.querySelectorAll('.btn-del-work').forEach(function (b) {
        b.addEventListener('click', function () { deleteItem('works', b.getAttribute('data-id')); });
      });
    }
  }

  function setImgPreview(url) {
    currentFormImgData = url || '';
    if (!adminImgPreview || !adminImgPreviewContainer) return;
    if (url) {
      adminImgPreview.src = url;
      adminImgPreviewContainer.style.display = 'block';
    } else {
      adminImgPreview.src = '';
      adminImgPreviewContainer.style.display = 'none';
    }
  }

  function openEditForm(type, id) {
    if (!adminItemFormView) return;
    if (adminPropsList) adminPropsList.style.display = 'none';
    if (adminWorksList) adminWorksList.style.display = 'none';
    adminItemFormView.style.display = 'block';

    adminItemType.value = type;
    adminItemId.value = id || '';
    if (adminFileInput) adminFileInput.value = '';

    if (type === 'props') {
      if (adminPropSpecificFields) adminPropSpecificFields.style.display = 'block';
      if (id) {
        var p = currentProperties.find(function (item) { return item.id === id; });
        adminFormTitle.textContent = 'Editar Propiedad';
        adminFieldTitle.value = p ? p.title : '';
        adminFieldLocation.value = p ? (p.location || '') : '';
        adminFieldTag.value = p ? (p.tag || '') : '';
        adminFieldPrice.value = p ? (p.price || '') : '';
        adminFieldFullDesc.value = p ? (p.fullDesc || '') : '';
        adminFieldFeatures.value = p && p.features ? (Array.isArray(p.features) ? p.features.join(', ') : p.features) : '';
        setImgPreview(p ? (p.image || '') : '');
        if (adminFileStatus) adminFileStatus.textContent = (p && p.image) ? 'Imagen actual conservada' : 'Ningún archivo seleccionado';
        if (adminStatusActive && adminStatusInactive) {
          if (p && p.available === false) adminStatusInactive.checked = true;
          else adminStatusActive.checked = true;
        }
      } else {
        // Alta nueva: campos totalmente vacíos por defecto
        adminFormTitle.textContent = 'Nueva Propiedad';
        adminFieldTitle.value = '';
        adminFieldLocation.value = '';
        adminFieldTag.value = '';
        adminFieldPrice.value = '';
        adminFieldFullDesc.value = '';
        adminFieldFeatures.value = '';
        setImgPreview('');
        if (adminFileStatus) adminFileStatus.textContent = 'Ningún archivo seleccionado';
        if (adminStatusActive) adminStatusActive.checked = true;
      }
    } else {
      if (adminPropSpecificFields) adminPropSpecificFields.style.display = 'none';
      if (id) {
        var w = currentWorks.find(function (item) { return item.id === id; });
        adminFormTitle.textContent = 'Editar Obra de Ingeniería';
        adminFieldTitle.value = w ? w.title : '';
        setImgPreview(w ? (w.image || '') : '');
        if (adminFileStatus) adminFileStatus.textContent = (w && w.image) ? 'Imagen actual conservada' : 'Ningún archivo seleccionado';
        if (adminStatusActive && adminStatusInactive) {
          if (w && w.available === false) adminStatusInactive.checked = true;
          else adminStatusActive.checked = true;
        }
      } else {
        // Alta nueva de obra: campos vacíos por defecto
        adminFormTitle.textContent = 'Nueva Obra de Ingeniería';
        adminFieldTitle.value = '';
        setImgPreview('');
        if (adminFileStatus) adminFileStatus.textContent = 'Ningún archivo seleccionado';
        if (adminStatusActive) adminStatusActive.checked = true;
      }
    }
  }

  // Quitar imagen
  if (adminRemoveImgBtn) {
    adminRemoveImgBtn.addEventListener('click', function () {
      setImgPreview('');
      if (adminFileInput) adminFileInput.value = '';
      if (adminFileStatus) adminFileStatus.textContent = 'Ningún archivo seleccionado';
      showToast('Imagen quitada', 'info');
    });
  }

  // Subir imagen desde PC o Celular (comprime mediante canvas a JPEG optimizado)
  if (adminFileInput) {
    adminFileInput.addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;

      if (adminFileStatus) adminFileStatus.textContent = 'Procesando imagen...';

      var reader = new FileReader();
      reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
          try {
            var canvas = document.createElement('canvas');
            var maxDim = 1200;
            var w = img.width;
            var h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            var dataUrl = canvas.toDataURL('image/jpeg', 0.82);

            setImgPreview(dataUrl);
            if (adminFileStatus) adminFileStatus.textContent = 'Imagen lista (' + Math.round(dataUrl.length / 1024) + ' KB)';
            showToast('Imagen cargada correctamente', 'success');
          } catch (err) {
            console.error('Error optimizando imagen:', err);
            setImgPreview(event.target.result);
            if (adminFileStatus) adminFileStatus.textContent = 'Imagen seleccionada';
          }
        };
        img.onerror = function () {
          showToast('Error al leer el archivo de imagen', 'error');
          if (adminFileStatus) adminFileStatus.textContent = 'Error al cargar archivo';
        };
        img.src = event.target.result;
      };
      reader.onerror = function () {
        showToast('Error al procesar el archivo', 'error');
      };
      reader.readAsDataURL(file);
    });
  }

  if (adminCancelEditBtn) {
    adminCancelEditBtn.addEventListener('click', function () {
      switchAdminTab(currentAdminTab);
    });
  }

  if (adminItemForm) {
    adminItemForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var type = adminItemType.value;
      var id = adminItemId.value;
      var title = adminFieldTitle.value.trim();
      var img = currentFormImgData;

      if (!title) {
        showToast('Por favor completá el título.', 'error');
        if (adminFieldTitle) adminFieldTitle.focus();
        return;
      }

      var isAvailable = adminStatusActive ? adminStatusActive.checked : true;

      if (type === 'props') {
        var feats = adminFieldFeatures.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        var propData = {
          id: id || ('prop-' + Date.now()),
          title: title,
          location: adminFieldLocation.value.trim(),
          tag: adminFieldTag.value.trim(),
          price: adminFieldPrice.value.trim(),
          fullDesc: adminFieldFullDesc.value.trim(),
          features: feats,
          image: img,
          available: isAvailable
        };

        if (id) {
          var idx = currentProperties.findIndex(function (p) { return p.id === id; });
          if (idx !== -1) currentProperties[idx] = propData;
        } else {
          currentProperties.unshift(propData);
        }
        saveProperties(currentProperties);
        renderPropertiesFrontend();
        showToast(id ? 'Propiedad modificada con éxito' : 'Propiedad creada con éxito', 'success');
      } else {
        var workData = {
          id: id || ('work-' + Date.now()),
          title: title,
          image: img,
          available: isAvailable
        };

        if (id) {
          var wIdx = currentWorks.findIndex(function (w) { return w.id === id; });
          if (wIdx !== -1) currentWorks[wIdx] = workData;
        } else {
          currentWorks.unshift(workData);
        }
        saveWorks(currentWorks);
        renderWorksFrontend();
        showToast(id ? 'Obra modificada con éxito' : 'Obra creada con éxito', 'success');
      }

      switchAdminTab(type);
      renderAdminLists();
    });
  }

  function deleteItem(type, id) {
    var itemTitle = '';
    if (type === 'props') {
      var p = currentProperties.find(function (item) { return item.id === id; });
      itemTitle = p ? ('"' + p.title + '"') : 'esta propiedad';
    } else {
      var w = currentWorks.find(function (item) { return item.id === id; });
      itemTitle = w ? ('"' + w.title + '"') : 'esta obra';
    }

    showConfirm(
      '¿Eliminar ' + (type === 'props' ? 'propiedad' : 'obra') + '?',
      '¿Estás seguro de que deseás eliminar ' + itemTitle + '? Esta acción no se puede deshacer.',
      function () {
        if (type === 'props') {
          currentProperties = currentProperties.filter(function (p) { return p.id !== id; });
          saveProperties(currentProperties);
          renderPropertiesFrontend();
        } else {
          currentWorks = currentWorks.filter(function (w) { return w.id !== id; });
          saveWorks(currentWorks);
          renderWorksFrontend();
        }
        renderAdminLists();
        showToast('Elemento eliminado correctamente', 'info');
      }
    );
  }

  function toggleItemAvailability(type, id) {
    if (type === 'props') {
      var p = currentProperties.find(function (item) { return item.id === id; });
      if (!p) return;
      p.available = (p.available === false) ? true : false;
      saveProperties(currentProperties);
      renderPropertiesFrontend();
      showToast(p.available ? 'Propiedad marcada como disponible' : 'Propiedad en pausa (no disponible)', 'info');
    } else {
      var w = currentWorks.find(function (item) { return item.id === id; });
      if (!w) return;
      w.available = (w.available === false) ? true : false;
      saveWorks(currentWorks);
      renderWorksFrontend();
      showToast(w.available ? 'Obra marcada como disponible' : 'Obra en pausa (no disponible)', 'info');
    }
    renderAdminLists();
  }

  var adminLoginAttempts = 0;
  var adminLockoutUntil = 0;

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var now = Date.now();
      if (adminLockoutUntil > now) {
        var secs = Math.ceil((adminLockoutUntil - now) / 1000);
        showToast('Demasiados intentos. Esperá ' + secs + ' segundos.', 'error');
        return;
      }

      var pin = (adminPinInput.value || '').trim();
      if (!pin) {
        showToast('Por favor ingresá la clave.', 'error');
        return;
      }

      var submitBtn = adminLoginForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        var res = await fetch('/api/admin-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: pin })
        });

        var data = await res.json().catch(function () { return {}; });

        if (res.ok && data.ok) {
          adminLoginAttempts = 0;
          sessionStorage.setItem('taboada_admin_logged', 'true');
          if (data.token) sessionStorage.setItem('taboada_admin_token', data.token);
          showAdminDashboard();
          showToast('Acceso correcto al panel de administración', 'success');
        } else {
          adminLoginAttempts++;
          if (adminLoginAttempts >= 5) {
            adminLockoutUntil = Date.now() + 30000; // Bloqueo de 30 segundos
            showToast('Bloqueo de seguridad: 5 intentos incorrectos. Esperá 30s.', 'error');
          } else {
            showToast('Clave incorrecta (' + (5 - adminLoginAttempts) + ' intentos restantes)', 'error');
          }
          if (adminLoginError) adminLoginError.hidden = false;
          if (adminPinInput) { adminPinInput.select(); }
        }
      } catch (err) {
        console.error('Error al autenticar:', err);
        showToast('Error de conexión al verificar credenciales.', 'error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  if (openAdminBtn) openAdminBtn.addEventListener('click', openAdminModal);
  if (adminCloseBtn) adminCloseBtn.addEventListener('click', closeAdminModal);
  if (adminModalBackdrop) {
    adminModalBackdrop.addEventListener('click', function (e) {
      if (e.target === adminModalBackdrop) closeAdminModal();
    });
  }

  if (tabPropsBtn) {
    tabPropsBtn.addEventListener('click', function () { switchAdminTab('props'); });
  }
  if (tabWorksBtn) {
    tabWorksBtn.addEventListener('click', function () { switchAdminTab('works'); });
  }
  if (adminAddNewBtn) {
    adminAddNewBtn.addEventListener('click', function () {
      openEditForm(currentAdminTab, null);
    });
  }

  /* =========================================================
     10. INICIALIZACIÓN
     ========================================================= */
  renderPropertiesFrontend();
  renderWorksFrontend();

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
