-- ====================================================================
-- AROMANCIA HAUTE PARFUMERIE - SCRIPT SQL COMPLETO PARA SUPABASE / POSTGRESQL
-- Asignatura: Programación II
-- Tablas: users, perfumes, orders, order_items
-- Incluye DDL, restricciones CHECK, índices, RLS y datos iniciales
-- ====================================================================

-- 1. HABILITAR EXTENSIONES REQUERIDAS
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
-- 6. POLÍTICAS ROW LEVEL SECURITY (RLS) PARA SUPABASE
-- ====================================================================
ALTER TABLE public.perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura y escritura completa para perfumes (Catálogo)
DROP POLICY IF EXISTS "Lectura pública de fragancias" ON public.perfumes;
DROP POLICY IF EXISTS "Permitir todo perfumes" ON public.perfumes;
CREATE POLICY "Permitir todo perfumes" ON public.perfumes FOR ALL USING (true) WITH CHECK (true);

-- Políticas de lectura y escritura completa para usuarios (Clientes y Admin)
DROP POLICY IF EXISTS "Lectura de usuarios" ON public.users;
DROP POLICY IF EXISTS "Permitir todo usuarios" ON public.users;
CREATE POLICY "Permitir todo usuarios" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Políticas de lectura y escritura completa para pedidos (Compras)
DROP POLICY IF EXISTS "Lectura de pedidos autenticados" ON public.orders;
DROP POLICY IF EXISTS "Permitir todo orders" ON public.orders;
CREATE POLICY "Permitir todo orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Políticas de lectura y escritura completa para items de pedidos
DROP POLICY IF EXISTS "Lectura de items de pedidos" ON public.order_items;
DROP POLICY IF EXISTS "Permitir todo order_items" ON public.order_items;
CREATE POLICY "Permitir todo order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 7. INSERCIÓN DE DATOS INICIALES: USERS
-- ====================================================================
INSERT INTO public.users (id, nombre, email, password, rol, telefono, direccion, ciudad, creado_en)
VALUES
  ('user-admin', 'Maestro Perfumista (Admin)', 'admin@aromancia.com', 'admin', 'admin', '541148219900', 'Honduras 4920, Atelier Central', 'Palermo Soho, CABA', '2025-01-01'),
  ('user-c1', 'Valentina Rossi', 'valentina.rossi@gmail.com', '123', 'cliente', '541154921144', 'Av. Libertador 3200, Piso 8', 'Recoleta, CABA', '2025-01-14'),
  ('user-c2', 'Esteban Morales', 'esteban.m@outlook.com', '123', 'cliente', '543514829911', 'Belgrano 450', 'Córdoba Capital', '2025-02-02'),
  ('user-c3', 'Camila Dellacasa', 'camila.della@gmail.com', '123', 'cliente', '542236118822', 'Güemes 2840', 'Mar del Plata', '2025-02-18')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 8. INSERCIÓN DE DATOS: 17 PERFUMES DE AUTOR
-- ====================================================================
INSERT INTO public.perfumes (
  id, nombre, categoria, familia, concentracion, precio, precio_original,
  calificacion, total_resenas, volumen, descripcion, imagen, tag, stock,
  notas_salida, notas_corazon, notas_fondo, acordes_principales, creado_en
) VALUES
('perfume-01', 'Flor de Loto', 'femenino', 'Floral', 'Eau de Parfum', 28990, 34990, 4.9, 128, '100ml',
 'Una composición etérea donde los pétalos de loto azul flotan sobre un corazón de jazmín blanco y peonías rosadas maceradas.',
 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
 'Bestseller', 18,
 ARRAY['Loto azul', 'Bergamota de Calabria', 'Rocío de bambú'],
 ARRAY['Jazmín sambac', 'Peonía silvestre', 'Magnolia'],
 ARRAY['Almizcle blanco', 'Madera de cedro blanco', 'Ámbar cristal'],
 ARRAY['Floral blanco', 'Acuático', 'Fresco', 'Atalcado'], '2024-01-15'),

('perfume-02', 'Rosé Éclat', 'femenino', 'Floral', 'Eau de Parfum', 31500, NULL, 4.8, 94, '100ml',
 'Un homenaje contemporáneo a la rosa centifolia de Grasse. Luminosa, sedosa y profundamente adictiva.',
 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
 'Exclusivo', 12,
 ARRAY['Pimienta rosa', 'Mandarina siciliana', 'Grosella negra'],
 ARRAY['Rosa centifolia de Grasse', 'Rosa damascena', 'Lichi'],
 ARRAY['Pachulí blanco', 'Vainilla de Madagascar', 'Almizcle'],
 ARRAY['Rosa', 'Afrutado', 'Floral', 'Especiado suave'], '2024-02-01'),

