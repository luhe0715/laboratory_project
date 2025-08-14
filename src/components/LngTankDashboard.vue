<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, LineChart, BarChart, GaugeChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import LngTank3DModel from './LngTank3DModel.vue';

// 当前激活的图表标签
const activeChart = ref('level');

// 注册必要的组件
use([
  CanvasRenderer,
  PieChart,
  LineChart,
  BarChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent
]);

// 饼图数据 - LNG储罐类型分布
const pieOption = ref({
  color: [
    'var(--chart-color-1)',
    'var(--chart-color-2)',
    'var(--chart-color-3)',
    'var(--chart-color-4)',
    'var(--chart-color-5)'
  ],
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center',
    textStyle: {
      color: 'var(--text-secondary)'
    }
  },
  series: [
    {
      name: '储罐类型',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: 'var(--panel-bg)',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold',
          color: 'var(--text-primary)'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 5, name: '平底储罐' },
        { value: 8, name: '球形储罐' },
        { value: 3, name: '卧式储罐' },
        { value: 2, name: '地下储罐' }
      ]
    }
  ]
});

// 柱状图数据 - LNG储罐容量统计
const barOption = ref({
  color: ['var(--chart-color-1)'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['1号储罐', '2号储罐', '3号储罐', '4号储罐', '5号储罐', '6号储罐'],
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {
          color: 'var(--text-secondary)'
        }
      },
      axisLabel: {
        color: 'var(--text-secondary)'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'var(--text-secondary)'
        }
      },
      axisLabel: {
        color: 'var(--text-secondary)'
      },
      splitLine: {
        lineStyle: {
          color: 'var(--border-color)'
        }
      }
    }
  ],
  series: [
    {
      name: '容量(m³)',
      type: 'bar',
      barWidth: '60%',
      data: [10000, 15000, 20000, 18000, 12000, 22000],
      itemStyle: {
        borderRadius: 5
      }
    }
  ]
});

