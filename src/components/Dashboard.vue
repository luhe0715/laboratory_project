<script setup>
import { ref, onMounted, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart, LineChart, GaugeChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

// 注册必要的组件
use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

// 数据状态
const equipmentCount = ref({});
const equipmentTypes = ref([]);
const personnelCount = ref({});
const powerConsumption = ref({});
const waterConsumption = ref({});
const vehicleCount = ref({});

// 设备数量统计图表配置
const equipmentCountOption = computed(() => ({
  title: {
    text: `设备总数: ${equipmentCount.value.total || 0}台`,
    left: 'center',
    top: '5%',
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}台 ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle',
    textStyle: {
      color: '#ffffff',
      fontSize: 10
    }
  },
  series: [
    {
      name: '设备状态',
      type: 'pie',
      radius: ['30%', '60%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#1a1a1a',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}台',
        color: '#ffffff',
        fontSize: 10
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      data: [
        { 
          value: equipmentCount.value.running || 0, 
          name: '运行中',
          itemStyle: { color: '#67C23A' }
        },
        { 
          value: equipmentCount.value.standby || 0, 
          name: '待机',
          itemStyle: { color: '#E6A23C' }
        },
        { 
          value: equipmentCount.value.maintenance || 0, 
          name: '维护中',
          itemStyle: { color: '#F56C6C' }
        }
      ]
    }
  ]
}));

// 设备类型统计图表配置
const equipmentTypesOption = computed(() => ({
  title: {
    text: '设备类型分布',
    left: 'center',
    top: '5%',
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '10%',
    top: '20%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: equipmentTypes.value.map(item => item.name),
    axisTick: {
      alignWithLabel: true
    },
    axisLine: {
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff',
      rotate: 45,
      fontSize: 10
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff',
      fontSize: 10
    },
    splitLine: {
      lineStyle: {
        color: '#ffffff',
        opacity: 0.2,
        type: 'dashed'
      }
    }
  },
  series: [{
    name: '设备数量',
    type: 'bar',
    barWidth: '60%',
    data: equipmentTypes.value.map(item => item.value),
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#00D4FF'
        }, {
          offset: 1, color: '#0099CC'
        }]
      }
    }
  }]
}));

// 人员数量统计图表配置
const personnelCountOption = computed(() => ({
  title: {
    text: `总人数: ${personnelCount.value.total || 0}人`,
    left: 'center',
    top: '5%',
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}人 ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle',
    textStyle: {
      color: '#ffffff',
      fontSize: 10
    }
  },
  series: [
    {
      name: '人员分布',
      type: 'pie',
      radius: ['30%', '60%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#1a1a1a',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}人',
        color: '#ffffff',
        fontSize: 10
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      data: (personnelCount.value.breakdown || []).map((item, index) => ({
        value: item.value,
        name: item.name,
        itemStyle: { 
          color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][index % 4]
        }
      }))
    }
  ]
}));

// 用电消耗统计图表配置
const powerConsumptionOption = computed(() => ({
  title: {
    text: `总用电: ${powerConsumption.value.total || 0}kWh`,
    left: 'center',
    top: '5%',
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '10%',
    top: '20%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: powerConsumption.value.timeData || [],
    axisLine: {
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff',
      fontSize: 10
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff',
      fontSize: 10
    },
    splitLine: {
      lineStyle: {
        color: '#ffffff',
        opacity: 0.2,
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '用电量',
      type: 'line',
      smooth: true,
      data: powerConsumption.value.consumptionData || [],
      itemStyle: {
        color: '#FFD700'
      },
      lineStyle: {
        color: '#FFD700',
        width: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(255, 215, 0, 0.3)'
          }, {
            offset: 1, color: 'rgba(255, 215, 0, 0.1)'
          }]
        }
      }
    }
  ]
}));

// 用水消耗统计图表配置
const waterConsumptionOption = computed(() => ({
  title: {
    text: `总用水: ${waterConsumption.value.total || 0}t`,
    left: 'center',
    top: '5%',
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '10%',
    top: '20%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: waterConsumption.value.timeData || [],
    axisLine: {
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff',
      fontSize: 10
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff',
      fontSize: 10
    },
    splitLine: {
      lineStyle: {
        color: '#ffffff',
        opacity: 0.2,
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '用水量',
      type: 'bar',
      data: waterConsumption.value.consumptionData || [],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#00CED1'
          }, {
            offset: 1, color: '#008B8B'
          }]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
}));

// 车辆数量统计图表配置
const vehicleCountOption = computed(() => ({
  title: {
    text: `车辆总数: ${vehicleCount.value.total || 0}台`,
    left: 'center',
    top: '5%',
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}台 ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle',
    textStyle: {
      color: '#ffffff',
      fontSize: 10
    }
  },
  series: [
    {
      name: '车辆类型',
      type: 'pie',
      radius: ['30%', '60%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#1a1a1a',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}台',
        color: '#ffffff',
        fontSize: 10
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      data: (vehicleCount.value.breakdown || []).map((item, index) => ({
        value: item.value,
        name: item.name,
        itemStyle: { 
          color: ['#FF9500', '#32CD32', '#FF69B4', '#87CEEB'][index % 4]
        }
      }))
    }
  ]
}));

