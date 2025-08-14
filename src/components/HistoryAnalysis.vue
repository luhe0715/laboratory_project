<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

// 注册必要的组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent
]);

// 设备列表（基于实时监控页面的设备信息）
const equipmentList = [
  { 
    id: 1, 
    name: '试验深冷式再液化装置', 
    type: 'multi-param',
    parameters: [
      { label: '进口压力', unit: 'MPa', key: 'inletPressure' },
      { label: '进口温度', unit: '℃', key: 'inletTemp' },
      { label: '出口压力', unit: 'MPa', key: 'outletPressure' },
      { label: '出口温度', unit: '℃', key: 'outletTemp' },
      { label: '处理流量', unit: 'm³/h', key: 'processFlow' }
    ]
  },
  { 
    id: 2, 
    name: '深冷LNG加热器', 
    type: 'multi-param',
    parameters: [
      { label: '丙烷压力', unit: 'MPa', key: 'propanePressure' },
      { label: '丙烷温度', unit: '℃', key: 'propaneTemp' },
      { label: '进气压力', unit: 'MPa', key: 'inletPressure' },
      { label: '进气温度', unit: '℃', key: 'inletTemp' },
      { label: 'LNG出口温度', unit: '℃', key: 'lngOutletTemp' }
    ]
  },
  { 
    id: 3, 
    name: '#1 LNG储罐', 
    type: 'lng-tank',
    parameters: [
      { label: '液位', unit: '%', key: 'liquidLevel' },
      { label: '压力', unit: 'MPa', key: 'tankPressure' },
      { label: 'LNG出口温度', unit: '℃', key: 'lngOutletTemp' }
    ]
  },
  { 
    id: 4, 
    name: '#2 LNG储罐', 
    type: 'multi-param',
    parameters: [
      { label: '液位', unit: '%', key: 'liquidLevel' },
      { label: '储罐压力', unit: 'MPa', key: 'tankPressure' },
      { label: '储罐温度', unit: '℃', key: 'tankTemp' },
      { label: '进液流量', unit: 'm³/h', key: 'inletFlow' }
    ]
  },
  { 
    id: 5, 
    name: '#1 LNG输送泵', 
    type: 'multi-param',
    parameters: [
      { label: '电流', unit: 'A', key: 'current' },
      { label: '液位', unit: '%', key: 'level' },
      { label: '转速', unit: 'rpm', key: 'speed' },
      { label: '压力', unit: 'MPa', key: 'pressure' },
      { label: '出口压力', unit: 'MPa', key: 'outletPressure' },
      { label: '进口压力', unit: 'MPa', key: 'inletPressure' }
    ]
  },
  { 
    id: 6, 
    name: '#2 LNG输送泵', 
    type: 'multi-param',
    parameters: [
      { label: '泵入口压力', unit: 'MPa', key: 'inletPressure' },
      { label: '泵出口压力', unit: 'MPa', key: 'outletPressure' },
      { label: '泵体温度', unit: '℃', key: 'pumpTemp' },
      { label: '输送流量', unit: 'm³/h', key: 'flow' },
      { label: '转速', unit: 'rpm', key: 'speed' }
    ]
  },
  { 
    id: 7, 
    name: '蒸发气再液化装置', 
    type: 'multi-param',
    parameters: [
      { label: '进口温度', unit: '℃', key: 'inletTemp' },
      { label: '出口温度', unit: '℃', key: 'outletTemp' },
      { label: '气液分离器液相出口压力', unit: 'MPa', key: 'separatorLiquidPressure' },
      { label: '气液分离器气相出口温度', unit: '℃', key: 'separatorGasTemp' }
    ]
  },
  { 
    id: 8, 
    name: '1号LNG燃气泵', 
    type: 'multi-param',
    parameters: [
      { label: '液位', unit: '%', key: 'level' },
      { label: '压力', unit: 'MPa', key: 'pressure' },
      { label: '温度', unit: '℃', key: 'temperature' },
      { label: '电流', unit: 'A', key: 'current' },
      { label: '转速', unit: 'rpm', key: 'speed' },
      { label: '调节阀阀位', unit: '%', key: 'valvePosition' }
    ]
  },
  { 
    id: 9, 
    name: 'LNG空温气化器', 
    type: 'single-param',
    parameters: [
      { label: '出口温度', unit: '℃', key: 'outletTemp' }
    ]
  },
  { 
    id: 10, 
    name: '高压常温天然气储罐', 
    type: 'multi-param',
    parameters: [
      { label: '压力', unit: 'MPa', key: 'pressure' },
      { label: '温度', unit: '℃', key: 'temperature' },
      { label: '出口温度', unit: '℃', key: 'outletTemp' }
    ]
  },
  { 
    id: 11, 
    name: '天然气循环冷却器', 
    type: 'single-param',
    parameters: [
      { label: '出口压力', unit: 'MPa', key: 'outletPressure' }
    ]
  },
  { 
    id: 12, 
    name: '低温天然气罐', 
    type: 'multi-param',
    parameters: [
      { label: '温度调节阀阀位', unit: '%', key: 'tempValvePosition' },
      { label: '压力', unit: 'MPa', key: 'pressure' }
    ]
  },
  { 
    id: 13, 
    name: '固定低负荷压缩机', 
    type: 'multi-param',
    parameters: [
      { label: '出口温度', unit: '℃', key: 'outletTemp' },
      { label: '调节阀阀位', unit: '%', key: 'valvePosition' },
      { label: '出口压力调节阀阀位', unit: '%', key: 'outletPressureValvePosition' },
      { label: '模块调节阀阀位', unit: '%', key: 'moduleValvePosition' }
    ]
  },
  { 
    id: 14, 
    name: '液氮水浴复热器', 
    type: 'single-param',
    parameters: [
      { label: '出口物料压力', unit: 'MPa', key: 'outletMaterialPressure' }
    ]
  },
  { 
    id: 15, 
    name: '天然气缓冲罐', 
    type: 'multi-param',
    parameters: [
      { label: '压力', unit: 'MPa', key: 'pressure' },
      { label: '温度', unit: '℃', key: 'temperature' }
    ]
  },
  { 
    id: 16, 
    name: '强制汽化器', 
    type: 'multi-param',
    parameters: [
      { label: '进口压力', unit: 'MPa', key: 'inletPressure' },
      { label: '进口温度', unit: '℃', key: 'inletTemp' },
      { label: '阀位', unit: '%', key: 'valvePosition' },
      { label: '温度调节阀阀位', unit: '%', key: 'tempValvePosition' },
      { label: '出口流量', unit: 'm³/h', key: 'outletFlow' },
      { label: '出口压力', unit: 'MPa', key: 'outletPressure' }
    ]
  },
  { 
    id: 17, 
    name: '雾化分离器', 
    type: 'single-param',
    parameters: [
      { label: '液位', unit: '%', key: 'level' }
    ]
  },
  { 
    id: 18, 
    name: '气液分离器', 
    type: 'single-param',
    parameters: [
      { label: '出口温度', unit: '℃', key: 'outletTemp' }
    ]
  },
  { 
    id: 19, 
    name: 'BOG加热器', 
    type: 'multi-param',
    parameters: [
      { label: '进口压力', unit: 'MPa', key: 'inletPressure' },
      { label: '进口温度', unit: '℃', key: 'inletTemp' },
      { label: '阀位', unit: '%', key: 'valvePosition' },
      { label: '出口压力', unit: 'MPa', key: 'outletPressure' },
      { label: '出口温度', unit: '℃', key: 'outletTemp' },
      { label: '冷凝水温度', unit: '℃', key: 'condensateTemp' }
    ]
  },
  { 
    id: 20, 
    name: '配套低负荷加热器', 
    type: 'multi-param',
    parameters: [
      { label: '出口流量1调节', unit: 'm³/h', key: 'outletFlow1Control' },
      { label: '出口压力调节阀阀位', unit: '%', key: 'outletPressureValvePosition' },
      { label: '出口压力调节', unit: 'MPa', key: 'outletPressureControl' }
    ]
  },
  { 
    id: 21, 
    name: '主机', 
    type: 'multi-param',
    parameters: [
      { label: '调节（流量1）', unit: 'm³/h', key: 'flow1Control' },
      { label: '调节（流量2）', unit: 'm³/h', key: 'flow2Control' },
      { label: '调节阀位（流量1）', unit: '%', key: 'flow1ValvePosition' },
      { label: '调节阀位（流量2）', unit: '%', key: 'flow2ValvePosition' },
      { label: '出口压力', unit: 'MPa', key: 'outletPressure' }
    ]
  },
  { 
    id: 22, 
    name: '高压常温天然气罐', 
    type: 'multi-param',
    parameters: [
      { label: '压力', unit: 'MPa', key: 'pressure' },
      { label: '温度', unit: '℃', key: 'temperature' },
      { label: '至火炬调节阀阀位', unit: '%', key: 'flareValvePosition' }
    ]
  },
  { 
    id: 23, 
    name: '低温氮气储罐', 
    type: 'multi-param',
    parameters: [
      { label: '液位', unit: '%', key: 'level' },
      { label: '压力', unit: 'MPa', key: 'pressure' }
    ]
  },
  { 
    id: 24, 
    name: '液氮储罐', 
    type: 'single-param',
    parameters: [
      { label: '压力', unit: 'MPa', key: 'pressure' }
    ]
  },
  { 
    id: 25, 
    name: '液氮泵', 
    type: 'single-param',
    parameters: [
      { label: '温度', unit: '℃', key: 'temperature' }
    ]
  },
  { 
    id: 26, 
    name: '低温天然气罐', 
    type: 'multi-param',
    parameters: [
      { label: '压力', unit: 'MPa', key: 'pressure' },
      { label: '下部温度', unit: '℃', key: 'bottomTemp' },
      { label: '上部温度', unit: '℃', key: 'topTemp' }
    ]
  }
];

