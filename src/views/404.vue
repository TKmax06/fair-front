<template>
  <div class="content">
    <div class="title">Oops! The page you were looking for doesn't exist</div>
  </div>
</template>

<script>
</script>

<style lang="less" scoped> /*scoped：样式仅作用于当前页面*/
.content{
  background-image: url(../assets/404.jpg);
  background-size: cover; //无论图片如何放大或者缩小，始终完全覆盖
  text-align: center;
  height: 100vh; //背景图片铺满整个屏幕
  background-position: center; //背景图片居中
  .title{
    font-size: 28px;
    color: #888;
    padding-top: 100px;
  }
}
</style>