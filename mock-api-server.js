/**
 * LNG实验室监控系统 - 模拟API服务器
 * 提供所有页面所需的模拟数据接口
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// 中间件配置
app.use(cors());
app.use(express.json());

// 通用响应格式化函数
function formatResponse(data, message = 'success', code = 200) {
  return {
    code,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

// 生成随机数据的工具函数
function generateRandomData(min, max, precision = 1) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(precision));
}

// 生成时间序列数据
function generateTimeData(count = 5, intervalMinutes = 5) {
  const times = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalMinutes * 60000);
    times.push(time.toTimeString().slice(0, 5));
  }
  return times;
}

// ==================== 主控制台接口 ====================

// 获取实验室基本信息
app.get('/api/dashboard/lab-info', (req, res) => {
  const data = {
    area: "500",
    personnel: "12",
    equipmentCount: "26",
    operatingTime: "24",
    temperature: "-160",
    safetyLevel: "A级"
  };
  res.json(formatResponse(data));
});

// 获取设备工作状态统计
app.get('/api/dashboard/equipment-status', (req, res) => {
  const data = {
    running: 24,
    standby: 6,
    maintenance: 2
  };
  res.json(formatResponse(data));
});

// Dashboard API - 设备数量统计
app.get('/api/dashboard/equipment-count', (req, res) => {
  res.json({
    code: 200,
    message: '获取设备数量统计成功',
    data: {
      total: 32,
      running: 24,
      standby: 6,
      maintenance: 2
    }
  });
});

// 获取设备类型分布
app.get('/api/dashboard/equipment-types', (req, res) => {
  const data = [
    { name: "LNG储罐", value: 12 },
    { name: "输送泵", value: 8 },
    { name: "气化器", value: 6 },
    { name: "压缩机", value: 4 },
    { name: "分离器", value: 2 }
  ];
  res.json(formatResponse(data));
});

// Dashboard API - 人员数量统计
app.get('/api/dashboard/personnel-count', (req, res) => {
  res.json({
    code: 200,
    message: '获取人员数量统计成功',
    data: {
      total: 28,
      breakdown: [
        { name: '操作员', value: 12 },
        { name: '技术员', value: 8 },
        { name: '安全员', value: 4 },
        { name: '管理员', value: 3 },
        { name: '维护员', value: 1 }
      ]
    }
  });
});

// Dashboard API - 用电消耗统计
app.get('/api/dashboard/power-consumption', (req, res) => {
  res.json({
    code: 200,
    message: '获取用电消耗统计成功',
    data: {
      total: 2847.6,
      timeData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      consumptionData: [420.5, 385.2, 445.8, 398.7, 412.3, 356.9, 428.2]
    }
  });
});

// Dashboard API - 用水消耗统计
app.get('/api/dashboard/water-consumption', (req, res) => {
  res.json({
    code: 200,
    message: '获取用水消耗统计成功',
    data: {
      total: 156.8,
      timeData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      consumptionData: [18.5, 16.2, 14.8, 12.3, 10.7, 8.9, 9.2, 11.4, 13.6, 15.8, 17.2, 18.2]
    }
  });
});

// Dashboard API - 低温内车辆数量统计
app.get('/api/dashboard/vehicle-count', (req, res) => {
  res.json({
    code: 200,
    message: '获取车辆数量统计成功',
    data: {
      total: 18,
      breakdown: [
        { name: 'LNG运输车', value: 8 },
        { name: '低温叉车', value: 5 },
        { name: '维护车辆', value: 3 },
        { name: '应急车辆', value: 2 }
      ]
    }
  });
});

// 获取告警趋势数据
app.get('/api/dashboard/alarm-trend', (req, res) => {
  const data = [
    { date: "01-10", count: 3 },
    { date: "01-11", count: 5 },
    { date: "01-12", count: 2 },
    { date: "01-13", count: 8 },
    { date: "01-14", count: 4 },
    { date: "01-15", count: 6 },
    { date: "01-16", count: 1 }
  ];
  res.json(formatResponse(data));
});

// ==================== LNG储罐监控接口 ====================

// 获取储罐类型分布
app.get('/api/lng-tank/types', (req, res) => {
  const data = [
    { name: "低温储罐", value: 4 },
    { name: "常温储罐", value: 2 },
    { name: "高压储罐", value: 1 },
    { name: "缓冲罐", value: 1 }
  ];
  res.json(formatResponse(data));
});

// 获取储罐液位监控数据
app.get('/api/lng-tank/level-data', (req, res) => {
  const timeData = generateTimeData();
  const data = {
    timeData,
    series: [
      {
        name: "#1储罐",
        data: timeData.map(() => generateRandomData(80, 90, 1))
      },
      {
        name: "#2储罐",
        data: timeData.map(() => generateRandomData(85, 95, 1))
      }
    ]
  };
  res.json(formatResponse(data));
});

// 获取储罐压力监控数据
app.get('/api/lng-tank/pressure-data', (req, res) => {
  const timeData = generateTimeData();
  const data = {
    timeData,
    series: [
      {
        name: "#1储罐压力",
        data: timeData.map(() => generateRandomData(0.075, 0.085, 3)),
        unit: "MPa"
      }
    ]
  };
  res.json(formatResponse(data));
});

// 获取储罐温度监控数据
app.get('/api/lng-tank/temperature-data', (req, res) => {
  const timeData = generateTimeData();
  const data = {
    timeData,
    series: [
      {
        name: "储罐温度",
        data: timeData.map(() => generateRandomData(-163, -161, 1)),
        unit: "℃"
      }
    ]
  };
  res.json(formatResponse(data));
});

// ==================== 汽化器监控接口 ====================

// 获取强制汽化器进口压力数据
app.get('/api/vaporizer/inlet-pressure', (req, res) => {
  const timeData = generateTimeData();
  const data = {
    timeData,
    series: [
      {
        name: "进口压力",
        data: timeData.map(() => generateRandomData(240, 250, 1)),
        unit: "kPa"
      }
    ]
  };
  res.json(formatResponse(data));
});

// 获取空温汽化器出口温度数据
app.get('/api/vaporizer/outlet-temperature', (req, res) => {
  const timeData = generateTimeData();
  const data = {
    timeData,
    series: [
      {
        name: "出口温度",
        data: timeData.map(() => generateRandomData(14, 16, 1)),
        unit: "℃"
      }
    ]
  };
  res.json(formatResponse(data));
});

// 获取汽化器效率数据
app.get('/api/vaporizer/efficiency', (req, res) => {
  const timeData = generateTimeData();
  const data = {
    timeData,
    series: [
      {
        name: "汽化效率",
        data: timeData.map(() => generateRandomData(94, 96, 1)),
        unit: "%"
      }
    ]
  };
  res.json(formatResponse(data));
});

// ==================== 实时监控接口 ====================

// 设备基础数据
const equipmentList = [
  {
    id: 1,
    name: "试验深冷式再液化装置",
    type: "再液化装置",
    parameters: [
      { label: "进口压力", unit: "MPa", key: "inletPressure", range: [0.2, 0.3] },
      { label: "进口温度", unit: "℃", key: "inletTemp", range: [-165, -160] },
      { label: "出口压力", unit: "MPa", key: "outletPressure", range: [0.15, 0.25] },
      { label: "出口温度", unit: "℃", key: "outletTemp", range: [-158, -155] },
      { label: "处理流量", unit: "m³/h", key: "processFlow", range: [10, 20] }
    ]
  },
  {
    id: 2,
    name: "LNG低温储罐#1",
    type: "储罐",
    parameters: [
      { label: "液位", unit: "%", key: "level", range: [80, 95] },
      { label: "压力", unit: "MPa", key: "pressure", range: [0.07, 0.09] },
      { label: "温度", unit: "℃", key: "temperature", range: [-163, -161] }
    ]
  },
  {
    id: 3,
    name: "LNG低温储罐#2",
    type: "储罐",
    parameters: [
      { label: "液位", unit: "%", key: "level", range: [85, 98] },
      { label: "压力", unit: "MPa", key: "pressure", range: [0.075, 0.095] },
      { label: "温度", unit: "℃", key: "temperature", range: [-164, -160] }
    ]
  },
  {
    id: 4,
    name: "LNG潜液泵#1",
    type: "泵",
    parameters: [
      { label: "流量", unit: "m³/h", key: "flow", range: [15, 25] },
      { label: "扬程", unit: "m", key: "head", range: [45, 55] },
      { label: "转速", unit: "rpm", key: "speed", range: [2800, 3200] },
      { label: "电流", unit: "A", key: "current", range: [8, 12] }
    ]
  },
  {
    id: 5,
    name: "强制汽化器",
    type: "汽化器",
    parameters: [
      { label: "进口压力", unit: "kPa", key: "inletPressure", range: [240, 250] },
      { label: "出口温度", unit: "℃", key: "outletTemp", range: [14, 16] },
      { label: "汽化量", unit: "kg/h", key: "vaporRate", range: [100, 150] }
    ]
  }
];

// 生成设备实时数据
function generateEquipmentData() {
  const statuses = ['running', 'standby', 'maintenance'];
  const statusTexts = { running: '正常运行', standby: '待机', maintenance: '维护中' };
  
  return equipmentList.map(equipment => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const parameters = equipment.parameters.map(param => ({
      label: param.label,
      value: generateRandomData(param.range[0], param.range[1], param.unit === 'rpm' ? 0 : param.unit === '%' ? 1 : param.unit === 'A' ? 1 : 3),
      unit: param.unit,
      key: param.key
    }));
    
    return {
      id: equipment.id,
      name: equipment.name,
      status,
      statusText: statusTexts[status],
      type: equipment.type,
      lastUpdate: new Date().toISOString(),
      parameters
    };
  });
}

// 获取实时设备列表
app.get('/api/realtime/equipment-list', (req, res) => {
  const data = generateEquipmentData();
  res.json(formatResponse(data));
});

// 获取实时温度监控数据
app.get('/api/realtime/temperature', (req, res) => {
  const timeData = generateTimeData(6, 1); // 6个点，间隔1分钟
  const data = {
    timeData,
    series: [
      {
        name: "LNG储罐",
        data: timeData.map(() => generateRandomData(-163, -161, 1)),
        unit: "℃"
      },
      {
        name: "汽化器入口",
        data: timeData.map(() => generateRandomData(-159, -157, 1)),
        unit: "℃"
      },
      {
        name: "汽化器出口",
        data: timeData.map(() => generateRandomData(14, 16, 1)),
        unit: "℃"
      }
    ]
  };
  res.json(formatResponse(data));
});

// 获取实时压力监控数据
app.get('/api/realtime/pressure', (req, res) => {
  const timeData = generateTimeData(6, 1);
  const data = {
    timeData,
    series: [
      {
        name: "系统压力",
        data: timeData.map(() => generateRandomData(0.24, 0.26, 3)),
        unit: "MPa"
      }
    ]
  };
  res.json(formatResponse(data));
});

// ==================== 历史数据分析接口 ====================

// 获取设备列表
app.get('/api/history/equipment-list', (req, res) => {
  const data = equipmentList.map(equipment => ({
    id: equipment.id,
    name: equipment.name,
    type: "multi-param",
    parameters: equipment.parameters.map(param => ({
      label: param.label,
      unit: param.unit,
      key: param.key
    }))
  }));
  res.json(formatResponse(data));
});

// 获取历史数据
app.get('/api/history/data', (req, res) => {
  const { equipmentId, startTime, endTime, interval } = req.query;
  
  // 验证必需参数
  if (!equipmentId) {
    return res.status(400).json(formatResponse(null, '设备ID不能为空', 400));
  }
  
  // 查找设备信息
  const equipment = equipmentList.find(eq => eq.id == equipmentId);
  if (!equipment) {
    return res.status(404).json(formatResponse(null, '设备不存在', 404));
  }
  
  // 生成时间数据
  const dataPoints = interval === '1h' ? 24 : interval === '6h' ? 4 : 7;
  const timeData = [];
  
  for (let i = 0; i < dataPoints; i++) {
    if (interval === '1h') {
      timeData.push(String(i).padStart(2, '0') + ':00');
    } else if (interval === '6h') {
      timeData.push(String(i * 6).padStart(2, '0') + ':00');
    } else {
      timeData.push(`01-${String(10 + i).padStart(2, '0')}`);
    }
  }
  
  // 生成设备所有参数的历史数据
  const series = [];
  
  equipment.parameters.forEach(paramInfo => {
    const values = [];
    for (let i = 0; i < dataPoints; i++) {
      values.push(generateRandomData(paramInfo.range[0], paramInfo.range[1], paramInfo.unit === 'rpm' ? 0 : 3));
    }
    
    series.push({
      name: paramInfo.label,
      key: paramInfo.key,
      unit: paramInfo.unit,
      values,
      statistics: {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(3)),
        count: values.length
      }
    });
  });
  
  const data = {
    equipmentId: equipment.id,
    equipmentName: equipment.name,
    equipmentType: equipment.type,
    timeRange: {
      start: startTime || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      end: endTime || new Date().toISOString()
    },
    interval: interval || '1d',
    timeData,
    series
  };
  
  res.json(formatResponse(data));
});

// ==================== 根路径和健康检查 ====================

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'LNG实验室监控系统 - 模拟API服务器',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      dashboard: '/api/dashboard/*',
      lngTank: '/api/lng-tank/*',
      vaporizer: '/api/vaporizer/*',
      realtime: '/api/realtime/*',
      history: '/api/history/*'
    }
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ==================== 错误处理 ====================

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json(formatResponse(null, '服务器内部错误', 500));
});

// 404处理 - 必须放在最后
app.use((req, res) => {
  console.log(`404 - 未找到路由: ${req.method} ${req.originalUrl}`);
  res.status(404).json(formatResponse(null, '接口不存在', 404));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 LNG实验室监控系统 - 模拟API服务器已启动`);
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`📖 API文档: 请查看 API接口文档.md`);
  console.log(`\n可用的API接口:`);
  console.log(`  主控制台:`);
  console.log(`    GET /api/dashboard/lab-info          - 实验室基本信息`);
  console.log(`    GET /api/dashboard/equipment-status  - 设备状态统计`);
  console.log(`    GET /api/dashboard/equipment-types   - 设备类型分布`);
  console.log(`    GET /api/dashboard/alarm-trend       - 告警趋势数据`);
  console.log(`  LNG储罐监控:`);
  console.log(`    GET /api/lng-tank/types              - 储罐类型分布`);
  console.log(`    GET /api/lng-tank/level-data         - 储罐液位数据`);
  console.log(`    GET /api/lng-tank/pressure-data      - 储罐压力数据`);
  console.log(`    GET /api/lng-tank/temperature-data   - 储罐温度数据`);
  console.log(`  汽化器监控:`);
  console.log(`    GET /api/vaporizer/inlet-pressure    - 进口压力数据`);
  console.log(`    GET /api/vaporizer/outlet-temperature - 出口温度数据`);
  console.log(`    GET /api/vaporizer/efficiency        - 汽化效率数据`);
  console.log(`  实时监控:`);
  console.log(`    GET /api/realtime/equipment-list     - 实时设备列表`);
  console.log(`    GET /api/realtime/temperature        - 实时温度数据`);
  console.log(`    GET /api/realtime/pressure           - 实时压力数据`);
  console.log(`  历史数据分析:`);
  console.log(`    GET /api/history/equipment-list      - 设备列表`);
  console.log(`    GET /api/history/data                - 历史数据查询`);
  console.log(`\n💡 提示: 所有接口都支持CORS跨域访问`);
});

export default app;