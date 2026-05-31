/* ─────────────────────────────────────────────────────────────────────────
   Malom Invest — src/main.js
   Responsive Interactions, Localization, Custom Widgets, IoT Sensors & Forms
   ───────────────────────────────────────────────────────────────────────── */

'use strict';

// ── GLOBAL STATE ─────────────────────────────────────────────────────────
let currentLang = 'en'; // 'en' or 'sr'
let currentMapHub = 'serbia';
let currentResidenceIndex = 0;

// Registry of translation texts for interactive components that require dynamic update
const translations = {
  // Map Hubs data
  mapHubs: {
    serbia: {
      en: { region: "Serbia", title: "Belgrade & Novi Sad", desc: "Central executive hub coordinating global operations. Flagship smart-luxury developments situated on the protected heights of Tatar Hill.", status: "HQ OPERATIONAL", yield: "14.2%", count: "3 Active" },
      sr: { region: "Србија", title: "Београд и Нови Сад", desc: "Централно извршно чвориште које координише глобалне операције. Водећи паметни луксузни пројекти на заштићеним висинама Татарског Брда.", status: "ШТАБ АКТИВАН", yield: "14.2%", count: "3 Активна" }
    },
    sweden: {
      en: { region: "Sweden", title: "Stockholm Archipelago", desc: "Boutique waterfront developments engineered to withstand sub-zero climate loads with integrated passive solar design.", status: "COMPLETED", yield: "8.5%", count: "1 Active" },
      sr: { region: "Шведска", title: "Стокхолмски Архипелаг", desc: "Бутик пројекти на обали пројектовани да издрже супполарне климатске услове са интегрисаним пасивним соларним дизајном.", status: "ЗАВРШЕНО", yield: "8.5%", count: "1 Активно" }
    },
    poland: {
      en: { region: "Poland", title: "Warsaw Center", desc: "High-density residential towers integrating smart micro-hvac networks and smart shared workspaces.", status: "PLANNING PHASE", yield: "9.8%", count: "1 Planning" },
      sr: { region: "Пољска", title: "Варшава Центар", desc: "Високогусти стамбени комплекси са паметним микро-ХВАЦ мрежама и заједничким радним просторима.", status: "ФАЗА ПЛАНИРАЊА", yield: "9.8%", count: "1 Планирано" }
    },
    cyprus: {
      en: { region: "Cyprus", title: "Limassol Marina", desc: "Luxury seaside towers with automated marine thermal cooling loops and high-integrity salt-resistant structures.", status: "APPLICATION OPEN", yield: "11.0%", count: "2 Active" },
      sr: { region: "Кипар", title: "Лимасол Марина", desc: "Луксузне приморске куле са аутоматизованим системима за морско хлађење и структурама отпорним на со.", status: "УПИС ОТВОРЕН", yield: "11.0%", count: "2 Активна" }
    },
    uae: {
      en: { region: "UAE", title: "Dubai Heights", desc: "Ultra-luxury high-rises utilizing kinetic self-shading facades and state-of-the-art atmospheric water generation.", status: "LAUNCHING 2027", yield: "12.5%", count: "2 Scheduled" },
      sr: { region: "УАЕ", title: "Дубаи Висине", desc: "Ултра-луксузни небодери са кинетичким самоосенченим фасадама и најсавременијим системима за производњу воде из атмосфере.", status: "ЛАНСИРАЊЕ 2027", yield: "12.5%", count: "2 Планирано" }
    }
  },
  
  // Residence Modal details
  residences: {
    hillside: {
      en: { title: "Hillside Penthouse", subtitle: "Belgrade, Serbia", desc: "Dual-oriented layout boasting expansive ceiling heights (3.4m), custom limestone fittings, and automated floor-to-ceiling glass wall sliders.", area: "342 m²", beds: "4 Rooms", status: "Available" },
      sr: { title: "Брдски Пентхаус", subtitle: "Београд, Србија", desc: "Двострано оријентисан распоред са високим плафонима (3.4м), прилагођеним кречњачким плочама и аутоматизованим стакленим зидовима.", area: "342 м²", beds: "4 Собе", status: "Слободно" }
    },
    monolith: {
      en: { title: "The Monolith Loft", subtitle: "Limassol, Cyprus", desc: "Brutalist-inspired open loft facing the Mediterranean. Solid concrete geometry integrated with local porous stone and high-grade solar glass.", area: "285 m²", beds: "3 Rooms", status: "Application Only" },
      sr: { title: "Монолит Лофт", subtitle: "Лимасол, Кипар", desc: "Бруталистички отворени лофт окренут ка Медитерану. Масивна бетонска геометрија интегрисана са локалним каменом и соларним стаклом.", area: "285 м²", beds: "3 Собе", status: "Само на Упит" }
    },
    nordic: {
      en: { title: "Nordic Fjord Cabin", subtitle: "Stockholm, Sweden", desc: "A cozy smart-insulated glass chalet on the Baltic coastline, featuring a private geothermal heat well and automated solar sails.", area: "190 m²", beds: "2 Rooms", status: "1 Unit Left" },
      sr: { title: "Скандинавска Кабина", subtitle: "Стокхолм, Шведска", desc: "Паметно изоловани стаклени шале на обали Балтика, са сопственом геотермалном пумпом и аутоматским соларним једрима.", area: "190 м²", beds: "2 Собе", status: "1 Преостала" }
    }
  }
};

