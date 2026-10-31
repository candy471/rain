<script setup>
import { computed, nextTick, ref } from 'vue'
import { RouterLink } from 'vue-router'
import bgUrl from '../assets/bg1.jpg'
import { musicList } from '../musicData'

const audioEl = ref(null)
const currentId = ref(0) // 0 表示尚未选中任何一首
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const currentSong = computed(() => musicList.find((item) => item.id === currentId.value))
const progress = computed(() => (duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0))

// 纵向滚轮默认只滚页面，横向容器不会响应，所以手动映射到 scrollLeft
function handleWheel(event) {
  event.currentTarget.scrollLeft += event.deltaY
}

function togglePlay() {
  const el = audioEl.value
  if (!el || !currentSong.value) return
  if (el.paused) el.play()
  else el.pause()
}

function syncDuration() {
  duration.value = audioEl.value?.duration || 0
}

function syncTime() {
  currentTime.value = audioEl.value?.currentTime ?? 0
}

// 拖动时同时写回 ref，否则受控 value 会被下一次 timeupdate 拉回去
function handleSeek(event) {
  const el = audioEl.value
  if (!el) return
  el.currentTime = Number(event.target.value)
  currentTime.value = el.currentTime
}

// 点同一首切播放/暂停；点另一首先换源，等 :src 落到 <audio> 再从头播
async function handleCardClick(item) {
  if (item.id === currentId.value) {
    togglePlay()
    return
  }
  currentId.value = item.id
  currentTime.value = 0
  duration.value = 0
  await nextTick()
  audioEl.value?.play()
}
</script>

<template>
  <main class="page" :style="{ backgroundImage: `url(${bgUrl})` }">
    <RouterLink class="back-btn" to="/" aria-label="返回首页">←</RouterLink>

    <div class="gallery" @wheel="handleWheel">
      <ul class="track">
        <li v-for="item in musicList" :key="item.id" class="item">
          <button
            class="card"
            :class="{ 'is-active': item.id === currentId }"
            type="button"
            @click="handleCardClick(item)"
          >
            <img :src="item.cover" :alt="item.title" />
          </button>
        </li>
      </ul>
    </div>

    <audio
      ref="audioEl"
      :src="currentSong?.audio"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="isPlaying = false"
      @loadedmetadata="syncDuration"
      @durationchange="syncDuration"
      @timeupdate="syncTime"
    ></audio>

    <div class="player">
      <button class="player__toggle" type="button" :disabled="!currentSong" @click="togglePlay">
        <span class="player__icon">
          <svg v-if="isPlaying" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </span>
        <span class="player__label">{{ currentSong ? currentSong.title : '选择一首歌' }}</span>
      </button>

      <input
        class="player__progress"
        type="range"
        min="0"
        step="0.1"
        :max="duration"
        :value="currentTime"
        :style="{ '--progress': `${progress}%` }"
        :disabled="!currentSong"
        aria-label="播放进度"
        @input="handleSeek"
      />
    </div>
  </main>
</template>

<style scoped>
.page {
  position: fixed;
  inset: 0;
  /* 原图是竖构图，cover 会裁掉上下，只居中呈现中间色带且不变形 */
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

/* 液态玻璃胶囊：半透明白底 + backdrop 磨砂，靠细白边和柔和外阴影浮起来 */
.back-btn {
  position: absolute;
  top: 30px;
  left: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 不定宽高，靠 padding 撑成横向胶囊而不是圆形 */
  padding: 8px 20px;
  font-size: 18px;
  line-height: 1;
  color: #fff;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.back-btn:hover {
  transform: scale(1.05);
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.32);
}

.back-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.9);
  outline-offset: 3px;
}

/* 横向滚动容器：垂直居中，隐藏滚动条，滚轮交给 JS 映射 */
.gallery {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.gallery::-webkit-scrollbar {
  display: none;
}

.track {
  display: flex;
  gap: 20px;
  /* 上下 padding 留出悬停放大后的余量，否则会被 overflow 裁掉 */
  padding: 24px 30px;
  margin: 0;
  list-style: none;
  width: max-content;
}

/* 长方形卡片：高度定基准，宽度略大于高度；外围留 6px 作毛玻璃相框 */
.item {
  flex: 0 0 auto;
}

.card {
  --h: clamp(150px, 20vw, 240px);
  display: block;
  width: calc(var(--h) * 1.3);
  height: var(--h);
  padding: 6px;
  box-sizing: border-box;
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.28);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
}

.card:hover {
  transform: scale(1.06);
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.36);
}

.card.is-active {
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.55),
    0 14px 32px rgba(15, 23, 42, 0.36);
}

/* 底部播放器：与返回按钮同一套液态玻璃语言；内部再分「控制行 + 进度条」 */
.player {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  width: min(280px, calc(100vw - 60px));
  box-sizing: border-box;
  padding: 12px 22px 12px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

/* hover 要保留 translateX，否则胶囊会弹回中间偏右 */
.player:hover {
  transform: translateX(-50%) scale(1.03);
  background-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.32);
}

.player__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0;
  font-family: inherit;
  font-size: 15px;
  color: inherit;
  cursor: pointer;
  appearance: none;
  border: none;
  background: none;
}

.player__toggle:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.player__toggle:focus-visible,
.player__progress:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.9);
  outline-offset: 3px;
}

.player__icon {
  display: inline-flex;
}

/* 白色进度条：已播部分纯白，未播部分 30% 透明白 */
.player__progress {
  --progress: 0%;
  width: 100%;
  height: 14px;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.player__progress:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.player__progress::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    #fff var(--progress),
    rgba(255, 255, 255, 0.3) var(--progress)
  );
}

.player__progress::-webkit-slider-thumb {
  appearance: none;
  width: 10px;
  height: 10px;
  margin-top: -3px; /* 让 10px 圆点居中在 4px 轨道上 */
  border: none;
  border-radius: 50%;
  background: #fff;
}

.player__progress::-moz-range-track {
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.3);
}

.player__progress::-moz-range-progress {
  height: 4px;
  border-radius: 999px;
  background: #fff;
}

.player__progress::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50%;
  background: #fff;
}
</style>
