import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LoginView from './views/LoginView.vue'
import CatalogView from './views/CatalogView.vue'
import CartView from './views/CartView.vue'
import './style.css'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',      component: CatalogView },
    { path: '/login', component: LoginView },
    { path: '/cart',  component: CartView, meta: { requiresAuth: true } },
  ],
})
router.beforeEach((to) => { if (to.meta.requiresAuth && !localStorage.getItem('token')) return '/login' })
createApp(App).use(router).mount('#app')
