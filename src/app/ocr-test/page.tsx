'use client'

import React, { useState } from 'react'
import parseItemsFromText from '@/lib/parseItemsFromText';
import { recognizeText } from '@/lib/recognizeText';
import { getKnownFoods } from '@/lib/supabase'; 

export default function OCRTestPage() {
  const [image, setImage] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const [items, setItems] = useState<
    { name: string; quantity: number; unit: string }[]
    >([])

  const handleRunOCR = async () => {
        if (!image) return;
        setLoading(true);
        const extractedText = await recognizeText(image);
        const knownFoods = await getKnownFoods(); // これで食品名一覧が取得できる想定
        setText(extractedText);
        const parsed = await parseItemsFromText(extractedText, knownFoods);
        console.log('パース結果:', parsed);
        setItems(parsed);
        setLoading(false);
      };


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">OCRテスト</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      {image && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">画像プレビュー:</p>
          <img
            src={URL.createObjectURL(image)}
            alt={image?.name || 'アップロード画像のプレビュー'}
            className="max-w-sm rounded shadow border border-gray-300 my-4"
          />
          <p className="text-sm text-gray-500">ファイル名: {image?.name}</p>
                  </div>
                )}
      <button
        onClick={handleRunOCR}
        disabled={!image || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? '読み取り中...' : 'OCR実行'}
      </button>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">認識結果:</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{text}</pre>
        {items.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">抽出された品目:</h2>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="border p-2 rounded bg-white shadow-sm">
                  {item.name} / {item.quantity} {item.unit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
