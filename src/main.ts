import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

//导入路由配置
import router from './router'
app.use(router)

//导入SVG依赖库，可以在页面上显示SVG图片（此处为新增）
import 'virtual:svg-icons-register';

//引入ElementPlus的css文件
import 'element-plus/dist/index.css'

//引入ElementUI组件库
import ElementPlus from 'element-plus'

//使用ElementPlus自带的图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//导入JQuery库，因为Ajax用起来非常方便，支持同步和异步的Ajax请求
import $ from 'jquery';

//导入ElementUI的消息通知组件，下面封装全局Ajax的时候处理异常的时候需要弹出通知
import { ElMessage } from 'element-plus';

//后端项目的URL根路径(上传到服务器后一定要写IP!!!)
const baseUrl = 'http://localhost:7700/fair-api';
//const baseUrl = 'http://10.10.6.244:7700/fair-api';
//const baseUrl = 'https://43.153.8.245:7700/fair-api';
app.config.globalProperties.$baseUrl = baseUrl; //设置全局变量$baseUrl

//Minio服务器地址
const minioUrl = 'http://43.153.8.245:9000/fair';
//const minioUrl = 'http://10.10.6.244:9000/fair';
app.config.globalProperties.$minioUrl = minioUrl;

import localStorageUtil from "./utils/localStorageUtil.ts";

//封装全局Ajax公共函数
app.config.globalProperties.$http = function (url : string, method : string, data : JSON, async : boolean, fun : Function) {
    $.ajax({
        url: baseUrl + url,
        type: method,
        dataType: 'json',
        contentType: 'application/json',
        //上传的数据被序列化（允许Ajax上传数组）
        traditional: true, //true: 代表上传的数据已经被序列化
        xhrFields: {
            //允许Ajax请求跨域
            withCredentials: true
        },
        headers: {
            token: localStorageUtil.get('token')
        },
        async: async,
        data: JSON.stringify(data),
        success: function (resp : any) {
            if (resp.code == 200) {
                fun(resp);
            } else {
                ElMessage.error({
                    message: resp.msg,
                    duration: 1200
                });
            }
        },
        error: function (e : any) {
            //ajax有语法错误的时候
            if (e.status == undefined) {
                ElMessage.error({
                    message: 'Page Error',
                    duration: 1200
                });
            }
            else {
                const status = e.status;
                //没有登陆系统
                if (status == 401) {
                    //跳转到对应的登录页面
                    router.push({
                        name: 'Login'
                    });
                }
                else {
                    //后端没有运行，提交的数据有误，或者没有连接上后端项目
                    if (!e.hasOwnProperty('responseText')) {
                        ElMessage.error({
                            message: 'The backend project has not started, or the HTTP request type and parameters are incorrect',
                            duration: 1200
                        });
                    }
                    else {
                        ElMessage.error({
                            message: e.responseText,
                            duration: 1200
                        });
                    }
                }
            }
        }
    });
};

//封装用于判断用户是否具有某些权限的公共函数
app.config.globalProperties.isAuth = function (role : string[]) {
    const roles : string | null = localStorage.getItem('role');
    if (roles) {
        let flag = false;
        for (let one of role) {
            if (roles.includes(one)) {
                flag = true;
                break;
            }
        }
        return flag;
    } else { //如果roles为空
        return false;
    }
};

app.mount('#app')