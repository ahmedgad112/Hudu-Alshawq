const PHONE_WA = "966544621610";
const services = [
  {
    title: "مساج استرخائي لمدة ساعة",
    note: "منزلي وفندقي",
    icon: "fa-spa",
    text: "لتجديد الطاقة وإزالة التوتر والإجهاد اليومي، بجلسة هادئة تمتد لساعة."
  },
  {
    title: "الحمام المغربي والمساج",
    note: "عناية متكاملة",
    icon: "fa-bath",
    text: "تنظيف البشرة، تنشيط الدورة الدموية، واسترخاء العضلات في جلسة واحدة."
  },
  {
    title: "إزالة شعر المناطق",
    note: "خصوصية تامة",
    icon: "fa-leaf",
    text: "عناية شخصية فائقة بخصوصية تامة وأدوات معقمة."
  },
  {
    title: "مساج سويدي",
    note: "تقنيات احترافية",
    icon: "fa-hands",
    text: "تدليك احترافي لفك تشنجات العضلات وتحسين مرونة الجسم."
  }
];
const specialists = [
  { name: "تونسية", letter: "ت" },
  { name: "مغربية", letter: "غ" },
  { name: "فلبينية", letter: "ف" },
  { name: "إندونيسية", letter: "ن" },
  { name: "مصرية", letter: "ص" }
];

const serviceGrid = document.getElementById("serviceGrid");
const specialistGrid = document.getElementById("specialistGrid");
const serviceSelect = document.getElementById("service");
const nationalitySelect = document.getElementById("nationality");
const preview = document.getElementById("preview");
const form = document.getElementById("bookingForm");
const formError = document.getElementById("formError");
const toast = document.getElementById("toast");

services.forEach((service) => {
  const label = service.note ? `${service.title} (${service.note})` : service.title;
  const option = document.createElement("option");
  option.value = label;
  option.textContent = label;
  serviceSelect.appendChild(option);

  const card = document.createElement("article");
  card.className = "tilt-card reveal";
  card.innerHTML = `
    <div class="card-icon"><i class="fa-solid ${service.icon}" aria-hidden="true"></i></div>
    <h3>${service.title}</h3>
    <p>${service.text}</p>
    <div class="card-actions">
      <a class="btn btn-gold btn-sm" href="${waLink(serviceMessage(label))}" target="_blank" rel="noopener noreferrer">
        <i class="fa-brands fa-whatsapp"></i> اطلب الخدمة عبر واتساب
      </a>
    </div>`;
  serviceGrid.appendChild(card);
});

specialists.forEach((person) => {
  const option = document.createElement("option");
  option.value = person.name;
  option.textContent = `أخصائية ${person.name}`;
  nationalitySelect.appendChild(option);

  const card = document.createElement("button");
  card.type = "button";
  card.className = "tilt-card specialist reveal";
  card.dataset.nationality = person.name;
  card.setAttribute("aria-pressed", "false");
  card.innerHTML = `
    <span class="mono" aria-hidden="true">${person.letter}</span>
    <h3>أخصائية ${person.name}</h3>
    <small>جلسة مساج لمدة ساعة</small>
    <span class="pick-label">اختيار للحجز</span>`;
  card.addEventListener("click", () => selectSpecialist(person.name));
  specialistGrid.appendChild(card);
});

function serviceMessage(serviceName) {
  return `السلام عليكم، أرغب بطلب خدمة: ${serviceName} من مؤسسة هدوء الشوق. أرجو تزويدي بالتفاصيل وترتيب الموعد.`;
}

function waLink(text) {
  return `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(text)}`;
}

function bookingMessage() {
  const guest = document.getElementById("guest").value.trim();
  const lines = [
    "السلام عليكم، أود حجز خدمة من مؤسسة هدوء الشوق:",
    "",
    `الخدمة: ${serviceSelect.value || "—"}`,
    `جنسية الأخصائية: ${nationalitySelect.value ? "أخصائية " + nationalitySelect.value : "—"}`,
    `نوع الموقع: ${document.getElementById("visit").value || "—"}`,
    `الوقت المفضل: ${document.getElementById("time").value || "—"}`
  ];
  if (guest) lines.push(`الاسم: ${guest}`);
  lines.push("", "أرجو تأكيد الموعد وتفاصيل الحجز. شكراً لكم.");
  return lines.join("\n");
}

function refreshPreview() {
  preview.textContent = bookingMessage();
}

["service", "nationality", "visit", "time", "guest"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    formError.textContent = "";
    refreshPreview();
    if (id === "nationality") markSpecialist(nationalitySelect.value);
  });
  document.getElementById(id).addEventListener("change", refreshPreview);
});
refreshPreview();

function selectSpecialist(name) {
  nationalitySelect.value = name;
  markSpecialist(name);
  refreshPreview();
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  showToast("تم اختيار الأخصائية " + name + " في طلب الحجز");
}

function markSpecialist(name) {
  document.querySelectorAll(".specialist").forEach((card) => {
    const on = card.dataset.nationality === name;
    card.classList.toggle("is-selected", on);
    card.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const missing = [
    ["service", "نوع الخدمة"],
    ["nationality", "جنسية الأخصائية"],
    ["visit", "نوع الموقع"],
    ["time", "الوقت المفضل"]
  ].filter(([id]) => !document.getElementById(id).value);
  if (missing.length) {
    formError.textContent = "يرجى اختيار: " + missing.map((item) => item[1]).join("، ");
    return;
  }
  formError.textContent = "";
  const url = waLink(bookingMessage());
  showToast("جاري فتح واتساب لإرسال طلب الحجز");
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) window.location.href = url;
});

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
function closeMenu() {
  navLinks.classList.remove("is-open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "فتح القائمة");
}
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  menuBtn.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");
function syncThemeButton() {
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
  themeIcon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  document.querySelector('meta[name="theme-color"]').setAttribute("content", dark ? "#12100e" : "#f4efe6");
}
syncThemeButton();
themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  const next = dark ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem("hudoo-theme", next); } catch (e) {}
  syncThemeButton();
});

document.getElementById("year").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.style.animationDelay = "0.05s";
    entry.target.classList.add("reveal");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });
document.querySelectorAll(".reveal").forEach((el) => {
  el.classList.remove("reveal");
  el.style.opacity = "0";
  revealObserver.observe(el);
});

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (finePointer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      const rx = (0.5 - y) * 7;
      const ry = (x - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let particles = [];
let running = !reduceMotion;

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnParticles() {
  const rect = canvas.getBoundingClientRect();
  const count = Math.min(54, Math.floor(rect.width / 22));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    r: Math.random() * 1.8 + 0.5,
    s: Math.random() * 0.28 + 0.06,
    drift: (Math.random() - 0.5) * 0.22,
    a: Math.random() * 0.35 + 0.12
  }));
}

function drawParticles() {
  if (!running) return;
  const rect = canvas.getBoundingClientRect();
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  ctx.clearRect(0, 0, rect.width, rect.height);
  particles.forEach((p) => {
    p.y -= p.s;
    p.x += p.drift;
    if (p.y < -8) {
      p.y = rect.height + 8;
      p.x = Math.random() * rect.width;
    }
    if (p.x < -8) p.x = rect.width + 8;
    if (p.x > rect.width + 8) p.x = -8;
    ctx.beginPath();
    ctx.fillStyle = dark ? `rgba(215,192,154,${p.a})` : `rgba(140,104,58,${p.a})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

if (!reduceMotion) {
  resizeCanvas();
  spawnParticles();
  drawParticles();
  window.addEventListener("resize", () => {
    resizeCanvas();
    spawnParticles();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      drawParticles();
    }
  });
}
