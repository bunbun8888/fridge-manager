'use client'

import { useEffect, useState } from 'react'

type Props = {
  text: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export default function Message({ text, type = 'info' }: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
    
  }, [])

  const baseStyle =
    'p-3 rounded border mb-4 transition-opacity duration-500'

  const typeStyle = {
    success: 'bg-green-100 text-green-700 border-green-300',
    error: 'bg-red-100 text-red-700 border-red-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
  }[type]

  
  return (
    <div
      className={`${baseStyle} ${typeStyle} ${
        visible ? 'opacity-100' : 'opacity-0'
      } fixed top-4 right-4 w-64 z-50`}
    >
      <button
        onClick={() => setVisible(false)}
        className="ml-2 text-sm text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
      {text}
    </div>
  )
}
