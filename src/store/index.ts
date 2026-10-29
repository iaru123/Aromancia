import { ref, computed } from 'vue';
import { Perfume, CartItem, User, Order } from '../types';
import {
  getStoredPerfumes,
  saveStoredPerfumes,
  addStoredPerfume,
  updateStoredPerfume,
  deleteStoredPerfume,
  getStoredCart,
  saveStoredCart,
  getStoredWishlist,
  toggleStoredWishlist,
  getStoredUsers,
  getStoredCurrentUser,
  saveStoredCurrentUser,
  saveStoredUsers,
  getStoredOrders,
  saveStoredOrders,
  addStoredOrder,
  updateStoredOrderStatus
} from '../services/storage';

import { supabase } from '../utils/supabase';
import {
  checkSupabaseStatus,
  fetchPerfumesFromSupabase,
  persistPerfumeToSupabase,
  deletePerfumeFromSupabase,
  fetchOrdersFromSupabase,
  persistOrderToSupabase,
  updateOrderStatusInSupabase,
  updatePerfumeStockInSupabase,
  fetchUsersFromSupabase,
  persistUserToSupabase,
  signOutSupabase,
  subscribeToSupabaseChanges,
  SupabaseStatus
} from '../services/supabaseService';

// Reactive State
export const perfumes = ref<Perfume[]>([]);
export const currentUser = ref<User | null>(null);
export const users = ref<User[]>([]);
export const cart = ref<CartItem[]>([]);
export const wishlist = ref<string[]>([]);
export const orders = ref<Order[]>([]);

// Supabase Connection & Sync State
export const isSupabaseSyncing = ref(false);
export const supabaseStatus = ref<SupabaseStatus>({
  connected: false,
  message: 'Iniciando conexión con Supabase...'
});

// Modal and UI Controls
export const cartDrawerOpen = ref(false);
export const searchModalOpen = ref(false);
export const authModalOpen = ref(false);
export const authModalMode = ref<'login' | 'register' | 'admin'>('login');

// Floating Toast Notification
export const toast = ref<{
  show: boolean;
  message: string;
  submessage?: string;
  actionText?: string;
}>({
  show: false,
  message: ''
});

let toastTimer: any = null;

export function showToast(message: string, submessage?: string, actionText?: string) {
  if (toastTimer) clearTimeout(toastTimer);
  toast.value = {
    show: true,
    message,
    submessage,
    actionText
  };
  toastTimer = setTimeout(() => {
    toast.value.show = false;
  }, 3500);
}

// Computed Properties
export const isAdmin = computed(() => currentUser.value?.rol === 'admin');

export const cartCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.cantidad, 0);
});

export const cartSubtotal = computed(() => {
  return cart.value.reduce((total, item) => total + item.perfume.precio * item.cantidad, 0);
});

export const wishlistCount = computed(() => {
  return wishlist.value.length;
});

// App Initialization (Local first + Async Supabase sync)
export async function initStore() {
  // 1. Inmediato: Cargar datos locales para respuesta instantánea de UI
  perfumes.value = getStoredPerfumes();
  currentUser.value = getStoredCurrentUser();
  users.value = getStoredUsers();
  cart.value = getStoredCart();
  wishlist.value = getStoredWishlist();
  orders.value = getStoredOrders();

  // 2. Verificar estado de Supabase
  try {
    const status = await checkSupabaseStatus();
    supabaseStatus.value = status;
  } catch (err: any) {
    console.warn('Verificación de Supabase:', err);
  }

  // 3. Cargar información desde Supabase (Perfumes, Pedidos, Usuarios)
  isSupabaseSyncing.value = true;
  try {
    const [perfumesRes, ordersRes, usersRes] = await Promise.allSettled([
      fetchPerfumesFromSupabase(),
      fetchOrdersFromSupabase(),
      fetchUsersFromSupabase()
    ]);

    if (perfumesRes.status === 'fulfilled' && perfumesRes.value.fromSupabase) {
      perfumes.value = perfumesRes.value.data;
      saveStoredPerfumes(perfumesRes.value.data);
    }
    if (ordersRes.status === 'fulfilled' && ordersRes.value.fromSupabase && ordersRes.value.data.length > 0) {
      orders.value = ordersRes.value.data;
      saveStoredOrders(ordersRes.value.data);
    }
    if (usersRes.status === 'fulfilled' && usersRes.value.fromSupabase && usersRes.value.data.length > 0) {
      users.value = usersRes.value.data;
      saveStoredUsers(usersRes.value.data);
    }
  } catch (e) {
    console.warn('Error en sincronización inicial con Supabase:', e);
  } finally {
    isSupabaseSyncing.value = false;
  }

  // 4. Suscribirse a cambios de sesión de Supabase Auth
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user && !currentUser.value) {
      syncUserFromSupabaseAuth(sessionData.session.user);
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncUserFromSupabaseAuth(session.user);
      }
    });
  } catch (authErr) {
    console.warn('Error al verificar sesión de Supabase Auth:', authErr);
  }

  // 5. Escuchar cambios en tiempo real en Supabase (Perfumes, Pedidos, Usuarios)
  try {
    subscribeToSupabaseChanges({
      onPerfumeChange: async () => {
        const res = await fetchPerfumesFromSupabase();
        if (res.fromSupabase) {
          perfumes.value = res.data;
          saveStoredPerfumes(res.data);
        }
      },
      onOrderChange: async () => {
        const res = await fetchOrdersFromSupabase();
        if (res.fromSupabase) {
          orders.value = res.data;
          saveStoredOrders(res.data);
        }
      },
      onUserChange: async () => {
        const res = await fetchUsersFromSupabase();
        if (res.fromSupabase) {
          users.value = res.data;
          saveStoredUsers(res.data);
        }
      }
    });
  } catch (syncErr) {
    console.warn('Error en suscripción realtime:', syncErr);
  }
}

