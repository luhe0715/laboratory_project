<script setup>
import { ref, onMounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

// 注册必要的组件
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
]);

// 生成时间数据
const generateTimeData = () => {
  const times = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000); // 每5分钟一个数据点
    times.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
  }
  return times;
};

const timeData = generateTimeData();

// 强制汽化器进口压力 - 折线图
const inletPressureOption = ref({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: ['#ff6b6b'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c} kPa'
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '15%'
  },
  xAxis: {
    type: 'category',
    data: timeData,
    axisLabel: {
      color: 'var(--text-secondary)',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '压力(kPa)',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLabel: {
      formatter: '{value}',
      color: '#ffffff',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
        type: 'dashed'
      }
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 70,
      end: 100
    }
  ],
  series: [
    {
      name: '进口压力',
      type: 'line',
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50 + 450)),
      smooth: true,
      lineStyle: {
        width: 2
      }
    }
  ]
});

// 强制汽化器进口温度 - 折线图
const inletTemperatureOption = ref({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: ['#4ecdc4'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c} °C'
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '15%'
  },
  xAxis: {
    type: 'category',
    data: timeData,
    axisLabel: {
      color: 'var(--text-secondary)',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '温度(°C)',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLabel: {
      formatter: '{value}',
      color: '#ffffff',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
        type: 'dashed'
      }
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 70,
      end: 100
    }
  ],
  series: [
    {
      name: '进口温度',
      type: 'line',
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10 - 165)),
      smooth: true,
      lineStyle: {
        width: 2
      }
    }
  ]
});

// 强制汽化器阀位 - 柱状图
const valvePositionOption = ref({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: ['#00d4ff', '#ff9f43'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c}%'
  },
  legend: {
    data: ['CFV2304', 'CFV2303'],
    textStyle: {
      color: 'var(--text-secondary)',
      fontSize: 10
    },
    top: '5%'
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '25%'
  },
  xAxis: {
    type: 'category',
    data: timeData.slice(-8), // 显示最近8个时间点
    axisLabel: {
      color: '#ffffff',
      fontSize: 10,
      rotate: 45
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '阀位(%)',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLabel: {
      formatter: '{value}',
      color: '#ffffff',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: 'CFV2304',
      type: 'bar',
      data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 40 + 30)),
      barWidth: '35%'
    },
    {
      name: 'CFV2303',
      type: 'bar',
      data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 40 + 30)),
      barWidth: '35%'
    }
  ]
});

// 强制汽化器温度调节阀阀位 - 柱状图
const tempControlValveOption = ref({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: ['#a55eea', '#26de81'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c}%'
  },
  legend: {
    data: ['1号阀', '2号阀'],
    textStyle: {
      color: 'var(--text-secondary)',
      fontSize: 10
    },
    top: '5%'
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '25%'
  },
  xAxis: {
    type: 'category',
    data: timeData.slice(-8),
    axisLabel: {
      color: '#ffffff',
      fontSize: 10,
      rotate: 45
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '阀位(%)',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLabel: {
      formatter: '{value}',
      color: '#ffffff',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '1号阀',
      type: 'bar',
      data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 50 + 25)),
      barWidth: '35%'
    },
    {
      name: '2号阀',
      type: 'bar',
      data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 50 + 25)),
      barWidth: '35%'
    }
  ]
});

// 强制汽化器出口流量 - 柱状图
const outletFlowOption = ref({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: ['#fd79a8', '#fdcb6e'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c} kg/h'
  },
  legend: {
    data: ['1号出口', '2号出口'],
    textStyle: {
      color: 'var(--text-secondary)',
      fontSize: 10
    },
    top: '5%'
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '25%'
  },
  xAxis: {
    type: 'category',
    data: timeData.slice(-8),
    axisLabel: {
      color: 'var(--text-secondary)',
      fontSize: 10,
      rotate: 45
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '流量(kg/h)',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLabel: {
      formatter: '{value}',
      color: '#ffffff',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '1号出口',
      type: 'bar',
      data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 2000 + 3000)),
      barWidth: '35%'
    },
    {
      name: '2号出口',
      type: 'bar',
      data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 2000 + 3000)),
      barWidth: '35%'
    }
  ]
});

