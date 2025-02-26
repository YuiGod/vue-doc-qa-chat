<script setup lang="ts">
import type { FormInstance, FormRules, UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import type { DocTableType } from '@/api/documents/types'
import { BaseDialog } from '@/components/Dialog'
import { UploadFilled } from '@element-plus/icons-vue'
import { type PropType, reactive, ref, toRaw } from 'vue'
import { docAddApi, docEditApi } from '@/api/documents/index'

const props = defineProps({
  currentRow: {
    type: Object as PropType<DocTableType | null>,
    default: () => null
  },
  open: {
    type: Boolean,
    required: false,
    default: false
  }
})

// 判断弹窗表单是新增，还是编辑
const isEdit = props.currentRow == null ? false : true
/**
 * ok: 表单提交成功后的回调
 * closed: 	Dialog 关闭动画结束时的回调
 */
const emit = defineEmits(['ok', 'closed'])
const loading = ref(false)
const visible = ref(props.open)

const uploadRef = ref<UploadInstance>()
// 要上传的文件 Blob，因为是单文件上传，所以不需要数组
let docFile: File | null = null
// 编辑表单时，显示已上传的文件
const fileList = isEdit
  ? ref<UploadUserFile[]>([
      {
        name: props.currentRow?.fileName || '新建文件.pdf',
        url: props.currentRow?.filePath
      }
    ])
  : ref<UploadUserFile[]>([])

// 表单Ref
const docFormRef = ref<FormInstance>()

// 初始化表单数据，数据赋值
const docForm = isEdit
  ? reactive<DocTableType>(props.currentRow as DocTableType)
  : reactive<DocTableType>({
      id: '',
      name: '',
      fileName: '',
      filePath: '',
      date: ''
    })

/**
 * 表单校验规则
 */
const rules = reactive<FormRules<DocTableType>>({
  name: [{ required: true, message: '请输入文件名称！', trigger: 'blur' }],
  fileName: [{ required: true, message: '请上传文件！', trigger: 'change' }]
})

/**
 * 单一文件上传，重新选择时，覆盖替换前一个文件
 * @param files 上传文件列表
 */
const uploadOnExceed: UploadProps['onExceed'] = files => {
  const file = files[0] as UploadRawFile

  if (file.type !== 'application/pdf') {
    ElMessage.error('请上传正确的 pdf 文件！')
    return
  }
  uploadRef.value!.clearFiles()
  uploadRef.value!.handleStart(file)
}

const uploadOnChange: UploadProps['onChange'] = uploadFile => {
  if (uploadFile.raw?.type !== 'application/pdf') {
    uploadRef.value!.clearFiles()
    ElMessage.error('请上传正确的 pdf 文件！')
    return
  }
  docFile = uploadFile.raw
  docForm.fileName = uploadFile.name
}

const uploadOnRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  if (uploadFiles.length === 0) {
    docForm.fileName = ''
    docFile = null
  }
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
  Object.keys(doc).forEach(key => {
    formData.append(key, doc[key as keyof DocTableType])
  })
  // 请求后台提交表单
  isEdit
    ? await docEditApi(formData).finally(() => (loading.value = false))
    : await docAddApi(formData).finally(() => (loading.value = false))

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
  <BaseDialog v-model="visible" @closed="onClosed()">
    <el-form ref="docFormRef" :model="docForm" :rules="rules" label-width="120px" status-icon>
      <el-form-item label="文件名称" prop="name">
        <el-input v-model="docForm.name" />
      </el-form-item>
      <el-form-item label="上传文件" prop="fileName">
        <el-upload
          ref="uploadRef"
          action="#"
          drag
          accept="application/pdf"
          :limit="1"
          v-model:file-list="fileList"
          :auto-upload="false"
          :on-exceed="uploadOnExceed"
          :on-change="uploadOnChange"
          :on-remove="uploadOnRemove"
          class="upload-card"
        >
          <el-icon class="upload-icon"><upload-filled /></el-icon>
          <div class="upload-text">拖动或 <em>点击上传pdf文件</em></div>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" :loading="loading" @click="onSubmit(docFormRef)">提交</el-button>
      <el-button @click="onClose(docFormRef)">关闭</el-button>
    </template>
  </BaseDialog>
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
