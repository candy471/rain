<script setup>
import { useRouter } from 'vue-router'
import bgUrl from '../assets/bg.jpg'

const router = useRouter()

function handleEnter() {
  router.push('/music')
}
</script>

<template>
  <div class="stage" :style="{ backgroundImage: `url(${bgUrl})` }">
    <!-- 彩色光晕垫在按钮下面，backdrop-filter 才能把它糊掉 -->
    <div class="glow glow--violet" aria-hidden="true"></div>
    <div class="glow glow--cyan" aria-hidden="true"></div>

    <button class="glass-button" type="button" @click="handleEnter">
      welcome to my world
    </button>
  </div>
</template>

<style scoped>
.stage {
  /* 脱离 #app 的固定宽度/边框约束，直接铺满视口 */
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: clamp(32px, 8vh, 96px);
  box-sizing: border-box;
  overflow: hidden;
  background-position: center;
  background-size: cover; /* cover 保持比例，裁切不拉伸 */
  background-repeat: no-repeat;
}

/* 背景底片本身就偏白偏蓝，光晕只做极淡的一层，避免糊成一片脏色 */
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}

.glow--violet {
  width: 460px;
  height: 320px;
  bottom: 1vh;
  left: 50%;
  transform: translateX(-78%);
  background: rgba(168, 85, 247, 0.26);
}

.glow--cyan {
  width: 400px;
  height: 280px;
  bottom: 3vh;
  left: 50%;
  transform: translateX(-12%);
  background: rgba(34, 211, 238, 0.2);
}

.glass-button {
  position: relative;
  z-index: 1;
  padding: 15px 40px;
  max-width: calc(100vw - 48px);
  font-family: inherit;
  font-size: clamp(15px, 1.6vw, 18px);
  letter-spacing: 0.08em;
  white-space: nowrap;
  color: #fff;
  cursor: pointer;

  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.18);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0));
  /* 照片底部是深蓝海面，紫/青辉光必须提亮才看得出来 */
  box-shadow:
    0 8px 28px rgba(15, 23, 42, 0.3),
    0 0 24px rgba(192, 132, 252, 0.55),
    0 0 64px rgba(103, 232, 249, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);

  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);

  transition:
    transform 0.25s ease,
    background-color 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

/* 渐变色细边：靠 mask 只留 1px 环形，深色/浅色背景上都看得见 */
.glass-button::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.95), rgba(103, 232, 249, 0.95));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
}

.glass-button:hover {
  transform: scale(1.06);
  background-color: rgba(255, 255, 255, 0.32);
  border-color: rgba(255, 255, 255, 0.85);
  box-shadow:
    0 12px 36px rgba(15, 23, 42, 0.32),
    0 0 34px rgba(216, 180, 254, 0.8),
    0 0 84px rgba(103, 232, 249, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.glass-button:active {
  transform: scale(1.02);
}

.glass-button:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.9);
  outline-offset: 3px;
}
</style>
