<script setup>
import { ref, onMounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, GaugeChart } from 'echarts/charts';
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
  LineChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
]);

// 当前时间
const currentTime = ref('');

// 实时温度监控数据
const temperatureOption = ref({
  color: ['var(--chart-color-1)', 'var(--chart-color-2)', 'var(--chart-color-3)'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: 'var(--secondary-bg)'
      }
    }
  },
  legend: {
    data: ['LNG储罐', '汽化器入口', '汽化器出口'],
    textStyle: {
      color: 'var(--text-secondary)'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    axisLabel: {
      color: 'var(--text-secondary)'
    }
  },
  yAxis: {
    type: 'value',
    name: '温度(°C)',
    nameTextStyle: {
      color: 'var(--text-secondary)'
    },
    axisLabel: {
      color: 'var(--text-secondary)',
      formatter: '{value}'
    },
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
    {
      start: 0,
      end: 100
    }
  ],
  series: [
    {
      name: 'LNG储罐',
      type: 'line',
      data: [],
      smooth: true
    },
    {
      name: '汽化器入口',
      type: 'line',
      data: [],
      smooth: true
    },
    {
      name: '汽化器出口',
      type: 'line',
      data: [],
      smooth: true
    }
  ]
});

// 实时压力监控数据
const pressureOption = ref({
  color: ['var(--chart-color-4)', 'var(--chart-color-5)'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: 'var(--secondary-bg)'
      }
    }
  },
  legend: {
    data: ['LNG储罐', '管网压力'],
    textStyle: {
      color: 'var(--text-secondary)'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    axisLabel: {
      color: 'var(--text-secondary)'
    }
  },
  yAxis: {
    type: 'value',
    name: '压力(MPa)',
    nameTextStyle: {
      color: 'var(--text-secondary)'
    },
    axisLabel: {
      color: 'var(--text-secondary)',
      formatter: '{value}'
    },
    axisLine: {
      lineStyle: {
        color: 'var(--text-secondary)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'var(--border-color)'
      }
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
    {
      start: 0,
      end: 100
    }
  ],
  series: [
    {
      name: 'LNG储罐',
      type: 'line',
      data: [],
      smooth: true
    },
    {
      name: '管网压力',
      type: 'line',
      data: [],
      smooth: true
    }
  ]
});

// 仪表盘数据 - 流量监控
const flowOption = ref({
  series: [
    {
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 10000,
      splitNumber: 5,
      itemStyle: {
        color: 'var(--chart-color-1)'
      },
      progress: {
        show: true,
        width: 30
      },
      pointer: {
        show: true,
        length: '60%',
        width: 8
      },
      axisLine: {
        lineStyle: {
          width: 30,
          color: [
            [0.3, 'var(--chart-color-1)'],
            [0.7, 'var(--chart-color-2)'],
            [1, 'var(--chart-color-5)']
          ]
        }
      },
      axisTick: {
        distance: -45,
        splitNumber: 5,
        lineStyle: {
          width: 2,
          color: 'var(--text-secondary)'
        }
      },
      splitLine: {
        distance: -52,
        length: 14,
        lineStyle: {
          width: 3,
          color: 'var(--text-secondary)'
        }
      },
      axisLabel: {
        distance: -20,
        color: 'var(--text-secondary)',
        fontSize: 12
      },
      anchor: {
        show: true,
        showAbove: true,
        size: 25,
        itemStyle: {
          borderWidth: 10
        }
      },
      title: {
        show: true,
        fontSize: 14,
        color: 'var(--text-primary)',
        offsetCenter: [0, '70%']
      },
      detail: {
        valueAnimation: true,
        fontSize: 30,
        color: 'var(--text-primary)',
        offsetCenter: [0, '40%'],
        formatter: '{value}'
      },
      data: [
        {
          value: 5678,
          name: '当前流量'
        }
      ]
    }
  ]
});

