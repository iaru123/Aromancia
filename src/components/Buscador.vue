<template>
  <div class="bg-white rounded-2xl p-4 sm:p-6 border border-[#EEDCD5] shadow-sm space-y-5">
    <!-- Top Row: Search Input + Sorting Selector -->
    <div class="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <!-- Search Input with v-model -->
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <span class="material-symbols-outlined text-[20px]">search</span>
        </span>
        <input
          type="text"
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          placeholder="Buscar por nombre, nota (jazmín, oud, vainilla), familia..."
          class="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-xl bg-[#FCF9F7] border border-[#EEDCD5] text-[#1B1C1B] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A1521]/20 focus:border-[#4A1521] transition-all"
        />
        <button
          v-if="searchQuery"
          type="button"
          @click="emit('update:searchQuery', '')"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#4A1521] cursor-pointer"
          title="Limpiar búsqueda"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <!-- Sorters and Olfactory Family Filters -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Olfactory Family Select -->
        <div class="relative shrink-0">
          <select
            :value="selectedFamily"
            @change="emit('update:selectedFamily', ($event.target as HTMLSelectElement).value)"
            class="appearance-none pl-3 pr-8 py-3 text-xs rounded-xl bg-[#FCF9F7] border border-[#EEDCD5] text-[#4A1521] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A1521]/20 focus:border-[#4A1521] cursor-pointer"
          >
            <option value="todas">Familia Olfativa: Todas</option>
            <option value="Floral">Floral</option>
            <option value="Amaderado">Amaderado</option>
            <option value="Oriental">Oriental</option>
            <option value="Gourmand">Gourmand</option>
            <option value="Chypre">Chypre</option>
            <option value="Cítrico">Cítrico</option>
            <option value="Cuero">Cuero</option>
            <option value="Sets y Regalos">Sets y Regalos</option>
          </select>
          <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[18px]">
            arrow_drop_down
          </span>
        </div>

        <!-- Sort Criteria Select -->
        <div class="relative shrink-0">
          <select
            :value="sortBy"
            @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
            class="appearance-none pl-3 pr-8 py-3 text-xs rounded-xl bg-[#FCF9F7] border border-[#EEDCD5] text-[#4A1521] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A1521]/20 focus:border-[#4A1521] cursor-pointer"
          >
            <option value="destacados">Ordenar: Recomendados</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="nombre-asc">Nombre: A → Z</option>
            <option value="nombre-desc">Nombre: Z → A</option>
            <option value="calificacion">Mayor Calificación</option>
            <option value="stock">Disponibilidad / Stock</option>
          </select>
          <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[18px]">
            arrow_drop_down
          </span>
        </div>
      </div>
    </div>

    <!-- Category Pill Filters with Counts -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        v-for="cat in categories"
        :key="cat.value"
        type="button"
        @click="emit('update:selectedCategory', cat.value)"
        class="px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5"
        :class="selectedCategory === cat.value
          ? 'bg-[#4A1521] text-white shadow-sm'
          : 'bg-[#FCF9F7] text-[#7D5260] hover:text-[#4A1521] hover:bg-[#EEDCD5]/60 border border-[#EEDCD5]'"
      >
        <span>{{ cat.label }}</span>
        <span
          class="text-[10px] px-1.5 py-0.2 rounded-full"
          :class="selectedCategory === cat.value ? 'bg-white/20 text-white' : 'bg-black/5 text-[#7D5260]'"
        >
          {{ categoryCounts[cat.value] || 0 }}
        </span>
      </button>
    </div>

    <!-- Active Filters Summary & Total Count -->
    <div class="pt-2 border-t border-[#EEDCD5]/60 flex items-center justify-between text-xs text-[#7D5260]">
      <div class="flex items-center gap-2 flex-wrap">
        <span>Mostrando <strong>{{ totalCount }}</strong> fragancias</span>
        <span v-if="searchQuery" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EEDCD5] text-[#4A1521]">
          "{{ searchQuery }}"
          <button type="button" @click="emit('update:searchQuery', '')" class="hover:text-black">×</button>
        </span>
        <span v-if="selectedFamily !== 'todas'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EEDCD5] text-[#4A1521]">
          Familia: {{ selectedFamily }}
          <button type="button" @click="emit('update:selectedFamily', 'todas')" class="hover:text-black">×</button>
        </span>
      </div>

      <button
        v-if="searchQuery || selectedCategory !== 'todos' || selectedFamily !== 'todas' || sortBy !== 'destacados'"
        type="button"
        @click="emit('resetFilters')"
        class="text-xs text-[#4A1521] hover:underline font-medium cursor-pointer"
      >
        Restablecer filtros
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Category } from '../types';

defineProps<{
  searchQuery: string;
  selectedCategory: Category;
  selectedFamily: string;
  sortBy: string;
  totalCount: number;
  categoryCounts: Record<Category, number>;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void;
  (e: 'update:selectedCategory', val: Category): void;
  (e: 'update:selectedFamily', val: string): void;
  (e: 'update:sortBy', val: string): void;
  (e: 'resetFilters'): void;
}>();

const categories: { label: string; value: Category }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Femenino', value: 'femenino' },
  { label: 'Masculino', value: 'masculino' },
  { label: 'Unisex', value: 'unisex' },
  { label: 'Sets & Discovery', value: 'sets' }
];
</script>
