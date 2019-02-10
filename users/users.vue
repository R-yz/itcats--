<template>
  <el-card>
    <!-- 导航 -->
    <MyBread firstnav="用户管理" lastnav="用户列表"></MyBread>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;margin-bottom: 15px;">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">&nbsp;&nbsp;
          <el-button type="success" plain @click="addDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="skyblue"
            inactive-color="pink"
            @change="change(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button plain type="primary" icon="el-icon-edit" @click="openEdit(scope.row.id)"></el-button>
          <el-button plain type="success" icon="el-icon-check" @click="openRole(scope.row.id)"></el-button>
          <el-button plain type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增用户面板 -->
    <el-dialog title="新增用户" :visible.sync="addDialog">
      <el-form :model="addObj" label-position="right" status-icon :rules="rules" ref="addForm">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="addObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="addObj.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户面板 -->
    <el-dialog title="编辑用户" :visible.sync="editDialog">
      <el-form :model="editObj" label-position="right">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="editObj.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="editObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="editObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancel">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色面板 -->
    <el-dialog title="分配角色" :visible.sync="roleDialog">
      <el-form :model="roleObj" label-position="right">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="roleObj.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色设置" label-width="100px">
          <el-select v-model="roleObj.rid" placeholder="请选择">
            <el-option label="请选择角色" :value="-1" disabled></el-option>
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="item in roleList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="role">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 搜索内容绑定
      search: "",
      //   数据源
      dataList: [],
      //   总条数
      total: 0,
      //   页数
      pagenum: 1,
      //   页容量
      pagesize: 5,
      //   添加面板
      addDialog: false,
      //   添加的参数
      addObj: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //   校验规则
      rules: {
        username: [
          { require: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 11, message: "长度在3-11个字符", trigger: "blur" }
        ],
        password: [{ require: true, message: "请输入密码", trigger: "blur" }]
      },
      //   修改面板
      editDialog: false,
      //   修改的参数
      editObj: {},
      // 分配角色参数
      roleObj: {},
      //   分配角色面板
      roleDialog: false,
      //   角色数据
      roleList: []
    };
  },
  methods: {
    // 获取全部数据,渲染到表格
    async getAllList() {
      var res = await this.$http.get(
        `/users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //   console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.total = data.total;
        this.dataList = data.users;
      }
    },
    // 页容量发生改变
    sizeChange(size) {
      this.pagesize = size;
      this.getAllList();
    },
    // 页数发生改变
    currentChange(num) {
      this.pagenum = num;
      this.getAllList();
    },
    // 点击搜索按钮,获取相关数据
    searchData() {
      this.pagenum = 1
      this.getAllList();
    },
    // 清空填写内容
    clear(obj) {
      for (var key in obj) {
        obj[key] = "";
      }
    },
    // 取消添加按钮
    cancel() {
      this.addDialog = false;
      this.clear(this.addObj);
      // 移除该表单项的校验结果
      this.$refs.addForm.clearValidate();
    },
    // 添加按钮
    add() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          var res = await this.$http.request({
            url: "/users",
            method: "post",
            data: {
              ...this.addObj
            }
          });
          //   console.log(res);
          var { meta, data } = res.data;
          if (meta.status == 201) {
            this.$message({
              type: "success",
              message: meta.msg
            });
            this.getAllList();
            this.addDialog = false;
            this.clear(this.addObj);
            // 移除该表单项的校验结果
            this.$refs.addForm.clearValidate();
          } else {
            this.$message.error(meta.msg);
          }
        } else {
          this.$message.error("不合法输入");
        }
      });
    },
    // 用户状态改变
    async change(uId, type) {
      var res = await this.$http.put(`users/${uId}/state/${type}`);
      // console.log(res)
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 打开修改面板,获取数据渲染
    async openEdit(id) {
      this.editDialog = true;
      var res = await this.$http.get(`users/${id}`);
      // console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.editObj = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 取消编辑按钮
    editCancel() {
      this.editDialog = false;
      this.editObj = {};
    },
    // 提交编辑按钮
    async edit() {
      var id = this.editObj.id;
      var res = await this.$http.request({
        url: `users/${id}`,
        method: "put",
        data: {
          email: this.editObj.email,
          mobile: this.editObj.mobile
        }
      });
      // console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
        this.editDialog = false;
        this.getAllList();
        this.editObj = {};
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 删除
    del(id) {
      this.$confirm("删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var res = await this.$http.delete(`users/${id}`);
          // console.log(res);
          var { meta, data } = res.data;
          if (meta.status == 200) {
            this.$message({
              type: "success",
              method: meta.status
            });
            this.pagenum = (this.total -1 )/this.pagesize
            this.getAllList();
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分配角色面板打开,获取数据渲染
    async openRole(id) {
      this.getRoleList();
      this.roleDialog = true;
      var res = await this.$http.get(`users/${id}`);
      // console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.roleObj = data;
        console.log(this.roleObj);
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 获取角色数据
    async getRoleList() {
      var res = await this.$http.get(`roles`);
      console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.roleList = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 分配角色提交按钮
    async role() {
      var res = await this.$http({
        url: `users/${this.roleObj.id}/role`,
        method: "put",
        data: {
          rid: this.roleObj.rid
        }
      });
      // console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
        this.roleDialog = false;
        this.getAllList();
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    //   先获取数据
    this.getAllList();
  }
};
</script>

<style>
</style>