/**
 * Sincroniza un usuario autenticado por Supabase (ej. Google OAuth) al store
 */
export function syncUserFromSupabaseAuth(sbUser: any) {
  const email = sbUser.email || '';
  const fullName =
    sbUser.user_metadata?.full_name ||
    sbUser.user_metadata?.name ||
    email.split('@')[0] ||
    'Usuario Google';
  
  const role: 'admin' | 'cliente' =
    email.toLowerCase() === 'admin@aromancia.com' ? 'admin' : 'cliente';

  const user: User = {
    id: sbUser.id || `google-${Date.now()}`,
    nombre: fullName,
    email: email,
    rol: role,
    telefono: sbUser.user_metadata?.phone || '+54 11 5566-7788',
    direccion: sbUser.user_metadata?.address || 'Dirección vinculada a Google',
    ciudad: sbUser.user_metadata?.city || 'CABA',
    creadoEn: new Date().toISOString().split('T')[0]
  };

  currentUser.value = user;
  saveStoredCurrentUser(user);

  // Persistir en tabla users de Supabase y localmente
  persistUserToSupabase(user);
  const currentUsers = getStoredUsers();
  if (!currentUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    const updated = [...currentUsers, user];
    saveStoredUsers(updated);
    users.value = updated;
  }

  closeAuthModal();
  showToast(
    'Sesión Sincronizada con Supabase',
    `¡Hola, ${fullName}! Tu cuenta fue vinculada correctamente.`
  );
}

// Auth Actions
export function openAuthModal(mode: 'login' | 'register' | 'admin' = 'login') {
  authModalMode.value = mode;
  authModalOpen.value = true;
}

export function closeAuthModal() {
  authModalOpen.value = false;
}

export function loginUser(user: User) {
  currentUser.value = user;
  saveStoredCurrentUser(user);
  users.value = getStoredUsers();
  closeAuthModal();

  // Async sync to Supabase users table
  persistUserToSupabase(user);

  if (user.rol === 'admin') {
    showToast(
      'Sesión de Administrador Iniciada',
      'Bienvenido al Atelier. Se habilitaron las secciones + Nueva Fragancia y Panel de Administrador.'
    );
  } else {
    showToast(
      `¡Bienvenida/o, ${user.nombre.split(' ')[0]}!`,
      'Has iniciado sesión como comprador en Aromancia.'
    );
  }
}

export function registerUser(newUser: User) {
  const currentUsers = getStoredUsers();
  const exists = currentUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
  if (exists) {
    throw new Error('Ya existe una cuenta registrada con este correo electrónico.');
  }

  const updatedUsers = [...currentUsers, newUser];
  saveStoredUsers(updatedUsers);
  users.value = updatedUsers;

  // Auto-login
  currentUser.value = newUser;
  saveStoredCurrentUser(newUser);
  closeAuthModal();

  // Sync to Supabase
  persistUserToSupabase(newUser);

  showToast(
    `¡Bienvenida/o a Aromancia!`,
    `Tu cuenta como cliente ha sido creada exitosamente. Disfrutá de tu experiencia.`
  );
}

export function logoutUser() {
  saveStoredCurrentUser(null);
  currentUser.value = null;
  signOutSupabase();
  showToast('Sesión Cerrada', 'Has cerrado tu sesión.');
}

// Cart Actions
export function addToCart(perfume: Perfume, quantity = 1, size = '100ml') {
  const existingIndex = cart.value.findIndex(
    item => item.perfume.id === perfume.id && item.tamanoSeleccionado === size
  );

  let newCart: CartItem[];
  if (existingIndex > -1) {
    newCart = [...cart.value];
    newCart[existingIndex].cantidad += quantity;
  } else {
    newCart = [...cart.value, { perfume, cantidad: quantity, tamanoSeleccionado: size }];
  }

  cart.value = newCart;
  saveStoredCart(newCart);
  showToast(
    'Fragancia agregada',
    `${perfume.nombre} (${size}) fue añadida a tu bolsa de compra.`,
    'VER BOLSA'
  );
}

