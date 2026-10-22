<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
    <!-- Non-admin guard -->
    <div v-if="!isAdmin" class="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-3">
      <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
        <span class="material-symbols-outlined text-[28px]">lock</span>
      </div>
      <h2 class="font-serif text-2xl text-[#4A1521]">Acceso Restringido a Administrador</h2>
      <p class="text-xs text-gray-600 max-w-md mx-auto">
        Esta sección está reservada para el Maestro Perfumista y administradores de Aromancia.
      </p>
      <button
        type="button"
        @click="openAuthModal('admin')"
        class="px-5 py-2.5 rounded-xl bg-[#4A1521] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2F020D] transition-colors cursor-pointer"
      >
        Iniciar Sesión como Administrador
      </button>
    </div>

    <!-- Admin Content -->
    <div v-else class="space-y-8">
      <!-- Admin Hero Header -->
      <div class="bg-[#4A1521] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div class="relative z-10 space-y-1.5 max-w-xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#FFD9DD] text-[10px] font-sans font-semibold tracking-widest uppercase">
            <span class="material-symbols-outlined text-[14px]">shield_person</span>
            <span>PORTAL DEL ATELIER · ACCESO ADMINISTRADOR</span>
          </div>
          <h1 class="font-serif text-2xl sm:text-4xl text-white">
            Panel de Administrador
          </h1>
          <p class="font-sans text-xs sm:text-sm text-white/80 font-light leading-relaxed">
            Supervisión integral de clientes, detalles de compras en tiempo real e inventario de perfumes de autor.
          </p>
        </div>

        <div class="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <!-- Supabase Live Connection Pill -->
          <div
            class="px-3.5 py-2 rounded-xl bg-black/30 border border-white/20 text-xs text-white/90 flex items-center gap-2 shadow-inner"
            :title="supabaseStatus.message"
          >
            <span
              class="w-2.5 h-2.5 rounded-full"
              :class="supabaseStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'"
            ></span>
            <span class="font-mono text-[11px] font-semibold">
              {{ isSupabaseSyncing ? 'Sincronizando...' : 'Supabase Conectado' }}
            </span>
            <button
              type="button"
              @click="reSyncWithSupabase"
              :disabled="isSupabaseSyncing"
              class="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Volver a sincronizar información con Supabase"
            >
              <span
                class="material-symbols-outlined text-[14px]"
                :class="{ 'animate-spin': isSupabaseSyncing }"
              >sync</span>
            </button>
          </div>

          <router-link
            to="/alta"
            class="px-5 py-3 rounded-lg bg-white text-[#4A1521] hover:bg-[#FCF9F7] text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Nueva Fragancia</span>
          </router-link>
        </div>

        <div class="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl p-5 border border-[#EEDCD5] shadow-xs space-y-2">
          <div class="flex items-center justify-between text-gray-500">
            <span class="text-xs uppercase font-medium tracking-wider">Ingresos Totales</span>
            <span class="material-symbols-outlined text-[20px] text-emerald-600">payments</span>
          </div>
          <p class="font-serif text-2xl sm:text-3xl font-bold text-[#4A1521]">
            ${{ totalRevenue.toLocaleString('es-AR') }}
          </p>
          <span class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium inline-block">
            Facturación en compras
          </span>
        </div>

        <div class="bg-white rounded-xl p-5 border border-[#EEDCD5] shadow-xs space-y-2">
          <div class="flex items-center justify-between text-gray-500">
            <span class="text-xs uppercase font-medium tracking-wider">Pedidos Realizados</span>
            <span class="material-symbols-outlined text-[20px] text-[#4A1521]">shopping_bag</span>
          </div>
          <p class="font-serif text-2xl sm:text-3xl font-bold text-[#4A1521]">
            {{ orders.length }}
          </p>
          <span class="text-[10px] text-[#4A1521] bg-[#EEDCD5] px-2 py-0.5 rounded font-medium inline-block">
            {{ totalUnitsSold }} frascos despachados
          </span>
        </div>

        <div class="bg-white rounded-xl p-5 border border-[#EEDCD5] shadow-xs space-y-2">
          <div class="flex items-center justify-between text-gray-500">
            <span class="text-xs uppercase font-medium tracking-wider">Clientes Registrados</span>
            <span class="material-symbols-outlined text-[20px] text-blue-600">group</span>
          </div>
          <p class="font-serif text-2xl sm:text-3xl font-bold text-[#4A1521]">
            {{ clientUsers.length }}
          </p>
          <span class="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium inline-block">
            Base de compradores activos
          </span>
        </div>

        <div class="bg-white rounded-xl p-5 border border-[#EEDCD5] shadow-xs space-y-2">
          <div class="flex items-center justify-between text-gray-500">
            <span class="text-xs uppercase font-medium tracking-wider">Productos en Catálogo</span>
            <span class="material-symbols-outlined text-[20px] text-purple-600">inventory_2</span>
          </div>
          <p class="font-serif text-2xl sm:text-3xl font-bold text-[#4A1521]">
            {{ perfumes.length }}
          </p>
          <span class="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium inline-block">
            {{ totalStockUnits }} unidades en stock
          </span>
        </div>
      </div>

      <!-- Navigation Tabs: Pedidos, Clientes, Productos -->
      <div class="flex items-center gap-2 border-b border-[#EEDCD5] bg-white rounded-2xl p-2 shadow-xs">
        <button
          type="button"
          @click="activeTab = 'pedidos'"
          class="flex-1 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          :class="activeTab === 'pedidos' ? 'bg-[#4A1521] text-white shadow-sm' : 'text-gray-600 hover:text-[#4A1521] hover:bg-[#FCF9F7]'"
        >
          <span class="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Detalles de la Compra ({{ orders.length }})</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'clientes'"
          class="flex-1 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          :class="activeTab === 'clientes' ? 'bg-[#4A1521] text-white shadow-sm' : 'text-gray-600 hover:text-[#4A1521] hover:bg-[#FCF9F7]'"
        >
          <span class="material-symbols-outlined text-[18px]">badge</span>
          <span>Datos sobre del Cliente ({{ clientUsers.length }})</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'productos'"
          class="flex-1 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          :class="activeTab === 'productos' ? 'bg-[#4A1521] text-white shadow-sm' : 'text-gray-600 hover:text-[#4A1521] hover:bg-[#FCF9F7]'"
        >
          <span class="material-symbols-outlined text-[18px]">category</span>
          <span>Gestión del Producto ({{ perfumes.length }})</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'sql'"
          class="flex-1 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          :class="activeTab === 'sql' ? 'bg-[#4A1521] text-white shadow-sm' : 'text-gray-600 hover:text-[#4A1521] hover:bg-[#FCF9F7]'"
        >
          <span class="material-symbols-outlined text-[18px]">database</span>
          <span>Base de Datos SQL (Supabase)</span>
        </button>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 1: DETALLES DE LA COMPRA (PEDIDOS REALIZADOS)        -->
      <!-- ======================================================== -->
      <div v-if="activeTab === 'pedidos'" class="space-y-4">
        <!-- Status Filter Bar -->
        <div class="flex items-center justify-between gap-4 flex-wrap bg-white p-4 rounded-xl border border-[#EEDCD5]">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-[#4A1521]">Filtrar Estado:</span>
            <select
              v-model="orderStatusFilter"
              class="px-3 py-1.5 rounded-lg border border-[#EEDCD5] text-xs bg-[#FCF9F7] text-[#4A1521] font-medium"
            >
              <option value="todos">Todos los Estados ({{ orders.length }})</option>
              <option value="En preparación en Atelier">En preparación en Atelier</option>
              <option value="En camino">En camino</option>
              <option value="Entregado">Entregado</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>

          <span class="text-xs text-gray-500 font-light">
            Mostrando <strong>{{ filteredOrders.length }}</strong> pedidos registrados en LocalStorage
          </span>
        </div>

        <!-- Orders Table / List -->
        <div class="space-y-4">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="bg-white rounded-2xl p-6 border border-[#EEDCD5] shadow-sm space-y-4"
          >
            <!-- Order Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEDCD5]/60 pb-3">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-[#EEDCD5]/60 text-[#4A1521] flex items-center justify-center font-serif font-bold text-sm">
                  #
                </span>
                <div>
                  <h3 class="font-serif text-base font-semibold text-[#4A1521]">
                    Pedido {{ order.id }}
                  </h3>
                  <p class="text-xs text-gray-500">Fecha: {{ order.fecha }}</p>
                </div>
              </div>

              <!-- Order Status Selector in Real Time -->
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-gray-500">Estado:</span>
                <select
                  :value="order.estado"
                  @change="handleStatusChange(order.id, ($event.target as HTMLSelectElement).value as any)"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer"
                  :class="statusBadgeClass(order.estado)"
                >
                  <option value="En preparación en Atelier">En preparación en Atelier</option>
                  <option value="En camino">En camino</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
            </div>

            <!-- Customer & Purchase Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <!-- Datos del Cliente (4 cols) -->
              <div class="md:col-span-4 bg-[#FCF9F7] p-4 rounded-xl border border-[#EEDCD5] space-y-2">
                <span class="text-[10px] uppercase font-bold text-[#7D5260] tracking-wider block">
                  Datos del Cliente Comprador:
                </span>
                <div class="space-y-1 text-xs text-gray-700">
                  <p class="font-semibold text-[#4A1521] text-sm">{{ order.cliente.nombre }}</p>
                  <p class="flex items-center gap-1.5 text-gray-600">
                    <span class="material-symbols-outlined text-[14px]">email</span>
                    {{ order.cliente.email }}
                  </p>
                  <p class="flex items-center gap-1.5 text-gray-600">
                    <span class="material-symbols-outlined text-[14px]">phone</span>
                    {{ order.cliente.telefono || 'Sin registrar' }}
                  </p>
                  <p class="flex items-center gap-1.5 text-gray-600">
                    <span class="material-symbols-outlined text-[14px]">home</span>
                    {{ order.cliente.direccion }}, {{ order.cliente.ciudad }}
                  </p>
                </div>
                <div class="pt-2 border-t border-[#EEDCD5] text-[11px] text-gray-500">
                  <span>Pago: <strong>{{ order.metodoPago }}</strong></span>
                </div>
              </div>

              <!-- Detalles de Productos Comprados (8 cols) -->
              <div class="md:col-span-8 space-y-2">
                <span class="text-[10px] uppercase font-bold text-[#7D5260] tracking-wider block">
                  Productos y Fragancias en la Orden:
                </span>

                <div class="divide-y divide-[#EEDCD5]/60 border border-[#EEDCD5] rounded-xl overflow-hidden bg-white">
                  <div
                    v-for="item in order.items"
                    :key="item.perfumeId"
                    class="p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <img
                        :src="item.imagen"
                        :alt="item.nombre"
                        class="w-10 h-12 object-cover rounded-md border border-[#EEDCD5] shrink-0"
                      />
                      <div class="min-w-0">
                        <p class="font-medium text-[#1B1C1B] truncate">{{ item.nombre }}</p>
                        <p class="text-[11px] text-gray-500">{{ item.volumen }} · Cantidad: {{ item.cantidad }}</p>
                      </div>
                    </div>
                    <div class="text-right shrink-0">
                      <span class="font-serif font-semibold text-[#4A1521]">
                        ${{ (item.precio * item.cantidad).toLocaleString('es-AR') }}
                      </span>
                      <p class="text-[10px] text-gray-400">(${{ item.precio.toLocaleString('es-AR') }} c/u)</p>
                    </div>
                  </div>
                </div>

                <!-- Totals Breakdown -->
                <div class="flex items-center justify-between pt-2 px-2 text-xs">
                  <span class="text-gray-500">Subtotal: ${{ order.subtotal.toLocaleString('es-AR') }} | Envío: {{ order.envio === 0 ? 'GRATIS' : `$${order.envio.toLocaleString('es-AR')}` }}</span>
                  <div class="text-right">
                    <span class="text-[11px] text-gray-500 mr-2">Total de la Compra:</span>
                    <span class="font-serif text-lg font-bold text-[#4A1521]">
                      ${{ order.total.toLocaleString('es-AR') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 2: DATOS SOBRE DEL CLIENTE                           -->
      <!-- ======================================================== -->
      <div v-else-if="activeTab === 'clientes'" class="space-y-4">
        <!-- Search clients input -->
        <div class="bg-white p-4 rounded-xl border border-[#EEDCD5] flex items-center gap-3">
          <span class="material-symbols-outlined text-[20px] text-gray-400">search</span>
          <input
            v-model="clientSearch"
            type="text"
            placeholder="Buscar cliente por nombre, email o ciudad..."
            class="w-full bg-transparent text-xs sm:text-sm text-[#1B1C1B] focus:outline-none"
          />
        </div>

        <!-- Clients Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="client in filteredClients"
            :key="client.id"
            class="bg-white rounded-2xl p-5 border border-[#EEDCD5] shadow-xs space-y-3"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#EEDCD5] text-[#4A1521] flex items-center justify-center font-bold text-sm">
                  {{ client.nombre.charAt(0) }}
                </div>
                <div>
                  <h3 class="font-serif text-sm font-semibold text-[#4A1521]">{{ client.nombre }}</h3>
                  <span class="text-[10px] text-gray-400">Cliente desde {{ client.creadoEn }}</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800">
                Verificado
              </span>
            </div>

            <div class="space-y-1 text-xs text-gray-600 bg-[#FCF9F7] p-3 rounded-xl border border-[#EEDCD5]">
              <p class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[14px] text-gray-400">email</span>
                <span class="truncate">{{ client.email }}</span>
              </p>
              <p class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[14px] text-gray-400">phone</span>
                <span>{{ client.telefono || 'Sin teléfono' }}</span>
              </p>
              <p class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[14px] text-gray-400">location_on</span>
                <span>{{ client.direccion || 'Dirección no indicada' }}, {{ client.ciudad || 'Argentina' }}</span>
              </p>
            </div>

            <!-- Client's purchase history summary -->
            <div class="flex items-center justify-between text-xs pt-2 border-t border-[#EEDCD5]/60">
              <span class="text-gray-500">Pedidos: <strong>{{ getClientOrdersCount(client.id) }}</strong></span>
              <span class="text-[#4A1521] font-semibold">
                Total Compras: ${{ getClientTotalSpent(client.id).toLocaleString('es-AR') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 3: GESTIÓN DEL PRODUCTO (CATÁLOGO & STOCK)           -->
      <!-- ======================================================== -->
      <div v-else-if="activeTab === 'productos'" class="space-y-4">
        <!-- Products Table -->
        <div class="bg-white rounded-2xl border border-[#EEDCD5] overflow-hidden shadow-sm">
          <div class="p-4 border-b border-[#EEDCD5] flex items-center justify-between flex-wrap gap-3 bg-[#FCF9F7]">
            <span class="font-serif text-base text-[#4A1521] font-medium">
              Inventario de Fragancias del Atelier ({{ perfumes.length }} registros)
            </span>
            <router-link
              to="/alta"
              class="px-3.5 py-1.5 rounded-lg bg-[#4A1521] text-white hover:bg-[#2F020D] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span class="material-symbols-outlined text-[15px]">add</span>
              <span>+ Nueva Fragancia</span>
            </router-link>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-[#FCF9F7] text-[#7D5260] uppercase tracking-wider font-semibold border-b border-[#EEDCD5]">
                <tr>
                  <th class="p-3.5">Fragancia</th>
                  <th class="p-3.5">Categoría & Familia</th>
                  <th class="p-3.5">Precio (ARS)</th>
                  <th class="p-3.5">Stock en Atelier</th>
                  <th class="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#EEDCD5]/60">
                <tr v-for="p in perfumes" :key="p.id" class="hover:bg-[#FCF9F7]/70 transition-colors">
                  <td class="p-3.5">
                    <div class="flex items-center gap-3">
                      <img :src="p.imagen" :alt="p.nombre" class="w-10 h-12 object-cover rounded-md border border-[#EEDCD5]" />
                      <div>
                        <p class="font-serif text-sm font-semibold text-[#1B1C1B]">{{ p.nombre }}</p>
                        <p class="text-[11px] text-gray-500">{{ p.concentracion }} · {{ p.volumen }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-[#EEDCD5] text-[#4A1521] mr-1">
                      {{ p.categoria }}
                    </span>
                    <span class="text-gray-600">{{ p.familia }}</span>
                  </td>
                  <td class="p-3.5 font-serif font-bold text-[#4A1521]">
                    ${{ Number(p.precio).toLocaleString('es-AR') }}
                  </td>
                  <td class="p-3.5">
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click="updateStock(p.id, Math.max(0, p.stock - 1))"
                        class="w-6 h-6 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span class="font-bold w-6 text-center" :class="p.stock < 5 ? 'text-red-600' : 'text-[#4A1521]'">
                        {{ p.stock }}
                      </span>
                      <button
                        type="button"
                        @click="updateStock(p.id, p.stock + 1)"
                        class="w-6 h-6 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td class="p-3.5 text-right space-x-2">
                    <router-link
                      :to="`/editar/${p.id}`"
                      class="px-2.5 py-1 rounded bg-[#4A1521]/10 text-[#4A1521] hover:bg-[#4A1521] hover:text-white transition-colors font-medium text-[11px]"
                    >
                      Editar
                    </router-link>
                    <button
                      type="button"
                      @click="promptDelete(p)"
                      class="px-2.5 py-1 rounded bg-red-100 text-red-700 hover:bg-red-700 hover:text-white transition-colors font-medium text-[11px] cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 4: BASE DE DATOS SQL (TRANSFERENCIA A SUPABASE)      -->
      <!-- ======================================================== -->
      <div v-else-if="activeTab === 'sql'" class="space-y-6">
        <!-- Overview Banner -->
        <div class="bg-gradient-to-br from-[#2F020D] to-[#4A1521] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10 space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[10px] font-semibold tracking-widest uppercase">
                <span class="material-symbols-outlined text-[14px]">database</span>
                <span>MIGRACIÓN RELACIONAL SQL · COMPATIBLE CON SUPABASE</span>
              </div>
              <h2 class="font-serif text-2xl sm:text-3xl text-white">
                Exportación de Datos a SQL (Supabase)
              </h2>
              <p class="text-xs text-[#EBD9D2]/80 font-light max-w-2xl leading-relaxed">
                Este script genera la estructura relacional DDL (tablas <code>users</code>, <code>perfumes</code>, <code>orders</code>, <code>order_items</code>), políticas Row Level Security (RLS) y las sentencias <code>INSERT INTO</code> con todos los datos actuales del Atelier para ejecutar en el <strong>SQL Editor</strong> de Supabase.
              </p>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                @click="copySqlScript"
                class="px-4 py-2.5 rounded-xl bg-white text-[#4A1521] hover:bg-[#FCF9F7] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span class="material-symbols-outlined text-[16px]">{{ copiedSql ? 'check' : 'content_copy' }}</span>
                <span>{{ copiedSql ? '¡Copiado!' : 'Copiar SQL' }}</span>
              </button>

              <button
                type="button"
                @click="downloadSqlScript"
                class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span class="material-symbols-outlined text-[16px]">download</span>
                <span>Descargar .sql</span>
              </button>
            </div>
          </div>

          <!-- Quick Statistics Metric Badges -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
            <div class="bg-white/10 p-3 rounded-xl border border-white/10">
              <span class="text-white/60 text-[10px] uppercase block">Tabla Usuarios</span>
              <span class="text-base font-bold text-white">{{ users.length }} registros SQL</span>
            </div>
            <div class="bg-white/10 p-3 rounded-xl border border-white/10">
              <span class="text-white/60 text-[10px] uppercase block">Tabla Perfumes</span>
              <span class="text-base font-bold text-white">{{ perfumes.length }} fragancias SQL</span>
            </div>
            <div class="bg-white/10 p-3 rounded-xl border border-white/10">
              <span class="text-white/60 text-[10px] uppercase block">Tabla Pedidos</span>
              <span class="text-base font-bold text-white">{{ orders.length }} órdenes SQL</span>
            </div>
            <div class="bg-white/10 p-3 rounded-xl border border-white/10">
              <span class="text-white/60 text-[10px] uppercase block">Detalles de Ítems</span>
              <span class="text-base font-bold text-white">{{ totalItemsCount }} productos en compras</span>
            </div>
          </div>
        </div>

        <!-- Instructions Card -->
        <div class="bg-white rounded-2xl p-5 border border-[#EEDCD5] shadow-xs space-y-3">
          <h3 class="font-serif text-sm font-semibold text-[#4A1521] flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">help</span>
            Pasos para transferir e importar en Supabase:
          </h3>
          <ol class="list-decimal list-inside text-xs text-gray-600 space-y-1.5 leading-relaxed font-light">
            <li>Creá o ingresá a tu proyecto en <strong class="text-gray-800">supabase.com</strong>.</li>
            <li>En el panel lateral izquierdo de Supabase, hacé clic en <strong class="text-gray-800">SQL Editor</strong>.</li>
            <li>Hacé clic en <strong class="text-gray-800">+ New Query</strong>.</li>
            <li>Pegá el script copiándolo con el botón <strong class="text-[#4A1521]">"Copiar SQL"</strong> o abrí el archivo descargado <code class="bg-gray-100 px-1 py-0.5 rounded">supabase_aromancia.sql</code>.</li>
            <li>Hacé clic en el botón verde <strong class="text-emerald-700">"Run"</strong> para crear las 4 tablas e insertar todos los datos del atelier.</li>
          </ol>
        </div>

        <!-- Code Viewer Container -->
        <div class="bg-[#1E1E1E] text-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-800">
          <div class="px-5 py-3 bg-[#2D2D2D] border-b border-gray-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500"></span>
              <span class="w-3 h-3 rounded-full bg-amber-500"></span>
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span class="text-xs font-mono text-gray-400 ml-2">supabase_aromancia.sql</span>
            </div>
            <button
              type="button"
              @click="copySqlScript"
              class="text-xs text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[14px]">content_copy</span>
              <span>{{ copiedSql ? 'Copiado al portapapeles' : 'Copiar todo el código' }}</span>
            </button>
          </div>
          <pre class="p-5 text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed text-emerald-400/90 whitespace-pre scrollbar-thin"><code>{{ currentGeneratedSql }}</code></pre>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Deletion -->
    <ModalConfirmacion
      :is-open="deleteModalOpen"
      :perfume="perfumeToDelete"
      @confirm="handleConfirmDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ModalConfirmacion from '../components/ModalConfirmacion.vue';
import {
  perfumes,
  users,
  orders,
  isAdmin,
  openAuthModal,
  changeOrderStatus,
  updatePerfumeStock,
  deletePerfumeRecord,
  initStore,
  showToast,
  supabaseStatus,
  isSupabaseSyncing
} from '../store';
import { Perfume, Order } from '../types';
import { generateSupabaseSQL, downloadSupabaseSQLFile } from '../services/sqlService';

const reSyncWithSupabase = async () => {
  showToast('Sincronizando con Supabase...', 'Consultando fragancias, pedidos y usuarios en la nube.');
  await initStore();
  showToast('Sincronización Completada', supabaseStatus.value.message);
};

onMounted(() => {
  if (perfumes.value.length === 0) {
    initStore();
  }
});

const activeTab = ref<'pedidos' | 'clientes' | 'productos' | 'sql'>('pedidos');
const orderStatusFilter = ref('todos');
const clientSearch = ref('');
const copiedSql = ref(false);

// Modals
const deleteModalOpen = ref(false);
const perfumeToDelete = ref<Perfume | null>(null);

// SQL computed script & items count
const currentGeneratedSql = computed(() => {
  return generateSupabaseSQL(perfumes.value, users.value, orders.value);
});

const totalItemsCount = computed(() => {
  return orders.value.reduce((sum, o) => sum + (o.items ? o.items.length : 0), 0);
});

const copySqlScript = async () => {
  try {
    await navigator.clipboard.writeText(currentGeneratedSql.value);
    copiedSql.value = true;
    showToast('SQL Copiado', 'El script para Supabase se copió al portapapeles.');
    setTimeout(() => {
      copiedSql.value = false;
    }, 3000);
  } catch (err) {
    showToast('Error', 'No se pudo copiar automáticamente. Podés descargarlo como archivo .sql');
  }
};

const downloadSqlScript = () => {
  downloadSupabaseSQLFile('supabase_aromancia.sql');
  showToast('Descarga iniciada', 'Se ha generado y descargado el archivo supabase_aromancia.sql');
};

// ========================================================
// COMPUTED PROPERTIES (Requisito de rúbrica)
// ========================================================

// 1. Clientes registrados (excluyendo el rol admin)
const clientUsers = computed(() => {
  return users.value.filter(u => u.rol === 'cliente');
});

// 2. Pedidos filtrados por estado
const filteredOrders = computed(() => {
  if (orderStatusFilter.value === 'todos') return orders.value;
  return orders.value.filter(o => o.estado === orderStatusFilter.value);
});

// 3. Clientes filtrados por buscador
const filteredClients = computed(() => {
  if (!clientSearch.value.trim()) return clientUsers.value;
  const q = clientSearch.value.toLowerCase().trim();
  return clientUsers.value.filter(c =>
    c.nombre.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q) ||
    (c.ciudad && c.ciudad.toLowerCase().includes(q))
  );
});

// 4. Métricas KPI generales
const totalRevenue = computed(() => {
  return orders.value.reduce((sum, o) => sum + o.total, 0);
});

const totalUnitsSold = computed(() => {
  return orders.value.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.cantidad, 0), 0);
});

const totalStockUnits = computed(() => {
  return perfumes.value.reduce((sum, p) => sum + (p.stock || 0), 0);
});

// Helpers
const getClientOrdersCount = (clientId: string) => {
  return orders.value.filter(o => o.cliente.id === clientId).length;
};

const getClientTotalSpent = (clientId: string) => {
  return orders.value
    .filter(o => o.cliente.id === clientId)
    .reduce((sum, o) => sum + o.total, 0);
};

const statusBadgeClass = (status: Order['estado']) => {
  switch (status) {
    case 'Entregado':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'En camino':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'En preparación en Atelier':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const handleStatusChange = (orderId: string, newStatus: Order['estado']) => {
  changeOrderStatus(orderId, newStatus);
};

const updateStock = (perfumeId: string, newStock: number) => {
  updatePerfumeStock(perfumeId, newStock);
};

const promptDelete = (p: Perfume) => {
  perfumeToDelete.value = p;
  deleteModalOpen.value = true;
};

const handleConfirmDelete = () => {
  if (perfumeToDelete.value) {
    deletePerfumeRecord(perfumeToDelete.value.id);
    deleteModalOpen.value = false;
    perfumeToDelete.value = null;
  }
};
</script>
