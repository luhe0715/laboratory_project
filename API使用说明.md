# LNG实验室监控系统 - API使用说明

## 概述

本项目提供了完整的模拟API服务器，用于为前端页面提供数据接口。API服务器基于Express.js构建，提供RESTful接口和实时数据模拟。

## 快速开始

### 1. 安装API服务器依赖

```bash
# 安装API服务器依赖（需要先安装Node.js）
npm install express cors nodemon
```

或者使用提供的package.json文件：

```bash
# 复制api-package.json为package.json（在新的终端目录中）
cp api-package.json package.json
npm install
```

### 2. 启动API服务器

```bash
# 启动API服务器
node mock-api-server.js

# 或者使用开发模式（自动重启）
npm run dev
```

### 3. 验证API服务

启动成功后，访问以下地址验证API服务：

- 服务器地址：`http://localhost:3000`
- 测试接口：`http://localhost:3000/api/dashboard/lab-info`

## API接口列表

### 主控制台 (Dashboard)

| 接口 | 方法 | 地址 | 说明 |
|------|------|------|------|
| 实验室基本信息 | GET | `/api/dashboard/lab-info` | 获取实验室面积、人员等基本信息 |
| 设备状态统计 | GET | `/api/dashboard/equipment-status` | 获取设备运行、待机、维护状态统计 |
| 设备类型分布 | GET | `/api/dashboard/equipment-types` | 获取储罐、泵、气化器等设备类型分布 |
| 告警趋势数据 | GET | `/api/dashboard/alarm-trend` | 获取近期告警数量趋势 |

### LNG储罐监控 (LngTankDashboard)

| 接口 | 方法 | 地址 | 说明 |
|------|------|------|------|
| 储罐类型分布 | GET | `/api/lng-tank/types` | 获取低温、常温、高压储罐分布 |
| 储罐液位数据 | GET | `/api/lng-tank/level-data` | 获取储罐液位监控时序数据 |
| 储罐压力数据 | GET | `/api/lng-tank/pressure-data` | 获取储罐压力监控时序数据 |
| 储罐温度数据 | GET | `/api/lng-tank/temperature-data` | 获取储罐温度监控时序数据 |

### 汽化器监控 (VaporizerDashboard)

| 接口 | 方法 | 地址 | 说明 |
|------|------|------|------|
| 进口压力数据 | GET | `/api/vaporizer/inlet-pressure` | 获取强制汽化器进口压力数据 |
| 出口温度数据 | GET | `/api/vaporizer/outlet-temperature` | 获取空温汽化器出口温度数据 |
| 汽化效率数据 | GET | `/api/vaporizer/efficiency` | 获取汽化器效率监控数据 |

### 实时监控 (RealTimeMonitor)

| 接口 | 方法 | 地址 | 说明 |
|------|------|------|------|
| 实时设备列表 | GET | `/api/realtime/equipment-list` | 获取所有设备的实时状态和参数 |
| 实时温度数据 | GET | `/api/realtime/temperature` | 获取系统实时温度监控数据 |
| 实时压力数据 | GET | `/api/realtime/pressure` | 获取系统实时压力监控数据 |

### 历史数据分析 (HistoryAnalysis)

| 接口 | 方法 | 地址 | 说明 |
|------|------|------|------|
| 设备列表 | GET | `/api/history/equipment-list` | 获取可查询历史数据的设备列表 |
| 历史数据查询 | GET | `/api/history/data` | 根据设备ID和参数查询历史数据 |

#### 历史数据查询参数

- `equipmentId`: 设备ID（必需）
- `parameter`: 参数键值（必需）
- `startTime`: 开始时间（可选）
- `endTime`: 结束时间（可选）
- `interval`: 数据间隔，支持 `1h`、`6h`、`1d`（可选）

**示例请求**：
```
# 单参数查询
GET /api/history/data?equipmentId=1&parameter=inletPressure&interval=1h

# 多参数查询
GET /api/history/data?equipmentId=1&parameters=inletPressure,inletTemp,processFlow&interval=1h
```

**使用示例**：
```javascript
// 获取设备列表
const equipmentResponse = await fetch('http://localhost:3000/api/history/equipment-list');
const equipmentData = await equipmentResponse.json();

// 查询历史数据
const historyResponse = await fetch('http://localhost:3000/api/history/data?equipmentId=1&interval=1h');
const historyData = await historyResponse.json();

// 处理历史数据
if (historyData.code === 200) {
  const { equipmentName, series, timeData } = historyData.data;
  console.log(`设备: ${equipmentName}`);
  console.log('时间轴:', timeData);
  
  // 遍历所有参数
  series.forEach(param => {
    console.log(`${param.name} (${param.unit}):`, param.values);
    console.log(`统计信息: 最小值=${param.statistics.min}, 最大值=${param.statistics.max}, 平均值=${param.statistics.avg}`);
  });
}
```

