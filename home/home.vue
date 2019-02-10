<template>
  <div class="content">
    <el-container>
      <el-header>
        <!-- 顶部区域 -->
        <top></top>
      </el-header>
      <el-container>
        <el-aside>
          <!-- 侧边栏 -->
          <side></side>
        </el-aside>
        <el-main>
          <!-- 内容 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import top from "@/common/top.vue";
import side from "@/common/sidebar.vue";
export default {
  components: {
    top,
    side
  }
};
</script>

<style>
.content,.el-container{
  height: 100%;
}
.el-header {
  padding: 0;
}
</style>