// ── 1. INITIALIZATION & REGULAR SCROLL HANDLERS ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSmoothScroll();
  initMobileMenu();
  initLanguageSwitcher();
  initResidencesSlider();
  initTelemetryLoop();
  initFormProtocol();
});

// Reveal-on-scroll using IntersectionObserver
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      
      e.preventDefault();
      closeMobileMenu(); // Ensure mobile menu closes on click

      const navHeight = 64; // nav height is 64px
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}

// ── 2. MOBILE MENU WIDGET ─────────────────────────────────────────────────
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    const isVisible = mobileMenu.classList.contains('menu-visible');
    if (isVisible) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

function openMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuToggle = document.getElementById('menu-toggle');
  
  if (!mobileMenu || !menuToggle) return;

  mobileMenu.classList.remove('menu-hidden');
  mobileMenu.classList.add('menu-visible');
  document.body.classList.add('no-scroll');

  // Morph burger icon into an 'X'
  menuToggle.children[0].style.transform = 'rotate(45deg) translateY(7px)';
  menuToggle.children[1].style.transform = 'rotate(-45deg) translateY(-7px)';
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuToggle = document.getElementById('menu-toggle');
  
  if (!mobileMenu || !menuToggle) return;

  mobileMenu.classList.remove('menu-visible');
  mobileMenu.classList.add('menu-hidden');
  document.body.classList.remove('no-scroll');

  // Reset burger icon
  menuToggle.children[0].style.transform = 'none';
  menuToggle.children[1].style.transform = 'none';
}

// ── 3. LANGUAGE SWITCHER ──────────────────────────────────────────────────
function initLanguageSwitcher() {
  const langBtn = document.getElementById('lang-switcher');
  if (!langBtn) return;

  langBtn.addEventListener('click', () => {
    // Toggle active language
    currentLang = currentLang === 'en' ? 'sr' : 'en';
    
    // Update switch button text
    langBtn.textContent = currentLang === 'en' ? 'SR' : 'EN';
    
    // Switch document language attribute
    document.documentElement.lang = currentLang;

    // Apply translations across all data-en / data-sr fields
    document.querySelectorAll('[data-en][data-sr]').forEach(el => {
      el.textContent = el.getAttribute(`data-${currentLang}`);
    });

    // Update map dashboard translations
    updateMapDashboard();

    // Update residences carousel availability pills
    updateResidencesCarouselPills();
  });
}

