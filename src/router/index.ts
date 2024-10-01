// RouteRecordRaw: 作为数组泛型来使用
import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
const history = createWebHistory();

const routes: Array<RouteRecordRaw> = [
    {
        path: '/', //url地址可以自定义
        name: 'Login', //也可以自定义
        component: () => import('../views/login/login.vue')
    },
    {
        path: '/main', //url地址可以自定义
        name: 'Main', //也可以自定义
        component: () => import('../views/main.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/404.vue')
    },
    { //如果访问地址没有对应的url页面，则重定向到404页面
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
]

const router = createRouter({
    history,
    routes
})

export default router