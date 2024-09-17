import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

//导入路由配置
import router from './router'
app.use(router)

//引入ElementPlus的css文件
import 'element-plus/dist/index.css'

//引入ElementUI组件库
import ElementPlus from 'element-plus'

//使用ElementPlus自带的图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')