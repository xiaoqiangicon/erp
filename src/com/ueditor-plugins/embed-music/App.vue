<template>
  <el-dialog title="选择音乐" :visible.sync="visible" width="800px">
    <el-input
      placeholder="请输入搜索内容"
      v-model="listQuery.searchKey"
      style="width: 100%;"
      size="medium"
      @change="handleSearchList"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="handleSearchList"
      ></el-button>
    </el-input>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="list" style="width: 100%;">
        <el-table-column prop="title" label="名称" width="180">
          <template scope="scope">
            <div class="ellipsis-l2" :title="scope.row.title">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="描述" width="180">
          <template scope="scope">
            <div class="ellipsis-l2" :title="scope.row.content">
              {{ scope.row.content }}
            </div>
          </template></el-table-column
        >
        <el-table-column label="封面" width="100">
          <template slot-scope="scope">
            <img
              :src="scope.row.imgurl"
              style="width: 60px; height: 60px; object-fit: cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="jump_link" label="链接" width="180">
          <template scope="scope">
            <div class="ellipsis-l2" :title="scope.row.jump_link">
              {{ scope.row.jump_link }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSelect(scope.$index, scope.row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 20]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script src="./App.js"></script>

<style lang="less" src="./App.less" scoped></style>
