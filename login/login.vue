<template>
  <div class="box">
    <el-card class="cardBox">
      <h2>用户登录</h2>
      <el-form label-position="top" :model="formObj" status-icon :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formObj.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formObj.password" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="login" class="login">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formObj: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { require: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 11, message: "长度在3-11个字符", trigger: "blur" }
        ],
        password: [{ require: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          var res = await this.$http.post("/login", this.formObj);
          // console.log(res);
          var { meta, data } = res.data;
          if (meta.status == 200) {
            this.$message({
              message: meta.msg,
              type: "success"
            });
            window.localStorage.setItem("token", data.token);
            this.$router.push("/home");
          } else {
            this.$message.error(meta.msg);
          }
        } else {
          this.$message.error("输入的用户名不合法");
        }
      });
    }
  }
};
</script>

<style>
.box {
  height: 100%;
  background-color: #2c3742;
}
.cardBox {
  width: 500px;
  height: 400px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  padding: 40px;
}
.login {
  width: 100%;
}
</style>
