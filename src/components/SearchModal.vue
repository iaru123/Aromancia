<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 md:p-12"
      @click.self="emit('close')"
    >
      <div
        class="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EEDCD5] relative animate-in zoom-in-95 duration-200 my-4 sm:my-8"
      >
        <!-- Modal Header with Atelier Branding -->
        <div class="p-4 sm:p-5 border-b border-[#EEDCD5] bg-[#FCF9F7] space-y-3">
          <!-- Search Input Bar -->
          <div class="flex items-center gap-3 bg-white px-3.5 py-2.5 rounded-xl border border-[#EEDCD5] focus-within:border-[#4A1521] focus-within:ring-2 focus-within:ring-[#4A1521]/15 transition-all shadow-2xs">
            <span class="material-symbols-outlined text-[22px] text-[#4A1521] shrink-0">search</span>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Buscar por nombre de producto, nota olfativa (vainilla, jazmín, oud), fecha..."
              class="flex-1 bg-transparent text-xs sm:text-sm text-[#1B1C1B] placeholder:text-gray-400 focus:outline-none"
            />
            <button
              v-if="query"
              type="button"
              @click="query = ''"
              class="text-gray-400 hover:text-[#4A1521] p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              title="Borrar texto"
            >
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
            <button
              type="button"
              @click="emit('close')"
              class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-[#4A1521] px-2 py-1 rounded-md bg-gray-100 hover:bg-[#EEDCD5]/60 transition-colors cursor-pointer shrink-0"
            >
              ESC
            </button>
          </div>

          <!-- FILTRO POR CATEGORÍA (Pills con Conteo) -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-[11px]">
              <span class="font-semibold uppercase tracking-wider text-[#4A1521] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[14px]">tune</span>
                Filtrar por Categoría:
              </span>
              <button
                v-if="hasActiveFilters"
                type="button"
                @click="resetAllFilters"
                class="text-[11px] text-[#7D5260] hover:text-[#4A1521] underline cursor-pointer"
              >
                Restablecer todos los filtros
              </button>
            </div>

            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                v-for="cat in categoryOptions"
                :key="cat.value"
                type="button"
                @click="selectedCategory = cat.value"
                class="px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5"
                :class="selectedCategory === cat.value
                  ? 'bg-[#4A1521] text-white shadow-xs'
                  : 'bg-white text-[#7D5260] hover:text-[#4A1521] hover:bg-[#EEDCD5]/50 border border-[#EEDCD5]'"
              >
                <span>{{ cat.label }}</span>
                <span
                  class="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
                  :class="selectedCategory === cat.value ? 'bg-white/20 text-white' : 'bg-black/5 text-[#7D5260]'"
                >
                  {{ getCategoryCount(cat.value) }}
                </span>
              </button>
            </div>
          </div>

          <!-- FILTROS COMPLEMENTARIOS: NOMBRE, PRECIO, FECHA Y AROMA -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#EEDCD5]/70">
            <!-- 1. FILTRO POR AROMA / FAMILIA OLFATIVA -->
            <div class="space-y-1">
              <label class="block text-[10px] font-semibold uppercase tracking-wider text-[#4A1521] flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">psychiatry</span>
                <span>Aroma / Familia</span>
              </label>
              <select
                v-model="selectedAroma"
                class="w-full text-xs py-1.5 px-2 rounded-lg bg-white border border-[#EEDCD5] text-[#4A1521] focus:outline-none focus:border-[#4A1521] cursor-pointer"
              >
                <option value="todos">Todos los aromas</option>
                <option value="Floral">Floral (Loto, Jazmín, Rosa)</option>
                <option value="Amaderado">Amaderado (Ébano, Cedro)</option>
                <option value="Oriental">Oriental (Ámbar, Incienso)</option>
                <option value="Gourmand">Gourmand (Vainilla, Haba Tonka)</option>
                <option value="Cítrico">Cítrico (Bergamota, Mandarina)</option>
                <option value="Chypre">Chypre (Musgo, Pachulí)</option>
                <option value="Cuero">Cuero (Ahumado noble)</option>
                <option value="Sets y Regalos">Sets y Regalos</option>
              </select>
            </div>

            <!-- 2. FILTRO POR PRECIO -->
            <div class="space-y-1">
              <label class="block text-[10px] font-semibold uppercase tracking-wider text-[#4A1521] flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">payments</span>
                <span>Precio</span>
              </label>
              <select
                v-model="selectedPrecio"
                class="w-full text-xs py-1.5 px-2 rounded-lg bg-white border border-[#EEDCD5] text-[#4A1521] focus:outline-none focus:border-[#4A1521] cursor-pointer"
              >
                <option value="todos">Cualquier precio</option>
                <option value="menor-mayor">Menor a Mayor</option>
                <option value="mayor-menor">Mayor a Menor</option>
                <option value="hasta-30000">Hasta $30.000</option>
                <option value="30000-40000">$30.000 a $40.000</option>
                <option value="mas-40000">Más de $40.000</option>
              </select>
            </div>

            <!-- 3. FILTRO POR FECHA -->
            <div class="space-y-1">
              <label class="block text-[10px] font-semibold uppercase tracking-wider text-[#4A1521] flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">calendar_today</span>
                <span>Fecha</span>
              </label>
              <select
                v-model="selectedFecha"
                class="w-full text-xs py-1.5 px-2 rounded-lg bg-white border border-[#EEDCD5] text-[#4A1521] focus:outline-none focus:border-[#4A1521] cursor-pointer"
              >
                <option value="todas">Cualquier fecha</option>
                <option value="recientes">Más recientes (Novedad)</option>
                <option value="antiguos">Más antiguos (Clásicos)</option>
              </select>
            </div>

            <!-- 4. ORDEN POR NOMBRE DE PRODUCTO -->
            <div class="space-y-1">
              <label class="block text-[10px] font-semibold uppercase tracking-wider text-[#4A1521] flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">sort_by_alpha</span>
                <span>Nombre Producto</span>
              </label>
              <select
                v-model="selectedNombre"
                class="w-full text-xs py-1.5 px-2 rounded-lg bg-white border border-[#EEDCD5] text-[#4A1521] focus:outline-none focus:border-[#4A1521] cursor-pointer"
              >
                <option value="relevancia">Recomendados</option>
                <option value="asc">Nombre: A → Z</option>
                <option value="desc">Nombre: Z → A</option>
                <option value="calificacion">Mayor Calificación</option>
              </select>
            </div>
          </div>

          <!-- CHIPS DE AROMA RÁPIDOS -->
          <div class="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
            <span class="text-[10px] uppercase font-semibold text-gray-400 shrink-0">Aromas populares:</span>
            <button
              v-for="aroma in popularScents"
              :key="aroma"
              type="button"
              @click="toggleAromaFilter(aroma)"
              class="px-2 py-0.5 rounded-md text-[10px] font-medium border transition-colors cursor-pointer shrink-0"
              :class="query.toLowerCase().includes(aroma.toLowerCase())
                ? 'bg-[#4A1521] text-white border-[#4A1521]'
                : 'bg-white text-gray-600 border-[#EEDCD5] hover:border-[#4A1521] hover:text-[#4A1521]'"
            >
              {{ aroma }}
            </button>
          </div>
        </div>

        <!-- Search Results List -->
        <div class="max-h-[50vh] sm:max-h-[55vh] overflow-y-auto p-4 sm:p-5 space-y-2.5 divide-y divide-[#EEDCD5]/40">
          <div v-if="filtered.length === 0" class="text-center py-12 space-y-3">
            <div class="w-12 h-12 rounded-full bg-[#EEDCD5]/60 text-[#4A1521] flex items-center justify-center mx-auto">
              <span class="material-symbols-outlined text-[24px]">search_off</span>
            </div>
            <p class="text-xs text-gray-500 font-light max-w-sm mx-auto">
              No encontramos fragancias que coincidan con los filtros seleccionados (Categoría: <strong>{{ selectedCategory }}</strong>, Aroma: <strong>{{ selectedAroma }}</strong>, Precio: <strong>{{ selectedPrecio }}</strong>, Fecha: <strong>{{ selectedFecha }}</strong>).
            </p>
            <button
              type="button"
              @click="resetAllFilters"
              class="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#4A1521] text-white hover:bg-[#2F020D] transition-colors cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>

          <div
            v-for="perfume in filtered"
            :key="perfume.id"
            @click="handleSelect(perfume)"
            class="flex items-center gap-3.5 pt-2.5 first:pt-0 rounded-xl hover:bg-[#FCF9F7] p-2 transition-all cursor-pointer group"
          >
            <img
              :src="perfume.imagen"
              :alt="perfume.nombre"
              class="w-14 h-16 sm:w-16 sm:h-18 object-cover rounded-xl border border-[#EEDCD5] group-hover:scale-105 transition-transform shrink-0"
            />
            <div class="flex-1 min-w-0 space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="font-serif text-sm sm:text-base font-medium text-[#1B1C1B] group-hover:text-[#4A1521] truncate">
                  {{ perfume.nombre }}
                </h4>
                <span class="text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#EEDCD5] text-[#4A1521]">
                  {{ perfume.categoria }}
                </span>
                <span v-if="perfume.tag" class="text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#4A1521] text-white">
                  {{ perfume.tag }}
                </span>
              </div>

              <!-- Familia y Notas de Aroma -->
              <p class="text-[11px] text-[#7D5260] flex items-center gap-1.5 truncate">
                <span class="material-symbols-outlined text-[13px] text-[#4A1521]">psychiatry</span>
                <span>Familia: <strong class="text-gray-800">{{ perfume.familia }}</strong></span>
                <span class="text-gray-300">·</span>
                <span class="text-gray-500 truncate">
                  {{ perfume.notas?.heart?.join(', ') || perfume.notas?.top?.join(', ') || perfume.descripcion }}
                </span>
              </p>

              <!-- Fecha de Lanzamiento / Incorporación -->
              <p class="text-[10px] text-gray-400 flex items-center gap-1">
                <span class="material-symbols-outlined text-[12px]">calendar_today</span>
                <span>Lanzamiento: {{ formatPerfumeDate(perfume.creadoEn) }}</span>
              </p>
            </div>

            <div class="text-right shrink-0 space-y-0.5">
              <p class="font-serif text-sm sm:text-base font-bold text-[#4A1521]">
                ${{ Number(perfume.precio).toLocaleString('es-AR') }}
              </p>
              <p v-if="perfume.precioOriginal" class="text-[10px] text-gray-400 line-through">
                ${{ Number(perfume.precioOriginal).toLocaleString('es-AR') }}
              </p>
              <span class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded block font-medium">
                {{ perfume.stock > 0 ? `${perfume.stock} en stock` : 'Agotado' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer Summary -->
        <div class="p-3.5 bg-[#FCF9F7] border-t border-[#EEDCD5] text-xs text-gray-600 flex items-center justify-between flex-wrap gap-2">
          <span>Mostrando <strong>{{ filtered.length }}</strong> fragancias encontradas</span>
          <router-link
            to="/tienda"
            @click="emit('close')"
            class="text-[#4A1521] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Explorar en Tienda Completa</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { perfumes } from '../store';
import { Perfume, Category } from '../types';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();
const inputRef = ref<HTMLInputElement | null>(null);

// Search & Filter State
const query = ref('');
const selectedCategory = ref<Category>('todos');
const selectedAroma = ref<string>('todos');
const selectedPrecio = ref<string>('todos');
const selectedFecha = ref<string>('todas');
const selectedNombre = ref<string>('relevancia');

const categoryOptions: { label: string; value: Category }[] = [
  { label: 'Todas', value: 'todos' },
  { label: 'Femenino', value: 'femenino' },
  { label: 'Masculino', value: 'masculino' },
  { label: 'Unisex', value: 'unisex' },
  { label: 'Sets', value: 'sets' }
];

const popularScents = ['Vainilla', 'Jazmín', 'Loto', 'Rosa', 'Bergamota', 'Sándalo', 'Oud', 'Cedro', 'Ámbar'];

// Focus input when opened
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
  }
);

const getCategoryCount = (cat: Category) => {
  if (cat === 'todos') return perfumes.value.length;
  return perfumes.value.filter(p => p.categoria === cat).length;
};

const hasActiveFilters = computed(() => {
  return (
    query.value.trim() !== '' ||
    selectedCategory.value !== 'todos' ||
    selectedAroma.value !== 'todos' ||
    selectedPrecio.value !== 'todos' ||
    selectedFecha.value !== 'todas' ||
    selectedNombre.value !== 'relevancia'
  );
});

const resetAllFilters = () => {
  query.value = '';
  selectedCategory.value = 'todos';
  selectedAroma.value = 'todos';
  selectedPrecio.value = 'todos';
  selectedFecha.value = 'todas';
  selectedNombre.value = 'relevancia';
};

const toggleAromaFilter = (aroma: string) => {
  if (query.value.toLowerCase().includes(aroma.toLowerCase())) {
    query.value = '';
  } else {
    query.value = aroma;
  }
};

const formatPerfumeDate = (dateStr: string) => {
  if (!dateStr) return '2025';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

// Filtered and Sorted Computation
const filtered = computed(() => {
  let list = [...perfumes.value];

  // 1. Filtro por Categoría
  if (selectedCategory.value !== 'todos') {
    list = list.filter(p => p.categoria === selectedCategory.value);
  }

  // 2. Filtro por Aroma / Familia Olfativa
  if (selectedAroma.value !== 'todos') {
    list = list.filter(p => p.familia === selectedAroma.value);
  }

  // 3. Filtro por Rango de Precio
  if (selectedPrecio.value === 'hasta-30000') {
    list = list.filter(p => p.precio <= 30000);
  } else if (selectedPrecio.value === '30000-40000') {
    list = list.filter(p => p.precio > 30000 && p.precio <= 40000);
  } else if (selectedPrecio.value === 'mas-40000') {
    list = list.filter(p => p.precio > 40000);
  }

  // 4. Búsqueda por texto (Nombre del producto, notas, acordes, descripción)
  if (query.value.trim()) {
    const q = query.value.toLowerCase().trim();
    list = list.filter(p => {
      const matchName = p.nombre.toLowerCase().includes(q);
      const matchDesc = p.descripcion.toLowerCase().includes(q);
      const matchFamily = p.familia.toLowerCase().includes(q);
      const matchCategory = p.categoria.toLowerCase().includes(q);
      const matchTop = p.notas?.top?.some(n => n.toLowerCase().includes(q));
      const matchHeart = p.notas?.heart?.some(n => n.toLowerCase().includes(q));
      const matchBase = p.notas?.base?.some(n => n.toLowerCase().includes(q));
      const matchAcordes = p.acordesPrincipales?.some(a => a.toLowerCase().includes(q));
      const matchDate = p.creadoEn?.includes(q);

      return (
        matchName ||
        matchDesc ||
        matchFamily ||
        matchCategory ||
        matchTop ||
        matchHeart ||
        matchBase ||
        matchAcordes ||
        matchDate
      );
    });
  }

  // 5. Ordenamiento (Precio, Fecha, Nombre Producto)
  if (selectedPrecio.value === 'menor-mayor') {
    list.sort((a, b) => a.precio - b.precio);
  } else if (selectedPrecio.value === 'mayor-menor') {
    list.sort((a, b) => b.precio - a.precio);
  } else if (selectedFecha.value === 'recientes') {
    list.sort((a, b) => (b.creadoEn || '').localeCompare(a.creadoEn || ''));
  } else if (selectedFecha.value === 'antiguos') {
    list.sort((a, b) => (a.creadoEn || '').localeCompare(b.creadoEn || ''));
  } else if (selectedNombre.value === 'asc') {
    list.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (selectedNombre.value === 'desc') {
    list.sort((a, b) => b.nombre.localeCompare(a.nombre));
  } else if (selectedNombre.value === 'calificacion') {
    list.sort((a, b) => b.calificacion - a.calificacion);
  }

  return list;
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
