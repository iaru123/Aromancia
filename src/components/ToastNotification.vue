<template>
  <transition name="toast-slide">
    <div
      v-if="toast.show"
      class="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#2F020D] text-white p-4 rounded-2xl shadow-2xl border border-white/20 flex items-start gap-3 backdrop-blur-md"
    >
      <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#EBD9D2] mt-0.5">
        <span class="material-symbols-outlined text-[18px]">verified</span>
      </div>

      <div class="flex-1 min-w-0 space-y-0.5">
        <h4 class="font-serif text-sm font-medium text-white">{{ toast.message }}</h4>
        <p v-if="toast.submessage" class="text-xs text-[#EBD9D2]/80 font-light leading-relaxed">
          {{ toast.submessage }}
        </p>
        <button
          v-if="toast.actionText"
          type="button"
          @click="handleAction"
          class="text-xs font-semibold text-[#EBD9D2] hover:text-white underline pt-1 block cursor-pointer"
        >
          {{ toast.actionText }}
        </button>
      </div>

      <button
        type="button"
        @click="toast.show = false"
        class="text-white/60 hover:text-white p-1 cursor-pointer shrink-0"
        aria-label="Cerrar notificación"
      >
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { toast, cartDrawerOpen } from '../store';

const handleAction = () => {
  if (toast.value.actionText === 'VER BOLSA') {
    cartDrawerOpen.value = true;
    toast.value.show = false;
  }
};
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
