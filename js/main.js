/* Emanuelle Costa — Portfólio editorial
   Sem dependências ou frameworks. Pronto para hospedagem estática.
   Edite os projetos em PROJECTS; leia o README para trocar vídeos. */
'use strict';

document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionBehavior = () => prefersReducedMotion.matches ? 'auto' : 'smooth';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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
  imageElement.removeAttribute('src');
  if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  currentProject = null;
});
window.addEventListener('keydown', event => {
  if (!dialog?.open) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); currentPhoto++; showPhoto(); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); currentPhoto--; showPhoto(); }
});

// VÍDEOS VERTICAIS. Os três arquivos .mp4 são apenas prévias DEMONSTRATIVAS
// montadas com fotos dela. Trocar arquivos na pasta assets/videos/ para
// inserir trabalhos reais da Emanuelle sem mexer no layout.
const reels = $('#reel-carousel');
const reelCards = $$('.reel-card', reels);
const prevReel = $('#reel-prev');
const nextReel = $('#reel-next');
const reelProgress = $('#reel-progress');
let reelsVisible = false;
let carouselScheduled = false;
let manuallyPausedCard = null;

function closestReelIndex() {
  if (!reels || !reelCards.length) return 0;
  const viewportMid = reels.getBoundingClientRect().left + reels.clientWidth * .5;
  return reelCards.reduce((best, card, index) => {
    const rect = card.getBoundingClientRect();
    const diff = Math.abs(rect.left + rect.width / 2 - viewportMid);
    return diff < best.diff ? { index, diff } : best;
  }, { index: 0, diff: Infinity }).index;
}
function pauseOtherReels(exceptCard = null) {
  reelCards.forEach(card => {
    if (card !== exceptCard) {
      const video = $('video', card);
      video?.pause();
      updatePlayLabel(card, false);
    }
  });
}
function updatePlayLabel(card, playing) {
  const button = $('.reel-toggle', card);
  if (!button) return;
  button.setAttribute('aria-label', playing ? 'Pausar prévia' : 'Reproduzir prévia');
  button.setAttribute('aria-pressed', String(playing));
  const symbol = $('span', button);
  if (symbol) symbol.textContent = playing ? 'Ⅱ' : '▶';
}
function tryPlay(card) {
  if (!card) return;
  const video = $('video', card);
  if (!video) return;
  pauseOtherReels(card);
  const result = video.play();
  if (result?.then) {
    result.then(() => updatePlayLabel(card, true)).catch(() => updatePlayLabel(card, false));
  } else updatePlayLabel(card, true);
}
function syncReels() {
  carouselScheduled = false;
  if (!reels) return;
  const maxScroll = Math.max(1, reels.scrollWidth - reels.clientWidth);
  const ratio = Math.max(0, Math.min(1, reels.scrollLeft / maxScroll));
  // Segmento indica a parte visível da faixa.
  const visiblePortion = Math.min(1, reels.clientWidth / reels.scrollWidth);
  const progress = visiblePortion + ratio * (1 - visiblePortion);
  reelProgress.style.transform = `scaleX(${progress.toFixed(3)})`;
  prevReel.disabled = reels.scrollLeft < 8;
  nextReel.disabled = reels.scrollLeft > maxScroll - 8;
  if (!reelsVisible || document.hidden || prefersReducedMotion.matches || dialog?.open) {
    pauseOtherReels();
    return;
  }
  const active = reelCards[closestReelIndex()];
  if (manuallyPausedCard === active) pauseOtherReels();
  else tryPlay(active);
}
function scheduleReels() {
  if (!carouselScheduled) {
    carouselScheduled = true;
    window.requestAnimationFrame(syncReels);
  }
}
function scrollReels(direction) {
  if (!reels || !reelCards.length) return;
  const cardWidth = reelCards[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(reels).gap) || 0;
  manuallyPausedCard = null;
  reels.scrollBy({ left: direction * (cardWidth + gap), behavior: motionBehavior() });
}
prevReel?.addEventListener('click', () => scrollReels(-1));
nextReel?.addEventListener('click', () => scrollReels(1));
reels?.addEventListener('scroll', scheduleReels, { passive: true });
reels?.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); scrollReels(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); scrollReels(1); }
});
$$('.reel-toggle', reels).forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.reel-card');
  const video = $('video', card);
  if (video.paused) {
    manuallyPausedCard = null;
    tryPlay(card);
  } else {
    manuallyPausedCard = card;
    video.pause();
    updatePlayLabel(card, false);
  }
}));
reelCards.forEach(card => {
  const video = $('video', card);
  video?.addEventListener('error', () => updatePlayLabel(card, false));
});
if ('IntersectionObserver' in window && reels) {
  const reelObserver = new IntersectionObserver(entries => {
    reelsVisible = entries[0]?.isIntersecting ?? false;
    scheduleReels();
  }, { threshold: .28 });
  reelObserver.observe(reels);
} else reelsVisible = true;
window.addEventListener('resize', scheduleReels, { passive: true });
document.addEventListener('visibilitychange', scheduleReels);
dialog?.addEventListener('close', scheduleReels);
scheduleReels();
