# LNG实验室监控系统 - API接口文档

## 概述

本文档定义了LNG实验室监控系统所有页面的模拟API接口，包括数据格式、字段说明和示例响应。

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **时间格式**: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

## 通用响应格式

```json
{
  "code": 200,           // 状态码：200成功，400客户端错误，500服务器错误
  "message": "success",  // 响应消息
  "data": {},            // 响应数据
  "timestamp": "2024-01-15T10:30:00.000Z"  // 响应时间戳
}
```

## 1. 主控制台 (Dashboard) 接口

### 1.1 获取实验室基本信息

**接口地址**: `GET /dashboard/lab-info`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "area": "500",              // 实验室面积 (平方米)
    "personnel": "12",          // 在岗人员数量
    "equipmentCount": "26",     // 设备总数
    "operatingTime": "24",      // 运行时间 (小时)
    "temperature": "-160",      // 环境温度 (摄氏度)
    "safetyLevel": "A级"        // 安全等级
  }
}
```

### 1.2 获取设备工作状态统计

**接口地址**: `GET /dashboard/equipment-status`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "running": 20,      // 运行中设备数量
    "standby": 5,       // 待机设备数量
    "maintenance": 1    // 维护中设备数量
  }
}
```

### 1.3 获取设备类型分布

**接口地址**: `GET /dashboard/equipment-types`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "name": "储罐", "value": 8 },
    { "name": "泵", "value": 6 },
    { "name": "气化器", "value": 4 },
    { "name": "压缩机", "value": 3 },
    { "name": "分离器", "value": 3 },
    { "name": "其他", "value": 2 }
  ]
}
```

### 1.4 获取告警趋势数据

**接口地址**: `GET /dashboard/alarm-trend`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "date": "01-10", "count": 3 },
    { "date": "01-11", "count": 5 },
    { "date": "01-12", "count": 2 },
    { "date": "01-13", "count": 8 },
    { "date": "01-14", "count": 4 },
    { "date": "01-15", "count": 6 },
    { "date": "01-16", "count": 1 }
  ]
}
```

## 2. LNG储罐监控 (LngTankDashboard) 接口

### 2.1 获取储罐类型分布

**接口地址**: `GET /lng-tank/types`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "name": "低温储罐", "value": 4 },
    { "name": "常温储罐", "value": 2 },
    { "name": "高压储罐", "value": 1 },
    { "name": "缓冲罐", "value": 1 }
  ]
}
```

### 2.2 获取储罐液位监控数据

**接口地址**: `GET /lng-tank/level-data`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "name": "LNG储罐液位监控",
    "timeData": ["10:00", "10:05", "10:10", "10:15", "10:20"],
    "unit": "%",
    "seriesData": [85.2, 84.8, 84.5, 84.1, 83.8]
  }
}
```

### 2.3 获取储罐压力监控数据

**接口地址**: `GET /lng-tank/pressure-data`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "timeData": ["10:00", "10:05", "10:10", "10:15", "10:20"],
    "series": [
      {
        "name": "#1储罐压力",
        "data": [0.08, 0.081, 0.079, 0.082, 0.080],  // 压力值 (MPa)
        "unit": "MPa"
      }
    ]
  }
}
```

### 2.4 获取储罐温度监控数据

**接口地址**: `GET /lng-tank/temperature-data`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "timeData": ["10:00", "10:05", "10:10", "10:15", "10:20"],
    "series": [
      {
        "name": "储罐温度",
        "data": [-162.1, -162.3, -161.9, -162.0, -162.2],  // 温度值 (℃)
        "unit": "℃"
      }
    ]
  }
}
```

## 3. 汽化器监控 (VaporizerDashboard) 接口

### 3.1 获取强制汽化器进口压力数据

**接口地址**: `GET /vaporizer/inlet-pressure`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "timeData": ["09:00", "09:05", "09:10", "09:15", "09:20"],
    "series": [
      {
        "name": "进口压力",
        "data": [245.2, 246.1, 244.8, 245.5, 246.0],  // 压力值 (kPa)
        "unit": "kPa"
      }
    ]
  }
}
```

### 3.2 获取空温汽化器出口温度数据

**接口地址**: `GET /vaporizer/outlet-temperature`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "timeData": ["09:00", "09:05", "09:10", "09:15", "09:20"],
    "series": [
      {
        "name": "出口温度",
        "data": [15.2, 15.8, 14.9, 15.5, 15.3],  // 温度值 (℃)
        "unit": "℃"
      }
    ]
  }
}
```

### 3.3 获取汽化器效率数据

**接口地址**: `GET /vaporizer/efficiency`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "timeData": ["09:00", "09:05", "09:10", "09:15", "09:20"],
    "series": [
      {
        "name": "汽化效率",
        "data": [95.2, 95.8, 94.9, 95.5, 95.3],  // 效率百分比
        "unit": "%"
      }
    ]
  }
}
```

## 4. 实时监控 (RealTimeMonitor) 接口

### 4.1 获取实时设备列表

**接口地址**: `GET /realtime/equipment-list`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "试验深冷式再液化装置",
      "status": "running",           // 设备状态：running/standby/maintenance
      "statusText": "正常运行",
      "type": "再液化装置",
      "lastUpdate": "2024-01-15T10:30:00.000Z",
      "parameters": [
        {
          "label": "进口压力",
          "value": 0.25,
          "unit": "MPa",
          "key": "inletPressure"
        },
        {
          "label": "进口温度",
          "value": -162.5,
          "unit": "℃",
          "key": "inletTemp"
        }
      ]
    }
  ]
}
```

