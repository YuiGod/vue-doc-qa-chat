<script setup lang="ts">
import { Search, RefreshRight, View, EditPen, Delete, QuestionFilled } from '@element-plus/icons-vue'
import { onMounted, ref, reactive, toRaw, markRaw } from 'vue'
import { docPageApi, docDeleteApi, docVectorAllApi } from '@/api/documents'
import type { DocParamsType, DocTableType } from '@/api/documents/types'
import writeForm from './writeForm.vue'

const loading = ref(false)
const tableLoadText = ref('加载中……')
/** 添加/编辑弹窗表单 */
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
  getTableList()
})

/**
 * 获取表格数据
 * @param params 页码参数
 */
async function getTableList(params?: DocParamsType) {
  loading.value = true

  const res = await docPageApi(params || { page_num: 1, page_size: 10 }).finally(() => (loading.value = false))
  tableState.pageNum = res.data.page_num
  tableState.pageSize = res.data.page_size
  tableState.total = res.data.total
  tableDataList.value = res.data.list
}

/**
 * 重新加载表格
 */
const reloadTable = () => {
  const params: DocParamsType = {
    page_num: tableState.pageNum,
    page_size: tableState.pageSize
  }
  getTableList(params)
}

const onSearch = () => {
  const params: DocParamsType = {
    page_num: 1,
    page_size: tableState.pageSize,
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
  await docDeleteApi(row.id).finally(() => (loading.value = false))
  ElMessage.success('删除成功！')
  reloadTable()

  ElMessageBox.confirm('删除的文件后，向量数据库还存在该文件的向量化数据。是否重新向量化数据？', '删除文件成功！是否重新向量化？', {
    type: 'info',
    icon: markRaw(QuestionFilled)
  })
    .then(() => {
      vectorAll()
    })
    .catch(() => {})
}

/**
 * 文档向量化事件
 */
const onVectorClick = async () => {
  //确定要将所有文档向量化吗？
  if (tableDataList.value.length === 0) {
    ElMessage.warning('请先上传文档。')
    return
  }

  ElMessageBox.confirm('确定要将所有文档向量化吗？', '向量化文档？', {
    type: 'info',
    icon: markRaw(QuestionFilled)
  })
    .then(async () => {
      vectorAll()
    })
    .catch(() => {})
}

/**
 * 文档向量化操作
 */
async function vectorAll() {
  loading.value = true
  tableLoadText.value = '向量化中……'

  try {
    await docVectorAllApi({ timeout: 600000 })
    ElMessage.success('文档已全部向量化。')
  } catch (error: any) {
    const message = error.response?.data?.message || error.message
    ElMessageBox.alert(`${message}`, '向量化失败！', {
      type: 'error',
      customStyle: {
        'max-height': '500px',
        'max-width': '50%',
        width: 'auto',
        overflow: 'auto'
      }
    })
  }

  loading.value = false
  tableLoadText.value = '加载中……'
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
        <el-button :disabled="tableDataList.length === 0" @click="onVectorClick()">向量化文档</el-button>
      </div>

      <el-table :data="tableDataList" v-loading="loading" :element-loading-text="tableLoadText" :border="true" class="table-main">
        <el-table-column type="index" align="center" label="序号" width="60" />
        <el-table-column prop="name" align="center" label="文件名称">
          <template #default="scope">
            <el-link type="primary" :href="'/api/documents/read/' + scope.row.id" target="_blank">
              {{ scope.row.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="suffix" align="center" label="文档格式" width="110" />

        <el-table-column prop="vector" align="center" label="向量化" width="200">
          <template #default="scope">
            <el-tag v-if="scope.row.vector === 'yes'">已向量化</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="date" align="center" label="上传时间" width="300" />
        <el-table-column align="center" label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" link>
              <el-link type="primary" :underline="false" :icon="View" :href="'/api/documents/read/' + scope.row.id" target="_blank">
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
