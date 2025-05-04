<script setup lang="ts">
import { ref, onMounted } from 'vue';

const showInstallButton = ref(false);

// Function to trigger the install prompt
function installApp() {
  // Dispatch the event that will be caught by the event listener in pwa.ts
  document.dispatchEvent(new Event('appInstall'));
}

onMounted(() => {
  // Listen for the custom event from pwa.ts that indicates the app is installable
  document.addEventListener('appInstallable', () => {
    showInstallButton.value = true;
  });
});
</script>

<template>
  <div v-if="showInstallButton" class="install-container">
    <button @click="installApp" class="install-button">
      <span class="icon">📱</span>
      安装应用
    </button>
  </div>
</template>

<style scoped>
.install-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.install-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(120deg, #8e2de2, #4a00e0);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.install-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.icon {
  font-size: 1.2em;
}
</style>
