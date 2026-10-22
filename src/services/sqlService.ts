import { Perfume, User, Order } from '../types';
import { getStoredPerfumes, getStoredUsers, getStoredOrders } from './storage';

/**
 * Escapes single quotes for SQL string literals
 */
function escapeSql(str: string | undefined | null): string {
  if (str === undefined || str === null) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

/**
 * Converts an array to a PostgreSQL array literal (e.g. ARRAY['a', 'b'])
 */
function sqlArray(arr: string[] | undefined | null): string {
  if (!arr || arr.length === 0) return 'ARRAY[]::text[]';
  const escapedItems = arr.map(item => `'${item.replace(/'/g, "''")}'`).join(', ');
  return `ARRAY[${escapedItems}]::text[]`;
}

/**
 * Generates a complete, production-grade PostgreSQL / Supabase SQL script
 * including DDL (tables, constraints, RLS) and DML (all current users, perfumes, orders)
 */
export function generateSupabaseSQL(
  customPerfumes?: Perfume[],
  customUsers?: User[],
  customOrders?: Order[]
): string {
  const perfumesList = customPerfumes || getStoredPerfumes();
  const usersList = customUsers || getStoredUsers();
  const ordersList = customOrders || getStoredOrders();

  let sql = `-- ====================================================================
-- AROMANCIA HAUTE PARFUMERIE - SCRIPT SQL COMPLETO PARA SUPABASE / POSTGRESQL
-- Generado automáticamente desde el Atelier Aromancia
-- Fecha de exportación: ${new Date().toISOString()}
-- ====================================================================

-- 1. HABILITAR EXTENSIONES REQUERIDAS EN SUPABASE
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. TABLA: USERS (Clientes y Administradores)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  rol VARCHAR(50) NOT NULL DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
  telefono VARCHAR(50),
  direccion TEXT,
  ciudad VARCHAR(100),
  creado_en DATE DEFAULT CURRENT_DATE
);

-- ====================================================================
-- 3. TABLA: PERFUMES (Catálogo de Fragancias de Alta Perfumería)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.perfumes (
  id TEXT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('femenino', 'masculino', 'unisex', 'sets')),
  familia VARCHAR(100) NOT NULL,
  concentracion VARCHAR(100) NOT NULL DEFAULT 'Eau de Parfum',
  precio NUMERIC(12, 2) NOT NULL CHECK (precio > 0),
  precio_original NUMERIC(12, 2),
  calificacion NUMERIC(3, 2) DEFAULT 5.0,
  total_resenas INT DEFAULT 0,
  volumen VARCHAR(50) DEFAULT '100ml',
  descripcion TEXT NOT NULL,
  descripcion_larga TEXT,
  imagen TEXT NOT NULL,
  tag VARCHAR(100),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  notas_salida TEXT[] DEFAULT ARRAY[]::text[],
  notas_corazon TEXT[] DEFAULT ARRAY[]::text[],
  notas_fondo TEXT[] DEFAULT ARRAY[]::text[],
  acordes_principales TEXT[] DEFAULT ARRAY[]::text[],
  creado_en DATE DEFAULT CURRENT_DATE
);

-- ====================================================================
-- 4. TABLA: ORDERS (Compras y Pedidos)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  cliente_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  cliente_nombre VARCHAR(255) NOT NULL,
  cliente_email VARCHAR(255) NOT NULL,
  cliente_telefono VARCHAR(50),
  cliente_direccion TEXT NOT NULL,
  cliente_ciudad VARCHAR(100) NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL,
  envio NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  estado VARCHAR(100) NOT NULL DEFAULT 'En preparación en Atelier'
    CHECK (estado IN ('Pendiente', 'En preparación en Atelier', 'En camino', 'Entregado')),
  metodo_pago VARCHAR(100) NOT NULL DEFAULT 'Mercado Pago'
);

-- ====================================================================
-- 5. TABLA: ORDER_ITEMS (Detalles de los productos en cada compra)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  perfume_id TEXT REFERENCES public.perfumes(id) ON DELETE SET NULL,
  nombre VARCHAR(255) NOT NULL,
  precio NUMERIC(12, 2) NOT NULL,
  cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  volumen VARCHAR(50) DEFAULT '100ml',
  imagen TEXT
);

-- ====================================================================
-- 6. POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS) PARA SUPABASE
-- ====================================================================
ALTER TABLE public.perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Perfumes: Lectura pública para cualquier visitante o comprador
DROP POLICY IF EXISTS "Lectura pública de fragancias" ON public.perfumes;
CREATE POLICY "Lectura pública de fragancias" ON public.perfumes FOR SELECT USING (true);

-- Permisos de lectura de pedidos para administradores y dueños
DROP POLICY IF EXISTS "Lectura de pedidos autenticados" ON public.orders;
CREATE POLICY "Lectura de pedidos autenticados" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura de items de pedidos" ON public.order_items;
CREATE POLICY "Lectura de items de pedidos" ON public.order_items FOR SELECT USING (true);

-- ====================================================================
-- 7. INSERCIÓN DE DATOS: USERS (ADMINISTRADOR Y CLIENTES)
-- ====================================================================
`;

  // Insert Users
  usersList.forEach(u => {
    sql += `INSERT INTO public.users (id, nombre, email, password, rol, telefono, direccion, ciudad, creado_en)
VALUES (${escapeSql(u.id)}, ${escapeSql(u.nombre)}, ${escapeSql(u.email)}, ${escapeSql(u.password || '123')}, ${escapeSql(u.rol)}, ${escapeSql(u.telefono)}, ${escapeSql(u.direccion)}, ${escapeSql(u.ciudad)}, ${escapeSql(u.creadoEn)})
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  email = EXCLUDED.email,
  rol = EXCLUDED.rol,
  telefono = EXCLUDED.telefono,
  direccion = EXCLUDED.direccion,
  ciudad = EXCLUDED.ciudad;\n\n`;
  });

  sql += `-- ====================================================================
-- 8. INSERCIÓN DE DATOS: PERFUMES (CATÁLOGO DE PRODUCTOS)
-- ====================================================================\n`;

  // Insert Perfumes
  perfumesList.forEach(p => {
    sql += `INSERT INTO public.perfumes (
  id, nombre, categoria, familia, concentracion, precio, precio_original,
  calificacion, total_resenas, volumen, descripcion, descripcion_larga,
  imagen, tag, stock, notas_salida, notas_corazon, notas_fondo,
  acordes_principales, creado_en
) VALUES (
  ${escapeSql(p.id)},
  ${escapeSql(p.nombre)},
  ${escapeSql(p.categoria)},
  ${escapeSql(p.familia)},
  ${escapeSql(p.concentracion)},
  ${p.precio},
  ${p.precioOriginal ? p.precioOriginal : 'NULL'},
  ${p.calificacion || 5.0},
  ${p.totalResenas || 0},
  ${escapeSql(p.volumen || '100ml')},
  ${escapeSql(p.descripcion)},
  ${escapeSql(p.descripcionLarga || p.descripcion)},
  ${escapeSql(p.imagen)},
  ${escapeSql(p.tag)},
  ${p.stock ?? 10},
  ${sqlArray(p.notas?.top)},
  ${sqlArray(p.notas?.heart)},
  ${sqlArray(p.notas?.base)},
  ${sqlArray(p.acordesPrincipales)},
  ${escapeSql(p.creadoEn)}
) ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  categoria = EXCLUDED.categoria,
  familia = EXCLUDED.familia,
  precio = EXCLUDED.precio,
  stock = EXCLUDED.stock,
  imagen = EXCLUDED.imagen,
  descripcion = EXCLUDED.descripcion;\n\n`;
  });

  sql += `-- ====================================================================
-- 9. INSERCIÓN DE DATOS: ORDERS Y ORDER_ITEMS (COMPRAS REGISTRADAS)
-- ====================================================================\n`;

  // Insert Orders & Order Items
  ordersList.forEach(o => {
    sql += `INSERT INTO public.orders (
  id, fecha, cliente_id, cliente_nombre, cliente_email, cliente_telefono,
  cliente_direccion, cliente_ciudad, subtotal, envio, total, estado, metodo_pago
) VALUES (
  ${escapeSql(o.id)},
  ${escapeSql(o.fecha)},
  ${escapeSql(o.cliente?.id)},
  ${escapeSql(o.cliente?.nombre)},
  ${escapeSql(o.cliente?.email)},
  ${escapeSql(o.cliente?.telefono)},
  ${escapeSql(o.cliente?.direccion)},
  ${escapeSql(o.cliente?.ciudad)},
  ${o.subtotal},
  ${o.envio},
  ${o.total},
  ${escapeSql(o.estado)},
  ${escapeSql(o.metodoPago)}
) ON CONFLICT (id) DO UPDATE SET
  estado = EXCLUDED.estado,
  total = EXCLUDED.total;\n\n`;

    // Order Items
    if (o.items && o.items.length > 0) {
      o.items.forEach(item => {
        sql += `INSERT INTO public.order_items (order_id, perfume_id, nombre, precio, cantidad, volumen, imagen)
VALUES (
  ${escapeSql(o.id)},
  ${escapeSql(item.perfumeId)},
  ${escapeSql(item.nombre)},
  ${item.precio},
  ${item.cantidad},
  ${escapeSql(item.volumen)},
  ${escapeSql(item.imagen)}
);\n`;
      });
      sql += '\n';
    }
  });

  sql += `-- ====================================================================
-- FIN DEL SCRIPT SQL PARA SUPABASE
-- ¡Listo para ejecutar en el SQL Editor de Supabase!
-- ====================================================================\n`;

  return sql;
}

/**
 * Triggers a browser download of the generated SQL file
 */
export function downloadSupabaseSQLFile(filename = 'supabase_aromancia.sql') {
  const sqlContent = generateSupabaseSQL();
  const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