// 强制汽化器出口压力 - 折线图
const outletPressureOption = ref({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: ['#74b9ff'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c} kPa'
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '15%'
  },
  xAxis: {
    type: 'category',
    data: timeData,
    axisLabel: {
      color: 'var(--text-secondary)',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '压力(kPa)',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLabel: {
      formatter: '{value}',
      color: '#ffffff',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
        type: 'dashed'
      }
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 70,
      end: 100
    }
  ],
  series: [
    {
      name: '出口压力',
      type: 'line',
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100 + 200)),
      smooth: true,
      lineStyle: {
        width: 2
      }
    }
  ]
});

// 模拟数据更新
const updateData = () => {
  const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  
  // 更新进口压力数据
  inletPressureOption.value.series[0].data.shift();
  inletPressureOption.value.series[0].data.push(Math.floor(Math.random() * 50 + 450));
  inletPressureOption.value.xAxis.data.shift();
  inletPressureOption.value.xAxis.data.push(timeStr);
  
  // 更新进口温度数据
  inletTemperatureOption.value.series[0].data.shift();
  inletTemperatureOption.value.series[0].data.push(Math.floor(Math.random() * 10 - 165));
  inletTemperatureOption.value.xAxis.data.shift();
  inletTemperatureOption.value.xAxis.data.push(timeStr);
  
  // 更新阀位数据
  valvePositionOption.value.series[0].data.shift();
  valvePositionOption.value.series[0].data.push(Math.floor(Math.random() * 40 + 30));
  valvePositionOption.value.series[1].data.shift();
  valvePositionOption.value.series[1].data.push(Math.floor(Math.random() * 40 + 30));
  valvePositionOption.value.xAxis.data.shift();
  valvePositionOption.value.xAxis.data.push(timeStr);
  
  // 更新温度调节阀数据
  tempControlValveOption.value.series[0].data.shift();
  tempControlValveOption.value.series[0].data.push(Math.floor(Math.random() * 50 + 25));
  tempControlValveOption.value.series[1].data.shift();
  tempControlValveOption.value.series[1].data.push(Math.floor(Math.random() * 50 + 25));
  tempControlValveOption.value.xAxis.data.shift();
  tempControlValveOption.value.xAxis.data.push(timeStr);
  
  // 更新出口流量数据
  outletFlowOption.value.series[0].data.shift();
  outletFlowOption.value.series[0].data.push(Math.floor(Math.random() * 2000 + 3000));
  outletFlowOption.value.series[1].data.shift();
  outletFlowOption.value.series[1].data.push(Math.floor(Math.random() * 2000 + 3000));
  outletFlowOption.value.xAxis.data.shift();
  outletFlowOption.value.xAxis.data.push(timeStr);
  
  // 更新出口压力数据
  outletPressureOption.value.series[0].data.shift();
  outletPressureOption.value.series[0].data.push(Math.floor(Math.random() * 100 + 200));
  outletPressureOption.value.xAxis.data.shift();
  outletPressureOption.value.xAxis.data.push(timeStr);
};

