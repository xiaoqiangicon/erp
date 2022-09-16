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
              <th colspan="1" rowspan="1" class="is-leaf" style="width: 150px;">
                <div class="cell">
                  选择项类型<el-tooltip
                    effect="dark"
                    content="选择祈福牌位或往生牌位的类型，信众填写牌位信息时可进入可视化填写效果，体验更好"
                    placement="top-start"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </th>
              <th colspan="1" rowspan="1" class="is-leaf">
                <div class="cell">
                  选择项名称<sup style="top: 0; left: 5px; color: red;">*</sup>
                </div>
              </th>
              <th
                colspan="1"
                rowspan="1"
                class="is-leaf"
                style="width: 130px;"
                v-if="isStaff"
              >
                <div class="cell">价格</div>
              </th>
              <th colspan="1" rowspan="1" class="is-leaf" style="width: 120px;">
                <div class="cell">
                  库存<el-tooltip
                    effect="dark"
                    content="为空不限库存"
                    placement="top-start"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </th>
              <th colspan="1" rowspan="1" class="is-leaf" style="width: 120px;">
                <div class="cell">图片</div>
              </th>
              <th colspan="1" rowspan="1" class="is-leaf" style="width: 160px;">
                <div class="cell">操作</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div
        class="el-table__body-wrapper is-scrolling-none"
        style="overflow: visible"
      >
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="el-table__body"
          style="width: 100%;"
        >
          <draggable tag="tbody" :list="list" handle=".draggable-handle">
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
                <div class="cell cs-pointer">
                  <img
                    src="https://pic.zizaihome.com/bb8ca7d8-23a1-11e9-9b75-00163e0c001e.png"
                  />
                </div>
              </td>
              <td rowspan="1" colspan="1" style="width: 150px;">
                <div class="cell">
                  <!-- 已经生成的组件不能更改类型 -->
                  <el-select
                    v-model="item.subdivide_type"
                    placeholder="请选择"
                    style="width: 100%;"
                    :disabled="!!item.conversionSubdivide"
                    @change="onChangeType(index)"
                  >
                    <el-option
                      v-for="guiGe in selectGuiGeList"
                      :key="guiGe.value"
                      :label="guiGe.name"
                      :value="guiGe.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </td>
              <td rowspan="1" colspan="1">
                <div class="cell">
                  <el-input
                    v-model="item.name"
                    placeholder="不超过24个文字"
                    :disabled="isZiYingTempleModify && !item._isNew"
                    maxlength="24"
                    style="width: 100%"
                  ></el-input>
                </div>
              </td>
              <td
                rowspan="1"
                colspan="1"
                class="ps-relative"
                v-if="isStaff"
                style="width: 130px;"
              >
                <div class="cell">
                  <!-- 转单的规格不能修改价格, 自营佛事修改不可修改价格 -->
                  <el-input
                    v-model="item.price"
                    :disabled="
                      !!item.conversionSubdivide ||
                        (isZiYingTempleModify && !item._isNew)
                    "
                    @focus="focusPriceInput(index)"
                    @blur="blurPriceInput(index)"
                    style="width: 100%"
                  ></el-input>
                  <span
                    class="price-auto-box"
                    v-if="
                      item._priceAutoBox &&
                        item.price.indexOf(',') === -1 &&
                        item.price.indexOf('，') === -1
                    "
                    @click="fillRandomPrices(index)"
                    >自动生成随喜金额</span
                  >
                  <div
                    class="mg-t-10"
                    v-if="
                      item.price.indexOf(',') > -1 ||
                        item.price.indexOf('，') > -1 ||
                        item.subdivide_type == 1
                    "
                  >
                    自动处理订单
                    <el-switch
                      v-model="item.isAutoFinish"
                      active-text="开"
                      inactive-text="关"
                      :active-value="1"
                      :inactive-value="0"
                      :validate-event="false"
                      active-color="#13ce66"
                    >
                    </el-switch>
                  </div>
                </div>
              </td>
              <td rowspan="1" colspan="1" style="width: 120px;">
                <div class="cell">
                  <el-input v-model="item.stock" style="width: 100%"></el-input>
                </div>
              </td>
              <td rowspan="1" colspan="1" style="width: 120px;">
                <div class="cell">
                  <div class="cover-item" v-if="item.pic">
                    <img class="wd-100-pc hg-100-pc" :src="item.pic" />
                    <span class="cover-mask"></span>
                    <i
                      class="el-icon-circle-close cover-del"
                      @click="delCover(index)"
                    ></i>
                  </div>
                  <img
                    class="cover-add"
                    src="https://pic.zizaihome.com/build/2ed86af0ce03dd222864747496bcc75a.png"
                    @click="addCover(index)"
                    v-else
                  />
                </div>
              </td>
              <td rowspan="1" colspan="1" style="width: 160px;">
                <div class="cell">
                  <span class="main-green cs-pointer" @click="toFuYan(index)"
                    >附言</span
                  >
                  <span
                    class="main-green cs-pointer mg-l-10"
                    @click="setGuiGe(index)"
                    >设置</span
                  ><br />
                  <span class="main-green cs-pointer" @click="copyGuiGe(index)"
                    >复制</span
                  >
                  <span
                    class="main-red cs-pointer mg-l-10"
                    @click="delGuiGe(index)"
                    >删除</span
                  >
                </div>
              </td>
            </tr>
          </draggable>
        </table>
      </div>
    </div>
    <el-button type="success" size="medium" class="mg-t-20" @click="addGuiGe"
      >添加选择项</el-button
    >
    <el-dialog
      :title="'选择项设置：' + setItem.name"
      :visible.sync="setDialogVisible"
      width="600px"
    >
      <el-form :model="setItem" label-width="150px" size="medium">
        <el-form-item label="供奉时长：">
          <template slot="label"
            >供奉时长<el-tooltip
              effect="dark"
              content="请选择当前项的供奉时长，临近到期时会通知用户续供"
              placement="top-start"
            >
              <i class="el-icon-question"></i> </el-tooltip
            >：
          </template>
          <el-input
            v-model="setItem.durationDay"
            style="width: 200px;"
          ></el-input>
          <!-- 已经生成的组件不能更改类型 -->
          <el-select
            v-model="setItem._durationDayType"
            placeholder="请选择"
            style="width: 100px;"
          >
            <el-option label="天" :value="1"></el-option>
            <el-option label="月" :value="2"></el-option>
            <el-option label="年" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间：">
          <template slot="label"
            >到期时间<el-tooltip
              effect="dark"
              content="如果选择项有时间限制，请在此处选择到期的准确时间，若没有则可不选择"
              placement="top-start"
            >
              <i class="el-icon-question"></i> </el-tooltip
            >：
          </template>
          <el-date-picker
            v-model="setItem.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            style="width: 250px;"
          />
        </el-form-item>
        <el-form-item label="参与限制：">
          <template slot="label"
            >参与限制<el-tooltip
              effect="dark"
              content="控制当前选择项每位用户是否只可报名一次"
              placement="top-start"
            >
              <i class="el-icon-question"></i> </el-tooltip
            >：
          </template>
          <el-radio v-model="setItem.enroll_num" :label="0">不限制</el-radio>
          <el-radio v-model="setItem.enroll_num" :label="1"
            >每人限参与一次</el-radio
          >
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
    <el-dialog
      :title="'选择项附言：' + fuYanItem.name"
      :visible.sync="fuYanDialogVisible"
      width="1000px"
    >
      <FuYan
        :postScript="fuYanItem.postScript"
        :subdivide_type="fuYanItem.subdivide_type"
      />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="fuYanDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" size="small" @click="handleFuYanDialogConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script src="./GuiGe.js"></script>

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

.cover-item {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 50px;
}

.cover-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  display: none;
}

.cover-del {
  position: absolute;
  color: #d46a40;
  right: 2px;
  top: 2px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: none;
}

.cover-item:hover {
  .cover-mask,
  .cover-del {
    display: block;
  }
}

.cover-add {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 50px;
}

.price-auto-box {
  position: absolute;
  top: -5px;
  left: 50%;
  width: 106px;
  margin-left: -53px;
  background-color: #2ecc40;
  color: #ffffff;
  font-size: 12px;
  border-radius: 4px;
  line-height: 20px;
  cursor: pointer;
}
</style>