('perfume-03', 'Noir Absolu', 'masculino', 'Amaderado', 'Extrait de Parfum', 38900, 44000, 5.0, 162, '100ml',
 'La máxima expresión del misterio. Madera de agar (oud) envejecida en barricas de cedro con toques de cuero toscano.',
 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
 'Bestseller', 8,
 ARRAY['Cardamomo de Guatemala', 'Incienso somalí', 'Azafrán'],
 ARRAY['Oud camboyano', 'Cuero toscano', 'Rosa oscura'],
 ARRAY['Sándalo de Mysore', 'Ámbar negro', 'Haba tonka'],
 ARRAY['Amaderado', 'Cuero', 'Oud', 'Ahumado'], '2024-01-10'),

('perfume-04', 'Santal Impérial', 'unisex', 'Amaderado', 'Eau de Parfum', 33400, NULL, 4.9, 87, '100ml',
 'Equilibrio perfecto entre la cremosidad del sándalo australiano y la frescura aromática del cardamomo y papiro.',
 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
 'Novedad', 15,
 ARRAY['Cardamomo', 'Violeta', 'Iris florentino'],
 ARRAY['Papiro egipcio', 'Cedro de Virginia', 'Incienso'],
 ARRAY['Sándalo australiano', 'Cuero ahumado', 'Ámbar'],
 ARRAY['Amaderado', 'Atalcado', 'Cálido especiado'], '2024-03-01'),

('perfume-05', 'Ambre Mystique', 'unisex', 'Oriental', 'Extrait de Parfum', 36200, NULL, 4.9, 110, '100ml',
 'Una noche dorada en Oriente. Ámbar resinoso fundido con benjuí de Siam y una vainilla oscura aterciopelada.',
 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
 'Edición Limitada', 6,
 ARRAY['Cilantro', 'Laurel noble', 'Bergamota'],
 ARRAY['Resina de benjuí', 'Mirra', 'Vainilla bourbon'],
 ARRAY['Ámbar gris', 'Sándalo', 'Resina de opopónaco'],
 ARRAY['Ambarado', 'Balsámico', 'Cálido', 'Vainilla'], '2024-02-15'),

('perfume-06', 'Cédre Noble', 'masculino', 'Amaderado', 'Eau de Parfum', 29800, 32500, 4.7, 73, '100ml',
 'La nobleza de los bosques ancestrales del Atlas combinada con vetiver de Haití y pimienta de Sichuan.',
 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
 NULL, 20,
 ARRAY['Pimienta de Sichuan', 'Enebro', 'Pomelo amargo'],
 ARRAY['Cedro del Atlas', 'Ciprés verde', 'Nuez moscada'],
 ARRAY['Vetiver de Haití', 'Musgo de roble', 'Almizcle'],
 ARRAY['Amaderado seco', 'Aromático', 'Cítrico amargo'], '2024-01-20'),

('perfume-07', 'Vanille Suprême', 'femenino', 'Gourmand', 'Eau de Parfum', 27900, NULL, 4.8, 89, '100ml',
 'Vainilla orgánica de Madagascar trabajada con sofisticación extrema, matizada con flor de almendro y café tostado.',
 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
 'Bestseller', 14,
 ARRAY['Flor de almendro', 'Pera caramelizada'],
 ARRAY['Vainilla negra de Madagascar', 'Granos de café arábica'],
 ARRAY['Haba tonka tostada', 'Madera de cedro', 'Almizcle'],
 ARRAY['Vainilla', 'Dulce sofisticado', 'Almendrado'], '2024-02-10'),

('perfume-08', 'Verveine Céleste', 'unisex', 'Cítrico', 'Cologne', 24500, NULL, 4.6, 62, '100ml',
 'Un torrente revitalizante de verbena provenzal prensada en frío con hojas de menta silvestre y petitgrain.',
 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
 'Fresco', 22,
 ARRAY['Verbena de Provenza', 'Limón de Amalfi', 'Petitgrain'],
 ARRAY['Menta silvestre', 'Albahaca genovesa', 'Tomillo blanco'],
 ARRAY['Almizcle limpio', 'Cedro blanco'],
 ARRAY['Cítrico', 'Verde', 'Aromático', 'Herbal'], '2024-03-05'),

