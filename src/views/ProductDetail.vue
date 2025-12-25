<template>
  <div class="product-detail">
    <router-link to="/products" class="back-link">← {{ $t('products.title') }}</router-link>

    <div v-if="product" class="detail-container">
      <div class="detail-header">
        <h1>{{ product.name }}</h1>
        <div class="actions">
          <button @click="editMode = true" class="btn btn-primary">
            {{ $t('products.edit') }}
          </button>
          <button @click="confirmDelete" class="btn btn-danger">
            {{ $t('products.delete') }}
          </button>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-section card">
          <h3>{{ $t('common.info') }}</h3>
          <div class="info-row">
            <label>{{ $t('products.name') }}</label>
            <span>{{ product.name }}</span>
          </div>
          <div class="info-row">
            <label>{{ $t('products.brand') }}</label>
            <span>{{ product.brand }}</span>
          </div>
          <div class="info-row">
            <label>{{ $t('products.code') }}</label>
            <span>{{ product.code || '-' }}</span>
          </div>
        </div>

        <div class="detail-section card">
          <h3>{{ $t('productForm.purchasePrice') }}</h3>
          <div class="price-display">
            {{ formatCurrency(product.purchasePrice) }}
          </div>
        </div>

        <div class="detail-section card">
          <h3>{{ $t('productForm.salePrice') }}</h3>
          <div class="price-display">
            {{ formatCurrency(product.salePrice) }}
          </div>
        </div>

        <div class="detail-section card">
          <h3>{{ $t('products.margin') }}</h3>
          <div class="margin-display" :class="{ 'negative': parseFloat(product.margin) < 0 }">
            {{ formatCurrency(product.margin) }}
          </div>
          <div class="margin-percent">
            ({{ calculateMarginPercent(product).toFixed(2) }}%)
          </div>
        </div>

        <div class="detail-section card">
          <h3>{{ $t('products.quantity') }}</h3>
          <div class="quantity-display">
            {{ product.quantity || 0 }}
          </div>
        </div>

        <div class="detail-section card">
          <h3>{{ $t('products.stock') }} {{ $t('dashboard.totalValue') }}</h3>
          <div class="stock-value">
            {{ formatCurrency(parseFloat(product.quantity || 0) * parseFloat(product.salePrice || 0)) }}
          </div>
        </div>
      </div>

      <div v-if="product.notes" class="detail-section card mt-3">
        <h3>{{ $t('products.notes') }}</h3>
        <p>{{ product.notes }}</p>
      </div>

      <div class="metadata">
        <small>{{ $t('common.info') }}: {{ formatDate(product.createdAt) }}</small>
      </div>
    </div>

    <div v-else class="alert alert-error">
      {{ $t('products.noProducts') }}
    </div>

    <!-- Modal d'édition -->
    <ProductForm
      v-if="editMode && product"
      :product="product"
      @save="updateProduct"
      @close="editMode = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import ProductForm from '../components/ProductForm.vue'

export default {
  name: 'ProductDetail',
  components: {
    ProductForm
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const productStore = useProductStore()
    const product = ref(null)
    const editMode = ref(false)

    onMounted(async () => {
      await productStore.initDatabase()
      product.value = productStore.getProduct(parseInt(route.params.id))
      if (!product.value) {
        router.push('/products')
      }
    })

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(parseFloat(value) || 0)
    }

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleString('fr-FR')
    }

    const calculateMarginPercent = (p) => {
      const cost = parseFloat(p.purchasePrice) || 0
      if (cost === 0) return 0
      const margin = parseFloat(p.margin) || 0
      return (margin / cost) * 100
    }

    const confirmDelete = async () => {
      if (confirm(this.$t('productForm.confirmDelete'))) {
        try {
          await productStore.deleteProduct(product.value.id)
          router.push('/products')
        } catch (error) {
          alert('Erreur lors de la suppression')
        }
      }
    }

    const updateProduct = async (productData) => {
      try {
        await productStore.updateProduct(product.value.id, productData)
        product.value = productStore.getProduct(product.value.id)
        editMode.value = false
      } catch (error) {
        alert('Erreur lors de la mise à jour')
      }
    }

    return {
      product,
      editMode,
      formatCurrency,
      formatDate,
      calculateMarginPercent,
      confirmDelete,
      updateProduct
    }
  }
}
</script>

<style scoped lang="scss">
.product-detail {
  .back-link {
    display: inline-block;
    margin-bottom: 1.5rem;
    color: #667eea;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 1rem;
    }
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .detail-section {
    h3 {
      margin: 0 0 1rem 0;
      color: #667eea;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    p {
      margin: 0;
      line-height: 1.6;
      white-space: pre-wrap;
    }
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #eee;

    label {
      font-weight: 600;
      color: #666;
    }

    span {
      color: #333;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .price-display,
  .margin-display,
  .quantity-display,
  .stock-value {
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
  }

  .margin-display.negative {
    color: #ef5350;
  }

  .margin-percent {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
  }

  .metadata {
    text-align: center;
    color: #999;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
  }
}
</style>
