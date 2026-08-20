// Data layer — capa de datos de OFIX Connect. Store en memoria persistido a
// localStorage ("ofix-data") con un token falso ("ofix-token"). Sin backend:
// simula pagos (escrow), verificación KYC, seguros y geolocalización.
import {
  CATEGORIES,
  INSURANCE_PLANS,
  LEVEL_THRESHOLDS,
  OFIX_COMMISSION_RATE,
  type AuthProvider,
  type Chat,
  type ClientType,
  type Favorite,
  type Job,
  type Message,
  type Notification,
  type NotificationType,
  type Offer,
  type OfferStatus,
  type Payment,
  type PaymentMethod,
  type Payout,
  type BillingPeriod,
  type Proposal,
  type ProposalStatus,
  type PublicUser,
  type Receipt,
  type ReceiptKind,
  type Review,
  type Role,
  type Service,
  type Urgency,
  type User,
  type Verification,
  type WorkerLevel,
} from "./types";

const DATA_KEY = "ofix-data";
const TOKEN_KEY = "ofix-token";
// Bump cuando cambia el esquema de datos: invalida el localStorage viejo y re-seedea.
const DATA_VERSION = 5;

// Foto real y temática (Creative Commons) por palabra clave, para el seed.
function photo(keyword: string, lock: number, w = 480, h = 360): string {
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(keyword)}?lock=${lock}`;
}
// Avatar real de persona (randomuser) — cae a iniciales si falla.
function avatar(gender: "men" | "women", n: number): string {
  return `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;
}

class DataStore {
  users: User[] = [];
  offers: Offer[] = [];
  proposals: Proposal[] = [];
  services: Service[] = [];
  jobs: Job[] = [];
  payments: Payment[] = [];
  reviews: Review[] = [];
  favorites: Favorite[] = [];
  notifications: Notification[] = [];
  chats: Chat[] = [];
  messages: Message[] = [];
  payouts: Payout[] = [];
  currentToken: string | null = null;
  currentUser: User | null = null;

