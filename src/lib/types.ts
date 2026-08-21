// Domain model for OFIX Connect — marketplace de oficios verificados.
// Sin backend: todo se persiste en localStorage vía src/lib/store.ts.

export type Role = "user" | "worker";
// hogar · pyme gastronómica · administrador de consorcios (pedido en la
// entrevista 8 de la tesis: contrata oficios "todos los días").
export type ClientType = "hogar" | "pyme_gastronomica" | "administrador_consorcio";
export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  hogar: "Hogar",
  pyme_gastronomica: "PyME gastronómica",
  administrador_consorcio: "Administrador de consorcios",
};

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

// ── Disponibilidad (dolor #1 de la investigación: 4 de 8 entrevistas) ──
export type AvailabilityStatus = "disponible" | "ocupado" | "fuera_de_horario";
export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  disponible: "Disponible ahora",
  ocupado: "En un trabajo",
  fuera_de_horario: "Fuera de horario",
};

// Horario de atención. days: 0=Dom … 6=Sáb. Horas en formato "HH:MM".
export interface WorkSchedule {
  days: number[];
  from: string;
  to: string;
}

// Plan del cliente (entrevista 3 sugirió una suscripción para asegurar
// acceso a profesionales serios).
export type ClientPlan = "free" | "plus";

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
  clientPlan?: ClientPlan; // suscripción del lado de la demanda

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
  available?: boolean; // se declara disponible para urgencias
  workSchedule?: WorkSchedule; // horarios de atención
  onCallWeekends?: boolean; // guardia fines de semana / feriados
  onCallSurcharge?: number; // % de recargo por guardia
  vehicle?: string; // para la ficha "quién va a ir"
  // Métricas de respuesta (KPI 3.5 "tasa de respuesta de trabajadores")
  invitesReceived?: number;
  invitesAnswered?: number;
  responseMinutesTotal?: number;
}

export type PublicUser = Omit<User, "password">;

// ── Propiedades administradas (segmento consorcios) ──
export interface Property {
  id: string;
  ownerId: string; // cliente administrador
  name: string;
  address: string;
  zone?: string;
  geo?: Geo;
  units?: number; // cantidad de unidades funcionales
  notes?: string;
  createdAt: string;
}

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
  propertyId?: string; // si la publicó un administrador de consorcios
  // ── Ventana de respuesta y escalado (dolor de disponibilidad inmediata) ──
  responseDeadline?: string; // hasta cuándo hay para responder
  radiusKm?: number; // radio de búsqueda actual
  escalations?: string[]; // timestamps de cada escalado
  notifiedWorkerIds?: string[]; // a quiénes ya se avisó
  firstProposalAt?: string; // para medir time-to-match
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
  etaMinutes?: number; // para urgencias: en cuánto puede estar
  status: ProposalStatus;
  createdAt: string;
}

// ── Complejidad del trabajo (filtro pedido en las entrevistas 3 y 4) ──
export type Complexity = "basica" | "intermedia" | "compleja";
export const COMPLEXITY_LABELS: Record<Complexity, string> = {
  basica: "Básica",
  intermedia: "Intermedia",
  compleja: "Compleja",
};

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
  complexity?: Complexity;
  warrantyDays?: number; // garantía / retrabajo
  active: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// ── Trabajo (resultante de una oferta aceptada) ──
// El estado "en_camino" es el eje del diferencial de la tesis (matriz 2.11:
// seguimiento del desplazamiento y tiempos estimados).
export type JobStatus = "agendado" | "en_camino" | "en_progreso" | "completado" | "cancelado";
export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  agendado: "Agendado",
  en_camino: "En camino",
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
  insurancePlanId?: string;
  status: JobStatus;
  propertyId?: string;
  recurringPlanId?: string; // si lo generó un plan de mantenimiento

  // ── Trazabilidad del servicio (diferencial 2.11) ──
  etaMinutes?: number; // ETA declarado al salir
  departedAt?: string; // el profesional salió
  workerGeo?: Geo; // última posición conocida en el trayecto
  originGeo?: Geo; // desde dónde salió (para interpolar el avance)
  arrivedAt?: string; // llegó al domicilio
  arrivalCode?: string; // código que el cliente valida en la puerta
  arrivalConfirmedAt?: string; // el cliente confirmó la identidad
  startedAt?: string; // arrancó el trabajo
  trackingToken?: string; // para compartir seguimiento con un contacto
  panicAt?: string; // botón de pánico durante el servicio

  // ── Resultado y garantía ──
  resultImages?: string[]; // fotos del trabajo terminado (portfolio)
  warrantyDays?: number;
  warrantyUntil?: string;

  // ── Incumplimiento ──
  noShowReportedAt?: string;
  noShowBy?: string;

  createdAt: string;
  completedAt?: string;
  reviewedByClient?: boolean;
  reviewedByWorker?: boolean;
}

