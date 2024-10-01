<template>
  <div class="site-wrapper"
       :class="{ 'site-sidebar--fold': sidebar.sidebarFold }"
       v-loading.fullscreen.lock="loading" element-loading-text="Loading...">
    <nav class="site-navbar"
         :class="{ 'site-navbar--fold': sidebar.sidebarFold }">
      <div class="site-navbar__header">
        <h1 class="site-navbar__brand">
          <a class="site-navbar__brand-lg">Fair Tracker</a>
          <a class="site-navbar__brand-mini">Fair</a>
        </h1>
      </div>
      <div class="navbar-container"
           :class="{'navbar-container--fold': sidebar.sidebarFold}">
        <div class="switch" @click="handleSwitch">
          <SvgIcon name="zhedie" class="icon-svg" />
        </div>
        <div class="right-container">
          <el-dropdown>
						<span class="el-dropdown-link">
							<span class="avatar-container">
								<el-avatar shape="circle" :size="25"
                           :src="user.photo"
                           :icon="UserFilled"></el-avatar>
							</span>
							{{ user.name }}
						</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">Log Out</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </nav>
    <!-- 避免路由引用页面的时候浏览器不刷新内容，所以给URL添加随机数参数 -->
    <router-view :key="router.currentRoute.value.query.random" />
  </div>
</template>

<script setup lang="ts">
  import { UserFilled } from '@element-plus/icons-vue';
  import { isURL } from '@/utils/validate';
  import { ref, reactive, provide, getCurrentInstance, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {Component, defineComponent, watch} from 'vue';
  import localStorageUtil from "@/utils/localStorageUtil.ts";
  import LocalStorageUtil from "@/utils/localStorageUtil.ts";

  //用于获取路由参数
  const route = useRoute();
  //用于切换路由引用的页面
  const router = useRouter();
  const { proxy } = getCurrentInstance();

  //左边栏常量
  const sidebar = reactive({
    //是否折叠左边栏
    sidebarFold: false,
    sidebarLayoutSkin: 'dark'
  });

  //内容区相关常量（后续用到）
  const siteContent = reactive({
    documentClientHeight: 0,
    siteContentViewHeight: {},
    height: null,
    mainTabs: [],
    mainTabsActiveName: '',
    menuActiveName: ''
  });

  //用户信息常量
  const user = reactive({
    name: localStorageUtil.get("username").split("@")[0],
    photo: '',
  });

  //退出登录
  const logout = () => {
    proxy.$http("/user/logout", "GET", null, true, resp => {
      localStorageUtil.remove('token'); //销毁令牌
      localStorageUtil.remove('role'); //销毁权限

      //跳转到登录页面
      router.push({ name: 'Login' });
    })
  }
</script>

<style scoped lang="scss">
  @import '@/assets/scss/index.scss';

  .avatar-container {
    vertical-align: -8px;
    margin-right: 5px;
  }
</style>