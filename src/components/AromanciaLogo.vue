<template>
  <div class="inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group" :class="className">
    <!-- Emblem Monogram: Logo oficial enviado por el usuario -->
    <div
      class="relative flex items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-xs"
      :class="[
        emblemSizes[size],
        variant === 'light' ? 'border border-[#EBD9D2]/30 bg-[#2F020D]' : 'border border-[#EEDCD5] bg-[#FCF9F7]'
      ]"
    >
      <img
        :src="logoImageSrc"
        alt="Aromancia Logo Oficial"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </div>

    <!-- Brand Logotype & Typography -->
    <div class="flex flex-col">
      <span
        class="font-serif tracking-[0.25em] font-normal leading-tight transition-colors"
        :class="[
          textSizes[size],
          variant === 'light' ? 'text-white' : 'text-[#4A1521]'
        ]"
      >
        AROMANCIA
      </span>
      <span
        v-if="showSubtitle"
        class="text-[9px] tracking-[0.3em] uppercase font-sans font-medium"
        :class="variant === 'light' ? 'text-[#EBD9D2]/80' : 'text-[#7D5260]'"
      >
        Haute Parfumerie
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    className?: string;
    variant?: 'light' | 'dark' | 'burgundy';
    size?: 'sm' | 'md' | 'lg';
    showSubtitle?: boolean;
  }>(),
  {
    className: '',
    variant: 'burgundy',
    size: 'md',
    showSubtitle: true
  }
);

// Selección de logo según el fondo (variante clara u oscura enviada por el usuario)
const logoImageSrc = computed(() => {
  if (props.variant === 'light') {
    // Logo en tono rosa suave sobre fondo burdeos oscuro (para Footer u otros fondos oscuros)
    return '/assets/aistudio/Captura_de_pantalla_2026-10-28_181316_8bde7209.png';
  }
  // Logo en tono burdeos sobre fondo rosa suave (para Navbar, header y fondos claros)
  return '/assets/aistudio/Captura_de_pantalla_2026-10-28_181308_e37a7b91.png';
});

const emblemSizes = {
  sm: 'w-7 h-7 sm:w-8 sm:h-8',
  md: 'w-10 h-10 sm:w-11 sm:h-11',
  lg: 'w-12 h-12 sm:w-14 sm:h-14'
};

const textSizes = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl sm:text-3xl'
};
</script>
