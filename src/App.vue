<script setup lang="ts">
import { ref } from 'vue';
import InstallPWA from './components/InstallPWA.vue';

const generatedText = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const activeButton = ref<'insult' | 'confession' | null>(null);

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
        model: 'gemini',
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
      alert('已复制到剪贴板！');
    })
    .catch(err => {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制。');
    });
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>✨ 台词罐头</h1>
      <p class="subtitle">AI 生成的专属话术，让表达更有趣</p>
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
      <h2>✨ 生成结果</h2>
      <div class="text-content">
        <p>{{ generatedText }}</p>
      </div>
      <div class="result-buttons">
        <button @click="generateText(activeButton as 'insult' | 'confession', true)" class="action-btn regenerate-btn" :disabled="isLoading">
          <span class="icon">🔄</span>
          {{ isLoading ? '重新生成中...' : '重新生成' }}
        </button>
        <button @click="copyToClipboard()" class="action-btn copy-btn">
          <span class="icon">📋</span>
          复制到剪贴板
        </button>
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

.header {
  margin-bottom: 3rem;
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
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.insult-btn {
  background: linear-gradient(120deg, #ff6b6b, #ee5253);
  color: white;
}

.confession-btn {
  background: linear-gradient(120deg, #26c6da, #00acc1);
  color: white;
}

.copy-btn {
  background: linear-gradient(120deg, #43a047, #2e7d32);
  color: white;
}

.regenerate-btn {
  background: linear-gradient(120deg, #9c27b0, #673ab7);
  color: white;
}

.result-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.result-container {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: var(--color-card-bg, rgba(255, 255, 255, 0.1));
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease;
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
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #ff6b6b;
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(255, 107, 107, 0.1);
  animation: shake 0.5s ease;
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
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: loading 1.5s infinite;
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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (prefers-color-scheme: light) {
  :root {
    --color-text-secondary: #666;
    --color-card-bg: rgba(255, 255, 255, 0.9);
    --color-content-bg: rgba(0, 0, 0, 0.03);
  }

  .header h1 {
    background: linear-gradient(120deg, #8e2de2, #4a00e0);
    -webkit-background-clip: text;
    background-clip: text;
  }

  .result-container {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  }
}
</style>
