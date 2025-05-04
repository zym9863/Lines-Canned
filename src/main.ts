import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerServiceWorker, checkInstallable } from './pwa'

// Create and mount the Vue app
createApp(App).mount('#app')

// Register service worker for PWA functionality
registerServiceWorker()

// Check if the app can be installed
checkInstallable()
