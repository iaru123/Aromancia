<template>
  <footer class="bg-[#2F020D] text-[#FCF9F7] pt-16 pb-12 border-t border-[#4A1521]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
        <!-- Col 1: Brand & Philosophy -->
        <div class="lg:col-span-2 space-y-4">
          <router-link to="/" class="inline-block">
            <AromanciaLogo variant="light" size="lg" />
          </router-link>
          <p class="font-sans text-xs sm:text-sm text-[#EBD9D2]/75 leading-relaxed font-light max-w-sm">
            Casa de alta perfumería artesanal. Fórmulas botánicas puras, maceradas lentamente en nuestro atelier con ingredientes de recolección sostenible de Grasse y la Patagonia.
          </p>
          <div class="pt-2 flex items-center gap-3 text-xs text-[#EBD9D2]">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px]">
              <span class="material-symbols-outlined text-[14px] text-[#EBD9D2]">verified</span>
              Cruelty Free & Vegano
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px]">
              <span class="material-symbols-outlined text-[14px] text-[#EBD9D2]">eco</span>
              Envases Recargables
            </span>
          </div>
        </div>

        <!-- Col 2: Navigation Links -->
        <div class="space-y-3">
          <h4 class="font-serif text-sm tracking-wider uppercase text-white font-medium">
            Navegación
          </h4>
          <ul class="space-y-2 text-xs font-sans text-[#EBD9D2]/80">
            <li>
              <router-link to="/" class="hover:text-white transition-colors">Inicio</router-link>
            </li>
            <li>
              <router-link to="/tienda" class="hover:text-white transition-colors">Catálogo de Fragancias</router-link>
            </li>
            <li>
              <router-link to="/nosotros" class="hover:text-white transition-colors">El Atelier y Filosofía</router-link>
            </li>
            <li>
              <router-link to="/contacto" class="hover:text-white transition-colors">Contacto y Asesoramiento</router-link>
            </li>
          </ul>
        </div>

        <!-- Col 3: Customer Care & Purchases -->
        <div class="space-y-3">
          <h4 class="font-serif text-sm tracking-wider uppercase text-white font-medium">
            Atención al Cliente
          </h4>
          <ul class="space-y-2 text-xs font-sans text-[#EBD9D2]/80">
            <li>
              <button
                type="button"
                @click="openAuthModal('login')"
                class="hover:text-white transition-colors cursor-pointer text-left"
              >
                Mi Cuenta / Iniciar Sesión
              </button>
            </li>
            <li>
              <button
                type="button"
                @click="openAuthModal('register')"
                class="hover:text-white transition-colors cursor-pointer text-left"
              >
                Registrarse como Comprador
              </button>
            </li>
            <li>
              <router-link to="/contacto" class="hover:text-white transition-colors">Envíos y Seguimiento</router-link>
            </li>
            <li>
              <router-link to="/contacto" class="hover:text-white transition-colors">Preguntas Frecuentes</router-link>
            </li>
          </ul>
        </div>

        <!-- Col 4: Newsletter Club Privé -->
        <div class="space-y-3">
          <h4 class="font-serif text-sm tracking-wider uppercase text-white font-medium">
            Club Privé Aromancia
          </h4>
          <p class="text-xs text-[#EBD9D2]/75 font-light leading-relaxed">
            Suscribite para recibir invitaciones a lanzamientos de edición limitada y 15% OFF en tu primer pedido.
          </p>
          <form @submit.prevent="handleNewsletter" class="space-y-2">
            <div class="relative">
              <input
                v-model="newsletterEmail"
                type="email"
                placeholder="tu@email.com"
                required
                class="w-full px-3 py-2 text-xs rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                class="absolute right-1 top-1 bottom-1 px-3 bg-white text-[#4A1521] hover:bg-[#EBD9D2] rounded-md text-xs font-semibold tracking-wider transition-colors cursor-pointer"
              >
                Unirse
              </button>
            </div>
            <p v-if="newsletterSuccess" class="text-[11px] text-emerald-300 flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px]">check_circle</span>
              ¡Gracias por sumarte a nuestro Club Privé!
            </p>
          </form>
        </div>
      </div>

      <!-- REQUISITO DEL FOOTER: INICIO DE SESIÓN DE ADMINISTRADOR -->
      <div class="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Brand Copyright -->
        <p class="text-xs text-[#EBD9D2]/60 font-sans text-center md:text-left">
          © {{ currentYear }} Aromancia Haute Parfumerie. Desarrollado para Programación II (Vue CLI / Single File Components).
        </p>

        <!-- BOTÓN O ACCESO DE ADMINISTRADOR EN EL FOOTER -->
        <div class="flex items-center gap-3">
          <template v-if="isAdmin">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Sesión Admin Activa</span>
              </span>
              <router-link
                to="/admin"
                class="px-3 py-1.5 rounded-lg bg-white/15 text-white hover:bg-white/25 text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-all"
              >
                <span class="material-symbols-outlined text-[15px]">dashboard</span>
                <span>Ir al Panel de Administrador</span>
              </router-link>
            </div>
          </template>

          <template v-else>
            <!-- Enlace requerido: Inicio de sesión de administrador -->
            <button
              type="button"
              @click="openAuthModal('admin')"
              class="group px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-xs text-[#EBD9D2] hover:text-white font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Acceso exclusivo para el Administrador del Atelier"
            >
              <span class="material-symbols-outlined text-[16px] text-[#EBD9D2] group-hover:text-white">
                admin_panel_settings
              </span>
              <span class="font-semibold tracking-wide">Inicio de sesión de Administrador</span>
            </button>
          </template>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AromanciaLogo from './AromanciaLogo.vue';
import { isAdmin, openAuthModal, showToast } from '../store';

const currentYear = new Date().getFullYear();
const newsletterEmail = ref('');
const newsletterSuccess = ref(false);

const handleNewsletter = () => {
  if (newsletterEmail.value) {
    newsletterSuccess.value = true;
    showToast('Club Privé', 'Te has suscripto exitosamente con 15% OFF.');
    newsletterEmail.value = '';
    setTimeout(() => {
      newsletterSuccess.value = false;
    }, 4000);
  }
};
</script>
