<template>
  <div class="dashboard">
    <h1>{{ $t('dashboard.title') }}</h1>
    
    <!-- Statistiques principales -->
    <div class="stats-grid grid grid-3">
      <div class="stat-card card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <div class="stat-label">{{ $t('dashboard.totalProducts') }}</div>
          <div class="stat-value">{{ productStore.totalProducts }}</div>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-label">{{ $t('dashboard.totalValue') }}</div>
          <div class="stat-value">{{ formatCurrency(productStore.totalStockValue) }}</div>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <div class="stat-label">{{ $t('dashboard.totalMargin') }}</div>
          <div class="stat-value">{{ formatCurrency(productStore.totalMargin) }}</div>
        </div>
      </div>
    </div>

    <!-- Produits récemment ajoutés -->
    <div class="recent-section mt-3">
      <div class="section-header">
        <h2>{{ $t('dashboard.recentlyAdded') }}</h2>
        <router-link to="/products" class="btn btn-primary btn-sm">
          {{ $t('products.title') }} →
        </router-link>
      </div>

      <div v-if="productStore.recentProducts.length === 0" class="alert alert-info">
        {{ $t('dashboard.noProducts') }}
      </div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>{{ $t('products.name') }}</th>
              <th>{{ $t('products.brand') }}</th>
              <th>{{ $t('products.salePrice') }}</th>
              <th>{{ $t('products.margin') }}</th>
              <th>{{ $t('products.quantity') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productStore.recentProducts" :key="product.id">
              <td>
                <router-link :to="`/products/${product.id}`" class="product-link">
                  {{ product.name }}
                </router-link>
              </td>
              <td>{{ product.brand }}</td>
              <td>{{ formatCurrency(product.salePrice) }}</td>
              <td :class="{ 'negative-margin': parseFloat(product.margin) < 0 }">
                {{ formatCurrency(product.margin) }}
              </td>
              <td>{{ product.quantity || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useProductStore } from '../stores/productStore'

export default {
  name: 'Dashboard',
  setup() {
    const productStore = useProductStore()

    onMounted(async () => {
      await productStore.initDatabase()
    })

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(parseFloat(value) || 0)
    }

    return {
      productStore,
      formatCurrency
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard {
  h1 {
    margin-bottom: 2rem;
    color: #333;
  }

  .stats-grid {
    margin-bottom: 3rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;

    .stat-icon {
      font-size: 3rem;
      opacity: 0.8;
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }
  }

  .recent-section {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h2 {
        margin: 0;
        color: #333;
      }
    }

    .product-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }

    .negative-margin {
      color: #ef5350;
      font-weight: bold;
    }
  }
}
</style>
