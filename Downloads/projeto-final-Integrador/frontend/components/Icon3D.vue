<template>
  <div class="icon-3d" :class="[`icon-${name}`, size, variant]">
    <div class="icon-inner">
      <!-- Dashboard Icon -->
      <svg v-if="name === 'dashboard'" viewBox="0 0 24 24" class="icon-svg">
        <defs>
          <linearGradient id="dashboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea"/>
            <stop offset="100%" style="stop-color:#764ba2"/>
          </linearGradient>
          <filter id="shadow3d">
            <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>
        <rect x="3" y="3" width="7" height="7" rx="1" fill="url(#dashboardGrad)" filter="url(#shadow3d)"/>
        <rect x="14" y="3" width="7" height="7" rx="1" fill="url(#dashboardGrad)" filter="url(#shadow3d)"/>
        <rect x="3" y="14" width="7" height="7" rx="1" fill="url(#dashboardGrad)" filter="url(#shadow3d)"/>
        <rect x="14" y="14" width="7" height="7" rx="1" fill="url(#dashboardGrad)" filter="url(#shadow3d)"/>
      </svg>

      <!-- Orders Icon -->
      <svg v-else-if="name === 'orders'" viewBox="0 0 24 24" class="icon-svg">
        <defs>
          <linearGradient id="ordersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f093fb"/>
            <stop offset="100%" style="stop-color:#f5576c"/>
          </linearGradient>
        </defs>
        <path d="M9 11H7l3-3 3 3h-2v8h-2v-8z" fill="url(#ordersGrad)" filter="url(#shadow3d)"/>
        <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="none" stroke="url(#ordersGrad)" stroke-width="2" filter="url(#shadow3d)"/>
      </svg>

      <!-- Chat Icon -->
      <svg v-else-if="name === 'chat'" viewBox="0 0 24 24" class="icon-svg">
        <defs>
          <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4facfe"/>
            <stop offset="100%" style="stop-color:#00f2fe"/>
          </linearGradient>
        </defs>
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="url(#chatGrad)" filter="url(#shadow3d)"/>
        <circle cx="8" cy="10" r="1.5" fill="white"/>
        <circle cx="12" cy="10" r="1.5" fill="white"/>
        <circle cx="16" cy="10" r="1.5" fill="white"/>
      </svg>

      <!-- Profile Icon -->
      <svg v-else-if="name === 'profile'" viewBox="0 0 24 24" class="icon-svg">
        <defs>
          <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#a8edea"/>
            <stop offset="100%" style="stop-color:#fed6e3"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="8" r="4" fill="url(#profileGrad)" filter="url(#shadow3d)"/>
        <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" fill="url(#profileGrad)" filter="url(#shadow3d)"/>
      </svg>

      <!-- Settings Icon -->
      <svg v-else-if="name === 'settings'" viewBox="0 0 24 24" class="icon-svg">
        <defs>
          <linearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffecd2"/>
            <stop offset="100%" style="stop-color:#fcb69f"/>
          </linearGradient>
        </defs>
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm7.5 1.5l-1.09-1.09c.08-.34.14-.69.14-1.05s-.06-.71-.14-1.05L19.5 5.22c.27-.27.27-.71 0-.98l-1.41-1.41c-.27-.27-.71-.27-.98 0l-1.09 1.09c-.34-.08-.69-.14-1.05-.14s-.71.06-1.05.14L12.83 2.83c-.27-.27-.71-.27-.98 0L10.44 4.24c-.27.27-.27.71 0 .98l1.09 1.09c-.08.34-.14.69-.14 1.05s.06.71.14 1.05L10.44 9.5c-.27.27-.27.71 0 .98l1.41 1.41c.27.27.71.27.98 0l1.09-1.09c.34.08.69.14 1.05.14s.71-.06 1.05-.14l1.09 1.09c.27.27.71.27.98 0l1.41-1.41c.27-.27.27-.71 0-.98z" fill="url(#settingsGrad)" filter="url(#shadow3d)"/>
      </svg>

      <!-- Notifications Icon -->
      <svg v-else-if="name === 'notifications'" viewBox="0 0 24 24" class="icon-svg">
        <defs>
          <linearGradient id="notifGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff9a9e"/>
            <stop offset="100%" style="stop-color:#fecfef"/>
          </linearGradient>
        </defs>
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="url(#notifGrad)" filter="url(#shadow3d)"/>
      </svg>

      <!-- Wallet Icon -->
      <svg v-else-if="name === 'wallet'" viewBox="0 0 24 24" class="icon-svg">
        <defs>
          <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#a8e6cf"/>
            <stop offset="100%" style="stop-color:#88d8a3"/>
          </linearGradient>
        </defs>
        <path d="M21 7.28V5c0-1.1-.9-2-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-2.28A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6v2H5z" fill="url(#walletGrad)" filter="url(#shadow3d)"/>
        <circle cx="16" cy="12" r="1.5" fill="white"/>
      </svg>

      <!-- Help Icon -->
      <svg v-else-if="name === 'help'" viewBox="0 0 24 24" class="icon-svg">
        <defs>
          <linearGradient id="helpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffeaa7"/>
            <stop offset="100%" style="stop-color:#fab1a0"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#helpGrad)" filter="url(#shadow3d)"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="17" r="1" fill="white"/>
      </svg>

      <!-- Logout Icon -->
      <svg v-else-if="name === 'logout'" viewBox="0 0 24 24" class="icon-svg">
        <defs>
          <linearGradient id="logoutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fd79a8"/>
            <stop offset="100%" style="stop-color:#fdcb6e"/>
          </linearGradient>
        </defs>
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="url(#logoutGrad)" filter="url(#shadow3d)"/>
      </svg>

      <!-- Search Icon -->
      <svg v-else-if="name === 'search'" viewBox="0 0 24 24" class="icon-svg">
        <defs>
          <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#74b9ff"/>
            <stop offset="100%" style="stop-color:#0984e3"/>
          </linearGradient>
        </defs>
        <circle cx="11" cy="11" r="8" fill="none" stroke="url(#searchGrad)" stroke-width="2" filter="url(#shadow3d)"/>
        <path d="m21 21-4.35-4.35" stroke="url(#searchGrad)" stroke-width="2" stroke-linecap="round" filter="url(#shadow3d)"/>
      </svg>

      <!-- Default Icon -->
      <svg v-else viewBox="0 0 24 24" class="icon-svg">
        <circle cx="12" cy="12" r="10" fill="#8b5cf6"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'hover', 'active'].includes(value)
  }
})
</script>

