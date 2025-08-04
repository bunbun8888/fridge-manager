'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ItemList from './components/ItemList'
import { Supply } from './types' // ← 追加！

export default function SuppliesPage() {
  const [items, setItems] = useState<Supply[]>([]) // ← 型を指定

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSupplies = async () => {
      const { data, error } = await supabase
        .from('supplies')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setItems(data as Supply[]) // ← as型で明示（or zodでvalidateしてもOK）
      }
    }

    fetchSupplies()
  }, [])

  if (error) {
    return <div>エラー: {error}</div>
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">消耗品の在庫一覧</h1>
      <ItemList items={items} />
    </main>
  )
}
