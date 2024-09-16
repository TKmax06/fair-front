// RouteRecordRaw: 作为数组泛型来使用
import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
const history = createWebHistory();

const routes: Array<RouteRecordRaw> = [
    {
        path: '/', //url地址可以自定义
        name: 'login', //也可以自定义
        component: () => import('../views/login/login.vue')
    },

]

const router = createRouter({
    history,
    routes
})

export default router