// 当前选中的设备，默认选择 #1 LNG储罐
const selectedEquipment = ref(equipmentList.find(e => e.id === 3));

// 当前设备的所有参数（响应式）
const selectedParameters = ref([]);

// 当设备改变时，重置参数选择
watch(selectedEquipment, (newEquipment) => {
  if (newEquipment && newEquipment.parameters) {
    // 自动选择所有参数
    selectedParameters.value = newEquipment.parameters.map(p => p.key);
  } else {
    selectedParameters.value = [];
  }
}, { immediate: true });

// 时间范围选择
const dateRange = ref([]);

// 时间粒度选择
const timeGranularity = ref('day');
const timeGranularityOptions = [
  { value: 'year', label: '按年' },
  { value: 'month', label: '按月' },
  { value: 'day', label: '按日' }
];

// 快捷选项
const shortcuts = computed(() => {
  const now = new Date();
  
  if (timeGranularity.value === 'year') {
    return [
      {
        text: '最近3年',
        value: () => {
          const end = now.getFullYear().toString();
          const start = (now.getFullYear() - 2).toString();
          return [start, end];
        },
      },
      {
        text: '最近5年',
        value: () => {
          const end = now.getFullYear().toString();
          const start = (now.getFullYear() - 4).toString();
          return [start, end];
        },
      },
      {
        text: '最近10年',
        value: () => {
          const end = now.getFullYear().toString();
          const start = (now.getFullYear() - 9).toString();
          return [start, end];
        },
      },
    ];
  } else if (timeGranularity.value === 'month') {
    return [
      {
        text: '最近3个月',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setMonth(start.getMonth() - 2);
          return [start.toISOString().slice(0, 7), end.toISOString().slice(0, 7)];
        },
      },
      {
        text: '最近6个月',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setMonth(start.getMonth() - 5);
          return [start.toISOString().slice(0, 7), end.toISOString().slice(0, 7)];
        },
      },
      {
        text: '最近12个月',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setMonth(start.getMonth() - 11);
          return [start.toISOString().slice(0, 7), end.toISOString().slice(0, 7)];
        },
      },
    ];
  } else {
    return [
      {
        text: '最近7天',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setDate(start.getDate() - 6);
          return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
        },
      },
      {
        text: '最近30天',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setDate(start.getDate() - 29);
          return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
        },
      },
      {
        text: '最近90天',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setDate(start.getDate() - 89);
          return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
        },
      },
    ];
  }
});

