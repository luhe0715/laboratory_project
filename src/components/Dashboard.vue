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

// 实验室基本信息
const labInfo = ref({
  area: '500',
  personnel: '12',
  equipmentCount: '26',
  operatingTime: '24',
  temperature: '-160',
  safetyLevel: 'A级'
});

// 设备列表数据（模拟从实时监控页面获取）
const equipmentList = ref([
  { id: 1, name: '试验深冷式再液化装置', status: 'running', type: '再液化装置' },
  { id: 2, name: '深冷LNG加热器', status: 'running', type: '加热器' },
  { id: 3, name: '#1 LNG储罐', status: 'running', type: '储罐' },
  { id: 4, name: '#2 LNG储罐', status: 'standby', type: '储罐' },
  { id: 5, name: '#1 LNG输送泵', status: 'running', type: '输送泵' },
  { id: 6, name: '#2 LNG输送泵', status: 'standby', type: '输送泵' },
  { id: 7, name: '蒸发气再液化装置', status: 'running', type: '再液化装置' },
  { id: 8, name: '1号LNG燃气泵', status: 'running', type: '燃气泵' },
  { id: 9, name: 'LNG空温气化器', status: 'running', type: '气化器' },
  { id: 10, name: '高压常温天然气储罐', status: 'running', type: '储罐' },
  { id: 11, name: '天然气循环冷却器', status: 'running', type: '冷却器' },
  { id: 12, name: '低温天然气罐', status: 'standby', type: '储罐' },
  { id: 13, name: '固定低负荷压缩机', status: 'running', type: '压缩机' },
  { id: 14, name: '液氮水浴复热器', status: 'running', type: '复热器' },
  { id: 15, name: '天然气缓冲罐', status: 'running', type: '缓冲罐' },
  { id: 16, name: '强制汽化器', status: 'running', type: '气化器' },
  { id: 17, name: '液氮储罐', status: 'running', type: '储罐' },
  { id: 18, name: '液氮泵', status: 'running', type: '泵' },
  { id: 19, name: '冷凝水分离器', status: 'running', type: '分离器' },
  { id: 20, name: '气液分离器', status: 'running', type: '分离器' },
  { id: 21, name: '低温分馏塔', status: 'running', type: '分馏塔' },
  { id: 22, name: '高温分馏塔', status: 'running', type: '分馏塔' },
  { id: 23, name: '液氮循环泵', status: 'running', type: '泵' },
  { id: 24, name: '液氮回收装置', status: 'running', type: '回收装置' },
  { id: 25, name: '液氮泵', status: 'standby', type: '泵' },
  { id: 26, name: '低温天然气罐', status: 'running', type: '储罐' }
]);

// 告警数据（模拟）
const alarmData = ref([
  { date: '01-10', count: 3 },
  { date: '01-11', count: 5 },
  { date: '01-12', count: 2 },
  { date: '01-13', count: 8 },
  { date: '01-14', count: 4 },
  { date: '01-15', count: 6 },
  { date: '01-16', count: 1 }
]);

// 计算设备工作状态统计
const workStatusStats = computed(() => {
  const stats = { running: 0, standby: 0, maintenance: 0 };
  equipmentList.value.forEach(equipment => {
    if (equipment.status === 'running') {
      stats.running++;
    } else if (equipment.status === 'standby') {
      stats.standby++;
    } else {
      stats.maintenance++;
    }
  });
  return stats;
});

// 设备工作状态饼图配置
const workStatusOption = computed(() => ({
  title: {
    text: '设备工作状态',
    left: 'center',
    top: '10%',
    textStyle: {
      color: 'var(--text-primary)',
      fontSize: 16
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
      color: 'var(--text-secondary)'
    }
  },
  series: [
    {
      name: '设备状态',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: 'var(--panel-bg)',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}台'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      data: [
        { 
          value: workStatusStats.value.running, 
          name: '运行中',
          itemStyle: { color: '#67C23A' }
        },
        { 
          value: workStatusStats.value.standby, 
          name: '待机',
          itemStyle: { color: '#E6A23C' }
        },
        { 
          value: workStatusStats.value.maintenance, 
          name: '维护中',
          itemStyle: { color: '#F56C6C' }
        }
      ]
    }
  ]
}));

