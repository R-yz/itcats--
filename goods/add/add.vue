<template>
  <el-card>
    <!-- 导航 -->
    <MyBread firstnav="商品管理" lastnav="商品列表"></MyBread>
    <!-- 提示框 -->
    <el-alert title="添加商品信息" type="info" center show-icon class="info"></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success" align-center class="step">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-tabs tab-position="left" @tab-click="tabclick">
      <el-tab-pane label="基本信息">
        <el-form label-position="top" label-width="80px" :model="addData">
          <el-form-item label="商品名称">
            <el-input v-model="addData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :props="props"
              expand-trigger="hover"
              :options="cateList"
              v-model="cascaderValue"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
        <div v-for="item in manyParams" :key="item.id" class="manyParams">
          <p>{{item.attr_name}}</p>
          <div>
            <el-checkbox
              v-model="check"
              label="item1"
              border
              v-for="(item1,index) in item.attr_vals.split(',')"
              :key="index"
            ></el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <el-form
          label-position="top"
          label-width="80px"
          :model="item"
          v-for="item in onlyParams"
          :key="item.id"
        >
          <el-form-item :label="item.attr_name">
            <el-input v-model="item.attr_vals" readonly></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片">
        <el-upload
          :on-preview="uploadpreview"
          :on-remove="uploadremove"
          :on-success="uploadsuccess"
          class="upload-demo"
          :headers="headers"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">
        <el-button @click="add">新增数据</el-button>
        <quill-editor v-model="addData.goods_introduce" ref="myQuillEditor"></quill-editor>
      </el-tab-pane>
    </el-tabs>
    <!-- 预览图片 -->
    <el-dialog title="图片预览" :visible.sync="previewDialog">
      <img class="myimg" ref="myImg" src="#">
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条默认状态
      active: 0,
      //   添加的信息
      addData: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: []
      },
      //   分类数据
      cateList: [],
      //   分类选中的值
      cascaderValue: [],
      //   配置项
      props: {
        label: "cat_name",
        value: "cat_id"
      },
      //   商品动态参数
      manyParams: [],
      //   动态参数默认选中
      check: true,
      //   商品静态参数
      onlyParams: [],
      //   图片预览
      previewDialog: false,
      //   设置请求头
      headers: {
        Authorization: window.localStorage.getItem("token")
      }
    };
  },
  methods: {
    // 获取分类数据
    async getCateList() {
      var res = await this.$http.get("/categories?type=3");
      //   console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.cateList = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 获取参数
    async getParams(sel) {
      if (this.cascaderValue.length != 0) {
        var id = this.cascaderValue[this.cascaderValue.length - 1];
        var res = await this.$http.get(
          `/categories/${id}/attributes?sel=${sel}`
        );
        console.log(res);
        var { meta, data } = res.data;
        if (meta.status == 200) {
          if (sel === "many") {
            this.manyParams = data;
          } else {
            this.onlyParams = data;
          }
        } else {
          this.$message.error(meta.msg);
        }
      }
    },
    // tab栏切换
    tabclick(ev) {
      this.active = Number(ev.index);
      if (ev.index == 1 || ev.index == 2) {
        if (this.cascaderValue.length == 0) {
          this.$message.error("请选择分类");
        }
      }
      if (ev.index === "1") {
        this.getParams("many");
      }
      if (ev.index === "2") {
        this.getParams("only");
      }
    },
    // 图片上传成功
    uploadsuccess(response, file, fileList) {
      if (file.status == "success") {
        // console.log(response);
        // console.log(file);
        // console.log(fileList);
        this.addData.pics.push(response.data.tmp_path);
        this.$message({
          message: file.response.meta.msg,
          type: "success"
        });
      } else {
        this.$message.error("上传出错啦");
      }
    },
    // 点击已经上传的图片时
    uploadpreview(file) {
      this.previewDialog = true;
      this.$nextTick(function() {
        // console.log(file.response.data.url);
        this.$refs.myImg.src = file.response.data.url;
      });
    },
    // 删除已经上传的图片
    uploadremove(file, fileList) {
      for (var i = 0; i < this.addData.length; i++) {
        if (this.addData.pics[i] == file.response.data.tmp_path) {
          this.addData.pics.splice(i, 1);
          this.$message({
            message: "移除成功",
            type: "success"
          });
        }
      }
    },
    // 添加商品
    async add() {
      this.addData.goods_cat = this.cascaderValue.join(",");
      var res = await this.$http.post("goods", this.addData);
      //    console.log(res);
      var { meta, data } = res.data;
      if (meta.status === 201) {
        this.$router.push("/goods");
        this.$message({
          message: meta.msg,
          type: "success"
        });
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getCateList();
  }
};
</script>

<style>
.info {
  margin: 15px 0;
}
.step {
  margin-bottom: 15px;
}
.manyParams {
  margin: 10px;
}
.manyParams p {
  margin: 10px;
}
.my-form {
  margin: 10px 0px;
}

.my-form input {
  width: 99%;
  height: 25px;
  margin-top: 10px;
}
.myimg {
  width: 100%;
}
div#pane-4 {
  height: 650px;
}
.quill-editor {
  height: 400px;
  margin-top: 20px;
}
</style>
