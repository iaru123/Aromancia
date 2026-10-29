import { supabase } from '../utils/supabase';
import { Perfume, User, Order } from '../types';
import { INITIAL_PERFUMES } from '../data/initialPerfumes';
import { INITIAL_USERS } from './storage';

export interface SupabaseStatus {
  connected: boolean;
  message: string;
  hasTables?: boolean;
}

/**
 * Checks connection to the configured Supabase instance
 */
export async function checkSupabaseStatus(): Promise<SupabaseStatus> {
  try {
    const { error } = await supabase.from('perfumes').select('id').limit(1);
    if (!error) {
      return { connected: true, message: 'Conectado exitosamente con Supabase', hasTables: true };
    }
    // Code 42P01 means table does not exist yet (normal before running SQL script)
    if (error.code === '42P01') {
      return {
        connected: true,
        message: 'Conectado a Supabase (tablas pendientes de inicializar con el script SQL)',
        hasTables: false
      };
    }
    return {
      connected: true,
      message: `Supabase alcanzable (${error.message || 'Verificando tablas'})`,
      hasTables: false
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err.message || 'No se pudo conectar a Supabase'
    };
  }
}

/**
 * Normalizes a database row to a Perfume object
 */
function normalizePerfume(row: any): Perfume {
  const topNotes = row.notas_salida || row.notas?.top || [];
  const heartNotes = row.notas_corazon || row.notas?.heart || [];
  const baseNotes = row.notas_fondo || row.notas?.base || [];

  return {
    id: row.id,
    nombre: row.nombre || '',
    categoria: row.categoria || 'unisex',
    familia: row.familia || 'Floral',
    concentracion: row.concentracion || 'Eau de Parfum',
    precio: Number(row.precio) || 0,
    precioOriginal: row.precio_original ? Number(row.precio_original) : (row.precioOriginal ? Number(row.precioOriginal) : undefined),
    calificacion: Number(row.calificacion) || 5,
    totalResenas: Number(row.total_resenas ?? row.totalResenas ?? 0),
    volumen: row.volumen || '100ml',
    descripcion: row.descripcion || '',
    descripcionLarga: row.descripcion_larga || row.descripcionLarga || '',
    imagen: row.imagen || '',
    tag: row.tag || '',
    stock: Number(row.stock) || 0,
    notas: {
      top: Array.isArray(topNotes) ? topNotes : [String(topNotes)],
      heart: Array.isArray(heartNotes) ? heartNotes : [String(heartNotes)],
      base: Array.isArray(baseNotes) ? baseNotes : [String(baseNotes)]
    },
    acordesPrincipales: row.acordes_principales || row.acordesPrincipales || [],
    creadoEn: row.creado_en || row.creadoEn || new Date().toISOString().split('T')[0]
  };
}

/**
 * Normalizes a database row to an Order object
 */
function normalizeOrder(row: any): Order {
  let items: any[] = [];
  if (Array.isArray(row.order_items) && row.order_items.length > 0) {
    items = row.order_items.map((oi: any) => ({
      perfumeId: oi.perfume_id,
      nombre: oi.nombre || 'Fragancia Aromancia',
      precio: Number(oi.precio) || 0,
      cantidad: Number(oi.cantidad) || 1,
      volumen: oi.volumen || '100ml',
      imagen: oi.imagen || ''
    }));
  } else if (row.items) {
    try {
      items = typeof row.items === 'string' ? JSON.parse(row.items) : row.items;
    } catch {
      items = [];
    }
  }

  return {
    id: row.id,
    fecha: row.fecha || new Date().toISOString().split('T')[0],
    cliente: {
      id: row.cliente_id || row.cliente?.id,
      nombre: row.cliente_nombre || row.cliente?.nombre || '',
      email: row.cliente_email || row.cliente?.email || '',
      telefono: row.cliente_telefono || row.cliente?.telefono || '',
      direccion: row.cliente_direccion || row.cliente?.direccion || '',
      ciudad: row.cliente_ciudad || row.cliente?.ciudad || ''
    },
    items,
    subtotal: Number(row.subtotal) || 0,
    envio: Number(row.envio) || 0,
    total: Number(row.total) || 0,
    estado: row.estado || 'En preparación en Atelier',
    metodoPago: row.metodo_pago || row.metodoPago || 'Tarjeta de Crédito'
  };
}

/**
 * Fetches perfumes from Supabase; falls back to local data if table doesn't exist
 */
export async function fetchPerfumesFromSupabase(): Promise<{ data: Perfume[]; fromSupabase: boolean }> {
  try {
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .order('nombre', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error && error.code !== '42P01') {
        console.warn('Nota de Supabase al consultar perfumes:', error.message);
      }
      return { data: INITIAL_PERFUMES, fromSupabase: false };
    }

    const mapped = data.map(normalizePerfume);
    return { data: mapped, fromSupabase: true };
  } catch (err) {
    console.warn('Fallo de red con Supabase al cargar perfumes:', err);
    return { data: INITIAL_PERFUMES, fromSupabase: false };
  }
}

