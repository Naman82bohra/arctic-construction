/* ==========================================
   ARCTIC CONSTRUCTION
   3D ENHANCED — script.js
========================================== */

/* ==========================================
   THREE.JS HERO PARTICLE FIELD
========================================== */
(function initHeroCanvas() {

  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  /* Resize handler */
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  onResize();
  window.addEventListener('resize', onResize);

  /* ---- PARTICLES ---- */
  const PARTICLE_COUNT = 1800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const speeds    = new Float32Array(PARTICLE_COUNT);

  const gold  = new THREE.Color(0xC89B3C);
  const white = new THREE.Color(0xffffff);
  const dim   = new THREE.Color(0x444444);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    speeds[i] = 0.003 + Math.random() * 0.006;

    const t = Math.random();
    const c = t < 0.25 ? gold : t < 0.4 ? white : dim;
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* ---- WIREFRAME CUBE ---- */
  const cubeEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2));
  const cubeMat   = new THREE.LineBasicMaterial({ color: 0xC89B3C, transparent: true, opacity: 0.15 });
  const wireframe = new THREE.LineSegments(cubeEdges, cubeMat);
  wireframe.position.set(3.5, -0.5, -2);
  scene.add(wireframe);

  /* ---- WIREFRAME OCTAHEDRON ---- */
  const octEdges = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.2));
  const octMat   = new THREE.LineBasicMaterial({ color: 0xC89B3C, transparent: true, opacity: 0.1 });
  const octahedron = new THREE.LineSegments(octEdges, octMat);
  octahedron.position.set(-4, 1.5, -3);
  scene.add(octahedron);

  /* ---- MOUSE PARALLAX ---- */
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ---- RENDER LOOP ---- */
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame += 0.005;

    // Drift particles upward
    const pos = geo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.4;
      if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = -7;
    }
    geo.attributes.position.needsUpdate = true;

    particles.rotation.y = frame * 0.03;
    particles.rotation.x = frame * 0.01;

    wireframe.rotation.x  += 0.004;
    wireframe.rotation.y  += 0.006;
    octahedron.rotation.x -= 0.003;
    octahedron.rotation.y += 0.005;

    // Smooth parallax follow
    camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

})();

/* ==========================================
   PRELOADER — 3D CONSTRUCTION CUBE
========================================== */
window.addEventListener('load', () => {

  const preloader = document.getElementById('preloader');
  const bar       = document.getElementById('preloaderBar');

  const DURATION = 2500; // 2.5s
  const start    = performance.now();

  /* Animate progress bar smoothly */
  function updateBar(now) {
    const elapsed  = now - start;
    const progress = Math.min((elapsed / DURATION) * 100, 100);
    bar.style.width = progress + '%';

    if (progress < 100) {
      requestAnimationFrame(updateBar);
    } else {
      /* Slight hold at 100% then fade out */
      setTimeout(() => {
        preloader.classList.add('hide');
        setTimeout(() => {
          preloader.style.display = 'none';
          initHeroAnim();
        }, 900);
      }, 200);
    }
  }

  requestAnimationFrame(updateBar);

});

/* ==========================================
   HERO ENTRANCE ANIMATION (GSAP)
========================================== */
function initHeroAnim() {

  gsap.set(['#heroEyebrow', '#heroH1', '#heroP', '#heroBtns'], { y: 30 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('#heroEyebrow', { opacity: 1, y: 0, duration: 0.7, delay: 0.1 })
    .to('#heroH1',       { opacity: 1, y: 0, duration: 0.9 }, '-=0.4')
    .to('#heroP',        { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('#heroBtns',     { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

}

/* ==========================================
   3D TILT EFFECT ON CARDS
========================================== */
document.querySelectorAll('.tilt-card').forEach(card => {

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x  = e.clientX - rect.left;
    const y  = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) *  8;
    card.style.transform =
      `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform =
      'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  });

});

/* ==========================================
   SCROLL REVEAL (IntersectionObserver)
========================================== */
const revealEls = document.querySelectorAll('.reveal, .reveal-left');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Stagger delay per card group ---- */
[
  '.services-grid',
  '.stats',
  '.projects-grid',
  '.process-grid',
  '.why-grid',
  '.testimonial-grid'
].forEach(selector => {
  const container = document.querySelector(selector);
  if (!container) return;
  container.querySelectorAll('.reveal').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.07) + 's';
  });
});

/* ==========================================
   ANIMATED COUNTERS
========================================== */
let counterStarted = false;

function startCounters() {
  document.querySelectorAll('.counter').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const inc = target / 80;

    const update = () => {
      if (count < target) {
        count += inc;
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }
    };
    update();
  });
}

const statsEl = document.querySelector('.stats');
if (statsEl) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counterStarted) {
      counterStarted = true;
      startCounters();
    }
  }, { threshold: 0.3 });
  statsObserver.observe(statsEl);
}

/* ==========================================
   NAVBAR — SCROLL GLASS EFFECT + ACTIVE LINK
========================================== */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {

  /* Glass effect */
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Active link highlight */
  let current = '';
  sections.forEach(s => {
    if (pageYOffset >= s.offsetTop - 200) {
      current = s.getAttribute('id');
    }
  });

  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('active');
    }
  });

});

/* ==========================================
   FAQ ACCORDION
========================================== */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ==========================================
   SMOOTH SCROLL
========================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ==========================================
   CONSOLE
========================================== */
console.log('Arctic Construction 3D — Loaded ✦');
