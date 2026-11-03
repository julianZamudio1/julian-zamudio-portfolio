// Todo el texto de la landing vive aquí.
import brisa from "@/assets/project-brisa.webp";
import integran from "@/assets/project-integran.webp";
import sustayta from "@/assets/project-sustayta.webp";
import veripay from "@/assets/project-veripay.webp";

export const site = {
  name: "Eduardo Julián Zamudio Govea",
  shortName: "Julián Zamudio",
  firstName: "Julián",
  initials: "JZ",
  role: "Desarrollador web fullstack",
  email: "julianzamudio9876@gmail.com",
  whatsapp: "+52 352 106 0845",
  whatsappHref: "https://wa.me/523521060845?text=Hola%20Juli%C3%A1n%2C%20vi%20tu%20portafolio",
  availability: "disponible siempre",
  location: "La Piedad, Michoacán · 100% remoto",
  cv: "/CV-Eduardo-Julian-Zamudio-Govea.pdf",
  github: "https://github.com/julianZamudio1",
  // ID del formulario en Formspree (los mensajes llegan a tu correo)
  formspreeId: "myeelkbk",
  socials: [
    { short: "in", label: "LinkedIn", href: "https://www.linkedin.com/in/eduardo-julian-zamudio-govea-53569b3a9/" },
    { short: "gh", label: "GitHub", href: "https://github.com/julianZamudio1" },
    { short: "wa", label: "WhatsApp", href: "https://wa.me/523521060845?text=Hola%20Juli%C3%A1n%2C%20vi%20tu%20portafolio" },
  ],
};

export const hero = {
  badge: "portafolio 2026 / fullstack · IA · web",
  titleTop: "Hago que tu web",
  titleAccent: "se sienta viva.",
  lead: `Soy ${site.firstName}, ${site.role.toLowerCase()}. Construyo sitios y aplicaciones de punta a punta con TypeScript, React y Next.js, Node.js, Python y Java, y solo te escribo cuando hay algo que decidir.`,
  primary: "Ver proyectos",
  secondary: "Descargar CV",
  note: "disponible siempre / 100% remoto / La Piedad, Mich.",
};

export const pipeline = {
  title: "nuevo-proyecto",
  meta: "4 pasos / 1 rama",
  nodes: [
    { id: "brief", title: "Brief recibido", sub: "formulario" },
    { id: "design", title: "¿Hay diseño?", sub: "figma" },
    { id: "proto", title: "Prototipo en 48 h", sub: "next.js" },
    { id: "ship", title: "Publicar", sub: "esperando tu sí" },
  ],
  logs: [
    { name: "sustayta.com.mx", ms: 388 },
    { name: "integran-demo · main", ms: 134 },
    { name: "veripay · api", ms: 129 },
    { name: "brisa-solar · pages", ms: 212 },
    { name: "mindbox · expo", ms: 96 },
    { name: "apirest · fastapi", ms: 151 },
  ],
};

export const stack = [
  "TypeScript", "React", "Next.js", "Node.js", "Python", "Java · Spring Boot",
  "Angular", "PostgreSQL", "SQL Server", "Google Gemini", "Three.js", "Vercel",
];

export const projects = [
  {
    title: "Sustayta Consulting Soft",
    client: "Distribuidor CONTPAQi · 2026",
    description:
      "Sitio corporativo hecho desde cero con un asistente de ventas con IA (Google Gemini) que responde en streaming y solo con el catálogo real.",
    tags: ["Next.js", "TypeScript", "Gemini"],
    metric: "Lighthouse 100 en SEO",
    cover: sustayta,
    href: "https://sustayta.com.mx",
    cta: "ver sitio",
  },
  {
    title: "Grupo Integran",
    client: "Sitio demostrativo · 2026",
    description:
      "Recorrido de cámara guiado por el scroll, titular formado por granos en WebGL y recursos visuales generados con IA.",
    tags: ["Next.js 16", "Three.js", "GSAP"],
    metric: "PageSpeed 98 en móvil",
    cover: integran,
    href: "https://integran-demo.vercel.app",
    cta: "ver sitio",
  },
  {
    title: "VeriPay",
    client: "KYC y pagos · 2026",
    description:
      "Valida la CURP de la INE con OCR, compara el rostro con una selfie y opera cuentas con CLABE, JWT, roles y bitácora de auditoría.",
    tags: ["Spring Boot", "Angular", "OpenCV"],
    metric: "+50 pruebas automatizadas",
    cover: veripay,
    href: "https://github.com/julianZamudio1/veripay",
    cta: "ver código",
  },
  {
    title: "Brisa Solar",
    client: "Landing de captación · 2026",
    description:
      "Landing con calculadora de ahorro, formulario con backend en PHP y medición para campañas; también como tema de WordPress.",
    tags: ["Astro", "PHP", "WordPress"],
    metric: "Lighthouse 99/100/100/100",
    cover: brisa,
    href: "https://julianzamudio1.github.io/brisa-solar/",
    cta: "ver demo",
  },
];

export const process = [
  {
    n: "01",
    title: "Primero entiendo el problema",
    body: "Una llamada de 30 minutos y un documento de una página: objetivo, público y cómo vamos a medir si funcionó.",
  },
  {
    n: "02",
    title: "Avances donde ya estás",
    body: "Te mando previews en vivo por WhatsApp. Apruebas con un sí y seguimos; nadie aprende otra herramienta.",
  },
  {
    n: "03",
    title: "Lanzo y lo mido",
    body: "Publico en Vercel con analítica desde el primer día y reviso rendimiento, accesibilidad y SEO antes de entregar.",
  },
];

export const brief = [
  "Objetivo: más clientes en línea",
  "Público: móvil, negocio local",
  "Métrica: contactos por semana",
  "Entrega: 3 semanas",
];
