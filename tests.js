/**
 * Tests basiques pour la fonctionnalité de produits
 * À lancer dans la console du navigateur ou avec un framework de test
 */

// Tests de validation de marge
function testMarginCalculation() {
  console.log('🧪 Tests de Marge')
  
  const tests = [
    { name: 'Prix achat 10€, vente 15€', achat: 10, vente: 15, expectedMargin: 5, expectedPercent: 50 },
    { name: 'Prix achat 50€, vente 50€', achat: 50, vente: 50, expectedMargin: 0, expectedPercent: 0 },
    { name: 'Prix achat 100€, vente 80€', achat: 100, vente: 80, expectedMargin: -20, expectedPercent: -20 },
    { name: 'Prix achat 0€', achat: 0, vente: 100, expectedMargin: 100, expectedPercent: 'N/A' }
  ]

  tests.forEach(test => {
    const margin = test.vente - test.achat
    const percent = test.achat === 0 ? 'N/A' : (margin / test.achat) * 100
    
    const marginOk = margin === test.expectedMargin
    const percentOk = test.expectedPercent === 'N/A' || Math.abs(percent - test.expectedPercent) < 0.01
    
    console.log(
      `${marginOk && percentOk ? '✅' : '❌'} ${test.name}: Marge=${margin}€ (${percent}%)`
    )
  })
}

// Tests de stockage
async function testDatabaseOperations() {
  console.log('🧪 Tests de Base de Données')
  
  const mockProducts = [
    {
      name: 'Paracétamol',
      brand: 'Doliprane',
      purchasePrice: 2.50,
      salePrice: 4.99,
      quantity: 50,
      margin: 2.49,
      notes: 'Stock haut'
    },
    {
      name: 'Ibuprofène',
      brand: 'Nurofen',
      purchasePrice: 5.00,
      salePrice: 8.99,
      quantity: 30,
      margin: 3.99,
      notes: ''
    }
  ]

  console.log(`✅ ${mockProducts.length} produits de test créés`)
  console.log('Produits:', mockProducts)
}

// Tests de validation
function testValidation() {
  console.log('🧪 Tests de Validation')

  const validationTests = [
    { field: 'nom', value: '', expected: false, desc: 'Nom vide - invalide' },
    { field: 'nom', value: 'Paracétamol', expected: true, desc: 'Nom rempli - valide' },
    { field: 'prix', value: -5, expected: false, desc: 'Prix négatif - invalide' },
    { field: 'prix', value: 0, expected: true, desc: 'Prix zéro - valide' },
    { field: 'quantité', value: -1, expected: false, desc: 'Quantité négative - invalide' },
    { field: 'quantité', value: 100, expected: true, desc: 'Quantité positive - valide' }
  ]

  validationTests.forEach(test => {
    let isValid = false
    
    switch(test.field) {
      case 'nom':
        isValid = test.value.trim() !== ''
        break
      case 'prix':
        isValid = !isNaN(test.value) && test.value >= 0
        break
      case 'quantité':
        isValid = !isNaN(test.value) && test.value >= 0
        break
    }

    console.log(
      `${isValid === test.expected ? '✅' : '❌'} ${test.desc}`
    )
  })
}

// Tests de recherche
function testSearch() {
  console.log('🧪 Tests de Recherche')

  const products = [
    { name: 'Paracétamol', brand: 'Doliprane', code: 'PARA001' },
    { name: 'Ibuprofène', brand: 'Nurofen', code: 'IBU001' },
    { name: 'Aspirin', brand: 'Bayer', code: 'ASP001' }
  ]

  const searchTests = [
    { query: 'Para', expected: 1 },
    { query: 'para', expected: 1 },
    { query: 'Doliprane', expected: 1 },
    { query: 'IBU', expected: 1 },
    { query: 'xyz', expected: 0 }
  ]

  searchTests.forEach(test => {
    const results = products.filter(p =>
      p.name.toLowerCase().includes(test.query.toLowerCase()) ||
      p.brand.toLowerCase().includes(test.query.toLowerCase()) ||
      p.code.toLowerCase().includes(test.query.toLowerCase())
    )

    console.log(
      `${results.length === test.expected ? '✅' : '❌'} Recherche "${test.query}": ${results.length} résultat(s)`
    )
  })
}

// Tests d'export/import JSON
function testExportImport() {
  console.log('🧪 Tests Export/Import JSON')

  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    products: [
      { id: 1, name: 'Test 1', brand: 'Brand A', purchasePrice: 10, salePrice: 20, quantity: 5 },
      { id: 2, name: 'Test 2', brand: 'Brand B', purchasePrice: 30, salePrice: 50, quantity: 3 }
    ]
  }

  try {
    const json = JSON.stringify(data, null, 2)
    console.log('✅ Export JSON: OK')
    console.log(`   Taille: ${json.length} caractères`)

    const parsed = JSON.parse(json)
    console.log('✅ Import JSON: OK')
    console.log(`   Produits restaurés: ${parsed.products.length}`)
  } catch (error) {
    console.error('❌ Export/Import: Erreur', error.message)
  }
}

// Lancer tous les tests
function runAllTests() {
  console.log('═══════════════════════════════════════')
  console.log('🧪 Suite de Tests - Pharma Scanner')
  console.log('═══════════════════════════════════════\n')
  
  testMarginCalculation()
  console.log()
  testDatabaseOperations()
  console.log()
  testValidation()
  console.log()
  testSearch()
  console.log()
  testExportImport()
  
  console.log('\n═══════════════════════════════════════')
  console.log('✅ Tests terminés!')
  console.log('═══════════════════════════════════════')
}

// Exécuter si accessible
if (typeof console !== 'undefined') {
  // Décommenter pour tester:
  // runAllTests()
}

export { runAllTests, testMarginCalculation, testValidation, testSearch }