// 获取数据的函数
const fetchData = async () => {
  try {
    // 获取设备数量统计
    const equipmentCountRes = await fetch('http://localhost:3000/api/dashboard/equipment-count');
    const equipmentCountData = await equipmentCountRes.json();
    if (equipmentCountData.code === 200) {
      equipmentCount.value = equipmentCountData.data;
    }

    // 获取设备类型统计
    const equipmentTypesRes = await fetch('http://localhost:3000/api/dashboard/equipment-types');
    const equipmentTypesData = await equipmentTypesRes.json();
    if (equipmentTypesData.code === 200) {
      equipmentTypes.value = equipmentTypesData.data;
    }

    // 获取人员数量统计
    const personnelCountRes = await fetch('http://localhost:3000/api/dashboard/personnel-count');
    const personnelCountData = await personnelCountRes.json();
    if (personnelCountData.code === 200) {
      personnelCount.value = personnelCountData.data;
    }

    // 获取用电消耗统计
    const powerConsumptionRes = await fetch('http://localhost:3000/api/dashboard/power-consumption');
    const powerConsumptionData = await powerConsumptionRes.json();
    if (powerConsumptionData.code === 200) {
      powerConsumption.value = powerConsumptionData.data;
    }

    // 获取用水消耗统计
    const waterConsumptionRes = await fetch('http://localhost:3000/api/dashboard/water-consumption');
    const waterConsumptionData = await waterConsumptionRes.json();
    if (waterConsumptionData.code === 200) {
      waterConsumption.value = waterConsumptionData.data;
    }

    // 获取车辆数量统计
    const vehicleCountRes = await fetch('http://localhost:3000/api/dashboard/vehicle-count');
    const vehicleCountData = await vehicleCountRes.json();
    if (vehicleCountData.code === 200) {
      vehicleCount.value = vehicleCountData.data;
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

onMounted(() => {
  fetchData();
  // 每30秒更新一次数据
  setInterval(fetchData, 30000);
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <span class="gradient-text">LNG实验室监控系统总览</span>
      <div class="nav-buttons">
        <router-link to="/" class="nav-button active">总览</router-link>
        <router-link to="/lng-tank" class="nav-button">LNG储罐设备信息</router-link>
        <router-link to="/vaporizer" class="nav-button">强制汽化器设备信息</router-link>
        <router-link to="/real-time" class="nav-button">设备实时信息</router-link>
        <router-link to="/history" class="nav-button">设备历史数据分析</router-link>
        <router-link to="/websocket-test" class="nav-button">WebSocket测试</router-link>
      </div>
    </div>
    
    <div class="dashboard-layout">
      <!-- 左侧面板 - 3个看板 -->
      <div class="dashboard-column left-column">
        <!-- 设备数量统计 -->
        <div class="dashboard-panel">
          <div class="panel-title">设备数量统计</div>
          <div class="chart-container">
            <v-chart class="chart" :option="equipmentCountOption" autoresize />
          </div>
        </div>
        
        <!-- 设备类型统计 -->
        <div class="dashboard-panel">
          <div class="panel-title">设备类型统计</div>
          <div class="chart-container">
            <v-chart class="chart" :option="equipmentTypesOption" autoresize />
          </div>
        </div>
        
        <!-- 人员数量统计 -->
        <div class="dashboard-panel">
          <div class="panel-title">人员数量统计</div>
          <div class="chart-container">
            <v-chart class="chart" :option="personnelCountOption" autoresize />
          </div>
        </div>
      </div>
      
      <!-- 中间面板 - 实验室地图 -->
      <div class="dashboard-column center-column">
        <div class="lab-background">
          <img src="../assets/lab-background.svg" alt="低温实验室" />
          <div class="lab-title">低温实验室</div>
        </div>
      </div>
      
      <!-- 右侧面板 - 3个看板 -->
      <div class="dashboard-column right-column">
        <!-- 用电消耗统计 -->
        <div class="dashboard-panel">
          <div class="panel-title">用电消耗统计</div>
          <div class="chart-container">
            <v-chart class="chart" :option="powerConsumptionOption" autoresize />
          </div>
        </div>
        
        <!-- 用水消耗统计 -->
        <div class="dashboard-panel">
          <div class="panel-title">用水消耗统计</div>
          <div class="chart-container">
            <v-chart class="chart" :option="waterConsumptionOption" autoresize />
          </div>
        </div>
        
        <!-- 低温内车辆数量统计 -->
        <div class="dashboard-panel">
          <div class="panel-title">低温内车辆数量统计</div>
          <div class="chart-container">
            <v-chart class="chart" :option="vehicleCountOption" autoresize />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 20px;
}

.gradient-text {
  background: linear-gradient(45deg, #4992ff, #7cffb2, #58d9f9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 0 0 30px rgba(73, 146, 255, 0.5);
}

.nav-buttons {
  display: flex;
  gap: 15px;
}

.nav-button {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.nav-button.active {
  background: linear-gradient(45deg, #4992ff, #58d9f9);
  border-color: transparent;
  box-shadow: 0 5px 20px rgba(73, 146, 255, 0.4);
}

.dashboard-layout {
  display: flex;
  width: 100%;
  height: calc(100vh - 150px);
  gap: 20px;
}

.dashboard-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
}

.left-column, .right-column {
  width: 25%;
}

.center-column {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
}

.dashboard-panel {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 15px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.dashboard-panel:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.2);
}

.lab-background {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.lab-background img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.lab-title {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 26, 46, 0.8);
  padding: 10px 20px;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-weight: bold;
  font-size: 1.2rem;
  backdrop-filter: blur(10px);
}

.panel-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.chart-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 180px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-layout {
    flex-direction: column;
    height: auto;
  }
  
  .left-column, .right-column, .center-column {
    width: 100%;
  }
  
  .left-column, .right-column {
    flex-direction: row;
    height: auto;
  }
  
  .left-column .dashboard-panel,
  .right-column .dashboard-panel {
    flex: 1;
    min-height: 300px;
  }
  
  .center-column {
    height: 400px;
    order: -1;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .nav-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .left-column, .right-column {
    flex-direction: column;
  }
  
  .gradient-text {
    font-size: 2rem;
  }
  
  .chart {
    min-height: 200px;
  }
}
</style>