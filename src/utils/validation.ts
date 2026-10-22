/**
 * Validaciones y sanitizaciones de datos para Aromancia
 * - Nombres: Solo letras (incluyendo acentos, ñ, diéresis) y espacios
 * - Teléfonos: Exclusivamente números
 */

// Permite letras latinas, tildes (á, é, í, ó, ú), mayúsculas/minúsculas, ñ, diéresis y espacios
export const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

// Exclusivamente dígitos numéricos
export const PHONE_REGEX = /^[0-9]+$/;

/**
 * Sanitiza un campo de nombre o texto personal:
 * Elimina dígitos numéricos y caracteres especiales prohibidos.
 */
export function sanitizeName(value: string): string {
  if (!value) return '';
  // Reemplaza dígitos y caracteres que no sean letras, acentos, espacios o guiones
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '');
}

/**
 * Valida si un nombre contiene únicamente letras y espacios válidos
 */
export function isValidName(value: string, minLength = 2): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.length < minLength) return false;
  return NAME_REGEX.test(trimmed);
}

/**
 * Sanitiza un campo de teléfono:
 * Elimina cualquier caracter que NO sea un número (0-9).
 */
export function sanitizePhone(value: string): string {
  if (!value) return '';
  // Remueve cualquier caracter que no sea dígito
  return value.replace(/\D/g, '');
}

/**
 * Valida si un teléfono consiste exclusivamente en números
 */
export function isValidPhone(value: string, minDigits = 6): boolean {
  if (!value) return false;
  const cleaned = value.trim();
  if (cleaned.length < minDigits) return false;
  return PHONE_REGEX.test(cleaned);
}
