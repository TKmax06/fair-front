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
          <input class="forminput" v-model="loginForm.username"
                 type="text" placeholder="Email">
        </li>
        <li>
          <i><img src="./img/password.png" alt=""></i>
          <input class="forminput" type="password" v-model="loginForm.password" @keydown.enter.native="login"
                 placeholder="Password">
        </li>


        <div class=" flex1">
          <label> <input type="checkbox" checked class="aui-checkbox" v-model="isChecked">&nbsp;Remember me</label>
          <a href="#" class="text-primary"> Forget password？</a>
        </div>
        <li>
          <a href="#" class="btn btnblock btn-lg btn-block btn-primary" @click="login()">Login</a>
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
  import {onMounted, reactive, ref} from "vue";
  import { ElMessage } from 'element-plus'
  import router from '@/router/index';
  import localStorageUtil from "@/utils/LocalStorageUtil.ts";

  onMounted(()=>{
    import("./index.js")
  })


  const loginForm = reactive({
    username: localStorageUtil.get("username"),
    password: localStorageUtil.get("password"),
  });

  const isChecked = ref(true);

  const login = () => {
    if (loginForm.username !== "anye@celestica.com" || loginForm.password !== "111111") {
      ElMessage.error('Invalid username or password')
      return;
    }

    // remember me (expire in 14 days if no login)
    if(isChecked.value){
      localStorageUtil.set('username', loginForm.username, 1000 * 60 * 60 * 24 * 14);
      localStorageUtil.set('password',loginForm.password, 1000 * 60 * 60 * 24 * 14);
    }else{
      localStorageUtil.remove('username');
      localStorageUtil.remove('password');
    }

    //跳转页面
    let routeData = router.resolve({
      name: 'Test',
    });

    window.open(routeData.href, '_self');
  }


</script>

<style scoped>

</style>