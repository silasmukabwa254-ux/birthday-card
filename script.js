const openGift = document.getElementById('openGift');
const giftCard = document.getElementById('giftBox');
const giftFront = document.getElementById('giftFront');
const viewPhotosButton = document.getElementById('viewPhotos');
const backgroundLayer = document.getElementById('backgroundLayer');
const introScreen = document.getElementById('intro-screen');
const pageShell = document.getElementById('pageShell');
const confettiCanvas = document.getElementById('confettiCanvas');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateIntro() {
  window.setTimeout(() => {
    introScreen.classList.add('hidden');
    introScreen.setAttribute('aria-hidden', 'true');
    pageShell.classList.remove('hidden');
  }, prefersReducedMotion ? 0 : 1800);
}

function createConfettiBurst() {
  if (prefersReducedMotion) return;
  const canvas = confettiCanvas;
  const ctx = canvas.getContext('2d');
  const pieces = [];
  const count = 32;
  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;

  for (let i = 0; i < count; i += 1) {
    pieces.push({
      x: width / 2 + (Math.random() - 0.5) * 240,
      y: height / 2 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 2.5,
      vy: Math.random() * -5 - 1.5,
      size: Math.random() * 10 + 6,
      rotation: Math.random() * 360,
      color: ['#d4af37', '#f4e7aa', '#c9a0f2', '#f8f8f8'][Math.floor(Math.random() * 4)],
      life: 80 + Math.random() * 30,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    pieces.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += 0.12;
      piece.rotation += 3;
      piece.life -= 1;
      const alpha = Math.max(piece.life / 100, 0);
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation * Math.PI / 180);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size / 2);
      ctx.restore();
    });
    if (pieces.some((piece) => piece.life > 0)) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  draw();
}

function toggleGift() {
  const isOpen = giftCard.classList.toggle('open');
  openGift.textContent = isOpen ? 'Close Gift' : 'Open Your Gift';
  giftFront.setAttribute('aria-expanded', String(isOpen));
  giftFront.setAttribute('aria-label', isOpen ? 'Close birthday gift' : 'Open birthday gift');
  if (isOpen) {
    createConfettiBurst();
    if (viewPhotosButton) viewPhotosButton.focus();
  } else {
    if (giftModal.classList.contains('open')) {
      closeModal();
    }
  }
}
 
function openPhotoModal() {
  giftModal.classList.add('open');
  giftModal.setAttribute('aria-hidden', 'false');
  giftModal.removeAttribute('inert');
  if (modalClose) {
    modalClose.focus();
  }
}
 
function createSparkle() {
  if (prefersReducedMotion || !backgroundLayer) return;
  const sparkle = document.createElement('span');
  sparkle.className = 'sparkle';
  const size = Math.random() * 5 + 6;
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  sparkle.style.left = `${Math.random() * 80 + 10}%`;
  sparkle.style.bottom = '-5%';
  sparkle.style.animationDuration = `${Math.random() * 3 + 4}s`;
  backgroundLayer.appendChild(sparkle);
 
  sparkle.addEventListener('animationend', () => {
    sparkle.remove();
  });
}
 
setInterval(createSparkle, prefersReducedMotion ? 2000 : 800);
 
// modal interactions
const giftModal = document.getElementById('giftModal');
const modalClose = document.getElementById('modalClose');
const carouselTrack = document.getElementById('carouselTrack');
const carouselCaption = document.getElementById('carouselCaption');
const carouselDots = document.getElementById('carouselDots');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
let currentSlide = 0;
 
function updateCarousel() {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
    slide.setAttribute('aria-hidden', index !== currentSlide);
  });
  const activeCaption = slides[currentSlide]?.dataset.caption || '';
  if (carouselCaption) carouselCaption.textContent = activeCaption;
 
  if (carouselDots) {
    carouselDots.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-dot${index === currentSlide ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Show photo ${index + 1}`);
      dot.addEventListener('click', () => setSlide(index));
      carouselDots.appendChild(dot);
    });
  }
}
 
function setSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  updateCarousel();
}
 
function closeModal() {
  giftModal.classList.remove('open');
  giftModal.setAttribute('aria-hidden', 'true');
  giftModal.setAttribute('inert', '');
  openGift.textContent = giftCard.classList.contains('open') ? 'Close Gift' : 'Open Your Gift';
  openGift.focus();
}
 
modalClose && modalClose.addEventListener('click', closeModal);
 
if (viewPhotosButton) {
  viewPhotosButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!giftCard.classList.contains('open')) {
      giftCard.classList.add('open');
      openGift.textContent = 'Close Gift';
      giftFront.setAttribute('aria-expanded', 'true');
      giftFront.setAttribute('aria-label', 'Close birthday gift');
    }
    setSlide(0);
    openPhotoModal();
  });
}
 
giftFront && giftFront.addEventListener('click', toggleGift);
giftFront && giftFront.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleGift();
  }
});
carouselPrev && carouselPrev.addEventListener('click', () => setSlide(currentSlide - 1));
carouselNext && carouselNext.addEventListener('click', () => setSlide(currentSlide + 1));
 
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (giftModal.classList.contains('open')) {
      closeModal();
      return;
    }
  }
 
  if (giftModal.classList.contains('open')) {
    if (e.key === 'ArrowRight') {
      setSlide(currentSlide + 1);
    }
    if (e.key === 'ArrowLeft') {
      setSlide(currentSlide - 1);
    }
  }
});
 
openGift.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleGift();
});
 
window.addEventListener('load', () => {
  animateIntro();
  if (slides.length) updateCarousel();
});
