<script setup lang="ts">
import { ref } from 'vue';
import InstallPWA from './components/InstallPWA.vue';

const generatedText = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const activeButton = ref<'insult' | 'confession' | null>(null);
const showCopySuccess = ref(false);

async function generateText(type: 'insult' | 'confession', isRegenerate: boolean = false) {
  isLoading.value = true;
  errorMessage.value = '';

  // Only clear text and set active button if not regenerating
  if (!isRegenerate) {
    generatedText.value = '';
    activeButton.value = type;
  } else {
    // For regeneration, we keep the current activeButton value
    type = activeButton.value as 'insult' | 'confession';
  }

  try {
    const prompt = type === 'insult'
      ? '生成一段幽默的怼人话术，语言要诙谐有趣'
      : '生成一段浪漫的表白话术，语言要优美动人';

    // Add a random seed to ensure different results each time
    const randomSeed = Math.floor(Math.random() * 10000);

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: `${prompt} (seed: ${randomSeed})` }
        ],
        model: 'openai-large',
        private: true
      })
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }

    const data = await response.text();
    generatedText.value = data;
  } catch (error) {
    console.error('生成文本时出错:', error);
    errorMessage.value = `生成失败: ${error instanceof Error ? error.message : '未知错误'}`;
  } finally {
    isLoading.value = false;
  }
}

function copyToClipboard() {
  if (!generatedText.value) return;

  navigator.clipboard.writeText(generatedText.value)
    .then(() => {
      showCopySuccess.value = true;
      setTimeout(() => {
        showCopySuccess.value = false;
      }, 2000);
    })
    .catch(err => {
      console.error('复制失败:', err);
      errorMessage.value = '复制失败，请手动复制。';
    });
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>✨ 台词罐头</h1>
      <p class="subtitle">AI 生成的专属话术，让表达更有趣</p>
      <div class="header-decoration"></div>
    </div>

    <InstallPWA />

    <div class="button-group">
      <button
        @click="generateText('insult')"
        :disabled="isLoading"
        class="action-btn insult-btn"
        :class="{ 'loading': isLoading && activeButton === 'insult' }"
      >
        <span class="icon">🎭</span>
        {{ isLoading && activeButton === 'insult' ? '生成中...' : '生成怼人话术' }}
      </button>
      <button
        @click="generateText('confession')"
        :disabled="isLoading"
        class="action-btn confession-btn"
        :class="{ 'loading': isLoading && activeButton === 'confession' }"
      >
        <span class="icon">💝</span>
        {{ isLoading && activeButton === 'confession' ? '生成中...' : '生成表白话术' }}
      </button>
    </div>

    <div v-if="errorMessage" class="error-message">
      <span class="icon">⚠️</span>
      {{ errorMessage }}
    </div>

    <div v-if="generatedText" class="result-container">
      <div class="result-header">
        <h2>✨ 生成结果</h2>
        <div class="result-decoration"></div>
      </div>
      <div class="text-content">
        <p>{{ generatedText }}</p>
      </div>
      <div class="result-buttons">
        <button @click="generateText(activeButton as 'insult' | 'confession', true)" class="action-btn regenerate-btn" :disabled="isLoading">
          <span class="icon">🔄</span>
          {{ isLoading ? '重新生成中...' : '重新生成' }}
        </button>
        <button @click="copyToClipboard()" class="action-btn copy-btn" :class="{ 'copy-success': showCopySuccess }">
          <span class="icon">{{ showCopySuccess ? '✅' : '📋' }}</span>
          {{ showCopySuccess ? '已复制！' : '复制到剪贴板' }}
        </button>
      </div>
      
      <div v-if="showCopySuccess" class="copy-success-toast">
        <span class="icon">✅</span>
        已成功复制到剪贴板！
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}

.header {
  margin-bottom: 3rem;
  position: relative;
}

.header-decoration {
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  margin: 1rem auto;
  border-radius: 2px;
  animation: fadeIn 0.8s ease-out 0.5s both;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(120deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .header {
    margin-bottom: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}

.subtitle {
  color: var(--color-text-secondary, #888);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  padding: 0.8em 1.6em;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  min-width: 160px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .action-btn {
    width: 100%;
    max-width: 280px;
    padding: 1em 1.6em;
    font-size: 1.1rem;
  }
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.action-btn:active:not(:disabled) {
  transform: translateY(-1px);
  transition: all 0.1s ease;
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.insult-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5253);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.insult-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}

.confession-btn {
  background: linear-gradient(135deg, #26c6da, #00acc1);
  color: white;
  box-shadow: 0 4px 15px rgba(38, 198, 218, 0.4);
}

.confession-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(38, 198, 218, 0.6);
}

.copy-btn {
  background: linear-gradient(135deg, #43a047, #2e7d32);
  color: white;
  box-shadow: 0 4px 15px rgba(67, 160, 71, 0.4);
}

.copy-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(67, 160, 71, 0.6);
}

.copy-success {
  background: linear-gradient(135deg, #4caf50, #2e7d32) !important;
  animation: pulse 0.6s ease;
}

.copy-success-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  z-index: 1000;
  animation: slideInToast 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.regenerate-btn {
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  color: white;
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4);
}

.regenerate-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(156, 39, 176, 0.6);
}

.result-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .result-buttons {
    flex-direction: column;
    align-items: center;
  }
}

.result-container {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: var(--color-card-bg, rgba(255, 255, 255, 0.1));
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.6s ease-out;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.result-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.result-header h2 {
  margin: 0 0 0.5rem 0;
  color: var(--primary-text, #333);
}

.result-decoration {
  width: 40px;
  height: 3px;
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  margin: 0 auto;
  border-radius: 2px;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.text-content {
  white-space: pre-wrap;
  text-align: left;
  background: var(--color-content-bg, rgba(0, 0, 0, 0.1));
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  line-height: 1.8;
  font-size: 1.1rem;
  animation: fadeInText 0.8s ease-out 0.3s both;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #ff6b6b;
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
  animation: shake 0.5s ease;
  backdrop-filter: blur(5px);
}

.icon {
  font-size: 1.2em;
}

.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: loading 1.8s infinite;
}

@keyframes loading {
  to {
    transform: translateX(100%);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeInText {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes slideInToast {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (prefers-color-scheme: light) {
  :root {
    --color-text-secondary: #666;
    --color-card-bg: rgba(255, 255, 255, 0.95);
    --color-content-bg: rgba(0, 0, 0, 0.04);
  }

  .header h1 {
    background: linear-gradient(135deg, #8e2de2, #4a00e0);
    -webkit-background-clip: text;
    background-clip: text;
  }

  .result-container {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .text-content {
    background: rgba(248, 250, 252, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .action-btn {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text-secondary: #aaa;
    --color-card-bg: rgba(255, 255, 255, 0.08);
    --color-content-bg: rgba(255, 255, 255, 0.05);
  }

  .text-content {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .result-container {
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