// Update carousel static badges based on language state
function updateResidencesCarouselPills() {
  // Select components that display status or availability
  const elements = document.querySelectorAll('[data-en][data-sr]');
  elements.forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) el.textContent = text;
  });
}

// ── 4. INTERACTIVE GLOBAL MAP DASHBOARD ──────────────────────────────────
window.selectMapHub = function(hubKey) {
  if (!translations.mapHubs[hubKey]) return;
  currentMapHub = hubKey;
  updateMapDashboard();
};

function updateMapDashboard() {
  const card = document.getElementById('map-dashboard-card');
  const regionEl = document.getElementById('map-hub-region');
  const statusEl = document.getElementById('map-hub-status');
  const titleEl = document.getElementById('map-hub-title');
  const descEl = document.getElementById('map-hub-description');
  const yieldEl = document.getElementById('map-hub-yield');
  const countEl = document.getElementById('map-hub-count');

  if (!card || !translations.mapHubs[currentMapHub]) return;

  const data = translations.mapHubs[currentMapHub][currentLang];

  // Fade out effect
  card.style.opacity = '0';
  card.style.transform = 'translateY(10px)';

  setTimeout(() => {
    // Set content details
    regionEl.textContent = data.region;
    statusEl.textContent = data.status;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    yieldEl.textContent = data.yield;
    countEl.textContent = data.count;

    // Update active map dot highlight style class
    document.querySelectorAll('button[aria-label*="Hub"]').forEach(btn => {
      const dot = btn.querySelector('span');
      if (dot) {
        dot.className = "w-3.5 h-3.5 bg-outline rounded-full block ring-4 ring-outline/20 hover:bg-primary transition-colors";
      }
    });

    // Highlight the selected node
    const activeDot = document.getElementById(`dot-${currentMapHub}`);
    if (activeDot) {
      if (currentMapHub === 'serbia') {
        activeDot.className = "w-4.5 h-4.5 bg-primary rounded-full block pulse-gold ring-4 ring-primary/30 scale-110";
      } else {
        activeDot.className = "w-3.5 h-3.5 bg-primary rounded-full block pulse-gold ring-4 ring-primary/35";
      }
    }

    // Fade in dashboard
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 300);
}

// ── 5. RESIDENCES HORIZONTAL SHOWCASE SLIDER ─────────────────────────────
function initResidencesSlider() {
  const slider = document.getElementById('residences-slider');
  const btnPrev = document.getElementById('residence-prev');
  const btnNext = document.getElementById('residence-next');

  if (!slider || !btnPrev || !btnNext) return;

  const updateSliderPosition = () => {
    const cardWidth = slider.children[0].clientWidth;
    const gap = 24; // Tailwind gap-gutter is 24px
    const offset = currentResidenceIndex * (cardWidth + gap);
    slider.style.transform = `translateX(-${offset}px)`;
  };

  btnNext.addEventListener('click', () => {
    // Max cards in DOM is 3
    const maxIndex = window.innerWidth < 768 ? 2 : 1; // Slide one by one on mobile, limit translation on desktop
    if (currentResidenceIndex < maxIndex) {
      currentResidenceIndex++;
      updateSliderPosition();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentResidenceIndex > 0) {
      currentResidenceIndex--;
      updateSliderPosition();
    }
  });

  window.addEventListener('resize', updateSliderPosition);
}

// ── 6. INTERACTIVE SPECIFICATIONS DIALOGUE ────────────────────────────────
window.showUnitDetails = function(unitKey) {
  const modal = document.getElementById('floorplan-modal');
  const title = document.getElementById('modal-title');
  const subtitle = document.getElementById('modal-subtitle');
  const desc = document.getElementById('modal-desc');
  const area = document.getElementById('modal-area');
  const beds = document.getElementById('modal-beds');
  const status = document.getElementById('modal-status');

  if (!modal || !translations.residences[unitKey]) return;

  const data = translations.residences[unitKey][currentLang];

  title.textContent = data.title;
  subtitle.textContent = data.subtitle;
  desc.textContent = data.desc;
  area.textContent = data.area;
  beds.textContent = data.beds;
  status.textContent = data.status;

  modal.classList.remove('hidden');
  document.body.classList.add('no-scroll');
};

window.closeUnitDetails = function() {
  const modal = document.getElementById('floorplan-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
};

window.modalInquire = function() {
  closeUnitDetails();
  const contactForm = document.getElementById('contact');
  if (contactForm) {
    contactForm.scrollIntoView({ behavior: 'smooth' });
  }
};

// ── 7. SIMULATED SMART TELEMETRY LOOPS ───────────────────────────────────
function initTelemetryLoop() {
  const pm25El = document.getElementById('telemetry-pm25');
  const noiseEl = document.getElementById('telemetry-noise');
  const tempEl = document.getElementById('telemetry-temp');

  if (!pm25El || !noiseEl || !tempEl) return;

  setInterval(() => {
    // Fluctuating values slightly
    const newPm25 = (4.0 + Math.random() * 0.5).toFixed(1);
    const newNoise = Math.floor(26 + Math.random() * 4);
    const newTemp = (19.0 + Math.random() * 0.8).toFixed(1);

    // Apply fading micro-transition
    applyTelemetryUpdate(pm25El, newPm25);
    applyTelemetryUpdate(noiseEl, `${newNoise}dB`);
    applyTelemetryUpdate(tempEl, `${newTemp}°C`);
  }, 4000);
}

function applyTelemetryUpdate(element, newValue) {
  element.style.opacity = '0.4';
  setTimeout(() => {
    element.textContent = newValue;
    element.style.opacity = '1';
  }, 300);
}

// ── 8. MULTI-STEP PROTOCOL CONTACT FORM ──────────────────────────────────
function initFormProtocol() {
  const form = document.getElementById('inquiry-form');
  const successPanel = document.getElementById('form-success-panel');
  const errorPanel = document.getElementById('form-error-panel');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-input-name').value.trim();
    const email = document.getElementById('form-input-email').value.trim();

    if (!name || !email || !email.includes('@')) {
      errorPanel.classList.remove('hidden');
      return;
    }

    errorPanel.classList.add('hidden');
    
    // Simulate API Submission
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'en' ? 'TRANSMITTING PROTOCOL...' : 'СЛАЊЕ ПРОТОКОЛА...';

    setTimeout(() => {
      form.classList.add('hidden');
      successPanel.classList.remove('hidden');
    }, 1500);
  });
}

