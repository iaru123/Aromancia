-- ====================================================================
-- AROMANCIA - HABILITAR PERMISOS COMPLETOS DE ESCRITURA EN SUPABASE
-- Ejecutar en el SQL Editor de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/gjglnjxkcjhywctzzdre/sql
-- Permite que los nuevos usuarios (Google y email), modificaciones de productos y compras se guarden en Supabase
-- ====================================================================

-- 1. Desactivar RLS para permitir guardar usuarios, catálogo y compras sin bloqueos
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfumes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- 2. Asegurar que las columnas acepten pedidos sin restricciones foráneas estrictas si el usuario se crea en paralelo
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_cliente_id_fkey;
ALTER TABLE public.orders ADD CONSTRAINT orders_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- 3. Políticas públicas completas (en caso de que RLS esté activo)
DROP POLICY IF EXISTS "Permitir todo usuarios" ON public.users;
CREATE POLICY "Permitir todo usuarios" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo perfumes" ON public.perfumes;
CREATE POLICY "Permitir todo perfumes" ON public.perfumes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo orders" ON public.orders;
CREATE POLICY "Permitir todo orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo order_items" ON public.order_items;
CREATE POLICY "Permitir todo order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);
