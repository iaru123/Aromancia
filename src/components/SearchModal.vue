<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 md:p-20"
      @click.self="emit('close')"
    >
      <div
        class="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#EEDCD5] relative animate-in zoom-in-95 duration-200"
      >
        <!-- Search Input Bar -->
        <div class="p-4 sm:p-5 border-b border-[#EEDCD5] flex items-center gap-3 bg-[#FCF9F7]">
          <span class="material-symbols-outlined text-[24px] text-[#4A1521]">search</span>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Buscar fragancias por nombre, notas (vainilla, jazmín), acordes..."
            class="flex-1 bg-transparent text-sm sm:text-base text-[#1B1C1B] placeholder:text-gray-400 focus:outline-none"
          />
          <button
            v-if="query"
            type="button"
            @click="query = ''"
            class="text-gray-400 hover:text-black p-1"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-[#4A1521] px-2 py-1 rounded cursor-pointer"
          >
            ESC
          </button>
        </div>

        <!-- Search Results List -->
        <div class="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-2">
          <div v-if="filtered.length === 0" class="text-center py-10 text-gray-400 text-xs">
            No encontramos fragancias que coincidan con "{{ query }}".
          </div>

          <div
            v-for="perfume in filtered"
            :key="perfume.id"
            @click="handleSelect(perfume)"
            class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FCF9F7] transition-colors cursor-pointer group border border-transparent hover:border-[#EEDCD5]"
          >
            <img
              :src="perfume.imagen"
              :alt="perfume.nombre"
              class="w-12 h-14 object-cover rounded-lg border border-[#EEDCD5]"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="font-serif text-sm font-medium text-[#1B1C1B] group-hover:text-[#4A1521] truncate">
                  {{ perfume.nombre }}
                </h4>
                <span class="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#EEDCD5] text-[#4A1521]">
                  {{ perfume.categoria }}
                </span>
              </div>
              <p class="text-[11px] text-gray-500 truncate">
                Notas: {{ perfume.notas?.heart?.join(', ') || perfume.familia }}
              </p>
            </div>
            <div class="text-right">
              <span class="font-serif text-sm font-bold text-[#4A1521]">
                ${{ Number(perfume.precio).toLocaleString('es-AR') }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-3 bg-[#FCF9F7] border-t border-[#EEDCD5] text-[11px] text-gray-500 flex items-center justify-between">
          <span>{{ filtered.length }} fragancias encontradas</span>
          <router-link
            to="/tienda"
            @click="emit('close')"
            class="text-[#4A1521] font-medium hover:underline"
          >
            Ver todo el catálogo →
          </router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { perfumes } from '../store';
import { Perfume } from '../types';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();
const query = ref('');

const filtered = computed(() => {
  if (!query.value.trim()) return perfumes.value.slice(0, 5);
  const q = query.value.toLowerCase();
  return perfumes.value.filter(p => {
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      p.familia.toLowerCase().includes(q) ||
      p.notas?.top?.some(n => n.toLowerCase().includes(q)) ||
      p.notas?.heart?.some(n => n.toLowerCase().includes(q)) ||
      p.notas?.base?.some(n => n.toLowerCase().includes(q))
    );
  });
});

const handleSelect = (perfume: Perfume) => {
  emit('close');
  router.push(`/detalle/${perfume.id}`);
};
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