export function updateCartQuantity(perfumeId: string, delta: number) {
  const newCart = cart.value
    .map(item => {
      if (item.perfume.id === perfumeId) {
        const newQty = item.cantidad + delta;
        return newQty > 0 ? { ...item, cantidad: newQty } : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);

  cart.value = newCart;
  saveStoredCart(newCart);
}

export function removeFromCart(perfumeId: string) {
  const newCart = cart.value.filter(item => item.perfume.id !== perfumeId);
  cart.value = newCart;
  saveStoredCart(newCart);
}

export function clearCart() {
  cart.value = [];
  saveStoredCart([]);
}

export function checkout(clientInfo: {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}, metodoPago: string) {
  if (cart.value.length === 0) return null;

  const subtotal = cartSubtotal.value;
  const envio = subtotal > 50000 ? 0 : 3500;
  const total = subtotal + envio;

  const orderItems = cart.value.map(c => ({
    perfumeId: c.perfume.id,
    nombre: c.perfume.nombre,
    precio: c.perfume.precio,
    cantidad: c.cantidad,
    volumen: c.tamanoSeleccionado,
    imagen: c.perfume.imagen
  }));

  const orderData: Omit<Order, 'id' | 'fecha'> = {
    cliente: {
      id: currentUser.value?.id,
      nombre: clientInfo.nombre,
      email: clientInfo.email,
      telefono: clientInfo.telefono,
      direccion: clientInfo.direccion,
      ciudad: clientInfo.ciudad
    },
    items: orderItems,
    subtotal,
    envio,
    total,
    estado: 'En preparación en Atelier',
    metodoPago
  };

  const newOrder = addStoredOrder(orderData);
  orders.value = getStoredOrders();

  // Deduct stock
  orderItems.forEach(item => {
    const p = perfumes.value.find(prod => prod.id === item.perfumeId);
    if (p) {
      const updatedStock = Math.max(0, p.stock - item.cantidad);
      updatePerfumeStock(p.id, updatedStock);
    }
  });

  // Async sync to Supabase orders table
  persistOrderToSupabase(newOrder);

  // Sync / create buyer in users table in Supabase
  let buyer = users.value.find(u => u.email.toLowerCase() === clientInfo.email.toLowerCase());
  if (!buyer) {
    buyer = {
      id: currentUser.value?.id || `user-${Date.now()}`,
      nombre: clientInfo.nombre,
      email: clientInfo.email.toLowerCase(),
      rol: 'cliente',
      telefono: clientInfo.telefono,
      direccion: clientInfo.direccion,
      ciudad: clientInfo.ciudad,
      creadoEn: new Date().toISOString().split('T')[0]
    };
    const updatedUsers = [...users.value, buyer];
    users.value = updatedUsers;
    saveStoredUsers(updatedUsers);
  }
  persistUserToSupabase(buyer);

  clearCart();
  cartDrawerOpen.value = false;
  showToast(
    '¡Compra confirmada!',
    `Pedido #${newOrder.id} creado con éxito. Pronto lo recibirás en ${clientInfo.ciudad}.`
  );

  return newOrder;
}

// Wishlist Actions
export function toggleWishlist(perfumeId: string) {
  const updated = toggleStoredWishlist(perfumeId);
  wishlist.value = updated;
}

// Perfume CRUD Actions (Admin Only)
export function createPerfumeRecord(perfumeData: Omit<Perfume, 'id' | 'creadoEn'>) {
  const created = addStoredPerfume(perfumeData);
  perfumes.value = getStoredPerfumes();
  // Async persist to Supabase
  persistPerfumeToSupabase(created);
  showToast('Fragancia creada', `${created.nombre} fue registrada exitosamente en el catálogo.`);
  return created;
}

export function updatePerfumeRecord(perfume: Perfume) {
  const success = updateStoredPerfume(perfume);
  if (success) {
    perfumes.value = getStoredPerfumes();
    // Async persist to Supabase
    persistPerfumeToSupabase(perfume);
    showToast('Fragancia actualizada', `Los datos de ${perfume.nombre} fueron guardados.`);
  }
  return success;
}

export function deletePerfumeRecord(perfumeId: string) {
  const found = perfumes.value.find(p => p.id === perfumeId);
  const success = deleteStoredPerfume(perfumeId);
  if (success) {
    perfumes.value = getStoredPerfumes();
    // Async delete from Supabase
    deletePerfumeFromSupabase(perfumeId);
    showToast('Fragancia eliminada', `${found?.nombre || 'El perfume'} fue retirado del catálogo.`);
  }
  return success;
}

export function updatePerfumeStock(perfumeId: string, newStock: number) {
  const p = perfumes.value.find(item => item.id === perfumeId);
  if (p) {
    const updated = { ...p, stock: newStock };
    updateStoredPerfume(updated);
    perfumes.value = getStoredPerfumes();
    updatePerfumeStockInSupabase(perfumeId, newStock);
    persistPerfumeToSupabase(updated);
  }
}

export function changeOrderStatus(orderId: string, newStatus: Order['estado']) {
  updateStoredOrderStatus(orderId, newStatus);
  orders.value = getStoredOrders();
  // Async update in Supabase
  updateOrderStatusInSupabase(orderId, newStatus);
  showToast('Estado de pedido actualizado', `El pedido #${orderId} pasó a "${newStatus}".`);
}
