<template>
  <div>
    <!-- 搜索区域
		  inline="true": 控件水平排成一行
	  -->
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="form">

      <el-form-item label="Date">
        <el-date-picker
            v-model="dataForm.dates"
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
                   :disabled="!proxy.isAuth(['ENG'])"
                   @click="addHandle()">
          Add
        </el-button>

      </el-form-item>

    </el-form>

    <!-- 表格 -->
    <el-table :data="data.dataList" border v-loading="data.loading" :header-cell-style="headerCellStyle">
      <el-table-column label="ENG" header-align="center" align="center" width="50">
        <el-table-column type="index" header-align="center" align="center" width="50" label="#">
          <!-- #default="scope" 定义了一个名为 default 的插槽，并将当前行的数据传递给一个名为 scope 的变量 -->
          <template #default="scope">
            <!--
              显示每条记录的索引
              scope.$index：记录在数组中的索引
              比如假设每页显示10条记录，那么第二页第一条记录在数组中的索引为0，即scope.$index=0
              那么该条记录经过计算后显示的索引为 (2-1)*10+0+1=11
            -->
            <span>{{ (data.pageIndex - 1) * data.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <!-- prop：注意后端返回的json对象的属性名必须和这里的prop对应才能回显数据 -->
        <el-table-column prop="date" header-align="center" align="center" label="Date" sortable :min-width="flexWidth('date', data.dataList, 'Date')"/>
        <el-table-column prop="clspn" header-align="center" align="center" label="CLS PN" :min-width="flexWidth('clspn', data.dataList, 'CLS PN')"/>
        <el-table-column prop="revision" header-align="center" align="center" label="Revision" :min-width="flexWidth('revision', data.dataList, 'Revision')"/>
        <!-- :show-overflow-tooltip：文字有缩略效果 -->
        <el-table-column prop="customer" header-align="center" align="center" label="Customer" :min-width="flexWidth('customer', data.dataList, 'Customer')"/>
        <el-table-column prop="engname" header-align="center" align="center" label="Eng Name" :min-width="flexWidth('engname', data.dataList, 'Eng Name')"/>
        <el-table-column prop="devnumber" header-align="center" align="center" label="Deviation #" :min-width="flexWidth('devnumber', data.dataList, 'Deviation #')"/>
        <el-table-column prop="devqty" header-align="center" align="center" label="Deviation QTY" :min-width="flexWidth('devqty', data.dataList, 'Deviation QTY')"/>
        <el-table-column prop="devbox" header-align="center" align="center" label="Deviation Dropbox" :min-width="flexWidth('devbox', data.dataList, 'Deviation Dropbox')"/>
        <el-table-column prop="reason" header-align="center" align="center" label="Reason"
                         :show-overflow-tooltip="true" :min-width="flexWidth('reason', data.dataList, 'Reason')"/>
        <el-table-column prop="planneremail" header-align="center" align="center" label="Planner Email" :min-width="flexWidth('planneremail', data.dataList, 'Planner Email')"/>
        <el-table-column prop="fairtype" header-align="center" align="center" label="Fair Type" :min-width="flexWidth('fairtype', data.dataList, 'Fair Type')"/>
      </el-table-column>

      <el-table-column label="Planner" header-align="center" align="center">
        <el-table-column prop="so" header-align="center" align="center" label="SO" :min-width="flexWidth('so', data.dataList, 'SO')"/>
        <el-table-column prop="po" header-align="center" align="center" label="PO" :min-width="flexWidth('po', data.dataList, 'PO')"/>
        <el-table-column prop="targetdate" header-align="center" align="center" label="Target Ship Date" :min-width="flexWidth('targetdate', data.dataList, 'Target Ship Date')"/>
      </el-table-column>

      <el-table-column label="Carmen/Jules" header-align="center" align="center">
        <el-table-column prop="fairowner" header-align="center" align="center" label="FAI Owner" :min-width="flexWidth('fairowner', data.dataList, 'FAI Owner', 20)"/>
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
      <el-table-column header-align="center" align="center" width="100" label="Action" fixed="right">
        <template #default="scope">
          <el-button type="primary" link style="padding: 0;"
                     :disabled="!proxy.isAuth(['ADMIN', 'ENG'])"
                     @click="editHandle(scope.row.id)">
            Edit
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- Add/Edit Fair(ENG) -->
    <el-dialog v-model="dialog.visible" :title="!dialog.dataForm.id ? 'Add' : 'Edit'"
               :close-on-click-modal="false" width="600px" v-if="proxy.isAuth(['ENG'])">

      <el-form :model="dialog.dataForm" :rules="dialog.dataRule" ref="dialogForm" label-width="140px">

        <!-- prop="username": 绑定 dialog.dataForm 中 username 的验证规则，并应用到文本框上-->
        <el-form-item label="CLS PN" prop="clspn" label-position="left">
          <el-input v-model="dialog.dataForm.clspn"
                    maxlength="20" clearable @change="autoFillCustomer"/>
        </el-form-item>

        <el-form-item label="Revision" prop="revision" label-position="left">
          <el-input v-model="dialog.dataForm.revision"
                    maxlength="5" clearable />
        </el-form-item>

        <!-- customer is auto filled based on the suffix of the CLS PN -->
        <el-form-item label="Customer" prop="customer" label-position="left">
          <el-input v-model="dialog.dataForm.customer" disabled/>
        </el-form-item>

        <el-form-item label="Eng Name" prop="engname" label-position="left">
          <el-input v-model="dialog.dataForm.engname"/>
        </el-form-item>

        <el-form-item label="Deviation" label-position="left" class="is-required">
          <!-- :gutter="10" 列间距为10px -->
          <el-row :gutter="10" class="item-row"
                  v-for="(one, $index) in dialog.dataForm.item" :key="$index">
            <el-col :span="10">
              <el-input v-model="one.number" placeholder="Deviation #" maxlength="50" clearable @blur="handleDeviation($index, $event)"/>
            </el-col>
            <el-col :span="10">
              <el-input v-model="one.qty" placeholder="Deviation QTY" maxlength="10" clearable @blur="handleDeviation($index, $event)"/>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" :icon="Delete" @click="deleteItem($index)" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="Deviation Dropbox" label-position="left" prop="devbox">
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
              :limit="3"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop PDF here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                No more than 3 PDFs allowed to upload, each PDF file size less than 1MB
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
        <el-form-item label="Planner Email" prop="planneremail" label-position="left">
          <el-select v-model="dialog.dataForm.planneremail" placeholder="Select planner">
            <el-option v-for="p in dialog.dataForm.plannerList" :label="p.email"
                       :value="p.id" :key="p.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Fair Type" prop="fairtype" label-position="left">
          <el-select v-model="dialog.dataForm.fairtype">
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
        <el-button type="danger" @click="addItem">Add Deviation</el-button>
        <el-button @click="dialog.visible = false">Cancel</el-button>
        <el-button type="primary" @click="dataFormSubmit">{{!dialog.dataForm.id ? 'Save' : 'Edit'}}</el-button>
      </span>
      </template>
    </el-dialog>

    <el-divider />

    <!-- 分页控件 -->
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle" :current-page="data.pageIndex"
                   :page-sizes="[10, 20, 50]" :page-size="data.pageSize"
                   :total="data.totalCount"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

  </div>
</template>

<script setup lang="ts">

import {reactive, getCurrentInstance, onMounted} from "vue";
import {dayjs, ElMessage, UploadFile, UploadFiles} from "element-plus";
import f from "@/utils/tableWidthUtil.ts";
import { UploadFilled, Delete } from '@element-plus/icons-vue'
import localStorageUtil from "@/utils/localStorageUtil.ts";

let {flexWidth} = f;

const {proxy} = getCurrentInstance();

//校验Deviation Dropbox
const uploadFileChange = (rule, value, callback) => {
  if(dialog.upload.files.length === 0){
    return callback("Deviation Dropbox cannot be empty!");
  }
  return true;
}

//过滤控件变量
const dataForm = reactive({
  dates: null
})

//弹窗控件变量
const dialog = reactive({
  visible: false, //是否显示弹窗，调试完成后记得改为false
  update: false,
  dataForm: {
    id: null, //Fair主键
    clspn: null,
    revision: null,
    customer: null,
    customerList: [],
    plannerList: [],
    engname: null,
    item: [{
      number: "",
      qty:""
    }], //deviation
    reason: null,
    planneremail: null,
    fairtype: null,
    pdf: [], //文件保存在minio服务器的相对路径
    pdfUrl: null
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
    clspn: [
      {required: true, message: 'PN cannot be empty!'}
    ],
    revision: [
      {required: true, message: 'Revision cannot be empty!'}
    ],
    customer: [{required: true, message: 'Customer cannot be empty!'}],
    engname: [{required: true, message: 'Eng name cannot be empty!'}],
    devbox: [{required: true, validator:uploadFileChange, trigger: 'change'}],
    reason: [{required: true, message: 'Reason cannot be empty!'}],
    planneremail: [{required: true, message: 'Planner email cannot be empty!'}],
    fairtype: [{required: true, message: 'Fair type cannot be empty!'}]
  }

})

const searchHandle = () => {
  console.log(dataForm.dates);
}

const data = reactive({
  dataList:[
    {
      date: "2024-10-12",
      clspn: "1596516-1UF*",
      revision: "AA",
      customer: "COV/NPI",
      engname: "Mazin Mahdi",
      devnumber: "11111",
      deviationbox: "N/A",
      devqty: 10,
      devbox: "fair.pdf",
      reason: "year lapse in build (CL): Previous FAIR was included on top CCA 1596516-1UF in 2013 in PDF format.\t" +
          "Multimeter is replaced with FLYING PROBE test.MOC P-45141-06",
      planneremail: "nishap@celestica.com",
      fairtype: "Full"
    },
    {
      date: "2024-10-15",
      clspn: "1596516-2UF*",
      revision: "BB",
      customer: "HUMS",
      engname: "Sreekumar Narayanapillai",
      devnumber: "22222",
      deviationbox: "N/A",
      devqty: 15,
      devbox: "fair123.pdf",
      reason: "Changing the suffix UF to UFC.Adding inhouse coating and final mechanical",
      planneremail: "tyounus@celestica.com",
      fairtype: "Partial"
    }
  ],
  pageIndex: 1, //当前页码
  pageSize: 10, //每页记录数
  totalCount: 0, //总记录数
  loading: false, //不显示加载进度条
})

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
  dialog.dataForm.customerList = [];
  dialog.dataForm.plannerList = [];
  dialog.dataForm.pdf = [];
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
  console.log("上传文件列表 => ", dialog.upload.files[0].name)
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

const autoFillCustomer = (val) => {
  dialog.dataForm.clspn = val.toUpperCase().trim();
  let pnSuffix = dialog.dataForm.clspn?.slice(-3);
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
    dialog.dataForm.pdf.push(path);
    //上传控件中显示已上传的文件(完整路径)
    dialog.dataForm.pdfUrl = `${proxy.$minioUrl}/${path}`;
    //移除校验规则
    proxy.$refs['dialogForm'].resetFields('devbox'); //清除devbox的校验规则
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
    let filePath = dialog.dataForm.pdf.filter( f => f.includes(file.name))[0];
    let removeFile = {path: filePath};
    proxy.$http("/file/removePDF", "DELETE", removeFile, true, resp => {
      if(resp.code !== 200){
        ElMessage.error('Unable to delete PDF')
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

//发送Ajax添加Fair
const dataFormSubmit = () => {
  for (let d of dialog.dataForm.item){
    if(d.number == undefined || d.number == ""){
      d.number = "N/A";
    }
    if(d.qty == undefined || d.qty == ""){
      d.qty = "N/A";
    }
  }

  //发送请求
  proxy.$refs['dialogForm'].validate(valid => {
    if(valid){
      const addJson = {

      }
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