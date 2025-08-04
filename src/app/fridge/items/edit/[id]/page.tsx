'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import FooterMenu from "@/components/FooterMenu";

const categoryOptions = ['青果', '肉/加工品', '海鮮系', '乳製品', '飲み物', '調味料', '粉', '加工食品', '冷凍食品', '米', '乾麺', 'パン', 'その他']
const unitOptions = ['個', 'g', 'kg', 'ml', 'L', '本', 'パック', '袋', '缶', '枚', '杯', '匹','その他']
const storageOptions = ['冷蔵庫', '冷凍庫', '野菜室', '常温']

export default function EditItemPage() {
  const { id } = useParams()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    quantity: 1,
    unit: '',
    category: '',
    storage_location: '',
    expiry_date: '',
  })

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error(error)
        alert('データの取得に失敗しました')
      } else if (data) {
        setForm({
          name: data.name,
          quantity: data.quantity,
          unit: data.unit,
          category: data.category,
          storage_location: data.storage_location,
          expiry_date: data.expiry_date?.slice(0, 10) || '',
        })
      }
    }

    fetchItem()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase
      .from('items')
      .update({
        name: form.name,
        quantity: Number(form.quantity),
        unit: form.unit,
        category: form.category,
        storage_location: form.storage_location,
        expiry_date: form.expiry_date,
      })
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('更新に失敗しました')
    } else {
      router.push('/fridge/items?success=true')
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">食材の編集</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="食材名"
          required
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-4">
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="数量"
            min={1}
            required
            className="w-1/2 border p-2 rounded"
          />

          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            required
            className="w-1/2 border p-2 rounded"
          >
            <option value="">単位を選択</option>
            {unitOptions.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">カテゴリーを選択</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
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
          {storageOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <input
          type="date"
          name="expiry_date"
          value={form.expiry_date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="relative pb-24 mt-6">
        {/* 更新ボタン（横幅いっぱい） */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          更新する
        </button>

        {/* キャンセルボタン（左下固定・控えめ） */}
        <button
          type="button"
          onClick={() => router.push('/fridge/items?success=false')}
          className="absolute bottom-4 left-4 text-sm text-gray-400 hover:text-gray-600"
        >
          ← キャンセル
        </button>
      </div>

      </form>
      <FooterMenu />
    </main>
  )
}
