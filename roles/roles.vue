<template>
  <el-card>
    <!-- 导航 -->
    <MyBread firstnav="权限管理" lastnav="角色列表"></MyBread>
    <!-- 添加角色按钮 -->
    <el-button type="primary" plain class="btn1">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolesList" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="5">
              <el-tag closable @close="del(scope.row.id,item1.id,scope.row)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag
                    closable
                    type="success"
                    @close="del(scope.row.id,item2.id,scope.row)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    closable
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                    @close="del(scope.row.id,item3.id,scope.row)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length == 0">没有分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button plain type="primary" icon="el-icon-edit"></el-button>
          <el-button
            plain
            type="success"
            icon="el-icon-check"
            @click="setRole(scope.row.children,scope.row.id)"
          ></el-button>
          <el-button plain type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限面板 -->
    <el-dialog title="分配权限" :visible.sync="roleDialog">
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :default-checked-keys="defaultCheck"
        :props="props"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 角色数据
      rolesList: [],
      // 分配角色面板
      roleDialog: false,
      // 权限数据
      rightList: [],
      // 默认选中权限
      defaultCheck: [],
      // 配置项
      props: {
        label: "authName",
        children: "children"
      },
      // 角色id
      roleId: ""
    };
  },
  methods: {
    // 获取角色数据
    async getAllroles() {
      var res = await this.$http.get("/roles");
      //  console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.rolesList = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 删除某个角色对应的权限
    async del(roleId, rightId, dataList) {
      var res = await this.$http.delete(`/roles/${roleId}/rights/${rightId}`);
      // console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
        dataList.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 获取权限数据
    async getAllRight() {
      var res = await this.$http.get("/rights/tree");
      // console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.rightList = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 打开分配面板，所属权限默认选中
    setRole(rights, id) {
      this.roleId = id;
      this.defaultCheck = [];
      this.roleDialog = true;
      this.getAllRight();
      rights.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defaultCheck.push(item3.id);
          });
        });
      });
      //   console.log(this.defaultCheck);
    },
    // 更改权限
    async setRights() {
      var allcheck = this.$refs.tree.getCheckedKeys();
      var halfcheck = this.$refs.tree.getHalfCheckedKeys();
      var arr = halfcheck.concat(allcheck);
      var ids = arr.join(",");
      var res = await this.$http.request({
        url: `/roles/${this.roleId}/rights`,
        method: "post",
        data: {
          rids: ids
        }
      });
      // console.log(res);
      var { meta } = res.data;
      if (meta.status == 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
      } else {
        this.$message.error(meta.msg);
      }
      this.roleDialog = false;
      this.getAllroles();
    }
  },
  mounted() {
    this.getAllroles();
  }
};
</script>

<style>
.btn1 {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
</style>
