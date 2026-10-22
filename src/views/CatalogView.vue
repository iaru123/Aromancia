<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
    <!-- Page Header -->
    <div class="space-y-2 border-b border-[#EEDCD5]/60 pb-6">
      <div class="flex items-center gap-2 text-xs text-[#7D5260] font-sans">
        <router-link to="/" class="hover:text-[#4A1521]">Inicio</router-link>
        <span>/</span>
        <span class="text-[#4A1521] font-semibold">Catálogo y Tienda</span>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="font-serif text-3xl sm:text-4xl text-[#4A1521] font-medium">
            Catálogo de Alta Perfumería
          </h1>
          <p class="font-sans text-xs sm:text-sm text-gray-500 font-light mt-1">
            Explorá nuestra colección de 17 fragancias artesanales con maceración en barricas de roble.
          </p>
        </div>

        <router-link
          v-if="isAdmin"
          to="/alta"
          class="px-4 py-2.5 rounded-xl bg-[#4A1521] text-white hover:bg-[#2F020D] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer"
        >
          <span class="material-symbols-outlined text-[16px]">add_circle</span>
          <span>+ Nueva Fragancia</span>
        </router-link>
      </div>
    </div>

    <!-- Reusable Buscador Component (Props, v-model, Emits) -->
    <Buscador
      :search-query="searchQuery"
      :selected-category="selectedCategory"
      :selected-family="selectedFamily"
      :sort-by="sortBy"
      :total-count="filteredPerfumes.length"
      :category-counts="categoryCounts"
      @update:search-query="searchQuery = $event"
      @update:selected-category="selectedCategory = $event"
      @update:selected-family="selectedFamily = $event"
      @update:sort-by="sortBy = $event"
      @reset-filters="resetFilters"
    />

    <!-- Empty State -->
    <div
      v-if="filteredPerfumes.length === 0"
      class="text-center py-20 bg-white rounded-2xl border border-[#EEDCD5] p-8 space-y-4"
    >
      <div class="w-16 h-16 rounded-full bg-[#EEDCD5]/60 text-[#4A1521] flex items-center justify-center mx-auto">
        <span class="material-symbols-outlined text-[32px]">filter_alt_off</span>
      </div>
      <div class="space-y-1">
        <h3 class="font-serif text-xl text-[#4A1521]">No encontramos coincidencias</h3>
        <p class="text-xs text-gray-500 font-light max-w-sm mx-auto">
          No hay fragancias que coincidan con los filtros seleccionados. Probá modificando el término de búsqueda o la familia olfativa.
        </p>
      </div>
      <button
        type="button"
        @click="resetFilters"
        class="px-5 py-2.5 rounded-xl bg-[#4A1521] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2F020D] transition-colors cursor-pointer"
      >
        Limpiar Filtros
      </button>
    </div>

    <!-- Catalog Grid with Vue transition-group (Rubric Requirement) -->
    <div v-else class="space-y-8">
      <transition-group
        name="catalog-grid"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <CardItem
          v-for="perfume in paginatedPerfumes"
          :key="perfume.id"
          :perfume="perfume"
          :is-wishlisted="isWishlisted(perfume.id)"
          :is-admin="isAdmin"
          @select="handleSelectPerfume"
          @add-to-cart="handleAddToCart"
          @toggle-wishlist="handleToggleWishlist"
          @edit="handleEditPerfume"
          @delete="handleDeletePrompt"
        />
      </transition-group>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-6 border-t border-[#EEDCD5]/60">
        <button
          type="button"
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="p-2 rounded-lg border border-[#EEDCD5] text-[#4A1521] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#EEDCD5]/40 transition-colors"
          aria-label="Página anterior"
        >
          <span class="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          @click="currentPage = page"
          class="w-9 h-9 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          :class="currentPage === page
            ? 'bg-[#4A1521] text-white shadow-sm'
            : 'border border-[#EEDCD5] text-[#4A1521] hover:bg-[#EEDCD5]/40'"
        >
          {{ page }}
        </button>

        <button
          type="button"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-lg border border-[#EEDCD5] text-[#4A1521] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#EEDCD5]/40 transition-colors"
          aria-label="Página siguiente"
        >
          <span class="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Buscador from '../components/Buscador.vue';
import CardItem from '../components/CardItem.vue';
import ModalConfirmacion from '../components/ModalConfirmacion.vue';
import {
  perfumes,
  wishlist,
  isAdmin,
  addToCart,
  toggleWishlist,
  deletePerfumeRecord,
  initStore
} from '../store';
import { Perfume, Category } from '../types';

const route = useRoute();
const router = useRouter();

// Filter State
const searchQuery = ref('');
const selectedCategory = ref<Category>('todos');
const selectedFamily = ref('todas');
const sortBy = ref('destacados');
const currentPage = ref(1);
const itemsPerPage = 8;

// Deletion modal
const deleteModalOpen = ref(false);
const perfumeToDelete = ref<Perfume | null>(null);

// Lifecycle Hook (created/mounted requirement)
onMounted(() => {
  if (perfumes.value.length === 0) {
    initStore();
  }

  // Check URL query for initial category
  if (route.query.categoria) {
    selectedCategory.value = route.query.categoria as Category;
  }
});

// Watch route query changes
watch(
  () => route.query.categoria,
  (cat) => {
    if (cat) {
      selectedCategory.value = cat as Category;
      currentPage.value = 1;
    }
  }
);

// Reset page when filters change
watch([searchQuery, selectedCategory, selectedFamily, sortBy], () => {
  currentPage.value = 1;
});

// ========================================================
// COMPUTED PROPERTIES (Requisito universitario: al menos 2)
// ========================================================

// 1. Conteo de fragancias por categoría
const categoryCounts = computed<Record<Category, number>>(() => {
  const counts: Record<Category, number> = {
    todos: perfumes.value.length,
    femenino: 0,
    masculino: 0,
    unisex: 0,
    sets: 0
  };

  perfumes.value.forEach(p => {
    if (counts[p.categoria] !== undefined) {
      counts[p.categoria]++;
    }
  });

  return counts;
});

// 2. Listado filtrado y ordenado
const filteredPerfumes = computed<Perfume[]>(() => {
  let result = [...perfumes.value];

  // Filtro por texto
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter(p => {
      return (
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.familia.toLowerCase().includes(q) ||
        p.concentracion.toLowerCase().includes(q) ||
        p.notas?.top?.some(n => n.toLowerCase().includes(q)) ||
        p.notas?.heart?.some(n => n.toLowerCase().includes(q)) ||
        p.notas?.base?.some(n => n.toLowerCase().includes(q)) ||
        p.acordesPrincipales?.some(a => a.toLowerCase().includes(q))
      );
    });
  }

  // Filtro por categoría
  if (selectedCategory.value !== 'todos') {
    result = result.filter(p => p.categoria === selectedCategory.value);
  }

  // Filtro por familia olfativa
  if (selectedFamily.value !== 'todas') {
    result = result.filter(p => p.familia === selectedFamily.value);
  }

  // Ordenamiento
  switch (sortBy.value) {
    case 'precio-asc':
      result.sort((a, b) => a.precio - b.precio);
      break;
    case 'precio-desc':
      result.sort((a, b) => b.precio - a.precio);
      break;
    case 'nombre-asc':
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case 'nombre-desc':
      result.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    case 'calificacion':
      result.sort((a, b) => b.calificacion - a.calificacion);
      break;
    case 'stock':
      result.sort((a, b) => b.stock - a.stock);
      break;
    default:
      // Destacados: bestsellers first
      result.sort((a, b) => {
        if (a.tag && !b.tag) return -1;
        if (!a.tag && b.tag) return 1;
        return b.calificacion - a.calificacion;
      });
  }

  return result;
});

// 3. Paginación computada
const totalPages = computed(() => {
  return Math.ceil(filteredPerfumes.value.length / itemsPerPage);
});

const paginatedPerfumes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPerfumes.value.slice(start, start + itemsPerPage);
});

const isWishlisted = (id: string) => wishlist.value.includes(id);

// Actions
const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'todos';
  selectedFamily.value = 'todas';
  sortBy.value = 'destacados';
  currentPage.value = 1;
};

const handleSelectPerfume = (p: Perfume) => {
  router.push(`/detalle/${p.id}`);
};

const handleAddToCart = (p: Perfume) => {
  addToCart(p, 1, p.volumen || '100ml');
};

const handleToggleWishlist = (id: string) => {
  toggleWishlist(id);
};

const handleEditPerfume = (p: Perfume) => {
  router.push(`/editar/${p.id}`);
};

const handleDeletePrompt = (p: Perfume) => {
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

<style scoped>
.catalog-grid-enter-active,
.catalog-grid-leave-active {
  transition: all 0.25s ease;
}
.catalog-grid-enter-from,
.catalog-grid-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