// Evento de la línea de tiempo del servicio (trazabilidad visual).
export interface JobTimelineEvent {
  key: string;
  label: string;
  at?: string; // timestamp real; undefined = todavía no pasó
  done: boolean;
}

// Estado derivado del trayecto, para el mapa y el ETA en vivo.
export interface TrackingState {
  status: JobStatus;
  etaMinutes: number | null; // minutos restantes
  progress: number; // 0..1 del trayecto recorrido
  workerGeo?: Geo;
  clientGeo?: Geo;
  distanceKm: number | null;
  departedAt?: string;
  arrivedAt?: string;
  arrivalCode?: string;
  arrivalConfirmed: boolean;
}

// Ficha "quién va a ir" — se le muestra al cliente antes de que toque el timbre.
export interface ArrivalCard {
  workerId: string;
  name: string;
  photo?: string;
  trade?: string;
  rating: number;
  reviewCount: number;
  verification?: Verification;
  verified: boolean;
  jobsDone: number;
  vehicle?: string;
  phone?: string;
  arrivalCode?: string;
}

// ── Pago (escrow) ──
export type PaymentMethod = "mercadopago" | "efectivo" | "transferencia";
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mercadopago: "Mercado Pago",
  efectivo: "Efectivo",
  transferencia: "Transferencia",
};

// pendiente = falta pagar · retenido = pagado, en escrow ·
// en_disputa = retenido y congelado por un reclamo ·
// liberado = fondos liberados al trabajador · reembolsado
export type PaymentStatus = "pendiente" | "retenido" | "en_disputa" | "liberado" | "reembolsado";
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pendiente: "Pendiente de pago",
  retenido: "Retenido en garantía",
  en_disputa: "Congelado por reclamo",
  liberado: "Liberado al profesional",
  reembolsado: "Reembolsado",
};

export interface Payment {
  id: string;
  jobId: string;
  clientId: string;
  workerId: string;
  gross: number; // monto del trabajo
  commission: number; // comisión OFIX (cobrada al cliente)
  insuranceCost: number;
  surcharge: number; // recargo por guardia (fin de semana / feriado)
  total: number; // total que paga el cliente
  net: number; // monto neto al trabajador
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  releasedAt?: string;
}

// ── Reclamos / disputas (pedido textual de la entrevista 7) ──
export type DisputeStatus = "abierta" | "en_revision" | "resuelta_cliente" | "resuelta_trabajador";
export const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
  abierta: "Abierta",
  en_revision: "En revisión de OFIX",
  resuelta_cliente: "Resuelta a favor del cliente",
  resuelta_trabajador: "Resuelta a favor del profesional",
};

export type DisputeReason =
  | "trabajo_mal_hecho"
  | "no_se_presento"
  | "cobro_incorrecto"
  | "danio"
  | "otro";
export const DISPUTE_REASON_LABELS: Record<DisputeReason, string> = {
  trabajo_mal_hecho: "El trabajo quedó mal hecho",
  no_se_presento: "No se presentó",
  cobro_incorrecto: "Cobro incorrecto",
  danio: "Daño durante el servicio",
  otro: "Otro motivo",
};

