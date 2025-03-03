<script setup lang="ts">
import type { FormInstance, FormRules, UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import type { DocTableType } from '@/api/documents/types'
import { BaseDialog } from '@/components/Dialog'
import { UploadFilled } from '@element-plus/icons-vue'
import { reactive, ref, toRaw } from 'vue'
import { docAddApi, docEditApi } from '@/api/documents/index'
import type { AxiosProgressEvent } from 'axios'

/** props */
interface Props {
  /** 文件 */
  currentRow: DocTableType | null
  /** 弹窗显隐 */
  open: boolean
}

const { currentRow, open } = defineProps<Props>()

// 判断弹窗表单是新增，还是编辑
const isEdit = currentRow == null ? false : true

const title = isEdit ? '编辑' : '新增'
/**
 * ok: 表单提交成功后的回调
 * closed: 	Dialog 关闭动画结束时的回调
 */
const emit = defineEmits(['ok', 'closed'])
const loading = ref(false)
const visible = ref(open)
// 上传文件进度条
const uploadProgress = ref(0)
const uploadRef = ref<UploadInstance>()
// 要上传的文件 Blob，因为是单文件上传，所以不需要数组
let docFile: File | null = null
// 编辑表单时，显示已上传的文件
const fileList = isEdit
  ? ref<UploadUserFile[]>([
      {
        name: currentRow?.file_name || '新建文件.txt',
        url: currentRow?.file_path
      }
    ])
  : ref<UploadUserFile[]>([])

// 表单Ref
const docFormRef = ref<FormInstance>()

// 初始化表单数据，数据赋值
const docForm = isEdit
  ? reactive<DocTableType>(currentRow!)
  : reactive<DocTableType>({
      id: '',
      name: '',
      file_name: '',
      file_path: '',
      suffix: '',
      vector: '',
      date: ''
    })

/**
 * 表单校验规则
 */
const rules = reactive<FormRules<DocTableType>>({
  name: [{ required: true, message: '请输入文件名称！', trigger: 'blur' }],
  file_name: [{ required: true, message: '请上传文件！', trigger: 'change' }]
})

/**
 * 检查文件类型，只通过后缀为 pdf， txt，doc，docx，md 的文件
 * @param type 文件类型
 */
const checkFileType = (type: string, fileName: string): boolean => {
  if (
    type === 'application/pdf' ||
    type === 'text/plain' ||
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return true
  }

  const split = fileName.split('.')
  if (split.length >= 2 && split[split.length - 1] === 'md') {
    return true
  }

  return false
}

/**
 * 单一文件上传，重新选择时，覆盖替换前一个文件
 * @param files 上传文件列表
 */
const uploadOnExceed: UploadProps['onExceed'] = files => {
  const file = files[0] as UploadRawFile

  if (!checkFileType(file.type, file.name)) {
    ElMessage.error('请上传正确的文件！')
    return
  }
  uploadRef.value!.clearFiles()
  uploadRef.value!.handleStart(file)
}

const uploadOnChange: UploadProps['onChange'] = uploadFile => {
  if (!uploadFile.raw) {
    ElMessage.error('请上传正确的文件！')
    return
  }
  const type = uploadFile.raw.type
  if (!checkFileType(type, uploadFile.name)) {
    uploadRef.value!.clearFiles()
    ElMessage.error('请上传正确的文件！')
    return
  }
  docFile = uploadFile.raw
  docForm.file_name = uploadFile.name
}

const uploadOnRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  if (uploadFiles.length === 0) {
    docForm.file_name = ''
    docFile = null
  }
}

/**
 * axios 进度条监听
 * @param event AxiosProgressEvent
 */
const onProgress = (event: AxiosProgressEvent) => {
  if (!event.total) {
    return
  }
  uploadProgress.value = Math.round((event.loaded * 100) / event.total)
}

/**
 * 提交表单api
 */
const submitApi = async () => {
  loading.value = true
  const formData = new FormData()
  const doc = toRaw(docForm)
  if (docFile != null) {
    formData.append('file', docFile)
  }
  // 遍历表单数据填充到formData
  for (const [key, value] of Object.entries(doc)) {
    formData.append(key, value)
  }
  // 请求后台提交表单
  if (isEdit) {
    await docEditApi(formData, { onUploadProgress: onProgress }).finally(() => (loading.value = false))
  } else {
    await docAddApi(formData, { onUploadProgress: onProgress }).finally(() => (loading.value = false))
  }

  emit('ok', doc)
  ElMessage.success('保存成功！')
  visible.value = false
}

/**
 * 提交按钮事件
 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      submitApi()
    }
  })
}

/**
 * 关闭按钮事件
 */
const onClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  visible.value = false
}

/**
 * 关闭动画结束后，再传递closed给父组件来销毁弹窗组件
 */
const onClosed = () => {
  emit('closed', false)
}
</script>

<template>
  <BaseDialog :title="title" v-model="visible" @closed="onClosed()">
    <el-form ref="docFormRef" :model="docForm" :rules="rules" label-width="120px" status-icon>
      <el-form-item label="文件名称" prop="name">
        <el-input v-model="docForm.name" />
      </el-form-item>
      <el-form-item label="上传文件" prop="file_name">
        <el-upload
          ref="uploadRef"
          action="#"
          drag
          accept=".pdf, .txt, .doc, .docx, .md"
          :limit="1"
          v-model:file-list="fileList"
          :auto-upload="false"
          :on-exceed="uploadOnExceed"
          :on-change="uploadOnChange"
          :on-remove="uploadOnRemove"
          class="upload-card"
        >
          <el-icon class="upload-icon"><upload-filled /></el-icon>
          <div class="upload-text">拖动或 <em>点击上传 .pdf，.txt，.doc，.docx，.md文件</em></div>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" :loading="loading" @click="onSubmit(docFormRef)">提交</el-button>
      <el-button @click="onClose(docFormRef)">关闭</el-button>
    </template>
  </BaseDialog>

  <el-dialog
    v-model="loading"
    title="上传进度"
    width="500"
    append-to-body
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-progress :text-inside="true" :stroke-width="24" :percentage="uploadProgress" />
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-form {
  margin-right: 80px;

  .upload-card {
    width: 100%;

    .upload-icon {
      margin-bottom: 10px;
      font-size: 67px;
      color: var(--el-text-color-placeholder);
    }

    .upload-text {
      font-size: 14px;
      color: var(--el-text-color-regular);
      text-align: center;

      em {
        font-style: normal;
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
