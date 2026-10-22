<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-20">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-[#7D5260] font-sans">
      <router-link to="/" class="hover:text-[#4A1521]">Inicio</router-link>
      <span>/</span>
      <span class="text-[#4A1521] font-semibold">El Atelier y Filosofía</span>
    </nav>

    <!-- Atelier Hero Banner -->
    <div class="relative bg-[#2F020D] text-white rounded-3xl p-8 sm:p-14 overflow-hidden shadow-2xl">
      <div class="relative z-10 max-w-2xl space-y-4">
        <span class="text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-[#EBD9D2] block">
          HAUTE PARFUMERIE ARTISANALE · DESDE 2024
        </span>
        <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight">
          La alquimia de la paciencia y la botánica pura.
        </h1>
        <p class="font-sans text-xs sm:text-sm text-[#EBD9D2]/80 font-light leading-relaxed">
          En Aromancia concebimos el perfume no como un accesorio cosmético, sino como una partitura invisible que despierta memorias profundas y dialoga con la intimidad de quien lo viste.
        </p>
      </div>

      <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
    </div>

    <!-- The 4 Pillars of Aromancia (Screenshot & PDF matching) -->
    <div class="space-y-8">
      <div class="text-center space-y-2">
        <span class="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#7D5260]">
          Nuestro Manifiesto
        </span>
        <h2 class="font-serif text-3xl text-[#4A1521] font-medium">
          Los Cuatro Pilares del Atelier
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-2xl p-6 border border-[#EEDCD5] shadow-xs space-y-3">
          <div class="w-12 h-12 rounded-xl bg-[#4A1521] text-white flex items-center justify-center">
            <span class="material-symbols-outlined text-[24px]">hourglass_top</span>
          </div>
          <h3 class="font-serif text-lg font-semibold text-[#4A1521]">Maceración Lenta</h3>
          <p class="text-xs text-gray-600 font-light leading-relaxed">
            Cada lote reposa un mínimo de 60 días en barricas selladas en oscuridad controlada, permitiendo que las moléculas complejas alcancen armonía perfecta.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-[#EEDCD5] shadow-xs space-y-3">
          <div class="w-12 h-12 rounded-xl bg-[#4A1521] text-white flex items-center justify-center">
            <span class="material-symbols-outlined text-[24px]">eco</span>
          </div>
          <h3 class="font-serif text-lg font-semibold text-[#4A1521]">Cosecha Consciente</h3>
          <p class="text-xs text-gray-600 font-light leading-relaxed">
            Extractos y absolutos recolectados a mano al amanecer: rosas centifolia de Grasse, sándalo de Mysore sostenible y maderas nativas patagónicas.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-[#EEDCD5] shadow-xs space-y-3">
          <div class="w-12 h-12 rounded-xl bg-[#4A1521] text-white flex items-center justify-center">
            <span class="material-symbols-outlined text-[24px]">diamond</span>
          </div>
          <h3 class="font-serif text-lg font-semibold text-[#4A1521]">Alta Concentración</h3>
          <p class="text-xs text-gray-600 font-light leading-relaxed">
            Formulaciones Eau de Parfum y Extrait de Parfum con una carga aromática del 20% al 30%, garantizando fijación superior de más de 12 horas.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-[#EEDCD5] shadow-xs space-y-3">
          <div class="w-12 h-12 rounded-xl bg-[#4A1521] text-white flex items-center justify-center">
            <span class="material-symbols-outlined text-[24px]">recycling</span>
          </div>
          <h3 class="font-serif text-lg font-semibold text-[#4A1521]">Frascos Recargables</h3>
          <p class="text-xs text-gray-600 font-light leading-relaxed">
            Cristal francés pesado con tapas de madera maciza grabadas a fuego. Podés recargar tu frasco en nuestro Atelier con 30% de descuento vitalicio.
          </p>
        </div>
      </div>
    </div>

    <!-- Visual Story Triptych -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="rounded-2xl overflow-hidden aspect-4/5 border border-[#EEDCD5] relative group shadow-md">
        <img
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
          alt="Alquimia botánica"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
          <p class="text-white text-xs font-serif font-medium">I. La Selección de Esencias Puras</p>
        </div>
      </div>

      <div class="rounded-2xl overflow-hidden aspect-4/5 border border-[#EEDCD5] relative group shadow-md">
        <img
          src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
          alt="Maceración en frío"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
          <p class="text-white text-xs font-serif font-medium">II. Maceración en Frío y Reposo</p>
        </div>
      </div>

      <div class="rounded-2xl overflow-hidden aspect-4/5 border border-[#EEDCD5] relative group shadow-md">
        <img
          src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
          alt="Embotellado manual"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
          <p class="text-white text-xs font-serif font-medium">III. Embotellado y Sellado a Mano</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// AboutView component for Aromancia
</script>
