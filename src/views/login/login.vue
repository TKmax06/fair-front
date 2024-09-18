<template>
  <div class="loginav">
    <div class="video"><video src="./img/video.mp4" muted autoplay loop></video></div>
    <div class=""></div>
    <div class="loginbox boxall">
      <div class="logo">
        <h1>CNO Fair</h1>
      </div>
      <div class="logintit">User Login</div>
      <ul class="logininput">
        <li>
          <i><img src="./img/user.png" alt=""></i>
          <input class="forminput" value="anye@celestica.com" v-model="loginForm.username"
                 type="text" placeholder="Email">
        </li>
        <li>
          <i><img src="./img/password.png" alt=""></i>
          <input class="forminput" type="password" value="111111" v-model="loginForm.password"
                 placeholder="Password">
        </li>


        <div class=" flex1">
          <label> <input type="checkbox" checked class="aui-checkbox">&nbsp;Remember me</label>
          <a href="#" class="text-primary"> Forget password？</a>
        </div>
        <li>
          <a href="#" class="btn btnblock btn-lg btn-block btn-primary" @click="login">Login</a>
        </li>
      </ul>
      <div class="boxfoot"></div>
    </div>
  </div>
  <div class="copyright">&copy; All Right Reserved By <a href="https://www.celestica.com/" target="_blank">Celestica</a> 2024</div>

  <canvas id='canvas' class="canvas"></canvas>

</template>

<script setup lang="ts">
  import "./style.css"
  import {onMounted, getCurrentInstance, reactive, ref} from "vue";
  import { ElMessage } from 'element-plus'
  import router from '@/router/index';

  onMounted(()=>{
    import("./index.js")
  })

  const { proxy } = getCurrentInstance();

  const loginForm = reactive({
    username: null,
    password: null
  });

  const login = () => {
    if (loginForm.username !== "anye@celestica.com" || loginForm.password !== "111111") {
      ElMessage.error('Invalid username or password')
      return;
    }

    //跳转页面
    let routeData = router.resolve({
      name: 'Test',
      query:{
        active: 1,
      }
    });

    window.open(routeData.href, '_self');

  }

</script>

<style scoped>

</style>