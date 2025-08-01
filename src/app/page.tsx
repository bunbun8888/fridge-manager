'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Message from '@/components/message'
import { Menu } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'

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
const categoryTextColors: Record<string, string> = {
  '野菜': 'text-green-700',
  '肉/加工品': 'text-red-700',
  '海鮮系': 'text-blue-700',
  '乳製品': 'text-yellow-700',
  '飲み物': 'text-teal-700',
  '調味料': 'text-orange-700',
  '粉': 'text-purple-700',
  '加工食品': 'text-pink-700',
  '冷凍食品': 'text-indigo-700',
  '米': 'text-lime-700',
  '乾麺': 'text-amber-700',
  'パン': 'text-rose-700',
  'その他': 'text-gray-700',
}


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
  const [categoryFilter, setCategoryFilter] = useState('すべて')
  const [storageFilter, setStorageFilter] = useState('すべて')
  const router = useRouter()
  const [searchText, setSearchText] = useState('')

  

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

  const categoryColors: Record<string, string> = {
    '野菜': 'bg-green-100',
    '肉/加工品': 'bg-red-100',
    '海鮮系': 'bg-blue-100',
    '乳製品': 'bg-yellow-100',
    '飲み物': 'bg-teal-100',
    '調味料': 'bg-orange-100',
    '粉': 'bg-purple-100',
    '加工食品': 'bg-pink-100',
    '冷凍食品': 'bg-indigo-100',
    '米': 'bg-lime-100',
    '乾麺': 'bg-amber-100',
    'その他': 'bg-gray-100',
  }
  const categoryBorderColors: Record<string, string> = {
  '野菜': 'border-green-400',
  '肉/加工品': 'border-red-400',
  '海鮮系': 'border-blue-400',
  '乳製品': 'border-yellow-400',
  '飲み物': 'border-teal-400',
  '調味料': 'border-orange-400',
  '粉': 'border-purple-400',
  '加工食品': 'border-pink-400',
  '冷凍食品': 'border-indigo-400',
  '米': 'border-lime-400',
  '乾麺': 'border-amber-400',
  'パン': 'border-rose-400',
  'その他': 'border-gray-400',
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

  const categories = Array.from(new Set(items.map(i => i.category || '未設定')))
  const storageLocations = Array.from(new Set(items.map(i => i.storage_location || '未設定')))
  // 絞り込み条件に名前検索も追加
    const filteredItems = items.filter(item => {
      const matchStorage =
        storageFilter === 'すべて' ||
        (item.storage_location || '未設定') === storageFilter

      const matchCategory =
        categoryFilter === 'すべて' ||
        (item.category || '未設定') === categoryFilter

      const matchSearch =
        item.name.toLowerCase().includes(searchText.toLowerCase())

      return matchStorage && matchCategory && matchSearch
    })

  const groupedItems = filteredItems.reduce<Record<string, Item[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <main className="bg-lime-50 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
      <Suspense fallback={null}>
        <SearchParamsWrapper />
      </Suspense>
      <div className="flex flex-col gap-2 mb-4">
      {/* 1段目：タイトルと検索バーを横並び */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">冷蔵庫の中身</h1>

        <div>
          <label className="mr-2 text-gray-600">食材名検索:</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="例: トマト"
             className="border border-gray-300 bg-white px-3 py-2 rounded-md w-full sm:w-64 shadow-sm"
          />
        </div>
      </div>
    </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        {/* 左側：追加ボタン */}
        <Link
          href="/items/new"
          className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700"
        >
          ＋ 食材を追加する
        </Link>

        {/* 右側：フィルター群（横並び） */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="mr-2 text-gray-600">カテゴリー:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-green-50 border border-gray-300 px-3 py-2 rounded-md text-sm shadow-sm"
            >
              <option value="すべて">すべて</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mr-2 text-gray-600">保存場所:</label>
            <select
              value={storageFilter}
              onChange={(e) => setStorageFilter(e.target.value)}
              className="bg-blue-50 border border-gray-300 px-3 py-2 rounded-md text-sm shadow-sm"
            >
              <option value="すべて">すべて</option>
              {storageLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>


      {categoryOrder.map((category) => {
        const itemsInCategory = groupedItems[category]
        if (!itemsInCategory) return null

        return (
          <section key={category} className="mb-8">
            <h2 className={`text-xl font-semibold border-b pb-1 mb-3 ${categoryTextColors[category] ?? ''}`}>
              {category}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {itemsInCategory.map((item) => (
    <li
      key={item.id}
      className={`relative bg-white rounded-xl p-4 shadow-md space-y-2 border-2 ${categoryBorderColors[item.category] ?? 'border-gray-300'}`}
    >
      {/* 右上に3点メニューを配置 */}
      <div className="absolute top-2 right-2">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="p-2 rounded-full hover:bg-gray-100">
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={`/items/edit/${item.id}`}
                    className={`block px-4 py-2 text-sm ${
                      active ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    編集
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      active ? 'bg-red-100 text-red-700' : 'text-gray-700'
                    }`}
                  >
                    削除
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>

      <div className={`font-semibold text-lg ${categoryTextColors[item.category] ?? ''}`}>
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
    </li>
  ))}
</ul>

          </section>
        )
      })}
      </div>
    </main>
  )
}
