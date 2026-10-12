/* Emanuelle Costa — Portfólio editorial
   Sem dependências ou frameworks. Pronto para hospedagem estática.
   Edite os projetos em PROJECTS; leia o README para trocar vídeos. */
'use strict';

document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionBehavior = () => prefersReducedMotion.matches ? 'auto' : 'smooth';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// SCROLL SUAVE PREMIUM (somente PC com mouse).
// No celular, mantenha a inercia nativa: mais previsivel e leve.
// A biblioteca e opcional: se o CDN falhar, o site continua funcionando.
const desktopWheel = window.matchMedia('(min-width: 881px) and (pointer: fine)');
let smoothScroll = null;
function configureSmoothScroll() {
  const allowed = desktopWheel.matches && !prefersReducedMotion.matches && typeof window.Lenis === 'function';
  if (allowed && !smoothScroll) {
    smoothScroll = new window.Lenis({
      autoRaf: true,
      anchors: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.095,
      wheelMultiplier: 1
    });
    if (document.body.classList.contains('dialog-open')) smoothScroll.stop();
  } else if (!allowed && smoothScroll) {
    smoothScroll.destroy();
    smoothScroll = null;
  }
}
configureSmoothScroll();
desktopWheel.addEventListener?.('change', configureSmoothScroll);
prefersReducedMotion.addEventListener?.('change', configureSmoothScroll);

// MODO CONFORTO VISUAL: alterna entre o editorial original e tons suaves.
const themeToggle = $('#theme-toggle');
function syncVisualMode() {
  const soft = document.documentElement.dataset.theme === 'soft';
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(soft));
    themeToggle.setAttribute('aria-label', soft ? 'Desativar modo conforto visual' : 'Ativar modo conforto visual');
    themeToggle.title = soft ? 'Voltar ao visual original' : 'Ativar conforto visual';
  }
  $('meta[name="theme-color"]')?.setAttribute('content', soft ? '#d6cec4' : '#f4f0e9');
}
themeToggle?.addEventListener('click', () => {
  const soft = document.documentElement.dataset.theme !== 'soft';
  if (soft) document.documentElement.dataset.theme = 'soft';
  else delete document.documentElement.dataset.theme;
  try { localStorage.setItem('emanuelle-visual-mode', soft ? 'soft' : 'light'); }
  catch (_) { /* Funciona mesmo com armazenamento indisponível. */ }
  syncVisualMode();
});
syncVisualMode();

// ATUALIZAÇÃO AUTOMÁTICA DO ANO
$$('.current-year').forEach(el => { el.textContent = String(new Date().getFullYear()); });

// NAVEGAÇÃO MOBILE: mantém acessibilidade e fecha ao escolher seção.
const menuToggle = $('#menu-toggle');
const mobileMenu = $('#mobile-menu');
function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.inert = !open;
  if (open) {
    const first = $('a', mobileMenu);
    first?.focus({ preventScroll: true });
  } else if (mobileMenu.contains(document.activeElement)) {
    menuToggle.focus({ preventScroll: true });
  }
}
menuToggle?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
$$('a', mobileMenu).forEach(link => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 880 && document.body.classList.contains('menu-open')) setMenu(false);
}, { passive: true });