// 折线图数据 - LNG储罐液位
const liquidLevelOption = ref({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: ['#00d4ff'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: {c}%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    axisLabel: {
      color: '#ffffff',
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    name: '液位(%)',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    axisLabel: {
      color: '#ffffff',
      formatter: '{value}'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    }
  },
  series: [
    {
      name: 'LNG储罐液位',
      type: 'line',
      data: [68, 70, 69, 71, 72, 70, 68, 69, 71, 73, 72, 70],
      smooth: true,
      areaStyle: {
        opacity: 0.3
      },
      markLine: {
        silent: true,
        lineStyle: {
          color: 'var(--chart-color-5)'
        },
        data: [
          {
            yAxis: 80,
            name: '警戒线'
          }
        ]
      }
    }
  ]
});

// 折线图数据 - LNG储罐压力
const pressureOption = ref({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: ['#ff6b6b'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: {c} kPa'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    axisLabel: {
      color: '#ffffff',
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    name: '压力(kPa)',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    axisLabel: {
      color: '#ffffff',
      formatter: '{value}'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    }
  },
  series: [
    {
      name: 'LNG储罐压力',
      type: 'line',
      data: [120, 122, 121, 124, 123, 125, 126, 124, 123, 122, 121, 120],
      smooth: true,
      areaStyle: {
        opacity: 0.3
      },
      markLine: {
        silent: true,
        lineStyle: {
          color: 'var(--chart-color-5)'
        },
        data: [
          {
            yAxis: 140,
            name: '警戒线'
          }
        ]
      }
    }
  ]
});

// LNG储罐出口温度数据 - 柱状图
const outletTempOption = ref({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: ['#4ecdc4'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: {c}℃'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    axisLabel: {
      color: '#ffffff',
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    name: '温度(℃)',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    axisLabel: {
      color: '#ffffff',
      formatter: '{value}'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    }
  },
  series: [
    {
      name: 'LNG储罐出口温度',
      type: 'bar',
      data: [-160, -161, -162, -161, -160, -159, -160, -161, -162, -163, -162, -161],
      itemStyle: {
        borderRadius: [2, 2, 0, 0]
      },
      markLine: {
        silent: true,
        lineStyle: {
          color: 'var(--chart-color-5)'
        },
        data: [
          {
            yAxis: -155,
            name: '警戒线'
          }
        ]
      }
    }
  ]
});

// LNG储罐下进液温度数据 - 柱状图
const inletTempOption = ref({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: ['#45b7d1'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: {c}℃'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    axisLabel: {
      color: 'var(--text-secondary)',
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    name: '温度(℃)',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    axisLabel: {
      color: '#ffffff',
      formatter: '{value}'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    }
  },
  series: [
    {
      name: 'LNG进液温度',
      type: 'bar',
      data: [-158, -159, -160, -159, -158, -157, -158, -159, -160, -161, -160, -159],
      itemStyle: {
        borderRadius: [2, 2, 0, 0]
      },
      markLine: {
        silent: true,
        lineStyle: {
          color: 'var(--chart-color-5)'
        },
        data: [
          {
            yAxis: -155,
            name: '警戒线'
          }
        ]
      }
    }
  ]
});



// 模拟数据更新
const updateData = () => {
  // 更新X轴时间
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // 更新饼图数据
  pieOption.value.series[0].data = [
    { value: Math.floor(Math.random() * 30) + 20, name: '平底储罐' },
    { value: Math.floor(Math.random() * 20) + 10, name: '球形储罐' },
    { value: Math.floor(Math.random() * 15) + 5, name: '卧式储罐' },
    { value: Math.floor(Math.random() * 10) + 5, name: '地下储罐' }
  ];

  // 更新液位数据
  const newLiquidLevel = Math.floor(Math.random() * 30) + 60; // 60-90之间的随机数
  liquidLevelOption.value.series[0].data.shift();
  liquidLevelOption.value.series[0].data.push(newLiquidLevel);
  liquidLevelOption.value.xAxis.data.shift();
  liquidLevelOption.value.xAxis.data.push(timeStr);
  
  // 更新压力数据
  const newPressure = (Math.random() * 0.05 + 0.1).toFixed(2); // 0.1-0.15之间的随机数
  
  // 更新压力图表数据
  pressureOption.value.series[0].data.shift();
  pressureOption.value.series[0].data.push(parseFloat(newPressure) * 1000); // 转换为kPa
  pressureOption.value.xAxis.data.shift();
  pressureOption.value.xAxis.data.push(timeStr);
  
  // 更新出口温度数据
  const newOutletTemp = (-162 - Math.random() * 3).toFixed(1); // -162到-165之间的随机数
  outletTempOption.value.series[0].data.shift();
  outletTempOption.value.series[0].data.push(parseFloat(newOutletTemp));
  outletTempOption.value.xAxis.data.shift();
  outletTempOption.value.xAxis.data.push(timeStr);
  
  // 更新进液温度数据
  const newInletTemp = (-160 - Math.random() * 5).toFixed(1); // -160到-165之间的随机数
  inletTempOption.value.series[0].data.shift();
  inletTempOption.value.series[0].data.push(parseFloat(newInletTemp));
  inletTempOption.value.xAxis.data.shift();
  inletTempOption.value.xAxis.data.push(timeStr);
  
  // 更新状态面板数据
  const statusItems = document.querySelectorAll('.tank-status .status-item');
  if (statusItems.length >= 7) {
    // 更新液位
    statusItems[3].querySelector('.status-value').textContent = `${newLiquidLevel}%`;
    // 更新温度
    statusItems[4].querySelector('.status-value').textContent = `${newOutletTemp} °C`;
    // 更新压力
    statusItems[5].querySelector('.status-value').textContent = `${newPressure} MPa`;
  }
};

onMounted(() => {
  // 初始化数据
  updateData();
  
  // 每隔5分钟更新一次数据
  setInterval(updateData, 5 * 60 * 1000);
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <span class="gradient-text">LNG储罐设备信息看板</span>
      <div class="nav-buttons">
        <router-link to="/" class="nav-button">总览</router-link>
        <router-link to="/lng-tank" class="nav-button active">LNG储罐设备信息</router-link>
        <router-link to="/vaporizer" class="nav-button">强制汽化器设备信息</router-link>
        <router-link to="/real-time" class="nav-button">设备实时信息</router-link>
        <router-link to="/history" class="nav-button">设备历史数据分析</router-link>
      </div>
    </div>
    
    <div class="dashboard-layout">
      <!-- 3D模型背景 -->
      <div class="model-background">
        <LngTank3DModel />
      </div>
      
      <!-- 浮动看板 -->
      <div class="floating-panels">
        <!-- 左上角 - 液位监控 -->
        <div class="floating-panel top-left">
          <div class="panel-header">
            <h3>液位监控</h3>
            <span class="panel-unit">(%)</span>
          </div>
          <div class="chart-container">
            <v-chart class="chart" :option="liquidLevelOption" autoresize />
          </div>
        </div>
        
        <!-- 左下角 - 压力监控 -->
        <div class="floating-panel bottom-left">
          <div class="panel-header">
            <h3>压力监控</h3>
            <span class="panel-unit">(kPa)</span>
          </div>
          <div class="chart-container">
            <v-chart class="chart" :option="pressureOption" autoresize />
          </div>
        </div>
        
        <!-- 右上角 - 出口温度监控 -->
        <div class="floating-panel top-right">
          <div class="panel-header">
            <h3>出口温度</h3>
            <span class="panel-unit">(℃)</span>
          </div>
          <div class="chart-container">
            <v-chart class="chart" :option="outletTempOption" autoresize />
          </div>
        </div>
        
        <!-- 右下角 - 进液温度监控 -->
        <div class="floating-panel bottom-right">
          <div class="panel-header">
            <h3>进液温度</h3>
            <span class="panel-unit">(℃)</span>
          </div>
          <div class="chart-container">
            <v-chart class="chart" :option="inletTempOption" autoresize />
          </div>
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

/* 嵌套布局 */
.dashboard-layout {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
}

/* 3D模型背景 */
.model-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 浮动看板容器 */
.floating-panels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

/* 浮动面板样式 */
.floating-panel {
  position: absolute;
  width: 430px;
  height: 280px;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  transition: all 0.3s ease;
}

.floating-panel:hover {
  background: rgba(30, 30, 30, 0.95);
  transform: scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* 面板位置 */
.top-left {
  top: 20px;
  left: 20px;
}

.top-right {
  top: 20px;
  right: 20px;
}

.bottom-left {
  bottom: 20px;
  left: 20px;
}

.bottom-right {
  bottom: 20px;
  right: 20px;
}

/* 面板头部 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.panel-unit {
  font-size: 0.9rem;
  color: var(--text-secondary);
  opacity: 0.8;
}

/* 图表容器调整 */
.floating-panel .chart-container {
  height: 220px;
  width: 100%;
}





/* 响应式设计 */
/* 高分辨率显示屏优化 */
@media (min-width: 1920px) {
  .floating-panel {
    width: 520px;
    height: 340px;
  }
  
  .floating-panel .chart-container {
    height: 280px;
  }
  
  .floating-panel .panel-header {
    font-size: 1.1rem;
  }
  
  .floating-panel .panel-unit {
    font-size: 0.95rem;
  }
}

@media (min-width: 2560px) {
  .floating-panel {
    width: 620px;
    height: 400px;
  }
  
  .floating-panel .chart-container {
    height: 340px;
  }
  
  .floating-panel .panel-header {
    font-size: 1.2rem;
  }
  
  .floating-panel .panel-unit {
    font-size: 1rem;
  }
}

@media (max-width: 1200px) {
  .floating-panel {
    width: 350px;
    height: 250px;
  }
  
  .floating-panel .chart-container {
    height: 180px;
  }
}

@media (max-width: 768px) {
  .floating-panel {
    width: 280px;
    height: 220px;
  }
  
  .floating-panel .chart-container {
    height: 150px;
  }
  
  .top-left, .top-right {
    top: 10px;
  }
  
  .bottom-left, .bottom-right {
    bottom: 10px;
  }
  
  .top-left, .bottom-left {
    left: 10px;
  }
  
  .top-right, .bottom-right {
    right: 10px;
  }
}
</style>