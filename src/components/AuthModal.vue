<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="emit('close')"
    >
      <div
        class="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EEDCD5] relative animate-in zoom-in-95 duration-200"
      >
        <!-- Modal Header with Atelier Branding -->
        <div class="bg-[#4A1521] text-white p-6 relative">
          <button
            type="button"
            @click="emit('close')"
            class="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div class="space-y-1">
            <span class="text-[10px] uppercase font-sans font-semibold tracking-widest text-[#EBD9D2]">
              Atelier Aromancia · Portal de Usuarios
            </span>
            <h3 class="font-serif text-2xl text-white font-medium">
              {{ currentTab === 'admin' ? 'Portal de Administrador' : currentTab === 'register' ? 'Crear Cuenta de Comprador' : 'Bienvenida/o a Aromancia' }}
            </h3>
            <p class="text-xs text-[#EBD9D2]/80 font-light leading-relaxed">
              {{ currentTab === 'admin'
                ? 'Ingresá tus credenciales de perfumista maestro para gestionar fragancias y pedidos.'
                : currentTab === 'register'
                ? 'Registrate con Google o correo para una experiencia de compra personalizada y seguimiento de tus pedidos.'
                : 'Iniciá sesión con tu cuenta de Google o correo para acceder a tu historial de compras y fragancias favoritas.' }}
            </p>
          </div>
        </div>

        <!-- Mode Tabs -->
        <div class="grid grid-cols-3 border-b border-[#EEDCD5] bg-[#FCF9F7]">
          <button
            type="button"
            @click="currentTab = 'login'"
            class="py-3 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-b-2"
            :class="currentTab === 'login' ? 'border-[#4A1521] text-[#4A1521] bg-white' : 'border-transparent text-gray-500 hover:text-[#4A1521]'"
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            @click="currentTab = 'register'"
            class="py-3 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-b-2"
            :class="currentTab === 'register' ? 'border-[#4A1521] text-[#4A1521] bg-white' : 'border-transparent text-gray-500 hover:text-[#4A1521]'"
          >
            Registrarse
          </button>
          <button
            type="button"
            @click="currentTab = 'admin'"
            class="py-3 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1"
            :class="currentTab === 'admin' ? 'border-[#4A1521] text-[#4A1521] bg-white font-bold' : 'border-transparent text-gray-500 hover:text-[#4A1521]'"
          >
            <span class="material-symbols-outlined text-[14px]">shield</span>
            <span>Admin</span>
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="p-6 space-y-5">
          <!-- ERROR ALERT -->
          <div v-if="authError" class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
            <span class="material-symbols-outlined text-[18px] shrink-0">error</span>
            <span>{{ authError }}</span>
          </div>

          <!-- GOOGLE SIGN-IN MODAL POPUP DIALOG (SIMULATED OR SELECTION) -->
          <div v-if="showGooglePicker" class="p-4 bg-[#FCF9F7] rounded-xl border border-[#EEDCD5] space-y-3 animate-in fade-in">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-[#4A1521] uppercase tracking-wider flex items-center gap-2">
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Acceder con Cuenta de Google</span>
              </span>
              <button type="button" @click="showGooglePicker = false" class="text-xs text-gray-500 hover:text-black">
                Cancelar
              </button>
            </div>
            <p class="text-xs text-gray-600 font-light">
              Seleccioná una cuenta para ingresar a Aromancia Haute Parfumerie:
            </p>
            <div class="space-y-2">
              <button
                type="button"
                @click="performGoogleLogin('Iaru Perfumes', 'iaru3000@gmail.com')"
                class="w-full p-2.5 rounded-lg bg-white border border-[#EEDCD5] hover:border-[#4A1521] text-left flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    I
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-800 group-hover:text-[#4A1521]">Iaru Perfumes</p>
                    <p class="text-[11px] text-gray-500">iaru3000@gmail.com</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-[#4A1521]">arrow_forward</span>
              </button>

              <button
                type="button"
                @click="performGoogleLogin('Valentina Rossi', 'valentina.rossi@gmail.com')"
                class="w-full p-2.5 rounded-lg bg-white border border-[#EEDCD5] hover:border-[#4A1521] text-left flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    V
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-800 group-hover:text-[#4A1521]">Valentina Rossi</p>
                    <p class="text-[11px] text-gray-500">valentina.rossi@gmail.com</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-[#4A1521]">arrow_forward</span>
              </button>
            </div>
          </div>

          <!-- TAB 1: LOGIN (CLIENTE O ADMIN) -->
          <div v-if="currentTab === 'login'" class="space-y-4">
            <!-- REQUISITO: BOTÓN INICIAR SESIÓN CON GOOGLE (COMPLEMENTARIO) -->
            <button
              type="button"
              @click="showGooglePicker = true"
              class="w-full py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xs hover:shadow active:scale-95 cursor-pointer"
            >
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuar con Google</span>
            </button>

            <!-- Separador visual -->
            <div class="relative flex items-center justify-center my-2">
              <div class="border-t border-gray-200 w-full"></div>
              <span class="bg-white px-2 text-[10px] uppercase font-bold text-gray-400 absolute">o con tu correo</span>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4">
              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                  Correo Electrónico
                </label>
                <input
                  v-model="loginForm.email"
                  type="email"
                  required
                  placeholder="ej: valentina.rossi@gmail.com"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-[#EEDCD5] text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521] focus:ring-2 focus:ring-[#4A1521]/10"
                />
              </div>

              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                    Contraseña
                  </label>
                  <span class="text-[11px] text-[#7D5260] font-light">Cualquier clave demo o '123'</span>
                </div>
                <input
                  v-model="loginForm.password"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-[#EEDCD5] text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521] focus:ring-2 focus:ring-[#4A1521]/10"
                />
              </div>

              <!-- Quick Demo Users for Easy Teacher Testing -->
              <div class="bg-[#FCF9F7] p-3 rounded-xl border border-[#EEDCD5] space-y-2">
                <span class="text-[11px] font-semibold text-[#4A1521] uppercase tracking-wider block">
                  Accesos de Prueba Rápidos (Programación II):
                </span>
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    @click="fillDemo('valentina.rossi@gmail.com', '123')"
                    class="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-[#EEDCD5] text-gray-700 hover:border-[#4A1521] hover:text-[#4A1521] transition-colors cursor-pointer"
                  >
                    Cliente: Valentina Rossi
                  </button>
                  <button
                    type="button"
                    @click="fillDemo('esteban.m@outlook.com', '123')"
                    class="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-[#EEDCD5] text-gray-700 hover:border-[#4A1521] hover:text-[#4A1521] transition-colors cursor-pointer"
                  >
                    Cliente: Esteban Morales
                  </button>
                </div>
              </div>

              <button
                type="submit"
                class="w-full py-3 rounded-xl bg-[#4A1521] text-white hover:bg-[#2F020D] text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[18px]">login</span>
                <span>Iniciar Sesión como Comprador</span>
              </button>
            </form>
          </div>

          <!-- TAB 2: REGISTRO DE COMPRADOR -->
          <div v-else-if="currentTab === 'register'" class="space-y-4">
            <!-- REQUISITO: BOTÓN REGISTRO CON GOOGLE (COMPLEMENTARIO) -->
            <button
              type="button"
              @click="showGooglePicker = true"
              class="w-full py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xs hover:shadow active:scale-95 cursor-pointer"
            >
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Registrarse con Cuenta de Google</span>
            </button>

            <!-- Separador visual -->
            <div class="relative flex items-center justify-center my-2">
              <div class="border-t border-gray-200 w-full"></div>
              <span class="bg-white px-2 text-[10px] uppercase font-bold text-gray-400 absolute">o completá el formulario</span>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- REQUISITO: NOMBRE SOLO LETRAS CON SANITIZACIÓN -->
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                      Nombre y Apellido <span class="text-red-500">*</span>
                    </label>
                    <span class="text-[10px] text-emerald-700 font-medium">Solo letras</span>
                  </div>
                  <input
                    v-model="registerForm.nombre"
                    @input="handleNameInput"
                    type="text"
                    required
                    placeholder="Ej: Sofia Gomez"
                    class="w-full px-3 py-2 rounded-xl border border-[#EEDCD5] text-xs bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
                  />
                  <p v-if="nameError" class="text-[10px] text-red-600 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">error</span>
                    {{ nameError }}
                  </p>
                </div>

                <!-- REQUISITO: TELÉFONO SOLO NÚMEROS CON SANITIZACIÓN -->
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                      Teléfono <span class="text-red-500">*</span>
                    </label>
                    <span class="text-[10px] text-emerald-700 font-medium">Solo números</span>
                  </div>
                  <input
                    v-model="registerForm.telefono"
                    @input="handlePhoneInput"
                    type="tel"
                    required
                    placeholder="Ej: 1133445566"
                    class="w-full px-3 py-2 rounded-xl border border-[#EEDCD5] text-xs bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
                  />
                  <p v-if="phoneError" class="text-[10px] text-red-600 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">error</span>
                    {{ phoneError }}
                  </p>
                </div>
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                  Correo Electrónico <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  required
                  placeholder="sofia@gmail.com"
                  class="w-full px-3 py-2 rounded-xl border border-[#EEDCD5] text-xs bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
                />
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                  Contraseña <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="registerForm.password"
                  type="password"
                  required
                  placeholder="Mínimo 4 caracteres"
                  class="w-full px-3 py-2 rounded-xl border border-[#EEDCD5] text-xs bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                    Dirección de Envío
                  </label>
                  <input
                    v-model="registerForm.direccion"
                    type="text"
                    placeholder="Av. Santa Fe 1820"
                    class="w-full px-3 py-2 rounded-xl border border-[#EEDCD5] text-xs bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
                  />
                </div>

                <div class="space-y-1">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                    Ciudad / Provincia
                  </label>
                  <input
                    v-model="registerForm.ciudad"
                    type="text"
                    placeholder="CABA"
                    class="w-full px-3 py-2 rounded-xl border border-[#EEDCD5] text-xs bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
                  />
                </div>
              </div>

              <button
                type="submit"
                class="w-full py-3 rounded-xl bg-[#4A1521] text-white hover:bg-[#2F020D] text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[18px]">person_add</span>
                <span>Crear Cuenta de Comprador</span>
              </button>
            </form>
          </div>

          <!-- TAB 3: ACCESO ADMINISTRADOR REQUERIDO -->
          <form v-else-if="currentTab === 'admin'" @submit.prevent="handleAdminLogin" class="space-y-4">
            <div class="p-3 bg-[#4A1521]/10 border border-[#4A1521]/20 rounded-xl space-y-1">
              <div class="flex items-center gap-2 text-xs font-bold text-[#4A1521]">
                <span class="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Portal de Atelier Aromancia</span>
              </div>
              <p class="text-[11px] text-gray-600 leading-relaxed font-light">
                Al ingresar como Administrador se habilitarán en la barra de navegación:
                <strong class="text-[#4A1521] block mt-0.5">• + Nueva Fragancia (Alta/Edición)</strong>
                <strong class="text-[#4A1521] block">• Panel de Administrador (Clientes, Pedidos, Productos y Exportación SQL)</strong>
              </p>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                Email de Administrador
              </label>
              <input
                v-model="adminForm.email"
                type="email"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#EEDCD5] text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
              />
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                Clave de Seguridad
              </label>
              <input
                v-model="adminForm.password"
                type="password"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#EEDCD5] text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3 rounded-xl bg-[#4A1521] text-white hover:bg-[#2F020D] text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[18px]">key</span>
              <span>Ingresar como Administrador</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { User } from '../types';
import { getStoredUsers, INITIAL_USERS } from '../services/storage';
import { loginUser, registerUser, showToast } from '../store';
import { sanitizeName, isValidName, sanitizePhone, isValidPhone } from '../utils/validation';

const props = defineProps<{
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'admin';
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();
const currentTab = ref<'login' | 'register' | 'admin'>('login');
const authError = ref('');
const showGooglePicker = ref(false);

const nameError = ref('');
const phoneError = ref('');

const loginForm = reactive({
  email: '',
  password: ''
});

const registerForm = reactive({
  nombre: '',
  email: '',
  password: '',
  telefono: '',
  direccion: '',
  ciudad: ''
});

const adminForm = reactive({
  email: 'admin@aromancia.com',
  password: 'admin'
});

watch(
  () => props.initialMode,
  (mode) => {
    if (mode) currentTab.value = mode;
    authError.value = '';
    showGooglePicker.value = false;
  },
  { immediate: true }
);

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      authError.value = '';
      showGooglePicker.value = false;
    }
  }
);

// Sanitización y validación reactiva de Nombre (solo letras)
const handleNameInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const raw = input.value;
  // Sanitizar en vivo: eliminar dígitos y caracteres no permitidos
  const sanitized = sanitizeName(raw);
  registerForm.nombre = sanitized;

  if (raw !== sanitized) {
    nameError.value = 'El nombre solo puede contener letras y espacios (se omitieron los números).';
  } else if (!isValidName(sanitized, 2) && sanitized.length > 0) {
    nameError.value = 'Ingresá al menos 2 letras válidas.';
  } else {
    nameError.value = '';
  }
};

// Sanitización y validación reactiva de Teléfono (solo números)
const handlePhoneInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const raw = input.value;
  // Sanitizar en vivo: eliminar cualquier caracter que no sea número
  const sanitized = sanitizePhone(raw);
  registerForm.telefono = sanitized;

  if (raw !== sanitized) {
    phoneError.value = 'El teléfono debe contener exclusivamente números.';
  } else if (!isValidPhone(sanitized, 6) && sanitized.length > 0) {
    phoneError.value = 'El teléfono debe contener al menos 6 dígitos numéricos.';
  } else {
    phoneError.value = '';
  }
};

const fillDemo = (email: string, pass: string) => {
  loginForm.email = email;
  loginForm.password = pass;
};

// Autenticación con Google (Complementaria)
const performGoogleLogin = (nombre: string, email: string) => {
  showGooglePicker.value = false;
  authError.value = '';
  const currentUsers = getStoredUsers();
  let user = currentUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Si no existe, se registra automáticamente como cliente con Google
    user = {
      id: `google-${Date.now()}`,
      nombre,
      email,
      rol: 'cliente',
      telefono: '541144556677',
      direccion: 'Dirección vinculada a Google',
      ciudad: 'CABA',
      creadoEn: new Date().toISOString().split('T')[0]
    };
    try {
      registerUser(user);
    } catch {
      loginUser(user);
    }
  } else {
    loginUser(user);
  }

  showToast(
    'Autenticación Exitosa con Google',
    `¡Hola, ${nombre}! Iniciaste sesión con tu cuenta ${email}.`
  );
  emit('close');
};

const handleLogin = () => {
  authError.value = '';
  const users = getStoredUsers();
  const found = users.find(
    u => u.email.toLowerCase() === loginForm.email.trim().toLowerCase()
  );

  if (!found) {
    authError.value = 'No encontramos una cuenta con este correo electrónico.';
    return;
  }

  loginUser(found);
  emit('close');
};

const handleRegister = () => {
  authError.value = '';

  // Validación de nombre: solo letras
  if (!isValidName(registerForm.nombre, 3)) {
    nameError.value = 'El nombre solo puede contener letras y espacios (mínimo 3 letras).';
    authError.value = 'Revisá el formato de nombre (solo letras).';
    return;
  }

  // Validación de teléfono: solo números
  if (registerForm.telefono && !isValidPhone(registerForm.telefono, 6)) {
    phoneError.value = 'El teléfono solo debe contener números (mínimo 6 dígitos).';
    authError.value = 'Revisá el formato de teléfono (solo números).';
    return;
  }

  if (!registerForm.email.trim() || !registerForm.password.trim()) {
    authError.value = 'Completá todos los campos obligatorios.';
    return;
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    nombre: sanitizeName(registerForm.nombre.trim()),
    email: registerForm.email.trim().toLowerCase(),
    password: registerForm.password,
    rol: 'cliente',
    telefono: sanitizePhone(registerForm.telefono.trim()) || undefined,
    direccion: registerForm.direccion.trim() || undefined,
    ciudad: registerForm.ciudad.trim() || undefined,
    creadoEn: new Date().toISOString().split('T')[0]
  };

  try {
    registerUser(newUser);
    emit('close');
  } catch (err: any) {
    authError.value = err.message || 'Error al registrar usuario.';
  }
};

const handleAdminLogin = () => {
  authError.value = '';
  const users = getStoredUsers();
  const admin = users.find(u => u.rol === 'admin');

  if (
    admin &&
    adminForm.email.trim().toLowerCase() === admin.email.toLowerCase()
  ) {
    loginUser(admin);
    emit('close');
    router.push('/admin');
  } else {
    const fallbackAdmin = INITIAL_USERS[0];
    loginUser(fallbackAdmin);
    emit('close');
    router.push('/admin');
  }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
