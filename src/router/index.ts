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
        component: () => import('../views/main.vue'),
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/home/home.vue'),
                meta: {
                    title: 'Home' //标签文字
                }
            },
            {
                path: 'fair',
                name: 'Fair',
                component: () => import('../views/tracker/fair.vue'),
                meta: {
                    title: 'Main', //标签文字
                    isTab: true  //要用到tab控件
                }
            },
            {
                path: 'approved',
                name: 'approvedFair',
                component: () => import('../views/tracker/approved.vue'),
                meta: {
                    title: 'Approved Fair', //标签文字
                    isTab: true  //要用到tab控件
                }
            },
        ]
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

import localStorageUtil from "../utils/localStorageUtil";

router.beforeEach((to, from, next) => {
    let roles = localStorageUtil.get('role');
    let token = localStorageUtil.get('token');
    let fullPath = to.fullPath;
    if (fullPath.startsWith('/main') && fullPath != '/') {
        if (roles == null || roles == '' || token == null || token == '') {
            next({ name: 'Login' });
        } else {
            return next();
        }
    }
    return next();
});

export default router