window.selectFormProtocol = function(protocolType) {
  const btnResidence = document.getElementById('btn-protocol-residence');
  const btnYield = document.getElementById('btn-protocol-yield');
  const btnPartnership = document.getElementById('btn-protocol-partnership');
  const hiddenInput = document.getElementById('input-protocol-value');

  if (!btnResidence || !btnYield || !btnPartnership || !hiddenInput) return;

  // Reset styles
  [btnResidence, btnYield, btnPartnership].forEach(btn => {
    btn.className = "py-2.5 bg-[#131313] border border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:border-primary/50 font-label-mono text-[10px] uppercase tracking-wider text-center rounded-sm transition-all focus:outline-none";
  });

  // Apply active style to clicked button
  if (protocolType === 'residence') {
    btnResidence.className = "py-2.5 bg-primary text-on-primary font-label-mono text-[10px] uppercase tracking-wider text-center rounded-sm transition-all focus:outline-none";
    hiddenInput.value = "Residence";
  } else if (protocolType === 'yield') {
    btnYield.className = "py-2.5 bg-primary text-on-primary font-label-mono text-[10px] uppercase tracking-wider text-center rounded-sm transition-all focus:outline-none";
    hiddenInput.value = "Yield";
  } else if (protocolType === 'partnership') {
    btnPartnership.className = "py-2.5 bg-primary text-on-primary font-label-mono text-[10px] uppercase tracking-wider text-center rounded-sm transition-all focus:outline-none";
    hiddenInput.value = "Partnership";
  }
};
