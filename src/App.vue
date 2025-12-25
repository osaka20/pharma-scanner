<template>
  <div class="app">
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>💊 Pharma Scanner</h1>
      </div>
      <div class="navbar-menu">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          {{ $t('nav.dashboard') }}
        </router-link>
        <router-link to="/products" class="nav-link" :class="{ active: $route.path === '/products' }">
          {{ $t('nav.catalog') }}
        </router-link>
        <router-link to="/import-export" class="nav-link" :class="{ active: $route.path === '/import-export' }">
          {{ $t('nav.importExport') }}
        </router-link>
      </div>
      <div class="navbar-language">
        <select v-model="currentLanguage" @change="changeLanguage" class="language-select">
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'App',
  setup() {
    const { locale } = useI18n()
    const currentLanguage = ref(locale.value)

    const changeLanguage = () => {
      locale.value = currentLanguage.value
      localStorage.setItem('language', currentLanguage.value)
    }

    return {
      currentLanguage,
      changeLanguage
    }
  }
}
</script>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .navbar-brand h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  .navbar-menu {
    display: flex;
    gap: 2rem;
    flex: 1;
    justify-content: center;
  }

  .nav-link {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: bold;
    }
  }

  .navbar-language {
    .language-select {
      padding: 0.5rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      option {
        background-color: #667eea;
        color: white;
      }
    }
  }
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
