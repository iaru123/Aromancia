import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CatalogView from '../views/CatalogView.vue';
import DetailView from '../views/DetailView.vue';
import FormView from '../views/FormView.vue';
import AboutView from '../views/AboutView.vue';
import ContactView from '../views/ContactView.vue';
import AdminView from '../views/AdminView.vue';
import { getStoredCurrentUser } from '../services/storage';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Inicio · Aromancia' }
  },
  {
    path: '/tienda',
    name: 'Catalog',
    component: CatalogView,
    meta: { title: 'Catálogo de Fragancias · Aromancia' }
  },
  {
    path: '/detalle/:id',
    name: 'Detail',
    component: DetailView,
    props: true,
    meta: { title: 'Detalle de Fragancia · Aromancia' }
  },
  {
    path: '/alta',
    name: 'CreatePerfume',
    component: FormView,
    meta: { requiresAdmin: true, title: 'Nueva Fragancia · Aromancia' }
  },
  {
    path: '/editar/:id',
    name: 'EditPerfume',
    component: FormView,
    props: true,
    meta: { requiresAdmin: true, title: 'Modificar Fragancia · Aromancia' }
  },
  {
    path: '/nosotros',
    name: 'About',
    component: AboutView,
    meta: { title: 'El Atelier · Aromancia' }
  },
  {
    path: '/contacto',
    name: 'Contact',
    component: ContactView,
    meta: { title: 'Contacto y Asesoramiento · Aromancia' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAdmin: true, title: 'Panel de Administrador · Aromancia' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Navigation Guard for Admin Routes (+Nueva Fragancia & Panel Administrador)
router.beforeEach((to, _from, next) => {
  const currentUser = getStoredCurrentUser();
  const isAdmin = currentUser?.rol === 'admin';

  if (to.meta.requiresAdmin && !isAdmin) {
    // Redirect to home if unauthenticated or not an admin
    next({ path: '/', query: { requireAdmin: '1' } });
  } else {
    next();
  }
});
