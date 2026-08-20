// Domain model for OFIX Connect — marketplace de oficios verificados.
// Sin backend: todo se persiste en localStorage vía src/lib/store.ts.

export type Role = "user" | "worker";
export type ClientType = "hogar" | "pyme_gastronomica";
export type WorkerLevel = "bronze" | "silver" | "gold";
export type AuthProvider = "email" | "google" | "apple";

export interface Geo {
  lat: number;
  lng: number;
}

export interface Verification {
  identity: boolean; // DNI / identidad
  background: boolean; // antecedentes
  license: boolean; // matrícula / título
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: Role;
  photo?: string; // base64 / url
  address?: string;
  zone?: string; // barrio / zona
  geo?: Geo;
  authProvider?: AuthProvider;
  createdAt: string;
  updatedAt: string;

  // ── Cliente ──
  clientType?: ClientType;

  // ── Trabajador ──
  trade?: string; // oficio principal (retrocompat / display)
  trades?: string[]; // oficios ofrecidos
  coverageZone?: string; // zona de cobertura
  hourlyRate?: number; // tarifa por hora
  bio?: string; // descripción del perfil
  verified?: boolean; // verificación global (derivada)
  verification?: Verification;
  level?: WorkerLevel; // Bronze / Silver / Gold
  rating?: number; // promedio (1 decimal)
  reviewCount?: number;
  jobsDone?: number; // trabajos realizados
  premium?: boolean; // suscripción destacada
  available?: boolean; // disponible para emergencias
}

export type PublicUser = Omit<User, "password">;

// ── Solicitud / Urgencia ──
export type Urgency = "inmediata" | "en_el_dia" | "programada";
export const URGENCY_LABELS: Record<Urgency, string> = {
  inmediata: "Inmediata",
  en_el_dia: "En el día",
  programada: "Programada",
};

// abierta = esperando ofertas · asignada = aceptó una oferta (hay Job) ·
// completada · cancelada
export type OfferStatus = "abierta" | "asignada" | "completada" | "cancelada";
export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  abierta: "Abierta",
  asignada: "Asignada",
  completada: "Completada",
  cancelada: "Cancelada",
};

export interface Offer {
  id: string;
  authorId: string; // cliente
  title: string;
  description: string;
  category: string;
  budget: number;
  urgency: Urgency;
  scheduledDate?: string; // si urgency = programada
  location: string;
  geo?: Geo;
  images?: string[]; // fotos (base64)
  emergency?: boolean; // creada por el botón SOS
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Propuesta / Oferta del trabajador ──
export type ProposalStatus = "enviada" | "aceptada" | "rechazada" | "finalizada";
export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  enviada: "Enviada",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  finalizada: "Finalizada",
};

export interface Proposal {
  id: string;
  offerId: string;
  workerId: string;
  message: string;
  price: number;
  availability?: string; // disponibilidad propuesta
  status: ProposalStatus;
  createdAt: string;
}

// ── Servicio (oficio ofrecido por el trabajador) ──
export interface Service {
  id: string;
  workerId: string;
  title: string;
  category: string;
  description: string;
  price: number;
  duration: string; // rango estimado, ej "2-3 horas"
  schedule?: string; // horarios de atención
  withUrgency?: boolean; // ofrece atención urgente
  images?: string[]; // fotos del trabajo (base64)
  active: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// ── Trabajo (resultante de una oferta aceptada) ──
export type JobStatus = "agendado" | "en_progreso" | "completado" | "cancelado";
export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  agendado: "Agendado",
  en_progreso: "En progreso",
  completado: "Completado",
  cancelado: "Cancelado",
};

export interface Job {
  id: string;
  offerId: string;
  proposalId: string;
  clientId: string;
  workerId: string;
  category: string;
  title: string;
  amount: number; // monto acordado (trabajo)
  scheduledAt?: string;
  insurance: boolean;
  insuranceCost?: number;
  status: JobStatus;
  createdAt: string;
  completedAt?: string;
  reviewedByClient?: boolean;
  reviewedByWorker?: boolean;
}

// ── Pago (escrow) ──
export type PaymentMethod = "mercadopago" | "efectivo" | "transferencia";
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mercadopago: "Mercado Pago",
  efectivo: "Efectivo",
  transferencia: "Transferencia",
};

