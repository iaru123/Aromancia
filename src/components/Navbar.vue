<template>
  <header class="sticky top-0 z-40 bg-[#FCF9F7]/95 backdrop-blur-md border-b border-[#EEDCD5]/60 transition-all">
    <!-- Announcement Bar -->
    <div class="bg-[#4A1521] text-[#EBD9D2] py-1.5 px-4 text-center text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-2">
      <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#EBD9D2] animate-pulse"></span>
      <span>Envío sin cargo en compras superiores a $50.000 · Packaging exclusivo de Atelier</span>
      <span class="hidden md:inline text-white/50">|</span>
      <span class="hidden md:inline text-white/80 font-normal">3 Cuotas sin interés con todas las tarjetas</span>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20 gap-4">
        <!-- Brand Logo -->
        <router-link to="/" class="shrink-0 flex items-center">
          <AromanciaLogo size="md" />
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-6 xl:gap-8">
          <router-link
            to="/"
            class="text-xs uppercase tracking-[0.2em] font-medium py-1.5 transition-colors relative"
            :class="isActive('/') ? 'text-[#4A1521] font-semibold' : 'text-[#7D5260] hover:text-[#4A1521]'"
          >
            Inicio
            <span v-if="isActive('/')" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#4A1521] rounded-full"></span>
          </router-link>

          <router-link
            to="/tienda"
            class="text-xs uppercase tracking-[0.2em] font-medium py-1.5 transition-colors relative"
            :class="isActive('/tienda') ? 'text-[#4A1521] font-semibold' : 'text-[#7D5260] hover:text-[#4A1521]'"
          >
            Catálogo
            <span v-if="isActive('/tienda')" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#4A1521] rounded-full"></span>
          </router-link>

          <!-- SECCIÓN EXCLUSIVA ADMINISTRADOR: + NUEVA FRAGANCIA -->
          <router-link
            v-if="isAdmin"
            to="/alta"
            class="text-xs uppercase tracking-[0.2em] font-semibold py-1.5 px-3 rounded-full bg-[#4A1521]/10 text-[#4A1521] border border-[#4A1521]/20 hover:bg-[#4A1521] hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span class="material-symbols-outlined text-[15px]">add</span>
            <span>+ Nueva Fragancia</span>
          </router-link>

          <!-- SECCIÓN EXCLUSIVA ADMINISTRADOR: PANEL DE ADMINISTRADOR -->
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="text-xs uppercase tracking-[0.2em] font-semibold py-1.5 px-3 rounded-full bg-[#4A1521] text-white hover:bg-[#2F020D] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span class="material-symbols-outlined text-[15px]">admin_panel_settings</span>
            <span>Panel de Administrador</span>
          </router-link>

          <router-link
            to="/nosotros"
            class="text-xs uppercase tracking-[0.2em] font-medium py-1.5 transition-colors relative"
            :class="isActive('/nosotros') ? 'text-[#4A1521] font-semibold' : 'text-[#7D5260] hover:text-[#4A1521]'"
          >
            El Atelier
            <span v-if="isActive('/nosotros')" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#4A1521] rounded-full"></span>
          </router-link>

          <router-link
            to="/contacto"
            class="text-xs uppercase tracking-[0.2em] font-medium py-1.5 transition-colors relative"
            :class="isActive('/contacto') ? 'text-[#4A1521] font-semibold' : 'text-[#7D5260] hover:text-[#4A1521]'"
          >
            Contacto
            <span v-if="isActive('/contacto')" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#4A1521] rounded-full"></span>
          </router-link>
        </nav>

        <!-- Right Side Utility Icons -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Search Trigger Button -->
          <button
            type="button"
            @click="emit('openSearch')"
            class="p-2 text-[#7D5260] hover:text-[#4A1521] hover:bg-[#EEDCD5]/40 rounded-full transition-colors cursor-pointer"
            title="Buscar fragancias"
            aria-label="Buscar fragancias"
          >
            <span class="material-symbols-outlined text-[22px]">search</span>
          </button>

          <!-- User Authentication Button / Profile Menu -->
          <div class="relative">
            <template v-if="currentUser">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="userMenuOpen = !userMenuOpen"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer"
                  :class="isAdmin ? 'bg-[#4A1521] text-white border-[#4A1521]' : 'bg-[#EEDCD5]/60 text-[#4A1521] border-[#EEDCD5] hover:bg-[#EEDCD5]'"
                >
                  <span class="material-symbols-outlined text-[18px]">
                    {{ isAdmin ? 'verified_user' : 'person' }}
                  </span>
                  <span class="max-w-[110px] truncate hidden sm:inline">
                    {{ isAdmin ? 'Admin' : currentUser.nombre.split(' ')[0] }}
                  </span>
                  <span class="material-symbols-outlined text-[16px]">expand_more</span>
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#EEDCD5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div class="px-4 py-2 border-b border-[#EEDCD5]/60">
                    <p class="text-xs font-semibold text-[#4A1521] truncate">{{ currentUser.nombre }}</p>
                    <p class="text-[11px] text-gray-500 truncate">{{ currentUser.email }}</p>
                    <span
                      class="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded"
                      :class="isAdmin ? 'bg-[#4A1521] text-white' : 'bg-emerald-100 text-emerald-800'"
                    >
                      {{ isAdmin ? 'Administrador' : 'Cliente Comprador' }}
                    </span>
                  </div>

                  <div class="py-1">
                    <router-link
                      v-if="isAdmin"
                      to="/admin"
                      @click="userMenuOpen = false"
                      class="flex items-center gap-2.5 px-4 py-2 text-xs text-[#4A1521] hover:bg-[#FCF9F7]"
                    >
                      <span class="material-symbols-outlined text-[16px]">dashboard</span>
                      <span>Panel de Administrador</span>
                    </router-link>

                    <router-link
                      v-if="isAdmin"
                      to="/alta"
                      @click="userMenuOpen = false"
                      class="flex items-center gap-2.5 px-4 py-2 text-xs text-[#4A1521] hover:bg-[#FCF9F7]"
                    >
                      <span class="material-symbols-outlined text-[16px]">add_circle</span>
                      <span>+ Nueva Fragancia</span>
                    </router-link>

                    <router-link
                      to="/tienda"
                      @click="userMenuOpen = false"
                      class="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-[#FCF9F7]"
                    >
                      <span class="material-symbols-outlined text-[16px]">storefront</span>
                      <span>Explorar Catálogo</span>
                    </router-link>
                  </div>

                  <div class="border-t border-[#EEDCD5]/60 pt-1">
                    <button
                      type="button"
                      @click="handleLogout"
                      class="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <span class="material-symbols-outlined text-[16px]">logout</span>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <!-- Visitor / Unauthenticated: Iniciar Sesión / Registro -->
              <button
                type="button"
                @click="emit('openAuth', 'login')"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#4A1521] border border-[#4A1521]/30 hover:border-[#4A1521] hover:bg-[#4A1521] hover:text-white transition-all cursor-pointer shadow-xs"
                title="Iniciar sesión como comprador"
              >
                <span class="material-symbols-outlined text-[18px]">account_circle</span>
                <span class="hidden sm:inline">Ingresar</span>
              </button>
            </template>
          </div>

          <!-- Shopping Bag Button -->
          <button
            type="button"
            @click="emit('openCart')"
            class="relative p-2 text-[#7D5260] hover:text-[#4A1521] hover:bg-[#EEDCD5]/40 rounded-full transition-colors cursor-pointer"
            title="Bolsa de compras"
            aria-label="Bolsa de compras"
          >
            <span class="material-symbols-outlined text-[24px]">shopping_bag</span>
            <span
              v-if="cartCount > 0"
              class="absolute -top-1 -right-1 bg-[#4A1521] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-scale shadow-xs"
            >
              {{ cartCount }}
            </span>
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button
            type="button"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 text-[#4A1521] hover:bg-[#EEDCD5]/40 rounded-lg transition-colors cursor-pointer"
            aria-label="Menú principal"
          >
            <span class="material-symbols-outlined text-[26px]">
              {{ mobileMenuOpen ? 'close' : 'menu' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Navigation -->
    <div
      v-if="mobileMenuOpen"
      class="lg:hidden bg-[#FCF9F7] border-b border-[#EEDCD5] px-4 pt-2 pb-6 space-y-3 shadow-lg"
    >
      <div class="flex flex-col space-y-2">
        <router-link
          to="/"
          @click="mobileMenuOpen = false"
          class="px-3 py-2 text-sm font-medium uppercase tracking-wider rounded-lg"
          :class="isActive('/') ? 'bg-[#4A1521] text-white' : 'text-[#4A1521] hover:bg-[#EEDCD5]/40'"
        >
          Inicio
        </router-link>

        <router-link
          to="/tienda"
          @click="mobileMenuOpen = false"
          class="px-3 py-2 text-sm font-medium uppercase tracking-wider rounded-lg"
          :class="isActive('/tienda') ? 'bg-[#4A1521] text-white' : 'text-[#4A1521] hover:bg-[#EEDCD5]/40'"
        >
          Catálogo Completo
        </router-link>

        <!-- Exclusivo Admin en Mobile -->
        <router-link
          v-if="isAdmin"
          to="/alta"
          @click="mobileMenuOpen = false"
          class="px-3 py-2 text-sm font-semibold uppercase tracking-wider rounded-lg bg-[#4A1521]/10 text-[#4A1521] flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Nueva Fragancia</span>
        </router-link>

        <router-link
          v-if="isAdmin"
          to="/admin"
          @click="mobileMenuOpen = false"
          class="px-3 py-2 text-sm font-semibold uppercase tracking-wider rounded-lg bg-[#4A1521] text-white flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          <span>Panel de Administrador</span>
        </router-link>

        <router-link
          to="/nosotros"
          @click="mobileMenuOpen = false"
          class="px-3 py-2 text-sm font-medium uppercase tracking-wider rounded-lg"
          :class="isActive('/nosotros') ? 'bg-[#4A1521] text-white' : 'text-[#4A1521] hover:bg-[#EEDCD5]/40'"
        >
          El Atelier
        </router-link>

        <router-link
          to="/contacto"
          @click="mobileMenuOpen = false"
          class="px-3 py-2 text-sm font-medium uppercase tracking-wider rounded-lg"
          :class="isActive('/contacto') ? 'bg-[#4A1521] text-white' : 'text-[#4A1521] hover:bg-[#EEDCD5]/40'"
        >
          Contacto
        </router-link>
      </div>

      <div class="pt-3 border-t border-[#EEDCD5]">
        <button
          v-if="!currentUser"
          type="button"
          @click="() => { mobileMenuOpen = false; emit('openAuth', 'login'); }"
          class="w-full py-2.5 px-4 rounded-lg bg-[#4A1521] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">account_circle</span>
          <span>Iniciar Sesión / Registro</span>
        </button>

        <div v-else class="flex items-center justify-between">
          <div class="text-xs">
            <span class="font-medium text-[#4A1521]">{{ currentUser.nombre }}</span>
            <span class="text-gray-500 block text-[10px]">{{ currentUser.email }}</span>
          </div>
          <button
            type="button"
            @click="() => { mobileMenuOpen = false; handleLogout(); }"
            class="text-xs text-red-700 font-medium px-3 py-1.5 rounded-md hover:bg-red-50"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import AromanciaLogo from './AromanciaLogo.vue';
import { currentUser, isAdmin, cartCount, logoutUser } from '../store';

const emit = defineEmits<{
  (e: 'openCart'): void;
  (e: 'openSearch'): void;
  (e: 'openAuth', mode: 'login' | 'register' | 'admin'): void;
}>();

const route = useRoute();
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);

const isActive = (path: string) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

const handleLogout = () => {
  userMenuOpen.value = false;
  logoutUser();
};
</script>
