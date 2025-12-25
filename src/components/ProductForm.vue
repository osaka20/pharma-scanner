<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <h2>
          {{ product
            ? $t('productForm.editProduct')
            : $t('productForm.addNew')
          }}
        </h2>
      </div>

      <form @submit.prevent="submitForm" class="modal-body">
        <!-- Nom du produit -->
        <div class="form-group">
          <label for="name">{{ $t('productForm.productName') }}</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            @input="calculateMargin"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <!-- Marque -->
        <div class="form-group">
          <label for="brand">{{ $t('productForm.productBrand') }}</label>
          <input
            id="brand"
            v-model="form.brand"
            type="text"
            required
          />
          <span v-if="errors.brand" class="error-message">{{ errors.brand }}</span>
        </div>

        <!-- Code produit -->
        <div class="form-group">
          <label for="code">{{ $t('productForm.productCode') }}</label>
          <input
            id="code"
            v-model="form.code"
            type="text"
            placeholder="Ex: SKU-001"
          />
        </div>

        <!-- Prix d'achat -->
        <div class="form-group">
          <label for="purchasePrice">{{ $t('productForm.purchasePrice') }}</label>
          <input
            id="purchasePrice"
            v-model.number="form.purchasePrice"
            type="number"
            step="0.01"
            min="0"
            @input="calculateMargin"
          />
          <span v-if="errors.purchasePrice" class="error-message">
            {{ errors.purchasePrice }}
          </span>
        </div>

        <!-- Prix de vente -->
        <div class="form-group">
          <label for="salePrice">{{ $t('productForm.salePrice') }}</label>
          <input
            id="salePrice"
            v-model.number="form.salePrice"
            type="number"
            step="0.01"
            min="0"
            @input="calculateMargin"
          />
          <span v-if="errors.salePrice" class="error-message">
            {{ errors.salePrice }}
          </span>
        </div>

        <!-- Marge calculée -->
        <div class="form-group">
          <label for="margin">{{ $t('productForm.calculatedMargin') }}</label>
          <input
            id="margin"
            v-model.number="form.margin"
            type="number"
            step="0.01"
            readonly
            class="readonly-input"
          />
          <small v-if="marginPercent !== null">
            ({{ marginPercent.toFixed(2) }}%)
          </small>
        </div>

        <!-- Quantité -->
        <div class="form-group">
          <label for="quantity">{{ $t('productForm.quantity') }}</label>
          <input
            id="quantity"
            v-model.number="form.quantity"
            type="number"
            min="0"
            step="1"
          />
          <span v-if="errors.quantity" class="error-message">
            {{ errors.quantity }}
          </span>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label for="notes">{{ $t('productForm.notes') }}</label>
          <textarea
            id="notes"
            v-model="form.notes"
            :placeholder="$t('productForm.notes')"
          />
        </div>

        <!-- Erreurs de validation générale -->
        <div v-if="generalError" class="alert alert-error">
          {{ generalError }}
        </div>

        <!-- Boutons -->
        <div class="modal-footer">
          <button type="button" @click="closeModal" class="btn btn-secondary">
            {{ $t('common.cancel') }}
          </button>
          <button type="submit" class="btn btn-primary">
            {{ $t('common.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ProductForm',
  props: {
    product: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const { t } = useI18n()

    const form = reactive({
      name: '',
      brand: '',
      code: '',
      purchasePrice: 0,
      salePrice: 0,
      margin: 0,
      quantity: 0,
      notes: ''
    })

    const errors = reactive({
      name: null,
      brand: null,
      purchasePrice: null,
      salePrice: null,
      quantity: null
    })

    const generalError = ref(null)

    // Initialiser le formulaire avec les données du produit
    watch(() => props.product, (newProduct) => {
      if (newProduct) {
        form.name = newProduct.name || ''
        form.brand = newProduct.brand || ''
        form.code = newProduct.code || ''
        form.purchasePrice = parseFloat(newProduct.purchasePrice) || 0
        form.salePrice = parseFloat(newProduct.salePrice) || 0
        form.margin = parseFloat(newProduct.margin) || 0
        form.quantity = parseInt(newProduct.quantity) || 0
        form.notes = newProduct.notes || ''
      } else {
        resetForm()
      }
    }, { immediate: true })

    const resetForm = () => {
      form.name = ''
      form.brand = ''
      form.code = ''
      form.purchasePrice = 0
      form.salePrice = 0
      form.margin = 0
      form.quantity = 0
      form.notes = ''
    }

    const calculateMargin = () => {
      form.margin = (form.salePrice || 0) - (form.purchasePrice || 0)
    }

    const marginPercent = computed(() => {
      const cost = form.purchasePrice || 0
      if (cost === 0) return null
      return (form.margin / cost) * 100
    })

    const validateForm = () => {
      generalError.value = null
      errors.name = null
      errors.brand = null
      errors.purchasePrice = null
      errors.salePrice = null
      errors.quantity = null

      let isValid = true

      if (!form.name.trim()) {
        errors.name = t('validation.required')
        isValid = false
      }

      if (!form.brand.trim()) {
        errors.brand = t('validation.required')
        isValid = false
      }

      if (form.purchasePrice < 0) {
        errors.purchasePrice = t('validation.priceGreaterThanZero')
        isValid = false
      }

      if (form.salePrice < 0) {
        errors.salePrice = t('validation.priceGreaterThanZero')
        isValid = false
      }

      if (form.quantity < 0) {
        errors.quantity = t('validation.quantityNotNegative')
        isValid = false
      }

      return isValid
    }

    const submitForm = () => {
      if (validateForm()) {
        emit('save', {
          name: form.name.trim(),
          brand: form.brand.trim(),
          code: form.code.trim(),
          purchasePrice: form.purchasePrice,
          salePrice: form.salePrice,
          margin: form.margin,
          quantity: form.quantity,
          notes: form.notes.trim()
        })
      }
    }

    const closeModal = () => {
      emit('close')
    }

    return {
      form,
      errors,
      generalError,
      marginPercent,
      calculateMargin,
      submitForm,
      closeModal
    }
  }
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  .modal-header {
    margin-bottom: 1.5rem;

    h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }
  }

  .modal-body {
    margin-bottom: 1.5rem;
  }

  .modal-footer {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &.readonly-input {
      background-color: #f5f5f5;
      color: #667eea;
      font-weight: bold;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  small {
    display: block;
    margin-top: 0.25rem;
    color: #999;
  }

  .error-message {
    display: block;
    margin-top: 0.25rem;
    color: #ef5350;
    font-size: 0.85rem;
  }
}

.alert {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;

  &-error {
    background-color: #ffebee;
    border: 1px solid #ef5350;
    color: #c62828;
  }
}
</style>