// pendiente = falta pagar · retenido = pagado, en escrow ·
// liberado = fondos liberados al trabajador · reembolsado
export type PaymentStatus = "pendiente" | "retenido" | "liberado" | "reembolsado";

export interface Payment {
  id: string;
  jobId: string;
  clientId: string;
  workerId: string;
  gross: number; // monto del trabajo
  commission: number; // comisión OFIX (cobrada al cliente)
  insuranceCost: number;
  total: number; // total que paga el cliente (gross + commission + seguro)
  net: number; // monto neto al trabajador
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  releasedAt?: string;
}

// ── Comprobante / factura del servicio ──
// Documento derivado (no se persiste): se arma desde Job + Payment + usuarios.
// Tipo A para PyMEs (responsable inscripto), B para consumidor final.
export type ReceiptKind = "A" | "B";

export interface ReceiptParty {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  detail?: string; // oficio del trabajador / tipo de cliente
}

export interface Receipt {
  number: string; // OFIX-0001-00000123
  kind: ReceiptKind;
  issuedAt: string; // fecha del pago
  paidAt?: string; // fecha de liberación de fondos
  jobId: string;
  client: ReceiptParty;
  worker: ReceiptParty;
  concept: string; // título del trabajo
  category: string;
  gross: number;
  commission: number;
  insuranceCost: number;
  insuranceName?: string;
  total: number;
  method: PaymentMethod;
  status: PaymentStatus;
}

// Resumen de facturación de un período (panel PyME).
export interface BillingPeriod {
  key: string; // YYYY-MM
  label: string; // "agosto 2026"
  jobs: number;
  gross: number;
  commission: number;
  insuranceCost: number;
  total: number;
  receipts: Receipt[];
}

// ── Reseña (calificación mutua) ──
export interface Review {
  id: string;
  jobId: string;
  authorId: string;
  targetId: string;
  stars: number; // 1-5
  comment: string;
  createdAt: string;
}

// ── Favoritos ──
export interface Favorite {
  id: string;
  clientId: string;
  workerId: string;
  createdAt: string;
}

// ── Notificaciones ──
export type NotificationType =
  | "mensaje"
  | "pago"
  | "reserva"
  | "oferta"
  | "emergencia"
  | "sistema";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

// ── Chat & mensajes ──
export interface Chat {
  id: string;
  participantIds: string[];
  lastMessageAt: string;
  lastMessage?: string;
}

export interface Message {
  id: string;
  chatId: string;
  authorId: string;
  text: string;
  image?: string; // foto adjunta (data URL, redimensionada)
  ts: string;
  status: "sent" | "read";
}

// ── Cobros / Wallet del trabajador ──
export type PayoutStatus = "pendiente" | "liquidado";

export interface Payout {
  id: string;
  workerId: string;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
  paidAt?: string;
}

// ── Categorías de oficios ──
export const CATEGORIES = [
  "Plomería",
  "Electricidad",
  "Gas",
  "Cerrajería",
  "Pintura",
  "Mantenimiento",
  "Aire acondicionado",
  "Limpieza",
  "Jardinería",
  "Carpintería",
] as const;

export type Category = (typeof CATEGORIES)[number];

// ── Seguro por servicio ──
export interface InsurancePlan {
  id: string;
  name: string;
  coverage: string;
  cost: number; // ARS por servicio
}

export const INSURANCE_PLANS: InsurancePlan[] = [
  { id: "basico", name: "Cobertura Básica", coverage: "Daños hasta $50.000 durante el servicio", cost: 800 },
  { id: "plus", name: "Cobertura Plus", coverage: "Daños hasta $200.000 + garantía de retrabajo", cost: 2000 },
];

// Comisión de servicio OFIX (cobrada al cliente sobre el monto del trabajo).
export const OFIX_COMMISSION_RATE = 0.15;

// Umbrales de nivel del trabajador (trabajos completados).
export const LEVEL_THRESHOLDS: Record<WorkerLevel, number> = {
  bronze: 0,
  silver: 10,
  gold: 30,
};
export const LEVEL_LABELS: Record<WorkerLevel, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};
