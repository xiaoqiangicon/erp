<template>
  <el-dialog title="选择项目" :visible.sync="visible" width="800px">
    <div style="display: flex;">
      <el-select
        v-model="listQuery.type"
        placeholder="请选择"
        style="width: 250px; margin-right: 20px"
        @change="handleChangeType"
        size="medium"
      >
        <el-option
          v-for="item in types"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
        v-show="[4, 8].indexOf(listQuery.type) < 0"
        placeholder="请输入搜索内容"
        size="medium"
        v-model="listQuery.searchKey"
        style="flex: 1;"
        @change="handleSearchList"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearchList"
        ></el-button>
      </el-input>
    </div>
    <div class="table-container" v-show="[4, 8].indexOf(listQuery.type) < 0">
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
    <div
      class="pagination-container"
      v-show="[4, 8].indexOf(listQuery.type) < 0"
    >
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
    <div v-show="[4, 8].indexOf(listQuery.type) > -1" style="margin-top: 40px">
      <el-form label-width="100px" size="small">
        <el-form-item label="标题：" required>
          <el-input
            v-model="inputTitle"
            placeholder="请输入标题"
            style="width: 100%;"
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述：" required>
          <el-input
            v-model="inputDesc"
            type="textarea"
            placeholder="请输入描述"
            style="width: 100%;"
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面：" required>
          <div v-if="inputCover" class="img-box">
            <img :src="inputCover" />
            <div class="img-box-overlay" @click="inputCover = ''">
              <i class="el-icon-delete" />
            </div>
          </div>
          <div
            v-show="!inputCover"
            ref="coverUpload"
            class="el-upload el-upload--picture-card upload-box"
          >
            <i class="el-icon-plus" />
          </div>
        </el-form-item>
        <el-form-item label="链接：" required>
          <el-input
            v-model="inputHref"
            placeholder="请输入链接"
            style="width: 100%;"
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            style="margin-top: 20px"
            size="medium"
            @click="confirmInsert"
            >确定插入</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script src="./App.js"></script>

<style lang="less" src="./App.less" scoped></style>
