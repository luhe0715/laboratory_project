<template>
  <div class="api-example">
    <el-card class="example-card">
      <template #header>
        <div class="card-header">
          <span>API接口使用示例</span>
          <el-button type="primary" @click="refreshAllData">刷新数据</el-button>
        </div>
      </template>
      
      <!-- 实验室基本信息 -->
      <el-row :gutter="20" class="info-section">
        <el-col :span="24">
          <h3>实验室基本信息</h3>
          <el-descriptions :column="3" border v-if="labInfo">
            <el-descriptions-item label="面积">{{ labInfo.area }}㎡</el-descriptions-item>
            <el-descriptions-item label="在岗人员">{{ labInfo.personnel }}人</el-descriptions-item>
            <el-descriptions-item label="设备总数">{{ labInfo.equipmentCount }}台</el-descriptions-item>
            <el-descriptions-item label="运行时间">{{ labInfo.operatingTime }}小时</el-descriptions-item>
            <el-descriptions-item label="环境温度">{{ labInfo.temperature }}℃</el-descriptions-item>
            <el-descriptions-item label="安全等级">{{ labInfo.safetyLevel }}</el-descriptions-item>
          </el-descriptions>
          <el-skeleton v-else :rows="2" animated />
        </el-col>
      </el-row>
      
      <!-- 设备状态统计 -->
      <el-row :gutter="20" class="status-section">
        <el-col :span="12">
          <h3>设备状态统计</h3>
          <div v-if="equipmentStatus" class="status-cards">
            <el-card class="status-card running">
              <div class="status-content">
                <div class="status-number">{{ equipmentStatus.running }}</div>
                <div class="status-label">运行中</div>
              </div>
            </el-card>
            <el-card class="status-card standby">
              <div class="status-content">
                <div class="status-number">{{ equipmentStatus.standby }}</div>
                <div class="status-label">待机</div>
              </div>
            </el-card>
            <el-card class="status-card maintenance">
              <div class="status-content">
                <div class="status-number">{{ equipmentStatus.maintenance }}</div>
                <div class="status-label">维护中</div>
              </div>
            </el-card>
          </div>
          <el-skeleton v-else :rows="3" animated />
        </el-col>
        
        <el-col :span="12">
          <h3>设备类型分布</h3>
          <div v-if="equipmentTypes" class="types-list">
            <div v-for="type in equipmentTypes" :key="type.name" class="type-item">
              <span class="type-name">{{ type.name }}</span>
              <span class="type-count">{{ type.value }}台</span>
            </div>
          </div>
          <el-skeleton v-else :rows="4" animated />
        </el-col>
      </el-row>
      
      <!-- 实时设备列表 -->
      <el-row class="equipment-section">
        <el-col :span="24">
          <h3>实时设备状态</h3>
          <el-button 
            type="success" 
            :disabled="isPolling" 
            @click="startRealtimePolling"
            class="polling-btn"
          >
            {{ isPolling ? '实时监控中...' : '开始实时监控' }}
          </el-button>
          <el-button 
            type="danger" 
            :disabled="!isPolling" 
            @click="stopRealtimePolling"
            class="polling-btn"
          >
            停止监控
          </el-button>
          
          <el-table 
            :data="realtimeEquipment" 
            style="width: 100%; margin-top: 20px;"
            v-loading="equipmentLoading"
          >
            <el-table-column prop="name" label="设备名称" width="200" />
            <el-table-column prop="type" label="设备类型" width="120" />
            <el-table-column prop="statusText" label="状态" width="100">
              <template #default="scope">
                <el-tag 
                  :type="getStatusType(scope.row.status)"
                  size="small"
                >
                  {{ scope.row.statusText }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="参数" min-width="300">
              <template #default="scope">
                <div class="parameters">
                  <span 
                    v-for="param in scope.row.parameters" 
                    :key="param.key"
                    class="parameter-item"
                  >
                    {{ param.label }}: {{ param.value }}{{ param.unit }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="lastUpdate" label="更新时间" width="180">
              <template #default="scope">
                {{ formatTime(scope.row.lastUpdate) }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      
      <!-- 历史数据查询示例 -->
      <el-row class="history-section">
        <el-col :span="24">
          <h3>历史数据查询示例</h3>
          <el-form :model="historyForm" inline>
            <el-form-item label="设备">
              <el-select v-model="historyForm.equipmentId" placeholder="选择设备">
                <el-option 
                  v-for="equipment in historyEquipmentList" 
                  :key="equipment.id"
                  :label="equipment.name" 
                  :value="equipment.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="参数">
              <el-select v-model="historyForm.parameter" placeholder="选择参数">
                <el-option 
                  v-for="param in currentEquipmentParams" 
                  :key="param.key"
                  :label="param.label" 
                  :value="param.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="间隔">
              <el-select v-model="historyForm.interval">
                <el-option label="1小时" value="1h" />
                <el-option label="6小时" value="6h" />
                <el-option label="1天" value="1d" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryHistoryData">查询</el-button>
            </el-form-item>
          </el-form>
          
          <div v-if="historyData" class="history-result">
            <h4>{{ historyData.equipmentName }} - {{ historyData.parameter }}</h4>
            <p>数据范围: {{ formatTime(historyData.timeRange.start) }} 至 {{ formatTime(historyData.timeRange.end) }}</p>
            <el-descriptions :column="4" border>
              <el-descriptions-item label="最小值">{{ historyData.statistics.min }}{{ historyData.unit }}</el-descriptions-item>
              <el-descriptions-item label="最大值">{{ historyData.statistics.max }}{{ historyData.unit }}</el-descriptions-item>
              <el-descriptions-item label="平均值">{{ historyData.statistics.avg }}{{ historyData.unit }}</el-descriptions-item>
              <el-descriptions-item label="数据点数">{{ historyData.statistics.count }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { 
  dashboardAPI, 
  realtimeAPI, 
  historyAPI, 
  startPolling, 
  cachedRequest 
} from '@/utils/api';
import { ElMessage } from 'element-plus';

export default {
  name: 'ApiExample',
  data() {
    return {
      // 基础数据
      labInfo: null,
      equipmentStatus: null,
      equipmentTypes: null,
      
      // 实时数据
      realtimeEquipment: [],
      equipmentLoading: false,
      isPolling: false,
      stopPollingFn: null,
      
      // 历史数据
      historyEquipmentList: [],
      historyData: null,
      historyForm: {
        equipmentId: null,
        parameter: null,
        interval: '1h'
      }
    };
  },
  
  computed: {
    // 当前选中设备的参数列表
    currentEquipmentParams() {
      if (!this.historyForm.equipmentId) return [];
      const equipment = this.historyEquipmentList.find(eq => eq.id === this.historyForm.equipmentId);
      return equipment ? equipment.parameters : [];
    }
  },
  
  async mounted() {
    await this.loadInitialData();
    await this.loadHistoryEquipmentList();
  },
  
  beforeUnmount() {
    // 组件销毁时停止轮询
    this.stopRealtimePolling();
  },
  
  methods: {
    // 加载初始数据
    async loadInitialData() {
      try {
        // 使用缓存请求，避免重复加载
        const [labInfo, equipmentStatus, equipmentTypes] = await Promise.all([
          cachedRequest('lab-info', dashboardAPI.getLabInfo, 10 * 60 * 1000), // 10分钟缓存
          cachedRequest('equipment-status', dashboardAPI.getEquipmentStatus, 30 * 1000), // 30秒缓存
          cachedRequest('equipment-types', dashboardAPI.getEquipmentTypes, 5 * 60 * 1000) // 5分钟缓存
        ]);
        
        this.labInfo = labInfo;
        this.equipmentStatus = equipmentStatus;
        this.equipmentTypes = equipmentTypes;
      } catch (error) {
        console.error('加载初始数据失败:', error);
      }
    },
    
    // 刷新所有数据
    async refreshAllData() {
      ElMessage.info('正在刷新数据...');
      await this.loadInitialData();
      if (this.isPolling) {
        await this.loadRealtimeEquipment();
      }
      ElMessage.success('数据刷新完成');
    },
    
    // 加载实时设备数据
    async loadRealtimeEquipment() {
      this.equipmentLoading = true;
      try {
        this.realtimeEquipment = await realtimeAPI.getEquipmentList();
      } catch (error) {
        console.error('加载实时设备数据失败:', error);
      } finally {
        this.equipmentLoading = false;
      }
    },
    
    // 开始实时轮询
    startRealtimePolling() {
      if (this.isPolling) return;
      
      this.isPolling = true;
      this.stopPollingFn = startPolling(
        realtimeAPI.getEquipmentList,
        3000, // 3秒间隔
        (data) => {
          this.realtimeEquipment = data;
        }
      );
      
      ElMessage.success('开始实时监控');
    },
    
    // 停止实时轮询
    stopRealtimePolling() {
      if (!this.isPolling) return;
      
      this.isPolling = false;
      if (this.stopPollingFn) {
        this.stopPollingFn();
        this.stopPollingFn = null;
      }
      
      ElMessage.info('已停止实时监控');
    },
    
    // 加载历史数据设备列表
    async loadHistoryEquipmentList() {
      try {
        this.historyEquipmentList = await historyAPI.getEquipmentList();
      } catch (error) {
        console.error('加载历史设备列表失败:', error);
      }
    },
    
    // 查询历史数据
    async queryHistoryData() {
      if (!this.historyForm.equipmentId || !this.historyForm.parameter) {
        ElMessage.warning('请选择设备和参数');
        return;
      }
      
      try {
        this.historyData = await historyAPI.getData(this.historyForm);
        ElMessage.success('历史数据查询成功');
      } catch (error) {
        console.error('查询历史数据失败:', error);
      }
    },
    
    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        running: 'success',
        standby: 'warning',
        maintenance: 'info',
        error: 'danger'
      };
      return typeMap[status] || 'info';
    },
    
    // 格式化时间
    formatTime(timeString) {
      return new Date(timeString).toLocaleString('zh-CN');
    }
  }
};
</script>

<style scoped>
.api-example {
  padding: 20px;
}

.example-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-section,
.status-section,
.equipment-section,
.history-section {
  margin-bottom: 30px;
}

.status-cards {
  display: flex;
  gap: 15px;
}

.status-card {
  flex: 1;
  text-align: center;
}

.status-card.running {
  border-left: 4px solid #67c23a;
}

.status-card.standby {
  border-left: 4px solid #e6a23c;
}

.status-card.maintenance {
  border-left: 4px solid #909399;
}

.status-content {
  padding: 10px;
}

.status-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.status-label {
  font-size: 14px;
  color: #606266;
  margin-top: 5px;
}

.types-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.type-name {
  font-weight: 500;
}

.type-count {
  color: #409eff;
  font-weight: bold;
}

.polling-btn {
  margin-right: 10px;
}

.parameters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.parameter-item {
  background: #f0f9ff;
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.history-result {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.history-result h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.history-result p {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
}
</style>