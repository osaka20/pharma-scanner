import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDb } from '../db/database'

export const useProductStore = defineStore('products', () => {
  const db = useDb()
  const products = ref([])
  const history = ref([])

  // Initialiser la base de données au premier chargement
  const initDatabase = async () => {
    try {
      await db.init()
      await loadProducts()
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base:', error)
    }
  }

  // Charger tous les produits
  const loadProducts = async () => {
    try {
      products.value = await db.getAllProducts()
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    }
  }

  // Ajouter un produit
  const addProduct = async (product) => {
    try {
      const id = await db.addProduct(product)
      product.id = id
      products.value.push(product)
      addHistory('created', product.name)
      return id
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error)
      throw error
    }
  }

  // Mettre à jour un produit
  const updateProduct = async (id, product) => {
    try {
      await db.updateProduct(id, product)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = { ...product, id }
      }
      addHistory('updated', product.name)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
      throw error
    }
  }

  // Supprimer un produit
  const deleteProduct = async (id) => {
    try {
      const product = products.value.find(p => p.id === id)
      await db.deleteProduct(id)
      products.value = products.value.filter(p => p.id !== id)
      if (product) {
        addHistory('deleted', product.name)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
      throw error
    }
  }

  // Obtenir un produit par ID
  const getProduct = (id) => {
    return products.value.find(p => p.id === id)
  }

  // Ajouter à l'historique
  const addHistory = (action, productName) => {
    history.value.unshift({
      action,
      product: productName,
      date: new Date().toLocaleString(),
      timestamp: Date.now()
    })
    // Garder seulement les 100 derniers événements
    if (history.value.length > 100) {
      history.value = history.value.slice(0, 100)
    }
  }

  // Calculer les statistiques
  const totalProducts = computed(() => products.value.length)
  
  const totalStockValue = computed(() => {
    return products.value.reduce((sum, p) => {
      const quantity = parseFloat(p.quantity) || 0
      const salePrice = parseFloat(p.salePrice) || 0
      return sum + (quantity * salePrice)
    }, 0)
  })

  const totalMargin = computed(() => {
    return products.value.reduce((sum, p) => {
      const quantity = parseFloat(p.quantity) || 0
      const margin = parseFloat(p.margin) || 0
      return sum + (quantity * margin)
    }, 0)
  })

  // Récupérer les produits récemment ajoutés
  const recentProducts = computed(() => {
    return products.value
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
      .slice(0, 5)
  })

  return {
    products,
    history,
    initDatabase,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    totalProducts,
    totalStockValue,
    totalMargin,
    recentProducts
  }
})