  constructor() {
    this.loadFromStorage();
    if (this.users.length === 0) this.seedData();
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        // Esquema viejo (o sin versión): descartar y re-seedear con el modelo nuevo.
        if (d.version !== DATA_VERSION) {
          localStorage.removeItem(DATA_KEY);
          localStorage.removeItem(TOKEN_KEY);
          return;
        }
        this.users = d.users || [];
        this.offers = d.offers || [];
        this.proposals = d.proposals || [];
        this.services = d.services || [];
        this.jobs = d.jobs || [];
        this.payments = d.payments || [];
        this.reviews = d.reviews || [];
        this.favorites = d.favorites || [];
        this.notifications = d.notifications || [];
        this.chats = d.chats || [];
        this.messages = d.messages || [];
        this.payouts = d.payouts || [];
      }
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        this.currentToken = token;
        const userId = JSON.parse(atob(token.split(".")[1])).userId;
        this.currentUser = this.users.find((u) => u.id === userId) || null;
      }
    } catch (e) {
      console.error("Error loading from storage:", e);
    }
  }

  // Devuelve false si el navegador rechazó la escritura (cuota llena).
  // Los adjuntos de chat son lo único que puede llenarla, así que ese camino
  // revisa el resultado y revierte; el resto de las escrituras son chicas.
  private saveToStorage(): boolean {
    try {
      localStorage.setItem(
        DATA_KEY,
        JSON.stringify({
          version: DATA_VERSION,
          users: this.users,
          offers: this.offers,
          proposals: this.proposals,
          services: this.services,
          jobs: this.jobs,
          payments: this.payments,
          reviews: this.reviews,
          favorites: this.favorites,
          notifications: this.notifications,
          chats: this.chats,
          messages: this.messages,
          payouts: this.payouts,
        }),
      );
      return true;
    } catch (e) {
      console.error("Error saving to storage:", e);
      return false;
    }
  }

  // ────────────────────────────── Seed ──────────────────────────────
  private seedData() {
    const t = new Date().toISOString();
    const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
    const fullVerif: Verification = { identity: true, background: true, license: true };

    this.users = [
      { id: "u1", name: "María García", email: "maria@example.com", password: "password123", phone: "+54 11 1234-5678", role: "user", clientType: "hogar", zone: "Palermo, CABA", address: "Av. Santa Fe 3200", geo: { lat: -34.5885, lng: -58.4105 }, photo: avatar("women", 68), rating: 4.7, reviewCount: 6, createdAt: daysAgo(120), updatedAt: t },
      { id: "u2", name: "Carlos López", email: "carlos@example.com", password: "password123", phone: "+54 11 2345-6789", role: "user", clientType: "hogar", zone: "Belgrano, CABA", geo: { lat: -34.5627, lng: -58.4583 }, photo: avatar("men", 32), rating: 4.5, reviewCount: 3, createdAt: daysAgo(90), updatedAt: t },
      { id: "u3", name: "Bodegón La Esquina", email: "bodegon@example.com", password: "password123", phone: "+54 11 5555-1010", role: "user", clientType: "pyme_gastronomica", zone: "San Telmo, CABA", geo: { lat: -34.6208, lng: -58.3735 }, photo: photo("restaurant,bar", 21, 200, 200), rating: 4.8, reviewCount: 12, createdAt: daysAgo(200), updatedAt: t },
      { id: "w1", name: "Juan Pérez", email: "juan@example.com", password: "password123", phone: "+54 11 3456-7890", role: "worker", trade: "Plomería", trades: ["Plomería", "Gas"], coverageZone: "Palermo, Villa Crespo, Caballito", hourlyRate: 3500, bio: "Plomero matriculado con más de 10 años de experiencia en urgencias del hogar. Trabajo garantizado.", verified: true, verification: fullVerif, level: "gold", rating: 4.8, reviewCount: 34, jobsDone: 42, premium: true, available: true, zone: "Palermo, CABA", geo: { lat: -34.5889, lng: -58.4298 }, photo: avatar("men", 45), createdAt: daysAgo(300), updatedAt: t },
      { id: "w2", name: "Ana Rodríguez", email: "ana@example.com", password: "password123", phone: "+54 11 4567-8901", role: "worker", trade: "Electricidad", trades: ["Electricidad", "Aire acondicionado"], coverageZone: "Belgrano, Núñez, Colegiales", hourlyRate: 4000, bio: "Electricista matriculada. Instalaciones, tableros y reparaciones. Presupuesto sin cargo.", verified: true, verification: fullVerif, level: "silver", rating: 4.9, reviewCount: 18, jobsDone: 21, premium: false, available: true, zone: "Belgrano, CABA", geo: { lat: -34.5610, lng: -58.4560 }, photo: avatar("women", 44), createdAt: daysAgo(220), updatedAt: t },
      { id: "w3", name: "Diego Fernández", email: "diego@example.com", password: "password123", phone: "+54 11 6789-0123", role: "worker", trade: "Cerrajería", trades: ["Cerrajería"], coverageZone: "CABA (toda la ciudad)", hourlyRate: 3000, bio: "Cerrajero 24hs. Aperturas, cambio de cerraduras y seguridad. Respuesta rápida.", verified: true, verification: { identity: true, background: true, license: false }, level: "silver", rating: 4.6, reviewCount: 11, jobsDone: 15, premium: false, available: true, zone: "Almagro, CABA", geo: { lat: -34.6100, lng: -58.4200 }, photo: avatar("men", 76), createdAt: daysAgo(150), updatedAt: t },
      { id: "w4", name: "Lucía Martínez", email: "lucia@example.com", password: "password123", phone: "+54 11 7890-1234", role: "worker", trade: "Pintura", trades: ["Pintura", "Mantenimiento"], coverageZone: "Caballito, Flores, Almagro", hourlyRate: 2800, bio: "Pintora profesional. Interiores y exteriores, trabajos prolijos y en fecha.", verified: false, verification: { identity: true, background: false, license: false }, level: "bronze", rating: 4.3, reviewCount: 4, jobsDone: 6, premium: false, available: false, zone: "Caballito, CABA", geo: { lat: -34.6190, lng: -58.4400 }, photo: avatar("women", 65), createdAt: daysAgo(60), updatedAt: t },
    ];

    this.services = [
      { id: "s1", workerId: "w1", title: "Reparación de pérdidas de agua", category: "Plomería", description: "Detección y reparación de pérdidas con garantía de 6 meses.", price: 3500, duration: "1-2 horas", schedule: "Lun a Sáb 8-20hs", withUrgency: true, images: [photo("plumbing,pipe", 31), photo("plumber", 32)], active: true, views: 145, createdAt: daysAgo(80), updatedAt: t },
      { id: "s2", workerId: "w1", title: "Instalación de termotanque", category: "Plomería", description: "Instalación completa de termotanque eléctrico o a gas.", price: 8000, duration: "4-5 horas", schedule: "Lun a Vie 9-18hs", withUrgency: false, images: [photo("water,heater", 33)], active: true, views: 87, createdAt: daysAgo(70), updatedAt: t },
      { id: "s3", workerId: "w2", title: "Instalación de iluminación LED", category: "Electricidad", description: "Colocación de artefactos y luminarias LED, incluye materiales.", price: 4500, duration: "2-4 horas", schedule: "Lun a Vie 9-19hs", withUrgency: false, images: [photo("lightbulb,led", 34)], active: true, views: 62, createdAt: daysAgo(50), updatedAt: t },
      { id: "s4", workerId: "w2", title: "Reparación de tablero eléctrico", category: "Electricidad", description: "Diagnóstico y reparación de tableros, disyuntores y térmicas.", price: 6000, duration: "1-3 horas", schedule: "Lun a Sáb 8-20hs", withUrgency: true, images: [photo("electrical,panel", 35)], active: true, views: 40, createdAt: daysAgo(40), updatedAt: t },
      { id: "s5", workerId: "w3", title: "Apertura de puertas 24hs", category: "Cerrajería", description: "Apertura sin daño y cambio de cerradura en el acto.", price: 5000, duration: "30-60 min", schedule: "24 horas", withUrgency: true, images: [photo("lock,key", 36)], active: true, views: 210, createdAt: daysAgo(30), updatedAt: t },
    ];

    this.offers = [
      { id: "o1", authorId: "u1", title: "Reparación de pérdida de agua", description: "Tengo una pérdida de agua debajo de la pileta de la cocina que necesita atención.", category: "Plomería", budget: 5000, urgency: "en_el_dia", location: "Palermo, CABA", geo: { lat: -34.5885, lng: -58.4105 }, images: [photo("water,leak", 41), photo("sink,pipe", 42)], emergency: false, status: "abierta", createdAt: daysAgo(2), updatedAt: t },
      { id: "o2", authorId: "u2", title: "Instalación de tomacorrientes", description: "Necesito instalar 3 tomacorrientes nuevos en la cocina.", category: "Electricidad", budget: 3000, urgency: "programada", scheduledDate: daysAgo(-3), location: "Belgrano, CABA", images: [photo("power,outlet", 43)], emergency: false, status: "abierta", createdAt: daysAgo(1), updatedAt: t },
      { id: "o3", authorId: "u3", title: "Urgente: se cortó la luz en la cocina", description: "Saltó el tablero y no vuelve la luz en el sector de cocina del local.", category: "Electricidad", budget: 8000, urgency: "inmediata", location: "San Telmo, CABA", geo: { lat: -34.6208, lng: -58.3735 }, images: [photo("fusebox,electrical", 44), photo("kitchen,dark", 45)], emergency: true, status: "abierta", createdAt: daysAgo(0), updatedAt: t },
    ];

    this.proposals = [
      { id: "p1", offerId: "o1", workerId: "w1", message: "Hola! Tengo disponibilidad hoy mismo. 10 años de experiencia, trabajo garantizado.", price: 4500, availability: "Hoy 15-18hs", status: "enviada", createdAt: daysAgo(1) },
      { id: "p2", offerId: "o2", workerId: "w2", message: "Soy electricista matriculada, puedo hacerlo el día que agendes. Presupuesto cerrado.", price: 2800, availability: "A coordinar", status: "enviada", createdAt: daysAgo(0) },
    ];

    // Un trabajo ya completado con reseñas (historial), para dar vida a la app.
    this.jobs = [
      { id: "j1", offerId: "o-hist1", proposalId: "p-hist1", clientId: "u1", workerId: "w1", category: "Plomería", title: "Destape de cañería", amount: 6000, scheduledAt: daysAgo(20), insurance: true, insuranceCost: 800, status: "completado", createdAt: daysAgo(22), completedAt: daysAgo(20), reviewedByClient: true, reviewedByWorker: true },
      { id: "j2", offerId: "o-hist2", proposalId: "p-hist2", clientId: "u3", workerId: "w2", category: "Electricidad", title: "Revisión de instalación del local", amount: 12000, scheduledAt: daysAgo(10), insurance: false, status: "completado", createdAt: daysAgo(12), completedAt: daysAgo(10), reviewedByClient: true, reviewedByWorker: false },
      { id: "j3", offerId: "o-hist3", proposalId: "p-hist3", clientId: "u2", workerId: "w1", category: "Plomería", title: "Cambio de flexibles y canilla", amount: 4500, scheduledAt: daysAgo(45), insurance: false, status: "completado", createdAt: daysAgo(47), completedAt: daysAgo(45), reviewedByClient: true, reviewedByWorker: true },
      { id: "j4", offerId: "o-hist4", proposalId: "p-hist4", clientId: "u1", workerId: "w1", category: "Gas", title: "Detección de pérdida de gas", amount: 7000, scheduledAt: daysAgo(8), insurance: true, insuranceCost: 800, status: "completado", createdAt: daysAgo(9), completedAt: daysAgo(8), reviewedByClient: true, reviewedByWorker: false },
      { id: "j5", offerId: "o-hist5", proposalId: "p-hist5", clientId: "u2", workerId: "w3", category: "Cerrajería", title: "Cambio de cerradura de seguridad", amount: 5000, scheduledAt: daysAgo(6), insurance: false, status: "completado", createdAt: daysAgo(7), completedAt: daysAgo(6), reviewedByClient: true, reviewedByWorker: false },
      // Trabajo activo (en curso) para poblar "Mis acuerdos / Agenda".
      { id: "j6", offerId: "o-hist6", proposalId: "p-hist6", clientId: "u1", workerId: "w2", category: "Electricidad", title: "Instalación de luminarias LED", amount: 4500, scheduledAt: daysAgo(-2), insurance: false, status: "agendado", createdAt: daysAgo(1), reviewedByClient: false, reviewedByWorker: false },
    ];

    this.payments = [
      { id: "pay-j1", jobId: "j1", clientId: "u1", workerId: "w1", gross: 6000, commission: 900, insuranceCost: 800, total: 7700, net: 6000, method: "mercadopago", status: "liberado", createdAt: daysAgo(22), releasedAt: daysAgo(20) },
      { id: "pay-j2", jobId: "j2", clientId: "u3", workerId: "w2", gross: 12000, commission: 1800, insuranceCost: 0, total: 13800, net: 12000, method: "mercadopago", status: "liberado", createdAt: daysAgo(12), releasedAt: daysAgo(10) },
    ];

    this.reviews = [
      { id: "r1", jobId: "j1", authorId: "u1", targetId: "w1", stars: 5, comment: "Excelente trabajo, muy rápido y prolijo. Lo recomiendo.", createdAt: daysAgo(20) },
      { id: "r2", jobId: "j1", authorId: "w1", targetId: "u1", stars: 5, comment: "Clienta muy amable, todo claro. Gracias!", createdAt: daysAgo(20) },
      { id: "r3", jobId: "j2", authorId: "u3", targetId: "w2", stars: 5, comment: "Resolvió todo en el día, super profesional.", createdAt: daysAgo(10) },
      { id: "r4", jobId: "j3", authorId: "u2", targetId: "w1", stars: 5, comment: "Puntual y muy prolijo. Dejó todo funcionando perfecto.", createdAt: daysAgo(45) },
      { id: "r5", jobId: "j4", authorId: "u1", targetId: "w1", stars: 4, comment: "Muy buen trabajo, detectó la pérdida enseguida.", createdAt: daysAgo(8) },
      { id: "r6", jobId: "j5", authorId: "u2", targetId: "w3", stars: 5, comment: "Vino rápido y cambió la cerradura sin problemas.", createdAt: daysAgo(6) },
    ];

    this.favorites = [{ id: "f1", clientId: "u1", workerId: "w1", createdAt: daysAgo(20) }];

    this.payouts = [
      { id: "pay1", workerId: "w1", amount: 6000, status: "liquidado", createdAt: daysAgo(20), paidAt: daysAgo(19) },
      { id: "pay2", workerId: "w2", amount: 12000, status: "pendiente", createdAt: daysAgo(10) },
    ];

    this.chats = [
      { id: "c1", participantIds: ["u1", "w1"], lastMessageAt: daysAgo(1), lastMessage: "Perfecto, nos vemos hoy a las 15!" },
      { id: "c2", participantIds: ["u3", "w2"], lastMessageAt: daysAgo(10), lastMessage: "Gracias por todo!" },
    ];
    this.messages = [
      { id: "m1", chatId: "c1", authorId: "u1", text: "Hola Juan! Vi tu propuesta y me interesa.", ts: daysAgo(1), status: "read" },
      { id: "m2", chatId: "c1", authorId: "w1", text: "Hola María! Genial, puedo pasar hoy a las 15hs.", ts: daysAgo(1), status: "read" },
      { id: "m3", chatId: "c1", authorId: "u1", text: "Perfecto, nos vemos hoy a las 15!", ts: daysAgo(1), status: "sent" },
      { id: "m4", chatId: "c2", authorId: "u3", text: "Gracias por todo!", ts: daysAgo(10), status: "read" },
    ];

    this.notifications = [
      { id: "n1", userId: "u1", type: "oferta", title: "Nueva propuesta recibida", body: "Juan Pérez envió una propuesta para tu solicitud.", read: false, link: "/u/requests/o1", createdAt: daysAgo(1) },
      { id: "n2", userId: "w1", type: "sistema", title: "¡Subiste a nivel Gold!", body: "Alcanzaste 30 trabajos completados. Ahora pagás menor comisión.", read: false, link: "/w/stats", createdAt: daysAgo(5) },
      { id: "n3", userId: "w2", type: "pago", title: "Pago disponible", body: "Tenés $12.000 disponibles para retirar.", read: true, link: "/w/cobros", createdAt: daysAgo(10) },
    ];

    this.saveToStorage();
  }

  // ────────────────────────────── Auth ──────────────────────────────
  register(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    phone?: string;
    photo?: string;
    authProvider?: AuthProvider;
    clientType?: ClientType;
    zone?: string;
    trade?: string;
    trades?: string[];
    coverageZone?: string;
    hourlyRate?: number;
    bio?: string;
    verification?: Verification;
  }) {
    if (this.users.find((u) => u.email === data.email)) throw new Error("El email ya está registrado");
    const now = new Date().toISOString();
    const user: User = {
      id: `${data.role === "user" ? "u" : "w"}${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      phone: data.phone,
      photo: data.photo,
      authProvider: data.authProvider || "email",
      zone: data.zone,
      createdAt: now,
      updatedAt: now,
    };
    if (data.role === "user") {
      user.clientType = data.clientType || "hogar";
      user.rating = 0;
      user.reviewCount = 0;
    } else {
      user.trade = data.trade || data.trades?.[0];
      user.trades = data.trades || (data.trade ? [data.trade] : []);
      user.coverageZone = data.coverageZone;
      user.hourlyRate = data.hourlyRate;
      user.bio = data.bio;
      user.verification = data.verification || { identity: false, background: false, license: false };
      user.verified = !!(user.verification.identity && user.verification.background);
      user.level = "bronze";
      user.rating = 0;
      user.reviewCount = 0;
      user.jobsDone = 0;
      user.premium = false;
      user.available = true;
    }
    this.users.push(user);
    this.saveToStorage();
    const token = this.generateToken(user.id);
    this.currentToken = token;
    this.currentUser = user;
    localStorage.setItem(TOKEN_KEY, token);
    return { token, user: this.sanitizeUser(user) };
  }

  login(email: string, password: string) {
    const user = this.users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Email o contraseña incorrectos");
    const token = this.generateToken(user.id);
    this.currentToken = token;
    this.currentUser = user;
    localStorage.setItem(TOKEN_KEY, token);
    return { token, user: this.sanitizeUser(user) };
  }

  logout() {
    this.currentToken = null;
    this.currentUser = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  getCurrentUser(): PublicUser | null {
    return this.currentUser ? this.sanitizeUser(this.currentUser) : null;
  }

  private generateToken(userId: string) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }));
    const sig = btoa(Math.random().toString());
    return `${header}.${payload}.${sig}`;
  }

  private sanitizeUser(u: User): PublicUser {
    const { password, ...rest } = u;
    return rest;
  }

  private requireAuth(): User {
    if (!this.currentUser) throw new Error("No autenticado");
    return this.currentUser;
  }

  getUser(id: string): PublicUser | null {
    const u = this.users.find((x) => x.id === id);
    return u ? this.sanitizeUser(u) : null;
  }

  updateUser(id: string, patch: Partial<User>) {
    if (this.requireAuth().id !== id) throw new Error("No autorizado");
    const i = this.users.findIndex((u) => u.id === id);
    if (i === -1) throw new Error("Usuario no encontrado");
    this.users[i] = { ...this.users[i], ...patch, updatedAt: new Date().toISOString() };
    this.currentUser = this.users[i];
    this.saveToStorage();
    return this.sanitizeUser(this.users[i]);
  }

  // ─────────────────────── Trabajadores / búsqueda ───────────────────────
  getWorkers(filters: { category?: string; zone?: string; q?: string; onlyAvailable?: boolean } = {}): PublicUser[] {
    let list = this.users.filter((u) => u.role === "worker");
    if (filters.category) list = list.filter((w) => w.trades?.includes(filters.category!) || w.trade === filters.category);
    if (filters.zone) {
      const z = filters.zone.toLowerCase();
      list = list.filter((w) => (w.coverageZone || w.zone || "").toLowerCase().includes(z));
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter((w) => w.name.toLowerCase().includes(q) || (w.trade || "").toLowerCase().includes(q) || (w.bio || "").toLowerCase().includes(q));
    }
    if (filters.onlyAvailable) list = list.filter((w) => w.available);
    return list
      .sort((a, b) => (b.premium ? 1 : 0) - (a.premium ? 1 : 0) || (b.rating || 0) - (a.rating || 0))
      .map((u) => this.sanitizeUser(u));
  }

  getWorker(id: string): PublicUser | null {
    const w = this.users.find((u) => u.id === id && u.role === "worker");
    return w ? this.sanitizeUser(w) : null;
  }

  getRecommendedWorkers(limit = 6): PublicUser[] {
    return this.getWorkers({ onlyAvailable: false }).slice(0, limit);
  }

  // Distancia aproximada (km) para el mock de cercanía.
  distanceKm(a?: { lat: number; lng: number }, b?: { lat: number; lng: number }): number | null {
    if (!a || !b) return null;
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)) * 10) / 10;
  }

  getNearbyWorkers(geo: { lat: number; lng: number } | undefined, filters: { category?: string; onlyAvailable?: boolean } = {}) {
    const workers = this.getWorkers(filters);
    return workers
      .map((w) => ({ worker: w, distance: this.distanceKm(geo, w.geo) }))
      .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  }

  // ─────────────────────────── Offers (solicitudes) ───────────────────────────
  getOffers(filters: { status?: OfferStatus; category?: string; q?: string; authorId?: string; urgency?: Urgency; emergency?: boolean } = {}) {
    let list = [...this.offers];
    if (filters.status) list = list.filter((o) => o.status === filters.status);
    if (filters.category) list = list.filter((o) => o.category === filters.category);
    if (filters.authorId) list = list.filter((o) => o.authorId === filters.authorId);
    if (filters.urgency) list = list.filter((o) => o.urgency === filters.urgency);
    if (typeof filters.emergency === "boolean") list = list.filter((o) => !!o.emergency === filters.emergency);
    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter((o) => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOffer(id: string) {
    return this.offers.find((o) => o.id === id);
  }

  createOffer(data: Omit<Offer, "id" | "createdAt" | "updatedAt">) {
    if (this.requireAuth().role !== "user") throw new Error("Solo los usuarios pueden crear solicitudes");
    const now = new Date().toISOString();
    const offer: Offer = { ...data, id: `o${Date.now()}`, createdAt: now, updatedAt: now };
    this.offers.push(offer);
    this.saveToStorage();
    return offer;
  }

  updateOffer(id: string, patch: Partial<Offer>) {
    const me = this.requireAuth();
    const i = this.offers.findIndex((o) => o.id === id);
    if (i === -1) throw new Error("Solicitud no encontrada");
    if (this.offers[i].authorId !== me.id) throw new Error("No autorizado");
    this.offers[i] = { ...this.offers[i], ...patch, updatedAt: new Date().toISOString() };
    this.saveToStorage();
    return this.offers[i];
  }

  // Botón de emergencia (SOS) — cliente / PyME.
  createEmergency(data: { category: string; description?: string; location: string; geo?: { lat: number; lng: number }; budget?: number }) {
    const me = this.requireAuth();
    if (me.role !== "user") throw new Error("Solo los usuarios pueden pedir emergencias");
    const now = new Date().toISOString();
    const offer: Offer = {
      id: `o${Date.now()}`,
      authorId: me.id,
      title: `Emergencia: ${data.category}`,
      description: data.description || "Solicitud de emergencia. Necesito un profesional lo antes posible.",
      category: data.category,
      budget: data.budget || 0,
      urgency: "inmediata",
      location: data.location,
      geo: data.geo,
      images: [],
      emergency: true,
      status: "abierta",
      createdAt: now,
      updatedAt: now,
    };
    this.offers.push(offer);
    // Notificar a trabajadores disponibles y cercanos de la categoría.
    const nearby = this.getNearbyWorkers(data.geo, { category: data.category, onlyAvailable: true }).slice(0, 5);
    nearby.forEach(({ worker }) =>
      this.pushNotification(worker.id, "emergencia", "🚨 Emergencia cerca tuyo", `${me.name} necesita un ${data.category} con urgencia en ${data.location}.`, `/w/jobs/${offer.id}`),
    );
    this.saveToStorage();
    return { offer, notified: nearby.length };
  }

  // ─────────────────────────── Proposals ───────────────────────────
  getProposals(filters: { workerId?: string; offerId?: string; status?: ProposalStatus } = {}) {
    let list = [...this.proposals];
    if (filters.workerId) list = list.filter((p) => p.workerId === filters.workerId);
    if (filters.offerId) list = list.filter((p) => p.offerId === filters.offerId);
    if (filters.status) list = list.filter((p) => p.status === filters.status);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getProposal(id: string) {
    return this.proposals.find((p) => p.id === id);
  }

  createProposal(data: Omit<Proposal, "id" | "createdAt" | "status"> & { status?: ProposalStatus }) {
    const me = this.requireAuth();
    if (me.role !== "worker") throw new Error("Solo los trabajadores pueden enviar propuestas");
    const proposal: Proposal = { ...data, status: data.status || "enviada", id: `p${Date.now()}`, createdAt: new Date().toISOString() };
    this.proposals.push(proposal);
    const offer = this.offers.find((o) => o.id === data.offerId);
    if (offer) this.pushNotification(offer.authorId, "oferta", "Nueva propuesta recibida", `${me.name} envió una propuesta ($${data.price.toLocaleString()}) para "${offer.title}".`, `/u/requests/${offer.id}`);
    this.saveToStorage();
    return proposal;
  }

  updateProposal(id: string, status: ProposalStatus) {
    const me = this.requireAuth();
    const i = this.proposals.findIndex((p) => p.id === id);
    if (i === -1) throw new Error("Propuesta no encontrada");
    const proposal = this.proposals[i];
    const offer = this.offers.find((o) => o.id === proposal.offerId);
    if ((status === "aceptada" || status === "rechazada") && (!offer || offer.authorId !== me.id)) throw new Error("No autorizado");
    this.proposals[i] = { ...proposal, status };
    this.saveToStorage();
    return this.proposals[i];
  }

  // Cliente acepta una propuesta → crea un Job (agendado, sin pagar) y rechaza el resto.
  acceptProposal(proposalId: string, opts: { scheduledAt?: string } = {}) {
    const me = this.requireAuth();
    const proposal = this.proposals.find((p) => p.id === proposalId);
    if (!proposal) throw new Error("Propuesta no encontrada");
    const offer = this.offers.find((o) => o.id === proposal.offerId);
    if (!offer) throw new Error("Solicitud no encontrada");
    if (offer.authorId !== me.id) throw new Error("No autorizado");

    this.proposals = this.proposals.map((p) => {
      if (p.id === proposalId) return { ...p, status: "aceptada" as ProposalStatus };
      if (p.offerId === offer.id) return { ...p, status: "rechazada" as ProposalStatus };
      return p;
    });
    offer.status = "asignada";
    offer.updatedAt = new Date().toISOString();

    const job: Job = {
      id: `j${Date.now()}`,
      offerId: offer.id,
      proposalId: proposal.id,
      clientId: offer.authorId,
      workerId: proposal.workerId,
      category: offer.category,
      title: offer.title,
      amount: proposal.price,
      scheduledAt: opts.scheduledAt || offer.scheduledDate,
      insurance: false,
      status: "agendado",
      createdAt: new Date().toISOString(),
    };
    this.jobs.push(job);
    this.pushNotification(proposal.workerId, "reserva", "¡Propuesta aceptada!", `${me.name} aceptó tu propuesta para "${offer.title}".`, `/w/agreements/${job.id}`);
    this.saveToStorage();
    return job;
  }

  // ─────────────────────────── Services ───────────────────────────
  getServices(filters: { workerId?: string; category?: string; includeInactive?: boolean } = {}) {
    let list = [...this.services];
    if (filters.workerId) list = list.filter((s) => s.workerId === filters.workerId);
    if (filters.category) list = list.filter((s) => s.category === filters.category);
    if (!filters.includeInactive) list = list.filter((s) => s.active);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getService(id: string) {
    return this.services.find((s) => s.id === id);
  }

  createService(data: Omit<Service, "id" | "views" | "createdAt" | "updatedAt">) {
    if (this.requireAuth().role !== "worker") throw new Error("Solo los trabajadores pueden crear servicios");
    const now = new Date().toISOString();
    const service: Service = { ...data, id: `s${Date.now()}`, views: 0, createdAt: now, updatedAt: now };
    this.services.push(service);
    this.saveToStorage();
    return service;
  }

  updateService(id: string, patch: Partial<Service>) {
    const me = this.requireAuth();
    const i = this.services.findIndex((s) => s.id === id);
    if (i === -1) throw new Error("Servicio no encontrado");
    if (this.services[i].workerId !== me.id) throw new Error("No autorizado");
    this.services[i] = { ...this.services[i], ...patch, updatedAt: new Date().toISOString() };
    this.saveToStorage();
    return this.services[i];
  }

  deleteService(id: string) {
    const me = this.requireAuth();
    const s = this.services.find((x) => x.id === id);
    if (!s) throw new Error("Servicio no encontrado");
    if (s.workerId !== me.id) throw new Error("No autorizado");
    this.services = this.services.filter((x) => x.id !== id);
    this.saveToStorage();
  }

  // ─────────────────────────── Jobs / Acuerdos ───────────────────────────
  getJobs(filters: { clientId?: string; workerId?: string; status?: Job["status"] } = {}) {
    let list = [...this.jobs];
    if (filters.clientId) list = list.filter((j) => j.clientId === filters.clientId);
    if (filters.workerId) list = list.filter((j) => j.workerId === filters.workerId);
    if (filters.status) list = list.filter((j) => j.status === filters.status);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getJob(id: string) {
    return this.jobs.find((j) => j.id === id);
  }

  updateJob(id: string, patch: Partial<Job>) {
    const i = this.jobs.findIndex((j) => j.id === id);
    if (i === -1) throw new Error("Trabajo no encontrado");
    this.jobs[i] = { ...this.jobs[i], ...patch };
    this.saveToStorage();
    return this.jobs[i];
  }

  // Cliente valida el trabajo → libera fondos, cierra el acuerdo y acredita al trabajador.
  completeJob(id: string) {
    const me = this.requireAuth();
    const job = this.jobs.find((j) => j.id === id);
    if (!job) throw new Error("Trabajo no encontrado");
    if (job.clientId !== me.id) throw new Error("Solo el cliente puede validar el trabajo");
    job.status = "completado";
    job.completedAt = new Date().toISOString();

    const payment = this.payments.find((p) => p.jobId === id);
    if (payment && payment.status === "retenido") {
      payment.status = "liberado";
      payment.releasedAt = new Date().toISOString();
      this.payouts.push({ id: `pay${Date.now()}`, workerId: job.workerId, amount: payment.net, status: "pendiente", createdAt: new Date().toISOString() });
    }

    const proposal = this.proposals.find((p) => p.id === job.proposalId);
    if (proposal) proposal.status = "finalizada";
    const offer = this.offers.find((o) => o.id === job.offerId);
    if (offer) offer.status = "completada";

    const worker = this.users.find((u) => u.id === job.workerId);
    if (worker) {
      worker.jobsDone = (worker.jobsDone || 0) + 1;
      worker.level = this.computeLevel(worker.jobsDone);
    }
    this.pushNotification(job.workerId, "pago", "Trabajo validado", `${me.name} validó "${job.title}". Se liberaron los fondos a tu billetera.`, "/w/cobros");
    this.saveToStorage();
    return job;
  }

  cancelJob(id: string) {
    const me = this.requireAuth();
    const job = this.jobs.find((j) => j.id === id);
    if (!job) throw new Error("Trabajo no encontrado");
    if (job.clientId !== me.id && job.workerId !== me.id) throw new Error("No autorizado");
    if (job.status === "completado") throw new Error("El trabajo ya está completado");
    job.status = "cancelado";
    const payment = this.payments.find((p) => p.jobId === id);
    if (payment && payment.status === "retenido") payment.status = "reembolsado";
    const offer = this.offers.find((o) => o.id === job.offerId);
    if (offer) offer.status = "cancelada";
    this.saveToStorage();
    return job;
  }

  private computeLevel(jobsDone: number): WorkerLevel {
    if (jobsDone >= LEVEL_THRESHOLDS.gold) return "gold";
    if (jobsDone >= LEVEL_THRESHOLDS.silver) return "silver";
    return "bronze";
  }

  // ─────────────────────────── Pagos (escrow) ───────────────────────────
  getPayment(jobId: string) {
    return this.payments.find((p) => p.jobId === jobId);
  }

  quotePayment(gross: number, insuranceCost = 0) {
    const commission = Math.round(gross * OFIX_COMMISSION_RATE);
    return { gross, commission, insuranceCost, total: gross + commission + insuranceCost, net: gross };
  }

  createPayment(data: { jobId: string; method: PaymentMethod; insurancePlanId?: string }) {
    const me = this.requireAuth();
    const job = this.jobs.find((j) => j.id === data.jobId);
    if (!job) throw new Error("Trabajo no encontrado");
    if (job.clientId !== me.id) throw new Error("No autorizado");
    const plan = data.insurancePlanId ? INSURANCE_PLANS.find((p) => p.id === data.insurancePlanId) : undefined;
    const insuranceCost = plan?.cost || 0;
    const q = this.quotePayment(job.amount, insuranceCost);
    const payment: Payment = {
      id: `pay${Date.now()}`,
      jobId: job.id,
      clientId: job.clientId,
      workerId: job.workerId,
      gross: q.gross,
      commission: q.commission,
      insuranceCost,
      total: q.total,
      net: q.net,
      method: data.method,
      status: data.method === "efectivo" ? "pendiente" : "retenido",
      createdAt: new Date().toISOString(),
    };
    this.payments.push(payment);
    job.insurance = !!plan;
    job.insuranceCost = insuranceCost;
    if (job.status === "agendado") job.status = "en_progreso";
    this.pushNotification(job.workerId, "pago", "Pago en garantía", `${me.name} pagó "${job.title}". Los fondos se liberan al validar el trabajo.`, `/w/agreements/${job.id}`);
    this.saveToStorage();
    return payment;
  }

  // ──────────────────── Comprobantes / facturación ────────────────────
  // Comprobante de un trabajo pagado. Documento derivado (no se persiste):
  // se arma desde el Payment + el Job + los datos de las partes.
  getReceipt(jobId: string): Receipt | null {
    const payment = this.payments.find((p) => p.jobId === jobId);
    if (!payment) return null;
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    const client = this.users.find((u) => u.id === payment.clientId);
    const worker = this.users.find((u) => u.id === payment.workerId);

    // Numeración correlativa estable: el orden de alta de los pagos no cambia.
    const seq = this.payments.findIndex((p) => p.id === payment.id) + 1;
    const kind: ReceiptKind = client?.clientType === "pyme_gastronomica" ? "A" : "B";
    const plan = payment.insuranceCost ? INSURANCE_PLANS.find((p) => p.cost === payment.insuranceCost) : undefined;

    return {
      number: `OFIX-0001-${String(seq).padStart(8, "0")}`,
      kind,
      issuedAt: payment.createdAt,
      paidAt: payment.releasedAt,
      jobId: job.id,
      client: {
        name: client?.name || "Cliente",
        email: client?.email,
        phone: client?.phone,
        address: client?.address || client?.zone,
        detail: client?.clientType === "pyme_gastronomica" ? "PyME gastronómica" : "Consumidor final",
      },
      worker: {
        name: worker?.name || "Profesional",
        email: worker?.email,
        phone: worker?.phone,
        address: worker?.coverageZone || worker?.zone,
        detail: worker?.trade,
      },
      concept: job.title,
      category: job.category,
      gross: payment.gross,
      commission: payment.commission,
      insuranceCost: payment.insuranceCost,
      insuranceName: plan?.name,
      total: payment.total,
      method: payment.method,
      status: payment.status,
    };
  }

  // Todos los comprobantes de un cliente, del más nuevo al más viejo.
  getReceipts(clientId: string): Receipt[] {
    return this.payments
      .filter((p) => p.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((p) => this.getReceipt(p.jobId))
      .filter((r): r is Receipt => r !== null);
  }

  // Facturación agrupada por mes (panel PyME / reportes mensuales).
  getBillingPeriods(clientId: string): BillingPeriod[] {
    const byMonth = new Map<string, Receipt[]>();
    for (const r of this.getReceipts(clientId)) {
      const d = new Date(r.issuedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const arr = byMonth.get(key);
      if (arr) arr.push(r);
      else byMonth.set(key, [r]);
    }
    return [...byMonth.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, receipts]) => ({
        key,
        label: new Date(`${key}-01T00:00:00`).toLocaleDateString("es-AR", { month: "long", year: "numeric" }),
        jobs: receipts.length,
        gross: receipts.reduce((s, r) => s + r.gross, 0),
        commission: receipts.reduce((s, r) => s + r.commission, 0),
        insuranceCost: receipts.reduce((s, r) => s + r.insuranceCost, 0),
        total: receipts.reduce((s, r) => s + r.total, 0),
        receipts,
      }));
  }

  // ─────────────────────────── Reseñas ───────────────────────────
  getReviews(filters: { targetId?: string; authorId?: string; jobId?: string } = {}) {
    let list = [...this.reviews];
    if (filters.targetId) list = list.filter((r) => r.targetId === filters.targetId);
    if (filters.authorId) list = list.filter((r) => r.authorId === filters.authorId);
    if (filters.jobId) list = list.filter((r) => r.jobId === filters.jobId);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createReview(data: { jobId: string; targetId: string; stars: number; comment: string }) {
    const me = this.requireAuth();
    const job = this.jobs.find((j) => j.id === data.jobId);
    if (!job) throw new Error("Trabajo no encontrado");
    const review: Review = { id: `r${Date.now()}`, jobId: data.jobId, authorId: me.id, targetId: data.targetId, stars: data.stars, comment: data.comment, createdAt: new Date().toISOString() };
    this.reviews.push(review);
    if (me.id === job.clientId) job.reviewedByClient = true;
    if (me.id === job.workerId) job.reviewedByWorker = true;
    this.recomputeRating(data.targetId);
    this.pushNotification(data.targetId, "sistema", "Nueva reseña", `${me.name} te dejó ${data.stars}★.`, "");
    this.saveToStorage();
    return review;
  }

  private recomputeRating(userId: string) {
    const rs = this.reviews.filter((r) => r.targetId === userId);
    const u = this.users.find((x) => x.id === userId);
    if (u) {
      u.reviewCount = rs.length;
      u.rating = rs.length ? Math.round((rs.reduce((s, r) => s + r.stars, 0) / rs.length) * 10) / 10 : 0;
    }
  }

  // ─────────────────────────── Favoritos ───────────────────────────
  getFavorites(clientId: string): PublicUser[] {
    const ids = this.favorites.filter((f) => f.clientId === clientId).map((f) => f.workerId);
    return this.users.filter((u) => ids.includes(u.id)).map((u) => this.sanitizeUser(u));
  }

  isFavorite(clientId: string, workerId: string) {
    return this.favorites.some((f) => f.clientId === clientId && f.workerId === workerId);
  }

  toggleFavorite(workerId: string) {
    const me = this.requireAuth();
    const existing = this.favorites.find((f) => f.clientId === me.id && f.workerId === workerId);
    if (existing) {
      this.favorites = this.favorites.filter((f) => f.id !== existing.id);
      this.saveToStorage();
      return false;
    }
    this.favorites.push({ id: `f${Date.now()}`, clientId: me.id, workerId, createdAt: new Date().toISOString() });
    this.saveToStorage();
    return true;
  }

  // ─────────────────────────── Notificaciones ───────────────────────────
  getNotifications(userId: string) {
    return this.notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  unreadCount(userId: string) {
    return this.notifications.filter((n) => n.userId === userId && !n.read).length;
  }

  markNotificationRead(id: string) {
    const n = this.notifications.find((x) => x.id === id);
    if (n) n.read = true;
    this.saveToStorage();
  }

  markAllNotificationsRead(userId: string) {
    this.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    this.saveToStorage();
  }

  private pushNotification(userId: string, type: NotificationType, title: string, body: string, link = "") {
    this.notifications.push({ id: `n${Date.now()}${Math.floor(performance.now())}`, userId, type, title, body, read: false, link, createdAt: new Date().toISOString() });
  }

  // ─────────────────────────── Chats & mensajes ───────────────────────────
  getChats(userId: string) {
    return this.chats.filter((c) => c.participantIds.includes(userId)).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }

  getChat(id: string) {
    return this.chats.find((c) => c.id === id);
  }

  // Contexto de una conversación: sobre qué trabajo u oferta están hablando.
  getChatContext(chatId: string): { label: string; jobId?: string; offerId?: string } | null {
    const chat = this.chats.find((c) => c.id === chatId);
    if (!chat) return null;
    const parts = chat.participantIds.map((id) => this.users.find((u) => u.id === id)).filter(Boolean) as User[];
    const worker = parts.find((u) => u.role === "worker");
    const client = parts.find((u) => u.role === "user");
    if (!worker || !client) return null;
    const job = this.jobs
      .filter((j) => j.workerId === worker.id && j.clientId === client.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (job) return { label: job.title, jobId: job.id, offerId: job.offerId };
    const match = this.proposals
      .filter((p) => p.workerId === worker.id)
      .map((p) => ({ p, offer: this.offers.find((o) => o.id === p.offerId) }))
      .find((x) => x.offer && x.offer.authorId === client.id);
    if (match?.offer) return { label: match.offer.title, offerId: match.offer.id };
    return null;
  }

  createChat(a: string, b: string) {
    const existing = this.chats.find((c) => c.participantIds.includes(a) && c.participantIds.includes(b));
    if (existing) return existing;
    const chat: Chat = { id: `c${Date.now()}`, participantIds: [a, b], lastMessageAt: new Date().toISOString() };
    this.chats.push(chat);
    this.saveToStorage();
    return chat;
  }

  getMessages(chatId: string) {
    return this.messages.filter((m) => m.chatId === chatId).sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
  }

  createMessage(chatId: string, text: string, image?: string) {
    const me = this.requireAuth();
    const msg: Message = { id: `m${Date.now()}`, chatId, authorId: me.id, text, image, ts: new Date().toISOString(), status: "sent" };
    this.messages.push(msg);
    const ci = this.chats.findIndex((c) => c.id === chatId);
    const prevChat = ci !== -1 ? { ...this.chats[ci] } : null;
    if (ci !== -1) {
      this.chats[ci].lastMessageAt = msg.ts;
      this.chats[ci].lastMessage = text || (image ? "📷 Foto" : "");
    }
    // Un adjunto puede llenar la cuota del navegador: si la escritura falla,
    // se revierte el mensaje en memoria para no dejar estado inconsistente.
    if (!this.saveToStorage() && image) {
      this.messages = this.messages.filter((m) => m.id !== msg.id);
      if (ci !== -1 && prevChat) this.chats[ci] = prevChat;
      this.saveToStorage();
      throw new Error("No hay espacio para guardar la foto. Borrá conversaciones viejas e intentá de nuevo.");
    }
    setTimeout(() => {
      const chat = this.chats.find((c) => c.id === chatId);
      if (chat) {
        const other = chat.participantIds.find((p) => p !== me.id);
        if (other) {
          const reply: Message = { id: `m${Date.now()}`, chatId, authorId: other, text: "Gracias por tu mensaje! Te respondo pronto.", ts: new Date().toISOString(), status: "sent" };
          this.messages.push(reply);
          if (ci !== -1) {
            this.chats[ci].lastMessageAt = reply.ts;
            this.chats[ci].lastMessage = reply.text;
          }
          this.saveToStorage();
        }
      }
    }, 3000);
    return msg;
  }

  // ─────────────────────────── Cobros / Wallet ───────────────────────────
  getPayouts(workerId: string) {
    return this.payouts.filter((p) => p.workerId === workerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getWalletSummary(workerId: string) {
    const payouts = this.getPayouts(workerId);
    const available = payouts.filter((p) => p.status === "pendiente").reduce((s, p) => s + p.amount, 0);
    const withdrawn = payouts.filter((p) => p.status === "liquidado").reduce((s, p) => s + p.amount, 0);
    const totalEarned = available + withdrawn;
    return { available, withdrawn, totalEarned, count: payouts.length };
  }

  // Retiro de fondos disponibles (a CBU/MP, sin comisión).
  withdrawFunds() {
    const me = this.requireAuth();
    if (me.role !== "worker") throw new Error("Solo los trabajadores pueden retirar");
    let total = 0;
    this.payouts.forEach((p) => {
      if (p.workerId === me.id && p.status === "pendiente") {
        p.status = "liquidado";
        p.paidAt = new Date().toISOString();
        total += p.amount;
      }
    });
    this.saveToStorage();
    return total;
  }

  // Método legado: registrar un cobro manual (mantiene retrocompatibilidad).
  createPayout(amount: number) {
    const me = this.requireAuth();
    if (me.role !== "worker") throw new Error("Solo los trabajadores pueden solicitar cobros");
    const payout: Payout = { id: `pay${Date.now()}`, workerId: me.id, amount, status: "pendiente", createdAt: new Date().toISOString() };
    this.payouts.push(payout);
    this.saveToStorage();
    return payout;
  }

  // ─────────────────────────── Estadísticas ───────────────────────────
  getWorkerStats(workerId: string) {
    const jobs = this.jobs.filter((j) => j.workerId === workerId);
    const completed = jobs.filter((j) => j.status === "completado");
    const proposals = this.proposals.filter((p) => p.workerId === workerId);
    const wallet = this.getWalletSummary(workerId);
    const worker = this.users.find((u) => u.id === workerId);
    const acceptanceRate = proposals.length ? Math.round((proposals.filter((p) => p.status !== "rechazada" && p.status !== "enviada").length / proposals.length) * 100) : 0;
    // Ingresos por mes (últimos 6 meses) para el gráfico.
    const now = new Date();
    const months: { label: string; income: number }[] = [];
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const income = completed
        .filter((j) => {
          const cd = j.completedAt ? new Date(j.completedAt) : null;
          return cd && cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
        })
        .reduce((s, j) => s + j.amount, 0);
      months.push({ label: monthNames[d.getMonth()], income });
    }
    return {
      totalJobs: completed.length,
      activeJobs: jobs.filter((j) => j.status === "agendado" || j.status === "en_progreso").length,
      proposalsSent: proposals.length,
      acceptanceRate,
      rating: worker?.rating || 0,
      reviewCount: worker?.reviewCount || 0,
      level: worker?.level || "bronze",
      wallet,
      months,
    };
  }

  // ─────────────────────────── Verificación KYC ───────────────────────────
  verifyWorker(patch: Partial<Verification>) {
    const me = this.requireAuth();
    if (me.role !== "worker") throw new Error("Solo los trabajadores");
    const i = this.users.findIndex((u) => u.id === me.id);
    const current = this.users[i].verification || { identity: false, background: false, license: false };
    const verification = { ...current, ...patch };
    this.users[i] = { ...this.users[i], verification, verified: verification.identity && verification.background, updatedAt: new Date().toISOString() };
    this.currentUser = this.users[i];
    this.saveToStorage();
    return this.sanitizeUser(this.users[i]);
  }

  // ─────────────────────────── Agenda ───────────────────────────
  getAgenda(userId: string) {
    return this.jobs
      .filter((j) => (j.clientId === userId || j.workerId === userId) && j.scheduledAt && j.status !== "cancelado")
      .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());
  }

  // Reprogramar un trabajo: lo puede hacer cualquiera de las dos partes,
  // mientras el trabajo no esté cerrado. Avisa a la contraparte.
  rescheduleJob(id: string, scheduledAt: string) {
    const me = this.requireAuth();
    const i = this.jobs.findIndex((j) => j.id === id);
    if (i === -1) throw new Error("Trabajo no encontrado");
    const job = this.jobs[i];
    if (job.clientId !== me.id && job.workerId !== me.id) throw new Error("No autorizado");
    if (job.status === "completado" || job.status === "cancelado") {
      throw new Error("No se puede reprogramar un trabajo cerrado");
    }
    const when = new Date(scheduledAt);
    if (Number.isNaN(when.getTime())) throw new Error("Fecha inválida");

    this.jobs[i] = { ...job, scheduledAt: when.toISOString() };
    const otherId = job.clientId === me.id ? job.workerId : job.clientId;
    const isWorker = me.role === "worker";
    const label = when.toLocaleString("es-AR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
    this.pushNotification(
      otherId,
      "reserva",
      "Trabajo reprogramado",
      `${me.name} movió "${job.title}" al ${label}.`,
      isWorker ? `/u/jobs/${job.id}` : `/w/agreements/${job.id}`,
    );
    this.saveToStorage();
    return this.jobs[i];
  }

  // Suscripción premium del trabajador.
  setPremium(active: boolean) {
    const me = this.requireAuth();
    const i = this.users.findIndex((u) => u.id === me.id);
    this.users[i] = { ...this.users[i], premium: active, updatedAt: new Date().toISOString() };
    this.currentUser = this.users[i];
    this.saveToStorage();
    return this.sanitizeUser(this.users[i]);
  }
}

export const store = new DataStore();
export { CATEGORIES };
