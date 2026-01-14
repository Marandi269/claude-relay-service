<template>
  <!-- 顶部导航 - Linear style -->
  <header class="header-container">
    <div class="header-content">
      <!-- Logo and Title -->
      <div class="header-left">
        <LogoTitle
          :loading="oemLoading"
          :logo-src="oemSettings.siteIconData || oemSettings.siteIcon"
          subtitle="管理后台"
          :title="oemSettings.siteName"
          title-class="header-title"
        >
          <template #after-title>
            <!-- 版本信息 -->
            <div class="version-info">
              <span class="version-number">v{{ versionInfo.current || '...' }}</span>
              <!-- 更新提示 -->
              <a
                v-if="versionInfo.hasUpdate"
                class="update-badge"
                :href="versionInfo.releaseInfo?.htmlUrl || '#'"
                target="_blank"
                title="有新版本可用"
              >
                <i class="fas fa-arrow-up" />
                <span>新版本</span>
              </a>
            </div>
          </template>
        </LogoTitle>
      </div>

      <!-- Right side: Theme toggle and User menu -->
      <div class="header-right">
        <!-- 主题切换按钮 -->
        <ThemeToggle mode="dropdown" />

        <!-- 分隔线 -->
        <div class="header-divider" />

        <!-- 用户菜单 -->
        <div class="user-menu-container">
          <button class="user-menu-trigger" @click="userMenuOpen = !userMenuOpen">
            <div class="user-avatar">
              <i class="fas fa-user" />
            </div>
            <span class="user-name">{{ currentUser.username || 'Admin' }}</span>
            <i
              class="fas fa-chevron-down chevron-icon"
              :class="{ 'chevron-rotate': userMenuOpen }"
            />
          </button>

          <!-- 悬浮菜单 -->
          <Transition name="dropdown">
            <div v-if="userMenuOpen" class="user-dropdown" @click.stop>
              <!-- 版本信息 -->
              <div class="dropdown-section">
                <div class="version-row">
                  <span class="version-label">当前版本</span>
                  <span class="version-value">v{{ versionInfo.current || '...' }}</span>
                </div>
                <div v-if="versionInfo.hasUpdate" class="update-section">
                  <div class="update-row">
                    <span class="update-label"> <i class="fas fa-arrow-up" />有新版本 </span>
                    <span class="update-value">v{{ versionInfo.latest }}</span>
                  </div>
                  <a
                    class="update-link"
                    :href="versionInfo.releaseInfo?.htmlUrl || '#'"
                    target="_blank"
                  >
                    <i class="fas fa-external-link-alt" />查看更新
                  </a>
                </div>
                <div v-else-if="versionInfo.checkingUpdate" class="checking-update">
                  <i class="fas fa-spinner fa-spin" />检查更新中...
                </div>
                <div v-else class="check-update-section">
                  <Transition mode="out-in" name="fade">
                    <div v-if="versionInfo.noUpdateMessage" key="message" class="no-update-badge">
                      <i class="fas fa-check-circle" />当前已是最新版本
                    </div>
                    <button v-else key="button" class="check-update-btn" @click="checkForUpdates()">
                      <i class="fas fa-sync-alt" />检查更新
                    </button>
                  </Transition>
                </div>
              </div>

              <div class="dropdown-divider" />

              <button class="dropdown-item" @click="openChangePasswordModal">
                <i class="fas fa-key item-icon" />
                <span>修改账户信息</span>
              </button>

              <div class="dropdown-divider" />

              <button class="dropdown-item dropdown-item-danger" @click="logout">
                <i class="fas fa-sign-out-alt item-icon" />
                <span>退出登录</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>

  <!-- 修改账户信息模态框 -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showChangePasswordModal" class="modal-overlay" @click="closeChangePasswordModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="modal-title-group">
              <div class="modal-icon">
                <i class="fas fa-key" />
              </div>
              <h3 class="modal-title">修改账户信息</h3>
            </div>
            <button class="modal-close" @click="closeChangePasswordModal">
              <i class="fas fa-times" />
            </button>
          </div>

          <form class="modal-body" @submit.prevent="changePassword">
            <div class="form-group">
              <label class="form-label">当前用户名</label>
              <input
                class="form-input disabled"
                disabled
                type="text"
                :value="currentUser.username || 'Admin'"
              />
              <p class="form-hint">当前用户名，输入新用户名以修改</p>
            </div>

            <div class="form-group">
              <label class="form-label">新用户名</label>
              <input
                v-model="changePasswordForm.newUsername"
                class="form-input"
                placeholder="输入新用户名（留空保持不变）"
                type="text"
              />
              <p class="form-hint">留空表示不修改用户名</p>
            </div>

            <div class="form-group">
              <label class="form-label">当前密码</label>
              <input
                v-model="changePasswordForm.currentPassword"
                class="form-input"
                placeholder="请输入当前密码"
                required
                type="password"
              />
            </div>

            <div class="form-group">
              <label class="form-label">新密码</label>
              <input
                v-model="changePasswordForm.newPassword"
                class="form-input"
                placeholder="请输入新密码"
                required
                type="password"
              />
              <p class="form-hint">密码长度至少8位</p>
            </div>

            <div class="form-group">
              <label class="form-label">确认新密码</label>
              <input
                v-model="changePasswordForm.confirmPassword"
                class="form-input"
                placeholder="请再次输入新密码"
                required
                type="password"
              />
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" @click="closeChangePasswordModal">
                取消
              </button>
              <button class="btn btn-primary" :disabled="changePasswordLoading" type="submit">
                <span v-if="changePasswordLoading" class="loading-spinner" />
                <i v-else class="fas fa-save" />
                {{ changePasswordLoading ? '保存中...' : '保存修改' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'
import { apiClient } from '@/config/api'
import LogoTitle from '@/components/common/LogoTitle.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const router = useRouter()
const authStore = useAuthStore()

// 当前用户信息
const currentUser = computed(() => authStore.user || { username: 'Admin' })

// OEM设置
const oemSettings = computed(() => authStore.oemSettings || {})
const oemLoading = computed(() => authStore.oemLoading)

// 版本信息
const versionInfo = ref({
  current: '...',
  latest: '',
  hasUpdate: false,
  checkingUpdate: false,
  lastChecked: null,
  releaseInfo: null,
  noUpdateMessage: false
})

// 用户菜单状态
const userMenuOpen = ref(false)

// 修改密码模态框
const showChangePasswordModal = ref(false)
const changePasswordLoading = ref(false)
const changePasswordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  newUsername: ''
})

