/**
 * API接口工具类
 * 提供统一的API请求方法和错误处理
 */

import axios from 'axios';
import { ElMessage } from 'element-plus';

// API配置
const API_CONFIG = {
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
};

// 创建axios实例
const api = axios.create(API_CONFIG);

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    const { code, message, data } = response.data;
    if (code !== 200) {
      ElMessage.error(message || '请求失败');
      return Promise.reject(new Error(message));
    }
    return data;
  },
  error => {
    let errorMessage = '网络请求失败';
    if (error.response) {
      errorMessage = `请求失败: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查API服务器是否启动';
    }
    ElMessage.error(errorMessage);
    return Promise.reject(error);
  }
);

// API接口定义
export const dashboardAPI = {
  // 获取实验室基本信息
  getLabInfo: () => api.get('/dashboard/lab-info'),
  
  // 获取设备状态统计
  getEquipmentStatus: () => api.get('/dashboard/equipment-status'),
  
  // 获取设备类型分布
  getEquipmentTypes: () => api.get('/dashboard/equipment-types'),
  
  // 获取告警趋势数据
  getAlarmTrend: () => api.get('/dashboard/alarm-trend')
};

export const lngTankAPI = {
  // 获取储罐类型分布
  getTypes: () => api.get('/lng-tank/types'),
  
  // 获取储罐液位数据
  getLevelData: () => api.get('/lng-tank/level-data'),
  
  // 获取储罐压力数据
  getPressureData: () => api.get('/lng-tank/pressure-data'),
  
  // 获取储罐温度数据
  getTemperatureData: () => api.get('/lng-tank/temperature-data')
};

export const vaporizerAPI = {
  // 获取进口压力数据
  getInletPressure: () => api.get('/vaporizer/inlet-pressure'),
  
  // 获取出口温度数据
  getOutletTemperature: () => api.get('/vaporizer/outlet-temperature'),
  
  // 获取汽化效率数据
  getEfficiency: () => api.get('/vaporizer/efficiency')
};

export const realtimeAPI = {
  // 获取实时设备列表
  getEquipmentList: () => api.get('/realtime/equipment-list'),
  
  // 获取实时温度数据
  getTemperature: () => api.get('/realtime/temperature'),
  
  // 获取实时压力数据
  getPressure: () => api.get('/realtime/pressure')
};

export const historyAPI = {
  // 获取设备列表
  getEquipmentList: () => api.get('/history/equipment-list'),
  
  // 获取历史数据
  getData: (params) => api.get('/history/data', { params })
};

// 数据缓存类
class DataCache {
  constructor() {
    this.cache = new Map();
    this.defaultExpireTime = 5 * 60 * 1000; // 5分钟默认过期时间
  }
  
  /**
   * 设置缓存
   * @param {string} key 缓存键
   * @param {any} data 缓存数据
   * @param {number} expireTime 过期时间（毫秒）
   */
  set(key, data, expireTime = this.defaultExpireTime) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expireTime
    });
  }
  
  /**
   * 获取缓存
   * @param {string} key 缓存键
   * @returns {any|null} 缓存数据或null
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.expireTime) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  /**
   * 删除缓存
   * @param {string} key 缓存键
   */
  delete(key) {
    this.cache.delete(key);
  }
  
  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear();
  }
}

// 创建缓存实例
export const dataCache = new DataCache();

/**
 * 带缓存的API请求
 * @param {string} cacheKey 缓存键
 * @param {Function} apiFunction API请求函数
 * @param {number} expireTime 缓存过期时间
 * @returns {Promise} API响应数据
 */
export async function cachedRequest(cacheKey, apiFunction, expireTime) {
  // 先尝试从缓存获取
  const cachedData = dataCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // 缓存不存在或已过期，发起API请求
  try {
    const data = await apiFunction();
    dataCache.set(cacheKey, data, expireTime);
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * 轮询请求
 * @param {Function} apiFunction API请求函数
 * @param {number} interval 轮询间隔（毫秒）
 * @param {Function} callback 数据回调函数
 * @returns {Function} 停止轮询的函数
 */
export function startPolling(apiFunction, interval, callback) {
  let isPolling = true;
  
  const poll = async () => {
    if (!isPolling) return;
    
    try {
      const data = await apiFunction();
      callback(data);
    } catch (error) {
      console.error('轮询请求失败:', error);
    }
    
    if (isPolling) {
      setTimeout(poll, interval);
    }
  };
  
  // 立即执行第一次请求
  poll();
  
  // 返回停止轮询的函数
  return () => {
    isPolling = false;
  };
}

// 导出默认的api实例
export default api;