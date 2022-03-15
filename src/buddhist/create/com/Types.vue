<template>
  <el-dialog title="编辑分类" :visible.sync="visible" width="500px">
    <div class="content" v-if="types.length">
      <div
        class="l-row"
        v-for="(item, index) in types"
        :key="item.ceremonyTypeId"
      >
        <el-input
          v-model="item.name"
          size="medium"
          style="width: 250px"
        ></el-input>
        <el-button
          size="mini"
          type="success"
          class="mg-l-30"
          :disabled="item.name.trim() === ceremonyTypes[index].name"
          @click="updateType(index)"
          >修改
        </el-button>
        <el-button size="mini" type="danger" @click="delType(index)"
          >删除</el-button
        >
      </div>
    </div>
    <div class="t-a-center pd-20" v-else>暂无分类</div>
    <div class="mg-t-10">
      <div class="l-row">
        <el-input
          v-model="newTypeName"
          size="medium"
          style="width: 250px"
          placeholder="添加分类"
        ></el-input>
        <el-button
          size="mini"
          type="success"
          class="mg-l-30"
          :disabled="!newTypeName.trim()"
          @click="addType"
          >添加
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script src="./Types.js"></script>

<style lang="less" scoped>
.content {
  border: 1px solid #dddddd;
  border-radius: 4px;
}

.l-row {
  padding: 15px;
  border-top: 1px solid #dddddd;

  &:first-child {
    border-top: 0;
  }
}
</style>
