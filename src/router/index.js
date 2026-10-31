import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  // 音乐页按需加载，首页不为它买单
  { path: '/music', name: 'music', component: () => import('../views/Music.vue') },
]

// 站点托管在 GitHub Pages 子路径下，静态托管没有服务端回退，history 模式刷新或直达会 404，
// 故用 hash 模式，路由信息不再参与真实路径解析
export default createRouter({
  history: createWebHashHistory(),
  routes,
})
