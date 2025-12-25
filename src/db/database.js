let dbInstance = null

/**
 * Utilise IndexedDB pour persister les données localement
 * Compatible avec tous les navigateurs modernes et Tauri
 */
export function useDb() {
  const DB_NAME = 'PharmaDB'
  const DB_VERSION = 1
  const STORE_NAME = 'products'

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        dbInstance = request.result
        resolve(dbInstance)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        // Créer le magasin d'objets s'il n'existe pas
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
          store.createIndex('name', 'name', { unique: false })
          store.createIndex('brand', 'brand', { unique: false })
          store.createIndex('code', 'code', { unique: false })
          store.createIndex('createdAt', 'createdAt', { unique: false })
        }
      }
    })
  }

  const init = async () => {
    if (!dbInstance) {
      await openDatabase()
    }
  }

  const getAllProducts = () => {
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  const getProduct = (id) => {
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  const addProduct = (product) => {
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      
      const productWithMetadata = {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const request = store.add(productWithMetadata)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  const updateProduct = (id, product) => {
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      
      const productWithMetadata = {
        ...product,
        id,
        updatedAt: new Date().toISOString()
      }
      
      const request = store.put(productWithMetadata)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  const searchProducts = (query) => {
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const results = request.result.filter(product => {
          const q = query.toLowerCase()
          return (
            product.name.toLowerCase().includes(q) ||
            (product.brand && product.brand.toLowerCase().includes(q)) ||
            (product.code && product.code.toLowerCase().includes(q))
          )
        })
        resolve(results)
      }
    })
  }

  const clearAllData = () => {
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  const exportData = async () => {
    const products = await getAllProducts()
    return {
      version: 1,
      exportDate: new Date().toISOString(),
      products
    }
  }

  const importData = async (data) => {
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Format de données invalide')
    }

    await clearAllData()

    for (const product of data.products) {
      delete product.id // Supprimer l'ID pour que la BD en génère un nouveau
      await addProduct(product)
    }
  }

  return {
    init,
    getAllProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    clearAllData,
    exportData,
    importData
  }
}
