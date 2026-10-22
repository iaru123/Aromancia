import { Perfume, CartItem } from '../types';
import { INITIAL_PERFUMES } from '../data/initialPerfumes';

const STORAGE_KEY = 'aromancia_perfumes_v1';
const CART_KEY = 'aromancia_cart_v1';
const WISHLIST_KEY = 'aromancia_wishlist_v1';

/**
 * Initializes and retrieves perfumes from LocalStorage.
 * If no records exist, initializes with the 17 authentic Aromancia catalog items.
 */
export function getStoredPerfumes(): Perfume[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PERFUMES));
      return INITIAL_PERFUMES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PERFUMES));
      return INITIAL_PERFUMES;
    }
    return parsed;
  } catch (error) {
    console.error('Error al leer de LocalStorage:', error);
    return INITIAL_PERFUMES;
  }
}

/**
 * Saves perfume list to LocalStorage.
 */
export function saveStoredPerfumes(perfumes: Perfume[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(perfumes));
  } catch (error) {
    console.error('Error al guardar en LocalStorage:', error);
  }
}

/**
 * Creates a new perfume record and persists to LocalStorage.
 */
export function addStoredPerfume(data: Omit<Perfume, 'id' | 'creadoEn'>): Perfume {
  const perfumes = getStoredPerfumes();
  const newPerfume: Perfume = {
    ...data,
    id: `perfume-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    creadoEn: new Date().toISOString().split('T')[0]
  };
  const updated = [newPerfume, ...perfumes];
  saveStoredPerfumes(updated);
  return newPerfume;
}

/**
 * Updates an existing perfume record.
 */
export function updateStoredPerfume(updatedPerfume: Perfume): boolean {
  const perfumes = getStoredPerfumes();
  const index = perfumes.findIndex(p => p.id === updatedPerfume.id);
  if (index === -1) return false;
  perfumes[index] = updatedPerfume;
  saveStoredPerfumes(perfumes);
  return true;
}

/**
 * Deletes a perfume record by ID.
 */
export function deleteStoredPerfume(id: string): boolean {
  const perfumes = getStoredPerfumes();
  const filtered = perfumes.filter(p => p.id !== id);
  if (filtered.length === perfumes.length) return false;
  saveStoredPerfumes(filtered);
  return true;
}

/**
 * Retrieves a single perfume by ID.
 */
export function getStoredPerfumeById(id: string): Perfume | undefined {
  const perfumes = getStoredPerfumes();
  return perfumes.find(p => p.id === id);
}

/**
 * Resets storage back to the original 17 catalog perfumes.
 */
export function resetStoredPerfumes(): Perfume[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PERFUMES));
    return INITIAL_PERFUMES;
  } catch (error) {
    console.error('Error al resetear LocalStorage:', error);
    return INITIAL_PERFUMES;
  }
}

/**
 * Cart persistence
 */
export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error al guardar carrito:', error);
  }
}

/**
 * Wishlist persistence
 */
export function getStoredWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : ['perfume-01', 'perfume-03'];
  } catch {
    return [];
  }
}

export function toggleStoredWishlist(id: string): string[] {
  try {
    const wishlist = getStoredWishlist();
    const index = wishlist.indexOf(id);
    let updated: string[];
    if (index === -1) {
      updated = [...wishlist, id];
    } else {
      updated = wishlist.filter(item => item !== id);
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

/**
 * ==========================================
 * USER & AUTH PERSISTENCE (Clientes y Administrador)
 * ==========================================
 */
const USERS_KEY = 'aromancia_users_v1';
const CURRENT_USER_KEY = 'aromancia_current_user_v1';

import { User, Order } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    nombre: 'Maestro Perfumista (Admin)',
    email: 'admin@aromancia.com',
    password: 'admin',
    rol: 'admin',
    telefono: '+54 11 4821-9900',
    direccion: 'Honduras 4920, Atelier Central',
    ciudad: 'Palermo Soho, CABA',
    creadoEn: '2025-01-01'
  },
  {
    id: 'user-c1',
    nombre: 'Valentina Rossi',
    email: 'valentina.rossi@gmail.com',
    password: '123',
    rol: 'cliente',
    telefono: '+54 11 5492-1144',
    direccion: 'Av. Libertador 3200, Piso 8',
    ciudad: 'Recoleta, CABA',
    creadoEn: '2025-01-14'
  },
  {
    id: 'user-c2',
    nombre: 'Esteban Morales',
    email: 'esteban.m@outlook.com',
    password: '123',
    rol: 'cliente',
    telefono: '+54 351 482-9911',
    direccion: 'Belgrano 450',
    ciudad: 'Córdoba Capital',
    creadoEn: '2025-02-02'
  },
  {
    id: 'user-c3',
    nombre: 'Camila Dellacasa',
    email: 'camila.della@gmail.com',
    password: '123',
    rol: 'cliente',
    telefono: '+54 223 611-8822',
    direccion: 'Güemes 2810',
    ciudad: 'Mar del Plata, Bs. As.',
    creadoEn: '2025-02-18'
  }
];

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
  }
}

export function registerUser(newUser: Omit<User, 'id' | 'creadoEn'>): { success: boolean; user?: User; message?: string } {
  const users = getStoredUsers();
  const exists = users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
  if (exists) {
    return { success: false, message: 'Ya existe una cuenta con ese correo electrónico.' };
  }

  const createdUser: User = {
    ...newUser,
    id: `user-${Date.now()}`,
    creadoEn: new Date().toISOString().split('T')[0]
  };

  const updated = [...users, createdUser];
  saveStoredUsers(updated);
  saveStoredCurrentUser(createdUser);
  return { success: true, user: createdUser };
}

export function loginUser(email: string, password?: string): { success: boolean; user?: User; message?: string } {
  const users = getStoredUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!found) {
    return { success: false, message: 'No encontramos una cuenta con ese correo electrónico.' };
  }
  if (found.password && password && found.password !== password) {
    return { success: false, message: 'Contraseña incorrecta. Por favor intente nuevamente.' };
  }
  saveStoredCurrentUser(found);
  return { success: true, user: found };
}

export function getStoredCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredCurrentUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Error al guardar sesión:', error);
  }
}

/**
 * ==========================================
 * ORDERS PERSISTENCE (Detalles de Compras y Clientes)
 * ==========================================
 */
const ORDERS_KEY = 'aromancia_orders_v1';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2025-0891',
    fecha: '2025-02-28 14:32',
    cliente: {
      id: 'user-c1',
      nombre: 'Valentina Rossi',
      email: 'valentina.rossi@gmail.com',
      telefono: '+54 11 5492-1144',
      direccion: 'Av. Libertador 3200, Piso 8',
      ciudad: 'Recoleta, CABA'
    },
    items: [
      {
        perfumeId: 'perfume-01',
        nombre: 'Flor de Loto',
        precio: 28990,
        cantidad: 1,
        volumen: '50ml',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNmkATJHFSufY2yT9lLqsE5m2rpEQqy9SUEliWPMFCR6Fo0sAibpjdwngkdRGteB68Mn9KLiZB6hCuLqJ6nJzVPADSOmP6eFVVTR_ihfyH8GQM2JSXNbWe6SkdVrlbfyTwBlrpZdJ8Dyxjfk9ZbVg2js-YXV4fitujM42AwfXsaukHcX3w1rpfJdsxe1uvjPqRDltPM8f9tbehZVQM4ZPZC3K_VejaatXReTthCw9MHLev5-7jCVzWZQ'
      },
      {
        perfumeId: 'perfume-03',
        nombre: 'Vanilla Skin',
        precio: 30990,
        cantidad: 1,
        volumen: '50ml',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkCyahl9iz617hLnMSKxuPxhmf5Wz01BqcPE9WCRqQ4wT2tMLlyvMX9pv3T2cLg5KmGl-4k7cJpWgQozyUeBTKzDn9Yn7FjeH_0W5VHw3J90YUPtyltKoxgKyhrRQxbNZd0sccCkmFEQ9oD4pfwJt0xkJ8YzlExhPxp6AEc6reABKxTRhrFmZU3fL-Shzgm_wtYEYabesP9cIWfkLgrSihfVXnpaG8-VKdmjMxVwfzvWzE-jLFl1Ax_g'
      }
    ],
    subtotal: 59980,
    envio: 0,
    total: 59980,
    estado: 'En camino',
    metodoPago: 'Tarjeta de Crédito (3 cuotas)'
  },
  {
    id: 'ORD-2025-0892',
    fecha: '2025-03-01 10:15',
    cliente: {
      id: 'user-c2',
      nombre: 'Esteban Morales',
      email: 'esteban.m@outlook.com',
      telefono: '+54 351 482-9911',
      direccion: 'Belgrano 450',
      ciudad: 'Córdoba Capital'
    },
    items: [
      {
        perfumeId: 'perfume-02',
        nombre: 'Ébano',
        precio: 32990,
        cantidad: 1,
        volumen: '50ml',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAscZo3uPuLQNv_yWAo620SXDaTTmFS42jjU_WI1MsDeLC7XFPdbj6a7c3lWYXNAoyMgdM35Ebrahqa6xKvzc46iBolfbSr-jnojjevmEuest7sy5BXQZcNnd4t6nOHf1ZUYSSMnduvAb7d-Ekfkt1SH6jKVFIYsLnwOknZSX5BZ4et7vfWGtFosl0JpTqIgQ3f4vNCi9mL70ILgvIKkUY4IrM9etBVmV--lAzJWI6qsjT91lEcYCwdig'
      }
    ],
    subtotal: 32990,
    envio: 0,
    total: 32990,
    estado: 'En preparación en Atelier',
    metodoPago: 'Transferencia Bancaria'
  },
  {
    id: 'ORD-2025-0893',
    fecha: '2025-03-03 18:40',
    cliente: {
      id: 'user-c3',
      nombre: 'Camila Dellacasa',
      email: 'camila.della@gmail.com',
      telefono: '+54 223 611-8822',
      direccion: 'Güemes 2810',
      ciudad: 'Mar del Plata, Bs. As.'
    },
    items: [
      {
        perfumeId: 'perfume-04',
        nombre: 'Set Esencial',
        precio: 24990,
        cantidad: 2,
        volumen: '3 x 15ml',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2keX6T-TuXeinTvumr6luVNoVcbTZijWH12YIcluuAOPHvdnv9f2fZMZGDWZj_YRTl4o5qTC8hbjYnuZJl2bA43WlWgYs8GI3GeIMK28nw3HXWfWWuhcvWHBG84V22SDIs1RkwfXSXpYs0R7aRFOllA7_l5_vRKlTwrWX9ya6d27Gj9ocSu-R-_xEr3YqRu-8AD7bhkziwkG9R0QpCIVgiw3eiymUTl74A7OMQTlVNOzuU5jn0ZnzvQ'
      }
    ],
    subtotal: 49980,
    envio: 0,
    total: 49980,
    estado: 'Entregado',
    metodoPago: 'Tarjeta de Débito'
  }
];

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error al guardar pedidos:', error);
  }
}

export function addStoredOrder(order: Omit<Order, 'id' | 'fecha'>): Order {
  const orders = getStoredOrders();
  const dateStr = new Date();
  const formattedDate = `${dateStr.toISOString().split('T')[0]} ${dateStr.toTimeString().split(' ')[0].substring(0, 5)}`;
  const newOrder: Order = {
    ...order,
    id: `ORD-2025-${Math.floor(1000 + Math.random() * 9000)}`,
    fecha: formattedDate
  };
  const updated = [newOrder, ...orders];
  saveStoredOrders(updated);
  return newOrder;
}

export function updateStoredOrderStatus(orderId: string, estado: Order['estado']): boolean {
  const orders = getStoredOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return false;
  orders[idx].estado = estado;
  saveStoredOrders(orders);
  return true;
}