// 检查更新（同时获取版本信息）
const checkForUpdates = async () => {
  if (versionInfo.value.checkingUpdate) {
    return
  }

  versionInfo.value.checkingUpdate = true

  try {
    const result = await apiClient.get('/admin/check-updates')

    if (result.success) {
      const data = result.data

      versionInfo.value.current = data.current
      versionInfo.value.latest = data.latest
      versionInfo.value.hasUpdate = data.hasUpdate
      versionInfo.value.releaseInfo = data.releaseInfo
      versionInfo.value.lastChecked = new Date()

      // 保存到localStorage
      localStorage.setItem(
        'versionInfo',
        JSON.stringify({
          current: data.current,
          latest: data.latest,
          lastChecked: versionInfo.value.lastChecked,
          hasUpdate: data.hasUpdate,
          releaseInfo: data.releaseInfo
        })
      )

      // 如果没有更新，显示提醒
      if (!data.hasUpdate) {
        versionInfo.value.noUpdateMessage = true
        // 3秒后自动隐藏提醒
        setTimeout(() => {
          versionInfo.value.noUpdateMessage = false
        }, 3000)
      }
    }
  } catch (error) {
    console.error('Error checking for updates:', error)

    // 尝试从localStorage读取缓存的版本信息
    const cached = localStorage.getItem('versionInfo')
    if (cached) {
      const cachedInfo = JSON.parse(cached)
      versionInfo.value.current = cachedInfo.current || versionInfo.value.current
      versionInfo.value.latest = cachedInfo.latest
      versionInfo.value.hasUpdate = cachedInfo.hasUpdate
      versionInfo.value.releaseInfo = cachedInfo.releaseInfo
      versionInfo.value.lastChecked = new Date(cachedInfo.lastChecked)
    }
  } finally {
    versionInfo.value.checkingUpdate = false
  }
}

// 打开修改密码弹窗
const openChangePasswordModal = () => {
  changePasswordForm.currentPassword = ''
  changePasswordForm.newPassword = ''
  changePasswordForm.confirmPassword = ''
  changePasswordForm.newUsername = ''
  showChangePasswordModal.value = true
  userMenuOpen.value = false
}

// 关闭修改密码弹窗
const closeChangePasswordModal = () => {
  showChangePasswordModal.value = false
}