onMounted(() => {
  // 初始化后每隔5分钟更新一次数据
  setInterval(updateData, 5 * 60 * 1000);
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <span class="gradient-text">强制汽化器设备信息看板</span>
      <div class="nav-buttons">
        <router-link to="/" class="nav-button">总览</router-link>
        <router-link to="/lng-tank" class="nav-button">LNG储罐设备信息</router-link>
        <router-link to="/vaporizer" class="nav-button active">强制汽化器设备信息</router-link>
        <router-link to="/real-time" class="nav-button">设备实时信息</router-link>
        <router-link to="/history" class="nav-button">设备历史数据分析</router-link>
      </div>
    </div>
    
    <div class="dashboard-layout">
      <!-- 3D模型背景 -->
      <div class="model-background">
        <div class="vaporizer-3d">
          <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <!-- 强制汽化器3D效果图形 -->
            <defs>
              <linearGradient id="vaporGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0a2e5c" />
                <stop offset="100%" stop-color="#051a38" />
              </linearGradient>
              <linearGradient id="heatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ff6e76" />
                <stop offset="100%" stop-color="#fdaa3f" />
              </linearGradient>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="5" dy="5" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
              </filter>
            </defs>
            
            <!-- 汽化器主体 -->
            <rect x="300" y="150" width="200" height="300" rx="10" ry="10" fill="url(#vaporGradient)" stroke="#1a4980" stroke-width="3" filter="url(#shadow)" />
            
            <!-- 热交换管道 -->
            <rect x="320" y="180" width="160" height="240" fill="none" stroke="#3a8ee6" stroke-width="2" stroke-dasharray="8,8" />
            
            <!-- 入口管道 -->
            <line x1="300" y1="200" x2="200" y2="200" stroke="#3a8ee6" stroke-width="12" />
            <text x="220" y="190" fill="var(--text-secondary)" font-size="16" font-weight="bold">LNG入口</text>
            
            <!-- 出口管道 -->
            <line x1="500" y1="200" x2="600" y2="200" stroke="#7cffb2" stroke-width="12" />
            <text x="520" y="190" fill="var(--text-secondary)" font-size="16" font-weight="bold">NG出口</text>
            
            <!-- 热源入口 -->
            <line x1="400" y1="450" x2="400" y2="550" stroke="#ff6e76" stroke-width="12" />
            <text x="360" y="570" fill="var(--text-secondary)" font-size="16" font-weight="bold">热源入口</text>
            
            <!-- 热源出口 -->
            <line x1="400" y1="150" x2="400" y2="50" stroke="#fdaa3f" stroke-width="12" />
            <text x="360" y="40" fill="var(--text-secondary)" font-size="16" font-weight="bold">热源出口</text>
            
            <!-- 热交换效果 -->
            <rect x="340" y="200" width="120" height="200" fill="url(#heatGradient)" opacity="0.4" />
            
            <!-- 控制阀门 -->
            <circle cx="200" cy="200" r="15" fill="#ff6e76" stroke="#1a4980" stroke-width="3" filter="url(#shadow)" />
            <circle cx="600" cy="200" r="15" fill="#7cffb2" stroke="#1a4980" stroke-width="3" filter="url(#shadow)" />
            
            <!-- 温度计 -->
            <rect x="540" y="280" width="15" height="80" fill="#0f3058" stroke="#1a4980" stroke-width="2" filter="url(#shadow)" />
            <circle cx="547" cy="370" r="15" fill="#ff6e76" stroke="#1a4980" stroke-width="2" />
            <rect x="542" y="300" width="10" height="50" fill="#ff6e76" />
            
            <!-- 设备标识 -->
            <text x="400" y="300" fill="var(--text-primary)" font-size="24" font-weight="bold" text-anchor="middle">强制汽化器</text>
            <text x="400" y="320" fill="var(--text-secondary)" font-size="16" text-anchor="middle">FV-001</text>
          </svg>
        </div>
      </div>
      
      <!-- 浮动面板 -->
      <!-- 左上：进口压力 -->
      <div class="floating-panel top-left">
        <div class="panel-title">进口压力 (kPa)</div>
        <div class="chart-container">
          <v-chart class="chart" :option="inletPressureOption" autoresize />
        </div>
      </div>
      
      <!-- 左中：进口温度 -->
      <div class="floating-panel middle-left">
        <div class="panel-title">进口温度 (°C)</div>
        <div class="chart-container">
          <v-chart class="chart" :option="inletTemperatureOption" autoresize />
        </div>
      </div>
      
      <!-- 左下：阀位 -->
      <div class="floating-panel bottom-left">
        <div class="panel-title">汽化器阀位 (%)</div>
        <div class="chart-container">
          <v-chart class="chart" :option="valvePositionOption" autoresize />
        </div>
      </div>
      
      <!-- 右上：温度调节阀 -->
      <div class="floating-panel top-right">
        <div class="panel-title">温度调节阀阀位 (%)</div>
        <div class="chart-container">
          <v-chart class="chart" :option="tempControlValveOption" autoresize />
        </div>
      </div>
      
      <!-- 右中：出口流量 -->
      <div class="floating-panel middle-right">
        <div class="panel-title">出口流量 (kg/h)</div>
        <div class="chart-container">
          <v-chart class="chart" :option="outletFlowOption" autoresize />
        </div>
      </div>
      
      <!-- 右下：出口压力 -->
      <div class="floating-panel bottom-right">
        <div class="panel-title">出口压力 (kPa)</div>
        <div class="chart-container">
          <v-chart class="chart" :option="outletPressureOption" autoresize />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}

.gradient-text {
  background: linear-gradient(45deg, #4992ff, #7cffb2, #58d9f9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: bold;
  font-size: 1.8rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.dashboard-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
}

.nav-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-button {
  padding: 6px 12px;
  background-color: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: var(--accent-color);
  color: var(--text-primary);
  box-shadow: 0 0 10px rgba(73, 146, 255, 0.5);
}

.nav-button.active {
  background-color: var(--accent-color);
  color: var(--text-primary);
  box-shadow: 0 0 10px rgba(73, 146, 255, 0.5);
}

.dashboard-layout {
  position: relative;
  width: 100%;
  height: calc(100vh - 120px);
  overflow: hidden;
}

.model-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--secondary-bg) 100%);
  z-index: 1;
}

