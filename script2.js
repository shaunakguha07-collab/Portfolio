gsap.registerPlugin(ScrollTrigger);

/* --- HUD NAVBAR SYSTEM --- */
const nav = document.querySelector('.hud-nav');
gsap.from(nav, { y: -50, opacity: 0, duration: 1, ease: "power2.out", delay: 0.5 });

// Active link updating
window.addEventListener('scroll', () => {
  let current = '';
  const scrollPosition = window.pageYOffset;
  const sections = document.querySelectorAll('section, header');

  // Check if at the bottom of the page
  if ((window.innerHeight + scrollPosition) >= document.body.offsetHeight - 50) {
    // If at bottom, set current to the last section's ID (Contact)
    current = '#' + sections[sections.length - 1].getAttribute('id');
  } else {
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollPosition >= sectionTop - 150) {
        current = '#' + section.getAttribute('id');
      }
    });
  }

  document.querySelectorAll('.hud-link').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === current) {
      a.classList.add('active');
    }
  });
});

/* --- HERO SEQUENCE --- */
const heroTl = gsap.timeline();

heroTl.from('.player-card', { x: -50, opacity: 0, duration: 0.8, delay: 0.2 })
  .from('.sub-header', { opacity: 0, duration: 0.4 }, "-=0.2")
  .from('.player-name', { scale: 0.8, opacity: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.2")
  .from('.player-class', { opacity: 0, y: 20, duration: 0.4 }, "-=0.1")
  .from('.player-bio', { opacity: 0, x: -20, duration: 0.6 }, "-=0.2")
  .from('.hero-stats', { opacity: 0, duration: 0.6 }, "-=0.2")
  .from('.btn-start', { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
  .from('.hex-frame', { scale: 0, rotation: -180, opacity: 0, duration: 1, ease: "elastic.out(1, 0.7)" }, "-=1");

// Typewriter/Glitch Text Effect (Simple Scramble)
const nameElement = document.querySelector('.player-name');
const originalText = nameElement.innerText;
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

let iteration = 0;
let interval = null;

nameElement.addEventListener('mouseover', () => {
  clearInterval(interval);
  iteration = 0;

  interval = setInterval(() => {
    nameElement.innerText = originalText
      .split("")
      .map((letter, index) => {
        if (index < iteration) {
          return originalText[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");

    if (iteration >= originalText.length) {
      clearInterval(interval);
    }

    iteration += 1 / 3;
  }, 30);
});

/* --- XP BARS --- */
gsap.utils.toArray('.stat-item').forEach(item => {
  const bar = item.querySelector('.xp-bar');
  const width = bar.dataset.width;

  gsap.to(bar, {
    width: width,
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: item,
      start: "top 80%",
    }
  });
});

/* --- MISSION CARDS --- */
gsap.utils.toArray('.mission-card').forEach((card, i) => {
  gsap.from(card, {
    x: i % 2 === 0 ? -50 : 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
    }
  });
});

/* --- CONNECT SECTION --- */
gsap.from('.connect-box', {
  scale: 0.9,
  opacity: 0,
  duration: 0.8,
  ease: "back.out(1.5)",
  scrollTrigger: {
    trigger: '.connect-section',
    start: "top 80%",
  }
});

/* --- MODAL LOGIC --- */
const modal = document.querySelector('#contact-modal');
const btnEmail = document.querySelector('#btn-email');
const btnClose = document.querySelector('.modal-close');
const contactForm = document.querySelector('#contact-form');

// Open Modal
btnEmail.addEventListener('click', (e) => {
  e.preventDefault();
  modal.classList.add('open');
  // Simple fade in using CSS class, could be GSAP too
  gsap.fromTo('.modal-box', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
});

// Close Modal
const closeModal = () => {
  modal.classList.remove('open');
};

btnClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Handle Form Submission (Firebase)
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.querySelector('#contact-name').value;
  const email = document.querySelector('#contact-email').value;
  const msg = document.querySelector('#contact-msg').value;

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.innerText;

  try {
    if (!window.db || !window.addDoc) {
      throw new Error("Database not initialized yet");
    }

    btn.innerText = "TRANSMITTING...";
    btn.disabled = true;

    await window.addDoc(window.collection(window.db, "portfolio_messages"), {
      name: name,
      email: email,
      message: msg,
      timestamp: window.serverTimestamp()
    });

    alert("TRANSMISSION RECEIVED. STANDING BY.");
    closeModal();
    contactForm.reset();

  } catch (error) {
    console.error("Error adding document: ", error);
    alert("TRANSMISSION FAILED. PLEASE TRY AGAIN OR CHECK FREQUENCIES.");
  } finally {
    btn.innerText = originalText;
    btn.disabled = false;
  }
});