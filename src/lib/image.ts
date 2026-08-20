// Utilidades de imagen para adjuntos. Todo se guarda como data URL en
// localStorage, así que hay que redimensionar y comprimir antes de persistir:
// una foto de celular sin tocar (3-8 MB) revienta la cuota del navegador.

const MAX_EDGE = 900; // lado más largo, en px
const QUALITY = 0.6; // calidad JPEG
export const MAX_ATTACHMENT_BYTES = 220_000; // ~220 KB por adjunto

// Tamaño aproximado en bytes de un data URL base64.
export function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.floor((base64.length * 3) / 4);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("El archivo no es una imagen válida"));
    img.src = src;
  });
}

// Lee un archivo de imagen y devuelve un data URL JPEG redimensionado.
// Baja la calidad progresivamente hasta entrar en MAX_ATTACHMENT_BYTES.
export async function fileToResizedDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("El archivo no es una imagen");

  const original = await readAsDataUrl(file);
  const img = await loadImage(original);

  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  let quality = QUALITY;
  let out = canvas.toDataURL("image/jpeg", quality);
  while (dataUrlBytes(out) > MAX_ATTACHMENT_BYTES && quality > 0.25) {
    quality -= 0.1;
    out = canvas.toDataURL("image/jpeg", quality);
  }
  if (dataUrlBytes(out) > MAX_ATTACHMENT_BYTES) {
    throw new Error("La imagen es demasiado grande. Probá con una más chica.");
  }
  return out;
}
