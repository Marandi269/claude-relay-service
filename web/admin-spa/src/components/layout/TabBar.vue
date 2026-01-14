<template>
  <nav class="tab-nav">
    <!-- 移动端下拉选择器 -->
    <div class="mobile-select sm:hidden">
      <select
        class="mobile-dropdown"
        :value="activeTab"
        @change="$emit('tab-change', $event.target.value)"
      >
        <option v-for="tab in tabs" :key="tab.key" :value="tab.key">
          {{ tab.name }}
        </option>
      </select>
      <i class="fas fa-chevron-down select-icon" />
    </div>

    <!-- 桌面端标签栏 -->
    <div class="desktop-tabs hidden sm:flex">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="$emit('tab-change', tab.key)"
      >
        <i :class="[tab.icon, 'tab-icon']" />
        <span class="tab-text hidden md:inline">{{ tab.name }}</span>
        <span class="tab-text md:hidden">{{ tab.shortName || tab.name }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

defineEmits(['tab-change'])

const authStore = useAuthStore()

// 根据 LDAP 配置动态生成 tabs
const tabs = computed(() => {
  const baseTabs = [
    { key: 'dashboard', name: '仪表板', shortName: '仪表板', icon: 'fas fa-chart-line' },
    { key: 'apiKeys', name: 'API Keys', shortName: 'API', icon: 'fas fa-key' },
    { key: 'accounts', name: '账户管理', shortName: '账户', icon: 'fas fa-user-circle' }
  ]

  // 只有在 LDAP 启用时才显示用户管理
  if (authStore.oemSettings?.ldapEnabled) {
    baseTabs.push({
      key: 'userManagement',
      name: '用户管理',
      shortName: '用户',
      icon: 'fas fa-users'
    })
  }

  baseTabs.push(
    { key: 'tutorial', name: '使用教程', shortName: '教程', icon: 'fas fa-book' },
    { key: 'settings', name: '系统设置', shortName: '设置', icon: 'fas fa-cog' }
  )

  return baseTabs
})
</script>

<style scoped>
/* Tab Navigation - Linear style */
.tab-nav {
  margin-bottom: 20px;
}

/* Mobile Select */
.mobile-select {
  position: relative;
}

.mobile-dropdown {
  width: 100%;
  padding: 10px 36px 10px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  appearance: none;
  cursor: pointer;
  transition: all 0.1s ease;
}

.mobile-dropdown:hover {
  border-color: var(--border-strong);
}

.mobile-dropdown:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(94, 106, 210, 0.15);
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: var(--text-tertiary);
  pointer-events: none;
}

/* Desktop Tabs */
.desktop-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.1s ease;
  white-space: nowrap;
}

.tab-item:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.tab-item.active {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.tab-icon {
  font-size: 12px;
  opacity: 0.8;
}

.tab-item.active .tab-icon {
  opacity: 1;
  color: var(--accent-primary);
}

.tab-text {
  font-size: 13px;
}

/* Responsive */
@media (max-width: 1024px) {
  .tab-item {
    padding: 8px 8px;
  }

  .tab-text {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .tab-nav {
    margin-bottom: 16px;
  }
}
</style>