/**
 * Persists a new or updated perfume into Supabase
 */
export async function persistPerfumeToSupabase(perfume: Perfume): Promise<boolean> {
  try {
    const dbPayload = {
      id: perfume.id,
      nombre: perfume.nombre,
      categoria: perfume.categoria,
      familia: perfume.familia,
      concentracion: perfume.concentracion,
      precio: perfume.precio,
      precio_original: perfume.precioOriginal || null,
      calificacion: perfume.calificacion || 5,
      total_resenas: perfume.totalResenas || 0,
      volumen: perfume.volumen || '100ml',
      descripcion: perfume.descripcion,
      descripcion_larga: perfume.descripcionLarga || null,
      imagen: perfume.imagen,
      tag: perfume.tag || null,
      stock: perfume.stock || 0,
      notas_salida: perfume.notas?.top || [],
      notas_corazon: perfume.notas?.heart || [],
      notas_fondo: perfume.notas?.base || [],
      acordes_principales: perfume.acordesPrincipales || [],
      creado_en: perfume.creadoEn || new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase
      .from('perfumes')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      console.warn('Error al guardar perfume en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Fallo de red al persistir perfume en Supabase:', err);
    return false;
  }
}

/**
 * Deletes a perfume from Supabase
 */
export async function deletePerfumeFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('perfumes').delete().eq('id', id);
    if (error) {
      console.warn('Error al eliminar perfume en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Fallo de red al eliminar perfume en Supabase:', err);
    return false;
  }
}

/**
 * Fetches orders from Supabase with joined order items
 */
export async function fetchOrdersFromSupabase(): Promise<{ data: Order[]; fromSupabase: boolean }> {
  try {
    // Attempt join with order_items
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('fecha', { ascending: false });

    if (error) {
      // Fallback: standalone orders query if foreign key/relation is absent
      const fallback = await supabase
        .from('orders')
        .select('*')
        .order('fecha', { ascending: false });

      if (fallback.data && fallback.data.length > 0) {
        return { data: fallback.data.map(normalizeOrder), fromSupabase: true };
      }
      return { data: [], fromSupabase: false };
    }

    if (!data || data.length === 0) {
      return { data: [], fromSupabase: false };
    }

    const mapped = data.map(normalizeOrder);
    return { data: mapped, fromSupabase: true };
  } catch (err) {
    console.warn('Error al obtener pedidos de Supabase:', err);
    return { data: [], fromSupabase: false };
  }
}

/**
 * Saves a new order to Supabase (orders header + order_items items)
 */
export async function persistOrderToSupabase(order: Order): Promise<boolean> {
  try {
    const basePayload: any = {
      id: order.id,
      fecha: order.fecha,
      cliente_id: order.cliente?.id || null,
      cliente_nombre: order.cliente?.nombre || '',
      cliente_email: order.cliente?.email || '',
      cliente_telefono: order.cliente?.telefono || null,
      cliente_direccion: order.cliente?.direccion || '',
      cliente_ciudad: order.cliente?.ciudad || '',
      subtotal: order.subtotal,
      envio: order.envio,
      total: order.total,
      estado: order.estado,
      metodo_pago: order.metodoPago
    };

    // 1. Try upserting base order
    let { error } = await supabase
      .from('orders')
      .upsert(basePayload, { onConflict: 'id' });

    // If foreign key constraint failed because user isn't in users table yet, retry with cliente_id: null
    if (error && (error.code === '23503' || error.message?.toLowerCase().includes('foreign key') || error.message?.toLowerCase().includes('cliente_id'))) {
      console.warn('cliente_id no encontrado en tabla users de Supabase, reintentando pedido sin FK...');
      const fallbackFk = { ...basePayload, cliente_id: null };
      const retryFk = await supabase.from('orders').upsert(fallbackFk, { onConflict: 'id' });
      error = retryFk.error;
    }

    // If schema includes items column, try with items
    if (error && error.message?.toLowerCase().includes('items')) {
      const withItems = { ...basePayload, items: order.items, cliente_id: null };
      const retry = await supabase.from('orders').upsert(withItems, { onConflict: 'id' });
      error = retry.error;
    }

    if (error) {
      console.warn('Nota al guardar pedido en orders de Supabase:', error.message);
      // Fallback attempt with items column
      try {
        await supabase.from('orders').upsert({ ...basePayload, items: order.items, cliente_id: null }, { onConflict: 'id' });
      } catch {}
    }

    // 2. Insert items into order_items table
    if (order.items && order.items.length > 0) {
      const itemsPayload = order.items.map(item => ({
        order_id: order.id,
        perfume_id: item.perfumeId || null,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        volumen: item.volumen || '100ml',
        imagen: item.imagen || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsPayload);

      if (itemsError) {
        console.warn('Nota al insertar order_items en Supabase:', itemsError.message);
      }
    }

    return true;
  } catch (err) {
    console.warn('Fallo de red al persistir pedido en Supabase:', err);
    return false;
  }
}

/**
 * Updates order status in Supabase
 */
export async function updateOrderStatusInSupabase(orderId: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ estado: status })
      .eq('id', orderId);

    if (error) {
      console.warn('Error al actualizar estado en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Fallo de red al actualizar estado en Supabase:', err);
    return false;
  }
}

