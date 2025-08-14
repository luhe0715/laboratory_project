<template>
  <div class="websocket-test">
    <div class="header">
      <h2>WebSocket 实时数据测试</h2>
      <div class="connection-status">
        <span :class="['status-indicator', connectionStatus]">
          {{ connectionStatusText }}
        </span>
        <button @click="toggleConnection" :disabled="isConnecting">
          {{ isConnected ? '断开连接' : '连接WebSocket' }}
        </button>
      </div>
    </div>

    <div class="stats">
      <div class="stat-item">
        <span class="label">连接时长:</span>
        <span class="value">{{ connectionDuration }}</span>
      </div>
      <div class="stat-item">
        <span class="label">接收消息数:</span>
        <span class="value">{{ messageCount }}</span>
      </div>
      <div class="stat-item">
        <span class="label">最后更新:</span>
        <span class="value">{{ lastUpdateTime }}</span>
      </div>
    </div>

    <div class="equipment-grid">
      <div 
        v-for="equipment in equipmentData" 
        :key="equipment.id"
        class="equipment-card"
      >
        <div class="card-header">
          <h3>{{ equipment.name }}</h3>
          <span :class="['status-badge', equipment.status]">
            {{ equipment.statusText }}
          </span>
        </div>
        
        <div class="parameters">
          <div 
            v-for="param in equipment.parameters" 
            :key="param.key"
            class="parameter-item"
          >
            <span class="param-label">{{ param.label }}:</span>
            <span class="param-value">
              {{ param.value }} {{ param.unit }}
            </span>
          </div>
        </div>
        
        <div class="last-update">
          最后更新: {{ equipment.lastUpdate }}
        </div>
      </div>
    </div>

    <div class="message-log">
      <h3>消息日志</h3>
      <div class="log-container">
        <div 
          v-for="(message, index) in messageLog" 
          :key="index"
          :class="['log-item', message.type]"
        >
          <span class="timestamp">{{ message.timestamp }}</span>
          <span class="content">{{ message.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 响应式数据
const ws = ref(null)
const isConnected = ref(false)
const isConnecting = ref(false)
const equipmentData = ref([])
const messageCount = ref(0)
const connectionStartTime = ref(null)
const lastUpdateTime = ref('--')
const messageLog = ref([])

// WebSocket URL
const WS_URL = 'ws://localhost:8080'

// 计算属性
const connectionStatus = computed(() => {
  if (isConnecting.value) return 'connecting'
  return isConnected.value ? 'connected' : 'disconnected'
})

const connectionStatusText = computed(() => {
  if (isConnecting.value) return '连接中...'
  return isConnected.value ? '已连接' : '未连接'
})

const connectionDuration = computed(() => {
  if (!connectionStartTime.value || !isConnected.value) return '--'
  const duration = Math.floor((Date.now() - connectionStartTime.value) / 1000)
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// 添加日志消息
const addLogMessage = (type, content) => {
  const timestamp = new Date().toLocaleTimeString('zh-CN')
  messageLog.value.unshift({ type, content, timestamp })
  // 限制日志条数
  if (messageLog.value.length > 50) {
    messageLog.value = messageLog.value.slice(0, 50)
  }
}

// 连接WebSocket
const connectWebSocket = () => {
  if (isConnected.value || isConnecting.value) return
  
  isConnecting.value = true
  addLogMessage('info', '正在连接WebSocket服务器...')
  
  try {
    ws.value = new WebSocket(WS_URL)
    
    ws.value.onopen = () => {
      isConnected.value = true
      isConnecting.value = false
      connectionStartTime.value = Date.now()
      addLogMessage('success', 'WebSocket连接成功')
      
      // 发送ping消息测试
      sendMessage({ type: 'ping' })
    }
    
    ws.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        messageCount.value++
        lastUpdateTime.value = new Date().toLocaleTimeString('zh-CN')
        
        switch (data.type) {
          case 'initial':
            equipmentData.value = data.data
            addLogMessage('info', `接收到初始数据，${data.data.length}个设备`)
            break
          case 'update':
            equipmentData.value = data.data
            addLogMessage('data', `数据更新 - ${data.data.length}个设备`)
            break
          case 'pong':
            addLogMessage('info', 'Pong响应收到')
            break
          default:
            addLogMessage('info', `收到消息: ${data.type}`)
        }
      } catch (error) {
        addLogMessage('error', `解析消息失败: ${error.message}`)
      }
    }
    
    ws.value.onclose = (event) => {
      isConnected.value = false
      isConnecting.value = false
      connectionStartTime.value = null
      addLogMessage('warning', `WebSocket连接关闭 (代码: ${event.code})`)
    }
    
    ws.value.onerror = (error) => {
      isConnecting.value = false
      addLogMessage('error', 'WebSocket连接错误')
      console.error('WebSocket错误:', error)
    }
    
  } catch (error) {
    isConnecting.value = false
    addLogMessage('error', `连接失败: ${error.message}`)
  }
}

// 断开WebSocket
const disconnectWebSocket = () => {
  if (ws.value) {
    ws.value.close()
    ws.value = null
  }
  isConnected.value = false
  isConnecting.value = false
  connectionStartTime.value = null
  addLogMessage('info', '主动断开WebSocket连接')
}

// 发送消息
const sendMessage = (message) => {
  if (ws.value && isConnected.value) {
    ws.value.send(JSON.stringify(message))
  }
}

// 切换连接状态
const toggleConnection = () => {
  if (isConnected.value) {
    disconnectWebSocket()
  } else {
    connectWebSocket()
  }
}

// 生命周期
onMounted(() => {
  addLogMessage('info', 'WebSocket测试组件已加载')
})

onUnmounted(() => {
  disconnectWebSocket()
})
</script>

<style scoped>
.websocket-test {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.header h2 {
  margin: 0;
  color: #333;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 15px;
}

.status-indicator {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-indicator.connected {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-indicator.disconnected {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-indicator.connecting {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.stats {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item .label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-item .value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.equipment-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.equipment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.running {
  background-color: #d4edda;
  color: #155724;
}

.parameters {
  display: grid;
  gap: 8px;
  margin-bottom: 15px;
}

.parameter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.param-label {
  font-size: 14px;
  color: #666;
}

.param-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.last-update {
  font-size: 12px;
  color: #999;
  text-align: right;
}

.message-log {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-log h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px;
  background-color: #f8f9fa;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 4px 0;
  font-size: 13px;
  border-bottom: 1px solid #e9ecef;
}

.log-item:last-child {
  border-bottom: none;
}

.log-item .timestamp {
  color: #666;
  font-family: monospace;
  min-width: 80px;
}

.log-item.success .content {
  color: #28a745;
}

.log-item.error .content {
  color: #dc3545;
}

.log-item.warning .content {
  color: #ffc107;
}

.log-item.info .content {
  color: #17a2b8;
}

.log-item.data .content {
  color: #6f42c1;
}
</style>