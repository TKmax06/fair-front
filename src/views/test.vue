<script setup lang="ts">
//setup类似于vue2.0中的Mounted和Created函数的结合体，页面加载后会自动运行里面的代码

import {Ref, ref} from "vue";
const msg: Ref<string> = ref('Hello World');

const changeMsg = () => {
  msg.value = 'ABC';
}
</script>

<template>
  <div>
    index
    <h3>{{msg}}</h3>
    <p>
      <el-button type="primary" @click="changeMsg">Primary</el-button>
    </p>
  </div>
</template>

<style scoped>

</style>