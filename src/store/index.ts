import { ref, computed } from 'vue';
import { Perfume, CartItem, User, Order } from '../types';
import {
  getStoredPerfumes,
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
  addStoredOrder,
  updateStoredOrderStatus
} from '../services/storage';

// Reactive State
export const perfumes = ref<Perfume[]>([]);
export const currentUser = ref<User | null>(null);
export const users = ref<User[]>([]);
export const cart = ref<CartItem[]>([]);
export const wishlist = ref<string[]>([]);
export const orders = ref<Order[]>([]);

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

// App Initialization (Created/Mounted Lifecycle sync)
export function initStore() {
  perfumes.value = getStoredPerfumes();
  currentUser.value = getStoredCurrentUser();
  users.value = getStoredUsers();
  cart.value = getStoredCart();
  wishlist.value = getStoredWishlist();
  orders.value = getStoredOrders();
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

  showToast(
    `¡Bienvenida/o a Aromancia!`,
    `Tu cuenta como cliente ha sido creada exitosamente. Disfrutá de tu experiencia.`
  );
}

export function logoutUser() {
  saveStoredCurrentUser(null);
  currentUser.value = null;
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
  showToast('Fragancia creada', `${created.nombre} fue registrada exitosamente en el catálogo.`);
  return created;
}

export function updatePerfumeRecord(perfume: Perfume) {
  const success = updateStoredPerfume(perfume);
  if (success) {
    perfumes.value = getStoredPerfumes();
    showToast('Fragancia actualizada', `Los datos de ${perfume.nombre} fueron guardados.`);
  }
  return success;
}

export function deletePerfumeRecord(perfumeId: string) {
  const found = perfumes.value.find(p => p.id === perfumeId);
  const success = deleteStoredPerfume(perfumeId);
  if (success) {
    perfumes.value = getStoredPerfumes();
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
  }
}

export function changeOrderStatus(orderId: string, newStatus: Order['estado']) {
  updateStoredOrderStatus(orderId, newStatus);
  orders.value = getStoredOrders();
  showToast('Estado de pedido actualizado', `El pedido #${orderId} pasó a "${newStatus}".`);
}
