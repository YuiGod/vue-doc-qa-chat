<script setup lang="ts">
import { Search, RefreshRight, View, EditPen, Delete } from '@element-plus/icons-vue'
import { onMounted, ref, reactive, toRaw } from 'vue'
import { docPageApi, docDeleteApi } from '@/api/documents'
import type { DocParamsType, DocTableType } from '@/api/documents/types'
import writeForm from './writeForm.vue'

const loading = ref(false)
const dialog = reactive({
  writeFormVisible: false
})
const searchForm = reactive({
  name: ''
})
const tableState = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const tableDataList = ref<DocTableType[]>([])

// 选中当前行数据
let currentRow: DocTableType | null = null

onMounted(() => {
  // 页面加载完成时就调用获取一次table数据
  // getTableList()
})

/**
 * 获取表格数据
 * @param params 页码参数
 */
async function getTableList(params?: DocParamsType) {
  loading.value = true
  const res = await docPageApi(
    params || {
      pageNum: 1,
      pageSize: 10
    }
  ).finally(() => {
    loading.value = false
  })

  tableState.pageNum = res.data.pageNum
  tableState.pageSize = res.data.pageSize
  tableState.total = res.data.total
  tableDataList.value = res.data.list
}

/**
 * 重新加载表格
 */
const reloadTable = () => {
  const params: DocParamsType = {
    pageNum: tableState.pageNum,
    pageSize: tableState.pageSize
  }
  getTableList(params)
}

const onSearch = () => {
  const params: DocParamsType = {
    pageNum: 1,
    pageSize: tableState.pageSize,
    name: searchForm.name
  }
  getTableList(params)
}

const onSearchReset = () => {
  searchForm.name = ''
}

const onAdd = () => {
  dialog.writeFormVisible = true
  currentRow = null
}

const onEdit = (index: number, row: DocTableType) => {
  dialog.writeFormVisible = true
  currentRow = toRaw(row)
}

const onDeleteRow = async (index: number, row: DocTableType) => {
  loading.value = true
  await docDeleteApi(row.id).catch(err => {
    ElMessage.success('删除失败！' + err.message)
    loading.value = false
  })
  ElMessage.success('删除成功！')
  reloadTable()
}

/**
 * 表单弹窗提交成功回调
 */
const onOk = () => {
  reloadTable()
}
</script>

<template>
  <div class="main-full upload-box">
    <div class="card search-card">
      <el-form :inline="true" :model="searchForm" class="search-form-inline">
        <el-form-item label="文件名称">
          <el-input v-model="searchForm.name" placeholder="请输入文件名称……" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">查询</el-button>
          <el-button :icon="RefreshRight" :loading="loading" @click="onSearchReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="card table-card">
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="onAdd">添加</el-button>
      </div>

      <el-table :data="tableDataList" v-loading="loading" element-loading-text="加载中..." :border="true" class="table-main">
        <el-table-column type="index" align="center" label="序号" width="60" />
        <el-table-column prop="name" align="center" label="文件名称">
          <template #default="scope">
            <el-link type="primary" :href="'/api/documentQA/read/' + scope.row.id" target="_blank">
              {{ scope.row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="date" align="center" label="上传时间" width="300" />
        <el-table-column align="center" label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" link>
              <el-link type="primary" :underline="false" :icon="View" :href="'/api/documentQA/read/' + scope.row.id" target="_blank">
                查看
              </el-link>
            </el-button>
            <el-button type="primary" link :icon="EditPen" @click="onEdit(scope.$index, scope.row)">编辑</el-button>
            <el-popconfirm title="确定要删除该行吗？" width="180" placement="top-end" @confirm="onDeleteRow(scope.$index, scope.row)">
              <template #reference>
                <el-button type="primary" link :icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty :image-size="100" />
        </template>
      </el-table>

      <el-pagination
        v-model:current-page="tableState.pageNum"
        v-model:page-size="tableState.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableState.total"
        class="pagination-right"
      />
    </div>

    <write-form
      v-if="dialog.writeFormVisible"
      :open="dialog.writeFormVisible"
      :current-row="currentRow"
      @ok="onOk"
      @closed="closed => (dialog.writeFormVisible = closed)"
    />
  </div>
</template>

<style lang="scss" scoped>
.upload-box {
  display: flex;
  flex-direction: column;

  .search-card {
    padding: 18px 18px 0;
    margin-bottom: 10px;

    .search-form-inline {
      .el-input {
        --el-input-width: 220px;
      }
    }
  }

  .table-card {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;

    .table-main {
      flex: 1;
      width: 100%;
    }
  }
}
</style>
