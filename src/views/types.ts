export interface AsideList {
  id: number
  authName: string
  path: string
  children?: AsideList[]
  order?: number
}

export interface TableData {
  id: number
  username: string
  email: string
  create_time: string
  mg_state: string
  role_name: string
  mobile: string
}

export interface AddUserForm {
  username?: string
  email?: string | undefined
  password?: string
  mobile?: string | undefined
  rid?: number | undefined | string
}

export interface Child {
  id: number
  authName: string
  path: string
  children?: Child[]
}

export interface Role {
  id: number
  roleName: string
  roleDesc: string
  children?: Child[]
}

export interface AddRole {
  roleName: string
  roleDesc: string
}

export interface Tree {
  id: number
  authName: string
  children?: Tree[]
}

export interface Rights {
  id: number
  authName: string
  level: string
  pid: number
  path: string
}

export interface Categories {
  cat_id: number
  cat_name: string
  cat_pid: number
  cat_level: number
  cat_deleted: boolean
  children?: Categories[]
}

export interface CreateForm {
  goods_name: string
  goods_price: number | null
  goods_number: number | null
  goods_cat: string
  goods_weight: number | null
}

export interface Order {
  order_id: number
  user_id: number
  order_number: string
  order_price: number
  order_pay: string
  is_send: string
  trade_no: string
  order_fapiao_title: string
  order_fapiao_company: string
  order_fapiao_content: string
  consignee_addr: string
  pay_status: string
  create_time: number
  update_time: number
}

export interface EditForm2 {
  is_send: number | null
  order_pay: number | null
  pay_status: number | null
  order_price: number | null
  order_number: number | null
}
