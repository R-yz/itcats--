<template>
  <el-row class="top">
    <el-col :span="4">
      <div class="grid-content bg-purple">
        <img src="@/assets/images/logo.png" alt>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple-light title">后台电商管理系统</div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content bg-purple out">
        <a href="#" @click.prevent="logout">退出</a>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$confirm("是否退出系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 清除保存的登录信息 token
          window.localStorage.removeItem("token");
          // 跳转回登录页面
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
};
</script>

<style>
.top {
  background-color: #b3c0d1;
}
.top .title {
  font-size: 24px;
  color: #fff;
  line-height: 56px;
  text-align: center;
}
.top .out {
  line-height: 56px;
  position: absolute;
  right: 30px;
}
.top .out a {
  text-decoration: none;
  color: #eee;
}
</style>