('perfume-09', 'Chypre Sublime', 'femenino', 'Chypre', 'Eau de Parfum', 32000, 37000, 4.9, 58, '100ml',
 'La elegancia clásica reinventada. Musgo de roble francés, bergamota cristalina y un corazón seductor de jazmín sambac.',
 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
 'Clásico', 11,
 ARRAY['Bergamota de Calabria', 'Cilantro fresco'],
 ARRAY['Jazmín de Grasse', 'Rosa de Damasco', 'Ylang-ylang'],
 ARRAY['Musgo de roble francés', 'Pachulí de Indonesia', 'Ámbar'],
 ARRAY['Chypre', 'Terroso', 'Floral elegante'], '2024-02-20'),

('perfume-10', 'Cuir Sacré', 'masculino', 'Cuero', 'Extrait de Parfum', 39500, NULL, 5.0, 95, '100ml',
 'Inspirado en los talleres de guarnicionería artesanales. Cuero envejecido tratado con bálsamos y maderas aromáticas.',
 'https://images.unsplash.com/photo-1527632984437-01047ed6d60e?auto=format&fit=crop&w=800&q=80',
 'Exclusivo', 7,
 ARRAY['Azafrán persa', 'Frambuesa silvestre', 'Tomillo'],
 ARRAY['Cuero toscano', 'Incienso olíbano', 'Jazmín nocturno'],
 ARRAY['Gamuza negra', 'Ámbar dorado', 'Madera de abedul'],
 ARRAY['Cuero', 'Afrutado oscuro', 'Ahumado'], '2024-01-25'),

('perfume-11', 'Discovery Set Privé', 'sets', 'Sets y Regalos', 'Coffret de Degustación', 42900, 49000, 5.0, 215, '5 x 15ml',
 'El viaje sensorial completo de Aromancia. Contiene nuestros 5 extractos más icónicos en atomizadores recargables.',
 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80',
 'Bestseller', 25,
 ARRAY['Diversas notas de salida'],
 ARRAY['Flor de Loto, Noir Absolu, Rosé Éclat, Santal Impérial, Ambre Mystique'],
 ARRAY['Maderas nobles, ámbar y vainilla'],
 ARRAY['Set completo', 'Multifacético', 'Colección'], '2024-01-05')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 9. INSERCIÓN DE PEDIDOS Y DETALLES DE COMPRA
-- ====================================================================
INSERT INTO public.orders (
  id, fecha, cliente_id, cliente_nombre, cliente_email, cliente_telefono,
  cliente_direccion, cliente_ciudad, subtotal, envio, total, estado, metodo_pago
) VALUES
('ORD-8041', '2025-02-24', 'user-c1', 'Valentina Rossi', 'valentina.rossi@gmail.com', '541154921144', 'Av. Libertador 3200, Piso 8', 'Recoleta, CABA', 60490, 0, 60490, 'Entregado', 'Mercado Pago (Tarjetas)'),
('ORD-8042', '2025-02-25', 'user-c2', 'Esteban Morales', 'esteban.m@outlook.com', '543514829911', 'Belgrano 450', 'Córdoba Capital', 38900, 3500, 42400, 'En camino', 'Tarjeta de Crédito Visa'),
('ORD-8043', '2025-02-26', 'user-c3', 'Camila Dellacasa', 'camila.della@gmail.com', '542236118822', 'Güemes 2840', 'Mar del Plata', 42900, 0, 42900, 'En preparación en Atelier', 'Transferencia Bancaria (10% OFF)')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (order_id, perfume_id, nombre, precio, cantidad, volumen, imagen)
VALUES
('ORD-8041', 'perfume-01', 'Flor de Loto', 28990, 1, '100ml', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'),
('ORD-8041', 'perfume-02', 'Rosé Éclat', 31500, 1, '100ml', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'),
('ORD-8042', 'perfume-03', 'Noir Absolu', 38900, 1, '100ml', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'),
('ORD-8043', 'perfume-11', 'Discovery Set Privé', 42900, 1, '5 x 15ml', 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80');

-- ====================================================================
-- SCRIPT SQL LISTO PARA TRANSFERIR A SUPABASE
-- ====================================================================
