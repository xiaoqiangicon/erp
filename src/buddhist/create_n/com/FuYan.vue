<template>
  <div>
    <div class="el-table el-table--fit el-table--border">
      <div class="el-table__header-wrapper">
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="el-table__header"
          style="width: 100%;"
        >
          <thead class="has-gutter">
            <tr>
              <th colspan="1" rowspan="1" class="is-leaf" style="width: 80px">
                <div class="cell">排序</div>
              </th>
              <th colspan="1" rowspan="1" class="is-leaf">
                <div class="cell">类型</div>
              </th>
              <th colspan="1" rowspan="1" class="is-leaf">
                <div class="cell">
                  标题<sup style="top: 0; left: 5px; color: red;">*</sup>
                </div>
              </th>
              <th colspan="1" rowspan="1" class="is-leaf">
                <div class="cell">预览</div>
              </th>
              <th colspan="1" rowspan="1" class="is-leaf" style="width: 160px;">
                <div class="cell">操作</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="el-table__body-wrapper is-scrolling-none">
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="el-table__body"
          style="width: 100%;"
        >
          <draggable tag="tbody" v-model="list" handle=".draggable-handle">
            <tr
              class="el-table__row"
              v-for="(item, index) in list"
              :key="index"
            >
              <td
                class="draggable-handle"
                rowspan="1"
                colspan="1"
                style="width: 80px"
              >
                <div class="cell">
                  <img
                    src="https://pic.zizaihome.com/bb8ca7d8-23a1-11e9-9b75-00163e0c001e.png"
                  />
                </div>
              </td>
              <td rowspan="1" colspan="1">
                <div class="cell">
                  <!-- 已经生成的组件不能更改类型 -->
                  <el-select
                    v-model="item.inputType"
                    placeholder="请选择"
                    style="width: 100%;"
                    :disabled="!!item.id"
                    @change="onChangeType(index)"
                  >
                    <el-option
                      v-for="fuYan in selectFuYanList"
                      :key="fuYan.value"
                      :label="fuYan.name"
                      :value="fuYan.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </td>
              <td rowspan="1" colspan="1">
                <div class="cell">
                  <!-- 自定义提示框没有标题 -->
                  <el-input
                    v-model="item.name"
                    placeholder="请输入不超过30个文字"
                    maxlength="30"
                    style="width: 100%"
                    v-show="item.inputType !== 13"
                  ></el-input>
                </div>
              </td>
              <td rowspan="1" colspan="1">
                <div class="cell" v-if="[2, 9].indexOf(item.inputType) > -1">
                  <div class="mg-b-10 t-a-left" v-if="item.name">
                    {{ item.name }}
                  </div>
                  <el-date-picker
                    type="date"
                    v-model="item._tmpValueForDisplay"
                    :placeholder="item.prompt_text"
                    disabled
                    style="width: 100%"
                  ></el-date-picker>
                </div>
                <div class="cell" v-else-if="[3].indexOf(item.inputType) > -1">
                  <div class="mg-b-10 t-a-left" v-if="item.name">
                    {{ item.name }}
                  </div>
                  <el-select
                    v-model="item._tmpValueForDisplay"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item2, index2) in item.prompt_text
                        .split('\n')
                        .map(s => s.trim())
                        .filter(s => !!s)"
                      :key="index2"
                      :label="item2"
                      :value="item2"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="cell" v-else>
                  <div class="mg-b-10 t-a-left" v-if="item.name">
                    {{ item.name }}
                  </div>
                  <el-input
                    v-model="item._tmpValueForDisplay"
                    :placeholder="item.prompt_text"
                    disabled
                    style="width: 100%"
                  ></el-input>
                </div>
              </td>
              <td rowspan="1" colspan="1" style="width: 160px;">
                <div class="cell">
                  <span class="main-green cs-pointer" @click="setFuYan(index)"
                    >设置</span
                  >
                  <span
                    class="main-red cs-pointer mg-l-10"
                    @click="delFuYan(index)"
                    >删除</span
                  >
                </div>
              </td>
            </tr>
          </draggable>
        </table>
      </div>
    </div>
    <el-button type="success" size="medium" class="mg-t-20" @click="addFuYan"
      >添加附言项</el-button
    >
    <!-- 因为规格弹框里有附言设置，会涉及到嵌套Dialog，必须添加属性append-to-body -->
    <el-dialog
      :title="'附言设置：' + setItem.name"
      :visible.sync="setDialogVisible"
      width="600px"
      append-to-body
    >
      <el-form :model="setItem" label-width="150px" size="medium">
        <el-form-item
          label="必填项："
          v-if="[13].indexOf(setItem.inputType) === -1"
        >
          <el-radio v-model="setItem.is_must" :label="1">是</el-radio>
          <el-radio v-model="setItem.is_must" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item
          label="示例文字："
          v-if="[1, 4, 5, 6, 7, 10, 11, 12, 15].indexOf(setItem.inputType) > -1"
        >
          <el-input
            v-model="setItem.prompt_text"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="可选范围："
          v-if="[2, 9].indexOf(setItem.inputType) > -1"
        >
          <el-radio v-model="setItem.dataType" :label="2">全可选</el-radio>
          <el-radio v-model="setItem.dataType" :label="1"
            >只可选择当天后的日期</el-radio
          >
        </el-form-item>
        <el-form-item
          label="选择类型："
          v-if="[3].indexOf(setItem.inputType) > -1"
        >
          <el-radio v-model="setItem.dataType" :label="0">单选</el-radio>
          <el-radio v-model="setItem.dataType" :label="1">多选</el-radio>
        </el-form-item>
        <el-form-item
          label="列表项："
          v-if="[3].indexOf(setItem.inputType) > -1"
        >
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="setItem.prompt_text"
          >
          </el-input>
          <p>输入选项，一行一个</p>
        </el-form-item>
        <el-form-item
          label="短信验证："
          v-if="[5].indexOf(setItem.inputType) > -1"
        >
          <el-radio v-model="setItem.isVerify" :label="1">需要</el-radio>
          <el-radio v-model="setItem.isVerify" :label="0">不需要</el-radio>
        </el-form-item>
        <el-form-item
          label="提示内容："
          v-if="[13].indexOf(setItem.inputType) > -1"
        >
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="setItem.prompt_text"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="最大上传数："
          v-if="[14].indexOf(setItem.inputType) > -1"
        >
          <el-input v-model="setItem.pic_num" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item
          label="填写字数："
          v-if="[15].indexOf(setItem.inputType) > -1"
        >
          <el-input
            v-model="setItem.font_length"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="setDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" size="small" @click="handleSetDialogConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script src="./FuYan.js"></script>

<style lang="less" scoped>
.el-table,
.el-table th,
.el-table tr {
  background-color: transparent;
}

.el-table--border,
.el-table--group,
.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #ccc;
}

.el-table--border td,
.el-table--border th {
  border-right: 1px solid #ccc;
}
.el-table--border,
.el-table--group {
  border: 1px solid #ccc;
}

.el-table .cell {
  text-align: center;
}
.el-table thead {
  color: #333333;
}
.el-table th {
  padding: 4px 0;
}

.el-form-item .el-form-item {
  margin-bottom: 22px;
}
</style>