<style scoped>
.icon-3d {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.icon-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8),
    inset 2px 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.icon-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  border-radius: inherit;
  pointer-events: none;
}

.icon-svg {
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Sizes */
.icon-3d.sm {
  width: 32px;
  height: 32px;
}

.icon-3d.sm .icon-inner {
  width: 28px;
  height: 28px;
  padding: 6px;
}

.icon-3d.md {
  width: 40px;
  height: 40px;
}

.icon-3d.md .icon-inner {
  width: 36px;
  height: 36px;
  padding: 8px;
}

.icon-3d.lg {
  width: 48px;
  height: 48px;
}

.icon-3d.lg .icon-inner {
  width: 44px;
  height: 44px;
  padding: 10px;
}

.icon-3d.xl {
  width: 64px;
  height: 64px;
}

.icon-3d.xl .icon-inner {
  width: 60px;
  height: 60px;
  padding: 12px;
}

/* Hover Effects */
.icon-3d:hover .icon-inner {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    12px 12px 24px rgba(0, 0, 0, 0.15),
    -12px -12px 24px rgba(255, 255, 255, 0.9),
    inset 2px 2px 6px rgba(0, 0, 0, 0.08);
}

.icon-3d:hover .icon-svg {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

/* Active State */
.icon-3d:active .icon-inner,
.icon-3d.active .icon-inner {
  transform: translateY(1px) scale(0.98);
  box-shadow: 
    4px 4px 8px rgba(0, 0, 0, 0.15),
    -4px -4px 8px rgba(255, 255, 255, 0.7),
    inset 4px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Specific Icon Animations */
.icon-3d:hover.icon-dashboard .icon-svg {
  animation: dashboardPulse 2s infinite;
}

.icon-3d:hover.icon-chat .icon-svg {
  animation: chatBounce 1s infinite;
}

.icon-3d:hover.icon-notifications .icon-svg {
  animation: notificationShake 0.5s infinite;
}

@keyframes dashboardPulse {
  0%, 100% { transform: scale(1.1); }
  50% { transform: scale(1.15); }
}

@keyframes chatBounce {
  0%, 100% { transform: scale(1.1) translateY(0); }
  50% { transform: scale(1.1) translateY(-2px); }
}

@keyframes notificationShake {
  0%, 100% { transform: scale(1.1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-2deg); }
  75% { transform: scale(1.1) rotate(2deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .icon-3d.lg {
    width: 40px;
    height: 40px;
  }
  
  .icon-3d.lg .icon-inner {
    width: 36px;
    height: 36px;
    padding: 8px;
  }
  
  .icon-3d.xl {
    width: 48px;
    height: 48px;
  }
  
  .icon-3d.xl .icon-inner {
    width: 44px;
    height: 44px;
    padding: 10px;
  }
}
</style>