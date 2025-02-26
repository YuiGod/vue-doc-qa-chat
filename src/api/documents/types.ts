interface DocParamsType {
  pageNum: number
  pageSize: number
  id?: string
  name?: string
}

interface ResponseDocPageType {
  pageNum: number
  pageSize: number
  total: number
  list: DocTableType[]
}

interface DocTableType {
  id: string
  name: string
  fileName: string
  filePath: string
  date: string
}

export type { DocParamsType, ResponseDocPageType, DocTableType }
