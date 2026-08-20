import type { PublicUser } from "./types";

// Puntaje de confianza compuesto (0-100): verificación + rating + experiencia.
export function trustScore(w: PublicUser): number {
  let s = 0;
  const v = w.verification;
  if (v?.identity) s += 25;
  if (v?.background) s += 25;
  if (v?.license) s += 15;
  s += Math.round(((w.rating || 0) / 5) * 20);
  s += Math.min(15, w.jobsDone || 0);
  return Math.min(100, s);
}

export function trustLabel(score: number): string {
  if (score >= 85) return "Confianza excelente";
  if (score >= 65) return "Confianza alta";
  if (score >= 40) return "Confianza media";
  return "Perfil nuevo";
}
