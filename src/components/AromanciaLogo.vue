<template>
  <div class="inline-flex items-center gap-2.5 cursor-pointer select-none group" :class="className">
    <!-- Emblem Monogram: Flacon & Rose Petal -->
    <div
      class="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
      :class="emblemSizes[size]"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full drop-shadow-sm"
      >
        <!-- Outer faceted perfume silhouette -->
        <rect
          x="12"
          y="18"
          width="40"
          height="40"
          rx="6"
          :stroke="accentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <!-- Flacon Collar & Cap -->
        <path
          d="M24 18V12C24 10.8954 24.8954 10 26 10H38C39.1046 10 40 10.8954 40 12V18"
          :stroke="accentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <rect
          x="28"
          y="4"
          width="8"
          height="6"
          rx="1"
          :fill="accentColor"
        />
        <!-- Stylized Rose & Heart Note Motif -->
        <path
          d="M32 25C29 22 23 23 23 28C23 34 32 42 32 42C32 42 41 34 41 28C41 23 35 22 32 25Z"
          :fill="accentColor"
          fill-opacity="0.25"
          :stroke="accentColor"
          stroke-width="1.75"
          stroke-linejoin="round"
        />
        <!-- Internal Radiant Facet -->
        <circle cx="32" cy="30" r="2" :fill="accentColor" />
        <line x1="32" y1="46" x2="32" y2="52" :stroke="accentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
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

const accentColor = computed(() => {
  if (props.variant === 'light') return '#FFFFFF';
  return '#4A1521';
});

const emblemSizes = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12'
};

const textSizes = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl sm:text-3xl'
};
</script>
