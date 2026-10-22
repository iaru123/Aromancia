export type Category = 'todos' | 'femenino' | 'masculino' | 'unisex' | 'sets';

export type OlfactoryFamily =
  | 'Floral'
  | 'Amaderado'
  | 'Gourmand'
  | 'Chypre'
  | 'Oriental'
  | 'Cítrico'
  | 'Cuero'
  | 'Sets y Regalos';

export interface OlfactoryNotes {
  top: string[];     // Notas de salida
  heart: string[];   // Notas de corazón
  base: string[];    // Notas de fondo
}

export interface Perfume {
  id: string;
  nombre: string;
  categoria: 'femenino' | 'masculino' | 'unisex' | 'sets';
  familia: OlfactoryFamily;
  concentracion: string; // e.g. "Eau de Parfum", "Extrait de Parfum", "Cologne"
  precio: number;
  precioOriginal?: number;
  calificacion: number;
  totalResenas: number;
  volumen: string; // "50ml", "100ml", "3 x 15ml"
  descripcion: string;
  descripcionLarga?: string;
  imagen: string;
  tag?: string; // "Bestseller", "Edición Limitada", "Novedad", "Exclusivo"
  notas: OlfactoryNotes;
  acordesPrincipales: string[];
  stock: number;
  creadoEn: string;
}

export interface CartItem {
  perfume: Perfume;
  cantidad: number;
  tamanoSeleccionado: string;
}

export interface Review {
  id: string;
  autor: string;
  calificacion: number;
  fecha: string;
  comentario: string;
  verificado: boolean;
}

export interface PerfumeFormData {
  nombre: string;
  categoria: 'femenino' | 'masculino' | 'unisex' | 'sets';
  familia: OlfactoryFamily;
  concentracion: string;
  precio: number | string;
  volumen: string;
  descripcion: string;
  imagen: string;
  tag: string;
  notasSalida: string;
  notasCorazon: string;
  notasFondo: string;
  acordes: string;
  stock: number | string;
}

export interface FormErrors {
  nombre?: string;
  categoria?: string;
  familia?: string;
  concentracion?: string;
  precio?: string;
  volumen?: string;
  descripcion?: string;
  imagen?: string;
  stock?: string;
}

export type UserRole = 'cliente' | 'admin';

export interface User {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  rol: UserRole;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  creadoEn: string;
}

export interface OrderItem {
  perfumeId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  volumen: string;
  imagen: string;
}

export interface Order {
  id: string;
  fecha: string;
  cliente: {
    id?: string;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
  };
  items: OrderItem[];
  subtotal: number;
  envio: number;
  total: number;
  estado: 'Pendiente' | 'En preparación en Atelier' | 'En camino' | 'Entregado';
  metodoPago: string;
}

export type ViewType =
  | 'inicio'
  | 'tienda'
  | 'detalle'
  | 'alta'
  | 'editar'
  | 'nosotros'
  | 'contacto'
  | 'admin';
