'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Message from '@/components/message'
import Fuse from 'fuse.js'
import FooterMenu from "@/components/FooterMenu";

export default function NewItemPage() {
  const router = useRouter()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [allNames, setAllNames] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    fetchFoods()
  }, [])

  const [fuse, setFuse] = useState<Fuse<string> | null>(null)

  const fetchFoods = async () => {
    const { data } = await supabase.from('foods').select('name')
    if (data) {
      const uniqueNames = [...new Set(data.map(item => item.name))]
      setAllNames(uniqueNames)

      const fuseInstance = new Fuse(uniqueNames, {
        includeScore: true,
        threshold: 0.4,
      })
      setFuse(fuseInstance)
    }
  }

  const [form, setForm] = useState({
    name: '',
    quantity: 1,
    unit: '',
    category: '',
    storage_location: '',
    expiry_date: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'name') {
      const filtered = allNames.filter(n => n.toLowerCase().includes(value.toLowerCase())).slice(0, 5)
      setSuggestions(filtered)
    }
  }

  const handleSelectSuggestion = (name: string) => {
    setForm(prev => ({ ...prev, name }))
    setSuggestions([])
  }

  const japaneseToNumber = (kanji: string): number => {
    const map: Record<string, number> = {
      '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
      '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
    }
    if (kanji === '十') return 10
    if (kanji.length === 2 && kanji[0] === '十') return 10 + map[kanji[1]]
    if (kanji.length === 2 && kanji[1] === '十') return map[kanji[0]] * 10
    return map[kanji] ?? 1
  }

  const categories = ['青果', '肉/加工品', '海鮮系', '乳製品', '飲み物', '調味料', '粉', '加工食品', '冷凍食品', '米', '乾麺', 'パン', 'その他']
  const units = ['個', 'g', 'kg', 'ml', 'L', '本', 'パック', '袋', '缶', '枚', '杯', '匹','その他']
  const storageOptions = ['冷蔵庫', '冷凍庫', '野菜室', '常温']
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!form.name.trim()) {
      setMessage({ type: 'error', text: '食材名を入力してください' })
      setLoading(false)
      return
    }
    if (!form.category) {
      setMessage({ type: 'error', text: 'カテゴリーを選択してください' })
      setLoading(false)
      return
    }
    if (form.quantity <= 0) {
      setMessage({ type: 'error', text: '数量は1以上にしてください' })
      setLoading(false)
      return
    }
    if (!form.unit) {
      setMessage({ type: 'error', text: '単位を選択してください' })
      setLoading(false)
      return
    }

    const { error } = await supabase.from('items').insert([form])

    if (error) {
      console.error(error)
      setMessage({ type: 'error', text: '登録に失敗しました' })
    } else {
      setMessage({ type: 'success', text: '登録が完了しました！' })

      const stay = window.confirm('登録が完了しました。続けて登録しますか？')
      if (stay) {
        setForm({
          name: '',
          quantity: 1,
          unit: '',
          category: '',
          storage_location: '',
          expiry_date: '',
        })
        setSuggestions([])
      } else {
        router.push('/fridge/items?success=added')
      }
    }
    setLoading(false)
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      {message && (
        <Message type={message.type} text={message.text} />
      )}
      <h1 className="text-2xl font-bold mb-4">食材の追加</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            name="name"
            type="text"
            placeholder="食材名"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow">
              {suggestions.map((sug, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(sug)}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {sug}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex space-x-2">
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-1/3 border p-2 rounded"
            placeholder="数量"
          />
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">単位を選択</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">カテゴリーを選択</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            name="storage_location"
            value={form.storage_location}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">保存場所を選択</option>
            {storageOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <input
          name="expiry_date"
          type="date"
          value={form.expiry_date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="賞味期限"
        />
        <div className="mt-6 pb-24 relative">
        {/* 登録ボタン（横幅いっぱい） */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? '登録中…' : '登録する'}
        </button>

        {/* 一覧に戻るボタン（左下固定・控えめ） */}
        <Link
          href="/fridge/items"
          className="absolute bottom-4 left-4 text-sm text-gray-400 hover:text-gray-600"
        >
          ← 一覧に戻る
        </Link>
      </div>

      </form>
      <FooterMenu />
    </main>
  )
}