// 初始化时间数据
const initTimeData = () => {
  const now = new Date();
  const times = [];
  const tempData1 = [];
  const tempData2 = [];
  const tempData3 = [];
  const pressData1 = [];
  const pressData2 = [];
  
  for (let i = 60; i >= 0; i--) {
    const time = new Date(now - i * 1000);
    times.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    
    // 模拟温度数据
    tempData1.push(Math.round(-162 + Math.random() * 2));
    tempData2.push(Math.round(-160 + Math.random() * 5));
    tempData3.push(Math.round(10 + Math.random() * 10));
    
    // 模拟压力数据
    pressData1.push((0.1 + Math.random() * 0.05).toFixed(3));
    pressData2.push((0.3 + Math.random() * 0.1).toFixed(3));
  }
  
  temperatureOption.value.xAxis.data = times;
  temperatureOption.value.series[0].data = tempData1;
  temperatureOption.value.series[1].data = tempData2;
  temperatureOption.value.series[2].data = tempData3;
  
  pressureOption.value.xAxis.data = times;
  pressureOption.value.series[0].data = pressData1;
  pressureOption.value.series[1].data = pressData2;
};

// 设备列表数据
const equipmentList = ref([
  {
    id: 1,
    name: '试验深冷式再液化装置',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '进口压力', value: 0.25, unit: 'MPa', key: 'inletPressure' },
      { label: '进口温度', value: -162.5, unit: '℃', key: 'inletTemp' },
      { label: '出口压力', value: 0.28, unit: 'MPa', key: 'outletPressure' },
      { label: '出口温度', value: -165.8, unit: '℃', key: 'outletTemp' },
      { label: '处理流量', value: 1250, unit: 'm³/h', key: 'processFlow' }
    ]
  },
  {
    id: 2,
    name: '深冷LNG加热器',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '丙烷压力', value: 0.15, unit: 'MPa', key: 'propanePressure' },
      { label: '丙烷温度', value: 25.8, unit: '℃', key: 'propaneTemp' },
      { label: '进气压力', value: 0.12, unit: 'MPa', key: 'inletPressure' },
      { label: '进气温度', value: -158.3, unit: '℃', key: 'inletTemp' },
      { label: 'LNG出口温度', value: -145.2, unit: '℃', key: 'lngOutletTemp' }
    ]
  },
  {
    id: 3,
    name: '#1 LNG储罐',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '液位', value: 85.2, unit: '%', key: 'liquidLevel' },
      { label: '压力', value: 0.08, unit: 'MPa', key: 'tankPressure' },
      { label: 'LNG出口温度', value: -161.8, unit: '℃', key: 'lngOutletTemp' }
    ]
  },
  {
    id: 4,
    name: '#2 LNG储罐',
    status: 'standby',
    statusText: '备用状态',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '液位', value: 25.8, unit: '%', key: 'liquidLevel' },
      { label: '储罐压力', value: 0.09, unit: 'MPa', key: 'tankPressure' },
      { label: '储罐温度', value: -160.2, unit: '℃', key: 'tankTemp' },
      { label: '进液流量', value: 0, unit: 'm³/h', key: 'inletFlow' }
    ]
  },
  {
    id: 5,
    name: '#1 LNG输送泵',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '电流', value: 45.2, unit: 'A', key: 'current' },
      { label: '液位', value: 78.5, unit: '%', key: 'level' },
      { label: '转速', value: 2850, unit: 'rpm', key: 'speed' },
      { label: '压力', value: 0.22, unit: 'MPa', key: 'pressure' },
      { label: '出口压力', value: 0.25, unit: 'MPa', key: 'outletPressure' },
      { label: '进口压力', value: 0.08, unit: 'MPa', key: 'inletPressure' }
    ]
  },
  {
    id: 6,
    name: '#2 LNG输送泵',
    status: 'standby',
    statusText: '备用状态',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '泵入口压力', value: 0.00, unit: 'MPa', key: 'inletPressure' },
      { label: '泵出口压力', value: 0.00, unit: 'MPa', key: 'outletPressure' },
      { label: '泵体温度', value: -20.5, unit: '℃', key: 'pumpTemp' },
      { label: '输送流量', value: 0, unit: 'm³/h', key: 'flow' },
      { label: '转速', value: 0, unit: 'rpm', key: 'speed' }
    ]
  },
  {
    id: 7,
    name: '蒸发气再液化装置',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '进口温度', value: -165.2, unit: '℃', key: 'inletTemp' },
      { label: '出口温度', value: -168.5, unit: '℃', key: 'outletTemp' },
      { label: '气液分离器液相出口压力', value: 0.22, unit: 'MPa', key: 'separatorLiquidPressure' },
      { label: '气液分离器气相出口温度', value: -155.8, unit: '℃', key: 'separatorGasTemp' }
    ]
  },
  {
    id: 8,
    name: '1号LNG燃气泵',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '液位', value: 82.3, unit: '%', key: 'level' },
      { label: '压力', value: 0.32, unit: 'MPa', key: 'pressure' },
      { label: '温度', value: -152.8, unit: '℃', key: 'temperature' },
      { label: '电流', value: 38.5, unit: 'A', key: 'current' },
      { label: '转速', value: 2950, unit: 'rpm', key: 'speed' },
      { label: '调节阀阀位', value: 65.2, unit: '%', key: 'valvePosition' }
    ]
  },
  {
    id: 9,
    name: 'LNG空温气化器',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '出口温度', value: 15.2, unit: '℃', key: 'outletTemp' }
    ]
  },
  {
    id: 10,
    name: '高压常温天然气储罐',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '压力', value: 2.5, unit: 'MPa', key: 'pressure' },
      { label: '温度', value: 25.8, unit: '℃', key: 'temperature' },
      { label: '出口温度', value: 22.3, unit: '℃', key: 'outletTemp' }
    ]
  },
  {
    id: 11,
    name: '天然气循环冷却器',
    status: 'standby',
    statusText: '备用状态',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '出口压力', value: 1.8, unit: 'MPa', key: 'outletPressure' }
    ]
  },
  {
    id: 12,
    name: '低温天然气罐',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '温度调节阀阀位', value: 45.8, unit: '%', key: 'tempValvePosition' },
      { label: '压力', value: 0.85, unit: 'MPa', key: 'pressure' }
    ]
  },
  {
    id: 13,
    name: '固定低负荷压缩机',
    status: 'standby',
    statusText: '备用状态',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '出口温度', value: 85.2, unit: '℃', key: 'outletTemp' },
      { label: '调节阀阀位', value: 62.5, unit: '%', key: 'valvePosition' },
      { label: '出口压力调节阀阀位', value: 58.3, unit: '%', key: 'outletPressureValvePosition' },
      { label: '模块调节阀阀位', value: 72.1, unit: '%', key: 'moduleValvePosition' }
    ]
  },
  {
    id: 14,
    name: '液氮水浴复热器',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '出口物料压力', value: 1.2, unit: 'MPa', key: 'outletMaterialPressure' }
    ]
  },
  {
    id: 15,
    name: '天然气缓冲罐',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '压力', value: 1.5, unit: 'MPa', key: 'pressure' },
      { label: '温度', value: 28.5, unit: '℃', key: 'temperature' }
    ]
  },
  {
    id: 16,
    name: '强制汽化器',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '进口压力', value: 0.38, unit: 'MPa', key: 'inletPressure' },
      { label: '进口温度', value: -158.5, unit: '℃', key: 'inletTemp' },
      { label: '阀位', value: 68.2, unit: '%', key: 'valvePosition' },
      { label: '温度调节阀阀位', value: 72.5, unit: '%', key: 'tempValvePosition' },
      { label: '出口流量', value: 1680, unit: 'm³/h', key: 'outletFlow' },
      { label: '出口压力', value: 0.42, unit: 'MPa', key: 'outletPressure' }
    ]
  },
  {
    id: 17,
    name: '雾化分离器',
    status: 'standby',
    statusText: '备用状态',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '液位', value: 65.8, unit: '%', key: 'level' }
    ]
  },
  {
    id: 18,
    name: '气液分离器',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '出口温度', value: -145.2, unit: '℃', key: 'outletTemp' }
    ]
  },
  {
    id: 19,
    name: 'BOG加热器',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '进口压力', value: 0.28, unit: 'MPa', key: 'inletPressure' },
      { label: '进口温度', value: -152.8, unit: '℃', key: 'inletTemp' },
      { label: '阀位', value: 55.3, unit: '%', key: 'valvePosition' },
      { label: '出口压力', value: 0.32, unit: 'MPa', key: 'outletPressure' },
      { label: '出口温度', value: 45.2, unit: '℃', key: 'outletTemp' },
      { label: '冷凝水温度', value: 35.8, unit: '℃', key: 'condensateTemp' }
    ]
  },
  {
    id: 20,
    name: '配套低负荷加热器',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '出口流量1调节', value: 850, unit: 'm³/h', key: 'outletFlow1Control' },
      { label: '出口压力调节阀阀位', value: 62.8, unit: '%', key: 'outletPressureValvePosition' },
      { label: '出口压力调节', value: 1.25, unit: 'MPa', key: 'outletPressureControl' }
    ]
  },
  {
    id: 21,
    name: '主机',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '调节（流量1）', value: 1250, unit: 'm³/h', key: 'flow1Control' },
      { label: '调节（流量2）', value: 980, unit: 'm³/h', key: 'flow2Control' },
      { label: '调节阀位（流量1）', value: 68.5, unit: '%', key: 'flow1ValvePosition' },
      { label: '调节阀位（流量2）', value: 55.2, unit: '%', key: 'flow2ValvePosition' },
      { label: '出口压力', value: 2.8, unit: 'MPa', key: 'outletPressure' }
    ]
  },
  {
    id: 22,
    name: '高压常温天然气罐',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '压力', value: 15.2, unit: 'MPa', key: 'pressure' },
      { label: '温度', value: 25.0, unit: '℃', key: 'temperature' },
      { label: '至火炬调节阀阀位', value: 15.8, unit: '%', key: 'flareValvePosition' }
    ]
  },
  {
    id: 23,
    name: '低温氮气储罐',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '液位', value: 78.5, unit: '%', key: 'level' },
      { label: '压力', value: 0.65, unit: 'MPa', key: 'pressure' }
    ]
  },
  {
    id: 24,
    name: '液氮储罐',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '压力', value: 0.85, unit: 'MPa', key: 'pressure' }
    ]
  },
  {
    id: 25,
    name: '液氮泵',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '温度', value: -195.8, unit: '℃', key: 'temperature' }
    ]
  },
  {
    id: 26,
    name: '低温天然气罐',
    status: 'running',
    statusText: '正常运行',
    lastUpdate: '2024-01-15 14:30:25',
    parameters: [
      { label: '压力', value: 0.95, unit: 'MPa', key: 'pressure' },
      { label: '下部温度', value: -158.5, unit: '℃', key: 'bottomTemp' },
      { label: '上部温度', value: -155.2, unit: '℃', key: 'topTemp' }
    ]
  }
]);

// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString('zh-CN');
};

// 定义哪些设备没有数据返回（模拟停用状态）
const inactiveEquipmentIds = [11, 13, 17, 22, 25]; // 这些设备ID对应的设备将没有数据更新

// 更新实时数据
const updateRealTimeData = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  // 更新设备数据
  equipmentList.value.forEach(equipment => {
    // 检查设备是否有数据返回
    const hasDataReturn = !inactiveEquipmentIds.includes(equipment.id);
    
    if (hasDataReturn) {
      // 有数据返回的设备设为运行状态
      equipment.status = 'running';
      equipment.statusText = '正常运行';
      equipment.lastUpdate = now.toLocaleString('zh-CN');
      
      // 模拟数据变化
      equipment.parameters.forEach(param => {
        // 根据参数类型模拟不同的变化幅度
         let changeRange = 0;
         if (param.unit === '℃') {
           changeRange = 2; // 温度变化范围
         } else if (param.unit === 'MPa') {
           changeRange = 0.02; // 压力变化范围
         } else if (param.unit === 'm³/h') {
           changeRange = 50; // 流量变化范围
         } else if (param.unit === '%') {
           changeRange = 1; // 百分比变化范围
         } else if (param.unit === 'rpm') {
           changeRange = 100; // 转速变化范围
         } else if (param.unit === 'A') {
           changeRange = 2; // 电流变化范围
         } else if (param.unit === '%/day') {
           changeRange = 0.01; // 蒸发率变化范围
         } else {
           changeRange = 0.1; // 默认变化范围
         }
        
        // 应用随机变化
        param.value += (Math.random() - 0.5) * changeRange;
        
        // 确保数值在合理范围内
        if (param.unit === '%') {
          param.value = Math.max(0, Math.min(100, param.value));
        } else if (param.unit === 'MPa') {
          param.value = Math.max(0, param.value);
        }
        
        // 保留适当的小数位数
        if (param.unit === 'MPa') {
          param.value = parseFloat(param.value.toFixed(3));
        } else if (param.unit === '%') {
          param.value = parseFloat(param.value.toFixed(1));
        } else {
          param.value = parseFloat(param.value.toFixed(1));
        }
      });
    } else {
      // 没有数据返回的设备设为备用状态，数据不更新
      equipment.status = 'standby';
      equipment.statusText = '备用状态';
      // lastUpdate 保持不变，表示最后一次有数据的时间
    }
  });
  
  // 更新当前时间
  updateCurrentTime();
};



