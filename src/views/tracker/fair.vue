<template>
  <div>
    <!-- 搜索区域
		  inline="true": 控件水平排成一行
	  -->
    <el-form :inline="true" :model="data" ref="form">

      <el-form-item label="Date">
        <el-date-picker
            v-model="filter.dates"
            type="daterange" range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            placeholder="Select date range" :editable="false" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" class="dialog-input"
        />
      </el-form-item>


      <el-form-item>
        <!-- 查询按钮 -->
        <el-button type="primary" @click="searchHandle()">Search</el-button>

        <!-- 新增按钮 -->
        <el-button type="primary"
                   :disabled="!proxy.isAuth(['Engineer'])"
                   @click="addHandle()">
          Add
        </el-button>


      </el-form-item>

    </el-form>

    <!-- 表格 -->
    <el-table :data="data.dataList" border v-loading="data.loading" :header-cell-style="headerCellStyle" stripe>
      <el-table-column label="Engineer" header-align="center" align="center" width="50">
        <el-table-column type="index" header-align="center" align="center" width="50" label="#">
          <!-- #default="scope" 定义了一个名为 default 的插槽，并将当前行的数据传递给一个名为 scope 的变量 -->
          <template #default="scope">
            <!--
              显示每条记录的索引
              scope.$index：记录在数组中的索引
              比如假设每页显示10条记录，那么第二页第一条记录在数组中的索引为0，即scope.$index=0
              那么该条记录经过计算后显示的索引为 (2-1)*10+0+1=11
            -->
            <span>{{ (filter.pageIndex - 1) * filter.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <!-- prop：注意后端返回的json对象的属性名必须和这里的prop对应才能回显数据 -->
        <el-table-column prop="createDate" header-align="center" align="center" label="Date" sortable :min-width="flexWidth('date', data.dataList, 'Date')"/>
        <el-table-column prop="clsPn" header-align="center" align="center" label="CLS PN" :min-width="flexWidth('clspn', data.dataList, 'CLS PN')"/>
        <el-table-column prop="revision" header-align="center" align="center" label="Revision" :min-width="flexWidth('revision', data.dataList, 'Revision')"/>
        <!-- :show-overflow-tooltip：文字有缩略效果 -->
        <el-table-column prop="customer" header-align="center" align="center" label="Customer" :min-width="flexWidth('customer', data.dataList, 'Customer')"/>
        <el-table-column prop="engName" header-align="center" align="center" label="Eng Name" :min-width="flexWidth('engname', data.dataList, 'Eng Name')"/>
        <el-table-column prop="deviation" header-align="center" align="center" label="Deviation Info" :min-width="flexWidth('devnumber', data.dataList, 'Deviation Info')"/>
        <el-table-column prop="deviationFile" header-align="center" align="center" label="Deviation Dropbox" :min-width="flexWidth('devbox', data.dataList, 'Deviation Dropbox')"/>
        <el-table-column prop="reason" header-align="center" align="center" label="Reason"
                         :show-overflow-tooltip="true" :min-width="flexWidth('reason', data.dataList, 'Reason')"/>
        <el-table-column prop="planner" header-align="center" align="center" label="Planner" :min-width="flexWidth('Planner', data.dataList, 'Planner and their information')"/>
        <el-table-column prop="fairType" header-align="center" align="center" label="Fair Type" :min-width="flexWidth('fairtype', data.dataList, 'Fair Type')"/>
      </el-table-column>

      <el-table-column label="Planner" header-align="center" align="center">
        <el-table-column prop="so" header-align="center" align="center" label="SO" :min-width="flexWidth('so', data.dataList, 'SO')"/>
        <el-table-column prop="po" header-align="center" align="center" label="PO" :min-width="flexWidth('po', data.dataList, 'PO')"/>
        <el-table-column prop="targetShipDate" header-align="center" align="center" label="Target Ship Date" :min-width="flexWidth('targetShipDate', data.dataList, 'Target Ship Date')"/>
      </el-table-column>

      <el-table-column label="Carmen/Jules" header-align="center" align="center">
        <el-table-column prop="fairOwner" header-align="center" align="center" label="FAI Owner" :min-width="flexWidth('fairOwner', data.dataList, 'FAI Owner', 20)"/>
      </el-table-column>

      <el-table-column label="FAIR TEAM" header-align="center" align="center">
        <el-table-column prop="netinsepectfair" header-align="center" align="center"
                         label="NET Inspect FAIR #" :min-width="flexWidth('date', data.dataList, 'NET Inspect FAIR #')"/>
        <el-table-column prop="form1" header-align="center" align="center" label="Form 1 (CofC)" :min-width="flexWidth('form1', data.dataList, 'Form 1(CofC)')"/>
        <el-table-column prop="form2" header-align="center" align="center" label="Form 2 (Chemical, Processes, Test)"
                         :min-width="flexWidth('form2', data.dataList, 'Form 2 (Chemical, Processes, Test)')"/>
        <el-table-column prop="form3" header-align="center" align="center" label="Form 3 (Inspection)"
                         :min-width="flexWidth('form3', data.dataList, 'Form 3 (Inspection)')"/>
        <el-table-column prop="documentation" header-align="center" align="center" label="Documentation"
                         :min-width="flexWidth('form1', data.dataList, 'Documentation')"/>
        <el-table-column prop="completepercentage" header-align="center" align="center" label="Percentage of Completion"
                         :min-width="flexWidth('completepercentage', data.dataList, 'Percentage')"/>
        <el-table-column prop="datereceived" header-align="center" align="center" label="Date unit received"
                         :min-width="flexWidth('datereceived', data.dataList, 'Date received')"/>
        <el-table-column prop="fairstatus" header-align="center" align="center" label="Fair Status"
                         :min-width="flexWidth('fairstatus', data.dataList, 'Fair Status')"/>
        <el-table-column prop="plannerissue" header-align="center" align="center" label="Pending Issues - Planner"
                         :min-width="flexWidth('plannerissue', data.dataList, 'Pending Issues - Planner')"/>
        <el-table-column prop="engissue" header-align="center" align="center" label="Pending Issues - Eng"
                         :min-width="flexWidth('engissue', data.dataList, 'Pending Issues - Eng')"/>
        <el-table-column prop="sqeissue" header-align="center" align="center" label="Pending Issues - SQE"
                         :min-width="flexWidth('sqeissue', data.dataList, 'Pending Issues - SQE')"/>
        <el-table-column prop="comments" header-align="center" align="center" label="Comments (dropbox)"
                         :min-width="flexWidth('comments', data.dataList, 'Comments')"/>
      </el-table-column>

      <!-- fixed="right": 列将被右侧固定 -->
      <el-table-column header-align="center" align="left" width="147" label="Action" fixed="right">
        <template #default="scope">
          <el-button type="primary" :disabled="proxy.isAuth(['Viewer'])"
                     :icon="Edit" circle plain
                     @click="editHandle(scope.row.id)">
          </el-button>
          <!-- only Engineer can delete the FAIR -->
          <el-button type="danger" :disabled="!proxy.isAuth(['Engineer'])"
                     :icon="Delete" circle plain
                     @click="deleteHandle(scope.row.id)">
          </el-button>
          <el-button type="success"
                     :icon="Download" circle plain
                     @click="editDownload(scope.row.id)">
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- Add/Edit Fair(Engineer) -->
    <el-dialog v-model="dialog.visible" :title="!dialog.update ? 'Add' : 'Edit'" :show-close="false" :close-on-press-escape="false"
               :close-on-click-modal="false" width="600px" v-if="proxy.isAuth(['Engineer'])">

      <el-form :model="dialog.dataForm" :rules="dialog.dataRule" ref="dialogForm" label-width="140px">

        <!-- prop="username": 绑定 dialog.dataForm 中 username 的验证规则，并应用到文本框上-->
        <el-form-item label="CLS PN" prop="clsPn" label-position="left">
          <el-input v-model="dialog.dataForm.clsPn" :disabled="dialog.update"
                    maxlength="20" clearable @change="autoFillCustomer"/>
        </el-form-item>

        <el-form-item label="Revision" prop="revision" label-position="left" v-if="!dialog.update">
          <el-input v-model="dialog.dataForm.revision"
                    maxlength="5" clearable />
        </el-form-item>

        <!-- customer is auto filled based on the suffix of the CLS PN -->
        <el-form-item label="Customer" prop="customer" label-position="left" v-if="!dialog.update">
          <el-input v-model="dialog.dataForm.customer" disabled/>
        </el-form-item>

        <el-form-item label="Eng Name" prop="engName" label-position="left" v-if="!dialog.update">
          <el-input v-model="dialog.dataForm.engName" disabled/>
        </el-form-item>

        <el-form-item label="Deviation" label-position="left" class="is-required" v-if="!dialog.update">
          <!-- :gutter="10" 列间距为10px -->
          <el-row :gutter="10" class="item-row"
                  v-for="(one, $index) in dialog.dataForm.item" :key="$index">
            <el-col :span="10">
              <el-input v-model="one.number" placeholder="Deviation #" maxlength="30" clearable @blur="handleDeviation($index, $event)"/>
            </el-col>
            <el-col :span="10">
              <el-input v-model="one.qty" placeholder="Deviation QTY" maxlength="30" clearable @blur="handleDeviation($index, $event)"/>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" :icon="Delete" @click="deleteItem($index)" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="Deviation Dropbox" label-position="left" prop="devbox" v-if="!dialog.update">
          <el-upload
              class="upload-pdf"
              drag
              :action="dialog.upload.action"
              :headers="dialog.upload.headers"
              v-model:file-list="dialog.upload.files"
              :data="dialog.upload.data" :show-file-list="true"
              accept=".pdf" :before-upload="pdfBeforeUpload"
              :on-success="pdfUploadSuccess" :on-error="pdfUploadError"
              :on-remove="pdfRemoveSuccess" :before-remove="pdfBeforeRemove"
              :limit="10"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop PDF here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                No more than 10 PDFs allowed to upload, each PDF file size less than 1MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="Reason" prop="reason" label-position="left">
          <el-input
              v-model="dialog.dataForm.reason"
              style="width: 100%"
              :rows="5"
              type="textarea"
              maxlength="210"
              placeholder="Enter reason here, maximum 200 words"
          />
        </el-form-item>

        <!-- dropdown list -->
        <el-form-item label="Planner" prop="planner" label-position="left" v-if="!dialog.update">
          <el-select v-model="dialog.dataForm.planner" placeholder="Select planner">
            <el-option v-for="p in dialog.dataForm.plannerList" :label="p.email"
                       :value="p.email" :key="p.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Fair Type" prop="fairType" label-position="left" v-if="!dialog.update">
          <el-select v-model="dialog.dataForm.fairType">
            <el-option label="Delta" value="Delta" />
            <el-option label="Full" value="Full"/>
            <el-option label="Full by similarity" value="Full by similarity" />
            <el-option label="Partial" value="Partial" />
          </el-select>
        </el-form-item>

      </el-form>

      <!-- 弹窗页脚 -->
      <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="addItem" v-if="!dialog.update">Add Deviation</el-button>
        <el-button @click="cancel('Engineer')">Cancel</el-button>
        <el-button type="primary" @click="dataFormSubmit('Engineer')">Save</el-button>
      </span>
      </template>
    </el-dialog>

    <!-- Edit Fair(Planner) -->
    <el-dialog v-model="dialog_planner.visible" title="Edit" :close-on-click-modal="false"  :show-close="false"
               :close-on-press-escape="false" width="600px" v-if="proxy.isAuth(['Planner'])">

      <el-form :model="dialog_planner.dataForm" :rules="dialog_planner.dataRule" ref="dialogForm_Planner" label-width="140px">

        <!-- prop="username": 绑定 dialog.dataForm 中 username 的验证规则，并应用到文本框上-->
        <el-form-item label="CLS PN" prop="clsPn" label-position="left">
          <el-input v-model="dialog_planner.dataForm.clsPn" disabled/>
        </el-form-item>

        <el-form-item label="Revision" prop="revision" label-position="left" v-if="!dialog.update">
          <el-input v-model="dialog_planner.dataForm.revision" disabled />
        </el-form-item>

        <!-- customer is auto filled based on the suffix of the CLS PN -->
        <el-form-item label="Customer" prop="customer" label-position="left" v-if="!dialog.update">
          <el-input v-model="dialog_planner.dataForm.customer" disabled/>
        </el-form-item>

        <el-form-item label="Eng Name" prop="engName" label-position="left" v-if="!dialog.update">
          <el-input v-model="dialog_planner.dataForm.engName" disabled/>
        </el-form-item>

        <el-form-item label="Reason" prop="reason" label-position="left">
          <el-input
              v-model="dialog_planner.dataForm.reason"
              style="width: 100%"
              :rows="5"
              type="textarea"
              disabled/>
        </el-form-item>

        <el-form-item label="SO" prop="so" label-position="left">
          <el-input v-model="dialog_planner.dataForm.so" maxlength="20" clearable />
        </el-form-item>

        <el-form-item label="PO" label-position="left" prop="po">
          <el-upload
              class="upload-pdf"
              drag
              :action="dialog.upload.action"
              :headers="dialog.upload.headers"
              v-model:file-list="dialog.upload.files"
              :data="dialog.upload.data" :show-file-list="true"
              accept=".pdf" :before-upload="pdfBeforeUpload"
              :on-success="pdfUploadSuccess" :on-error="pdfUploadError"
              :on-remove="pdfRemoveSuccess" :before-remove="pdfBeforeRemove"
              :limit="10"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop PDF here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                No more than 10 PDFs allowed to upload, each PDF file size less than 1MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="Target Ship Date" prop="targetShipDate" label-position="left">
          <el-date-picker style="width: 100%"
              v-model="dialog_planner.dataForm.targetShipDate"
              type="date" value-format="YYYY-MM-DD"
              placeholder="Pick a day"
              :disabled-date="disabledDate"
              :size="'default'" :editable="false"
              clearable/>
        </el-form-item>

      </el-form>

      <!-- 弹窗页脚 -->
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel('Planner')" :disabled="dialog_planner.disabled">Cancel</el-button>
        <el-button type="primary" @click="dataFormSubmit('Planner')">Save</el-button>
      </span>
      </template>
    </el-dialog>

    <!-- Download Confirmation(deviation or PO) -->
    <el-dialog v-model="download.visible" title="Please select the files to download" :close-on-click-modal="false" width="400px">
      <el-button type="primary" @click="downloadFiles('deviation')" plain>Deviation</el-button>
      <el-button type="warning" :disabled="download.disablePO" @click="downloadFiles('po')" plain>PO</el-button>
    </el-dialog>

    <!-- Assign Fair Owner(Jules/Carmen) -->
    <el-dialog v-model="dialog.visible" title="Edit"  width="600px" v-if="proxy.isAuth(['Admin'])">

      <el-form :model="dialog.dataForm" :rules="dialog.dataRule" ref="dialogForm" label-width="140px">

        <!-- dropdown list -->
        <el-form-item label="Select FAI Owner" prop="fairOwner" label-position="left">
          <el-select v-model="dialog.dataForm.fairOwner" placeholder="Select FAI Owner">
            <el-option v-for="f in dialog.dataForm.fairOwnerList" :label="f.email"
                       :value="f.email" :key="f.id" />
          </el-select>
        </el-form-item>

      </el-form>

      <!-- 弹窗页脚 -->
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">Cancel</el-button>
        <el-button type="primary" @click="fairOwnerSubmit">Save</el-button>
      </span>
      </template>
    </el-dialog>

    <el-divider />

    <!-- 分页控件 -->
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle" v-model:current-page="filter.pageIndex"
                   :page-sizes="[10, 20, 50]" v-model:page-size="filter.pageSize"
                   :total="filter.totalCount"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

  </div>
</template>

<script setup lang="ts">

  import {reactive, getCurrentInstance, onMounted, ref} from "vue";
  import {dayjs, ElMessage, UploadFile, UploadFiles, ElMessageBox} from "element-plus";
  import f from "@/utils/tableWidthUtil.ts";
  import { UploadFilled, Delete, Edit, Download} from '@element-plus/icons-vue'
  import localStorageUtil from "@/utils/localStorageUtil.ts";
  import axios from 'axios';

  let {flexWidth} = f;

  const {proxy} = getCurrentInstance();

  const download = reactive({
    visible: false,
    id: null,
    disablePO: true,
    deviation: [],
    po: [],
  })

  //校验 Dropbox
  const uploadFileChange = (rule, value, callback) => {
    if(dialog.upload.files.length === 0){
      return callback("Dropbox cannot be empty!");
    }
    return true;
  }

  //过滤控件变量
  const filter = reactive({
    dates: null,
    pageIndex: 1, //当前页码
    pageSize: 10, //每页记录数
    totalCount: 0, //总记录数
  })

  //弹窗控件变量 (Engineer)
  const dialog = reactive({
    visible: false, //是否显示弹窗，调试完成后记得改为false
    update: false,
    dataForm: {
      id: null, //Fair主键
      clsPn: null,
      revision: null,
      customer: null,
      customerList: [],
      plannerList: [],
      engName: localStorageUtil.get("username").split("@")[0],
      item: [{
        number: "",
        qty:""
      }], //deviation
      reason: null,
      planner: null,
      fairType: null,
      deviationFile: [], //文件保存在minio服务器的相对路径
      pdfUrl: null,
      engEmail: null,
      fairOwner: null,
      fairOwnerList: []
    },

    //上传PDF
    upload: {
      //上传对应方法
      action: `${proxy.$baseUrl}/file/uploadPDF`,
      headers: {//请求头带令牌
        token: localStorageUtil.get('token'),
      },
      files:[], //上传文件列表
      data: {
        id: null
      }
    },

    //数据校验
    dataRule: {
      clsPn: [
        {required: true, message: 'PN cannot be empty!'}
      ],
      revision: [
        {required: true, message: 'Revision cannot be empty!'}
      ],
      customer: [{required: true, message: 'Customer cannot be empty!'}],
      engName: [{required: true, message: 'Eng name cannot be empty!'}],
      devbox: [{required: true, validator:uploadFileChange, trigger: 'change'}],
      reason: [{required: true, message: 'Reason cannot be empty!'}],
      planner: [{required: true, message: 'Planner cannot be empty!'}],
      fairType: [{required: true, message: 'Fair type cannot be empty!'}],
      fairOwner: [{required: true, message: 'Fair owner cannot be empty!'}]
    }

  })

  //弹窗控件变量 (Planner)
  const dialog_planner = reactive({
    visible: false, //是否显示弹窗，调试完成后记得改为false
    dataForm: {
      id: null, //Fair主键
      clsPn: null,
      revision: null,
      customer: null,
      engName: null,
      reason: null,
      so: null,
      po: dialog.dataForm.deviationFile, //文件保存在minio服务器的相对路径
      targetShipDate: null,
      planner: localStorageUtil.get("username"),
    },

    isFirstTime: false,

    disabled: false,

    //数据校验
    dataRule: {
      so: [
        {required: true, message: 'SO cannot be empty!'}
      ],
      po: [{required: true, validator:uploadFileChange, trigger: 'change'}],
      targetShipDate: [{required: true, message: 'Target Ship Date cannot be empty!'}],
    }
  })

  const searchHandle = () => {
    loadDataList();
  }

  const data = reactive({
    dataList:[],
    loading: false, //不显示加载进度条
  })

  //分页查询
  const loadDataList = () => {
    data.loading = true; //显示加载进度条
    proxy.$http("/tracker/searchByPage", "POST", filter, true, resp => {
      if(resp.code === 200){
        data.dataList = resp.list;
        filter.totalCount =resp.totalCount; //总记录数
      }else{
        ElMessage.error('Unable to load the data')
      }
      data.loading = false; //关闭加载进度条
    })
  }

  loadDataList();

  const sizeChangeHandle = () => {
    filter.pageIndex = 1;
    loadDataList();
  }

  const currentChangeHandle = () => {
    loadDataList();
  }


  const headerCellStyle = ({row, column, rowIndex, columnIndex}) => {
    if(columnIndex === 0 && column.label !== "#"){
      return { backgroundColor: '#f56c6c', color:'black' };
    }else if (columnIndex === 1 && column.label !== "Date"){
      return { backgroundColor: '#5f94e0', color:'black' };
    }else if (columnIndex === 2 && column.label !== "CLS PN"){
      return { backgroundColor: '#e1deff', color:'black' };
    } else if (columnIndex === 3 && column.label !== "Revision"){
      return { backgroundColor: '#34ba97', color:'black' };
    }
    else if (column.label === "Action"){
      return { backgroundColor: '#fea802', color:'black' };
    }
  }



  //新增按钮点击事件
  const addHandle = () => {
    dialog.dataForm.id = null;
    dialog.dataForm.clsPn = null;
    dialog.dataForm.customerList = [];
    dialog.dataForm.plannerList = [];
    dialog.dataForm.deviationFile = [];
    //清空上传文件列表
    dialog.upload.files = [];
    //清空deviation
    dialog.dataForm.item = [{}]
    dialog.update = false;
    //get customer list
    getList("customer");
    //get planner list
    getList("planner");
    dialog.visible = true; //显示弹窗
    proxy.$nextTick(()=>{//确保DOM更新后执行操作
      proxy.$refs['dialogForm'].resetFields(); //清除表单数据和校验规则
    })

  }

  //获取customer和planner列表
  const getList = (name) => {
    if(name === "customer"){
      proxy.$http("/customer/query-customer", "GET", null, true, resp => {
        if(resp.code === 200){
          dialog.dataForm.customerList = resp.result;
        }else{
          ElMessage.error('Unable to get the customer list')
        }
      })
    }

    if(name === "planner"){
      proxy.$http("/planner/query-planner", "GET", null, true, resp => {
        if(resp.code === 200){
          dialog.dataForm.plannerList = resp.result;
        }else{
          ElMessage.error('Unable to get the planner list')
        }
      })
    }
  }

  const autoFillCustomer = (val:string) => {
    dialog.dataForm.clsPn = val.toUpperCase().trim();
    let pnSuffix = dialog.dataForm.clsPn?.slice(-3);
    let suffixList = dialog.dataForm.customerList;
    let match = suffixList.filter( c => c.suffix === pnSuffix)[0];
    if(match == undefined){
      dialog.dataForm.customer = null;
      ElMessage.error('Unable to find the customer for this PN!')
      return;
    }

    dialog.dataForm.customer = match.customer;

  }

  //校验上传文件大小(< 1M)
  const pdfBeforeUpload = (file) => {
    let size = file.size / 1024 / 1024;

    if(file.type.trim() === "" || file.type.toLowerCase() !== "application/pdf"){
      ElMessage.error('Only pdf is allowed')
      return false;
    }

    if(size > 1){
      ElMessage.error('PDF size cannot exceed 1M')
      return false;
    }

    let fileName = file.name;

    for (let f of dialog.upload.files) {
      if (f.name === fileName){
        ElMessage.error(`${fileName} already uploaded!`);
        return false;
      }
    }

    return true;
  }

  //上传文件成功回调函数
  const pdfUploadSuccess = (resp : any, uploadFile : UploadFile, uploadFiles :  UploadFiles) => {
    if(resp.code === 200){
      let path = resp.result;
      //保存文件相对地址，添加或者修改文件的时候，要上传给后端web方法
      dialog.dataForm.deviationFile.push(path);
      //上传控件中显示已上传的文件(完整路径)
      dialog.dataForm.pdfUrl = `${proxy.$minioUrl}/${path}`;
      //移除校验规则
      if(proxy.isAuth(['Engineer'])){
        proxy.$refs['dialogForm'].resetFields('devbox'); //清除devbox的校验规则
      }else if(proxy.isAuth(['Planner'])){
        proxy.$refs['dialogForm_Planner'].resetFields('po'); //清除po的校验规则
      }
    }
  }

  //上传文件失败回调函数
  const pdfUploadError = (e) => {
    ElMessage.error('Unable to upload the file')
    console.error(e)
  }

  //删除文件之前的回调函数
  const pdfBeforeRemove = () => {

  }

  //删除文件成功回调函数
  const pdfRemoveSuccess = (file, fileList) => {
    //如果上传重复的文件会触发before-upload，此时file.status是ready，而before-upload之后又会触发该事件，从而导致文件被删除
    //而上传成功的回调执行该方法返回的file.status是success，所以我们必须保证文件上传成功后才能触发此方法
    if(file && file.status === "success"){
      let filePath = dialog.dataForm.deviationFile.filter( f => f.includes(file.name))[0];
      let removeFile = {path: filePath};
      proxy.$http("/file/removePDF", "DELETE", removeFile, true, resp => {
        if(resp.code === 200){
          dialog.dataForm.deviationFile = dialog.dataForm.deviationFile.filter( f => !f.includes(file.name));
          //if planner deleted file and try to click cancel button, disable cancel button
          if(proxy.isAuth(['Planner']) && !dialog_planner.isFirstTime){
            dialog_planner.disabled = true;
          }
        }else{
          ElMessage.error('Unable to remove the file')
        }
      })
    }

  }

  //添加Deviation
  //添加体检内容
  const addItem = () => {
    //这里添加一个空的JSON对象，目的是添加后下拉列表没有默认选中项，文本框都是空的
    dialog.dataForm.item.push({});
  }

  //设置默认值为N/A
  const handleDeviation = (index, event) => {
    if(String(event.target.value).trim() === ""){
      dialog.dataForm.item[index].number = "N/A";
      dialog.dataForm.item[index].qty = "N/A";
    }
  }

  //根据索引删除deviation
  const deleteItem = (index) => {
    if(dialog.dataForm.item.length == 1){
      ElMessage.error('At least one deviation is required')
    }else{
      dialog.dataForm.item.splice(index, 1);
    }
  }

  //发送Ajax添加/保存Fair
  const dataFormSubmit = (role) => {
    if(role === 'Engineer'){
      if(!dialog.update){//add fair
        addFair();
      }else{//update fair
        editFair('Engineer');
      }
    }else if(role === 'Planner'){
      editFair('Planner');
    }

  }

  const editFair = (role) => {
    let modal = "";
    let data = null;

    if(role === 'Engineer'){
      modal = 'dialogForm';
      data = dialog.dataForm;
    } else if(role === 'Planner'){
      modal = 'dialogForm_Planner';
      data = dialog_planner.dataForm;
    }
    proxy.$refs[modal].validate(valid => {
      if(valid){
        dialog_planner.dataForm.po = dialog.dataForm.deviationFile;
        proxy.$http("/tracker/editFairBy"+role, "POST", data, true, resp => {
          if (resp.flag){
            ElMessage.success("Fair edited successfully")
            if(role === 'Engineer'){
              dialog.visible = false;
            }
            else if(role === 'Planner'){
              dialog_planner.visible = false;
            }
            dialog.visible = false;
            loadDataList();
          }else{
            ElMessage.error("Unable to edit the FAIR")
          }
        })


      }else{
        ElMessage.error('Data validation failed')
      }
    })
  }

  const addFair = () => {
    for (let d of dialog.dataForm.item){
      if(d.number == undefined || d.number == ""){
        d.number = "N/A";
      }
      if(d.qty == undefined || d.qty == ""){
        d.qty = "N/A";
      }
    }

    ElMessageBox.confirm(
        "Once a FAIR is added, only the reason can be modified. Are you sure to proceed?",
        "Warning",
        {
          confirmButtonText: 'Proceed',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true,
        }
    ).then(() => {
      //发送请求
      proxy.$refs['dialogForm'].validate(valid => {
        if(valid){
          dialog.dataForm.engEmail = localStorageUtil.get("username");
          proxy.$http("/tracker/insert", "POST", dialog.dataForm, true, resp => {
            if(resp.flag){
              ElMessage.success("Fair added successfully")
              dialog.visible = false;
              loadDataList();
            }else{
              ElMessage.error("Unable to add the FAIR")
            }

          })
        }else{
          ElMessage.error('Data validation failed')
        }
      })

    }).catch(e => {
      console.log(e)
    })
  }

  const editDownload = (id) => {
    proxy.$http(`/tracker/getDownloadInfo/${id}`, "GET", null, true, resp => {
      if(resp.code === 200){
        download.id = id;
        download.disablePO = resp.result.po == null || resp.result.po.length == 0;
        download.deviation = resp.result.deviation;
        download.po = resp.result.po;
        download.visible = true;
      }else{
        ElMessage.error("Service Error");
      }
    })
  }

  const downloadFiles = async (type:string) => {
    ElMessage.info("Start downloading file...");

    let id = download.id;
    let token = localStorageUtil.get("token");

    /** 分别下载一个个文件
    proxy.$http(`/file/countPDF?id=${id}&type=${type}&token=${token}`, "GET", null, true, resp => {
      if(resp.code === 200){

        for (let i = 0; i < resp.count; i++) {
          let url = `${proxy.$baseUrl}/file/downloadPDF?id=${id}&count=${i}&type=${type}&token=${token}`;

          let timer:any = null;
          try{
            //创建超链接对象
            let eleIF  = document.createElement('iframe');
            //设置超链接地址
            eleIF.src = url;
            eleIF.style.display = 'none';
            document.body.appendChild(eleIF);
            timer = setTimeout(() => {
              document.body.removeChild(eleIF)
            }, 1000); // 1000 毫秒 = 1秒
          }catch (e){
            console.log(e);
          }finally {
            clearTimeout(timer);
          }

        }

        download.visible = false;
      }else{
        ElMessage.error("Unable to download the file");
      }

    })
    **/

    try {
      const response = await axios({
        method: 'post',
        url: `${proxy.$baseUrl}/file/downloadZIP?id=${id}&type=${type}&token=${token}`,
        //data: fileKeys,
        //params: { bucketName },
        responseType: 'blob'
      });

      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'files.zip');
      document.body.appendChild(link);
      link.click();

      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('下载失败:', error);
      ElMessage.error("Unable to download the file");
    }
  }

  const editHandle = (id) => {
    //Eng - edit fair
    if(proxy.isAuth(['Engineer'])){
      dialog.update = true;
      data.loading = true;
      proxy.$http("/tracker/getFairByEngineer", "POST", {id}, true, resp => {
        if(resp.code === 200){
          dialog.dataForm.clsPn = resp.result.clsPn;
          dialog.dataForm.reason = resp.result.reason;
          dialog.dataForm.id = id;
          dialog.visible = true;
        }else{
          ElMessage.error("Service error");
        }
        data.loading = false;
      })
    }else if(proxy.isAuth(['Planner'])){
      //移除校验规则
      proxy.$nextTick(()=>{//确保DOM更新后执行操作
        proxy.$refs['dialogForm_Planner'].resetFields(); //清除表单数据和校验规则
      })
      //Planner - edit fair
      data.loading = true;
      dialog.upload.files = [];
      proxy.$http("/tracker/getFairByPlanner", "POST", {id}, true, resp => {
        if(resp.code === 200){
          dialog_planner.dataForm.clsPn = resp.result.clsPn;
          dialog_planner.dataForm.revision = resp.result.revision;
          dialog_planner.dataForm.customer = resp.result.customer;
          dialog_planner.dataForm.engName = resp.result.engName;
          dialog_planner.dataForm.reason = resp.result.reason;
          dialog_planner.dataForm.so = resp.result.so;
          dialog_planner.isFirstTime = dialog_planner.dataForm.so == null;

          if(resp.result.po != null){
            resp.result.po.map(item => {
              dialog.upload.files.push({
                url: item,
                name: item.split("/")[3]
              });
            })
          }

          dialog_planner.dataForm.targetShipDate = resp.result.targetShipDate;

          dialog_planner.dataForm.id = id;
          dialog_planner.visible = true;
        }else{
          ElMessage.error("Service error");
        }
        data.loading = false;
      })
    }else if(proxy.isAuth(['Admin'])){//assign FAI Owner
      proxy.$nextTick(()=>{//确保DOM更新后执行操作
        proxy.$refs['dialogForm'].resetFields(); //清除表单数据和校验规则
      })
      data.loading = true;
      dialog.dataForm.id = id;
      proxy.$http(`/fairOwner/getFairOwner/${id}`, "GET", null, true, resp => {
        if(resp.code === 200){
          dialog.dataForm.fairOwnerList = resp.fairOwnerList;
          dialog.dataForm.fairOwner = resp.fair.fairOwner;
          dialog.dataForm.clsPn = resp.fair.clsPn;
          dialog.visible = true;
        }else{
          ElMessage.error("Service error");
        }
        data.loading = false;
      })
    }

  }

  const deleteHandle = (id) => {
    proxy.$http("/tracker/getFairByEngineer", "POST", {id}, true, resp => {
      if(resp.code === 200){
        dialog.dataForm.clsPn = resp.result.clsPn;

        ElMessageBox.confirm(
            `Are you sure to delete this Fair with CLS PN - ${dialog.dataForm.clsPn}?`,
            "Warning",
            {
              confirmButtonText: 'Delete',
              cancelButtonText: 'Cancel',
              type: 'warning',
              center: true
            }
        ).then(() => {
          //发送请求
          proxy.$http("/tracker/delete", "POST", {id}, true, resp => {
            if(resp.flag){
              ElMessage.success("Fair deleted successfully")
              loadDataList();
            }else{
              ElMessage.error("Unable to delete the FAIR")
            }

          })

        }).catch(e => {
          console.log(e)
        })

      }else{
        ElMessage.error("Service error");
        return;
      }
    })
  }

  const disabledDate = (time: Date) => {
    return time.getTime() < Date.now()
  }

  const cancel = (role:string) => {
    let msg:string = "Please delete all the files you have uploaded first";
    if(role === 'Engineer'){
      if(dialog.upload.files.length > 0){
        ElMessage.error(msg);
        return;
      }
      dialog.visible = false
    }else if(role === 'Planner'){
      if(dialog_planner.isFirstTime && dialog.upload.files.length > 0){
        ElMessage.error(msg);
        return;
      }
      dialog_planner.visible = false
    }
  }

  const fairOwnerSubmit = () => {
    //发送请求
    proxy.$refs['dialogForm'].validate(valid => {
      if(valid){
        let data = {
          "id": dialog.dataForm.id,
          "fairOwner": dialog.dataForm.fairOwner,
          "fromEmail": localStorageUtil.get("username"),
          "clsPn": dialog.dataForm.clsPn
        }
        proxy.$http("/fairOwner/add", "PUT", data, true, resp => {
          if(resp.flag){
            ElMessage.success("Fair owner updated successfully")
            dialog.visible = false;
            loadDataList();
          }else{
            ElMessage.error("Unable to add the fair owner")
          }

        })
      }else{
        ElMessage.error('Data validation failed')
      }
    })
  }

</script>

<style scoped lang="less">
.upload-pdf{
  width: 100%;
}
</style>