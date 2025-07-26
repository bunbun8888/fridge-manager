'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Message from '@/components/message'

type Item = {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  expiry_date: string | null
  storage_location?: string
}

const categoryOrder = ['青果', '肉/加工品', '海鮮系', '乳製品', '飲み物', '調味料', '粉', '加工食品', '冷凍食品', '米', '乾麺', 'パン', 'その他']

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '未設定'
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function getDaysLeft(expiryDate: string) {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function SearchParamsWrapper() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')

  return (
    <>
      {success === 'added' && <Message type="success" text="✅ 食材を追加しました" />}
      {success === 'true' && <Message type="success" text="✅ 食材を更新しました" />}
      {success === 'deleted' && <Message type="success" text="✅ 食材を削除しました" />}
      {error === 'delete' && <Message type="error" text="❌ 食材の削除に失敗しました" />}
      {error === 'true' && <Message type="error" text="❌ エラーが発生しました" />}
    </>
  )
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [storageFilter, setStorageFilter] = useState('すべて')
  const router = useRouter()

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('category', { ascending: true })
      .order('expiry_date', { ascending: true })

    if (!error && data) {
      setItems(data)
    } else {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleDelete = async (id: string) => {
    const ok = confirm('このアイテムを削除してもよいですか？')
    if (!ok) return

    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) {
      console.error(error)
      router.push('/?error=delete')
    } else {
      await fetchItems()
      router.push('/?success=deleted')
    }
  }

  const storageLocations = Array.from(new Set(items.map(i => i.storage_location || '未設定')))
  const filteredItems = storageFilter === 'すべて'
    ? items
    : items.filter(item => (item.storage_location || '未設定') === storageFilter)

  const groupedItems = filteredItems.reduce<Record<string, Item[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <Suspense fallback={null}>
        <SearchParamsWrapper />
      </Suspense>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">冷蔵庫の中身</h1>
        <div>
          <label className="mr-2">保存場所:</label>
          <select
            value={storageFilter}
            onChange={(e) => setStorageFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="すべて">すべて</option>
            {storageLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <Link
        href="/items/new"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        ＋ 食材を追加する
      </Link>

      {categoryOrder.map((category) => {
        const itemsInCategory = groupedItems[category]
        if (!itemsInCategory) return null

        return (
          <section key={category} className="mb-8">
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">{category}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {itemsInCategory.map((item) => (
                <li key={item.id} className="p-4 border rounded shadow-sm">
                  <div className="font-semibold text-lg">
                    {item.name}（{item.quantity}{item.unit}）
                  </div>
                  <div className={`text-sm ${
                    item.expiry_date && new Date(item.expiry_date) < new Date()
                      ? 'text-red-600 font-semibold'
                      : getDaysLeft(item.expiry_date || '') <= 3
                        ? 'text-orange-500 font-semibold'
                        : 'text-gray-600'
                  }`}>
                    賞味期限: {formatDate(item.expiry_date)}
                    {item.expiry_date && (
                      <>
                        <br />
                        {(() => {
                          const days = getDaysLeft(item.expiry_date)
                          return days < 0
                            ? '（期限切れ）'
                            : `（あと${days}日）`
                        })()}
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    保存場所: {item.storage_location || '未設定'}
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Link
                      href={`/items/edit/${item.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </main>
  )
}
