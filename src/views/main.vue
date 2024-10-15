<template>
  <!-- header -->
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
          <el-icon class="icon-svg"><Menu /></el-icon>
        </div>
        <div class="right-container">
          <el-dropdown>
						<span class="el-dropdown-link">
							<span class="avatar-container">
								<el-avatar shape="circle" :size="25" :src="localAvatar"></el-avatar>
							</span>
							{{ username }}
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

    <!-- 左侧导航 -->
    <aside class="site-sidebar site-sidebar--dark">
      <div class="site-sidebar__inner">
        <el-menu :default-active="siteContent.menuActiveName || 'Home'"
                 :collapse="sidebar.sidebarFold" :collapseTransition="false"
                 background-color="#263238"
                 active-text-color="#fff" text-color="#8a979e">

          <!-- 一级路由：没有子路由 -->
          <el-menu-item index="Home" @click="$router.push({ name: 'Home' })" >
            <el-icon class="icon-svg">
              <HomeFilled />
            </el-icon>
            <span slot="title">Home</span>
          </el-menu-item>

          <!-- 一级路由：含有子路由 -->
          <el-sub-menu index="Fair Tracker" :popper-class="'site-sidebar--' + sidebar.sidebarLayoutSkin + '-popper'">

            <template #title>
              <el-icon class="icon-svg">
                <Compass />
              </el-icon>
              <span slot="title">Tracker</span>
            </template>

            <!-- 子路由1 -->
            <el-menu-item index="Fair" @click="$router.push({ name: 'Fair' })">
              <el-icon class="icon-svg">
                <InfoFilled />
              </el-icon>
              <span slot="title">Main</span>
            </el-menu-item>

            <!-- 子路由2 -->
            <el-menu-item index="Approved" @click="$router.push({ name: 'approvedFair'})">
              <el-icon class="icon-svg">
                <SuccessFilled />
              </el-icon>
              <span slot="title">Approved</span>
            </el-menu-item>

          </el-sub-menu>

        </el-menu>
      </div>
    </aside>

    <div class="site-content__wrapper">
      <main class="site-content"
            :class="{ 'site-content--tabs': $route.meta.isTab }">
        <!-- 面包屑 -->
        <el-tabs v-if="$route.meta.isTab"
                 v-model="siteContent.mainTabsActiveName" :closable="true"
                 @tab-click="selectedTabHandle"
                 @tab-remove="removeTabHandle">
          <el-tab-pane v-for="item in siteContent.mainTabs"
                       :label="item.title" :name="item.name">
            <el-card
                :body-style="siteContent.siteContentViewHeight">
              <!-- 路由页面 -->
              <router-view :key="router.currentRoute.value.query.random" />
            </el-card>
          </el-tab-pane>
        </el-tabs>
        <el-card v-else :body-style="siteContent.siteContentViewHeight">
          <!-- 避免路由引用页面的时候浏览器不刷新内容，所以给URL添加随机数参数 -->
          <router-view :key="router.currentRoute.value.query.random" />
        </el-card>
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { UserFilled } from '@element-plus/icons-vue';
  import { isURL } from '@/utils/validate';
  import { ref, reactive, provide, getCurrentInstance, onMounted, Component, defineComponent, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import localStorageUtil from "@/utils/localStorageUtil.ts";
  import {Menu, HomeFilled , Compass, InfoFilled, SuccessFilled} from '@element-plus/icons-vue'

  //用于获取路由参数
  const route = useRoute();

  let username = null;

  onMounted(() => {
    username = route.query.username?.split("@")[0];
  })

  //用于切换路由引用的页面
  const router = useRouter();
  const { proxy } = getCurrentInstance();

  const localAvatar = ref("/avatar.gif");

  const loading = ref(false);

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

  //退出登录
  const logout = () => {
    proxy.$http("/user/logout", "GET", null, true, resp => {
      localStorageUtil.remove('token'); //销毁令牌
      localStorageUtil.remove('role'); //销毁权限

      //跳转到登录页面
      router.push({ name: 'Login' });
    })
  }

  // 新添加内容
  function routeHandle(route) {
    resetDocumentClientHeight()
    loadSiteContentViewHeight()
    //判断是否要创建Tab控件
    if (route.meta.isTab) {
      /* 创建Tab控件之前，先判断mainTabs[]数组中是否存在该Vue页面的Tab控件。
       * 比如我们要访问角色管理页面，程序先要判断是否存在角色管理页面的Tab控件。
       * 如果不存在就创建Tab控件；如果存在就不创建新的Tab控件，直接切换到现有的Tab控件
       */
      let tab = siteContent.mainTabs.filter(item => item.name === route.name)[0];
      if (tab == null) {
        tab = {
          title: route.meta.title,
          name: route.name
        };
        siteContent.mainTabs.push(tab);
      }
      //选中某个Tab控件
      siteContent.mainTabsActiveName = tab.name;
      //选中某个菜单项
      siteContent.menuActiveName = tab.name;
    } else {
      siteContent.mainTabs = []
      //取消选中某个Tab控件
      siteContent.mainTabsActiveName = "";
      //选中某个菜单项
      siteContent.menuActiveName = "Home";
    }
  }

  /*
   * 载入框架页面就立即执行routeHandle()函数，把当前路由加载页面对应的Tab控件选中
   * 例如直接访问http://localhost:7600/mis/role页面，需要让框架页面创建Tab控件，并且选中该Tab
   */
  routeHandle(route)

  /*
   * 框架页面的路由标签每次切换引用的页面，就调用routeHandle()，
   * 判断一下是创建新的Tab控件，还是切换到现有的Tab控件
   */
  watch(
      () => router,
      () => {
        routeHandle(route);
      },
      { immediate: true, deep: true }
  );

  //计算网页可见区域的高度
  function resetDocumentClientHeight() {
    siteContent.documentClientHeight = document.documentElement.clientHeight
  }

  //计算内容区卡片的高度
  function loadSiteContentViewHeight() {
    //卡片控件高度 = 网页可见区域高度 - 导航区高度 - 卡片控件上下外填充 - 上下边框
    let height = siteContent.documentClientHeight - 50 - 30 - 2;
    if (route.meta.isTab) {
      //如果引用的页面需要Tab控件，还要再减40像素
      height -= 40;
    }
    siteContent.height = height
    //声明CSS样式
    siteContent.siteContentViewHeight = { minHeight: height + "px" }
  }

  //浏览器尺寸变化的回调函数
  window.onresize = () => {
    siteContent.documentClientHeight = document.documentElement.clientHeight
    loadSiteContentViewHeight()
  }

  function selectedTabHandle(tab) {
    router.push({
      name: tab.paneName
    });
  }

  function removeTabHandle(tabName) {
    //让mainTabs数组剔除要关闭的Tab
    siteContent.mainTabs = siteContent.mainTabs.filter(item => item.name !== tabName);
    //如果还存在剩余的Tab，就切换到最后的Tab上面
    if (siteContent.mainTabs.length >= 1) {
      //获取mainTabs数组最后一个元素
      let tab = siteContent.mainTabs[siteContent.mainTabs.length - 1];
      //选中这个Tab控件
      siteContent.mainTabsActiveName = tab.name;
      //内容区切换引用的页面
      router.push({ name: tab.name });
    } else {
      siteContent.mainTabsActiveName = '';
      router.push({ name: 'Home' });
    }
  }

  function handleSwitch() {
    sidebar.sidebarFold = !sidebar.sidebarFold;
  }
</script>

<style scoped lang="scss">
  @import '@/assets/scss/index.scss';

  .avatar-container {
    vertical-align: -8px;
    margin-right: 5px;
  }
</style>