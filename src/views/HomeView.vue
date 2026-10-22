<template>
  <div class="space-y-16 pb-16">
    <!-- Luxury Editorial Hero Banner -->
    <section class="relative bg-[#2F020D] text-white overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-center">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=2000&q=85"
          alt="Aromancia Haute Parfumerie Atelier"
          class="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 animate-pulse duration-10000"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#2F020D] via-[#2F020D]/85 to-transparent"></div>
        <div class="absolute inset-0 bg-radial from-transparent to-[#2F020D]/90"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-2xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs text-[#EBD9D2] text-[11px] font-sans font-semibold tracking-[0.25em] uppercase">
            <span class="w-1.5 h-1.5 rounded-full bg-[#EBD9D2]"></span>
            <span>Edición Limitada 2025 · Cosecha de Otoño</span>
          </div>

          <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight">
            El arte de lo <span class="italic font-normal text-[#EBD9D2]">invisible</span>.
          </h1>

          <p class="font-sans text-sm sm:text-base text-[#EBD9D2]/85 font-light leading-relaxed max-w-xl">
            Maceraciones botánicas puras creadas con la paciencia de la alta perfumería artesanal. Acordes vivos que reaccionan con la química única de tu piel.
          </p>

          <div class="pt-4 flex flex-wrap items-center gap-4">
            <router-link
              to="/tienda"
              class="px-8 py-4 rounded-xl bg-white text-[#4A1521] hover:bg-[#EBD9D2] text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Explorar Catálogo</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </router-link>

            <router-link
              to="/nosotros"
              class="px-8 py-4 rounded-xl bg-transparent text-white border border-white/30 hover:border-white hover:bg-white/10 text-xs font-semibold uppercase tracking-[0.2em] transition-all active:scale-95 cursor-pointer"
            >
              <span>El Atelier</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Circular Categories Rail (Screenshot matching) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center space-y-2 mb-8">
        <span class="text-[11px] uppercase tracking-[0.3em] font-medium text-[#7D5260]">
          Exploración por Universos
        </span>
        <h2 class="font-serif text-2xl sm:text-3xl text-[#4A1521] font-medium">
          Colecciones del Atelier
        </h2>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="cat in categoryTiles"
          :key="cat.value"
          @click="navigateCategory(cat.value)"
          class="group bg-white rounded-2xl p-5 border border-[#EEDCD5] hover:border-[#4A1521]/40 shadow-xs hover:shadow-lg transition-all duration-300 text-center cursor-pointer flex flex-col items-center space-y-3"
        >
          <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#EEDCD5] group-hover:scale-105 group-hover:border-[#4A1521] transition-all duration-300 shadow-sm">
            <img :src="cat.image" :alt="cat.label" class="w-full h-full object-cover" />
          </div>
          <div>
            <h3 class="font-serif text-base sm:text-lg font-medium text-[#1B1C1B] group-hover:text-[#4A1521] transition-colors">
              {{ cat.label }}
            </h3>
            <p class="text-[11px] text-gray-500 font-light mt-0.5">{{ cat.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Fragrances Grid with Vue transition-group -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EEDCD5]/60 pb-4">
        <div class="space-y-1">
          <span class="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#4A1521]">
            Selección Exclusiva
          </span>
          <h2 class="font-serif text-2xl sm:text-4xl text-[#4A1521] font-medium">
            Fragancias Destacadas
          </h2>
          <p class="text-xs text-gray-500 font-light">
            Las creaciones olfativas más aclamadas de nuestro catálogo en frascos artesanales.
          </p>
        </div>

        <router-link
          to="/tienda"
          class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4A1521] hover:underline cursor-pointer"
        >
          <span>Ver las {{ perfumes.length }} creaciones</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </router-link>
      </div>

      <!-- CardItem Component Instances with transition-group -->
      <transition-group
        name="card-grid"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <CardItem
          v-for="perfume in featuredPerfumes"
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
    </section>

    <!-- Scent Finder / Interactive Olfactory Quiz Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-br from-[#4A1521] to-[#2F020D] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div class="relative z-10 max-w-xl space-y-5">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#EBD9D2] text-[10px] font-semibold tracking-widest uppercase">
            <span class="material-symbols-outlined text-[14px]">psychology</span>
            <span>DIAGNÓSTICO OLFATIVO PERSONALIZADO</span>
          </div>

          <h3 class="font-serif text-3xl sm:text-4xl font-normal text-white">
            ¿Buscás una fragancia para tu personalidad?
          </h3>

          <p class="font-sans text-xs sm:text-sm text-[#EBD9D2]/85 font-light leading-relaxed">
            Respondé una sencilla pregunta sobre tus momentos favoritos y te revelaremos la fragancia de autor perfecta para vos.
          </p>

          <div class="space-y-3 pt-2">
            <span class="text-xs font-semibold text-[#EBD9D2] uppercase tracking-wider block">
              ¿Qué atmósfera te inspira más calma y plenitud?
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                v-for="quiz in quizOptions"
                :key="quiz.id"
                type="button"
                @click="selectedQuiz = quiz"
                class="p-3 rounded-xl text-left text-xs transition-all border cursor-pointer"
                :class="selectedQuiz?.id === quiz.id
                  ? 'bg-white text-[#4A1521] border-white font-medium shadow-md'
                  : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'"
              >
                {{ quiz.answer }}
              </button>
            </div>

            <div v-if="selectedQuiz" class="p-4 rounded-xl bg-white/15 border border-white/20 mt-4 space-y-2 animate-in fade-in">
              <p class="text-xs text-[#EBD9D2] font-medium">Recomendación de nuestro Maestro Perfumista:</p>
              <h4 class="font-serif text-lg text-white font-semibold">{{ selectedQuiz.perfumeName }}</h4>
              <p class="text-xs text-white/80 font-light">{{ selectedQuiz.notes }}</p>
              <button
                type="button"
                @click="$router.push(`/detalle/${selectedQuiz.perfumeId}`)"
                class="mt-2 px-4 py-2 bg-white text-[#4A1521] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#EBD9D2] transition-colors"
              >
                Ver Fragancia Recomendada
              </button>
            </div>
          </div>
        </div>

        <div class="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      </div>
    </section>

    <!-- Trust Indicators / Guarantees -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-[#EEDCD5]/60">
        <div class="flex items-center gap-4 p-4">
          <div class="w-12 h-12 rounded-full bg-[#EEDCD5]/60 text-[#4A1521] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[24px]">local_shipping</span>
          </div>
          <div>
            <h4 class="font-serif text-sm font-medium text-[#4A1521]">Envíos a todo el país</h4>
            <p class="text-xs text-gray-500 font-light mt-0.5">Sin cargo en compras desde $50.000 con embalaje térmico.</p>
          </div>
        </div>

        <div class="flex items-center gap-4 p-4">
          <div class="w-12 h-12 rounded-full bg-[#EEDCD5]/60 text-[#4A1521] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[24px]">science</span>
          </div>
          <div>
            <h4 class="font-serif text-sm font-medium text-[#4A1521]">Muestras de Cortesía</h4>
            <p class="text-xs text-gray-500 font-light mt-0.5">2 viales sorpresa en cada compra para descubrir nuevos aromas.</p>
          </div>
        </div>

        <div class="flex items-center gap-4 p-4">
          <div class="w-12 h-12 rounded-full bg-[#EEDCD5]/60 text-[#4A1521] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[24px]">credit_card</span>
          </div>
          <div>
            <h4 class="font-serif text-sm font-medium text-[#4A1521]">3 Cuotas sin Interés</h4>
            <p class="text-xs text-gray-500 font-light mt-0.5">Con todas las tarjetas de crédito o 10% OFF por transferencia.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Deletion Confirmation Modal Instance -->
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
import { useRouter } from 'vue-router';
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

const router = useRouter();

// ==========================================
// CICLO DE VIDA (Requisito Universitario: created / mounted)
// ==========================================
onMounted(() => {
  if (perfumes.value.length === 0) {
    initStore();
  }
});

// Categories for rail
const categoryTiles = [
  {
    label: 'Femenino',
    value: 'femenino' as Category,
    description: 'Bouquets florales y acordes solares',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Masculino',
    value: 'masculino' as Category,
    description: 'Maderas nobles, tabaco y especias',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Unisex',
    value: 'unisex' as Category,
    description: 'Composiciones neutras de autor',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Sets & Regalos',
    value: 'sets' as Category,
    description: 'Cofres de descubrimiento de lujo',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=400&q=80'
  }
];

// Computed Properties (Requisito de rúbrica)
const featuredPerfumes = computed(() => {
  return perfumes.value.slice(0, 8);
});

const isWishlisted = (id: string) => wishlist.value.includes(id);

// Quiz Options
const quizOptions = [
  {
    id: 1,
    answer: 'Un amanecer brumoso en un jardín botánico húmedo',
    perfumeName: 'Flor de Loto · Eau de Parfum',
    perfumeId: 'perfume-01',
    notes: 'Loto azul, jazmín blanco y rocío de bambú.'
  },
  {
    id: 2,
    answer: 'Una noche íntima en una biblioteca con sillones de cuero y maderas',
    perfumeName: 'Noir Absolu · Extrait de Parfum',
    perfumeId: 'perfume-03',
    notes: 'Oud camboyano, cuero toscano y vainilla bourbon.'
  },
  {
    id: 3,
    answer: 'Un paseo al atardecer entre rosas damascenas y cítricos italianos',
    perfumeName: 'Rosé Éclat · Eau de Parfum',
    perfumeId: 'perfume-02',
    notes: 'Rosa de Grasse, lichi rosado y almizcle blanco.'
  },
  {
    id: 4,
    answer: 'El bosque patagónico después de la lluvia entre cedros y musgo',
    perfumeName: 'Cédre Noble · Eau de Parfum',
    perfumeId: 'perfume-06',
    notes: 'Cedro del Atlas, ciprés verde y vetiver de Haití.'
  }
];

const selectedQuiz = ref<any>(null);

// Modal state
const deleteModalOpen = ref(false);
const perfumeToDelete = ref<Perfume | null>(null);

// Event Handlers
const navigateCategory = (cat: Category) => {
  router.push({ path: '/tienda', query: { categoria: cat } });
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
.card-grid-enter-active,
.card-grid-leave-active {
  transition: all 0.3s ease;
}
.card-grid-enter-from,
.card-grid-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