.vaporizer-3d {
  width: 80%;
  height: 80%;
  opacity: 0.8;
}

.floating-panel {
  position: absolute;
  width: 430px;
  height: 200px;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 10;
  transition: all 0.3s ease;
  padding: 12px;
}

.floating-panel:hover {
  background: rgba(30, 30, 30, 0.95);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.floating-panel:not(.middle-left):not(.middle-right):hover {
  transform: scale(1.02);
}

.middle-left:hover {
  transform: translateY(-50%) scale(1.02);
}

.middle-right:hover {
  transform: translateY(-50%) scale(1.02);
}

.floating-panel .panel-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(var(--border-color-rgb), 0.3);
  padding-bottom: 6px;
}

.floating-panel .chart-container {
  height: calc(100% - 35px);
  width: 100%;
}

/* 左侧面板位置 */
.top-left {
  top: 20px;
  left: 20px;
}

.middle-left {
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
}

.bottom-left {
  bottom: 20px;
  left: 20px;
}

/* 右侧面板位置 */
.top-right {
  top: 20px;
  right: 20px;
}

.middle-right {
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

.bottom-right {
  bottom: 20px;
  right: 20px;
}

/* 响应式设计 */
/* 高分辨率显示屏优化 */
@media (min-width: 1920px) {
  .floating-panel {
    width: 520px;
    height: 260px;
  }
  
  .floating-panel .chart-container {
    height: calc(100% - 40px);
  }
  
  .floating-panel .panel-title {
    font-size: 1rem;
    margin-bottom: 10px;
    padding-bottom: 8px;
  }
}

@media (min-width: 2560px) {
  .floating-panel {
    width: 620px;
    height: 320px;
  }
  
  .floating-panel .chart-container {
    height: calc(100% - 45px);
  }
  
  .floating-panel .panel-title {
    font-size: 1.1rem;
    margin-bottom: 12px;
    padding-bottom: 10px;
  }
}

@media (max-width: 1200px) {
  .floating-panel {
    width: 350px;
    height: 180px;
  }
}

@media (max-width: 768px) {
  .floating-panel {
    width: 280px;
    height: 150px;
    padding: 8px;
  }
  
  .floating-panel .panel-title {
    font-size: 0.8rem;
  }
  
  .top-left, .middle-left, .bottom-left {
    left: 10px;
  }
  
  .top-right, .middle-right, .bottom-right {
    right: 10px;
  }
  
  .top-left, .top-right {
    top: 10px;
  }
  
  .bottom-left, .bottom-right {
    bottom: 10px;
  }
}
</style>