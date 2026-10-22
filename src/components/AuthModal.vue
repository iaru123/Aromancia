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
                ? 'Registrate para una experiencia de compra personalizada y seguimiento de tus pedidos.'
                : 'Iniciá sesión para acceder a tu historial de compras y fragancias favoritas.' }}
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

          <!-- TAB 1: LOGIN (CLIENTE O ADMIN) -->
          <form v-if="currentTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
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

          <!-- TAB 2: REGISTRO DE COMPRADOR -->
          <form v-else-if="currentTab === 'register'" @submit.prevent="handleRegister" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                  Nombre y Apellido <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="registerForm.nombre"
                  type="text"
                  required
                  placeholder="Ej: Sofia Gómez"
                  class="w-full px-3 py-2 rounded-xl border border-[#EEDCD5] text-xs bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
                />
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
                  Teléfono de Contacto
                </label>
                <input
                  v-model="registerForm.telefono"
                  type="tel"
                  placeholder="+54 11 3344-5566"
                  class="w-full px-3 py-2 rounded-xl border border-[#EEDCD5] text-xs bg-[#FCF9F7] focus:outline-none focus:border-[#4A1521]"
                />
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
                <strong class="text-[#4A1521] block">• Panel de Administrador (Clientes, Pedidos y Productos)</strong>
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
import { loginUser, registerUser } from '../store';

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
  },
  { immediate: true }
);

watch(
  () => props.isOpen,
  (open) => {
    if (open) authError.value = '';
  }
);

const fillDemo = (email: string, pass: string) => {
  loginForm.email = email;
  loginForm.password = pass;
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

  // Success
  loginUser(found);
  emit('close');
};

const handleRegister = () => {
  authError.value = '';
  if (!registerForm.nombre.trim() || !registerForm.email.trim() || !registerForm.password.trim()) {
    authError.value = 'Completá todos los campos requeridos.';
    return;
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    nombre: registerForm.nombre.trim(),
    email: registerForm.email.trim().toLowerCase(),
    password: registerForm.password,
    rol: 'cliente',
    telefono: registerForm.telefono.trim() || undefined,
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
    // If somehow admin was deleted, use fallback
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
