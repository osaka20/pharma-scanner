<template>
  <div class="products">
    <div class="products-header">
      <h1>{{ $t('products.title') }}</h1>
      <button @click="openAddProductModal" class="btn btn-primary btn-lg">
        + {{ $t('products.addProduct') }}
      </button>
    </div>

    <!-- Barre de recherche et filtres -->
    <div class="filters-section card mb-3">
      <div class="filter-row">
        <div class="filter-group">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('products.search')"
            class="search-input"
          />
        </div>
        <div class="filter-group">
          <select v-model="selectedBrand" class="filter-select">
            <option value="">{{ $t('products.filter') }}</option>
            <option v-for="brand in uniqueBrands" :key="brand" :value="brand">
              {{ brand }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <select v-model="sortBy" class="filter-select">
            <option value="name">{{ $t('products.sortBy') }}: {{ $t('products.name') }}</option>
            <option value="salePrice">{{ $t('products.sortBy') }}: {{ $t('products.salePrice') }}</option>
            <option value="margin">{{ $t('products.sortBy') }}: {{ $t('products.margin') }}</option>
            <option value="quantity">{{ $t('products.sortBy') }}: {{ $t('products.quantity') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Compteur de résultats -->
    <div class="results-info">
      {{ $t('products.results', { count: filteredProducts.length }) }}
    </div>

    <!-- Tableau des produits -->
    <div v-if="filteredProducts.length === 0" class="alert alert-info">
      {{ $t('products.noProducts') }}
    </div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>{{ $t('products.name') }}</th>
            <th>{{ $t('products.brand') }}</th>
            <th>{{ $t('products.purchasePrice') }}</th>
            <th>{{ $t('products.salePrice') }}</th>
            <th>{{ $t('products.margin') }} %</th>
            <th>{{ $t('products.quantity') }}</th>
            <th>{{ $t('products.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id" class="product-row">
            <td class="product-name">
              <router-link :to="`/products/${product.id}`">
                {{ product.name }}
              </router-link>
            </td>
            <td>{{ product.brand }}</td>
            <td class="price-cell">{{ formatCurrency(product.purchasePrice) }}</td>
            <td class="price-cell">{{ formatCurrency(product.salePrice) }}</td>
            <td :class="{ 'negative-margin': calculateMarginPercent(product) < 0 }">
              {{ calculateMarginPercent(product).toFixed(2) }}%
            </td>
            <td>{{ product.quantity || 0 }}</td>
            <td class="actions-cell">
              <button @click="editProduct(product)" class="btn btn-secondary btn-sm">
                {{ $t('products.edit') }}
              </button>
              <button @click="deleteProduct(product)" class="btn btn-danger btn-sm">
                {{ $t('products.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage === 1"
        class="btn btn-secondary"
      >
        ← {{ $t('common.cancel') }}
      </button>
      <span>{{ $t('products.pagination', { current: currentPage, total: totalPages }) }}</span>
      <button
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="btn btn-secondary"
      >
        {{ $t('common.cancel') }} →
      </button>
    </div>

    <!-- Modal d'ajout/édition -->
    <ProductForm
      v-if="showProductForm"
      :product="selectedProduct"
      @save="saveProduct"
      @close="showProductForm = false"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../stores/productStore'
import ProductForm from '../components/ProductForm.vue'

export default {
  name: 'Products',
  components: {
    ProductForm
  },
  setup() {
    const productStore = useProductStore()
    const searchQuery = ref('')
    const selectedBrand = ref('')
    const sortBy = ref('name')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const showProductForm = ref(false)
    const selectedProduct = ref(null)

    onMounted(async () => {
      await productStore.initDatabase()
    })

    const uniqueBrands = computed(() => {
      return [...new Set(productStore.products.map(p => p.brand))].sort()
    })

    const filteredProducts = computed(() => {
      let filtered = productStore.products.filter(product => {
        const matchSearch = !searchQuery.value || 
          product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (product.code && product.code.toLowerCase().includes(searchQuery.value.toLowerCase()))
        
        const matchBrand = !selectedBrand.value || product.brand === selectedBrand.value
        
        return matchSearch && matchBrand
      })

      // Tri
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'salePrice':
            return parseFloat(b.salePrice || 0) - parseFloat(a.salePrice || 0)
          case 'margin':
            const marginA = parseFloat(a.margin || 0)
            const marginB = parseFloat(b.margin || 0)
            return marginB - marginA
          case 'quantity':
            return parseFloat(b.quantity || 0) - parseFloat(a.quantity || 0)
          case 'name':
          default:
            return a.name.localeCompare(b.name)
        }
      })

      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    })

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredProducts.value.slice(start, end)
    })

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(parseFloat(value) || 0)
    }

    const calculateMarginPercent = (product) => {
      const cost = parseFloat(product.purchasePrice) || 0
      if (cost === 0) return 0
      const margin = parseFloat(product.margin) || 0
      return (margin / cost) * 100
    }

    const openAddProductModal = () => {
      selectedProduct.value = null
      showProductForm.value = true
    }

    const editProduct = (product) => {
      selectedProduct.value = { ...product }
      showProductForm.value = true
    }

    const deleteProduct = async (product) => {
      if (confirm(this.$t('productForm.confirmDelete'))) {
        try {
          await productStore.deleteProduct(product.id)
        } catch (error) {
          alert('Erreur lors de la suppression')
        }
      }
    }

    const saveProduct = async (productData) => {
      try {
        if (selectedProduct.value?.id) {
          await productStore.updateProduct(selectedProduct.value.id, productData)
        } else {
          await productStore.addProduct(productData)
        }
        showProductForm.value = false
        currentPage.value = 1
      } catch (error) {
        alert('Erreur lors de l\'enregistrement du produit')
      }
    }

    return {
      productStore,
      searchQuery,
      selectedBrand,
      sortBy,
      currentPage,
      showProductForm,
      selectedProduct,
      uniqueBrands,
      filteredProducts,
      totalPages,
      paginatedProducts,
      formatCurrency,
      calculateMarginPercent,
      openAddProductModal,
      editProduct,
      deleteProduct,
      saveProduct
    }
  }
}
</script>

<style scoped lang="scss">
.products {
  .products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
      margin: 0;
    }
  }

  .filters-section {
    .filter-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      .filter-group {
        flex: 1;
        min-width: 200px;
      }

      .search-input,
      .filter-select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;

        &:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }
      }
    }
  }

  .results-info {
    margin-bottom: 1rem;
    color: #666;
    font-size: 0.9rem;
  }

  .product-row {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f9f9f9;
    }

    .product-name a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }

    .price-cell {
      font-weight: 500;
    }

    .negative-margin {
      color: #ef5350;
      font-weight: bold;
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
      white-space: nowrap;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;

    button {
      min-width: 100px;
    }
  }
}
</style>
