<template>
  <div class="min-h-screen flex flex-col bg-[#FCF9F7] text-[#1B1C1B]">
    <!-- Navbar Component -->
    <Navbar
      @open-cart="cartDrawerOpen = true"
      @open-search="searchModalOpen = true"
      @open-auth="handleOpenAuth"
    />

    <!-- Main Router View with Vue transition -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="view-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer Component (Contains Administrator Login in the footer) -->
    <Footer />

    <!-- Shopping Cart Drawer Overlay with transition-group -->
    <CartDrawer
      :is-open="cartDrawerOpen"
      @close="cartDrawerOpen = false"
    />

    <!-- Search Modal Overlay -->
    <SearchModal
      :is-open="searchModalOpen"
      @close="searchModalOpen = false"
    />

    <!-- Authentication Modal (Client Login/Register and Admin Login) -->
    <AuthModal
      :is-open="authModalOpen"
      :initial-mode="authModalMode"
      @close="authModalOpen = false"
    />

    <!-- Global Floating Toast Notification -->
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import CartDrawer from './components/CartDrawer.vue';
import SearchModal from './components/SearchModal.vue';
import AuthModal from './components/AuthModal.vue';
import ToastNotification from './components/ToastNotification.vue';
import {
  initStore,
  cartDrawerOpen,
  searchModalOpen,
  authModalOpen,
  authModalMode,
  openAuthModal,
  showToast
} from './store';

const route = useRoute();

// Lifecycle hook: initialize store from LocalStorage
onMounted(() => {
  initStore();
});

// Watch for redirect with requireAdmin query
watch(
  () => route.query.requireAdmin,
  (val) => {
    if (val === '1') {
      openAuthModal('admin');
      showToast(
        'Acceso Restringido',
        'Debés iniciar sesión como Administrador para acceder a esta sección del Atelier.'
      );
    }
  },
  { immediate: true }
);

const handleOpenAuth = (mode: 'login' | 'register' | 'admin') => {
  openAuthModal(mode);
};
</script>

<style>
.view-fade-enter-active,
.view-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.view-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.view-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