## 数据格式说明

### 通用响应格式

所有API接口都遵循统一的响应格式：

```json
{
  "code": 200,                    // 状态码
  "message": "success",           // 响应消息
  "data": {},                     // 响应数据
  "timestamp": "2024-01-15T10:30:00.000Z"  // 响应时间戳
}
```

### 时序数据格式

图表类接口返回的时序数据格式：

```json
{
  "timeData": ["10:00", "10:05", "10:10"],  // 时间轴数据
  "series": [                               // 数据系列
    {
      "name": "数据系列名称",
      "data": [100, 105, 102],              // 数值数据
      "unit": "单位"                        // 数据单位
    }
  ]
}
```

### 设备状态枚举

- `running`: 运行中
- `standby`: 待机
- `maintenance`: 维护中
- `error`: 故障

## 前端集成示例

### 使用axios请求API

```javascript
// 安装axios
npm install axios

// 在Vue组件中使用
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// 获取实验室基本信息
async function getLabInfo() {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/lab-info`);
    if (response.data.code === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error('获取实验室信息失败:', error);
  }
}

// 获取实时设备列表
async function getRealtimeEquipment() {
  try {
    const response = await axios.get(`${API_BASE_URL}/realtime/equipment-list`);
    if (response.data.code === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error('获取设备列表失败:', error);
  }
}

// 查询历史数据
async function getHistoryData(equipmentId, parameter, interval = '1h') {
  try {
    const response = await axios.get(`${API_BASE_URL}/history/data`, {
      params: { equipmentId, parameter, interval }
    });
    if (response.data.code === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error('获取历史数据失败:', error);
  }
}
```

### 在Vue组件中集成

```vue
<template>
  <div>
    <h3>实验室信息</h3>
    <div v-if="labInfo">
      <p>面积: {{ labInfo.area }}㎡</p>
      <p>人员: {{ labInfo.personnel }}人</p>
      <p>设备: {{ labInfo.equipmentCount }}台</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      labInfo: null
    };
  },
  async mounted() {
    await this.loadLabInfo();
  },
  methods: {
    async loadLabInfo() {
      try {
        const response = await axios.get('http://localhost:3000/api/dashboard/lab-info');
        if (response.data.code === 200) {
          this.labInfo = response.data.data;
        }
      } catch (error) {
        console.error('加载实验室信息失败:', error);
      }
    }
  }
};
</script>
```

## 开发建议

### 1. 环境配置

建议在项目中创建环境配置文件：

```javascript
// config/api.js
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000/api'
  },
  production: {
    baseURL: 'https://your-api-domain.com/api'
  }
};

export default API_CONFIG[process.env.NODE_ENV || 'development'];
```

### 2. 错误处理

```javascript
// utils/api.js
import axios from 'axios';
import { ElMessage } from 'element-plus';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
});

// 响应拦截器
api.interceptors.response.use(
  response => {
    if (response.data.code !== 200) {
      ElMessage.error(response.data.message || '请求失败');
      return Promise.reject(new Error(response.data.message));
    }
    return response.data.data;
  },
  error => {
    ElMessage.error('网络请求失败');
    return Promise.reject(error);
  }
);

export default api;
```

### 3. 数据缓存

对于不经常变化的数据，建议使用缓存：

```javascript
// utils/cache.js
class DataCache {
  constructor() {
    this.cache = new Map();
    this.expireTime = 5 * 60 * 1000; // 5分钟过期
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.expireTime) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
}

export default new DataCache();
```

## 注意事项

1. **端口冲突**: API服务器默认使用3000端口，如有冲突请修改`mock-api-server.js`中的PORT变量

2. **CORS配置**: API服务器已配置CORS支持，允许跨域访问

3. **数据模拟**: 所有数据都是随机生成的模拟数据，每次请求返回的数值会有所不同

4. **性能考虑**: 历史数据查询建议限制时间范围，避免返回过多数据

5. **实时数据**: 实时监控接口建议配合定时器使用，每2-5秒请求一次

## 故障排除

### 常见问题

1. **API服务器启动失败**
   - 检查Node.js是否已安装
   - 检查端口3000是否被占用
   - 检查依赖包是否正确安装

2. **前端无法访问API**
   - 确认API服务器已启动
   - 检查请求URL是否正确
   - 查看浏览器控制台是否有CORS错误

3. **数据格式错误**
   - 参考API接口文档中的数据格式说明
   - 检查响应数据的code字段是否为200

### 调试技巧

1. 使用浏览器直接访问API接口进行测试
2. 使用Postman等工具测试API接口
3. 查看API服务器控制台输出的日志信息
4. 在前端代码中添加console.log输出调试信息

---

**文档版本**: v1.0  
**更新时间**: 2024-01-15  
**维护人员**: 开发团队