// 修改密码
const changePassword = async () => {
  if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
    showToast('两次输入的密码不一致', 'error')
    return
  }

  if (changePasswordForm.newPassword.length < 8) {
    showToast('新密码长度至少8位', 'error')
    return
  }

  changePasswordLoading.value = true

  try {
    const data = await apiClient.post('/web/auth/change-password', {
      currentPassword: changePasswordForm.currentPassword,
      newPassword: changePasswordForm.newPassword,
      newUsername: changePasswordForm.newUsername || undefined
    })

    if (data.success) {
      const message = changePasswordForm.newUsername
        ? '账户信息修改成功，请重新登录'
        : '密码修改成功，请重新登录'
      showToast(message, 'success')
      closeChangePasswordModal()

      // 延迟后退出登录
      setTimeout(() => {
        authStore.logout()
        router.push('/login')
      }, 1500)
    } else {
      showToast(data.message || '修改失败', 'error')
    }
  } catch (error) {
    showToast('修改密码失败', 'error')
  } finally {
    changePasswordLoading.value = false
  }
}

// 退出登录
const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout()
    router.push('/login')
    showToast('已安全退出', 'success')
  }
  userMenuOpen.value = false
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  const userMenuContainer = event.target.closest('.user-menu-container')
  if (!userMenuContainer && userMenuOpen.value) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  checkForUpdates()

  // 设置自动检查更新（每小时检查一次）
  setInterval(() => {
    checkForUpdates()
  }, 3600000) // 1小时

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Header Container - Linear style */
.header-container {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-default);
  padding: 12px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 15px;
}

/* Version Info */
.version-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.version-number {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 12px;
  color: var(--text-tertiary);
}

.update-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--success);
  background: var(--success-bg);
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.1s ease;
}

.update-badge:hover {
  filter: brightness(1.1);
}

.update-badge i {
  font-size: 9px;
}

/* Header Divider */
.header-divider {
  width: 1px;
  height: 24px;
  background: var(--border-default);
}

/* User Menu */
.user-menu-container {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s ease;
}

.user-menu-trigger:hover {
  background: var(--bg-hover);
  border-color: var(--border-strong);
}

.user-avatar {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-primary);
  border-radius: 50%;
  color: white;
  font-size: 11px;
}

.user-name {
  display: none;
}

@media (min-width: 640px) {
  .user-name {
    display: inline;
  }
}

.chevron-icon {
  font-size: 10px;
  color: var(--text-tertiary);
  transition: transform 0.15s ease;
}

.chevron-rotate {
  transform: rotate(180deg);
}

/* User Dropdown */
.user-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 220px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-section {
  padding: 12px 16px;
}

.version-row,
.update-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.version-label {
  color: var(--text-secondary);
}

.version-value {
  font-family: 'SF Mono', Monaco, monospace;
  color: var(--text-primary);
}

.update-section {
  margin-top: 12px;
}

.update-label {
  color: var(--success);
  font-weight: 500;
}

.update-label i {
  margin-right: 4px;
}

.update-value {
  font-family: 'SF Mono', Monaco, monospace;
  color: var(--success);
}

.update-link {
  display: block;
  margin-top: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background: var(--success);
  border-radius: var(--radius-md);
  text-align: center;
  text-decoration: none;
  transition: all 0.1s ease;
}

.update-link:hover {
  filter: brightness(1.1);
}

.update-link i {
  margin-right: 4px;
}

.checking-update {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-tertiary);
  text-align: center;
}

.checking-update i {
  margin-right: 4px;
}

.check-update-section {
  margin-top: 8px;
  text-align: center;
}

.check-update-btn {
  font-size: 12px;
  color: var(--accent-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.1s ease;
}

.check-update-btn:hover {
  color: var(--accent-primary-hover);
}

.check-update-btn i {
  margin-right: 4px;
}

.no-update-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  color: var(--success);
  background: var(--success-bg);
  border-radius: var(--radius-md);
}

.dropdown-divider {
  height: 1px;
  background: var(--border-default);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  font-size: 13px;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.1s ease;
}

.dropdown-item:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.dropdown-item-danger {
  color: var(--error);
}

.dropdown-item-danger:hover {
  background: var(--error-bg);
}

.item-icon {
  width: 14px;
  text-align: center;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--modal-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-container {
  width: 100%;
  max-width: 420px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-default);
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-primary);
  border-radius: var(--radius-md);
  color: white;
  font-size: 14px;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.1s ease;
}

.modal-close:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.modal-body {
  padding: 24px;
  max-height: calc(90vh - 180px);
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  gap: 8px;
  padding-top: 20px;
  margin-top: 8px;
  border-top: 1px solid var(--border-default);
}

.modal-footer .btn {
  flex: 1;
  justify-content: center;
}

/* Form elements */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--text-primary);
  background: var(--input-bg);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition: all 0.1s ease;
}

.form-input:hover {
  border-color: var(--border-strong);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(94, 106, 210, 0.15);
}

.form-input.disabled {
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  cursor: not-allowed;
}

.form-hint {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 4px;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .header-container {
    padding: 10px 12px;
  }

  .user-dropdown {
    min-width: 200px;
  }
}
</style>
