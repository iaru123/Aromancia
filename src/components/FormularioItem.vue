<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <!-- Form Col (7 cols) -->
    <div class="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#EEDCD5] shadow-md space-y-6">
      <div class="space-y-1 border-b border-[#EEDCD5]/60 pb-4">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A1521]/10 text-[#4A1521] text-[11px] font-semibold uppercase tracking-wider">
          <span class="material-symbols-outlined text-[15px]">edit_note</span>
          <span>Formulario de Perfumería · v-model & Validaciones</span>
        </div>
        <h2 class="font-serif text-2xl text-[#4A1521] font-medium">
          {{ isEditing ? 'Modificar Fragancia Existente' : 'Alta de Nueva Fragancia' }}
        </h2>
        <p class="font-sans text-xs text-gray-500 font-light">
          Completá los campos requeridos con las notas olfativas y especificaciones para el catálogo del Atelier.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
        <!-- Nombre de la Fragancia -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
            Nombre de la Fragancia <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.nombre"
            @blur="validateField('nombre')"
            type="text"
            placeholder="Ej: Rosé Éclat, Noir Absolu..."
            class="w-full px-4 py-2.5 rounded-xl border text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:ring-2 transition-all"
            :class="errors.nombre ? 'border-red-400 focus:ring-red-200 bg-red-50/30' : 'border-[#EEDCD5] focus:border-[#4A1521] focus:ring-[#4A1521]/20'"
          />
          <p v-if="errors.nombre" class="text-[11px] text-red-600 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">error</span>
            {{ errors.nombre }}
          </p>
        </div>

        <!-- Categoría & Familia Olfativa -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
              Categoría <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.categoria"
              @change="validateField('categoria')"
              class="w-full px-4 py-2.5 rounded-xl border text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:ring-2 transition-all border-[#EEDCD5] focus:border-[#4A1521] focus:ring-[#4A1521]/20 cursor-pointer"
            >
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="unisex">Unisex</option>
              <option value="sets">Sets & Regalos</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
              Familia Olfativa <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.familia"
              @change="validateField('familia')"
              class="w-full px-4 py-2.5 rounded-xl border text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:ring-2 transition-all border-[#EEDCD5] focus:border-[#4A1521] focus:ring-[#4A1521]/20 cursor-pointer"
            >
              <option value="Floral">Floral</option>
              <option value="Amaderado">Amaderado</option>
              <option value="Oriental">Oriental</option>
              <option value="Gourmand">Gourmand</option>
              <option value="Chypre">Chypre</option>
              <option value="Cítrico">Cítrico</option>
              <option value="Cuero">Cuero</option>
              <option value="Sets y Regalos">Sets y Regalos</option>
            </select>
          </div>
        </div>

        <!-- Concentración, Volumen y Tag -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
              Concentración
            </label>
            <select
              v-model="formData.concentracion"
              class="w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm text-[#1B1C1B] bg-[#FCF9F7] border-[#EEDCD5] focus:outline-none focus:border-[#4A1521]"
            >
              <option value="Eau de Parfum">Eau de Parfum (18-20%)</option>
              <option value="Extrait de Parfum">Extrait de Parfum (25-30%)</option>
              <option value="Eau de Toilette">Eau de Toilette (10-15%)</option>
              <option value="Cologne">Cologne Absolue</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
              Presentación
            </label>
            <input
              v-model="formData.volumen"
              type="text"
              placeholder="100ml / 50ml"
              class="w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm text-[#1B1C1B] bg-[#FCF9F7] border-[#EEDCD5] focus:outline-none focus:border-[#4A1521]"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
              Etiqueta Destacada
            </label>
            <input
              v-model="formData.tag"
              type="text"
              placeholder="Bestseller, Novedad..."
              class="w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm text-[#1B1C1B] bg-[#FCF9F7] border-[#EEDCD5] focus:outline-none focus:border-[#4A1521]"
            />
          </div>
        </div>

        <!-- Precio & Stock -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
              Precio en ARS ($) <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 font-semibold">$</span>
              <input
                v-model="formData.precio"
                @blur="validateField('precio')"
                type="number"
                min="1"
                step="100"
                placeholder="28900"
                class="w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:ring-2 transition-all"
                :class="errors.precio ? 'border-red-400 focus:ring-red-200' : 'border-[#EEDCD5] focus:border-[#4A1521]'"
              />
            </div>
            <p v-if="errors.precio" class="text-[11px] text-red-600 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">error</span>
              {{ errors.precio }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
              Stock Disponible <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.stock"
              @blur="validateField('stock')"
              type="number"
              min="0"
              placeholder="15"
              class="w-full px-4 py-2.5 rounded-xl border text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:ring-2 transition-all"
              :class="errors.stock ? 'border-red-400 focus:ring-red-200' : 'border-[#EEDCD5] focus:border-[#4A1521]'"
            />
            <p v-if="errors.stock" class="text-[11px] text-red-600 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">error</span>
              {{ errors.stock }}
            </p>
          </div>
        </div>

        <!-- Descripción -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
            Descripción Poética y Reseña Sensorial <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.descripcion"
            @blur="validateField('descripcion')"
            rows="3"
            placeholder="Un bouquet etéreo de jazmín blanco, pétalos de loto macerados en rocío matinal y una estela tibia de almizcle..."
            class="w-full px-4 py-2.5 rounded-xl border text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:ring-2 transition-all"
            :class="errors.descripcion ? 'border-red-400 focus:ring-red-200' : 'border-[#EEDCD5] focus:border-[#4A1521]'"
          ></textarea>
          <div class="flex items-center justify-between text-[11px] text-gray-500">
            <p v-if="errors.descripcion" class="text-red-600 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">error</span>
              {{ errors.descripcion }}
            </p>
            <span class="ml-auto">{{ formData.descripcion.length }} / mín. 10 carac.</span>
          </div>
        </div>

        <!-- Pirámide Olfativa (Notas de Salida, Corazón, Fondo) -->
        <div class="space-y-3 bg-[#FCF9F7] p-4 rounded-xl border border-[#EEDCD5]">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-[#4A1521] flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">psychiatry</span>
            Pirámide Olfativa (Separadas por comas)
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[10px] font-medium uppercase text-gray-600 mb-1">Notas de Salida</label>
              <input
                v-model="formData.notasSalida"
                type="text"
                placeholder="Bergamota, Mandarina..."
                class="w-full px-3 py-2 rounded-lg border border-[#EEDCD5] text-xs bg-white focus:outline-none focus:border-[#4A1521]"
              />
            </div>
            <div>
              <label class="block text-[10px] font-medium uppercase text-gray-600 mb-1">Notas de Corazón</label>
              <input
                v-model="formData.notasCorazon"
                type="text"
                placeholder="Jazmín Sambac, Rosa..."
                class="w-full px-3 py-2 rounded-lg border border-[#EEDCD5] text-xs bg-white focus:outline-none focus:border-[#4A1521]"
              />
            </div>
            <div>
              <label class="block text-[10px] font-medium uppercase text-gray-600 mb-1">Notas de Fondo</label>
              <input
                v-model="formData.notasFondo"
                type="text"
                placeholder="Sándalo, Vainilla Bourbon..."
                class="w-full px-3 py-2 rounded-lg border border-[#EEDCD5] text-xs bg-white focus:outline-none focus:border-[#4A1521]"
              />
            </div>
          </div>
        </div>

        <!-- URL de la Imagen y Galería de Preajustes -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-[#4A1521]">
            URL de Fotografía del Frasco <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.imagen"
            @blur="validateField('imagen')"
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            class="w-full px-4 py-2.5 rounded-xl border text-sm text-[#1B1C1B] bg-[#FCF9F7] focus:outline-none focus:ring-2 transition-all"
            :class="errors.imagen ? 'border-red-400 focus:ring-red-200' : 'border-[#EEDCD5] focus:border-[#4A1521]'"
          />
          <p v-if="errors.imagen" class="text-[11px] text-red-600 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">error</span>
            {{ errors.imagen }}
          </p>

          <!-- Preajustes rápidos de frascos -->
          <div class="pt-1">
            <span class="text-[11px] text-gray-500 block mb-1.5 font-medium">O seleccioná una fotografía de nuestro atelier:</span>
            <div class="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                v-for="(preset, idx) in imagePresets"
                :key="idx"
                type="button"
                @click="formData.imagen = preset.url"
                class="shrink-0 w-12 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer"
                :class="formData.imagen === preset.url ? 'border-[#4A1521] ring-2 ring-[#4A1521]/30' : 'border-[#EEDCD5] hover:opacity-80'"
                :title="preset.label"
              >
                <img :src="preset.url" :alt="preset.label" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="pt-4 border-t border-[#EEDCD5] flex items-center justify-end gap-3">
          <button
            type="button"
            @click="emit('cancel')"
            class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-6 py-2.5 rounded-xl bg-[#4A1521] text-white hover:bg-[#2F020D] text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">save</span>
            <span>{{ isEditing ? 'Guardar Modificaciones' : 'Registrar Fragancia' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Live Preview Col (5 cols) -->
    <div class="lg:col-span-5 space-y-4">
      <div class="bg-[#FCF9F7] rounded-2xl p-5 border border-[#EEDCD5] space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-[#4A1521] flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">visibility</span>
            Previsualización en Tiempo Real
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
            Reactivo v-model
          </span>
        </div>
        <p class="text-xs text-gray-500 font-light">
          Así se visualizará la tarjeta del perfume en la tienda y catálogo de Aromancia:
        </p>
      </div>

      <!-- Preview Card Instance -->
      <div class="max-w-sm mx-auto">
        <div class="bg-white rounded-xl overflow-hidden border border-[#EEDCD5] shadow-lg flex flex-col">
          <div class="relative aspect-4/5 bg-[#F6EEEC] overflow-hidden">
            <img
              :src="previewPerfume.imagen"
              :alt="previewPerfume.nombre"
              class="w-full h-full object-cover"
            />
            <div v-if="previewPerfume.tag" class="absolute top-3 left-3">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold tracking-wider uppercase bg-[#4A1521] text-white shadow-sm">
                {{ previewPerfume.tag }}
              </span>
            </div>
            <div class="absolute bottom-3 left-3">
              <span class="px-2.5 py-1 rounded-md text-[10px] font-sans font-medium tracking-wide uppercase bg-white/90 text-[#4A1521] shadow-xs">
                {{ previewPerfume.categoria }} · {{ previewPerfume.familia }}
              </span>
            </div>
          </div>

          <div class="p-5 space-y-3">
            <div class="flex items-center justify-between text-[11px] text-[#7D5260]">
              <span>{{ previewPerfume.concentracion }}</span>
              <span>{{ previewPerfume.volumen }}</span>
            </div>

            <h3 class="font-serif text-xl text-[#1B1C1B] font-medium leading-snug">
              {{ previewPerfume.nombre || 'Nombre de la Fragancia' }}
            </h3>

            <p class="font-sans text-xs text-gray-500 font-light line-clamp-2 leading-relaxed">
              {{ previewPerfume.descripcion || 'La descripción del perfume aparecerá aquí en tiempo real mientras escribís en el formulario.' }}
            </p>

            <div class="pt-2 border-t border-[#EEDCD5]/60 flex items-center justify-between">
              <span class="font-serif text-xl font-bold text-[#4A1521]">
                ${{ Number(previewPerfume.precio || 0).toLocaleString('es-AR') }}
              </span>
              <span class="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                Stock: {{ previewPerfume.stock || 0 }} u.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { Perfume, PerfumeFormData, FormErrors, OlfactoryFamily } from '../types';

const props = defineProps<{
  initialData?: Perfume | null;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: any): void;
  (e: 'cancel'): void;
}>();

const imagePresets = [
  { label: 'Flor de Loto', url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rosé Éclat', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Noir Absolu', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80' },
  { label: 'Santal Impérial', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ambre Mystique', url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cédre Noble', url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80' }
];

const formData = reactive<PerfumeFormData>({
  nombre: '',
  categoria: 'femenino',
  familia: 'Floral',
  concentracion: 'Eau de Parfum',
  precio: 28900,
  volumen: '100ml',
  descripcion: '',
  imagen: imagePresets[0].url,
  tag: 'Novedad',
  notasSalida: 'Bergamota, Mandarina',
  notasCorazon: 'Jazmín Sambac, Rosa Damascena',
  notasFondo: 'Sándalo, Ámbar gris',
  acordes: 'Floral, Fresco, Elegante',
  stock: 12
});

const errors = reactive<FormErrors>({});

// Sync with initialData if editing
watch(
  () => props.initialData,
  (val) => {
    if (val) {
      formData.nombre = val.nombre || '';
      formData.categoria = val.categoria || 'femenino';
      formData.familia = val.familia || 'Floral';
      formData.concentracion = val.concentracion || 'Eau de Parfum';
      formData.precio = val.precio || 0;
      formData.volumen = val.volumen || '100ml';
      formData.descripcion = val.descripcion || '';
      formData.imagen = val.imagen || imagePresets[0].url;
      formData.tag = val.tag || '';
      formData.notasSalida = val.notas?.top?.join(', ') || '';
      formData.notasCorazon = val.notas?.heart?.join(', ') || '';
      formData.notasFondo = val.notas?.base?.join(', ') || '';
      formData.acordes = val.acordesPrincipales?.join(', ') || '';
      formData.stock = val.stock ?? 10;
    }
  },
  { immediate: true }
);

// Custom validations
const validateField = (field: keyof FormErrors) => {
  switch (field) {
    case 'nombre':
      if (!formData.nombre.trim()) {
        errors.nombre = 'El nombre de la fragancia es obligatorio.';
      } else if (formData.nombre.trim().length < 3) {
        errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
      } else {
        delete errors.nombre;
      }
      break;

    case 'precio':
      const p = Number(formData.precio);
      if (!formData.precio || isNaN(p) || p <= 0) {
        errors.precio = 'Ingresá un precio numérico válido mayor a 0.';
      } else {
        delete errors.precio;
      }
      break;

    case 'stock':
      const s = Number(formData.stock);
      if (formData.stock === '' || isNaN(s) || s < 0) {
        errors.stock = 'Ingresá una cantidad de stock válida (mínimo 0).';
      } else {
        delete errors.stock;
      }
      break;

    case 'descripcion':
      if (!formData.descripcion.trim()) {
        errors.descripcion = 'La descripción es obligatoria.';
      } else if (formData.descripcion.trim().length < 10) {
        errors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
      } else {
        delete errors.descripcion;
      }
      break;

    case 'imagen':
      if (!formData.imagen.trim()) {
        errors.imagen = 'La URL de la fotografía es obligatoria.';
      } else if (!formData.imagen.startsWith('http')) {
        errors.imagen = 'La URL debe comenzar con http:// o https://';
      } else {
        delete errors.imagen;
      }
      break;
  }
};

const validateAll = (): boolean => {
  validateField('nombre');
  validateField('precio');
  validateField('stock');
  validateField('descripcion');
  validateField('imagen');
  return Object.keys(errors).length === 0;
};

// Live Preview Object
const previewPerfume = computed<Partial<Perfume>>(() => ({
  nombre: formData.nombre || 'Nombre de la Fragancia',
  categoria: formData.categoria,
  familia: formData.familia,
  concentracion: formData.concentracion,
  precio: Number(formData.precio) || 0,
  volumen: formData.volumen || '100ml',
  descripcion: formData.descripcion,
  imagen: formData.imagen || imagePresets[0].url,
  tag: formData.tag,
  stock: Number(formData.stock) || 0
}));

const handleSubmit = () => {
  if (!validateAll()) return;

  const parseList = (str: string) =>
    str.split(',').map(s => s.trim()).filter(Boolean);

  const payload: any = {
    nombre: formData.nombre.trim(),
    categoria: formData.categoria,
    familia: formData.familia as OlfactoryFamily,
    concentracion: formData.concentracion,
    precio: Number(formData.precio),
    volumen: formData.volumen.trim() || '100ml',
    descripcion: formData.descripcion.trim(),
    imagen: formData.imagen.trim(),
    tag: formData.tag.trim() || undefined,
    stock: Number(formData.stock),
    notas: {
      top: parseList(formData.notasSalida),
      heart: parseList(formData.notasCorazon),
      base: parseList(formData.notasFondo)
    },
    acordesPrincipales: parseList(formData.acordes),
    calificacion: props.initialData?.calificacion || 4.9,
    totalResenas: props.initialData?.totalResenas || 1
  };

  emit('submit', payload);
};
</script>
