// 型定義（共通化するなら types.ts に）
export type Supply = {
  id: string
  user_id: string
  name: string
  memo?: string
  category?: string
  quantity: number
  unit?: string
  price?: number
  purchase_amount?: number
  expires_at?: string // ISO文字列（日付）
  min_threshold?: number
  is_essential?: boolean
  created_at?: string
  updated_at?: string
}
