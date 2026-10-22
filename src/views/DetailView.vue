<template>
  <div v-if="perfume" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
    <!-- Breadcrumb Nav -->
    <nav class="flex items-center gap-2 text-xs text-[#7D5260] font-sans">
      <router-link to="/" class="hover:text-[#4A1521]">Inicio</router-link>
      <span>/</span>
      <router-link to="/tienda" class="hover:text-[#4A1521]">Catálogo</router-link>
      <span>/</span>
      <span class="text-[#4A1521] font-semibold">{{ perfume.nombre }}</span>
    </nav>

    <!-- Main Product Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <!-- Left: High-Res Imagery (6 cols) -->
      <div class="lg:col-span-6 space-y-4">
        <div class="relative aspect-4/5 rounded-2xl overflow-hidden bg-[#F6EEEC] border border-[#EEDCD5] shadow-lg">
          <img
            :src="perfume.imagen"
            :alt="perfume.nombre"
            class="w-full h-full object-cover object-center"
          />

          <!-- Wishlist Heart Button -->
          <button
            type="button"
            @click="toggleWishlist(perfume.id)"
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#4A1521] hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
            :title="isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'"
          >
            <span
              class="material-symbols-outlined text-[22px]"
              :class="isWishlisted ? 'text-[#4A1521] fill-current font-variation-fill' : 'text-gray-400'"
            >
              favorite
            </span>
          </button>

          <!-- Floating Tag -->
          <div v-if="perfume.tag" class="absolute top-4 left-4">
            <span class="px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wider uppercase bg-[#4A1521] text-white shadow-md">
              {{ perfume.tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Fragrance Information & Purchasing Module (6 cols) -->
      <div class="lg:col-span-6 space-y-6">
        <div class="space-y-2 border-b border-[#EEDCD5]/60 pb-5">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#EEDCD5] text-[#4A1521]">
              {{ perfume.categoria }}
            </span>
            <span class="text-xs text-[#7D5260] font-medium">Familia: {{ perfume.familia }}</span>
          </div>

          <h1 class="font-serif text-3xl sm:text-5xl text-[#1B1C1B] font-medium leading-tight">
            {{ perfume.nombre }}
          </h1>

          <div class="flex items-center gap-4 text-xs">
            <div class="flex items-center gap-1 text-[#4A1521]">
              <span class="material-symbols-outlined text-[16px] text-amber-500 fill-current">star</span>
              <span class="font-semibold text-sm">{{ perfume.calificacion }}</span>
              <span class="text-gray-400">({{ perfume.totalResenas }} opiniones verificadas)</span>
            </div>
            <span class="text-gray-300">|</span>
            <span class="text-[#7D5260] font-medium">{{ perfume.concentracion }}</span>
          </div>
        </div>

        <!-- Price & Volume Selection -->
        <div class="space-y-4">
          <div class="flex items-baseline gap-3">
            <span class="font-serif text-3xl sm:text-4xl font-bold text-[#4A1521]">
              ${{ Number(perfume.precio).toLocaleString('es-AR') }}
            </span>
            <span v-if="perfume.precioOriginal" class="text-sm text-gray-400 line-through">
              ${{ Number(perfume.precioOriginal).toLocaleString('es-AR') }}
            </span>
            <span class="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
              3 cuotas sin interés de ${{ Math.round(perfume.precio / 3).toLocaleString('es-AR') }}
            </span>
          </div>

          <!-- Presentación / Volumen -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
              Presentación de Frasco
            </label>
            <div class="flex items-center gap-3">
              <button
                v-for="vol in ['50ml', '100ml']"
                :key="vol"
                type="button"
                @click="selectedSize = vol"
                class="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer"
                :class="selectedSize === vol
                  ? 'border-[#4A1521] bg-[#4A1521] text-white shadow-sm'
                  : 'border-[#EEDCD5] bg-white text-[#4A1521] hover:bg-[#EEDCD5]/40'"
              >
                {{ vol }}
              </button>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
            Composición & Reseña Sensorial
          </h3>
          <p class="font-sans text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
            {{ perfume.descripcionLarga || perfume.descripcion }}
          </p>
        </div>

        <!-- Olfactory Pyramid (Salida, Corazón, Fondo) -->
        <div class="bg-[#FCF9F7] rounded-2xl p-5 border border-[#EEDCD5] space-y-4">
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
            <span class="material-symbols-outlined text-[18px]">psychiatry</span>
            <span>Pirámide Olfativa del Atelier</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="bg-white p-3 rounded-xl border border-[#EEDCD5]">
              <span class="text-[10px] uppercase font-bold text-[#7D5260] block mb-1">Notas de Salida (Top)</span>
              <p class="text-gray-700 font-medium">
                {{ perfume.notas?.top?.join(', ') || 'Cítricos botánicos, rocío fresco' }}
              </p>
            </div>
            <div class="bg-white p-3 rounded-xl border border-[#EEDCD5]">
              <span class="text-[10px] uppercase font-bold text-[#7D5260] block mb-1">Notas de Corazón (Heart)</span>
              <p class="text-gray-700 font-medium">
                {{ perfume.notas?.heart?.join(', ') || 'Bouquet floral puro' }}
              </p>
            </div>
            <div class="bg-white p-3 rounded-xl border border-[#EEDCD5]">
              <span class="text-[10px] uppercase font-bold text-[#7D5260] block mb-1">Notas de Fondo (Base)</span>
              <p class="text-gray-700 font-medium">
                {{ perfume.notas?.base?.join(', ') || 'Maderas nobles, ámbar' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Add to Bag and Quantity Controller -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center gap-3">
            <!-- Stepper -->
            <div class="flex items-center border border-[#EEDCD5] rounded-xl bg-white px-3 py-2 shrink-0">
              <button
                type="button"
                @click="quantity = Math.max(1, quantity - 1)"
                class="px-2 text-gray-500 hover:text-black font-bold text-sm cursor-pointer"
              >
                -
              </button>
              <span class="px-3 text-xs font-semibold text-[#4A1521]">{{ quantity }}</span>
              <button
                type="button"
                @click="quantity = Math.min(perfume.stock || 10, quantity + 1)"
                class="px-2 text-gray-500 hover:text-black font-bold text-sm cursor-pointer"
              >
                +
              </button>
            </div>

            <!-- Primary Add to Cart Button -->
            <button
              type="button"
              @click="handleAddToCart"
              :disabled="perfume.stock === 0"
              class="flex-1 py-3.5 px-6 rounded-xl bg-[#4A1521] text-white hover:bg-[#2F020D] text-xs font-semibold uppercase tracking-[0.15em] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>{{ perfume.stock > 0 ? 'Añadir a la Bolsa' : 'Producto Agotado' }}</span>
            </button>
          </div>

          <div class="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" :class="perfume.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'"></span>
              <span>{{ perfume.stock > 0 ? `${perfume.stock} unidades en el Atelier` : 'Agotado' }}</span>
            </span>
            <span class="text-[#7D5260]">Código: {{ perfume.id }}</span>
          </div>
        </div>

        <!-- Admin Toolbar (Conditional on isAdmin) -->
        <div v-if="isAdmin" class="p-4 rounded-xl bg-[#FCF9F7] border border-dashed border-[#4A1521]/30 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#4A1521] uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              Gestión de Administrador
            </span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-[#4A1521] text-white font-bold uppercase">
              Permiso Concedido
            </span>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <router-link
              :to="`/editar/${perfume.id}`"
              class="flex-1 py-2 px-3 rounded-lg bg-[#4A1521] text-white hover:bg-[#2F020D] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">edit</span>
              <span>Modificar Fragancia</span>
            </router-link>

            <button
              type="button"
              @click="deleteModalOpen = true"
              class="py-2 px-4 rounded-lg bg-red-100 text-red-700 hover:bg-red-700 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">delete</span>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Fragrances Section -->
    <div v-if="relatedPerfumes.length > 0" class="pt-12 border-t border-[#EEDCD5]/60 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="font-serif text-2xl text-[#4A1521] font-medium">
          Fragancias que comparten su universo
        </h2>
        <router-link to="/tienda" class="text-xs text-[#4A1521] font-semibold uppercase hover:underline">
          Ver Catálogo Completo →
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardItem
          v-for="rel in relatedPerfumes"
          :key="rel.id"
          :perfume="rel"
          :is-wishlisted="wishlist.includes(rel.id)"
          :is-admin="isAdmin"
          @select="$router.push(`/detalle/${rel.id}`)"
          @add-to-cart="addToCart(rel, 1, '100ml')"
          @toggle-wishlist="toggleWishlist(rel.id)"
          @edit="$router.push(`/editar/${rel.id}`)"
          @delete="() => {}"
        />
      </div>
    </div>

    <!-- Confirmation Modal for Deletion -->
    <ModalConfirmacion
      :is-open="deleteModalOpen"
      :perfume="perfume"
      @confirm="handleConfirmDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>

  <!-- Fallback if not found -->
  <div v-else class="max-w-md mx-auto py-24 text-center space-y-4">
    <div class="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
      <span class="material-symbols-outlined text-[32px]">error</span>
    </div>
    <h2 class="font-serif text-2xl text-[#4A1521]">Fragancia no encontrada</h2>
    <p class="text-xs text-gray-500 font-light">La fragancia que buscás no existe o fue retirada del catálogo.</p>
    <router-link
      to="/tienda"
      class="inline-block px-5 py-2.5 rounded-xl bg-[#4A1521] text-white text-xs font-semibold uppercase tracking-wider"
    >
      Volver al Catálogo
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
import { Perfume } from '../types';

const route = useRoute();
const router = useRouter();

const selectedSize = ref('100ml');
const quantity = ref(1);
const deleteModalOpen = ref(false);

onMounted(() => {
  if (perfumes.value.length === 0) {
    initStore();
  }
});

const perfume = computed<Perfume | undefined>(() => {
  const id = route.params.id as string;
  return perfumes.value.find(p => p.id === id);
});

const isWishlisted = computed(() => {
  return perfume.value ? wishlist.value.includes(perfume.value.id) : false;
});

const relatedPerfumes = computed<Perfume[]>(() => {
  if (!perfume.value) return [];
  return perfumes.value
    .filter(p => p.id !== perfume.value?.id && (p.familia === perfume.value?.familia || p.categoria === perfume.value?.categoria))
    .slice(0, 4);
});

// Reset quantity when perfume changes
watch(
  () => route.params.id,
  () => {
    quantity.value = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
);

const handleAddToCart = () => {
  if (perfume.value) {
    addToCart(perfume.value, quantity.value, selectedSize.value);
  }
};

const handleConfirmDelete = () => {
  if (perfume.value) {
    deletePerfumeRecord(perfume.value.id);
    deleteModalOpen.value = false;
    router.push('/tienda');
  }
};
</script>

<style scoped>
.font-variation-fill {
  font-variation-settings: 'FILL' 1;
}
</style>