onMounted(() => {
  // 初始化时间数据
  initTimeData();
  
  // 初始化当前时间
  updateCurrentTime();
  
  // 每秒更新一次数据
  setInterval(updateRealTimeData, 1000);
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <span class="gradient-text">设备实时信息看板</span>
      <div class="nav-buttons">
        <router-link to="/" class="nav-button">总览</router-link>
        <router-link to="/lng-tank" class="nav-button">LNG储罐设备信息</router-link>
        <router-link to="/vaporizer" class="nav-button">强制汽化器设备信息</router-link>
        <router-link to="/real-time" class="nav-button active">设备实时信息</router-link>
        <router-link to="/history" class="nav-button">设备历史数据分析</router-link>
      </div>
    </div>
    
    <div class="content-container">
      <div class="unified-time">
        <span class="time-label">系统时间:</span>
        <span class="time-value">{{ currentTime }}</span>
      </div>
      
      <div class="equipment-grid">
      <!-- 设备卡片列表 -->
      <div class="equipment-card" v-for="equipment in equipmentList" :key="equipment.id">
        <div class="card-header">
          <div class="equipment-icon" :class="equipment.status"></div>
          <div class="equipment-title">{{ equipment.name }}</div>
        </div>
        <div class="card-content">
          <div class="equipment-info">
            <!-- 动态渲染设备参数 -->
            <div class="info-item" v-for="param in equipment.parameters" :key="param.key">
              <span class="info-label">{{ param.label }}:</span>
              <span class="info-value">{{ param.value }}{{ param.unit }}</span>
            </div>
          </div>
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

.content-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
}

.unified-time {
  align-self: flex-end;
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.time-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-right: 8px;
}

.time-value {
  color: var(--accent-color);
  font-weight: bold;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
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

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 10px;
  padding: 10px 0;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
}

.equipment-card {
  background: var(--secondary-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.equipment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border-color: var(--primary-color);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

.equipment-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}

.equipment-icon.running {
  background-color: #00d4ff;
  box-shadow: 0 0 12px #00d4ff;
}

.equipment-icon.running::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #00d4ff;
  animation: pulse 1.5s infinite;
}

.equipment-icon.standby {
  background-color: #888888;
  box-shadow: 0 0 8px #888888;
}

.equipment-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--text-primary);
  flex: 1;
}

.card-content {
  flex: 1;
}

.equipment-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.info-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.info-value {
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 600;
}

.info-value.running {
  color: #00d4ff;
}

.info-value.standby {
  color: #888888;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(2);
  }
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, var(--accent-color), #00d4ff);
  border-radius: 4px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #ff6b6b, var(--accent-color));
  transform: scale(1.1);
}

::-webkit-scrollbar-corner {
  background: rgba(255, 255, 255, 0.1);
}

/* Firefox 滚动条样式 */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--accent-color) rgba(255, 255, 255, 0.1);
}
</style>