<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-[#7D5260] font-sans">
      <router-link to="/" class="hover:text-[#4A1521]">Inicio</router-link>
      <span>/</span>
      <span class="text-[#4A1521] font-semibold">Contacto y Asesoramiento</span>
    </nav>

    <!-- Header Banner -->
    <div class="text-center space-y-2 max-w-xl mx-auto">
      <span class="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#7D5260]">
        Hablemos de Aromas
      </span>
      <h1 class="font-serif text-3xl sm:text-4xl text-[#4A1521] font-medium">
        Atelier de Asesoramiento Privado
      </h1>
      <p class="font-sans text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
        ¿Tenés dudas sobre qué familia olfativa elegir o deseás coordinar una cita sensorial en nuestro atelier? Nuestro equipo de perfumistas está a tu disposición.
      </p>
    </div>

    <!-- Contact Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Contact Form (7 cols) -->
      <div class="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#EEDCD5] shadow-sm space-y-6">
        <h2 class="font-serif text-xl text-[#4A1521] font-medium">
          Envianos un Mensaje
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                  Nombre y Apellido <span class="text-red-500">*</span>
                </label>
                <span class="text-[10px] text-emerald-700 font-medium">Solo letras</span>
              </div>
              <input
                v-model="form.nombre"
                @input="handleNameInput"
                type="text"
                required
                placeholder="Ej: Martina Bellini"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#EEDCD5] text-xs sm:text-sm bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
              />

            <div class="space-y-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                Correo Electrónico <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="tu@email.com"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#EEDCD5] text-xs sm:text-sm bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
              Motivo de Consulta
            </label>
            <select
              v-model="form.motivo"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#EEDCD5] text-xs sm:text-sm bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
            >
              <option value="asesoramiento">Asesoramiento personalizado de fragancias</option>
              <option value="cita">Coordinar cita privada en Atelier</option>
              <option value="corporativo">Regalos corporativos de autor</option>
              <option value="pedido">Consulta sobre un pedido en curso</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
              Mensaje o Notas Olfativas de Interés <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.mensaje"
              rows="4"
              required
              placeholder="Contanos qué aromas te gustan o qué buscas en tu próxima fragancia..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#EEDCD5] text-xs sm:text-sm bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#4A1521] text-white hover:bg-[#2F020D] text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">send</span>
            <span>Enviar Mensaje al Atelier</span>
          </button>

          <p v-if="success" class="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">check_circle</span>
            ¡Gracias por contactarnos! Un perfumista de nuestro atelier te responderá a la brevedad.
          </p>
        </form>
      </div>

      <!-- Atelier Coordinates & Visiting Info (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white rounded-2xl p-6 border border-[#EEDCD5] shadow-sm space-y-4">
          <h3 class="font-serif text-lg text-[#4A1521] font-medium">
            Atelier Central Buenos Aires
          </h3>

          <div class="space-y-3 text-xs text-gray-600">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-[20px] text-[#4A1521] shrink-0 mt-0.5">location_on</span>
              <div>
                <p class="font-semibold text-gray-800">Dirección del Atelier:</p>
                <p>Honduras 4920, Palermo Soho, CABA, Argentina</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-[20px] text-[#4A1521] shrink-0 mt-0.5">schedule</span>
              <div>
                <p class="font-semibold text-gray-800">Horarios de Atención:</p>
                <p>Martes a Sábados: 11:00 a 19:30 hs</p>
                <p class="text-gray-400">Domingos y Lunes: Maceración privada (Cerrado)</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-[20px] text-[#4A1521] shrink-0 mt-0.5">call</span>
              <div>
                <p class="font-semibold text-gray-800">Atención Telefónica / WhatsApp:</p>
                <p>+54 11 4821-9900</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-[20px] text-[#4A1521] shrink-0 mt-0.5">mail</span>
              <div>
                <p class="font-semibold text-gray-800">Correo Electrónico:</p>
                <p>contacto@aromancia.com</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#FCF9F7] rounded-2xl p-5 border border-[#EEDCD5] space-y-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-[#4A1521] flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">celebration</span>
            Citas de Maceración Personalizada
          </span>
          <p class="text-xs text-gray-600 font-light leading-relaxed">
            Creamos fórmulas exclusivas para eventos, marcas de diseño y bodas. Consultanos para agendar una sesión privada con nuestro creador olfativo.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { showToast } from '../store';
import { sanitizeName, isValidName } from '../utils/validation';

const form = reactive({
  nombre: '',
  email: '',
  motivo: 'asesoramiento',
  mensaje: ''
});

const success = ref(false);

const handleNameInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  form.nombre = sanitizeName(input.value);
};

const handleSubmit = () => {
  if (!isValidName(form.nombre, 2)) {
    showToast('Nombre inválido', 'El nombre solo puede contener letras y espacios.');
    return;
  }

  if (form.nombre && form.email && form.mensaje) {
    success.value = true;
    showToast('Mensaje enviado', 'Nos pondremos en contacto contigo dentro de las próximas 24 hs.');
    form.nombre = '';
    form.email = '';
    form.mensaje = '';
    setTimeout(() => {
      success.value = false;
    }, 5000);
  }
};
</script>
