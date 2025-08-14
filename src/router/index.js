import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/Dashboard.vue';

// 懒加载路由组件
const LngTankDashboard = () => import('../components/LngTankDashboard.vue');
const VaporizerDashboard = () => import('../components/VaporizerDashboard.vue');
const RealTimeMonitor = () => import('../components/RealTimeMonitor.vue');
const HistoryAnalysis = () => import('../components/HistoryAnalysis.vue');
const WebSocketTest = () => import('../components/WebSocketTest.vue');

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/lng-tank',
    name: 'LngTankDashboard',
    component: LngTankDashboard
  },
  {
    path: '/vaporizer',
    name: 'VaporizerDashboard',
    component: VaporizerDashboard
  },
  {
    path: '/real-time',
    name: 'RealTimeMonitor',
    component: RealTimeMonitor
  },
  {
    path: '/history',
    name: 'HistoryAnalysis',
    component: HistoryAnalysis
  },
  {
    path: '/websocket-test',
    name: 'WebSocketTest',
    component: WebSocketTest
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;