// 设备类型统计数据
const equipmentTypeStats = computed(() => {
  const typeCount = {};
  equipmentList.value.forEach(equipment => {
    typeCount[equipment.type] = (typeCount[equipment.type] || 0) + 1;
  });
  return typeCount;
});

// 设备类型统计柱状图配置
const equipmentTypeOption = computed(() => ({
  color: ['#00D4FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
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
  xAxis: {
    type: 'category',
    data: Object.keys(equipmentTypeStats.value),
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
      rotate: 45
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
      color: '#ffffff'
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
    data: Object.values(equipmentTypeStats.value),
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

// 柱状图数据
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
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {
          color: 'var(--border-color)'
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
          color: 'var(--border-color)'
        }
      },
      axisLabel: {
        color: 'var(--text-secondary)'
      },
      splitLine: {
        lineStyle: {
          color: 'var(--border-color)',
          opacity: 0.3
        }
      }
    }
  ],
  series: [
    {
      name: '直接访问',
      type: 'bar',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220]
    }
  ]
});

// 设备告警统计折线图配置
const alarmStatsOption = ref({
  color: ['#FF6B6B', '#00D4FF'],
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['温度告警', '压力告警'],
    textStyle: {
      color: '#ffffff'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    axisLine: {
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff'
    }
  },
  yAxis: {
    type: 'value',
    name: '告警次数',
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLine: {
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff'
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
      name: '温度告警',
      type: 'line',
      smooth: true,
      data: [2, 1, 3, 5, 2, 4, 1],
      lineStyle: {
        width: 4,
        color: '#FF6B6B'
      },
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: '#FF6B6B',
        borderColor: '#ffffff',
        borderWidth: 2
      }
    },
    {
      name: '压力告警',
      type: 'line',
      smooth: true,
      data: [1, 2, 1, 3, 4, 2, 3],
      lineStyle: {
        width: 4,
        color: '#00D4FF'
      },
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: '#00D4FF',
        borderColor: '#ffffff',
        borderWidth: 2
      }
    }
  ]
});

// 仪表盘数据
const gaugeOption = ref({
  series: [{
    type: 'gauge',
    startAngle: 180,
    endAngle: 0,
    center: ['50%', '75%'],
    radius: '90%',
    min: 0,
    max: 100,
    splitNumber: 10,
    axisLine: {
      lineStyle: {
        width: 6,
        color: [
          [0.3, 'var(--chart-color-4)'],
          [0.7, 'var(--chart-color-3)'],
          [1, 'var(--chart-color-2)']
        ]
      }
    },
    pointer: {
      icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
      length: '12%',
      width: 20,
      offsetCenter: [0, '-60%'],
      itemStyle: {
        color: 'auto'
      }
    },
    axisTick: {
      length: 12,
      lineStyle: {
        color: 'auto',
        width: 2
      }
    },
    splitLine: {
      length: 20,
      lineStyle: {
        color: 'auto',
        width: 5
      }
    },
    axisLabel: {
      color: 'var(--text-secondary)',
      fontSize: 12,
      distance: -60,
      formatter: function(value) {
        if (value === 0 || value === 100) {
          return '';
        }
        return value;
      }
    },
    title: {
      offsetCenter: [0, '-20%'],
      fontSize: 14,
      color: 'var(--text-primary)'
    },
    detail: {
      fontSize: 30,
      offsetCenter: [0, '0%'],
      valueAnimation: true,
      formatter: function(value) {
        return Math.round(value) + '%';
      },
      color: 'var(--text-primary)'
    },
    data: [{
      value: 68,
      name: '完成率'
    }]
  }]
});