// PROGRESSO DE LEITURA — transform em vez de recalcular larguras.
const progress = $('#scroll-progress');
let progressScheduled = false;
function updateProgress() {
  const length = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const percent = Math.max(0, Math.min(1, window.scrollY / length));
  if (progress) progress.style.transform = `scaleX(${percent.toFixed(4)})`;
  progressScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!progressScheduled) {
    progressScheduled = true;
    window.requestAnimationFrame(updateProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();

// ENTRADAS DELICADAS — só observa os elementos próximos da tela.
const revealElements = $$('.reveal');
if (!('IntersectionObserver' in window) || prefersReducedMotion.matches) {
  revealElements.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.085, rootMargin: '0px 0px -32px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));
}

// GALERIAS REAIS DO PDF. Amplie os arrays ao receber novos ensaios.
const path = filename => `assets/images/${filename}.webp`;
const PROJECTS = {
  gestante: {
    category: 'ENSAIO FOTOGRÁFICO · MATERNIDADE',
    title: 'À espera.',
    description: 'Um dos primeiros ensaios de Emanuelle: um registro de gestante em família, cercado por natureza, luz e expectativa. Fotografias feitas para guardar um período que passa tão rápido.',
    photos: [
      { src: path('maternidade-01'), alt: 'Gestante sentada à beira da estrada em paisagem montanhosa', caption: 'À espera — registro 01' },
      { src: path('maternidade-02'), alt: 'Gestante de pé diante de montanhas ao ar livre', caption: 'À espera — registro 02' }
    ]
  },
  infancia: {
    category: 'FOTOGRAFIA · INFÂNCIA E AFETO',
    title: 'Pequenos começos.',
    description: 'A delicadeza das primeiras semanas, as pequenas descobertas e a beleza dos gestos cotidianos. Uma coleção afetiva de fotografias em família.',
    photos: [
      { src: path('recem-nascido-01'), alt: 'Bebê recém-nascido em close com roupa rosada', caption: 'Pequenos começos — registro 01' },
      { src: path('recem-nascido-02'), alt: 'Bebê deitado em manta verde ao lado de um urso de pelúcia', caption: 'Pequenos começos — registro 02' },
      { src: path('infancia-01'), alt: 'Criança sentada em cama com brinquedo colorido', caption: 'Pequenos começos — registro 03' }
    ]
  },
  natureza: {
    category: 'FOTOGRAFIA AUTORAL · PAISAGENS',
    title: 'Entre céu e terra.',
    description: 'Foi observando paisagens pelo celular que tudo começou. Céus imensos, mudanças de luz e lugares silenciosos continuam presentes no olhar de Emanuelle.',
    photos: [
      { src: path('paisagem-ceu'), alt: 'Pôr do sol em céu lilás e alaranjado', caption: 'Entre céu e terra — registro 01' },
      { src: path('paisagem-montanha'), alt: 'Montanha, árvores e nuvens no horizonte', caption: 'Entre céu e terra — registro 02' },
      { src: path('paisagem-campo'), alt: 'Árvore solitária e céu de tempestade sobre o campo', caption: 'Entre céu e terra — registro 03' },
      { src: path('observacao'), alt: 'Pássaro alaranjado em um cercado', caption: 'Entre céu e terra — registro 04' }
    ]
  },
  cotidiano: {
    category: 'REGISTROS · PESSOAS E MEMÓRIAS',
    title: 'Entre pessoas.',
    description: 'Porque toda fotografia é também sobre quem estava lá. Um registro de grupo presente no portfólio original de Emanuelle.',
    photos: [
      { src: path('comunidade'), alt: 'Grande grupo reunido para uma fotografia coletiva', caption: 'Entre pessoas — registro 01' }
    ]
  }
};

const dialog = $('#project-dialog');
const imageElement = $('#dialog-image');
const captionElement = $('#dialog-figcaption');
const counterElement = $('#dialog-counter');
let currentProject = null;
let currentPhoto = 0;
let previousFocus = null;

function showPhoto() {
  if (!currentProject) return;
  const photos = currentProject.photos;
  currentPhoto = (currentPhoto + photos.length) % photos.length;
  const photo = photos[currentPhoto];
  imageElement.src = photo.src;
  imageElement.alt = photo.alt;
  captionElement.textContent = photo.caption;
  counterElement.textContent = `${String(currentPhoto + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
}
function openProject(key) {
  const project = PROJECTS[key];
  if (!project || !dialog) return;
  previousFocus = document.activeElement;
  currentProject = project;
  currentPhoto = 0;
  $('#dialog-category').textContent = project.category;
  $('#dialog-project-title').textContent = project.title;
  $('#dialog-project-description').textContent = project.description;
  showPhoto();
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    document.body.classList.add('dialog-open');
    smoothScroll?.stop();
    $('#dialog-close').focus({ preventScroll: true });
  } else {
    // Dialog nativo funciona em todos os navegadores modernos atuais.
    window.open(project.photos[0].src, '_blank', 'noopener,noreferrer');
  }
}
function closeProject() { if (dialog?.open) dialog.close(); }
$$('[data-project]').forEach(el => el.addEventListener('click', () => openProject(el.dataset.project)));
$('#dialog-close')?.addEventListener('click', closeProject);
$('#dialog-prev')?.addEventListener('click', () => { currentPhoto--; showPhoto(); });
$('#dialog-next')?.addEventListener('click', () => { currentPhoto++; showPhoto(); });
dialog?.addEventListener('click', event => { if (event.target === dialog) closeProject(); });
dialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  smoothScroll?.start();
  imageElement.removeAttribute('src');
  if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  currentProject = null;
});
window.addEventListener('keydown', event => {
  if (!dialog?.open) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); currentPhoto++; showPhoto(); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); currentPhoto--; showPhoto(); }
});

// GALERIA MISTA: 2 FILMES HORIZONTAIS + 1 VERTICAL.
// Os MP4 reais aparecem em movimento (prévia muda) quando entram na tela;
// tocar no botão abre reprodução com áudio e controles do navegador.
const filmCards = $$('.film-card');
const reduceFilmsMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveFilmsData = navigator.connection?.saveData === true;
const previewAllowed = !reduceFilmsMotion && !saveFilmsData;
const filmVisible = new WeakMap();
let activeFilm = null;

function pauseOtherFilms(except) {
  filmCards.forEach(card => {
    if (card === except) return;
    const vid = $('.film-player', card);
    if (vid) vid.pause();
    card.classList.remove('film-playing');
    if (vid) { vid.muted = true; vid.controls = false; vid.loop = true; }
  });
}
function startFilmPreview(card) {
  if (!previewAllowed || activeFilm === card || !filmVisible.get(card)) return;
  const vid = $('.film-player', card);
  if (!vid || vid.readyState < 1 || !card.classList.contains('film-ready')) return;
  vid.muted = true;
  vid.loop = true;
  vid.controls = false;
  const started = vid.play();
  if (started?.catch) started.catch(() => {});
}
filmCards.forEach(card => {
  const video = $('.film-player', card);
  const button = $('.film-play', card);
  if (!video || !button) return;
  filmVisible.set(card, false);

  function markReady() {
    card.classList.add('film-ready');
    button.disabled = false;
    startFilmPreview(card);
  }
  function showVideo() { card.classList.add('film-preview-ready'); }
  function showError() {
    card.classList.remove('film-ready','film-preview-ready','film-playing');
    button.disabled = true;
    const status = $('.film-unavailable', card);
    if (status) status.textContent = 'VÍDEO INDISPONÍVEL';
  }
  video.addEventListener('loadedmetadata', markReady);
  video.addEventListener('loadeddata', showVideo);
  video.addEventListener('error', showError);
  video.addEventListener('playing', showVideo);
  // Metadata pode chegar antes de o JS ser executado: não prender o play.
  if (video.readyState >= 1) markReady();
  if (video.readyState >= 2) showVideo();

  button.addEventListener('click', async () => {
    if (!card.classList.contains('film-ready')) {
      try { video.load(); } catch (_) {}
      return;
    }
    activeFilm = card;
    pauseOtherFilms(card);
    video.loop = false;
    video.muted = false;
    video.controls = true;
    card.classList.add('film-playing');
    try {
      video.currentTime = 0;
      await video.play();
    } catch (_) {
      card.classList.remove('film-playing');
      video.muted = true;
      video.controls = false;
      video.loop = true;
      activeFilm = null;
      startFilmPreview(card);
    }
  });
  video.addEventListener('ended', () => {
    if (activeFilm === card) activeFilm = null;
    card.classList.remove('film-playing');
    video.muted = true;
    video.controls = false;
    video.loop = true;
    startFilmPreview(card);
  });
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = entry.target;
      const visible = entry.isIntersecting;
      filmVisible.set(card, visible);
      if (visible) startFilmPreview(card);
      else if (activeFilm !== card) $('.film-player',card)?.pause();
    });
  }, {threshold: .15, rootMargin: '100px 0px 100px 0px'});
  filmCards.forEach(card => observer.observe(card));
} else filmCards.forEach(card => {filmVisible.set(card,true);startFilmPreview(card);});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  filmCards.forEach(card => $('.film-player', card)?.pause());
});


// PWA: permite instalar pela opção do navegador e abrir conteúdo básico offline.
// Service workers exigem HTTPS na hospedagem (localhost durante desenvolvimento).
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      // A instalação fica indisponível se o navegador bloquear service workers.
    });
  });
}
