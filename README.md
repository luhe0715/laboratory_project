# LNG实验室监控系统

一个基于Vue 3 + Vite构建的LNG（液化天然气）实验室设备监控与数据可视化系统。该系统提供实时监控、历史数据分析、3D可视化和WebSocket实时通信等功能。

## 🚀 项目特性

### 核心功能
- **实时监控** - 26台实验室设备的实时状态监控
- **数据可视化** - 基于ECharts的多维度数据图表展示
- **3D模型** - Three.js构建的LNG储罐3D可视化模型
- **历史分析** - 设备历史数据查询与趋势分析
- **WebSocket通信** - 实时数据推送与双向通信
- **响应式设计** - 适配不同屏幕尺寸的现代化UI

### 技术栈
- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **图表库**: ECharts + Vue-ECharts
- **3D渲染**: Three.js
- **路由管理**: Vue Router 4
- **实时通信**: WebSocket (ws库)
- **样式**: CSS3 (深蓝色主题)

## 📁 项目结构

```
laboratory_project/
├── src/
│   ├── components/          # Vue组件
│   │   ├── Dashboard.vue           # 主控制台
│   │   ├── LngTankDashboard.vue    # LNG储罐监控
│   │   ├── VaporizerDashboard.vue  # 汽化器监控
│   │   ├── RealTimeMonitor.vue     # 实时监控
│   │   ├── HistoryAnalysis.vue     # 历史数据分析
│   │   ├── LngTank3DModel.vue      # 3D储罐模型
│   │   └── WebSocketTest.vue       # WebSocket测试
│   ├── router/              # 路由配置
│   ├── assets/              # 静态资源
│   ├── App.vue              # 根组件
│   ├── main.js              # 应用入口
│   └── style.css            # 全局样式
├── websocket-server.js      # WebSocket服务器
├── package.json             # 项目配置
└── vite.config.js           # Vite配置
```

## 🛠️ 安装与运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
# 启动前端开发服务器
npm run dev

# 启动WebSocket服务器（可选）
npm run ws-server
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📊 系统模块

### 1. 主控制台 (Dashboard)
- 实验室基本信息展示
- 设备工作状态统计
- 设备类型分布饼图
- 近期告警趋势分析
- 设备列表实时状态

### 2. LNG储罐监控 (LngTankDashboard)
- 储罐类型分布统计
- 液位监控趋势图
- 压力监控数据
- 温度变化曲线
- 3D储罐模型展示

### 3. 汽化器监控 (VaporizerDashboard)
- 强制汽化器进口压力监控
- 空温汽化器出口温度趋势
- 汽化器效率分析
- 多参数对比图表

### 4. 实时监控 (RealTimeMonitor)
- 26台设备实时状态
- 温度、压力、液位等关键参数
- 实时数据更新
- 设备状态告警

### 5. 历史数据分析 (HistoryAnalysis)
- 设备历史数据查询
- 多时间段数据对比
- 趋势分析与预测
- 数据导出功能

### 6. WebSocket实时通信 (WebSocketTest)
- 实时数据推送测试
- 连接状态监控
- 消息日志记录
- 性能统计分析

## 🎨 设计特色

### 视觉设计
- **深蓝色主题**: 专业的工业监控界面风格
- **响应式布局**: 适配桌面端和移动端
- **现代化UI**: 基于Element Plus的组件设计
- **数据可视化**: 丰富的图表类型和交互效果

### 用户体验
- **直观导航**: 清晰的页面结构和导航逻辑
- **实时反馈**: 即时的数据更新和状态提示
- **交互友好**: 流畅的动画效果和操作反馈

## 🔧 配置说明

### WebSocket配置
- 服务器端口: 8080
- 数据推送频率: 2秒/次
- 支持多客户端连接
- 自动心跳检测

### 开发服务器
- 前端端口: 5173
- 热重载支持
- 开发工具集成

## 📈 监控设备

系统监控26台实验室设备，涵盖再液化装置、储罐、输送泵、汽化器、压缩机、分离器等各类LNG处理设备。

## 🚀 未来规划

- [ ] 添加用户权限管理
- [ ] 集成数据库存储
- [ ] 增加移动端适配
- [ ] 实现数据导出功能
- [ ] 添加告警推送机制
- [ ] 优化3D模型性能
- [ ] 增加更多图表类型

## 📄 许可证

本项目仅供学习和研究使用。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

---

**注意**: 本系统为实验室监控演示项目，所有数据均为模拟数据，仅用于展示系统功能。
