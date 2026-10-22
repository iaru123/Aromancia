<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
    <!-- Breadcrumb Nav -->
    <nav class="flex items-center gap-2 text-xs text-[#7D5260] font-sans">
      <router-link to="/" class="hover:text-[#4A1521]">Inicio</router-link>
      <span>/</span>
      <router-link to="/admin" class="hover:text-[#4A1521]">Panel Admin</router-link>
      <span>/</span>
      <span class="text-[#4A1521] font-semibold">
        {{ isEditing ? `Modificar: ${perfumeToEdit?.nombre || 'Fragancia'}` : '+ Nueva Fragancia' }}
      </span>
    </nav>

    <!-- Admin Guard Banner -->
    <div v-if="!isAdmin" class="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3">
      <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
        <span class="material-symbols-outlined text-[24px]">lock</span>
      </div>
      <h3 class="font-serif text-xl text-[#4A1521]">Sección Exclusiva de Administrador</h3>
      <p class="text-xs text-gray-600 max-w-md mx-auto">
        Esta sección requiere permisos de perfumista maestro o administrador del Atelier Aromancia.
      </p>
      <button
        type="button"
        @click="openAuthModal('admin')"
        class="px-5 py-2.5 rounded-xl bg-[#4A1521] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2F020D] transition-colors cursor-pointer"
      >
        Iniciar Sesión como Administrador
      </button>
    </div>

    <!-- Reusable FormularioItem Component -->
    <FormularioItem
      v-else
      :initial-data="perfumeToEdit"
      :is-editing="isEditing"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormularioItem from '../components/FormularioItem.vue';
import {
  perfumes,
  isAdmin,
  createPerfumeRecord,
  updatePerfumeRecord,
  openAuthModal,
  initStore
} from '../store';
import { Perfume } from '../types';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  if (perfumes.value.length === 0) {
    initStore();
  }
});

const isEditing = computed(() => {
  return route.name === 'EditPerfume' && !!route.params.id;
});

const perfumeToEdit = computed<Perfume | null>(() => {
  if (!isEditing.value) return null;
  const id = route.params.id as string;
  return perfumes.value.find(p => p.id === id) || null;
});

const handleSubmit = (data: any) => {
  if (isEditing.value && perfumeToEdit.value) {
    const updated: Perfume = {
      ...perfumeToEdit.value,
      ...data,
      id: perfumeToEdit.value.id,
      creadoEn: perfumeToEdit.value.creadoEn
    };
    updatePerfumeRecord(updated);
    router.push(`/detalle/${updated.id}`);
  } else {
    const created = createPerfumeRecord(data);
    router.push(`/detalle/${created.id}`);
  }
};

const handleCancel = () => {
  if (isEditing.value && perfumeToEdit.value) {
    router.push(`/detalle/${perfumeToEdit.value.id}`);
  } else {
    router.push('/tienda');
  }
};
</script>