export interface Dispute {
  id: string;
  jobId: string;
  openedBy: string;
  againstId: string;
  reason: DisputeReason;
  description: string;
  images?: string[];
  status: DisputeStatus;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ── Garantía / retrabajo ──
export type WarrantyClaimStatus = "abierto" | "agendado" | "resuelto" | "rechazado";
export const WARRANTY_STATUS_LABELS: Record<WarrantyClaimStatus, string> = {
  abierto: "Abierto",
  agendado: "Revisión agendada",
  resuelto: "Resuelto",
  rechazado: "Rechazado",
};

export interface WarrantyClaim {
  id: string;
  jobId: string;
  clientId: string;
  workerId: string;
  description: string;
  images?: string[];
  status: WarrantyClaimStatus;
  scheduledAt?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ── Mantenimiento recurrente (tesis 2.2 y 2.4) ──
export type Frequency = "semanal" | "quincenal" | "mensual" | "trimestral";
export const FREQUENCY_LABELS: Record<Frequency, string> = {
  semanal: "Semanal",
  quincenal: "Quincenal",
  mensual: "Mensual",
  trimestral: "Trimestral",
};
export const FREQUENCY_DAYS: Record<Frequency, number> = {
  semanal: 7,
  quincenal: 15,
  mensual: 30,
  trimestral: 90,
};

export interface RecurringPlan {
  id: string;
  clientId: string;
  workerId?: string; // profesional preferido
  propertyId?: string;
  category: string;
  title: string;
  description?: string;
  budget: number;
  frequency: Frequency;
  nextDate: string;
  location: string;
  geo?: Geo;
  active: boolean;
  createdAt: string;
  lastGeneratedAt?: string;
}

// ── Reseña (calificación mutua) ──
export interface Review {
  id: string;
  jobId: string;
  authorId: string;
  targetId: string;
  stars: number; // 1-5
  comment: string;
  verified: boolean; // proviene de un trabajo pagado en OFIX
  reply?: { text: string; createdAt: string }; // derecho a réplica
  reportedAt?: string;
  createdAt: string;
}

// ── NPS (KPI 3.5) ──
export interface NpsResponse {
  id: string;
  userId: string;
  jobId: string;
  score: number; // 0-10
  comment?: string;
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
  | "seguimiento"
  | "reclamo"
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
  method?: PaymentMethod; // con qué medio se retiró (E5: historial claro)
  createdAt: string;
  paidAt?: string;
}

// ── Comprobante / factura del servicio ──
// Documento derivado (no se persiste): se arma desde Job + Payment + usuarios.
// Tipo A para PyMEs y administradores, B para consumidor final.
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
  surcharge: number;
  total: number;
  net: number;
  method: PaymentMethod;
  status: PaymentStatus;
  propertyName?: string;
}

// Resumen de facturación de un período (panel PyME / consorcios).
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

// ── Precios de referencia (transparencia pedida en E1, E3, E6) ──
export interface PriceReference {
  category: string;
  min: number;
  max: number;
  avg: number;
  count: number; // sobre cuántos datos se calculó
}

// Insight de demanda para el trabajador (E4 y E5: estacionalidad).
export interface DemandInsight {
  category: string;
  openRequests: number;
  competitors: number; // trabajadores de esa categoría
  ratio: number; // solicitudes por trabajador
  avgBudget: number;
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

// La tesis dice "microseguros incluidos en cada contratación" (2.2) pero también
// "opcional u obligatoria según rubro" (6.3). Se reconcilia así: viene
// preseleccionado siempre, y es obligatorio en los rubros de riesgo.
export const MANDATORY_INSURANCE_CATEGORIES: string[] = ["Gas", "Electricidad"];
export const DEFAULT_INSURANCE_PLAN_ID = "basico";

// Comisión de servicio OFIX (cobrada al cliente sobre el monto del trabajo).
export const OFIX_COMMISSION_RATE = 0.15;

// Recargo por guardia de fin de semana / feriado (sobre el monto del trabajo).
export const DEFAULT_ONCALL_SURCHARGE_RATE = 0.2;

// Ventana de respuesta para urgencias, y escalado si nadie contesta.
export const RESPONSE_WINDOW_MINUTES = 15;
export const ESCALATION_RADIUS_STEPS_KM = [3, 6, 12, 25];

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

// Garantía por defecto de un trabajo, en días.
export const DEFAULT_WARRANTY_DAYS = 30;
