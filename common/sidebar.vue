<template>
  <el-menu
    :unique-opened="true"
    :default-active="path"
    class="el-menu-vertical-demo"
    :router="true"
  >
    <el-submenu :index="item1.path" v-for="item1 in rightList" :key="item1.id">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{item1.authName}}</span>
      </template>
      <el-menu-item :index="'/'+item2.path" v-for="item2 in item1.children" :key="item2.id">
        <i class="el-icon-news"></i>
        {{item2.authName}}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    };
  },
  computed: {
    path: function() {
      return this.$route.path;
    }
  },
  methods: {
    async getUserRight() {
      var res = await this.$http.get("/menus");
      console.log(res);
      var { data, meta } = res.data;
      if (meta.status === 200) {
        this.rightList = data;
        console.log(this.rightList);
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getUserRight();
  }
};
</script>

<style>
.el-menu-vertical-demo {
  height: 100%;
}
</style>