/**
 * Updates perfume stock directly in Supabase
 */
export async function updatePerfumeStockInSupabase(perfumeId: string, newStock: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('perfumes')
      .update({ stock: newStock })
      .eq('id', perfumeId);

    if (error) {
      console.warn('Error al actualizar stock en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Fallo de red al actualizar stock en Supabase:', err);
    return false;
  }
}

/**
 * Fetches registered users from Supabase
 */
export async function fetchUsersFromSupabase(): Promise<{ data: User[]; fromSupabase: boolean }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('nombre', { ascending: true });

    if (error || !data || data.length === 0) {
      return { data: INITIAL_USERS, fromSupabase: false };
    }

    const mapped: User[] = data.map((row: any) => ({
      id: row.id,
      nombre: row.nombre || '',
      email: row.email || '',
      password: row.password || '',
      rol: row.rol || 'cliente',
      telefono: row.telefono || undefined,
      direccion: row.direccion || undefined,
      ciudad: row.ciudad || undefined,
      creadoEn: row.creado_en || row.creadoEn || new Date().toISOString().split('T')[0]
    }));

    return { data: mapped, fromSupabase: true };
  } catch (err) {
    console.warn('Error al obtener usuarios de Supabase:', err);
    return { data: INITIAL_USERS, fromSupabase: false };
  }
}

/**
 * Persists a user to Supabase users table
 */
export async function persistUserToSupabase(user: User): Promise<boolean> {
  try {
    const dbPayload = {
      id: user.id,
      nombre: user.nombre,
      email: user.email.toLowerCase(),
      password: user.password || null,
      rol: user.rol || 'cliente',
      telefono: user.telefono || null,
      direccion: user.direccion || null,
      ciudad: user.ciudad || null,
      creado_en: user.creadoEn || new Date().toISOString().split('T')[0]
    };

    // 1. Try upsert with email conflict
    let { error } = await supabase
      .from('users')
      .upsert(dbPayload, { onConflict: 'email' });

    // 2. Fallback: try upsert with id conflict if email constraint is different
    if (error && error.code !== '42501') {
      const retryId = await supabase
        .from('users')
        .upsert(dbPayload, { onConflict: 'id' });
      error = retryId.error;
    }

    if (error) {
      if (error.code === '42501') {
        console.warn('RLS activo en Supabase: para guardar en la nube ejecuta el script SQL de permisos (DISABLE RLS). El usuario fue guardado localmente de forma segura.');
      } else {
        console.warn('Error al registrar usuario en Supabase:', error.message);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Fallo de red al guardar usuario en Supabase:', err);
    return false;
  }
}

/**
 * Signs in with Google via Supabase OAuth
 */
export async function signInWithGoogleOAuth(): Promise<{
  success: boolean;
  url?: string;
  error?: string;
  providerNotConfigured?: boolean;
}> {
  try {
    // Current URL or origin for callback redirect
    const redirectTo = window.location.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      const isProviderUnconfigured =
        error.message?.toLowerCase().includes('provider is not enabled') ||
        error.message?.toLowerCase().includes('unsupported provider') ||
        error.message?.toLowerCase().includes('not enabled');

      return {
        success: false,
        error: error.message,
        providerNotConfigured: isProviderUnconfigured
      };
    }

    if (data?.url) {
      // In web app, we can navigate or popup
      return { success: true, url: data.url };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Error inesperado al iniciar con Google'
    };
  }
}

/**
 * Signs in with Email and Password using Supabase Auth
 */
export async function signInWithSupabaseAuth(email: string, password: string): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al autenticar' };
  }
}

/**
 * Signs up with Email and Password using Supabase Auth
 */
export async function signUpWithSupabaseAuth(
  email: string,
  password: string,
  nombre: string,
  extra: { telefono?: string; direccion?: string; ciudad?: string } = {}
): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nombre,
          name: nombre,
          phone: extra.telefono,
          address: extra.direccion,
          city: extra.ciudad
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al registrar' };
  }
}

/**
 * Signs out from Supabase Auth
 */
export async function signOutSupabase(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Error al cerrar sesión en Supabase:', err);
  }
}

/**
 * Subscribes to Realtime changes on perfumes, orders, and users in Supabase
 */
export function subscribeToSupabaseChanges(callbacks: {
  onPerfumeChange?: () => void;
  onOrderChange?: () => void;
  onUserChange?: () => void;
}) {
  try {
    const channel = supabase.channel('aromancia-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'perfumes' }, () => {
        callbacks.onPerfumeChange?.();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        callbacks.onOrderChange?.();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        callbacks.onUserChange?.();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Error configurando realtime de Supabase:', err);
    return () => {};
  }
}
