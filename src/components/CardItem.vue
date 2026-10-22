<template>
  <div
    class="group bg-white rounded-xl overflow-hidden border border-[#EEDCD5]/70 hover:border-[#4A1521]/30 transition-all duration-300 hover:shadow-xl flex flex-col relative"
  >
    <!-- Image & Badges Container -->
    <div class="relative aspect-4/5 bg-[#F6EEEC] overflow-hidden cursor-pointer" @click="emit('select', perfume)">
      <img
        :src="perfume.imagen"
        :alt="perfume.nombre"
        loading="lazy"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />

      <!-- Floating Tag (e.g. Bestseller, Edición Limitada) -->
      <div v-if="perfume.tag" class="absolute top-3 left-3 z-10">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold tracking-wider uppercase bg-[#4A1521] text-white shadow-sm">
          {{ perfume.tag }}
        </span>
      </div>

      <!-- Category Pill -->
      <div class="absolute bottom-3 left-3 z-10">
        <span class="px-2.5 py-1 rounded-md text-[10px] font-sans font-medium tracking-wide uppercase bg-white/90 backdrop-blur-xs text-[#4A1521] shadow-xs">
          {{ perfume.categoria }} · {{ perfume.familia }}
        </span>
      </div>

      <!-- Wishlist Heart Button -->
      <button
        type="button"
        @click.stop="emit('toggleWishlist', perfume.id)"
        class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#4A1521] hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
        :title="isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'"
        :aria-label="isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'"
      >
        <span
          class="material-symbols-outlined text-[18px] transition-colors"
          :class="isWishlisted ? 'text-[#4A1521] fill-current font-variation-fill' : 'text-gray-400'"
        >
          favorite
        </span>
      </button>

      <!-- Quick Add Overlay on Desktop Hover -->
      <div class="absolute inset-x-3 bottom-3 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <button
          type="button"
          @click.stop="emit('addToCart', perfume)"
          class="w-full py-2.5 px-4 bg-[#4A1521] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-lg hover:bg-[#2F020D] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
          <span>Añadir a la Bolsa</span>
        </button>
      </div>
    </div>

    <!-- Details Body -->
    <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
      <div class="space-y-1.5 cursor-pointer" @click="emit('select', perfume)">
        <div class="flex items-center justify-between text-[11px] text-[#7D5260] font-sans">
          <span>{{ perfume.concentracion }}</span>
          <span>{{ perfume.volumen }}</span>
        </div>

        <h3 class="font-serif text-lg sm:text-xl text-[#1B1C1B] font-medium leading-snug group-hover:text-[#4A1521] transition-colors line-clamp-1">
          {{ perfume.nombre }}
        </h3>

        <p class="font-sans text-xs text-gray-500 font-light line-clamp-2 leading-relaxed">
          {{ perfume.descripcion }}
        </p>
      </div>

      <!-- Rating & Stock Badge -->
      <div class="flex items-center justify-between pt-1 text-xs">
        <div class="flex items-center gap-1 text-[#4A1521]">
          <span class="material-symbols-outlined text-[15px] fill-current text-amber-500">star</span>
          <span class="font-medium text-[11px]">{{ perfume.calificacion }}</span>
          <span class="text-gray-400 text-[10px]">({{ perfume.totalResenas }})</span>
        </div>

        <span
          class="text-[10px] font-medium px-2 py-0.5 rounded"
          :class="perfume.stock > 5 ? 'bg-emerald-50 text-emerald-800' : perfume.stock > 0 ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'"
        >
          {{ perfume.stock > 5 ? 'En stock' : perfume.stock > 0 ? `Últimos ${perfume.stock}` : 'Agotado' }}
        </span>
      </div>

      <!-- Price & Mobile Add Action -->
      <div class="pt-2 border-t border-[#EEDCD5]/60 flex items-center justify-between gap-2">
        <div>
          <span class="font-serif text-lg sm:text-xl font-bold text-[#4A1521]">
            ${{ Number(perfume.precio).toLocaleString('es-AR') }}
          </span>
          <span v-if="perfume.precioOriginal" class="text-xs text-gray-400 line-through ml-2">
            ${{ Number(perfume.precioOriginal).toLocaleString('es-AR') }}
          </span>
        </div>

        <button
          type="button"
          @click.stop="emit('addToCart', perfume)"
          class="lg:hidden p-2 rounded-lg bg-[#4A1521] text-white hover:bg-[#2F020D] active:scale-95 transition-all cursor-pointer"
          title="Añadir a la bolsa"
          aria-label="Añadir a la bolsa"
        >
          <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
        </button>
      </div>

      <!-- Admin Actions Toolbar (ONLY shown when isAdmin is true) -->
      <div v-if="isAdmin" class="pt-2.5 mt-2 border-t border-dashed border-[#4A1521]/20 flex items-center justify-end gap-2 bg-[#FCF9F7] -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-2.5 rounded-b-xl">
        <span class="text-[10px] uppercase font-semibold text-[#4A1521] mr-auto flex items-center gap-1">
          <span class="material-symbols-outlined text-[13px]">tune</span>
          Admin
        </span>
        <button
          type="button"
          @click.stop="emit('edit', perfume)"
          class="px-2.5 py-1 text-xs font-semibold rounded bg-[#4A1521]/10 text-[#4A1521] hover:bg-[#4A1521] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          title="Modificar registro de perfume"
        >
          <span class="material-symbols-outlined text-[14px]">edit</span>
          <span>Editar</span>
        </button>
        <button
          type="button"
          @click.stop="emit('delete', perfume)"
          class="px-2.5 py-1 text-xs font-semibold rounded bg-red-100 text-red-700 hover:bg-red-700 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          title="Eliminar del catálogo"
        >
          <span class="material-symbols-outlined text-[14px]">delete</span>
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Perfume } from '../types';

defineProps<{
  perfume: Perfume;
  isWishlisted?: boolean;
  isAdmin?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', perfume: Perfume): void;
  (e: 'addToCart', perfume: Perfume): void;
  (e: 'toggleWishlist', perfumeId: string): void;
  (e: 'edit', perfume: Perfume): void;
  (e: 'delete', perfume: Perfume): void;
}>();
</script>

<style scoped>
.font-variation-fill {
  font-variation-settings: 'FILL' 1;
}
</style>
