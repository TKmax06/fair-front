<template>
  <div>
    <!-- 搜索区域
		  inline="true": 控件水平排成一行
	  -->
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="form">

<!--      &lt;!&ndash; 搜索姓名 prop="name": 绑定dataRule中name的验证规则，并应用到文本框上&ndash;&gt;-->
<!--      <el-form-item prop="name">-->
<!--        <el-input v-model="dataForm.name" placeholder="姓名"-->
<!--                  maxlength="10" class="input" clearable="clearable" />-->
<!--      </el-form-item>-->
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
                   :disabled="!proxy.isAuth(['ADMIN', 'ENG'])"
                   @click="addHandle()">
          Add
        </el-button>

      </el-form-item>

    </el-form>

    <!-- 表格 -->
    <el-table :data="data.dataList" border v-loading="data.loading"
              :header-cell-style="{'background': '#f5f7fa'}" fit>
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
                     v-if="proxy.isAuth(['ADMIN', 'ENG'])"
                     @click="editHandle(scope.row.id)">
            Edit
          </el-button>
        </template>
      </el-table-column>

    </el-table>

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

  import {reactive, getCurrentInstance, ref, onMounted} from "vue";
  const {proxy} = getCurrentInstance();
  import {dayjs} from "element-plus";
  import f from "@/utils/tableWidthUtil.ts";

  let {flexWidth} = f;

  const dataForm = reactive({
    dates: null,
    roleList:[],
    deptList:[]
  })

  //搜索条件的校验规则
  const dataRule = reactive({
    //姓名必须为1-10位汉字
    name: [{required: false, message: '姓名格式错误!', pattern: '^[\u4e00-\u9fa5]{1,10}$'}],
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
    selections: [] //记录勾选的行数
  })


</script>

<style scoped lang="less">
  @import "./fair";
</style>