export interface Hero {
  ename: number
  cname: string
  title?: string
  hero_type?: number
  hero_type2?: number
}

export interface Region {
  code: string
  name: string
  children?: Region[]
}

export interface RankItem {
  rankNo: number
  roleId: string
  roleIcon: string
  roleName: string
  roleJobName: string
  rankValue: string
}

export interface RankData {
  list: RankItem[]
  updateTime: string
  total: number
}