// 初始化默认时间范围
const initDateRange = () => {
  const now = new Date();
  
  if (timeGranularity.value === 'year') {
    const end = now.getFullYear().toString();
    const start = (now.getFullYear() - 2).toString();
    dateRange.value = [start, end];
  } else if (timeGranularity.value === 'month') {
    const end = now.toISOString().slice(0, 7);
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().slice(0, 7);
    dateRange.value = [start, end];
  } else {
    const end = now.toISOString().slice(0, 10);
    const start = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    dateRange.value = [start, end];
  }
};

// 根据选择的时间范围计算时间信息
const timeRangeInfo = computed(() => {
  if (!dateRange.value || dateRange.value.length !== 2) {
    if (timeGranularity.value === 'year') {
      return { type: 'year', count: 3 };
    } else if (timeGranularity.value === 'month') {
      return { type: 'month', count: 3 };
    } else {
      return { type: 'day', count: 30 };
    }
  }
  
  const [start, end] = dateRange.value;
  
  if (timeGranularity.value === 'year') {
    const startYear = parseInt(start);
    const endYear = parseInt(end);
    const yearCount = endYear - startYear + 1;
    return { type: 'year', count: yearCount };
  } else if (timeGranularity.value === 'month') {
    const startDate = new Date(start + '-01');
    const endDate = new Date(end + '-01');
    const monthCount = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
    return { type: 'month', count: monthCount };
  } else {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return { type: 'day', count: dayCount };
  }
});

