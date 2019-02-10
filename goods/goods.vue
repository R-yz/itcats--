<template>
  <el-card>
    <!-- 导航 -->
    <MyBread firstnav="商品管理" lastnav="商品列表"></MyBread>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;margin-bottom: 15px;">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">&nbsp;&nbsp;
          <el-button type="success" plain @click="add">添加商品</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_number" label="电话"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button plain type="primary" icon="el-icon-edit"></el-button>
          <el-button plain type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 搜索框绑定的数据
      search: "",
      //   商品数据
      goodsList: [],
      //   页数
      pagenum: 1,
      //   页容量
      pagesize: 20,
      //   总条数
      total: 0
    };
  },
  methods: {
    //   获取商品数据
    async getGoodsList() {
      var res = await this.$http.get(
        `/goods?query=${this.search}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //   console.log(res);
      var { meta, data } = res.data;
      if (meta.status == 200) {
        this.goodsList = data.goods;
        this.total = data.total;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 页容量改变时
    sizeChange(size) {
      this.pagesize = size;
      this.getGoodsList();
    },
    // 页数改变时
    currentChange(num) {
      this.pagenum = num;
      this.getGoodsList();
    },
    // 添加商品
    add(){
        this.$router.push('/goods/add')
    }
  },
  mounted() {
    this.getGoodsList();
  }
};
</script>

<style>
</style>