// 模拟数据更新
const updateData = () => {
  // 更新饼图数据
  pieOption.value.series[0].data = pieOption.value.series[0].data.map(item => {
    return {
      ...item,
      value: Math.floor(Math.random() * 1000 + 100)
    };
  });

  // 更新柱状图数据
  barOption.value.series[0].data = barOption.value.series[0].data.map(() => {
    return Math.floor(Math.random() * 400 + 50);
  });

  // 更新折线图数据
  lineOption.value.series.forEach((series, index) => {
    lineOption.value.series[index].data = lineOption.value.series[index].data.map(() => {
      return Math.floor(Math.random() * 300 + 100);
    });
  });

  // 更新仪表盘数据
  gaugeOption.value.series[0].data[0].value = Math.floor(Math.random() * 100);
};

onMounted(() => {
  // 初始化后每隔5秒更新一次数据
  setInterval(updateData, 5000);
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <span class="gradient-text">物联网平台总览</span>
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
      <!-- 左侧面板 - 设备信息 -->
      <div class="dashboard-column left-column">
        <!-- 实验室基本信息面板 -->
        <div class="dashboard-panel lab-info-panel">
          <div class="panel-title">实验室基本信息</div>
          <div class="lab-info-content">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">占地面积</div>
                <div class="info-value">{{ labInfo.area }}m²</div>
              </div>
              <div class="info-item">
                <div class="info-label">人员配置</div>
                <div class="info-value">{{ labInfo.personnel }}人</div>
              </div>
              <div class="info-item">
                <div class="info-label">设备数量</div>
                <div class="info-value">{{ labInfo.equipmentCount }}台</div>
              </div>
              <div class="info-item">
                <div class="info-label">运行时间</div>
                <div class="info-value">{{ labInfo.operatingTime }}小时</div>
              </div>
              <div class="info-item">
                <div class="info-label">环境温度</div>
                <div class="info-value">{{ labInfo.temperature }}°C</div>
              </div>
              <div class="info-item">
                <div class="info-label">安全等级</div>
                <div class="info-value">{{ labInfo.safetyLevel }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 设备工作状态面板 -->
        <div class="dashboard-panel">
          <div class="panel-title">设备工作状态</div>
          <div class="chart-container">
            <v-chart class="chart" :option="workStatusOption" autoresize />
          </div>
        </div>
      </div>
      
      <!-- 中间面板 - 实验室背景 -->
      <div class="dashboard-column center-column">
        <div class="lab-background">
          <img src="../assets/lab-background.svg" alt="低温实验室" />
          <div class="lab-title">低温实验室</div>
        </div>
      </div>
      
      <!-- 右侧面板 - 设备统计和告警 -->
      <div class="dashboard-column right-column">
        <!-- 设备类型统计面板 -->
        <div class="dashboard-panel">
          <div class="panel-title">设备类型统计</div>
          <div class="chart-container">
            <v-chart class="chart" :option="equipmentTypeOption" autoresize />
          </div>
        </div>
        
        <!-- 设备告警统计面板 -->
        <div class="dashboard-panel">
          <div class="panel-title">设备告警统计</div>
          <div class="chart-container">
            <v-chart class="chart" :option="alarmStatsOption" autoresize />
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

.dashboard-layout {
  display: flex;
  width: 100%;
  height: calc(100% - 70px);
  gap: 10px;
  padding: 0 10px 10px 10px;
}

.dashboard-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  background-color: var(--secondary-bg);
  border-radius: 4px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
}

.dashboard-panel {
  flex: 1;
  background-color: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
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
  background: rgba(10, 26, 46, 0.7);
  padding: 5px 15px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-weight: bold;
}

/* 实验室基本信息样式 */
.lab-info-panel {
  flex: 1;
}

.lab-info-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
  padding: 10px;
}

.info-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.info-label {
  color: var(--text-secondary);
  font-size: 12px;
  margin-bottom: 8px;
  font-weight: 500;
}

.info-value {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>