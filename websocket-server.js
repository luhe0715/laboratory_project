import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

// 创建HTTP服务器
const server = http.createServer();

// 创建WebSocket服务器
const wss = new WebSocketServer({ server });

// 模拟设备数据
const generateEquipmentData = () => {
  const equipmentList = [
    {
      id: 1,
      name: '试验深冷式再液化装置',
      status: 'running',
      statusText: '正常运行',
      parameters: [
        { label: '进口压力', value: 0.25 + (Math.random() - 0.5) * 0.02, unit: 'MPa', key: 'inletPressure' },
        { label: '进口温度', value: -162.5 + (Math.random() - 0.5) * 2, unit: '℃', key: 'inletTemp' },
        { label: '出口温度', value: -165.8 + (Math.random() - 0.5) * 2, unit: '℃', key: 'outletTemp' }
      ]
    },
    {
      id: 2,
      name: '深冷LNG加热器',
      status: 'running',
      statusText: '正常运行',
      parameters: [
        { label: '丙烷压力', value: 0.15 + (Math.random() - 0.5) * 0.02, unit: 'MPa', key: 'propanePressure' },
        { label: '丙烷温度', value: 25.8 + (Math.random() - 0.5) * 2, unit: '℃', key: 'propaneTemp' },
        { label: '进气压力', value: 0.12 + (Math.random() - 0.5) * 0.02, unit: 'MPa', key: 'inletPressure' },
        { label: '进气温度', value: -158.3 + (Math.random() - 0.5) * 2, unit: '℃', key: 'inletTemp' },
        { label: 'LNG出口温度', value: -145.2 + (Math.random() - 0.5) * 2, unit: '℃', key: 'lngOutletTemp' }
      ]
    },
    {
      id: 3,
      name: '#1 LNG储罐',
      status: 'running',
      statusText: '正常运行',
      parameters: [
        { label: '液位', value: Math.max(0, Math.min(100, 85.2 + (Math.random() - 0.5) * 1)), unit: '%', key: 'level' },
        { label: '压力', value: 0.08 + (Math.random() - 0.5) * 0.02, unit: 'MPa', key: 'pressure' },
        { label: 'LNG出口温度', value: -162.1 + (Math.random() - 0.5) * 2, unit: '℃', key: 'lngOutletTemp' }
      ]
    },
    {
      id: 5,
      name: '#1 LNG输送泵',
      status: 'running',
      statusText: '正常运行',
      parameters: [
        { label: '电流', value: 45.2 + (Math.random() - 0.5) * 2, unit: 'A', key: 'current' },
        { label: '液位', value: Math.max(0, Math.min(100, 78.5 + (Math.random() - 0.5) * 1)), unit: '%', key: 'level' },
        { label: '转速', value: 2850 + (Math.random() - 0.5) * 100, unit: 'rpm', key: 'speed' },
        { label: '压力', value: 0.22 + (Math.random() - 0.5) * 0.02, unit: 'MPa', key: 'pressure' },
        { label: '出口压力', value: 0.35 + (Math.random() - 0.5) * 0.02, unit: 'MPa', key: 'outletPressure' },
        { label: '进口压力', value: 0.08 + (Math.random() - 0.5) * 0.02, unit: 'MPa', key: 'inletPressure' }
      ]
    }
  ];

  // 添加时间戳
  equipmentList.forEach(equipment => {
    equipment.lastUpdate = new Date().toLocaleString('zh-CN');
    // 格式化数值精度
    equipment.parameters.forEach(param => {
      if (param.unit === 'MPa') {
        param.value = parseFloat(param.value.toFixed(3));
      } else if (param.unit === '%') {
        param.value = parseFloat(param.value.toFixed(1));
      } else {
        param.value = parseFloat(param.value.toFixed(1));
      }
    });
  });

  return equipmentList;
};

// WebSocket连接处理
wss.on('connection', (ws) => {
  console.log('客户端已连接');

  // 发送初始数据
  ws.send(JSON.stringify({
    type: 'initial',
    data: generateEquipmentData()
  }));

  // 定时发送更新数据
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'update',
        data: generateEquipmentData(),
        timestamp: new Date().toISOString()
      }));
    }
  }, 2000); // 每2秒更新一次

  // 处理客户端消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('收到客户端消息:', data);
      
      // 处理不同类型的消息
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
          break;
        case 'subscribe':
          // 可以根据设备ID订阅特定设备
          console.log('订阅设备:', data.equipmentIds);
          break;
        default:
          console.log('未知消息类型:', data.type);
      }
    } catch (error) {
      console.error('解析消息失败:', error);
    }
  });

  // 连接关闭处理
  ws.on('close', () => {
    console.log('客户端已断开连接');
    clearInterval(interval);
  });

  // 错误处理
  ws.on('error', (error) => {
    console.error('WebSocket错误:', error);
    clearInterval(interval);
  });
});

// 启动服务器
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`WebSocket服务器运行在 ws://localhost:${PORT}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭WebSocket服务器...');
  wss.close(() => {
    server.close(() => {
      console.log('WebSocket服务器已关闭');
      process.exit(0);
    });
  });
});