// 生成历史数据图表的通用配置函数
const generateHistoryChartOption = (title, unit, data) => {
  const { type } = timeRangeInfo.value;
  const typeText = type === 'year' ? '年度' : type === 'month' ? '月度' : type === 'day' ? '日度' : '小时';
  
  return {
    color: ['#4ecdc4'],
    title: {
      text: `${title} - ${typeText}历史趋势`,
      left: 'center',
      textStyle: {
        color: 'var(--text-primary)',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: 'var(--border-color)',
      textStyle: {
        color: 'var(--text-primary)'
      },
      formatter: function(params) {
        let result = params[0].axisValue + '<br/>';
        params.forEach(param => {
          result += `${param.marker}${param.seriesName}: ${param.value}${unit}<br/>`;
        });
        return result;
      }
    },
    toolbox: {
      // feature: {
      //   restore: {},
      //   saveAsImage: {}
      // },
      iconStyle: {
        borderColor: 'var(--text-secondary)'
      },
      emphasis: {
        iconStyle: {
          borderColor: 'var(--text-primary)'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: generateTimeData(),
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
      name: `${unit}`,
      nameTextStyle: {
        color: '#ffffff'
      },
      axisLabel: {
        color: '#ffffff',
        formatter: '{value}'
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      }
    },

    series: [
      {
        name: '平均值',
        type: 'line',
        data: data,
        smooth: true,
        lineStyle: {
          width: 3
        },
        symbol: 'circle',
        symbolSize: 6
      }
    ]
  };
};

// 根据参数类型生成基准值和变化范围
const getParameterBaseValue = (unit, key) => {
  const baseValues = {
    // 温度类参数
    'inletTemp': -162.5,
    'outletTemp': -160.0,
    'tankTemp': -160.2,
    'lngOutletTemp': -161.8,
    'propaneTemp': 25.8,
    'temperature': 25.0,
    'pumpTemp': -20.5,
    'separatorGasTemp': -155.8,
    'condensateTemp': 35.8,
    'bottomTemp': -158.5,
    'topTemp': -155.2,
    
    // 压力类参数
    'inletPressure': 0.25,
    'outletPressure': 0.28,
    'tankPressure': 0.08,
    'pressure': 0.32,
    'propanePressure': 0.15,
    'separatorLiquidPressure': 0.22,
    'outletMaterialPressure': 1.2,
    'outletPressureControl': 1.25,
    
    // 液位类参数
    'liquidLevel': 85.2,
    'level': 78.5,
    
    // 流量类参数
    'processFlow': 1250,
    'inletFlow': 0,
    'flow': 0,
    'outletFlow': 1680,
    'outletFlow1Control': 850,
    'flow1Control': 1250,
    'flow2Control': 980,
    
    // 电流类参数
    'current': 45.2,
    
    // 转速类参数
    'speed': 2850,
    
    // 阀位类参数
    'valvePosition': 65.2,
    'tempValvePosition': 45.8,
    'outletPressureValvePosition': 58.3,
    'moduleValvePosition': 72.1,
    'flareValvePosition': 15.8,
    'flow1ValvePosition': 68.5,
    'flow2ValvePosition': 55.2
  };
  
  // 如果有具体的基准值，使用它
  if (baseValues[key] !== undefined) {
    return baseValues[key];
  }
  
  // 否则根据单位类型返回默认值
  switch (unit) {
    case '℃': return -160;
    case 'MPa': return 0.2;
    case '%': return 60;
    case 'm³/h': return 1000;
    case 'A': return 40;
    case 'rpm': return 2800;
    default: return 50;
  }
};

const getParameterVariance = (unit) => {
  switch (unit) {
    case '℃': return 3;
    case 'MPa': return 0.05;
    case '%': return 5;
    case 'm³/h': return 100;
    case 'A': return 5;
    case 'rpm': return 200;
    default: return 2;
  }
};

// 动态生成选中设备的历史数据
const equipmentHistoryData = computed(() => {
  if (!selectedEquipment.value || !selectedParameters.value.length) {
    return [];
  }
  
  const { count } = timeRangeInfo.value;
  const equipment = selectedEquipment.value;
  
  return selectedParameters.value.map(paramKey => {
    const param = equipment.parameters.find(p => p.key === paramKey);
    if (!param) return null;
    
    const baseValue = getParameterBaseValue(param.unit, param.key);
    const variance = getParameterVariance(param.unit);
    
    return {
      name: param.key,
      key: param.key,
      title: `${equipment.name} - ${param.label}`,
      unit: param.unit,
      data: generateData(baseValue, variance, count)
    };
  }).filter(Boolean);
});

// 原有的设备历史数据配置（保留作为备用）
const originalEquipmentHistoryData = computed(() => {
  const { count } = timeRangeInfo.value;
  
  return [
    {
      name: '#1 LNG储罐',
      key: 'lngTank',
      children: [
        {
          name: 'liquidLevel',
          key: 'liquidLevel',
          title: 'LNG储罐液位',
          unit: '%',
          data: generateData(50, 8, count)
        },
        {
          name: 'pressure',
          key: 'pressure',
          title: 'LNG储罐压力',
          unit: 'kPa',
          data: generateData(125, 10, count)
        },
        {
          name: 'outletTemp',
          key: 'outletTemp',
          title: 'LNG储罐出口温度',
          unit: '℃',
          data: generateData(-160, 3, count)
        },
        {
          name: 'inletTemp',
          key: 'inletTemp',
          title: 'LNG储罐进液温度',
          unit: '℃',
          data: generateData(-163, 2, count)
        }
      ]
    },
    {
      name: '强制汽化器',
      key: 'vaporizer',
      children: [
        {
          name: 'inletPressure',
          key: 'inletPressure',
          title: '强制汽化器进口压力',
          unit: 'kPa',
          data: generateData(820, 80, count)
        },
        {
          name: 'inletTemp',
          key: 'inletTemp',
          title: '强制汽化器进口温度',
          unit: '℃',
          data: generateData(-155, 4, count)
        },
        {
          name: 'valvePosition',
          key: 'valvePosition',
          title: '强制汽化器阀位',
          unit: '%',
          data: generateData(78, 12, count)
        },
        {
          name: 'tempValvePosition',
          key: 'tempValvePosition',
          title: '温度调节阀阀位',
          unit: '%',
          data: generateData(68, 10, count)
        },
        {
          name: 'outletFlow',
          key: 'outletFlow',
          title: '强制汽化器出口流量',
          unit: 'kg/h',
          data: generateData(880, 80, count)
        },
        {
          name: 'outletPressure',
          key: 'outletPressure',
          title: '强制汽化器出口压力',
          unit: 'kPa',
          data: generateData(770, 60, count)
        }
      ]
    }
  ];
});

// 生成图表配置（保留兼容性）
const generateChartOption = (chartData) => {
  return generateHistoryChartOption(chartData.title, chartData.unit, chartData.data);
};

// 生成数据函数
const generateData = (baseValue, range, count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const variation = (Math.random() - 0.5) * range;
    const value = baseValue + variation;
    data.push(Number(value.toFixed(2)));
  }
  return data;
};

// 根据选择的时间范围生成时间数据
function generateTimeData() {
  const data = [];
  const { type, count } = timeRangeInfo.value;
  
  if (!dateRange.value || dateRange.value.length !== 2) {
    // 根据时间粒度生成默认数据
    if (timeGranularity.value === 'year') {
      const currentYear = new Date().getFullYear();
      for (let i = 2; i >= 0; i--) {
        data.push(`${currentYear - i}年`);
      }
    } else if (timeGranularity.value === 'month') {
      const now = new Date();
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        data.push(`${date.getFullYear()}年${date.getMonth() + 1}月`);
      }
    } else {
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data.push(`${date.getMonth() + 1}/${date.getDate()}`);
      }
    }
    return data;
  }
  
  const [start, end] = dateRange.value;
  
  if (timeGranularity.value === 'year') {
    const startYear = parseInt(start);
    const endYear = parseInt(end);
    for (let year = startYear; year <= endYear; year++) {
      data.push(`${year}年`);
    }
  } else if (timeGranularity.value === 'month') {
    const startDate = new Date(start + '-01');
    const endDate = new Date(end + '-01');
    const current = new Date(startDate);
    while (current <= endDate) {
      data.push(`${current.getFullYear()}年${current.getMonth() + 1}月`);
      current.setMonth(current.getMonth() + 1);
    }
  } else {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const current = new Date(startDate);
    while (current <= endDate) {
      data.push(`${current.getMonth() + 1}/${current.getDate()}`);
      current.setDate(current.getDate() + 1);
    }
  }
  
  return data;
}





