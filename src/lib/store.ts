// Data layer — capa de datos de OFIX Connect. Store en memoria persistido a
// localStorage ("ofix-data") con un token falso ("ofix-token"). Sin backend:
// simula pagos (escrow), verificación KYC, seguros, geolocalización y el
// seguimiento en tiempo real del servicio.
//
// Nota sobre el "tiempo real": no hay timers ni websockets. El avance del
// trayecto se DERIVA de los timestamps (salida + ETA vs. reloj actual), así que
// cada render recalcula la posición y el ETA restante. Es determinista,
// sobrevive a un refresh y no necesita backend.
import {
  CATEGORIES,
  DEFAULT_INSURANCE_PLAN_ID,
  DEFAULT_ONCALL_SURCHARGE_RATE,
  DEFAULT_WARRANTY_DAYS,
  ESCALATION_RADIUS_STEPS_KM,
  FREQUENCY_DAYS,
  INSURANCE_PLANS,
  LEVEL_THRESHOLDS,
  MANDATORY_INSURANCE_CATEGORIES,
  OFIX_COMMISSION_RATE,
  RESPONSE_WINDOW_MINUTES,
  type ArrivalCard,
  type AuthProvider,
  type AvailabilityStatus,
  type BillingPeriod,
  type Chat,
  type ClientPlan,
  type ClientType,
  type Complexity,
  type DemandInsight,
  type Dispute,
  type DisputeReason,
  type DisputeStatus,
  type Favorite,
  type Frequency,
  type Geo,
  type Job,
  type JobTimelineEvent,
  type Message,
  type Notification,
  type NotificationType,
  type NpsResponse,
  type Offer,
  type OfferStatus,
  type Payment,
  type PaymentMethod,
  type Payout,
  type PriceReference,
  type Property,
  type Proposal,
  type ProposalStatus,
  type PublicUser,
  type Receipt,
  type ReceiptKind,
  type RecurringPlan,
  type Review,
  type Role,
  type Service,
  type TrackingState,
  type Urgency,
  type User,
  type Verification,
  type WarrantyClaim,
  type WorkerLevel,
  type WorkSchedule,
} from "./types";

const DATA_KEY = "ofix-data";
const TOKEN_KEY = "ofix-token";
// Bump cuando cambia el esquema de datos: invalida el localStorage viejo y re-seedea.
const DATA_VERSION = 7;

// Foto real y temática (Creative Commons) por palabra clave, para el seed.
function photo(keyword: string, lock: number, w = 480, h = 360): string {
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(keyword)}?lock=${lock}`;
}
// Avatar real de persona (randomuser) — cae a iniciales si falla.
function avatar(gender: "men" | "women", n: number): string {
  return `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;
}

const FULL_WEEK: WorkSchedule = { days: [1, 2, 3, 4, 5, 6], from: "08:00", to: "20:00" };
const WEEKDAYS: WorkSchedule = { days: [1, 2, 3, 4, 5], from: "09:00", to: "18:00" };
const ALL_DAY: WorkSchedule = { days: [0, 1, 2, 3, 4, 5, 6], from: "00:00", to: "23:59" };

class DataStore {
  users: User[] = [];
  properties: Property[] = [];
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
  disputes: Dispute[] = [];
  warrantyClaims: WarrantyClaim[] = [];
  recurringPlans: RecurringPlan[] = [];
  npsResponses: NpsResponse[] = [];
  currentToken: string | null = null;
  currentUser: User | null = null;

