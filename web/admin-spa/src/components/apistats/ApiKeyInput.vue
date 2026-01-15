<template>
  <div class="api-input-wide-card mb-8 rounded-3xl p-6 shadow-xl">
    <!-- 标题区域 -->
    <div class="wide-card-title mb-6">
      <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-200">
        <i class="fas fa-chart-line mr-3" />
        使用统计查询
      </h2>
      <p class="text-base text-gray-600 dark:text-gray-400">查询您的 API Key 使用情况和统计数据</p>
    </div>

    <!-- 输入区域 -->
    <div class="mx-auto max-w-4xl">
      <!-- 控制栏 -->
      <div class="control-bar mb-4 flex flex-wrap items-center justify-between gap-3">
        <!-- API Key 标签 -->
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          <i class="fas fa-key mr-2" />
          {{ multiKeyMode ? '输入您的 API Keys（每行一个或用逗号分隔）' : '输入您的 API Key' }}
        </label>

        <!-- 模式切换和查询按钮组 -->
        <div class="button-group flex items-center gap-2">
          <!-- 模式切换 -->
          <div
            class="mode-switch-group flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
          >
            <button
              class="mode-switch-btn"
              :class="{ active: !multiKeyMode }"
              title="单一模式"
              @click="multiKeyMode = false"
            >
              <i class="fas fa-key" />
              <span class="ml-2 hidden sm:inline">单一</span>
            </button>
            <button
              class="mode-switch-btn"
              :class="{ active: multiKeyMode }"
              title="聚合模式"
              @click="multiKeyMode = true"
            >
              <i class="fas fa-layer-group" />
              <span class="ml-2 hidden sm:inline">聚合</span>
              <span
                v-if="multiKeyMode && parsedApiKeys.length > 0"
                class="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-semibold"
              >
                {{ parsedApiKeys.length }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="api-input-grid grid grid-cols-1 gap-4 lg:grid-cols-4">
        <!-- API Key 输入 -->
        <div class="lg:col-span-3">
          <!-- 单 Key 模式输入框 -->
          <input
            v-if="!multiKeyMode"
            v-model="apiKey"
            class="wide-card-input w-full"
            :disabled="loading"
            placeholder="请输入您的 API Key (cr_...)"
            type="password"
            @keyup.enter="queryStats"
          />

          <!-- 多 Key 模式输入框 -->
          <div v-else class="relative">
            <textarea
              v-model="apiKey"
              class="wide-card-input w-full resize-y"
              :disabled="loading"
              placeholder="请输入您的 API Keys，支持以下格式：&#10;cr_xxx&#10;cr_yyy&#10;或&#10;cr_xxx, cr_yyy"
              rows="4"
              @keyup.ctrl.enter="queryStats"
            />
            <button
              v-if="apiKey && !loading"
              class="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              title="清空输入"
              @click="clearInput"
            >
              <i class="fas fa-times-circle" />
            </button>
          </div>
        </div>

        <!-- 查询按钮 -->
        <div class="lg:col-span-1">
          <button
            class="btn btn-primary btn-query flex h-full w-full items-center justify-center gap-2"
            :disabled="loading || !hasValidInput"
            @click="queryStats"
          >
            <i v-if="loading" class="fas fa-spinner loading-spinner" />
            <i v-else class="fas fa-search" />
            {{ loading ? '查询中...' : '查询统计' }}
          </button>
        </div>
      </div>

      <!-- 安全提示 -->
      <div class="security-notice mt-4">
        <i class="fas fa-shield-alt mr-2" />
        {{
          multiKeyMode
            ? '您的 API Keys 仅用于查询统计数据，不会被存储。聚合模式下部分个体化信息将不显示。'
            : '您的 API Key 仅用于查询自己的统计数据，不会被存储或用于其他用途'
        }}
      </div>

      <!-- 多 Key 模式额外提示 -->
      <div
        v-if="multiKeyMode"
        class="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      >
        <i class="fas fa-lightbulb mr-2" />
        <span>提示：最多支持同时查询 30 个 API Keys。使用 Ctrl+Enter 快速查询。</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useApiStatsStore } from '@/stores/apistats'

const apiStatsStore = useApiStatsStore()
const { apiKey, loading, multiKeyMode } = storeToRefs(apiStatsStore)
const { queryStats, clearInput } = apiStatsStore

// 解析输入的 API Keys
const parsedApiKeys = computed(() => {
  if (!multiKeyMode.value || !apiKey.value) return []

  // 支持逗号和换行符分隔
  const keys = apiKey.value
    .split(/[,\n]+/)
    .map((key) => key.trim())
    .filter((key) => key.length > 0)

  // 去重并限制最多30个
  const uniqueKeys = [...new Set(keys)]
  return uniqueKeys.slice(0, 30)
})

// 判断是否有有效输入
const hasValidInput = computed(() => {
  if (multiKeyMode.value) {
    return parsedApiKeys.value.length > 0
  }
  return apiKey.value && apiKey.value.trim().length > 0
})
</script>

<style scoped>
/* Linear-style 卡片 */
.api-input-wide-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  transition: all 0.15s ease;
}

/* 标题样式 */
.wide-card-title h2 {
  font-weight: 600;
  color: var(--text-primary);
}

.wide-card-title p {
  color: var(--text-secondary);
}

.wide-card-title .fas.fa-chart-line {
  color: var(--accent-primary);
}

/* 网格布局 */
.api-input-grid {
  align-items: end;
  gap: 1rem;
}

/* Linear-style 输入框 */
.wide-card-input {
  background: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.15s ease;
}

.wide-card-input::placeholder {
  color: var(--text-tertiary);
}

.wide-card-input:hover {
  border-color: var(--border-strong);
}

.wide-card-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Linear-style 按钮 */
.btn {
  font-weight: 500;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-query {
  padding: 12px 20px;
  font-size: 14px;
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-primary-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 安全提示 - Linear style */
.security-notice {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.security-notice .fas.fa-shield-alt {
  color: var(--success);
}

/* 控制栏 */
.control-bar {
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-default);
}

/* 按钮组 */
.button-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 模式切换组 - Linear style */
.mode-switch-group {
  display: inline-flex;
  padding: 3px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
}

/* 模式切换按钮 */
.mode-switch-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: calc(var(--radius-md) - 2px);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.mode-switch-btn:hover:not(.active) {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.mode-switch-btn.active {
  color: white;
  background: var(--accent-primary);
}

.mode-switch-btn i {
  font-size: 0.8rem;
}

/* 加载动画 */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .control-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .button-group {
    justify-content: center;
  }

  .api-input-wide-card {
    padding: 1.25rem;
  }

  .wide-card-title h2 {
    font-size: 1.25rem;
  }

  .wide-card-title p {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .api-input-wide-card {
    padding: 1rem;
  }

  .wide-card-title h2 {
    font-size: 1.1rem;
  }

  .wide-card-input {
    padding: 10px 12px;
    font-size: 13px;
  }

  .btn-query {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>