// 监听时间粒度变化，重新初始化时间范围
watch(timeGranularity, () => {
  initDateRange();
});

onMounted(() => {
  // 初始化默认时间范围
  initDateRange();
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <span class="gradient-text">设备历史数据分析</span>
      <div class="nav-buttons">
        <router-link to="/" class="nav-button">总览</router-link>
        <router-link to="/lng-tank" class="nav-button">LNG储罐设备信息</router-link>
        <router-link to="/vaporizer" class="nav-button">强制汽化器设备信息</router-link>
        <router-link to="/real-time" class="nav-button">设备实时信息</router-link>
        <router-link to="/history" class="nav-button active">设备历史数据分析</router-link>
      </div>
    </div>
    
    <!-- 设备选择和时间范围控制面板 -->
    <div class="control-panel">
      <div class="control-group">
        <label class="control-label">选择设备:</label>
        <select v-model="selectedEquipment" class="equipment-select">
          <option v-for="equipment in equipmentList" :key="equipment.id" :value="equipment">
            {{ equipment.name }}
          </option>
        </select>
      </div>
      

      
      <div class="control-group">
        <label class="control-label">时间粒度:</label>
        <select v-model="timeGranularity" class="equipment-select">
          <option v-for="option in timeGranularityOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <div class="control-group">
        <label class="control-label">时间范围:</label>
        <el-date-picker
          v-model="dateRange"
          :type="timeGranularity === 'year' ? 'yearrange' : timeGranularity === 'month' ? 'monthrange' : 'daterange'"
          range-separator="至"
          :start-placeholder="timeGranularity === 'year' ? '开始年份' : timeGranularity === 'month' ? '开始月份' : '开始日期'"
          :end-placeholder="timeGranularity === 'year' ? '结束年份' : timeGranularity === 'month' ? '结束月份' : '结束日期'"
          :shortcuts="shortcuts"
          :format="timeGranularity === 'year' ? 'YYYY' : timeGranularity === 'month' ? 'YYYY/MM' : 'YYYY/MM/DD'"
          :value-format="timeGranularity === 'year' ? 'YYYY' : timeGranularity === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD'"
          class="date-picker"
        />
      </div>
      
      <div class="equipment-info">
        <span class="info-item">设备类型: <strong>{{ selectedEquipment.name }}</strong></span>
        <span class="info-item">参数数量: <strong>{{ selectedParameters.length }}个</strong></span>
        <span class="info-item">图表数量: <strong>{{ equipmentHistoryData.length }}个</strong></span>
      </div>
    </div>
    
    <!-- 均匀平铺布局：动态渲染图表 -->
    <div class="grid-layout" :class="{ 'multi-chart': equipmentHistoryData.length > 2 }">
      <!-- 动态渲染选中设备的参数图表 -->
      <template v-if="equipmentHistoryData.length > 0">
        <div class="grid-panel" v-for="chartData in equipmentHistoryData" :key="chartData.key">
          <div class="panel-title">{{ chartData.title }} ({{ chartData.unit }})</div>
          <div class="chart-container">
            <v-chart class="chart" :option="generateHistoryChartOption(chartData.title, chartData.unit, chartData.data)" autoresize />
          </div>
        </div>
      </template>

      <!-- 未选择参数时的提示 -->
      <template v-else>
        <div class="grid-panel" style="grid-column: 1 / -1; min-height: 240px;">
          <div class="panel-title">请选择要分析的参数</div>
          <div class="chart-container" style="color: var(--text-secondary); text-align: center; padding: 60px 20px;">
            <p style="font-size: 1.1rem; margin-bottom: 10px;">请选择要分析的设备</p>
            <p style="font-size: 0.9rem; opacity: 0.7;">选择设备后将自动显示该设备的所有参数历史趋势</p>
          </div>
        </div>
      </template>
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

.control-panel {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 15px 20px;
  background: var(--primary-bg);
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.equipment-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 120px;
}

.equipment-select:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(73, 146, 255, 0.1);
}

.equipment-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(73, 146, 255, 0.5);
}