### 4.2 获取实时温度监控数据

**接口地址**: `GET /realtime/temperature`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "timeData": ["10:25", "10:26", "10:27", "10:28", "10:29", "10:30"],
    "series": [
      {
        "name": "LNG储罐",
        "data": [-162.1, -162.3, -161.9, -162.0, -162.2, -162.1],
        "unit": "℃"
      },
      {
        "name": "汽化器入口",
        "data": [-158.5, -158.7, -158.3, -158.6, -158.4, -158.5],
        "unit": "℃"
      },
      {
        "name": "汽化器出口",
        "data": [15.2, 15.4, 15.1, 15.3, 15.2, 15.1],
        "unit": "℃"
      }
    ]
  }
}
```

### 4.3 获取实时压力监控数据

**接口地址**: `GET /realtime/pressure`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "timeData": ["10:25", "10:26", "10:27", "10:28", "10:29", "10:30"],
    "series": [
      {
        "name": "系统压力",
        "data": [0.25, 0.251, 0.249, 0.252, 0.250, 0.251],
        "unit": "MPa"
      }
    ]
  }
}
```

## 5. 历史数据分析 (HistoryAnalysis) 接口

### 5.1 获取设备列表

**接口地址**: `GET /history/equipment-list`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "试验深冷式再液化装置",
      "type": "multi-param",
      "parameters": [
        { "label": "进口压力", "unit": "MPa", "key": "inletPressure" },
        { "label": "进口温度", "unit": "℃", "key": "inletTemp" },
        { "label": "出口压力", "unit": "MPa", "key": "outletPressure" },
        { "label": "出口温度", "unit": "℃", "key": "outletTemp" }
      ]
    }
  ]
}
```

### 5.2 获取历史数据

**接口地址**: `GET /history/data`

**请求参数**:
- `equipmentId` (必需): 设备ID
- `startTime` (可选): 开始时间，ISO格式
- `endTime` (可选): 结束时间，ISO格式
- `interval` (可选): 时间间隔，'1h'/'6h'/'1d'，默认'1d'

**说明**: 该接口会返回指定设备的所有监控参数的历史数据，数据格式统一为多参数格式。

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "equipmentId": 1,
    "equipmentName": "试验深冷式再液化装置",
    "equipmentType": "再液化装置",
    "timeRange": {
      "start": "2024-01-14T00:00:00.000Z",
      "end": "2024-01-15T00:00:00.000Z"
    },
    "interval": "1h",
    "timeData": ["00:00", "01:00", "02:00", "03:00", "04:00"],
    "series": [
      {
        "name": "进口压力",
        "key": "inletPressure",
        "unit": "MPa",
        "values": [0.25, 0.251, 0.249, 0.252, 0.250],
        "statistics": {
          "min": 0.249,
          "max": 0.252,
          "avg": 0.2504,
          "count": 24
        }
      },
      {
        "name": "进口温度",
        "key": "inletTemp",
        "unit": "℃",
        "values": [-162.5, -163.1, -161.8, -162.9, -163.2],
        "statistics": {
          "min": -163.2,
          "max": -161.8,
          "avg": -162.7,
          "count": 24
        }
      },
      {
        "name": "出口压力",
        "key": "outletPressure",
        "unit": "MPa",
        "values": [0.20, 0.201, 0.199, 0.202, 0.200],
        "statistics": {
          "min": 0.199,
          "max": 0.202,
          "avg": 0.2004,
          "count": 24
        }
      },
      {
        "name": "出口温度",
        "key": "outletTemp",
        "unit": "℃",
        "values": [-156.5, -157.1, -155.8, -156.9, -157.2],
        "statistics": {
          "min": -157.2,
          "max": -155.8,
          "avg": -156.7,
          "count": 24
        }
      }
    ]
  }
}
```

## 6. WebSocket测试 (WebSocketTest) 接口

### 6.1 WebSocket连接信息

**连接地址**: `ws://localhost:8080`

**消息格式**:
```json
{
  "type": "update",                    // 消息类型：initial/update/ping/pong
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": [
    {
      "id": 1,
      "name": "试验深冷式再液化装置",
      "status": "running",
      "statusText": "正常运行",
      "lastUpdate": "2024-01-15T10:30:00.000Z",
      "parameters": [
        {
          "label": "进口压力",
          "value": 0.25,
          "unit": "MPa",
          "key": "inletPressure"
        }
      ]
    }
  ]
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 503 | 服务不可用 |

## 数据字段说明

### 设备状态枚举
- `running`: 运行中
- `standby`: 待机
- `maintenance`: 维护中
- `error`: 故障

### 参数类型说明
- **压力**: 单位MPa或kPa，精度到小数点后3位
- **温度**: 单位℃，精度到小数点后1位
- **液位**: 百分比，精度到小数点后1位
- **流量**: 单位m³/h，精度到小数点后1位
- **转速**: 单位rpm，整数
- **电流**: 单位A，精度到小数点后1位

## 注意事项

1. 所有时间戳均使用UTC时间格式
2. 数值类型字段可能为null，前端需要做空值处理
3. WebSocket连接支持自动重连机制
4. 历史数据查询建议限制时间范围，避免数据量过大
5. 实时数据更新频率为2秒一次

---

**文档版本**: v1.0  
**更新时间**: 2024-01-15  
**维护人员**: 开发团队