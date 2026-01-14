<template>
  <div class="theme-toggle-container">
    <!-- 紧凑模式：仅显示图标按钮 -->
    <button
      v-if="mode === 'compact'"
      class="theme-btn"
      :title="themeTooltip"
      @click="handleCycleTheme"
    >
      <i v-if="themeStore.themeMode === 'light'" class="fas fa-sun" />
      <i v-else-if="themeStore.themeMode === 'dark'" class="fas fa-moon" />
      <i v-else class="fas fa-circle-half-stroke" />
    </button>

    <!-- 下拉菜单模式 - Linear style -->
    <div v-else-if="mode === 'dropdown'" class="theme-dropdown-wrapper">
      <button class="theme-btn" :title="themeTooltip" @click="handleCycleTheme">
        <i v-if="themeStore.themeMode === 'light'" class="fas fa-sun icon-sun" />
        <i v-else-if="themeStore.themeMode === 'dark'" class="fas fa-moon icon-moon" />
        <i v-else class="fas fa-circle-half-stroke icon-auto" />
      </button>
    </div>

    <!-- 分段按钮模式 -->
    <div v-else-if="mode === 'segmented'" class="theme-segmented">
      <button
        v-for="option in themeOptions"
        :key="option.value"
        class="theme-segment"
        :class="{ active: themeStore.themeMode === option.value }"
        :title="option.label"
        @click="selectTheme(option.value)"
      >
        <i :class="option.icon" />
        <span v-if="showLabel" class="segment-label">{{ option.shortLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

// Props
defineProps({
  // 显示模式：compact（紧凑）、dropdown（下拉）、segmented（分段）
  mode: {
    type: String,
    default: 'compact',
    validator: (value) => ['compact', 'dropdown', 'segmented'].includes(value)
  },
  // 是否显示文字标签
  showLabel: {
    type: Boolean,
    default: false
  }
})

// Store
const themeStore = useThemeStore()

// 主题选项配置
const themeOptions = [
  {
    value: 'light',
    label: '浅色模式',
    shortLabel: '浅色',
    icon: 'fas fa-sun'
  },
  {
    value: 'dark',
    label: '深色模式',
    shortLabel: '深色',
    icon: 'fas fa-moon'
  },
  {
    value: 'auto',
    label: '跟随系统',
    shortLabel: '自动',
    icon: 'fas fa-circle-half-stroke'
  }
]

// 计算属性
const themeTooltip = computed(() => {
  const current = themeOptions.find((opt) => opt.value === themeStore.themeMode)
  return current ? `点击切换主题 - ${current.label}` : '切换主题'
})

// 方法
const handleCycleTheme = () => {
  themeStore.cycleThemeMode()
}

const selectTheme = (mode) => {
  themeStore.setThemeMode(mode)
}
</script>

<style scoped>
/* Theme Toggle - Linear style */
.theme-toggle-container {
  display: inline-flex;
  align-items: center;
}

/* Theme Button - Linear style */
.theme-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.1s ease;
}

.theme-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.theme-btn i {
  font-size: 13px;
}

.icon-sun {
  color: #facc15;
}

.icon-moon {
  color: var(--accent-primary);
}

.icon-auto {
  color: var(--text-secondary);
}

/* Segmented buttons - Linear style */
.theme-segmented {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}

.theme-segment {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.1s ease;
}

.theme-segment:hover {
  color: var(--text-secondary);
}

.theme-segment.active {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.theme-segment i {
  font-size: 11px;
}

.segment-label {
  display: none;
}

@media (min-width: 640px) {
  .segment-label {
    display: inline;
  }
}
</style>
