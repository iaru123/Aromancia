<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="emit('cancel')"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#EEDCD5] space-y-5 animate-in zoom-in-95 duration-200"
      >
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <span class="material-symbols-outlined text-[28px]">warning</span>
        </div>

        <div class="text-center space-y-2">
          <h3 class="font-serif text-xl sm:text-2xl text-[#4A1521] font-medium">
            ¿Confirmar eliminación?
          </h3>
          <p class="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            Estás a punto de retirar del catálogo la fragancia
            <strong class="text-[#4A1521] font-semibold">"{{ perfume?.nombre }}"</strong>.
            Esta acción modificará la persistencia en LocalStorage.
          </p>
        </div>

        <div v-if="perfume" class="p-3 bg-[#FCF9F7] rounded-xl border border-[#EEDCD5] flex items-center gap-3">
          <img
            :src="perfume.imagen"
            :alt="perfume.nombre"
            class="w-12 h-12 object-cover rounded-lg border border-[#EEDCD5]"
          />
          <div class="text-left text-xs space-y-0.5 flex-1 min-w-0">
            <p class="font-medium text-[#4A1521] truncate">{{ perfume.nombre }}</p>
            <p class="text-gray-500 text-[11px]">{{ perfume.categoria }} · {{ perfume.familia }}</p>
            <p class="text-[#7D5260] font-semibold">${{ Number(perfume.precio).toLocaleString('es-AR') }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            @click="emit('cancel')"
            class="w-full py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="emit('confirm')"
            class="w-full py-2.5 px-4 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">delete_forever</span>
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Perfume } from '../types';

defineProps<{
  isOpen: boolean;
  perfume: Perfume | null;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