  constructor() {
    this.loadFromStorage();
    if (this.users.length === 0) this.seedData();
    this.runRecurringPlans();
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
        this.properties = d.properties || [];
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
        this.disputes = d.disputes || [];
        this.warrantyClaims = d.warrantyClaims || [];
        this.recurringPlans = d.recurringPlans || [];
        this.npsResponses = d.npsResponses || [];
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
          properties: this.properties,
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
          disputes: this.disputes,
          warrantyClaims: this.warrantyClaims,
          recurringPlans: this.recurringPlans,
          npsResponses: this.npsResponses,
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
    const minsAgo = (n: number) => new Date(Date.now() - n * 60000).toISOString();
    const fullVerif: Verification = { identity: true, background: true, license: true };

    this.users = [
      { id: "u1", name: "María García", email: "maria@example.com", password: "password123", phone: "+54 11 1234-5678", role: "user", clientType: "hogar", clientPlan: "free", zone: "Palermo, CABA", address: "Av. Santa Fe 3200", geo: { lat: -34.5885, lng: -58.4105 }, photo: avatar("women", 68), rating: 4.7, reviewCount: 6, createdAt: daysAgo(120), updatedAt: t },
      { id: "u2", name: "Carlos López", email: "carlos@example.com", password: "password123", phone: "+54 11 2345-6789", role: "user", clientType: "hogar", clientPlan: "free", zone: "Belgrano, CABA", address: "Av. Cabildo 1800", geo: { lat: -34.5627, lng: -58.4583 }, photo: avatar("men", 32), rating: 4.5, reviewCount: 3, createdAt: daysAgo(90), updatedAt: t },
      { id: "u3", name: "Bodegón La Esquina", email: "bodegon@example.com", password: "password123", phone: "+54 11 5555-1010", role: "user", clientType: "pyme_gastronomica", clientPlan: "plus", zone: "San Telmo, CABA", address: "Defensa 1200", geo: { lat: -34.6208, lng: -58.3735 }, photo: photo("restaurant,bar", 21, 200, 200), rating: 4.8, reviewCount: 12, createdAt: daysAgo(200), updatedAt: t },
      { id: "u4", name: "Administración Rivadavia", email: "consorcios@example.com", password: "password123", phone: "+54 11 4444-2020", role: "user", clientType: "administrador_consorcio", clientPlan: "plus", zone: "Caballito, CABA", address: "Av. Rivadavia 5400", geo: { lat: -34.6180, lng: -58.4420 }, photo: photo("building,apartment", 22, 200, 200), rating: 4.6, reviewCount: 9, createdAt: daysAgo(260), updatedAt: t },

      { id: "w1", name: "Juan Pérez", email: "juan@example.com", password: "password123", phone: "+54 11 3456-7890", role: "worker", trade: "Plomería", trades: ["Plomería", "Gas"], coverageZone: "Palermo, Villa Crespo, Caballito", hourlyRate: 3500, bio: "Plomero matriculado con más de 10 años de experiencia en urgencias del hogar. Trabajo garantizado.", verified: true, verification: fullVerif, level: "gold", rating: 4.8, reviewCount: 34, jobsDone: 42, premium: true, available: true, workSchedule: FULL_WEEK, onCallWeekends: true, onCallSurcharge: 20, vehicle: "Kangoo blanca — AB 123 CD", invitesReceived: 40, invitesAnswered: 36, responseMinutesTotal: 320, zone: "Palermo, CABA", geo: { lat: -34.5889, lng: -58.4298 }, photo: avatar("men", 45), createdAt: daysAgo(300), updatedAt: t },
      { id: "w2", name: "Ana Rodríguez", email: "ana@example.com", password: "password123", phone: "+54 11 4567-8901", role: "worker", trade: "Electricidad", trades: ["Electricidad", "Aire acondicionado"], coverageZone: "Belgrano, Núñez, Colegiales", hourlyRate: 4000, bio: "Electricista matriculada. Instalaciones, tableros y reparaciones. Presupuesto sin cargo.", verified: true, verification: fullVerif, level: "silver", rating: 4.9, reviewCount: 18, jobsDone: 21, premium: false, available: true, workSchedule: WEEKDAYS, onCallWeekends: false, vehicle: "Partner gris — AC 456 EF", invitesReceived: 22, invitesAnswered: 19, responseMinutesTotal: 240, zone: "Belgrano, CABA", geo: { lat: -34.5610, lng: -58.4560 }, photo: avatar("women", 44), createdAt: daysAgo(220), updatedAt: t },
      { id: "w3", name: "Diego Fernández", email: "diego@example.com", password: "password123", phone: "+54 11 6789-0123", role: "worker", trade: "Cerrajería", trades: ["Cerrajería"], coverageZone: "CABA (toda la ciudad)", hourlyRate: 3000, bio: "Cerrajero 24hs. Aperturas, cambio de cerraduras y seguridad. Respuesta rápida.", verified: true, verification: { identity: true, background: true, license: false }, level: "silver", rating: 4.6, reviewCount: 11, jobsDone: 15, premium: false, available: true, workSchedule: ALL_DAY, onCallWeekends: true, onCallSurcharge: 25, vehicle: "Moto Honda — 123 ABC", invitesReceived: 18, invitesAnswered: 17, responseMinutesTotal: 90, zone: "Almagro, CABA", geo: { lat: -34.6100, lng: -58.4200 }, photo: avatar("men", 76), createdAt: daysAgo(150), updatedAt: t },
      { id: "w4", name: "Lucía Martínez", email: "lucia@example.com", password: "password123", phone: "+54 11 7890-1234", role: "worker", trade: "Pintura", trades: ["Pintura", "Mantenimiento"], coverageZone: "Caballito, Flores, Almagro", hourlyRate: 2800, bio: "Pintora profesional. Interiores y exteriores, trabajos prolijos y en fecha.", verified: false, verification: { identity: true, background: false, license: false }, level: "bronze", rating: 4.3, reviewCount: 4, jobsDone: 6, premium: false, available: false, workSchedule: WEEKDAYS, onCallWeekends: false, invitesReceived: 12, invitesAnswered: 6, responseMinutesTotal: 300, zone: "Caballito, CABA", geo: { lat: -34.6190, lng: -58.4400 }, photo: avatar("women", 65), createdAt: daysAgo(60), updatedAt: t },

      // ── Resto del padrón: cubre los 10 oficios y reparte pines por CABA ──
      { id: "w5", name: "Roberto Sosa", email: "roberto@example.com", password: "password123", phone: "+54 11 3111-2233", role: "worker", trade: "Gas", trades: ["Gas", "Plomería"], coverageZone: "Villa Urquiza, Saavedra, Núñez", hourlyRate: 4200, bio: "Gasista matriculado ENARGAS. Instalaciones, artefactos y certificaciones.", verified: true, verification: fullVerif, level: "gold", rating: 4.9, reviewCount: 41, jobsDone: 53, premium: true, available: true, workSchedule: FULL_WEEK, onCallWeekends: true, onCallSurcharge: 20, vehicle: "Berlingo blanca — AD 512 KJ", invitesReceived: 48, invitesAnswered: 45, responseMinutesTotal: 300, zone: "Villa Urquiza, CABA", geo: { lat: -34.5720, lng: -58.4880 }, photo: avatar("men", 12), createdAt: daysAgo(400), updatedAt: t },
      { id: "w6", name: "Marina Quiroga", email: "marina@example.com", password: "password123", phone: "+54 11 3222-3344", role: "worker", trade: "Aire acondicionado", trades: ["Aire acondicionado", "Electricidad"], coverageZone: "Recoleta, Retiro, Palermo", hourlyRate: 4800, bio: "Técnica en refrigeración. Instalación, carga de gas y service de split.", verified: true, verification: fullVerif, level: "silver", rating: 4.7, reviewCount: 23, jobsDone: 26, premium: false, available: true, workSchedule: FULL_WEEK, onCallWeekends: true, onCallSurcharge: 25, vehicle: "Kangoo gris — AE 220 LM", invitesReceived: 28, invitesAnswered: 24, responseMinutesTotal: 190, zone: "Recoleta, CABA", geo: { lat: -34.5880, lng: -58.3960 }, photo: avatar("women", 26), createdAt: daysAgo(280), updatedAt: t },
      { id: "w7", name: "Héctor Benítez", email: "hector@example.com", password: "password123", phone: "+54 11 3333-4455", role: "worker", trade: "Carpintería", trades: ["Carpintería", "Mantenimiento"], coverageZone: "Villa Devoto, Villa del Parque, Floresta", hourlyRate: 3300, bio: "Carpintero de obra y muebles a medida. Placares, puertas y reparaciones.", verified: true, verification: { identity: true, background: true, license: false }, level: "silver", rating: 4.8, reviewCount: 17, jobsDone: 19, premium: false, available: true, workSchedule: WEEKDAYS, onCallWeekends: false, vehicle: "Utilitario Fiorino", invitesReceived: 20, invitesAnswered: 16, responseMinutesTotal: 260, zone: "Villa Devoto, CABA", geo: { lat: -34.5990, lng: -58.5130 }, photo: avatar("men", 55), createdAt: daysAgo(200), updatedAt: t },
      { id: "w8", name: "Silvia Ramos", email: "silvia@example.com", password: "password123", phone: "+54 11 3444-5566", role: "worker", trade: "Limpieza", trades: ["Limpieza"], coverageZone: "Almagro, Boedo, San Cristóbal", hourlyRate: 2200, bio: "Limpieza profunda de casas y locales. Fin de obra y mantenimiento semanal.", verified: true, verification: { identity: true, background: true, license: false }, level: "gold", rating: 4.9, reviewCount: 58, jobsDone: 71, premium: true, available: true, workSchedule: FULL_WEEK, onCallWeekends: false, invitesReceived: 62, invitesAnswered: 58, responseMinutesTotal: 240, zone: "Almagro, CABA", geo: { lat: -34.6080, lng: -58.4180 }, photo: avatar("women", 12), createdAt: daysAgo(350), updatedAt: t },
      { id: "w9", name: "Pablo Ferreyra", email: "pablo@example.com", password: "password123", phone: "+54 11 3555-6677", role: "worker", trade: "Jardinería", trades: ["Jardinería", "Mantenimiento"], coverageZone: "Belgrano, Núñez, Colegiales", hourlyRate: 2600, bio: "Parquización, poda y mantenimiento de jardines y terrazas verdes.", verified: false, verification: { identity: true, background: false, license: false }, level: "bronze", rating: 4.4, reviewCount: 8, jobsDone: 9, premium: false, available: true, workSchedule: WEEKDAYS, onCallWeekends: false, invitesReceived: 14, invitesAnswered: 9, responseMinutesTotal: 320, zone: "Colegiales, CABA", geo: { lat: -34.5760, lng: -58.4490 }, photo: avatar("men", 22), createdAt: daysAgo(90), updatedAt: t },
      { id: "w10", name: "Verónica Ledesma", email: "veronica@example.com", password: "password123", phone: "+54 11 3666-7788", role: "worker", trade: "Electricidad", trades: ["Electricidad"], coverageZone: "Caballito, Villa Crespo, Almagro", hourlyRate: 3900, bio: "Electricista matriculada. Tableros, puesta a tierra y certificados.", verified: true, verification: fullVerif, level: "silver", rating: 4.8, reviewCount: 21, jobsDone: 24, premium: false, available: true, workSchedule: FULL_WEEK, onCallWeekends: true, onCallSurcharge: 20, vehicle: "Moto Rouser", invitesReceived: 26, invitesAnswered: 23, responseMinutesTotal: 160, zone: "Villa Crespo, CABA", geo: { lat: -34.5990, lng: -58.4380 }, photo: avatar("women", 33), createdAt: daysAgo(240), updatedAt: t },
      { id: "w11", name: "Gustavo Ibarra", email: "gustavo@example.com", password: "password123", phone: "+54 11 3777-8899", role: "worker", trade: "Plomería", trades: ["Plomería", "Mantenimiento"], coverageZone: "San Telmo, La Boca, Barracas", hourlyRate: 3100, bio: "Plomero con 15 años en el barrio. Destapaciones y cambio de cañerías.", verified: true, verification: { identity: true, background: true, license: false }, level: "gold", rating: 4.6, reviewCount: 36, jobsDone: 44, premium: false, available: true, workSchedule: FULL_WEEK, onCallWeekends: true, onCallSurcharge: 15, vehicle: "Camioneta Partner", invitesReceived: 40, invitesAnswered: 34, responseMinutesTotal: 380, zone: "San Telmo, CABA", geo: { lat: -34.6230, lng: -58.3700 }, photo: avatar("men", 64), createdAt: daysAgo(320), updatedAt: t },
      { id: "w12", name: "Natalia Cabrera", email: "natalia@example.com", password: "password123", phone: "+54 11 3888-9900", role: "worker", trade: "Pintura", trades: ["Pintura"], coverageZone: "Palermo, Recoleta, Belgrano", hourlyRate: 3400, bio: "Pintura decorativa y microcemento. Acabados finos para interiores.", verified: true, verification: { identity: true, background: true, license: false }, level: "silver", rating: 4.9, reviewCount: 14, jobsDone: 16, premium: true, available: false, workSchedule: WEEKDAYS, onCallWeekends: false, invitesReceived: 18, invitesAnswered: 15, responseMinutesTotal: 210, zone: "Palermo, CABA", geo: { lat: -34.5810, lng: -58.4250 }, photo: avatar("women", 50), createdAt: daysAgo(160), updatedAt: t },
      { id: "w13", name: "Ariel Molina", email: "ariel@example.com", password: "password123", phone: "+54 11 3999-0011", role: "worker", trade: "Cerrajería", trades: ["Cerrajería", "Mantenimiento"], coverageZone: "Flores, Floresta, Villa Luro", hourlyRate: 2900, bio: "Cerrajero 24hs. Aperturas, rejas y cerraduras de alta seguridad.", verified: true, verification: { identity: true, background: true, license: false }, level: "bronze", rating: 4.5, reviewCount: 7, jobsDone: 8, premium: false, available: true, workSchedule: ALL_DAY, onCallWeekends: true, onCallSurcharge: 30, vehicle: "Moto con caja", invitesReceived: 12, invitesAnswered: 11, responseMinutesTotal: 70, zone: "Flores, CABA", geo: { lat: -34.6320, lng: -58.4640 }, photo: avatar("men", 40), createdAt: daysAgo(70), updatedAt: t },
      { id: "w14", name: "Claudia Ojeda", email: "claudia@example.com", password: "password123", phone: "+54 11 4111-2233", role: "worker", trade: "Mantenimiento", trades: ["Mantenimiento", "Pintura", "Limpieza"], coverageZone: "CABA (toda la ciudad)", hourlyRate: 3000, bio: "Mantenimiento integral de edificios y consorcios. Trabajo con administraciones.", verified: true, verification: fullVerif, level: "gold", rating: 4.7, reviewCount: 29, jobsDone: 38, premium: true, available: true, workSchedule: FULL_WEEK, onCallWeekends: true, onCallSurcharge: 20, vehicle: "Master con equipo", invitesReceived: 34, invitesAnswered: 31, responseMinutesTotal: 280, zone: "Caballito, CABA", geo: { lat: -34.6150, lng: -58.4340 }, photo: avatar("women", 58), createdAt: daysAgo(300), updatedAt: t },
      { id: "w15", name: "Damián Rivas", email: "damian@example.com", password: "password123", phone: "+54 11 4222-3344", role: "worker", trade: "Aire acondicionado", trades: ["Aire acondicionado"], coverageZone: "Villa Urquiza, Belgrano, Núñez", hourlyRate: 4500, bio: "Service e instalación de split y multisplit. Presupuesto en el día.", verified: false, verification: { identity: true, background: false, license: false }, level: "bronze", rating: 4.2, reviewCount: 5, jobsDone: 6, premium: false, available: true, workSchedule: WEEKDAYS, onCallWeekends: false, invitesReceived: 11, invitesAnswered: 6, responseMinutesTotal: 290, zone: "Núñez, CABA", geo: { lat: -34.5460, lng: -58.4620 }, photo: avatar("men", 90), createdAt: daysAgo(45), updatedAt: t },
      { id: "w16", name: "Elena Paz", email: "elena@example.com", password: "password123", phone: "+54 11 4333-4455", role: "worker", trade: "Jardinería", trades: ["Jardinería"], coverageZone: "Villa Devoto, Agronomía, Villa Urquiza", hourlyRate: 2400, bio: "Diseño de jardines y huertas urbanas. Riego automático.", verified: true, verification: { identity: true, background: true, license: false }, level: "silver", rating: 4.8, reviewCount: 12, jobsDone: 14, premium: false, available: true, workSchedule: WEEKDAYS, onCallWeekends: false, invitesReceived: 15, invitesAnswered: 13, responseMinutesTotal: 230, zone: "Agronomía, CABA", geo: { lat: -34.5930, lng: -58.4900 }, photo: avatar("women", 20), createdAt: daysAgo(130), updatedAt: t },
    ];

    // Propiedades del administrador de consorcios (u4).
    this.properties = [
      { id: "prop1", ownerId: "u4", name: "Edificio Rivadavia 5400", address: "Av. Rivadavia 5400", zone: "Caballito, CABA", geo: { lat: -34.6180, lng: -58.4420 }, units: 24, notes: "Portero de 8 a 16. Tablero general en el subsuelo.", createdAt: daysAgo(260) },
      { id: "prop2", ownerId: "u4", name: "Consorcio Güemes 3100", address: "Güemes 3100", zone: "Palermo, CABA", geo: { lat: -34.5905, lng: -58.4120 }, units: 12, notes: "Sin portero. Coordinar con la administración.", createdAt: daysAgo(240) },
      { id: "prop3", ownerId: "u4", name: "Torre Nazca 2200", address: "Av. Nazca 2200", zone: "Villa del Parque, CABA", geo: { lat: -34.6060, lng: -58.4880 }, units: 40, notes: "Bombas de agua en la terraza.", createdAt: daysAgo(180) },
    ];

    this.services = [
      { id: "s1", workerId: "w1", title: "Reparación de pérdidas de agua", category: "Plomería", description: "Detección y reparación de pérdidas con garantía de 6 meses.", price: 3500, duration: "1-2 horas", schedule: "Lun a Sáb 8-20hs", withUrgency: true, complexity: "intermedia", warrantyDays: 180, images: [photo("plumbing,pipe", 31), photo("plumber", 32)], active: true, views: 145, createdAt: daysAgo(80), updatedAt: t },
      { id: "s2", workerId: "w1", title: "Instalación de termotanque", category: "Plomería", description: "Instalación completa de termotanque eléctrico o a gas.", price: 8000, duration: "4-5 horas", schedule: "Lun a Vie 9-18hs", withUrgency: false, complexity: "compleja", warrantyDays: 90, images: [photo("water,heater", 33)], active: true, views: 87, createdAt: daysAgo(70), updatedAt: t },
      { id: "s3", workerId: "w2", title: "Instalación de iluminación LED", category: "Electricidad", description: "Colocación de artefactos y luminarias LED, incluye materiales.", price: 4500, duration: "2-4 horas", schedule: "Lun a Vie 9-19hs", withUrgency: false, complexity: "basica", warrantyDays: 60, images: [photo("lightbulb,led", 34)], active: true, views: 62, createdAt: daysAgo(50), updatedAt: t },
      { id: "s4", workerId: "w2", title: "Reparación de tablero eléctrico", category: "Electricidad", description: "Diagnóstico y reparación de tableros, disyuntores y térmicas.", price: 6000, duration: "1-3 horas", schedule: "Lun a Sáb 8-20hs", withUrgency: true, complexity: "compleja", warrantyDays: 90, images: [photo("electrical,panel", 35)], active: true, views: 40, createdAt: daysAgo(40), updatedAt: t },
      { id: "s5", workerId: "w3", title: "Apertura de puertas 24hs", category: "Cerrajería", description: "Apertura sin daño y cambio de cerradura en el acto.", price: 5000, duration: "30-60 min", schedule: "24 horas", withUrgency: true, complexity: "basica", warrantyDays: 30, images: [photo("lock,key", 36)], active: true, views: 210, createdAt: daysAgo(30), updatedAt: t },
      { id: "s6", workerId: "w4", title: "Pintura de interiores", category: "Pintura", description: "Interiores completos, incluye masillado y dos manos.", price: 12000, duration: "2-3 días", schedule: "Lun a Vie 9-18hs", withUrgency: false, complexity: "intermedia", warrantyDays: 90, images: [photo("painting,wall", 37)], active: true, views: 55, createdAt: daysAgo(25), updatedAt: t },

      { id: "s7", workerId: "w5", title: "Certificación de gas ENARGAS", category: "Gas", description: "Prueba de hermeticidad y certificado para habilitaciones.", price: 14000, duration: "2-3 horas", schedule: "Lun a Sáb 8-20hs", withUrgency: true, complexity: "compleja", warrantyDays: 365, images: [photo("gas,pipe", 61), photo("gasfitter", 62)], active: true, views: 188, createdAt: daysAgo(120), updatedAt: t },
      { id: "s8", workerId: "w5", title: "Instalación de calefactor", category: "Gas", description: "Colocación y conexión de calefactores tiro balanceado.", price: 9500, duration: "3-4 horas", schedule: "Lun a Sáb 8-20hs", withUrgency: false, complexity: "compleja", warrantyDays: 180, images: [photo("heater,home", 63)], active: true, views: 96, createdAt: daysAgo(110), updatedAt: t },
      { id: "s9", workerId: "w6", title: "Service de aire split", category: "Aire acondicionado", description: "Limpieza de filtros, carga de gas y control de consumo.", price: 7500, duration: "1-2 horas", schedule: "Lun a Dom 8-20hs", withUrgency: true, complexity: "intermedia", warrantyDays: 90, images: [photo("air,conditioner", 64)], active: true, views: 240, createdAt: daysAgo(95), updatedAt: t },
      { id: "s10", workerId: "w6", title: "Instalación de split 3000W", category: "Aire acondicionado", description: "Instalación completa con caño y soporte incluidos.", price: 18000, duration: "4-5 horas", schedule: "Lun a Vie 9-18hs", withUrgency: false, complexity: "compleja", warrantyDays: 180, images: [photo("hvac,install", 65)], active: true, views: 134, createdAt: daysAgo(85), updatedAt: t },
      { id: "s11", workerId: "w7", title: "Placard a medida", category: "Carpintería", description: "Diseño, fabricación y colocación de placares melamina.", price: 45000, duration: "5-7 días", schedule: "Lun a Vie 9-18hs", withUrgency: false, complexity: "compleja", warrantyDays: 365, images: [photo("closet,wardrobe", 66), photo("carpenter,wood", 67)], active: true, views: 172, createdAt: daysAgo(150), updatedAt: t },
      { id: "s12", workerId: "w7", title: "Arreglo de puertas y cajones", category: "Carpintería", description: "Ajuste de bisagras, corredoras y burletes.", price: 4200, duration: "1-2 horas", schedule: "Lun a Vie 9-18hs", withUrgency: true, complexity: "basica", warrantyDays: 60, images: [photo("door,repair", 68)], active: true, views: 78, createdAt: daysAgo(140), updatedAt: t },
      { id: "s13", workerId: "w8", title: "Limpieza profunda de departamento", category: "Limpieza", description: "Cocina, baños, vidrios y desengrasado completo.", price: 16000, duration: "5-6 horas", schedule: "Lun a Sáb 8-18hs", withUrgency: false, complexity: "basica", warrantyDays: 15, images: [photo("cleaning,home", 69)], active: true, views: 310, createdAt: daysAgo(180), updatedAt: t },
      { id: "s14", workerId: "w8", title: "Limpieza fin de obra", category: "Limpieza", description: "Retiro de escombro fino, polvo de obra y pulido de pisos.", price: 28000, duration: "1-2 días", schedule: "Lun a Sáb 8-18hs", withUrgency: false, complexity: "intermedia", warrantyDays: 15, images: [photo("construction,cleaning", 70)], active: true, views: 145, createdAt: daysAgo(170), updatedAt: t },
      { id: "s15", workerId: "w9", title: "Poda y mantenimiento de jardín", category: "Jardinería", description: "Corte de césped, poda de arbustos y retiro de restos.", price: 8500, duration: "3-4 horas", schedule: "Lun a Vie 8-17hs", withUrgency: false, complexity: "basica", warrantyDays: 30, images: [photo("garden,hedge", 71)], active: true, views: 88, createdAt: daysAgo(60), updatedAt: t },
      { id: "s16", workerId: "w10", title: "Puesta a tierra con certificado", category: "Electricidad", description: "Jabalina, medición y certificado para el consorcio.", price: 22000, duration: "4-5 horas", schedule: "Lun a Sáb 8-20hs", withUrgency: false, complexity: "compleja", warrantyDays: 365, images: [photo("electric,grounding", 72)], active: true, views: 119, createdAt: daysAgo(100), updatedAt: t },
      { id: "s17", workerId: "w11", title: "Destapación con máquina", category: "Plomería", description: "Destapación de cloacas y pluviales con equipo rotativo.", price: 11000, duration: "1-3 horas", schedule: "24 horas", withUrgency: true, complexity: "intermedia", warrantyDays: 60, images: [photo("drain,plumbing", 73)], active: true, views: 265, createdAt: daysAgo(130), updatedAt: t },
      { id: "s18", workerId: "w12", title: "Microcemento alisado", category: "Pintura", description: "Aplicación de microcemento en pisos y paredes.", price: 38000, duration: "3-4 días", schedule: "Lun a Vie 9-18hs", withUrgency: false, complexity: "compleja", warrantyDays: 365, images: [photo("microcement,wall", 74), photo("interior,design", 75)], active: true, views: 203, createdAt: daysAgo(90), updatedAt: t },
      { id: "s19", workerId: "w13", title: "Apertura de puerta sin daño", category: "Cerrajería", description: "Apertura de puertas y autos las 24 horas.", price: 6500, duration: "30-45 min", schedule: "24 horas", withUrgency: true, complexity: "basica", warrantyDays: 15, images: [photo("locksmith,door", 76)], active: true, views: 198, createdAt: daysAgo(50), updatedAt: t },
      { id: "s20", workerId: "w14", title: "Mantenimiento mensual de edificio", category: "Mantenimiento", description: "Ronda de plomería, electricidad, luces de palier y bombas.", price: 32000, duration: "1 día por mes", schedule: "Lun a Vie 8-18hs", withUrgency: false, complexity: "intermedia", warrantyDays: 30, images: [photo("building,maintenance", 77)], active: true, views: 156, createdAt: daysAgo(200), updatedAt: t },
      { id: "s21", workerId: "w16", title: "Riego automático para terraza", category: "Jardinería", description: "Instalación de riego por goteo con programador.", price: 26000, duration: "1-2 días", schedule: "Lun a Vie 8-17hs", withUrgency: false, complexity: "intermedia", warrantyDays: 180, images: [photo("irrigation,garden", 78)], active: true, views: 67, createdAt: daysAgo(80), updatedAt: t },
    ];

    this.offers = [
      { id: "o1", authorId: "u1", title: "Reparación de pérdida de agua", description: "Tengo una pérdida de agua debajo de la pileta de la cocina que necesita atención.", category: "Plomería", budget: 5000, urgency: "en_el_dia", location: "Palermo, CABA", geo: { lat: -34.5885, lng: -58.4105 }, images: [photo("water,leak", 41), photo("sink,pipe", 42)], emergency: false, status: "abierta", radiusKm: 3, firstProposalAt: daysAgo(1), createdAt: daysAgo(2), updatedAt: t },
      { id: "o2", authorId: "u2", title: "Instalación de tomacorrientes", description: "Necesito instalar 3 tomacorrientes nuevos en la cocina.", category: "Electricidad", budget: 3000, urgency: "programada", scheduledDate: daysAgo(-3), location: "Belgrano, CABA", geo: { lat: -34.5627, lng: -58.4583 }, images: [photo("power,outlet", 43)], emergency: false, status: "abierta", radiusKm: 3, firstProposalAt: daysAgo(0), createdAt: daysAgo(1), updatedAt: t },
      { id: "o3", authorId: "u3", title: "Urgente: se cortó la luz en la cocina", description: "Saltó el tablero y no vuelve la luz en el sector de cocina del local.", category: "Electricidad", budget: 8000, urgency: "inmediata", location: "San Telmo, CABA", geo: { lat: -34.6208, lng: -58.3735 }, images: [photo("fusebox,electrical", 44), photo("kitchen,dark", 45)], emergency: true, status: "abierta", radiusKm: 6, responseDeadline: new Date(Date.now() + 9 * 60000).toISOString(), escalations: [minsAgo(6)], notifiedWorkerIds: ["w2"], createdAt: minsAgo(12), updatedAt: t },
      { id: "o4", authorId: "u4", title: "Bomba de agua con pérdida en la terraza", description: "La bomba de la Torre Nazca pierde agua. Necesito revisión y presupuesto para el consorcio.", category: "Plomería", budget: 15000, urgency: "en_el_dia", location: "Av. Nazca 2200", geo: { lat: -34.6060, lng: -58.4880 }, images: [photo("water,pump", 46)], emergency: false, status: "abierta", propertyId: "prop3", radiusKm: 6, createdAt: daysAgo(0), updatedAt: t },

      // ── Más solicitudes abiertas: el marketplace tiene que verse con movimiento ──
      { id: "o5", authorId: "u1", title: "El split no enfría", description: "El aire del living tira aire pero no enfría. Creo que le falta gas.", category: "Aire acondicionado", budget: 9000, urgency: "en_el_dia", location: "Palermo, CABA", geo: { lat: -34.5885, lng: -58.4105 }, images: [photo("air,split", 81)], emergency: false, status: "abierta", radiusKm: 6, createdAt: daysAgo(0), updatedAt: t },
      { id: "o6", authorId: "u2", title: "Placard a medida para dormitorio", description: "Necesito un placard de 2,40m de ancho, con cajonera y barral.", category: "Carpintería", budget: 50000, urgency: "programada", scheduledDate: daysAgo(-12), location: "Belgrano, CABA", geo: { lat: -34.5627, lng: -58.4583 }, images: [photo("bedroom,closet", 82)], emergency: false, status: "abierta", radiusKm: 6, createdAt: daysAgo(3), updatedAt: t },
      { id: "o7", authorId: "u4", title: "Certificación de gas para habilitación", description: "El edificio de Güemes necesita la prueba de hermeticidad para renovar la habilitación.", category: "Gas", budget: 16000, urgency: "programada", scheduledDate: daysAgo(-8), location: "Güemes 3100", geo: { lat: -34.5905, lng: -58.4120 }, images: [], emergency: false, status: "abierta", propertyId: "prop2", radiusKm: 6, createdAt: daysAgo(2), updatedAt: t },
      { id: "o8", authorId: "u3", title: "Limpieza profunda de cocina del local", description: "Desengrasado completo de cocina y campana antes de la inspección.", category: "Limpieza", budget: 25000, urgency: "en_el_dia", location: "San Telmo, CABA", geo: { lat: -34.6208, lng: -58.3735 }, images: [photo("kitchen,commercial", 83)], emergency: false, status: "abierta", radiusKm: 6, createdAt: daysAgo(1), updatedAt: t },
      { id: "o9", authorId: "u2", title: "Urgente: me quedé afuera de casa", description: "Se me trabó la cerradura y no puedo entrar. Estoy en la puerta.", category: "Cerrajería", budget: 7000, urgency: "inmediata", location: "Belgrano, CABA", geo: { lat: -34.5627, lng: -58.4583 }, images: [], emergency: true, status: "abierta", radiusKm: 3, responseDeadline: new Date(Date.now() + 11 * 60000).toISOString(), escalations: [], notifiedWorkerIds: ["w3", "w13"], createdAt: minsAgo(4), updatedAt: t },
      { id: "o10", authorId: "u1", title: "Poda del jardín del fondo", description: "Está muy crecido, necesito poda y que se lleven los restos.", category: "Jardinería", budget: 9000, urgency: "programada", scheduledDate: daysAgo(-6), location: "Palermo, CABA", geo: { lat: -34.5885, lng: -58.4105 }, images: [photo("overgrown,garden", 84)], emergency: false, status: "abierta", radiusKm: 6, createdAt: daysAgo(4), updatedAt: t },
      { id: "o11", authorId: "u4", title: "Pintura de palier y escalera", description: "Dos manos en palieres de 8 pisos, incluye cielorraso.", category: "Pintura", budget: 85000, urgency: "programada", scheduledDate: daysAgo(-20), location: "Av. Rivadavia 5400", geo: { lat: -34.6180, lng: -58.4420 }, images: [photo("stairwell,paint", 85)], emergency: false, status: "abierta", propertyId: "prop1", radiusKm: 12, createdAt: daysAgo(5), updatedAt: t },
    ];

    this.proposals = [
      { id: "p1", offerId: "o1", workerId: "w1", message: "Hola! Tengo disponibilidad hoy mismo. 10 años de experiencia, trabajo garantizado.", price: 4500, availability: "Hoy 15-18hs", etaMinutes: 40, status: "enviada", createdAt: daysAgo(1) },
      { id: "p2", offerId: "o2", workerId: "w2", message: "Soy electricista matriculada, puedo hacerlo el día que agendes. Presupuesto cerrado.", price: 2800, availability: "A coordinar", status: "enviada", createdAt: daysAgo(0) },
      { id: "p3", offerId: "o4", workerId: "w1", message: "Trabajo con consorcios. Puedo pasar a revisar la bomba y dejar presupuesto formal.", price: 14000, availability: "Mañana 9-12hs", status: "enviada", createdAt: daysAgo(0) },
    ];

    // Historial con reseñas + un trabajo activo + uno EN CAMINO para ver el
    // seguimiento en vivo desde el primer arranque.
    this.jobs = [
      { id: "j1", offerId: "o-hist1", proposalId: "p-hist1", clientId: "u1", workerId: "w1", category: "Plomería", title: "Destape de cañería", amount: 6000, scheduledAt: daysAgo(20), insurance: true, insuranceCost: 800, insurancePlanId: "basico", status: "completado", warrantyDays: 180, warrantyUntil: daysAgo(-160), resultImages: [photo("pipe,repair", 51)], createdAt: daysAgo(22), completedAt: daysAgo(20), reviewedByClient: true, reviewedByWorker: true },
      { id: "j2", offerId: "o-hist2", proposalId: "p-hist2", clientId: "u3", workerId: "w2", category: "Electricidad", title: "Revisión de instalación del local", amount: 12000, scheduledAt: daysAgo(10), insurance: false, status: "completado", warrantyDays: 90, warrantyUntil: daysAgo(-80), resultImages: [photo("electrical,wiring", 52)], createdAt: daysAgo(12), completedAt: daysAgo(10), reviewedByClient: true, reviewedByWorker: false },
      { id: "j3", offerId: "o-hist3", proposalId: "p-hist3", clientId: "u2", workerId: "w1", category: "Plomería", title: "Cambio de flexibles y canilla", amount: 4500, scheduledAt: daysAgo(45), insurance: false, status: "completado", warrantyDays: 180, warrantyUntil: daysAgo(-135), createdAt: daysAgo(47), completedAt: daysAgo(45), reviewedByClient: true, reviewedByWorker: true },
      { id: "j4", offerId: "o-hist4", proposalId: "p-hist4", clientId: "u1", workerId: "w1", category: "Gas", title: "Detección de pérdida de gas", amount: 7000, scheduledAt: daysAgo(8), insurance: true, insuranceCost: 800, insurancePlanId: "basico", status: "completado", warrantyDays: 90, warrantyUntil: daysAgo(-82), resultImages: [photo("gas,meter", 53)], createdAt: daysAgo(9), completedAt: daysAgo(8), reviewedByClient: true, reviewedByWorker: false },
      { id: "j5", offerId: "o-hist5", proposalId: "p-hist5", clientId: "u2", workerId: "w3", category: "Cerrajería", title: "Cambio de cerradura de seguridad", amount: 5000, scheduledAt: daysAgo(6), insurance: false, status: "completado", warrantyDays: 30, warrantyUntil: daysAgo(-24), createdAt: daysAgo(7), completedAt: daysAgo(6), reviewedByClient: true, reviewedByWorker: false },
      { id: "j6", offerId: "o-hist6", proposalId: "p-hist6", clientId: "u1", workerId: "w2", category: "Electricidad", title: "Instalación de luminarias LED", amount: 4500, scheduledAt: daysAgo(-2), insurance: false, status: "agendado", createdAt: daysAgo(1), reviewedByClient: false, reviewedByWorker: false },
      // En camino: salió hace 3 minutos con un ETA de 15 → se ve avanzando.
      { id: "j7", offerId: "o-hist7", proposalId: "p-hist7", clientId: "u3", workerId: "w3", category: "Cerrajería", title: "Cambio de cerradura del local", amount: 5500, scheduledAt: t, insurance: true, insuranceCost: 800, insurancePlanId: "basico", status: "en_camino", etaMinutes: 15, departedAt: minsAgo(3), originGeo: { lat: -34.6100, lng: -58.4200 }, workerGeo: { lat: -34.6100, lng: -58.4200 }, arrivalCode: "4271", trackingToken: "trk-j7-demo", createdAt: minsAgo(45), reviewedByClient: false, reviewedByWorker: false },
      // Mantenimiento recurrente del consorcio, ya completado una vez.
      { id: "j8", offerId: "o-hist8", proposalId: "p-hist8", clientId: "u4", workerId: "w4", category: "Mantenimiento", title: "Mantenimiento mensual — Rivadavia 5400", amount: 18000, scheduledAt: daysAgo(15), insurance: false, status: "completado", propertyId: "prop1", warrantyDays: 30, createdAt: daysAgo(17), completedAt: daysAgo(15), reviewedByClient: true, reviewedByWorker: false },

      // ── Trabajos en curso: sin esto "Mis acuerdos > Activos" queda en 0 ──
      { id: "j9", offerId: "o-hist9", proposalId: "p-hist9", clientId: "u2", workerId: "w1", category: "Plomería", title: "Cambio de termotanque", amount: 8500, scheduledAt: daysAgo(-1), insurance: true, insuranceCost: 800, insurancePlanId: "basico", status: "agendado", warrantyDays: 180, createdAt: daysAgo(2), reviewedByClient: false, reviewedByWorker: false },
      { id: "j10", offerId: "o-hist10", proposalId: "p-hist10", clientId: "u3", workerId: "w1", category: "Gas", title: "Revisión de instalación de gas del local", amount: 12000, scheduledAt: daysAgo(0), insurance: true, insuranceCost: 800, insurancePlanId: "basico", status: "en_progreso", startedAt: minsAgo(70), arrivedAt: minsAgo(80), arrivalConfirmedAt: minsAgo(78), departedAt: minsAgo(105), etaMinutes: 25, warrantyDays: 90, createdAt: daysAgo(1), reviewedByClient: false, reviewedByWorker: false },
      { id: "j11", offerId: "o-hist11", proposalId: "p-hist11", clientId: "u4", workerId: "w14", category: "Mantenimiento", title: "Mantenimiento mensual — Torre Nazca", amount: 32000, scheduledAt: daysAgo(-3), insurance: false, status: "agendado", propertyId: "prop3", warrantyDays: 30, createdAt: daysAgo(4), reviewedByClient: false, reviewedByWorker: false },

      // ── Historial de los profesionales nuevos, para que los perfiles no estén vacíos ──
      { id: "j12", offerId: "o-hist12", proposalId: "p-hist12", clientId: "u1", workerId: "w5", category: "Gas", title: "Certificación de gas del departamento", amount: 14000, scheduledAt: daysAgo(35), insurance: true, insuranceCost: 800, insurancePlanId: "basico", status: "completado", warrantyDays: 365, resultImages: [photo("gas,certificate", 91)], createdAt: daysAgo(37), completedAt: daysAgo(35), reviewedByClient: true, reviewedByWorker: true },
      { id: "j13", offerId: "o-hist13", proposalId: "p-hist13", clientId: "u3", workerId: "w6", category: "Aire acondicionado", title: "Service de los 3 splits del salón", amount: 21000, scheduledAt: daysAgo(28), insurance: false, status: "completado", warrantyDays: 90, resultImages: [photo("split,clean", 92)], createdAt: daysAgo(30), completedAt: daysAgo(28), reviewedByClient: true, reviewedByWorker: false },
      { id: "j14", offerId: "o-hist14", proposalId: "p-hist14", clientId: "u2", workerId: "w8", category: "Limpieza", title: "Limpieza profunda post mudanza", amount: 16000, scheduledAt: daysAgo(22), insurance: false, status: "completado", warrantyDays: 15, createdAt: daysAgo(24), completedAt: daysAgo(22), reviewedByClient: true, reviewedByWorker: false },
      { id: "j15", offerId: "o-hist15", proposalId: "p-hist15", clientId: "u4", workerId: "w10", category: "Electricidad", title: "Puesta a tierra — Güemes 3100", amount: 22000, scheduledAt: daysAgo(40), insurance: false, status: "completado", propertyId: "prop2", warrantyDays: 365, resultImages: [photo("electrical,ground", 93)], createdAt: daysAgo(42), completedAt: daysAgo(40), reviewedByClient: true, reviewedByWorker: false },
      { id: "j16", offerId: "o-hist16", proposalId: "p-hist16", clientId: "u3", workerId: "w11", category: "Plomería", title: "Destapación de cloaca del local", amount: 11000, scheduledAt: daysAgo(18), insurance: false, status: "completado", warrantyDays: 60, createdAt: daysAgo(19), completedAt: daysAgo(18), reviewedByClient: true, reviewedByWorker: false },
      { id: "j17", offerId: "o-hist17", proposalId: "p-hist17", clientId: "u1", workerId: "w12", category: "Pintura", title: "Microcemento en el baño", amount: 38000, scheduledAt: daysAgo(50), insurance: false, status: "completado", warrantyDays: 365, resultImages: [photo("bathroom,microcement", 94)], createdAt: daysAgo(55), completedAt: daysAgo(50), reviewedByClient: true, reviewedByWorker: false },
      { id: "j18", offerId: "o-hist18", proposalId: "p-hist18", clientId: "u2", workerId: "w7", category: "Carpintería", title: "Arreglo de puertas del pasillo", amount: 4200, scheduledAt: daysAgo(12), insurance: false, status: "completado", warrantyDays: 60, createdAt: daysAgo(13), completedAt: daysAgo(12), reviewedByClient: true, reviewedByWorker: false },
      { id: "j19", offerId: "o-hist19", proposalId: "p-hist19", clientId: "u1", workerId: "w16", category: "Jardinería", title: "Riego automático en la terraza", amount: 26000, scheduledAt: daysAgo(60), insurance: false, status: "completado", warrantyDays: 180, resultImages: [photo("drip,irrigation", 95)], createdAt: daysAgo(64), completedAt: daysAgo(60), reviewedByClient: true, reviewedByWorker: false },
    ];

    this.payments = [
      { id: "pay-j1", jobId: "j1", clientId: "u1", workerId: "w1", gross: 6000, commission: 900, insuranceCost: 800, surcharge: 0, total: 7700, net: 6000, method: "mercadopago", status: "liberado", createdAt: daysAgo(22), releasedAt: daysAgo(20) },
      { id: "pay-j2", jobId: "j2", clientId: "u3", workerId: "w2", gross: 12000, commission: 1800, insuranceCost: 0, surcharge: 0, total: 13800, net: 12000, method: "mercadopago", status: "liberado", createdAt: daysAgo(12), releasedAt: daysAgo(10) },
      { id: "pay-j8", jobId: "j8", clientId: "u4", workerId: "w4", gross: 18000, commission: 2700, insuranceCost: 0, surcharge: 0, total: 20700, net: 18000, method: "transferencia", status: "liberado", createdAt: daysAgo(17), releasedAt: daysAgo(15) },
      { id: "pay-j7", jobId: "j7", clientId: "u3", workerId: "w3", gross: 5500, commission: 825, insuranceCost: 800, surcharge: 0, total: 7125, net: 5500, method: "mercadopago", status: "retenido", createdAt: minsAgo(44) },
    ];

    this.reviews = [
      { id: "r1", jobId: "j1", authorId: "u1", targetId: "w1", stars: 5, comment: "Excelente trabajo, muy rápido y prolijo. Lo recomiendo.", verified: true, reply: { text: "Gracias María! Cualquier cosa me escribís.", createdAt: daysAgo(19) }, createdAt: daysAgo(20) },
      { id: "r2", jobId: "j1", authorId: "w1", targetId: "u1", stars: 5, comment: "Clienta muy amable, todo claro. Gracias!", verified: true, createdAt: daysAgo(20) },
      { id: "r3", jobId: "j2", authorId: "u3", targetId: "w2", stars: 5, comment: "Resolvió todo en el día, super profesional.", verified: true, createdAt: daysAgo(10) },
      { id: "r4", jobId: "j3", authorId: "u2", targetId: "w1", stars: 5, comment: "Puntual y muy prolijo. Dejó todo funcionando perfecto.", verified: true, createdAt: daysAgo(45) },
      { id: "r5", jobId: "j4", authorId: "u1", targetId: "w1", stars: 4, comment: "Muy buen trabajo, detectó la pérdida enseguida.", verified: true, createdAt: daysAgo(8) },
      { id: "r6", jobId: "j5", authorId: "u2", targetId: "w3", stars: 5, comment: "Vino rápido y cambió la cerradura sin problemas.", verified: true, createdAt: daysAgo(6) },
      { id: "r7", jobId: "j8", authorId: "u4", targetId: "w4", stars: 4, comment: "Cumplió con el mantenimiento del edificio sin observaciones.", verified: true, createdAt: daysAgo(15) },

      // ── Reseñas de los profesionales nuevos ──
      { id: "r8", jobId: "j12", authorId: "u1", targetId: "w5", stars: 5, comment: "Impecable. Dejó el certificado el mismo día y explicó todo con paciencia.", verified: true, reply: { text: "Gracias María, cualquier cosa avisame.", createdAt: daysAgo(34) }, createdAt: daysAgo(35) },
      { id: "r9", jobId: "j12", authorId: "w5", targetId: "u1", stars: 5, comment: "Todo coordinado por la app, sin vueltas.", verified: true, createdAt: daysAgo(35) },
      { id: "r10", jobId: "j13", authorId: "u3", targetId: "w6", stars: 5, comment: "Los tres equipos quedaron como nuevos. Vino con todo el equipo.", verified: true, createdAt: daysAgo(28) },
      { id: "r11", jobId: "j14", authorId: "u2", targetId: "w8", stars: 5, comment: "Dejó el depto brillante. Súper prolija y puntual.", verified: true, createdAt: daysAgo(22) },
      { id: "r12", jobId: "j15", authorId: "u4", targetId: "w10", stars: 5, comment: "Nos resolvió la puesta a tierra con el certificado para el consorcio.", verified: true, createdAt: daysAgo(40) },
      { id: "r13", jobId: "j16", authorId: "u3", targetId: "w11", stars: 4, comment: "Destapó todo bien. Tardó un poco más de lo previsto pero resolvió.", verified: true, reply: { text: "Gracias! La cañería estaba peor de lo que parecía.", createdAt: daysAgo(17) }, createdAt: daysAgo(18) },
      { id: "r14", jobId: "j17", authorId: "u1", targetId: "w12", stars: 5, comment: "El baño quedó espectacular, un trabajo de detalle.", verified: true, createdAt: daysAgo(50) },
      { id: "r15", jobId: "j18", authorId: "u2", targetId: "w7", stars: 5, comment: "Rápido y muy prolijo con las puertas.", verified: true, createdAt: daysAgo(12) },
      { id: "r16", jobId: "j19", authorId: "u1", targetId: "w16", stars: 5, comment: "El riego funciona perfecto, me explicó cómo programarlo.", verified: true, createdAt: daysAgo(60) },
    ];

    this.favorites = [
      { id: "f1", clientId: "u1", workerId: "w1", createdAt: daysAgo(20) },
      { id: "f2", clientId: "u4", workerId: "w4", createdAt: daysAgo(15) },
    ];

    this.payouts = [
      { id: "pay1", workerId: "w1", amount: 6000, status: "liquidado", method: "mercadopago", createdAt: daysAgo(20), paidAt: daysAgo(19) },
      { id: "pay2", workerId: "w2", amount: 12000, status: "pendiente", createdAt: daysAgo(10) },
      { id: "pay3", workerId: "w4", amount: 18000, status: "liquidado", method: "transferencia", createdAt: daysAgo(15), paidAt: daysAgo(14) },
    ];

    this.recurringPlans = [
      { id: "rp1", clientId: "u4", workerId: "w4", propertyId: "prop1", category: "Mantenimiento", title: "Mantenimiento mensual — Rivadavia 5400", description: "Revisión general de plomería, electricidad y pintura de palier.", budget: 18000, frequency: "mensual", nextDate: new Date(Date.now() + 15 * 86400000).toISOString(), location: "Av. Rivadavia 5400", geo: { lat: -34.6180, lng: -58.4420 }, active: true, createdAt: daysAgo(60), lastGeneratedAt: daysAgo(17) },
      { id: "rp2", clientId: "u3", workerId: "w2", category: "Electricidad", title: "Revisión eléctrica trimestral del local", budget: 12000, frequency: "trimestral", nextDate: new Date(Date.now() + 40 * 86400000).toISOString(), location: "Defensa 1200", geo: { lat: -34.6208, lng: -58.3735 }, active: true, createdAt: daysAgo(100) },
    ];

    this.npsResponses = [
      { id: "nps1", userId: "u1", jobId: "j1", score: 10, comment: "Rapidísimo y sin sorpresas en el precio.", createdAt: daysAgo(20) },
      { id: "nps2", userId: "u3", jobId: "j2", score: 9, createdAt: daysAgo(10) },
      { id: "nps3", userId: "u2", jobId: "j5", score: 8, createdAt: daysAgo(6) },
      { id: "nps4", userId: "u1", jobId: "j4", score: 9, createdAt: daysAgo(8) },
      { id: "nps5", userId: "u4", jobId: "j8", score: 6, comment: "Bien, pero tardaron en confirmar la visita.", createdAt: daysAgo(15) },
    ];

    this.chats = [
      { id: "c1", participantIds: ["u1", "w1"], lastMessageAt: daysAgo(1), lastMessage: "Perfecto, nos vemos hoy a las 15!" },
      { id: "c2", participantIds: ["u3", "w2"], lastMessageAt: daysAgo(10), lastMessage: "Gracias por todo!" },
      { id: "c3", participantIds: ["u4", "w4"], lastMessageAt: daysAgo(15), lastMessage: "Listo el mantenimiento del mes." },
    ];
    this.messages = [
      { id: "m1", chatId: "c1", authorId: "u1", text: "Hola Juan! Vi tu propuesta y me interesa.", ts: daysAgo(1), status: "read" },
      { id: "m2", chatId: "c1", authorId: "w1", text: "Hola María! Genial, puedo pasar hoy a las 15hs.", ts: daysAgo(1), status: "read" },
      { id: "m3", chatId: "c1", authorId: "u1", text: "Perfecto, nos vemos hoy a las 15!", ts: daysAgo(1), status: "sent" },
      { id: "m4", chatId: "c2", authorId: "u3", text: "Gracias por todo!", ts: daysAgo(10), status: "read" },
      { id: "m5", chatId: "c3", authorId: "w4", text: "Listo el mantenimiento del mes.", ts: daysAgo(15), status: "read" },
    ];

    this.notifications = [
      { id: "n1", userId: "u1", type: "oferta", title: "Nueva propuesta recibida", body: "Juan Pérez envió una propuesta para tu solicitud.", read: false, link: "/u/requests/o1", createdAt: daysAgo(1) },
      { id: "n2", userId: "w1", type: "sistema", title: "¡Subiste a nivel Gold!", body: "Alcanzaste 30 trabajos completados. Ahora pagás menor comisión.", read: false, link: "/w/stats", createdAt: daysAgo(5) },
      { id: "n3", userId: "w2", type: "pago", title: "Pago disponible", body: "Tenés $12.000 disponibles para retirar.", read: true, link: "/w/cobros", createdAt: daysAgo(10) },
      { id: "n4", userId: "u3", type: "seguimiento", title: "Diego está en camino", body: "Llega en unos 15 minutos. Código de llegada: 4271.", read: false, link: "/u/jobs/j7", createdAt: minsAgo(3) },
      { id: "n5", userId: "w2", type: "emergencia", title: "🚨 Emergencia cerca tuyo", body: "Bodegón La Esquina necesita un Electricidad con urgencia en San Telmo.", read: false, link: "/w/jobs/o3", createdAt: minsAgo(12) },
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
      user.clientPlan = "free";
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
      user.workSchedule = { days: [1, 2, 3, 4, 5], from: "09:00", to: "18:00" };
      user.onCallWeekends = false;
      user.invitesReceived = 0;
      user.invitesAnswered = 0;
      user.responseMinutesTotal = 0;
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

  // ─────────────────────── Disponibilidad ───────────────────────
  // Dolor #1 de la investigación (4 de 8 entrevistas): saber quién puede ir AHORA.
  getAvailabilityStatus(workerId: string): AvailabilityStatus {
    const w = this.users.find((u) => u.id === workerId);
    if (!w) return "fuera_de_horario";
    // Si está en un trabajo activo, está ocupado.
    const busy = this.jobs.some(
      (j) => j.workerId === workerId && (j.status === "en_camino" || j.status === "en_progreso"),
    );
    if (busy) return "ocupado";
    if (!w.available) return "fuera_de_horario";
    return this.isWithinSchedule(w) ? "disponible" : "fuera_de_horario";
  }

  private isWithinSchedule(w: User, when = new Date()): boolean {
    const day = when.getDay();
    const isWeekend = day === 0 || day === 6;
    if (isWeekend && w.onCallWeekends) return true;
    const s = w.workSchedule;
    if (!s) return true; // sin horario declarado: se asume disponible
    if (!s.days.includes(day)) return false;
    const mins = when.getHours() * 60 + when.getMinutes();
    const [fh, fm] = s.from.split(":").map(Number);
    const [th, tm] = s.to.split(":").map(Number);
    return mins >= fh * 60 + fm && mins <= th * 60 + tm;
  }

  // "X profesionales disponibles ahora en tu zona".
  getAvailableNowCount(filters: { category?: string; zone?: string } = {}): number {
    return this.users.filter((u) => {
      if (u.role !== "worker") return false;
      if (this.getAvailabilityStatus(u.id) !== "disponible") return false;
      if (filters.category && !(u.trades?.includes(filters.category) || u.trade === filters.category)) return false;
      if (filters.zone) {
        const z = filters.zone.toLowerCase().split(",")[0].trim();
        if (!(u.coverageZone || u.zone || "").toLowerCase().includes(z)) return false;
      }
      return true;
    }).length;
  }

  // Trabajadores de guardia (fin de semana / feriados) — pedido de la entrevista 8.
  getOnCallWorkers(category?: string): PublicUser[] {
    return this.users
      .filter((u) => u.role === "worker" && u.onCallWeekends)
      .filter((u) => !category || u.trades?.includes(category) || u.trade === category)
      .map((u) => this.sanitizeUser(u));
  }

  setAvailability(available: boolean) {
    const me = this.requireAuth();
    if (me.role !== "worker") throw new Error("Solo los trabajadores");
    return this.updateUser(me.id, { available });
  }

  // ─────────────────────── Trabajadores / búsqueda ───────────────────────
  getWorkers(
    filters: {
      category?: string;
      zone?: string;
      q?: string;
      onlyAvailable?: boolean;
      onlyAvailableNow?: boolean;
      onlyLicensed?: boolean;
      onlyVerified?: boolean;
      complexity?: Complexity;
      minRating?: number;
      maxPrice?: number;
      onCallOnly?: boolean;
    } = {},
  ): PublicUser[] {
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
    if (filters.onlyAvailableNow) list = list.filter((w) => this.getAvailabilityStatus(w.id) === "disponible");
    // Filtro por matrícula: pedido en las entrevistas 3 y 4.
    if (filters.onlyLicensed) list = list.filter((w) => w.verification?.license);
    if (filters.onlyVerified) list = list.filter((w) => w.verified);
    if (filters.onCallOnly) list = list.filter((w) => w.onCallWeekends);
    if (filters.minRating) list = list.filter((w) => (w.rating || 0) >= filters.minRating!);
    if (filters.maxPrice) list = list.filter((w) => (w.hourlyRate || 0) <= filters.maxPrice!);
    // Filtro por complejidad: tiene al menos un servicio activo de ese nivel.
    if (filters.complexity) {
      list = list.filter((w) =>
        this.services.some((s) => s.workerId === w.id && s.active && s.complexity === filters.complexity),
      );
    }
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

  // ─────────────────────── Propiedades (consorcios) ───────────────────────
  getProperties(ownerId: string): Property[] {
    return this.properties
      .filter((p) => p.ownerId === ownerId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getProperty(id: string): Property | undefined {
    return this.properties.find((p) => p.id === id);
  }

  createProperty(data: Omit<Property, "id" | "ownerId" | "createdAt">) {
    const me = this.requireAuth();
    if (me.role !== "user") throw new Error("Solo los clientes pueden administrar propiedades");
    const prop: Property = { ...data, id: `prop${Date.now()}`, ownerId: me.id, createdAt: new Date().toISOString() };
    this.properties.push(prop);
    this.saveToStorage();
    return prop;
  }

  updateProperty(id: string, patch: Partial<Property>) {
    const me = this.requireAuth();
    const i = this.properties.findIndex((p) => p.id === id);
    if (i === -1) throw new Error("Propiedad no encontrada");
    if (this.properties[i].ownerId !== me.id) throw new Error("No autorizado");
    this.properties[i] = { ...this.properties[i], ...patch };
    this.saveToStorage();
    return this.properties[i];
  }

  deleteProperty(id: string) {
    const me = this.requireAuth();
    const p = this.properties.find((x) => x.id === id);
    if (!p) throw new Error("Propiedad no encontrada");
    if (p.ownerId !== me.id) throw new Error("No autorizado");
    this.properties = this.properties.filter((x) => x.id !== id);
    this.saveToStorage();
  }

  // Resumen por propiedad: trabajos y gasto acumulado.
  getPropertyStats(propertyId: string) {
    const jobs = this.jobs.filter((j) => j.propertyId === propertyId);
    const spent = jobs.reduce((s, j) => {
      const p = this.payments.find((x) => x.jobId === j.id);
      return s + (p?.total || 0);
    }, 0);
    return {
      jobs: jobs.length,
      active: jobs.filter((j) => j.status !== "completado" && j.status !== "cancelado").length,
      spent,
      lastJobAt: jobs.map((j) => j.createdAt).sort().reverse()[0],
    };
  }

  // ─────────────────────────── Offers (solicitudes) ───────────────────────────
  getOffers(filters: { status?: OfferStatus; category?: string; q?: string; authorId?: string; urgency?: Urgency; emergency?: boolean; propertyId?: string } = {}) {
    let list = [...this.offers];
    if (filters.status) list = list.filter((o) => o.status === filters.status);
    if (filters.category) list = list.filter((o) => o.category === filters.category);
    if (filters.authorId) list = list.filter((o) => o.authorId === filters.authorId);
    if (filters.urgency) list = list.filter((o) => o.urgency === filters.urgency);
    if (filters.propertyId) list = list.filter((o) => o.propertyId === filters.propertyId);
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
    // Urgencias: ventana de respuesta + primer radio de búsqueda.
    if (offer.urgency === "inmediata") {
      offer.responseDeadline = new Date(Date.now() + RESPONSE_WINDOW_MINUTES * 60000).toISOString();
      offer.radiusKm = offer.radiusKm ?? ESCALATION_RADIUS_STEPS_KM[0];
      offer.escalations = [];
    }
    this.offers.push(offer);
    this.notifyNearbyWorkers(offer);
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

  // Avisa a los trabajadores dentro del radio y cuenta la invitación (para
  // la "tasa de respuesta" del KPI 3.5).
  private notifyNearbyWorkers(offer: Offer): number {
    const radius = offer.radiusKm ?? 6;
    const already = new Set(offer.notifiedWorkerIds || []);
    const candidates = this.getNearbyWorkers(offer.geo, { category: offer.category, onlyAvailable: true })
      .filter(({ worker, distance }) => !already.has(worker.id) && (distance === null || distance <= radius))
      .slice(0, 8);

    candidates.forEach(({ worker }) => {
      already.add(worker.id);
      const wi = this.users.findIndex((u) => u.id === worker.id);
      if (wi !== -1) this.users[wi].invitesReceived = (this.users[wi].invitesReceived || 0) + 1;
      const isUrgent = offer.urgency === "inmediata";
      this.pushNotification(
        worker.id,
        isUrgent ? "emergencia" : "oferta",
        isUrgent ? "🚨 Urgencia cerca tuyo" : "Nueva solicitud en tu zona",
        `${offer.title} — ${offer.location}. Presupuesto estimado $${offer.budget.toLocaleString()}.`,
        `/w/jobs/${offer.id}`,
      );
    });
    offer.notifiedWorkerIds = [...already];
    return candidates.length;
  }

  // Escalado: si nadie respondió en la ventana, se amplía el radio.
  escalateOffer(id: string) {
    const offer = this.offers.find((o) => o.id === id);
    if (!offer) throw new Error("Solicitud no encontrada");
    if (offer.status !== "abierta") throw new Error("La solicitud ya no está abierta");
    const current = offer.radiusKm ?? ESCALATION_RADIUS_STEPS_KM[0];
    const next = ESCALATION_RADIUS_STEPS_KM.find((r) => r > current);
    if (!next) throw new Error("Ya se amplió al radio máximo");
    offer.radiusKm = next;
    offer.escalations = [...(offer.escalations || []), new Date().toISOString()];
    offer.responseDeadline = new Date(Date.now() + RESPONSE_WINDOW_MINUTES * 60000).toISOString();
    offer.updatedAt = new Date().toISOString();
    const notified = this.notifyNearbyWorkers(offer);
    this.pushNotification(offer.authorId, "sistema", "Ampliamos la búsqueda", `Sumamos profesionales hasta ${next} km. Avisamos a ${notified} más.`, `/u/requests/${offer.id}`);
    this.saveToStorage();
    return { offer, notified, radiusKm: next };
  }

  // Minutos restantes de la ventana de respuesta (null si no aplica).
  getResponseWindowMinutes(offerId: string): number | null {
    const offer = this.offers.find((o) => o.id === offerId);
    if (!offer?.responseDeadline || offer.status !== "abierta") return null;
    const left = (new Date(offer.responseDeadline).getTime() - Date.now()) / 60000;
    return Math.max(0, Math.round(left));
  }

  // Asignación automática por cercanía (diferencial 2.11) — para urgencias.
  autoAssignNearest(offerId: string) {
    const me = this.requireAuth();
    const offer = this.offers.find((o) => o.id === offerId);
    if (!offer) throw new Error("Solicitud no encontrada");
    if (offer.authorId !== me.id) throw new Error("No autorizado");
    if (offer.status !== "abierta") throw new Error("La solicitud ya fue asignada");

    const candidate = this.getNearbyWorkers(offer.geo, { category: offer.category, onlyAvailable: true })
      .find(({ worker }) => this.getAvailabilityStatus(worker.id) === "disponible");
    if (!candidate) throw new Error("No hay profesionales disponibles ahora en tu zona");

    const distance = candidate.distance ?? 5;
    const etaMinutes = Math.max(10, Math.round(distance * 4) + 10);
    const proposal: Proposal = {
      id: `p${Date.now()}`,
      offerId: offer.id,
      workerId: candidate.worker.id,
      message: "Asignación automática por cercanía (urgencia).",
      price: offer.budget,
      availability: "Ahora",
      etaMinutes,
      status: "enviada",
      createdAt: new Date().toISOString(),
    };
    this.proposals.push(proposal);
    if (!offer.firstProposalAt) offer.firstProposalAt = proposal.createdAt;
    const job = this.acceptProposal(proposal.id, { autoAssigned: true });
    this.pushNotification(candidate.worker.id, "emergencia", "Te asignamos una urgencia", `${me.name} necesita ${offer.category} en ${offer.location}. ETA sugerido: ${etaMinutes} min.`, `/w/agreements/${job.id}`);
    this.saveToStorage();
    return { job, worker: candidate.worker, distance, etaMinutes };
  }

  // Botón de emergencia (SOS) — cliente / PyME / administrador.
  createEmergency(data: { category: string; description?: string; location: string; geo?: { lat: number; lng: number }; budget?: number; propertyId?: string }) {
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
      propertyId: data.propertyId,
      responseDeadline: new Date(Date.now() + RESPONSE_WINDOW_MINUTES * 60000).toISOString(),
      radiusKm: ESCALATION_RADIUS_STEPS_KM[0],
      escalations: [],
      createdAt: now,
      updatedAt: now,
    };
    this.offers.push(offer);
    const notified = this.notifyNearbyWorkers(offer);
    this.saveToStorage();
    return { offer, notified };
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
    const now = new Date().toISOString();
    const proposal: Proposal = { ...data, status: data.status || "enviada", id: `p${Date.now()}`, createdAt: now };
    this.proposals.push(proposal);
    const offer = this.offers.find((o) => o.id === data.offerId);
    if (offer) {
      // Time-to-match: se marca la primera propuesta recibida.
      if (!offer.firstProposalAt) offer.firstProposalAt = now;
      // Tasa de respuesta del trabajador (KPI 3.5).
      const wi = this.users.findIndex((u) => u.id === me.id);
      if (wi !== -1) {
        this.users[wi].invitesAnswered = (this.users[wi].invitesAnswered || 0) + 1;
        const elapsed = Math.max(1, Math.round((Date.now() - new Date(offer.createdAt).getTime()) / 60000));
        this.users[wi].responseMinutesTotal = (this.users[wi].responseMinutesTotal || 0) + elapsed;
      }
      this.pushNotification(offer.authorId, "oferta", "Nueva propuesta recibida", `${me.name} envió una propuesta ($${data.price.toLocaleString()}) para "${offer.title}".`, `/u/requests/${offer.id}`);
    }
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
  acceptProposal(proposalId: string, opts: { scheduledAt?: string; autoAssigned?: boolean } = {}) {
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

    // Garantía heredada del servicio del trabajador en esa categoría, si tiene.
    const service = this.services.find((s) => s.workerId === proposal.workerId && s.category === offer.category && s.active);

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
      propertyId: offer.propertyId,
      etaMinutes: proposal.etaMinutes,
      warrantyDays: service?.warrantyDays ?? DEFAULT_WARRANTY_DAYS,
      createdAt: new Date().toISOString(),
    };
    this.jobs.push(job);
    if (!opts.autoAssigned) {
      this.pushNotification(proposal.workerId, "reserva", "¡Propuesta aceptada!", `${me.name} aceptó tu propuesta para "${offer.title}".`, `/w/agreements/${job.id}`);
    }
    this.saveToStorage();
    return job;
  }

  // ─────────────────────────── Services ───────────────────────────
  getServices(filters: { workerId?: string; category?: string; includeInactive?: boolean; complexity?: Complexity } = {}) {
    let list = [...this.services];
    if (filters.workerId) list = list.filter((s) => s.workerId === filters.workerId);
    if (filters.category) list = list.filter((s) => s.category === filters.category);
    if (filters.complexity) list = list.filter((s) => s.complexity === filters.complexity);
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
  getJobs(filters: { clientId?: string; workerId?: string; status?: Job["status"]; propertyId?: string } = {}) {
    let list = [...this.jobs];
    if (filters.clientId) list = list.filter((j) => j.clientId === filters.clientId);
    if (filters.workerId) list = list.filter((j) => j.workerId === filters.workerId);
    if (filters.status) list = list.filter((j) => j.status === filters.status);
    if (filters.propertyId) list = list.filter((j) => j.propertyId === filters.propertyId);
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

  // ──────────── Seguimiento del servicio (diferencial 2.11) ────────────
  // El trabajador sale hacia el domicilio: arranca la trazabilidad.
  startTrip(jobId: string, etaMinutes: number) {
    const me = this.requireAuth();
    const i = this.jobs.findIndex((j) => j.id === jobId);
    if (i === -1) throw new Error("Trabajo no encontrado");
    const job = this.jobs[i];
    if (job.workerId !== me.id) throw new Error("Solo el profesional asignado puede iniciar el viaje");
    if (job.status !== "agendado") throw new Error("El trabajo no está en estado agendado");
    if (etaMinutes < 1 || etaMinutes > 480) throw new Error("El ETA tiene que estar entre 1 y 480 minutos");

    const now = new Date().toISOString();
    const client = this.users.find((u) => u.id === job.clientId);
    const code = String(Math.floor(1000 + Math.random() * 9000));
    this.jobs[i] = {
      ...job,
      status: "en_camino",
      etaMinutes,
      departedAt: now,
      originGeo: me.geo,
      workerGeo: me.geo,
      arrivalCode: code,
      trackingToken: `trk-${job.id}-${Math.random().toString(36).slice(2, 8)}`,
    };
    this.pushNotification(
      job.clientId,
      "seguimiento",
      `${me.name} está en camino`,
      `Llega en unos ${etaMinutes} minutos. Código de llegada: ${code}. Pedíselo antes de dejarlo entrar.`,
      `/u/jobs/${job.id}`,
    );
    if (client) {
      this.pushNotification(me.id, "seguimiento", "Viaje iniciado", `Vas hacia ${client.name}. Cuando llegues, marcá "Llegué".`, `/w/agreements/${job.id}`);
    }
    this.saveToStorage();
    return this.jobs[i];
  }

  // Estado del trayecto DERIVADO del reloj: no hace falta ningún timer.
  getTrackingState(jobId: string): TrackingState | null {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    const client = this.users.find((u) => u.id === job.clientId);
    const clientGeo = client?.geo;

    if (job.status !== "en_camino") {
      return {
        status: job.status,
        etaMinutes: null,
        progress: job.arrivedAt ? 1 : 0,
        workerGeo: job.workerGeo,
        clientGeo,
        distanceKm: this.distanceKm(job.workerGeo, clientGeo),
        departedAt: job.departedAt,
        arrivedAt: job.arrivedAt,
        arrivalCode: job.arrivalCode,
        arrivalConfirmed: !!job.arrivalConfirmedAt,
      };
    }

    const eta = job.etaMinutes || 20;
    const elapsedMin = job.departedAt ? (Date.now() - new Date(job.departedAt).getTime()) / 60000 : 0;
    const progress = Math.max(0, Math.min(1, elapsedMin / eta));
    const remaining = Math.max(0, Math.ceil(eta - elapsedMin));

    // Interpolación lineal entre el punto de salida y el domicilio.
    let workerGeo = job.workerGeo;
    if (job.originGeo && clientGeo) {
      workerGeo = {
        lat: job.originGeo.lat + (clientGeo.lat - job.originGeo.lat) * progress,
        lng: job.originGeo.lng + (clientGeo.lng - job.originGeo.lng) * progress,
      };
    }

    return {
      status: job.status,
      etaMinutes: remaining,
      progress,
      workerGeo,
      clientGeo,
      distanceKm: this.distanceKm(workerGeo, clientGeo),
      departedAt: job.departedAt,
      arrivedAt: job.arrivedAt,
      arrivalCode: job.arrivalCode,
      arrivalConfirmed: !!job.arrivalConfirmedAt,
    };
  }

  // El profesional marca que llegó.
  markArrived(jobId: string) {
    const me = this.requireAuth();
    const i = this.jobs.findIndex((j) => j.id === jobId);
    if (i === -1) throw new Error("Trabajo no encontrado");
    const job = this.jobs[i];
    if (job.workerId !== me.id) throw new Error("No autorizado");
    if (job.status !== "en_camino") throw new Error("El trabajo no está en camino");
    const client = this.users.find((u) => u.id === job.clientId);
    this.jobs[i] = { ...job, arrivedAt: new Date().toISOString(), workerGeo: client?.geo || job.workerGeo };
    this.pushNotification(job.clientId, "seguimiento", `${me.name} llegó`, `Pedile el código ${job.arrivalCode} para confirmar que es quien dice ser.`, `/u/jobs/${job.id}`);
    this.saveToStorage();
    return this.jobs[i];
  }

  // El cliente valida el código en la puerta → arranca el trabajo.
  // Cierra el miedo explícito de la entrevista 3 ("dejar entrar a desconocidos").
  confirmArrival(jobId: string, code: string) {
    const me = this.requireAuth();
    const i = this.jobs.findIndex((j) => j.id === jobId);
    if (i === -1) throw new Error("Trabajo no encontrado");
    const job = this.jobs[i];
    if (job.clientId !== me.id) throw new Error("Solo el cliente puede confirmar la llegada");
    if (job.status !== "en_camino") throw new Error("El trabajo no está en camino");
    if (!job.arrivalCode) throw new Error("Este trabajo no tiene código de llegada");
    if (code.trim() !== job.arrivalCode) throw new Error("El código no coincide. Verificá con el profesional.");

    const now = new Date().toISOString();
    this.jobs[i] = { ...job, arrivalConfirmedAt: now, startedAt: now, status: "en_progreso", arrivedAt: job.arrivedAt || now };
    this.pushNotification(job.workerId, "seguimiento", "Llegada confirmada", `${me.name} confirmó tu identidad. Podés empezar el trabajo.`, `/w/agreements/${job.id}`);
    this.saveToStorage();
    return this.jobs[i];
  }

  // Ficha "quién va a ir" — se le muestra al cliente antes de abrir la puerta.
  getArrivalCard(jobId: string): ArrivalCard | null {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    const w = this.users.find((u) => u.id === job.workerId);
    if (!w) return null;
    const isClient = this.currentUser?.id === job.clientId;
    return {
      workerId: w.id,
      name: w.name,
      photo: w.photo,
      trade: w.trade,
      rating: w.rating || 0,
      reviewCount: w.reviewCount || 0,
      verification: w.verification,
      verified: !!w.verified,
      jobsDone: w.jobsDone || 0,
      vehicle: w.vehicle,
      phone: w.phone,
      // El código solo se le muestra al cliente.
      arrivalCode: isClient ? job.arrivalCode : undefined,
    };
  }

  // Línea de tiempo del servicio con horarios reales (trazabilidad visual).
  getJobTimeline(jobId: string): JobTimelineEvent[] {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return [];
    const steps: JobTimelineEvent[] = [
      { key: "acordado", label: "Acuerdo cerrado", at: job.createdAt, done: true },
      { key: "agendado", label: "Agendado", at: job.scheduledAt, done: !!job.scheduledAt },
      { key: "en_camino", label: "En camino", at: job.departedAt, done: !!job.departedAt },
      { key: "llego", label: "Llegó al domicilio", at: job.arrivedAt, done: !!job.arrivedAt },
      { key: "identidad", label: "Identidad confirmada", at: job.arrivalConfirmedAt, done: !!job.arrivalConfirmedAt },
      { key: "trabajando", label: "Trabajo en curso", at: job.startedAt, done: !!job.startedAt },
      { key: "completado", label: "Completado y validado", at: job.completedAt, done: !!job.completedAt },
    ];
    if (job.status === "cancelado") {
      steps.push({ key: "cancelado", label: "Cancelado", at: undefined, done: true });
    }
    return steps;
  }

  // Seguimiento compartible con un contacto de confianza (entrevista 3).
  // Es un link SIN autenticación: se le saca el código de llegada a propósito.
  // Compartir el seguimiento no puede ser compartir la llave de la puerta.
  getTrackingByToken(token: string) {
    const job = this.jobs.find((j) => j.trackingToken === token);
    if (!job) return null;
    const worker = this.users.find((u) => u.id === job.workerId);
    const client = this.users.find((u) => u.id === job.clientId);
    const full = this.getTrackingState(job.id);
    const state = full ? { ...full, arrivalCode: undefined } : null;
    return {
      jobTitle: job.title,
      clientName: client?.name,
      workerName: worker?.name,
      workerPhoto: worker?.photo,
      workerTrade: worker?.trade,
      workerVerified: !!worker?.verified,
      status: job.status,
      state,
    };
  }

  // Botón de pánico DURANTE el servicio (distinto del SOS para pedir ayuda).
  raisePanic(jobId: string) {
    const me = this.requireAuth();
    const i = this.jobs.findIndex((j) => j.id === jobId);
    if (i === -1) throw new Error("Trabajo no encontrado");
    const job = this.jobs[i];
    if (job.clientId !== me.id && job.workerId !== me.id) throw new Error("No autorizado");
    this.jobs[i] = { ...job, panicAt: new Date().toISOString() };
    this.pushNotification(me.id, "emergencia", "Alerta registrada", "Soporte de OFIX fue notificado y se va a contactar con vos. Si hay riesgo inmediato, llamá al 911.", `/u/jobs/${job.id}`);
    this.saveToStorage();
    return this.jobs[i];
  }

  // Reportar que la otra parte no se presentó (cita 1.2.2: "vienen y no vienen").
  reportNoShow(jobId: string) {
    const me = this.requireAuth();
    const i = this.jobs.findIndex((j) => j.id === jobId);
    if (i === -1) throw new Error("Trabajo no encontrado");
    const job = this.jobs[i];
    if (job.clientId !== me.id && job.workerId !== me.id) throw new Error("No autorizado");
    if (job.status === "completado") throw new Error("El trabajo ya está completado");
    const now = new Date().toISOString();
    this.jobs[i] = { ...job, noShowReportedAt: now, noShowBy: me.id, status: "cancelado" };

    // Se reembolsa el pago retenido y se reabre la solicitud para recontratar.
    const payment = this.payments.find((p) => p.jobId === jobId);
    if (payment && (payment.status === "retenido" || payment.status === "en_disputa")) payment.status = "reembolsado";
    const offer = this.offers.find((o) => o.id === job.offerId);
    if (offer) {
      offer.status = "abierta";
      offer.updatedAt = now;
      this.proposals = this.proposals.map((p) => (p.id === job.proposalId ? { ...p, status: "rechazada" as ProposalStatus } : p));
    }
    const otherId = job.clientId === me.id ? job.workerId : job.clientId;
    this.pushNotification(otherId, "sistema", "Se reportó un incumplimiento", `Se registró que no hubo presentación en "${job.title}". El pago retenido fue reembolsado.`, "");
    this.pushNotification(me.id, "sistema", "Incumplimiento registrado", "Reabrimos tu solicitud para que puedas contratar a otro profesional.", offer ? `/u/requests/${offer.id}` : "");
    this.saveToStorage();
    return this.jobs[i];
  }

  // Fotos del resultado (alimentan el portfolio del trabajador).
  addJobResultImages(jobId: string, images: string[]) {
    const me = this.requireAuth();
    const i = this.jobs.findIndex((j) => j.id === jobId);
    if (i === -1) throw new Error("Trabajo no encontrado");
    if (this.jobs[i].workerId !== me.id) throw new Error("Solo el profesional puede subir el resultado");
    this.jobs[i] = { ...this.jobs[i], resultImages: images };
    this.saveToStorage();
    return this.jobs[i];
  }

  // Portfolio: galería antes/después de los trabajos completados (E2 y E5).
  getPortfolio(workerId: string) {
    return this.jobs
      .filter((j) => j.workerId === workerId && j.status === "completado")
      .map((j) => {
        const offer = this.offers.find((o) => o.id === j.offerId);
        return {
          jobId: j.id,
          title: j.title,
          category: j.category,
          completedAt: j.completedAt,
          before: offer?.images || [],
          after: j.resultImages || [],
        };
      })
      .filter((p) => p.before.length > 0 || p.after.length > 0)
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
  }

  // Cliente valida el trabajo → libera fondos, cierra el acuerdo y acredita al trabajador.
  completeJob(id: string) {
    const me = this.requireAuth();
    const job = this.jobs.find((j) => j.id === id);
    if (!job) throw new Error("Trabajo no encontrado");
    if (job.clientId !== me.id) throw new Error("Solo el cliente puede validar el trabajo");
    // Un reclamo abierto congela el escrow: no se puede liberar.
    const openDispute = this.disputes.find((d) => d.jobId === id && (d.status === "abierta" || d.status === "en_revision"));
    if (openDispute) throw new Error("Hay un reclamo abierto sobre este trabajo. Se resuelve antes de liberar los fondos.");

    const now = new Date().toISOString();
    const payment = this.payments.find((p) => p.jobId === id);
    if (payment && payment.status === "retenido") {
      payment.status = "liberado";
      payment.releasedAt = now;
      this.payouts.push({ id: `pay${Date.now()}`, workerId: job.workerId, amount: payment.net, status: "pendiente", createdAt: now });
    }
    this.finalizeJobCompletion(job, now);

    this.pushNotification(job.workerId, "pago", "Trabajo validado", `${me.name} validó "${job.title}". Se liberaron los fondos a tu billetera.`, "/w/cobros");
    this.saveToStorage();
    return job;
  }

  // Cierre de un trabajo. Vive aparte porque hay DOS caminos que completan un
  // trabajo —la validación del cliente y una disputa resuelta a favor del
  // profesional— y los dos tienen que dejar el mismo estado: si no, el cliente
  // que pierde una disputa perdería además la garantía, y el trabajo no le
  // contaría al nivel del profesional.
  private finalizeJobCompletion(job: Job, now: string) {
    job.status = "completado";
    job.completedAt = now;

    // La garantía arranca al completarse.
    const days = job.warrantyDays ?? DEFAULT_WARRANTY_DAYS;
    job.warrantyDays = days;
    job.warrantyUntil = new Date(new Date(now).getTime() + days * 86400000).toISOString();

    const proposal = this.proposals.find((p) => p.id === job.proposalId);
    if (proposal) proposal.status = "finalizada";
    const offer = this.offers.find((o) => o.id === job.offerId);
    if (offer) offer.status = "completada";

    const worker = this.users.find((u) => u.id === job.workerId);
    if (worker) {
      worker.jobsDone = (worker.jobsDone || 0) + 1;
      worker.level = this.computeLevel(worker.jobsDone);
    }
  }

  cancelJob(id: string) {
    const me = this.requireAuth();
    const job = this.jobs.find((j) => j.id === id);
    if (!job) throw new Error("Trabajo no encontrado");
    if (job.clientId !== me.id && job.workerId !== me.id) throw new Error("No autorizado");
    if (job.status === "completado") throw new Error("El trabajo ya está completado");
    job.status = "cancelado";
    const payment = this.payments.find((p) => p.jobId === id);
    if (payment && (payment.status === "retenido" || payment.status === "en_disputa")) payment.status = "reembolsado";
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

  // El seguro viene preseleccionado y es obligatorio en rubros de riesgo:
  // así se reconcilian 2.2 ("incluidos") y 6.3 ("opcional u obligatorio según rubro").
  isInsuranceMandatory(category: string): boolean {
    return MANDATORY_INSURANCE_CATEGORIES.includes(category);
  }

  defaultInsurancePlanId(category: string): string {
    return this.isInsuranceMandatory(category) ? DEFAULT_INSURANCE_PLAN_ID : DEFAULT_INSURANCE_PLAN_ID;
  }

  // Recargo por guardia si el trabajo cae fin de semana y el profesional cobra diferencial.
  quoteSurcharge(workerId: string, when?: string): number {
    const w = this.users.find((u) => u.id === workerId);
    if (!w?.onCallWeekends) return 0;
    const d = when ? new Date(when) : new Date();
    if (Number.isNaN(d.getTime())) return 0;
    const day = d.getDay();
    if (day !== 0 && day !== 6) return 0;
    return (w.onCallSurcharge ?? DEFAULT_ONCALL_SURCHARGE_RATE * 100) / 100;
  }

  quotePayment(gross: number, insuranceCost = 0, surchargeRate = 0) {
    const surcharge = Math.round(gross * surchargeRate);
    const commission = Math.round((gross + surcharge) * OFIX_COMMISSION_RATE);
    return {
      gross,
      surcharge,
      commission,
      insuranceCost,
      total: gross + surcharge + commission + insuranceCost,
      net: gross + surcharge,
    };
  }

  createPayment(data: { jobId: string; method: PaymentMethod; insurancePlanId?: string }) {
    const me = this.requireAuth();
    const job = this.jobs.find((j) => j.id === data.jobId);
    if (!job) throw new Error("Trabajo no encontrado");
    if (job.clientId !== me.id) throw new Error("No autorizado");
    if (this.payments.some((p) => p.jobId === job.id)) throw new Error("Este trabajo ya tiene un pago registrado");

    let planId = data.insurancePlanId;
    // Rubros de riesgo: el seguro no se puede desactivar.
    if (this.isInsuranceMandatory(job.category) && !planId) planId = DEFAULT_INSURANCE_PLAN_ID;
    const plan = planId ? INSURANCE_PLANS.find((p) => p.id === planId) : undefined;
    const insuranceCost = plan?.cost || 0;
    const surchargeRate = this.quoteSurcharge(job.workerId, job.scheduledAt);
    const q = this.quotePayment(job.amount, insuranceCost, surchargeRate);

    const payment: Payment = {
      id: `pay${Date.now()}`,
      jobId: job.id,
      clientId: job.clientId,
      workerId: job.workerId,
      gross: q.gross,
      commission: q.commission,
      insuranceCost,
      surcharge: q.surcharge,
      total: q.total,
      net: q.net,
      method: data.method,
      status: data.method === "efectivo" ? "pendiente" : "retenido",
      createdAt: new Date().toISOString(),
    };
    this.payments.push(payment);
    job.insurance = !!plan;
    job.insuranceCost = insuranceCost;
    job.insurancePlanId = planId;
    this.pushNotification(job.workerId, "pago", "Pago en garantía", `${me.name} pagó "${job.title}". Los fondos se liberan al validar el trabajo.`, `/w/agreements/${job.id}`);
    this.saveToStorage();
    return payment;
  }

  // ─────────────────── Reclamos / disputas (entrevista 7) ───────────────────
  getDisputes(filters: { jobId?: string; userId?: string; status?: DisputeStatus } = {}) {
    let list = [...this.disputes];
    if (filters.jobId) list = list.filter((d) => d.jobId === filters.jobId);
    if (filters.userId) list = list.filter((d) => d.openedBy === filters.userId || d.againstId === filters.userId);
    if (filters.status) list = list.filter((d) => d.status === filters.status);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getDispute(jobId: string) {
    return this.disputes.find((d) => d.jobId === jobId && d.status !== "resuelta_cliente" && d.status !== "resuelta_trabajador")
      || this.disputes.find((d) => d.jobId === jobId);
  }

  // Abrir un reclamo CONGELA el escrow: los fondos no se liberan hasta resolver.
  openDispute(data: { jobId: string; reason: DisputeReason; description: string; images?: string[] }) {
    const me = this.requireAuth();
    const job = this.jobs.find((j) => j.id === data.jobId);
    if (!job) throw new Error("Trabajo no encontrado");
    if (job.clientId !== me.id && job.workerId !== me.id) throw new Error("No autorizado");
    const existing = this.disputes.find((d) => d.jobId === data.jobId && (d.status === "abierta" || d.status === "en_revision"));
    if (existing) throw new Error("Ya hay un reclamo abierto para este trabajo");
    if (!data.description.trim()) throw new Error("Contanos qué pasó para poder revisarlo");

    const dispute: Dispute = {
      id: `d${Date.now()}`,
      jobId: data.jobId,
      openedBy: me.id,
      againstId: job.clientId === me.id ? job.workerId : job.clientId,
      reason: data.reason,
      description: data.description,
      images: data.images,
      status: "abierta",
      createdAt: new Date().toISOString(),
    };
    this.disputes.push(dispute);

    const payment = this.payments.find((p) => p.jobId === data.jobId);
    if (payment && payment.status === "retenido") payment.status = "en_disputa";

    this.pushNotification(dispute.againstId, "reclamo", "Se abrió un reclamo", `${me.name} abrió un reclamo sobre "${job.title}". Los fondos quedan congelados hasta resolverlo.`, "");
    this.pushNotification(me.id, "reclamo", "Reclamo registrado", "OFIX va a revisar el caso. Los fondos quedaron congelados mientras se resuelve.", "");
    this.saveToStorage();
    return dispute;
  }

  // Resolución (simula la mediación de OFIX).
  resolveDispute(disputeId: string, outcome: "cliente" | "trabajador", resolution: string) {
    const i = this.disputes.findIndex((d) => d.id === disputeId);
    if (i === -1) throw new Error("Reclamo no encontrado");
    const dispute = this.disputes[i];
    const now = new Date().toISOString();
    this.disputes[i] = {
      ...dispute,
      status: outcome === "cliente" ? "resuelta_cliente" : "resuelta_trabajador",
      resolution,
      resolvedAt: now,
    };

    const job = this.jobs.find((j) => j.id === dispute.jobId);
    const payment = this.payments.find((p) => p.jobId === dispute.jobId);
    if (payment && payment.status === "en_disputa") {
      if (outcome === "cliente") {
        payment.status = "reembolsado";
        if (job) job.status = "cancelado";
      } else {
        payment.status = "liberado";
        payment.releasedAt = now;
        if (job) {
          this.payouts.push({ id: `pay${Date.now()}`, workerId: job.workerId, amount: payment.net, status: "pendiente", createdAt: now });
          // Mismo cierre que la validación del cliente: garantía incluida.
          this.finalizeJobCompletion(job, now);
        }
      }
    }
    [dispute.openedBy, dispute.againstId].forEach((uid) =>
      this.pushNotification(uid, "reclamo", "Reclamo resuelto", resolution, ""),
    );
    this.saveToStorage();
    return this.disputes[i];
  }

  // ─────────────────── Garantía / retrabajo (1.3, E1, E6) ───────────────────
  isUnderWarranty(jobId: string): boolean {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job?.warrantyUntil || job.status !== "completado") return false;
    return new Date(job.warrantyUntil).getTime() > Date.now();
  }

  warrantyDaysLeft(jobId: string): number | null {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job?.warrantyUntil) return null;
    const left = Math.ceil((new Date(job.warrantyUntil).getTime() - Date.now()) / 86400000);
    return left > 0 ? left : 0;
  }

  getWarrantyClaims(filters: { jobId?: string; clientId?: string; workerId?: string } = {}) {
    let list = [...this.warrantyClaims];
    if (filters.jobId) list = list.filter((c) => c.jobId === filters.jobId);
    if (filters.clientId) list = list.filter((c) => c.clientId === filters.clientId);
    if (filters.workerId) list = list.filter((c) => c.workerId === filters.workerId);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Reclamar la garantía reabre el trabajo SIN volver a pagar.
  claimWarranty(data: { jobId: string; description: string; images?: string[] }) {
    const me = this.requireAuth();
    const job = this.jobs.find((j) => j.id === data.jobId);
    if (!job) throw new Error("Trabajo no encontrado");
    if (job.clientId !== me.id) throw new Error("Solo el cliente puede reclamar la garantía");
    if (!this.isUnderWarranty(data.jobId)) throw new Error("Este trabajo ya no está en garantía");
    if (this.warrantyClaims.some((c) => c.jobId === data.jobId && (c.status === "abierto" || c.status === "agendado"))) {
      throw new Error("Ya hay un reclamo de garantía abierto para este trabajo");
    }
    const claim: WarrantyClaim = {
      id: `wc${Date.now()}`,
      jobId: data.jobId,
      clientId: job.clientId,
      workerId: job.workerId,
      description: data.description,
      images: data.images,
      status: "abierto",
      createdAt: new Date().toISOString(),
    };
    this.warrantyClaims.push(claim);
    this.pushNotification(job.workerId, "reclamo", "Reclamo de garantía", `${me.name} reclamó la garantía de "${job.title}". La revisión no se cobra.`, `/w/agreements/${job.id}`);
    this.saveToStorage();
    return claim;
  }

  // El trabajador agenda la revisión de garantía.
  scheduleWarrantyVisit(claimId: string, scheduledAt: string) {
    const me = this.requireAuth();
    const i = this.warrantyClaims.findIndex((c) => c.id === claimId);
    if (i === -1) throw new Error("Reclamo no encontrado");
    if (this.warrantyClaims[i].workerId !== me.id) throw new Error("No autorizado");
    this.warrantyClaims[i] = { ...this.warrantyClaims[i], status: "agendado", scheduledAt };
    this.pushNotification(this.warrantyClaims[i].clientId, "reserva", "Revisión de garantía agendada", `${me.name} agendó la revisión sin cargo.`, "");
    this.saveToStorage();
    return this.warrantyClaims[i];
  }

  resolveWarrantyClaim(claimId: string, status: "resuelto" | "rechazado", note?: string) {
    const i = this.warrantyClaims.findIndex((c) => c.id === claimId);
    if (i === -1) throw new Error("Reclamo no encontrado");
    this.warrantyClaims[i] = { ...this.warrantyClaims[i], status, resolvedAt: new Date().toISOString() };
    this.pushNotification(
      this.warrantyClaims[i].clientId,
      "reclamo",
      status === "resuelto" ? "Garantía resuelta" : "Garantía rechazada",
      note || (status === "resuelto" ? "El profesional resolvió el retrabajo." : "El reclamo de garantía fue rechazado."),
      "",
    );
    this.saveToStorage();
    return this.warrantyClaims[i];
  }

  // ─────────────────── Precios de referencia (E1, E3, E6) ───────────────────
  getPriceReference(category: string): PriceReference | null {
    const jobPrices = this.jobs.filter((j) => j.category === category).map((j) => j.amount);
    const servicePrices = this.services.filter((s) => s.category === category && s.active).map((s) => s.price);
    const prices = [...jobPrices, ...servicePrices].filter((p) => p > 0);
    if (prices.length === 0) return null;
    return {
      category,
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length),
      count: prices.length,
    };
  }

  // ¿Esta oferta se va muy por encima de lo habitual? (umbral: 1.5× el promedio)
  isPriceAbusive(category: string, price: number): boolean {
    const ref = this.getPriceReference(category);
    if (!ref || ref.count < 3) return false;
    return price > ref.avg * 1.5;
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
    // Tipo A para quienes facturan (PyME y administradores), B para consumidor final.
    const kind: ReceiptKind =
      client?.clientType === "pyme_gastronomica" || client?.clientType === "administrador_consorcio" ? "A" : "B";
    const plan = payment.insuranceCost ? INSURANCE_PLANS.find((p) => p.cost === payment.insuranceCost) : undefined;
    const property = job.propertyId ? this.properties.find((p) => p.id === job.propertyId) : undefined;

    const clientDetail =
      client?.clientType === "pyme_gastronomica"
        ? "PyME gastronómica"
        : client?.clientType === "administrador_consorcio"
          ? "Administrador de consorcios"
          : "Consumidor final";

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
        detail: clientDetail,
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
      surcharge: payment.surcharge || 0,
      total: payment.total,
      net: payment.net,
      method: payment.method,
      status: payment.status,
      propertyName: property?.name,
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

  // Facturación agrupada por mes (panel PyME / consorcios).
  getBillingPeriods(clientId: string, propertyId?: string): BillingPeriod[] {
    const byMonth = new Map<string, Receipt[]>();
    let receipts = this.getReceipts(clientId);
    if (propertyId) {
      const ids = new Set(this.jobs.filter((j) => j.propertyId === propertyId).map((j) => j.id));
      receipts = receipts.filter((r) => ids.has(r.jobId));
    }
    for (const r of receipts) {
      const d = new Date(r.issuedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const arr = byMonth.get(key);
      if (arr) arr.push(r);
      else byMonth.set(key, [r]);
    }
    return [...byMonth.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, list]) => ({
        key,
        label: new Date(`${key}-01T00:00:00`).toLocaleDateString("es-AR", { month: "long", year: "numeric" }),
        jobs: list.length,
        gross: list.reduce((s, r) => s + r.gross, 0),
        commission: list.reduce((s, r) => s + r.commission, 0),
        insuranceCost: list.reduce((s, r) => s + r.insuranceCost, 0),
        total: list.reduce((s, r) => s + r.total, 0),
        receipts: list,
      }));
  }

  // ─────────────── Mantenimiento recurrente (2.2, 2.4) ───────────────
  getRecurringPlans(clientId: string) {
    return this.recurringPlans
      .filter((p) => p.clientId === clientId)
      .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime());
  }

  getRecurringPlan(id: string) {
    return this.recurringPlans.find((p) => p.id === id);
  }

  createRecurringPlan(data: Omit<RecurringPlan, "id" | "clientId" | "createdAt" | "active"> & { active?: boolean }) {
    const me = this.requireAuth();
    if (me.role !== "user") throw new Error("Solo los clientes pueden programar mantenimiento");
    const plan: RecurringPlan = {
      ...data,
      id: `rp${Date.now()}`,
      clientId: me.id,
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
    };
    this.recurringPlans.push(plan);
    this.saveToStorage();
    return plan;
  }

  updateRecurringPlan(id: string, patch: Partial<RecurringPlan>) {
    const me = this.requireAuth();
    const i = this.recurringPlans.findIndex((p) => p.id === id);
    if (i === -1) throw new Error("Plan no encontrado");
    if (this.recurringPlans[i].clientId !== me.id) throw new Error("No autorizado");
    this.recurringPlans[i] = { ...this.recurringPlans[i], ...patch };
    this.saveToStorage();
    return this.recurringPlans[i];
  }

  deleteRecurringPlan(id: string) {
    const me = this.requireAuth();
    const p = this.recurringPlans.find((x) => x.id === id);
    if (!p) throw new Error("Plan no encontrado");
    if (p.clientId !== me.id) throw new Error("No autorizado");
    this.recurringPlans = this.recurringPlans.filter((x) => x.id !== id);
    this.saveToStorage();
  }

  // Genera las solicitudes de los planes vencidos. Corre al inicializar el store.
  runRecurringPlans(): number {
    const now = Date.now();
    let created = 0;
    this.recurringPlans.forEach((plan) => {
      if (!plan.active) return;
      if (new Date(plan.nextDate).getTime() > now) return;
      const iso = new Date().toISOString();
      const offer: Offer = {
        id: `o${Date.now()}${created}`,
        authorId: plan.clientId,
        title: plan.title,
        description: plan.description || `Mantenimiento programado (${plan.frequency}).`,
        category: plan.category,
        budget: plan.budget,
        urgency: "programada",
        scheduledDate: plan.nextDate,
        location: plan.location,
        geo: plan.geo,
        images: [],
        emergency: false,
        status: "abierta",
        propertyId: plan.propertyId,
        createdAt: iso,
        updatedAt: iso,
      };
      this.offers.push(offer);
      plan.lastGeneratedAt = iso;
      plan.nextDate = new Date(new Date(plan.nextDate).getTime() + FREQUENCY_DAYS[plan.frequency] * 86400000).toISOString();
      this.pushNotification(plan.clientId, "reserva", "Mantenimiento programado", `Se generó la solicitud "${plan.title}".`, `/u/requests/${offer.id}`);
      if (plan.workerId) {
        this.pushNotification(plan.workerId, "oferta", "Mantenimiento recurrente", `${plan.title} está disponible para presupuestar.`, `/w/jobs/${offer.id}`);
      }
      created++;
    });
    if (created > 0) this.saveToStorage();
    return created;
  }

  // ─────────────── Suscripción del cliente (entrevista 3) ───────────────
  setClientPlan(plan: ClientPlan) {
    const me = this.requireAuth();
    if (me.role !== "user") throw new Error("Solo los clientes");
    return this.updateUser(me.id, { clientPlan: plan });
  }

  // ─────────────────────────── Reseñas ───────────────────────────
  getReviews(filters: { targetId?: string; authorId?: string; jobId?: string; onlyVerified?: boolean } = {}) {
    let list = [...this.reviews];
    if (filters.targetId) list = list.filter((r) => r.targetId === filters.targetId);
    if (filters.authorId) list = list.filter((r) => r.authorId === filters.authorId);
    if (filters.jobId) list = list.filter((r) => r.jobId === filters.jobId);
    if (filters.onlyVerified) list = list.filter((r) => r.verified);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createReview(data: { jobId: string; targetId: string; stars: number; comment: string }) {
    const me = this.requireAuth();
    const job = this.jobs.find((j) => j.id === data.jobId);
    if (!job) throw new Error("Trabajo no encontrado");
    if (job.clientId !== me.id && job.workerId !== me.id) throw new Error("No autorizado");
    if (data.stars < 1 || data.stars > 5) throw new Error("La calificación va de 1 a 5");
    // Verificada = el trabajo se completó y tuvo un pago registrado en OFIX.
    // Cierra el miedo a las reseñas falsas (entrevistas 2, 4 y 5).
    const payment = this.payments.find((p) => p.jobId === data.jobId);
    const verified = job.status === "completado" && !!payment;

    const review: Review = {
      id: `r${Date.now()}`,
      jobId: data.jobId,
      authorId: me.id,
      targetId: data.targetId,
      stars: data.stars,
      comment: data.comment,
      verified,
      createdAt: new Date().toISOString(),
    };
    this.reviews.push(review);
    if (me.id === job.clientId) job.reviewedByClient = true;
    if (me.id === job.workerId) job.reviewedByWorker = true;
    this.recomputeRating(data.targetId);
    this.pushNotification(data.targetId, "sistema", "Nueva reseña", `${me.name} te dejó ${data.stars}★.`, "");
    this.saveToStorage();
    return review;
  }

  // Derecho a réplica: el calificado puede responder una vez (E4 y E5 pidieron
  // no quedar expuestos sin voz a una crítica pública).
  replyToReview(reviewId: string, text: string) {
    const me = this.requireAuth();
    const i = this.reviews.findIndex((r) => r.id === reviewId);
    if (i === -1) throw new Error("Reseña no encontrada");
    if (this.reviews[i].targetId !== me.id) throw new Error("Solo podés responder las reseñas que te dejaron");
    if (this.reviews[i].reply) throw new Error("Ya respondiste esta reseña");
    if (!text.trim()) throw new Error("Escribí una respuesta");
    this.reviews[i] = { ...this.reviews[i], reply: { text: text.trim(), createdAt: new Date().toISOString() } };
    this.pushNotification(this.reviews[i].authorId, "sistema", "Respondieron tu reseña", `${me.name} respondió tu reseña.`, "");
    this.saveToStorage();
    return this.reviews[i];
  }

  reportReview(reviewId: string) {
    const me = this.requireAuth();
    const i = this.reviews.findIndex((r) => r.id === reviewId);
    if (i === -1) throw new Error("Reseña no encontrada");
    if (this.reviews[i].targetId !== me.id) throw new Error("No autorizado");
    this.reviews[i] = { ...this.reviews[i], reportedAt: new Date().toISOString() };
    this.saveToStorage();
    return this.reviews[i];
  }

  private recomputeRating(userId: string) {
    const rs = this.reviews.filter((r) => r.targetId === userId);
    const u = this.users.find((x) => x.id === userId);
    if (u) {
      u.reviewCount = rs.length;
      u.rating = rs.length ? Math.round((rs.reduce((s, r) => s + r.stars, 0) / rs.length) * 10) / 10 : 0;
    }
  }

  // ─────────────────────────── NPS (KPI 3.5) ───────────────────────────
  submitNps(data: { jobId: string; score: number; comment?: string }) {
    const me = this.requireAuth();
    if (data.score < 0 || data.score > 10) throw new Error("La puntuación va de 0 a 10");
    if (this.npsResponses.some((n) => n.jobId === data.jobId && n.userId === me.id)) {
      throw new Error("Ya respondiste la encuesta de este trabajo");
    }
    const res: NpsResponse = {
      id: `nps${Date.now()}`,
      userId: me.id,
      jobId: data.jobId,
      score: data.score,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    };
    this.npsResponses.push(res);
    this.saveToStorage();
    return res;
  }

  hasAnsweredNps(jobId: string, userId: string) {
    return this.npsResponses.some((n) => n.jobId === jobId && n.userId === userId);
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

  private notifSeq = 0;
  private pushNotification(userId: string, type: NotificationType, title: string, body: string, link = "") {
    this.notifSeq += 1;
    this.notifications.push({ id: `n${Date.now()}-${this.notifSeq}`, userId, type, title, body, read: false, link, createdAt: new Date().toISOString() });
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

  private msgSeq = 0;
  createMessage(chatId: string, text: string, image?: string) {
    const me = this.requireAuth();
    this.msgSeq += 1;
    const msg: Message = { id: `m${Date.now()}-${this.msgSeq}`, chatId, authorId: me.id, text, image, ts: new Date().toISOString(), status: "sent" };
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
          this.msgSeq += 1;
          const reply: Message = { id: `m${Date.now()}-${this.msgSeq}`, chatId, authorId: other, text: "Gracias por tu mensaje! Te respondo pronto.", ts: new Date().toISOString(), status: "sent" };
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
    // Congelado por reclamos abiertos (visibilidad que pidió la entrevista 8).
    const frozen = this.payments
      .filter((p) => p.workerId === workerId && p.status === "en_disputa")
      .reduce((s, p) => s + p.net, 0);
    return { available, withdrawn, totalEarned, frozen, count: payouts.length };
  }

  // Retiro de fondos disponibles (a CBU/MP, sin comisión).
  withdrawFunds(method: PaymentMethod = "mercadopago") {
    const me = this.requireAuth();
    if (me.role !== "worker") throw new Error("Solo los trabajadores pueden retirar");
    let total = 0;
    this.payouts.forEach((p) => {
      if (p.workerId === me.id && p.status === "pendiente") {
        p.status = "liquidado";
        p.method = method;
        p.paidAt = new Date().toISOString();
        total += p.amount;
      }
    });
    if (total === 0) throw new Error("No tenés fondos disponibles para retirar");
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
    const responseRate = worker?.invitesReceived
      ? Math.round(((worker.invitesAnswered || 0) / worker.invitesReceived) * 100)
      : 0;
    const avgResponseMinutes = worker?.invitesAnswered
      ? Math.round((worker.responseMinutesTotal || 0) / worker.invitesAnswered)
      : null;
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
    // Ingresos del mes en curso (métrica que pide el dashboard de la tesis, 2.12.5).
    const monthIncome = months[months.length - 1]?.income || 0;
    return {
      totalJobs: completed.length,
      activeJobs: jobs.filter((j) => j.status === "agendado" || j.status === "en_camino" || j.status === "en_progreso").length,
      proposalsSent: proposals.length,
      acceptanceRate,
      responseRate,
      avgResponseMinutes,
      monthIncome,
      rating: worker?.rating || 0,
      reviewCount: worker?.reviewCount || 0,
      level: worker?.level || "bronze",
      wallet,
      months,
    };
  }

  // Insights de demanda: dónde conviene ofrecerse (E4 y E5, estacionalidad).
  getDemandInsights(workerId: string): DemandInsight[] {
    const worker = this.users.find((u) => u.id === workerId);
    const cats = worker?.trades?.length ? worker.trades : [...CATEGORIES];
    return cats
      .map((category) => {
        const open = this.offers.filter((o) => o.category === category && o.status === "abierta");
        const competitors = this.users.filter(
          (u) => u.role === "worker" && (u.trades?.includes(category) || u.trade === category),
        ).length;
        const avgBudget = open.length ? Math.round(open.reduce((s, o) => s + o.budget, 0) / open.length) : 0;
        return {
          category,
          openRequests: open.length,
          competitors,
          ratio: competitors ? Math.round((open.length / competitors) * 100) / 100 : open.length,
          avgBudget,
        };
      })
      .sort((a, b) => b.ratio - a.ratio);
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
