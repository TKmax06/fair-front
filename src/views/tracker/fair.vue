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
        <!--  type="date": 只显示日期-->
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
                   :disabled="!proxy.isAuth(['ROOT', 'USER:INSERT'])"
                   @click="addHandle()">
          Add
        </el-button>

        <!-- 编辑按钮 -->
        <el-button type="primary"
                   :disabled="!proxy.isAuth(['ROOT', 'USER:INSERT'])"
                   @click="editHandle()">
          Edit
        </el-button>

      </el-form-item>

    </el-form>

  </div>
</template>

<script setup lang="ts">

  import {reactive, getCurrentInstance, ref, onMounted} from "vue";
  const {proxy} = getCurrentInstance();
  import {dayjs} from "element-plus";

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
</script>

<style scoped>

</style>