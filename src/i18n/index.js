import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'

const savedLanguage = localStorage.getItem('language') || 'fr'

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'fr',
  messages: {
    fr,
    en
  }
})

export default i18n
