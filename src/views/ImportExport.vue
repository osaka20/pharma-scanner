<template>
  <div class="import-export">
    <h1>{{ $t('importExport.title') }}</h1>

    <div class="section-grid">
      <!-- Export -->
      <div class="section card">
        <div class="section-icon">📤</div>
        <h2>{{ $t('importExport.export') }}</h2>
        <p>{{ $t('importExport.exportDescription') }}</p>
        <button @click="exportDatabase" class="btn btn-success btn-lg">
          {{ $t('importExport.exportButton') }}
        </button>
      </div>

      <!-- Import -->
      <div class="section card">
        <div class="section-icon">📥</div>
        <h2>{{ $t('importExport.import') }}</h2>
        <p>{{ $t('importExport.importDescription') }}</p>
        <div class="file-input-wrapper">
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            @change="handleFileSelect"
            class="file-input"
          />
          <label for="file-input" class="btn btn-info btn-lg">
            {{ $t('importExport.selectFile') }}
          </label>
        </div>
        <button
          v-if="selectedFile"
          @click="importDatabase"
          class="btn btn-success btn-lg mt-2"
        >
          {{ $t('importExport.importButton') }}
        </button>
        <div v-if="selectedFile" class="file-info">
          📄 {{ selectedFile.name }}
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="message" :class="['alert', `alert-${message.type}`]" class="mt-3">
      {{ message.text }}
    </div>

    <!-- Historique des opérations -->
    <div v-if="operations.length > 0" class="operations-history card mt-3">
      <h3>{{ $t('history.title') }}</h3>
      <div class="operations-list">
        <div v-for="(op, index) in operations" :key="index" class="operation-item">
          <span class="operation-date">{{ op.date }}</span>
          <span class="operation-text">{{ op.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useProductStore } from '../stores/productStore'
import { useDb } from '../db/database'

export default {
  name: 'ImportExport',
  setup() {
    const productStore = useProductStore()
    const db = useDb()
    const fileInput = ref(null)
    const selectedFile = ref(null)
    const message = ref(null)
    const operations = ref([])

    onMounted(async () => {
      await productStore.initDatabase()
      loadOperations()
    })

    const loadOperations = () => {
      const stored = localStorage.getItem('import_export_operations')
      if (stored) {
        operations.value = JSON.parse(stored)
      }
    }

    const saveOperation = (text) => {
      const operation = {
        text,
        date: new Date().toLocaleString('fr-FR')
      }
      operations.value.unshift(operation)
      localStorage.setItem('import_export_operations', JSON.stringify(operations.value))
    }

    const exportDatabase = async () => {
      try {
        const data = await db.exportData()
        const json = JSON.stringify(data, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `pharma-db-${new Date().toISOString().split('T')[0]}.json`
        link.click()
        URL.revokeObjectURL(url)

        message.value = {
          type: 'success',
          text: this.$t('importExport.successExport')
        }
        saveOperation('✅ ' + this.$t('importExport.export'))

        setTimeout(() => {
          message.value = null
        }, 3000)
      } catch (error) {
        message.value = {
          type: 'error',
          text: 'Erreur lors de l\'export: ' + error.message
        }
      }
    }

    const handleFileSelect = (event) => {
      selectedFile.value = event.target.files[0]
    }

    const importDatabase = async () => {
      if (!selectedFile.value) return

      if (!confirm(this.$t('importExport.confirmImport'))) {
        return
      }

      try {
        const text = await selectedFile.value.text()
        const data = JSON.parse(text)
        await db.importData(data)
        await productStore.loadProducts()

        message.value = {
          type: 'success',
          text: this.$t('importExport.successImport')
        }
        saveOperation('✅ ' + this.$t('importExport.import') + ` (${data.products.length} produits)`)

        selectedFile.value = null
        fileInput.value.value = ''

        setTimeout(() => {
          message.value = null
        }, 3000)
      } catch (error) {
        message.value = {
          type: 'error',
          text: this.$t('importExport.errorImport') + ': ' + error.message
        }
      }
    }

    return {
      fileInput,
      selectedFile,
      message,
      operations,
      exportDatabase,
      handleFileSelect,
      importDatabase
    }
  }
}
</script>

<style scoped lang="scss">
.import-export {
  h1 {
    margin-bottom: 2rem;
  }

  .section-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .section {
    text-align: center;
    padding: 2rem;

    .section-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    h2 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    p {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .file-input-wrapper {
      position: relative;
      display: inline-block;
      width: 100%;
    }

    .file-input {
      display: none;
    }

    label {
      width: 100%;
    }

    .file-info {
      margin-top: 1rem;
      padding: 0.75rem;
      background-color: #f0f0f0;
      border-radius: 4px;
      font-size: 0.9rem;
      color: #333;
    }
  }

  .operations-history {
    .operations-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .operation-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      border-bottom: 1px solid #eee;
      font-size: 0.9rem;

      .operation-date {
        color: #999;
        font-weight: 500;
      }

      .operation-text {
        color: #333;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
