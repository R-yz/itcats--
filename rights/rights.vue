<template>
  <el-card>
    <!-- 导航 -->
    <MyBread firstnav="权限管理" lastnav="权限列表"></MyBread>
    <!-- 表格 -->
    <el-table :data="rightsList" border style="width: 100%" class="rights">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    async getRightsList() {
      var res = await this.$http.get("/rights/list");
      //   console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.rightsList = data;
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getRightsList();
  }
};
</script>

<style>
.rights{
    margin-top: 15px;
}
</style>
