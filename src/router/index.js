import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Products from '../views/Products.vue'
import ProductDetail from '../views/ProductDetail.vue'
import ImportExport from '../views/ImportExport.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/import-export',
    name: 'ImportExport',
    component: ImportExport
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
