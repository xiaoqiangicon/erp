<template>
  <div class="root pd-20" v-loading="initRequesting">
    <div v-show="!inBatchMode">
      <el-card>
        <el-tabs v-model="activeTab" @tab-click="onChangeTab">
          <el-tab-pane label="新建打印" name="new">
            <div class="add-box">
              <img
                class="add-box-mark"
                src="https://pic.zizaihome.com/4c6be650-7a51-4d83-a651-cb1740752fdc.png"
              />
              <div class="add-box-cell">
                <div>姓名</div>
                <el-input
                  v-model="receiverName"
                  placeholder="收件人的真实姓名/单位名称"
                  maxlength="100"
                  class="mg-t-10"
                  style="width: 100%"
                ></el-input>
              </div>
              <div class="add-box-cell">
                <div>电话号码</div>
                <el-input
                  v-model="receiverPhone"
                  placeholder="收件人手机号码/单位座机号码"
                  maxlength="100"
                  class="mg-t-10"
                  style="width: 100%"
                ></el-input>
              </div>
              <br />
              <div class="add-box-cell" style="width: 100%;">
                <div>所在地区</div>
                <el-select
                  v-model="receiverProvince"
                  placeholder="请选择省份"
                  class="mg-t-10"
                  style="width: 250px;"
                  @change="onChangeProvince"
                >
                  <el-option
                    v-for="item in provinceList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="receiverCity"
                  placeholder="请选择城市"
                  class="mg-t-10"
                  style="width: 250px;"
                  @change="onChangeCity"
                >
                  <el-option
                    v-for="item in cityList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="receiverDistrict"
                  placeholder="请选择区域"
                  class="mg-t-10"
                  style="width: 250px;"
                >
                  <el-option
                    v-for="item in districtList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </div>
              <br />
              <div class="add-box-cell" style="width: 500px">
                <div>详细地址</div>
                <el-input
                  v-model="receiverAddress"
                  placeholder="请填写街道门牌、楼层房间号等信息"
                  maxlength="100"
                  class="mg-t-10"
                  style="width: 100%"
                ></el-input>
              </div>
            </div>
            <div class="add-box mg-t-20">
              <img
                class="add-box-mark-2"
                src="https://pic.zizaihome.com/f224d0bf-0f46-4a47-aa03-1061515c603a.png"
              />
              <div class="add-box-cell" style="width: 400px;">
                <div>物品名称</div>
                <el-input
                  v-model="goodsName"
                  placeholder="请填写物品名称"
                  maxlength="100"
                  class="mg-t-10"
                  style="width: 100%"
                ></el-input>
              </div>
              <div class="add-box-cell">
                <div>数量</div>
                <el-input-number
                  class="mg-t-10"
                  v-model="goodsQuantity"
                  :min="1"
                ></el-input-number>
              </div>
              <br />
              <div class="add-box-cell" style="width: 500px;">
                <div>备注</div>
                <el-input
                  v-model="remark"
                  placeholder="非必填；请填写备注信息可打印到电子面单中"
                  maxlength="100"
                  class="mg-t-10"
                  style="width: 100%"
                ></el-input>
              </div>
              <br />
              <div class="add-box-cell" style="width: 400px;">
                <div>自在家订单号</div>
                <div
                  class="mg-t-10"
                  v-for="(item, index) in foshiOrderIds"
                  :key="index"
                >
                  <el-input
                    v-model="foshiOrderIds[index]"
                    maxlength="100"
                    style="width: 320px"
                  ></el-input>
                  <button
                    class="clean add-box-plus"
                    @click="foshiOrderIds.push('')"
                    v-if="!index"
                  >
                    +
                  </button>
                  <button
                    class="clean add-box-minus"
                    @click="foshiOrderIds.splice(index, 1)"
                    v-else
                  >
                    -
                  </button>
                </div>
                <div class="gray mg-t-10">
                  非必填；用于匹配系统相关订单可实现自动上传物流单号并标记为“已发货”，支持添加多个。
                </div>
              </div>
            </div>
            <div class="mg-t-40" style="padding-left: 160px">
              <el-button
                type="primary"
                class="pd-l-40 pd-r-40"
                @click="onSaveAdd"
                v-loading="savingAdd"
                round
                >添加到待打印
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="批量打印" name="batch">
            <div class="batch-row">
              <div>
                下载模版后在电脑中编辑模版Excel文件中的收件人、收件人电话、收货详细地址和物品信息。
              </div>
              <div class="batch-row-mark">
                <img
                  src="https://pic.zizaihome.com/8d7f1c0e-2698-4f13-ad43-636d1b425003.png"
                /><br />
                <span>下载模版</span>
              </div>
              <div class="batch-row-act">
                <el-button
                  class="pd-l-30 pd-r-30"
                  type="primary"
                  round
                  plain
                  @click="downloadExcel"
                  >下载Excel</el-button
                >
              </div>
            </div>
            <div class="batch-row">
              <div class="batch-row-mark">
                <img
                  src="https://pic.zizaihome.com/9919c00e-7a32-4941-b900-d6f5dc782484.png"
                  style="width: 60px;"
                /><br />
                <span>导入订单</span>
              </div>
              <div>
                您可以上传模版编辑好的Excel文件，自在家系统中对应自动识别！
              </div>
              <div class="batch-row-act">
                <el-button
                  class="pd-l-30 pd-r-30 ps-relative"
                  type="primary"
                  round
                >
                  点击上传
                  <input type="file" class="upload-excel" ref="uploadExcel" />
                </el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="待打印" name="pending">
            <span slot="label"
              >待打印<el-badge
                v-if="pendingAllTotal"
                :value="pendingAllTotal"
              ></el-badge
            ></span>
            <div class="mg-t-10">
              <el-input
                placeholder="请输入内容"
                v-model="pendingListQuery.search_key"
                @change="handlePendingSearchList"
                style="width: 500px;"
              >
                <el-select
                  v-model="pendingListQuery.search_type"
                  slot="prepend"
                  placeholder="请选择"
                  @change="handlePendingSearchList"
                  style="width: 150px;"
                >
                  <el-option label="收件人姓名" :value="2"></el-option>
                  <el-option label="电话号码" :value="1"></el-option>
                  <el-option label="物品名称" :value="3"></el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handlePendingSearchList"
                ></el-button>
              </el-input>
              <span class="mg-l-20 mg-r-10">创建时间</span>
              <el-date-picker
                @change="handlePendingSearchList"
                v-model="pendingCreateTimes"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                unlink-panels
              >
              </el-date-picker>
            </div>

            <div class="mg-t-40" style="height: 40px; line-height: 40px;">
              <span class="mg-r-10 mg-l-30" style="color:#989898;"
                >已选择<span
                  class="mg-l-10 mg-r-10 text-center"
                  style="width: 20px;display: inline-block;"
                  >{{ pendingSelectedIds.length }}</span
                >项</span
              >
              <el-button
                type="primary"
                size="medium"
                @click="onClickExpressPrint"
              >
                快递单打印
              </el-button>
            </div>

            <div
              class="print-task-sec"
              v-if="expressPrintDevicesWithTask.length"
            >
              <div
                class="print-task-row"
                v-for="(item, index) in expressPrintDevicesWithTask"
                :key="index"
              >
                {{ item.device_name }} 正在打印第
                <span class="green f-wg-bold">{{
                  item.finish_count < item.total_count
                    ? item.finish_count + 1
                    : item.finish_count
                }}</span>
                单， 共 {{ item.total_count }} 单
                <div class="mg-t-10" v-if="item.latest_fail_msg">
                  <el-alert type="warning" :closable="false" show-icon>
                    {{ item.latest_fail_msg }}
                  </el-alert>
                </div>
                <span
                  class="print-task-row-detail"
                  @click="seeExpressPrintTaskDetail(index)"
                  >查看详情</span
                >
              </div>
            </div>

            <div class="table-container" style="margin-top: 0">
              <el-table
                v-loading="pendingListLoading"
                :data="pendingList"
                style="width: 100%;"
                @sort-change="handlePendingSortChange"
                @selection-change="handlePendingSelectionChange"
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="收件信息" width="400">
                  <template slot-scope="scope">
                    收件人姓名：{{ scope.row.receiver_name }}<br />
                    收件人电话：{{ scope.row.receiver_phone }}<br />
                    收件人地址：{{ scope.row.receiver_province || ''
                    }}{{ scope.row.receiver_city || ''
                    }}{{ scope.row.receiver_district || ''
                    }}{{ scope.row.receiver_address }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="物品名称"
                  prop="goods_name"
                ></el-table-column>
                <el-table-column
                  label="物品数量"
                  prop="goods_quantity"
                ></el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                <el-table-column
                  label="自在家单号"
                  prop="foshi_order_ids"
                ></el-table-column>
                <el-table-column
                  label="创建时间"
                  prop="create_time"
                  sortable="custom"
                >
                  <template slot-scope="scope">
                    {{ scope.row.create_time | formatDateTime }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="150">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="small"
                      round
                      @click="handlePendingUpdate(scope.$index, scope.row)"
                      >修改
                    </el-button>
                    <el-button
                      type="primary"
                      size="small"
                      round
                      plain
                      @click="handlePendingDelete(scope.$index, scope.row)"
                      >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pagination-container">
              <el-pagination
                background
                layout="total, sizes,prev, pager, next,jumper"
                :current-page.sync="pendingListQuery.page_num"
                :page-size="pendingListQuery.page_size"
                :page-sizes="[10, 20, 50]"
                :total="pendingTotal"
                @size-change="handlePendingSizeChange"
                @current-change="handlePendingCurrentChange"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="已打印" name="printed">
            <div class="mg-t-10">
              <el-input
                placeholder="请输入内容"
                v-model="printedListQuery.search_key"
                @change="handlePrintedSearchList"
                style="width: 500px;"
              >
                <el-select
                  v-model="printedListQuery.search_type"
                  slot="prepend"
                  placeholder="请选择"
                  @change="handlePrintedSearchList"
                  style="width: 150px;"
                >
                  <el-option label="物流单号" :value="5"></el-option>
                  <el-option label="电话号码" :value="1"></el-option>
                  <el-option label="收件人姓名" :value="2"></el-option>
                  <el-option label="物品名称" :value="3"></el-option>
                  <el-option label="自在家单号" :value="4"></el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handlePrintedSearchList"
                ></el-button>
              </el-input>
              <span class="mg-l-20 mg-r-10">创建时间</span>
              <el-date-picker
                @change="handlePrintedSearchList"
                v-model="printedCreateTimes"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                unlink-panels
              >
              </el-date-picker>
              <br />
              <br />
              <span class="mg-l-20 mg-r-10">打印时间</span>
              <el-date-picker
                @change="handlePrintedSearchList"
                v-model="printedPrintTimes"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                unlink-panels
              >
              </el-date-picker>
            </div>

            <div class="mg-t-40" style="height: 40px; line-height: 40px;">
              <span class="mg-r-10 mg-l-30" style="color:#989898;"
                >已选择<span
                  class="mg-l-10 mg-r-10 text-center"
                  style="width: 20px;display: inline-block;"
                  >{{ printedSelectedIds.length }}</span
                >项</span
              >
              <el-button
                type="primary"
                size="medium"
                @click="onClickExpressPrintAgain"
              >
                原单重打
              </el-button>
            </div>

            <div
              class="print-task-sec"
              v-if="expressPrintDevicesWithTask.length"
            >
              <div
                class="print-task-row"
                v-for="(item, index) in expressPrintDevicesWithTask"
                :key="index"
              >
                {{ item.device_name }} 正在打印第
                <span class="green f-wg-bold">{{
                  item.finish_count < item.total_count
                    ? item.finish_count + 1
                    : item.finish_count
                }}</span>
                单， 共 {{ item.total_count }} 单
                <div class="mg-t-10" v-if="item.latest_fail_msg">
                  <el-alert type="warning" :closable="false" show-icon>
                    {{ item.latest_fail_msg }}
                  </el-alert>
                </div>
                <span
                  class="print-task-row-detail"
                  @click="seeExpressPrintTaskDetail(index)"
                  >查看详情</span
                >
              </div>
            </div>

            <div class="table-container" style="margin-top: 0">
              <el-table
                v-loading="printedListLoading"
                :data="printedList"
                style="width: 100%;"
                @sort-change="handlePrintedSortChange"
                @selection-change="handlePrintedSelectionChange"
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="收件信息" width="300">
                  <template slot-scope="scope">
                    收件人姓名：{{ scope.row.receiver_name }}<br />
                    收件人电话：{{ scope.row.receiver_phone }}<br />
                    收件人地址：{{ scope.row.receiver_province || ''
                    }}{{ scope.row.receiver_city || ''
                    }}{{ scope.row.receiver_district || ''
                    }}{{ scope.row.receiver_address }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="物品名称"
                  prop="goods_name"
                ></el-table-column>
                <el-table-column
                  label="物品数量"
                  prop="goods_quantity"
                ></el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                <el-table-column
                  label="自在家单号"
                  prop="foshi_order_ids"
                ></el-table-column>
                <el-table-column label="物流信息" prop="express_num">
                  <template slot-scope="scope">
                    {{ getCompanyName(scope.row.express_company_code) }}<br />
                    <span class="blue" :ref="'printedCopy' + scope.row.id">{{
                      scope.row.express_num
                    }}</span>
                    <i
                      class="el-icon el-icon-document-copy cs-pointer"
                      @click="copyToSys(scope.$index, scope.row)"
                    ></i>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time">
                  <template slot-scope="scope">
                    {{ scope.row.create_time | formatDateTime }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="打印时间"
                  prop="print_time"
                  sortable="custom"
                >
                  <template slot-scope="scope">
                    {{ scope.row.print_time | formatDateTime }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="small"
                      round
                      @click="handlePrintAgain(scope.$index, scope.row)"
                      >原单重打
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pagination-container">
              <el-pagination
                background
                layout="total, sizes,prev, pager, next,jumper"
                :current-page.sync="printedListQuery.page_num"
                :page-size="printedListQuery.page_size"
                :page-sizes="[10, 20, 50]"
                :total="printedTotal"
                @size-change="handlePrintedSizeChange"
                @current-change="handlePrintedCurrentChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <div v-if="inBatchMode">
      <el-card class="pd-b-40">
        <el-page-header @back="backToUploadBatch" content="批量导入预览">
        </el-page-header>
        <div class="clearfix mg-t-20">
          <el-button
            type="primary"
            class="pd-l-40 pd-r-40 mg-r-20 fl-right"
            round
            v-loading="savingBatch"
            @click="onSaveBatch"
            >全部待打印
          </el-button>
          <el-alert
            type="success"
            :closable="false"
            style="width: 50%"
            show-icon
            >当前为预览界面，导入后顺序将与Excel文件的订单顺序一致。<br />请仔细核对信息是否有误。
          </el-alert>
        </div>
        <div class="table-container">
          <el-table :data="batchList" style="width: 100%;">
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column label="收件信息" width="400">
              <template slot-scope="scope">
                收件人姓名：{{ scope.row.receiverName }}<br />
                收件人电话：{{ scope.row.receiverPhone }}<br />
                收件人地址：{{ scope.row.receiverProvince || ''
                }}{{ scope.row.receiverCity || ''
                }}{{ scope.row.receiverDistrict || ''
                }}{{ scope.row.receiverAddress }}
              </template>
            </el-table-column>
            <el-table-column
              label="物品名称"
              prop="goodsName"
            ></el-table-column>
            <el-table-column
              label="物品数量"
              prop="goodsQuantity"
            ></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column
              label="自在家单号"
              prop="foshiOrderIds"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  round
                  @click="handleUpdateBatch(scope.$index, scope.row)"
                  >修改
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  round
                  plain
                  @click="handleDeleteBatch(scope.$index, scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <el-drawer
      title="收件信息"
      :visible.sync="showUpdateDrawer"
      size="500px"
      direction="rtl"
    >
      <div class="update-box-cell">
        <div>姓名</div>
        <el-input
          v-model="updateRecordReceiverName"
          placeholder="收件人的真实姓名/单位名称"
          maxlength="100"
          class="mg-t-10"
          style="width: 100%"
        ></el-input>
      </div>
      <div class="update-box-cell">
        <div>电话号码</div>
        <el-input
          v-model="updateRecordReceiverPhone"
          placeholder="收件人手机号码/单位座机号码"
          maxlength="100"
          class="mg-t-10"
          style="width: 100%"
        ></el-input>
      </div>
      <div class="update-box-cell">
        <div>所在地区</div>
        <el-select
          v-model="updateRecordReceiverProvince"
          placeholder="请选择省份"
          class="mg-t-10"
          style="width: 250px;"
          @change="onChangeProvinceForUpdate"
        >
          <el-option
            v-for="item in provinceListForUpdate"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="updateRecordReceiverCity"
          placeholder="请选择城市"
          class="mg-t-10"
          style="width: 250px;"
          @change="onChangeCityForUpdate"
        >
          <el-option
            v-for="item in cityListForUpdate"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="updateRecordReceiverDistrict"
          placeholder="请选择区域"
          class="mg-t-10"
          style="width: 250px;"
        >
          <el-option
            v-for="item in districtListForUpdate"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </div>
      <div class="update-box-cell">
        <div>详细地址</div>
        <el-input
          v-model="updateRecordReceiverAddress"
          placeholder="请填写街道门牌、楼层房间号等信息"
          maxlength="100"
          class="mg-t-10"
          style="width: 100%"
        ></el-input>
      </div>
      <div class="update-box-cell">
        <div>物品名称</div>
        <el-input
          v-model="updateRecordGoodsName"
          placeholder="请填写物品名称"
          maxlength="100"
          class="mg-t-10"
          style="width: 100%"
        ></el-input>
      </div>
      <div class="update-box-cell">
        <div>数量</div>
        <el-input-number
          class="mg-t-10"
          v-model="updateRecordGoodsQuantity"
          :min="1"
        ></el-input-number>
      </div>
      <br />
      <div class="update-box-cell">
        <div>备注</div>
        <el-input
          v-model="updateRecordRemark"
          placeholder="非必填；请填写备注信息可打印到电子面单中"
          maxlength="100"
          class="mg-t-10"
          style="width: 100%"
        ></el-input>
      </div>
      <br />
      <div class="update-box-cell">
        <div>自在家订单号</div>
        <div
          class="mg-t-10"
          v-for="(item, index) in updateRecordFoshiOrderIds"
          :key="index"
        >
          <el-input
            v-model="updateRecordFoshiOrderIds[index]"
            maxlength="100"
            style="width: 350px"
          ></el-input>
          <button
            class="clean add-box-plus"
            @click="updateRecordFoshiOrderIds.push('')"
            v-if="!index"
          >
            +
          </button>
          <button
            class="clean add-box-minus"
            @click="updateRecordFoshiOrderIds.splice(index, 1)"
            v-else
          >
            -
          </button>
        </div>
        <div class="gray mg-t-10">
          非必填；用于匹配系统相关订单可实现自动上传物流单号并标记为“已发货”，支持添加多个。
        </div>
      </div>
      <div class="mg-t-40 mg-b-40 t-a-center">
        <el-button
          type="primary"
          class="pd-l-40 pd-r-40"
          @click="onUpdate"
          v-loading="savingUpdate"
          round
          >修改
        </el-button>
      </div>
    </el-drawer>

    <el-dialog
      title="快递面单打印"
      :visible.sync="expressDeviceSelectDialogVisible"
      width="500px"
    >
      <el-alert
        type="success"
        :closable="false"
        show-icon
        v-if="expressDeviceSelectedOnline === true"
      >
        选中的云打印机在线，可正常使用。
      </el-alert>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        v-if="expressDeviceSelectedOnline === false"
      >
        {{ expressDeviceSelectedName || '' }}已离线，请检查本地网络是否正常。
      </el-alert>
      <el-form label-width="100px" size="small" class="mg-t-20">
        <el-form-item label="物流公司：" v-if="expressPrintMultiPartner">
          <el-radio v-model="expressPrintPartnerType" label="yt">圆通</el-radio>
          <el-radio v-model="expressPrintPartnerType" label="sf">顺丰</el-radio>
        </el-form-item>
        <el-form-item label="云打印机：">
          <el-select
            v-model="expressDeviceSelectedId"
            placeholder="请选择云打印机"
            style="width: 250px;"
            @change="onChangeExpressPrintDevice"
          >
            <el-option
              v-for="item in expressPrintDevices"
              :key="item.id"
              :label="item.device_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        v-if="expressDeviceSelectErrorMsg"
      >
        {{ expressDeviceSelectErrorMsg }}
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="expressDeviceSelectDialogVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-loading="expressPrintAddingOrders"
          @click="handleExpressDeviceSelectDialogConfirm"
          :disabled="
            !expressDeviceSelectedId || expressDeviceSelectedOnline !== true
          "
          >下一步</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="快递面单打印"
      :visible.sync="expressPrintingDialogVisible"
      width="500px"
    >
      <el-alert type="info" :closable="false" show-icon>
        请稍等，待全部快递单打印完成后再关闭此窗口，否则可能会出现漏单等情况。
      </el-alert>
      <div class="mg-t-40 mg-b-40 t-a-center">
        正在打印第
        <span class="green f-wg-bold">{{
          expressDeviceCurrentFinishCount < expressDeviceCurrentTotalCount
            ? expressDeviceCurrentFinishCount + 1
            : expressDeviceCurrentFinishCount
        }}</span>
        单，共 {{ expressDeviceCurrentTotalCount }} 单
      </div>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        v-if="expressDeviceCurrentLatestFailMsg"
      >
        {{ expressDeviceCurrentLatestFailMsg }}
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="expressPrintingDialogVisible = false"
          >关闭</el-button
        >
        <el-button
          type="warning"
          size="small"
          @click="handleExpressPrintCancelDialogConfirm"
          >取消打印</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="handleExpressPrintCancelDialogRestore"
          v-if="expressDeviceCurrentLatestFailMsg"
          >重新开始打印</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="快递面单打印"
      :visible.sync="expressPrintedDialogVisible"
      width="500px"
    >
      <div class="mg-t-40 mg-b-40 t-a-center f-s-16">
        <img
          src="https://pic.zizaihome.com/f6c88722-4071-4c94-b005-e5aa61ff8c93.svg"
          width="50"
          class="mg-r-20"
        />
        已打印完成，共
        <span class="green f-wg-bold">{{
          expressPrintOrdersAgain
            ? expressPrintAgainTotalCount
            : expressDeviceCurrentTotalCount
        }}</span>
        单
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="expressPrintedDialogVisible = false"
          >知道了</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="快递面单复打"
      :visible.sync="expressPrintingAgainDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
    >
      <el-alert type="info" :closable="false" show-icon>
        请勿关闭此窗口或刷新页面，不然复打任务将取消
      </el-alert>
      <div class="mg-t-40 mg-b-40 t-a-center">
        正在打印第
        <span class="green f-wg-bold">{{
          expressPrintAgainFinishCount < expressPrintAgainTotalCount
            ? expressPrintAgainFinishCount + 1
            : expressPrintAgainFinishCount
        }}</span>
        单，共 {{ expressPrintAgainTotalCount }} 单
      </div>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        v-if="expressPrintAgainLatestFailMsg"
      >
        {{ expressPrintAgainLatestFailMsg }}
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="warning"
          size="small"
          @click="handleExpressPrintAgainCancelDialogConfirm"
          >取消打印</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="handleExpressPrintAgainCancelDialogRestore"
          v-if="expressPrintAgainLatestFailMsg"
          >重新开始打印</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script src="./App.js"></script>

<style src="./App.less" lang="less" scoped></style>
<style scoped>
.root >>> .el-tabs__item {
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  font-weight: 400;
}
</style>