/* 下拉选项深色主题 */
.equipment-select option {
  background: var(--secondary-bg) !important;
  color: var(--text-primary) !important;
  padding: 8px 12px;
}

.equipment-select option:hover {
  background: var(--primary-color) !important;
}



/* 多图表布局优化 */
.multi-chart {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.multi-chart .grid-panel {
  min-height: 300px;
  color: white !important;
}

.equipment-select option:checked,
.equipment-select option:selected {
  background: var(--primary-color) !important;
  color: white !important;
}

/* 确保选项在失去焦点后恢复默认样式 */
.equipment-select option:not(:hover):not(:checked):not(:selected) {
  background: var(--secondary-bg) !important;
  color: var(--text-primary) !important;
}

.date-picker {
  width: 280px;
}

/* Element Plus DatePicker 样式覆盖 */
:deep(.el-date-editor) {
  background: var(--input-bg);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:deep(.el-date-editor:hover) {
  border-color: var(--primary-color);
}

:deep(.el-date-editor.is-active) {
  border-color: var(--primary-color);
}

:deep(.el-input__inner) {
  background: var(--input-bg);
  color: var(--text-primary);
  border: none;
}

:deep(.el-range-separator) {
  color: var(--text-secondary);
}

/* Element Plus 下拉面板深色主题 */
:deep(.el-picker-panel) {
  background: var(--secondary-bg) !important;
  border: 1px solid var(--border-color) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

:deep(.el-picker-panel__body) {
  background: var(--secondary-bg) !important;
}

:deep(.el-picker-panel__content) {
  background: var(--secondary-bg) !important;
}

:deep(.el-date-table) {
  background: var(--secondary-bg) !important;
}

:deep(.el-date-table th) {
  color: var(--text-secondary) !important;
  background: var(--secondary-bg) !important;
}

:deep(.el-date-table td) {
  background: var(--secondary-bg) !important;
}

:deep(.el-date-table td.available:hover) {
  background: var(--primary-color) !important;
  color: white !important;
}

:deep(.el-date-table td.current:not(.disabled)) {
  background: var(--primary-color) !important;
  color: white !important;
}

:deep(.el-date-table td span) {
  color: var(--text-primary) !important;
}

:deep(.el-date-table td.today span) {
  color: var(--primary-color) !important;
  font-weight: bold;
}

:deep(.el-picker-panel__shortcut) {
  background: var(--secondary-bg) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
}

:deep(.el-picker-panel__shortcut:hover) {
  background: var(--primary-color) !important;
  color: white !important;
}

:deep(.el-picker-panel__sidebar) {
  background: var(--secondary-bg) !important;
  border-right: 1px solid var(--border-color) !important;
}

:deep(.el-year-table td .cell) {
  color: var(--text-primary) !important;
}

:deep(.el-year-table td.current:not(.disabled) .cell) {
  background: var(--primary-color) !important;
  color: white !important;
}

:deep(.el-year-table td .cell:hover) {
  background: var(--primary-color) !important;
  color: white !important;
}

:deep(.el-month-table td .cell) {
  color: var(--text-primary) !important;
}

:deep(.el-month-table td.current:not(.disabled) .cell) {
  background: var(--primary-color) !important;
  color: white !important;
}

:deep(.el-month-table td .cell:hover) {
  background: var(--primary-color) !important;
  color: white !important;
}

:deep(.el-picker-panel__footer) {
  background: var(--secondary-bg) !important;
  border-top: 1px solid var(--border-color) !important;
}

:deep(.el-button) {
  background: var(--secondary-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
}

:deep(.el-button:hover) {
  background: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

:deep(.el-button--primary) {
  background: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.equipment-info {
  display: flex;
  gap: 20px;
  margin-left: auto;
}

.info-item {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.info-item strong {
  color: var(--text-primary);
  font-weight: 600;
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

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 20px;
  padding: 20px;
  /* min-height: calc(100vh - 220px); */
  overflow-y: auto;
}

/* 强制汽化器六个图表使用3列布局 */
.grid-layout.vaporizer-layout {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1400px) {
  .grid-layout.vaporizer-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .grid-layout.vaporizer-layout {
    grid-template-columns: 1fr;
  }
}

.grid-panel {
  background: var(--panel-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 320px;
}

.grid-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.grid-panel .panel-title {
  padding: 15px 20px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--primary-bg), var(--secondary-bg));
  border-radius: 12px 12px 0 0;
}

.grid-panel .chart-container {
  flex: 1;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 1200px) {
  .grid-layout {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}

@media (max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }
  
  .grid-panel {
    min-height: 350px;
  }
}
</style>