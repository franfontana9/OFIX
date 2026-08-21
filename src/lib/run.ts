import { toast } from "sonner";

/**
 * Ejecuta una mutación del store mostrando el error como toast.
 *
 * Los métodos del store tiran `Error` con mensaje en español (por ejemplo
 * "No autorizado" o "Ya hay un reclamo abierto"). Si nadie los captura, el error
 * sube hasta el ErrorBoundary y se come la pantalla completa por algo que era
 * recuperable: tocar un favorito no puede tumbar la página.
 *
 * Devuelve el resultado, o `undefined` si falló, así el caller puede cortar:
 *
 *     const job = run(() => store.completeJob(id), "¡Trabajo validado!");
 *     if (!job) return;
 *     refresh();
 */
export function run<T>(fn: () => T, okMessage?: string, fallbackError = "No se pudo completar la acción"): T | undefined {
  try {
    const result = fn();
    if (okMessage) toast.success(okMessage);
    return result;
  } catch (err) {
    toast.error((err as Error)?.message || fallbackError);
    return undefined;
  }
}

/** Igual que `run`, para mutaciones asíncronas. */
export async function runAsync<T>(
  fn: () => Promise<T>,
  okMessage?: string,
  fallbackError = "No se pudo completar la acción",
): Promise<T | undefined> {
  try {
    const result = await fn();
    if (okMessage) toast.success(okMessage);
    return result;
  } catch (err) {
    toast.error((err as Error)?.message || fallbackError);
    return undefined;
  }
}
