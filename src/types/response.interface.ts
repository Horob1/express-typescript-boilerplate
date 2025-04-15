interface ISuccessResponse<T> {
  success: boolean
  data: T
  message: string
}

interface IMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface IPaginatedResponse<T> {
  success: boolean
  meta: IMeta
  data: T[]
  message: string
}

interface IErrorResponse {
  success: boolean
  message: string
  details?: string
}

export { ISuccessResponse, IPaginatedResponse, IErrorResponse }
