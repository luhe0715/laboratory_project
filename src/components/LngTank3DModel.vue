<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const containerRef = ref(null);
let scene, camera, renderer, controls, tank, liquid;
let animationFrameId = null;

// 创建LNG储罐3D模型
const createLngTankModel = () => {
  // 创建储罐主体
  const tankGeometry = new THREE.CylinderGeometry(5, 5, 12, 32);
  const tankMaterial = new THREE.MeshPhongMaterial({
    color: 0x0a2e5c,
    shininess: 30,
    specular: 0x111111,
    transparent: true,
    opacity: 0.9
  });
  tank = new THREE.Mesh(tankGeometry, tankMaterial);
  scene.add(tank);

  // 创建储罐顶部
  const topGeometry = new THREE.SphereGeometry(5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4);
  const topMaterial = new THREE.MeshPhongMaterial({
    color: 0x0f3058,
    shininess: 30,
    specular: 0x111111
  });
  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.y = 6;
  scene.add(top);

  // 创建储罐底部
  const bottomGeometry = new THREE.SphereGeometry(5, 32, 16, 0, Math.PI * 2, Math.PI * 3/4, Math.PI / 4);
  const bottomMaterial = new THREE.MeshPhongMaterial({
    color: 0x0f3058,
    shininess: 30,
    specular: 0x111111
  });
  const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.position.y = -6;
  scene.add(bottom);

  // 创建液体
  const liquidGeometry = new THREE.CylinderGeometry(4.5, 4.5, 8, 32);
  const liquidMaterial = new THREE.MeshPhongMaterial({
    color: 0x4992ff,
    transparent: true,
    opacity: 0.7,
    shininess: 90,
    specular: 0x333333
  });
  liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquid.position.y = -2; // 液位位置
  scene.add(liquid);

  // 创建进液管道
  const inletPipeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
  const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0x3a8ee6 });
  const inletPipe = new THREE.Mesh(inletPipeGeometry, pipeMaterial);
  inletPipe.rotation.z = Math.PI / 2;
  inletPipe.position.set(-8, -4, 0);
  scene.add(inletPipe);

  // 创建出液管道
  const outletPipeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
  const outletPipe = new THREE.Mesh(outletPipeGeometry, pipeMaterial);
  outletPipe.rotation.z = Math.PI / 2;
  outletPipe.position.set(8, 2, 0);
  scene.add(outletPipe);

  // 创建阀门
  const valveGeometry = new THREE.SphereGeometry(0.8, 16, 16);
  const valveMaterial = new THREE.MeshPhongMaterial({ color: 0xff6e76 });
  const inletValve = new THREE.Mesh(valveGeometry, valveMaterial);
  inletValve.position.set(-11, -4, 0);
  scene.add(inletValve);

  const outletValve = new THREE.Mesh(valveGeometry, valveMaterial);
  outletValve.position.set(11, 2, 0);
  scene.add(outletValve);

  // 创建支架
  const supportGeometry = new THREE.BoxGeometry(14, 0.5, 14);
  const supportMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const support = new THREE.Mesh(supportGeometry, supportMaterial);
  support.position.y = -12;
  scene.add(support);

  // 添加标签
  createLabel('LNG储罐', 0, 8, 0);
  createLabel('进液口', -11, -6, 0);
  createLabel('出液口', 11, 0, 0);
};

// 创建3D文本标签
const createLabel = (text, x, y, z) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 128;
  
  context.fillStyle = 'rgba(0, 0, 0, 0)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  context.font = 'Bold 24px Arial';
  context.fillStyle = '#58d9f9';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.position.set(x, y, z);
  sprite.scale.set(5, 2.5, 1);
  scene.add(sprite);
};

// 初始化Three.js场景
const initThreeJS = () => {
  if (!containerRef.value) return;
  
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x051a38);
  
  // 创建相机
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 30);
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  containerRef.value.appendChild(renderer.domElement);
  
  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // 添加光源
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);
  
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight1.position.set(10, 10, 10);
  scene.add(directionalLight1);
  
  const directionalLight2 = new THREE.DirectionalLight(0x58d9f9, 0.5);
  directionalLight2.position.set(-10, -10, -10);
  scene.add(directionalLight2);
  
  // 创建LNG储罐模型
  createLngTankModel();
  
  // 动画循环
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    controls.update();
    
    // 旋转模型
    tank.rotation.y += 0.002;
    liquid.rotation.y += 0.002;
    
    renderer.render(scene, camera);
  };
  
  animate();
  
  // 处理窗口大小变化
  const handleResize = () => {
    if (!containerRef.value) return;
    
    const width = containerRef.value.clientWidth;
    const height = containerRef.value.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  
  window.addEventListener('resize', handleResize);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (containerRef.value && renderer) {
      containerRef.value.removeChild(renderer.domElement);
    }
    
    // 释放资源
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    scene = null;
    camera = null;
    renderer = null;
    controls = null;
  };
};

// 组件挂载时初始化
onMounted(() => {
  const cleanup = initThreeJS();
  
  // 组件卸载前清理资源
  onBeforeUnmount(() => {
    if (cleanup) cleanup();
  });
});
</script>

<template>
  <div class="model-container" ref="containerRef"></div>
</template>

<style scoped>
.model-container {
  width: 100%;
  height: 100%;
  background-color: var(--secondary-bg);
  border-radius: 4px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}
</style>